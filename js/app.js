// AetherFlow Frontend JavaScript

// Global variables
let currentPage = window.location.pathname.split('/').pop() || 'index.html';
let analysisData = [];
let userSettings = JSON.parse(localStorage.getItem('aetherflow_settings')) || {};
let currentLanguage = userSettings.language || 'en';

// Load analysis data from localStorage on startup
function loadAnalysisData() {
    const storedData = localStorage.getItem('aetherflow_analyses');
    if (storedData) {
        try {
            analysisData = JSON.parse(storedData);
            console.log('Loaded analysis data from localStorage:', analysisData.length, 'analyses');
        } catch (error) {
            console.error('Error parsing analysis data from localStorage:', error);
            analysisData = [];
        }
    } else {
        console.log('No analysis data found in localStorage');
        analysisData = [];
    }
}

// Translation dictionary
const translations = {
    'en': {
        // Navigation
        'nav.home': 'Home',
        'nav.dashboard': 'Dashboard', 
        'nav.symptom_check': 'Crisis Assessment',
        'nav.settings': 'Settings',
        
        // Common
        'common.save': 'Save Changes',
        'common.cancel': 'Cancel',
        'common.submit': 'Submit',
        'common.back': 'Back',
        'common.next': 'Next',
        'common.loading': 'Loading...',
        
        // Settings page
        'settings.title': 'Settings',
        'settings.subtitle': 'Customize your AetherFlow experience',
        'settings.profile_info': 'Profile Information',
        'settings.health_info': 'Health Information',
        'settings.preferences': 'Preferences',
        'settings.privacy_security': 'Privacy & Security',
        'settings.language': 'Language',
        'settings.full_name': 'Full Name',
        'settings.full_name_placeholder': 'Enter your full name',
        'settings.email': 'Email Address',
        'settings.email_placeholder': 'Enter your email',
        'settings.birth_date': 'Date of Birth',
        'settings.gender': 'Gender',
        'settings.select_gender': 'Select Gender',
        'settings.male': 'Male',
        'settings.female': 'Female',
        'settings.other': 'Other',
        'settings.prefer_not_say': 'Prefer not to say',
        'settings.height': 'Height (cm)',
        'settings.height_placeholder': 'Enter height in cm',
        'settings.weight': 'Weight (kg)',
        'settings.weight_placeholder': 'Enter weight in kg',
        'settings.blood_type': 'Blood Type',
        'settings.select_blood_type': 'Select Blood Type',
        'settings.allergies': 'Known Allergies',
        'settings.allergies_placeholder': 'List any known allergies...',
        'settings.chronic_conditions': 'Chronic Conditions',
        'settings.chronic_conditions_placeholder': 'List any chronic medical conditions...',
        'settings.timezone': 'Timezone',
        'settings.english': 'English',
        'settings.swahili': 'Swahili',
        'settings.french': 'French',
        'settings.kinyarwanda': 'Kinyarwanda',
        'settings.pidgin': 'Pidgin English',
        'settings.est': 'Eastern Standard Time',
        'settings.pst': 'Pacific Standard Time',
        'settings.gmt': 'Greenwich Mean Time',
        'settings.enable_notifications': 'Enable notifications',
        'settings.share_data': 'Share anonymous data for research',
        'settings.dark_mode': 'Enable dark mode',
        'settings.dark_mode_enabled': 'Dark mode enabled',
        'settings.light_mode_enabled': 'Light mode enabled',
        'settings.online_ai': 'Use enhanced online AI (when available)',
        'settings.data_export': 'Data Export',
        'settings.data_export_desc': 'Download all your data in a portable format',
        'settings.export_data_btn': 'Export Data',
        'settings.delete_account': 'Delete Account',
        'settings.delete_account_desc': 'Permanently delete your account and all associated data',
        'settings.delete_account_btn': 'Delete Account',
        'settings.save_changes': 'Save Changes',
        'settings.reset_defaults': 'Reset to Defaults',
        
        // Footer
        'footer.copyright': '© 2025 AetherFlow. All rights reserved.',
        
        // Results page
        'page.results.title': 'AetherFlow - Analysis Results',
        'results.header': 'Analysis Results',
        'results.completed_on': 'Analysis completed on',
        'results.sickle_cell_title': 'Sickle Cell Crisis Risk Assessment',
        'results.moderate_risk': 'Moderate Risk',
        'results.risk_score': 'Risk Score',
        'results.primary_assessment': 'Primary Assessment',
        'results.loading': 'Loading...',
        'results.confidence_level': 'Confidence Level: ',
        'results.analysis_progress': 'Analysis in progress...',
        'results.recommendations': 'Medical Recommendations',
        'results.recommendations_intro': 'Based on your assessment results, here are evidence-based recommendations tailored to your risk level and symptoms.',
        'results.loading_recommendations': 'Loading recommendations...',
        'results.wait_recommendations': 'Please wait while we generate personalized recommendations.',
        'results.medical_care': 'When to Seek Medical Care',
        'results.assessment_progress': 'Assessment in progress...',
        'results.evaluating_urgency': 'Evaluating the urgency of your symptoms.',
        'results.seek_immediate': 'Seek immediate medical attention if you experience:',
        'results.other_concerns': 'Other Medical Considerations',
        
        // Mode Selection
        'page.mode_selection.title': 'AetherFlow - Select Mode',
        'mode.selection.title': 'Welcome to AetherFlow',
        'mode.selection.subtitle': 'Choose how you\'d like to use the sickle cell crisis assessment tool',
        'mode.selection.continue': 'Continue',
        'mode.selection.learn_more': 'Learn More',
        'mode.selection.note': 'You can change this setting anytime in the application settings.',
        
        'mode.single.title': 'Single Patient Use',
        'mode.single.description': 'Monitor one patient\'s sickle cell condition with medical supervision or guidance.',
        'mode.single.feature1': 'Individual patient monitoring',
        'mode.single.feature2': 'Medical assessment tools',
        'mode.single.feature3': 'Patient health insights',
        'mode.single.feature4': '24/7 AI medical assistant',
        
        'mode.multi.title': 'Healthcare Provider',
        'mode.multi.description': 'Manage multiple sickle cell patients and monitor their health status.',
        'mode.multi.feature1': 'Multiple patient profiles',
        'mode.multi.feature2': 'Patient management dashboard',
        'mode.multi.feature3': 'Comparative analysis',
        'mode.multi.feature4': 'Professional reporting',
        
        // Healthcare Setup
        'page.healthcare_setup.title': 'AetherFlow - Healthcare Setup',
        'setup.title': 'Healthcare Provider Setup',
        'setup.subtitle': 'Set up your profile and start managing your sickle cell patients',
        'setup.provider_info': 'Provider Information',
        'setup.provider_name': 'Full Name',
        'setup.provider_title': 'Professional Title',
        'setup.facility': 'Healthcare Facility',
        'setup.department': 'Department/Specialty',
        'setup.license': 'License Number (Optional)',
        'setup.quick_start': 'Quick Start Options',
        'setup.add_first_patient': 'Add Your First Patient',
        'setup.add_patient_desc': 'Start by adding a patient profile to begin monitoring',
        'setup.import_patients': 'Import Patient Data',
        'setup.import_desc': 'Import existing patient data from a CSV file',
        'setup.explore_demo': 'Explore Demo',
        'setup.demo_desc': 'See how the system works with sample patient data',
        'setup.features': 'What You Can Do',
        'setup.feature1_title': 'Patient Dashboard',
        'setup.feature1_desc': 'Monitor all patients from a central dashboard with real-time risk indicators',
        'setup.feature2_title': 'Crisis Assessment',
        'setup.feature2_desc': 'Conduct comprehensive crisis risk assessments for each patient',
        'setup.feature3_title': 'Trend Analysis',
        'setup.feature3_desc': 'Track health trends and patterns across multiple assessments',
        'setup.feature4_title': 'Professional Reports',
        'setup.feature4_desc': 'Generate detailed reports for medical records and consultations',
        'setup.complete': 'Complete Setup',
        'setup.skip': 'Skip for Now',
        
        // Healthcare Dashboard
        'page.healthcare_dashboard.title': 'AetherFlow - Healthcare Dashboard',
        'healthcare.dashboard.title': 'Healthcare Dashboard',
        'healthcare.dashboard.subtitle': 'Monitor your sickle cell patients and manage assessments',
        'healthcare.stats.total_patients': 'Total Patients',
        'healthcare.stats.high_risk': 'High Risk Patients',
        'healthcare.stats.today_assessments': 'Today\'s Assessments',
        'healthcare.stats.pending_followups': 'Pending Follow-ups',
        'healthcare.priority.title': 'High Priority Patients',
        'healthcare.priority.view_all': 'View All',
        'healthcare.priority.no_patients': 'No high priority patients at this time',
        'healthcare.recent.title': 'Recent Assessments',
        'healthcare.recent.view_all': 'View All',
        'healthcare.recent.no_assessments': 'No recent assessments',
        'healthcare.actions.title': 'Quick Actions',
        'healthcare.actions.add_patient': 'Add New Patient',
        'healthcare.actions.add_patient_desc': 'Register a new patient for monitoring',
        'healthcare.actions.start_assessment': 'Start Assessment',
        'healthcare.actions.start_assessment_desc': 'Begin crisis risk assessment for a patient',
        'healthcare.actions.generate_report': 'Generate Report',
        'healthcare.actions.generate_report_desc': 'Create patient or facility reports',
        'healthcare.actions.view_analytics': 'View Analytics',
        'healthcare.actions.view_analytics_desc': 'Analyze trends and patterns',
        'healthcare.schedule.title': 'Today\'s Schedule',
        'healthcare.schedule.sample1': 'Patient Assessment - John Doe',
        'healthcare.schedule.sample1_desc': 'Routine follow-up assessment',
        'healthcare.schedule.sample2': 'Review Reports',
        'healthcare.schedule.sample2_desc': 'Weekly patient status review',
        
        // Navigation
        'nav.change_mode': 'Change Mode',
        'nav.add_patient': '+ Add Patient',
        'nav.patients': 'Patients',
        'nav.assessments': 'Assessments',
        'nav.reports': 'Reports',
        'nav.cancel': 'Cancel',
        'results.related_conditions': 'Possible Related Conditions',
        'results.loading_conditions': 'Loading related conditions...',
        'results.save_results': 'Save Results',
        'results.print_results': 'Print Results',
        'results.new_analysis': 'New Analysis',
        'results.view_dashboard': 'View Dashboard',
        'results.disclaimer_title': '⚠️ Important Disclaimer',
        'results.disclaimer_text': 'This analysis is for informational purposes only and should not replace professional medical advice. Always consult with a healthcare provider for proper diagnosis and treatment.',
        
        // Health Companion
        'companion.online': 'Online',
        'companion.name': 'AetherFlow Assistant',
        'companion.status': 'Always here to help',
        'companion.welcome': 'Hi! I\'m your 24/7 health companion. How can I help you today?',
        'companion.welcome.results': 'I see you\'ve completed your crisis risk assessment. I\'m here to help answer any questions about your results or provide additional guidance.',
        'companion.action.symptoms': 'Report Symptoms',
        'companion.action.emergency': 'Emergency Help',
        'companion.action.advice': 'Health Advice',
        'companion.action.explain_results': 'Explain Results',
        'companion.action.next_steps': 'Next Steps',
        'companion.input.placeholder': 'Type your health question...',
        'companion.suggestion.pain': 'I have pain',
        'companion.suggestion.fever': 'I have fever',
        'companion.suggestion.tired': 'I feel tired',
        'companion.suggestion.emergency': 'Emergency',
        'companion.suggestion.results': 'What do my results mean?',
        'companion.suggestion.prevention': 'How to prevent crisis?',
        'companion.suggestion.doctor': 'Should I see a doctor?',
        
        // Home page
        'home.welcome': 'Welcome to AetherFlow',
        'home.subtitle': 'Your intelligent health companion for symptom analysis and wellness tracking',
        'home.start_assessment': 'Start crisis assessment',
        'home.view_dashboard': 'View Dashboard',
        'home.symptom_analysis': 'Symptom Analysis',
        'home.symptom_analysis_desc': 'Get intelligent insights about your symptoms using advanced AI technology',
        'home.health_dashboard': 'Health Dashboard',
        'home.health_dashboard_desc': 'Track your health metrics and view comprehensive reports',
        'home.personalized_care': 'Personalized Care',
        'home.personalized_care_desc': 'Customize your experience with personalized health recommendations',
        
        // Dashboard page
        'dashboard.title': 'Health Dashboard',
        'dashboard.welcome': 'Welcome back! Here\'s your health overview.',
        'dashboard.total_analyses': 'Total Analyses',
        'dashboard.this_month': 'This Month',
        'dashboard.health_score': 'Health Score',
        'dashboard.status': 'Status',
        'dashboard.recent_analyses': 'Recent Analyses',
        'dashboard.no_analyses': 'No analyses yet',
        'dashboard.start_first': 'Start your first symptom check',
        'dashboard.ai_insights': 'Get AI-powered health insights',
        'dashboard.pending': 'Pending',
        'dashboard.new_analysis': 'New Analysis',
        'dashboard.health_trends': 'Health Trends',
        'dashboard.trends_placeholder': '📈 Health trends will appear here after you complete a few analyses',
        'dashboard.quick_actions': 'Quick Actions',
        'dashboard.export_data': 'Export Data',
        'dashboard.health_insights': 'Health Insights',
        'dashboard.welcome_insight': 'Welcome to AetherFlow!',
        'dashboard.welcome_insight_desc': 'Complete your first symptom analysis to get personalized health insights.',
        
        // Symptom check - simplified keys
        'title': 'Sickle Cell Crisis Risk Assessment',
        'subtitle': 'A comprehensive tool to assess your symptoms and sickle cell crisis risk',
        'demographics': 'Patient Information',
        'age': 'Age',
        'sex': 'Sex',
        'genotype': 'Sickle Cell Genotype',
        'section_title': 'Current Symptoms',
        'pain_level_label': 'Current pain level (0-10 scale)',
        'no_pain': 'No Pain',
        'moderate_pain': 'Moderate',
        'severe_pain': 'Severe',
        'joint_pain_question': 'Is there any joint pain or stiffness?',
        'fatigue_question': 'Is there unusual tiredness or fatigue?',
        'fever_question': 'Is there a fever or feeling feverish?',
        'shortness_breath': 'Do you have shortness of breath?',
        'dactylitis': 'Do you have swelling in fingers or toes (dactylitis)?',
        'yes': 'Yes',
        'no': 'No',
        'hydration_question': 'What is the current hydration level?',
        'please_select': 'Please select...',
        'hydration_low': 'Low - Not drinking enough fluids',
        'hydration_normal': 'Normal - Drinking regularly',
        'hydration_high': 'High - Drinking plenty of fluids',
        'medical_history': 'Medical History & Lab Values',
        'hbf_percent': 'Fetal Hemoglobin (HbF) %',
        'wbc_count': 'White Blood Cell Count (x10⁹/L)',
        'ldh': 'LDH Level (U/L)',
        'crp': 'C-Reactive Protein (mg/L)',
        'prior_crises_question': 'How many sickle cell crises occurred in the past year?',
        'crises_0': '0 - No previous crises',
        'crises_1': '1 crisis',
        'crises_2': '2 crises',
        'crises_3': '3 crises',
        'history_acs': 'History of Acute Chest Syndrome?',
        'coexisting_asthma': 'Do you have asthma?',
        'medications_lifestyle': 'Medications & Lifestyle',
        'hydroxyurea': 'Are you taking Hydroxyurea?',
        'pain_medication': 'Are you currently taking pain medication?',
        'medication_adherence': 'Medication Adherence (0-1 scale)',
        'sleep_quality': 'Sleep Quality (1-6 scale)',
        'stress_level': 'Current Stress Level (0-10)',
        'temperature': 'Current Temperature (°C)',
        'humidity': 'Humidity (%)',
        'begin_assessment': 'Begin Assessment',
        'clear_form': 'Clear Form',
        
        // Notifications
        'notification.language_changed': 'Language changed to',
        'notification.settings_saved': 'Settings saved successfully',
        'notification.error': 'An error occurred'
    },
    
    'sw': {
        // Navigation (Swahili)
        'nav.home': 'Nyumbani',
        'nav.dashboard': 'Dashibodi',
        'nav.symptom_check': 'Tathmini ya Dharura',
        'nav.settings': 'Mipangilio',
        
        // Common
        'common.save': 'Hifadhi Mabadiliko',
        'common.cancel': 'Ghairi',
        'common.submit': 'Wasilisha',
        'common.back': 'Rudi',
        'common.next': 'Ifuatayo',
        'common.loading': 'Inapakia...',
        
        // Settings page
        'settings.title': 'Mipangilio',
        'settings.subtitle': 'Badilisha uzoefu wako wa AetherFlow',
        'settings.profile_info': 'Taarifa za Profaili',
        'settings.health_info': 'Taarifa za Afya',
        'settings.preferences': 'Mapendeleo',
        'settings.privacy_security': 'Faragha na Usalama',
        'settings.language': 'Lugha',
        'settings.full_name': 'Jina Kamili',
        'settings.full_name_placeholder': 'Ingiza jina lako kamili',
        'settings.email': 'Anwani ya Barua Pepe',
        'settings.email_placeholder': 'Ingiza barua pepe yako',
        'settings.birth_date': 'Tarehe ya Kuzaliwa',
        'settings.gender': 'Jinsia',
        'settings.select_gender': 'Chagua Jinsia',
        'settings.male': 'Mwanaume',
        'settings.female': 'Mwanamke',
        'settings.other': 'Nyingine',
        'settings.prefer_not_say': 'Sipendelei kusema',
        'settings.height': 'Urefu (sm)',
        'settings.height_placeholder': 'Ingiza urefu kwa sentimita',
        'settings.weight': 'Uzito (kg)',
        'settings.weight_placeholder': 'Ingiza uzito kwa kilo',
        'settings.blood_type': 'Aina ya Damu',
        'settings.select_blood_type': 'Chagua Aina ya Damu',
        'settings.allergies': 'Mzio Unaojulikana',
        'settings.allergies_placeholder': 'Orodhesha mzio wowote unaojua...',
        'settings.chronic_conditions': 'Hali za Kudumu za Kiafya',
        'settings.chronic_conditions_placeholder': 'Orodhesha hali zoyote za kudumu za kiafya...',
        'settings.timezone': 'Wakati wa Eneo',
        'settings.english': 'Kiingereza',
        'settings.swahili': 'Kiswahili',
        'settings.french': 'Kifaransa',
        'settings.kinyarwanda': 'Kinyarwanda',
        
        // Mode Selection (Swahili)
        'page.mode_selection.title': 'AetherFlow - Chagua Njia',
        'mode.selection.title': 'Karibu AetherFlow',
        'mode.selection.subtitle': 'Chagua jinsi unavyotaka kutumia kifaa cha tathmini ya dharura ya ugonjwa wa damu ya sickle cell',
        'mode.selection.continue': 'Endelea',
        'mode.selection.learn_more': 'Jifunze Zaidi',
        'mode.selection.note': 'Unaweza kubadilisha mpangilio huu wakati wowote katika mipangilio ya programu.',
        
        'mode.single.title': 'Matumizi ya Mgonjwa Mmoja',
        'mode.single.description': 'Fuatilia hali ya ugonjwa wa sickle cell wa mgonjwa mmoja kwa usimamizi au mwongozo wa kimatibabu.',
        'mode.single.feature1': 'Ufuatiliaji wa mgonjwa binafsi',
        'mode.single.feature2': 'Vifaa vya tathmini ya kimatibabu',
        'mode.single.feature3': 'Maarifa ya afya ya mgonjwa',
        'mode.single.feature4': 'Msaidizi wa kimatibabu wa AI wa saa 24/7',
        
        'mode.multi.title': 'Mtoa Huduma za Afya',
        'mode.multi.description': 'Simamia wagonjwa wengi wa sickle cell na ufuatilie hali yao ya afya.',
        'mode.multi.feature1': 'Wasifu wa wagonjwa wengi',
        'mode.multi.feature2': 'Dashibodi ya usimamizi wa wagonjwa',
        'mode.multi.feature3': 'Uchambuzi wa kulinganisha',
        'mode.multi.feature4': 'Ripoti za kitaaluma',
        'settings.pidgin': 'Pidgin English',
        'settings.est': 'Wakati wa Kawaida wa Mashariki',
        'settings.pst': 'Wakati wa Kawaida wa Pacific',
        'settings.gmt': 'Wakati wa Greenwich',
        'settings.enable_notifications': 'Wezesha arifa',
        'settings.share_data': 'Shiriki data isiyo ya kibinafsi kwa utafiti',
        'settings.dark_mode': 'Wezesha hali ya giza',
        'settings.dark_mode_enabled': 'Hali ya giza imewezeshwa',
        'settings.light_mode_enabled': 'Hali ya mwanga imewezeshwa',
        'settings.online_ai': 'Tumia AI ya mtandaoni iliyoboreshwa (inapotoka)',
        'settings.data_export': 'Hamisha Data',
        'settings.data_export_desc': 'Pakua data yako yote katika muundo wa kubebeka',
        'settings.export_data_btn': 'Hamisha Data',
        'settings.delete_account': 'Futa Akaunti',
        'settings.delete_account_desc': 'Futa kabisa akaunti yako na data zote zinazohusiana',
        'settings.delete_account_btn': 'Futa Akaunti',
        'settings.save_changes': 'Hifadhi Mabadiliko',
        'settings.reset_defaults': 'Rejesha kwa Chaguo-msingi',
        
        // Footer
        'footer.copyright': '© 2025 AetherFlow. Haki zote zimehifadhiwa.',
        
        // Results page
        'page.results.title': 'AetherFlow - Matokeo ya Uchanganuzi',
        'results.header': 'Matokeo ya Uchanganuzi',
        'results.completed_on': 'Uchanganuzi umekamilika tarehe',
        'results.sickle_cell_title': 'Tathmini ya Hatari ya Crisis ya Seli za Kwanza',
        'results.moderate_risk': 'Hatari ya Wastani',
        'results.risk_score': 'Alama ya Hatari',
        'results.primary_assessment': 'Tathmini ya Msingi',
        'results.loading': 'Inapakia...',
        'results.confidence_level': 'Kiwango cha Imani: ',
        'results.analysis_progress': 'Uchanganuzi unaendelea...',
        'results.recommendations': 'Mapendekezo ya Kiafya',
        'results.recommendations_intro': 'Kulingana na matokeo ya tathmini yako, hapa kuna mapendekezo ya kimatibabu yanayotegemea kiwango chako cha hatari na dalili.',
        'results.loading_recommendations': 'Inapakia mapendekezo...',
        'results.wait_recommendations': 'Tafadhali subiri tunapotayarisha mapendekezo ya kibinafsi.',
        'results.medical_care': 'Wakati wa Kutafuta Huduma za Kimatibabu',
        'results.assessment_progress': 'Tathmini inaendelea...',
        'results.evaluating_urgency': 'Tunahodhi dharura ya dalili zako.',
        'results.seek_immediate': 'Tafuta uongozi wa kimatibabu wa haraka ukipata:',
        'results.other_concerns': 'Mambo Mengine ya Kimatibabu',
        'results.related_conditions': 'Hali Zinazoweza Kuhusiana',
        'results.loading_conditions': 'Inapakia hali zinazohusiana...',
        'results.save_results': 'Hifadhi Matokeo',
        'results.print_results': 'Chapisha Matokeo',
        'results.new_analysis': 'Uchanganuzi Mpya',
        'results.view_dashboard': 'Ona Dashibodi',
        'results.disclaimer_title': '⚠️ Onyo Muhimu',
        'results.disclaimer_text': 'Uchanganuzi huu ni kwa madhumuni ya habari tu na haupasiwi kuchukua nafasi ya ushauri wa kimatibabu wa kitaalamu. Daima shauri na mtoa huduma za afya kwa utambuzi na matibabu sahihi.',
        
        // Health Companion
        'companion.online': 'Mtandaoni',
        'companion.name': 'Msaidizi wa AetherFlow',
        'companion.status': 'Daima hapa kukusaidia',
        'companion.welcome': 'Hujambo! Mimi ni mwenzi wako wa afya wa masaa 24/7. Je, ninawezaje kukusaidia leo?',
        'companion.welcome.results': 'Naona umemaliza tathmini yako ya hatari ya machafuko. Nipo hapa kusaidia kujibu maswali yoyote kuhusu matokeo yako au kutoa mwongozo wa ziada.',
        'companion.action.symptoms': 'Ripoti Dalili',
        'companion.action.emergency': 'Msaada wa Dharura',
        'companion.action.advice': 'Ushauri wa Afya',
        'companion.action.explain_results': 'Eleza Matokeo',
        'companion.action.next_steps': 'Hatua Zinazofuata',
        'companion.input.placeholder': 'Andika swali lako la afya...',
        'companion.suggestion.pain': 'Nina maumivu',
        'companion.suggestion.fever': 'Nina homa',
        'companion.suggestion.tired': 'Nahisi uchovu',
        'companion.suggestion.emergency': 'Dharura',
        'companion.suggestion.results': 'Matokeo yangu yana maana gani?',
        'companion.suggestion.prevention': 'Jinsi ya kuzuia machafuko?',
        'companion.suggestion.doctor': 'Je, nimuone daktari?',
        
        // Home page
        'home.welcome': 'Karibu AetherFlow',
        'home.subtitle': 'Mwenzi wako wa akili wa afya kwa uchanganuzi wa dalili na ufuatiliaji wa ustawi',
        'home.start_assessment': 'Anza tathmini ya dharura',
        'home.view_dashboard': 'Ona Dashibodi',
        'home.symptom_analysis': 'Uchanganuzi wa Dalili',
        'home.symptom_analysis_desc': 'Pata maarifa ya akili kuhusu dalili zako kwa kutumia teknolojia ya hali ya juu ya AI',
        'home.health_dashboard': 'Dashibodi ya Afya',
        'home.health_dashboard_desc': 'Fuatilia vipimo vyako vya afya na uone ripoti za kina',
        'home.personalized_care': 'Huduma ya Kibinafsi',
        'home.personalized_care_desc': 'Badilisha uzoefu wako kwa mapendekezo ya kibinafsi ya afya',
        
        // Dashboard page
        'dashboard.title': 'Dashibodi ya Afya',
        'dashboard.welcome': 'Karibu tena! Hii ni muhtasari wako wa afya.',
        'dashboard.total_analyses': 'Jumla ya Uchanganuzi',
        'dashboard.this_month': 'Mwezi Huu',
        'dashboard.health_score': 'Alama ya Afya',
        'dashboard.status': 'Hali',
        'dashboard.recent_analyses': 'Uchanganuzi wa Hivi Karibuni',
        'dashboard.no_analyses': 'Hakuna uchanganuzi bado',
        'dashboard.start_first': 'Anza ukaguzi wako wa kwanza wa dalili',
        'dashboard.ai_insights': 'Pata maarifa ya afya yanayoendeshwa na AI',
        'dashboard.pending': 'Inasubiri',
        'dashboard.new_analysis': 'Uchanganuzi Mpya',
        'dashboard.health_trends': 'Mwelekeo wa Afya',
        'dashboard.trends_placeholder': '📈 Mwelekeo wa afya utaonekana hapa baada ya kukamilisha uchanganuzi machache',
        'dashboard.quick_actions': 'Vitendo vya Haraka',
        'dashboard.export_data': 'Hamisha Data',
        'dashboard.health_insights': 'Maarifa ya Afya',
        'dashboard.welcome_insight': 'Karibu AetherFlow!',
        'dashboard.welcome_insight_desc': 'Kamilisha uchanganuzi wako wa kwanza wa dalili ili upate maarifa ya kibinafsi ya afya.',
        
        // Symptom check
        // Symptom check - simplified keys (Swahili)
        'title': 'Tathmini ya Hatari ya Machafuko ya Ugonjwa wa Damu',
        'subtitle': 'Kifaa cha kina cha kutathmini dalili zako na hatari ya machafuko ya ugonjwa wa damu',
        'demographics': 'Maelezo ya Mgonjwa',
        'age': 'Umri',
        'sex': 'Jinsia',
        'genotype': 'Jinsi ya Damu',
        'section_title': 'Dalili za Sasa',
        'pain_level_label': 'Kiwango cha uchungu sasa (kiwango cha 0-10)',
        'no_pain': 'Hakuna Uchungu',
        'moderate_pain': 'Kati',
        'severe_pain': 'Mkuu',
        'joint_pain_question': 'Je, kuna uchungu wa viungo au ugumu?',
        'fatigue_question': 'Je, kuna uchovu usio wa kawaida au unyonge?',
        'fever_question': 'Je, kuna homa au hisia ya homa?',
        'shortness_breath': 'Je, una upungufu wa pumzi?',
        'dactylitis': 'Je, una uvimbe wa vidole vya mikono au miguu?',
        'yes': 'Ndiyo',
        'no': 'Hapana',
        'hydration_question': 'Kiwango cha umnyevu sasa ni kipi?',
        'please_select': 'Tafadhali chagua...',
        'hydration_low': 'Chini - Hanyui maji ya kutosha',
        'hydration_normal': 'Kawaida - Ananyua maji ipasavyo',
        'hydration_high': 'Juu - Ananyua maji mengi',
        'medical_history': 'Historia ya Matibabu na Majaribio',
        'hbf_percent': 'Hemoglobini ya Fetali (HbF) %',
        'wbc_count': 'Hesabu ya Seli Nyeupe za Damu',
        'ldh': 'Kiwango cha LDH',
        'crp': 'Protini ya C-Reactive',
        'prior_crises_question': 'Machafuko mangapi ya ugonjwa wa damu yamepata mwaka uliopita?',
        'crises_0': '0 - Hakuna machafuko ya awali',
        'crises_1': 'Machafuko 1',
        'crises_2': 'Machafuko 2',
        'crises_3': 'Machafuko 3',
        'history_acs': 'Historia ya Ugonjwa wa Kifua Mkali?',
        'coexisting_asthma': 'Je, una pumu?',
        'medications_lifestyle': 'Dawa na Maisha',
        'hydroxyurea': 'Je, unachukua Hydroxyurea?',
        'pain_medication': 'Je, unachukua dawa ya uchungu sasa?',
        'medication_adherence': 'Uzingatiaji wa Dawa (kiwango cha 0-1)',
        'sleep_quality': 'Ubora wa Usingizi (kiwango cha 1-6)',
        'stress_level': 'Kiwango cha Msongo wa Mawazo (0-10)',
        'temperature': 'Joto la Mazingira (°C)',
        'humidity': 'Unyevu (%)',
        'begin_assessment': 'Anza Tathmini',
        'clear_form': 'Safisha Fomu',
        
        // Notifications
        'notification.language_changed': 'Lugha imebadilishwa kuwa',
        'notification.settings_saved': 'Mipangilio imehifadhiwa kwa ufanisi',
        'notification.error': 'Hitilafu imetokea'
    },
    
    'fr': {
        // Navigation (French)
        'nav.home': 'Accueil',
        'nav.dashboard': 'Tableau de bord',
        'nav.symptom_check': 'Évaluation de crise',
        'nav.settings': 'Paramètres',
        
        // Common
        'common.save': 'Enregistrer les modifications',
        'common.cancel': 'Annuler',
        'common.submit': 'Soumettre',
        'common.back': 'Retour',
        'common.next': 'Suivant',
        'common.loading': 'Chargement...',
        
        // Settings page
        'settings.title': 'Paramètres',
        'settings.subtitle': 'Personnalisez votre expérience AetherFlow',
        'settings.profile_info': 'Informations du profil',
        'settings.health_info': 'Informations de santé',
        'settings.preferences': 'Préférences',
        'settings.privacy_security': 'Confidentialité et sécurité',
        'settings.language': 'Langue',
        'settings.full_name': 'Nom complet',
        'settings.full_name_placeholder': 'Entrez votre nom complet',
        'settings.email': 'Adresse e-mail',
        'settings.email_placeholder': 'Entrez votre e-mail',
        'settings.birth_date': 'Date de naissance',
        'settings.gender': 'Genre',
        'settings.select_gender': 'Sélectionner le genre',
        'settings.male': 'Homme',
        'settings.female': 'Femme',
        'settings.other': 'Autre',
        'settings.prefer_not_say': 'Préfère ne pas dire',
        'settings.height': 'Taille (cm)',
        'settings.height_placeholder': 'Entrez la taille en cm',
        'settings.weight': 'Poids (kg)',
        'settings.weight_placeholder': 'Entrez le poids en kg',
        'settings.blood_type': 'Groupe sanguin',
        'settings.select_blood_type': 'Sélectionner le groupe sanguin',
        'settings.allergies': 'Allergies connues',
        'settings.allergies_placeholder': 'Listez les allergies connues...',
        'settings.chronic_conditions': 'Conditions chroniques',
        'settings.chronic_conditions_placeholder': 'Listez les conditions médicales chroniques...',
        'settings.timezone': 'Fuseau horaire',
        'settings.english': 'Anglais',
        'settings.swahili': 'Swahili',
        'settings.french': 'Français',
        'settings.kinyarwanda': 'Kinyarwanda',
        'settings.pidgin': 'Pidgin anglais',
        
        // Mode Selection (French)
        'page.mode_selection.title': 'AetherFlow - Sélectionner le Mode',
        'mode.selection.title': 'Bienvenue sur AetherFlow',
        'mode.selection.subtitle': 'Choisissez comment vous souhaitez utiliser l\'outil d\'évaluation des crises drépanocytaires',
        'mode.selection.continue': 'Continuer',
        'mode.selection.learn_more': 'En Savoir Plus',
        'mode.selection.note': 'Vous pouvez modifier ce paramètre à tout moment dans les paramètres de l\'application.',
        
        'mode.single.title': 'Utilisation Patient Unique',
        'mode.single.description': 'Surveiller la condition drépanocytaire d\'un patient sous supervision ou orientation médicale.',
        'mode.single.feature1': 'Surveillance individuelle du patient',
        'mode.single.feature2': 'Outils d\'évaluation médicale',
        'mode.single.feature3': 'Aperçus de santé du patient',
        'mode.single.feature4': 'Assistant médical IA 24h/24 et 7j/7',
        
        'mode.multi.title': 'Professionnel de Santé',
        'mode.multi.description': 'Gérer plusieurs patients drépanocytaires et surveiller leur état de santé.',
        'mode.multi.feature1': 'Profils de patients multiples',
        'mode.multi.feature2': 'Tableau de bord de gestion des patients',
        'mode.multi.feature3': 'Analyse comparative',
        'mode.multi.feature4': 'Rapports professionnels',
        'settings.est': 'Heure standard de l\'Est',
        'settings.pst': 'Heure standard du Pacifique',
        'settings.gmt': 'Heure de Greenwich',
        'settings.enable_notifications': 'Activer les notifications',
        'settings.share_data': 'Partager des données anonymes pour la recherche',
        'settings.dark_mode': 'Activer le mode sombre',
        'settings.dark_mode_enabled': 'Mode sombre activé',
        'settings.light_mode_enabled': 'Mode clair activé',
        'settings.online_ai': 'Utiliser l\'IA en ligne améliorée (si disponible)',
        'settings.data_export': 'Exportation de données',
        'settings.data_export_desc': 'Téléchargez toutes vos données dans un format portable',
        'settings.export_data_btn': 'Exporter les données',
        'settings.delete_account': 'Supprimer le compte',
        'settings.delete_account_desc': 'Supprimez définitivement votre compte et toutes les données associées',
        'settings.delete_account_btn': 'Supprimer le compte',
        'settings.save_changes': 'Enregistrer les modifications',
        'settings.reset_defaults': 'Rétablir les paramètres par défaut',
        
        // Footer
        'footer.copyright': '© 2025 AetherFlow. Tous droits réservés.',
        
        // Results page
        'page.results.title': 'AetherFlow - Résultats d\'analyse',
        'results.header': 'Résultats d\'analyse',
        'results.completed_on': 'Analyse terminée le',
        'results.sickle_cell_title': 'Évaluation du risque de crise drépanocytaire',
        'results.moderate_risk': 'Risque modéré',
        'results.risk_score': 'Score de risque',
        'results.primary_assessment': 'Évaluation primaire',
        'results.loading': 'Chargement...',
        'results.confidence_level': 'Niveau de confiance : ',
        'results.analysis_progress': 'Analyse en cours...',
        'results.recommendations': 'Recommandations Médicales',
        'results.recommendations_intro': 'Basé sur les résultats de votre évaluation, voici des recommandations fondées sur des preuves adaptées à votre niveau de risque et à vos symptômes.',
        'results.loading_recommendations': 'Chargement des recommandations...',
        'results.wait_recommendations': 'Veuillez patienter pendant que nous générons des recommandations personnalisées.',
        'results.medical_care': 'Quand consulter un médecin',
        'results.assessment_progress': 'Évaluation en cours...',
        'results.evaluating_urgency': 'Évaluation de l\'urgence de vos symptômes.',
        'results.seek_immediate': 'Consultez immédiatement un médecin si vous ressentez :',
        'results.other_concerns': 'Autres Considérations Médicales',
        'results.related_conditions': 'Conditions possiblement liées',
        'results.loading_conditions': 'Chargement des conditions liées...',
        'results.save_results': 'Enregistrer les résultats',
        'results.print_results': 'Imprimer les résultats',
        'results.new_analysis': 'Nouvelle analyse',
        'results.view_dashboard': 'Voir le tableau de bord',
        'results.disclaimer_title': '⚠️ Avertissement important',
        'results.disclaimer_text': 'Cette analyse est à titre informatif uniquement et ne doit pas remplacer les conseils médicaux professionnels. Consultez toujours un professionnel de la santé pour un diagnostic et un traitement appropriés.',
        
        // Health Companion
        'companion.online': 'En ligne',
        'companion.name': 'Assistant AetherFlow',
        'companion.status': 'Toujours là pour vous aider',
        'companion.welcome': 'Salut! Je suis votre compagnon santé 24h/24 et 7j/7. Comment puis-je vous aider aujourd\'hui?',
        'companion.welcome.results': 'Je vois que vous avez terminé votre évaluation du risque de crise. Je suis là pour aider à répondre à toute question sur vos résultats ou fournir des conseils supplémentaires.',
        'companion.action.symptoms': 'Signaler des symptômes',
        'companion.action.emergency': 'Aide d\'urgence',
        'companion.action.advice': 'Conseils de santé',
        'companion.action.explain_results': 'Expliquer les résultats',
        'companion.action.next_steps': 'Prochaines étapes',
        'companion.input.placeholder': 'Tapez votre question de santé...',
        'companion.suggestion.pain': 'J\'ai mal',
        'companion.suggestion.fever': 'J\'ai de la fièvre',
        'companion.suggestion.tired': 'Je suis fatigué',
        'companion.suggestion.emergency': 'Urgence',
        'companion.suggestion.results': 'Que signifient mes résultats?',
        'companion.suggestion.prevention': 'Comment prévenir une crise?',
        'companion.suggestion.doctor': 'Dois-je voir un médecin?',
        
        // Home page
        'home.welcome': 'Bienvenue sur AetherFlow',
        'home.subtitle': 'Votre compagnon de santé intelligent pour l\'analyse des symptômes et le suivi du bien-être',
        'home.start_assessment': 'Commencer l\'évaluation de crise',
        'home.view_dashboard': 'Voir le tableau de bord',
        'home.symptom_analysis': 'Analyse des symptômes',
        'home.symptom_analysis_desc': 'Obtenez des informations intelligentes sur vos symptômes grâce à la technologie IA avancée',
        'home.health_dashboard': 'Tableau de bord santé',
        'home.health_dashboard_desc': 'Suivez vos indicateurs de santé et consultez des rapports complets',
        'home.personalized_care': 'Soins personnalisés',
        'home.personalized_care_desc': 'Personnalisez votre expérience avec des recommandations de santé personnalisées',
        
        // Dashboard page
        'dashboard.title': 'Tableau de bord santé',
        'dashboard.welcome': 'Bon retour ! Voici votre aperçu santé.',
        'dashboard.total_analyses': 'Analyses totales',
        'dashboard.this_month': 'Ce mois-ci',
        'dashboard.health_score': 'Score de santé',
        'dashboard.status': 'Statut',
        'dashboard.recent_analyses': 'Analyses récentes',
        'dashboard.no_analyses': 'Aucune analyse encore',
        'dashboard.start_first': 'Commencez votre première vérification de symptômes',
        'dashboard.ai_insights': 'Obtenez des informations de santé alimentées par l\'IA',
        'dashboard.pending': 'En attente',
        'dashboard.new_analysis': 'Nouvelle analyse',
        'dashboard.health_trends': 'Tendances de santé',
        'dashboard.trends_placeholder': '📈 Les tendances de santé apparaîtront ici après quelques analyses',
        'dashboard.quick_actions': 'Actions rapides',
        'dashboard.export_data': 'Exporter les données',
        'dashboard.health_insights': 'Aperçus santé',
        'dashboard.welcome_insight': 'Bienvenue sur AetherFlow !',
        'dashboard.welcome_insight_desc': 'Complétez votre première analyse de symptômes pour obtenir des informations de santé personnalisées.',
        
        // Symptom check form - simplified keys without 'symptom.' prefix
        'title': 'Évaluation du risque de crise drépanocytaire',
        'subtitle': 'Un outil complet pour évaluer vos symptômes et le risque de crise drépanocytaire',
        'demographics': 'Informations du patient',
        'age': 'Âge',
        'sex': 'Sexe',
        'genotype': 'Génotype de drépanocytose',
        'section_title': 'Symptômes actuels',
        'pain_level_label': 'Niveau de douleur actuel (échelle 0-10)',
        'no_pain': 'Aucune douleur',
        'moderate_pain': 'Modérée',
        'severe_pain': 'Sévère',
        'joint_pain_question': 'Y a-t-il des douleurs articulaires ou de la raideur?',
        'fatigue_question': 'Y a-t-il une fatigue ou une lassitude inhabituelle?',
        'fever_question': 'Y a-t-il de la fièvre ou une sensation fébrile?',
        'shortness_breath': 'Avez-vous des difficultés respiratoires?',
        'dactylitis': 'Avez-vous un gonflement des doigts ou des orteils (dactylite)?',
        'yes': 'Oui',
        'no': 'Non',
        'hydration_question': 'Quel est le niveau d\'hydratation actuel?',
        'please_select': 'Veuillez sélectionner...',
        'hydration_low': 'Faible - Ne boit pas assez de liquides',
        'hydration_normal': 'Normal - Boit régulièrement',
        'hydration_high': 'Élevé - Boit beaucoup de liquides',
        'medical_history': 'Antécédents médicaux et valeurs de laboratoire',
        'hbf_percent': 'Hémoglobine fœtale (HbF) %',
        'wbc_count': 'Numération des globules blancs (x10⁹/L)',
        'ldh': 'Taux de LDH (U/L)',
        'crp': 'Protéine C-réactive (mg/L)',
        'prior_crises_question': 'Combien de crises drépanocytaires ont eu lieu l\'année dernière?',
        'crises_0': '0 - Aucune crise précédente',
        'crises_1': '1 crise',
        'crises_2': '2 crises',
        'crises_3': '3 crises',
        'history_acs': 'Antécédents de syndrome thoracique aigu?',
        'coexisting_asthma': 'Avez-vous de l\'asthme?',
        'medications_lifestyle': 'Médicaments et mode de vie',
        'hydroxyurea': 'Prenez-vous de l\'hydroxyurée?',
        'pain_medication': 'Prenez-vous actuellement des analgésiques?',
        'medication_adherence': 'Observance médicamenteuse (échelle 0-1)',
        'sleep_quality': 'Qualité du sommeil (échelle 1-6)',
        'stress_level': 'Niveau de stress actuel (0-10)',
        'temperature': 'Température actuelle (°C)',
        'humidity': 'Humidité (%)',
        'begin_assessment': 'Commencer l\'évaluation',
        'clear_form': 'Effacer le formulaire',
        
        // Notifications
        'notification.language_changed': 'Langue changée en',
        'notification.settings_saved': 'Paramètres enregistrés avec succès',
        'notification.error': 'Une erreur s\'est produite'
    },
    
    'rw': {
        // Navigation (Kinyarwanda)
        'nav.home': 'Ahabanza',
        'nav.dashboard': 'Ikibaho',
        'nav.symptom_check': 'Isuzuma ry\'ihutirwa',
        'nav.settings': 'Igenamiterere',
        
        // Common
        'common.save': 'Bika impinduka',
        'common.cancel': 'Hagarika',
        'common.submit': 'Ohereza',
        'common.back': 'Subira',
        'common.next': 'Ibikurikira',
        'common.loading': 'Irashakisha...',
        
        // Mode Selection
        'mode.selection.title': 'Murakaza neza kuri AetherFlow',
        'mode.selection.subtitle': 'Hitamo uburyo ushaka gukoresha igikoresho cy\'isuzuma ry\'ihutirwa rya sickle cell',
        'mode.selection.continue': 'Komeza',
        'mode.selection.learn_more': 'Menya Byinshi',
        'mode.selection.note': 'Ushobora guhindura iri geneko igihe icyo ari cyo cyose mu byifuzo by\'porogaramu.',
        
        'mode.single.title': 'Gukoresha Umurwayi Umwe',
        'mode.single.description': 'Kugenzura ibimenyetso by\'indwara ya sickle cell y\'umurwayi umwe hamwe n\'igenzura ryangombwa ry\'umuganga.',
        'mode.single.feature1': 'Gukurikirana umurwayi ku giti cye',
        'mode.single.feature2': 'Ibikoresho by\'isuzuma ry\'ubuvuzi',
        'mode.single.feature3': 'Ubumenyi bw\'ubuzima bw\'umurwayi',
        'mode.single.feature4': 'Umufasha w\'ubuvuzi wa AI mukuru wa masaha 24/7',
        
        'mode.multi.title': 'Umukozi w\'Ubuvuzi',
        'mode.multi.description': 'Gucunga abarwayi benshi ba sickle cell no gukurikirana ubuzima bwabo.',
        'mode.multi.feature1': 'Ibipimo by\'abarwayi benshi',
        'mode.multi.feature2': 'Ikibaho cy\'ubugenzuzi bw\'abarwayi',
        'mode.multi.feature3': 'Isesengura ry\'ugereranije',
        'mode.multi.feature4': 'Raporo z\'umwuga',
        
        // Settings page
        'settings.title': 'Igenamiterere',
        'settings.subtitle': 'Hindura uburambe bwawe bwa AetherFlow',
        'settings.profile_info': 'Amakuru y\'umwirondoro',
        'settings.health_info': 'Amakuru y\'ubuzima',
        'settings.preferences': 'Ibyifuzo',
        'settings.privacy_security': 'Ibanga n\'umutekano',
        'settings.language': 'Ururimi',
        'settings.full_name': 'Amazina yombi',
        'settings.full_name_placeholder': 'Injiza amazina yawe yombi',
        'settings.email': 'Aderesi ya imeyili',
        'settings.email_placeholder': 'Injiza imeyili yawe',
        'settings.birth_date': 'Itariki y\'amavuko',
        'settings.gender': 'Igitsina',
        'settings.select_gender': 'Hitamo igitsina',
        'settings.male': 'Gabo',
        'settings.female': 'Gore',
        'settings.other': 'Ikindi',
        'settings.prefer_not_say': 'Sinshaka kubivuga',
        'settings.height': 'Uburebure (sm)',
        'settings.height_placeholder': 'Injiza uburebure muri santimetero',
        'settings.weight': 'Ibiro (kg)',
        'settings.weight_placeholder': 'Injiza ibiro muri kilo',
        'settings.blood_type': 'Ubwoko bw\'amaraso',
        'settings.select_blood_type': 'Hitamo ubwoko bw\'amaraso',
        'settings.allergies': 'Indwara zizwi',
        'settings.allergies_placeholder': 'Andika indwara zose uziko...',
        'settings.chronic_conditions': 'Indwara zikomeje',
        'settings.chronic_conditions_placeholder': 'Andika indwara zose zikomeje...',
        'settings.timezone': 'Igihe cy\'akarere',
        'settings.english': 'Icyongereza',
        'settings.swahili': 'Igiswahili',
        'settings.french': 'Igifaransa',
        'settings.kinyarwanda': 'Ikinyarwanda',
        'settings.pidgin': 'Pidgin English',
        'settings.est': 'Igihe gisanzwe cy\'Iburasirazuba',
        'settings.pst': 'Igihe gisanzwe cya Pacific',
        'settings.gmt': 'Igihe cya Greenwich',
        'settings.enable_notifications': 'Emera ubumenyesha',
        'settings.share_data': 'Sangira amakuru adasobanura umuntu mu bushakashatsi',
        'settings.dark_mode': 'Emera ubwoko bwangatebo',
        'settings.dark_mode_enabled': 'Ubwoko bwangatebo bwemejwe',
        'settings.light_mode_enabled': 'Ubwoko bwumucyo bwemejwe',
        'settings.online_ai': 'Koresha AI yuzuye kuri interineti (iyo ihari)',
        'settings.data_export': 'Ohaguruka amakuru',
        'settings.data_export_desc': 'Kuramo amakuru yawe yose mu buryo bushoboka',
        'settings.export_data_btn': 'Ohaguruka amakuru',
        'settings.delete_account': 'Siba konti',
        'settings.delete_account_desc': 'Siba burundu konti yawe n\'amakuru yose ahuriye na yo',
        'settings.delete_account_btn': 'Siba konti',
        'settings.save_changes': 'Bika impinduka',
        'settings.reset_defaults': 'Garura ku byahitamo',
        
        // Footer
        'footer.copyright': '© 2025 AetherFlow. Uburenganzira bwose burarabitswe.',
        
        // Results page
        'page.results.title': 'AetherFlow - Ibisubizo by\'isesengura',
        'results.header': 'Ibisubizo by\'isesengura',
        'results.completed_on': 'Isesengura ryarangiye ku wa',
        'results.sickle_cell_title': 'Isuzuma ry\'ibyago by\'ikibazo cy\'utugingo',
        'results.moderate_risk': 'Ibyago by\'hagati',
        'results.risk_score': 'Amanota y\'ibyago',
        'results.primary_assessment': 'Isuzuma ry\'ibanze',
        'results.loading': 'Birapakirwa...',
        'results.confidence_level': 'Urwego rw\'ikizere: ',
        'results.analysis_progress': 'Isesengura rirakora...',
        'results.recommendations': 'Ibyifuzo by\'ubuzima',
        'results.recommendations_intro': 'Ukurikije ibisubizo by\'isuzuma ryawe, hano hari ibyifuzo bishingiye ku bumenyi bwakozwe bukaba bwuhuye n\'urwego rw\'akaga n\'ibimenyetso byawe.',
        'results.loading_recommendations': 'Birapakirwa ibyifuzo...',
        'results.wait_recommendations': 'Nyamuneka tegereza mugihe dukora ibyifuzo byawe bwite.',
        'results.medical_care': 'Igihe cyo gushaka ubuvuzi',
        'results.assessment_progress': 'Isuzuma rirakora...',
        'results.evaluating_urgency': 'Turasuzuma ibyihutirwa by\'ibimenyetso byawe.',
        'results.seek_immediate': 'Shaka ubuvuzi bwihuse niba ubona:',
        'results.other_concerns': 'Ibindi Bigomba Kwitabwaho mu Buvuzi',
        'results.related_conditions': 'Indwara zishobora guhurirana',
        'results.loading_conditions': 'Birapakirwa indwara zihurirana...',
        'results.save_results': 'Bika ibisubizo',
        'results.print_results': 'Sohora ibisubizo',
        'results.new_analysis': 'Isesengura rishya',
        'results.view_dashboard': 'Reba ikibaho',
        'results.disclaimer_title': '⚠️ Iburira rikomeye',
        'results.disclaimer_text': 'Iri sesengura ni ryo gutanga amakuru gusa kandi ntirugomba gusimbura inama z\'ubuvuzi bw\'inzobere. Buri gihe jya ku muganga kugira ngo ubone isuzuma rinyuze n\'ubuvuzi bukwiye.',
        
        // Health Companion
        'companion.online': 'Kuri interineti',
        'companion.name': 'Umufasha wa AetherFlow',
        'companion.status': 'Buri gihe aha gufasha',
        'companion.welcome': 'Muraho! Ndi umunyangazi wawe w\'ubuzima wa masaha 24/7. Nakugufasha nte uyu munsi?',
        'companion.action.symptoms': 'Menya ibimenyetso',
        'companion.action.emergency': 'Ubufasha bw\'ihutirwa',
        'companion.action.advice': 'Inama z\'ubuzima',
        'companion.input.placeholder': 'Andika ikibazo cyawe cy\'ubuzima...',
        'companion.suggestion.pain': 'Mfite ububabare',
        'companion.suggestion.fever': 'Mfite umuriro',
        'companion.suggestion.tired': 'Numva nananutse',
        'companion.suggestion.emergency': 'Ihutirwa',
        
        // Home page
        'home.welcome': 'Murakaza neza kuri AetherFlow',
        'home.subtitle': 'Umunyangazi wawe w\'ubwenge mu buzima kugirango usuzume ibimenyetso no gukurikirana ubuzima',
        'home.start_assessment': 'Tangira isuzuma ry\'ihutirwa',
        'home.view_dashboard': 'Reba ikibaho',
        'home.symptom_analysis': 'Isesengura ry\'ibimenyetso',
        'home.symptom_analysis_desc': 'Wiga amakuru y\'ubwenge ku bimenyetso byawe ukoresheje tekinoroji igezweho ya AI',
        'home.health_dashboard': 'Ikibaho cy\'ubuzima',
        'home.health_dashboard_desc': 'Kurikirana ibipimo byawe by\'ubuzima no kureba raporo z\'amakuru',
        'home.personalized_care': 'Ubuvuzi bushingiye ku muntu',
        'home.personalized_care_desc': 'Hindura uburambe bwawe n\'inama z\'ubuzima zishingiye ku muntu',
        
        // Dashboard page
        'dashboard.title': 'Ikibaho cy\'ubuzima',
        'dashboard.welcome': 'Murakaza neza! Dore incamake y\'ubuzima bwawe.',
        'dashboard.total_analyses': 'Isesengura ryose',
        'dashboard.this_month': 'Uku kwezi',
        'dashboard.health_score': 'Amanota y\'ubuzima',
        'dashboard.status': 'Uko bimeze',
        'dashboard.recent_analyses': 'Isesengura rya vuba',
        'dashboard.no_analyses': 'Nta sesengura riraboneka',
        'dashboard.start_first': 'Tangira ukaguzi kwawe kwa mbere kw\'ibimenyetso',
        'dashboard.ai_insights': 'Wiga amakuru y\'ubuzima akoresheje AI',
        'dashboard.pending': 'Birategereza',
        'dashboard.new_analysis': 'Isesengura rishya',
        'dashboard.health_trends': 'Icyerekezo cy\'ubuzima',
        'dashboard.trends_placeholder': '📈 Icyerekezo cy\'ubuzima cizagaragara hano nyuma yo kurangiza isesengura',
        'dashboard.quick_actions': 'Ibikorwa byihuse',
        'dashboard.export_data': 'Sohoza amakuru',
        'dashboard.health_insights': 'Ubushishozi bw\'ubuzima',
        'dashboard.welcome_insight': 'Murakaza neza kuri AetherFlow!',
        'dashboard.welcome_insight_desc': 'Rangiza isesengura ryawe rya mbere ry\'ibimenyetso kugira ngo ubone amakuru yihariye y\'ubuzima.',
        
        // Symptom check form - simplified keys without 'symptom.' prefix
        'title': 'Isuzuma ry\'ibyago by\'ikibazo cy\'amaraso',
        'subtitle': 'Igikoresho gikomeye cyo gusuzuma ibimenyetso byawe n\'ibyago by\'ikibazo cy\'amaraso',
        'demographics': 'Amakuru y\'umurwayi',
        'age': 'Imyaka',
        'sex': 'Igitsina',
        'genotype': 'Ubwoko bw\'indwara y\'amaraso',
        'section_title': 'Ibimenyetso bya none',
        'pain_level_label': 'Urwego rw\'ububabare rwa none (urwego rwa 0-10)',
        'no_pain': 'Nta bubabare',
        'moderate_pain': 'Bugari',
        'severe_pain': 'Bukabije',
        'joint_pain_question': 'Hari ububabare bw\'ingingo cyangwa ukomerera?',
        'fatigue_question': 'Hari ubunyangazi budasanzwe cyangwa ukomerera?',
        'fever_question': 'Hari ubwoba cyangwa kwibyitaho ubwoba?',
        'shortness_breath': 'Ufite ingorane mu guhumeka?',
        'dactylitis': 'Ufite kubyimba kw\'intoki cyangwa umusozi (dactylitis)?',
        'yes': 'Yego',
        'no': 'Oya',
        'hydration_question': 'Urwego rw\'amazi muri nyama rwa none ni rwangahe?',
        'please_select': 'Nyamuneka hitamo...',
        'hydration_low': 'Bike - Ntanywa amazi ahagije',
        'hydration_normal': 'Bisanzwe - Anywa amazi buri gihe',
        'hydration_high': 'Byinshi - Anywa amazi menshi',
        'medical_history': 'Amateka y\'ubuvuzi n\'ibipimo by\'isesengura',
        'hbf_percent': 'Hemoglobine y\'inda (HbF) %',
        'wbc_count': 'Umubare w\'utubana tw\'umubiri (x10⁹/L)',
        'ldh': 'Urwego rwa LDH (U/L)',
        'crp': 'Poroteyine C-reactive (mg/L)',
        'prior_crises_question': 'Ni ibihe bibazo by\'amaraso byabaye mu mwaka ushize?',
        'crises_0': '0 - Nta kibazo cyabanje',
        'crises_1': 'Ikibazo 1',
        'crises_2': 'Ibibazo 2',
        'crises_3': 'Ibibazo 3',
        'history_acs': 'Warigeze ugira indwara y\'igikari gikabije?',
        'coexisting_asthma': 'Ufite indwara y\'aserikani?',
        'medications_lifestyle': 'Imiti n\'ubuzima',
        'hydroxyurea': 'Ufata imiti ya Hydroxyurea?',
        'pain_medication': 'Ufata imiti y\'ububabare ubu?',
        'medication_adherence': 'Gukurikiza imiti (urwego rwa 0-1)',
        'sleep_quality': 'Ubwiza bw\'uburiri (urwego rwa 1-6)',
        'stress_level': 'Urwego rw\'impungenge rwa none (0-10)',
        'temperature': 'Ubushyuhe bwa none (°C)',
        'humidity': 'Ubushuhe (%)',
        'begin_assessment': 'Tangira isuzuma',
        'clear_form': 'Siba ifishi',
        
        // Health Companion
        'companion.online': 'Kuri interineti',
        'companion.name': 'Umufasha wa AetherFlow',
        'companion.status': 'Buri gihe aha kugufasha',
        'companion.welcome': 'Muraho! Ndị mwenzi wawe w\'ubuzima wa amasaha 24/7. Nshobora kugufasha iki uyu munsi?',
        'companion.welcome.results': 'Ndabona ko warangije isuzuma ryawe ry\'ibyago by\'ihutirwa. Ndi hano gufasha gusubiza ibibazo byose ku bijyanye n\'ibisubizo byawe cyangwa gutanga ubuyobozi bw\'inyongera.',
        'companion.action.symptoms': 'Menya Ibimenyetso',
        'companion.action.emergency': 'Ubufasha bw\'ihutirwa',
        'companion.action.advice': 'Inama z\'ubuzima',
        'companion.action.explain_results': 'Sobanura Ibisubizo',
        'companion.action.next_steps': 'Intambwe zikurikira',
        'companion.input.placeholder': 'Andika ikibazo cyawe cy\'ubuzima...',
        'companion.suggestion.pain': 'Mfite ububabare',
        'companion.suggestion.fever': 'Mfite umuriro',
        'companion.suggestion.tired': 'Ndumva nanewe',
        'companion.suggestion.emergency': 'Ihutirwa',
        'companion.suggestion.results': 'Ibisubizo byanjye bifite icyo bivuze?',
        'companion.suggestion.prevention': 'Uburyo bwo kwirinda ihutirwa?',
        'companion.suggestion.doctor': 'Ngomba kubona muganga?',
        
        // Notifications
        'notification.language_changed': 'Ururimi rwahinduwe ruraba',
        'notification.settings_saved': 'Igenamiterere ryabitswe neza',
        'notification.error': 'Ikosa ryabaye'
    },
    
    'pcm': {
        // Navigation (Pidgin English)
        'nav.home': 'House',
        'nav.dashboard': 'Dashboard',
        'nav.symptom_check': 'Crisis Check',
        'nav.settings': 'Settings',
        
        // Common
        'common.save': 'Save Changes',
        'common.cancel': 'Cancel',
        'common.submit': 'Submit',
        'common.back': 'Go Back',
        'common.next': 'Next',
        'common.loading': 'Dey Load...',
        
        // Mode Selection
        'mode.selection.title': 'Welcome to AetherFlow',
        'mode.selection.subtitle': 'Choose how you wan use dis sickle cell crisis check tool',
        'mode.selection.continue': 'Continue',
        'mode.selection.learn_more': 'Learn More',
        'mode.selection.note': 'You fit change dis setting anytime for di app settings.',
        
        'mode.single.title': 'Single Patient Use',
        'mode.single.description': 'Check one patient sickle cell condition with doctor help and guidance.',
        'mode.single.feature1': 'Watch one patient by emself',
        'mode.single.feature2': 'Medical check tools',
        'mode.single.feature3': 'Patient health tips',
        'mode.single.feature4': '24/7 AI medical helper',
        
        'mode.multi.title': 'Healthcare Provider',
        'mode.multi.description': 'Manage plenty sickle cell patients and check their health condition.',
        'mode.multi.feature1': 'Many patient profiles',
        'mode.multi.feature2': 'Patient management dashboard',
        'mode.multi.feature3': 'Compare analysis',
        'mode.multi.feature4': 'Professional reports',
        
        // Settings page
        'settings.title': 'Settings',
        'settings.subtitle': 'Make your AetherFlow experience better',
        'settings.profile_info': 'Your Profile Info',
        'settings.health_info': 'Health Info',
        'settings.preferences': 'Wetin You Like',
        'settings.privacy_security': 'Privacy & Security',
        'settings.language': 'Language',
        'settings.full_name': 'Full Name',
        'settings.full_name_placeholder': 'Put your full name',
        'settings.email': 'Email Address',
        'settings.email_placeholder': 'Put your email',
        'settings.birth_date': 'When You Born',
        'settings.gender': 'Gender',
        'settings.select_gender': 'Choose Gender',
        'settings.male': 'Man',
        'settings.female': 'Woman',
        'settings.other': 'Other',
        'settings.prefer_not_say': 'I no want talk am',
        'settings.height': 'How Tall You Be (cm)',
        'settings.height_placeholder': 'Put how tall you be for cm',
        'settings.weight': 'How Heavy You Be (kg)',
        'settings.weight_placeholder': 'Put how heavy you be for kg',
        'settings.blood_type': 'Blood Type',
        'settings.select_blood_type': 'Choose Blood Type',
        'settings.allergies': 'Things Wey Dey Worry You',
        'settings.allergies_placeholder': 'Write anything wey dey worry your body...',
        'settings.chronic_conditions': 'Sickness Wey Dey Stay',
        'settings.chronic_conditions_placeholder': 'Write any sickness wey dey always worry you...',
        'settings.timezone': 'Time Zone',
        'settings.english': 'English',
        'settings.swahili': 'Swahili',
        'settings.french': 'French',
        'settings.kinyarwanda': 'Kinyarwanda',
        'settings.pidgin': 'Pidgin English',
        'settings.est': 'Eastern Standard Time',
        'settings.pst': 'Pacific Standard Time',
        'settings.gmt': 'Greenwich Mean Time',
        'settings.enable_notifications': 'Turn on notifications',
        'settings.share_data': 'Share data for research',
        'settings.dark_mode': 'Use dark mode',
        'settings.dark_mode_enabled': 'Dark mode don dey work',
        'settings.light_mode_enabled': 'Light mode don dey work',
        'settings.online_ai': 'Use better online AI (when e dey available)',
        'settings.data_export': 'Download Your Data',
        'settings.data_export_desc': 'Download all your data for yourself',
        'settings.export_data_btn': 'Download Data',
        'settings.delete_account': 'Delete Account',
        'settings.delete_account_desc': 'Delete your account and everything permanently',
        'settings.delete_account_btn': 'Delete Account',
        'settings.save_changes': 'Save Changes',
        'settings.reset_defaults': 'Reset Everything',
        
        // Footer
        'footer.copyright': '© 2025 AetherFlow. All rights belong to dem.',
        
        // Results page
        'page.results.title': 'AetherFlow - Results of Check Up',
        'results.header': 'Results of Check Up',
        'results.completed_on': 'Check up don finish on',
        'results.sickle_cell_title': 'Sickle Cell Crisis Risk Check',
        'results.moderate_risk': 'Medium Risk',
        'results.risk_score': 'Risk Score',
        'results.primary_assessment': 'Main Check Up',
        'results.loading': 'Dey Load...',
        'results.confidence_level': 'How Sure We Be: ',
        'results.analysis_progress': 'Check up still dey go on...',
        'results.recommendations': 'Wetin Doctor Talk Say You Do',
        'results.recommendations_intro': 'Based on wetin we see for your body check, na dis tins wey doctor dem talk say good make you do, based on how your sickness dey and wetin you feel.',
        'results.loading_recommendations': 'Dey load wetin we talk say you do...',
        'results.wait_recommendations': 'Make you wait small while we dey prepare wetin good for you.',
        'results.medical_care': 'When You Need Go Hospital',
        'results.assessment_progress': 'Check up still dey go on...',
        'results.evaluating_urgency': 'We dey check how serious your problem be.',
        'results.seek_immediate': 'Run go hospital quick quick if you see:',
        'results.other_concerns': 'Other Tins Wey Doctor Fit Check',
        'results.related_conditions': 'Other Sickness Wey Fit Connect',
        'results.loading_conditions': 'Dey load other sickness wey fit connect...',
        'results.save_results': 'Save Results',
        'results.print_results': 'Print Results',
        'results.new_analysis': 'New Check Up',
        'results.view_dashboard': 'See Dashboard',
        'results.disclaimer_title': '⚠️ Important Someting',
        'results.disclaimer_text': 'This check up na just for you to know someting small, e no fit replace doctor advice. Always go meet doctor for proper check up and treatment.',
        
        // Health Companion
        'companion.online': 'Dey Online',
        'companion.name': 'AetherFlow Helper',
        'companion.status': 'Always dey here to help you',
        'companion.welcome': 'Hey! I be your 24/7 health companion. Wetin I fit do for you today?',
        'companion.welcome.results': 'I see say you don finish your crisis risk check. I dey here to help answer any question about your results or give you more guidance.',
        'companion.action.symptoms': 'Talk Your Symptoms',
        'companion.action.emergency': 'Emergency Help',
        'companion.action.advice': 'Health Advice',
        'companion.action.explain_results': 'Explain Results',
        'companion.action.next_steps': 'Next Steps',
        'companion.input.placeholder': 'Write your health question...',
        'companion.suggestion.pain': 'I get pain',
        'companion.suggestion.fever': 'I get fever',
        'companion.suggestion.tired': 'I dey tire',
        'companion.suggestion.emergency': 'Emergency',
        'companion.suggestion.results': 'Wetin my results mean?',
        'companion.suggestion.prevention': 'How to prevent crisis?',
        'companion.suggestion.doctor': 'I go see doctor?',
        
        // Home page
        'home.welcome': 'Welcome to AetherFlow',
        'home.subtitle': 'Your smart health friend for checking symptoms and tracking wellness',
        'home.start_assessment': 'Start crisis check',
        'home.view_dashboard': 'See Dashboard',
        'home.symptom_analysis': 'Symptom Check',
        'home.symptom_analysis_desc': 'Get smart info about your symptoms using advanced AI technology',
        'home.health_dashboard': 'Health Dashboard',
        'home.health_dashboard_desc': 'Track your health numbers and see detailed reports',
        'home.personalized_care': 'Personal Care',
        'home.personalized_care_desc': 'Make your experience better with personal health advice',
        
        // Dashboard page
        'dashboard.title': 'Health Dashboard',
        'dashboard.welcome': 'Welcome back! Here your health overview dey.',
        'dashboard.total_analyses': 'Total Checks',
        'dashboard.this_month': 'This Month',
        'dashboard.health_score': 'Health Score',
        'dashboard.status': 'Status',
        'dashboard.recent_analyses': 'Recent Checks',
        'dashboard.no_analyses': 'No checks yet',
        'dashboard.start_first': 'Start your first symptom check',
        'dashboard.ai_insights': 'Get smart health info wey AI dey give',
        'dashboard.pending': 'Dey Wait',
        'dashboard.new_analysis': 'New Check',
        'dashboard.health_trends': 'Health Trends',
        'dashboard.trends_placeholder': '📈 Health trends go show here after you do some checks',
        'dashboard.quick_actions': 'Quick Actions',
        'dashboard.export_data': 'Download Data',
        'dashboard.health_insights': 'Health Tips',
        'dashboard.welcome_insight': 'Welcome to AetherFlow!',
        'dashboard.welcome_insight_desc': 'Do your first symptom check to get personal health tips.',
        
        // Symptom check form - simplified keys without 'symptom.' prefix
        'title': 'Check If You Get Sickle Cell Crisis Risk',
        'subtitle': 'Tool to check your symptoms and sickle cell crisis risk',
        'demographics': 'Person Information',
        'age': 'How Old You Be',
        'sex': 'Man or Woman',
        'genotype': 'Sickle Cell Type',
        'section_title': 'Your Symptoms Now',
        'pain_level_label': 'How much pain you get now (0-10)',
        'no_pain': 'No Pain',
        'moderate_pain': 'Medium',
        'severe_pain': 'Bad Bad',
        'joint_pain_question': 'Your joints dey pain you or dey stiff?',
        'fatigue_question': 'You dey tire tire pass normal?',
        'fever_question': 'You get fever or dey feel hot?',
        'shortness_breath': 'You no fit breathe well?',
        'dactylitis': 'Your fingers or toes dey swell (dactylitis)?',
        'yes': 'Yes',
        'no': 'No',
        'hydration_question': 'How your water level for body dey?',
        'please_select': 'Choose something...',
        'hydration_low': 'Low - No dey drink enough water',
        'hydration_normal': 'Normal - Dey drink water well well',
        'hydration_high': 'High - Dey drink plenty water',
        'medical_history': 'Your Medical History & Lab Results',
        'hbf_percent': 'Baby Blood (HbF) %',
        'wbc_count': 'White Blood Cell Count (x10⁹/L)',
        'ldh': 'LDH Level (U/L)',
        'crp': 'C-Reactive Protein (mg/L)',
        'prior_crises_question': 'How many sickle cell crisis you get last year?',
        'crises_0': '0 - No crisis before',
        'crises_1': '1 crisis',
        'crises_2': '2 crisis',
        'crises_3': '3 crisis',
        'history_acs': 'You ever get bad chest problem before?',
        'coexisting_asthma': 'You get asthma?',
        'medications_lifestyle': 'Medicine & How You Dey Live',
        'hydroxyurea': 'You dey take Hydroxyurea medicine?',
        'pain_medication': 'You dey take pain medicine now?',
        'medication_adherence': 'How you dey take your medicine (0-1)',
        'sleep_quality': 'How your sleep dey (1-6)',
        'stress_level': 'How much wahala you get now (0-10)',
        'temperature': 'How hot the place dey (°C)',
        'humidity': 'How wet the air dey (%)',
        'begin_assessment': 'Start Check',
        'clear_form': 'Clear Form',
        
        // Notifications
        'notification.language_changed': 'Language don change to',
        'notification.settings_saved': 'Settings don save well',
        'notification.error': 'Something wrong happen'
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Load analysis data from localStorage
    loadAnalysisData();
    
    // Load language preference from localStorage
    const savedLanguage = localStorage.getItem('aetherflow_language');
    if (savedLanguage && translations[savedLanguage]) {
        currentLanguage = savedLanguage;
        userSettings.language = savedLanguage;
    }
    
    initializeApp();
    
    // Debug: Test translation system
    console.log('AetherFlow: Translation system loaded');
    console.log('Current language:', currentLanguage);
    console.log('Test translation (settings.title):', getTranslation('settings.title'));
    console.log('Available languages:', Object.keys(translations));
    console.log('Total analyses loaded:', analysisData.length);
});

