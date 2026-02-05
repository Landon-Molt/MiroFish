import pytest
import sys
import os

# Add app to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app

@pytest.fixture
def app():
    # Set testing config
    class TestConfig:
        TESTING = True
        DEBUG = True
        LLM_API_KEY = "test_key"  # Mock key for validation
        ZEP_API_KEY = "test_key"  # Mock key for validation
        JSON_AS_ASCII = False
        
    app = create_app(TestConfig)
    return app

@pytest.fixture
def client(app):
    return app.test_client()

def test_health_check(client):
    """Test that the health endpoint returns 200 and correct status."""
    response = client.get('/health')
    assert response.status_code == 200
    json_data = response.get_json()
    assert json_data['status'] == 'ok'
    assert json_data['service'] == 'MiroFish Backend'
