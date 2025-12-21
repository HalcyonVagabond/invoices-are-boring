import { supabase } from '../lib/supabase';

// Invoice CRUD operations
export const invoiceService = {
    // Get all invoices for the current user
    async getAll() {
        if (!supabase) return { data: null, error: { message: 'Supabase not configured' } };
        
        const { data, error } = await supabase
            .from('invoices')
            .select('*')
            .order('created_at', { ascending: false });
        
        return { data, error };
    },

    // Get a single invoice by ID
    async getById(id) {
        if (!supabase) return { data: null, error: { message: 'Supabase not configured' } };
        
        const { data, error } = await supabase
            .from('invoices')
            .select('*')
            .eq('id', id)
            .single();
        
        return { data, error };
    },

    // Create a new invoice
    async create(invoiceData) {
        if (!supabase) return { data: null, error: { message: 'Supabase not configured' } };
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { message: 'Not authenticated' } };

        const { data, error } = await supabase
            .from('invoices')
            .insert({
                user_id: user.id,
                ...invoiceData
            })
            .select()
            .single();
        
        return { data, error };
    },

    // Update an existing invoice
    async update(id, invoiceData) {
        if (!supabase) return { data: null, error: { message: 'Supabase not configured' } };
        
        const { data, error } = await supabase
            .from('invoices')
            .update(invoiceData)
            .eq('id', id)
            .select()
            .single();
        
        return { data, error };
    },

    // Delete an invoice
    async delete(id) {
        if (!supabase) return { data: null, error: { message: 'Supabase not configured' } };
        
        const { error } = await supabase
            .from('invoices')
            .delete()
            .eq('id', id);
        
        return { error };
    },

    // Convert current editor state to saveable format
    formatForSave(state) {
        return {
            title: state.invoiceTitle || 'Invoice',
            invoice_number: state.invoiceNumber || '',
            invoice_date: state.invoiceDate || null,
            due_date: state.dueDate || null,
            from_name: state.fromName || '',
            from_email: state.fromEmail || '',
            from_phone: state.fromPhone || '',
            from_address: state.fromAddress || '',
            to_name: state.toName || '',
            to_email: state.toEmail || '',
            to_phone: state.toPhone || '',
            to_address: state.toAddress || '',
            line_items: state.invoiceItems || [],
            taxes: state.taxes || [],
            discounts: state.discounts || [],
            custom_headers: state.customHeaders || [],
            subtotal: state.subtotal || 0,
            total_tax: state.totalTax || 0,
            total_discount: state.totalDiscount || 0,
            total: state.total || 0,
            notes: state.notes || '',
            currency: state.currency || 'USD',
            logo_url: state.logoUrl || null
        };
    },

    // Convert saved invoice to editor state format
    formatForEditor(invoice) {
        return {
            invoiceTitle: invoice.title,
            invoiceNumber: invoice.invoice_number,
            invoiceDate: invoice.invoice_date,
            dueDate: invoice.due_date,
            fromName: invoice.from_name,
            fromEmail: invoice.from_email,
            fromPhone: invoice.from_phone,
            fromAddress: invoice.from_address,
            toName: invoice.to_name,
            toEmail: invoice.to_email,
            toPhone: invoice.to_phone,
            toAddress: invoice.to_address,
            invoiceItems: invoice.line_items || [],
            taxes: invoice.taxes || [],
            discounts: invoice.discounts || [],
            customHeaders: invoice.custom_headers || [],
            notes: invoice.notes,
            currency: invoice.currency,
            logoUrl: invoice.logo_url
        };
    }
};

