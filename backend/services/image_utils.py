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
    image = image.astype(np.float32) / 255.0
    image = np.expand_dims(image, axis=0)
    return image



def validate_mri_image(image_path: str | Path) -> tuple[bool, str]:
    try:
        image = Image.open(image_path)
        image.verify()

        image = Image.open(image_path).convert("RGB")
        w, h = image.size
        if w < 50 or h < 50:
            return False, "Image resolution is too low. Please upload a clear brain MRI scan image."

        arr = np.asarray(image, dtype=np.float32)
        r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
        color_diff = float(np.mean(np.abs(r - g) + np.abs(g - b) + np.abs(b - r)))
        if color_diff > 35.0:
            return False, "The uploaded image contains non-grayscale full colors (photo or UI element). Please upload a valid brain MRI scan."

        return True, "Valid Brain MRI scan."
    except Exception as exc:
        return False, f"Unable to process image file: {str(exc)}"



