// AetherFlow AI Model Integration
// Connects frontend with the FastAPI AI prediction service

const AI_API_BASE = 'http://localhost:8000';

class AetherFlowAI {
    constructor() {
        this.isModelLoaded = false;
        this.checkModelStatus();
    }

    async checkModelStatus() {
        try {
            const response = await fetch(`${AI_API_BASE}/health`);
            const data = await response.json();
            this.isModelLoaded = data.model_loaded;
            console.log('AI Model Status:', this.isModelLoaded ? 'Ready' : 'Not Available');
        } catch (error) {
            console.warn('AI Model API not available:', error.message);
            this.isModelLoaded = false;
        }
    }

    async predictCrisisRisk(patientData) {
        if (!this.isModelLoaded) {
            throw new Error('AI Model is not available. Please ensure the AI service is running.');
        }

        try {
            const response = await fetch(`${AI_API_BASE}/predict`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(patientData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Prediction error:', error);
            throw error;
        }
    }

    async getModelInfo() {
        try {
            const response = await fetch(`${AI_API_BASE}/model-info`);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.warn('Could not fetch model info:', error);
        }
        return null;
    }

    formatPatientDataForAPI(formData) {
        // Convert form data to the format expected by the AI API
        return {
            age: parseInt(formData.get('age')) || 25,
            sex: formData.get('sex') || 'Female',
            genotype: formData.get('genotype') || 'HbSS',
            pain_level: parseInt(formData.get('painLevel')) || 0,
            hbf_percent: parseFloat(formData.get('hbf_percent')) || 5.0,
            wbc_count: parseFloat(formData.get('wbc_count')) || 8.5,
            ldh: parseFloat(formData.get('ldh')) || 250,
            crp: parseFloat(formData.get('crp')) || 3.0,
            fatigue: parseInt(formData.get('fatigue')) || 0,
            fever: parseInt(formData.get('fever')) || 0,
            joint_pain: parseInt(formData.get('jointPain')) || 0,
            dactylitis: parseInt(formData.get('dactylitis')) || 0,
            shortness_of_breath: parseInt(formData.get('shortness_of_breath')) || 0,
            prior_crises: parseInt(formData.get('priorCrises')) || 0,
            history_of_acs: parseInt(formData.get('history_of_acs')) || 0,
            coexisting_asthma: parseInt(formData.get('coexisting_asthma')) || 0,
            hydroxyurea: parseInt(formData.get('hydroxyurea')) || 0,
            pain_med: parseInt(formData.get('pain_med')) || 0,
            medication_adherence: parseFloat(formData.get('medication_adherence')) || 0.8,
            hydration_level: formData.get('hydrationLevel') || 'Medium',
            sleep_quality: parseInt(formData.get('sleep_quality')) || 4,
            reported_stress_level: parseInt(formData.get('reported_stress_level')) || 5,
            temperature: parseFloat(formData.get('temperature')) || 25,
            humidity: parseFloat(formData.get('humidity')) || 50
        };
    }

    formatResultsForDisplay(prediction) {
        const probability = (prediction.crisis_probability * 100).toFixed(1);
        const riskLevel = prediction.risk_level;
        
        // Create formatted results object
        return {
            riskLevel: riskLevel,
            probability: `${probability}%`,
            confidence: prediction.confidence,
            riskFactors: prediction.top_risk_factors,
            recommendations: prediction.recommendations,
            modelVersion: prediction.model_version,
            timestamp: new Date(prediction.prediction_timestamp).toLocaleString(),
            rawProbability: prediction.crisis_probability
        };
    }

    getRiskLevelClass(riskLevel) {
        switch (riskLevel.toLowerCase()) {
            case 'high': return 'risk-high';
            case 'medium': return 'risk-medium';
            case 'low': return 'risk-low';
            default: return 'risk-unknown';
        }
    }

    getUrgencyMessage(riskLevel, probability) {
        // Check if we're in healthcare mode
        const currentMode = localStorage.getItem('aetherflow_mode');
        const isHealthcareMode = currentMode === 'healthcare' || currentMode === 'multi';
        
        if (riskLevel === 'High' || probability > 0.7) {
            if (isHealthcareMode) {
                return {
                    level: 'urgent',
                    message: '🚨 High crisis risk detected. Immediate clinical intervention recommended.',
                    actions: [
                        'Consider immediate clinical evaluation',
                        'Initiate crisis management protocol',
                        'Assess need for emergency department referral',
                        'Implement IV hydration therapy',
                        'Administer appropriate pain management'
                    ]
                };
            } else {
                return {
                    level: 'urgent',
                    message: '🚨 High crisis risk detected. Seek immediate medical attention.',
                    actions: [
                        'Contact your healthcare provider immediately',
                        'Consider going to the emergency room',
                        'Ensure adequate hydration',
                        'Take prescribed pain medications as directed'
                    ]
                };
            }
        } else if (riskLevel === 'Medium' || probability > 0.3) {
            if (isHealthcareMode) {
                return {
                    level: 'moderate',
                    message: '⚠️ Moderate crisis risk. Enhanced monitoring and preventive measures recommended.',
                    actions: [
                        'Schedule follow-up within 24-48 hours',
                        'Implement preventive hydration protocol',
                        'Review medication adherence',
                        'Consider prophylactic pain management',
                        'Educate patient on warning signs'
                    ]
                };
            } else {
                return {
                    level: 'moderate',
                    message: '⚠️ Moderate crisis risk. Monitor symptoms closely.',
                    actions: [
                        'Contact your healthcare provider for guidance',
                        'Increase fluid intake',
                        'Rest and avoid strenuous activities',
                        'Monitor pain levels closely'
                    ]
                };
            }
        } else {
            if (isHealthcareMode) {
                return {
                    level: 'low',
                    message: '✅ Low crisis risk. Continue standard care protocol.',
                    actions: [
                        'Maintain routine follow-up schedule',
                        'Continue current medication regimen',
                        'Reinforce hydration and lifestyle counseling',
                        'Schedule next assessment as per protocol'
                    ]
                };
            } else {
                return {
                    level: 'low',
                    message: '✅ Low crisis risk. Continue routine care.',
                    actions: [
                        'Maintain medication adherence',
                        'Stay well-hydrated',
                        'Continue regular monitoring',
                        'Contact provider if symptoms worsen'
                    ]
                };
            }
        }
    }
}

// Initialize AI service
const aetherFlowAI = new AetherFlowAI();

// Make it available globally for other modules
window.aetherFlowAI = aetherFlowAI;

// Enhanced symptom form handling with AI integration
function initializeSymptomFormWithAI() {
    const form = document.getElementById('symptomForm');
    if (!form) return;

    // Update slider displays
    const painSlider = document.getElementById('painLevel');
    const painValue = document.getElementById('painValue');
    const stressSlider = document.getElementById('stressLevel');
    const stressValue = document.getElementById('stressValue');

    if (painSlider && painValue) {
        painSlider.addEventListener('input', function() {
            painValue.textContent = this.value;
        });
    }

    if (stressSlider && stressValue) {
        stressSlider.addEventListener('input', function() {
            stressValue.textContent = this.value;
        });
    }

    // Handle form submission with AI prediction
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        await handleAIAssessment(new FormData(form));
    });
}

