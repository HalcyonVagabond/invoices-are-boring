import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { logoService } from '../../services/dataService';

const LogoUpload = ({ currentLogo, onLogoChange, onOpenAuth }) => {
    const { user, isPremium } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(currentLogo || null);
    const fileInputRef = useRef(null);

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('Image must be smaller than 2MB');
            return;
        }

        // Show preview immediately
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewUrl(e.target.result);
        };
        reader.readAsDataURL(file);

        // If user is premium and logged in, upload to Supabase
        if (user && isPremium) {
            setUploading(true);
            try {
                const { data, error } = await logoService.upload(file);
                if (error) throw error;
                onLogoChange(data.url);
            } catch (err) {
                console.error('Error uploading logo:', err);
                alert('Failed to upload logo: ' + err.message);
            } finally {
                setUploading(false);
            }
        } else {
            // For non-premium users, just use the local preview (won't persist)
            onLogoChange(previewUrl);
        }
    };

    const handleRemoveLogo = () => {
        setPreviewUrl(null);
        onLogoChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Not logged in
    if (!user) {
        return (
            <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-700 flex items-center justify-center">
                    <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <p className="text-slate-400 text-sm mb-3">Sign in to add your logo</p>
                <button
                    onClick={() => onOpenAuth('signup')}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                >
                    Get Started Free →
                </button>
            </div>
        );
    }

    // Not premium
    if (!isPremium) {
        return (
            <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                </div>
                <p className="text-slate-300 text-sm font-medium mb-1">Premium Feature</p>
                <p className="text-slate-400 text-xs mb-3">Upload your logo with Pro</p>
                <a
                    href="/pricing"
                    className="inline-block px-4 py-2 bg-yellow-500/20 text-yellow-400 text-sm font-medium rounded-lg hover:bg-yellow-500/30 transition-colors"
                >
                    Upgrade to Pro
                </a>
            </div>
        );
    }

    return (
        <div className="w-full">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />
            
            {previewUrl ? (
                <div className="relative">
                    <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                        <img 
                            src={previewUrl} 
                            alt="Logo preview" 
                            className="max-h-24 max-w-full mx-auto object-contain"
                        />
                    </div>
                    <div className="flex gap-2 mt-3">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="flex-1 py-2 px-3 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                        >
                            {uploading ? 'Uploading...' : 'Change'}
                        </button>
                        <button
                            onClick={handleRemoveLogo}
                            disabled={uploading}
                            className="py-2 px-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full p-6 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg border-2 border-dashed border-slate-600 hover:border-slate-500 transition-colors cursor-pointer disabled:opacity-50"
                >
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center mb-3">
                            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <p className="text-slate-300 text-sm font-medium mb-1">
                            {uploading ? 'Uploading...' : 'Upload Logo'}
                        </p>
                        <p className="text-slate-500 text-xs">PNG, JPG up to 2MB</p>
                    </div>
                </button>
            )}
        </div>
    );
};

export default LogoUpload;
