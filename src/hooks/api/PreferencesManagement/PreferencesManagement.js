import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const preferencesManagement = createApi({
    reducerPath: 'preferencesManagement',
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
        // 환경 설정 > 공통코드 관리
        getCommonList: builder.mutation({
            query: (body) => ({
                url: 'common/getCommonList.do',
                method: 'POST',
                body: body
            })
        })
    })
});

export const { useGetCommonListMutation } = preferencesManagement;
