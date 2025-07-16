// Healthcare Dashboard JavaScript for AetherFlow Multi-Patient Mode
// Handles provider dashboard functionality, patient statistics, and navigation

class HealthcareDashboard {
    constructor() {
        this.patients = this.loadPatients();
        this.assessments = this.loadAssessments();
        this.providerInfo = this.loadProviderInfo();
        this.initializeDashboard();
    }

    loadPatients() {
        const saved = localStorage.getItem('aetherflow_patients');
        return saved ? JSON.parse(saved) : [];
    }

    loadAssessments() {
        const saved = localStorage.getItem('aetherflow_assessments');
        return saved ? JSON.parse(saved) : [];
    }

    loadProviderInfo() {
        // Get provider information from healthcare settings
        const savedSettings = localStorage.getItem('aetherflow_healthcare_settings');
        if (!savedSettings) {
            return {
                name: 'Healthcare Provider',
                specialty: 'Medical Professional',
                affiliation: 'Healthcare Facility'
            };
        }
        
        const settings = JSON.parse(savedSettings);
        const provider = settings.provider || {};
        
        return {
            name: provider.name || 'Healthcare Provider',
            specialty: provider.specialty || 'Medical Professional',
            affiliation: provider.affiliation || 'Healthcare Facility',
            license: provider.license || '',
            email: provider.email || ''
        };
    }

    initializeDashboard() {
        this.updateStatistics();
        this.displayProviderInfo();
        this.loadPriorityPatients();
        this.loadRecentAssessments();
        this.updateCurrentDate();
        this.setupEventListeners();
    }

    updateStatistics() {
        // Calculate dashboard statistics
        const totalPatients = this.patients.length;
        const highRiskPatients = this.patients.filter(p => p.riskLevel === 'high').length;
        
        // Get today's assessments
        const today = new Date().toDateString();
        const todayAssessments = this.assessments.filter(a => 
            new Date(a.date).toDateString() === today
        ).length;

        // Calculate pending follow-ups (assessments older than 7 days)
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const pendingFollowups = this.patients.filter(patient => {
            const lastAssessment = this.assessments
                .filter(a => a.patientId === patient.id)
                .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
            
            return !lastAssessment || new Date(lastAssessment.date) < weekAgo;
        }).length;

        // Update DOM elements
        this.updateElement('totalPatients', totalPatients);
        this.updateElement('highRiskPatients', highRiskPatients);
        this.updateElement('todayAssessments', todayAssessments);
        this.updateElement('pendingFollowups', pendingFollowups);
    }

    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    displayProviderInfo() {
        // Convert specialty value to display text
        const specialtyDisplayText = {
            'hematology': 'Hematologist',
            'internal-medicine': 'Internal Medicine Physician',
            'pediatrics': 'Pediatrician',
            'family-medicine': 'Family Medicine Physician',
            'emergency-medicine': 'Emergency Medicine Physician',
            'other': 'Medical Specialist'
        };
        
        const displaySpecialty = specialtyDisplayText[this.providerInfo.specialty] || this.providerInfo.specialty;
        
        // Update all provider-name elements
        document.querySelectorAll('.provider-name').forEach(element => {
            element.textContent = this.providerInfo.name;
        });
        
        // Update all provider-role elements
        document.querySelectorAll('.provider-role').forEach(element => {
            element.textContent = displaySpecialty;
        });
        
        // Update specific provider info element if it exists
        const providerElement = document.getElementById('providerInfo');
        if (providerElement) {
            providerElement.innerHTML = `
                <span class="provider-name">${this.providerInfo.name}</span>
                <span class="provider-facility">${this.providerInfo.affiliation}</span>
            `;
        }
        
        console.log('Provider info updated on healthcare dashboard:', {
            name: this.providerInfo.name,
            specialty: displaySpecialty,
            affiliation: this.providerInfo.affiliation
        });
    }

    loadPriorityPatients() {
        const priorityContainer = document.getElementById('priorityPatients');
        if (!priorityContainer) return;

        const highRiskPatients = this.patients
            .filter(p => p.riskLevel === 'high')
            .slice(0, 5); // Show top 5

        if (highRiskPatients.length === 0) {
            priorityContainer.innerHTML = `
                <div class="no-data">
                    <p data-translate="healthcare.priority.no_patients">No high priority patients at this time</p>
                </div>
            `;
            return;
        }

        const patientsHTML = highRiskPatients.map(patient => `
            <div class="patient-item" onclick="viewPatientDetails('${patient.id}')">
                <div class="patient-info">
                    <h4>${patient.name}</h4>
                    <p>ID: ${patient.id} | Age: ${patient.age} | Last Assessment: ${this.getLastAssessmentDate(patient.id)}</p>
                </div>
                <div class="patient-status status-high">High Risk</div>
            </div>
        `).join('');

        priorityContainer.innerHTML = patientsHTML;
    }

