import React, { useContext } from 'react';
import InvoiceContext from '../../context/InvoiceContext';

const DiscountsDisplay = () => {
    const { discounts, invoiceItems, totals } = useContext(InvoiceContext);

    const getTargetTitle = (target) => {
        if (target === 'Total') {
            return 'the total invoice';
        }
        const item = invoiceItems.find(item => item.id === target);
        return item ? item.title : 'an unknown item';
    };

    const alignmentInterpreter = (alignment) => {
        switch (alignment) {
            case 'left':
                return 'justify-start';
            case 'center':
                return 'justify-center';
            case 'right':
                return 'justify-end';
            default:
                return 'justify-end';
        }
    }

    return (
        <div>
            {discounts.map((discount, index) => {
                const targetTitle = getTargetTitle(discount.target);
                return (
                    <div key={index} className={`flex ${alignmentInterpreter(discount.alignment)} w-full`}>
                    <div className={`p-4 text-${discount.alignment} mb-2 border-b w-[50%]`}>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="text-xl font-bold">${totals[index]}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600">Discount:</span>
                            <span className="text-xl font-bold">
                                {discount.type === 'amount' ? `-$${discount.value}` : `${discount.value}% (-$${totals[index]-totals[index+1]})`} off {targetTitle}
                            </span>
                        </div>
                        {discount.description && (
                            <div className="text-sm text-gray-500 mt-2">
                                <span className="font-medium">Reason:</span> {discount.description}
                            </div>
                        )}
                    </div>
                    </div>
                );
            })}
        </div>
    );
};

export default DiscountsDisplay;