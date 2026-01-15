// This file connects to the Live Google Apps Script API.
// To use this instead of Mock Data, follow the instructions below.

import type { Ticket } from '../types';

// ==============================================================================
// 1. PASTE YOUR WEB APP URL HERE
// ==============================================================================
const API_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
// Example: 'https://script.google.com/macros/s/AKfycb.../exec'

// ==============================================================================
// LIVE API FUNCTIONS
// ==============================================================================

export const getTicketsLive = async (): Promise<Ticket[]> => {
    if (API_URL.includes('YOUR_GOOGLE')) {
        console.error('API URL not set');
        return [];
    }

    try {
        const response = await fetch(API_URL); // GET request
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching tickets:', error);
        return [];
    }
};

export const createTicketLive = async (ticket: any): Promise<any> => {
    if (API_URL.includes('YOUR_GOOGLE')) return;

    // We need to use no-cors or ensure GAS handles CORS properly.
    // Standard fetch() to GAS Web App requires following redirects.
    // And usually POST requests with JSON require 'Content-Type': 'text/plain' to avoid preflight options check which GAS doesn't handle well natively without workarounds.

    const payload = {
        action: 'create',
        ...ticket
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify(payload)
            // Note: Do not set Content-Type to application/json, it triggers preflight.
            // GAS reads postData.contents regardless.
        });
        return await response.json();
    } catch (error) {
        console.error('Error creating ticket:', error);
        throw error;
    }
};

export const updateTicketStatusLive = async (ticketID: string, status: string): Promise<any> => {
    if (API_URL.includes('YOUR_GOOGLE')) return;

    const payload = {
        action: 'updateStatus',
        ticketID,
        status
    };

    try {
        await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        return true;
    } catch (error) {
        console.error('Error updating status:', error);
        return false;
    }
};
