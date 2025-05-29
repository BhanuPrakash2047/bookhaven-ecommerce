import { Calendar, User } from 'lucide-react';      
import { AlertCircle } from 'lucide-react';


const ErrorMessage = ({ message, onRetry }) => (
  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
    <div className="flex items-center gap-2 text-red-800 dark:text-red-400">
      <AlertCircle className="w-5 h-5" />
      <span className="font-medium">Error</span>
    </div>
    <p className="text-red-700 dark:text-red-300 mt-1">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-2 text-sm text-red-800 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 underline"
      >
        Try again
      </button>
    )}
  </div>
);
export default ErrorMessage;