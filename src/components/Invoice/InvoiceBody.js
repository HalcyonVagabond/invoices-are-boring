import React, { useContext } from 'react';
import InvoiceContext from '../../context/InvoiceContext';

const LineItemTable = ({ items, type }) => {
  if (items.length === 0) {
    return null; // Only render if there are items of this type
  }

  const isHourly = type === 'hourly';

  return (
    <table className="min-w-full bg-white divide-y divide-gray-300 mb-8">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Description
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            {isHourly ? 'Rate' : 'Price'}
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            {isHourly ? 'Hours' : 'Quantity'}
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Total
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200 overflow-show">
        {items.map((item, index) => (
          <tr key={index}>
            <td className="px-6 py-4 whitespace-nowrap">{item.description}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              {isHourly ? item.rate : item.unitCost}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {isHourly ? item.hours : item.quantity}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {isHourly
                ? item.rate * item.hours
                : item.unitCost * item.quantity}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const InvoiceBody = () => {
  const { invoiceItems, isHourlyFirst } = useContext(InvoiceContext);

  // Split the items based on type
  const hourlyItems = invoiceItems.filter((item) => item.hours);
  const unitItems = invoiceItems.filter((item) => item.quantity);

  return (
    <div className="">
      {isHourlyFirst ? (
        <>
          <LineItemTable items={hourlyItems} type="hourly" />
          <LineItemTable items={unitItems} type="unit" />
        </>
      ) : (
        <>
          <LineItemTable items={unitItems} type="unit" />
          <LineItemTable items={hourlyItems} type="hourly" />
        </>
      )}
    </div>
  );
};

export default InvoiceBody;

