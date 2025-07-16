// Initialize Sample Patients for AetherFlow
// Run this to create sample patients in localStorage

function initializeSamplePatients() {
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
            lastAssessment: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
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
            lastAssessment: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
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
            lastAssessment: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            assessmentHistory: [],
            medicalHistory: {
                hydroxyurea: true,
                painMedication: true,
                previousCrises: 5,
                allergies: 'Codeine, Sulfa drugs'
            }
        }
    ];

    // Save to localStorage
    localStorage.setItem('aetherflow_patients', JSON.stringify(samplePatients));
    console.log('Sample patients created:', samplePatients);
    return samplePatients;
}

// Initialize patients when this script runs
if (typeof window !== 'undefined') {
    initializeSamplePatients();
    console.log('✅ Sample patients initialized successfully!');
    
    // Also create a global function to check patients
    window.checkPatients = function() {
        const patients = JSON.parse(localStorage.getItem('aetherflow_patients') || '[]');
        console.log('Current patients:', patients);
        return patients;
    };
}
