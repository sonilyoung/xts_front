/* eslint-disable no-unused-vars */
// project import
import MainLayout from 'layout/MainLayout';

// 메인 대시보드
import { DashboardDefault } from 'pages/dashboard';

// 콘텐츠 관리
import { Language } from 'pages/contents/language'; // 콘텐츠 관리 / 물품 콘텐츠 관리 / 언어 관리
import { Goodsgroup } from 'pages/contents/goodsgroup'; // 콘텐츠 관리 / 물품 콘텐츠 관리 / 그룹 관리
import { InforMation } from 'pages/contents/information'; // 콘텐츠 관리 / 물품 콘텐츠 관리 / 정보 관리
import { ImagesManagement } from 'pages/contents/imagesmanagement'; // 콘텐츠 관리 / 물품 콘텐츠 관리 / 이미지 관리
import { Xrayinformation } from 'pages/contents/xrayinformation'; // 콘텐츠 관리 / X-ray 콘텐츠 관리 / 정보 관리
import { XrayinfoWrite } from 'pages/contents/xrayinformationimage'; // 콘텐츠 관리 / X-ray 콘텐츠 관리 / 정보 관리 등록

// 학습 관리
import { XrayModule } from 'pages/learning/xraymodule'; // 학습관리 / 교육 모듈 구성 / X-ray 판독모듈 구성
import { Curriculum } from 'pages/learning/curriculum'; // 학습관리 / 교육 모듈 구성 / 커리큘럼 관리
import { XrayPoint } from 'pages/learning/xraypoint'; // 학습 관리 / X-ray 판독 배점관리
import { EduType } from 'pages/learning/edutype'; // 학습 관리 / 교육 타입관리

// 교육 관리
import { EduGroup } from 'pages/educurriculum/edugroup'; // 교육 관리 / 교육과정 관리 / 그룹 관리
import { EduClass } from 'pages/educurriculum/educlass'; // 교육 관리 / 교육과정 관리 / 과정 분류
import { EduProc } from 'pages/educurriculum/eduproc'; // 교육 관리 / 교육과정 관리 / 과정 등록
import { EduBaseLine } from 'pages/educurriculum/edubaseline'; // 교육 관리 / 교육차수 관리 / 차수 등록
import { EduBaselineMenu } from 'pages/educurriculum/edubaselinemenu'; // 교육 관리 / 교육차수 관리 / 차수별 메뉴관리
import { EduProcAdd } from 'pages/educurriculum/eduprocadd'; // 교육 관리 / 교육과정 등록

// 교육생 관리
import { Studentinformation } from 'pages/student/studentinformation'; // 교육생 관리 / 교육생 정보조회
import { Baseline } from 'pages/student/baseline'; // 교육생 관리 / 교육생 차수관리

// 강사 관리

// 통계
import { Evaluationscore } from 'pages/statistics/evaluationscore'; // 통계 / 교육실적 조회 / 교육생 평가점수 조회
import { Educationaleval } from 'pages/statistics/educationaleval'; // 통계 / 교육실적 조회 / 교육평가 조회
import { Wronganswerrate } from 'pages/statistics/wronganswerrate'; // 통계 / 교육실적 조회 / 문제별 오답률 조회
import { Traineeevaluation } from 'pages/statistics/traineeevaluation'; // 통계 / 교육실적 조회 / 교육생 평가 조회
import { Traineescoreranking } from 'pages/statistics/traineescoreranking'; // 통계 / 최종평가 조회 / 교육생 점수 순위 조회
import { Evaluationscoreby } from 'pages/statistics/evaluationscoreby'; // 통계 / 최종평가 조회 / 기관별 평가 점수 조회
import { Annualtraining } from 'pages/statistics/annualtraining'; // 통계 / 최종평가 조회 / 연도|회차별 교육평균 조회

// 환경설정

