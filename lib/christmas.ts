export function isChristmasMode(): boolean {
    const now = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });
    const [day, month] = now.split('/').map(Number); // format JJ/MM/YYYY
    return month === 12 || (
        month === 1 && day === 1
    );
}