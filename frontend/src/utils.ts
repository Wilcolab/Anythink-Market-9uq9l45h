export const isDate = (value: unknown): boolean => {
    if (typeof value !== "string") return false;
    const parsed = new Date(value);
    return parsed instanceof Date && !isNaN(parsed.getTime());
};

export const formatted = (date: Date) => new Date(date).toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC'
});