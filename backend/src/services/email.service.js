import nodemailer from 'nodemailer'
import { env } from '../../config/env.js'

let transporter = null

// Инициализация SMTP транспортера
const initTransporter = () => {
	if (transporter) return transporter

	transporter = nodemailer.createTransport({
		host: env.SMTP_HOST,
		port: env.SMTP_PORT,
		secure: env.SMTP_PORT === '465', // true для 465, false для других портов
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
				console.error('SMTP configuration is missing')
				return false
			}

			const mailer = initTransporter()

			const mailOptions = {
				from: env.SMTP_FROM || env.SMTP_USER,
				to,
				subject,
				html
			}

			const info = await mailer.sendMail(mailOptions)
			console.log('Email sent successfully:', info.messageId)
			return true
		} catch (error) {
			console.error('Error sending email:', error)
			return false
		}
	}

	static async sendMessageToUser({ email, message, inlineButtons }) {
		try {
			// Формируем HTML с кнопками если они есть
			let html = `
				<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
					<div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; line-height: 1.6;">
						${message.replace(/\n/g, '<br>')}
					</div>
			`

			if (inlineButtons && inlineButtons.length > 0) {
				html +=
					'<div style="margin-top: 20px; display: flex; gap: 10px; flex-wrap: wrap;">'
				inlineButtons.forEach(row => {
					row.forEach(btn => {
						html += `
							<a href="${btn.url}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
								${btn.text}
							</a>
						`
					})
				})
				html += '</div>'
			}

			html += '</div>'

			return await this.sendEmail({
				to: email,
				subject: 'Сообщение',
				html
			})
		} catch (error) {
			console.error('Error sending message to user:', error)
			return false
		}
	}
}