function initializeApp() {
    updateActiveNavLink();
    loadPageSpecificContent();
    setupEventListeners();
    // Apply translations on page load
    translatePage();
    // Initialize dark mode from saved settings
    initializeDarkMode();
}

function updateActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });
}

function loadPageSpecificContent() {
    switch(currentPage) {
        case 'index.html':
        case '':
            loadHomePage();
            break;
        case 'dashboard.html':
            loadDashboard();
            break;
        case 'symptom_check.html':
            loadSymptomCheck();
            break;
        case 'result.html':
            loadResults();
            break;
        case 'settings.html':
            loadSettings();
            break;
    }
}

function setupEventListeners() {
    // Symptom form submission
    const symptomForm = document.getElementById('symptomForm');
    if (symptomForm) {
        symptomForm.addEventListener('submit', handleSymptomSubmission);
    }

    // Settings forms
    setupSettingsListeners();
    
    // Pain level slider for sickle cell assessment
    const painSlider = document.getElementById('painLevel');
    if (painSlider) {
        painSlider.addEventListener('input', updatePainSliderDisplay);
    }
}

// Home Page Functions
function loadHomePage() {
    // Add any home page specific initialization
    console.log('Home page loaded');
}

// Dashboard Functions
function loadDashboard() {
    console.log('Loading dashboard...');
    console.log('Analysis data from localStorage:', JSON.parse(localStorage.getItem('aetherflow_analyses') || '[]'));
    console.log('Current analysisData array:', analysisData);
    
    updateDashboardStats();
    loadRecentAnalyses();
    loadHealthInsights();
}

