const API = {
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000',
    token: null,
    setToken(t) { this.token = t; },
    async request(path, options = {}) {
        const headers = options.headers || {};
        headers['Content-Type'] = 'application/json';
        if (this.token) headers['Authorization'] = `Bearer ${this.token}`;
        const res = await fetch(this.baseUrl + path, { ...options, headers });
        return res;
    },
    get(path) { return this.request(path, { method: 'GET' }); },
    post(path, body) { return this.request(path, { method: 'POST', body: JSON.stringify(body) }); },
    put(path, body) { return this.request(path, { method: 'PUT', body: JSON.stringify(body) }); },
    del(path) { return this.request(path, { method: 'DELETE' }); }
};

export default API;
