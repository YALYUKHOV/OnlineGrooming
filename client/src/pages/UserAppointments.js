const loadAppointments = async () => {
    try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No authentication token found');
            return;
        }

        const data = await fetchUserAppointments();
        ('Appointments data:', data);
        setAppointments(data);
    } catch (error) {
        console.error('Ошибка при загрузке записей:', error);
        console.error('Error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
    } finally {
        setLoading(false);
    }
}; 