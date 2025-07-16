// AI Results Display Handler for AetherFlow
// Handles displaying AI prediction results on the results page

class ResultsDisplayHandler {
    constructor() {
        this.analysisData = null;
        this.loadAnalysisData();
        this.initializeDisplay();
    }

    loadAnalysisData() {
        let latestAnalysis = localStorage.getItem('aetherflow_latest_analysis');
        
        // Fallback to current_analysis if latest_analysis doesn't exist
        if (!latestAnalysis) {
            latestAnalysis = localStorage.getItem('aetherflow_current_analysis');
        }
        
        if (latestAnalysis) {
            this.analysisData = this.parseAnalysisData(JSON.parse(latestAnalysis));
            console.log('Loaded analysis data:', this.analysisData);
        } else {
            console.warn('No analysis data found');
            this.handleNoData();
        }
    }
    
    parseAnalysisData(data) {
        // Handle AI prediction results
        if (data.aiResult && data.isAIPrediction) {
            console.log('Processing AI prediction results');
            return {
                formData: data,
                results: {
                    riskLevel: data.aiResult.crisis_risk_level,
                    probability: `${Math.round(data.aiResult.crisis_probability * 100)}%`,
                    rawProbability: data.aiResult.crisis_probability,
                    confidence: data.aiResult.confidence || 'High',
                    modelVersion: data.aiResult.model_version || 'AetherFlow AI v1.0',
                    timestamp: data.aiResult.prediction_timestamp || data.date,
                    recommendations: data.aiResult.recommendations || [],
                    riskFactors: data.aiResult.top_risk_factors || []
                },
                timestamp: data.date,
                urgency: this.generateUrgencyInfo(data.aiResult.crisis_risk_level),
                isAI: true
            };
        }
        
        // Convert old format to new format if needed
        if (data.riskScore) {
            // Old format from form submission
            return {
                formData: data,
                results: {
                    riskLevel: data.riskScore.level,
                    probability: `${data.riskScore.score}%`,
                    rawProbability: data.riskScore.score / 100,
                    confidence: 'High',
                    modelVersion: 'AetherFlow v1.0',
                    timestamp: data.date,
                    recommendations: [data.riskScore.recommendation]
                },
                timestamp: data.date,
                urgency: this.generateUrgencyInfo(data.riskScore.level)
            };
        }
        
        // New format already structured correctly
        return data;
    }
    
    generateUrgencyInfo(riskLevel) {
        if (riskLevel === 'High') {
            return {
                level: 'high',
                message: 'Immediate Medical Attention Required',
                actions: [
                    'Go to emergency department immediately',
                    'Call emergency services if symptoms worsen',
                    'Bring medication list and medical history',
                    'Do not delay seeking care'
                ]
            };
        } else if (riskLevel === 'Moderate') {
            return {
                level: 'medium',
                message: 'Enhanced Monitoring Required',
                actions: [
                    'Contact healthcare provider within 24 hours',
                    'Monitor symptoms closely',
                    'Increase fluid intake',
                    'Have emergency plan ready'
                ]
            };
        } else {
            return {
                level: 'low',
                message: 'Continue Regular Care',
                actions: [
                    'Maintain current treatment plan',
                    'Stay hydrated and follow preventive measures',
                    'Monitor for any symptom changes',
                    'Schedule routine follow-up as planned'
                ]
            };
        }
    }

    initializeDisplay() {
        if (!this.analysisData) return;

        this.displayAnalysisDate();
        this.displayRiskAssessment();
        this.displayRecommendations();
        this.displayUrgencyLevel();
        this.displayRiskFactors();
        this.displayModelInfo();
        this.evaluateOtherConcerns();
    }

    displayAnalysisDate() {
        const dateElement = document.getElementById('analysisDate');
        if (dateElement && this.analysisData.timestamp) {
            const date = new Date(this.analysisData.timestamp);
            dateElement.textContent = date.toLocaleString();
        }
    }

    displayRiskAssessment() {
        const results = this.analysisData.results;
        if (!results) return;

        // Update risk level
        const riskBadge = document.getElementById('riskBadge');
        const riskLevel = document.getElementById('riskLevel');
        if (riskBadge && riskLevel) {
            riskLevel.textContent = `${results.riskLevel} Risk`;
            riskBadge.className = `risk-badge ${this.getRiskClass(results.riskLevel)}`;
        }

        // Update probability score
        const scoreText = document.getElementById('scoreText');
        if (scoreText) {
            scoreText.textContent = results.probability;
        }

        // Update progress ring
        this.updateProgressRing(results.rawProbability || 0);

        // Update confidence level
        const confidenceLevel = document.getElementById('confidenceLevel');
        if (confidenceLevel) {
            confidenceLevel.textContent = results.confidence;
        }

        // Add 48-hour emphasis
        this.emphasize48HourPrediction(results);
    }

    displayRecommendations() {
        const recommendationsList = document.getElementById('recommendationsList');
        if (!recommendationsList) return;

        // Generate comprehensive, risk-stratified recommendations
        const recommendations = this.generateMedicalRecommendations();
        const riskExplanation = this.generateRiskExplanation();
        
        recommendationsList.innerHTML = '';

        // Add risk explanation section first
        const explanationSection = document.createElement('div');
        explanationSection.className = 'risk-explanation-section';
        explanationSection.innerHTML = `
            <div class="explanation-header">
                <h4>🧠 Why This Risk Level Was Predicted</h4>
                <p>Based on your symptoms and health information, these factors contributed to your crisis risk assessment:</p>
            </div>
            <div class="risk-factors-explanation">
                ${riskExplanation.factors.map(factor => `
                    <div class="factor-explanation ${factor.impact}">
                        <div class="factor-icon">${factor.icon}</div>
                        <div class="factor-details">
                            <h5>${factor.name}</h5>
                            <p>${factor.explanation}</p>
                            <span class="impact-label">${factor.impactText}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="overall-explanation">
                <p><strong>Overall Assessment:</strong> ${riskExplanation.summary}</p>
            </div>
        `;
        recommendationsList.appendChild(explanationSection);

        // Add comprehensive recommendations by category
        Object.entries(recommendations).forEach(([category, recs]) => {
            if (recs.length === 0) return;
            
            const categorySection = document.createElement('div');
            categorySection.className = 'recommendation-category';
            
            const categoryTitle = this.getCategoryTitle(category);
            const categoryIcon = this.getCategoryIcon(category);
            
            categorySection.innerHTML = `
                <div class="category-header">
                    <h4>${categoryIcon} ${categoryTitle}</h4>
                </div>
                <div class="category-recommendations">
                    ${recs.map(rec => `
                        <div class="recommendation-item ${rec.priority}">
                            <div class="rec-priority ${rec.priority}">
                                ${rec.priority === 'critical' ? '🚨' : 
                                  rec.priority === 'high' ? '⚠️' : 
                                  rec.priority === 'medium' ? '📋' : '💡'}
                            </div>
                            <div class="rec-content">
                                <h5>${rec.title}</h5>
                                <p>${rec.description}</p>
                                ${rec.actions ? `
                                    <ul class="rec-actions">
                                        ${rec.actions.map(action => `<li>${action}</li>`).join('')}
                                    </ul>
                                ` : ''}
                                ${rec.timeframe ? `<div class="rec-timeframe">${rec.timeframe}</div>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            
            recommendationsList.appendChild(categorySection);
        });
    }

    displayUrgencyLevel() {
        const urgencyLevel = document.getElementById('urgencyLevel');
        const warningSignsContainer = document.getElementById('warningSignsContainer');
        
        if (!urgencyLevel || !this.analysisData.urgency) return;

        const urgency = this.analysisData.urgency;
        
        // Create comprehensive emergency care guidance
        let emergencyContent = '';
        
        if (urgency.level === 'urgent') {
            emergencyContent = `
                <div class="urgency-indicator urgency-urgent"></div>
                <div class="urgency-text">
                    <h3>🚨 IMMEDIATE MEDICAL ATTENTION REQUIRED</h3>
                    <p>High crisis risk detected. Seek emergency care now.</p>
                </div>
            `;
        } else if (urgency.level === 'moderate') {
            emergencyContent = `
                <div class="urgency-indicator urgency-moderate"></div>
                <div class="urgency-text">
                    <h3>⚠️ Enhanced Monitoring Required</h3>
                    <p>Moderate crisis risk. Contact healthcare provider and monitor symptoms closely.</p>
                </div>
            `;
        } else {
            emergencyContent = `
                <div class="urgency-indicator urgency-low"></div>
                <div class="urgency-text">
                    <h3>✅ Continue Current Care</h3>
                    <p>Low crisis risk. Maintain current management and preventive measures.</p>
                </div>
            `;
        }
        
        urgencyLevel.innerHTML = emergencyContent;

        // Show specific actions/warning signs
        if (warningSignsContainer && urgency.actions) {
            const warningSigns = document.getElementById('warningSigns');
            if (warningSigns) {
                // Create better structured guidance
                let actionHTML = '<div class="emergency-actions">';
                
                if (urgency.level === 'urgent') {
                    actionHTML += `
                        <div class="emergency-section">
                            <h4>🚨 SEEK IMMEDIATE MEDICAL ATTENTION:</h4>
                            <ul class="emergency-list">
                                <li>Severe pain (8/10 or higher)</li>
                                <li>Difficulty breathing or chest pain</li>
                                <li>High fever (>101.3°F/38.5°C)</li>
                                <li>Signs of stroke or neurological changes</li>
                                <li>Severe fatigue or weakness</li>
                            </ul>
                        </div>
                        <div class="immediate-actions">
                            <h4>Immediate Actions:</h4>
                            <ul>
                    `;
                    urgency.actions.forEach(action => {
                        actionHTML += `<li>${action}</li>`;
                    });
                    actionHTML += '</ul></div>';
                } else if (urgency.level === 'moderate') {
                    actionHTML += `
                        <div class="monitoring-section">
                            <h4>📞 Contact Healthcare Provider Within 24 Hours If:</h4>
                            <ul class="warning-list">
                                <li>Pain level increases significantly</li>
                                <li>Fever develops or worsens</li>
                                <li>Fatigue becomes severe</li>
                                <li>Any new concerning symptoms appear</li>
                            </ul>
                        </div>
                        <div class="care-actions">
                            <h4>Recommended Actions:</h4>
                            <ul>
                    `;
                    urgency.actions.forEach(action => {
                        actionHTML += `<li>${action}</li>`;
                    });
                    actionHTML += '</ul></div>';
                } else {
                    actionHTML += `
                        <div class="preventive-section">
                            <h4>Continue Preventive Care:</h4>
                            <ul>
                    `;
                    urgency.actions.forEach(action => {
                        actionHTML += `<li>${action}</li>`;
                    });
                    actionHTML += '</ul></div>';
                }
                
                actionHTML += '</div>';
                warningSigns.innerHTML = actionHTML;
                warningSignsContainer.style.display = 'block';
            }
        }
    }

