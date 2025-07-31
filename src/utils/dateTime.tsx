export const formatAppointmentDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const formatted = date.toLocaleString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
    return formatted.replace(',', ' at');
};
export const formatAppointmentTime = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const formatted = date.toLocaleString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
    return formatted.replace(',', ' at');
};
export const formatAppointmentDateTime = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const formatted = date.toLocaleString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
    return formatted.replace(',', ' at');
};