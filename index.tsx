import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Consultancy from './components/Consultancy';
import BlogList from './components/blog/BlogList';
import BlogPost from './components/blog/BlogPost';

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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Consultancy />} />
        <Route path="/desktop" element={<App />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
