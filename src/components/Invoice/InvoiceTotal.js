import React, { useContext } from 'react';
import InvoiceContext from '../../context/InvoiceContext';

const InvoiceTotal = () => {
  const { totals, taxes } = useContext(InvoiceContext);
  const { afterDiscounts, taxBreakdown, taxAmount, total } = totals;

  const getAlignmentClass = (alignment) => {
    switch (alignment) {
      case 'left': return 'text-left';
      case 'center': return 'text-center';
      case 'right':
      default: return 'text-right';
    }
  };

  // Determine overall alignment - use the first tax's alignment or default to right
  const overallAlignment = taxes && taxes.length > 0 ? (taxes[0].alignment || 'right') : 'right';

  return (
    <div className={`mt-8 p-5 bg-white rounded-lg sticky bottom-0 border-t ${getAlignmentClass(overallAlignment)}`}>
      {/* Show tax breakdown if there are taxes */}
      {taxes && taxes.length > 0 && (
        <div className="mb-4 border-b pb-4">
          <div className={`flex items-center mb-2 ${overallAlignment === 'left' ? 'justify-start gap-4' : overallAlignment === 'center' ? 'justify-center gap-4' : 'justify-between'}`}>
            <span className="text-gray-600">Subtotal (after discounts):</span>
            <span className="text-lg">${(afterDiscounts || 0).toFixed(2)}</span>
          </div>
          {taxBreakdown && taxBreakdown.map((tax, index) => (
            <div key={index} className={`flex items-center text-gray-600 ${(tax.alignment || 'right') === 'left' ? 'justify-start gap-4' : (tax.alignment || 'right') === 'center' ? 'justify-center gap-4' : 'justify-between'}`}>
              <span>{tax.name} ({tax.type === 'percentage' ? tax.value + '%' : 'Fixed'}):</span>
              <span>+${(tax.calculatedAmount || 0).toFixed(2)}</span>
            </div>
          ))}
          {taxBreakdown && taxBreakdown.length > 1 && (
            <div className={`flex items-center mt-2 pt-2 border-t border-dashed ${overallAlignment === 'left' ? 'justify-start gap-4' : overallAlignment === 'center' ? 'justify-center gap-4' : 'justify-between'}`}>
              <span className="text-gray-600 font-medium">Total Tax:</span>
              <span className="font-medium">+${(taxAmount || 0).toFixed(2)}</span>
            </div>
          )}
        </div>
      )}
      
      <div>
        <span className="text-lg font-bold">Total: </span>
        <span className="text-2xl font-semibold">${(total || 0).toFixed(2)}</span>
      </div>
    </div>
  );
};

export default InvoiceTotal;