function updateDashboardStats() {
    const totalAnalysesEl = document.getElementById('totalAnalyses');
    const monthlyAnalysesEl = document.getElementById('monthlyAnalyses');
    const healthScoreEl = document.getElementById('healthScore');
    const healthStatusEl = document.getElementById('healthStatus');

    if (totalAnalysesEl) {
        totalAnalysesEl.textContent = analysisData.length;
    }

    if (monthlyAnalysesEl) {
        const currentMonth = new Date().getMonth();
        const monthlyCount = analysisData.filter(analysis => 
            new Date(analysis.date).getMonth() === currentMonth
        ).length;
        monthlyAnalysesEl.textContent = monthlyCount;
    }

    if (healthScoreEl && healthStatusEl) {
        const healthScore = calculateHealthScore();
        healthScoreEl.textContent = `${healthScore}%`;
        healthStatusEl.textContent = getHealthStatus(healthScore);
        healthStatusEl.className = `stat-status ${getHealthStatusClass(healthScore)}`;
    }
}

function calculateHealthScore() {
    if (analysisData.length === 0) return 85;
    
    // Calculate health score based on crisis risk assessments
    const recentAnalyses = analysisData.slice(-5);
    const totalRiskScore = recentAnalyses.reduce((sum, analysis) => {
        return sum + (analysis.riskScore?.score || 50);
    }, 0);
    
    const avgRiskScore = totalRiskScore / recentAnalyses.length;
    
    // Convert risk score to health score (inverse relationship)
    // Higher risk = lower health score
    const healthScore = Math.max(30, Math.min(100, 100 - avgRiskScore));
    
    return Math.round(healthScore);
}

