import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fileManagement = createApi({
    reducerPath: 'fileManagement',
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
        attachDetailList: builder.mutation({
            query: (atchFileId) => ({
                url: `adm/file/attachDetailList/${atchFileId}`,
                method: 'GET',
                contentType: 'multipart/form-data'
            })
        }),
        deleteFile: builder.mutation({
            query: (body) => ({
                url: 'adm/file/deleteFile',
                method: 'POST',
                body: body
            })
        }),
        fileDown: builder.mutation({
            query: ({ atchFileId, fileSn }) => ({
                url: `adm/file/fileDown?atchFileId=${atchFileId}&fileSn=${fileSn}`,
                method: 'GET',
                contentType: 'multipart/form-data',
                responseType: 'blob'
            })
        }),
        fileUpload: builder.mutation({
            query: (body) => ({
                url: 'adm/file/fileUpload',
                method: 'POST',
                body: body,
                contentType: 'multipart/form-data'
            })
        }),
        getImg: builder.mutation({
            query: (imagePath) => ({
                url: `adm/file/getImg?imgPath=${imagePath}`,
                method: 'GET'
            })
        }),
        getFileInfo: builder.mutation({
            query: ({ atchFileId, fileSn }) => ({
                url: `file/getFileInfo?atchFileId=${atchFileId}&fileSn=${fileSn}`,
                method: 'GET'
            })
        }),
        updateDocumentFileId: builder.mutation({
            query: (body) => ({
                url: 'main/updateDocumentFileId',
                method: 'POST',
                body: body
            })
        }),
        getSafetyFileId: builder.mutation({
            query: (body) => ({
                url: 'main/getSafetyFileId',
                method: 'POST',
                body: body
            })
        })
    })
});

export const {
    useUpdateDocumentFileIdMutation,
    useAttachDetailListMutation,
    useDeleteFileMutation,
    useFileDownMutation,
    useFileUploadMutation,
    useGetImgMutation,
    useGetFileInfoMutation,
    useGetSafetyFileIdMutation
} = fileManagement;
