import React, { useState } from 'react';
import { Send, AlertCircle, Camera } from 'lucide-react';
import { createTicket } from '../lib/mockData';
import type { TicketCategory, UrgencyLevel } from '../types';

interface RequestFormProps {
    onSuccess?: () => void;
}

export const RequestForm: React.FC<RequestFormProps> = ({ onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<{ name: string, data: string, type: string } | null>(null);
    const [formData, setFormData] = useState({
        storeID: '',
        requesterName: '',
        category: 'แอร์/ความเย็น' as TicketCategory,
        urgency: 'ปานกลาง' as UrgencyLevel,
        description: '',
        photoURL: ''
    });
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Simple size check (e.g. max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert("ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 2MB)");
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                const base64String = event.target?.result as string;
                // Split to get just the data
                // "data:image/jpeg;base64,....."
                const base64Data = base64String.split(',')[1];

                setSelectedFile({
                    name: file.name,
                    type: file.type,
                    data: base64Data
                });
                // Also set photoURL for preview if needed, though we use state
                setFormData(prev => ({ ...prev, photoURL: base64String }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setFeedback(null);

        try {
            if (!formData.storeID || !formData.requesterName || !formData.description) {
                throw new Error("กรุณากรอกข้อมูลให้ครบถ้วน");
            }

            const payload = {
                ...formData,
                fileData: selectedFile?.data,
                fileName: selectedFile?.name,
                mimeType: selectedFile?.type,
                // If file selected, send empty photoURL to avoid confusion, or keep it if it was a manual link
                photoURL: selectedFile ? '' : formData.photoURL
            };

            await createTicket(payload);
            setFeedback({ type: 'success', message: 'ส่งใบแจ้งซ่อมเรียบร้อยแล้ว!' });
            setFormData({
                storeID: '',
                requesterName: '',
                category: 'แอร์/ความเย็น',
                urgency: 'ปานกลาง',
                description: '',
                photoURL: ''
            });
            setSelectedFile(null);
            if (onSuccess) onSuccess();
        } catch (err: any) {
            setFeedback({ type: 'error', message: err.message || 'เกิดข้อผิดพลาดในการส่งข้อมูล' });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4">
            <div className="bg-bigc-green/10 p-4 border-b border-bigc-green/20">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <AlertCircle className="text-bigc-green" />
                    แจ้งปัญหาการซ่อม
                </h2>
                <p className="text-sm text-gray-600">กรอกข้อมูลเพื่อแจ้งปัญหาในสาขาของคุณ</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {feedback && (
                    <div className={`p-3 rounded-lg text-sm ${feedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {feedback.message}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">รหัสสาขา *</label>
                        <input
                            type="number"
                            name="storeID"
                            value={formData.storeID}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bigc-green focus:border-transparent outline-none transition-all"
                            placeholder="เช่น 101"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อผู้แจ้ง *</label>
                        <input
                            type="text"
                            name="requesterName"
                            value={formData.requesterName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bigc-green focus:border-transparent outline-none transition-all"
                            placeholder="ชื่อของคุณ"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">หมวดหมู่</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bigc-green outline-none bg-white"
                        >
                            <option value="แอร์/ความเย็น">แอร์/ความเย็น</option>
                            <option value="ไฟฟ้า">ไฟฟ้า</option>
                            <option value="ประปา">ประปา</option>
                            <option value="โครงสร้าง/โยธา">โครงสร้าง/โยธา</option>
                            <option value="อุปกรณ์">อุปกรณ์</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ความเร่งด่วน</label>
                        <select
                            name="urgency"
                            value={formData.urgency}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 outline-none bg-white font-medium ${formData.urgency === 'ด่วนมาก' ? 'text-red-600 focus:ring-red-500' :
                                formData.urgency === 'ปานกลาง' ? 'text-orange-600 focus:ring-orange-500' :
                                    'text-green-600 focus:ring-green-500'
                                }`}
                        >
                            <option value="ปกติ">ปกติ</option>
                            <option value="ปานกลาง">ปานกลาง</option>
                            <option value="ด่วนมาก">ด่วนมาก</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียดปัญหา *</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bigc-green focus:border-transparent outline-none transition-all resize-none"
                        placeholder="อธิบายปัญหาที่พบ..."
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                        <Camera size={16} /> แนบรูปภาพ (สูงสุด 2MB)
                    </label>
                    <div className="space-y-2">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-bigc-green/10 file:text-bigc-green
                                hover:file:bg-bigc-green/20
                                cursor-pointer
                            "
                        />
                        {formData.photoURL && (
                            <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                <img src={formData.photoURL} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-bigc-green hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <Send size={20} /> ส่งใบแจ้งซ่อม
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};
