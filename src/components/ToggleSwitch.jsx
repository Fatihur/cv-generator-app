import React from 'react';

const ToggleSwitch = ({ checked, onChange, disabled = false, className = '' }) => {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors 
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 
        disabled:opacity-50 disabled:cursor-not-allowed
        ${checked 
          ? 'bg-primary-600' 
          : 'bg-secondary-300 dark:bg-secondary-600'
        }
        ${className}
      `}
      role="switch"
      aria-checked={checked}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform
          ${checked ? 'translate-x-5' : 'translate-x-1'}
        `}
      />
    </button>
  );
};

export default ToggleSwitch;
