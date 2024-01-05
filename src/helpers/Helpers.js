const calculateTotals = (invoiceItems, discounts) => {
    let subtotal = invoiceItems.reduce((acc, item) => acc + (item.rate * item.hours), 0);
    let totals = [subtotal]; // Array to store subtotals after each discount

    const applyItemSpecificDiscount = (item, discount) => {
        const discountAmount = discount.type === 'percentage'
            ? (item.rate * item.hours) * (discount.value / 100)
            : parseFloat(discount.value);
        return discountAmount;
    };

    const applyTotalDiscount = (discount) => {
        const discountAmount = discount.type === 'percentage'
            ? subtotal * (discount.value / 100)
            : parseFloat(discount.value);
        return discountAmount;
    };

    discounts.forEach(discount => {
        if (discount.target !== 'Total') {
            // Apply item-specific discount
            const targetItem = invoiceItems.find(item => item.id === discount.target);
            if (targetItem) {
                subtotal -= applyItemSpecificDiscount(targetItem, discount);
            }
        } else {
            // Apply total discount
            subtotal -= applyTotalDiscount(discount);
        }
        totals.push(subtotal); // Add updated subtotal after each discount
    });

    return totals; // Return the array of subtotals
};

  const modifySectionItem = (setSection) => ({
    add: (item) => setSection(prevItems => [...prevItems, item]),
    update: (index, newItem) => setSection(prevItems => prevItems.map((item, idx) => idx === index ? newItem : item)),
    remove: (index) => setSection(prevItems => prevItems.filter((_, idx) => idx !== index)),
    reorder: (startIndex, endIndex) => {
        console.log("In reorder helper!")
        setSection((prevItems) => {
          const result = Array.from(prevItems);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          return result;
        });
      },
});

export { calculateTotals, modifySectionItem };