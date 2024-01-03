import React, { useContext } from 'react';
import InvoiceContext from '../../context/InvoiceContext';
import LineItem from './LineItem'; // Import the LineItem component

const InvoiceBody = () => {
  const { invoiceItems } = useContext(InvoiceContext);

  return (
    <div className="">
      <table className="min-w-full bg-white divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rate per Hour
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Hours
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 overflow-show">
          {invoiceItems.map((item, index) => (
            <LineItem key={index} item={item} index={index} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceBody;