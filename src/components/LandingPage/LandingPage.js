import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/invoices-are-boring-logo-1.png';
import AuthModal from '../Auth/AuthModal';
import UserMenu from '../Auth/UserMenu';

// Example invoice preview component
const InvoicePreview = ({ variant = 'default' }) => {
    const variants = {
        default: {
            title: 'Invoice',
            from: 'Acme Design Co.',
            to: 'TechStart Inc.',
            items: [
                { desc: 'Brand Identity Package', rate: 2500, qty: 1 },
                { desc: 'Website Design (5 pages)', rate: 800, qty: 5 },
            ],
            color: 'blue'
        },
        freelancer: {
            title: 'Invoice #1024',
            from: 'Sarah Chen, Developer',
            to: 'GrowthLabs',
            items: [
                { desc: 'Frontend Development', rate: 95, qty: 40 },
                { desc: 'Code Review & QA', rate: 95, qty: 8 },
            ],
            color: 'purple'
        },
        consultant: {
            title: 'Consulting Invoice',
            from: 'Strategic Partners LLC',
            to: 'Fortune 500 Client',
            items: [
                { desc: 'Strategy Workshop', rate: 5000, qty: 1 },
                { desc: 'Executive Coaching', rate: 500, qty: 6 },
            ],
            color: 'emerald'
        }
    };

    const v = variants[variant];
    const total = v.items.reduce((sum, item) => sum + (item.rate * item.qty), 0);

    return (
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm transform hover:scale-105 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-gray-800">{v.title}</h3>
                <span className="text-xs text-gray-400">12/21/2025</span>
            </div>
            <div className="flex justify-between text-xs mb-4">
                <div>
                    <p className="text-gray-400 uppercase tracking-wider mb-1">From</p>
                    <p className="font-medium text-gray-700">{v.from}</p>
                </div>
                <div className="text-right">
                    <p className="text-gray-400 uppercase tracking-wider mb-1">Bill To</p>
                    <p className="font-medium text-gray-700">{v.to}</p>
                </div>
            </div>
            <div className="border-t border-gray-100 pt-3 space-y-2">
                {v.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-xs">
                        <span className="text-gray-600 truncate flex-1 mr-2">{item.desc}</span>
                        <span className="text-gray-800 font-medium">${(item.rate * item.qty).toLocaleString()}</span>
                    </div>
                ))}
            </div>
            <div className={`mt-4 pt-3 border-t-2 border-${v.color}-500 flex justify-between`}>
                <span className="font-semibold text-gray-700">Total</span>
                <span className={`font-bold text-${v.color}-600 text-lg`}>${total.toLocaleString()}</span>
            </div>
        </div>
    );
};

// Feature card component
const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 group">
        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
);

// Testimonial component
const Testimonial = ({ quote, author, role, avatar }) => (
    <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-2xl p-6">
        <div className="flex gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400">★</span>
            ))}
        </div>
        <p className="text-slate-300 italic mb-4">"{quote}"</p>
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                {avatar}
            </div>
            <div>
                <p className="text-white font-medium text-sm">{author}</p>
                <p className="text-slate-500 text-xs">{role}</p>
            </div>
        </div>
    </div>
);

