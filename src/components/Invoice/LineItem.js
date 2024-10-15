import React, { useContext } from 'react';
import InvoiceContext from '../../context/InvoiceContext';

const LineItem = ({ item, index }) => {
  const { discounts, isExporting } = useContext(InvoiceContext);

  // Function to calculate the discount amount
  const calculateDiscount = (discount) => {
    if (discount.type === 'percentage') {
      return item.rate * (discount.value / 100);
    } else {
      return parseFloat(discount.value) / item.hours;
    }
  };

  const formatRate = (rate) => {
    // If it's a string, attempt to convert to number
    const numericRate = typeof rate === 'string' ? parseFloat(rate) : rate;

    // Check if the conversion result is a number and is not NaN
    return typeof numericRate === 'number' && !isNaN(numericRate) ? numericRate.toFixed(2) : '0.00';
  };

  // Find if there's a discount for this item
  const itemDiscount = discounts.find((discount) => discount.target === item.id);

  // Calculate the discounted rate
  const discountedRate = itemDiscount ? (item.rate || item.price) - calculateDiscount(itemDiscount) : item.rate || item.price;
  const finalAmount = discountedRate * (item.hours || item.quantity);

  const Strikethrough = () => (
    <div className={`border-b border border-b-gray-400 ${isExporting ? 'mt-[-4px]' : 'mt-[-10px]'}`}></div>
  );

  return (
    <tr className="hover:bg-gray-50 relative group">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-left max-w-[350px] min-w-[200px] overflow-x-hidden">
        <h4 className='text-black font-semibold'>{item.title}</h4>
        <pre className='text-gray-800 max-w-[380px] text-wrap'>{item.description}asd</pre>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-2 relative">
        TEST
        {itemDiscount ? (
          <>
            <span className="text-gray-400">Hello {formatRate(item.rate || item.price)}</span>
            <Strikethrough />
            <br />
            <span>{discountedRate.toFixed(2)}</span>
          </>
        ) : (
          `Second ${formatRate(item.rate || item.price)}`
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-2">
        {item.hours || item.quantity}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-2">
        <span className={itemDiscount ? "text-gray-400" : ""}>
          {item.rate? ((item.rate * item.hours).toFixed(2)) : ((item.price * item.quantity).toFixed(2))}
        </span>
        {itemDiscount && <Strikethrough />}
        {itemDiscount && <br />}
        {itemDiscount && <span>{finalAmount.toFixed(2)}</span>}
      </td>
    </tr>
  );
};

export default LineItem;