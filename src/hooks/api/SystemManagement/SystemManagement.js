import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const systemManagement = createApi({
    reducerPath: 'systemManagement',
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
        // 다국어목록회
        getLanguageApplyList: builder.mutation({
            query: (body) => ({
                url: 'common/selectLanguageApplyList.do',
                method: 'POST',
                body: body
            })
        }),

        // 다국어등록
        insertLanguageApply: builder.mutation({
            query: (body) => ({
                url: 'common/insertLanguageApply.do',
                method: 'POST',
                body: body
            })
        }),

        // 다국어상세
        getLanguageApply: builder.mutation({
            query: (body) => ({
                url: 'common/selectLanguageApply.do',
                method: 'POST',
                body: body
            })
        }),

        // 다국어삭제
        deleteLanguageApply: builder.mutation({
            query: (body) => ({
                url: 'common/deleteLanguageApply.do',
                method: 'POST',
                body: body
            })
        })
    })
});

export const {
    useGetLanguageApplyListMutation,
    useInsertLanguageApplyMutation,
    useGetLanguageApplyMutation,
    useDeleteLanguageApplyMutation
} = systemManagement;
