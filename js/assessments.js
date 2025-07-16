// Assessments JavaScript for AetherFlow Healthcare Mode
// Handles crisis risk assessments, form management, and results processing

class AssessmentManager {
    constructor() {
        this.patients = this.loadPatients();
        this.assessments = this.loadAssessments();
        this.currentAssessment = null;
        this.initializeAssessments();
    }

    loadPatients() {
        const saved = localStorage.getItem('aetherflow_patients');
        let patients = saved ? JSON.parse(saved) : [];
        
        // Add sample patients if none exist
        if (patients.length === 0) {
            patients = this.createSamplePatients();
            localStorage.setItem('aetherflow_patients', JSON.stringify(patients));
        }
        
        return patients;
    }

    createSamplePatients() {
        return [
            {
                id: 'PAT_001',
                name: 'John Smith',
                age: 28,
                gender: 'Male',
                genotype: 'HbSS',
                priorCrises: 3,
                hbf_percent: 4.2,
                wbc_count: 12.5,
                ldh: 320,
                crp: 5.1,
                history_of_acs: 1,
                coexisting_asthma: 0,
                hydroxyurea: 1,
                dateAdded: new Date().toISOString()
            },
            {
                id: 'PAT_002',
                name: 'Maria Rodriguez',
                age: 34,
                gender: 'Female',
                genotype: 'HbSC',
                priorCrises: 1,
                hbf_percent: 8.7,
                wbc_count: 9.2,
                ldh: 240,
                crp: 2.8,
                history_of_acs: 0,
                coexisting_asthma: 1,
                hydroxyurea: 0,
                dateAdded: new Date().toISOString()
            },
            {
                id: 'PAT_003',
                name: 'Ahmed Hassan',
                age: 22,
                gender: 'Male',
                genotype: 'HbSS',
                priorCrises: 5,
                hbf_percent: 3.1,
                wbc_count: 15.8,
                ldh: 450,
                crp: 8.2,
                history_of_acs: 1,
                coexisting_asthma: 0,
                hydroxyurea: 1,
                dateAdded: new Date().toISOString()
            }
        ];
    }

    loadAssessments() {
        const saved = localStorage.getItem('aetherflow_assessments');
        return saved ? JSON.parse(saved) : [];
    }

    saveAssessments() {
        localStorage.setItem('aetherflow_assessments', JSON.stringify(this.assessments));
    }

    initializeAssessments() {
        // Only initialize if we're on the assessments page
        if (document.getElementById('assessmentForm') || document.getElementById('selectedPatient')) {
            this.updateProviderInfo();
            this.populatePatientSelectors();
            this.loadRecentAssessments();
            this.setupFormHandlers();
            this.setDefaultDateTime();
            this.checkURLParams();
        } else {
            console.log('AssessmentManager: Not on assessments page, skipping DOM initialization');
        }
    }

    updateProviderInfo() {
        // Get provider information from healthcare settings
        const savedSettings = localStorage.getItem('aetherflow_healthcare_settings');
        if (!savedSettings) return;
        
        const settings = JSON.parse(savedSettings);
        const provider = settings.provider || {};
        
        // Get provider name and specialty
        const providerName = provider.name || 'Healthcare Provider';
        const providerSpecialty = provider.specialty || 'Medical Professional';
        
        // Convert specialty value to display text
        const specialtyDisplayText = {
            'hematology': 'Hematologist',
            'internal-medicine': 'Internal Medicine Physician',
            'pediatrics': 'Pediatrician',
            'family-medicine': 'Family Medicine Physician',
            'emergency-medicine': 'Emergency Medicine Physician',
            'other': 'Medical Specialist'
        };
        
        const displaySpecialty = specialtyDisplayText[providerSpecialty] || providerSpecialty;
        
        // Update all provider-name elements
        document.querySelectorAll('.provider-name').forEach(element => {
            element.textContent = providerName;
        });
        
        // Update all provider-role elements
        document.querySelectorAll('.provider-role').forEach(element => {
            element.textContent = displaySpecialty;
        });
        
        // Update specific provider info element if it exists
        const providerElement = document.getElementById('providerInfo');
        if (providerElement) {
            providerElement.innerHTML = `
                <span class="provider-name">${providerName}</span>
                <span class="provider-facility">${provider.affiliation || 'Healthcare Facility'}</span>
            `;
        }
        
        console.log('Provider info updated on assessments page:', {
            name: providerName,
            specialty: displaySpecialty
        });
    }

