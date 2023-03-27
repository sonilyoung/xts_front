import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const contentsManagement = createApi({
    reducerPath: 'contentsManagement',
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
        // 콘텐츠 관리 > 언어 관리
        getLanguageList: builder.mutation({
            query: (body) => ({
                url: 'contents/selectLanguageList.do',
                method: 'POST',
                body: body
            })
        }),

        // 콘텐츠 관리 > 그룹 관리
        getGroupList: builder.mutation({
            query: (body) => ({
                url: 'contents/selectUnitGroupList.do',
                method: 'POST',
                body: body
            })
        }),

        // 콘텐츠 관리 > 단품목록
        getUnitList: builder.mutation({
            query: (body) => ({
                url: 'contents/selectUnitList.do',
                method: 'POST',
                body: body
            })
        }),

        // 콘텐츠 관리 > 정보 관리
        getInformationList: builder.mutation({
            query: (body) => ({
                url: 'contents/selectInformationList.do',
                method: 'POST',
                body: body
            })
        }),

        // X-ray 콘텐츠 관리 > 정보 관리(상단)
        getXrayinformationList: builder.mutation({
            query: (body) => ({
                url: 'contents/selectXrayInformationList.do',
                method: 'POST',
                body: body
            })
        }),

        // X-ray 콘텐츠 관리 > 정보 관리(하단)
        getXrayinformationSubList: builder.mutation({
            query: (body) => ({
                url: 'contents/selectXrayDetailList.do',
                method: 'POST',
                body: body
            })
        }),

        //단품저장
        insertUnit: builder.mutation({
            query: (body) => ({
                url: 'contents/insertUnit.do',
                method: 'POST',
                body: body
            })
        }),

        // 단품이미지저장
        saveUnitImg: builder.mutation({
            query: (body) => ({
                url: 'contents/saveUnitImg.do',
                method: 'POST',
                body: body,
                contentType: 'multipart/form-data'
            })
        })
    })
});

export const {
    useGetLanguageListMutation,
    useGetGroupListMutation,
    useGetUnitListMutation,
    useGetInformationListMutation,
    useGetXrayinformationListMutation,
    useGetXrayinformationSubListMutation,
    useInsertUnitMutation,
    useSaveUnitImgMutation
} = contentsManagement;
