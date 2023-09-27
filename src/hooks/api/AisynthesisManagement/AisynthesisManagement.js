/* eslint-disable */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const aisynthesisManagement = createApi({
    reducerPath: 'aisynthesisManagement',
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
        // 콘텐츠 관리 > X-ray 콘텐츠 관리 > AI 영상합성 (정면/측면 이미지객체 전송)
        sudoImgExcute: builder.mutation({
            query: (body) => ({
                url: 'api/sudoImgExcute.do',
                method: 'POST',
                body: body
            })
        }),

        // 콘텐츠 관리 > X-ray 콘텐츠 관리 > AI 영상합성 (이미지 생성 진행률)
        selectProgressPer: builder.mutation({
            query: (body) => ({
                url: 'api/selectProgressPer.do',
                method: 'POST',
                body: body
            })
        }),

        // 콘텐츠 관리 > X-ray 콘텐츠 관리 > AI 영상합성 (이미지 목록)
        selectKaistXrayContentsList: builder.mutation({
            query: (body) => ({
                url: 'api/selectKaistXrayContentsList.do',
                method: 'POST',
                body: body
            })
        }),

        // 콘텐츠 관리 > X-ray 콘텐츠 관리 > AI 영상합성 (이미지 상세)
        selectKaistXrayImgContents: builder.mutation({
            query: (body) => ({
                url: 'api/selectKaistXrayImgContents.do',
                method: 'POST',
                body: body
            })
        }),

        // 콘텐츠 관리 > X-ray 콘텐츠 관리 > AI 영상합성 (최종 동기화)
        syncImages: builder.mutation({
            query: (body) => ({
                url: 'api/syncImages.do',
                method: 'POST',
                body: body
            })
        })
    })
});

export const {
    useSudoImgExcuteMutation,
    useSelectProgressPerMutation,
    useSelectKaistXrayContentsListMutation,
    useSelectKaistXrayImgContentsMutation,
    useSyncImagesMutation
} = aisynthesisManagement;
