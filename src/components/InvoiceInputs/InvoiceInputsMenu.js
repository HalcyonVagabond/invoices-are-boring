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

const InvoiceInputsMenu = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className='relative'>
        <button className={`md:hidden mb-4 border border-gray-200 w-full rounded-md py-2 text-center flex items-center justify-center ${isMenuOpen ? 'bg-blue-300' : ''}`} onClick={toggleMenu}>
            <h4 className='mr-1'>{isMenuOpen ? 'Close Menu' : 'Inputs Menu'}</h4><MenuIcon className="h-6 w-6" />
        </button>

        <div className={`w-full md:max-w-[350px] h-[70vh] md:h-full overflow-y-auto border border-y md:border-none shadow-xl md:shadow-none space-y-4 py-4 px-4 overflow-auto fixed top-0 bg-gray-200 md:bg-white md:p-1 flex flex-col items-center justify-start z-[1000] ${isMenuOpen ? 'block' : 'hidden'} md:block md:relative`}>
            <button className={`md:hidden mb-4 border border-gray-200 w-full rounded-md py-2 text-center flex items-center justify-center ${isMenuOpen ? 'bg-blue-300' : ''}`} onClick={toggleMenu}>
                <h4 className='mr-1'>{isMenuOpen ? 'Close Menu' : 'Inputs Menu '}</h4><MenuIcon className="h-6 w-6" />
            </button>
            <InvoiceTitleInput />

            {/* Header Sections Accordion */}
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="line-item-form-content"
                    id="line-item-form-header"
                >
                    <Typography>Header Sections</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <HeaderInput />
                </AccordionDetails>
            </Accordion>
            
            {/* Add Line Items Menu Accordion*/}
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="line-item-form-content"
                    id="line-item-form-header"
                >
                    <Typography>Line Items</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <LineItemForm />
                </AccordionDetails>
            </Accordion>


            {/* Add more input forms or accordions here */}
        </div>
        </div>
    );
};

export default InvoiceInputsMenu;