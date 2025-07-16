// Reports functionality for AetherFlow Healthcare Mode - Sickle Cell Integration
document.addEventListener('DOMContentLoaded', function() {
    initializeReports();
});

function initializeReports() {
    console.log('Initializing Reports...');
    
    // Update provider info
    updateProviderInfo();
    
    // Load patient data into filters
    loadPatientFilters();
    
    // Generate initial report with all data
    generateReport();
    
    // Setup event listeners
    setupEventListeners();
}

function updateProviderInfo() {
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
    
    console.log('Provider info updated on reports page:', {
        name: providerName,
        specialty: displaySpecialty
    });
}

function loadPatientFilters() {
    const patients = JSON.parse(localStorage.getItem('aetherflow_patients') || '[]');
    const patientFilter = document.getElementById('patientFilter');
    
    if (patientFilter) {
        // Clear existing options except "All Patients"
        patientFilter.innerHTML = '<option value="all">All Patients</option>';
        
        // Add patient options
        patients.forEach(patient => {
            const option = document.createElement('option');
            option.value = patient.id;
            option.textContent = `${patient.name} (${patient.genotype || 'Unknown'})`;
            patientFilter.appendChild(option);
        });
        
        console.log(`Loaded ${patients.length} patients into filter`);
    }
}

function setupEventListeners() {
    // Report generation
    const generateBtn = document.getElementById('generateReport');
    if (generateBtn) {
        generateBtn.addEventListener('click', generateReport);
    }
    
    // Export functionality
    const exportBtn = document.getElementById('exportReport');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportReport);
    }
    
    // Date range change
    const dateRange = document.getElementById('dateRange');
    if (dateRange) {
        dateRange.addEventListener('change', function() {
            const customRange = document.getElementById('customDateRange');
            if (customRange) {
                customRange.style.display = this.value === 'custom' ? 'block' : 'none';
            }
        });
    }
    
    // Filter changes
    ['dateRange', 'patientFilter', 'assessmentType'].forEach(filterId => {
        const element = document.getElementById(filterId);
        if (element) {
            element.addEventListener('change', generateReport);
        }
    });
    
    // Modal event listeners
    const modal = document.getElementById('assessmentModal');
    const closeBtn = modal?.querySelector('.close');
    
    // Close modal when clicking the X
    closeBtn?.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function generateReport() {
    console.log('Generating report...');
    
    // Get filter values
    const dateRange = document.getElementById('dateRange')?.value || '30days';
    const patientFilter = document.getElementById('patientFilter')?.value || 'all';
    const assessmentType = document.getElementById('assessmentType')?.value || 'all';
    
    // Load data
    const patients = JSON.parse(localStorage.getItem('aetherflow_patients') || '[]');
    const assessments = JSON.parse(localStorage.getItem('aetherflow_assessments') || '[]');
    
    console.log(`Loaded ${patients.length} patients and ${assessments.length} assessments`);
    
    // Filter data based on selections
    const filteredData = filterData(patients, assessments, {
        dateRange,
        patientFilter,
        assessmentType
    });
    
    // Update statistics
    updateStatistics(filteredData);
    
    // Update charts
    updateCharts(filteredData);
    
    // Update table
    updateReportTable(filteredData);
}

function filterData(patients, assessments, filters) {
    let filteredAssessments = [...assessments];
    
    // Filter by date range
    const dateRange = getDateRange(filters.dateRange);
    if (dateRange) {
        filteredAssessments = filteredAssessments.filter(assessment => {
            const assessmentDate = new Date(assessment.date);
            return assessmentDate >= dateRange.start && assessmentDate <= dateRange.end;
        });
    }
    
    // Filter by patient
    if (filters.patientFilter && filters.patientFilter !== 'all') {
        filteredAssessments = filteredAssessments.filter(assessment => 
            assessment.patientId === filters.patientFilter
        );
    }
    
    // Filter by assessment type
    if (filters.assessmentType && filters.assessmentType !== 'all') {
        filteredAssessments = filteredAssessments.filter(assessment => {
            if (filters.assessmentType === 'crisis') {
                return assessment.assessmentType === 'crisis' || assessment.crisisScore !== undefined;
            }
            return assessment.assessmentType === filters.assessmentType;
        });
    }
    
    // Get filtered patients (those who have assessments in the filtered range)
    const patientIds = [...new Set(filteredAssessments.map(a => a.patientId))];
    const filteredPatients = patients.filter(p => patientIds.includes(p.id));
    
    return {
        patients: filteredPatients,
        assessments: filteredAssessments,
        dateRange: dateRange
    };
}

