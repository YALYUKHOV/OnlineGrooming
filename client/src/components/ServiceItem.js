const getImageUrl = (imageName) => {
    if (!imageName) return null;
    const baseUrl = process.env.REACT_APP_API_URL?.endsWith('/') 
        ? process.env.REACT_APP_API_URL.slice(0, -1) 
        : process.env.REACT_APP_API_URL;
    return `${baseUrl}/static/${imageName}`;
}; 

const handleBookClick = () => {
    if (typeof onBookClick === 'function') {
        // Convert MobX proxy to plain object
        const plainService = {
            id: service.id,
            name: service.name,
            description: service.description,
            price: service.price,
            duration: service.duration,
            category: service.category,
            images: service.images
        };
        onBookClick(plainService);
    }
}; 