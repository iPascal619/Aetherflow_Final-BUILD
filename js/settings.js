// Settings functionality for AetherFlow - Mode-aware
document.addEventListener('DOMContentLoaded', function() {
    const currentMode = localStorage.getItem('aetherflow_mode') || 'single';
    
    // Initialize mode selector
    initializeModeSelector();
    
    // Set initial mode
    setApplicationMode(currentMode);
    
    // Load existing settings
    loadSettings();
    
    // If in healthcare mode, update navbar to healthcare navigation
    if (currentMode === 'multi') {
        updateNavbarForHealthcare();
        updateProviderInfoInSettings();
        // Load and display provider info throughout the app
        setTimeout(() => {
            updateProviderInfoThroughout();
        }, 100);
    }
    
    // Initialize confidence threshold slider
    initializeConfidenceSlider();
    
    // Initialize healthcare mode detection
    initializeHealthcareModeDetection();
});

function initializeModeSelector() {
    const singleModeRadio = document.getElementById('singleMode');
    const healthcareModeRadio = document.getElementById('healthcareMode');
    
    if (singleModeRadio && healthcareModeRadio) {
        singleModeRadio.addEventListener('change', function() {
            if (this.checked) {
                setApplicationMode('single');
            }
        });
        
        healthcareModeRadio.addEventListener('change', function() {
            if (this.checked) {
                setApplicationMode('healthcare');
            }
        });
    }
}

function setApplicationMode(mode) {
    const singleUserSettings = document.getElementById('singleUserSettings');
    const healthcareWorkerSettings = document.getElementById('healthcareWorkerSettings');
    const singleModeRadio = document.getElementById('singleMode');
    const healthcareModeRadio = document.getElementById('healthcareMode');
    
    if (mode === 'single') {
        // Show single user settings
        if (singleUserSettings) singleUserSettings.style.display = 'block';
        if (healthcareWorkerSettings) healthcareWorkerSettings.style.display = 'none';
        if (singleModeRadio) singleModeRadio.checked = true;
        
        // Store mode preference
        localStorage.setItem('aetherflow_mode', 'single');
        
        // Update body class
        document.body.className = document.body.className.replace('healthcare-mode', '');
        
    } else if (mode === 'healthcare') {
        // Show healthcare worker settings
        if (singleUserSettings) singleUserSettings.style.display = 'none';
        if (healthcareWorkerSettings) healthcareWorkerSettings.style.display = 'block';
        if (healthcareModeRadio) healthcareModeRadio.checked = true;
        
        // Store mode preference
        localStorage.setItem('aetherflow_mode', 'multi');
        
        // Update body class
        if (!document.body.classList.contains('healthcare-mode')) {
            document.body.classList.add('healthcare-mode');
        }
        
        // Update navbar for healthcare mode
        updateNavbarForHealthcare();
    }
}

function initializeConfidenceSlider() {
    const confidenceSlider = document.getElementById('confidenceThreshold');
    const confidenceValue = document.getElementById('confidenceValue');
    
    if (confidenceSlider && confidenceValue) {
        confidenceSlider.addEventListener('input', function() {
            const value = Math.round(this.value * 100);
            confidenceValue.textContent = value + '%';
        });
        
        // Set initial value
        const initialValue = Math.round(confidenceSlider.value * 100);
        confidenceValue.textContent = initialValue + '%';
    }
}

function saveAllSettings() {
    const currentMode = localStorage.getItem('aetherflow_mode') || 'single';
    
    if (currentMode === 'single') {
        saveSingleUserSettings();
    } else {
        saveHealthcareWorkerSettings();
    }
    
    // Save common settings
    saveCommonSettings();
    
    // Show success message
    showSettingsMessage('Settings saved successfully!', 'success');
}

function saveSingleUserSettings() {
    const singleUserData = {
        profile: {
            fullName: document.getElementById('fullName')?.value || '',
            email: document.getElementById('email')?.value || '',
            birthDate: document.getElementById('birthDate')?.value || '',
            gender: document.getElementById('profileGender')?.value || ''
        },
        health: {
            height: document.getElementById('height')?.value || '',
            weight: document.getElementById('weight')?.value || '',
            bloodType: document.getElementById('bloodType')?.value || '',
            allergies: document.getElementById('allergies')?.value || '',
            chronicConditions: document.getElementById('chronicConditions')?.value || ''
        }
    };
    
    localStorage.setItem('aetherflow_single_user_settings', JSON.stringify(singleUserData));
}

