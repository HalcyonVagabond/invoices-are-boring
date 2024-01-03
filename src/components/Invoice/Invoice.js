import React, { useContext, useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

import InvoiceHeader from './InvoiceHeader';
import InvoiceBody from './InvoiceBody';
import IvoiceTotal from './InvoiceTotal';
import InvoiceContext from '../../context/InvoiceContext';

const Invoice = () => {
    const { invoiceTitle, titleAlignment } = useContext(InvoiceContext);

    const invoiceRef = useRef(null);

    const exportPDF = () => {
        const invoiceElement = invoiceRef.current;
        if (invoiceElement) {
          html2canvas(invoiceElement, {
            scale: 2, // Higher scale for better resolution
            backgroundColor: "#FFF", // Set a white background
            useCORS: true // For images loaded from external URLs
          }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
              orientation: 'p',
              unit: 'px',
              format: [canvas.width, canvas.height], // Use canvas dimensions
            });
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save(`${invoiceTitle || 'invoice'}.pdf`);
          }).catch((error) => {
            console.error('Error generating canvas', error);
          });
        } else {
          console.error('The invoice element was not found!');
        }
      };

    // const exportPDF = () => {
    //     const invoiceElement = invoiceRef.current;
    //     if (invoiceElement) {
    //       html2canvas(invoiceElement).then((canvas) => {
    //         const imgData = canvas.toDataURL('image/png');
    //         const pdf = new jsPDF({
    //           orientation: 'portrait',
    //           unit: 'px',
    //           format: [invoiceElement.offsetWidth, invoiceElement.offsetHeight],
    //         });
    //         pdf.addImage(imgData, 'PNG', 0, 0);
    //         pdf.save(`${invoiceTitle || 'invoice'}.pdf`);
    //       }).catch((error) => {
    //         console.error("Error generating canvas", error);
    //       });
    //     } else {
    //       console.error('The invoice element was not found!');
    //     }
    //   };

    return (
        <div>
            <button onClick={exportPDF} className='bg-blue-200 hover:bg-blue-500 px-5 py-2 hover:text-white rounded-md mb-4 font-bold'>Export to PDF</button> {/* This button will trigger PDF export */}
            <div ref={invoiceRef} className="absolute left-0 md:relative bg-white shadow-lg border rounded-sm overflow-hidden px-5 py-7 bg-white w-[100vw] md:max-w-[8in] min-h-[11in]">
                
                <div className={`title-section text-${titleAlignment}`}>
                        <h1 className='text-4xl font-extrabold'>{invoiceTitle ? invoiceTitle : "TITLE"}</h1>
                </div>
                
                <InvoiceHeader />

                {/* Invoice Body Component */}
                <div className="mt-5">
                    <InvoiceBody />
                </div>

                {/* Additional sections (like totals, notes, etc.) can be added here */}
                <IvoiceTotal />
            </div>
            </div>

        
    );
};

export default Invoice;