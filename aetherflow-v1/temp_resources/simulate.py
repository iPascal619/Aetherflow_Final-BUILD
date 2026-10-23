import pandas as pd
import numpy as np
import math

# --- Configuration Object for Easy Tuning ---
CONFIG = {
    'simulation_params': {
        'num_patients': 200,
        'days_per_patient': 30, # Simulating a 1-month period
    },
    'patient_profile_params': {
        'age_range': (18, 55),
        'sex_distribution': {'Male': 0.45, 'Female': 0.55},
        'genotype_distribution': {'HbSS': 0.65, 'HbSC': 0.25, 'HbS_beta_thal': 0.10},
        'history_acs_prob': 0.15, # Probability of having a history of Acute Chest Syndrome
        'asthma_prob': 0.20, # Probability of having co-existing asthma
    },
    'temporal_params': {
        'pain_memory_alpha': 0.5,
    },
    'event_params': {
        'flu_season_days': range(15, 31),
        'flu_season_fever_increase': 0.05,
        'weather_temp_range': (20, 38), # Celsius
        'weather_humidity_range': (30, 90), # Percent
    },
    'risk_model_weights': {
        # Core Symptoms
        'pain': 0.35, 'pain_squared': 0.03, 'fatigue': 0.1, 'fever': 0.2, 'joint_pain': 0.15,
        # New PROs
        'dactylitis': 0.2, 'shortness_of_breath': 0.4, 'sleep_quality': -0.15, 'stress_level': 0.1,
        # Lab Markers
        'wbc': 0.05, 'ldh': 0.08, 'crp': 0.15, 'hbf': -0.2, # Protective
        # Historical & Comorbidities
        'history_acs': 0.3, 'asthma': 0.25, 'age_factor': 0.01,
        # Other Factors
        'hydration_low': 0.2, 'medication_adherence': -0.6,
        # Weather
        'temp': 0.02, 'humidity': 0.01,
        # Medication types
        'hydroxyurea': -0.4, 'pain_med': -0.1
    },
    'missing_data_params': {
        'fraction_missing': 0.03,
        'columns_to_affect': ['PainLevel', 'Fatigue', 'JointPain', 'Fever', 'HydrationLevel', 
                              'MedicationAdherence', 'Sleep_Quality', 'Reported_Stress_Level', 
                              'WBC_Count', 'LDH', 'CRP', 'Temperature', 'Humidity', 'Hydroxyurea', 'PainMed'],
    }
}

def sigmoid(x):
    """Sigmoid function to map any value to a probability between 0 and 1."""
    if x < -500: return 0
    return 1 / (1 + math.exp(-x))

def generate_patient_profiles(config):
    """Generates a DataFrame of static patient profiles, including comorbidities and baseline labs."""
    num_patients = config['simulation_params']['num_patients']
    p_params = config['patient_profile_params']
    
    profiles = pd.DataFrame({
        'PatientID': range(1, num_patients + 1),
        'Age': np.random.randint(p_params['age_range'][0], p_params['age_range'][1], num_patients),
        'Sex': np.random.choice(list(p_params['sex_distribution'].keys()), num_patients, p=list(p_params['sex_distribution'].values())),
        'Genotype': np.random.choice(list(p_params['genotype_distribution'].keys()), num_patients, p=list(p_params['genotype_distribution'].values())),
        'History_of_ACS': np.random.binomial(1, p_params['history_acs_prob'], num_patients),
        'Coexisting_Asthma': np.random.binomial(1, p_params['asthma_prob'], num_patients)
    })
    
    # Genotype influences baseline lab values
    genotype_mods = {'HbSS': {'wbc': 12, 'ldh': 400, 'hbf': 5}, 'HbSC': {'wbc': 8, 'ldh': 250, 'hbf': 2}, 'HbS_beta_thal': {'wbc': 10, 'ldh': 300, 'hbf': 10}}
    profiles['Baseline_WBC'] = profiles['Genotype'].apply(lambda g: np.random.normal(genotype_mods[g]['wbc'], 2))
    profiles['Baseline_LDH'] = profiles['Genotype'].apply(lambda g: np.random.normal(genotype_mods[g]['ldh'], 50))
    profiles['HbF_percent'] = profiles['Genotype'].apply(lambda g: np.random.normal(genotype_mods[g]['hbf'], 2))
    
    return profiles

