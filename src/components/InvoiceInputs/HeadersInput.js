import React, { useState, useContext } from 'react';
import InvoiceContext from '../../context/InvoiceContext';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const HeaderInput = () => {
    const { headerSections, addHeaderSection, updateHeaderSection, removeHeaderSection } = useContext(InvoiceContext);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [alignment, setAlignment] = useState('left');

    const handleAddSection = (e) => {
        e.preventDefault();
        addHeaderSection({ title, content, alignment });
        setTitle('');
        setContent('');
        setAlignment('left');
    };

    const handleUpdateSection = (index, key, value) => {
        const updatedSection = { ...headerSections[index], [key]: value };
        updateHeaderSection(index, updatedSection);
    };

    return (
        <div className="shadow-lg p-6 rounded-lg bg-white mt-5 w-full overflow-auto h-full">
            {/* New section form */}

            <h3 className="text-lg font-semibold mb-4">Add Header Section</h3>
            <form onSubmit={handleAddSection} className="flex flex-col space-y-4">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                />
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Content"
                    rows="3"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                />
                <select
                    value={alignment}
                    onChange={(e) => setAlignment(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                </select>
                <button
                    type="submit"
                    className="self-center p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                >
                    <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M12 4v16m8-8H4"/>
                    </svg>
                </button>
            </form>
            
            {/* Accordion for editing header sections */}
            {headerSections.map((section, index) => (
                <Accordion key={index}>
                    <AccordionSummary
                        className='bg-blue-200'
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel${index}a-content`}
                        id={`panel${index}a-header`}
                    >
                        <div>Edit: {section.title}</div>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className="flex flex-col space-y-4">
                            <input
                                type="text"
                                value={section.title}
                                onChange={(e) => handleUpdateSection(index, 'title', e.target.value)}
                                placeholder="Title"
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            />
                            <textarea
                                value={section.content}
                                onChange={(e) => handleUpdateSection(index, 'content', e.target.value)}
                                placeholder="Content"
                                rows="3"
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            />
                           
                            <div className="flex justify-between mt-3">
                                <button onClick={() => handleUpdateSection(index, 'alignment', 'left')} className={`px-3 py-1 rounded-md ${section.alignment === 'left' ? 'bg-blue-500 text-white' : 'hover:bg-blue-200 transition-colors duration-500'}`}>Left</button>
                                <button onClick={() => handleUpdateSection(index, 'alignment', 'center')} className={`px-3 py-1 rounded-md ${section.alignment === 'center' ? 'bg-blue-500 text-white' : 'hover:bg-blue-200 transition-colors duration-500'}`} >Center</button>
                                <button onClick={() => handleUpdateSection(index, 'alignment', 'right')} className={`px-3 py-1 rounded-md ${section.alignment === 'right' ? 'bg-blue-500 text-white' : 'hover:bg-blue-200 transition-colors duration-500'}`}>Right</button>
                            </div>
                            <button className='border border-red-600 hover:bg-red-600 hover:text-white transition-colors duration-200 w-[80px] mx-auto cursor-pointer py-2 rounded-md' onClick={()=>window.confirm('Are you sure you want to delete this header section?', removeHeaderSection(index))}>Remove</button>
                        </div>
                    </AccordionDetails>
                </Accordion>
            ))}
        </div>
    );
};

export default HeaderInput;