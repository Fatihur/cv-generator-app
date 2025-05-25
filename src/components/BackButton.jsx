import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BackButton = ({ to, label = 'Back', className = '' }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`inline-flex items-center space-x-2 text-secondary-600 dark:text-secondary-400 hover:text-secondary-800 dark:hover:text-secondary-200 transition-colors ${className}`}
    >
      <ArrowLeft className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
};

export default BackButton;