function saveHealthcareWorkerSettings() {
    const healthcareData = {
        provider: {
            name: document.getElementById('providerName')?.value || '',
            license: document.getElementById('medicalLicense')?.value || '',
            specialty: document.getElementById('specialty')?.value || '',
            email: document.getElementById('providerEmail')?.value || '',
            affiliation: document.getElementById('hospitalAffiliation')?.value || ''
        },
        patientManagement: {
            maxPatients: document.getElementById('maxPatients')?.value || '100',
            assessmentRetention: document.getElementById('assessmentRetention')?.value || '365',
            autoBackup: document.getElementById('autoBackup')?.checked || false,
            patientNotifications: document.getElementById('patientNotifications')?.checked || false,
            generateReports: document.getElementById('generateReports')?.checked || false
        },
        aiModel: {
            modelVersion: document.getElementById('modelVersion')?.value || 'v1.0',
            confidenceThreshold: document.getElementById('confidenceThreshold')?.value || '0.8',
            enableLogging: document.getElementById('enableLogging')?.checked || false
        }
    };
    
    localStorage.setItem('aetherflow_healthcare_settings', JSON.stringify(healthcareData));
    
    // Update provider info throughout the application immediately
    updateProviderInfoThroughout();
}

function saveCommonSettings() {
    const commonData = {
        preferences: {
            language: document.getElementById('language')?.value || 'en',
            timezone: document.getElementById('timezone')?.value || 'UTC',
            notifications: document.getElementById('notifications')?.checked || false,
            dataSharing: document.getElementById('dataSharing')?.checked || false,
            darkMode: document.getElementById('darkMode')?.checked || false,
            useOnlineAI: document.getElementById('useOnlineAI')?.checked || false
        }
    };
    
    localStorage.setItem('aetherflow_common_settings', JSON.stringify(commonData));
}

function loadSettings() {
    const currentMode = localStorage.getItem('aetherflow_mode') || 'single';
    
    if (currentMode === 'single') {
        loadSingleUserSettings();
    } else {
        loadHealthcareWorkerSettings();
    }
    
    loadCommonSettings();
}

function loadSingleUserSettings() {
    const savedData = localStorage.getItem('aetherflow_single_user_settings');
    if (savedData) {
        const data = JSON.parse(savedData);
        
        // Load profile data
        if (data.profile) {
            document.getElementById('fullName').value = data.profile.fullName || '';
            document.getElementById('email').value = data.profile.email || '';
            document.getElementById('birthDate').value = data.profile.birthDate || '';
            document.getElementById('profileGender').value = data.profile.gender || '';
        }
        
        // Load health data
        if (data.health) {
            document.getElementById('height').value = data.health.height || '';
            document.getElementById('weight').value = data.health.weight || '';
            document.getElementById('bloodType').value = data.health.bloodType || '';
            document.getElementById('allergies').value = data.health.allergies || '';
            document.getElementById('chronicConditions').value = data.health.chronicConditions || '';
        }
    }
}

function loadHealthcareWorkerSettings() {
    const savedData = localStorage.getItem('aetherflow_healthcare_settings');
    if (savedData) {
        const data = JSON.parse(savedData);
        
        // Load provider data
        if (data.provider) {
            document.getElementById('providerName').value = data.provider.name || '';
            document.getElementById('medicalLicense').value = data.provider.license || '';
            document.getElementById('specialty').value = data.provider.specialty || '';
            document.getElementById('providerEmail').value = data.provider.email || '';
            document.getElementById('hospitalAffiliation').value = data.provider.affiliation || '';
        }
        
        // Load patient management data
        if (data.patientManagement) {
            document.getElementById('maxPatients').value = data.patientManagement.maxPatients || '100';
            document.getElementById('assessmentRetention').value = data.patientManagement.assessmentRetention || '365';
            document.getElementById('autoBackup').checked = data.patientManagement.autoBackup || false;
            document.getElementById('patientNotifications').checked = data.patientManagement.patientNotifications || false;
            document.getElementById('generateReports').checked = data.patientManagement.generateReports || false;
        }
        
        // Load AI model data
        if (data.aiModel) {
            document.getElementById('modelVersion').value = data.aiModel.modelVersion || 'v1.0';
            document.getElementById('confidenceThreshold').value = data.aiModel.confidenceThreshold || '0.8';
            document.getElementById('enableLogging').checked = data.aiModel.enableLogging || false;
        }
    }
}

