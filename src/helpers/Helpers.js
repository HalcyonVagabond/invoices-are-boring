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
        // console.log("In reorder helper!")
        setSection((prevItems) => {
          const result = Array.from(prevItems);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          return result;
        });
      },
});
  
export { calculateTotals, modifySectionItem, trackVisit };