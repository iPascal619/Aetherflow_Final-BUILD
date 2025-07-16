// Add Patient functionality for AetherFlow Healthcare Mode
document.addEventListener('DOMContentLoaded', function() {
    // Update provider info when page loads
    updateProviderInfo();
    
    const form = document.getElementById('addPatientForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handlePatientSubmission();
        });
    }
});

function updateProviderInfo() {
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

function handlePatientSubmission() {
    // Get form values using the actual field names from the HTML
    const patientData = {
        id: 'patient_' + Date.now(),
        name: document.getElementById('patientName')?.value || '',
        patientId: document.getElementById('patientId')?.value || 'AUTO_' + Date.now(),
        dateOfBirth: document.getElementById('dateOfBirth')?.value || '',
        sex: document.getElementById('sex')?.value || '',
        gender: document.getElementById('sex')?.value || '', // Add gender field for patients.js compatibility
        genotype: document.getElementById('genotype')?.value || '',
        bloodType: document.getElementById('genotype')?.value || 'Unknown', // Add bloodType field for patients.js compatibility
        diagnosisDate: document.getElementById('diagnosisDate')?.value || '',
        phone: document.getElementById('phone')?.value || '',
        email: document.getElementById('email')?.value || '',
        address: document.getElementById('address')?.value || '',
        emergencyName: document.getElementById('emergencyName')?.value || '',
        emergencyRelation: document.getElementById('emergencyRelation')?.value || '',
        emergencyPhone: document.getElementById('emergencyPhone')?.value || '',
        emergencyEmail: document.getElementById('emergencyEmail')?.value || '',
        crisisHistory: document.getElementById('crisisHistory')?.checked || false,
        lastCrisis: document.getElementById('lastCrisis')?.value || '',
        crisisFrequency: parseInt(document.getElementById('crisisFrequency')?.value) || 0,
        currentMedications: document.getElementById('currentMedications')?.value || '',
        allergies: document.getElementById('allergies')?.value || '',
        notes: document.getElementById('notes')?.value || '',
        createdDate: new Date().toISOString().split('T')[0],
        riskLevel: 'low' // Default risk level
    };

    // Get complications checkboxes
    const complications = [];
    document.querySelectorAll('input[name="complications"]:checked').forEach(cb => {
        complications.push(cb.value);
    });
    patientData.complications = complications;

    // Calculate age from date of birth
    if (patientData.dateOfBirth) {
        const birthDate = new Date(patientData.dateOfBirth);
        const today = new Date();
        patientData.age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            patientData.age--;
        }
    }

    // Basic validation
    if (!patientData.name.trim()) {
        alert('Please enter the patient name');
        return;
    }
    if (!patientData.dateOfBirth) {
        alert('Please enter date of birth');
        return;
    }
    if (!patientData.sex) {
        alert('Please select sex');
        return;
    }
    if (!patientData.genotype) {
        alert('Please select genotype');
        return;
    }

    // Save to localStorage using the same key as other parts of the system
    const patients = JSON.parse(localStorage.getItem('aetherflow_patients') || '[]');
    
    console.log('Current patients before adding:', patients);
    console.log('New patient data to save:', patientData);
    
    // Add new patient
    patients.push(patientData);
    localStorage.setItem('aetherflow_patients', JSON.stringify(patients));
    
    console.log('Updated patients after adding:', patients);
    console.log('Saved to localStorage successfully');

    alert('Patient registered successfully!');
    
    // Redirect to patients page
    window.location.href = 'patients.html';
}

function resetForm() {
    if (confirm('Are you sure you want to reset the form? All entered data will be lost.')) {
        document.getElementById('addPatientForm').reset();
    }
}

function cancelAddPatient() {
    window.location.href = 'patients.html';
}