function loadCommonSettings() {
    const savedData = localStorage.getItem('aetherflow_common_settings');
    if (savedData) {
        const data = JSON.parse(savedData);
        
        if (data.preferences) {
            document.getElementById('language').value = data.preferences.language || 'en';
            document.getElementById('timezone').value = data.preferences.timezone || 'UTC';
            document.getElementById('notifications').checked = data.preferences.notifications || false;
            document.getElementById('dataSharing').checked = data.preferences.dataSharing || false;
            document.getElementById('darkMode').checked = data.preferences.darkMode || false;
            document.getElementById('useOnlineAI').checked = data.preferences.useOnlineAI || false;
        }
    }
}

function showSettingsMessage(message, type) {
    // Create or update message element
    let messageEl = document.getElementById('settingsMessage');
    if (!messageEl) {
        messageEl = document.createElement('div');
        messageEl.id = 'settingsMessage';
        messageEl.className = 'settings-message';
        
        const settingsActions = document.querySelector('.settings-actions');
        if (settingsActions) {
            settingsActions.insertBefore(messageEl, settingsActions.firstChild);
        }
    }
    
    messageEl.textContent = message;
    messageEl.className = `settings-message ${type}`;
    messageEl.style.display = 'block';
    
    // Hide message after 3 seconds
    setTimeout(() => {
        messageEl.style.display = 'none';
    }, 3000);
}

function resetSettings() {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
        // Clear all stored settings
        localStorage.removeItem('aetherflow_single_user_settings');
        localStorage.removeItem('aetherflow_healthcare_settings');
        localStorage.removeItem('aetherflow_common_settings');
        
        // Reset form fields
        document.querySelectorAll('input[type="text"], input[type="email"], input[type="number"], input[type="date"], select, textarea').forEach(field => {
            field.value = '';
        });
        
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Reset to default values for specific fields
        document.getElementById('maxPatients').value = '100';
        document.getElementById('assessmentRetention').value = '365';
        document.getElementById('confidenceThreshold').value = '0.8';
        document.getElementById('language').value = 'en';
        document.getElementById('timezone').value = 'UTC';
        
        // Check some default checkboxes
        document.getElementById('notifications').checked = true;
        document.getElementById('useOnlineAI').checked = true;
        document.getElementById('autoBackup').checked = true;
        document.getElementById('patientNotifications').checked = true;
        document.getElementById('generateReports').checked = true;
        
        showSettingsMessage('Settings reset to default values.', 'success');
    }
}

// Enhanced Healthcare Mode Detection and Navigation Management
function initializeHealthcareModeDetection() {
    // Check current mode from localStorage or URL parameters
    const currentMode = localStorage.getItem('aetherflow_mode') || 'single';
    const urlParams = new URLSearchParams(window.location.search);
    const modeParam = urlParams.get('mode');
    
    // Override localStorage if mode parameter is provided
    const finalMode = modeParam || currentMode;
    
    // Update navigation and body class based on mode
    if (finalMode === 'multi' || finalMode === 'healthcare') {
        switchToHealthcareMode();
        // Also ensure the healthcare mode radio is selected and settings are shown
        setApplicationMode('healthcare');
    } else {
        switchToSingleMode();
        // Also ensure the single mode radio is selected and settings are shown
        setApplicationMode('single');
    }
    
    // Initialize mode-specific settings
    initializeModeSpecificSettings(finalMode);
}

function switchToHealthcareMode() {
    // Hide single user navigation
    const singleUserNav = document.getElementById('singleUserNav');
    if (singleUserNav) singleUserNav.style.display = 'none';
    
    // Show healthcare navigation
    const healthcareUserNav = document.getElementById('healthcareUserNav');
    if (healthcareUserNav) healthcareUserNav.style.display = 'flex';
    
    // Show provider info section
    const providerInfoSection = document.getElementById('providerInfoSection');
    if (providerInfoSection) providerInfoSection.style.display = 'flex';
    
    // Update body class
    if (!document.body.classList.contains('healthcare-mode')) {
        document.body.classList.add('healthcare-mode');
    }
    
    // Update provider information in header
    updateProviderInfoInHeader();
    
    // Update provider info throughout the application
    setTimeout(() => {
        updateProviderInfoThroughout();
    }, 100);
    
    // Set mode in localStorage
    localStorage.setItem('aetherflow_mode', 'multi');
    
    // Update mode selector
    const healthcareModeRadio = document.getElementById('healthcareMode');
    if (healthcareModeRadio) healthcareModeRadio.checked = true;
}

