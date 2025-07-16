# Sickle Cell Crisis Prediction Model Training
# This script trains a logistic regression model to predict crisis probability within 48 hours

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.impute import SimpleImputer
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score, roc_curve
from sklearn.pipeline import Pipeline
import joblib
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

class SickleCellCrisisModel:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.imputer = SimpleImputer(strategy='median')
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
    
    def preprocess_data(self, df, target_column='CrisisNext48h'):
        """Preprocess the data for machine learning."""
        print("\nPreprocessing data...")
        
        # Drop columns that shouldn't be used for prediction
        columns_to_drop = [
            'PatientID', 'Day', 'CrisisLikely',  # Administrative/target leakage
            'Baseline_WBC', 'Baseline_LDH'  # Use daily values instead
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
        
        print(f"Features used: {len(self.feature_names)}")
        print(f"Target distribution: {y.value_counts().to_dict()}")
        
        return X, y
    
    def train_model(self, X, y, test_size=0.2, random_state=42):
        """Train the logistic regression model with hyperparameter tuning."""
        print("\nTraining logistic regression model...")
        
        # Split the data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=random_state, stratify=y
        )
        
        # Create preprocessing pipeline
        preprocessor = Pipeline([
            ('imputer', SimpleImputer(strategy='median')),
            ('scaler', StandardScaler())
        ])
        
        # Hyperparameter tuning
        param_grid = {
            'C': [0.01, 0.1, 1.0, 10.0, 100.0],
            'penalty': ['l1', 'l2'],
            'solver': ['liblinear'],
            'max_iter': [1000]
        }
        
        # Create base model
        base_model = LogisticRegression(random_state=random_state)
        
        # Grid search
        print("Performing hyperparameter tuning...")
        grid_search = GridSearchCV(
            base_model, param_grid, cv=5, scoring='roc_auc', n_jobs=-1
        )
        
        # Fit preprocessor and transform data
        X_train_processed = preprocessor.fit_transform(X_train)
        X_test_processed = preprocessor.transform(X_test)
        
        # Fit grid search
        grid_search.fit(X_train_processed, y_train)
        
        # Best model
        self.model = grid_search.best_estimator_
        self.preprocessor = preprocessor
        
        # Store model info
        self.model_info = {
            'best_params': grid_search.best_params_,
            'best_score': grid_search.best_score_,
            'training_date': datetime.now().isoformat(),
            'feature_count': len(self.feature_names),
            'training_samples': len(X_train)
        }
        
        print(f"Best parameters: {grid_search.best_params_}")
        print(f"Best CV score: {grid_search.best_score_:.4f}")
        
        # Evaluate on test set
        y_pred = self.model.predict(X_test_processed)
        y_pred_proba = self.model.predict_proba(X_test_processed)[:, 1]
        
        print("\n--- Test Set Performance ---")
        print(classification_report(y_test, y_pred))
        print(f"ROC AUC Score: {roc_auc_score(y_test, y_pred_proba):.4f}")
        
        return X_test_processed, y_test, y_pred, y_pred_proba
    
    def get_feature_importance(self, top_n=15):
        """Get feature importance from the trained model."""
        if self.model is None:
            print("Model not trained yet!")
            return None
        
        # Get coefficients
        coef = self.model.coef_[0]
        
        # Create importance dataframe
        importance_df = pd.DataFrame({
            'feature': self.feature_names,
            'coefficient': coef,
            'abs_coefficient': np.abs(coef)
        }).sort_values('abs_coefficient', ascending=False)
        
        return importance_df.head(top_n)
    
    def plot_results(self, y_test, y_pred_proba):
        """Print model performance metrics instead of plotting."""
        print("\n=== Model Performance Summary ===")
        
        # Calculate metrics
        fpr, tpr, _ = roc_curve(y_test, y_pred_proba)
        auc_score = roc_auc_score(y_test, y_pred_proba)
        
        # Binary predictions for confusion matrix
        y_pred_binary = (y_pred_proba > 0.5).astype(int)
        cm = confusion_matrix(y_test, y_pred_binary)
        
        print(f"ROC AUC Score: {auc_score:.4f}")
        print(f"\nConfusion Matrix:")
        print(f"True Negatives: {cm[0,0]}, False Positives: {cm[0,1]}")
        print(f"False Negatives: {cm[1,0]}, True Positives: {cm[1,1]}")
        
        # Sensitivity and Specificity
        sensitivity = cm[1,1] / (cm[1,1] + cm[1,0]) if (cm[1,1] + cm[1,0]) > 0 else 0
        specificity = cm[0,0] / (cm[0,0] + cm[0,1]) if (cm[0,0] + cm[0,1]) > 0 else 0
        
        print(f"Sensitivity (Recall): {sensitivity:.4f}")
        print(f"Specificity: {specificity:.4f}")
        
        # Prediction distribution summary
        crisis_probs = y_pred_proba[y_test == 1]
        no_crisis_probs = y_pred_proba[y_test == 0]
        
        print(f"\nPrediction Probability Summary:")
        print(f"Crisis cases - Mean: {crisis_probs.mean():.3f}, Std: {crisis_probs.std():.3f}")
        print(f"No crisis cases - Mean: {no_crisis_probs.mean():.3f}, Std: {no_crisis_probs.std():.3f}")
        
        return auc_score
    
    def save_model(self, filepath='sickle_cell_crisis_model.pkl'):
        """Save the trained model and preprocessing components."""
        if self.model is None:
            print("No model to save!")
            return
        
        model_package = {
            'model': self.model,
            'preprocessor': self.preprocessor,
            'feature_names': self.feature_names,
            'label_encoders': self.label_encoders,
            'model_info': self.model_info
        }
        
        joblib.dump(model_package, filepath)
        print(f"Model saved to {filepath}")
    
    def load_model(self, filepath='sickle_cell_crisis_model.pkl'):
        """Load a trained model."""
        try:
            model_package = joblib.load(filepath)
            self.model = model_package['model']
            self.preprocessor = model_package['preprocessor']
            self.feature_names = model_package['feature_names']
            self.label_encoders = model_package['label_encoders']
            self.model_info = model_package['model_info']
            print(f"Model loaded from {filepath}")
            return True
        except FileNotFoundError:
            print(f"Model file {filepath} not found!")
            return False
    
    def predict_crisis_probability(self, patient_data):
        """Predict crisis probability for new patient data."""
        if self.model is None:
            print("Model not trained or loaded!")
            return None
        
        # Ensure data is in correct format
        if isinstance(patient_data, dict):
            patient_data = pd.DataFrame([patient_data])
        
        # Apply same preprocessing
        for col in ['Sex', 'Genotype', 'HydrationLevel']:
            if col in patient_data.columns and col in self.label_encoders:
                patient_data[col] = self.label_encoders[col].transform(patient_data[col].astype(str))
        
        # Ensure all features are present
        for feature in self.feature_names:
            if feature not in patient_data.columns:
                patient_data[feature] = 0  # Default value for missing features
        
        # Select and order features
        X = patient_data[self.feature_names]
        
        # Preprocess and predict
        X_processed = self.preprocessor.transform(X)
        probability = self.model.predict_proba(X_processed)[:, 1]
        
        return probability[0] if len(probability) == 1 else probability

