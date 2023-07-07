/* eslint-disable */
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
        // 콘텐츠 관리 > 언어 관리 > 목록
        getLanguageList: builder.mutation({
            query: (body) => ({
                url: 'adm/contents/selectLanguageList.do',
                method: 'POST',
                body: body
            })
        }),

        // 콘텐츠 관리 > 언어 관리 > 상세
        getLanguage: builder.mutation({
            query: (body) => ({
                url: 'adm/contents/selectLanguage.do',
                method: 'POST',
                body: body
            })
        }),

        // 콘텐츠 관리 > 언어 관리 > 등록
        insertLanguage: builder.mutation({
            query: (body) => ({
                url: 'adm/contents/insertLanguage.do',
                method: 'POST',
                body: body
            })
        }),

        // 콘텐츠 관리 > 언어 관리 > 수정
        updateLanguage: builder.mutation({
            query: (body) => ({
                url: 'adm/contents/updateLanguage.do',
                method: 'POST',
                body: body
            })
        }),

        // 콘텐츠 관리 > 언어 관리 > 삭제
        deleteLanguage: builder.mutation({
            query: (body) => ({
                url: 'adm/contents/deleteLanguage.do',
                method: 'POST',
                body: body
            })
        }),

        // 콘텐츠 관리 > 그룹 관리 > 목록
        getGroupList: builder.mutation({
            query: (body) => ({
                url: 'adm/contents/selectUnitGroupList.do',
                method: 'POST',
                body: body
            })
        }),

        // 콘텐츠 관리 > 그룹 관리 > 상세
        getGroup: builder.mutation({
            query: (body) => ({
                url: 'adm/contents/selectUnitGroup.do',
                method: 'POST',
                body: body
            })
        }),

        // 콘텐츠 관리 > 그룹 관리 > 등록
        insertUnitGroup: builder.mutation({
            query: (body) => ({
                url: 'adm/contents/insertUnitGroup.do',
                method: 'POST',
                body: body
            })
        }),

        // 콘텐츠 관리 > 그룹 관리 > 수정
        updateUnitGroup: builder.mutation({
            query: (body) => ({
                url: 'adm/contents/updateUnitGroup.do',
                method: 'POST',
                body: body
            })
        }),

        // 콘텐츠 관리 > 그룹 관리 > 삭제
        deleteUnitGroup: builder.mutation({
            query: (body) => ({
                url: 'adm/contents/deleteUnitGroup.do',
                method: 'POST',
                body: body
            })
        }),

        // 콘텐츠 관리 > 그룹 관리 > 이미지업로드
        insertUnitGroupImg: builder.mutation({
            query: (body) => ({
                url: 'adm/contents/insertUnitGroupImg.do',
                method: 'POST',
                body: body,
                contentType: 'multipart/form-data'
            })
        }),

        // 콘텐츠 관리 > 단품목록
        getUnitList: builder.mutation({
            query: (body) => ({
                url: 'adm/contents/selectUnitList.do',
                method: 'POST',
                body: body
            })
        }),

        // 콘텐츠 관리 > 정보 관리
        getInformationList: builder.mutation({
            query: (body) => ({
                url: 'adm/contents/selectInformationList.do',
                method: 'POST',
                body: body
            })
        }),

        // X-ray 콘텐츠 관리 > 정보 관리(상단)
        getXrayinformationList: builder.mutation({
            query: (body) => ({
                url: 'adm/contents/selectXrayContentsList.do',
                method: 'POST',
                body: body
            })
        }),

        // X-ray 콘텐츠 관리 > 정보 관리(하단)
        getXrayinformationSubList: builder.mutation({
            query: (body) => ({
                url: 'adm/contents/selectXrayUnitList.do',
                method: 'POST',
                body: body
            })
        }),

        //단품상세
        getUnit: builder.mutation({
            query: (body) => ({
                url: 'adm/contents/selectUnit.do',
                method: 'POST',
                body: body
            })
        }),

        //단품저장
        insertUnit: builder.mutation({
            query: (body) => ({
                url: 'adm/contents/insertUnit.do',
                method: 'POST',
                body: body
            })
        }),

        // 단품수정
        updateUnit: builder.mutation({
            query: (body) => ({
                url: 'adm/contents/updateUnit.do',
                method: 'POST',
                body: body
            })
        }),

        // 단품삭제
        deleteUnit: builder.mutation({
            query: (body) => ({
                url: 'adm/contents/deleteUnit.do',
                method: 'POST',
                body: body
            })
        }),

        // 단품이미지저장
        saveUnitImg: builder.mutation({
            query: (body) => ({
                url: 'adm/contents/saveUnitImg.do',
                method: 'POST',
                body: body,
                contentType: 'multipart/form-data'
            })
        }),

        //xray컨텐츠등록
        insertXrayContents: builder.mutation({
            query: (body) => ({
                url: 'adm/contents/insertXrayContents.do',
                method: 'POST',
                body: body
            })
        }),

        //xray컨텐츠수정
        updateXrayContents: builder.mutation({
            query: (body) => ({
                url: 'adm/contents/updateXrayContents.do',
                method: 'POST',
                body: body
            })
        }),

        //xray컨텐츠삭제
        deleteXrayContents: builder.mutation({
            query: (body) => ({
                url: 'adm/contents/deleteXrayContents.do',
                method: 'POST',
                body: body
            })
        }),

        //xray컨텐츠 물품등록
        insertXrayUnit: builder.mutation({
            query: (body) => ({
                url: 'adm/contents/insertXrayUnit.do',
                method: 'POST',
                body: body
            })
        }),

        //xray컨텐츠 물품삭제
        deleteXrayUnit: builder.mutation({
            query: (body) => ({
                url: 'adm/contents/deleteXrayUnit.do',
                method: 'POST',
                body: body
            })
        }),

        //xray컨텐츠 물품팝업리스트
        selectUnitPopupList: builder.mutation({
            query: (body) => ({
                url: 'adm/contents/selectUnitPopupList.do',
                method: 'POST',
                body: body
            })
        }),

        //xray컨텐츠 이미지상세정보가져오기
        selectXrayImgContents: builder.mutation({
            query: (body) => ({
                url: 'adm/contents/selectXrayImgContents.do',
                method: 'POST',
                body: body
            })
        }),

        //xray컨텐츠 이미지업로드(db)
        updateXrayContentsImg: builder.mutation({
            query: (body) => ({
                url: 'adm/contents/updateXrayContentsImg.do',
                method: 'POST',
                body: body,
                contentType: 'multipart/form-data'
            })
        }),

        //xray컨텐츠 이미지업로드(이미지)
        xrayImageUpload: builder.mutation({
            query: (body) => ({
                url: 'file/xrayImageUpload.do',
                method: 'POST',
                body: body,
                contentType: 'multipart/form-data'
            })
        }),

        // 이미지조회
        selectImg: builder.mutation({
            query: (body) => ({
                url: '/adm/contents/selectImg.do',
                method: 'POST',
                body: body
            })
        })
    })
});

