from __future__ import annotations

from pathlib import Path

import numpy as np
import tensorflow as tf

from services.image_utils import CLASS_NAMES, preprocess_image

MODEL_PATH = Path(__file__).resolve().parents[1] / "model" / "brain_tumor_model.keras"

MODEL = None


def load_model():
    global MODEL
    if MODEL is None:
        MODEL = tf.keras.models.load_model(str(MODEL_PATH))
    return MODEL


def predict_image(image_path: str | Path):
    model = load_model()
    image = preprocess_image(image_path)
    logits = model.predict(image, verbose=0)
    probabilities = np.asarray(logits[0], dtype=np.float32)
    prediction_index = int(np.argmax(probabilities))
    prediction = CLASS_NAMES[prediction_index]
    confidence = float(probabilities[prediction_index])
    class_probabilities = {
        class_name: float(probabilities[idx]) for idx, class_name in enumerate(CLASS_NAMES)
    }
    return {
        "prediction": prediction,
        "confidence": confidence,
        "probabilities": class_probabilities,
        "prediction_index": prediction_index,
    }
