import React, { createContext, useState, useEffect } from 'react';

const InvoiceContext = createContext();

export const InvoiceProvider = ({ children }) => {
  // State for invoice title
  const [invoiceTitle, setInvoiceTitle] = useState(() => {
    const localTitle = localStorage.getItem('invoiceTitle');
    return localTitle || '';
  });

  const [titleAlignment, setTitleAlignment] = useState(() => {
    const localTitle = localStorage.getItem('titleAlignment');
    return localTitle || 'right';
  })

  const [headerSections, setHeaderSections] = useState(() => {
    const localHeaderSections = localStorage.getItem('headerSections');
    return localHeaderSections ? JSON.parse(localHeaderSections) : [];
  });

  const [invoiceItems, setInvoiceItems] = useState(() => {
    const localData = localStorage.getItem('invoiceItems');
    return localData ? JSON.parse(localData) : [];
  });

  // Load from localStorage on initial load
  useEffect(() => {
    const storedInvoiceItems = JSON.parse(localStorage.getItem('invoiceItems'));
    if (storedInvoiceItems) {
      setInvoiceItems(storedInvoiceItems);
    }
    const storedInvoiceTitle = localStorage.getItem('invoiceTitle');
    if (storedInvoiceTitle) {
      setInvoiceTitle(storedInvoiceTitle);
    }
  }, []);

  // Save to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('invoiceTitle', invoiceTitle);
    localStorage.setItem('titleAlignment', titleAlignment);
    localStorage.setItem('headerSections', JSON.stringify(headerSections));
    localStorage.setItem('invoiceItems', JSON.stringify(invoiceItems));
  }, [invoiceItems, invoiceTitle, titleAlignment, headerSections]);

  const addInvoiceItem = (item) => {
    setInvoiceItems([...invoiceItems, item]);
  };

  const removeInvoiceItem = (index) => {
    const newItems = invoiceItems.filter((_, itemIndex) => itemIndex !== index);
    setInvoiceItems(newItems);
  };

  const addHeaderSection = (section) => {
    setHeaderSections([...headerSections, section]);
  };

  const updateHeaderSection = (index, newSection) => {
    const updatedSections = [...headerSections];
    updatedSections[index] = newSection;
    setHeaderSections(updatedSections);
  };

  const removeHeaderSection = (index) => {
    const newSections = headerSections.filter((_, sectionIndex) => sectionIndex !== index);
    setHeaderSections(newSections);
  };

  return (
    <InvoiceContext.Provider value={{
      invoiceItems,
      addInvoiceItem,
      removeInvoiceItem,
      invoiceTitle,
      setInvoiceTitle,
      titleAlignment,
      setTitleAlignment,
      headerSections,
      addHeaderSection,
      updateHeaderSection,
      removeHeaderSection
    }}>
      {children}
    </InvoiceContext.Provider>

  );
};

export default InvoiceContext;