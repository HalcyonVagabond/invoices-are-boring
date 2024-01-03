import React, { useState } from 'react';
// Material UI
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
// Components
import LineItemForm from './LineItemInput';
import InvoiceTitleInput from './TitleInput';
import HeaderInput from './HeadersInput';

const InvoiceInputsMenu = ({exportPDF}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className='relative'>
        <button className={`md:hidden mb-4 border border-gray-200 w-full rounded-md py-2 text-center flex items-center justify-center ${isMenuOpen ? 'bg-blue-300' : ''}`} onClick={toggleMenu}>
            <h4 className='mr-1'>{isMenuOpen ? 'Close Menu' : 'Menu'}</h4><MenuIcon className="h-6 w-6" />
        </button>

        <div className={`w-full md:max-w-[350px] h-[70vh] md:h-full overflow-y-auto border border-y md:border-none shadow-ridiculous md:shadow-none space-y-4 py-4 px-4 overflow-auto fixed top-0 bg-gray-100 md:bg-white md:p-1 flex flex-col items-center justify-start z-[1000] ${isMenuOpen ? 'block' : 'hidden'} md:block md:relative`}>
            <button className={`md:hidden mb-4 border border-gray-200 w-full rounded-md py-2 text-center flex items-center justify-center ${isMenuOpen ? 'bg-blue-300' : ''}`} onClick={toggleMenu}>
                <h4 className='mr-1'>{isMenuOpen ? 'Close Menu' : 'Menu '}</h4><MenuIcon className="h-6 w-6" />
            </button>
            <button onClick={exportPDF} className='bg-blue-500 hover:bg-blue-700 px-5 py-2 text-white rounded-md mb-4 font-bold transition-colors duration-500 click:translate-y-[-19px]'>Export to PDF</button>
            <InvoiceTitleInput />

            {/* Header Sections Accordion */}
            <div className='rounded-md w-full'>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="line-item-form-content"
                    id="line-item-form-header"
                    className='!rounded-md'
                >
                    <Typography>Header Sections</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <HeaderInput />
                </AccordionDetails>
            </Accordion>
            </div>
            
            {/* Add Line Items Menu Accordion*/}
            <div className='rounded-md w-full'>
                <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="line-item-form-content"
                    id="line-item-form-header"
                    className='!rounded-md'
                >
                    <Typography>Invoice Items</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <LineItemForm />
                </AccordionDetails>
                </Accordion>
            </div>
            {/* Add more input forms or accordions here */}
        </div>
        </div>
    );
};

export default InvoiceInputsMenu;