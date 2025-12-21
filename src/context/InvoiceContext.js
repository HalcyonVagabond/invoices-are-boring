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

  // Logo URL state
  const [logoUrl, setLogoUrl] = useState(() => {
    const localLogo = localStorage.getItem('invoiceLogo');
    return localLogo || null;
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
    if (logoUrl) {
      localStorage.setItem('invoiceLogo', logoUrl);
    } else {
      localStorage.removeItem('invoiceLogo');
    }

    // Update totals whenever invoiceItems, discounts, or taxes change
    const newTotals = calculateTotals(invoiceItems, discounts, taxes);
    setTotals(newTotals);
  }, [invoiceItems, invoiceTitle, invoiceMeta, headerSections, discounts, taxes, logoUrl]);


  // Function to load invoice data (used when loading saved invoices or templates)
  const loadInvoiceData = (data) => {
    if (data.invoiceTitle !== undefined) {
      setInvoiceTitle(typeof data.invoiceTitle === 'object' 
        ? data.invoiceTitle 
        : { title: data.invoiceTitle, alignment: 'right' }
      );
    }
    if (data.invoiceMeta !== undefined) {
      setInvoiceMeta(prev => ({ ...prev, ...data.invoiceMeta }));
    }
    if (data.invoiceItems !== undefined) {
      invoiceItemActions.setAll(data.invoiceItems);
    }
    if (data.headerSections !== undefined) {
      headerSectionActions.setAll(data.headerSections);
    }
    if (data.discounts !== undefined) {
      discountActions.setAll(data.discounts);
    }
    if (data.taxes !== undefined) {
      taxActions.setAll(data.taxes);
    }
    if (data.logoUrl !== undefined) {
      setLogoUrl(data.logoUrl);
    }
    // Handle flat data format from saved invoices
    if (data.fromName !== undefined || data.toName !== undefined) {
      setInvoiceMeta(prev => ({
        ...prev,
        date: data.invoiceDate || prev.date,
        invoiceNumber: data.invoiceNumber || prev.invoiceNumber,
        billFrom: {
          name: data.fromName || '',
          address: data.fromAddress || '',
          email: data.fromEmail || ''
        },
        billTo: {
          name: data.toName || '',
          address: data.toAddress || '',
          email: data.toEmail || ''
        }
      }));
    }
  };

  // Function to get all current invoice data (for saving)
  const getInvoiceData = () => ({
    invoiceTitle,
    invoiceMeta,
    invoiceItems,
    headerSections,
    discounts,
    taxes,
    totals,
    logoUrl
  });

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
      logoUrl,
      setLogoUrl,
      isExporting,
      setIsExporting,
      loadInvoiceData,
      getInvoiceData,
  }}>
      {children}
  </InvoiceContext.Provider>

  );
};

export default InvoiceContext;