import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const theoryGroupManagement = createApi({
    reducerPath: 'theoryGroupManagement',
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
        // 이론 관리 > 그룹관리 > 그룹 조회
        selectTheoryGroupList: builder.mutation({
            query: (body) => ({
                url: 'adm/theory/selectTheoryGroupList.do',
                method: 'POST',
                body: body
            })
        }),

        // 이론 관리 > 그룹관리 > 그룹 상세
        selectTheoryGroup: builder.mutation({
            query: (body) => ({
                url: 'adm/theory/selectTheoryGroup.do',
                method: 'POST',
                body: body
            })
        }),

        // 이론 관리 > 그룹관리 > 그룹 등록
        insertTheoryGroup: builder.mutation({
            query: (body) => ({
                url: 'adm/theory/insertTheoryGroup.do',
                method: 'POST',
                body: body
            })
        }),

        // 이론 관리 > 그룹관리 > 그룹 수정
        updateTheoryGroup: builder.mutation({
            query: (body) => ({
                url: 'adm/theory/updateTheoryGroup.do',
                method: 'POST',
                body: body
            })
        }),

        // 이론 관리 > 그룹관리 > 그룹 삭제
        deleteTheoryGroup: builder.mutation({
            query: (body) => ({
                url: 'adm/theory/deleteTheoryGroup.do',
                method: 'POST',
                body: body
            })
        }),

        // 이론 관리 > 교육관리 > 조회
        selectTheoryList: builder.mutation({
            query: (body) => ({
                url: 'adm/theory/selectTheoryList.do',
                method: 'POST',
                body: body
            })
        }),

        // 이론 관리 > 교육관리 > 상세
        selectTheory: builder.mutation({
            query: (body) => ({
                url: 'adm/theory/selectTheory.do',
                method: 'POST',
                body: body
            })
        }),

        // 이론 관리 > 교육관리 > 등록
        insertTheory: builder.mutation({
            query: (body) => ({
                url: 'adm/theory/insertTheory.do',
                method: 'POST',
                body: body
            })
        }),

        // 이론 관리 > 교육관리 > 수정
        updateTheory: builder.mutation({
            query: (body) => ({
                url: 'adm/theory/updateTheory.do',
                method: 'POST',
                body: body
            })
        }),

        // 이론 관리 > 교육관리 > 삭제
        deleteTheory: builder.mutation({
            query: (body) => ({
                url: 'adm/theory/deleteTheory.do',
                method: 'POST',
                body: body
            })
        })
    })
});

export const {
    useSelectTheoryGroupListMutation,
    useSelectTheoryGroupMutation,
    useInsertTheoryGroupMutation,
    useUpdateTheoryGroupMutation,
    useDeleteTheoryGroupMutation,

    useSelectTheoryListMutation,
    useSelectTheoryMutation,
    useInsertTheoryMutation,
    useUpdateTheoryMutation,
    useDeleteTheoryMutation
} = theoryGroupManagement;
