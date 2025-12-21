import React, { useState, useEffect, useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// Material UI
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
// Components
import LineItemForm from './LineItemInput';
import InvoiceTitleInput from './TitleInput';
import HeaderInput from './HeadersInput';
import DiscountInput from './DiscountInput';
import TaxInput from './TaxInput';
import SaveInvoicePanel from './SaveInvoicePanel';
import LogoUpload from './LogoUpload';
// Context
import InvoiceContext from '../../context/InvoiceContext';

// Defined outside component to prevent remounting on re-renders
const StyledAccordion = ({ children, title, icon, defaultExpanded = false }) => (
    <Accordion 
        defaultExpanded={defaultExpanded}
        className="!rounded-xl !shadow-none !border !border-slate-600/50 !mb-3 before:hidden overflow-hidden !bg-slate-700/50"
        sx={{
            '&:before': { display: 'none' },
            '&.Mui-expanded': { margin: '0 0 12px 0' },
        }}
    >
        <AccordionSummary 
            expandIcon={<ExpandMoreIcon className="text-slate-400" />}
            className="!bg-slate-700/80 hover:!bg-slate-600/80 transition-colors"
            sx={{ minHeight: '48px', '&.Mui-expanded': { minHeight: '48px' } }}
        >
            <div className="flex items-center gap-2.5">
                <span className="text-lg">{icon}</span>
                <span className="font-medium text-slate-200 text-sm">{title}</span>
            </div>
        </AccordionSummary>
        <AccordionDetails className="!p-4 !pt-3 !bg-slate-800/50">
            {children}
        </AccordionDetails>
    </Accordion>
);

const InvoiceInputsMenu = ({ exportPDF, onOpenAuth }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('edit'); // 'edit' or 'save'
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    // Get invoice context for saving/loading
    const { getInvoiceData, loadInvoiceData, logoUrl, setLogoUrl } = useContext(InvoiceContext);

    useEffect(() => {
        setIsMenuOpen(isDesktop);
    }, [isDesktop]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    function clearInvoice(){
        if ( window.confirm("Are you SURE you want to delete this invoice?\n\nYou CANNOT get it back!") ){
            localStorage.removeItem('invoiceTitle')
            localStorage.removeItem('invoiceItems')
            localStorage.removeItem('headerSections')
            localStorage.removeItem('discounts')
            localStorage.removeItem('taxes')
            localStorage.removeItem('invoiceMeta')
            window.location.reload()
        }
    }

    // Mobile floating button
    if (!isMenuOpen) {
        return (
            <button
                onClick={toggleMenu}
                className="fixed bottom-6 left-6 z-50 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-110"
                aria-label="Open menu"
            >
                <MenuIcon />
            </button>
        );
    }

    return (
        <div className={`
            ${isMobile ? 'fixed inset-0 z-50' : 'relative'}
            ${isDesktop ? 'w-[380px] min-w-[340px]' : 'w-full max-w-[400px]'}
        `}>
            {/* Mobile overlay */}
            {isMobile && (
                <div 
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={toggleMenu}
                />
            )}
            
            {/* Menu Panel */}
            <div className={`
                ${isMobile ? 'absolute left-0 top-0 bottom-0 w-[85vw] max-w-[380px]' : 'w-full'}
                bg-slate-800 rounded-2xl shadow-2xl shadow-black/30 overflow-hidden flex flex-col
                ${isDesktop ? 'max-h-[calc(100vh-8rem)]' : 'h-full'}
                border border-slate-700/50
            `}>
                {/* Header */}
                <div className="bg-slate-800/95 backdrop-blur-sm border-b border-slate-700/50 p-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-base font-semibold text-white">Invoice Builder</h2>
                                <p className="text-xs text-slate-400">Create & customize</p>
                            </div>
                        </div>
                        <IconButton
                            onClick={toggleMenu}
                            className="!bg-slate-700 hover:!bg-slate-600"
                            size="small"
                        >
                            <CloseIcon className="text-slate-400" fontSize="small" />
                        </IconButton>
                    </div>
                    
                    {/* Export Button */}
                    <button 
                        onClick={exportPDF} 
                        className='w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-5 py-3 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 flex items-center justify-center gap-2'
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Export to PDF
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-700/50">
                    <button
                        onClick={() => setActiveTab('edit')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                            activeTab === 'edit'
                                ? 'text-blue-400 border-b-2 border-blue-400 bg-slate-700/30'
                                : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/20'
                        }`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                    </button>
                    <button
                        onClick={() => setActiveTab('save')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                            activeTab === 'save'
                                ? 'text-blue-400 border-b-2 border-blue-400 bg-slate-700/30'
                                : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/20'
                        }`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                        Saved
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-1">
                    {activeTab === 'edit' ? (
                        <>
                            {/* Title Section */}
                            <InvoiceTitleInput />
                            
                            {/* Logo Upload */}
                            <StyledAccordion title="Company Logo" icon="🖼️" defaultExpanded={false}>
                                <LogoUpload 
                                    currentLogo={logoUrl}
                                    onLogoChange={setLogoUrl}
                                    onOpenAuth={onOpenAuth}
                                />
                            </StyledAccordion>
                            
                            {/* Header Sections */}
                            <StyledAccordion title="Header & Details" icon="📋" defaultExpanded={false}>
                                <HeaderInput />
                            </StyledAccordion>
                            
                            {/* Invoice Items */}
                            <StyledAccordion title="Invoice Items" icon="📝" defaultExpanded={true}>
                                <LineItemForm />
                            </StyledAccordion>
                            
                            {/* Discounts */}
                            <StyledAccordion title="Discounts" icon="🏷️" defaultExpanded={false}>
                                <DiscountInput />
                            </StyledAccordion>
                            
                            {/* Taxes */}
                            <StyledAccordion title="Taxes" icon="💰" defaultExpanded={false}>
                                <TaxInput />
                            </StyledAccordion>
                        </>
                    ) : (
                        <SaveInvoicePanel 
                            invoiceState={getInvoiceData()}
                            onLoadInvoice={loadInvoiceData}
                            onOpenAuth={onOpenAuth}
                        />
                    )}
                </div>

                {/* Footer */}
                <div className="bg-slate-800/95 backdrop-blur-sm border-t border-slate-700/50 p-4">
                    <button 
                        className='w-full py-2.5 text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2' 
                        onClick={clearInvoice}
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Clear Invoice
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvoiceInputsMenu;