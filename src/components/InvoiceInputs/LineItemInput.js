import React, { useState, useContext } from 'react';
import InvoiceContext from '../../context/InvoiceContext';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


function InvoiceItemEntry() {
    const { addInvoiceItem, invoiceItems, updateInvoiceItem, removeInvoiceItem } = useContext(InvoiceContext);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [rate, setRate] = useState('');
    const [hours, setHours] = useState('');

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handleRateChange = (event) => {
        setRate(event.target.value);
    };

    const handleHoursChange = (event) => {
        setHours(event.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addInvoiceItem({ title, description, rate, hours });
        setTitle('');
        setDescription('');
        setRate('');
        setHours('');
    };

    const handleUpdateItem = (index, key, value) => {
        const updatedItem = { ...invoiceItems[index], [key]: value };
        updateInvoiceItem(index, updatedItem);
    };

    return (
        <div className="shadow-lg p-6 rounded-lg bg-white mt-5 w-full overflow-auto h-full">
            <h3 className="text-lg font-semibold mb-4">Add Invoice Item</h3>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                <input
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="Title"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                />
                <textarea
                    type="text"
                    value={description}
                    onChange={handleDescriptionChange}
                    placeholder="Description"
                    rows="3"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                />
                <input
                    type="number"
                    value={rate}
                    onChange={handleRateChange}
                    placeholder="Rate per Hour"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                />
                <input
                    type="number"
                    value={hours}
                    onChange={handleHoursChange}
                    placeholder="Hours"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                />
                <button
                    type="submit"
                    className="self-center p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                >
                    <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M12 4v16m8-8H4"/>
                    </svg>
                </button>
            </form>
            {invoiceItems.map((item, index) => (
                <Accordion key={index}>
                    <AccordionSummary
                        className='bg-blue-200'
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel${index}a-content`}
                        id={`panel${index}a-header`}
                    >
                        <div>Edit: {item.title}</div>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className="flex flex-col space-y-4">
                        <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleUpdateItem(index, 'title', e.target.value)}
                    placeholder="Title"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                />
                <textarea
                    type="text"
                    value={item.description}
                    onChange={(e) => handleUpdateItem(index, 'description', e.target.value)}
                    placeholder="Description"
                    rows="3"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                />
                <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => handleUpdateItem(index, 'rate', e.target.value)}
                    placeholder="Rate per Hour"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                />
                <input
                    type="number"
                    value={item.hours}
                    onChange={(e) => handleUpdateItem(index, 'hours', e.target.value)}
                    placeholder="Hours"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                />
                            
                            <button className='hover:bg-red-600 border border-red-600 hover:text-white cursor-pointer py-2 rounded-md w-[80px] mx-auto transition-colors duration-200' onClick={()=>window.confirm('Are you sure you want to delete this header section?', removeInvoiceItem(index))}>Remove</button>
                        </div>
                    </AccordionDetails>
                </Accordion>
            ))}
        </div>
    );
}

export default InvoiceItemEntry;