async function handleAIAssessment(formData) {
    const submitButton = document.querySelector('.btn-primary');
    const originalText = submitButton.textContent;
    
    try {
        // Show loading state
        submitButton.disabled = true;
        submitButton.textContent = 'Analyzing...';
        
        // Check if AI model is available
        if (!aetherFlowAI.isModelLoaded) {
            await aetherFlowAI.checkModelStatus();
            if (!aetherFlowAI.isModelLoaded) {
                throw new Error('AI prediction service is not available. Using basic assessment.');
            }
        }

        // Format data for AI API
        const patientData = aetherFlowAI.formatPatientDataForAPI(formData);
        console.log('Sending patient data to AI:', patientData);

        // Get AI prediction
        const prediction = await aetherFlowAI.predictCrisisRisk(patientData);
        console.log('AI Prediction received:', prediction);

        // Format results
        const results = aetherFlowAI.formatResultsForDisplay(prediction);
        const urgency = aetherFlowAI.getUrgencyMessage(results.riskLevel, results.rawProbability);

        // Store results and redirect
        const analysisData = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            formData: Object.fromEntries(formData),
            aiPrediction: prediction,
            results: results,
            urgency: urgency,
            type: 'ai_assessment'
        };

        // Store in localStorage
        const existingAnalyses = JSON.parse(localStorage.getItem('aetherflow_analyses')) || [];
        existingAnalyses.push(analysisData);
        localStorage.setItem('aetherflow_analyses', JSON.stringify(existingAnalyses));
        localStorage.setItem('aetherflow_latest_analysis', JSON.stringify(analysisData));

        // Redirect to results page
        window.location.href = 'result.html';

    } catch (error) {
        console.error('Assessment error:', error);
        
        // Fallback to basic assessment if AI fails
        await handleBasicAssessment(formData, error.message);
        
    } finally {
        // Reset button
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }
}

