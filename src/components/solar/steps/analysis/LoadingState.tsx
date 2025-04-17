import React from 'react';
import { Sun } from 'lucide-react';

const LoadingState: React.FC = () => (
  <div className="flex items-center justify-center py-8">
    <div className="text-center">
      <Sun className="w-8 h-8 text-blue-500 mx-auto mb-4 animate-spin" />
      <p className="text-sm text-gray-600">Analyzing solar potential...</p>
    </div>
  </div>
);

export default LoadingState;