    displayRiskFactors() {
        // Display top risk factors if available from AI prediction
        if (this.analysisData.aiPrediction && this.analysisData.aiPrediction.top_risk_factors) {
            const relatedConditions = document.getElementById('relatedConditions');
            if (relatedConditions) {
                const riskFactors = this.analysisData.aiPrediction.top_risk_factors;
                
                let factorsHTML = '<h4>Top Contributing Risk Factors:</h4><div class="risk-factors-list">';
                
                riskFactors.forEach((factor, index) => {
                    const importance = Math.abs(factor.contribution);
                    const barWidth = (importance / Math.max(...riskFactors.map(f => Math.abs(f.contribution)))) * 100;
                    
                    factorsHTML += `
                        <div class="risk-factor-item">
                            <span class="factor-name">${factor.factor}</span>
                            <div class="factor-bar">
                                <div class="factor-fill" style="width: ${barWidth}%"></div>
                            </div>
                            <span class="factor-value">${importance.toFixed(3)}</span>
                        </div>
                    `;
                });
                
                factorsHTML += '</div>';
                relatedConditions.innerHTML = factorsHTML;
            }
        } else {
            // Fallback for basic assessment
            const relatedConditions = document.getElementById('relatedConditions');
            if (relatedConditions) {
                relatedConditions.innerHTML = `
                    <p>Based on your symptoms, key factors considered include:</p>
                    <ul>
                        <li>Pain level and location</li>
                        <li>Previous crisis history</li>
                        <li>Current symptoms (fever, fatigue, joint pain)</li>
                        <li>Hydration status</li>
                        <li>Medication adherence</li>
                    </ul>
                `;
            }
        }
    }

    displayModelInfo() {
        // Add model information to the page if available
        if (this.analysisData.aiPrediction) {
            const disclaimer = document.querySelector('.disclaimer');
            if (disclaimer) {
                const modelInfo = document.createElement('div');
                modelInfo.className = 'model-info';
                modelInfo.innerHTML = `
                    <h5>🤖 AI Model Information</h5>
                    <p><strong>Model:</strong> ${this.analysisData.results.modelVersion}</p>
                    <p><strong>Analysis Type:</strong> Machine Learning Prediction</p>
                    <p><strong>Processed:</strong> ${this.analysisData.results.timestamp}</p>
                `;
                disclaimer.parentNode.insertBefore(modelInfo, disclaimer);
            }
        }
    }

    updateProgressRing(probability) {
        const progressRing = document.getElementById('progressRing');
        if (!progressRing) return;

        const radius = 54;
        const circumference = 2 * Math.PI * radius;
        const percentage = probability * 100;
        const strokeDashoffset = circumference - (percentage / 100) * circumference;

        progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
        progressRing.style.strokeDashoffset = strokeDashoffset;

        // Color based on risk level
        if (percentage > 70) {
            progressRing.style.stroke = '#dc3545'; // Red for high risk
        } else if (percentage > 30) {
            progressRing.style.stroke = '#ffc107'; // Yellow for medium risk
        } else {
            progressRing.style.stroke = '#28a745'; // Green for low risk
        }
    }

    emphasize48HourPrediction(results) {
        // Add prominent 48-hour messaging
        const timeframeElement = document.querySelector('.crisis-timeframe');
        if (timeframeElement) {
            const probability = results.rawProbability || 0;
            let timeMessage = '';
            
            if (probability > 0.7) {
                timeMessage = `⚠️ HIGH likelihood of crisis within 48 hours (${results.probability})`;
                timeframeElement.className = 'crisis-timeframe high-risk';
            } else if (probability > 0.3) {
                timeMessage = `⚡ MODERATE likelihood of crisis within 48 hours (${results.probability})`;
                timeframeElement.className = 'crisis-timeframe medium-risk';
            } else {
                timeMessage = `✅ LOW likelihood of crisis within 48 hours (${results.probability})`;
                timeframeElement.className = 'crisis-timeframe low-risk';
            }
            
            const messageElement = timeframeElement.querySelector('p');
            if (messageElement) {
                messageElement.innerHTML = timeMessage;
            }
        }
    }

    generateMedicalRecommendations() {
        const formData = this.analysisData.formData;
        const riskLevel = this.analysisData.results.riskLevel;
        const recommendations = {
            immediate: [],
            pain_management: [],
            prevention: [],
            monitoring: [],
            lifestyle: []
        };

        // Risk-stratified recommendations based on evidence-based guidelines
        if (riskLevel === 'High') {
            recommendations.immediate = this.getHighRiskRecommendations(formData);
        } else if (riskLevel === 'Medium') {
            recommendations.immediate = this.getMediumRiskRecommendations(formData);
        }

        // Pain management recommendations (evidence-based from NHLBI guidelines)
        recommendations.pain_management = this.getPainManagementRecommendations(formData);
        
        // Prevention strategies (based on CDC and ASH guidelines)
        recommendations.prevention = this.getPreventionRecommendations(formData);
        
        // Monitoring and follow-up
        recommendations.monitoring = this.getMonitoringRecommendations(formData, riskLevel);
        
        // Lifestyle and supportive care
        recommendations.lifestyle = this.getLifestyleRecommendations(formData);

        return recommendations;
    }

    getHighRiskRecommendations(formData) {
        const recs = [
            {
                priority: 'critical',
                title: 'Seek Immediate Medical Attention',
                description: 'High crisis risk detected. Emergency evaluation is strongly recommended.',
                actions: [
                    'Go to emergency department or call emergency services',
                    'Bring list of current medications and recent medical history',
                    'Request sickle cell specialist if available',
                    'Do not delay seeking care'
                ],
                timeframe: 'Immediate (within 1-2 hours)'
            }
        ];

        // Add specific high-risk interventions
        const painLevel = parseInt(formData.painLevel || 0);
        if (painLevel >= 8) {
            recs.push({
                priority: 'critical',
                title: 'Severe Pain Crisis Management',
                description: 'Severe pain indicates potential vaso-occlusive crisis requiring immediate intervention.',
                actions: [
                    'Initiate aggressive pain management protocol',
                    'Consider IV opioid therapy (morphine or hydromorphone)',
                    'Maintain adequate hydration (oral or IV)',
                    'Monitor for complications (acute chest syndrome, stroke)'
                ],
                timeframe: 'Immediate'
            });
        }

        // Respiratory symptoms in high-risk
        if (parseInt(formData.shortness_of_breath || 0) === 1) {
            recs.push({
                priority: 'critical',
                title: 'Acute Chest Syndrome Risk',
                description: 'Respiratory symptoms with high crisis risk may indicate acute chest syndrome.',
                actions: [
                    'Immediate chest X-ray and arterial blood gas',
                    'Oxygen therapy if hypoxic',
                    'Consider incentive spirometry',
                    'Monitor for rapid deterioration'
                ],
                timeframe: 'Immediate'
            });
        }

        return recs;
    }