async function handleBasicAssessment(formData, errorMessage) {
    // Basic rule-based assessment as fallback
    const painLevel = parseInt(formData.get('painLevel')) || 0;
    const priorCrises = parseInt(formData.get('priorCrises')) || 0;
    const fatigue = formData.get('fatigue') === '1';
    const fever = formData.get('fever') === '1';
    const jointPain = formData.get('jointPain') === '1';
    const hydration = formData.get('hydrationLevel');

    let riskScore = 0;
    let riskLevel = 'Low';
    let recommendations = [];

    // Check if we're in healthcare mode
    const currentMode = localStorage.getItem('aetherflow_mode');
    const isHealthcareMode = currentMode === 'healthcare' || currentMode === 'multi';

    // Basic risk calculation
    riskScore += painLevel * 10; // Pain is major factor
    riskScore += priorCrises * 15; // History matters
    if (fatigue) riskScore += 10;
    if (fever) riskScore += 15;
    if (jointPain) riskScore += 10;
    if (hydration === 'Low') riskScore += 20;

    if (riskScore > 60) {
        riskLevel = 'High';
        if (isHealthcareMode) {
            recommendations = [
                'Consider immediate clinical evaluation',
                'Initiate crisis management protocol',
                'Assess need for emergency department referral',
                'Implement IV hydration therapy'
            ];
        } else {
            recommendations = [
                'Seek immediate medical attention',
                'Contact your healthcare provider',
                'Ensure adequate hydration',
                'Monitor symptoms closely'
            ];
        }
    } else if (riskScore > 30) {
        riskLevel = 'Medium';
        if (isHealthcareMode) {
            recommendations = [
                'Schedule follow-up within 24-48 hours',
                'Implement preventive hydration protocol',
                'Review medication adherence',
                'Consider prophylactic pain management'
            ];
        } else {
            recommendations = [
                'Contact your healthcare provider for guidance',
                'Monitor symptoms closely',
                'Increase fluid intake',
                'Rest and avoid strenuous activities'
            ];
        }
    } else {
        riskLevel = 'Low';
        if (isHealthcareMode) {
            recommendations = [
                'Maintain routine follow-up schedule',
                'Continue current medication regimen',
                'Reinforce hydration and lifestyle counseling',
                'Schedule next assessment as per protocol'
            ];
        } else {
            recommendations = [
                'Continue routine care',
                'Maintain medication adherence',
                'Stay well-hydrated',
                'Monitor for symptom changes'
            ];
        }
    }

    const probability = Math.min(riskScore / 100, 0.95);
    const urgency = aetherFlowAI.getUrgencyMessage(riskLevel, probability);

    const analysisData = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        formData: Object.fromEntries(formData),
        results: {
            riskLevel: riskLevel,
            probability: `${(probability * 100).toFixed(1)}%`,
            confidence: 'Basic Assessment',
            recommendations: recommendations,
            modelVersion: 'Fallback Rules',
            timestamp: new Date().toLocaleString(),
            rawProbability: probability
        },
        urgency: urgency,
        type: 'basic_assessment',
        note: `AI service unavailable: ${errorMessage}`
    };

    // Store and redirect
    const existingAnalyses = JSON.parse(localStorage.getItem('aetherflow_analyses')) || [];
    existingAnalyses.push(analysisData);
    localStorage.setItem('aetherflow_analyses', JSON.stringify(existingAnalyses));
    localStorage.setItem('aetherflow_latest_analysis', JSON.stringify(analysisData));

    window.location.href = 'result.html';
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('symptomForm')) {
        initializeSymptomFormWithAI();
    }
});
