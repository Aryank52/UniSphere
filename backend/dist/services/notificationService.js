"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
class NotificationService {
    static async sendEmailNotification(email, name, subject, body) {
        console.log(`\n==================================================`);
        console.log(`[SMTP EMAIL SERVICE] Outgoing email dispatched:`);
        console.log(`To: ${email} (${name})`);
        console.log(`Subject: ${subject}`);
        console.log(`Body: ${body}`);
        console.log(`Status: DELIVERED (via simulated UniSphere Mailroom SMTP Relay)`);
        console.log(`==================================================\n`);
    }
}
exports.NotificationService = NotificationService;