function getHealthStatus(score) {
    if (score >= 80) return 'Excellent';
    if (score >= 65) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Needs Attention';
}

function getHealthStatusClass(score) {
    if (score >= 80) return 'excellent';
    if (score >= 65) return 'good';
    if (score >= 50) return 'fair';
    return 'poor';
}

function loadRecentAnalyses() {
    const recentAnalysesEl = document.getElementById('recentAnalyses');
    if (!recentAnalysesEl) return;

    if (analysisData.length === 0) {
        recentAnalysesEl.innerHTML = `
            <div class="analysis-item">
                <div class="analysis-date">No analyses yet</div>
                <div class="analysis-content">
                    <h4>Start your first crisis assessment</h4>
                    <p>Get AI-powered sickle cell crisis risk insights</p>
                </div>
                <div class="analysis-status pending">Pending</div>
            </div>
        `;
        return;
    }

    const recentAnalyses = analysisData.slice(-3).reverse();
    recentAnalysesEl.innerHTML = recentAnalyses.map(analysis => {
        const riskLevel = analysis.riskScore?.score || 0;
        const riskText = getRiskLevelText(riskLevel);
        const analysisDate = new Date(analysis.date).toLocaleDateString();
        
        return `
            <div class="analysis-item">
                <div class="analysis-date">${analysisDate}</div>
                <div class="analysis-content">
                    <h4>Crisis Risk Assessment</h4>
                    <p>${riskText} (Risk Score: ${riskLevel}%)</p>
                </div>
                <div class="analysis-status completed">Completed</div>
            </div>
        `;
    }).join('');
}

