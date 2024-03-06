import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// Material UI
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
// Components
import LineItemForm from './LineItemInput';
import InvoiceTitleInput from './TitleInput';
import HeaderInput from './HeadersInput';
import DiscountInput from './DiscountInput';

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

    // Decide the anchor based on the screen size
    const getDrawerAnchor = () => {
        if (isDesktop) return 'left';
        if (isMobile) return 'top';
        return 'left';
    };

    const drawerWidth = isDesktop ? '25%' : (isMobile ? '100%' : '320px');

    return (
        <>
             
                <button
                    //color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={toggleMenu}
                    className={`!bg-gray-100 hover:!bg-blue-400 hover:text-white transition-colors duration-500 w-full md:w-12 l-0 ${isMenuOpen && 'hidden'}`}
                    sx={{ mr: 2, ...(isMenuOpen && { display: 'none' }) }} // Hide button when menu is open
                >
                    <MenuIcon className={`${isDesktop && 'rotate-90'}`} />
                </button>
            
            <Drawer
                variant={isDesktop ? 'persistent' : 'temporary'}
                //variant={isDesktop ? 'temporary' : 'temporary'}
                anchor={getDrawerAnchor()}
                open={isMenuOpen}
                onClose={toggleMenu}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile
                }}
                sx={{
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, minWidth: "280px", maxWidth: "350px" },
                }}
            >
                <div className="flex flex-col w-full h-full p-4 overflow-auto bg-gray-100 md:min-w-[280px]">
                    
                        <IconButton
                            onClick={toggleMenu}
                            sx={{ alignSelf: 'flex-end' }}
                        >
                            <MenuIcon className={`${isDesktop && 'rotate-90'}`} />
                        </IconButton>
             
                    <button onClick={exportPDF} className='bg-blue-500 hover:bg-blue-700 px-5 py-2 text-white rounded-md mb-4 font-bold transition-colors duration-500'>Export to PDF</button>
                    <InvoiceTitleInput />
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                            <Typography>Header Sections</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <HeaderInput />
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2a-content" id="panel2a-header">
                            <Typography>Invoice Items</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <LineItemForm />
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel3a-content" id="panel3a-header">
                            <Typography>Discounts</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <DiscountInput />
                        </AccordionDetails>
                    </Accordion>
                    {/* Add more input forms or accordions here as needed */}
                </div>
            </Drawer>
        </>
    );
};

export default InvoiceInputsMenu;