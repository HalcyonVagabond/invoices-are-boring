import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { invoiceService, templateService } from '../../services/dataService';

const SaveInvoicePanel = ({ invoiceState, onLoadInvoice, onOpenAuth }) => {
    const { user, isPremium } = useAuth();
    const [savedInvoices, setSavedInvoices] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('invoices');
    const [saveName, setSaveName] = useState('');
    const [saveModalOpen, setSaveModalOpen] = useState(false);
    const [saveType, setSaveType] = useState('invoice'); // 'invoice' or 'template'

    useEffect(() => {
        if (user) {
            loadData();
        }
    }, [user]);

    const loadData = async () => {
        setLoading(true);
        const [invoicesRes, templatesRes] = await Promise.all([
            invoiceService.getAll(),
            templateService.getAll()
        ]);
        if (invoicesRes.data) setSavedInvoices(invoicesRes.data);
        if (templatesRes.data) setTemplates(templatesRes.data);
        setLoading(false);
    };

    const handleSave = async () => {
        if (!saveName.trim()) return;
        setSaving(true);

        try {
            if (saveType === 'invoice') {
                const formattedData = invoiceService.formatForSave(invoiceState);
                formattedData.title = saveName;
                const { error } = await invoiceService.create(formattedData);
                if (error) throw error;
            } else {
                const formattedData = invoiceService.formatForSave(invoiceState);
                const templateData = {
                    name: saveName,
                    title: formattedData.title,
                    from_name: formattedData.from_name,
                    from_email: formattedData.from_email,
                    from_phone: formattedData.from_phone,
                    from_address: formattedData.from_address,
                    line_items: formattedData.line_items,
                    taxes: formattedData.taxes,
                    discounts: formattedData.discounts,
                    custom_headers: formattedData.custom_headers,
                    notes: formattedData.notes,
                    logo_url: formattedData.logo_url,
                    currency: formattedData.currency
                };
                const { error } = await templateService.create(templateData);
                if (error) throw error;
            }
            
            setSaveModalOpen(false);
            setSaveName('');
            loadData();
        } catch (err) {
            console.error('Error saving:', err);
            alert('Failed to save: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleLoadInvoice = async (invoice) => {
        const editorState = invoiceService.formatForEditor(invoice);
        onLoadInvoice(editorState);
    };

    const handleLoadTemplate = async (template) => {
        const editorState = {
            invoiceTitle: template.title,
            fromName: template.from_name,
            fromEmail: template.from_email,
            fromPhone: template.from_phone,
            fromAddress: template.from_address,
            invoiceItems: template.line_items || [],
            taxes: template.taxes || [],
            discounts: template.discounts || [],
            customHeaders: template.custom_headers || [],
            notes: template.notes,
            currency: template.currency,
            logoUrl: template.logo_url
        };
        onLoadInvoice(editorState);
    };

    const handleDelete = async (id, type) => {
        if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
        
        if (type === 'invoice') {
            await invoiceService.delete(id);
        } else {
            await templateService.delete(id);
        }
        loadData();
    };

    // Not logged in state
    if (!user) {
        return (
            <div className="w-full text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-700 flex items-center justify-center">
                    <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h3 className="text-slate-200 font-semibold mb-2">Sign in to Save</h3>
                <p className="text-slate-400 text-sm mb-4">
                    Create an account to save invoices, manage clients, and use templates.
                </p>
                <button
                    onClick={() => onOpenAuth('signup')}
                    className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
                >
                    Get Started Free
                </button>
            </div>
        );
    }

    return (
        <div className="w-full h-full overflow-auto">
            {/* Header with save buttons */}
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => { setSaveType('invoice'); setSaveModalOpen(true); setSaveName(invoiceState.invoiceTitle || 'Untitled Invoice'); }}
                    className="flex-1 py-2.5 px-3 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    Save Invoice
                </button>
                {isPremium && (
                    <button
                        onClick={() => { setSaveType('template'); setSaveModalOpen(true); setSaveName(''); }}
                        className="py-2.5 px-3 bg-slate-600 hover:bg-slate-500 text-slate-200 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                        </svg>
                        Template
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-600 mb-4">
                <button
                    onClick={() => setActiveTab('invoices')}
                    className={`flex-1 py-2 text-sm font-medium transition-colors ${
                        activeTab === 'invoices'
                            ? 'text-blue-400 border-b-2 border-blue-400'
                            : 'text-slate-400 hover:text-slate-300'
                    }`}
                >
                    Invoices ({savedInvoices.length})
                </button>
                <button
                    onClick={() => setActiveTab('templates')}
                    className={`flex-1 py-2 text-sm font-medium transition-colors ${
                        activeTab === 'templates'
                            ? 'text-blue-400 border-b-2 border-blue-400'
                            : 'text-slate-400 hover:text-slate-300'
                    }`}
                >
                    Templates ({templates.length})
                </button>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex items-center justify-center py-8">
                    <svg className="animate-spin w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                </div>
            ) : (
                <div className="space-y-2">
                    {activeTab === 'invoices' && (
                        savedInvoices.length === 0 ? (
                            <div className="text-center py-6 text-slate-400 text-sm">
                                No saved invoices yet
                            </div>
                        ) : (
                            savedInvoices.map((invoice) => (
                                <div
                                    key={invoice.id}
                                    className="p-3 bg-slate-700/50 rounded-lg border border-slate-600/50 hover:border-slate-500 transition-colors group"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-slate-200 font-medium truncate">{invoice.title}</h4>
                                            <p className="text-slate-400 text-xs mt-0.5">
                                                {new Date(invoice.created_at).toLocaleDateString()}
                                                {invoice.total > 0 && ` • $${invoice.total.toFixed(2)}`}
                                            </p>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleLoadInvoice(invoice)}
                                                className="p-1.5 text-slate-400 hover:text-blue-400 transition-colors"
                                                title="Load"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(invoice.id, 'invoice')}
                                                className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                                                title="Delete"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )
                    )}

                    {activeTab === 'templates' && (
                        !isPremium ? (
                            <div className="text-center py-6">
                                <p className="text-slate-400 text-sm mb-3">Templates are a premium feature</p>
                                <a href="/pricing" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                                    Upgrade to Pro →
                                </a>
                            </div>
                        ) : templates.length === 0 ? (
                            <div className="text-center py-6 text-slate-400 text-sm">
                                No templates yet
                            </div>
                        ) : (
                            templates.map((template) => (
                                <div
                                    key={template.id}
                                    className="p-3 bg-slate-700/50 rounded-lg border border-slate-600/50 hover:border-slate-500 transition-colors group"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-slate-200 font-medium truncate">{template.name}</h4>
                                            <p className="text-slate-400 text-xs mt-0.5">
                                                {template.description || 'No description'}
                                            </p>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleLoadTemplate(template)}
                                                className="p-1.5 text-slate-400 hover:text-blue-400 transition-colors"
                                                title="Use template"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(template.id, 'template')}
                                                className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                                                title="Delete"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )
                    )}
                </div>
            )}

            {/* Save Modal */}
            {saveModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 rounded-xl shadow-2xl max-w-sm w-full border border-slate-700 p-6">
                        <h3 className="text-lg font-semibold text-slate-200 mb-4">
                            Save {saveType === 'invoice' ? 'Invoice' : 'Template'}
                        </h3>
                        <input
                            type="text"
                            value={saveName}
                            onChange={(e) => setSaveName(e.target.value)}
                            placeholder={saveType === 'invoice' ? 'Invoice name' : 'Template name'}
                            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                            autoFocus
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => setSaveModalOpen(false)}
                                className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving || !saveName.trim()}
                                className="flex-1 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SaveInvoicePanel;