    getMediumRiskRecommendations(formData) {
        const recs = [
            {
                priority: 'high',
                title: 'Enhanced Monitoring and Early Intervention',
                description: 'Moderate crisis risk requires increased vigilance and prompt action.',
                actions: [
                    'Contact healthcare provider within 24 hours',
                    'Increase fluid intake to 2-3 liters daily',
                    'Monitor symptoms closely for worsening',
                    'Have emergency plan ready'
                ],
                timeframe: 'Within 24 hours'
            }
        ];

        const painLevel = parseInt(formData.painLevel || 0);
        if (painLevel >= 5) {
            recs.push({
                priority: 'high',
                title: 'Moderate Pain Management',
                description: 'Pain levels suggest early vaso-occlusive process requiring intervention.',
                actions: [
                    'Use prescribed pain medications as directed',
                    'Apply heat to affected areas',
                    'Gentle massage and relaxation techniques',
                    'Escalate to healthcare provider if pain increases'
                ],
                timeframe: 'Start immediately'
            });
        }

        return recs;
    }

    getPainManagementRecommendations(formData) {
        const recs = [];
        const painLevel = parseInt(formData.painLevel || 0);
        const riskLevel = this.analysisData.results.riskLevel;

        if (painLevel >= 7) {
            recs.push({
                priority: 'high',
                title: 'Multimodal Pain Management',
                description: 'Evidence-based approach combining pharmacological and non-pharmacological methods.',
                actions: [
                    'Immediate-release opioids for breakthrough pain (as prescribed)',
                    'NSAIDs if no contraindications (with caution)',
                    'Acetaminophen 1000mg every 6 hours',
                    'Heat therapy to affected areas'
                ],
                timeframe: 'Start immediately'
            });
        } else if (painLevel >= 4) {
            recs.push({
                priority: 'medium',
                title: 'Early Pain Intervention',
                description: 'Early intervention can prevent progression to severe crisis.',
                actions: [
                    'Acetaminophen or ibuprofen as first-line',
                    'Use prescribed breakthrough medications',
                    'Heat packs and gentle massage',
                    'Relaxation and breathing techniques'
                ],
                timeframe: 'Start at first sign of pain'
            });
        }

        // Add non-pharmacological recommendations
        recs.push({
            priority: 'medium',
            title: 'Non-Pharmacological Pain Relief',
            description: 'Complementary approaches that can enhance pain management.',
            actions: [
                'Deep breathing exercises and meditation',
                'Progressive muscle relaxation',
                'Distraction techniques (music, reading)',
                'Gentle stretching and yoga (when appropriate)'
            ],
            timeframe: 'Daily practice'
        });

        return recs;
    }

    getPreventionRecommendations(formData) {
        const recs = [
            {
                priority: 'high',
                title: 'Hydration Management',
                description: 'Adequate hydration is crucial for preventing vaso-occlusive crises.',
                actions: [
                    'Drink 8-10 glasses of water daily (2-3 liters)',
                    'Increase fluids during hot weather or illness',
                    'Limit caffeine and alcohol',
                    'Monitor urine color (should be pale yellow)'
                ],
                timeframe: 'Daily'
            },
            {
                priority: 'high',
                title: 'Infection Prevention',
                description: 'Infections are major triggers for sickle cell crises.',
                actions: [
                    'Stay up-to-date with vaccinations (pneumococcal, influenza, meningococcal)',
                    'Practice good hand hygiene',
                    'Avoid crowded areas during flu season',
                    'Seek prompt treatment for any infections'
                ],
                timeframe: 'Ongoing'
            }
        ];

        // Temperature regulation
        recs.push({
            priority: 'medium',
            title: 'Temperature and Environment Control',
            description: 'Extreme temperatures can trigger sickling.',
            actions: [
                'Avoid sudden temperature changes',
                'Stay warm in cold weather',
                'Avoid overheating in hot weather',
                'Use air conditioning or fans when needed'
            ],
            timeframe: 'Daily awareness'
        });

        // Medication adherence
        const adherence = parseFloat(formData.medicationAdherence || formData.medication_adherence || 1.0);
        if (adherence < 0.8) {
            recs.push({
                priority: 'high',
                title: 'Medication Adherence Optimization',
                description: 'Consistent medication use is critical for crisis prevention.',
                actions: [
                    'Take hydroxyurea as prescribed (if applicable)',
                    'Use pill organizers and reminders',
                    'Discuss barriers with healthcare provider',
                    'Consider long-acting formulations if available'
                ],
                timeframe: 'Daily'
            });
        }

        return recs;
    }

    getMonitoringRecommendations(formData, riskLevel) {
        const recs = [];

        if (riskLevel === 'High') {
            recs.push({
                priority: 'high',
                title: 'Intensive Monitoring Protocol',
                description: 'Close observation required for high-risk patients.',
                actions: [
                    'Check vitals every 4 hours',
                    'Monitor pain scores hourly',
                    'Watch for neurological changes',
                    'Track fluid intake and output'
                ],
                timeframe: 'Continuous until stable'
            });
        }

        recs.push({
            priority: 'medium',
            title: 'Regular Health Monitoring',
            description: 'Ongoing surveillance to detect early signs of complications.',
            actions: [
                'Monthly complete blood count (CBC)',
                'Annual echocardiogram and pulmonary function tests',
                'Regular ophthalmological exams',
                'Monitor for organ damage (kidney, liver function)'
            ],
            timeframe: 'As scheduled'
        });

        // Lab monitoring
        const wbc = parseFloat(formData.wbc_count || 8.5);
        const crp = parseFloat(formData.crp || 3.0);
        
        if (wbc > 15 || crp > 10) {
            recs.push({
                priority: 'high',
                title: 'Laboratory Follow-up',
                description: 'Abnormal lab values require monitoring.',
                actions: [
                    'Repeat CBC and inflammatory markers in 24-48 hours',
                    'Blood cultures if infection suspected',
                    'Consider comprehensive metabolic panel',
                    'Monitor hemoglobin and reticulocyte count'
                ],
                timeframe: 'Within 24-48 hours'
            });
        }

        return recs;
    }

