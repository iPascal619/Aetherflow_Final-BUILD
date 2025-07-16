// Patient Dashboard functionality
class PatientDashboard {
    constructor() {
        this.currentPatient = null;
        this.assessments = [];
        this.progressChart = null;
        this.init();
    }

    init() {
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
            // Redirect to patients page if no patient ID
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
            alert('Patient not found');
            window.location.href = 'patients.html';
            return;
        }

        console.log('Patient loaded successfully:', this.currentPatient);
        
        // Ensure the patient object has all required properties
        if (!this.currentPatient.name && !this.currentPatient.firstName) {
            console.error('Patient data is incomplete:', this.currentPatient);
        }
        
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
        const firstName = this.currentPatient.firstName || this.currentPatient.name?.split(' ')[0] || '';
        const lastName = this.currentPatient.lastName || this.currentPatient.name?.split(' ').slice(1).join(' ') || '';
        const fullName = this.currentPatient.name || `${firstName} ${lastName}`;

        console.log('Patient name components:', { firstName, lastName, fullName });

        // Update page title and header
        const patientNameElement = document.getElementById('patientName');
        const patientIdElement = document.getElementById('patientId');
        const patientDobElement = document.getElementById('patientDob');
        
        if (patientNameElement) patientNameElement.textContent = fullName;
        if (patientIdElement) patientIdElement.textContent = this.currentPatient.id;
        if (patientDobElement) patientDobElement.textContent = this.currentPatient.dateOfBirth || 'Not provided';

        // Patient details section
        const elements = {
            'fullName': fullName,
            'dateOfBirth': this.currentPatient.dateOfBirth || 'Not provided',
            'gender': this.currentPatient.gender || 'Not provided',
            'email': this.currentPatient.email || 'Not provided',
            'phone': this.currentPatient.phone || 'Not provided',
            'emergencyContact': this.currentPatient.emergencyContact || 'Not provided',
            'primaryConcerns': this.currentPatient.primaryConcerns || 'Sickle cell crisis management',
            'notes': this.currentPatient.notes || 'No additional notes'
        };

        // Update each element with error handling
        for (const [elementId, value] of Object.entries(elements)) {
            const element = document.getElementById(elementId);
            if (element) {
                element.textContent = value;
                console.log(`Updated ${elementId}:`, value);
            } else {
                console.warn(`Element not found: ${elementId}`);
            }
        }
        
