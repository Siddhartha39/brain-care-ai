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

        # 1. Grayscale Color Variance Check (Brain MRI scans are grayscale: R ≈ G ≈ B)
        r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
        color_diff = float(np.mean(np.abs(r - g) + np.abs(g - b) + np.abs(b - r)))
        if color_diff > 12.0:
            return False, "Non-MRI image detected: The uploaded file contains non-grayscale colors (UI screenshot / document / photo). Please upload a clear brain MRI scan."

        # 2. Border Darkness Test (Brain MRI scans have dark background space at edges)
        border_pixels = np.concatenate([
            arr[:10, :, :], arr[-10:, :, :], arr[:, :10, :], arr[:, -10:, :]
        ], axis=None)
        border_mean = float(np.mean(border_pixels))
        if border_mean > 130.0:
            return False, "Non-MRI image detected: The uploaded image has a light document background. Please upload a clear brain MRI scan."

        # 3. High White Pixel Ratio Test (Text document screenshots have large bright areas)
        white_ratio = float(np.mean(np.mean(arr, axis=2) > 200))
        if white_ratio > 0.35:
            return False, "Non-MRI image detected: The uploaded file appears to be a text document or table screenshot. Please upload a clear brain MRI scan."

        # 4. Anatomical Contour & Texture Test (Text screenshots have high edge variance > 2200 and lack central brain contour)
        img_gray = cv2.imread(str(image_path), cv2.IMREAD_GRAYSCALE)
        if img_gray is not None:
            laplacian_var = float(cv2.Laplacian(img_gray, cv2.CV_64F).var())
            _, thresh = cv2.threshold(img_gray, 25, 255, cv2.THRESH_BINARY)
            contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

            max_area = 0.0
            h, w = img_gray.shape
            total_area = float(h * w)
            for c in contours:
                area = cv2.contourArea(c)
                if area > max_area:
                    max_area = float(area)

            area_ratio = max_area / total_area

            # If edge variance is huge (text characters) OR no central brain skull contour exists (< 12% total area)
            if area_ratio < 0.12 or laplacian_var > 2200.0:
                return False, "Non-MRI image detected: The uploaded image appears to be a text screenshot or non-medical document. Please upload a valid brain MRI scan."

        return True, "Valid Brain MRI scan."
    except Exception as exc:
        return False, f"Unable to process image file: {str(exc)}"


