# Test script for FastAPI Inference Server
# AetherFlow Sickle Cell Crisis Prediction API

import requests
import json
from datetime import datetime

# API base URL
BASE_URL = "http://localhost:8000"

def test_health_check():
    """Test the health check endpoint."""
    print("Testing health check endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.status_code == 200

def test_model_info():
    """Test the model info endpoint."""
    print("\nTesting model info endpoint...")
    response = requests.get(f"{BASE_URL}/model-info")
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print(f"Model Info: {json.dumps(response.json(), indent=2)}")
    return response.status_code == 200

def test_prediction():
    """Test the prediction endpoint with sample data."""
    print("\nTesting prediction endpoint...")
    
    # Sample patient data for testing
    test_patient = {
        "age": 25,
        "sex": "Female",
        "genotype": "HbSS",
        "pain_level": 8,
        "hbf_percent": 3.5,
        "wbc_count": 12.5,
        "ldh": 350,
        "crp": 15.2,
        "fatigue": 1,
        "fever": 1,
        "joint_pain": 1,
        "dactylitis": 0,
        "shortness_of_breath": 1,
        "prior_crises": 3,
        "history_of_acs": 1,
        "coexisting_asthma": 0,
        "hydroxyurea": 1,
        "pain_med": 1,
        "medication_adherence": 0.8,
        "hydration_level": "Low",
        "sleep_quality": 3,
        "reported_stress_level": 8,
        "temperature": 30,
        "humidity": 75
    }
    
    response = requests.post(
        f"{BASE_URL}/predict",
        json=test_patient,
        headers={"Content-Type": "application/json"}
    )
    
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print(f"Crisis Probability: {result['crisis_probability']:.4f}")
        print(f"Risk Level: {result['risk_level']}")
        print(f"Confidence: {result['confidence']}")
        print(f"Top Risk Factors:")
        for factor in result['top_risk_factors']:
            print(f"  - {factor['factor']}: {factor['contribution']:.4f}")
        print(f"Recommendations:")
        for rec in result['recommendations']:
            print(f"  - {rec}")
    else:
        print(f"Error: {response.text}")
    
    return response.status_code == 200

def test_low_risk_patient():
    """Test with a low-risk patient profile."""
    print("\nTesting low-risk patient...")
    
    low_risk_patient = {
        "age": 20,
        "sex": "Male",
        "genotype": "HbSC",
        "pain_level": 2,
        "hbf_percent": 8.5,
        "wbc_count": 7.2,
        "ldh": 200,
        "crp": 2.1,
        "fatigue": 0,
        "fever": 0,
        "joint_pain": 0,
        "dactylitis": 0,
        "shortness_of_breath": 0,
        "prior_crises": 0,
        "history_of_acs": 0,
        "coexisting_asthma": 0,
        "hydroxyurea": 1,
        "pain_med": 0,
        "medication_adherence": 0.95,
        "hydration_level": "High",
        "sleep_quality": 5,
        "reported_stress_level": 2,
        "temperature": 22,
        "humidity": 45
    }
    
    response = requests.post(
        f"{BASE_URL}/predict",
        json=low_risk_patient,
        headers={"Content-Type": "application/json"}
    )
    
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print(f"Crisis Probability: {result['crisis_probability']:.4f}")
        print(f"Risk Level: {result['risk_level']}")
    
    return response.status_code == 200

def main():
    """Run all tests."""
    print("=== AetherFlow API Testing Suite ===")
    print(f"Testing API at: {BASE_URL}")
    print(f"Test time: {datetime.now()}")
    
    tests = [
        ("Health Check", test_health_check),
        ("Model Info", test_model_info),
        ("High Risk Prediction", test_prediction),
        ("Low Risk Prediction", test_low_risk_patient)
    ]
    
    results = []
    for test_name, test_func in tests:
        try:
            success = test_func()
            results.append((test_name, success))
        except requests.exceptions.ConnectionError:
            print(f"\n❌ Connection Error: Could not connect to {BASE_URL}")
            print("Make sure the API server is running with: python inference_api.py")
            return
        except Exception as e:
            print(f"\n❌ {test_name} failed with error: {str(e)}")
            results.append((test_name, False))
    
    print("\n=== Test Results ===")
    for test_name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
    
    passed = sum(1 for _, success in results if success)
    total = len(results)
    print(f"\nOverall: {passed}/{total} tests passed")

if __name__ == "__main__":
    main()
