import React from 'react';
import { useUserRole } from '../UserRole';

function useUserURLRedirect(props) {
    const [userRoleCodes] = useUserRole();
    const getPath = (roleCode) => {
        switch (roleCode) {
            //최종관리자 : 000
            case userRoleCodes.admin:
                return '/dashboard';
            //일반관리자 : 001
            case userRoleCodes.director:
                return '/dashboard';
        }
        return false;
    };
    return getPath;
}
export default useUserURLRedirect;
