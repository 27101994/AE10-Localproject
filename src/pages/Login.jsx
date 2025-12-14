import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import Button from '@components/Button';

export default function Login() {
    const navigate = useNavigate();
    const { login, loginAsGuest } = useAuthStore();

    const [mode, setMode] = useState('login'); // 'login' or 'otp'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // Simulate login
        login({ name: email.split('@')[0], email });
        navigate('/dashboard');
    };

    const handleOTPVerify = (e) => {
        e.preventDefault();
        // Simulate OTP verification
        login({ name: email.split('@')[0], email });
        navigate('/dashboard');
    };

    const handleGuestLogin = () => {
        loginAsGuest();
        navigate('/dashboard');
    };

    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-dark-text mb-6 text-center">
                {mode === 'login' ? 'Welcome Back' : 'Verify OTP'}
            </h2>

            {mode === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-dark-muted mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="glass-input w-full"
                            placeholder="shooter@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-muted mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="glass-input w-full"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full mt-6">
                        Login
                    </Button>

                    <button
                        type="button"
                        onClick={() => setMode('otp')}
                        className="w-full text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 
                                   transition-all duration-200 hover:underline"
                    >
                        Login with OTP instead
                    </button>
                </form>
            ) : (
                <form onSubmit={handleOTPVerify} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-dark-muted mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="glass-input w-full"
                            placeholder="shooter@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-muted mb-2">
                            OTP Code
                        </label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="glass-input w-full text-center text-2xl tracking-widest font-bold"
                            placeholder="000000"
                            maxLength={6}
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full mt-6">
                        Verify OTP
                    </Button>

                    <button
                        type="button"
                        onClick={() => setMode('login')}
                        className="w-full text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 
                                   transition-all duration-200 hover:underline"
                    >
                        Back to password login
                    </button>
                </form>
            )}

            <div className="mt-6 pt-6 border-t border-dark-border">
                <Button
                    variant="secondary"
                    onClick={handleGuestLogin}
                    className="w-full"
                >
                    Continue as Guest
                </Button>
            </div>
        </div>
    );
}
