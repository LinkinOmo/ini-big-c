import type { Ticket } from '../types';

const MOCK_TICKETS: Ticket[] = [
    {
        ticketID: 'T-1001',
        storeID: '101',
        requesterName: 'สมชาย ใจดี',
        category: 'แอร์/ความเย็น',
        urgency: 'ด่วนมาก',
        description: 'แอร์ที่ล็อค 3 น้ำรั่วหนักมาก',
        status: 'รอการแก้ไข',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        photoURL: 'https://images.unsplash.com/photo-1574359254341-35639149723c?auto=format&fit=crop&q=80&w=200',
    },
    {
        ticketID: 'T-1002',
        storeID: '105',
        requesterName: 'สมศรี',
        category: 'ไฟฟ้า',
        urgency: 'ปานกลาง',
        description: 'หลอดไฟหน้าประตูทางเข้ากระพริบ',
        status: 'กำลังดำเนินการ',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
    {
        ticketID: 'T-1003',
        storeID: '102',
        requesterName: 'วิชัย',
        category: 'ประปา',
        urgency: 'ปกติ',
        description: 'อ่างล้างมือพนักงานน้ำลงช้า',
        status: 'เสร็จสิ้น',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
        lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    }
];

// Simulate API calls
export const getTickets = async (): Promise<Ticket[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([...MOCK_TICKETS]);
        }, 500);
    });
};

export const createTicket = async (ticket: Omit<Ticket, 'ticketID' | 'timestamp' | 'lastUpdated' | 'status'>): Promise<Ticket> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newTicket: Ticket = {
                ...ticket,
                ticketID: `T-${1000 + MOCK_TICKETS.length + 1}`,
                status: 'รอการแก้ไข',
                timestamp: new Date().toISOString(),
                lastUpdated: new Date().toISOString(),
            };
            MOCK_TICKETS.unshift(newTicket);
            resolve(newTicket);
        }, 800);
    });
};

export const updateTicketStatus = async (ticketID: string, status: Ticket['status']): Promise<Ticket | null> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const ticketIndex = MOCK_TICKETS.findIndex(t => t.ticketID === ticketID);
            if (ticketIndex > -1) {
                MOCK_TICKETS[ticketIndex] = {
                    ...MOCK_TICKETS[ticketIndex],
                    status,
                    lastUpdated: new Date().toISOString(),
                };
                resolve(MOCK_TICKETS[ticketIndex]);
            } else {
                resolve(null);
            }
        }, 500);
    });
};