function getDateRange(range) {
    const now = new Date();
    const start = new Date();
    
    switch(range) {
        case '7days':
            start.setDate(now.getDate() - 7);
            break;
        case '30days':
            start.setDate(now.getDate() - 30);
            break;
        case '90days':
            start.setDate(now.getDate() - 90);
            break;
        case '6months':
            start.setMonth(now.getMonth() - 6);
            break;
        case '1year':
            start.setFullYear(now.getFullYear() - 1);
            break;
        case 'custom':
            const startDate = document.getElementById('startDate')?.value;
            const endDate = document.getElementById('endDate')?.value;
            if (startDate && endDate) {
                return {
                    start: new Date(startDate),
                    end: new Date(endDate)
                };
            }
            return null;
        default:
            start.setDate(now.getDate() - 30);
    }
    
    return {
        start: start,
        end: now
    };
}

function updateStatistics(data) {
    const { patients, assessments } = data;
    
    // Total assessments
    const totalAssessments = document.getElementById('totalAssessments');
    if (totalAssessments) {
        totalAssessments.textContent = assessments.length;
    }
    
    // Active patients
    const activePatients = document.getElementById('activePatients');
    if (activePatients) {
        activePatients.textContent = patients.length;
    }
    
    // Average crisis score
    const averageScore = document.getElementById('averageScore');
    if (averageScore && assessments.length > 0) {
        const scores = assessments
            .filter(a => a.crisisScore !== undefined)
            .map(a => a.crisisScore);
        
        if (scores.length > 0) {
            const avg = scores.reduce((sum, score) => sum + score, 0) / scores.length;
            averageScore.textContent = avg.toFixed(1);
        } else {
            averageScore.textContent = 'N/A';
        }
    }
    
    // High risk patients
    const highRiskCount = document.getElementById('highRiskCount');
    if (highRiskCount) {
        const highRiskPatients = patients.filter(p => 
            p.riskLevel === 'high' || p.riskLevel === 'High'
        );
        highRiskCount.textContent = highRiskPatients.length;
    }
    
    // Update change indicators (simplified for now)
    ['assessmentChange', 'patientChange', 'scoreChange', 'riskChange'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = 'Current period';
        }
    });
}

function updateCharts(data) {
    // For now, create placeholder charts - in a full implementation, these would be real Chart.js charts
    console.log('Charts would be updated with:', data);
    
    // Create simple trend chart
    createTrendsChart(data.assessments);
    
    // Create distribution chart
    createDistributionChart(data.assessments);
    
    // Create genotype chart
    createGenotypeChart(data.patients);
    
    // Create risk chart
    createRiskChart(data.patients);
}

function createTrendsChart(assessments) {
    const ctx = document.getElementById('trendsChart');
    if (!ctx) return;
    
    // Group assessments by date
    const dateGroups = {};
    assessments.forEach(assessment => {
        const date = new Date(assessment.date).toLocaleDateString();
        if (!dateGroups[date]) {
            dateGroups[date] = [];
        }
        dateGroups[date].push(assessment.crisisScore || 0);
    });
    
    const labels = Object.keys(dateGroups).sort();
    const data = labels.map(date => {
        const scores = dateGroups[date];
        return scores.reduce((sum, score) => sum + score, 0) / scores.length;
    });
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Average Crisis Score',
                data: data,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

function createDistributionChart(assessments) {
    const ctx = document.getElementById('distributionChart');
    if (!ctx) return;
    
    const scores = assessments
        .filter(a => a.crisisScore !== undefined)
        .map(a => a.crisisScore);
    
    // Create score ranges
    const ranges = {
        'Low (0-30)': scores.filter(s => s >= 0 && s <= 30).length,
        'Medium (31-60)': scores.filter(s => s > 30 && s <= 60).length,
        'High (61-100)': scores.filter(s => s > 60 && s <= 100).length
    };
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(ranges),
            datasets: [{
                data: Object.values(ranges),
                backgroundColor: [
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(255, 99, 132, 0.8)'
                ]
            }]
        },
        options: {
            responsive: true
        }
    });
}

function createGenotypeChart(patients) {
    const ctx = document.getElementById('genotypeChart');
    if (!ctx) return;
    
    const genotypes = {};
    patients.forEach(patient => {
        const genotype = patient.genotype || 'Unknown';
        genotypes[genotype] = (genotypes[genotype] || 0) + 1;
    });
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(genotypes),
            datasets: [{
                label: 'Patient Count',
                data: Object.values(genotypes),
                backgroundColor: 'rgba(54, 162, 235, 0.8)'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function createRiskChart(patients) {
    const ctx = document.getElementById('riskChart');
    if (!ctx) return;
    
    const risks = {
        'Low': patients.filter(p => (p.riskLevel || '').toLowerCase() === 'low').length,
        'Medium': patients.filter(p => (p.riskLevel || '').toLowerCase() === 'medium').length,
        'High': patients.filter(p => (p.riskLevel || '').toLowerCase() === 'high').length
    };
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(risks),
            datasets: [{
                data: Object.values(risks),
                backgroundColor: [
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(255, 99, 132, 0.8)'
                ]
            }]
        },
        options: {
            responsive: true
        }
    });
}

