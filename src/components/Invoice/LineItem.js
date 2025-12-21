import React, { useContext } from 'react';
import InvoiceContext from '../../context/InvoiceContext';

const LineItem = ({ item, index }) => {
  const { discounts, isExporting } = useContext(InvoiceContext);

  // Determine if item is hourly or fixed
  const isHourly = item.billingType === 'hourly' || (!item.billingType && item.hours);
  
  // Get the rate/price and quantity/hours based on billing type
  const unitPrice = isHourly ? parseFloat(item.rate) || 0 : parseFloat(item.price) || 0;
  const quantity = isHourly ? parseFloat(item.hours) || 0 : parseFloat(item.quantity) || 0;
  const baseTotal = unitPrice * quantity;

  // Function to calculate the discount amount
  const calculateDiscount = (discount) => {
    if (discount.type === 'percentage') {
      return unitPrice * (discount.value / 100);
    } else {
      return parseFloat(discount.value) / quantity;
    }
  };

  const formatRate = (rate) => {
    const numericRate = typeof rate === 'string' ? parseFloat(rate) : rate;
    return typeof numericRate === 'number' && !isNaN(numericRate) ? numericRate.toFixed(2) : '0.00';
  };

  // Find if there's a discount for this item
  const itemDiscount = discounts.find((discount) => discount.target === item.id);

  // Calculate the discounted rate
  const discountedRate = itemDiscount ? unitPrice - calculateDiscount(itemDiscount) : unitPrice;
  const finalAmount = discountedRate * quantity;

  const Strikethrough = () => (
    <div className={`border-b border border-b-gray-400 ${isExporting ? 'mt-[-4px]' : 'mt-[-10px]'}`}></div>
  );

  return (
    <tr className="hover:bg-gray-50 relative group">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-left max-w-[350px] min-w-[200px] overflow-x-hidden">
        <h4 className='text-black font-semibold'>{item.title}</h4>
        <pre className='text-gray-800 max-w-[380px] text-wrap'>{item.description}</pre>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-2 relative">
        {itemDiscount ? (
          <>
            <span className="text-gray-400">{formatRate(unitPrice)}</span>
            <Strikethrough />
            <br />
            <span>{discountedRate.toFixed(2)}</span>
          </>
        ) : (
          formatRate(unitPrice)
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-2">
        {quantity}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-2">
        <span className={itemDiscount ? "text-gray-400" : ""}>
          {baseTotal.toFixed(2)}
        </span>
        {itemDiscount && <Strikethrough />}
        {itemDiscount && <br />}
        {itemDiscount && <span>{finalAmount.toFixed(2)}</span>}
      </td>
    </tr>
  );
};

export default LineItem;