import React from 'react';

const LineItem = ({ item, index }) => {
 
  return (
    <tr className="hover:bg-gray-50 relative group">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-left max-w-[400px] overflow-x-hidden">
        <h4 className='text-black font-semibold'>{item.title}</h4>
        <pre className='text-gray-800 max-w-[380px] text-wrap'>{item.description}</pre>
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
    </tr>
  );
};

export default LineItem;