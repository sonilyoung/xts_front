import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const statisticsManagement = createApi({
    reducerPath: 'statisticsManagement',
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
        // 통계 > 학습 / 학습 실적 조회
        selectStatisticsLearningList: builder.mutation({
            query: (body) => ({
                url: 'adm/statistics/selectStatisticsLearningList.do',
                method: 'POST',
                body: body
            })
        }),

        // 통계 > 학습 > 학습 실적 조회 --> 교육생 상세 조회
        selectStatisticsLearning: builder.mutation({
            query: (body) => ({
                url: 'adm/statistics/selectStatisticsLearning.do',
                method: 'POST',
                body: body
            })
        }),

        // 통계 > 학습 > 학습 실적 조회 --> 교육생 상세 조회
        selectStatisticsLearningDetail: builder.mutation({
            query: (body) => ({
                url: 'adm/statistics/selectStatisticsLearningDetail.do',
                method: 'POST',
                body: body
            })
        }),

        // 통계 > 학습 / 컨텐츠 그룹
        selectStatisticsLearningGroupList: builder.mutation({
            query: (body) => ({
                url: 'adm/statistics/selectStatisticsLearningGroupList.do',
                method: 'POST',
                body: body
            })
        }),

        // 통계 > 평가 / 평가 실적 조회
        selectStatisticsEvaluationList: builder.mutation({
            query: (body) => ({
                url: 'adm/statistics/selectStatisticsEvaluationList.do',
                method: 'POST',
                body: body
            })
        }),

        // 통계 > 평가 > 평가 실적 조회 --> 교육생 상세 조회
        selectStatisticsEvaluation: builder.mutation({
            query: (body) => ({
                url: 'adm/statistics/selectStatisticsEvaluation.do',
                method: 'POST',
                body: body
            })
        }),

        // 통계 > 평가 / 컨텐츠 그룹
        selectStatisticsEvaluationGroupList: builder.mutation({
            query: (body) => ({
                url: 'adm/statistics/selectStatisticsEvaluationGroupList.do',
                method: 'POST',
                body: body
            })
        }),

        // 통계 > 이론평가 / 이론평가 실적 조회
        selectStatisticsTheoryList: builder.mutation({
            query: (body) => ({
                url: 'adm/statistics/selectStatisticsTheoryList.do',
                method: 'POST',
                body: body
            })
        }),

        // 통계 > 이론평가 > 이론평가 실적 조회 --> 교육생 상세 조회
        selectStatisticsTheory: builder.mutation({
            query: (body) => ({
                url: 'adm/statistics/selectStatisticsTheory.do',
                method: 'POST',
                body: body
            })
        })
    })
});

export const {
    useSelectStatisticsLearningListMutation,
    useSelectStatisticsLearningMutation,
    useSelectStatisticsLearningDetailMutation,
    useSelectStatisticsLearningGroupListMutation,
    useSelectStatisticsEvaluationListMutation,
    useSelectStatisticsEvaluationMutation,
    useSelectStatisticsEvaluationGroupListMutation,
    useSelectStatisticsTheoryListMutation,
    useSelectStatisticsTheoryMutation
} = statisticsManagement;
