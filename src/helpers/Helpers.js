import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid'; // You can use the 'uuid' library to generate a unique string

// Initialize Supabase client outside of the component/function so it's only done once
// const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
// const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
// const supabase = createClient(supabaseUrl, supabaseAnonKey);

const trackVisit = async () => {
    const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
    const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    console.log('Supabase URL:', process.env.REACT_APP_SUPABASE_URL);
    console.log('Supabase Anon Key:', process.env.REACT_APP_SUPABASE_ANON_KEY);

    let userId = localStorage.getItem('userId');
  
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem('userId', userId);
    }
  
    try {
      const { data, error } = await supabase
        .from('Visits')
        .upsert({
          id: userId,
          latest_visit: new Date().toISOString(),
          // Assuming you're incrementing 'visit_count' here. You need to handle the increment logic.
        }, {
          onConflict: 'id', // This tells Supabase to perform an update if there's a conflict on the 'id' column
          returning: 'minimal', // You can use 'representation' to get the updated data back if needed
        });
  
      if (error) {
        console.error('Error tracking visit:', error);
      } else {
        console.log('Visit tracked:', data);
      }
    } catch (error) {
      console.error('Supabase error:', error);
    }
  };

// Helper to calculate item total (supports both hourly and fixed billing types)
const getItemTotal = (item) => {
    if (item.billingType === 'fixed' || item.quantity) {
        return (parseFloat(item.price) || 0) * (parseFloat(item.quantity) || 0);
    }
    return (parseFloat(item.rate) || 0) * (parseFloat(item.hours) || 0);
};

const calculateTotals = (invoiceItems, discounts, taxes = []) => {
    // Calculate initial subtotal
    const subtotal = invoiceItems.reduce((acc, item) => acc + getItemTotal(item), 0);
    
    // Track running total after each discount for display purposes
    let runningTotal = subtotal;
    const discountBreakdown = [subtotal];

    const applyItemSpecificDiscount = (item, discount) => {
        const itemTotal = getItemTotal(item);
        const discountAmount = discount.type === 'percentage'
            ? itemTotal * (discount.value / 100)
            : parseFloat(discount.value);
        return discountAmount;
    };

    const applyTotalDiscount = (discount, currentTotal) => {
        const discountAmount = discount.type === 'percentage'
            ? currentTotal * (discount.value / 100)
            : parseFloat(discount.value);
        return discountAmount;
    };

    // Apply discounts
    discounts.forEach(discount => {
        if (discount.target !== 'Total') {
            const targetItem = invoiceItems.find(item => item.id === discount.target);
            if (targetItem) {
                runningTotal -= applyItemSpecificDiscount(targetItem, discount);
            }
        } else {
            runningTotal -= applyTotalDiscount(discount, runningTotal);
        }
        discountBreakdown.push(runningTotal);
    });

    const afterDiscounts = runningTotal;

    // Calculate taxes (applied after discounts)
    let taxAmount = 0;
    const taxBreakdown = [];
    
    taxes.forEach(tax => {
        const amount = tax.type === 'percentage'
            ? afterDiscounts * (parseFloat(tax.value) || 0) / 100
            : parseFloat(tax.value) || 0;
        taxAmount += amount;
        taxBreakdown.push({ ...tax, calculatedAmount: amount });
    });

    const total = afterDiscounts + taxAmount;

    return {
        subtotal,
        discountBreakdown,
        afterDiscounts,
        taxBreakdown,
        taxAmount,
        total
    };
};

  const modifySectionItem = (setSection) => ({
    add: (item) => setSection(prevItems => [...prevItems, item]),
    update: (index, newItem) => setSection(prevItems => prevItems.map((item, idx) => idx === index ? newItem : item)),
    remove: (index) => setSection(prevItems => prevItems.filter((_, idx) => idx !== index)),
    reorder: (startIndex, endIndex) => {
        // console.log("In reorder helper!")
        setSection((prevItems) => {
          const result = Array.from(prevItems);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          return result;
        });
      },
    setAll: (items) => setSection(items || []),
});
  
export { calculateTotals, modifySectionItem, trackVisit };