def main():
    """Main training pipeline."""
    print("=== Sickle Cell Crisis Prediction Model Training ===")
    
    # Initialize model
    sc_model = SickleCellCrisisModel()
    
    # Load data
    df = sc_model.load_data()
    if df is None:
        return
    
    # Preprocess data
    X, y = sc_model.preprocess_data(df, target_column='CrisisNext48h')
    
    # Train model
    X_test, y_test, y_pred, y_pred_proba = sc_model.train_model(X, y)
    
    # Show feature importance
    importance_df = sc_model.get_feature_importance()
    print("\n--- Top Feature Importance ---")
    print(importance_df)
    
    # Show results
    auc_score = sc_model.plot_results(y_test, y_pred_proba)
    
    # Save model
    sc_model.save_model()
    
    print("\n=== Training Complete ===")
    print("Model saved and ready for deployment!")
    
    # Example prediction
    print("\n--- Example Prediction ---")
    sample_patient = {
        'PainLevel': 7,
        'Fatigue': 1,
        'Fever': 1,
        'JointPain': 1,
        'Dactylitis': 0,
        'Shortness_of_Breath': 1,
        'Sleep_Quality': 2,
        'Reported_Stress_Level': 8,
        'HydrationLevel': 'Low',
        'MedicationAdherence': 0,
        'WBC_Count': 15.2,
        'LDH': 450,
        'CRP': 35,
        'Temperature': 32,
        'Humidity': 80,
        'Hydroxyurea': 0,
        'PainMed': 1,
        'PriorCrises': 2,
        'Age': 25,
        'Sex': 'Male',
        'Genotype': 'HbSS',
        'History_of_ACS': 1,
        'Coexisting_Asthma': 0,
        'HbF_percent': 4.5
    }
    
    crisis_prob = sc_model.predict_crisis_probability(sample_patient)
    print(f"Crisis probability (48h): {crisis_prob:.4f} ({crisis_prob*100:.1f}%)")

if __name__ == "__main__":
    main()