function updateReportTable(data) {
    const tableBody = document.getElementById('reportTableBody');
    if (!tableBody) return;
    
    const { patients, assessments } = data;
    
    if (assessments.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="no-data">No assessments found for the selected filters</td></tr>';
        return;
    }
    
    tableBody.innerHTML = '';
    
    assessments.forEach(assessment => {
        const patient = patients.find(p => p.id === assessment.patientId);
        if (!patient) return;
        
        const row = document.createElement('tr');
        
        const riskLevel = assessment.riskLevel || 'Unknown';
        const riskClass = riskLevel.toLowerCase();
        
        row.innerHTML = `
            <td>${patient.name}</td>
            <td>${patient.genotype || 'Unknown'}</td>
            <td>${new Date(assessment.date).toLocaleDateString()}</td>
            <td>${assessment.crisisScore || 'N/A'}</td>
            <td><span class="risk-badge ${riskClass}">${riskLevel}</span></td>
            <td>${assessment.recommendations ? assessment.recommendations.join(', ') : 'None'}</td>
            <td>
                <button class="btn btn-sm btn-outline" onclick="viewAssessmentDetails('${assessment.id}')">View</button>
                <button class="btn btn-sm btn-primary" onclick="viewPatientDashboard('${patient.id}')">Dashboard</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

function exportReport() {
    alert('Export functionality would generate a PDF report with current data and charts.');
    console.log('Export report functionality - would integrate with PDF generation library');
}

function viewAssessmentDetails(assessmentId) {
    console.log('View assessment details:', assessmentId);
    
    const assessments = JSON.parse(localStorage.getItem('aetherflow_assessments') || '[]');
    const patients = JSON.parse(localStorage.getItem('aetherflow_patients') || '[]');
    
    const assessment = assessments.find(a => a.id === assessmentId);
    if (!assessment) {
        alert('Assessment not found');
        return;
    }
    
    const patient = patients.find(p => p.id === assessment.patientId);
    
    // Populate modal with assessment details
    const modal = document.getElementById('assessmentModal');
    const modalBody = document.getElementById('assessmentDetails');
    
    if (modal && modalBody) {
        modalBody.innerHTML = `
            <div class="assessment-detail-section">
                <h4>Patient Information</h4>
                <p><strong>Name:</strong> ${patient ? patient.name : 'Unknown'}</p>
                <p><strong>Genotype:</strong> ${patient ? patient.genotype : 'Unknown'}</p>
                <p><strong>Age:</strong> ${patient ? patient.age : 'Unknown'}</p>
                <p><strong>Gender:</strong> ${patient ? patient.gender : 'Unknown'}</p>
            </div>
            
            <div class="assessment-detail-section">
                <h4>Assessment Details</h4>
                <p><strong>Date:</strong> ${new Date(assessment.date).toLocaleDateString()}</p>
                <p><strong>Type:</strong> ${assessment.type || 'Sickle Cell Crisis Assessment'}</p>
                <p><strong>Crisis Score:</strong> ${assessment.crisisScore || 'N/A'}</p>
                <p><strong>Risk Level:</strong> <span class="risk-badge ${(assessment.riskLevel || 'unknown').toLowerCase()}">${assessment.riskLevel || 'Unknown'}</span></p>
            </div>
            
            <div class="assessment-detail-section">
                <h4>Symptoms</h4>
                <div class="symptoms-grid">
                    ${assessment.symptoms ? Object.entries(assessment.symptoms).map(([symptom, severity]) => 
                        `<div class="symptom-item">
                            <span class="symptom-name">${symptom.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                            <span class="symptom-severity severity-${severity}">${severity}</span>
                        </div>`
                    ).join('') : '<p>No symptoms recorded</p>'}
                </div>
            </div>
            
            <div class="assessment-detail-section">
                <h4>Recommendations</h4>
                <ul>
                    ${assessment.recommendations && assessment.recommendations.length > 0 
                        ? assessment.recommendations.map(rec => `<li>${rec}</li>`).join('') 
                        : '<li>No specific recommendations recorded</li>'}
                </ul>
            </div>
            
            ${assessment.notes ? `
            <div class="assessment-detail-section">
                <h4>Additional Notes</h4>
                <p>${assessment.notes}</p>
            </div>
            ` : ''}
        `;
        
        // Show modal
        modal.style.display = 'block';
    }
}

function viewPatientDashboard(patientId) {
    window.location.href = `patient-dashboard.html?id=${patientId}`;
}

// Initialize when page loads
console.log('Reports module loaded');
