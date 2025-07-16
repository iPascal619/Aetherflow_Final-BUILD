// Healthcare Setup JavaScript for AetherFlow Multi-Patient Mode
// Handles provider registration and initial setup

class HealthcareSetup {
    constructor() {
        this.providerData = this.loadProviderData();
        this.initializeSetup();
    }

    loadProviderData() {
        const saved = localStorage.getItem('aetherflow_provider');
        return saved ? JSON.parse(saved) : null;
    }

    initializeSetup() {
        // Pre-fill form if provider data exists
        if (this.providerData) {
            this.prefillForm();
        }
    }

    prefillForm() {
        const form = document.getElementById('providerSetupForm');
        if (!form) return;

        Object.keys(this.providerData).forEach(key => {
            const field = form.querySelector(`[name="${key}"]`);
            if (field) {
                field.value = this.providerData[key];
            }
        });
    }

    saveProviderData() {
        const form = document.getElementById('providerSetupForm');
        if (!form) return false;

        const formData = new FormData(form);
        const providerData = {
            name: formData.get('providerName'),
            title: formData.get('providerTitle'),
            facility: formData.get('facility'),
            department: formData.get('department'),
            license: formData.get('license'),
            setupDate: new Date().toISOString(),
            id: Date.now().toString()
        };

        // Validate required fields
        if (!providerData.name || !providerData.title) {
            alert('Please fill in your name and professional title.');
            return false;
        }

        localStorage.setItem('aetherflow_provider', JSON.stringify(providerData));
        this.providerData = providerData;
        return true;
    }

    createSamplePatients() {
        const samplePatients = [
            {
                id: 'demo_001',
                name: 'John Doe',
                age: 28,
                sex: 'Male',
                genotype: 'HbSS',
                dateAdded: new Date().toISOString(),
                lastAssessment: null,
                riskLevel: 'Low',
                totalAssessments: 0,
                isDemoPatient: true
            },
            {
                id: 'demo_002', 
                name: 'Sarah Johnson',
                age: 34,
                sex: 'Female',
                genotype: 'HbSC',
                dateAdded: new Date().toISOString(),
                lastAssessment: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                riskLevel: 'Moderate',
                totalAssessments: 3,
                isDemoPatient: true
            },
            {
                id: 'demo_003',
                name: 'Michael Brown',
                age: 22,
                sex: 'Male', 
                genotype: 'HbS-beta',
                dateAdded: new Date().toISOString(),
                lastAssessment: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                riskLevel: 'High',
                totalAssessments: 7,
                isDemoPatient: true
            }
        ];

        localStorage.setItem('aetherflow_patients', JSON.stringify(samplePatients));
        return samplePatients;
    }
}

// Global functions for setup actions
function changeMode() {
    if (confirm('Are you sure you want to change modes? This will take you back to the mode selection screen.')) {
        localStorage.removeItem('aetherflow_mode');
        localStorage.removeItem('aetherflow_provider');
        window.location.href = 'mode-selection.html';
    }
}

function addFirstPatient() {
    if (saveProviderIfNeeded()) {
        window.location.href = 'add-patient.html';
    }
}

function importPatients() {
    if (saveProviderIfNeeded()) {
        // Create file input for CSV import
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv';
        input.onchange = handlePatientImport;
        input.click();
    }
}

function handlePatientImport(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const csv = e.target.result;
            const patients = parseCSVPatients(csv);
            
            if (patients.length > 0) {
                const existingPatients = JSON.parse(localStorage.getItem('aetherflow_patients') || '[]');
                const mergedPatients = [...existingPatients, ...patients];
                
                localStorage.setItem('aetherflow_patients', JSON.stringify(mergedPatients));
                alert(`Successfully imported ${patients.length} patients.`);
                window.location.href = 'healthcare-dashboard.html';
            } else {
                alert('No valid patient data found in the CSV file.');
            }
        } catch (error) {
            alert('Error importing CSV file. Please check the format and try again.');
            console.error('CSV Import Error:', error);
        }
    };
    reader.readAsText(file);
}

function parseCSVPatients(csv) {
    const lines = csv.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const patients = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length < headers.length) continue;

        const patient = {
            id: Date.now().toString() + '_' + i,
            dateAdded: new Date().toISOString(),
            lastAssessment: null,
            riskLevel: 'Unknown',
            totalAssessments: 0,
            isDemoPatient: false
        };

        headers.forEach((header, index) => {
            if (values[index]) {
                switch (header) {
                    case 'name':
                        patient.name = values[index];
                        break;
                    case 'age':
                        patient.age = parseInt(values[index]) || 0;
                        break;
                    case 'sex':
                    case 'gender':
                        patient.sex = values[index];
                        break;
                    case 'genotype':
                        patient.genotype = values[index];
                        break;
                    default:
                        patient[header] = values[index];
                }
            }
        });

        if (patient.name && patient.age) {
            patients.push(patient);
        }
    }

    return patients;
}

function exploreDemo() {
    if (saveProviderIfNeeded()) {
        const setup = new HealthcareSetup();
        setup.createSamplePatients();
        alert('Demo patients have been added! You can now explore the system with sample data.');
        window.location.href = 'healthcare-dashboard.html';
    }
}

function completeSetup() {
    if (saveProviderIfNeeded()) {
        window.location.href = 'healthcare-dashboard.html';
    }
}

function skipSetup() {
    // Create minimal provider data
    const minimalProvider = {
        name: 'Healthcare Provider',
        title: 'Provider',
        setupDate: new Date().toISOString(),
        id: Date.now().toString(),
        isMinimal: true
    };
    
    localStorage.setItem('aetherflow_provider', JSON.stringify(minimalProvider));
    window.location.href = 'healthcare-dashboard.html';
}

function saveProviderIfNeeded() {
    const setup = new HealthcareSetup();
    return setup.saveProviderData();
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    // Check if already in multi-patient mode
    const mode = localStorage.getItem('aetherflow_mode');
    if (mode !== 'multi') {
        window.location.href = 'mode-selection.html';
        return;
    }

    new HealthcareSetup();
});
