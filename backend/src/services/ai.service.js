import { OpenAI } from "openai";
import { env } from "../../config/env.js";
import { buildAIRequest } from "../config/ai-presets.js";
import { prisma } from "../lib/prisma.js";

export class AIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
    });
  }

  async sendTimewebGPT({ presetKey, text }) {
    try {
      const messages = buildAIRequest({ presetKey, text });
      console.log("messages =", messages);

      const result = await fetch(
        `https://agent.timeweb.cloud/api/v1/cloud-ai/agents/${env.TIMEWEBGPT_API_KEY}/v1/chat/completions`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + env.TOKEN_TIMEWEB,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages,
          }),
        },
      );

      //const text1 = await result.text();
      //console.log("!!!!!!!!!!!!!!!!!!!");
      //console.log(result.status, result.statusText, text1);

      console.log("result =", result);

      if (result.ok) {
        const responseData = await result.json();
        console.log("responseData =", responseData);
        const content = responseData?.choices?.[0]?.message?.content ?? "";
        console.log("content =", content);
        return typeof content === "string"
          ? content.trim()
          : String(content ?? "");
      }
    } catch (error) {
      console.log("error sendTimewebGPT = ", error);
    }
  }

  /**
   * Вызов текстовой модели по ключу пресета из конфигурации.
   * @param {Object} args
   * @param {string} args.presetKey            - ключ в AIPRESETS (напр. 'sevenDayPlan')
   * @param {string} args.text
   * @returns {Promise<string>}                - текст ответа
   */
  /*
  async askPreset({ presetKey, text }) {
    const { system, user, params } = buildAIRequest({
      presetKey,
      text,
    });

    const controller = new AbortController();
    const timer = setTimeout(
      () => controller.abort(),
      params.timeoutMs ?? 25_000,
    );
    

    
    try {
      console.log("AI делаю запрос");
      
     
      const resp = await this.openai.chat.completions.create(
        {
          model: params.model,
          temperature: params.temperature,
          messages: [
            ...(system ? [{ role: "system", content: system }] : []),
            { role: "user", content: user },
          ],
        },
        { signal: controller.signal },
      );
     
    
      console.log("AI пришел ответ");
      
      const content = resp?.choices?.[0]?.message?.content ?? "";
      
      return typeof content === "string"
        ? content.trim()
        : String(content ?? "");
       
    } finally {
      clearTimeout(timer);
    }
  }
  */
}

/*
{
  "id": "chatcmpl-CWJvL9DcaCqT4VgfvaCHIULNYLFxJ",
  "object": "chat.completion",
  "created": 1761819119,
  "model": "gpt-4o-mini-2024-07-18",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Здравствуйте! Какой именно текст запроса вам нужен? Пожалуйста, уточните вопрос или дайте дополнительные детали, чтобы я мог помочь вам лучше.",
        "refusal": null,
        "annotations": []
      },
      "logprobs": null,
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 11,
    "completion_tokens": 31,
    "total_tokens": 42,
    "prompt_tokens_details": {
      "cached_tokens": 0,
      "audio_tokens": 0
    },
    "completion_tokens_details": {
      "reasoning_tokens": 0,
      "audio_tokens": 0,
      "accepted_prediction_tokens": 0,
      "rejected_prediction_tokens": 0
    }
  },
  "service_tier": "default",
  "system_fingerprint": "fp_51db84afab"
}
* */
