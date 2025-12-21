import React, { useContext } from 'react';
import InvoiceContext from '../../context/InvoiceContext';

const HeaderSectionsDisplay = () => {
    const { headerSections, invoiceMeta, logoUrl } = useContext(InvoiceContext);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit' 
        });
    };

    const getAlignmentClass = (alignment) => {
        switch (alignment) {
            case 'left': return 'text-left';
            case 'center': return 'text-center';
            case 'right': return 'text-right';
            default: return 'text-left';
        }
    };

    const getFlexAlignment = (alignment) => {
        switch (alignment) {
            case 'left': return 'justify-start';
            case 'center': return 'justify-center';
            case 'right': return 'justify-end';
            default: return 'justify-start';
        }
    };

    const hasBillFrom = invoiceMeta?.billFrom?.name || invoiceMeta?.billFrom?.address || invoiceMeta?.billFrom?.email;
    const hasBillTo = invoiceMeta?.billTo?.name || invoiceMeta?.billTo?.address || invoiceMeta?.billTo?.email;
    
    const detailsAlignment = invoiceMeta?.detailsAlignment || 'left';
    const billFromAlignment = invoiceMeta?.billFrom?.alignment || 'left';
    const billToAlignment = invoiceMeta?.billTo?.alignment || 'right';
    const logoAlignment = invoiceMeta?.logoAlignment || 'left';
    const headerLayout = invoiceMeta?.headerLayout || 'side-by-side';

    const getLayoutClasses = () => {
        switch (headerLayout) {
            case 'stacked':
                return 'flex flex-col gap-6';
            case 'stacked-left':
                return 'flex flex-col gap-6';
            case 'side-by-side':
            default:
                return 'flex justify-between gap-8';
        }
    };

    const getBillSectionClasses = (type) => {
        if (headerLayout === 'stacked-left') {
            return 'text-left';
        }
        if (headerLayout === 'stacked') {
            return getAlignmentClass(type === 'from' ? billFromAlignment : billToAlignment);
        }
        // side-by-side
        return `flex-1 ${getAlignmentClass(type === 'from' ? billFromAlignment : billToAlignment)}`;
    };

    return (
        <div>
            {/* Logo */}
            {logoUrl && (
                <div className={`px-4 pt-4 ${getAlignmentClass(logoAlignment)}`}>
                    <img 
                        src={logoUrl} 
                        alt="Company Logo" 
                        className="max-h-16 max-w-[200px] object-contain inline-block"
                    />
                </div>
            )}

            {/* Invoice Meta Row: Date & Invoice Number */}
            {(invoiceMeta?.date || invoiceMeta?.invoiceNumber) && (
                <div className={`flex ${getFlexAlignment(detailsAlignment)} gap-6 px-4 py-2 text-sm text-gray-600`}>
                    {invoiceMeta?.invoiceNumber && (
                        <div>
                            <span className="font-medium">Invoice #:</span> {invoiceMeta.invoiceNumber}
                        </div>
                    )}
                    {invoiceMeta?.date && (
                        <div>
                            <span className="font-medium">Date:</span> {formatDate(invoiceMeta.date)}
                        </div>
                    )}
                </div>
            )}

            {/* Bill From / Bill To */}
            {(hasBillFrom || hasBillTo) && (
                <div className={`px-4 py-4 ${getLayoutClasses()}`}>
                    {/* Bill From */}
                    {hasBillFrom && (
                        <div className={getBillSectionClasses('from')}>
                            <h3 className="text-xs uppercase text-gray-500 font-semibold mb-2 tracking-wider">From</h3>
                            {invoiceMeta.billFrom.name && (
                                <p className="font-semibold text-gray-800">{invoiceMeta.billFrom.name}</p>
                            )}
                            {invoiceMeta.billFrom.address && (
                                <p className="text-sm text-gray-600 whitespace-pre-line">{invoiceMeta.billFrom.address}</p>
                            )}
                            {invoiceMeta.billFrom.email && (
                                <p className="text-sm text-gray-600">{invoiceMeta.billFrom.email}</p>
                            )}
                        </div>
                    )}
                    
                    {/* Bill To */}
                    {hasBillTo && (
                        <div className={getBillSectionClasses('to')}>
                            <h3 className="text-xs uppercase text-gray-500 font-semibold mb-2 tracking-wider">Bill To</h3>
                            {invoiceMeta.billTo.name && (
                                <p className="font-semibold text-gray-800">{invoiceMeta.billTo.name}</p>
                            )}
                            {invoiceMeta.billTo.address && (
                                <p className="text-sm text-gray-600 whitespace-pre-line">{invoiceMeta.billTo.address}</p>
                            )}
                            {invoiceMeta.billTo.email && (
                                <p className="text-sm text-gray-600">{invoiceMeta.billTo.email}</p>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Custom Header Sections */}
            {headerSections.map((section, index) => (
                <div key={index} className={'p-4 text-' + section.alignment}>
                    <h2 className="text-xl font-bold">{section.title}</h2>
                    <pre className="mt-2 whitespace-pre-wrap">{section.content}</pre>
                </div>
            ))}
        </div>
    );
};

export default HeaderSectionsDisplay;