import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [subscription, setSubscription] = useState(null);

    useEffect(() => {
        if (!supabase) {
            setLoading(false);
            return;
        }

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchSubscription(session.user.id);
            }
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
                if (session?.user) {
                    fetchSubscription(session.user.id);
                } else {
                    setSubscription(null);
                }
                setLoading(false);
            }
        );

        return () => {
            authSubscription?.unsubscribe();
        };
    }, []);

    const fetchSubscription = async (userId) => {
        if (!supabase) return;
        
        try {
            const { data, error } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('user_id', userId)
                .single();
            
            if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
                console.error('Error fetching subscription:', error);
            }
            setSubscription(data || null);
        } catch (error) {
            console.error('Error fetching subscription:', error);
        }
    };

    const signUp = async (email, password, metadata = {}) => {
        if (!supabase) {
            return { error: { message: 'Supabase not configured' } };
        }
        
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: metadata
            }
        });
        return { data, error };
    };

    const signIn = async (email, password) => {
        if (!supabase) {
            return { error: { message: 'Supabase not configured' } };
        }
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        return { data, error };
    };

    const signInWithGoogle = async () => {
        if (!supabase) {
            return { error: { message: 'Supabase not configured' } };
        }
        
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });
        return { data, error };
    };

    const signOut = async () => {
        if (!supabase) {
            return { error: { message: 'Supabase not configured' } };
        }
        
        const { error } = await supabase.auth.signOut();
        setUser(null);
        setSession(null);
        setSubscription(null);
        return { error };
    };

    const resetPassword = async (email) => {
        if (!supabase) {
            return { error: { message: 'Supabase not configured' } };
        }
        
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`
        });
        return { data, error };
    };

    const isPremium = () => {
        return subscription?.status === 'active' || subscription?.status === 'trialing';
    };

    const value = {
        user,
        session,
        loading,
        subscription,
        isPremium: isPremium(),
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        resetPassword,
        refreshSubscription: () => user && fetchSubscription(user.id)
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
