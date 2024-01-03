import React, { useContext } from 'react';
import InvoiceContext from '../../context/InvoiceContext';

const InvoiceTotal = () => {
  const { invoiceItems } = useContext(InvoiceContext);

  const totalAmount = invoiceItems.reduce((total, item) => {
    return total + (item.rate * item.hours);
  }, 0);

  return (
    <div className="mt-8 p-5 bg-white rounded-lg sticky bottom-0 border-t">
      <div className="text-right">
        <span className="text-lg font-semibold">Total: </span>
        <span className="text-lg">${totalAmount.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default InvoiceTotal;