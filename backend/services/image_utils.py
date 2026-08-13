from __future__ import annotations

from pathlib import Path

import cv2
import numpy as np
from PIL import Image

CLASS_NAMES = ["glioma", "meningioma", "notumor", "pituitary"]
TARGET_SIZE = (224, 224)


def load_rgb_image(image_path: str | Path):
    image = Image.open(image_path).convert("RGB")
    image = image.resize(TARGET_SIZE)
    array = np.asarray(image, dtype=np.float32)
    return array


def preprocess_image(image_path: str | Path):
    image = load_rgb_image(image_path)
    image = image.astype(np.float32)
    image = np.expand_dims(image, axis=0)
    return image


def save_image_from_array(array: np.ndarray, destination: str | Path):
    image = Image.fromarray(np.uint8(array))
    destination = Path(destination)
    destination.parent.mkdir(parents=True, exist_ok=True)
    image.save(destination)