export const {
    useGetLanguageListMutation, //언어목록
    useGetLanguageMutation, //언어상세
    useInsertLanguageMutation, //언어등록
    useUpdateLanguageMutation, //언어수정
    useDeleteLanguageMutation, //언어삭제
    useGetGroupListMutation, //그룹목록
    useGetGroupMutation, //그룹상세
    useInsertUnitGroupMutation, //그룹등록
    useUpdateUnitGroupMutation, //그룹수정
    useDeleteUnitGroupMutation, //그룹삭제
    useInsertUnitGroupImgMutation, //그룹이미지등록
    useGetUnitListMutation,
    useGetInformationListMutation,
    useGetXrayinformationListMutation,
    useGetXrayinformationSubListMutation,
    useGetUnitMutation,
    useInsertUnitMutation,
    useUpdateUnitMutation,
    useDeleteUnitMutation,
    useSaveUnitImgMutation, //단품이미지등록
    useInsertXrayContentsMutation, //xray컨텐츠등록
    useUpdateXrayContentsMutation, //xray컨텐츠수정
    useDeleteXrayContentsMutation, //xray컨텐츠삭제
    useInsertXrayUnitMutation, //xray컨텐츠 물품등록
    useDeleteXrayUnitMutation, //xray컨텐츠 물품삭제
    useSelectUnitPopupListMutation, //물품팝업리스트
    useSelectXrayImgContentsMutation, //xray컨텐츠 이미지상세정보가져오기
    useUpdateXrayContentsImgMutation, //xray컨텐츠 이미지업로드(db)
    useXrayImageUploadMutation, //xray컨텐츠 이미지업로드(db)
    useSelectImgMutation
} = contentsManagement;
