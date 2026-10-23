import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ 
  children, 
  className = '', 
  padding = 'md' 
}: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <div className={`border-b border-gray-200 pb-4 mb-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
      {children}
    </h3>
  );
}

export function CardContent({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}