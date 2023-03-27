import jwtDecode from 'jwt-decode';

const TOKEN = 'userToken';

export const setItem = (token) => {
    localStorage.setItem(TOKEN, token);
};
export const getItem = () => {
    return localStorage.getItem(TOKEN);
};

export const getDecoded = () => {
    if (getItem()) {
        return jwtDecode(getItem());
    }

    return null;
};

export const isValid = () => {
    const token = getDecoded();
    if (token && token.exp > Math.floor(Date.now() / 1000)) {
        return true;
    }

    return false;
};

export const remove = () => localStorage.removeItem(TOKEN);
