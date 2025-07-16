// Patient Dashboard functionality - Fixed Version
class PatientDashboard {
    constructor() {
        this.currentPatient = null;
        this.assessments = [];
        this.progressChart = null;
        this.init();
    }

    init() {
        console.log('Initializing Patient Dashboard...');
        this.loadPatientFromURL();
        this.setupEventListeners();
        this.initializeChart();
    }

    loadPatientFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const patientId = urlParams.get('id');
        
        console.log('Loading patient from URL, ID:', patientId);
        
        if (!patientId) {
            console.error('No patient ID found in URL');
            alert('No patient ID provided. Redirecting to patients page.');
            window.location.href = 'patients.html';
            return;
        }

        this.loadPatient(patientId);
    }

    loadPatient(patientId) {
        console.log('Loading patient with ID:', patientId);
        
        const patients = JSON.parse(localStorage.getItem('aetherflow_patients') || '[]');
        console.log('Available patients:', patients);
        
        this.currentPatient = patients.find(p => p.id === patientId);
        
        if (!this.currentPatient) {
            console.error('Patient not found with ID:', patientId);
            console.log('Available patient IDs:', patients.map(p => p.id));
            alert('Patient not found. Redirecting to patients page.');
            window.location.href = 'patients.html';
            return;
        }

        console.log('Patient loaded successfully:', this.currentPatient);
        
        this.displayPatientInfo();
        this.loadAssessments();
        this.updateOverviewCards();
        this.updateRiskAssessment();
    }

    displayPatientInfo() {
        if (!this.currentPatient) {
            console.error('No current patient to display');
            return;
        }

        console.log('Displaying patient info for:', this.currentPatient);

        // Handle both old and new patient data structures
        const fullName = this.currentPatient.name || 
                         (this.currentPatient.firstName && this.currentPatient.lastName ? 
                          `${this.currentPatient.firstName} ${this.currentPatient.lastName}` : 
                          'Unknown Patient');

        console.log('Patient name:', fullName);

        // Update page title and header
        this.updateElementText('patientName', fullName);
        this.updateElementText('patientId', this.currentPatient.id);
        this.updateElementText('patientDob', this.currentPatient.dateOfBirth || 'Not provided');

        // Patient details section
        this.updateElementText('fullName', fullName);
        this.updateElementText('dateOfBirth', this.currentPatient.dateOfBirth || 'Not provided');
        this.updateElementText('gender', this.currentPatient.gender || 'Not provided');
        this.updateElementText('genotype', this.currentPatient.genotype || this.currentPatient.bloodType || 'Not provided');
        this.updateElementText('email', this.currentPatient.email || 'Not provided');
        this.updateElementText('phone', this.currentPatient.phone || 'Not provided');
        this.updateElementText('emergencyContact', this.currentPatient.emergencyContact || 'Not provided');
        this.updateElementText('primaryConcerns', this.currentPatient.primaryConcerns || 'Sickle cell crisis management');
        this.updateElementText('notes', this.currentPatient.notes || 'No additional notes');
        
        console.log('Patient info displayed successfully');
    }

    updateElementText(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value;
            console.log(`Updated ${elementId}:`, value);
        } else {
            console.warn(`Element not found: ${elementId}`);
        }
    }

    loadAssessments() {
        console.log('Loading assessments for patient:', this.currentPatient.id);
        
        const storedAssessments = JSON.parse(localStorage.getItem('aetherflow_assessments') || '[]');
        this.assessments = storedAssessments.filter(a => a.patientId === this.currentPatient.id);
        
        console.log('Loaded assessments:', this.assessments);
        
        this.displayAssessments();
        this.updateProgressChart();
    }

    updateOverviewCards() {
        console.log('Updating overview cards with assessments:', this.assessments);
        
        if (this.assessments.length === 0) {
            this.updateElementText('lastAssessmentDate', 'No assessments');
            this.updateElementText('lastAssessmentType', '-');
            this.updateElementText('latestScore', '-');
            this.updateElementText('latestSeverity', '-');
            this.updateElementText('totalAssessments', '0');
            this.updateElementText('trendIndicator', '-');
            return;
        }

        const latest = this.assessments[this.assessments.length - 1];
        const total = this.assessments.length;
        
        this.updateElementText('lastAssessmentDate', new Date(latest.date).toLocaleDateString());
        this.updateElementText('lastAssessmentType', 'Sickle Cell Crisis Assessment');
        this.updateElementText('latestScore', `${latest.crisisScore}/100`);
        this.updateElementText('latestSeverity', latest.riskLevel);
        this.updateElementText('totalAssessments', total.toString());
        
        this.updateTrendIndicator();
    }

    updateTrendIndicator() {
        if (this.assessments.length < 2) {
            this.updateElementText('trendIndicator', 'Insufficient data');
            return;
        }

        const latest = this.assessments[this.assessments.length - 1];
        const previous = this.assessments[this.assessments.length - 2];
        
        const change = latest.crisisScore - previous.crisisScore;
        
        const trendElement = document.getElementById('trendIndicator');
        if (trendElement) {
            if (Math.abs(change) < 5) {
                trendElement.textContent = 'Stable';
                trendElement.style.color = 'var(--text-muted)';
            } else if (change < 0) {
                trendElement.textContent = `↓ ${Math.abs(change)} points`;
                trendElement.style.color = 'var(--success-color)';
            } else {
                trendElement.textContent = `↑ ${change} points`;
                trendElement.style.color = 'var(--danger-color)';
            }
        }
    }

    displayAssessments() {
        const tbody = document.getElementById('assessmentsTableBody');
        if (!tbody) {
            console.error('Assessments table body not found');
            return;
        }

        tbody.innerHTML = '';

        if (this.assessments.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="no-data">No assessments found</td></tr>';
            return;
        }

        // Sort assessments by date (newest first)
        const sortedAssessments = [...this.assessments].sort((a, b) => new Date(b.date) - new Date(a.date));

        sortedAssessments.forEach((assessment, index) => {
            const row = document.createElement('tr');
            
            // Calculate change from previous assessment
            let change = '-';
            if (index < sortedAssessments.length - 1) {
                const prevScore = sortedAssessments[index + 1].crisisScore;
                const diff = assessment.crisisScore - prevScore;
                if (diff > 0) {
                    change = `↑ ${diff}`;
                } else if (diff < 0) {
                    change = `↓ ${Math.abs(diff)}`;
                } else {
                    change = '→ 0';
                }
            }
            
            const recommendation = assessment.recommendations && assessment.recommendations.length > 0 ? 
                                  assessment.recommendations[0] : 'No recommendations';
            
            row.innerHTML = `
                <td>${new Date(assessment.date).toLocaleDateString()}</td>
                <td>Sickle Cell Crisis Assessment</td>
                <td>${assessment.crisisScore}/100</td>
                <td><span class="severity-badge severity-${assessment.riskLevel.toLowerCase()}">${assessment.riskLevel}</span></td>
                <td><span class="change-indicator">${change}</span></td>
                <td>${recommendation}</td>
                <td>
                    <button class="btn btn-sm btn-outline" onclick="patientDashboard.viewAssessment('${assessment.id}')">
                        View
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    updateRiskAssessment() {
        if (this.assessments.length === 0) return;

        const latestAssessment = this.assessments[this.assessments.length - 1];
        
        const riskIndicator = document.querySelector('.risk-indicator');
        if (riskIndicator) {
            riskIndicator.className = `risk-indicator ${latestAssessment.riskLevel.toLowerCase()}`;
            riskIndicator.textContent = latestAssessment.riskLevel;
        }

        // Update risk factors
        const riskFactorsList = document.getElementById('riskFactorsList');
        if (riskFactorsList) {
            riskFactorsList.innerHTML = '';
            if (latestAssessment.riskFactors && latestAssessment.riskFactors.length > 0) {
                latestAssessment.riskFactors.forEach(factor => {
                    const li = document.createElement('li');
                    li.textContent = factor;
                    riskFactorsList.appendChild(li);
                });
            } else {
                const li = document.createElement('li');
                li.textContent = 'No significant risk factors identified';
                riskFactorsList.appendChild(li);
            }
        }

        // Update recommendations
        const recommendationsList = document.getElementById('recommendationsList');
        if (recommendationsList) {
            recommendationsList.innerHTML = '';
            if (latestAssessment.recommendations && latestAssessment.recommendations.length > 0) {
                latestAssessment.recommendations.forEach(rec => {
                    const div = document.createElement('div');
                    div.className = 'recommendation-item';
                    div.innerHTML = `<strong>Recommendation</strong><p>${rec}</p>`;
                    recommendationsList.appendChild(div);
                });
            } else {
                const div = document.createElement('div');
                div.className = 'recommendation-item';
                div.innerHTML = `<strong>Continue monitoring</strong><p>Regular assessments recommended based on current risk level.</p>`;
                recommendationsList.appendChild(div);
            }
        }
    }

    initializeChart() {
        // Chart functionality can be added later
        console.log('Chart initialization skipped for now');
    }

    updateProgressChart() {
        // Chart update functionality can be added later
        console.log('Chart update skipped for now');
    }

    setupEventListeners() {
        // Back to patients button
        const backButton = document.getElementById('backToPatients');
        if (backButton) {
            backButton.addEventListener('click', () => {
                window.location.href = 'patients.html';
            });
        }

        // New assessment button
        const newAssessmentButton = document.getElementById('newAssessment');
        if (newAssessmentButton) {
            newAssessmentButton.addEventListener('click', () => {
                this.startNewAssessment();
            });
        }

        // Edit patient button
        const editPatientButton = document.getElementById('editPatient');
        if (editPatientButton) {
            editPatientButton.addEventListener('click', () => {
                window.location.href = `add-patient.html?id=${this.currentPatient.id}`;
            });
        }

        // Modal close buttons
        const closeButtons = document.querySelectorAll('.close, .modal-close');
        closeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                }
            });
        });

        // Time range filter
        const timeRangeFilter = document.getElementById('timeRangeFilter');
        if (timeRangeFilter) {
            timeRangeFilter.addEventListener('change', () => {
                this.displayAssessments();
            });
        }
    }

    startNewAssessment() {
        if (!this.currentPatient) {
            alert('No patient selected');
            return;
        }
        
        window.location.href = `crisis-assessment.html?patientId=${this.currentPatient.id}`;
    }

    viewAssessment(assessmentId) {
        const assessment = this.assessments.find(a => a.id === assessmentId);
        if (!assessment) {
            console.error('Assessment not found:', assessmentId);
            return;
        }

        const modal = document.getElementById('assessmentModal');
        const modalBody = document.getElementById('assessmentModalBody');
        
        if (!modal || !modalBody) {
            console.error('Assessment modal not found');
            return;
        }

        modalBody.innerHTML = `
            <div class="assessment-details">
                <div class="detail-row">
                    <label>Assessment Type:</label>
                    <span>Sickle Cell Crisis Assessment</span>
                </div>
                <div class="detail-row">
                    <label>Date:</label>
                    <span>${new Date(assessment.date).toLocaleDateString()}</span>
                </div>
                <div class="detail-row">
                    <label>Crisis Score:</label>
                    <span>${assessment.crisisScore}/100</span>
                </div>
                <div class="detail-row">
                    <label>Risk Level:</label>
                    <span class="severity-badge severity-${assessment.riskLevel.toLowerCase()}">${assessment.riskLevel}</span>
                </div>
                <div class="detail-row">
                    <label>Risk Factors:</label>
                    <div>${assessment.riskFactors ? assessment.riskFactors.map(f => `<span class="risk-factor">${f}</span>`).join(', ') : 'None identified'}</div>
                </div>
                <div class="detail-row">
                    <label>Recommendations:</label>
                    <div>${assessment.recommendations ? assessment.recommendations.map(r => `<p>• ${r}</p>`).join('') : 'None provided'}</div>
                </div>
            </div>
        `;

        modal.style.display = 'block';
    }
}

// Initialize the patient dashboard when the page loads
let patientDashboard;
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - initializing patient dashboard');
    try {
        patientDashboard = new PatientDashboard();
        console.log('Patient dashboard initialized successfully');
    } catch (error) {
        console.error('Error initializing patient dashboard:', error);
        alert('Error loading patient dashboard. Please try again.');
    }
});
