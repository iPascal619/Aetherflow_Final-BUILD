// Patient Management JavaScript for AetherFlow Healthcare Mode
// Handles patient registry, search, filtering, and CRUD operations

class PatientManager {
    constructor() {
        this.patients = this.loadPatients();
        this.filteredPatients = [...this.patients];
        this.selectedPatients = new Set();
        this.currentView = 'list';
        this.initializePatientManager();
    }

    loadPatients() {
        const saved = localStorage.getItem('aetherflow_patients');
        let patients = saved ? JSON.parse(saved) : [];
        
        // If no patients exist, create sample patients for demo
        if (patients.length === 0) {
            patients = this.createSamplePatients();
            this.savePatients(patients);
        }
        
        console.log('Loading patients from localStorage:', patients);
        console.log('Number of patients loaded:', patients.length);
        return patients;
    }

    createSamplePatients() {
        const samplePatients = [
            {
                id: 'SC001',
                name: 'John Smith',
                age: 28,
                gender: 'Male',
                phone: '(555) 123-4567',
                email: 'john.smith@email.com',
                bloodType: 'HbSS',
                dateOfBirth: '1996-03-15',
                address: '123 Main St, City, State 12345',
                emergencyContact: 'Jane Smith - (555) 987-6543',
                riskLevel: 'medium',
                genotype: 'HbSS',
                lastAssessment: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
                assessmentHistory: [],
                medicalHistory: {
                    hydroxyurea: true,
                    painMedication: false,
                    previousCrises: 2,
                    allergies: 'None known'
                }
            },
            {
                id: 'SC002', 
                name: 'Sarah Johnson',
                age: 34,
                gender: 'Female',
                phone: '(555) 234-5678',
                email: 'sarah.johnson@email.com',
                bloodType: 'HbSC',
                dateOfBirth: '1990-07-22',
                address: '456 Oak Ave, City, State 12345',
                emergencyContact: 'Mike Johnson - (555) 876-5432',
                riskLevel: 'low',
                genotype: 'HbSC',
                lastAssessment: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
                assessmentHistory: [],
                medicalHistory: {
                    hydroxyurea: false,
                    painMedication: true,
                    previousCrises: 0,
                    allergies: 'Penicillin'
                }
            },
            {
                id: 'SC003',
                name: 'Michael Davis',
                age: 22,
                gender: 'Male', 
                phone: '(555) 345-6789',
                email: 'michael.davis@email.com',
                bloodType: 'HbS-beta',
                dateOfBirth: '2002-11-08',
                address: '789 Pine St, City, State 12345',
                emergencyContact: 'Lisa Davis - (555) 765-4321',
                riskLevel: 'high',
                genotype: 'HbS-beta',
                lastAssessment: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
                assessmentHistory: [],
                medicalHistory: {
                    hydroxyurea: true,
                    painMedication: true,
                    previousCrises: 5,
                    allergies: 'Codeine, Sulfa drugs'
                }
            },
            {
                id: 'SC004',
                name: 'Emily Brown',
                age: 19,
                gender: 'Female',
                phone: '(555) 456-7890',
                email: 'emily.brown@email.com',
                bloodType: 'HbSS',
                dateOfBirth: '2005-05-14',
                address: '321 Elm Dr, City, State 12345',
                emergencyContact: 'Robert Brown - (555) 654-3210',
                riskLevel: 'medium',
                genotype: 'HbSS',
                lastAssessment: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
                assessmentHistory: [],
                medicalHistory: {
                    hydroxyurea: false,
                    painMedication: false,
                    previousCrises: 1,
                    allergies: 'None known'
                }
            }
        ];
        
        console.log('Created sample patients:', samplePatients);
        return samplePatients;
    }

    savePatients(patientsData = null) {
        const dataToSave = patientsData || this.patients;
        localStorage.setItem('aetherflow_patients', JSON.stringify(dataToSave));
        if (patientsData) {
            this.patients = patientsData;
        }
    }

