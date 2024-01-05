const calculateTotals = (invoiceItems, discounts) => {
    // Calculate initial subtotal from invoice items
    let subtotal = invoiceItems.reduce((acc, item) => acc + (item.rate * item.hours), 0);
  
    // Prepare the totals array with the initial subtotal
    let totals = [subtotal];
  
    // Apply item-specific discounts first
    invoiceItems.forEach(item => {
      discounts.forEach(discount => {
        if (discount.target === item.id) {
          const discountAmount = discount.type === 'percentage'
            ? (item.rate * item.hours) * (discount.value / 100)
            : parseFloat(discount.value);
          subtotal -= discountAmount;
        }
      });
    });
  
    // Apply 'Total' discounts last
    discounts.forEach(discount => {
      if (discount.target === 'Total') {
        const discountAmount = discount.type === 'percentage'
          ? subtotal * (discount.value / 100)
          : parseFloat(discount.value);
        subtotal -= discountAmount;
      }
      totals.push(subtotal);
    });
  
    return totals;
  };

  const modifySectionItem = (setSection) => ({
    add: (item) => setSection(prevItems => [...prevItems, item]),
    update: (index, newItem) => setSection(prevItems => prevItems.map((item, idx) => idx === index ? newItem : item)),
    remove: (index) => setSection(prevItems => prevItems.filter((_, idx) => idx !== index))
});

export { calculateTotals, modifySectionItem };