        console.log('Patient info displayed successfully');
    }

    loadAssessments() {
        // Load sickle cell crisis assessments from localStorage
        const storedAssessments = JSON.parse(localStorage.getItem('aetherflow_assessments') || '[]');
        this.assessments = storedAssessments.filter(a => a.patientId === this.currentPatient.id);
        
        console.log('Loaded assessments for patient:', this.assessments);
        
        this.displayAssessments();
        this.updateProgressChart();
    }

    generateSampleAssessments() {
        const assessmentTypes = ['phq9', 'gad7', 'pcl5'];
        
        for (let i = 0; i < 8; i++) {
            const date = new Date();
            date.setDate(date.getDate() - (i * 14)); // Every 2 weeks
            
            const type = assessmentTypes[i % assessmentTypes.length];
            const score = this.generateScoreForType(type);
            
            this.assessments.push({
                id: `assessment_${Date.now()}_${i}`,
                patientId: this.currentPatient.id,
                type: type,
                score: score,
                severity: this.getSeverityLevel(type, score),
                date: date.toISOString().split('T')[0],
                notes: `Assessment completed during regular session`
            });
        }
        
        // Sort by date (newest first)
        this.assessments.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    generateScoreForType(type) {
        switch (type) {
            case 'phq9':
                return Math.floor(Math.random() * 27); // 0-27
            case 'gad7':
                return Math.floor(Math.random() * 21); // 0-21
            case 'pcl5':
                return Math.floor(Math.random() * 80); // 0-80
            default:
                return Math.floor(Math.random() * 100);
        }
    }

    getSeverityLevel(type, score) {
        switch (type) {
            case 'phq9':
                if (score <= 4) return 'Minimal';
                if (score <= 9) return 'Mild';
                if (score <= 14) return 'Moderate';
                if (score <= 19) return 'Moderately Severe';
                return 'Severe';
            case 'gad7':
                if (score <= 4) return 'Minimal';
                if (score <= 9) return 'Mild';
                if (score <= 14) return 'Moderate';
                return 'Severe';
            case 'pcl5':
                if (score < 33) return 'Below Threshold';
                return 'Above Threshold';
            default:
                return 'Unknown';
        }
    }

    updateOverviewCards() {
        if (this.assessments.length === 0) {
            document.getElementById('lastAssessmentDate').textContent = 'No assessments';
            document.getElementById('lastAssessmentType').textContent = '-';
            document.getElementById('latestScore').textContent = '-';
            document.getElementById('latestSeverity').textContent = '-';
            document.getElementById('totalAssessments').textContent = '0';
            document.getElementById('trendIndicator').textContent = '-';
            return;
        }

        const latest = this.assessments[this.assessments.length - 1]; // Get the most recent assessment
        const total = this.assessments.length;
        
        document.getElementById('lastAssessmentDate').textContent = 
            new Date(latest.date).toLocaleDateString();
        document.getElementById('lastAssessmentType').textContent = 
            'Sickle Cell Crisis Assessment';
        document.getElementById('latestScore').textContent = `${latest.crisisScore}/100`;
        document.getElementById('latestSeverity').textContent = latest.riskLevel;
        document.getElementById('totalAssessments').textContent = total;
        
        // Calculate trend
        this.updateTrendIndicator();
    }

    updateTrendIndicator() {
        if (this.assessments.length < 2) {
            document.getElementById('trendIndicator').textContent = 'Insufficient data';
            return;
        }

        // Compare last two assessments for sickle cell crisis scores
        const latest = this.assessments[this.assessments.length - 1];
        const previous = this.assessments[this.assessments.length - 2];
        
        const change = latest.crisisScore - previous.crisisScore;
        
        const trendElement = document.getElementById('trendIndicator');
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

    displayAssessments() {
        const tbody = document.getElementById('assessmentsTableBody');
        tbody.innerHTML = '';

        if (this.assessments.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="no-data">No assessments found</td></tr>';
            return;
        }

        const filteredAssessments = this.getFilteredAssessments();

        filteredAssessments.forEach((assessment, index) => {
            const row = document.createElement('tr');
            
            // Calculate change from previous assessment
            let change = '-';
            if (index < filteredAssessments.length - 1) {
                const prevScore = filteredAssessments[index + 1].crisisScore;
                const diff = assessment.crisisScore - prevScore;
                if (diff > 0) {
                    change = `↑ ${diff}`;
                } else if (diff < 0) {
                    change = `↓ ${Math.abs(diff)}`;
                } else {
                    change = '→ 0';
                }
            }
            
            row.innerHTML = `
                <td>${new Date(assessment.date).toLocaleDateString()}</td>
                <td>Sickle Cell Crisis Assessment</td>
                <td>${assessment.crisisScore}/100</td>
                <td><span class="severity-badge severity-${assessment.riskLevel.toLowerCase().replace(' ', '-')}">${assessment.riskLevel}</span></td>
                <td><span class="change-indicator">${change}</span></td>
                <td>${assessment.recommendations ? assessment.recommendations.slice(0, 1)[0] : '-'}</td>
                <td>
                    <button class="btn btn-sm btn-outline" onclick="patientDashboard.viewAssessment('${assessment.id}')">
                        View
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    getFilteredAssessments() {
        let filtered = [...this.assessments];
        
        // Since we only have sickle cell crisis assessments, no need to filter by type
        // Just filter by time range
        const timeFilter = document.getElementById('timeRangeFilter').value;
        if (timeFilter !== 'all') {
            const now = new Date();
            let cutoffDate = new Date();
            
            switch (timeFilter) {
                case '30days':
                    cutoffDate.setDate(now.getDate() - 30);
                    break;
                case '90days':
                    cutoffDate.setDate(now.getDate() - 90);
                    break;
                case '6months':
                    cutoffDate.setMonth(now.getMonth() - 6);
                    break;
            }
            
            filtered = filtered.filter(a => new Date(a.date) >= cutoffDate);
        }
        
        // Sort by date (newest first)
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        return filtered;
    }

    getAssessmentTypeName(type) {
        const names = {
            'phq9': 'PHQ-9',
            'gad7': 'GAD-7',
            'pcl5': 'PCL-5'
        };
        return names[type] || type.toUpperCase();
    }

    initializeChart() {
        const ctx = document.getElementById('progressChart').getContext('2d');
        this.progressChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: []
            },
            options: {
                responsive: true,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Score'
                        },
                        beginAtZero: true
                    }
                }
            }
        });
    }

    updateProgressChart() {
        if (!this.progressChart || this.assessments.length === 0) return;

        // Group assessments by type
        const assessmentsByType = {};
        this.assessments.forEach(assessment => {
            if (!assessmentsByType[assessment.type]) {
                assessmentsByType[assessment.type] = [];
            }
            assessmentsByType[assessment.type].push(assessment);
        });

        // Sort each type by date
        Object.keys(assessmentsByType).forEach(type => {
            assessmentsByType[type].sort((a, b) => new Date(a.date) - new Date(b.date));
        });

        // Create datasets
        const colors = {
            'phq9': '#dc3545',
            'gad7': '#ffc107',
            'pcl5': '#007bff'
        };

        const datasets = Object.keys(assessmentsByType).map(type => ({
            label: this.getAssessmentTypeName(type),
            data: assessmentsByType[type].map(a => a.score),
            borderColor: colors[type] || '#6c757d',
            backgroundColor: (colors[type] || '#6c757d') + '20',
            tension: 0.4
        }));

        // Use dates from the first assessment type for x-axis
        const firstType = Object.keys(assessmentsByType)[0];
        const labels = assessmentsByType[firstType]?.map(a => 
            new Date(a.date).toLocaleDateString()
        ) || [];

        this.progressChart.data.labels = labels;
        this.progressChart.data.datasets = datasets;
        this.progressChart.update();
    }

    updateRiskAssessment() {
        if (this.assessments.length === 0) return;

        const latestAssessment = this.assessments[this.assessments.length - 1];
        
        const riskIndicator = document.querySelector('.risk-indicator');
        riskIndicator.className = `risk-indicator ${latestAssessment.riskLevel.toLowerCase()}`;
        riskIndicator.textContent = latestAssessment.riskLevel;

        // Update risk factors
        const riskFactorsList = document.getElementById('riskFactorsList');
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

        // Update recommendations
        const recommendationsList = document.getElementById('recommendationsList');
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

    calculateRiskLevel(assessment) {
        const score = assessment.score;
        const type = assessment.type;
        
        let level = 'low';
        let text = 'Low Risk';
        let factors = ['No significant risk factors identified'];
        let recommendations = [{
            title: 'Continue current treatment plan',
            description: 'Patient shows stable progression with current interventions.'
        }];

        if (type === 'phq9' && score >= 15) {
            level = 'high';
            text = 'High Risk';
            factors = [
                'Severe depression symptoms',
                'May require immediate intervention',
                'Monitor for suicidal ideation'
            ];
            recommendations = [
                {
                    title: 'Immediate clinical review required',
                    description: 'Consider increasing session frequency and reviewing medication options.'
                },
                {
                    title: 'Safety planning',
                    description: 'Develop comprehensive safety plan with patient and support system.'
                }
            ];
        } else if (type === 'gad7' && score >= 15) {
            level = 'moderate';
            text = 'Moderate Risk';
            factors = [
                'Severe anxiety symptoms',
                'May impact daily functioning'
            ];
            recommendations = [
                {
                    title: 'Enhanced therapeutic support',
                    description: 'Consider additional coping strategies and anxiety management techniques.'
                }
            ];
        } else if (type === 'pcl5' && score >= 50) {
            level = 'high';
            text = 'High Risk';
            factors = [
                'Severe PTSD symptoms',
                'Significant trauma-related distress'
            ];
            recommendations = [
                {
                    title: 'Specialized trauma therapy',
                    description: 'Consider EMDR, CPT, or other trauma-focused interventions.'
                }
            ];
        } else if (score > 10) {
            level = 'moderate';
            text = 'Moderate Risk';
            factors = [
                'Moderate symptom levels',
                'Regular monitoring recommended'
            ];
            recommendations = [
                {
                    title: 'Continue regular sessions',
                    description: 'Maintain current treatment approach with close monitoring.'
                }
            ];
        }

        return { level, text, factors, recommendations };
    }

    setupEventListeners() {
        // Back to patients button
        document.getElementById('backToPatients').addEventListener('click', () => {
            window.location.href = 'patients.html';
        });

        // New assessment button
        document.getElementById('newAssessment').addEventListener('click', () => {
            this.showNewAssessmentModal();
        });

        // Edit patient button
        document.getElementById('editPatient').addEventListener('click', () => {
            window.location.href = `add-patient.html?id=${this.currentPatient.id}`;
        });

        // Filter change listeners
        document.getElementById('assessmentTypeFilter').addEventListener('change', () => {
            this.displayAssessments();
        });

        document.getElementById('timeRangeFilter').addEventListener('change', () => {
            this.displayAssessments();
        });

        // Modal event listeners
        this.setupModalListeners();
    }

    setupModalListeners() {
        // Close modal buttons
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                e.target.closest('.modal').style.display = 'none';
            });
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });

        // New assessment modal
        document.getElementById('cancelNewAssessment').addEventListener('click', () => {
            document.getElementById('newAssessmentModal').style.display = 'none';
        });

        document.getElementById('startAssessment').addEventListener('click', () => {
            this.startNewAssessment();
        });

        // Assessment details modal
        document.getElementById('closeModal').addEventListener('click', () => {
            document.getElementById('assessmentModal').style.display = 'none';
        });
    }

    showNewAssessmentModal() {
        document.getElementById('newAssessmentModal').style.display = 'block';
    }

    startNewAssessment() {
        const notes = document.getElementById('assessmentNotes').value;

        // Redirect to crisis assessment page with patient ID
        window.location.href = `crisis-assessment.html?patientId=${this.currentPatient.id}&notes=${encodeURIComponent(notes)}`;
    }

    viewAssessment(assessmentId) {
        const assessment = this.assessments.find(a => a.id === assessmentId);
        if (!assessment) return;

        const modalBody = document.getElementById('assessmentModalBody');
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
                    <span class="severity-badge severity-${assessment.riskLevel.toLowerCase().replace(' ', '-')}">${assessment.riskLevel}</span>
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

        document.getElementById('assessmentModal').style.display = 'block';
    }
}

// Initialize the patient dashboard
let patientDashboard;
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - initializing patient dashboard');
    try {
        patientDashboard = new PatientDashboard();
        console.log('Patient dashboard initialized successfully');
    } catch (error) {
        console.error('Error initializing patient dashboard:', error);
    }
});
