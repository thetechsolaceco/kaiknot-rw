'use client';

import React, { useState } from 'react';

interface EmailData {
    _id: string;
    email: string;
    createdAt: string;
}

export default function AdminPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [emails, setEmails] = useState<EmailData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Check for existing session on mount
    React.useEffect(() => {
        fetchEmails();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                setIsLoggedIn(true);
                fetchEmails();
            } else {
                const data = await res.json();
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await fetch('/api/admin/logout', { method: 'POST' });
        setIsLoggedIn(false);
        setEmails([]);
        setUsername('');
        setPassword('');
    };

    const fetchEmails = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/emails');
            if (res.ok) {
                const data = await res.json();
                setEmails(data.data);
                setIsLoggedIn(true);
            } else if (res.status === 401) {
                setIsLoggedIn(false);
            } else {
                setError('Failed to fetch emails');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-zinc-900 p-8 rounded-lg border border-zinc-800">
                    <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-black border border-zinc-700 rounded p-2 focus:outline-none focus:border-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black border border-zinc-700 rounded p-2 focus:outline-none focus:border-white"
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-black font-bold py-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Email Signups</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-zinc-800 px-4 py-2 rounded hover:bg-zinc-700 transition-colors"
                    >
                        Logout
                    </button>
                </div>

                {loading && emails.length === 0 ? (
                    <p>Loading...</p>
                ) : (
                    <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-zinc-800 text-zinc-400">
                                <tr>
                                    <th className="p-4">Email</th>
                                    <th className="p-4">Date Subscribed</th>
                                </tr>
                            </thead>
                            <tbody>
                                {emails.map((email) => (
                                    <tr key={email._id} className="border-t border-zinc-800 hover:bg-zinc-800/50">
                                        <td className="p-4">{email.email}</td>
                                        <td className="p-4">
                                            {new Date(email.createdAt).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                                {emails.length === 0 && (
                                    <tr>
                                        <td colSpan={2} className="p-8 text-center text-zinc-500">
                                            No signups yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
