import { useUserToken } from '../UserToken';

//접속자 상태여부
function useUserStatus() {
    let isLoggedIn = false;
    const [userToken] = useUserToken();
    if (userToken.isValid()) {
        isLoggedIn = true;
    }
    return isLoggedIn;
}
export default useUserStatus;
