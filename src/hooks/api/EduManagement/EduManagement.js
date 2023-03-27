import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const eduManagement = createApi({
    reducerPath: 'eduManagement',
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
        // 교육 관리 > 교육과정 관리 > 그룹 관리
        getEduGroupList: builder.mutation({
            query: (body) => ({
                url: 'eduMgr/getEduGroupList.do',
                method: 'POST',
                body: body
            })
        }),

        // 교육 관리 > 교육과정 관리 > 과정 분류
        getEduClassList: builder.mutation({
            query: (body) => ({
                url: 'eduMgr/getEduClassList.do',
                method: 'POST',
                body: body
            })
        }),

        // 교육 관리 > 교육과정 관리 > 과정 등록
        getEduProcList: builder.mutation({
            query: (body) => ({
                url: 'eduMgr/getEduProcList.do',
                method: 'POST',
                body: body
            })
        }),

        // 교육 관리 > 교육과정 관리 > 과정 등록 (상세정보)
        getEduProcDetail: builder.mutation({
            query: (body) => ({
                url: 'eduMgr/getEduProcDetail.do',
                method: 'POST',
                body: body
            })
        }),

        // 교육 관리 > 교육차수 관리 > 차수 등록(상단)
        getEduBaselineList: builder.mutation({
            query: (body) => ({
                url: 'eduMgr/getEduBaselineList.do',
                method: 'POST',
                body: body
            })
        }),

        // 교육 관리 > 교육차수 관리 > 차수 등록(중간)
        getEduBaselineDetail: builder.mutation({
            query: (body) => ({
                url: 'eduMgr/getEduBaselineDetail.do',
                method: 'POST',
                body: body
            })
        }),

        // 교육 관리 > 교육차수 관리 > 차수 등록(하단)
        getEduBaselineSubList: builder.mutation({
            query: (body) => ({
                url: 'eduMgr/getEduBaselineSubList.do',
                method: 'POST',
                body: body
            })
        }),

        // 교육 관리 > 교육차수 관리 > 차수별 메뉴관리(상단)
        getEduBaselineMenuList: builder.mutation({
            query: (body) => ({
                url: 'eduMgr/getEduBaselineMenuList.do',
                method: 'POST',
                body: body
            })
        }),

        // 교육 관리 > 교육차수 관리 > 차수별 메뉴관리(하단)
        getEduBaselineMenuSubList: builder.mutation({
            query: (body) => ({
                url: 'eduMgr/getEduBaselineMenuSubList.do',
                method: 'POST',
                body: body
            })
        })
    })
});

export const {
    useGetEduGroupListMutation,
    useGetEduClassListMutation,
    useGetEduProcListMutation,
    useGetEduProcDetailMutation,
    useGetEduBaselineListMutation,
    useGetEduBaselineDetailMutation,
    useGetEduBaselineSubListMutation,
    useGetEduBaselineMenuListMutation,
    useGetEduBaselineMenuSubListMutation
} = eduManagement;
