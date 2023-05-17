import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const studentsManagement = createApi({
    reducerPath: 'studentsManagement',
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
        // 교육생 관리 > 교육생 정보조회
        getStudentInformationList: builder.mutation({
            query: (body) => ({
                url: 'adm/userMgr/getUserList.do',
                method: 'POST',
                body: body
            })
        }),

        // 교육생 관리 > 교육생 차수관리(상단 - 목록)
        getUserBaselineList: builder.mutation({
            query: (body) => ({
                url: 'adm/userMgr/getUserBaselineList.do',
                method: 'POST',
                body: body
            })
        }),

        // 교육생 관리 > 교육생 차수관리(중앙좌측 - 목록)
        getUserBaselineSubList: builder.mutation({
            query: (body) => ({
                url: 'adm/userMgr/getUserBaselineSubList.do',
                method: 'POST',
                body: body
            })
        }),

        // 교육생 관리 > 교육생 차수관리(중앙우측 - 정보상세)
        getUserBaselineSubDetail: builder.mutation({
            query: (body) => ({
                url: 'adm/userMgr/getUserBaselineSubDetail.do',
                method: 'POST',
                body: body
            })
        }),

        // 교육생 관리 > 교육생 차수관리(하단 - 목록)
        getUserBaselineSubDetailList: builder.mutation({
            query: (body) => ({
                url: 'adm/userMgr/getUserBaselineSubDetailList.do',
                method: 'POST',
                body: body
            })
        })
    })
});

export const {
    useGetStudentInformationListMutation,
    useGetUserBaselineListMutation,
    useGetUserBaselineSubListMutation,
    useGetUserBaselineSubDetailMutation,
    useGetUserBaselineSubDetailListMutation
} = studentsManagement;
