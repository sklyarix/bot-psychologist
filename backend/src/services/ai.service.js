import { OpenAI } from 'openai'
import { env } from '../../config/env.js'
import { buildAIRequest } from '../config/ai-presets.js'

export class AIService {
	constructor() {
		this.openai = new OpenAI({
			apiKey: env.OPENAI_API_KEY
		})
	}

	async sendTimewebGPT({ presetKey, text }) {
		try {
			const messages = buildAIRequest({ presetKey, text })

			const result = await fetch(
				`https://agent.timeweb.cloud/api/v1/cloud-ai/agents/${env.TIMEWEB_API_KEY}/v1/chat/completions`,
				{
					method: 'POST',
					headers: {
						Authorization: 'Bearer ' + env.TIMEWEB_TOKEN,
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						model: 'gpt-4o-mini',
						messages
					})
				}
			)

			console.log(result)

			if (result.ok) {
				const responseData = await result.json()
				const content = responseData?.choices?.[0]?.message?.content ?? ''
				return typeof content === 'string'
					? content.trim()
					: String(content ?? '')
			} else {
				const errorData = await result.text()
				console.error(
					`Error sendTimewebGPT: status=${result.status}, presetKey=${presetKey}`,
					errorData
				)
				return null
			}
		} catch (error) {
			console.error('Exception sendTimewebGPT = ', error)
			return null
		}
	}
}
