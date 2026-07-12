import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

// Create Nodemailer transporter if environment variables are configured
function createTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    return null
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })
}

export async function sendLicenseExpiryEmail({ to, driverName, licenseNumber, expiryDate }) {
  const transporter = createTransporter()
  const subject = `Driver License Expiry Notice — ${driverName} (${licenseNumber})`
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background: #1e1b4b; padding: 20px; color: #fff;">
        <h2 style="margin:0; font-size: 18px;">TransitOps Safety & Compliance Notification</h2>
      </div>
      <div style="padding: 24px; color: #1f2937;">
        <h3 style="color: #dc2626; margin-top:0;">CRITICAL: Commercial Driving License Expiration</h3>
        <p>Dear Operations Management,</p>
        <p>This is an automated governance notice regarding driver <strong>${driverName}</strong>.</p>
        <table style="width:100%; border-collapse: collapse; margin: 16px 0; background: #f8fafc; border-radius: 8px;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><strong>Driver Name:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${driverName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><strong>License Number:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${licenseNumber}</td>
          </tr>
          <tr>
            <td style="padding: 10px;"><strong>Expiration Date:</strong></td>
            <td style="padding: 10px; color: #dc2626; font-weight: bold;">${expiryDate}</td>
          </tr>
        </table>
        <p>In compliance with <strong>BR-004</strong>, drivers with expired licenses are automatically locked from dispatch assignment.</p>
      </div>
    </div>
  `

  if (transporter) {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'alerts@transitops.io',
      to,
      subject,
      html
    })
  }
  return { success: true, mode: transporter ? 'SMTP' : 'DEMO_PREVIEW', subject }
}

export async function sendDocumentExpiryEmail({ to, registrationNumber, documentType, documentNumber, expiryDate }) {
  const transporter = createTransporter()
  const subject = `Vehicle Document Expiry Alert — ${registrationNumber} (${documentType})`
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background: #1e1b4b; padding: 20px; color: #fff;">
        <h2 style="margin:0; font-size: 18px;">TransitOps Fleet Compliance Notification</h2>
      </div>
      <div style="padding: 24px; color: #1f2937;">
        <h3 style="color: #d97706; margin-top:0;">ATTENTION: Asset Compliance Renewal Required</h3>
        <p>Dear Fleet Controller,</p>
        <p>Compliance document for asset <strong>${registrationNumber}</strong> requires attention:</p>
        <table style="width:100%; border-collapse: collapse; margin: 16px 0; background: #f8fafc; border-radius: 8px;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><strong>Asset Registration:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${registrationNumber}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><strong>Document Type:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${documentType}</td>
          </tr>
          <tr>
            <td style="padding: 10px;"><strong>Expiry Date:</strong></td>
            <td style="padding: 10px; color: #d97706; font-weight: bold;">${expiryDate}</td>
          </tr>
        </table>
      </div>
    </div>
  `

  if (transporter) {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'alerts@transitops.io',
      to,
      subject,
      html
    })
  }
  return { success: true, mode: transporter ? 'SMTP' : 'DEMO_PREVIEW', subject }
}

export async function sendMaintenanceReminderEmail({ to, registrationNumber, odometer, estimatedDue }) {
  const transporter = createTransporter()
  const subject = `Vehicle Maintenance Due — ${registrationNumber}`
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background: #1e1b4b; padding: 20px; color: #fff;">
        <h2 style="margin:0; font-size: 18px;">TransitOps Workshop Governance Notice</h2>
      </div>
      <div style="padding: 24px; color: #1f2937;">
        <h3 style="color: #2563eb; margin-top:0;">Workshop Service Scheduling Due</h3>
        <p>Asset <strong>${registrationNumber}</strong> has reached scheduled mileage interval (${odometer.toLocaleString()} km).</p>
      </div>
    </div>
  `

  if (transporter) {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'alerts@transitops.io',
      to,
      subject,
      html
    })
  }
  return { success: true, mode: transporter ? 'SMTP' : 'DEMO_PREVIEW', subject }
}
