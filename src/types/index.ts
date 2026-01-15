export type TicketStatus = 'รอการแก้ไข' | 'กำลังดำเนินการ' | 'เสร็จสิ้น';
export type UrgencyLevel = 'ปกติ' | 'ปานกลาง' | 'ด่วนมาก';
export type TicketCategory = 'แอร์/ความเย็น' | 'ไฟฟ้า' | 'ประปา' | 'โครงสร้าง/โยธา' | 'อุปกรณ์';

export interface Ticket {
    ticketID: string;
    storeID: string;
    requesterName: string;
    category: TicketCategory;
    urgency: UrgencyLevel;
    description: string;
    status: TicketStatus;
    photoURL?: string;
    timestamp: string; // ISO string
    lastUpdated: string; // ISO string
}
