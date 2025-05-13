import usuario from '@local/pruebaUsuario.json'; // Usando el alias correcto

const API_BASE_URL = 'http://localhost:5173/api';

export const login = (email, password) => {
  return new Promise((resolve, reject) => {
    const user = usuario.find(u => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem('loggedUserEmail', user.email); // guardar email
      setTimeout(() => resolve({
        success: true,
        data: { user, token: 'fake-token' },
      }), 500);
    } else {
      setTimeout(() => reject({
        success: false,
        error: 'Credenciales incorrectas',
      }), 500);
    }
  });
};

export const getUsuario = () => {
  return new Promise(resolve => {
    const email = localStorage.getItem('loggedUserEmail');
    const user = usuario.find(u => u.email === email);
    
    if (user) {
      setTimeout(() => resolve({ success: true, data: user }), 300);
    } else {
      setTimeout(() => resolve({ success: false }), 300);
    }
  });
};

export const logout = () => {
  return Promise.resolve({ success: true });
};