// Client CRUD operations
export const clientService = {
    async getAll() {
        if (!supabase) return { data: null, error: { message: 'Supabase not configured' } };
        
        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .order('name', { ascending: true });
        
        return { data, error };
    },

    async create(clientData) {
        if (!supabase) return { data: null, error: { message: 'Supabase not configured' } };
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { message: 'Not authenticated' } };

        const { data, error } = await supabase
            .from('clients')
            .insert({
                user_id: user.id,
                ...clientData
            })
            .select()
            .single();
        
        return { data, error };
    },

    async update(id, clientData) {
        if (!supabase) return { data: null, error: { message: 'Supabase not configured' } };
        
        const { data, error } = await supabase
            .from('clients')
            .update(clientData)
            .eq('id', id)
            .select()
            .single();
        
        return { data, error };
    },

    async delete(id) {
        if (!supabase) return { data: null, error: { message: 'Supabase not configured' } };
        
        const { error } = await supabase
            .from('clients')
            .delete()
            .eq('id', id);
        
        return { error };
    }
};

// Organization CRUD operations
export const organizationService = {
    async getAll() {
        if (!supabase) return { data: null, error: { message: 'Supabase not configured' } };
        
        const { data, error } = await supabase
            .from('organizations')
            .select('*')
            .order('name', { ascending: true });
        
        return { data, error };
    },

    async create(orgData) {
        if (!supabase) return { data: null, error: { message: 'Supabase not configured' } };
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { message: 'Not authenticated' } };

        const { data, error } = await supabase
            .from('organizations')
            .insert({
                user_id: user.id,
                ...orgData
            })
            .select()
            .single();
        
        return { data, error };
    },

    async update(id, orgData) {
        if (!supabase) return { data: null, error: { message: 'Supabase not configured' } };
        
        const { data, error } = await supabase
            .from('organizations')
            .update(orgData)
            .eq('id', id)
            .select()
            .single();
        
        return { data, error };
    },

    async delete(id) {
        if (!supabase) return { data: null, error: { message: 'Supabase not configured' } };
        
        const { error } = await supabase
            .from('organizations')
            .delete()
            .eq('id', id);
        
        return { error };
    }
};

// Template CRUD operations
export const templateService = {
    async getAll() {
        if (!supabase) return { data: null, error: { message: 'Supabase not configured' } };
        
        const { data, error } = await supabase
            .from('invoice_templates')
            .select('*')
            .order('name', { ascending: true });
        
        return { data, error };
    },

    async getById(id) {
        if (!supabase) return { data: null, error: { message: 'Supabase not configured' } };
        
        const { data, error } = await supabase
            .from('invoice_templates')
            .select('*')
            .eq('id', id)
            .single();
        
        return { data, error };
    },

    async create(templateData) {
        if (!supabase) return { data: null, error: { message: 'Supabase not configured' } };
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { message: 'Not authenticated' } };

        const { data, error } = await supabase
            .from('invoice_templates')
            .insert({
                user_id: user.id,
                ...templateData
            })
            .select()
            .single();
        
        return { data, error };
    },

    async update(id, templateData) {
        if (!supabase) return { data: null, error: { message: 'Supabase not configured' } };
        
        const { data, error } = await supabase
            .from('invoice_templates')
            .update(templateData)
            .eq('id', id)
            .select()
            .single();
        
        return { data, error };
    },

    async delete(id) {
        if (!supabase) return { data: null, error: { message: 'Supabase not configured' } };
        
        const { error } = await supabase
            .from('invoice_templates')
            .delete()
            .eq('id', id);
        
        return { error };
    }
};

// Logo upload service
export const logoService = {
    async upload(file) {
        if (!supabase) return { data: null, error: { message: 'Supabase not configured' } };
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { message: 'Not authenticated' } };

        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        const { error } = await supabase.storage
            .from('logos')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: true
            });

        if (error) return { data: null, error };

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('logos')
            .getPublicUrl(fileName);

        return { data: { path: fileName, url: urlData.publicUrl }, error: null };
    },

    async delete(path) {
        if (!supabase) return { error: { message: 'Supabase not configured' } };
        
        const { error } = await supabase.storage
            .from('logos')
            .remove([path]);
        
        return { error };
    }
};