function getRiskLevelText(score) {
    if (score >= 70) return 'High Crisis Risk';
    if (score >= 40) return 'Moderate Crisis Risk';
    return 'Low Crisis Risk';
}

function loadHealthInsights() {
    const healthInsightsEl = document.getElementById('healthInsights');
    if (!healthInsightsEl) return;

    const insights = generateHealthInsights();
    healthInsightsEl.innerHTML = insights.map(insight => `
        <div class="insight-item">
            <div class="insight-icon">${insight.icon}</div>
            <div class="insight-content">
                <h4>${insight.title}</h4>
                <p>${insight.description}</p>
            </div>
        </div>
    `).join('');
}

function generateHealthInsights() {
    if (analysisData.length === 0) {
        return [{
            icon: '💡',
            title: 'Welcome to AetherFlow!',
            description: 'Complete your first crisis risk assessment to get personalized health insights.'
        }];
    }

    const insights = [];
    const recentAnalyses = analysisData.slice(-5);
    
    // Check for high pain levels
    const highPainCount = recentAnalyses.filter(a => parseInt(a.painLevel || 0) >= 7).length;
    if (highPainCount >= 2) {
        insights.push({
            icon: '🚨',
            title: 'High Pain Levels Detected',
            description: 'You\'ve reported high pain levels in recent assessments. Consider consulting your healthcare provider.'
        });
    }
    
    // Check for frequent crises
    const avgCrises = recentAnalyses.reduce((sum, a) => sum + parseInt(a.priorCrises || 0), 0) / recentAnalyses.length;
    if (avgCrises >= 2) {
        insights.push({
            icon: '�',
            title: 'Crisis Pattern Analysis',
            description: 'Your crisis history suggests increased monitoring may be beneficial. Discuss prevention strategies with your doctor.'
        });
    }
    
    // Check hydration patterns
    const lowHydrationCount = recentAnalyses.filter(a => a.hydrationLevel === 'Low').length;
    if (lowHydrationCount >= 2) {
        insights.push({
            icon: '💧',
            title: 'Hydration Reminder',
            description: 'You\'ve indicated low hydration multiple times. Maintaining proper hydration is crucial for sickle cell management.'
        });
    }

    // Health score insight
    const healthScore = calculateHealthScore();
    if (healthScore >= 80) {
        insights.push({
            icon: '✨',
            title: 'Great Health Management!',
            description: 'Your recent assessments show good crisis risk management. Keep up the excellent self-care!'
        });
    } else if (healthScore < 65) {
        insights.push({
            icon: '⚠️',
            title: 'Health Score Needs Attention',
            description: 'Recent assessments suggest increased crisis risk. Consider consulting with your healthcare provider.'
        });
    }

    // General sickle cell management tip
    if (insights.length < 3) {
        insights.push({
            icon: '🌟',
            title: 'Sickle Cell Management Tip',
            description: 'Stay hydrated, avoid extreme temperatures, and maintain regular medical check-ups for optimal health.'
        });
    }

    return insights.slice(0, 3);
}

