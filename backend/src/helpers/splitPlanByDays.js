/**
 * Разбивает markdown-план на секции по дням формата:
 * "#### День N:" ...контент...
 * Возвращает массив объектов { day, body }.
 *
 * Используется подход через split:
 * после split массив выглядит так — ["пролог", day1, body1, day2, body2, ...]
 *
 * @param {string} text Полный markdown-план
 * @returns {{ day: number, body: string }[]} Отсортированный по дню список секций
 */
export function splitPlanByDays(text) {
  if (!text) return [];

  // Разделяем текст по заголовкам вида "#### День N:"
  const dayHeaderPattern = /^####\s*День\s*(\d+)[^\n\r]*\r?\n/gmu;
  const splitChunks = text.split(dayHeaderPattern);
  // splitChunks: ["пролог", day1, body1, day2, body2, ...]

  const daySections = [];
  for (let chunkIndex = 1; chunkIndex < splitChunks.length; chunkIndex += 2) {
    const dayNumber = Number(splitChunks[chunkIndex]);
    const dayBody = (splitChunks[chunkIndex + 1] || "").trim();
    daySections.push({ day: dayNumber, body: dayBody });
  }

  // На всякий случай сортируем по номеру дня
  daySections.sort((a, b) => a.day - b.day);
  return daySections;
}
