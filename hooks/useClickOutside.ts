import { useEffect } from 'react';

type Element = HTMLElement | HTMLInputElement | HTMLTextAreaElement | HTMLDivElement;

const useClickOutside = (ref: React.RefObject<Element>, callback: () => void) => {
  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
};

export default useClickOutside;