import { Notices } from 'pages/preferences/notices'; // 환경설정 / 공지사항 관리
import { CommonCode } from 'pages/preferences/commoncode'; // 환경설정 / 공통코드 관리
import { SystemMessage } from 'pages/system'; // 환경설정 / 시스템메세지

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            // 데시보드
            path: '/',
            element: <DashboardDefault />
        },
        {
            // 데시보드
            path: 'dashboard',
            element: <DashboardDefault />
        },
        {
            // 콘텐츠 관리 > 물품 콘텐츠 관리 > 언어 관리
            path: '/contents/language',
            element: <Language />
        },
        {
            // 콘텐츠 관리 > 물품 콘텐츠 관리 > 그룹 관리
            path: '/contents/goodsgroup',
            element: <Goodsgroup />
        },
        {
            // 콘텐츠 관리 > 물품 콘텐츠 관리 > 정보 관리
            path: '/contents/information',
            element: <InforMation />
        },
        {
            // 콘텐츠 관리 > 물품 콘텐츠 관리 > 이미지 관리
            path: '/contents/imagesmanagement',
            element: <ImagesManagement />
        },
        {
            // 콘텐츠 관리 > X-ray 콘텐츠 관리 > 정보 관리
            path: '/contents/xrayinformation',
            element: <Xrayinformation />
        },
        {
            // 콘텐츠 관리 > X-ray 콘텐츠 관리 > 이미지 관리
            path: '/contents/xrayinformationimage',
            element: <XrayinfoWrite />
        },
        {
            // 학습관리 > 교육 모듈 구성 > X-ray 판독모듈 구성
            path: '/learning/xraymodule',
            element: <XrayModule />
        },
        {
            // 학습관리 > 교육 모듈 구성 > 커리큘럼 관리
            path: '/learning/Curriculum',
            element: <Curriculum />
        },
        {
            // 학습 관리 > 교육 타입관리
            path: '/learning/edutype',
            element: <EduType />
        },
        {
            // 학습 관리 > X-ray 판독 배점관리
            path: '/learning/xraypoint',
            element: <XrayPoint />
        },
        {
            // 교육 관리 > 교육과정 관리 > 그룹 관리
            path: '/educurriculum/edugroup',
            element: <EduGroup />
        },
        {
            // 교육 관리 > 교육과정 관리 > 과정 분류
            path: '/educurriculum/educlass',
            element: <EduClass />
        },
        {
            // 교육 관리 > 교육과정 관리 > 과정 등록
            path: '/educurriculum/eduproc',
            element: <EduProc />
        },
        {
            // 교육 관리 > 교육차수 관리 > 차수 등록
            path: '/educurriculum/edubaseline',
            element: <EduBaseLine />
        },
        {
            // 교육 관리 > 교육차수 관리 > 차수별 메뉴관리
            path: '/educurriculum/edubaselinemenu',
            element: <EduBaselineMenu />
        },
        {
            // 교육 관리 > 교육과정 등록
            path: '/educurriculum/eduprocadd',
            element: <EduProcAdd />
        },
        {
            // 교육생관리 > 교육생 정보조회
            path: '/student/studentinformation',
            element: <Studentinformation />
        },
        {
            // 교육생관리 > 교육생 차수 등록
            path: '/student/baseline',
            element: <Baseline />
        },
        {
            // 통계 > 교육실적조회 > 평가점수 조회
            path: '/statistics/evaluationscore',
            element: <Evaluationscore />
        },
        {
            // 통계 > 교육실적조회 > 교육평가 조회
            path: '/statistics/educationaleval',
            element: <Educationaleval />
        },
        {
            // 통계 > 교육실적조회 > 문제별 오답률 조회
            path: '/statistics/wronganswerrate',
            element: <Wronganswerrate />
        },
        {
            // 통계 > 교육실적조회 > 교육생 평가 조회
            path: '/statistics/traineeevaluation',
            element: <Traineeevaluation />
        },
        {
            // 통계 > 최종평가조회 > 교육생 점수 순위 조회
            path: '/statistics/traineescoreranking',
            element: <Traineescoreranking />
        },
        {
            // 통계 > 최종평가조회 > 기관별 평가 점수 조회
            path: '/statistics/evaluationscoreby',
            element: <Evaluationscoreby />
        },
        {
            // 통계 > 최종평가조회 > 연도/회차별 교육평균 조회
            path: '/statistics/annualtraining',
            element: <Annualtraining />
        },
        {
            // 환경설정 > 공지사항 관리
            path: '/preferences/notices',
            element: <Notices />
        },
        {
            // 환경설정 > 공통코드 관리
            path: '/preferences/commoncode',
            element: <CommonCode />
        },
        {
            // 환경설정 > 시스템메세지
            path: '/system/systemmessage',
            element: <SystemMessage />
        }
    ]
};

export default MainRoutes;
