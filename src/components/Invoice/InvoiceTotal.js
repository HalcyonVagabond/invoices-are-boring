import React, { useContext } from 'react';
import InvoiceContext from '../../context/InvoiceContext';

const InvoiceTotal = () => {
  const { totals } = useContext(InvoiceContext);

  const total = totals.length > 0 ? totals[totals.length - 1] : 0;

  return (
    <div className="mt-8 p-5 bg-white rounded-lg sticky bottom-0 border-t">
      <div className="text-right">
        <span className="text-lg font-semibold">Total: </span>
        <span className="text-lg">${total.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default InvoiceTotal;