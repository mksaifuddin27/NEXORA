import { apiRequest, DATA_MODE } from './apiClient';
import { MockStore } from './mockStorage';
export const authService = {
    async login(email, password) {
        if (DATA_MODE === 'live') {
            try {
                const res = await apiRequest('/auth/login', {
                    method: 'POST',
                    body: JSON.stringify({ email, password }),
                });
                const normalizedUser = {
                    user_id: res.user.userId,
                    full_name: res.user.fullName,
                    email: res.user.email,
                    role: res.user.role,
                    phone: res.user.phone,
                    created_at: res.user.createdAt,
                };
                localStorage.setItem('nexora_token', res.token);
                localStorage.setItem('nexora_user', JSON.stringify(normalizedUser));
                return { user: normalizedUser, token: res.token };
            }
            catch (err) {
                console.warn('Backend login error:', err);
                throw err;
            }
        }
        // Mock Mode fallback
        const users = MockStore.getUsers();
        const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (!user) {
            throw new Error('Invalid email or password. Please check your credentials or register a new account.');
        }
        const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({ sub: user.user_id, email: user.email, role: user.role, name: user.full_name }))}.mockSignature`;
        localStorage.setItem('nexora_token', token);
        localStorage.setItem('nexora_user', JSON.stringify(user));
        return { user, token };
    },
    async register(fullName, email, password, role = 'USER', phone) {
        if (DATA_MODE === 'live') {
            const res = await apiRequest('/auth/register', {
                method: 'POST',
                body: JSON.stringify({
                    fullName: fullName.trim(),
                    email: email.trim(),
                    password: password,
                    role: role,
                    phone: phone,
                }),
            });
            const normalizedUser = {
                user_id: res.user.userId,
                full_name: res.user.fullName,
                email: res.user.email,
                role: res.user.role,
                phone: res.user.phone,
                created_at: res.user.createdAt,
            };
            localStorage.setItem('nexora_token', res.token);
            localStorage.setItem('nexora_user', JSON.stringify(normalizedUser));
            return { user: normalizedUser, token: res.token };
        }
        // Mock Mode fallback
        const users = MockStore.getUsers();
        if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
            throw new Error('An account with this email address already exists.');
        }
        const newUser = {
            user_id: Date.now(),
            full_name: fullName,
            email: email,
            role: role,
            phone: phone || '+91 98000 00000',
            created_at: new Date().toISOString(),
        };
        MockStore.addUser(newUser);
        const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({ sub: newUser.user_id, email: newUser.email, role: newUser.role, name: newUser.full_name }))}.mockSignature`;
        localStorage.setItem('nexora_token', token);
        localStorage.setItem('nexora_user', JSON.stringify(newUser));
        return { user: newUser, token };
    },
    getCurrentUser() {
        try {
            const raw = localStorage.getItem('nexora_user');
            return raw ? JSON.parse(raw) : null;
        }
        catch {
            return null;
        }
    },
    getToken() {
        return localStorage.getItem('nexora_token');
    },
    logout() {
        localStorage.removeItem('nexora_token');
        localStorage.removeItem('nexora_user');
    },
};
