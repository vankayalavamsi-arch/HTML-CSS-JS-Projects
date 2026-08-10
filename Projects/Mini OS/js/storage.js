// Simple wrapper for LocalStorage
export const Storage = {
    get(key, fallback = null) {
        try {
            const data = localStorage.getItem('mini_' + key);
            return data ? JSON.parse(data) : fallback;
        } catch (e) {
            return fallback;
        }
    },
    set(key, value) {
        try {
            localStorage.setItem('mini_' + key, JSON.stringify(value));
        } catch (e) {
            console.warn("Storage full");
        }
    },
    remove(key) {
        localStorage.removeItem('mini_' + key);
    }
};