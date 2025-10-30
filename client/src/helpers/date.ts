export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);

  const formatDate = new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long', // даст: "15 октября"
  });

  const formatTime = new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit', // даст: "15:24"
  });

  return `${formatDate.format(date)} ${formatTime.format(date)}`;
};

export const formatRuDateTime = (d: Date) => {
  const time = d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  const date = d.toLocaleDateString('ru-RU');
  return `${time} ${date}`;
};
