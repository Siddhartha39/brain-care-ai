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


def validate_mri_image(image_path: str | Path) -> tuple[bool, str]:
    try:
        image = Image.open(image_path).convert("RGB")
        arr = np.asarray(image, dtype=np.float32)

        # 1. Grayscale Color Variance Check (MRI scans are grayscale)
        r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
        color_diff = float(np.mean(np.abs(r - g) + np.abs(g - b) + np.abs(b - r)))
        if color_diff > 12.0:
            return False, "The uploaded image contains non-grayscale colors (UI screenshot / document / photo). Please upload a valid Brain MRI scan."

        # 2. Border Darkness Test (Brain MRI scans have dark background space at edges)
        border_pixels = np.concatenate([
            arr[:10, :, :], arr[-10:, :, :], arr[:, :10, :], arr[:, -10:, :]
        ], axis=None)
        border_mean = float(np.mean(border_pixels))
        if border_mean > 130.0:
            return False, "The uploaded image has a light/white background, which is characteristic of text documents or screenshots rather than an MRI scan."

        # 3. High White Pixel Ratio Test (Text screenshots / web pages have large bright areas)
        white_ratio = float(np.mean(np.mean(arr, axis=2) > 200))
        if white_ratio > 0.40:
            return False, "The uploaded file appears to be a text document or table screenshot. Please upload a valid brain MRI scan."

        return True, "Valid Brain MRI scan."
    except Exception as exc:
        return False, f"Unable to process image file: {str(exc)}"

