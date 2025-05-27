'use client';
import { PrimeReactProvider as Provider } from 'primereact/api';
import React from 'react';


export function PrimeReactProvider({ children }: { children: React.ReactNode }) {

  return (
    <Provider>
      {children}
    </Provider>
  );
}
