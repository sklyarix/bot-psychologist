import nodemailer from 'nodemailer'
import { env } from '../../config/env.js'

let transporter = null

const initTransporter = () => {
	if (transporter) return transporter

	transporter = nodemailer.createTransport({
		host: env.SMTP_HOST,
		port: Number(env.SMTP_PORT) || 587,
		secure: Number(env.SMTP_PORT) === 465,
		auth: {
			user: env.SMTP_USER,
			pass: env.SMTP_PASS
		}
	})

	return transporter
}

export class EmailService {
	static async sendEmail({ to, subject, html }) {
		try {
			if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
				console.error('[EmailService] SMTP не настроен в .env')
				return false
			}

			const mailer = initTransporter()
			await mailer.sendMail({
				from: env.SMTP_FROM || env.SMTP_USER,
				to,
				subject,
				html
			})

			console.log(`[EmailService] Письмо отправлено: ${to}`)
			return true
		} catch (error) {
			console.error('[EmailService] Ошибка отправки:', error)
			return false
		}
	}

	static async sendMessageToUser({ email, message }) {
		try {
			const bodyHtml = message
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/\n/g, '<br>')

			const html = `
<!DOCTYPE html>
<html lang="ru">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:600px;width:100%;">
        <tr>
          <td style="padding:32px 32px 24px;">
            <p style="margin:0;font-size:15px;line-height:1.7;color:#1f2937;">${bodyHtml}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 32px 24px;border-top:1px solid #f3f4f6;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">Вы получили это письмо, так как являетесь пользователем нашего сервиса.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

			return await this.sendEmail({
				to: email,
				subject: 'Сообщение от сервиса',
				html
			})
		} catch (error) {
			console.error('[EmailService] Ошибка в sendMessageToUser:', error)
			return false
		}
	}
}