    getLifestyleRecommendations(formData) {
        return [
            {
                priority: 'medium',
                title: 'Exercise and Activity Modification',
                description: 'Regular, appropriate exercise can improve overall health.',
                actions: [
                    'Engage in low-impact activities (walking, swimming)',
                    'Avoid high-intensity or contact sports',
                    'Stay hydrated during physical activity',
                    'Stop activity if pain or shortness of breath occurs'
                ],
                timeframe: 'Daily'
            },
            {
                priority: 'medium',
                title: 'Nutritional Support',
                description: 'Proper nutrition supports overall health and immune function.',
                actions: [
                    'Maintain balanced diet rich in fruits and vegetables',
                    'Consider folic acid supplementation (5mg daily)',
                    'Ensure adequate protein intake',
                    'Limit processed foods and excess sodium'
                ],
                timeframe: 'Daily'
            },
            {
                priority: 'low',
                title: 'Stress Management',
                description: 'Stress reduction can help prevent crisis triggers.',
                actions: [
                    'Practice mindfulness and meditation',
                    'Maintain regular sleep schedule (7-9 hours)',
                    'Consider counseling or support groups',
                    'Develop healthy coping strategies'
                ],
                timeframe: 'Ongoing'
            }
        ];
    }

    generateRiskExplanation() {
        const formData = this.analysisData.formData;
        const riskLevel = this.analysisData.results.riskLevel;
        const factors = [];
        let riskScore = 0;

        // Analyze pain level impact
        const painLevel = parseInt(formData.painLevel || 0);
        if (painLevel >= 8) {
            factors.push({
                name: 'Severe Pain Level',
                explanation: `Pain level of ${painLevel}/10 indicates significant vaso-occlusive process and is a strong predictor of crisis development.`,
                impact: 'high-risk',
                impactText: 'High Risk Factor',
                icon: '🔴'
            });
            riskScore += 3;
        } else if (painLevel >= 5) {
            factors.push({
                name: 'Moderate Pain Level',
                explanation: `Pain level of ${painLevel}/10 suggests early vaso-occlusive changes that could progress to crisis.`,
                impact: 'medium-risk',
                impactText: 'Moderate Risk Factor',
                icon: '🟡'
            });
            riskScore += 2;
        } else if (painLevel >= 2) {
            factors.push({
                name: 'Mild Pain Present',
                explanation: `Pain level of ${painLevel}/10 shows some discomfort but at manageable levels.`,
                impact: 'low-risk',
                impactText: 'Minor Risk Factor',
                icon: '🟢'
            });
            riskScore += 1;
        }

        // Analyze previous crisis history
        const previousCrises = parseInt(formData.priorCrises || formData.previous_crises || 0);
        if (previousCrises >= 3) {
            factors.push({
                name: 'Frequent Crisis History',
                explanation: `${previousCrises} previous crises indicate a pattern of recurrent vaso-occlusive episodes, increasing future risk.`,
                impact: 'high-risk',
                impactText: 'High Risk Factor',
                icon: '📊'
            });
            riskScore += 2;
        } else if (previousCrises >= 1) {
            factors.push({
                name: 'Previous Crisis History',
                explanation: `${previousCrises} previous crisis(es) show history of vaso-occlusive events but at manageable frequency.`,
                impact: 'medium-risk',
                impactText: 'Moderate Risk Factor',
                icon: '📈'
            });
            riskScore += 1;
        }

        // Analyze systemic symptoms
        const fever = parseInt(formData.fever || 0);
        const fatigue = parseInt(formData.fatigue || 0);
        const jointPain = parseInt(formData.jointPain || 0);
        
        if (fever === 1) {
            factors.push({
                name: 'Fever Present',
                explanation: 'Fever can indicate infection, which is a major trigger for sickle cell crises and requires immediate attention.',
                impact: 'high-risk',
                impactText: 'High Risk Factor',
                icon: '🌡️'
            });
            riskScore += 3;
        }

        if (fatigue === 1 && jointPain === 1) {
            factors.push({
                name: 'Multiple Systemic Symptoms',
                explanation: 'Combination of fatigue and joint pain suggests widespread vaso-occlusion affecting multiple body systems.',
                impact: 'medium-risk',
                impactText: 'Moderate Risk Factor',
                icon: '⚡'
            });
            riskScore += 2;
        } else if (fatigue === 1 || jointPain === 1) {
            const symptom = fatigue === 1 ? 'fatigue' : 'joint pain';
            factors.push({
                name: `${symptom.charAt(0).toUpperCase() + symptom.slice(1)} Present`,
                explanation: `${symptom.charAt(0).toUpperCase() + symptom.slice(1)} can be an early sign of developing vaso-occlusion.`,
                impact: 'low-risk',
                impactText: 'Minor Risk Factor',
                icon: '💤'
            });
            riskScore += 1;
        }

        // Analyze respiratory symptoms
        const shortness = parseInt(formData.shortness_of_breath || 0);
        if (shortness === 1) {
            factors.push({
                name: 'Respiratory Symptoms',
                explanation: 'Shortness of breath may indicate acute chest syndrome, a serious complication requiring immediate medical attention.',
                impact: 'high-risk',
                impactText: 'High Risk Factor',
                icon: '🫁'
            });
            riskScore += 3;
        }

        // Analyze laboratory values
        const wbc = parseFloat(formData.wbcCount || formData.wbc_count || 8.5);
        const crp = parseFloat(formData.crp || 3.0);
        const ldh = parseFloat(formData.ldh || 250);

        if (wbc > 15) {
            factors.push({
                name: 'Elevated White Blood Cell Count',
                explanation: `WBC count of ${wbc} indicates significant inflammation or infection, both crisis triggers.`,
                impact: 'high-risk',
                impactText: 'High Risk Factor',
                icon: '🧪'
            });
            riskScore += 2;
        } else if (wbc > 12) {
            factors.push({
                name: 'Mild WBC Elevation',
                explanation: `WBC count of ${wbc} shows mild inflammation that should be monitored.`,
                impact: 'medium-risk',
                impactText: 'Moderate Risk Factor',
                icon: '🧪'
            });
            riskScore += 1;
        }

        if (crp > 10) {
            factors.push({
                name: 'Elevated C-Reactive Protein',
                explanation: `CRP of ${crp} mg/L indicates significant inflammation in the body.`,
                impact: 'high-risk',
                impactText: 'High Risk Factor',
                icon: '🔬'
            });
            riskScore += 2;
        } else if (crp > 5) {
            factors.push({
                name: 'Mild CRP Elevation',
                explanation: `CRP of ${crp} mg/L shows mild inflammatory response.`,
                impact: 'medium-risk',
                impactText: 'Moderate Risk Factor',
                icon: '🔬'
            });
            riskScore += 1;
        }

        if (ldh > 400) {
            factors.push({
                name: 'Elevated LDH Level',
                explanation: `LDH of ${ldh} U/L indicates tissue damage, possibly from hemolysis or vaso-occlusion.`,
                impact: 'high-risk',
                impactText: 'High Risk Factor',
                icon: '📊'
            });
            riskScore += 2;
        }

        // Analyze medication adherence
        const adherence = parseFloat(formData.medicationAdherence || formData.medication_adherence || 1.0);
        if (adherence < 0.6) {
            factors.push({
                name: 'Poor Medication Adherence',
                explanation: `${Math.round(adherence * 100)}% adherence is below optimal levels, reducing protective effects of therapy.`,
                impact: 'high-risk',
                impactText: 'High Risk Factor',
                icon: '💊'
            });
            riskScore += 2;
        } else if (adherence < 0.8) {
            factors.push({
                name: 'Suboptimal Medication Adherence',
                explanation: `${Math.round(adherence * 100)}% adherence could be improved for better crisis prevention.`,
                impact: 'medium-risk',
                impactText: 'Moderate Risk Factor',
                icon: '💊'
            });
            riskScore += 1;
        }

        // Generate overall summary based on risk score and factors
        let summary = '';
        if (riskLevel === 'High') {
            summary = `Your assessment shows multiple significant risk factors (risk score: ${riskScore}) that strongly suggest a high likelihood of crisis development within 48 hours. The combination of ${factors.filter(f => f.impact === 'high-risk').length} high-risk factors requires immediate medical attention.`;
        } else if (riskLevel === 'Medium') {
            summary = `Your assessment indicates moderate risk (risk score: ${riskScore}) with several concerning factors present. While not immediately critical, these findings warrant enhanced monitoring and preventive measures.`;
        } else {
            summary = `Your assessment shows low overall risk (risk score: ${riskScore}) with ${factors.length > 0 ? 'minimal concerning factors' : 'no significant risk factors'}. Continue current management and maintain preventive strategies.`;
        }

        // Add protective factors if present
        const protectiveFactors = [];
        if (adherence >= 0.9) {
            protectiveFactors.push('Excellent medication adherence');
        }
        if (painLevel === 0) {
            protectiveFactors.push('No current pain');
        }
        if (fever === 0 && fatigue === 0 && jointPain === 0) {
            protectiveFactors.push('No systemic symptoms');
        }

        if (protectiveFactors.length > 0) {
            factors.push({
                name: 'Protective Factors',
                explanation: `These positive factors help reduce crisis risk: ${protectiveFactors.join(', ')}.`,
                impact: 'protective',
                impactText: 'Protective Factor',
                icon: '🛡️'
            });
        }

        return {
            factors: factors,
            summary: summary,
            riskScore: riskScore
        };
    }

