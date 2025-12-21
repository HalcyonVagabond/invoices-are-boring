import React from 'react';
import { InvoiceProvider } from './context/InvoiceContext'; // Import the provider
import { AuthProvider } from './context/AuthContext'; // Import auth provider
import NavBar from './components/Navigation/NavBar';
import Footer from './components/Navigation/Footer';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Body from './components/Body';

function App() {
  return (
    <AuthProvider>
      <InvoiceProvider> 
        <div className="App">
          <NavBar /> 
          <Body />
          <Footer />
        </div>
      </InvoiceProvider>
    </AuthProvider>
  );
}

export default App;