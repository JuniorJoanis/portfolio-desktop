import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Console log for developers
console.log(
  '👋 Hey there, curious developer! 🚀 Looking to build something amazing together?\n💼 CTO & Full-stack Engineer | 12+ years | 100k+ users\n📧 Let\'s connect! Check the Contact section or reach out directly.'
);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);