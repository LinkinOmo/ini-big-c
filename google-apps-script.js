// Google Apps Script Code
// Paste this into Extensions > Apps Script in your Google Sheet

const SHEET_NAME = 'Tickets';

// Setup function to create the sheet and headers if they don't exist
function setup() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
        sheet = ss.insertSheet(SHEET_NAME);
        const headers = ['Timestamp', 'TicketID', 'StoreID', 'RequesterName', 'Category', 'Urgency', 'Description', 'Status', 'LastUpdated', 'PhotoURL'];
        sheet.appendRow(headers);
    }
}

function doGet(e) {
    return handleRequest(e);
}

function doPost(e) {
    return handleRequest(e);
}

function handleRequest(e) {
    const lock = LockService.getScriptLock();
    lock.tryLock(10000);

    try {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const sheet = ss.getSheetByName(SHEET_NAME);

        if (!sheet) {
            return jsonResponse({ status: 'error', message: 'Sheet not found' });
        }

        // Handle POST (Create/Update)
        if (e.postData && e.postData.contents) {
            const data = JSON.parse(e.postData.contents);
            const action = data.action;

            if (action === 'create') {
                const timestamp = new Date().toISOString();
                const ticketID = 'T-' + Math.floor(1000 + Math.random() * 9000); // Simple ID generation

                // Handle File Upload
                let fileUrl = data.photoURL || '';
                if (data.fileData && data.mimeType && data.fileName) {
                    try {
                        const decodedIds = Utilities.base64Decode(data.fileData);
                        const blob = Utilities.newBlob(decodedIds, data.mimeType, data.fileName);
                        // Create folder if specific one needed, or root for now
                        const file = DriveApp.createFile(blob);
                        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
                        fileUrl = file.getDownloadUrl(); // Or getThumbnailLink() for smaller previews
                    } catch (e) {
                        fileUrl = "Error uploading: " + e.toString();
                    }
                }

                const row = [
                    timestamp,
                    ticketID,
                    data.storeID,
                    data.requesterName,
                    data.category,
                    data.urgency,
                    data.description,
                    'รอการแก้ไข', // [CHANGED] Default status to Thai
                    timestamp,
                    fileUrl
                ];
                sheet.appendRow(row);
                return jsonResponse({ status: 'success', ticketID: ticketID });
            }

            if (action === 'updateStatus') {
                const ticketID = data.ticketID;
                const newStatus = data.status;

                // Find row by TicketID
                const range = sheet.getDataRange();
                const values = range.getValues();
                let rowIndex = -1;

                // Headers are row 0, data starts at row 1 (index 1)
                for (let i = 1; i < values.length; i++) {
                    // TicketID is column 1 (index 1)
                    if (values[i][1] == ticketID) {
                        rowIndex = i + 1; // 1-based index
                        break;
                    }
                }

                if (rowIndex > 0) {
                    // Update Status (Column 8/H) and LastUpdated (Column 9/I)
                    sheet.getRange(rowIndex, 8).setValue(newStatus);
                    sheet.getRange(rowIndex, 9).setValue(new Date().toISOString());
                    return jsonResponse({ status: 'success', message: 'Status updated' });
                } else {
                    return jsonResponse({ status: 'error', message: 'Ticket not found' });
                }
            }
        }

        // Handle GET (Fetch All)
        const rows = sheet.getDataRange().getValues();
        const headers = rows[0];
        const tickets = rows.slice(1).map(row => {
            let ticket = {};
            // Map row to object based on headers lowercased (or mapped manually)
            // Headers: ['Timestamp', 'TicketID', 'StoreID', 'RequesterName', 'Category', 'Urgency', 'Description', 'Status', 'LastUpdated', 'PhotoURL']
            ticket.timestamp = row[0];
            ticket.ticketID = row[1];
            ticket.storeID = row[2];
            ticket.requesterName = row[3];
            ticket.category = row[4];
            ticket.urgency = row[5];
            ticket.description = row[6];
            ticket.status = row[7];
            ticket.lastUpdated = row[8];
            ticket.photoURL = row[9];
            return ticket;
        });

        return jsonResponse(tickets.reverse()); // Newest first

    } catch (err) {
        return jsonResponse({ status: 'error', message: err.toString() });
    } finally {
        lock.releaseLock();
    }
}

function jsonResponse(data) {
    return ContentService.createTextOutput(JSON.stringify(data))
        .setMimeType(ContentService.MimeType.JSON);
}