    loadRecentAssessments() {
        const assessmentsContainer = document.getElementById('recentAssessments');
        if (!assessmentsContainer) return;

        const recentAssessments = this.assessments
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5); // Show 5 most recent

        if (recentAssessments.length === 0) {
            assessmentsContainer.innerHTML = `
                <div class="no-data">
                    <p data-translate="healthcare.recent.no_assessments">No recent assessments</p>
                </div>
            `;
            return;
        }

        const assessmentsHTML = recentAssessments.map(assessment => {
            const patient = this.patients.find(p => p.id === assessment.patientId);
            const patientName = patient ? patient.name : 'Unknown Patient';
            
            return `
                <div class="patient-item" onclick="viewAssessmentDetails('${assessment.id}')">
                    <div class="patient-info">
                        <h4>${patientName}</h4>
                        <p>Risk: ${assessment.riskLevel} | Date: ${new Date(assessment.date).toLocaleDateString()}</p>
                    </div>
                    <div class="patient-status status-${assessment.riskLevel}">${assessment.riskLevel}</div>
                </div>
            `;
        }).join('');

        assessmentsContainer.innerHTML = assessmentsHTML;
    }

    getLastAssessmentDate(patientId) {
        const patientAssessments = this.assessments.filter(a => a.patientId === patientId);
        if (patientAssessments.length === 0) return 'Never';
        
        const lastAssessment = patientAssessments.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
        return new Date(lastAssessment.date).toLocaleDateString();
    }

    updateCurrentDate() {
        const dateElement = document.getElementById('currentDate');
        if (dateElement) {
            const today = new Date();
            dateElement.textContent = today.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    }

    setupEventListeners() {
        // Refresh dashboard every 30 seconds
        setInterval(() => {
            this.refreshDashboard();
        }, 30000);
    }

    refreshDashboard() {
        this.patients = this.loadPatients();
        this.assessments = this.loadAssessments();
        this.updateStatistics();
        this.loadPriorityPatients();
        this.loadRecentAssessments();
    }
}

// Global functions called by HTML onclick events
function addNewPatient() {
    window.location.href = 'add-patient.html';
}

function viewAllPatients() {
    window.location.href = 'patients.html';
}

function viewAllAssessments() {
    window.location.href = 'assessments.html';
}

function startAssessment() {
    // Check if patients exist first
    const patients = JSON.parse(localStorage.getItem('aetherflow_patients') || '[]');
    if (patients.length === 0) {
        alert('Please add patients first before starting assessments.');
        addNewPatient();
        return;
    }
    window.location.href = 'assessments.html?action=new';
}

function generateReport() {
    window.location.href = 'reports.html';
}

function viewAnalytics() {
    window.location.href = 'reports.html?view=analytics';
}

function viewPatientDetails(patientId) {
    window.location.href = `patient-dashboard.html?id=${patientId}`;
}

function viewAssessmentDetails(assessmentId) {
    window.location.href = `assessments.html?id=${assessmentId}`;
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Check if this is healthcare dashboard page
    if (document.querySelector('.healthcare-dashboard')) {
        new HealthcareDashboard();
    }
});

// Sample data generator for testing (can be removed in production)
function generateSampleData() {
    const samplePatients = [
        {
            id: 'P001',
            name: 'John Doe',
            age: 28,
            gender: 'Male',
            bloodType: 'SS',
            riskLevel: 'high',
            dateAdded: new Date().toISOString()
        },
        {
            id: 'P002',
            name: 'Jane Smith',
            age: 34,
            gender: 'Female',
            bloodType: 'SC',
            riskLevel: 'medium',
            dateAdded: new Date().toISOString()
        }
    ];

    const sampleAssessments = [
        {
            id: 'A001',
            patientId: 'P001',
            date: new Date().toISOString(),
            riskLevel: 'high',
            painLevel: 8,
            recommendations: ['Immediate medical attention', 'Pain management']
        }
    ];

    localStorage.setItem('aetherflow_patients', JSON.stringify(samplePatients));
    localStorage.setItem('aetherflow_assessments', JSON.stringify(sampleAssessments));
    
    console.log('Sample data generated');
    location.reload();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HealthcareDashboard };
}
