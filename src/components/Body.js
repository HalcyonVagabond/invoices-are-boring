import React, { useRef, useContext, useEffect } from 'react';
import Invoice from './Invoice/Invoice';
import { ToastContainer } from 'react-toastify';
import InvoiceInputsMenu from './InvoiceInputs/InvoiceInputsMenu';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import InvoiceContext from '../context/InvoiceContext';
import { trackVisit } from '../helpers/Helpers';

function Body() {
  const invoiceRef = useRef(null);
  const { invoiceTitle, setIsExporting } = useContext(InvoiceContext);

  useEffect(() => {
    trackVisit();
  }, []);

  const exportPDF = () => {
    setIsExporting(true);

    setTimeout(() => {
      const invoiceElement = invoiceRef.current;
      if (invoiceElement) {
        html2canvas(invoiceElement, {
          scale: 1.5, // Reduced from 2 - still good quality but smaller file
          backgroundColor: "#FFF",
          useCORS: true,
          logging: false, // Disable logging for cleaner console
          imageTimeout: 0, // No timeout for images
        }).then((canvas) => {
          setIsExporting(false);
          
          // Use JPEG with compression instead of PNG for smaller file size
          const imgData = canvas.toDataURL('image/jpeg', 0.92); // 92% quality JPEG
          
          // Calculate dimensions for standard letter/A4 sizing
          const imgWidth = canvas.width;
          const imgHeight = canvas.height;
          
          // Use mm units and calculate proper dimensions
          const pdfWidth = imgWidth * 0.264583; // Convert px to mm (assuming 96 DPI)
          const pdfHeight = imgHeight * 0.264583;
          
          const pdf = new jsPDF({
            orientation: pdfHeight > pdfWidth ? 'p' : 'l',
            unit: 'mm',
            format: [pdfWidth, pdfHeight],
            compress: true, // Enable PDF compression
          });
          
          pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
          pdf.save(`${invoiceTitle.title || 'invoice'}.pdf`);
        }).catch((error) => {
          setIsExporting(false);
          console.error('Error generating canvas', error);
        });
      } else {
        setIsExporting(false);
        console.error('The invoice element was not found!');
      }
    }, 500);
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