// assets
import { ProjectOutlined } from '@ant-design/icons';

// icons
const icons = { ProjectOutlined };

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

export const language = {
    id: '0',
    title: 'Navigation',
    type: 'group',
    children: [
        {
            id: '/contents/language',
            title: '콘텐츠 관리 > 물품 콘텐츠 관리 > 언어 관리',
            subtitle: '언어 관리',
            type: 'item',
            url: '/contents/language',
            icon: icons.ProjectOutlined,
            breadcrumbs: true
        }
    ]
};

export const goodsgroup = {
    id: '1',
    title: 'Navigation',
    type: 'group',
    children: [
        {
            id: '/contents/goodsgroup',
            title: '콘텐츠 관리 > 물품 콘텐츠 관리 > 그룹 관리',
            subtitle: '그룹 관리',
            type: 'item',
            url: '/contents/goodsgroup',
            icon: icons.ProjectOutlined,
            breadcrumbs: true
        }
    ]
};

export const information = {
    id: '2',
    title: 'Navigation',
    type: 'group',
    children: [
        {
            id: '/contents/information',
            title: '콘텐츠 관리 > 물품 콘텐츠 관리 > 정보 관리',
            subtitle: '정보 관리',
            type: 'item',
            url: '/contents/information',
            icon: icons.ProjectOutlined,
            breadcrumbs: true
        }
    ]
};

export const imagesmanagement = {
    id: '3',
    title: 'Navigation',
    type: 'group',
    children: [
        {
            id: '/contents/imagesmanagement',
            title: '콘텐츠 관리 > 물품 콘텐츠 관리 > 이미지 관리',
            subtitle: '이미지 관리',
            type: 'item',
            url: '/contents/imagesmanagement',
            icon: icons.ProjectOutlined,
            breadcrumbs: true
        }
    ]
};

export const xrayinformation = {
    id: '4',
    title: 'Navigation',
    type: 'group',
    children: [
        {
            id: '/contents/xrayinformation',
            title: '콘텐츠 관리 > X-ray 콘텐츠 관리 > 정보 관리',
            subtitle: '정보 관리',
            type: 'item',
            url: '/contents/xrayinformation',
            icon: icons.ProjectOutlined,
            breadcrumbs: true
        }
    ]
};

export const xrayinfoWrite = {
    id: '5',
    title: 'Navigation',
    type: 'group',
    children: [
        {
            id: '/contents/xrayinformationimage',
            title: '콘텐츠 관리 > X-ray 콘텐츠 관리 > 이미지 관리',
            subtitle: '이미지 관리',
            type: 'item',
            url: '/contents/xrayinformationimage',
            icon: icons.ProjectOutlined,
            breadcrumbs: true
        }
    ]
};

export const teacherinformation = {
    id: '6',
    title: 'Navigation',
    type: 'group',
    children: [
        {
            id: '/teacher/teacherinformation',
            title: '강사 관리 > 강사정보 조회',
            subtitle: '강사정보 조회',
            type: 'item',
            url: '/teacher/teacherinformation',
            icon: icons.ProjectOutlined,
            breadcrumbs: true
        }
    ]
};

export const theoryinformation = {
    id: '7',
    title: 'Navigation',
    type: 'group',
    children: [
        {
            id: '/teacher/theoryinformation',
            title: '강사 관리 > 이론강의 정보조회',
            subtitle: '이론강의 정보조회',
            type: 'item',
            url: '/teacher/theoryinformation',
            icon: icons.ProjectOutlined,
            breadcrumbs: true
        }
    ]
};

export const teacherstudent = {
    id: '8',
    title: 'Navigation',
    type: 'group',
    children: [
        {
            id: '/teacher/teacherstudent',
            title: '강사 관리 > 교육생 관리',
            subtitle: '교육생 관리',
            type: 'item',
            url: '/teacher/teacherstudent',
            icon: icons.ProjectOutlined,
            breadcrumbs: true
        }
    ]
};

// export const xrayModule = {
//     id: '9',
//     title: 'Navigation',
//     type: 'group',
//     children: [
//         {
//             id: '/learning/xraymodule',
//             title: '학습관리 > 교육 모듈 구성 > X-ray 판독모듈 구성',
//             subtitle: 'X-ray 판독모듈 구성',
//             type: 'item',
//             url: '/learning/xraymodule',
//             icon: icons.ProjectOutlined,
//             breadcrumbs: true
//         }
//     ]
// };