    getCategoryTitle(category) {
        const titles = {
            immediate: 'Immediate Actions Required',
            pain_management: 'Pain Management',
            prevention: 'Crisis Prevention',
            monitoring: 'Monitoring & Follow-up',
            lifestyle: 'Lifestyle & Supportive Care'
        };
        return titles[category] || category;
    }

    getCategoryIcon(category) {
        const icons = {
            immediate: '🚨',
            pain_management: '💊',
            prevention: '🛡️',
            monitoring: '📊',
            lifestyle: '🌱'
        };
        return icons[category] || '📋';
    }

    evaluateOtherConcerns() {
        // Comprehensive medical evaluation for non-crisis concerns
        const formData = this.analysisData.formData;
        const riskLevel = this.analysisData.results.riskLevel;
        
        // Only show if crisis risk is LOW but concerning symptoms present
        if (riskLevel === 'Low') {
            const concerns = this.medicalConcernEvaluation(formData);
            
            if (concerns.length > 0) {
                this.displayOtherConcerns(concerns);
            }
        }
    }

    medicalConcernEvaluation(formData) {
        const concerns = [];

        const painLevel = parseInt(formData.painLevel || 0);
        if (painLevel >= 7) {
            concerns.push({
                type: 'pain_management',
                severity: 'moderate',
                description: 'Significant pain levels detected that may require attention even if crisis risk is low',
                recommendations: [
                    'Consider alternative pain management strategies',
                    'Evaluate for other potential pain causes',
                    'Monitor pain patterns and triggers'
                ]
            });
        }

        // Abnormal lab values with low crisis risk
        const wbc = parseFloat(formData.wbc_count || 8.5);
        const crp = parseFloat(formData.crp || 3.0);
        const ldh = parseFloat(formData.ldh || 250);
        
        if (wbc > 15 || crp > 10 || ldh > 400) {
            concerns.push({
                type: 'lab_abnormalities',
                severity: 'moderate',
                description: 'Laboratory values suggest possible inflammation or infection',
                recommendations: [
                    'Consider comprehensive lab workup',
                    'Evaluate for potential infections',
                    'Monitor inflammatory markers',
                    'Consider consultation with hematologist'
                ]
            });
        }

        // Respiratory symptoms with low crisis risk
        const shortness = parseInt(formData.shortness_of_breath || 0);
        const asthma = parseInt(formData.coexisting_asthma || 0);
        
        if (shortness === 1) {
            concerns.push({
                type: 'respiratory',
                severity: asthma ? 'high' : 'moderate',
                description: 'Respiratory symptoms require evaluation even with low crisis risk',
                recommendations: [
                    'Monitor oxygen saturation',
                    'Consider chest imaging if symptoms persist',
                    asthma ? 'Optimize asthma management' : 'Evaluate for acute chest syndrome',
                    'Ensure adequate hydration'
                ]
            });
        }

        // Fever with multiple symptoms
        const fever = parseInt(formData.fever || 0);
        const fatigue = parseInt(formData.fatigue || 0);
        const jointPain = parseInt(formData.jointPain || 0);
        
        if (fever === 1 && (fatigue === 1 || jointPain === 1)) {
            concerns.push({
                type: 'infection_screening',
                severity: 'high',
                description: 'Fever with systemic symptoms requires immediate evaluation',
                recommendations: [
                    'Seek immediate medical evaluation',
                    'Blood cultures and infection workup',
                    'Monitor temperature closely',
                    'Consider broad-spectrum antibiotics if indicated'
                ]
            });
        }

        // Poor medication adherence
        const adherence = parseFloat(formData.medication_adherence || 0.8);
        if (adherence < 0.6) {
            concerns.push({
                type: 'medication_adherence',
                severity: 'moderate',
                description: 'Poor medication adherence may lead to complications',
                recommendations: [
                    'Review medication regimen with healthcare provider',
                    'Identify barriers to adherence',
                    'Consider medication management strategies',
                    'Monitor for disease progression'
                ]
            });
        }

        return concerns;
    }

