'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>AetherFlow - Test Page</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              This is a test page to verify that components are working correctly.
            </p>
            
            <Button className="w-full">
              Test Button - Primary
            </Button>
            
            <Button variant="secondary" className="w-full">
              Test Button - Secondary
            </Button>
            
            <Button variant="outline" className="w-full">
              Test Button - Outline  
            </Button>
            
            <div className="pt-4 border-t">
              <a 
                href="/login" 
                className="block text-center text-blue-600 hover:text-blue-800 underline"
              >
                Go to Login Page
              </a>
              <a 
                href="/dashboard" 
                className="block text-center text-blue-600 hover:text-blue-800 underline mt-2"
              >
                Go to Dashboard (Protected)
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
