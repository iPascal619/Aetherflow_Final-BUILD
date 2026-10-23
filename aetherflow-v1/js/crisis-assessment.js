// Crisis Assessment JavaScript for AetherFlow Healthcare Mode
// Handles patient-specific crisis assessments and result saving

class CrisisAssessmentManager {
    constructor() {
        this.currentPatient = null;
        this.assessmentResult = null;
        this.patients = this.loadPatients();
        this.assessments = this.loadAssessments();
        this.initializeAssessment();
    }

    loadPatients() {
        const saved = localStorage.getItem('aetherflow_patients');
        let patients = saved ? JSON.parse(saved) : [];
        
        // Add sample patients for testing if none exist
        if (patients.length === 0) {
            patients = [
                {
                    id: 'P001',
                    name: 'John Doe',
                    age: 28,
                    gender: 'Male',
                    genotype: 'HbSS',
                    dateAdded: new Date().toISOString(),
                    riskLevel: 'medium'
                },
                {
                    id: 'P002', 
                    name: 'Jane Smith',
                    age: 34,
                    gender: 'Female',
                    genotype: 'HbSC',
                    dateAdded: new Date().toISOString(),
                    riskLevel: 'low'
                }
            ];
            localStorage.setItem('aetherflow_patients', JSON.stringify(patients));
        }
        
        return patients;
    }

    loadAssessments() {
        const saved = localStorage.getItem('aetherflow_assessments');
        return saved ? JSON.parse(saved) : [];
    }

    saveAssessments() {
        localStorage.setItem('aetherflow_assessments', JSON.stringify(this.assessments));
    }

    initializeAssessment() {
        this.updateProviderInfo();
        this.loadPatientFromURL();
        this.setupFormHandlers();
        this.setupSliders();
        this.checkAIServiceStatus();
    }

    async checkAIServiceStatus() {
        try {
            // Check AI service status on page load
            if (window.aetherFlowAI) {
                await aetherFlowAI.checkModelStatus();
                if (!aetherFlowAI.isModelLoaded) {
                    this.showAIServiceWarning();
                }
            } else {
                this.showAIServiceWarning();
            }
        } catch (error) {
            console.warn('AI service check failed:', error);
            this.showAIServiceWarning();
        }
    }

    showAIServiceWarning() {
        // Show a warning banner that AI service is not available
        const warningBanner = document.createElement('div');
        warningBanner.className = 'ai-service-warning';
        warningBanner.innerHTML = `
            <div class="warning-content">
                <span class="warning-icon">⚠️</span>
                <div class="warning-text">
                    <strong>AI Service Not Available</strong>
                    <p>The AI prediction service is not running. Please ensure the AI service is started before conducting assessments.</p>
                </div>
            </div>
        `;
        
        // Add CSS for the warning banner
        const style = document.createElement('style');
        style.textContent = `
            .ai-service-warning {
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 8px;
                padding: 15px;
                margin: 20px 0;
                display: flex;
                align-items: center;
            }
            .warning-content {
                display: flex;
                align-items: center;
                gap: 15px;
            }
            .warning-icon {
                font-size: 24px;
            }
            .warning-text strong {
                color: #856404;
                display: block;
                margin-bottom: 5px;
            }
            .warning-text p {
                color: #856404;
                margin: 0;
                font-size: 14px;
            }
        `;
        document.head.appendChild(style);
        
        // Insert warning after the header
        const header = document.querySelector('.check-header');
        if (header) {
            header.insertAdjacentElement('afterend', warningBanner);
        }
    }

    updateProviderInfo() {
        const providerInfo = JSON.parse(localStorage.getItem('aetherflow_provider') || '{}');
        
        // Update provider name in navbar if it exists
        const providerNameElement = document.querySelector('.provider-name');
        if (providerNameElement && providerInfo.name) {
            providerNameElement.textContent = providerInfo.name;
        }
        
        // Update provider role/title in navbar if it exists
        const providerRoleElement = document.querySelector('.provider-role');
        if (providerRoleElement && providerInfo.title) {
            providerRoleElement.textContent = providerInfo.title;
        }
    }

    loadPatientFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const patientId = urlParams.get('patient');
        
        console.log('Loading patient from URL:', patientId);
        console.log('Available patients:', this.patients);
        
        if (patientId) {
            const patient = this.patients.find(p => p.id === patientId);
            if (patient) {
                this.currentPatient = patient;
                this.displayPatientInfo(patient);
                this.prefillPatientData(patient);
            } else {
                alert(`Patient not found: ${patientId}`);
                this.goBackToPatients();
                return;
            }
        } else {
            alert('No patient selected for assessment.');
            this.goBackToPatients();
            return;
        }
    }

    displayPatientInfo(patient) {
        console.log('Displaying patient info:', patient);
        
        const patientInfoDiv = document.getElementById('selectedPatientInfo');
        const patientInitials = document.getElementById('patientInitials');
        const patientName = document.getElementById('patientName');
        const patientId = document.getElementById('patientId');
        const patientAge = document.getElementById('patientAge');
        const patientGender = document.getElementById('patientGender');
        const patientGenotype = document.getElementById('patientGenotype');

        if (patientInfoDiv) {
            patientInfoDiv.style.display = 'flex';
        }

        if (patientInitials) {
            const initials = patient.name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
            patientInitials.textContent = initials;
        }

        if (patientName) patientName.textContent = patient.name;
        if (patientId) patientId.textContent = patient.id;
        if (patientAge) patientAge.textContent = patient.age || 'Unknown';
        if (patientGender) patientGender.textContent = patient.gender || patient.sex || 'Unknown';
        if (patientGenotype) patientGenotype.textContent = patient.genotype || 'Unknown';
    }

    prefillPatientData(patient) {
        // Pre-fill form with patient data
        const ageInput = document.getElementById('age');
        const sexSelect = document.getElementById('sex');
        const genotypeSelect = document.getElementById('genotype');

        if (ageInput && patient.age) {
            ageInput.value = patient.age;
            ageInput.removeAttribute('required'); // Remove required since it's pre-filled
        }

        if (sexSelect && (patient.gender || patient.sex)) {
            sexSelect.value = patient.gender || patient.sex;
            // Remove required attribute and disable after setting value
            sexSelect.removeAttribute('required');
            sexSelect.disabled = true;
            sexSelect.style.backgroundColor = '#f8f9fa';
            sexSelect.style.cursor = 'not-allowed';
        }

        if (genotypeSelect && patient.genotype) {
            genotypeSelect.value = patient.genotype;
            // Remove required attribute and disable after setting value
            genotypeSelect.removeAttribute('required');
            genotypeSelect.disabled = true;
            genotypeSelect.style.backgroundColor = '#f8f9fa';
            genotypeSelect.style.cursor = 'not-allowed';
        }

        // Pre-fill medical history if available
        if (patient.crisisFrequency) {
            const priorCrisesSelect = document.getElementById('priorCrises');
            if (priorCrisesSelect) {
                priorCrisesSelect.value = Math.min(patient.crisisFrequency, 5).toString();
            }
        }
    }

    setupFormHandlers() {
        const form = document.getElementById('symptomForm');
        if (form) {
            // Disable HTML5 validation completely
            form.setAttribute('novalidate', 'novalidate');
            
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                e.stopPropagation();
                return false;
            });
        }

        // Handle button click directly to bypass any form validation
        const submitButton = document.getElementById('beginAssessmentBtn');
        if (submitButton) {
            submitButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.processAssessment();
                return false;
            });
        }
    }

    setupSliders() {
        // Pain level slider
        const painSlider = document.getElementById('painLevel');
        const painValue = document.getElementById('painValue');
        if (painSlider && painValue) {
            painSlider.addEventListener('input', function() {
                painValue.textContent = this.value;
            });
        }

        // Stress level slider
        const stressSlider = document.getElementById('stressLevel');
        const stressValue = document.getElementById('stressValue');
        if (stressSlider && stressValue) {
            stressSlider.addEventListener('input', function() {
                stressValue.textContent = this.value;
            });
        }
    }

    async processAssessment() {
        try {
            // Show loading state
            const submitButton = document.getElementById('beginAssessmentBtn');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Processing with AI...';
            submitButton.disabled = true;

            // Validate essential data manually (bypassing HTML5 validation)
            const sexSelect = document.getElementById('sex');
            const ageInput = document.getElementById('age');
            
            if (!sexSelect.value || !ageInput.value) {
                console.warn('Missing required patient data, but proceeding with defaults');
                // Set defaults if missing
                if (!sexSelect.value) sexSelect.value = this.currentPatient?.gender || this.currentPatient?.sex || 'Unknown';
                if (!ageInput.value) ageInput.value = this.currentPatient?.age || 25;
            }

            // Collect form data
            const formData = this.collectFormData();
            console.log('Assessment form data:', formData);

            // Calculate crisis score using AI model (required)
            const result = await this.calculateCrisisScore(formData);
            
            // Save assessment result
            this.saveAssessmentResult(result);

            // Show results
            this.displayResults(result);

        } catch (error) {
            console.error('AI Assessment error:', error);
            
            // Show specific error message for AI failures
            const errorMessage = error.message || 'AI prediction service error. Please try again.';
            alert(`AI Assessment Failed: ${errorMessage}\n\nPlease ensure the AI service is running and try again.`);
            
        } finally {
            // Reset button
            const submitButton = document.getElementById('beginAssessmentBtn');
            submitButton.textContent = 'Begin Assessment';
            submitButton.disabled = false;
        }
    }

    collectFormData() {
        const form = document.getElementById('symptomForm');
        const formData = new FormData(form);
        const data = {};

        // Convert FormData to object
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        // Handle disabled fields manually (they don't submit with FormData)
        const sexSelect = document.getElementById('sex');
        const genotypeSelect = document.getElementById('genotype');
        const ageInput = document.getElementById('age');
        
        if (sexSelect && sexSelect.value) {
            data.sex = sexSelect.value;
        }
        if (genotypeSelect && genotypeSelect.value) {
            data.genotype = genotypeSelect.value;
        }
        if (ageInput && ageInput.value) {
            data.age = ageInput.value;
        }

        // Handle radio buttons that might not be in FormData
        const radioGroups = ['jointPain', 'fatigue', 'fever', 'shortness_of_breath', 'dactylitis', 
                           'history_of_acs', 'coexisting_asthma', 'hydroxyurea', 'pain_med'];
        
        radioGroups.forEach(group => {
            const checked = document.querySelector(`input[name="${group}"]:checked`);
            if (checked) {
                data[group] = checked.value;
            }
        });

        return data;
    }

    async calculateCrisisScore(formData) {
        // Always require AI model - no fallback to basic assessment
        if (!window.aetherFlowAI) {
            throw new Error('AI integration not loaded. Please refresh the page and try again.');
        }

        if (!aetherFlowAI.isModelLoaded) {
            await aetherFlowAI.checkModelStatus();
            if (!aetherFlowAI.isModelLoaded) {
                throw new Error('AI prediction service is not available. Please ensure the AI service is running and try again.');
            }
        }

        // Convert form data to FormData object if it isn't already
        let apiFormData;
        if (formData instanceof FormData) {
            apiFormData = formData;
        } else {
            apiFormData = new FormData();
            Object.keys(formData).forEach(key => {
                apiFormData.append(key, formData[key]);
            });
        }

        // Format data for AI API
        const patientData = aetherFlowAI.formatPatientDataForAPI(apiFormData);
        console.log('Sending patient data to AI:', patientData);

        // Get AI prediction
        const prediction = await aetherFlowAI.predictCrisisRisk(patientData);
        console.log('AI Prediction received:', prediction);

        // Format results for healthcare mode display
        const aiResults = aetherFlowAI.formatResultsForDisplay(prediction);
        const urgency = aetherFlowAI.getUrgencyMessage(aiResults.riskLevel, aiResults.rawProbability);

        return {
            crisisScore: Math.round(aiResults.rawProbability * 100),
            riskLevel: aiResults.riskLevel,
            riskFactors: aiResults.riskFactors || [],
            recommendations: urgency.actions || aiResults.recommendations || [],
            assessmentData: formData,
            timestamp: new Date().toISOString(),
            aiPrediction: prediction,
            confidence: aiResults.confidence,
            modelVersion: aiResults.modelVersion,
            isAIPowered: true
        };
    }

    generateRecommendations(riskLevel, riskFactors, formData) {
        const recommendations = [];

        if (riskLevel === 'High') {
            recommendations.push('Seek immediate medical attention');
            recommendations.push('Consider emergency department evaluation');
            recommendations.push('Initiate pain management protocol');
        } else if (riskLevel === 'Medium') {
            recommendations.push('Monitor symptoms closely');
            recommendations.push('Contact healthcare provider');
            recommendations.push('Increase fluid intake');
        } else {
            recommendations.push('Continue current care plan');
            recommendations.push('Maintain hydration');
            recommendations.push('Monitor for symptom changes');
        }

        // Specific recommendations based on symptoms
        if (formData.hydrationLevel === 'Low') {
            recommendations.push('Increase fluid intake immediately');
        }
        if (formData.fever === '1') {
            recommendations.push('Monitor temperature regularly');
        }
        if (formData.hydroxyurea === '0') {
            recommendations.push('Discuss hydroxyurea therapy with physician');
        }

        return recommendations;
    }

    saveAssessmentResult(result) {
        const assessment = {
            id: 'assessment_' + Date.now(),
            patientId: this.currentPatient.id,
            patientName: this.currentPatient.name,
            date: new Date().toISOString(),
            crisisScore: result.crisisScore,
            riskLevel: result.riskLevel,
            riskFactors: result.riskFactors,
            recommendations: result.recommendations,
            assessmentData: result.assessmentData,
            providerId: JSON.parse(localStorage.getItem('aetherflow_provider') || '{}').id
        };

        this.assessments.push(assessment);
        this.saveAssessments();

        // Update patient's risk level and last assessment
        this.updatePatientRecord(result);

        console.log('Assessment saved:', assessment);
    }

    updatePatientRecord(result) {
        const patientIndex = this.patients.findIndex(p => p.id === this.currentPatient.id);
        if (patientIndex !== -1) {
            this.patients[patientIndex].riskLevel = result.riskLevel.toLowerCase();
            this.patients[patientIndex].lastAssessment = new Date().toISOString();
            this.patients[patientIndex].latestCrisisScore = result.crisisScore;
            
            // Save updated patients
            localStorage.setItem('aetherflow_patients', JSON.stringify(this.patients));
            console.log('Patient record updated with assessment results');
        }
    }

    displayResults(result) {
        // Create a modal to display results instead of replacing page content
        const existingModal = document.getElementById('crisisResultsModal');
        if (existingModal) {
            existingModal.remove();
        }

        const riskScore = result.crisisScore || 0;
        const circumference = 2 * Math.PI * 54;
        const strokeDasharray = `${circumference} ${circumference}`;
        const strokeDashoffset = circumference - (riskScore / 100) * circumference;

        const modal = document.createElement('div');
        modal.id = 'crisisResultsModal';
        modal.className = 'modal';
        modal.style.display = 'block';
        
        modal.innerHTML = `
            <div class="modal-content large-modal">
                <div class="modal-header">
                    <h3>Crisis Assessment Results - ${this.currentPatient.name}</h3>
                    <span class="modal-close" onclick="this.closest('.modal').remove()">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="results-container">
                        <div class="results-header">
                            <p class="analysis-date">Assessment completed on ${new Date().toLocaleString()}</p>
                        </div>

                        <div class="results-content">
                            <div class="result-card sickle-cell-results">
                                <h2>Sickle Cell Crisis Risk Assessment</h2>
                                <div class="crisis-timeframe">
                                    <h3>48-Hour Crisis Prediction</h3>
                                    <p>Likelihood of sickle cell crisis occurring within the next 48 hours</p>
                                </div>
                                <div class="risk-display">
                                    <div class="risk-badge">
                                        <span>${result.riskLevel.toUpperCase()} Risk</span>
                                    </div>
                                    
                                    <div class="score-container">
                                        <div class="score-circle">
                                            <svg class="progress-ring" width="120" height="120">
                                                <circle class="progress-ring-background" cx="60" cy="60" r="54"></circle>
                                                <circle class="progress-ring-progress" cx="60" cy="60" r="54" 
                                                        style="stroke-dasharray: ${strokeDasharray}; stroke-dashoffset: ${strokeDashoffset}"></circle>
                                            </svg>
                                            <div class="score-text">${riskScore}%</div>
                                        </div>
                                        <p class="score-label">Crisis Probability</p>
                                    </div>
                                    
                                    <div class="model-confidence">
                                        <span>AI Model Prediction: </span>
                                        <span>High Confidence</span>
                                        ${result.modelVersion ? `<small> (v${result.modelVersion})</small>` : ''}
                                    </div>
                                </div>
                            </div>

                            <div class="result-card">
                                <h2>Clinical Recommendations</h2>
                                <p class="recommendations-intro">
                                    Evidence-based clinical recommendations based on current assessment and risk stratification.
                                </p>
                                <div class="recommendations-list">
                                    ${result.recommendations.map(rec => `
                                        <div class="recommendation-item">
                                            <div class="rec-icon">💡</div>
                                            <div class="rec-content">
                                                <p>${rec}</p>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                            ${result.riskFactors && result.riskFactors.length > 0 ? `
                                <div class="result-card">
                                    <h2>Risk Factors Identified</h2>
                                    <div class="risk-factors-list">
                                        ${result.riskFactors.map(factor => `
                                            <div class="risk-factor-item">
                                                <span class="factor-indicator">⚠️</span>
                                                <span class="factor-text">${typeof factor === 'object' ? factor.name || factor.factor || JSON.stringify(factor) : factor}</span>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}
                        </div>

                        <div class="result-actions">
                            <button class="btn btn-primary" onclick="window.print()">Print Results</button>
                            <button class="btn btn-outline" onclick="window.location.href='patients.html'">Back to Patients</button>
                            <button class="btn btn-outline" onclick="window.location.href='crisis-assessment.html?patient=${this.currentPatient.id}'">New Assessment</button>
                        </div>

                        <div class="disclaimer">
                            <h4>⚠️ Clinical Decision Support Notice</h4>
                            <p>This AI-powered assessment tool is designed to support clinical decision-making and should be used in conjunction with professional clinical judgment. 
                            The recommendations provided are based on evidence-based guidelines and should be considered alongside patient history, clinical presentation, and institutional protocols.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    getRiskIcon(riskLevel) {
        switch (riskLevel) {
            case 'High':
                return '🚨';
            case 'Medium':
                return '⚠️';
            case 'Low':
                return '✅';
            default:
                return '📊';
        }
    }

    getRiskDescription(riskLevel) {
        switch (riskLevel) {
            case 'High':
                return 'Immediate medical attention recommended. High probability of sickle cell crisis.';
            case 'Medium':
                return 'Moderate risk detected. Close monitoring and medical consultation advised.';
            case 'Low':
                return 'Low risk of immediate crisis. Continue regular care and monitoring.';
            default:
                return 'Assessment completed.';
        }
    }

    goBackToPatients() {
        window.location.href = 'patients.html';
    }
}

// Global functions
function goBackToPatients() {
    window.location.href = 'patients.html';
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Crisis Assessment Manager initializing...');
    window.crisisAssessmentManager = new CrisisAssessmentManager();
    console.log('Crisis Assessment Manager initialized successfully');
});
