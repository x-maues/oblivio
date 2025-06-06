import { AlertTriangle } from 'lucide-react';

export function WIPBanner() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500/90 backdrop-blur-sm border-b border-yellow-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-2 text-sm font-medium text-yellow-900">
          <AlertTriangle className="w-4 h-4 mr-2" />
          <span>This is a work in progress. Some features may not be fully functional.</span>
        </div>
      </div>
    </div>
  );
} 