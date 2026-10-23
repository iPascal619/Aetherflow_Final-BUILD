'use client';

import { ProtectedRoute } from '@/components/layout/protected-route';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PredictionsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ML Predictions</h1>
              <p className="text-gray-600">Sickle cell crisis prediction and risk analysis</p>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              New Prediction
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Model Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Accuracy</span>
                    <span className="font-semibold text-green-600">94.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Precision</span>
                    <span className="font-semibold text-blue-600">91.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Recall</span>
                    <span className="font-semibold text-purple-600">89.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">F1 Score</span>
                    <span className="font-semibold text-orange-600">90.6%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Advanced ML Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">ML Prediction Engine</h3>
                  <p className="text-gray-600 mb-4">
                    Advanced machine learning capabilities for crisis prediction will be fully implemented in Phase 3.
                  </p>
                  <ul className="text-left text-gray-600 space-y-2 max-w-md mx-auto">
                    <li>• Interactive prediction forms</li>
                    <li>• SHAP explainability visualizations</li>
                    <li>• Real-time risk assessment</li>
                    <li>• Clinical recommendations engine</li>
                    <li>• Model performance monitoring</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Predictions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { patient: 'John Doe', riskScore: 0.85, riskLevel: 'Critical', timestamp: '10 minutes ago', confidence: 0.92 },
                  { patient: 'Maria Rodriguez', riskScore: 0.65, riskLevel: 'High', timestamp: '2 hours ago', confidence: 0.88 },
                  { patient: 'Sarah Wilson', riskScore: 0.35, riskLevel: 'Medium', timestamp: '1 day ago', confidence: 0.91 },
                  { patient: 'Michael Johnson', riskScore: 0.15, riskLevel: 'Low', timestamp: '2 days ago', confidence: 0.95 },
                ].map((prediction, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{prediction.patient}</h4>
                        <p className="text-sm text-gray-500">Risk Score: {prediction.riskScore}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        prediction.riskLevel === 'Critical' ? 'bg-red-100 text-red-800' :
                        prediction.riskLevel === 'High' ? 'bg-orange-100 text-orange-800' :
                        prediction.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {prediction.riskLevel}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">Confidence: {Math.round(prediction.confidence * 100)}%</p>
                      <p className="text-sm text-gray-500">{prediction.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}