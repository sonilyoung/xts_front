import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const loginManagement = createApi({
    reducerPath: 'loginManagement',
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}`
    }),
    endpoints: (builder) => ({
        //로그인
        login: builder.mutation({
            query: (body) => ({
                url: 'login.do',
                method: 'POST',
                body: body
            })
        }),
        //비밀번호 변경
        passwordConfirm: builder.mutation({
            query: (body) => ({
                url: 'login/passwd/change',
                method: 'POST',
                body: body
            })
        }),
        //비밀번호 초기화
        passwordReset: builder.mutation({
            query: (body) => ({
                url: 'login/passwd/reset',
                method: 'POST',
                body: body
            })
        }),
        //비밀번호 정보
        getPwdInfo: builder.mutation({
            query: (body) => ({
                url: 'main/getPwdInfo',
                method: 'POST',
                body: body
            })
        })
    })
});

export const { useLoginMutation, usePasswordConfirmMutation, usePasswordResetMutation, useGetPwdInfoMutation } = loginManagement;
