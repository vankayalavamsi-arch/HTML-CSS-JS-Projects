import { Storage } from './storage.js';

export const Wallpaper = {
    list: [
        { name: 'Dark', bg: 'linear-gradient(135deg, #0f0c29, #302b63)' },
        { name: 'Ocean', bg: 'linear-gradient(135deg, #0a3d62, #1e6f8c)' },
        { name: 'Sunset', bg: 'linear-gradient(135deg, #2d1b3d, #8b3a62)' },
        { name: 'Forest', bg: 'linear-gradient(135deg, #0a1f0a, #1a472a)' },
        { name: 'Night', bg: 'linear-gradient(135deg, #0a0a1a, #1a1a3e)' },
        { name: 'Ember', bg: 'linear-gradient(135deg, #1a0000, #5c1a1a)' }
    ],
    current: 0,

    init() {
        const saved = Storage.get('wallpaper', {});
        this.current = saved.idx || 0;
        this.apply();
    },

    apply() {
        const wp = this.list[this.current].bg;
        document.getElementById('desktop-wallpaper').style.background = wp;
        document.getElementById('login-bg').style.background = wp;
    },

    set(idx) {
        this.current = idx;
        this.apply();
        Storage.set('wallpaper', { idx });
    },

    setCustom(dataUrl) {
        document.getElementById('desktop-wallpaper').style.background = `url(${dataUrl}) center/cover`;
        document.getElementById('login-bg').style.background = `url(${dataUrl}) center/cover`;
        Storage.set('wallpaper', { idx: -1, custom: dataUrl });
    }
};