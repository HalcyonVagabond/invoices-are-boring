import React from 'react';
import './App.css';
import Invoice from './components/Invoice/Invoice';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InvoiceInputsMenu from './components/InvoiceInputs/InvoiceInputsMenu';
import { InvoiceProvider } from './context/InvoiceContext'; // Import the provider
import NavBar from './components/Navigation/NavBar';
import Footer from './components/Navigation/Footer';

function App() {
  return (
    <InvoiceProvider> 
      <div className="App">
        <NavBar /> 
        <div className="flex flex-col md:flex-row mt-5 space-x-4 justify-center w-[100vw]">
          <InvoiceInputsMenu />
          <Invoice />
        </div>
        <ToastContainer
          position="top-right"
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
      <Footer />
    </InvoiceProvider>
  );
}

export default App;