    displayOtherConcerns(concerns) {
        const card = document.getElementById('relatedConditionsCard');
        const container = document.getElementById('relatedConditions');
        
        if (card && container && concerns.length > 0) {
            card.style.display = 'block';
            
            let html = '<div class="medical-concerns">';
            html += '<p class="concerns-intro">While your crisis risk is low, the following areas may need attention:</p>';
            
            concerns.forEach(concern => {
                const severityClass = concern.severity === 'high' ? 'concern-high' : 
                                    concern.severity === 'moderate' ? 'concern-moderate' : 'concern-low';
                
                html += `
                    <div class="concern-item ${severityClass}">
                        <h4>${this.getConcernTitle(concern.type)}</h4>
                        <p>${concern.description}</p>
                        <ul class="concern-recommendations">
                `;
                
                concern.recommendations.forEach(rec => {
                    html += `<li>${rec}</li>`;
                });
                
                html += '</ul></div>';
            });
            
            html += '</div>';
            container.innerHTML = html;
        }
    }

    getConcernTitle(type) {
        const titles = {
            'pain_management': '🔴 Pain Management',
            'lab_abnormalities': '🧪 Laboratory Abnormalities',
            'respiratory': '🫁 Respiratory Concerns',
            'infection_screening': '🦠 Infection Screening',
            'medication_adherence': '💊 Medication Adherence'
        };
        return titles[type] || 'Medical Concern';
    }

    getRiskClass(riskLevel) {
        switch (riskLevel.toLowerCase()) {
            case 'high': return 'risk-high';
            case 'medium': return 'risk-medium';
            case 'low': return 'risk-low';
            default: return 'risk-unknown';
        }
    }

    getRecommendationIcon(recommendation, index) {
        const text = recommendation.toLowerCase();
        
        if (text.includes('immediate') || text.includes('emergency')) return '🚨';
        if (text.includes('contact') || text.includes('provider')) return '📞';
        if (text.includes('medication') || text.includes('adherence')) return '💊';
        if (text.includes('hydration') || text.includes('fluid')) return '💧';
        if (text.includes('rest') || text.includes('activity')) return '😴';
        if (text.includes('monitor') || text.includes('watch')) return '👁️';
        
        // Default icons based on index
        const icons = ['💡', '📋', '⚠️', '✅', '📊'];
        return icons[index % icons.length];
    }

