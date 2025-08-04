'use client';
import styles from './searchBar.module.css';
import { MdOutlineManageSearch } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import Form from 'next/form';
import { useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

export function SearchBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('query');
  
  const toggleSearch = () => {
    setIsExpanded(!isExpanded);
  };

  const clearSearch = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
      // Trigger form submission with empty value
      const form = inputRef.current.closest('form');
      if (form) {
        const formData = new FormData(form);
        formData.set('query', '');
        // You can dispatch a form submit event or handle the clear action
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    }
  };

  return (
    <div className={styles.mainContainer}>
      <button 
        type="button"
        className={styles.toggleButton}
        onClick={toggleSearch}
      >
        <MdOutlineManageSearch size={24} />
      </button>
      
      <div className={`${styles.formContainer} ${isExpanded ? styles.expanded : ''}`}>
        <Form action=''>
          <input 
            ref={inputRef}
            type="text" 
            name="query" 
            id="search-input"
            className={styles.searchInput}
            defaultValue={queryParam || ''}
            placeholder="Buscar..."
          />   
          <button 
            type="submit"
            className={styles.searchButton}
          >
            Buscar
          </button>
          <button 
            type="button"
            className={styles.clearButton}
            onClick={clearSearch}
          >
            <IoClose size={16} />
          </button>     
        </Form>
      </div>
    </div>
  );
}