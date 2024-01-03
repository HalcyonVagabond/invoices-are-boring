import React from 'react';
import './App.css';
import Invoice from './components/Invoice/Invoice';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InvoiceInputsMenu from './components/InvoiceInputs/InputsParentContainer';
import { InvoiceProvider } from './context/InvoiceContext'; // Import the provider
import NavBar from './components/NavBar';

function App() {
  return (
    <InvoiceProvider> 
      <div className="App">
        <NavBar />  

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
        <div className="flex mt-5 space-x-4 justify-center">
          <InvoiceInputsMenu />
          <div className="w-1/2"> {/* Adjust the width as necessary */}
            <Invoice />
          </div>
        </div>
      </div>
    </InvoiceProvider>
  );
}

export default App;