export const curriculum = {
    id: '10',
    title: 'Navigation',
    type: 'group',
    children: [
        {
            id: '/learning/curriculum',
            title: '학습관리 > 모듈 관리',
            type: 'item',
            url: '/learning/curriculum',
            icon: icons.ProjectOutlined,
            breadcrumbs: true
        }
    ]
};

export const eduprocadd = {
    id: '177',
    title: 'Navigation',
    type: 'group',
    children: [
        {
            id: '/educurriculum/eduprocadd',
            title: '학습 관리 > 차수 관리',
            subtitle: '차수 관리',
            type: 'item',
            url: '/educurriculum/eduprocadd',
            icon: icons.ProjectOutlined,
            breadcrumbs: true
        }
    ]
};

export const xrayPoint = {
    id: '11',
    title: 'Navigation',
    type: 'group',
    children: [
        {
            id: '/learning/xraypoint',
            title: '학습 관리 > 배점 관리',
            subtitle: '배점 관리',
            type: 'item',
            url: '/learning/xraypoint',
            icon: icons.ProjectOutlined,
            breadcrumbs: true
        }
    ]
};

export const theoryGroup = {
    id: '12',
    title: 'Navigation',
    type: 'group',
    children: [
        {
            id: '/theory/theorygroup',
            title: '이론 관리 > 그룹 관리',
            subtitle: '그룹 관리',
            type: 'item',
            url: '/theory/theorygroup',
            icon: icons.ProjectOutlined,
            breadcrumbs: true
        }
    ]
};

export const theoryInfo = {
    id: '13',
    title: 'Navigation',
    type: 'group',
    children: [
        {
            id: '/theory/theoryinfo',
            title: '이론 관리 > 교육 관리',
            subtitle: '교육 관리',
            type: 'item',
            url: '/theory/theoryinfo',
            icon: icons.ProjectOutlined,
            breadcrumbs: true
        }
    ]
};

// export const eduClass = {
//     id: '14',
//     title: 'Navigation',
//     type: 'group',
//     children: [
//         {
//             id: '/educurriculum/educlass',
//             title: '교육 관리 > 교육과정 관리 > 과정 분류',
//             subtitle: '과정 분류',
//             type: 'item',
//             url: '/educurriculum/educlass',
//             icon: icons.ProjectOutlined,
//             breadcrumbs: true
//         }
//     ]
// };

// export const eduProc = {
//     id: '15',
//     title: 'Navigation',
//     type: 'group',
//     children: [
//         {
//             id: '/educurriculum/eduproc',
//             title: '교육 관리 > 교육과정 관리 > 과정 등록',
//             subtitle: '과정 등록',
//             type: 'item',
//             url: '/educurriculum/eduproc',
//             icon: icons.ProjectOutlined,
//             breadcrumbs: true
//         }
//     ]
// };

// export const edubaseline = {
//     id: '16',
//     title: 'Navigation',
//     type: 'group',
//     children: [
//         {
//             id: '/educurriculum/edubaseline',
//             title: '교육 관리 > 교육차수 관리 > 차수 등록',
//             subtitle: '차수 등록',
//             type: 'item',
//             url: '/educurriculum/edubaseline',
//             icon: icons.ProjectOutlined,
//             breadcrumbs: true
//         }
//     ]
// };

// export const edubaselinemenu = {
//     id: '17',
//     title: 'Navigation',
//     type: 'group',
//     children: [
//         {
//             id: '/educurriculum/edubaselinemenu',
//             title: '교육 관리 > 교육차수 관리 > 차수별 메뉴관리',
//             subtitle: '차수별 메뉴관리',
//             type: 'item',
//             url: '/educurriculum/edubaselinemenu',
//             icon: icons.ProjectOutlined,
//             breadcrumbs: true
//         }
//     ]
// };

export const studentinformation = {
    id: '18',
    title: 'Navigation',
    type: 'group',
    children: [
        {
            id: '/student/studentinformation',
            title: '교육생 관리 > 교육생 정보조회',
            subtitle: '교육생 정보조회',
            type: 'item',
            url: '/student/studentinformation',
            icon: icons.ProjectOutlined,
            breadcrumbs: true
        }
    ]
};

// export const baseline = {
//     id: '19',
//     title: 'Navigation',
//     type: 'group',
//     children: [
//         {
//             id: '/student/baseline',
//             title: '교육생 관리 > 교육생 차수관리',
//             subtitle: '교육생 차수관리',
//             type: 'item',
//             url: '/student/baseline',
//             icon: icons.ProjectOutlined,
//             breadcrumbs: true
//         }
//     ]
// };

