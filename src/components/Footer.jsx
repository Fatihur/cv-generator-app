import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-secondary-800 border-t border-secondary-200 dark:border-secondary-700 py-6 mt-12">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center space-x-2 text-secondary-600 dark:text-secondary-400">
          <span>Made with</span>
          <Heart className="w-4 h-4 text-red-500 fill-current" />
          <span>by</span>
          <span className="font-semibold text-primary-600 dark:text-primary-400">Fatih</span>
        </div>
        <div className="mt-2 text-sm text-secondary-500 dark:text-secondary-500">
          © 2024 CV Generator. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
