import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const userManagement = createApi({
    reducerPath: 'userManagement',
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
        userView: builder.mutation({
            query: (body) => ({
                url: 'adm/users/view',
                method: 'POST',
                body: body
            })
        }),
        userUpdate: builder.mutation({
            query: (body) => ({
                url: 'adm/users/update',
                method: 'POST',
                body: body
            })
        }),
        userPasswordUpdate: builder.mutation({
            query: (body) => ({
                url: 'adm/users/passwd/update',
                method: 'POST',
                body: body
            })
        })
    })
});

export const { useUserViewMutation, useUserUpdateMutation, useUserPasswordUpdateMutation } = userManagement;
