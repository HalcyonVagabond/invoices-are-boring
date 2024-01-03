import React, { useContext, useState } from 'react';
import InvoiceContext from '../../context/InvoiceContext';
import { toast } from 'react-toastify';

const LineItem = ({ item, index }) => {
  const { removeInvoiceItem } = useContext(InvoiceContext);
  const [showOptions, setShowOptions] = useState(false);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleDelete = () => {
    toast.warn('Are you sure you want to delete?', {
        position: "bottom-center",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        onClose: () => removeInvoiceItem(index)
      });
  };

  return (
    <tr className="hover:bg-gray-50 relative group">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {item.description}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {item.rate}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {item.hours}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {item.rate * item.hours}
      </td>
      <div className='relative'>
      <div className="absolute top-1/2 right-0 transform mt-3">
        <svg onClick={toggleOptions} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-gray-500 cursor-pointer">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
        </svg>
        {showOptions && (
          <div className="absolute right-0 bg-white border mt-2 py-2 w-40 z-[100] bg-blue-500">
            <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleDelete}>Delete</button>
            {/* Add more actions here if needed */}
          </div>
        )}
      </div>
      </div>
    </tr>
  );
};

export default LineItem;