// Test script to simulate form submission and check dashboard functionality
function testDashboardIntegration() {
    // Clear existing data
    localStorage.removeItem('aetherflow_analyses');
    
    // Create test analysis data
    const testAnalysis = {
        id: Date.now(),
        date: new Date().toISOString(),
        age: 25,
        sex: 'Male',
        genotype: 'HbSS',
        painLevel: 7,
        jointPain: '1',
        fatigue: '1',
        fever: '0',
        shortness_of_breath: '0',
        dactylitis: '0',
        hydrationLevel: 'Low',
        hbf_percent: 5.0,
        wbc_count: 8.5,
        ldh: 250,
        crp: 3.0,
        priorCrises: '2',
        history_of_acs: '0',
        coexisting_asthma: '0',
        hydroxyurea: '1',
        pain_med: '1',
        medication_adherence: 0.8,
        sleep_quality: 4,
        reported_stress_level: 6,
        temperature: 25,
        humidity: 50,
        riskScore: {
            score: 65,
            level: 'moderate',
            recommendation: 'Monitor symptoms closely and maintain hydration.'
        }
    };
    
    // Save test data
    const analyses = [testAnalysis];
    localStorage.setItem('aetherflow_analyses', JSON.stringify(analyses));
    
    console.log('Test analysis created:', testAnalysis);
    console.log('Data saved to localStorage');
    
    // Reload page to test dashboard
    if (window.location.pathname.includes('dashboard.html')) {
        window.location.reload();
    } else {
        window.location.href = 'dashboard.html';
    }
}

// Run test when this script is loaded
console.log('Dashboard test script loaded. Run testDashboardIntegration() to test.');