// Symptom Check Functions
function loadSymptomCheck() {
    setupFormValidation();
    initializePainSlider();
}

function initializePainSlider() {
    const painSlider = document.getElementById('painLevel');
    if (painSlider) {
        updatePainSliderDisplay();
    }
}

function updatePainSliderDisplay() {
    const slider = document.getElementById('painLevel');
    if (!slider) return;
    
    const value = slider.value;
    const valueDisplay = document.getElementById('painValue');
    
    if (valueDisplay) {
        valueDisplay.textContent = value;
    }
}

function setupFormValidation() {
    const form = document.getElementById('symptomForm');
    if (!form) return;

    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearValidationError);
    });
}

function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    
    if (!value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    if (field.type === 'email' && !isValidEmail(value)) {
        showFieldError(field, 'Please enter a valid email address');
        return false;
    }
    
    clearFieldError(field);
    return true;
}

function showFieldError(field, message) {
    clearFieldError(field);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#dc3545';
    errorDiv.style.fontSize = '0.9rem';
    errorDiv.style.marginTop = '0.25rem';
    field.parentNode.appendChild(errorDiv);
    field.style.borderColor = '#dc3545';
}

function clearFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    field.style.borderColor = '';
}

function clearValidationError(event) {
    clearFieldError(event.target);
}

function handleSymptomSubmission(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const symptomData = Object.fromEntries(formData.entries());
    
    console.log('Form submission data:', symptomData);
    
    // Validate form
    if (!validateSymptomForm(symptomData)) {
        console.log('Form validation failed');
        return;
    }
    
    console.log('Form validation passed');
    
    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Analyzing...';
    submitBtn.disabled = true;
    
    // Try AI prediction first, fallback to local calculation
    handleAIPrediction(symptomData, submitBtn, originalText);
}

async function handleAIPrediction(symptomData, submitBtn, originalText) {
    try {
        // Check if AI is available
        if (typeof AetherFlowAI !== 'undefined') {
            const ai = new AetherFlowAI();
            
            // Transform form data to AI API format
            const aiData = transformFormDataForAI(symptomData);
            console.log('Calling AI API with data:', aiData);
            
            const aiResult = await ai.predictCrisisRisk(aiData);
            console.log('AI prediction result:', aiResult);
            
            // Use AI results
            symptomData.aiResult = aiResult;
            symptomData.riskScore = aiResult.crisis_probability;
            symptomData.isAIPrediction = true;
            
        } else {
            throw new Error('AI not available');
        }
    } catch (error) {
        console.warn('AI prediction failed, using local calculation:', error.message);
        
        // Fallback to local calculation
        const riskScore = calculateSickleCellRisk(symptomData);
        symptomData.riskScore = riskScore;
        symptomData.isAIPrediction = false;
    }
    
    // Continue with storing and redirecting
    completeSymptomSubmission(symptomData, submitBtn, originalText);
}

function transformFormDataForAI(formData) {
    // Transform form data to match AI API expected format with all required fields
    return {
        age: parseInt(formData.age) || 25,
        sex: formData.sex || 'Male',
        genotype: formData.genotype || 'HbSS',
        pain_level: parseInt(formData.painLevel) || 0,
        fever: formData.fever === '1' ? 1 : 0,
        fatigue: formData.fatigue === '1' ? 1 : 0,
        shortness_of_breath: formData.shortness_of_breath === '1' ? 1 : 0,
        joint_pain: formData.jointPain === '1' ? 1 : 0,
        dactylitis: formData.dactylitis === '1' ? 1 : 0,
        priapism: formData.priapism === '1' ? 1 : 0,
        headache: formData.headache === '1' ? 1 : 0,
        vision_changes: formData.vision_changes === '1' ? 1 : 0,
        chest_pain: formData.chest_pain === '1' ? 1 : 0,
        hydration_level: formData.hydration_level || 'Medium',
        stress_level: parseInt(formData.stress_level) || 3,
        activity_level: parseInt(formData.activity_level) || 3,
        temperature: parseFloat(formData.temperature) || 98.6,
        heart_rate: parseInt(formData.heart_rate) || 70,
        systolic_bp: parseInt(formData.systolic_bp) || 120,
        diastolic_bp: parseInt(formData.diastolic_bp) || 80,
        // Required fields with defaults
        hbf_percent: parseFloat(formData.hbf_percent) || 5.0,
        wbc_count: parseFloat(formData.wbc_count) || 8.5,
        ldh: parseFloat(formData.ldh) || 250,
        crp: parseFloat(formData.crp) || 3.0,
        prior_crises: parseInt(formData.prior_crises) || 0,
        history_of_acs: formData.history_of_acs === '1' ? 1 : 0,
        coexisting_asthma: formData.coexisting_asthma === '1' ? 1 : 0,
        hydroxyurea: formData.hydroxyurea === '1' ? 1 : 0,
        pain_med: formData.pain_med === '1' ? 1 : 0,
        medication_adherence: formData.medication_adherence === '1' ? 1 : 0,
        sleep_quality: parseInt(formData.sleep_quality) || 3,
        reported_stress_level: parseInt(formData.reported_stress_level) || 3,
        humidity: parseFloat(formData.humidity) || 50.0
    };
}

function completeSymptomSubmission(symptomData, submitBtn, originalText) {
    console.log('Calculated risk score:', symptomData.riskScore);
    
    // Add timestamp and ID
    symptomData.id = Date.now();
    symptomData.date = new Date().toISOString();
    
    // Store the analysis
    analysisData.push(symptomData);
    localStorage.setItem('aetherflow_analyses', JSON.stringify(analysisData));
    
    console.log('Analysis data saved:', analysisData);
    console.log('Total analyses:', analysisData.length);
    
    // Store current analysis for results page
    localStorage.setItem('aetherflow_current_analysis', JSON.stringify(symptomData));
    localStorage.setItem('aetherflow_latest_analysis', JSON.stringify(symptomData));
    
    // Reset button state
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    
    // Redirect to results
    window.location.href = 'result.html';
}

function calculateSickleCellRisk(data) {
    let score = 0;
    
    // Pain level (0-10 scale, weighted 30%)
    const painLevel = parseInt(data.painLevel || 0);
    score += (painLevel / 10) * 0.3;
    
    // Joint pain (weighted 20%) - check for numeric value 1
    if (data.jointPain === '1') {
        score += 0.2;
    }
    
    // Fatigue (weighted 15%) - check for numeric value 1
    if (data.fatigue === '1') {
        score += 0.15;
    }
    
    // Fever (weighted 15%) - check for numeric value 1
    if (data.fever === '1') {
        score += 0.15;
    }
    
    // Shortness of breath (weighted 10%) - check for numeric value 1
    if (data.shortness_of_breath === '1') {
        score += 0.1;
    }
    
    // Dactylitis (weighted 10%) - check for numeric value 1
    if (data.dactylitis === '1') {
        score += 0.1;
    }
    
    // Hydration level (weighted 10%)
    if (data.hydrationLevel === 'Low') {
        score += 0.1;
    } else if (data.hydrationLevel === 'High') {
        score -= 0.05; // Better hydration reduces risk
    }
    
    // Prior crises (weighted 10%)
    const priorCrises = parseInt(data.priorCrises || 0);
    if (priorCrises >= 3) {
        score += 0.1;
    } else if (priorCrises >= 1) {
        score += 0.05;
    }
    
    // History of ACS (weighted 5%)
    if (data.history_of_acs === '1') {
        score += 0.05;
    }
    
    // Asthma (weighted 5%)
    if (data.coexisting_asthma === '1') {
        score += 0.05;
    }
    
    // Normalize score between 0 and 1
    score = Math.max(0, Math.min(1, score));
    
    return {
        score: Math.round(score * 100), // Convert to percentage
        level: score > 0.6 ? 'High' : score > 0.3 ? 'Moderate' : 'Low',
        recommendation: score > 0.6 ? 
            'Crisis likely in <48 hours. Take preventive action and consult a healthcare provider.' :
            score > 0.3 ? 
            'Monitor symptoms closely and maintain hydration. Consult a provider if symptoms worsen.' :
            'No crisis likely. Continue regular care and monitoring.'
    };
}

function validateSymptomForm(data) {
    // Validate required demographics
    if (!data.age || data.age === '' || data.age < 0) {
        alert('Please enter a valid age.');
        return false;
    }
    
    if (!data.sex || data.sex === '') {
        alert('Please select your sex.');
        return false;
    }
    
    if (!data.genotype || data.genotype === '') {
        alert('Please select your sickle cell genotype.');
        return false;
    }
    
    // Validate current symptoms - these fields always have values (default to 0 for radio buttons)
    if (!data.hydrationLevel || data.hydrationLevel === '') {
        alert('Please select your hydration level.');
        return false;
    }
    
    if (!data.priorCrises || data.priorCrises === '') {
        alert('Please indicate your history of previous crises.');
        return false;
    }
    
    // All other fields have default values, so no need to validate them strictly
    return true;
}

function updatePainSliderDisplay() {
    const slider = document.getElementById('painLevel');
    if (!slider) return;
    
    const value = slider.value;
    const valueDisplay = document.getElementById('painValue');
    
    if (valueDisplay) {
        valueDisplay.textContent = value;
    }
}

// Results Page Functions
function loadResults() {
    // Results are now handled by the AI integration system
    // Check if the new ResultsDisplayHandler is available
    if (typeof ResultsDisplayHandler !== 'undefined') {
        console.log('Loading results with AI integration system');
        return; // Let the AI system handle results
    }
    
    // Fallback: redirect to assessment if no analysis data
    const currentAnalysis = JSON.parse(localStorage.getItem('aetherflow_current_analysis'));
    if (!currentAnalysis) {
        window.location.href = 'symptom_check.html';
        return;
    }
    
    // Basic fallback display
    displayAnalysisDate();
}

function displayAnalysisDate() {
    const dateElement = document.getElementById('analysisDate');
    if (dateElement) {
        dateElement.textContent = formatDate(new Date().toISOString());
    }
}

function simulateAnalysis(analysisData) {
    // Simulate AI analysis with realistic delays
    setTimeout(() => updatePrimaryAssessment(analysisData), 1000);
    setTimeout(() => updateRecommendations(analysisData), 2000);
    setTimeout(() => updateUrgencyLevel(analysisData), 3000);
    setTimeout(() => updateRelatedConditions(analysisData), 4000);
}

function updatePrimaryAssessment(data) {
    const conditionEl = document.getElementById('primaryCondition');
    const confidenceBarEl = document.getElementById('confidenceBar');
    const confidencePercentEl = document.getElementById('confidencePercent');
    const descriptionEl = document.getElementById('conditionDescription');
    
    // Generate realistic assessment based on symptoms
    const assessment = generateAssessment(data);
    
    if (conditionEl) {
        conditionEl.textContent = assessment.condition;
    }
    
    if (confidenceBarEl && confidencePercentEl) {
        confidenceBarEl.style.width = `${assessment.confidence}%`;
        confidencePercentEl.textContent = `${assessment.confidence}%`;
    }
    
    if (descriptionEl) {
        descriptionEl.textContent = assessment.description;
    }
    
    // Store the assessment for future reference
    data.primaryCondition = assessment.condition;
    data.confidence = assessment.confidence;
    data.description = assessment.description;
}

function generateAssessment(data) {
    // Legacy function - now simplified for crisis assessment
    const painLevel = parseInt(data.painLevel || 0);
    
    // Simple crisis-based assessment fallback
    let condition = 'Sickle Cell Crisis Assessment';
    let confidence = 75;
    let description = 'Assessment based on pain level and reported symptoms. Please consult healthcare provider for proper evaluation.';
    
    if (painLevel >= 7) {
        condition = 'High Crisis Risk';
        confidence = 85;
        description = 'High pain levels may indicate increased crisis risk. Seek immediate medical attention.';
    } else if (painLevel >= 4) {
        condition = 'Moderate Crisis Risk';
        confidence = 80;
        description = 'Moderate pain levels require monitoring. Consider contacting your healthcare provider.';
    } else {
        condition = 'Low Crisis Risk';
        confidence = 78;
        description = 'Current pain levels are low, but continue monitoring and maintain hydration.';
    }

    return { condition, confidence, description };
}

function updateRecommendations(data) {
    const recommendationsEl = document.getElementById('recommendationsList');
    if (!recommendationsEl) return;
    
    const recommendations = generateRecommendations(data);
    
    recommendationsEl.innerHTML = recommendations.map(rec => `
        <div class="recommendation-item">
            <div class="rec-icon">${rec.icon}</div>
            <div class="rec-content">
                <h4>${rec.title}</h4>
                <p>${rec.description}</p>
            </div>
        </div>
    `).join('');
}

function generateRecommendations(data) {
    const severity = parseInt(data.severity);
    const recommendations = [];
    
    // General recommendations
    recommendations.push({
        icon: '💧',
        title: 'Stay Hydrated',
        description: 'Drink plenty of water throughout the day to help your body recover and maintain optimal function.'
    });
    
    recommendations.push({
        icon: '😴',
        title: 'Get Adequate Rest',
        description: 'Ensure you get 7-9 hours of quality sleep to support your immune system and recovery.'
    });
    
    // Severity-based recommendations
    if (severity >= 7) {
               recommendations.push({
            icon: '🏥',
            title: 'Consider Medical Consultation',
            description: 'Given the severity of your symptoms, consider scheduling an appointment with a healthcare provider.'
        });
    }
    
    if (severity <= 4) {
        recommendations.push({
            icon: '🧘',
            title: 'Practice Stress Management',
            description: 'Consider relaxation techniques such as deep breathing, meditation, or gentle exercise.'
        });
    }
    
    // Crisis-specific recommendations based on pain level and risk factors
    const painLevel = parseInt(data.painLevel || 0);
    const jointPain = data.jointPain === '1';
    const fever = data.fever === '1';
    
    if (painLevel >= 7) {
        recommendations.push({
            icon: '🏥',
            title: 'Seek Medical Attention',
            description: 'High pain levels may indicate a crisis. Contact your healthcare provider immediately.'
        });
    }
    
    if (fever) {
        recommendations.push({
            icon: '🌡️',
            title: 'Monitor Temperature',
            description: 'Fever can trigger a crisis. Monitor your temperature and seek care if it persists.'
        });
    }
    
    if (jointPain) {
        recommendations.push({
            icon: '🧘',
            title: 'Gentle Movement',
            description: 'Light stretching and gentle movement may help with joint pain, but avoid overexertion.'
        });
    }
    
    return recommendations.slice(0, 4);
}

