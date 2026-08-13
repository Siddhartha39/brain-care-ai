from services.firebase_service import build_scan_payload, extract_bearer_token


def test_extract_bearer_token_parses_valid_header():
    assert extract_bearer_token("Bearer abc123") == "abc123"
    assert extract_bearer_token("bearer xyz") == "xyz"


def test_build_scan_payload_includes_required_fields():
    data = build_scan_payload(
        prediction="glioma",
        confidence=0.97,
        probabilities={"glioma": 0.97, "meningioma": 0.03},
        original_image="/uploads/sample.png",
        gradcam_image="/results/sample_gradcam.jpg",
        explanation="Educational explanation",
        educational_info="More info",
    )

    assert data["prediction"] == "glioma"
    assert data["confidence"] == 0.97
    assert data["original_image"] == "/uploads/sample.png"
    assert "createdAt" in data
    assert data["status"] == "completed"
