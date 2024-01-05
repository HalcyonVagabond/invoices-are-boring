import React, { useRef, useContext } from 'react';
import Invoice from './Invoice/Invoice';
import { ToastContainer } from 'react-toastify';
import InvoiceInputsMenu from './InvoiceInputs/InvoiceInputsMenu';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import InvoiceContext from '../context/InvoiceContext';

function Body() {
  const invoiceRef = useRef(null);
  const { invoiceTitle, setIsExporting } = useContext(InvoiceContext);

  const exportPDF = () => {
    setIsExporting(true);

    setTimeout(() => {
      const invoiceElement = invoiceRef.current;
      if (invoiceElement) {
        html2canvas(invoiceElement, {
          scale: 2, // Higher scale for better resolution
          backgroundColor: "#FFF", // Set a white background
          useCORS: true // For images loaded from external URLs
        }).then((canvas) => {
          setIsExporting(false);
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF({
            orientation: 'p',
            unit: 'px',
            format: [canvas.width, canvas.height], // Use canvas dimensions
          });
          pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
          pdf.save(`${invoiceTitle.title || 'invoice'}.pdf`);
        }).catch((error) => {
          setIsExporting(false);
          console.error('Error generating canvas', error);
        });
      } else {
        setIsExporting(false);
        console.error('The invoice element was not found!');
      }
    }, 500); // Wait for half a second (500 milliseconds)
  };

  return (
    <div>
        <div className="flex flex-col md:flex-row mt-5 space-x-4 justify-center w-[100vw]">
          <InvoiceInputsMenu exportPDF={exportPDF} />
          <Invoice ref={invoiceRef}/>
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

  );
}

export default Body;