import React, { createContext, useState, useEffect } from 'react';
import { calculateTotals, modifySectionItem } from '../helpers/Helpers';

const InvoiceContext = createContext();

export const InvoiceProvider = ({ children }) => {

  const [totals, setTotals] = useState([]);
  
  const [invoiceTitle, setInvoiceTitle] = useState(() => {
    const localData = localStorage.getItem('invoiceTitle');
    try {
        const parsedData = JSON.parse(localData);
        return parsedData && typeof parsedData === 'object' ? parsedData : { title: localData, alignment: 'right' };
    } catch {
        return { title: '', alignment: 'right' };
    }
});

  const [headerSections, setHeaderSections] = useState(() => {
    const localHeaderSections = localStorage.getItem('headerSections');
    return localHeaderSections ? JSON.parse(localHeaderSections) : [];
  });

  const [invoiceItems, setInvoiceItems] = useState(() => {
    const localData = localStorage.getItem('invoiceItems');
    return localData ? JSON.parse(localData) : [];
  });

  const [discounts, setDiscounts] = useState(() => {
    const localDiscounts = localStorage.getItem('discounts');
    return localDiscounts ? JSON.parse(localDiscounts) : [];
});

  // Initializing Type Modification Methods

  const invoiceItemActions = modifySectionItem(setInvoiceItems);
  const headerSectionActions = modifySectionItem(setHeaderSections);
  const discountActions = modifySectionItem(setDiscounts);

  // Save to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('invoiceTitle', JSON.stringify(invoiceTitle));
    localStorage.setItem('headerSections', JSON.stringify(headerSections));
    localStorage.setItem('invoiceItems', JSON.stringify(invoiceItems));
    localStorage.setItem('discounts', JSON.stringify(discounts));

    // Update totals whenever invoiceItems or discounts change
    const newTotals = calculateTotals(invoiceItems, discounts);
    console.log(newTotals, "newTotals");
    setTotals(newTotals);
  }, [invoiceItems, invoiceTitle, headerSections, discounts]);


  return (
    <InvoiceContext.Provider value={{
      totals,
      invoiceItems,
      invoiceItemActions,
      invoiceTitle,
      setInvoiceTitle,
      headerSections,
      headerSectionActions,
      discounts,
      discountActions
  }}>
      {children}
  </InvoiceContext.Provider>

  );
};

export default InvoiceContext;