def generate_patient_trajectory(patient_profile, config):
    """Generates a longitudinal trajectory for a single patient with advanced features."""
    num_days = config['simulation_params']['days_per_patient']
    
    # Patient's baseline characteristics
    genotype_pain_mod = {'HbSS': 1.5, 'HbSC': 0.5, 'HbS_beta_thal': 1.0}
    base_pain = np.random.uniform(0, 3) + genotype_pain_mod.get(patient_profile['Genotype'], 1.0)
    adherence_prob = np.random.uniform(0.5, 0.95)
    pain_yesterday = base_pain
    prior_crises = 0
    # Medication types
    hydroxyurea_prob = np.random.uniform(0.4, 0.7) # 40-70% on hydroxyurea
    pain_med_prob = np.random.uniform(0.3, 0.8) # 30-80% on pain meds

    records = []
    for day in range(1, num_days + 1):
        # --- Weather/Environmental Factors ---
        temp = np.random.uniform(*config['event_params']['weather_temp_range'])
        humidity = np.random.uniform(*config['event_params']['weather_humidity_range'])

        # --- Core Symptom Generation ---
        alpha = config['temporal_params']['pain_memory_alpha']
        pain_level = np.clip(round(alpha * pain_yesterday + (1-alpha) * base_pain + np.random.normal(0,0.5)), 0, 10)
        pain_yesterday = pain_level

        # --- Event/Seasonality ---
        fever_increase = config['event_params']['flu_season_fever_increase'] if day in config['event_params']['flu_season_days'] else 0

        # --- New PROs and Daily Symptoms (Conditional) ---
        prob_fatigue = 0.1 + (pain_level / 10) * 0.6
        prob_dactylitis = 0.01 + (pain_level / 10) * 0.1
        prob_short_breath = 0.02 + (pain_level / 10) * 0.3 + patient_profile['Coexisting_Asthma'] * 0.05
        prob_fever = 0.02 + (pain_level / 10) * 0.3 + fever_increase

        # --- Dynamic Lab Marker Simulation ---
        wbc_spike = pain_level * 0.5
        ldh_spike = pain_level * 20
        daily_wbc = patient_profile['Baseline_WBC'] + np.random.normal(0, 1) + wbc_spike
        daily_ldh = patient_profile['Baseline_LDH'] + np.random.normal(0, 20) + ldh_spike
        crp = np.random.uniform(1, 5) + (np.random.binomial(1, prob_fever) * np.random.uniform(20, 100)) # Spikes with fever

        # --- Medication Types ---
        hydroxyurea = np.random.binomial(1, hydroxyurea_prob)
        pain_med = np.random.binomial(1, pain_med_prob)

        # --- Prior Crisis History (rolling count) ---
        # We'll update this after crisis label assignment

        records.append({
            'PatientID': patient_profile['PatientID'],
            'Day': day,
            'PainLevel': pain_level,
            'Fatigue': np.random.binomial(1, np.clip(prob_fatigue,0,1)),
            'Fever': 1 if crp > 20 else 0, # Fever is tied to high CRP
            'JointPain': np.random.binomial(1, np.clip(0.05 + (pain_level / 10) * 0.7,0,1)),
            'Dactylitis': np.random.binomial(1, np.clip(prob_dactylitis,0,1)),
            'Shortness_of_Breath': np.random.binomial(1, np.clip(prob_short_breath,0,1)),
            'Sleep_Quality': np.random.randint(1, 6) - round(pain_level/4), # Pain affects sleep
            'Reported_Stress_Level': np.random.randint(1, 6) + round(pain_level/5),
            'HydrationLevel': np.random.choice(['Low', 'Normal', 'High'], p=[0.2, 0.6, 0.2]),
            'MedicationAdherence': np.random.binomial(1, adherence_prob),
            'WBC_Count': round(daily_wbc, 2),
            'LDH': round(daily_ldh, 2),
            'CRP': round(crp, 2),
            'Temperature': round(temp, 1),
            'Humidity': round(humidity, 1),
            'Hydroxyurea': hydroxyurea,
            'PainMed': pain_med,
            'PriorCrises': prior_crises # Will be updated after crisis assignment
        })
    return records

