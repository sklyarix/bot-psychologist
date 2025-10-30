import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { aiApi } from '../../../api/ai.tsx';

export function useCreateQA() {
  const queryClient = useQueryClient();
  const [isRefresh, setIsRefresh] = useState<boolean>(false);
  const mutation = useMutation({
    mutationKey: ['ai', 'create', 'QA'],
    mutationFn: aiApi.createAiQA,
    onSuccess: async (data) => {
      const { qa } = data;
      setIsRefresh(true);
      // Пулим
      const start = Date.now();
      const TIMEOUT_MS = 2 * 60 * 1000; // 2минуты
      try {
        // Пулинг раз в 1 секунду
        // GET /ai/personal/by-id/:id/ (aiApi.getIdAiJob)
        // Остановиться на completed/failed или по таймауту
        while (true) {
          const data = await aiApi.getIdAiQA(qa.id);
          const status = data.status;
          if (status === 'completed' || status === 'failed') break;
          if (Date.now() - start > TIMEOUT_MS) break;

          await new Promise((r) => setTimeout(r, 1000));
        }
        // Обновляем список
        await queryClient.invalidateQueries({
          queryKey: ['ai', 'getAll', 'QA'],
        });
      } finally {
        setIsRefresh(false);
      }
    },
  });
  return { ...mutation, isRefresh };
}
