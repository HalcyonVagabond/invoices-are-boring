import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import LineItemForm from './LineItemForm';
import InvoiceTitleInput from './InvoiceTitleInput';
import HeaderInput from './HeadersInput';

const InvoiceInputsMenu = () => {
    return (
        <div className="max-w-[350px] space-y-8 h-full">
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
    );
};

export default InvoiceInputsMenu;