def calculate_crisis_probability(df, config):
    """Calculates crisis probability using the comprehensive risk model."""
    w = config['risk_model_weights']
    df['hydration_score'] = df['HydrationLevel'].map({'Low': w['hydration_low'], 'Normal': 0, 'High': -0.1})
    df['sleep_score'] = w['sleep_quality'] * (5 - df['Sleep_Quality'])
    df['stress_score'] = w['stress_level'] * df['Reported_Stress_Level']
    df['temp_score'] = w['temp'] * (df['Temperature'] - 25) # Centered at 25C
    df['humidity_score'] = w['humidity'] * (df['Humidity'] - 60) # Centered at 60%
    df['hydroxyurea_score'] = w['hydroxyurea'] * df['Hydroxyurea']
    df['painmed_score'] = w['pain_med'] * df['PainMed']

    logit = (
        w['pain'] * df['PainLevel'] + w['pain_squared'] * (df['PainLevel'] ** 2) +
        w['fatigue'] * df['Fatigue'] + w['fever'] * df['Fever'] + w['joint_pain'] * df['JointPain'] +
        w['dactylitis'] * df['Dactylitis'] + w['shortness_of_breath'] * df['Shortness_of_Breath'] +
        df['sleep_score'] + df['stress_score'] + df['hydration_score'] +
        w['wbc'] * df['WBC_Count'] + w['ldh'] * (df['LDH']/100) + w['crp'] * (df['CRP']/10) +
        w['hbf'] * df['HbF_percent'] +
        w['history_acs'] * df['History_of_ACS'] + w['asthma'] * df['Coexisting_Asthma'] +
        w['age_factor'] * df['Age'] +
        w['medication_adherence'] * df['MedicationAdherence'] +
        df['temp_score'] + df['humidity_score'] +
        df['hydroxyurea_score'] + df['painmed_score']
    )
    noise = np.random.normal(0, 0.1, len(df))
    df['P_Crisis'] = (logit + noise).apply(sigmoid)
    return df

def assign_labels_dynamically(df):
    """Assigns binary class labels based on the median probability."""
    prob_threshold = df['P_Crisis'].median()
    print(f"Dynamic Probability Threshold (Median): {prob_threshold:.4f}")
    df['CrisisLikely'] = (df['P_Crisis'] > prob_threshold).astype(int)
    # --- Temporal Crisis Window: Flag if crisis likely in next 48h (next 2 days) ---
    df['CrisisNext48h'] = 0
    for pid in df['PatientID'].unique():
        patient_df = df[df['PatientID'] == pid]
        crisis_idx = patient_df.index[patient_df['CrisisLikely'] == 1].tolist()
        for idx in crisis_idx:
            # Flag previous 2 days as "crisis window"
            for offset in range(1, 3):
                prev_idx = idx - offset
                if prev_idx in patient_df.index:
                    df.at[prev_idx, 'CrisisNext48h'] = 1
    # --- Update PriorCrises (rolling sum up to previous day) ---
    df['PriorCrises'] = 0
    for pid in df['PatientID'].unique():
        patient_mask = df['PatientID'] == pid
        crisis_cumsum = df.loc[patient_mask, 'CrisisLikely'].cumsum().shift(1).fillna(0)
        df.loc[patient_mask, 'PriorCrises'] = crisis_cumsum.astype(int)
    return df

def introduce_missing_data(df, config):
    """Randomly introduces missing values into the dataset."""
    params = config['missing_data_params']
    df_missing = df.copy()
    for col in params['columns_to_affect']:
        if col in df_missing.columns:
            mask = np.random.rand(len(df_missing)) < params['fraction_missing']
            df_missing.loc[mask, col] = np.nan
    return df_missing

def main(config):
    """Main function to generate and display the comprehensive dataset."""
    print("Starting comprehensive clinical simulation...")
    
    patient_profiles = generate_patient_profiles(config)
    
    all_records = []
    for _, profile in patient_profiles.iterrows():
        all_records.extend(generate_patient_trajectory(profile, config))
    
    trajectories_df = pd.DataFrame(all_records)
    full_df = pd.merge(trajectories_df, patient_profiles, on='PatientID')
    
    full_df = calculate_crisis_probability(full_df, config)
    full_df = assign_labels_dynamically(full_df)
    
    final_df = full_df.drop(columns=['hydration_score', 'sleep_score', 'stress_score', 'P_Crisis', 'temp_score', 'humidity_score', 'hydroxyurea_score', 'painmed_score'])

    final_df_with_missing = introduce_missing_data(final_df, config)

    print(f"\nSuccessfully generated {len(final_df_with_missing)} patient-day records.")

    print("\n--- Dataset Head (with new features & potential missing values) ---")
    print(final_df_with_missing.head(10).to_markdown(index=False))

    print("\n--- Missing Data Counts ---")
    print(final_df_with_missing.isnull().sum()[lambda x: x > 0])

    print("\n--- Target Class Distribution ---")
    print(final_df_with_missing['CrisisLikely'].value_counts(normalize=True))

    # --- Save output to CSV ---
    output_file = "sickle_cell_crisis_simulated.csv"
    final_df_with_missing.to_csv(output_file, index=False)
    print(f"\nData saved to {output_file}")

if __name__ == "__main__":
    main(CONFIG)
