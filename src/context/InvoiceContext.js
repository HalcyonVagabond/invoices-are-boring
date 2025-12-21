import React, { createContext, useState, useEffect } from 'react';
import { calculateTotals, modifySectionItem } from '../helpers/Helpers';

const InvoiceContext = createContext();

export const InvoiceProvider = ({ children }) => {

  const [totals, setTotals] = useState({ subtotal: 0, afterDiscounts: 0, taxAmount: 0, total: 0 });
  
  const [invoiceTitle, setInvoiceTitle] = useState(() => {
    const localData = localStorage.getItem('invoiceTitle');
    try {
        const parsedData = JSON.parse(localData);
        return parsedData && typeof parsedData === 'object' ? parsedData : { title: localData, alignment: 'right' };
    } catch {
        return { title: '', alignment: 'right' };
    }
  });

  // New: Invoice metadata (date, bill to, bill from)
  const [invoiceMeta, setInvoiceMeta] = useState(() => {
    const localData = localStorage.getItem('invoiceMeta');
    try {
        const parsedData = JSON.parse(localData);
        return parsedData || {
            date: new Date().toISOString().split('T')[0],
            invoiceNumber: '',
            billTo: { name: '', address: '', email: '' },
            billFrom: { name: '', address: '', email: '' }
        };
    } catch {
        return {
            date: new Date().toISOString().split('T')[0],
            invoiceNumber: '',
            billTo: { name: '', address: '', email: '' },
            billFrom: { name: '', address: '', email: '' }
        };
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

  // New: Tax state
  const [taxes, setTaxes] = useState(() => {
    const localTaxes = localStorage.getItem('taxes');
    return localTaxes ? JSON.parse(localTaxes) : [];
  });

  const [isExporting, setIsExporting] = useState(false);

  // Initializing Type Modification Methods
  const invoiceItemActions = modifySectionItem(setInvoiceItems);
  const headerSectionActions = modifySectionItem(setHeaderSections);
  const discountActions = modifySectionItem(setDiscounts);
  const taxActions = modifySectionItem(setTaxes);

  // Save to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('invoiceTitle', JSON.stringify(invoiceTitle));
    localStorage.setItem('invoiceMeta', JSON.stringify(invoiceMeta));
    localStorage.setItem('headerSections', JSON.stringify(headerSections));
    localStorage.setItem('invoiceItems', JSON.stringify(invoiceItems));
    localStorage.setItem('discounts', JSON.stringify(discounts));
    localStorage.setItem('taxes', JSON.stringify(taxes));

    // Update totals whenever invoiceItems, discounts, or taxes change
    const newTotals = calculateTotals(invoiceItems, discounts, taxes);
    setTotals(newTotals);
  }, [invoiceItems, invoiceTitle, invoiceMeta, headerSections, discounts, taxes]);


  return (
    <InvoiceContext.Provider value={{
      totals,
      invoiceItems,
      invoiceItemActions,
      invoiceTitle,
      setInvoiceTitle,
      invoiceMeta,
      setInvoiceMeta,
      headerSections,
      headerSectionActions,
      discounts,
      discountActions,
      taxes,
      taxActions,
      isExporting,
      setIsExporting,
  }}>
      {children}
  </InvoiceContext.Provider>

  );
};

export default InvoiceContext;