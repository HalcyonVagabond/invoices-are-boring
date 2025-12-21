import React, { useState, useContext } from 'react';
import InvoiceContext from '../../context/InvoiceContext';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import ReorderModal from '../General/ReorderModal';

const HeaderInput = () => {
    const { headerSections, headerSectionActions, invoiceMeta, setInvoiceMeta } = useContext(InvoiceContext);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [alignment, setAlignment] = useState('left');

    const handleAddSection = (e) => {
        e.preventDefault();
        const id = Array.from(window.crypto.getRandomValues(new Uint8Array(5)), byte => byte.toString(16).padStart(2, '0')).join('');
        headerSectionActions.add({ title, content, alignment, id });
        setTitle('');
        setContent('');
        setAlignment('left');
    };

    const handleUpdateSection = (index, key, value) => {
        const updatedSection = { ...headerSections[index], [key]: value };
        headerSectionActions.update(index, updatedSection);
    };

    const handleMetaChange = (field, value) => {
        setInvoiceMeta(prev => ({ ...prev, [field]: value }));
    };

    const handleBillToChange = (field, value) => {
        setInvoiceMeta(prev => ({
            ...prev,
            billTo: { ...prev.billTo, [field]: value }
        }));
    };

    const handleBillFromChange = (field, value) => {
        setInvoiceMeta(prev => ({
            ...prev,
            billFrom: { ...prev.billFrom, [field]: value }
        }));
    };

    function isEven(number) {
        return number % 2 === 0;
    }

    const alignmentOptions = [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' },
    ];

    return (
        <div className="bg-white w-full overflow-auto h-full space-y-6">
            
            {/* Invoice Meta: Date & Number */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <h4 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
                    📅 Invoice Details
                </h4>
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col">
                        <label className="text-xs text-gray-500 mb-1 font-medium">Date</label>
                        <input
                            type="date"
                            value={invoiceMeta?.date || ''}
                            onChange={(e) => handleMetaChange('date', e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white text-sm"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs text-gray-500 mb-1 font-medium">Invoice #</label>
                        <input
                            type="text"
                            value={invoiceMeta?.invoiceNumber || ''}
                            onChange={(e) => handleMetaChange('invoiceNumber', e.target.value)}
                            placeholder="INV-001"
                            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white text-sm"
                        />
                    </div>
                </div>
                <div className="flex gap-2 mt-3">
                    {alignmentOptions.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => handleMetaChange('detailsAlignment', option.value)}
                            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                                (invoiceMeta?.detailsAlignment || 'left') === option.value
                                    ? 'bg-blue-500 text-white shadow-sm'
                                    : 'bg-white text-gray-600 hover:bg-blue-100'
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Bill From */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <h4 className="text-sm font-semibold text-green-800 mb-3 flex items-center gap-2">
                    🏢 Bill From (Your Info)
                </h4>
                <div className="space-y-2">
                    <input
                        type="text"
                        value={invoiceMeta?.billFrom?.name || ''}
                        onChange={(e) => handleBillFromChange('name', e.target.value)}
                        placeholder="Your Name / Company"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-white text-sm"
                    />
                    <textarea
                        value={invoiceMeta?.billFrom?.address || ''}
                        onChange={(e) => handleBillFromChange('address', e.target.value)}
                        placeholder="Address"
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-white text-sm resize-none"
                    />
                    <input
                        type="email"
                        value={invoiceMeta?.billFrom?.email || ''}
                        onChange={(e) => handleBillFromChange('email', e.target.value)}
                        placeholder="Email"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-white text-sm"
                    />
                </div>
                <div className="flex gap-2 mt-3">
                    {alignmentOptions.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => handleBillFromChange('alignment', option.value)}
                            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                                (invoiceMeta?.billFrom?.alignment || 'left') === option.value
                                    ? 'bg-green-500 text-white shadow-sm'
                                    : 'bg-white text-gray-600 hover:bg-green-100'
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Bill To */}
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                <h4 className="text-sm font-semibold text-purple-800 mb-3 flex items-center gap-2">
                    👤 Bill To (Client Info)
                </h4>
                <div className="space-y-2">
                    <input
                        type="text"
                        value={invoiceMeta?.billTo?.name || ''}
                        onChange={(e) => handleBillToChange('name', e.target.value)}
                        placeholder="Client Name / Company"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white text-sm"
                    />
                    <textarea
                        value={invoiceMeta?.billTo?.address || ''}
                        onChange={(e) => handleBillToChange('address', e.target.value)}
                        placeholder="Address"
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white text-sm resize-none"
                    />
                    <input
                        type="email"
                        value={invoiceMeta?.billTo?.email || ''}
                        onChange={(e) => handleBillToChange('email', e.target.value)}
                        placeholder="Email"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white text-sm"
                    />
                </div>
                <div className="flex gap-2 mt-3">
                    {alignmentOptions.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => handleBillToChange('alignment', option.value)}
                            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                                (invoiceMeta?.billTo?.alignment || 'right') === option.value
                                    ? 'bg-purple-500 text-white shadow-sm'
                                    : 'bg-white text-gray-600 hover:bg-purple-100'
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-600 mb-3">Additional Header Sections</h4>
            </div>

            {/* Custom section form */}
            <form onSubmit={handleAddSection} className="flex flex-col space-y-3 mb-4">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Section title"
                    className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-50 text-sm"
                />
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Content"
                    rows="2"
                    className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-50 text-sm resize-none"
                />
                <div className="flex gap-2">
                    {alignmentOptions.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => setAlignment(option.value)}
                            className={'flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 ' + (
                                alignment === option.value
                                    ? 'bg-blue-500 text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            )}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
                <button
                    type="submit"
                    className="self-center p-2.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 shadow-md hover:shadow-lg transition-all duration-200"
                >
                    <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M12 4v16m8-8H4"/>
                    </svg>
                </button>
            </form>

            {headerSections.length >= 2 && (
                <ReorderModal items={headerSections} onReorder={headerSectionActions.reorder} itemType={'Header Sections'}/>
            )}
            
            {/* Accordion for editing header sections */}
            <div className="space-y-2 mt-4">
                {headerSections.map((section, index) => (
                    <Accordion key={section.id || index} className="!rounded-lg !shadow-sm border border-gray-100 before:hidden">
                        <AccordionSummary
                            className={(isEven(index) ? '!bg-blue-600' : '!bg-blue-500') + (index === 0 ? ' !rounded-t-lg' : '') + ' !text-white !min-h-0'}
                            expandIcon={<ExpandMoreIcon className="text-white" />}
                            aria-controls={'panel' + index + 'a-content'}
                            id={'panel' + index + 'a-header'}
                        >
                            <span className="font-medium">{section.title || 'Untitled Section'}</span>
                        </AccordionSummary>
                        <AccordionDetails className="!p-4 bg-gray-50">
                            <div className="flex flex-col space-y-3">
                                <input
                                    type="text"
                                    value={section.title}
                                    onChange={(e) => handleUpdateSection(index, 'title', e.target.value)}
                                    placeholder="Section title"
                                    className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white text-sm"
                                />
                                <textarea
                                    value={section.content}
                                    onChange={(e) => handleUpdateSection(index, 'content', e.target.value)}
                                    placeholder="Content"
                                    rows="2"
                                    className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white text-sm resize-none"
                                />
                                <div className="flex gap-2">
                                    {alignmentOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => handleUpdateSection(index, 'alignment', option.value)}
                                            className={'flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 ' + (
                                                section.alignment === option.value
                                                    ? 'bg-blue-500 text-white shadow-sm'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            )}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                                <button 
                                    className='mt-2 py-2 px-4 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 hover:border-red-400 transition-colors duration-200 self-center'
                                    onClick={() => {
                                        if (window.confirm('Are you sure you want to delete this header section?')) {
                                            headerSectionActions.remove(index);
                                        }
                                    }}
                                >
                                    Remove Section
                                </button>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </div>
        </div>
    );
};

export default HeaderInput;