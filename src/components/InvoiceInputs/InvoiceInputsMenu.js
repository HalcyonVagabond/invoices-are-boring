import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// Material UI
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
// Components
import LineItemForm from './LineItemInput';
import InvoiceTitleInput from './TitleInput';
import HeaderInput from './HeadersInput';
import DiscountInput from './DiscountInput';
import TaxInput from './TaxInput';

const InvoiceInputsMenu = ({ exportPDF }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        // Automatically open the menu on desktop
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

    // Decide the anchor based on the screen size
    const getDrawerAnchor = () => {
        if (isDesktop) return 'left';
        if (isMobile) return 'top';
        return 'left';
    };

    const drawerWidth = isDesktop ? '25%' : (isMobile ? '100%' : '320px');

    // Custom styled accordion with modern look
    const StyledAccordion = ({ children, title, icon, defaultExpanded = false }) => (
        <Accordion 
            defaultExpanded={defaultExpanded}
            className="!rounded-xl !shadow-sm !border !border-gray-100 !mb-3 before:hidden overflow-hidden"
            sx={{
                '&:before': { display: 'none' },
                '&.Mui-expanded': { margin: '0 0 12px 0' },
            }}
        >
            <AccordionSummary 
                expandIcon={<ExpandMoreIcon className="text-gray-500" />}
                className="!bg-white hover:!bg-gray-50 transition-colors"
                sx={{ minHeight: '52px', '&.Mui-expanded': { minHeight: '52px' } }}
            >
                <div className="flex items-center gap-2.5">
                    <span className="text-lg">{icon}</span>
                    <span className="font-medium text-gray-700 text-sm">{title}</span>
                </div>
            </AccordionSummary>
            <AccordionDetails className="!p-4 !pt-2 !bg-gray-50/50">
                {children}
            </AccordionDetails>
        </Accordion>
    );

    return (
        <>
            <button
                aria-label="open drawer"
                edge="start"
                onClick={toggleMenu}
                className={`!bg-gray-100 hover:!bg-blue-500 hover:text-white transition-all duration-300 w-full md:w-12 l-0 ${isMenuOpen && 'hidden'}`}
                sx={{ mr: 2, ...(isMenuOpen && { display: 'none' }) }}
            >
                <MenuIcon className={`${isDesktop && 'rotate-90'}`} />
            </button>
            
            <Drawer
                variant={isDesktop ? 'persistent' : 'temporary'}
                anchor={getDrawerAnchor()}
                open={isMenuOpen}
                onClose={toggleMenu}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    '& .MuiDrawer-paper': { 
                        boxSizing: 'border-box', 
                        width: drawerWidth, 
                        minWidth: "300px", 
                        maxWidth: "380px",
                        borderRight: '1px solid #e5e7eb',
                    },
                }}
            >
                <div className="flex flex-col w-full h-full overflow-auto bg-gradient-to-b from-gray-50 to-white">
                    {/* Header */}
                    <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">Invoice Builder</h2>
                            <IconButton
                                onClick={toggleMenu}
                                className="!bg-gray-100 hover:!bg-gray-200"
                                size="small"
                            >
                                <MenuIcon className={`${isDesktop && 'rotate-90'} text-gray-600`} fontSize="small" />
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

                    {/* Content */}
                    <div className="flex-1 p-4 space-y-1">
                        {/* Title Section - Always visible */}
                        <InvoiceTitleInput />
                        
                        {/* Header Sections */}
                        <StyledAccordion title="Header Sections" icon="📋" defaultExpanded={false}>
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
                    </div>

                    {/* Footer */}
                    <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-gray-100 p-4">
                        <button 
                            className='w-full py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2' 
                            onClick={clearInvoice}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Clear Invoice
                        </button>
                    </div>
                </div>
            </Drawer>
        </>
    );
};

export default InvoiceInputsMenu;