function switchToSingleMode() {
    // Show single user navigation
    const singleUserNav = document.getElementById('singleUserNav');
    if (singleUserNav) singleUserNav.style.display = 'flex';
    
    // Hide healthcare navigation
    const healthcareUserNav = document.getElementById('healthcareUserNav');
    if (healthcareUserNav) healthcareUserNav.style.display = 'none';
    
    // Hide provider info section
    const providerInfoSection = document.getElementById('providerInfoSection');
    if (providerInfoSection) providerInfoSection.style.display = 'none';
    
    // Update body class
    document.body.classList.remove('healthcare-mode');
    
    // Set mode in localStorage
    localStorage.setItem('aetherflow_mode', 'single');
    
    // Update mode selector
    const singleModeRadio = document.getElementById('singleMode');
    if (singleModeRadio) singleModeRadio.checked = true;
}

function updateProviderInfoInHeader() {
    // Get provider information from localStorage or use defaults
    const providerInfo = JSON.parse(localStorage.getItem('aetherflow_provider') || '{}');
    
    const providerName = document.getElementById('headerProviderName');
    const providerRole = document.getElementById('headerProviderRole');
    
    if (providerName) {
        providerName.textContent = providerInfo.name || 'Dr. Sarah Johnson';
    }
    
    if (providerRole) {
        providerRole.textContent = providerInfo.specialty || 'Hematologist';
    }
}

// Enhanced function to update provider info throughout the application
function updateProviderInfoThroughout() {
    const savedSettings = localStorage.getItem('aetherflow_healthcare_settings');
    if (!savedSettings) return;
    
    const settings = JSON.parse(savedSettings);
    const provider = settings.provider || {};
    
    // Get provider name and specialty
    const providerName = provider.name || 'Healthcare Provider';
    const providerSpecialty = provider.specialty || 'Medical Professional';
    const providerAffiliation = provider.affiliation || 'Healthcare Facility';
    
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
    
    // Update specific header elements if they exist
    const headerProviderName = document.getElementById('headerProviderName');
    if (headerProviderName) {
        headerProviderName.textContent = providerName;
    }
    
    const headerProviderRole = document.getElementById('headerProviderRole');
    if (headerProviderRole) {
        headerProviderRole.textContent = displaySpecialty;
    }
    
    console.log('Provider info updated throughout application:', {
        name: providerName,
        specialty: displaySpecialty,
        affiliation: providerAffiliation
    });
}

function initializeModeSpecificSettings(mode) {
    if (mode === 'multi' || mode === 'healthcare') {
        // Initialize healthcare-specific settings
        initializeHealthcareSettings();
    } else {
        // Initialize single user settings
        initializeSingleUserSettings();
    }
}

function initializeHealthcareSettings() {
    // Load healthcare-specific settings from localStorage
    const healthcareSettings = JSON.parse(localStorage.getItem('aetherflow_healthcare_settings') || '{}');
    
    // Populate provider form
    const providerForm = document.getElementById('providerForm');
    if (providerForm) {
        const providerName = document.getElementById('providerName');
        const medicalLicense = document.getElementById('medicalLicense');
        const specialty = document.getElementById('specialty');
        const providerEmail = document.getElementById('providerEmail');
        const hospitalAffiliation = document.getElementById('hospitalAffiliation');
        
        if (providerName) providerName.value = healthcareSettings.providerName || '';
        if (medicalLicense) medicalLicense.value = healthcareSettings.medicalLicense || '';
        if (specialty) specialty.value = healthcareSettings.specialty || '';
        if (providerEmail) providerEmail.value = healthcareSettings.providerEmail || '';
        if (hospitalAffiliation) hospitalAffiliation.value = healthcareSettings.hospitalAffiliation || '';
    }
    
    // Initialize clinical workflow settings
    const clinicalSettings = JSON.parse(localStorage.getItem('aetherflow_clinical_settings') || '{}');
    
    const assessmentFrequency = document.getElementById('assessmentFrequency');
    const crisisThreshold = document.getElementById('crisisThreshold');
    const emailAlerts = document.getElementById('emailAlerts');
    const smsAlerts = document.getElementById('smsAlerts');
    
    if (assessmentFrequency) assessmentFrequency.value = clinicalSettings.assessmentFrequency || 'monthly';
    if (crisisThreshold) crisisThreshold.value = clinicalSettings.crisisThreshold || 'medium';
    if (emailAlerts) emailAlerts.checked = clinicalSettings.emailAlerts !== false;
    if (smsAlerts) smsAlerts.checked = clinicalSettings.smsAlerts || false;
}