export const evaluationscore = {
    id: '27',
    title: 'Navigation',
    type: 'group',
    children: [
        {
            id: '/statistics/evaluationscore',
            title: '통계 > 교육실적 조회 > 교육생 평가점수 조회',
            subtitle: '교육생 평가점수 조회',
            type: 'item',
            url: '/statistics/evaluationscore',
            icon: icons.ProjectOutlined,
            breadcrumbs: true
        }
    ]
};
// export const educationaleval = {
//     id: '28',
//     title: 'Navigation',
//     type: 'group',
//     children: [
//         {
//             id: '/statistics/educationaleval',
//             title: '통계 > 교육실적 조회 > 교육평가 조회',
//             subtitle: '교육평가 조회',
//             type: 'item',
//             url: '/statistics/educationaleval',
//             icon: icons.ProjectOutlined,
//             breadcrumbs: true
//         }
//     ]
// };
export const wronganswerrate = {
    id: '29',
    title: 'Navigation',
    type: 'group',
    children: [
        {
            id: '/statistics/wronganswerrate',
            title: '통계 > 교육실적 조회 > 문제별 오답률 조회',
            subtitle: '문제별 오답률 조회',
            type: 'item',
            url: '/statistics/wronganswerrate',
            icon: icons.ProjectOutlined,
            breadcrumbs: true
        }
    ]
};
// export const traineeevaluation = {
//     id: '30',
//     title: 'Navigation',
//     type: 'group',
//     children: [
//         {
//             id: '/statistics/traineeevaluation',
//             title: '통계 > 교육실적 조회 > 교육생 평가 조회',
//             subtitle: '교육생 평가 조회',
//             type: 'item',
//             url: '/statistics/traineeevaluation',
//             icon: icons.ProjectOutlined,
//             breadcrumbs: true
//         }
//     ]
// };

// export const traineescoreranking = {
//     id: '31',
//     title: 'Navigation',
//     type: 'group',
//     children: [
//         {
//             id: '/statistics/traineescoreranking',
//             title: '통계 > 최종평가 조회 > 교육생 점수 순위 조회',
//             subtitle: ' 교육생 점수 순위 조회',
//             type: 'item',
//             url: '/statistics/traineescoreranking',
//             icon: icons.ProjectOutlined,
//             breadcrumbs: true
//         }
//     ]
// };
// export const evaluationscoreby = {
//     id: '32',
//     title: 'Navigation',
//     type: 'group',
//     children: [
//         {
//             id: '/statistics/evaluationscoreby',
//             title: '통계 > 최종평가 조회 > 기관별 평가 점수 조회',
//             subtitle: '기관별 평가 점수 조회',
//             type: 'item',
//             url: '/statistics/evaluationscoreby',
//             icon: icons.ProjectOutlined,
//             breadcrumbs: true
//         }
//     ]
// };
// export const annualtraining = {
//     id: '33',
//     title: 'Navigation',
//     type: 'group',
//     children: [
//         {
//             id: '/statistics/annualtraining',
//             title: '통계 > 최종평가 조회 > 연도/회차별 교육평균 조회',
//             subtitle: '연도|회차별 교육평균 조회',
//             type: 'item',
//             url: '/statistics/annualtraining',
//             icon: icons.ProjectOutlined,
//             breadcrumbs: true
//         }
//     ]
// };

export const notices = {
    id: '34',
    title: 'Navigation',
    type: 'group',
    children: [
        {
            id: '/preferences/notices',
            title: '환경설정 > 공지사항 관리',
            subtitle: '공지사항 관리',
            type: 'item',
            url: '/preferences/notices',
            icon: icons.ProjectOutlined,
            breadcrumbs: true
        }
    ]
};

export const commoncode = {
    id: '37',
    title: 'Navigation',
    type: 'group',
    children: [
        {
            id: '/preferences/commoncode',
            title: '환경설정 > 공통코드 관리',
            subtitle: '공통코드 관리',
            type: 'item',
            url: '/preferences/commoncode',
            icon: icons.ProjectOutlined,
            breadcrumbs: true
        }
    ]
};

export const system = {
    id: '38',
    title: 'Navigation',
    type: 'group',
    children: [
        {
            id: '/preferences/system',
            title: '환경설정 > 시스템메세지 관리',
            subtitle: '시스템메세지 관리',
            type: 'item',
            url: '/preferences/system',
            icon: icons.ProjectOutlined,
            breadcrumbs: true
        }
    ]
};