    initializePatientManager() {
        console.log('Initializing PatientManager...');
        console.log('Current patients:', this.patients);
        this.updateStatistics();
        this.displayPatients();
        this.updateProviderInfo();
        this.setupEventListeners();
        
        // Add debug info
        console.log('PatientManager initialized with', this.patients.length, 'patients');
        if (this.patients.length > 0) {
            console.log('Sample patient IDs:', this.patients.map(p => p.id));
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
        
        console.log('Provider info updated on patients page:', {
            name: providerName,
            specialty: displaySpecialty
        });
    }

    updateStatistics() {
        const total = this.patients.length;
        const lowRisk = this.patients.filter(p => p.riskLevel === 'low').length;
        const mediumRisk = this.patients.filter(p => p.riskLevel === 'medium').length;
        const highRisk = this.patients.filter(p => p.riskLevel === 'high').length;

        console.log('Updating statistics:', { total, lowRisk, mediumRisk, highRisk });
        console.log('Current patients array:', this.patients);

        this.updateElement('totalPatientsCount', total);
        this.updateElement('lowRiskCount', lowRisk);
        this.updateElement('mediumRiskCount', mediumRisk);
        this.updateElement('highRiskCount', highRisk);
    }

    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    displayPatients() {
        console.log('displayPatients called with:', this.filteredPatients.length, 'patients');
        console.log('Filtered patients:', this.filteredPatients);
        
        if (this.filteredPatients.length === 0) {
            console.log('No patients to display, showing empty state');
            this.showEmptyState();
            return;
        }

        console.log('Displaying patients, hiding empty state');
        this.hideEmptyState();
        
        if (this.currentView === 'list') {
            this.displayListView();
        } else {
            this.displayCardView();
        }
    }

    displayListView() {
        const tbody = document.getElementById('patientsTableBody');
        if (!tbody) return;

        tbody.innerHTML = this.filteredPatients.map(patient => `
            <tr onclick="selectPatient('${patient.id}')" data-patient-id="${patient.id}">
                <td>
                    <input type="checkbox" onchange="togglePatientSelection('${patient.id}')" onclick="event.stopPropagation()"
                           ${this.selectedPatients.has(patient.id) ? 'checked' : ''}>
                    ${patient.id}
                </td>
                <td>
                    <strong>${patient.name}</strong>
                    <br><small>${patient.phone || 'No phone'}</small>
                </td>
                <td>${patient.age}</td>
                <td>${patient.gender}</td>
                <td><span class="blood-type">${patient.bloodType}</span></td>
                <td><span class="status-${patient.riskLevel}">${patient.riskLevel.toUpperCase()}</span></td>
                <td>${this.getLastAssessmentDate(patient.id)}</td>
                <td onclick="event.stopPropagation()">
                    <div class="action-buttons">
                        <button class="btn-icon" onclick="event.stopPropagation(); viewPatient('${patient.id}')" title="View Details">👁️</button>
                        <button class="btn-icon" onclick="event.stopPropagation(); editPatient('${patient.id}')" title="Edit">✏️</button>
                        <button class="btn-icon" onclick="event.stopPropagation(); startPatientAssessment('${patient.id}')" title="New Assessment">🩺</button>
                        <button class="btn-icon danger" onclick="event.stopPropagation(); deletePatient('${patient.id}')" title="Delete">🗑️</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    displayCardView() {
        const container = document.getElementById('patientCardsContainer');
        if (!container) return;

        container.innerHTML = this.filteredPatients.map(patient => `
            <div class="patient-card" data-patient-id="${patient.id}">
                <div class="patient-card-header">
                    <input type="checkbox" onchange="togglePatientSelection('${patient.id}')" 
                           ${this.selectedPatients.has(patient.id) ? 'checked' : ''}>
                    <span class="patient-status status-${patient.riskLevel}">${patient.riskLevel.toUpperCase()}</span>
                </div>
                <div class="patient-card-body">
                    <h3>${patient.name}</h3>
                    <p><strong>ID:</strong> ${patient.id}</p>
                    <p><strong>Age:</strong> ${patient.age} | <strong>Gender:</strong> ${patient.gender}</p>
                    <p><strong>Blood Type:</strong> <span class="blood-type">${patient.bloodType}</span></p>
                    <p><strong>Phone:</strong> ${patient.phone || 'Not provided'}</p>
                    <p><strong>Last Assessment:</strong> ${this.getLastAssessmentDate(patient.id)}</p>
                </div>
                <div class="patient-card-actions">
                    <button class="btn btn-outline" onclick="viewPatient('${patient.id}')">View Details</button>
                    <button class="btn btn-primary" onclick="startPatientAssessment('${patient.id}')">New Assessment</button>
                </div>
            </div>
        `).join('');
    }

    getLastAssessmentDate(patientId) {
        const assessments = JSON.parse(localStorage.getItem('aetherflow_assessments') || '[]');
        const patientAssessments = assessments.filter(a => a.patientId === patientId);
        
        if (patientAssessments.length === 0) return 'Never';
        
        const lastAssessment = patientAssessments.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
        return new Date(lastAssessment.date).toLocaleDateString();
    }

    showEmptyState() {
        document.getElementById('emptyState').style.display = 'block';
        document.getElementById('listView').style.display = 'none';
        document.getElementById('cardView').style.display = 'none';
    }

    hideEmptyState() {
        document.getElementById('emptyState').style.display = 'none';
        if (this.currentView === 'list') {
            document.getElementById('listView').style.display = 'block';
            document.getElementById('cardView').style.display = 'none';
        } else {
            document.getElementById('listView').style.display = 'none';
            document.getElementById('cardView').style.display = 'block';
        }
    }

    filterPatients() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const riskFilter = document.getElementById('riskFilter').value;
        const ageFilter = document.getElementById('ageFilter').value;

        this.filteredPatients = this.patients.filter(patient => {
            // Search filter
            const matchesSearch = !searchTerm || 
                patient.name.toLowerCase().includes(searchTerm) ||
                patient.id.toLowerCase().includes(searchTerm) ||
                (patient.phone && patient.phone.includes(searchTerm));

            // Risk filter
            const matchesRisk = !riskFilter || patient.riskLevel === riskFilter;

            // Age filter
            let matchesAge = true;
            if (ageFilter) {
                const age = patient.age;
                switch (ageFilter) {
                    case '0-18':
                        matchesAge = age >= 0 && age <= 18;
                        break;
                    case '19-35':
                        matchesAge = age >= 19 && age <= 35;
                        break;
                    case '36-50':
                        matchesAge = age >= 36 && age <= 50;
                        break;
                    case '51+':
                        matchesAge = age >= 51;
                        break;
                }
            }

            return matchesSearch && matchesRisk && matchesAge;
        });

        this.displayPatients();
    }

    clearFilters() {
        document.getElementById('searchInput').value = '';
        document.getElementById('riskFilter').value = '';
        document.getElementById('ageFilter').value = '';
        this.filteredPatients = [...this.patients];
        this.displayPatients();
    }

    toggleView(view) {
        this.currentView = view;
        
        // Update button states
        document.getElementById('listViewBtn').classList.toggle('active', view === 'list');
        document.getElementById('cardViewBtn').classList.toggle('active', view === 'card');
        
        this.displayPatients();
    }

    togglePatientSelection(patientId) {
        if (this.selectedPatients.has(patientId)) {
            this.selectedPatients.delete(patientId);
        } else {
            this.selectedPatients.add(patientId);
        }
        this.updateBulkActions();
    }

    updateBulkActions() {
        const bulkActions = document.getElementById('bulkActions');
        const selectedCount = document.getElementById('selectedCount');
        
        if (this.selectedPatients.size > 0) {
            bulkActions.style.display = 'block';
            selectedCount.textContent = this.selectedPatients.size;
        } else {
            bulkActions.style.display = 'none';
        }
    }

    clearSelection() {
        this.selectedPatients.clear();
        this.updateBulkActions();
        this.displayPatients();
    }

    deletePatient(patientId) {
        const patient = this.patients.find(p => p.id === patientId);
        if (!patient) return;

        if (confirm(`Are you sure you want to delete patient ${patient.name} (${patient.id})? This action cannot be undone.`)) {
            this.patients = this.patients.filter(p => p.id !== patientId);
            this.filteredPatients = this.filteredPatients.filter(p => p.id !== patientId);
            this.selectedPatients.delete(patientId);
            
            this.savePatients();
            this.updateStatistics();
            this.displayPatients();
            this.updateBulkActions();
        }
    }

    setupEventListeners() {
        // Search input event listener
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterPatients());
        }
        
        // Listen for storage changes to refresh when new patients are added
        window.addEventListener('storage', (e) => {
            if (e.key === 'aetherflow_patients') {
                this.refreshPatients();
            }
        });
        
        // Also refresh when the page becomes visible (for same-window navigation)
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.refreshPatients();
            }
        });
    }
    
    // Refresh patients data and display
    refreshPatients() {
        this.patients = this.loadPatients();
        this.filteredPatients = [...this.patients];
        this.updateStatistics();
        this.displayPatients();
    }

    // Export selected patients to CSV
    bulkExport() {
        const selectedPatientsData = this.patients.filter(p => this.selectedPatients.has(p.id));
        
        if (selectedPatientsData.length === 0) {
            alert('No patients selected for export.');
            return;
        }

        const csvContent = this.convertToCSV(selectedPatientsData);
        this.downloadCSV(csvContent, `patients_export_${new Date().toISOString().split('T')[0]}.csv`);
    }

    convertToCSV(patients) {
        const headers = ['ID', 'Name', 'Age', 'Gender', 'Blood Type', 'Phone', 'Risk Level', 'Date Added'];
        const rows = patients.map(p => [
            p.id,
            p.name,
            p.age,
            p.gender,
            p.bloodType,
            p.phone || '',
            p.riskLevel,
            p.dateAdded || ''
        ]);

        return [headers, ...rows].map(row => 
            row.map(field => `"${field}"`).join(',')
        ).join('\n');
    }

    downloadCSV(content, filename) {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, filename);
        } else {
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

// Global functions called by HTML
function addNewPatient() {
    window.location.href = 'add-patient.html';
}

function viewPatient(patientId) {
    console.log('Attempting to view patient:', patientId);
    
    // Check if patientManager exists, if not try to get patients from localStorage
    let patients = [];
    if (window.patientManager) {
        patients = window.patientManager.patients;
    } else {
        // Fallback to localStorage if patientManager is not available
        const storedPatients = localStorage.getItem('aetherflow_patients');
        if (storedPatients) {
            patients = JSON.parse(storedPatients);
        }
    }
    
    // Check if patient exists
    const patient = patients.find(p => p.id === patientId);
    if (!patient) {
        alert(`Patient with ID ${patientId} not found. Please refresh the page and try again.`);
        console.log('Available patients:', patients);
        return;
    }
    
    console.log('Patient found, navigating to patient dashboard');
    window.location.href = `patient-dashboard.html?id=${patientId}`;
}

function editPatient(patientId) {
    console.log('Attempting to edit patient:', patientId);
    
    // Check if patientManager exists, if not try to get patients from localStorage
    let patients = [];
    if (window.patientManager) {
        patients = window.patientManager.patients;
    } else {
        // Fallback to localStorage if patientManager is not available
        const storedPatients = localStorage.getItem('aetherflow_patients');
        if (storedPatients) {
            patients = JSON.parse(storedPatients);
        }
    }
    
    // Check if patient exists
    const patient = patients.find(p => p.id === patientId);
    if (!patient) {
        alert(`Patient with ID ${patientId} not found. Please refresh the page and try again.`);
        return;
    }
    
    window.location.href = `add-patient.html?edit=${patientId}`;
}

function startPatientAssessment(patientId) {
    console.log('Attempting to start assessment for patient:', patientId);
    
    if (patientId) {
        // Check if patientManager exists, if not try to get patients from localStorage
        let patients = [];
        if (window.patientManager) {
            patients = window.patientManager.patients;
        } else {
            // Fallback to localStorage if patientManager is not available
            const storedPatients = localStorage.getItem('aetherflow_patients');
            if (storedPatients) {
                patients = JSON.parse(storedPatients);
            }
        }
        
        // Check if patient exists
        const patient = patients.find(p => p.id === patientId);
        if (!patient) {
            alert(`Patient with ID ${patientId} not found. Please refresh the page and try again.`);
            return;
        }
        
        // Direct assessment for specific patient
        console.log('Patient found, starting crisis assessment');
        window.location.href = `crisis-assessment.html?patient=${patientId}`;
    } else {
        // Show patient selection modal
        showAssessmentModal();
    }
}

function selectPatient(patientId) {
    console.log('Patient selected:', patientId);
    
    // Check if patientManager exists, if not try to get patients from localStorage
    let patients = [];
    if (window.patientManager) {
        patients = window.patientManager.patients;
    } else {
        // Fallback to localStorage if patientManager is not available
        const storedPatients = localStorage.getItem('aetherflow_patients');
        if (storedPatients) {
            patients = JSON.parse(storedPatients);
        }
    }
    
    // Check if patient exists before viewing
    const patient = patients.find(p => p.id === patientId);
    if (!patient) {
        console.error(`Patient with ID ${patientId} not found`);
        alert(`Patient with ID ${patientId} not found. Please refresh the page and try again.`);
        return;
    }
    
    viewPatient(patientId);
}

function togglePatientSelection(patientId) {
    if (window.patientManager) {
        window.patientManager.togglePatientSelection(patientId);
    }
}

function filterPatients() {
    if (window.patientManager) {
        window.patientManager.filterPatients();
    }
}

function clearFilters() {
    if (window.patientManager) {
        window.patientManager.clearFilters();
    }
}

function toggleView(view) {
    if (window.patientManager) {
        window.patientManager.toggleView(view);
    }
}

function clearSelection() {
    if (window.patientManager) {
        window.patientManager.clearSelection();
    }
}

function bulkExport() {
    if (window.patientManager) {
        window.patientManager.bulkExport();
    }
}

function bulkAssessment() {
    if (window.patientManager && window.patientManager.selectedPatients.size > 0) {
        const selectedIds = Array.from(window.patientManager.selectedPatients);
        window.location.href = `assessments.html?patients=${selectedIds.join(',')}&action=bulk`;
    }
}

function deletePatient(patientId) {
    if (window.patientManager) {
        window.patientManager.deletePatient(patientId);
    }
}

function closeModal() {
    document.getElementById('patientModal').style.display = 'none';
}

function showAssessmentModal() {
    const modal = document.getElementById('assessmentModal');
    const patientSelect = document.getElementById('assessmentPatientSelect');
    
    // Populate patient select
    if (window.patientManager && patientSelect) {
        patientSelect.innerHTML = '<option value="">Choose a patient...</option>';
        window.patientManager.patients.forEach(patient => {
            patientSelect.innerHTML += `<option value="${patient.id}">${patient.name} (${patient.id})</option>`;
        });
    }
    
    modal.style.display = 'block';
}

function closeAssessmentModal() {
    document.getElementById('assessmentModal').style.display = 'none';
}

function beginAssessment() {
    const patientSelect = document.getElementById('assessmentPatientSelect');
    const selectedPatientId = patientSelect.value;
    
    if (!selectedPatientId) {
        alert('Please select a patient first.');
        return;
    }
    
    // Check if patient exists
    const patient = window.patientManager.patients.find(p => p.id === selectedPatientId);
    if (!patient) {
        alert(`Patient with ID ${selectedPatientId} not found. Please refresh the page and try again.`);
        return;
    }
    
    console.log('Starting assessment for patient:', patient.name);
    closeAssessmentModal();
    window.location.href = `crisis-assessment.html?patient=${selectedPatientId}`;
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('PatientManager initializing...');
    window.patientManager = new PatientManager();
    console.log('PatientManager initialized successfully');
    
    // Add global reset function for debugging
    window.resetPatients = function() {
        localStorage.removeItem('aetherflow_patients');
        console.log('Patients cleared from localStorage');
        location.reload();
    };
    
    // Add global function to check patients
    window.checkPatients = function() {
        console.log('Current patients in manager:', window.patientManager.patients);
        console.log('LocalStorage data:', localStorage.getItem('aetherflow_patients'));
        return window.patientManager.patients;
    };
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PatientManager };
}