function initializeSingleUserSettings() {
    // Load single user settings from localStorage
    const singleUserSettings = JSON.parse(localStorage.getItem('aetherflow_single_user_settings') || '{}');
    
    // Populate single user form fields
    const userForm = document.getElementById('userForm');
    if (userForm) {
        const fullName = document.getElementById('fullName');
        const dateOfBirth = document.getElementById('dateOfBirth');
        const gender = document.getElementById('gender');
        const phone = document.getElementById('phone');
        const email = document.getElementById('email');
        
        if (fullName) fullName.value = singleUserSettings.fullName || '';
        if (dateOfBirth) dateOfBirth.value = singleUserSettings.dateOfBirth || '';
        if (gender) gender.value = singleUserSettings.gender || '';
        if (phone) phone.value = singleUserSettings.phone || '';
        if (email) email.value = singleUserSettings.email || '';
    }
}

// Save healthcare-specific settings
function saveHealthcareSettings() {
    const healthcareSettings = {
        providerName: document.getElementById('providerName')?.value || '',
        medicalLicense: document.getElementById('medicalLicense')?.value || '',
        specialty: document.getElementById('specialty')?.value || '',
        providerEmail: document.getElementById('providerEmail')?.value || '',
        hospitalAffiliation: document.getElementById('hospitalAffiliation')?.value || '',
        maxPatients: document.getElementById('maxPatients')?.value || 100,
        assessmentRetention: document.getElementById('assessmentRetention')?.value || 365,
        autoBackup: document.getElementById('autoBackup')?.checked || false,
        patientNotifications: document.getElementById('patientNotifications')?.checked || false,
        generateReports: document.getElementById('generateReports')?.checked || false
    };
    
    const clinicalSettings = {
        assessmentFrequency: document.getElementById('assessmentFrequency')?.value || 'monthly',
        crisisThreshold: document.getElementById('crisisThreshold')?.value || 'medium',
        emailAlerts: document.getElementById('emailAlerts')?.checked || false,
        smsAlerts: document.getElementById('smsAlerts')?.checked || false,
        dataEncryption: document.getElementById('dataEncryption')?.value || 'enhanced',
        auditTrail: document.getElementById('auditTrail')?.checked || false,
        hipaaCompliance: document.getElementById('hipaaCompliance')?.checked || false,
        dataAnonymization: document.getElementById('dataAnonymization')?.checked || false
    };
    
    localStorage.setItem('aetherflow_healthcare_settings', JSON.stringify(healthcareSettings));
    localStorage.setItem('aetherflow_clinical_settings', JSON.stringify(clinicalSettings));
    
    // Update provider info in header
    const providerInfo = {
        name: healthcareSettings.providerName,
        specialty: healthcareSettings.specialty || 'Healthcare Provider'
    };
    localStorage.setItem('aetherflow_provider', JSON.stringify(providerInfo));
    updateProviderInfoInHeader();
}

// Initialize healthcare mode detection when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit to ensure all existing initialization is complete
    setTimeout(function() {
        initializeHealthcareModeDetection();
    }, 200);
});

// Add event listeners for healthcare-specific forms
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        // Add save functionality to healthcare forms
        const providerForm = document.getElementById('providerForm');
        const clinicalWorkflowForm = document.getElementById('clinicalWorkflowForm');
        const complianceForm = document.getElementById('complianceForm');
        
        if (providerForm) {
            providerForm.addEventListener('change', saveHealthcareSettings);
        }
        
        if (clinicalWorkflowForm) {
            clinicalWorkflowForm.addEventListener('change', saveHealthcareSettings);
        }
        
        if (complianceForm) {
            complianceForm.addEventListener('change', saveHealthcareSettings);
        }
    }, 300);
});

// Load settings when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(loadSettings, 100); // Small delay to ensure DOM is fully loaded
});
