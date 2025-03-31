
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Ensure we're using React 18's createRoot API properly
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Root element not found');

const root = createRoot(rootElement);
root.render(<App />);
