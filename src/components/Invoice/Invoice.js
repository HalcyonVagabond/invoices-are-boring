import React, { useContext, forwardRef } from 'react';

import InvoiceHeader from './InvoiceHeader';
import InvoiceBody from './InvoiceBody';
import IvoiceTotal from './InvoiceTotal';
import InvoiceContext from '../../context/InvoiceContext';
import InvoiceDiscount from './InvoiceDiscount';

const Invoice = forwardRef((props, ref) => {
    const { invoiceTitle } = useContext(InvoiceContext);

    return (
        <div>
            <div ref={ref} className="absolute left-0 md:relative bg-white shadow-lg border rounded-sm overflow-hidden px-5 py-7 bg-white w-[100vw] md:max-w-[8in] min-h-[11in]">
                
                <div className={`title-section text-${invoiceTitle.alignment}`}>
                    <h1 className='text-5xl font-extrabold'>{invoiceTitle.title ? invoiceTitle.title : "ADD TITLE"}</h1>
                </div>
                
                <InvoiceHeader />

                {/* Invoice Body Component */}
                <div className="mt-5">
                    <InvoiceBody />
                </div>

                <InvoiceDiscount />

                <IvoiceTotal />
            </div>
            </div>

        
    );
});

export default Invoice;