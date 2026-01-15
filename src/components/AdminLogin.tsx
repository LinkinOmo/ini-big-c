import React, { useState } from 'react';
import { Lock } from 'lucide-react';

interface AdminLoginProps {
    onLogin: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (pin === '1234') {
            onLogin();
        } else {
            setError(true);
            setPin('');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm text-center">
                <div className="bg-bigc-red/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="text-bigc-red" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">เข้าสู่ระบบผู้ดูแล</h2>
                <p className="text-gray-500 mb-6">กรอกรหัส PIN เพื่อเข้าใช้งานแดชบอร์ด</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="password"
                        value={pin}
                        onChange={(e) => { setPin(e.target.value); setError(false); }}
                        className={`w-full text-center text-3xl tracking-[1em] py-3 border-2 rounded-lg outline-none transition-all ${error ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-bigc-green'}`}
                        maxLength={4}
                        placeholder="••••"
                        autoFocus
                    />
                    {error && <p className="text-red-500 text-sm">รหัส PIN ไม่ถูกต้อง</p>}

                    <button
                        type="submit"
                        className="w-full bg-bigc-green hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors shadow-md"
                    >
                        เข้าสู่ระบบ
                    </button>
                </form>
            </div>
        </div>
    );
};