    handleNoData() {
        // Redirect to symptom check if no data
        setTimeout(() => {
            window.location.href = 'symptom_check.html';
        }, 3000);
        
        document.body.innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <h2>No Analysis Data Found</h2>
                <p>Redirecting to symptom assessment...</p>
                <a href="symptom_check.html">Click here if not redirected automatically</a>
            </div>
        `;
    }
}

// Additional CSS for new elements
function addResultsCSS() {
    const style = document.createElement('style');
    style.textContent = `
        /* Risk Explanation Styles */
        .risk-explanation-section {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 25px;
            border-left: 4px solid #007bff;
        }
        
        .explanation-header h4 {
            color: #2c3e50;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .risk-factors-explanation {
            margin: 20px 0;
        }
        
        .factor-explanation {
            display: flex;
            align-items: flex-start;
            gap: 15px;
            padding: 15px;
            margin-bottom: 10px;
            border-radius: 8px;
            border-left: 4px solid;
        }
        
        .factor-explanation.high-risk {
            background: #fff5f5;
            border-left-color: #dc3545;
        }
        
        .factor-explanation.medium-risk {
            background: #fffbf0;
            border-left-color: #ffc107;
        }
        
        .factor-explanation.low-risk {
            background: #f0fff4;
            border-left-color: #28a745;
        }
        
        .factor-explanation.protective {
            background: #f0f8ff;
            border-left-color: #17a2b8;
        }
        
        .factor-icon {
            font-size: 24px;
            flex-shrink: 0;
        }
        
        .factor-details h5 {
            margin: 0 0 8px 0;
            color: #2c3e50;
            font-weight: 600;
        }
        
        .factor-details p {
            margin: 0 0 8px 0;
            color: #5a6c7d;
            line-height: 1.5;
        }
        
        .impact-label {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .high-risk .impact-label {
            background: #dc3545;
            color: white;
        }
        
        .medium-risk .impact-label {
            background: #ffc107;
            color: #212529;
        }
        
        .low-risk .impact-label {
            background: #28a745;
            color: white;
        }
        
        .protective .impact-label {
            background: #17a2b8;
            color: white;
        }
        
        .overall-explanation {
            background: white;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #6c757d;
            margin-top: 15px;
        }
        
        /* Recommendation Category Styles */
        .recommendation-category {
            margin-bottom: 25px;
        }
        
        .category-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 12px 12px 0 0;
            margin-bottom: 0;
        }
        
        .category-header h4 {
            margin: 0;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 18px;
        }
        
        .category-recommendations {
            background: white;
            border: 1px solid #e9ecef;
            border-top: none;
            border-radius: 0 0 12px 12px;
            padding: 0;
        }
        
        .recommendation-item {
            display: flex;
            align-items: flex-start;
            gap: 15px;
            padding: 20px;
            border-bottom: 1px solid #f1f3f4;
        }
        
        .recommendation-item:last-child {
            border-bottom: none;
        }
        
        .recommendation-item.critical {
            background: #fff5f5;
            border-left: 4px solid #dc3545;
        }
        
        .recommendation-item.high {
            background: #fffbf0;
            border-left: 4px solid #fd7e14;
        }
        
        .recommendation-item.medium {
            background: #f8f9fa;
            border-left: 4px solid #6f42c1;
        }
        
        .recommendation-item.low {
            background: #f0fff4;
            border-left: 4px solid #20c997;
        }
        
        .rec-priority {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            flex-shrink: 0;
        }
        
        .rec-priority.critical {
            background: #dc3545;
            color: white;
        }
        
        .rec-priority.high {
            background: #fd7e14;
            color: white;
        }
        
        .rec-priority.medium {
            background: #6f42c1;
            color: white;
        }
        
        .rec-priority.low {
            background: #20c997;
            color: white;
        }
        
        .rec-content {
            flex: 1;
        }
        
        .rec-content h5 {
            margin: 0 0 10px 0;
            color: #2c3e50;
            font-weight: 600;
            font-size: 16px;
        }
        
        .rec-content p {
            margin: 0 0 12px 0;
            color: #5a6c7d;
            line-height: 1.6;
        }
        
        .rec-actions {
            margin: 0;
            padding-left: 20px;
            color: #495057;
        }
        
        .rec-actions li {
            margin-bottom: 6px;
            line-height: 1.5;
        }
        
        .rec-timeframe {
            display: inline-block;
            background: #e9ecef;
            color: #495057;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
            margin-top: 10px;
        }
        
        .recommendation-item.critical .rec-timeframe {
            background: #dc3545;
            color: white;
        }
        
        .recommendation-item.high .rec-timeframe {
            background: #fd7e14;
            color: white;
        }
        
        /* Legacy styles */
        .risk-factors-list {
            margin-top: 15px;
        }
        
        .risk-factor-item {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            gap: 10px;
        }
        
        .factor-name {
            min-width: 120px;
            font-weight: 500;
        }
        
        .factor-bar {
            flex: 1;
            height: 8px;
            background-color: #e9ecef;
            border-radius: 4px;
            overflow: hidden;
        }
        
        .factor-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea, #764ba2);
            transition: width 0.3s ease;
        }
        
        .factor-value {
            min-width: 60px;
            text-align: right;
            font-size: 0.9em;
            color: var(--text-muted);
        }
        
        .urgency-indicator {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            margin-right: 15px;
        }
        
        .urgency-urgent { background-color: #dc3545; }
        .urgency-moderate { background-color: #ffc107; }
        .urgency-low { background-color: #28a745; }
        
        .model-info {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            border-left: 4px solid #667eea;
        }
        
        .model-info h5 {
            margin-bottom: 10px;
            color: #333;
        }
        
        .model-info p {
            margin: 5px 0;
            font-size: 0.9em;
        }

        .crisis-timeframe {
            margin-top: 15px;
            padding: 10px;
            border-radius: 4px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .crisis-timeframe.high-risk {
            background-color: #f8d7da;
            color: #721c24;
        }

        .crisis-timeframe.medium-risk {
            background-color: #fff3cd;
            color: #856404;
        }

        .crisis-timeframe.low-risk {
            background-color: #d4edda;
            color: #155724;
        }

        .medical-concerns {
            margin-top: 20px;
            padding: 15px;
            border-radius: 8px;
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
        }

        .concerns-intro {
            margin-bottom: 10px;
            font-weight: 500;
            color: #333;
        }

        .concern-item {
            margin-bottom: 15px;
            padding: 10px;
            border-radius: 4px;
            border: 1px solid transparent;
        }

        .concern-high {
            border-color: #dc3545;
            background-color: #f8d7da;
        }

        .concern-moderate {
            border-color: #ffc107;
            background-color: #fff3cd;
        }

        .concern-low {
            border-color: #28a745;
            background-color: #d4edda;
        }

        .concern-recommendations {
            margin-top: 5px;
            padding-left: 20px;
            list-style-type: disc;
        }
    `;
    document.head.appendChild(style);
}

// Global functions for result actions
function saveResults() {
    const analysisData = JSON.parse(localStorage.getItem('aetherflow_latest_analysis'));
    if (analysisData) {
        const dataStr = JSON.stringify(analysisData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `aetherflow-analysis-${Date.now()}.json`;
        link.click();
    }
}

function printResults() {
    window.print();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.results-container')) {
        addResultsCSS();
        new ResultsDisplayHandler();
    }
});
