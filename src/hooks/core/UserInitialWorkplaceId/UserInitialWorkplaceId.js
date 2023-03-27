import React from 'react';
import { useSelector } from 'react-redux';
import { useUserRole } from '../UserRole';
import { useUserToken } from '../UserToken';

// 차수 정보 가져오기
const useUserInitialWorkplaceId = () => {
    const [userToken] = useUserToken();

    //회원 권한 및 코드 - admin : 최종관리자(000), director : 일반관리자(001)
    const [userRoleCodes] = useUserRole(); // 권한 코드 (ex: 001)
    const userRoleCd = userToken.getUserRoleCd(); // 권한 명 (ex : 대표)
    const userWorkplaceId = userToken.getUserWorkplaceId(); // 차수

    const getInitialWorkplaceId = () => {
        switch (userRoleCd) {
            case userRoleCodes.employee:
                return userWorkplaceId;
            case userRoleCodes.director:
                return currentWorkplaceId;
            case userRoleCodes.worker:
                return userWorkplaceId;
        }
        return '';
    };
    return getInitialWorkplaceId;
};
export default useUserInitialWorkplaceId;
