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
        // 콘텐츠 관리 > X-ray 콘텐츠 관리 > AI 영상합성 (정면/측면 이미지객체 전송 > 이미지 생성)
        sudoImgExcute: builder.mutation({
            query: (body) => ({
                url: 'api/sudoImgExcute.do',
                method: 'POST',
                body: body
            })
        }),

        // 콘텐츠 관리 > X-ray 콘텐츠 관리 > AI 영상합성 (이미지 이미지 가져오기)
        selectSudoImg: builder.mutation({
            query: (body) => ({
                url: 'api/selectSudoImg.do',
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
        }),

        // 콘텐츠 관리 > X-ray 콘텐츠 관리 > 카이스트2d생성
        twodGeneration: builder.mutation({
            query: (body) => ({
                url: 'api/twodGeneration.do',
                method: 'POST',
                body: body
            })
        }),

        // 콘텐츠 관리 > X-ray 콘텐츠 관리 > 카이스트2d이미지가져오기
        selectTwodImg: builder.mutation({
            query: (body) => ({
                url: 'api/selectTwodImg.do',
                method: 'POST',
                body: body
            })
        }),

        // 콘텐츠 관리 > X-ray 콘텐츠 관리 > 카이스트2d생성 이미지상세
        selectKaistTwodGeneration: builder.mutation({
            query: (body) => ({
                url: 'api/selectKaistTwodGeneration.do',
                method: 'POST',
                body: body
            })
        }),

        // 콘텐츠 관리 > X-ray 콘텐츠 관리 > 카이스트3d생성
        threedImgExcute: builder.mutation({
            query: (body) => ({
                url: 'api/threedImgExcute.do',
                method: 'POST',
                body: body
            })
        }),

        // 콘텐츠 관리 > X-ray 콘텐츠 관리 > 카이스트3d이미지가져오기
        selectThreedProgressPer: builder.mutation({
            query: (body) => ({
                url: 'api/selectThreedProgressPer.do',
                method: 'POST',
                body: body
            })
        })
    })
});

export const {
    useSudoImgExcuteMutation,
    useSelectSudoImgMutation,
    useSelectProgressPerMutation,
    useSelectKaistXrayContentsListMutation,
    useSelectKaistXrayImgContentsMutation,
    useSyncImagesMutation,

    useTwodGenerationMutation, // 카이스트2d생성
    useSelectTwodImgMutation, // 카이스트2d이미지가져오기
    useSelectKaistTwodGenerationMutation, // 카이스트2d생성 이미지상세

    useThreedImgExcuteMutation, // 카이스트3d생성
    useSelectThreedProgressPerMutation // 카이스트3d이미지가져오기
} = aisynthesisManagement;
