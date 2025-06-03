
export const logout = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('current_user');
  window.location.href = '/';
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('auth_token');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('current_user');
  return user ? JSON.parse(user) : null;
};
