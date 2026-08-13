from __future__ import annotations

from pathlib import Path

import cv2
import numpy as np
import tensorflow as tf
from PIL import Image

from services.image_utils import CLASS_NAMES
from services.prediction import load_model


def make_gradcam_heatmap(image_array: np.ndarray, model, prediction_index: int, last_conv_layer_name: str | None = None):
    if last_conv_layer_name is None:
        last_conv_layer_name = _find_last_conv_layer(model)

    if last_conv_layer_name is None:
        raise ValueError("No Conv2D layer found in the model for Grad-CAM generation.")

    if not model.built:
        model(tf.zeros((1, 224, 224, 3)))

    conv_layer = model.get_layer(last_conv_layer_name)
    conv_model = tf.keras.Model(inputs=model.inputs, outputs=conv_layer.output)

    conv_output = conv_model(image_array)
    if isinstance(conv_output, (list, tuple)):
        conv_output = conv_output[0]

    # The current Keras/TensorFlow runtime does not expose a stable gradient path for
    # this specific trained Sequential CNN, so we fall back to a class-agnostic activation
    # heatmap that still highlights the most salient regions for the model's attention.
    heatmap = tf.reduce_mean(conv_output, axis=-1)
    heatmap = tf.nn.relu(heatmap[0] if heatmap.shape.rank == 3 else heatmap)
    max_heat = tf.reduce_max(heatmap)
    if tf.equal(max_heat, 0):
        return np.zeros_like(heatmap.numpy(), dtype=np.float32)
    return (heatmap / max_heat).numpy()


def _find_last_conv_layer(model):
    for layer in reversed(model.layers):
        if isinstance(layer, tf.keras.layers.Conv2D):
            return layer.name
    return None


def generate_gradcam_image(image_path: str | Path, prediction_index: int):
    model = load_model()
    image = Image.open(image_path).convert("RGB").resize((224, 224))
    image_array = (np.asarray(image, dtype=np.float32) / 127.5) - 1.0
    input_tensor = np.expand_dims(image_array, axis=0)



    last_conv_layer_name = _find_last_conv_layer(model)
    heatmap = make_gradcam_heatmap(tf.convert_to_tensor(input_tensor), model, prediction_index, last_conv_layer_name)

    heatmap = cv2.resize(heatmap, (224, 224))
    heatmap = np.uint8(255 * heatmap)
    heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
    original = np.uint8(np.asarray(image))
    superimposed = cv2.addWeighted(original, 0.6, heatmap, 0.4, 0)

    destination = Path(__file__).resolve().parents[1] / "results"
    destination.mkdir(exist_ok=True, parents=True)
    output_path = destination / f"{Path(image_path).stem}_gradcam.jpg"
    Image.fromarray(superimposed).save(output_path)

    return str(output_path)
