import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

export class NotificationService {
  private static transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || 'ethereal.user@ethereal.email',
      pass: process.env.SMTP_PASS || 'ethereal_password'
    }
  })

  public static async sendEmail(to: string, subject: string, htmlContent: string): Promise<void> {
    const from = process.env.SMTP_FROM || '"UniSphere Mailroom" <no-reply@unisphere.edu>'
    
    // Check if SMTP is configured to standard settings or ethereal dummy
    const isMock = !process.env.SMTP_HOST
    
    if (isMock) {
      console.log(`\n==================================================`)
      console.log(`[SMTP EMAIL LOG - DEV MODE] Email dispatched:`)
      console.log(`From: ${from}`)
      console.log(`To: ${to}`)
      console.log(`Subject: ${subject}`)
      console.log(`Content:\n${htmlContent.replace(/<[^>]*>/g, '')}`) // Strip HTML for console readability
      console.log(`Status: SIMULATED DELIVERED`)
      console.log(`==================================================\n`)
      return
    }

    try {
      await this.transporter.sendMail({
        from,
        to,
        subject,
        html: htmlContent
      })
      console.log(`[SMTP EMAIL] Email sent successfully to ${to} for: ${subject}`)
    } catch (err) {
      console.error(`[SMTP EMAIL ERROR] Failed to send email to ${to}:`, err)
    }
  }

  public static async sendSMS(toPhoneNumber: string, bodyText: string): Promise<void> {
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const fromNumber = process.env.TWILIO_FROM_NUMBER || '+1234567890'

    if (!accountSid || !authToken) {
      console.log(`\n==================================================`)
      console.log(`[TWILIO SMS LOG - DEV MODE] SMS dispatch:`)
      console.log(`To: ${toPhoneNumber}`)
      console.log(`Body: ${bodyText}`)
      console.log(`Status: SIMULATED DELIVERED`)
      console.log(`==================================================\n`)
      return
    }

    try {
      // Lazy load Twilio to avoid bundle errors if not installed
      const twilio = require('twilio')
      const client = twilio(accountSid, authToken)
      await client.messages.create({
        body: bodyText,
        from: fromNumber,
        to: toPhoneNumber
      })
      console.log(`[TWILIO SMS] Text message sent successfully to ${toPhoneNumber}`)
    } catch (err) {
      console.error(`[TWILIO SMS ERROR] Failed to send SMS to ${toPhoneNumber}:`, err)
    }
  }

  public static async sendPushNotification(userToken: string, title: string, body: string): Promise<void> {
    if (!process.env.FIREBASE_PROJECT_ID) {
      console.log(`\n==================================================`)
      console.log(`[FIREBASE PUSH LOG - DEV MODE] Push notification:`)
      console.log(`Token: ${userToken}`)
      console.log(`Title: ${title}`)
      console.log(`Body: ${body}`)
      console.log(`Status: SIMULATED DELIVERED`)
      console.log(`==================================================\n`)
      return
    }

    try {
      // Lazy load Firebase Admin SDK
      const admin = require('firebase-admin')
      if (admin.apps.length === 0) {
        admin.initializeApp()
      }
      await admin.messaging().send({
        token: userToken,
        notification: { title, body }
      })
      console.log(`[FIREBASE PUSH] Push notification sent to token: ${userToken}`)
    } catch (err) {
      console.error(`[FIREBASE PUSH ERROR] Failed to send push to token ${userToken}:`, err)
    }
  }
}
