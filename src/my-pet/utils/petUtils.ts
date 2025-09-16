export const getDefaultImageUrl = (petType: 'dog' | 'cat' | 'other'): string => {
    switch (petType) {
        case 'dog':
            return 'https://placehold.co/400x400/E0E7FF/4F46E5?text=Dog';
        case 'cat':
            return 'https://placehold.co/400x400/FFE4E6/D946EF?text=Cat';
        case 'other':
            return 'https://placehold.co/400x400/F3F4F6/6B7280?text=Pet';
    }
};
