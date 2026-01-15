import React from 'react';
import { Wrench, ShieldCheck, User } from 'lucide-react';

interface NavbarProps {
    currentView: 'user' | 'admin';
    onViewChange: (view: 'user' | 'admin') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onViewChange }) => {
    return (
        <nav className="bg-bigc-green text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center md:max-w-4xl">
                <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onViewChange('user')}>
                    <div className="bg-white p-1.5 rounded-full text-bigc-green">
                        <Wrench size={20} />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight">Mini Big C</h1>
                        <p className="text-xs text-white/90">ระบบแจ้งซ่อม</p>
                    </div>
                </div>

                <div className="flex space-x-2">
                    <button
                        onClick={() => onViewChange('user')}
                        className={`p-2 rounded-lg transition-colors ${currentView === 'user' ? 'bg-white/20' : 'hover:bg-white/10'}`}
                        title="สำหรับพนักงานสาขา"
                    >
                        <User size={20} />
                    </button>
                    <button
                        onClick={() => onViewChange('admin')}
                        className={`p-2 rounded-lg transition-colors ${currentView === 'admin' ? 'bg-white/20' : 'hover:bg-white/10'}`}
                        title="สำหรับผู้ดูแลระบบ"
                    >
                        <ShieldCheck size={20} />
                    </button>
                </div>
            </div>
        </nav>
    );
};
