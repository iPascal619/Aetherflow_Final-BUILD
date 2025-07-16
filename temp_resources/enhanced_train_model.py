# Enhanced Sickle Cell Crisis Prediction Model
# This script implements advanced techniques to improve model accuracy

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, StratifiedKFold
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler, LabelEncoder, PolynomialFeatures
from sklearn.impute import SimpleImputer
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score, roc_curve
from sklearn.pipeline import Pipeline
from sklearn.feature_selection import SelectKBest, f_classif, RFE
import joblib
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

class EnhancedSickleCellCrisisModel:
    def __init__(self):
        self.model = None
        self.preprocessor = None
        self.feature_selector = None
        self.label_encoders = {}
        self.feature_names = []
        self.model_info = {}
        
    def load_data(self, filepath='sickle_cell_crisis_simulated.csv'):
        """Load the synthetic sickle cell crisis data."""
        try:
            df = pd.read_csv(filepath)
            print(f"Loaded {len(df)} records from {filepath}")
            print(f"Dataset shape: {df.shape}")
            return df
        except FileNotFoundError:
            print(f"Error: File {filepath} not found. Please run simulate.py first.")
            return None
    
    def create_advanced_features(self, df):
        """Create advanced engineered features."""
        print("Creating advanced features...")
        
        # Pain-related interaction features
        df['PainLevel_squared'] = df['PainLevel'] ** 2
        df['PainLevel_cubed'] = df['PainLevel'] ** 3
        df['Pain_Fatigue_interaction'] = df['PainLevel'] * df['Fatigue']
        df['Pain_JointPain_interaction'] = df['PainLevel'] * df['JointPain']
        
        # Lab marker ratios and combinations
        df['WBC_LDH_ratio'] = df['WBC_Count'] / (df['LDH'] + 1e-6)  # Avoid division by zero
        df['CRP_WBC_ratio'] = df['CRP'] / (df['WBC_Count'] + 1e-6)
        df['Lab_crisis_score'] = df['WBC_Count'] * 0.1 + df['LDH'] * 0.001 + df['CRP'] * 0.1
        
        # Symptom clustering
        df['Respiratory_symptoms'] = df['Shortness_of_Breath'] + df['Coexisting_Asthma']
        df['Total_symptoms'] = (df['Fatigue'] + df['Fever'] + df['JointPain'] + 
                               df['Dactylitis'] + df['Shortness_of_Breath'])
        
        # Medication effectiveness
        df['Med_adherence_HU_interaction'] = df['MedicationAdherence'] * df['Hydroxyurea']
        df['Total_medications'] = df['Hydroxyurea'] + df['PainMed']
        
        # Environmental stress factors
        df['Temp_deviation'] = np.abs(df['Temperature'] - 25)  # Deviation from optimal 25°C
        df['Humidity_stress'] = np.where(df['Humidity'] > 70, df['Humidity'] - 70, 0)
        df['Environmental_stress'] = df['Temp_deviation'] + df['Humidity_stress'] * 0.1
        
        # Age-genotype interactions
        df['Age_HbSS_interaction'] = df['Age'] * (df['Genotype'] == 'HbSS').astype(int)
        df['Age_squared'] = df['Age'] ** 2
        
        # Crisis history patterns
        df['Crisis_risk_score'] = (df['PriorCrises'] * 2 + df['History_of_ACS'] * 3 + 
                                  df['Coexisting_Asthma'] * 1.5)
        
        # Sleep and stress combined
        df['Sleep_stress_combined'] = (6 - df['Sleep_Quality']) + df['Reported_Stress_Level']
        
        # HbF protective effect
        df['HbF_protective_score'] = np.where(df['HbF_percent'] > 5, 
                                             (df['HbF_percent'] - 5) * -0.2, 0)
        
        print(f"Added {len([col for col in df.columns if '_' in col and col not in self.feature_names])} new features")
        return df
    
    def preprocess_data(self, df, target_column='CrisisNext48h'):
        """Enhanced preprocessing with feature engineering."""
        print("\nPreprocessing data...")
        
        # Create advanced features first
        df = self.create_advanced_features(df)
        
        # Drop columns that shouldn't be used for prediction
        columns_to_drop = [
            'PatientID', 'Day', 'CrisisLikely',  
            'Baseline_WBC', 'Baseline_LDH'
        ]
        
        # Keep target column separate
        if target_column in df.columns:
            y = df[target_column].copy()
            columns_to_drop.append(target_column)
        else:
            print(f"Warning: Target column '{target_column}' not found. Using 'CrisisLikely' instead.")
            y = df['CrisisLikely'].copy()
            columns_to_drop.append('CrisisLikely')
        
        # Create feature matrix
        X = df.drop(columns=[col for col in columns_to_drop if col in df.columns])
        
        # Handle categorical variables
        categorical_columns = ['Sex', 'Genotype', 'HydrationLevel']
        for col in categorical_columns:
            if col in X.columns:
                le = LabelEncoder()
                X[col] = le.fit_transform(X[col].astype(str))
                self.label_encoders[col] = le
        
        # Store feature names
        self.feature_names = list(X.columns)
        
        print(f"Total features after engineering: {len(self.feature_names)}")
        print(f"Target distribution: {y.value_counts().to_dict()}")
        
        return X, y
    
    def train_lightweight_models(self, X, y, test_size=0.2, random_state=42):
        """Train lightweight, interpretable models with advanced techniques."""
        print("\nTraining lightweight interpretable models...")
        
        # Stratified split to maintain class distribution
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=random_state, stratify=y
        )
        
        # Enhanced preprocessing pipeline
        self.preprocessor = Pipeline([
            ('imputer', SimpleImputer(strategy='median')),
            ('scaler', StandardScaler())
        ])
        
        # Fit preprocessor
        X_train_processed = self.preprocessor.fit_transform(X_train)
        X_test_processed = self.preprocessor.transform(X_test)
        
        # Feature selection
        print("Performing feature selection...")
        self.feature_selector = SelectKBest(f_classif, k=min(30, X_train_processed.shape[1]))
        X_train_selected = self.feature_selector.fit_transform(X_train_processed, y_train)
        X_test_selected = self.feature_selector.transform(X_test_processed)
        
        # Get selected feature names
        selected_features = self.feature_selector.get_support()
        selected_feature_names = [self.feature_names[i] for i in range(len(selected_features)) if selected_features[i]]
        print(f"Selected {len(selected_feature_names)} best features")
        
        # Train multiple models and select the best
        models = {
            'Logistic_L1': LogisticRegression(C=0.1, penalty='l1', solver='liblinear', max_iter=1000, random_state=random_state),
            'Logistic_L2': LogisticRegression(C=1.0, penalty='l2', max_iter=1000, random_state=random_state),
            'Logistic_ElasticNet': LogisticRegression(C=1.0, penalty='elasticnet', solver='saga', l1_ratio=0.5, max_iter=1000, random_state=random_state)
        }
        
        best_score = 0
        best_model = None
        best_model_name = ""
        
        # Cross-validation for model selection
        cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=random_state)
        
        for name, model in models.items():
            print(f"Training {name}...")
            
            # Cross-validation
            cv_scores = []
            for train_idx, val_idx in cv.split(X_train_selected, y_train):
                X_cv_train, X_cv_val = X_train_selected[train_idx], X_train_selected[val_idx]
                y_cv_train, y_cv_val = y_train.iloc[train_idx], y_train.iloc[val_idx]
                
                model_copy = type(model)(**model.get_params())
                model_copy.fit(X_cv_train, y_cv_train)
                y_cv_pred_proba = model_copy.predict_proba(X_cv_val)[:, 1]
                cv_scores.append(roc_auc_score(y_cv_val, y_cv_pred_proba))
            
            mean_cv_score = np.mean(cv_scores)
            std_cv_score = np.std(cv_scores)
            print(f"{name} CV AUC: {mean_cv_score:.4f} (+/- {std_cv_score:.4f})")
            
            if mean_cv_score > best_score:
                best_score = mean_cv_score
                best_model = model
                best_model_name = name
        
        print(f"\nBest model: {best_model_name} with CV AUC: {best_score:.4f}")
        
        # Train the best model on full training set
        self.model = best_model
        self.model.fit(X_train_selected, y_train)
        
        # Store model info
        self.model_info = {
            'best_model': best_model_name,
            'best_cv_score': best_score,
            'selected_features': selected_feature_names,
            'training_date': datetime.now().isoformat(),
            'feature_count': len(selected_feature_names),
            'training_samples': len(X_train)
        }
        
        # Evaluate on test set
        y_pred = self.model.predict(X_test_selected)
        y_pred_proba = self.model.predict_proba(X_test_selected)[:, 1]
        
        print("\n--- Lightweight Model Test Performance ---")
        print(classification_report(y_test, y_pred))
        print(f"ROC AUC Score: {roc_auc_score(y_test, y_pred_proba):.4f}")
        
        return X_test_selected, y_test, y_pred, y_pred_proba
    
    def get_feature_importance(self, top_n=20):
        """Get feature importance from the trained model."""
        if self.model is None:
            print("Model not trained yet!")
            return None
        
        # Get selected feature names
        selected_features = self.feature_selector.get_support()
        selected_feature_names = [self.feature_names[i] for i in range(len(selected_features)) if selected_features[i]]
        
        if hasattr(self.model, 'feature_importances_'):
            # Tree-based models
            importance = self.model.feature_importances_
        elif hasattr(self.model, 'coef_'):
            # Linear models
            importance = np.abs(self.model.coef_[0])
        else:
            print("Model doesn't have feature importance!")
            return None
        
        importance_df = pd.DataFrame({
            'feature': selected_feature_names,
            'importance': importance
        }).sort_values('importance', ascending=False)
        
        return importance_df.head(top_n)
    
    def evaluate_model(self, y_test, y_pred_proba):
        """Enhanced model evaluation."""
        print("\n=== Focused Model Performance ===")
        
        auc_score = roc_auc_score(y_test, y_pred_proba)
        
        # Try multiple thresholds
        thresholds = [0.3, 0.4, 0.5, 0.6, 0.7]
        best_threshold = 0.5
        best_f1 = 0
        
        for threshold in thresholds:
            y_pred_thresh = (y_pred_proba > threshold).astype(int)
            cm = confusion_matrix(y_test, y_pred_thresh)
            
            if cm[1,1] + cm[1,0] > 0 and cm[1,1] + cm[0,1] > 0:
                precision = cm[1,1] / (cm[1,1] + cm[0,1])
                recall = cm[1,1] / (cm[1,1] + cm[1,0])
                f1 = 2 * (precision * recall) / (precision + recall)
                
                if f1 > best_f1:
                    best_f1 = f1
                    best_threshold = threshold
        
        # Final evaluation with best threshold
        y_pred_final = (y_pred_proba > best_threshold).astype(int)
        cm = confusion_matrix(y_test, y_pred_final)
        
        accuracy = (cm[0,0] + cm[1,1]) / cm.sum()
        sensitivity = cm[1,1] / (cm[1,1] + cm[1,0]) if (cm[1,1] + cm[1,0]) > 0 else 0
        specificity = cm[0,0] / (cm[0,0] + cm[0,1]) if (cm[0,0] + cm[0,1]) > 0 else 0
        precision = cm[1,1] / (cm[1,1] + cm[0,1]) if (cm[1,1] + cm[0,1]) > 0 else 0
        
        print(f"ROC AUC Score: {auc_score:.4f}")
        print(f"Best Threshold: {best_threshold}")
        print(f"Accuracy: {accuracy:.4f}")
        print(f"Sensitivity (Recall): {sensitivity:.4f}")
        print(f"Specificity: {specificity:.4f}")
        print(f"Precision: {precision:.4f}")
        print(f"F1-Score: {best_f1:.4f}")
        
        return auc_score, best_threshold
    
    def save_model(self, filepath='enhanced_sickle_cell_model.pkl'):
        """Save the enhanced model."""
        if self.model is None:
            print("No model to save!")
            return
        
        model_package = {
            'model': self.model,
            'preprocessor': self.preprocessor,
            'feature_selector': self.feature_selector,
            'feature_names': self.feature_names,
            'label_encoders': self.label_encoders,
            'model_info': self.model_info
        }
        
        joblib.dump(model_package, filepath)
        print(f"Enhanced model saved to {filepath}")
    
    def predict_crisis_probability(self, patient_data):
        """Predict crisis probability with enhanced model."""
        if self.model is None:
            print("Model not trained or loaded!")
            return None
        
        # Ensure data is in correct format
        if isinstance(patient_data, dict):
            patient_df = pd.DataFrame([patient_data])
        else:
            patient_df = patient_data.copy()
        
        # Create advanced features
        patient_df = self.create_advanced_features(patient_df)
        
        # Apply preprocessing
        for col in ['Sex', 'Genotype', 'HydrationLevel']:
            if col in patient_df.columns and col in self.label_encoders:
                patient_df[col] = self.label_encoders[col].transform(patient_df[col].astype(str))
        
        # Ensure all features are present
        for feature in self.feature_names:
            if feature not in patient_df.columns:
                patient_df[feature] = 0
        
        # Select and order features
        X = patient_df[self.feature_names]
        
        # Preprocess and select features
        X_processed = self.preprocessor.transform(X)
        X_selected = self.feature_selector.transform(X_processed)
        
        # Predict
        probability = self.model.predict_proba(X_selected)[:, 1]
        
        return probability[0] if len(probability) == 1 else probability

def main():
    """Focused training pipeline for an interpretable model."""
    print("=== Focused Sickle Cell Crisis Prediction Model ===")
    
    # Initialize enhanced model
    model = EnhancedSickleCellCrisisModel()
    
    # Load data
    df = model.load_data()
    if df is None:
        return
    
    # Preprocess with feature engineering
    X, y = model.preprocess_data(df, target_column='CrisisNext48h')
    
    # Train lightweight interpretable models
    X_test, y_test, y_pred, y_pred_proba = model.train_lightweight_models(X, y)
    
    # Show feature importance
    importance_df = model.get_feature_importance()
    print("\n--- Top Feature Importance (Focused) ---")
    print(importance_df)
    
    # Enhanced evaluation
    auc_score, best_threshold = model.evaluate_model(y_test, y_pred_proba)
    
    # Save enhanced model
    model.save_model()
    
    print("\n=== Focused Training Complete ===")
    print(f"Focused model achieved AUC: {auc_score:.4f}")
    print("Model saved and ready for deployment!")

if __name__ == "__main__":
    main()
