// Initialize sample data for testing the patient dashboard
function initializeTestData() {
    // Sample patients
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
            assessmentHistory: []
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
            riskLevel: 'high',
            genotype: 'HbSC',
            lastAssessment: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            assessmentHistory: []
        }
    ];

    // Sample assessments
    const sampleAssessments = [
        {
            id: 'assessment_1',
            patientId: 'SC001',
            patientName: 'John Smith',
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            crisisScore: 45,
            riskLevel: 'Medium',
            riskFactors: ['Moderate pain levels', 'Dehydration indicators'],
            recommendations: ['Increase fluid intake', 'Monitor pain levels', 'Rest and avoid strenuous activity'],
            assessmentData: {}
        },
        {
            id: 'assessment_2',
            patientId: 'SC001',
            patientName: 'John Smith',
            date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            crisisScore: 38,
            riskLevel: 'Medium',
            riskFactors: ['Mild pain'],
            recommendations: ['Continue current medication', 'Stay hydrated'],
            assessmentData: {}
        },
        {
            id: 'assessment_3',
            patientId: 'SC002',
            patientName: 'Sarah Johnson',
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            crisisScore: 72,
            riskLevel: 'High',
            riskFactors: ['Severe pain', 'Respiratory distress', 'Fever'],
            recommendations: ['Seek immediate medical attention', 'Emergency room evaluation', 'Contact healthcare provider'],
            assessmentData: {}
        }
    ];

    // Store in localStorage
    localStorage.setItem('aetherflow_patients', JSON.stringify(samplePatients));
    localStorage.setItem('aetherflow_assessments', JSON.stringify(sampleAssessments));
    
    console.log('Sample data initialized');
    console.log('Patients:', samplePatients);
    console.log('Assessments:', sampleAssessments);
}

// Run the initialization
initializeTestData();
