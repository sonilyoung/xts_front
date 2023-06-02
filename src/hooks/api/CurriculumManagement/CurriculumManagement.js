/* eslint-disable */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const curriculumManagement = createApi({
    reducerPath: 'curriculumManagement',
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
        // 학습모듈 관리 > 조회
        selectModuleList: builder.mutation({
            query: (body) => ({
                url: 'adm/learningMgr/selectModuleList.do',
                method: 'POST',
                body: body
            })
        }),
        // 학습모듈 관리 > 등록
        insertModule: builder.mutation({
            query: (body) => ({
                url: 'adm/learningMgr/insertModule.do',
                method: 'POST',
                body: body
            })
        }),
        // 학습모듈 관리 > 상세
        selectModule: builder.mutation({
            query: (body) => ({
                url: 'adm/learningMgr/selectModule.do',
                method: 'POST',
                body: body
            })
        }),
        // 학습모듈 관리 > 랜덤추출
        selectModuleRandom: builder.mutation({
            query: (body) => ({
                url: 'adm/learningMgr/selectModuleRandom.do',
                method: 'POST',
                body: body
            })
        }),
        // 학습모듈 관리 > 수정
        updateModule: builder.mutation({
            query: (body) => ({
                url: 'adm/learningMgr/updateModule.do',
                method: 'POST',
                body: body
            })
        }),
        // 학습모듈 관리 > 삭제
        deleteModule: builder.mutation({
            query: (body) => ({
                url: 'adm/learningMgr/deleteModule.do',
                method: 'POST',
                body: body
            })
        }),
        // 학습모듈 관리 > 물품팝업조회
        selectModuleXrayPopList: builder.mutation({
            query: (body) => ({
                url: 'adm/learningMgr/selectModuleXrayPopList.do',
                method: 'POST',
                body: body
            })
        }),
        // 학습모듈 관리 > 모듈에 등록된 문제목록 가져오기
        selectModuleQuestion: builder.mutation({
            query: (body) => ({
                url: 'adm/learningMgr/selectModuleQuestion.do',
                method: 'POST',
                body: body
            })
        }),
        // Xray배점관리 > 조회 (상단)
        selectPointStdList: builder.mutation({
            query: (body) => ({
                url: 'adm/learningMgr/selectPointStdList.do',
                method: 'POST',
                body: body
            })
        }),
        // Xray배점관리 > 등록 (상단)
        insertPointStd: builder.mutation({
            query: (body) => ({
                url: 'adm/learningMgr/insertPointStd.do',
                method: 'POST',
                body: body
            })
        }),
        // Xray배점관리 > 상세 (상단)
        selectPointStd: builder.mutation({
            query: (body) => ({
                url: 'adm/learningMgr/selectPointStd.do',
                method: 'POST',
                body: body
            })
        }),
        // Xray배점관리 > 수정 (상단)
        updatePointStd: builder.mutation({
            query: (body) => ({
                url: 'adm/learningMgr/updatePointStd.do',
                method: 'POST',
                body: body
            })
        }),
        // Xray배점관리 > 삭제 (상단)
        deletePointStd: builder.mutation({
            query: (body) => ({
                url: 'adm/learningMgr/deletePointStd.do',
                method: 'POST',
                body: body
            })
        }),
        // Xray배점관리 > 조회 (하단)
        selectPointStdDetailList: builder.mutation({
            query: (body) => ({
                url: 'adm/learningMgr/selectPointStdDetailList.do',
                method: 'POST',
                body: body
            })
        }),
        // Xray배점관리 > 등록 (하단)
        insertPointStdDetail: builder.mutation({
            query: (body) => ({
                url: 'adm/learningMgr/insertPointStdDetail.do',
                method: 'POST',
                body: body
            })
        }),
        // Xray배점관리 > 상세 (하단)
        selectPointStdDetail: builder.mutation({
            query: (body) => ({
                url: 'adm/learningMgr/selectPointStdDetail.do',
                method: 'POST',
                body: body
            })
        }),
        // Xray배점관리 > 수정 (하단)
        updatePointStdDetail: builder.mutation({
            query: (body) => ({
                url: 'adm/learningMgr/updatePointStdDetail.do',
                method: 'POST',
                body: body
            })
        }),
        // Xray배점관리 > 삭제 (하단)
        deletePointStdDetail: builder.mutation({
            query: (body) => ({
                url: 'adm/learningMgr/deletePointStdDetail.do',
                method: 'POST',
                body: body
            })
        })
    })
});

export const {
    useSelectModuleListMutation, // 학습모듈 관리 > 조회
    useInsertModuleMutation, // 학습모듈 관리 > 등록
    useSelectModuleMutation, // 학습모듈 관리 > 상세
    useSelectModuleRandomMutation, // 학습모듈 관리 > 랜덤추출
    useUpdateModuleMutation, // 학습모듈 관리 > 수정
    useDeleteModuleMutation, // 학습모듈 관리 > 삭제
    useSelectModuleXrayPopListMutation, // 학습모듈 관리 > 물품팝업조회
    useSelectModuleQuestionMutation, // 학습모듈 관리 > 모듈에 등록된 문제목록 가져오기

    useSelectPointStdListMutation, // Xray배점관리 조회 (상단)
    useInsertPointStdMutation, // Xray배점관리 등록 (상단)
    useSelectPointStdMutation, // Xray배점관리 상세 (상단)
    useUpdatePointStdMutation, // Xray배점관리 수정 (상단)
    useDeletePointStdMutation, // Xray배점관리 삭제 (상단)

    useSelectPointStdDetailListMutation, // Xray배점관리 조회 (하단)
    useInsertPointStdDetailMutation, // Xray배점관리 등록 (하단)
    useSelectPointStdDetailMutation, // Xray배점관리 상세 (하단)
    useUpdatePointStdDetailMutation, // Xray배점관리 수정 (하단)
    useDeletePointStdDetailMutation // Xray배점관리 삭제 (하단)
} = curriculumManagement;
