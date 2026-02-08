import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Consultancy from './components/Consultancy';
import BlogList from './components/blog/BlogList';
import BlogPost from './components/blog/BlogPost';

// Console log for developers
console.log(
  '👋 Hey there! Looking for a fintech engineer or AI builder?\n🚀 I help startups & SMEs ship faster: fintech systems, AI agents, MVPs.\n📧 Book a call: https://calendly.com/junior-joanis/intro-call'
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
