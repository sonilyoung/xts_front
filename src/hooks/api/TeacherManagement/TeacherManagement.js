/* eslint-disable */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const teacherManagement = createApi({
    reducerPath: 'teacherManagement',
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
        // 강사 관리 > 강사정보 > 조회
        selectTeacherList: builder.mutation({
            query: (body) => ({
                url: '/adm/userMgr/selectTeacherList.do',
                method: 'POST',
                body: body
            })
        }),

        // 강사 관리 > 강사정보 > 상세
        selectTeacher: builder.mutation({
            query: (body) => ({
                url: '/adm/userMgr/selectTeacher.do',
                method: 'POST',
                body: body
            })
        }),

        // 강사 관리 > 강사정보 > 등록
        insertTeacher: builder.mutation({
            query: (body) => ({
                url: '/adm/userMgr/insertTeacher.do',
                method: 'POST',
                body: body
            })
        }),

        // 강사 관리 > 강사정보 > 수정
        updateTeacher: builder.mutation({
            query: (body) => ({
                url: '/adm/userMgr/updateTeacher.do',
                method: 'POST',
                body: body
            })
        }),

        // 강사 관리 > 강사정보 > 삭제
        DeleteTeacher: builder.mutation({
            query: (body) => ({
                url: '/adm/userMgr/DeleteTeacher.do',
                method: 'POST',
                body: body
            })
        }),

        // 강사 관리 > 강사정보 > 아이디 중복 체크
        selectTeacherCheck: builder.mutation({
            query: (body) => ({
                url: '/adm/userMgr/selectTeacherCheck.do',
                method: 'POST',
                body: body
            })
        }),

        // 강사 관리 > 이론교육 > 조회
        selectTheoryFileList: builder.mutation({
            query: (body) => ({
                url: '/adm/theory/selectTheoryFileList.do',
                method: 'POST',
                body: body
            })
        }),

        // 강사 관리 > 이론교육 > 상세
        selectTheoryFile: builder.mutation({
            query: (body) => ({
                url: '/adm/theory/selectTheoryFile.do',
                method: 'POST',
                body: body
            })
        }),

        // 강사 관리 > 이론교육 > 등록
        insertTheoryFile: builder.mutation({
            query: (body) => ({
                url: '/adm/theory/insertTheoryFile.do',
                method: 'POST',
                body: body
            })
        }),

        // 강사 관리 > 이론교육 > 수정
        updateTheoryFile: builder.mutation({
            query: (body) => ({
                url: '/adm/theory/updateTheoryFile.do',
                method: 'POST',
                body: body
            })
        }),

        // 강사 관리 > 이론교육 > 삭제
        deleteTheoryFile: builder.mutation({
            query: (body) => ({
                url: '/adm/theory/deleteTheoryFile.do',
                method: 'POST',
                body: body
            })
        })
    })
});

export const {
    useSelectTeacherListMutation, // 강사정보 조회
    useSelectTeacherMutation, // 강사정보 상세
    useInsertTeacherMutation, // 강사정보 등록
    useUpdateTeacherMutation, // 강사정보 수정
    useDeleteTeacherMutation, // 강사정보 삭제
    useSelectTeacherCheckMutation, // 강사정보 아이디 체크

    useSelectTheoryFileListMutation, // 이론교육 조회
    useSelectTheoryFileMutation, // 이론교육 상세
    useInsertTheoryFileMutation, // 이론교육 등록
    useUpdateTheoryFileMutation, // 이론교육 수정
    useDeleteTheoryFileMutation // 이론교육 삭제
} = teacherManagement;
