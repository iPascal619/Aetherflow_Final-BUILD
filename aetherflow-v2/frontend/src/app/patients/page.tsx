'use client';

import { ProtectedRoute } from '@/components/layout/protected-route';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PatientsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
              <p className="text-gray-600">Manage patient records and medical history</p>
            </div>
            <Button className="bg-primary-600 hover:bg-primary-700">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Patient
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Patients</span>
                    <span className="font-semibold">127</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">High Risk</span>
                    <span className="font-semibold text-red-600">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Recent Assessments</span>
                    <span className="font-semibold text-green-600">24</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Coming Soon</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 7a2 2 0 012-2h10a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Patient Management System</h3>
                  <p className="text-gray-600 mb-4">
                    Complete patient records, search functionality, and assessment history will be implemented in Phase 3.
                  </p>
                  <ul className="text-left text-gray-600 space-y-2 max-w-md mx-auto">
                    <li>• Patient list with search and filtering</li>
                    <li>• Detailed patient profiles</li>
                    <li>• Medical history tracking</li>
                    <li>• Assessment creation and editing</li>
                    <li>• Risk level monitoring</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'John Doe', id: 'P001', riskLevel: 'High', lastAssessment: '2 hours ago' },
                  { name: 'Maria Rodriguez', id: 'P002', riskLevel: 'Medium', lastAssessment: '1 day ago' },
                  { name: 'Sarah Wilson', id: 'P003', riskLevel: 'Low', lastAssessment: '3 days ago' },
                  { name: 'Michael Johnson', id: 'P004', riskLevel: 'Medium', lastAssessment: '1 week ago' },
                ].map((patient, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-medium">{patient.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{patient.name}</h4>
                        <p className="text-sm text-gray-500">ID: {patient.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        patient.riskLevel === 'High' ? 'bg-red-100 text-red-800' :
                        patient.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {patient.riskLevel} Risk
                      </span>
                      <p className="text-sm text-gray-500 mt-1">{patient.lastAssessment}</p>
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