import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const studentsManagement = createApi({
    reducerPath: 'studentsManagement',
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
        // 교육생 관리 > 교육생 정보조회
        selectUserList: builder.mutation({
            query: (body) => ({
                url: 'adm/userMgr/selectUserList.do',
                method: 'POST',
                body: body
            })
        }),

        // 교육생 관리 > 교육생 정보상세
        selectUser: builder.mutation({
            query: (body) => ({
                url: 'adm/userMgr/selectUser.do',
                method: 'POST',
                body: body
            })
        }),

        // 교육생 관리 > 교육생 정보등록
        insertUser: builder.mutation({
            query: (body) => ({
                url: 'adm/userMgr/insertUser.do',
                method: 'POST',
                body: body
            })
        }),

        // 교육생 관리 > 교육생 정보수정
        updateUser: builder.mutation({
            query: (body) => ({
                url: 'adm/userMgr/updateUser.do',
                method: 'POST',
                body: body
            })
        }),

        // 교육생 관리 > 교육생 정보삭제
        deleteUser: builder.mutation({
            query: (body) => ({
                url: 'adm/userMgr/deleteUser.do',
                method: 'POST',
                body: body
            })
        }),

        // 교육생 관리 > 교육생 아이디 중복 체크
        selectUserCheck: builder.mutation({
            query: (body) => ({
                url: 'adm/userMgr/selectUserCheck.do',
                method: 'POST',
                body: body
            })
        }),

        // 교육생 검색
        selectUserListPop: builder.mutation({
            query: (body) => ({
                url: '/adm/userMgr/selectUserListPop.do',
                method: 'POST',
                body: body
            })
        }),

        // 강사관리 - 교육생 정보조회
        selectBaselineUserList: builder.mutation({
            query: (body) => ({
                url: '/adm/userMgr/selectBaselineUserList.do',
                method: 'POST',
                body: body
            })
        }),

        // 교육생 평가 가중치 팝업 정보조회
        selectBaselineUser: builder.mutation({
            query: (body) => ({
                url: '/adm/userMgr/selectBaselineUser.do',
                method: 'POST',
                body: body
            })
        }),

        // 교육생 실기점수 업데이트
        updateBaselineUser: builder.mutation({
            query: (body) => ({
                url: '/adm/userMgr/updateBaselineUser.do',
                method: 'POST',
                body: body
            })
        }),

        // 교육생 검색
        updateBaselineUser: builder.mutation({
            query: (body) => ({
                url: '/adm/userMgr/updateBaselineUser.do',
                method: 'POST',
                body: body
            })
        }),

        // 교육생 회원가입(교육생 화면)
        insertStuUser: builder.mutation({
            query: (body) => ({
                url: '/adm/userMgr/insertStuUser.do',
                method: 'POST',
                body: body
            })
        }),

        // 교육생 회원가입(교육생 화면) > 교육생 아이디 중복 체크
        selectStuUserCheck: builder.mutation({
            query: (body) => ({
                url: 'adm/userMgr/selectStuUserCheck.do',
                method: 'POST',
                body: body
            })
        }),

        // 이수증 리스트
        selectCertificationUserList: builder.mutation({
            query: (body) => ({
                url: 'adm/userMgr/selectCertificationUserList.do',
                method: 'POST',
                body: body
            })
        }),

        // 이수증 상세
        selectCertificationUser: builder.mutation({
            query: (body) => ({
                url: 'adm/userMgr/selectCertificationUser.do',
                method: 'POST',
                body: body
            })
        }),

        // 교육생 엑셀 업로드
        insertStudentExcel: builder.mutation({
            query: (body) => ({
                url: 'adm/userMgr/insertStudentExcel.do',
                method: 'POST',
                body: body
            })
        })
    })
});

export const {
    useSelectUserListMutation,
    useSelectUserMutation,
    useInsertUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useSelectUserCheckMutation,
    useSelectUserListPopMutation,
    useSelectBaselineUserListMutation,
    useSelectBaselineUserMutation,
    useUpdateBaselineUserMutation,
    useInsertStuUserMutation,
    useSelectStuUserCheckMutation,
    useSelectCertificationUserListMutation,
    useSelectCertificationUserMutation,
    useInsertStudentExcelMutation
} = studentsManagement;
