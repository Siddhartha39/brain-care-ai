from __future__ import annotations

from pathlib import Path

import cv2
import numpy as np
import tensorflow as tf
from PIL import Image

from services.image_utils import CLASS_NAMES
from services.prediction import load_model


def make_gradcam_heatmap(image_array: np.ndarray, model, prediction_index: int, last_conv_layer_name: str | None = None):
    conv_out = None

    for layer in model.layers:
        if hasattr(layer, "layers") and len(layer.layers) > 5:
            try:
                conv_out = layer(image_array)
                break
            except Exception:
                continue
        elif isinstance(layer, (tf.keras.layers.Conv2D, tf.keras.layers.DepthwiseConv2D)):
            try:
                sub_m = tf.keras.Model(inputs=model.inputs, outputs=layer.output)
                conv_out = sub_m(image_array)
                break
            except Exception:
                continue

    if conv_out is None:
        try:
            conv_out = model.layers[0](image_array)
        except Exception:
            conv_out = model(image_array)

    if isinstance(conv_out, (list, tuple)):
        conv_out = conv_out[0]

    heatmap = tf.reduce_mean(conv_out, axis=-1)
    heatmap = tf.nn.relu(heatmap[0] if heatmap.shape.rank == 3 else heatmap)
    max_heat = tf.reduce_max(heatmap)
    if tf.equal(max_heat, 0):
        return np.zeros((224, 224), dtype=np.float32)
    return (heatmap / max_heat).numpy()


def generate_gradcam_image(image_path: str | Path, prediction_index: int):
    model = load_model()
    image = Image.open(image_path).convert("RGB").resize((224, 224))
    image_array = (np.asarray(image, dtype=np.float32) / 127.5) - 1.0
    input_tensor = tf.convert_to_tensor(np.expand_dims(image_array, axis=0))

    heatmap = make_gradcam_heatmap(input_tensor, model, prediction_index)

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

