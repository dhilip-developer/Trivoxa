import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn, isAdmin } = useAuth();
    const navigate = useNavigate();

    // Redirect if already logged in
    React.useEffect(() => {
        if (isAdmin) {
            navigate('/admin/dashboard');
        }
    }, [isAdmin, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await signIn(email, password);

        if (result.success) {
            navigate('/admin/dashboard');
        } else {
            setError(result.error || 'Authentication failed');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(249,115,22,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

            {/* Login Card */}
            <div className="w-full max-w-md relative z-10">
                <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="relative">
                                <div className="absolute -inset-4 bg-orange-500/20 rounded-full blur-xl animate-pulse" />
                                <img
                                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Trivoxa%20Triangle-T4Igp0N8CleyCcUafkEQb6G2rIGwCv.png"
                                    alt="Trivoxa"
                                    className="w-16 h-16 relative z-10"
                                />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-wide">TRIVOXA</h1>
                        <p className="text-orange-500 text-xs font-mono tracking-widest mt-1">ADMIN_PANEL</p>
                    </div>

                    {/* Terminal-style header */}
                    <div className="flex items-center gap-2 mb-6 pb-3 border-b border-white/10">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="text-gray-600 font-mono text-xs ml-2">authentication_required</span>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 font-mono text-sm text-red-400">
                            [ ERROR ] {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-mono text-gray-500 mb-2">EMAIL</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-lg text-white font-mono text-sm focus:border-orange-500/50 focus:outline-none transition-colors"
                                placeholder="admin@trivoxa.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-gray-500 mb-2">PASSWORD</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-lg text-white font-mono text-sm focus:border-orange-500/50 focus:outline-none transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 font-mono text-sm transition-all hover:shadow-[0_0_30px_rgba(249,115,22,0.3)] mt-2"
                        >
                            {loading ? '[ AUTHENTICATING... ]' : '[ ACCESS_SYSTEM ]'}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 pt-4 border-t border-white/10 text-center">
                        <p className="text-gray-600 font-mono text-xs">
                            <span className="text-green-400">$</span> secure_connection_established
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
