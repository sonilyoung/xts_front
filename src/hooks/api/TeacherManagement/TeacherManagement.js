/* eslint-disable */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const teacherManagement = createApi({
    reducerPath: 'teacherManagement',
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}`,
        prepareHeaders: (headers) => {
            const jwtToken = localStorage.getItem('userToken');
            if (jwtToken) {
                headers.set('authorization', `Bearer ${jwtToken}`);
            }
            return headers;
        }
    }),
    endpoints: (builder) => ({
        // 강사 관리 > 강사정보조회
        selectModuleList: builder.mutation({
            query: (body) => ({
                url: 'adm/learningMgr/selectModuleList.do',
                method: 'POST',
                body: body
            })
        }),
        // 강사 관리 > 이론정보조회
        insertModule: builder.mutation({
            query: (body) => ({
                url: 'adm/learningMgr/insertModule.do',
                method: 'POST',
                body: body
            })
        })
    })
});

export const {
    useSelectModuleListMutation, // 학습모듈 관리 > 조회
    useInsertModuleMutation, // 학습모듈 관리 > 등록
    useSelectModuleMutation // 학습모듈 관리 > 상세
} = teacherManagement;
