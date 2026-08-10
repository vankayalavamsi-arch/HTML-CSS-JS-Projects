import { Storage } from './storage.js';

export const Theme = {
    current: 'dark',
    accents: ['#00e5a0', '#ff6b6b', '#ffaa00', '#4499ff', '#aa66ff'],

    init() {
        const saved = Storage.get('theme', {});
        this.current = saved.mode || 'dark';
        document.documentElement.setAttribute('data-theme', this.current);
        this.updateToggleBtn();
    },

    set(mode) {
        this.current = mode;
        document.documentElement.setAttribute('data-theme', mode);
        Storage.set('theme', { mode });
        this.updateToggleBtn();
    },

    toggle() {
        this.set(this.current === 'dark' ? 'light' : 'dark');
    },

    updateToggleBtn() {
        const btn = document.getElementById('theme-toggle-btn');
        if (btn) btn.textContent = this.current === 'dark' ? 'Dark' : 'Light';
    }
};