function updateUrgencyLevel(data) {
    const urgencyEl = document.getElementById('urgencyLevel');
    const warningSignsContainer = document.getElementById('warningSignsContainer');
    const warningSignsList = document.getElementById('warningSigns');
    
    if (!urgencyEl) return;
    
    const severity = parseInt(data.severity);
    let urgencyClass, urgencyTitle, urgencyDescription;
    
    if (severity >= 8) {
        urgencyClass = 'high';
        urgencyTitle = 'Moderate to High Priority';
        urgencyDescription = 'Consider seeking medical attention within 24 hours.';
    } else if (severity >= 5) {
        urgencyClass = 'medium';
        urgencyTitle = 'Monitor Symptoms';
        urgencyDescription = 'Keep track of your symptoms and seek care if they worsen.';
    } else {
        urgencyClass = 'low';
        urgencyTitle = 'Low Priority';
        urgencyDescription = 'Continue home care and monitor for changes.';
    }
    
    urgencyEl.className = `urgency-level ${urgencyClass}`;
    urgencyEl.querySelector('.urgency-text h3').textContent = urgencyTitle;
    urgencyEl.querySelector('.urgency-text p').textContent = urgencyDescription;
    
    // Show warning signs for higher severity
    if (severity >= 7 && warningSignsContainer && warningSignsList) {
        const warningSigns = [
            'Difficulty breathing or shortness of breath',
            'Chest pain or pressure',
            'Severe or worsening headache',
            'High fever (over 103°F/39.4°C)',
            'Signs of dehydration',
            'Persistent vomiting'
        ];
        
        warningSignsList.innerHTML = warningSigns.map(sign => `<li>${sign}</li>`).join('');
        warningSignsContainer.style.display = 'block';
    }
}

function updateRelatedConditions(data) {
    const relatedEl = document.getElementById('relatedConditions');
    if (!relatedEl) return;
    
    const conditions = generateRelatedConditions(data);
    
    relatedEl.innerHTML = `
        <div class="conditions-list">
            ${conditions.map(condition => `
                <div class="condition-item">
                    <h4>${condition.name}</h4>
                    <p>${condition.description}</p>
                    <span class="condition-probability">Likelihood: ${condition.probability}%</span>
                </div>
            `).join('')}
        </div>
    `;
}

function generateRelatedConditions(data) {
    const painLevel = parseInt(data.painLevel || 0);
    const fever = data.fever === '1';
    const fatigue = data.fatigue === '1';
    const conditions = [];
    
    if (fever) {
        conditions.push({
            name: 'Infection-Related Crisis',
            description: 'Fever can trigger vaso-occlusive crises in sickle cell patients',
            probability: 45
        });
    }
    
    if (fatigue && painLevel >= 3) {
        conditions.push({
            name: 'Chronic Pain Syndrome',
            description: 'Ongoing pain and fatigue related to sickle cell disease',
            probability: 35
        });
    }
    
    if (painLevel >= 5) {
        conditions.push({
            name: 'Vaso-occlusive Crisis',
            description: 'Blockage of blood vessels causing severe pain episodes',
            probability: 60
        });
    }
    
    // Default conditions if no specific matches
    if (conditions.length === 0) {
        conditions.push({
            name: 'Routine Monitoring',
            description: 'Regular monitoring and preventive care for sickle cell management',
            probability: 20
        });
        conditions.push({
            name: 'General Wellness',
            description: 'Maintaining good health with proper hydration and medication adherence',
            probability: 30
        });
    }
    
    return conditions;
}

// Settings Page Functions
function loadSettings() {
    populateSettingsFromStorage();
    setupSettingsListeners();
    
    // Set language dropdown to current language
    const languageSelect = document.getElementById('language');
    if (languageSelect) {
        languageSelect.value = currentLanguage;
    }
}

function populateSettingsFromStorage() {
    // Populate form fields with saved settings
    Object.keys(userSettings).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            if (element.type === 'checkbox') {
                element.checked = userSettings[key];
            } else {
                element.value = userSettings[key];
            }
        }
    });
}

function setupSettingsListeners() {
    // Dark mode toggle
    const darkModeToggle = document.getElementById('darkMode');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', toggleDarkMode);
    }
    
    // Language selection
    const languageSelect = document.getElementById('language');
    if (languageSelect) {
        languageSelect.addEventListener('change', changeLanguage);
    }
}

function saveAllSettings() {
    const forms = document.querySelectorAll('.settings-form');
    const newSettings = {};
    
    forms.forEach(form => {
        const formData = new FormData(form);
        for (const [key, value] of formData.entries()) {
            newSettings[key] = value;
        }
    });
    
    // Handle checkboxes separately
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        newSettings[checkbox.name] = checkbox.checked;
    });
    
    userSettings = { ...userSettings, ...newSettings };
    localStorage.setItem('aetherflow_settings', JSON.stringify(userSettings));
    
    showNotification('Settings saved successfully!', 'success');
}

function resetSettings() {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
        localStorage.removeItem('aetherflow_settings');
        userSettings = {};
        location.reload();
    }
}

function initializeDarkMode() {
    // Load dark mode preference from settings
    const isDarkMode = userSettings.darkMode || false;
    
    // Apply dark mode theme
    if (isDarkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
    
    // Update the dark mode checkbox if it exists
    const darkModeToggle = document.getElementById('darkMode');
    if (darkModeToggle) {
        darkModeToggle.checked = isDarkMode;
    }
}

function toggleDarkMode(event) {
    const isDarkMode = event.target.checked;
    
    // Toggle the data-theme attribute on the document root
    if (isDarkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
    
    // Save preference
    userSettings.darkMode = isDarkMode;
    localStorage.setItem('aetherflow_settings', JSON.stringify(userSettings));
    
    // Show confirmation message
    const message = isDarkMode ? 
        getTranslation('settings.dark_mode_enabled') : 
        getTranslation('settings.light_mode_enabled');
    showNotification(message, 'success');
}

function changeLanguage(event) {
    const selectedLanguage = event.target.value;
    
    // Validate language selection
    if (!translations[selectedLanguage]) {
        console.error(`Language '${selectedLanguage}' not supported`);
        return;
    }
    
    // Save language preference to multiple storage methods for redundancy
    currentLanguage = selectedLanguage;
    userSettings.language = selectedLanguage;
    localStorage.setItem('aetherflow_settings', JSON.stringify(userSettings));
    localStorage.setItem('aetherflow_language', selectedLanguage);
    
    // Apply translations immediately
    translatePage();
    
    // Show notification in the new language
    const languageNames = {
        'en': 'English',
        'sw': 'Swahili', 
        'fr': 'French',
        'rw': 'Kinyarwanda',
        'pcm': 'Pidgin English'
    };
    
    const notificationText = getTranslation('notification.language_changed') + ' ' + languageNames[selectedLanguage];
    showNotification(notificationText, 'success');
    
    console.log(`Language changed to: ${selectedLanguage} (${languageNames[selectedLanguage]})`);
}

// Translation functions
function getTranslation(key) {
    try {
        const langTranslations = translations[currentLanguage] || translations['en'];
        const translation = langTranslations[key];
        
        if (translation) {
            return translation;
        }
        
        // Fallback to English if translation not found in current language
        if (currentLanguage !== 'en' && translations['en'][key]) {
            console.warn(`Translation missing for '${key}' in '${currentLanguage}', using English fallback`);
            return translations['en'][key];
        }
        
        // Return key as fallback
        console.warn(`Translation missing for '${key}' in all languages`);
        return key;
    } catch (error) {
        console.error('Translation error:', error);
        return key;
    }
}

function translatePage() {
    console.log('Translating page to:', currentLanguage);
    
    // Translate all elements with data-translate attributes
    const translateElements = document.querySelectorAll('[data-translate]');
    translateElements.forEach(element => {
        const key = element.getAttribute('data-translate');
        const translation = getTranslation(key);
        element.textContent = translation;
    });
    
    // Translate placeholders
    const placeholderElements = document.querySelectorAll('[data-translate-placeholder]');
    placeholderElements.forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        const translation = getTranslation(key);
        element.placeholder = translation;
    });
    
    // Set language dropdown to current language
    const languageSelect = document.getElementById('language');
    if (languageSelect) {
        languageSelect.value = currentLanguage;
    }
    
    console.log('Page translation completed');
}

