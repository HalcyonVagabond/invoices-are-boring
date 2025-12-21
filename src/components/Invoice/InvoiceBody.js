import React, { useContext } from 'react';
import InvoiceContext from '../../context/InvoiceContext';
import LineItem from './LineItem';

const InvoiceBody = () => {
  const { invoiceItems } = useContext(InvoiceContext);

  if (invoiceItems.length === 0) {
    return null;
  }

  // Group items by billing type for display
  const hourlyItems = invoiceItems.filter((item) => 
    item.billingType === 'hourly' || (!item.billingType && item.hours)
  );
  const fixedItems = invoiceItems.filter((item) => 
    item.billingType === 'fixed' || (!item.billingType && item.quantity && !item.hours)
  );

  const renderTable = (items, type) => {
    if (items.length === 0) return null;
    const isHourly = type === 'hourly';

    return (
      <table className="min-w-full bg-white divide-y divide-gray-300 mb-4">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {isHourly ? 'Rate' : 'Price'}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {isHourly ? 'Hours' : 'Qty'}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((item, index) => (
            <LineItem key={item.id || index} item={item} index={index} />
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      {renderTable(hourlyItems, 'hourly')}
      {renderTable(fixedItems, 'fixed')}
    </div>
  );
};

export default InvoiceBody;

