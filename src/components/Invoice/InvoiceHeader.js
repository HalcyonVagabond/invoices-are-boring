import React, { useContext } from 'react';
import InvoiceContext from '../../context/InvoiceContext';

const HeaderSectionsDisplay = () => {
    const { headerSections } = useContext(InvoiceContext);

    return (
        <div> 
            {headerSections.map((section, index) => (
                <div key={index} className={`p-4 text-${section.alignment}`}>
                    <h2 className="text-xl font-bold">{section.title}</h2>
                    <pre className="mt-2 whitespace-pre-wrap">{section.content}</pre>
                </div>
            ))}
        </div>
    );
};

export default HeaderSectionsDisplay;