const LandingPage = () => {
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState('login');

    const openAuth = (mode) => {
        setAuthMode(mode);
        setAuthModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-slate-900">
            {/* Navigation */}
            <nav className="w-full h-16 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800 fixed top-0 z-50 flex justify-between items-center px-4 sm:px-10 md:px-20 lg:px-40">
                <div className="flex items-center cursor-pointer">
                    <img src={logo} alt="Logo" className="h-10 mr-3 rounded-lg shadow-lg" />
                    <div className="flex flex-col">
                        <span className="font-bold text-lg text-white leading-tight">Invoices are</span>
                        <span className="font-bold text-lg text-blue-400 leading-tight">Boring</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link 
                        to="/editor"
                        className="hidden sm:block text-slate-300 hover:text-white transition-colors text-sm font-medium"
                    >
                        Try Free
                    </Link>
                    <a 
                        className='hidden sm:flex shadow-lg font-semibold rounded-lg py-2 px-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white cursor-pointer hover:from-pink-600 hover:to-rose-600 transition-all duration-300 text-sm items-center gap-2' 
                        href="https://www.buymeacoffee.com/jehrbear" 
                        target="_blank" 
                        rel="noopener noreferrer"
                    >
                        <span>❤️</span> Donate
                    </a>
                    <UserMenu onOpenAuth={openAuth} />
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 sm:px-10 md:px-20 lg:px-40">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left: Copy */}
                        <div>
                            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-1.5 mb-6">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                <span className="text-blue-400 text-sm font-medium">Free & Open Source</span>
                            </div>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                                Create beautiful invoices in{' '}
                                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                    seconds
                                </span>
                            </h1>
                            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                                Stop wasting time on invoicing. Our dead-simple editor lets you create 
                                professional invoices instantly—no signup required. Just build, export to PDF, 
                                and get paid.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link 
                                    to="/editor"
                                    className="inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-blue-500/40 hover:scale-105"
                                >
                                    Start Creating — It's Free
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Link>
                                <a 
                                    href="#features"
                                    className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3 px-8 rounded-xl border border-slate-700 transition-all duration-300"
                                >
                                    See Features
                                </a>
                            </div>
                            {/* Trust badges */}
                            <div className="mt-10 flex items-center gap-6 text-slate-500 text-sm">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    No signup required
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Export to PDF
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    100% free
                                </div>
                            </div>
                        </div>

                        {/* Right: Invoice previews */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl"></div>
                            <div className="relative grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <InvoicePreview variant="default" />
                                </div>
                                <div className="space-y-4 mt-8">
                                    <InvoicePreview variant="freelancer" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Logos/Social Proof Section */}
            <section className="py-12 border-y border-slate-800 bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-10 md:px-20 lg:px-40">
                    <p className="text-center text-slate-500 text-sm mb-8">Trusted by freelancers and small businesses worldwide</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50">
                        <span className="text-2xl font-bold text-slate-400">🎨 Designers</span>
                        <span className="text-2xl font-bold text-slate-400">💻 Developers</span>
                        <span className="text-2xl font-bold text-slate-400">📝 Writers</span>
                        <span className="text-2xl font-bold text-slate-400">📸 Photographers</span>
                        <span className="text-2xl font-bold text-slate-400">🎯 Consultants</span>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-4 sm:px-10 md:px-20 lg:px-40">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            Everything you need, nothing you don't
                        </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            We built the invoice tool we always wanted—powerful enough for any job, 
                            simple enough to use in seconds.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard 
                            icon="⚡"
                            title="Instant PDF Export"
                            description="One click to generate a professional PDF. No watermarks, no limits, no catch."
                        />
                        <FeatureCard 
                            icon="🎨"
                            title="Fully Customizable"
                            description="Add your logo, customize colors, adjust layouts. Make it yours."
                        />
                        <FeatureCard 
                            icon="📊"
                            title="Line Items & Discounts"
                            description="Add unlimited items with descriptions, rates, and quantities. Apply percentage or flat discounts."
                        />
                        <FeatureCard 
                            icon="💾"
                            title="Save & Reuse"
                            description="Create an account to save invoices, build templates, and speed up your workflow."
                        />
                        <FeatureCard 
                            icon="🔒"
                            title="Private & Secure"
                            description="Your data stays yours. We don't sell information or spam you with emails."
                        />
                        <FeatureCard 
                            icon="🌐"
                            title="Works Everywhere"
                            description="Browser-based and responsive. Create invoices on your phone, tablet, or desktop."
                        />
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 px-4 sm:px-10 md:px-20 lg:px-40 bg-slate-800/30">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            Three steps to getting paid
                        </h2>
                        <p className="text-slate-400">No learning curve. No tutorial needed.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4 shadow-lg shadow-blue-500/30">
                                1
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Fill in the details</h3>
                            <p className="text-slate-400 text-sm">Add your info, client details, and line items using our simple editor.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4 shadow-lg shadow-purple-500/30">
                                2
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Preview in real-time</h3>
                            <p className="text-slate-400 text-sm">See your invoice update instantly as you type. What you see is what you get.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4 shadow-lg shadow-emerald-500/30">
                                3
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Export & send</h3>
                            <p className="text-slate-400 text-sm">Download your PDF and send it to your client. Done in under a minute.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 px-4 sm:px-10 md:px-20 lg:px-40">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            Loved by people who hate invoicing
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        <Testimonial 
                            quote="Finally, an invoice tool that doesn't try to upsell me on accounting software I don't need. Just invoices. Beautiful."
                            author="Alex Rivera"
                            role="Freelance Designer"
                            avatar="A"
                        />
                        <Testimonial 
                            quote="I used to dread the end of the month. Now I knock out all my invoices in 10 minutes. This tool is a lifesaver."
                            author="Jordan Kim"
                            role="Web Developer"
                            avatar="J"
                        />
                        <Testimonial 
                            quote="The fact that it's free and has no watermarks is incredible. I've recommended it to everyone in my network."
                            author="Sam Patel"
                            role="Marketing Consultant"
                            avatar="S"
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 sm:px-10 md:px-20 lg:px-40">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
                        {/* Background decoration */}
                        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>
                        
                        <div className="relative">
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                                Ready to stop hating invoices?
                            </h2>
                            <p className="text-blue-100 mb-8 max-w-xl mx-auto">
                                Join thousands of freelancers and small businesses who've simplified their invoicing. 
                                No credit card, no commitment.
                            </p>
                            <Link 
                                to="/editor"
                                className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 font-semibold py-4 px-10 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                            >
                                Create Your First Invoice
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-800 py-12 px-4 sm:px-10 md:px-20 lg:px-40">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center">
                            <img src={logo} alt="Logo" className="h-8 mr-3 rounded-lg" />
                            <div className="flex flex-col">
                                <span className="font-bold text-white leading-tight">Invoices are</span>
                                <span className="font-bold text-blue-400 leading-tight">Boring</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 text-slate-400 text-sm">
                            <Link to="/editor" className="hover:text-white transition-colors">Editor</Link>
                            <a href="https://www.buymeacoffee.com/jehrbear" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Support</a>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
                        </div>
                        <p className="text-slate-500 text-sm">
                            Made with ☕ by someone who really hates invoicing
                        </p>
                    </div>
                </div>
            </footer>

            {/* Auth Modal */}
            <AuthModal 
                isOpen={authModalOpen} 
                onClose={() => setAuthModalOpen(false)} 
                initialMode={authMode}
            />
        </div>
    );
};

export default LandingPage;
