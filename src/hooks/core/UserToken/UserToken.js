import jwtDecode from 'jwt-decode';

const TOKEN = 'userToken';

function useUserToken(props) {
    const setItem = (token) => {
        localStorage.setItem(TOKEN, token);
    };

    //로컬스토리지 - 토큰정보 가져오기
    const getItem = () => {
        return localStorage.getItem(TOKEN);
    };

    const getDecoded = () => {
        if (getItem()) {
            return jwtDecode(getItem());
        }
        return null;
    };

    const isValid = () => {
        const token = getDecoded();
        if (token && token.exp > Math.floor(Date.now() / 1000)) {
            return true;
        }
        return false;
    };

    const getDecodedTokenPayload = () => {
        const decodedToken = getDecoded();
        const decodedTokenPayload = decodedToken?.sub?.split('|');

        return decodedTokenPayload;
    };

    const getUserRoleCd = () => {
        const decodedTokenPayload = getDecodedTokenPayload();
        return decodedTokenPayload[7];
    };

    const getUserLoginId = () => {
        const decodedTokenPayload = getDecodedTokenPayload();
        return decodedTokenPayload[1];
    };

    const getUserCompanyId = () => {
        const decodedTokenPayload = getDecodedTokenPayload();
        return decodedTokenPayload[9];
    };

    const getUserWorkplaceId = () => {
        const decodedTokenPayload = getDecodedTokenPayload();
        return decodedTokenPayload[11];
    };

    const getUserLoginCount = () => {
        const decodedTokenPayload = getDecodedTokenPayload();
        return decodedTokenPayload[13];
    };

    return [
        { setItem, getItem, getDecoded, isValid, getUserRoleCd, getUserLoginId, getUserCompanyId, getUserWorkplaceId, getUserLoginCount }
    ];
}

export default useUserToken;
