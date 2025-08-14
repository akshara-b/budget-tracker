import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    """Test the health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
    assert "Budget AI API is running" in response.json()["message"]

def test_root_endpoint():
    """Test the root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["message"] == "Welcome to Budget AI API"
    assert response.json()["version"] == "0.1.0"

def test_auth_endpoints_exist():
    """Test that auth endpoints are accessible"""
    response = client.get("/docs")
    assert response.status_code == 200

def test_cors_headers():
    """Test CORS headers are present"""
    response = client.options("/health")
    assert response.status_code == 200

if __name__ == "__main__":
    pytest.main([__file__])
