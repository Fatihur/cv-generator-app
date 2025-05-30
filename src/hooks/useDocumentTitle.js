import { useEffect } from 'react';

const useDocumentTitle = (title) => {
  useEffect(() => {
    const baseTitle = 'CV Generator by Fatih';
    
    if (title) {
      document.title = `${title} - ${baseTitle}`;
    } else {
      document.title = baseTitle;
    }

    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = baseTitle;
    };
  }, [title]);
};

export default useDocumentTitle;
