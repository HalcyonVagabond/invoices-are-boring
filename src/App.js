import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { InvoiceProvider } from './context/InvoiceContext';
import { AuthProvider } from './context/AuthContext';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Pages
import LandingPage from './components/LandingPage/LandingPage';
import EditorPage from './components/EditorPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route 
              path="/editor" 
              element={
                <InvoiceProvider>
                  <EditorPage />
                </InvoiceProvider>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;