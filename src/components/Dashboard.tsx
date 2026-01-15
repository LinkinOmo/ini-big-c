import React, { useEffect, useState } from 'react';
import { getTickets, updateTicketStatus } from '../lib/mockData';
import type { Ticket, TicketStatus } from '../types';
import { CheckCircle, Clock, AlertTriangle, RefreshCw, Filter, Camera } from 'lucide-react';

export const Dashboard: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'All' | TicketStatus>('All');

    const fetchData = async () => {
        setLoading(true);
        const data = await getTickets();
        setTickets(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleStatusUpdate = async (ticketID: string, currentStatus: TicketStatus) => {
        const nextStatus: TicketStatus =
            currentStatus === 'รอการแก้ไข' ? 'กำลังดำเนินการ' :
                currentStatus === 'กำลังดำเนินการ' ? 'เสร็จสิ้น' : 'เสร็จสิ้น';

        if (nextStatus === currentStatus) return;

        // Optimistic update
        setTickets(prev => prev.map(t => t.ticketID === ticketID ? { ...t, status: nextStatus } : t));

        await updateTicketStatus(ticketID, nextStatus);
        // In real app, re-fetch or confirm
    };

    const metrics = {
        total: tickets.length,
        pending: tickets.filter(t => t.status === 'รอการแก้ไข').length,
        inProgress: tickets.filter(t => t.status === 'กำลังดำเนินการ').length,
        completed: tickets.filter(t => t.status === 'เสร็จสิ้น').length,
    };

    const filteredTickets = filter === 'All' ? tickets : tickets.filter(t => t.status === filter);

    if (loading) return <div className="p-8 text-center text-gray-500">กำลังโหลดข้อมูล...</div>;

    return (
        <div className="p-4 md:p-6 max-w-6xl mx-auto">
            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-gray-500">
                    <p className="text-gray-500 text-sm">ใบงานทั้งหมด</p>
                    <p className="text-2xl font-bold">{metrics.total}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-yellow-500">
                    <p className="text-gray-500 text-sm">รอการแก้ไข</p>
                    <p className="text-2xl font-bold text-yellow-600">{metrics.pending}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500">
                    <p className="text-gray-500 text-sm">กำลังดำเนินการ</p>
                    <p className="text-2xl font-bold text-blue-600">{metrics.inProgress}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500">
                    <p className="text-gray-500 text-sm">เสร็จสิ้น</p>
                    <p className="text-2xl font-bold text-green-600">{metrics.completed}</p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                <h2 className="text-xl font-bold text-gray-800">จัดการใบแจ้งซ่อม</h2>
                <div className="flex gap-2">
                    <button onClick={fetchData} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-600">
                        <RefreshCw size={20} />
                    </button>
                    <div className="relative flex items-center">
                        <Filter size={16} className="absolute left-3 text-gray-500" />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value as any)}
                            className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-bigc-green text-sm"
                        >
                            <option value="All">สถานะทั้งหมด</option>
                            <option value="รอการแก้ไข">รอการแก้ไข</option>
                            <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
                            <option value="เสร็จสิ้น">เสร็จสิ้น</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
                            <tr>
                                <th className="p-4 font-medium">เลขที่</th>
                                <th className="p-4 font-medium">สาขา</th>
                                <th className="p-4 font-medium">ปัญหา</th>
                                <th className="p-4 font-medium">หมวดหมู่</th>
                                <th className="p-4 font-medium">สถานะ</th>
                                <th className="p-4 font-medium">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredTickets.map(ticket => (
                                <tr key={ticket.ticketID} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium text-gray-900">{ticket.ticketID}</td>
                                    <td className="p-4 text-gray-600">#{ticket.storeID}</td>
                                    <td className="p-4">
                                        <div className="font-medium text-gray-900">{ticket.description}</div>
                                        <div className="text-xs text-gray-500 mb-1">{new Date(ticket.timestamp).toLocaleDateString('th-TH')} • {ticket.requesterName}</div>
                                        {ticket.photoURL && (
                                            <a href={ticket.photoURL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-bigc-green hover:underline">
                                                <Camera size={12} /> ดูรูปภาพ
                                            </a>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <span className="inline-block px-2 py-1 rounded-md bg-gray-100 text-xs font-medium text-gray-600">
                                            {ticket.category}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${ticket.status === 'เสร็จสิ้น' ? 'bg-green-50 text-green-700 border-green-100' :
                                            ticket.status === 'กำลังดำเนินการ' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                'bg-yellow-50 text-yellow-700 border-yellow-100'
                                            }`}>
                                            {ticket.status === 'เสร็จสิ้น' ? <CheckCircle size={12} /> :
                                                ticket.status === 'กำลังดำเนินการ' ? <Clock size={12} /> :
                                                    <AlertTriangle size={12} />}
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {ticket.status !== 'เสร็จสิ้น' && (
                                            <button
                                                onClick={() => handleStatusUpdate(ticket.ticketID, ticket.status)}
                                                className="text-xs bg-bigc-green text-white px-3 py-1.5 rounded-md hover:bg-green-600 transition-colors shadow-sm"
                                            >
                                                {ticket.status === 'รอการแก้ไข' ? 'เริ่มงาน' : 'ปิดงาน'}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredTickets.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-400">
                                        ไม่พบข้อมูล
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