function translateSettingsPage() {
    // This function is now handled by the general translatePage function
    // but kept for backward compatibility
    translatePage();
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function findCommonWords(texts) {
    const wordCount = {};
    const commonWords = [];
    
    texts.forEach(text => {
        const words = text.split(/\s+/).filter(word => word.length > 3);
        words.forEach(word => {
            wordCount[word] = (wordCount[word] || 0) + 1;
        });
    });
    
    Object.keys(wordCount).forEach(word => {
        if (wordCount[word] > 1) {
            commonWords.push(word);
        }
    });
    
    return commonWords.slice(0, 3);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    switch(type) {
        case 'success':
            notification.style.background = '#28a745';
            break;
        case 'error':
            notification.style.background = '#dc3545';
            break;
        case 'warning':
            notification.style.background = '#ffc107';
            notification.style.color = '#333';
            break;
        default:
            notification.style.background = '#17a2b8';
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Export functions for buttons
function saveResults() {
    const currentAnalysis = JSON.parse(localStorage.getItem('aetherflow_current_analysis'));
    if (currentAnalysis) {
        showNotification('Results saved to your dashboard!', 'success');
    }
}

function printResults() {
    window.print();
}

function exportData() {
    const data = {
        analyses: analysisData,
        settings: userSettings,
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aetherflow-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification('Data exported successfully!', 'success');
}

function exportUserData() {
    exportData();
}

function confirmDeleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        if (confirm('This will permanently delete all your data. Are you absolutely sure?')) {
            // Clear all stored data
            localStorage.removeItem('aetherflow_analyses');
            localStorage.removeItem('aetherflow_settings');
            localStorage.removeItem('aetherflow_current_analysis');
            
            showNotification('Account deleted successfully!', 'success');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }
    }
}

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .dark-mode {
        background-color: #1a1a1a !important;
        color: #ffffff !important;
    }
    
    .dark-mode .navbar {
        background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%) !important;
    }
    
    .dark-mode .feature-card,
    .dark-mode .result-card,
    .dark-mode .dashboard-card,
    .dark-mode .settings-section,
    .dark-mode .symptom-check {
        background: #2c3e50 !important;
        color: #ffffff !important;
    }
    
    .dark-mode footer {
        background: #1a1a1a !important;
    }
`;
document.head.appendChild(style);

// 24/7 Health Companion Chat Logic with Improved Initialization
document.addEventListener('DOMContentLoaded', function() {
    // Add delay to ensure all other scripts and DOM elements are fully loaded
    setTimeout(initializeHealthCompanion, 150);
});

function initializeHealthCompanion() {
(function() {
    // Ensure required CSS classes exist
    if (!document.querySelector('style[data-companion-styles]')) {
        const style = document.createElement('style');
        style.setAttribute('data-companion-styles', 'true');
        style.textContent = `
            .hidden { display: none !important; }
            .follow-up-suggestions { 
                margin: 10px 0; 
                display: flex; 
                flex-wrap: wrap; 
                gap: 8px; 
            }
            .follow-up-btn { 
                background: #f0f8ff; 
                border: 1px solid #667eea; 
                color: #667eea; 
                padding: 6px 12px; 
                border-radius: 15px; 
                font-size: 0.85rem; 
                cursor: pointer; 
                transition: all 0.2s ease; 
            }
            .follow-up-btn:hover { 
                background: #667eea; 
                color: white; 
            }
        `;
        document.head.appendChild(style);
    }

    // DOM elements validation
    const requiredElements = {
        companion: 'healthCompanion',
        toggle: 'companionToggle',
        chat: 'companionChat',
        closeBtn: 'chatClose',
        messages: 'chatMessages',
        input: 'chatInput',
        sendBtn: 'sendMessage',
        typing: 'typingIndicator'
    };

    const elements = {};
    
    // Validate all required elements exist
    for (const [name, id] of Object.entries(requiredElements)) {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`AI Companion: Missing ${name} element (${id})`);
            return; // Exit gracefully if any element is missing
        }
        elements[name] = element;
    }

    // Optional elements (won't break if missing)
    const suggestions = document.getElementById('chatSuggestions');
    const quickActions = elements.companion.querySelectorAll('.quick-action');
    const voiceBtn = document.getElementById('voiceInput');

    // Ensure userSettings exists with safe defaults
    const safeUserSettings = {
        useOnlineAI: true,
        language: 'en',
        ...(typeof userSettings !== 'undefined' ? userSettings : {})
    };

    // Open/close chat with error handling
    function safeToggleChat() {
        try {
            elements.chat.classList.toggle('hidden');
            if (!elements.chat.classList.contains('hidden')) {
                elements.input.focus();
            }
        } catch (error) {
            console.error('Error toggling chat:', error);
        }
    }

    function safeCloseChat() {
        try {
            elements.chat.classList.add('hidden');
        } catch (error) {
            console.error('Error closing chat:', error);
        }
    }

    elements.toggle.onclick = safeToggleChat;
    elements.closeBtn.onclick = safeCloseChat;

    // Safe translation function with fallbacks (no prefix)
    function safeGetTranslation(key, fallback) {
        try {
            if (typeof getTranslation === 'function') {
                const translation = getTranslation(key);
                if (translation && translation !== key) {
                    return translation;
                }
            }
            return fallback;
        } catch (error) {
            console.warn('Translation error for key:', key, error);
            return fallback;
        }
    }

    // Format time safely
    function companionFormatTime(date) {
        try {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (error) {
            return new Date().toTimeString().slice(0, 5);
        }
    }

    // Send message with comprehensive safety
    function safeSendMessage(text, fromUser = true) {
        if (!text || !text.trim() || !elements.messages) return;
        
        try {
            // Sanitize HTML content
            const sanitizedText = text.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
            
            const msgDiv = document.createElement('div');
            msgDiv.className = 'message' + (fromUser ? ' user-message' : ' assistant-message');
            msgDiv.innerHTML = `
                <div class="message-avatar">${fromUser ? '🧑' : '🩺'}</div>
                <div class="message-content">
                    <p>${sanitizedText}</p>
                    <span class="message-time">${companionFormatTime(new Date())}</span>
                </div>
            `;
            
            elements.messages.appendChild(msgDiv);
            
            // Safe scroll operation
            try {
                elements.messages.scrollTop = elements.messages.scrollHeight;
            } catch (scrollError) {
                console.warn('Scroll error:', scrollError);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            // Fallback: show error message
            try {
                elements.messages.innerHTML += `<div class="message error-message">Unable to display message</div>`;
            } catch (fallbackError) {
                console.error('Fallback message error:', fallbackError);
            }
        }
    }

    // Make send message globally accessible for dynamic buttons
    window.companionSendMessage = safeSendMessage;

    // Simulate AI response with enhanced error handling
    function aiRespond(userText) {
        if (!elements.typing) return;
        
        try {
            elements.typing.classList.remove('hidden');
            
            // Simulate realistic response time
            const responseTime = userText.length > 50 ? 2000 : 1200;
            
            setTimeout(async () => {
                try {
                    elements.typing.classList.add('hidden');
                    
                    const response = await getAIResponse(userText);
                    safeSendMessage(response, false);
                    
                    // Add follow-up suggestions based on response
                    addFollowUpSuggestions(userText, response);
                    
                } catch (error) {
                    console.error('AI Response Error:', error);
                    elements.typing.classList.add('hidden');
                    safeSendMessage(
                        'I apologize, but I\'m having trouble processing your request. Please try again or contact a healthcare provider for immediate assistance.', 
                        false
                    );
                }
            }, responseTime + Math.random() * 800);
        } catch (error) {
            console.error('AI Respond initialization error:', error);
            if (elements.typing) {
                elements.typing.classList.add('hidden');
            }
        }
    }

    // Add contextual follow-up suggestions with safety
    function addFollowUpSuggestions(userText, response) {
        try {
            if (!elements.messages) return;
            
            const t = userText.toLowerCase();
            let followUps = [];
            
            if (t.includes('pain')) {
                followUps = ['How long have you had this pain?', 'Rate your pain 1-10', 'Any other symptoms?'];
            } else if (t.includes('fever')) {
                followUps = ['What\'s your temperature?', 'Any other symptoms?', 'How long have you had fever?'];
            } else if (t.includes('tired')) {
                followUps = ['How\'s your sleep?', 'Any stress lately?', 'Eating well?'];
            } else {
                followUps = ['Tell me more', 'Any other symptoms?', 'Need emergency help?'];
            }
            
            // Add suggestion buttons with safe event handling
            setTimeout(() => {
                try {
                    const suggestionDiv = document.createElement('div');
                    suggestionDiv.className = 'follow-up-suggestions';
                    suggestionDiv.innerHTML = followUps.map(suggestion => 
                        `<button class="follow-up-btn" onclick="companionHandleFollowUp('${suggestion.replace(/'/g, "\\'")}', this)">${suggestion}</button>`
                    ).join('');
                    
                    elements.messages.appendChild(suggestionDiv);
                    elements.messages.scrollTop = elements.messages.scrollHeight;
                } catch (error) {
                    console.error('Error adding follow-up suggestions:', error);
                }
            }, 500);
        } catch (error) {
            console.error('Error in addFollowUpSuggestions:', error);
        }
    }

    // Global function for follow-up button handling
    window.companionHandleFollowUp = function(suggestion, buttonElement) {
        try {
            if (buttonElement && buttonElement.closest) {
                const suggestionContainer = buttonElement.closest('.follow-up-suggestions');
                if (suggestionContainer) {
                    suggestionContainer.remove();
                }
            }
            
            if (elements.input) {
                elements.input.value = suggestion;
                companionHandleSend();
            }
        } catch (error) {
            console.error('Error handling follow-up:', error);
        }
    };

    // Simple AI logic with safe settings access and better online detection
    function getAIResponse(text) {
        try {
            // Always try online first if navigator is online
            if (navigator.onLine) {
                console.log('Online detected, attempting online AI...');
                return getOnlineAIResponse(text);
            } else {
                console.log('Offline detected, using offline AI...');
                return Promise.resolve(getOfflineAIResponse(text));
            }
        } catch (error) {
            console.error('AI Response routing error:', error);
            return Promise.resolve(getOfflineAIResponse(text));
        }
    }

    // Enhanced offline AI with safe translation access
    function getOfflineAIResponse(text) {
        try {
            const t = text.toLowerCase();
            
            // Emergency detection
            if (isEmergencyQuery(t)) {
                return getEmergencyResponse(t);
            }
            
            // Symptom analysis
            const symptoms = extractSymptoms(t);
            if (symptoms.length > 0) {
                return getSymptomResponse(symptoms, t);
            }
            
            // General health queries
            const healthTopic = identifyHealthTopic(t);
            if (healthTopic) {
                return getHealthTopicResponse(healthTopic, t);
            }
            
            // Greeting and general responses
            if (t.includes('hello') || t.includes('hi') || t.includes('hey')) {
                return 'Hello! I\'m here to help with your health questions. What can I assist you with today?';
            }
            
            // Default response
            return 'I understand you\'re asking about your health. Can you provide more specific details about your symptoms or concerns?';
        } catch (error) {
            console.error('Offline AI error:', error);
            return 'I\'m here to help with your health questions. Please try rephrasing your question.';
        }
    }

    // Emergency detection system
    function isEmergencyQuery(text) {
        const emergencyKeywords = [
            'emergency', 'urgent', 'severe', 'chest pain', 'can\'t breathe', 
            'difficulty breathing', 'unconscious', 'heart attack', 'stroke',
            'bleeding heavily', 'choking', 'overdose', 'suicide', 'severe pain',
            'can\'t move', 'paralyzed', 'seizure', 'convulsion'
        ];
        return emergencyKeywords.some(keyword => text.includes(keyword));
    }

    function getEmergencyResponse(text) {
        return `🚨 **EMERGENCY ALERT** 🚨\n\nIf you are experiencing a life-threatening emergency:\n• Call emergency services immediately (911, 999, 112)\n• Get to the nearest emergency room\n• Don't wait for medical advice\n\nFor severe symptoms like:\n• Chest pain or pressure\n• Difficulty breathing\n• Severe bleeding\n• Loss of consciousness\n• Signs of stroke\n\nSeek immediate professional medical help. Your safety is the priority!`;
    }

    // Symptom extraction and analysis
    function extractSymptoms(text) {
        const symptomDatabase = {
            'pain': ['pain', 'ache', 'hurt', 'sore', 'tender', 'throbbing', 'sharp', 'dull'],
            'fever': ['fever', 'hot', 'temperature', 'chills', 'sweating', 'feverish'],
            'fatigue': ['tired', 'exhausted', 'weak', 'fatigue', 'drowsy', 'sleepy'],
            'nausea': ['nausea', 'sick', 'vomit', 'throw up', 'queasy', 'stomach'],
            'headache': ['headache', 'head pain', 'migraine', 'head hurt'],
            'cough': ['cough', 'coughing', 'throat', 'scratchy throat'],
            'breathing': ['breathing', 'breath', 'shortness', 'wheezing', 'lungs'],
            'dizziness': ['dizzy', 'lightheaded', 'vertigo', 'spinning', 'balance']
        };
        
        const foundSymptoms = [];
        Object.keys(symptomDatabase).forEach(symptom => {
            if (symptomDatabase[symptom].some(keyword => text.includes(keyword))) {
                foundSymptoms.push(symptom);
            }
        });
        
        return foundSymptoms;
    }

    function getSymptomResponse(symptoms, originalText) {
        const responses = {
            'pain': `I understand you're experiencing pain. Here's what I recommend:\n\n• **Rest** the affected area\n• **Apply ice or heat** (whichever feels better)\n• **Stay hydrated**\n• **Monitor pain levels** (1-10 scale)\n\n⚠️ Seek medical attention if:\n• Pain is severe (8/10 or higher)\n• Pain persists for more than 48 hours\n• You have signs of infection (swelling, redness, warmth)`,
            
            'fever': `Fever can indicate your body is fighting an infection. Here's my guidance:\n\n• **Rest and hydrate** with plenty of fluids\n• **Monitor temperature** regularly\n• **Cool compress** on forehead\n• **Light clothing** and cool environment\n\n⚠️ Seek medical care if:\n• Temperature over 103°F (39.4°C)\n• Fever lasts more than 3 days\n• Severe symptoms accompany fever`,
            
            'fatigue': `Fatigue has many causes. Let's address it systematically:\n\n• **Ensure quality sleep** (7-9 hours)\n• **Stay hydrated** throughout the day\n• **Eat nutritious meals** regularly\n• **Light exercise** if possible\n• **Manage stress** with relaxation techniques\n\n💡 Consider if you've had:\n• Recent illness\n• Changes in medication\n• Increased stress\n• Poor sleep quality`,
            
            'headache': `Headaches can be managed effectively:\n\n• **Rest in a quiet, dark room**\n• **Apply cold or warm compress**\n• **Stay hydrated**\n• **Gentle neck/shoulder massage**\n• **Avoid triggers** (bright lights, loud sounds)\n\n⚠️ Seek immediate care for:\n• Sudden, severe headache\n• Headache with fever and stiff neck\n• Vision changes\n• Weakness or numbness`,
            
            'cough': `For cough management:\n\n• **Stay hydrated** (warm liquids help)\n• **Use humidifier** or steam\n• **Throat lozenges** for comfort\n• **Avoid irritants** (smoke, strong scents)\n• **Elevate head** while sleeping\n\n⚠️ See a doctor if:\n• Cough persists over 2 weeks\n• Blood in cough\n• High fever with cough\n• Difficulty breathing`
        };
        
        // Get the most relevant response
        const primarySymptom = symptoms[0];
        let response = responses[primarySymptom] || 'I understand you\'re experiencing symptoms. Please monitor them closely and consult a healthcare provider if they worsen.';
        
        // Add multiple symptom warning
        if (symptoms.length > 1) {
            response += `\n\n📋 **Multiple Symptoms Detected**: ${symptoms.join(', ')}\nHaving multiple symptoms may require medical evaluation. Consider contacting a healthcare provider.`;
        }
        
        return response;
    }

    // Health topic identification
    function identifyHealthTopic(text) {
        const topics = {
            'nutrition': ['nutrition', 'diet', 'eating', 'food', 'vitamin', 'supplement'],
            'exercise': ['exercise', 'workout', 'fitness', 'activity', 'movement'],
            'sleep': ['sleep', 'insomnia', 'rest', 'sleeping', 'bedtime'],
            'stress': ['stress', 'anxiety', 'worry', 'nervous', 'overwhelmed'],
            'medication': ['medication', 'medicine', 'pills', 'prescription', 'dosage'],
            'prevention': ['prevent', 'avoid', 'protect', 'healthy habits', 'wellness']
        };
        
        for (const [topic, keywords] of Object.entries(topics)) {
            if (keywords.some(keyword => text.includes(keyword))) {
                return topic;
            }
        }
        return null;
    }

    function getHealthTopicResponse(topic, text) {
        const responses = {
            'nutrition': `🥗 **Nutrition Guidance**:\n\n• **Balanced meals** with fruits, vegetables, proteins\n• **Stay hydrated** (8+ glasses water daily)\n• **Limit processed foods** and added sugars\n• **Regular meal times** to maintain energy\n• **Consider supplements** only if recommended by healthcare provider\n\n💡 For specific dietary needs, consult a registered dietitian.`,
            
            'exercise': `🏃 **Exercise Recommendations**:\n\n• **Start gradually** if new to exercise\n• **Aim for 150 minutes** moderate activity weekly\n• **Include strength training** 2x per week\n• **Listen to your body** and rest when needed\n• **Stay hydrated** before, during, after exercise\n\n⚠️ Consult a doctor before starting if you have health conditions.`,
            
            'sleep': `😴 **Sleep Hygiene Tips**:\n\n• **Consistent sleep schedule** (same time daily)\n• **Cool, dark, quiet** sleep environment\n• **Limit screens** 1 hour before bed\n• **Relaxing bedtime routine**\n• **Avoid caffeine** late in the day\n\n💤 Adults need 7-9 hours of quality sleep nightly.`,
            
            'stress': `🧘 **Stress Management**:\n\n• **Deep breathing exercises** (4-7-8 technique)\n• **Regular physical activity**\n• **Mindfulness or meditation**\n• **Connect with others** for support\n• **Prioritize and organize** tasks\n• **Professional help** if stress is overwhelming\n\n📱 Consider stress management apps or counseling resources.`,
            
            'medication': `💊 **Medication Safety**:\n\n• **Take as prescribed** by your healthcare provider\n• **Don't skip or double doses**\n• **Store properly** (temperature, moisture)\n• **Check expiration dates** regularly\n• **Keep updated list** of all medications\n• **Report side effects** to your doctor\n\n⚠️ Never stop prescribed medications without consulting your healthcare provider.`,
            
            'prevention': `🛡️ **Prevention Tips**:\n\n• **Regular check-ups** with healthcare providers\n• **Stay up-to-date** with vaccinations\n• **Healthy lifestyle** (diet, exercise, sleep)\n• **Hand hygiene** and infection prevention\n• **Stress management** for mental health\n• **Avoid risky behaviors** (smoking, excessive alcohol)\n\n🎯 Prevention is the best medicine!`
        };
        
        return responses[topic] || 'I can help with general health information. What specific aspect would you like to know more about?';
    }

    // Online AI integration with comprehensive error handling
    async function getOnlineAIResponse(text) {
        try {
            // Skip health check for now and go directly to API
            console.log('Attempting online AI request...');
            
            const response = await fetch('http://localhost:3001/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: text,
                    context: 'health_companion',
                    language: safeUserSettings.language || 'en'
                }),
                signal: AbortSignal.timeout(5000) // 5 second timeout
            });
            
            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Online AI response received:', data);
            
            if (typeof showNotification === 'function') {
                showNotification('Using online AI mode', 'success');
            }
            
            return data.response || data.message || getOfflineAIResponse(text);
            
        } catch (error) {
            console.log('Online AI failed, using offline mode:', error.message);
            if (typeof showNotification === 'function') {
                showNotification('API unavailable - using offline AI', 'info');
            }
            return getOfflineAIResponse(text);
        }
    }

    // Handle send with comprehensive error handling
    function companionHandleSend() {
        try {
            if (!elements.input) return;
            
            const text = elements.input.value;
            if (!text || !text.trim()) return;
            
            safeSendMessage(text, true);
            elements.input.value = '';
            aiRespond(text);
        } catch (error) {
            console.error('Error in send handler:', error);
        }
    }

    // Make send handler globally accessible
    window.companionHandleSend = companionHandleSend;

    // Set up event listeners with error handling
    try {
        elements.sendBtn.onclick = companionHandleSend;
        elements.input.addEventListener('keydown', e => {
            try {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    companionHandleSend();
                }
            } catch (error) {
                console.error('Error in keydown handler:', error);
            }
        });
    } catch (error) {
        console.error('Error setting up send event listeners:', error);
    }

    // Suggestions with error handling
    if (suggestions) {
        try {
            suggestions.addEventListener('click', e => {
                try {
                    if (e.target.classList.contains('suggestion') && elements.input) {
                        elements.input.value = e.target.textContent;
                        companionHandleSend();
                    }
                } catch (error) {
                    console.error('Error handling suggestion click:', error);
                }
            });
        } catch (error) {
            console.error('Error setting up suggestions:', error);
        }
    }

    // Quick actions with safety
    if (quickActions && quickActions.length > 0) {
        try {
            quickActions.forEach(btn => {
                btn.onclick = () => {
                    try {
                        if (elements.input) {
                            const text = btn.textContent;
                            elements.input.value = text;
                            companionHandleSend();
                        }
                    } catch (error) {
                        console.error('Error in quick action:', error);
                    }
                };
            });
        } catch (error) {
            console.error('Error setting up quick actions:', error);
        }
    }

    // Voice input with comprehensive browser compatibility and error handling
    if (voiceBtn) {
        try {
            if (window.SpeechRecognition || window.webkitSpeechRecognition) {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                const recognition = new SpeechRecognition();
                
                recognition.lang = safeUserSettings.language === 'en' ? 'en-US' : 'en-US';
                recognition.continuous = false;
                recognition.interimResults = false;
                
                voiceBtn.onclick = () => {
                    try {
                        recognition.start();
                        voiceBtn.disabled = true;
                        voiceBtn.textContent = '🎙️';
                        voiceBtn.title = 'Listening...';
                    } catch (error) {
                        console.error('Speech recognition start error:', error);
                        if (typeof showNotification === 'function') {
                            showNotification('Voice input failed to start', 'error');
                        }
                        voiceBtn.disabled = false;
                    }
                };
                
                recognition.onresult = event => {
                    try {
                        const transcript = event.results[0][0].transcript;
                        if (elements.input) {
                            elements.input.value = transcript;
                            companionHandleSend();
                        }
                        voiceBtn.disabled = false;
                        voiceBtn.textContent = '🎤';
                        voiceBtn.title = 'Voice input';
                    } catch (error) {
                        console.error('Speech recognition result error:', error);
                        voiceBtn.disabled = false;
                    }
                };
                
                recognition.onerror = (event) => {
                    console.error('Speech recognition error:', event.error);
                    if (typeof showNotification === 'function') {
                        showNotification('Voice input failed. Please try again.', 'error');
                    }
                    voiceBtn.disabled = false;
                    voiceBtn.textContent = '🎤';
                    voiceBtn.title = 'Voice input';
                };
                
                recognition.onend = () => {
                    voiceBtn.disabled = false;
                    voiceBtn.textContent = '🎤';
                    voiceBtn.title = 'Voice input';
                };
                
            } else {
                voiceBtn.style.display = 'none';
                console.log('Speech recognition not supported in this browser');
            }
        } catch (error) {
            console.error('Voice input setup error:', error);
            if (voiceBtn) {
                voiceBtn.style.display = 'none';
            }
        }
    }
})();
}