    populatePatientSelectors() {
        const patientSelect = document.getElementById('selectedPatient');
        const patientFilter = document.getElementById('patientFilter');
        
        console.log('Populating patient selectors with:', this.patients);
        
        if (patientSelect) {
            patientSelect.innerHTML = '<option value="">Choose a patient...</option>';
            this.patients.forEach(patient => {
                patientSelect.innerHTML += `<option value="${patient.id}">${patient.name} (${patient.id})</option>`;
            });
            console.log('Patient select populated:', patientSelect.innerHTML);
        }

        if (patientFilter) {
            patientFilter.innerHTML = '<option value="">All Patients</option>';
            this.patients.forEach(patient => {
                patientFilter.innerHTML += `<option value="${patient.id}">${patient.name}</option>`;
            });
        }
    }

    setDefaultDateTime() {
        const dateInput = document.getElementById('assessmentDate');
        if (dateInput) {
            const now = new Date();
            const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
            dateInput.value = localDateTime;
        }
    }

    checkURLParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const patientId = urlParams.get('patient');
        const action = urlParams.get('action');

        console.log('URL params:', { patientId, action });
        console.log('Available patients:', this.patients);

        if (action === 'new' || patientId) {
            this.startNewAssessment();
            if (patientId) {
                const patientSelect = document.getElementById('selectedPatient');
                if (patientSelect) {
                    console.log('Setting patient select to:', patientId);
                    console.log('Available options:', patientSelect.innerHTML);
                    patientSelect.value = patientId;
                    if (patientSelect.value !== patientId) {
                        console.warn('Patient ID not found in select options:', patientId);
                        alert(`Patient not found: ${patientId}`);
                    }
                }
            }
        }
    }

    startNewAssessment() {
        if (this.patients.length === 0) {
            alert('No patients found. Please add patients first.');
            window.location.href = 'add-patient.html';
            return;
        }

        // Redirect to patient selection instead of showing inline form
        window.location.href = 'patients.html';
    }

    cancelAssessment() {
        document.getElementById('assessmentFormSection').style.display = 'none';
        document.getElementById('assessmentForm').reset();
        this.setDefaultDateTime();
    }

    setupFormHandlers() {
        const form = document.getElementById('assessmentForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitAssessment();
            });
        }
    }

    async submitAssessment() {
        const formData = new FormData(document.getElementById('assessmentForm'));
        const assessment = this.processFormData(formData);
        
        if (!assessment) return;

        const submitButton = document.querySelector('#assessmentForm button[type="submit"]');
        const originalText = submitButton.textContent;
        
        try {
            // Show loading state
            submitButton.disabled = true;
            submitButton.textContent = 'Analyzing with AI...';
            
            // Check if AI model is available
            if (!aetherFlowAI.isModelLoaded) {
                await aetherFlowAI.checkModelStatus();
                if (!aetherFlowAI.isModelLoaded) {
                    throw new Error('AI prediction service is not available. Using basic assessment.');
                }
            }

            // Format data for AI API
            const patientData = this.formatAssessmentForAI(formData, assessment);
            console.log('Sending assessment data to AI:', patientData);

            // Get AI prediction
            const prediction = await aetherFlowAI.predictCrisisRisk(patientData);
            console.log('AI Prediction received:', prediction);

            // Format results
            const results = aetherFlowAI.formatResultsForDisplay(prediction);
            const urgency = aetherFlowAI.getUrgencyMessage(results.riskLevel, results.rawProbability);

            // Update assessment with AI results
            assessment.riskScore = results.rawProbability;
            assessment.riskLevel = results.riskLevel;
            assessment.recommendations = results.recommendations;
            assessment.aiPrediction = prediction;
            assessment.urgency = urgency;
            assessment.modelVersion = results.modelVersion;
            assessment.confidence = results.confidence;
            assessment.type = 'ai_assessment';
            
        } catch (error) {
            console.error('AI Assessment error:', error);
            
            // Fallback to basic assessment if AI fails
            const riskResult = this.calculateRiskScore(assessment);
            assessment.riskScore = riskResult.score;
            assessment.riskLevel = riskResult.level;
            assessment.recommendations = riskResult.recommendations;
            assessment.type = 'basic_assessment';
            assessment.note = `AI service unavailable: ${error.message}`;
        } finally {
            // Reset button
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }

        assessment.id = 'ASS_' + Date.now();
        assessment.date = new Date().toISOString();
        assessment.providerId = 'current_provider'; // Replace with actual provider ID

        // Save assessment
        this.assessments.unshift(assessment);
        this.saveAssessments();

        // Show results
        this.showAssessmentResults(assessment);

        // Reset form
        this.cancelAssessment();
        this.loadRecentAssessments();
    }

    processFormData(formData) {
        const assessment = {};
        
        // Required fields validation
        assessment.patientId = formData.get('selectedPatient');
        if (!assessment.patientId) {
            alert('Please select a patient.');
            return null;
        }

        assessment.assessmentDate = formData.get('assessmentDate');
        if (!assessment.assessmentDate) {
            alert('Please select assessment date and time.');
            return null;
        }

        // Get patient info
        const patient = this.patients.find(p => p.id === assessment.patientId);
        assessment.patientName = patient ? patient.name : 'Unknown';

        // Pain and symptoms
        assessment.painLevel = parseInt(formData.get('painLevel')) || 0;
        assessment.symptoms = formData.getAll('symptoms');

        // Clinical measurements
        assessment.temperature = parseFloat(formData.get('temperature')) || null;
        assessment.bloodPressure = formData.get('bloodPressure') || null;
        assessment.heartRate = parseInt(formData.get('heartRate')) || null;
        assessment.oxygenSaturation = parseInt(formData.get('oxygenSaturation')) || null;

        // Lifestyle factors
        assessment.hydrationLevel = formData.get('hydrationLevel') || null;
        assessment.sleepQuality = parseInt(formData.get('sleepQuality')) || null;
        assessment.stressLevel = parseInt(formData.get('stressLevel')) || null;
        assessment.physicalActivity = formData.get('physicalActivity') || null;

        // Medication
        assessment.medicationCompliance = parseInt(formData.get('medicationCompliance')) || null;
        assessment.lastPainMedication = formData.get('lastPainMedication') || null;

        // Notes
        assessment.clinicalNotes = formData.get('clinicalNotes') || '';

        return assessment;
    }

    formatAssessmentForAI(formData, assessment) {
        // Get patient info for demographics
        const patient = this.patients.find(p => p.id === assessment.patientId);
        
        // Convert assessment form data to the format expected by the AI API
        return {
            age: patient ? parseInt(patient.age) || 25 : 25,
            sex: patient ? patient.gender || 'Female' : 'Female',
            genotype: patient ? patient.genotype || 'HbSS' : 'HbSS',
            pain_level: parseInt(formData.get('painLevel')) || 0,
            hbf_percent: parseFloat(patient?.hbf_percent) || 5.0,
            wbc_count: parseFloat(patient?.wbc_count) || 8.5,
            ldh: parseFloat(patient?.ldh) || 250,
            crp: parseFloat(patient?.crp) || 3.0,
            fatigue: assessment.symptoms.includes('fatigue') ? 1 : 0,
            fever: assessment.symptoms.includes('fever') ? 1 : 0,
            joint_pain: assessment.symptoms.includes('joint_pain') ? 1 : 0,
            dactylitis: 0, // Not captured in this form
            shortness_of_breath: assessment.symptoms.includes('shortness_breath') ? 1 : 0,
            prior_crises: parseInt(patient?.priorCrises) || 0,
            history_of_acs: parseInt(patient?.history_of_acs) || 0,
            coexisting_asthma: parseInt(patient?.coexisting_asthma) || 0,
            hydroxyurea: parseInt(patient?.hydroxyurea) || 0,
            pain_med: assessment.lastPainMedication ? 1 : 0,
            medication_adherence: (parseInt(formData.get('medicationCompliance')) || 80) / 100.0,
            hydration_level: this.mapHydrationLevel(formData.get('hydrationLevel')),
            sleep_quality: parseInt(formData.get('sleepQuality')) || 4,
            reported_stress_level: parseInt(formData.get('stressLevel')) || 5,
            temperature: parseFloat(formData.get('temperature')) || 98.6,
            humidity: 50 // Default value
        };
    }

    mapHydrationLevel(level) {
        const mapping = {
            'well_hydrated': 'High',
            'adequate': 'Medium',
            'mild_dehydration': 'Low',
            'moderate_dehydration': 'Low',
            'severe_dehydration': 'Low'
        };
        return mapping[level] || 'Medium';
    }

    calculateRiskScore(assessment) {
        let score = 0;
        let factors = [];
        
        // Pain level scoring (0-40 points)
        score += assessment.painLevel * 4;
        if (assessment.painLevel >= 7) {
            factors.push('High pain level');
        }

        // Symptoms scoring
        const highRiskSymptoms = ['chest_pain', 'shortness_breath', 'fever'];
        const symptomScore = assessment.symptoms.length * 5;
        score += symptomScore;
        
        const hasHighRiskSymptoms = assessment.symptoms.some(s => highRiskSymptoms.includes(s));
        if (hasHighRiskSymptoms) {
            score += 15;
            factors.push('High-risk symptoms present');
        }

        // Vital signs
        if (assessment.temperature && assessment.temperature > 100.4) {
            score += 10;
            factors.push('Fever present');
        }
        
        if (assessment.oxygenSaturation && assessment.oxygenSaturation < 95) {
            score += 15;
            factors.push('Low oxygen saturation');
        }

        if (assessment.heartRate && assessment.heartRate > 100) {
            score += 5;
            factors.push('Elevated heart rate');
        }

        // Hydration
        if (assessment.hydrationLevel === 'severe_dehydration') {
            score += 15;
            factors.push('Severe dehydration');
        } else if (assessment.hydrationLevel === 'moderate_dehydration') {
            score += 10;
            factors.push('Moderate dehydration');
        }

        // Lifestyle factors
        if (assessment.stressLevel && assessment.stressLevel >= 8) {
            score += 5;
            factors.push('High stress level');
        }

        if (assessment.sleepQuality && assessment.sleepQuality <= 4) {
            score += 5;
            factors.push('Poor sleep quality');
        }

        // Medication compliance
        if (assessment.medicationCompliance && assessment.medicationCompliance < 80) {
            score += 10;
            factors.push('Poor medication compliance');
        }

        // Determine risk level and recommendations
        let level, recommendations;
        
        if (score >= 50) {
            level = 'high';
            recommendations = [
                'Immediate medical evaluation recommended',
                'Consider emergency department visit if symptoms worsen',
                'Ensure adequate hydration',
                'Pain management protocol',
                'Monitor vital signs closely'
            ];
        } else if (score >= 25) {
            level = 'medium';
            recommendations = [
                'Schedule follow-up within 24-48 hours',
                'Implement pain management strategies',
                'Increase fluid intake',
                'Monitor symptoms closely',
                'Review medication compliance'
            ];
        } else {
            level = 'low';
            recommendations = [
                'Continue current treatment plan',
                'Maintain adequate hydration',
                'Follow routine check-up schedule',
                'Contact provider if symptoms worsen'
            ];
        }

        if (factors.length > 0) {
            recommendations.unshift(`Risk factors identified: ${factors.join(', ')}`);
        }

        return { score, level, recommendations, factors };
    }

    showAssessmentResults(assessment) {
        const modal = document.getElementById('resultsModal');
        const content = document.getElementById('resultsContent');
        
        const riskScore = Math.round((assessment.riskScore || 0) * 100);
        const circumference = 2 * Math.PI * 54;
        const strokeDasharray = `${circumference} ${circumference}`;
        const strokeDashoffset = circumference - (riskScore / 100) * circumference;
        
        // Determine assessment type and display appropriate confidence
        const isAIAssessment = assessment.type === 'ai_assessment';
        const confidenceLevel = isAIAssessment ? (assessment.confidence || 'High') : 'Basic Assessment';
        const modelInfo = isAIAssessment ? 
            `<div class="ai-badge">🤖 AI-Powered Analysis</div>` : 
            `<div class="fallback-badge">⚠️ Fallback Assessment</div>`;
        
        // Warning banner for non-AI assessments
        const warningBanner = !isAIAssessment ? `
            <div class="ai-warning-banner">
                <div class="warning-icon">⚠️</div>
                <div class="warning-content">
                    <strong>AI Model Unavailable</strong>
                    <p>This assessment used basic rule-based analysis. ${assessment.note || 'AI service is not available.'}</p>
                </div>
            </div>
        ` : '';
        
        content.innerHTML = `
            ${warningBanner}
            <div class="results-container">
                <div class="results-header">
                    <h1>Assessment Results</h1>
                    <p class="analysis-date">Patient: ${assessment.patientName} | Assessment completed on ${new Date(assessment.date).toLocaleString()}</p>
                    ${modelInfo}
                </div>

                <div class="results-content">
                    <div class="result-card sickle-cell-results">
                        <h2>Sickle Cell Crisis Risk Assessment</h2>
                        <div class="crisis-timeframe">
                            <h3>48-Hour Crisis Prediction</h3>
                            <p>Likelihood of sickle cell crisis occurring within the next 48 hours</p>
                        </div>
                        <div class="risk-display">
                            <div class="risk-badge risk-${assessment.riskLevel?.toLowerCase() || 'unknown'}">
                                <span>${(assessment.riskLevel || 'Unknown').toUpperCase()} Risk</span>
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
                                <span>Model Confidence: </span>
                                <span>${confidenceLevel}</span>
                            </div>
                            
                            ${isAIAssessment && assessment.modelVersion ? `
                                <div class="model-version">
                                    <span>Model Version: </span>
                                    <span>${assessment.modelVersion}</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>

                    <div class="result-card">
                        <h2>Clinical Recommendations</h2>
                        <p class="recommendations-intro">
                            Based on the assessment results, here are evidence-based recommendations tailored to the patient's risk level and symptoms.
                        </p>
                        <div class="recommendations-list">
                            ${(assessment.recommendations || []).map(rec => `
                                <div class="recommendation-item">
                                    <div class="rec-icon">💡</div>
                                    <div class="rec-content">
                                        <p>${rec}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="result-card">
                        <h2>Assessment Summary</h2>
                        <div class="assessment-summary">
                            <div class="summary-item">
                                <strong>Pain Level:</strong> ${assessment.painLevel}/10
                            </div>
                            <div class="summary-item">
                                <strong>Symptoms:</strong> ${(assessment.symptoms || []).length > 0 ? assessment.symptoms.join(', ') : 'None reported'}
                            </div>
                            ${assessment.temperature ? `<div class="summary-item"><strong>Temperature:</strong> ${assessment.temperature}°F</div>` : ''}
                            ${assessment.oxygenSaturation ? `<div class="summary-item"><strong>Oxygen Saturation:</strong> ${assessment.oxygenSaturation}%</div>` : ''}
                        </div>
                    </div>
                </div>

                <div class="result-actions">
                    <button class="btn btn-primary" onclick="printResults('${assessment.id}')">Save Results</button>
                    <button class="btn btn-secondary" onclick="printResults('${assessment.id}')">Print Results</button>
                    <button class="btn btn-outline" onclick="emailResults('${assessment.id}')">Email to Patient</button>
                    <button class="btn btn-outline" onclick="viewPatientDashboard('${assessment.patientId}')">View Patient</button>
                </div>

                <div class="disclaimer">
                    <h4>⚠️ Professional Disclaimer</h4>
                    <p>This assessment is a clinical decision support tool and should not replace professional medical judgment. 
                    Always follow institutional protocols and consult with senior clinicians as appropriate.</p>
                </div>
            </div>
        `;

        modal.style.display = 'block';
    }

    loadRecentAssessments() {
        const container = document.getElementById('assessmentsList');
        const emptyState = document.getElementById('assessmentsEmptyState');
        
        if (this.assessments.length === 0) {
            container.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        container.style.display = 'block';
        emptyState.style.display = 'none';

        const recentAssessments = this.assessments.slice(0, 10);
        
        container.innerHTML = recentAssessments.map(assessment => {
            const patient = this.patients.find(p => p.id === assessment.patientId);
            const patientName = patient ? patient.name : 'Unknown Patient';
            
            return `
                <div class="assessment-item" onclick="viewAssessmentDetails('${assessment.id}')">
                    <div class="assessment-info">
                        <h4>${patientName}</h4>
                        <p>Date: ${new Date(assessment.assessmentDate).toLocaleDateString()} | 
                           Pain: ${assessment.painLevel}/10 | 
                           Risk: <span class="risk-${assessment.riskLevel}">${assessment.riskLevel.toUpperCase()}</span></p>
                    </div>
                    <div class="assessment-actions">
                        <button class="btn-icon" onclick="event.stopPropagation(); viewAssessmentResults('${assessment.id}')" title="View Results">👁️</button>
                        <button class="btn-icon" onclick="event.stopPropagation(); duplicateAssessment('${assessment.id}')" title="Duplicate">📋</button>
                        <button class="btn-icon danger" onclick="event.stopPropagation(); deleteAssessment('${assessment.id}')" title="Delete">🗑️</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    filterAssessments() {
        const patientFilter = document.getElementById('patientFilter').value;
        const riskFilter = document.getElementById('riskFilter').value;
        
        // Implementation for filtering assessments
        // This would filter the displayed assessments based on selected criteria
        console.log('Filtering assessments:', { patientFilter, riskFilter });
        // Reload assessments with filters applied
        this.loadRecentAssessments();
    }

    saveAsDraft() {
        const formData = new FormData(document.getElementById('assessmentForm'));
        const draft = this.processFormData(formData);
        
        if (draft) {
            draft.id = 'DRAFT_' + Date.now();
            draft.status = 'draft';
            draft.date = new Date().toISOString();
            
            localStorage.setItem('assessment_draft', JSON.stringify(draft));
            alert('Assessment saved as draft.');
        }
    }

    deleteAssessment(assessmentId) {
        if (confirm('Are you sure you want to delete this assessment? This action cannot be undone.')) {
            this.assessments = this.assessments.filter(a => a.id !== assessmentId);
            this.saveAssessments();
            this.loadRecentAssessments();
        }
    }
}

// Global functions for HTML onclick events
function startNewAssessment() {
    if (window.assessmentManager) {
        window.assessmentManager.startNewAssessment();
    }
}

function cancelAssessment() {
    if (window.assessmentManager) {
        window.assessmentManager.cancelAssessment();
    }
}

function saveAsDraft() {
    if (window.assessmentManager) {
        window.assessmentManager.saveAsDraft();
    }
}

function filterAssessments() {
    if (window.assessmentManager) {
        window.assessmentManager.filterAssessments();
    }
}

function updatePainValue(value) {
    document.getElementById('painValue').textContent = value;
}

function showBulkAssessment() {
    alert('Bulk assessment feature coming soon!');
}

function viewAssessmentHistory() {
    window.location.href = 'reports.html?view=assessments';
}

function exportAssessments() {
    alert('Export feature coming soon!');
}

function viewAssessmentDetails(assessmentId) {
    console.log('Viewing assessment:', assessmentId);
}

function viewAssessmentResults(assessmentId) {
    const assessment = window.assessmentManager.assessments.find(a => a.id === assessmentId);
    if (assessment) {
        window.assessmentManager.showAssessmentResults(assessment);
    }
}

function duplicateAssessment(assessmentId) {
    console.log('Duplicating assessment:', assessmentId);
}

function deleteAssessment(assessmentId) {
    if (window.assessmentManager) {
        window.assessmentManager.deleteAssessment(assessmentId);
    }
}

function closeModal() {
    document.getElementById('resultsModal').style.display = 'none';
}

function printResults(assessmentId) {
    window.print();
}

function emailResults(assessmentId) {
    alert('Email feature coming soon!');
}

function viewPatientDashboard(patientId) {
    window.location.href = `patient-dashboard.html?id=${patientId}`;
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('AssessmentManager initializing...');
    try {
        window.assessmentManager = new AssessmentManager();
        console.log('AssessmentManager initialized successfully');
        console.log('Patients loaded:', window.assessmentManager.patients.length);
        console.log('Assessments loaded:', window.assessmentManager.assessments.length);
    } catch (error) {
        console.error('Failed to initialize AssessmentManager:', error);
        // Try again after a short delay
        setTimeout(() => {
            try {
                window.assessmentManager = new AssessmentManager();
                console.log('AssessmentManager initialized on retry');
            } catch (retryError) {
                console.error('AssessmentManager retry failed:', retryError);
            }
        }, 100);
    }
});

// Also try to initialize if DOMContentLoaded already fired
if (document.readyState === 'loading') {
    // Document still loading, DOMContentLoaded will fire
} else {
    // DOM already loaded
    console.log('DOM already loaded, initializing AssessmentManager immediately');
    try {
        if (!window.assessmentManager) {
            window.assessmentManager = new AssessmentManager();
            console.log('AssessmentManager initialized immediately');
        }
    } catch (error) {
        console.error('Immediate AssessmentManager initialization failed:', error);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AssessmentManager };
}
