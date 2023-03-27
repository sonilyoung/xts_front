import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const learningMaqnagement = createApi({
    reducerPath: 'learningMaqnagement',
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
        // 학습 관리 > 교육 모듈구성 > X-ray 판독모듈 구성
        getXrayModuleList: builder.mutation({
            query: (body) => ({
                url: 'learningMgr/getXrayModuleList.do',
                method: 'POST',
                body: body
            })
        }),

        // 학습 관리 > X-ray 판독 배점관리 (상단)
        getXrayPointList: builder.mutation({
            query: (body) => ({
                url: 'learningMgr/getXrayPointList.do',
                method: 'POST',
                body: body
            })
        }),

        // 학습 관리 > X-ray 판독 배점관리 (하단)
        getXrayPointSubList: builder.mutation({
            query: (body) => ({
                url: 'learningMgr/getXrayPointDetailList.do',
                method: 'POST',
                body: body
            })
        }),

        // 학습 관리 > 교육 타입관리
        getEduTypeList: builder.mutation({
            query: (body) => ({
                url: 'learningMgr/getEduTypeList.do',
                method: 'POST',
                body: body
            })
        })
    })
});

export const { useGetXrayModuleListMutation, useGetXrayPointListMutation, useGetXrayPointSubListMutation, useGetEduTypeListMutation } =
    learningMaqnagement;
