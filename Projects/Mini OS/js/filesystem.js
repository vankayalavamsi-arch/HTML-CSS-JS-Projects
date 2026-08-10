import { Storage } from './storage.js';

export const FS = {
    data: null,

    init() {
        this.data = Storage.get('fs', null);
        if (!this.data) {
            this.data = {
                '/': { type: 'dir', children: ['Desktop', 'Documents', 'Recycle Bin'] },
                '/Desktop': { type: 'dir', children: ['Welcome.txt'] },
                '/Documents': { type: 'dir', children: ['Notes.txt'] },
                '/Recycle Bin': { type: 'dir', children: [] },
                '/Desktop/Welcome.txt': { type: 'file', content: 'Welcome to MiniOS!' },
                '/Documents/Notes.txt': { type: 'file', content: 'My first note.' }
            };
            this.save();
        }
    },

    save() { Storage.set('fs', this.data); },

    get(path) { return this.data[path] || null; },

    list(path) {
        const node = this.get(path);
        if (!node || node.type !== 'dir') return [];
        return node.children.map(name => {
            const fullPath = path === '/' ? '/' + name : path + '/' + name;
            return { name, path: fullPath, isDir: this.get(fullPath)?.type === 'dir' };
        });
    },

    create(path, type, content = '') {
        if (this.data[path]) return false;
        this.data[path] = type === 'dir' ? { type: 'dir', children: [] } : { type: 'file', content };
        // Add to parent
        const parts = path.split('/');
        const name = parts.pop();
        const parentPath = parts.join('/') || '/';
        const parent = this.get(parentPath);
        if (parent && parent.type === 'dir' && !parent.children.includes(name)) {
            parent.children.push(name);
        }
        this.save();
        return true;
    },

    remove(path) {
        const node = this.get(path);
        if (!node) return;
        if (node.type === 'dir') {
            [...node.children].forEach(c => this.remove(path === '/' ? '/' + c : path + '/' + c));
        }
        const parts = path.split('/');
        const name = parts.pop();
        const parentPath = parts.join('/') || '/';
        const parent = this.get(parentPath);
        if (parent && parent.type === 'dir') {
            parent.children = parent.children.filter(c => c !== name);
        }
        delete this.data[path];
        this.save();
    },

    move(src, destDir) {
        const node = this.get(src);
        if (!node) return;
        const name = src.split('/').pop();
        const destPath = destDir === '/' ? '/' + name : destDir + '/' + name;
        
        this.data[destPath] = node;
        delete this.data[src];

        // Remove from old parent
        const srcParts = src.split('/');
        const srcName = srcParts.pop();
        const srcParent = this.get((srcParts.join('/')) || '/');
        if (srcParent) srcParent.children = srcParent.children.filter(c => c !== srcName);

        // Add to new parent
        const destNode = this.get(destDir);
        if (destNode && destNode.type === 'dir') destNode.children.push(name);
        
        this.save();
    },

    write(path, content) {
        if (this.get(path)?.type === 'file') {
            this.data[path].content = content;
        } else {
            this.create(path, 'file', content);
        }
        this.save();
    },

    read(path) {
        const node = this.get(path);
        return node?.type === 'file' ? node.content : null;
    },

    search(query) {
        const q = query.toLowerCase();
        return Object.keys(this.data).filter(p => p !== '/').map(p => ({
            path: p, name: p.split('/').pop(), isDir: this.data[p].type === 'dir'
        })).filter(f => f.name.toLowerCase().includes(q));
    }
};