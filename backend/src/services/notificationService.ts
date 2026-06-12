import { User } from '../models/User'

export class NotificationService {
  public static async sendEmailNotification(email: string, name: string, subject: string, body: string): Promise<void> {
    console.log(`\n==================================================`)
    console.log(`[SMTP EMAIL SERVICE] Outgoing email dispatched:`)
    console.log(`To: ${email} (${name})`)
    console.log(`Subject: ${subject}`)
    console.log(`Body: ${body}`)
    console.log(`Status: DELIVERED (via simulated UniSphere Mailroom SMTP Relay)`)
    console.log(`==================================================\n`)
  }
}
