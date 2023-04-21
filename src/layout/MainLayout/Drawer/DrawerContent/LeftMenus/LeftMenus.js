/* eslint-disable*/
import { useState } from 'react';
import cookies from 'react-cookies';
import { Link, useNavigate } from 'react-router-dom';
import 'antd/dist/antd.css';

import { Stack } from '@mui/material';
import DrawerHeaderStyled from '../../DrawerHeader/DrawerHeaderStyled';
import { useTheme } from '@mui/material/styles';

import { AppstoreAddOutlined, BlockOutlined, FileTextOutlined } from '@ant-design/icons';
import { Menu } from 'antd';

function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type
    };
}

const items = [
    getItem('콘텐츠 관리', 'sub1', <AppstoreAddOutlined />, [
        getItem('물품 콘텐츠 관리', 'g1', <BlockOutlined />, [
            getItem(<Link to="/contents/language">언어 관리</Link>, '0', <FileTextOutlined />),
            getItem(<Link to="/contents/goodsgroup">그룹 관리</Link>, '1', <FileTextOutlined />),
            //getItem(<Link to="/contents/information">정보 관리</Link>, '2', <FileTextOutlined />),
            getItem(<Link to="/contents/imagesmanagement">이미지 관리</Link>, '3', <FileTextOutlined />)
        ]),
        getItem('X-ray 콘텐츠 관리', 'g2', <BlockOutlined />, [
            getItem(<Link to="/contents/xrayinformation">정보 관리</Link>, '4', <FileTextOutlined />),
            getItem(<Link to="/contents/xrayimagesmanagement">이미지 관리</Link>, '5', <FileTextOutlined />)
        ])
         , getItem('실제사례 콘텐츠 관리', 'g4', <BlockOutlined />, [getItem('실제사례 관리', '8', <FileTextOutlined />)])
    ]),

    
    getItem('학습 관리', 'sub2', <AppstoreAddOutlined />, [
        getItem('교육 모듈구성', 'g5', <BlockOutlined />, [
            getItem(<Link to="/contents/imagesmanagement">X-ray 판독모듈 구성</Link>, '9', <FileTextOutlined />),
            getItem(<Link to="/contents/imagesmanagement">커리큘럼 관리</Link>, '10', <FileTextOutlined />)
        ]),
        getItem(<Link to="/contents/imagesmanagement">X-ray 판독 배점관리</Link>, '11', <BlockOutlined />),
        getItem(<Link to="/contents/imagesmanagement">교육 타입관리</Link>, '12', <BlockOutlined />)
    ]),

    getItem('교육 관리', 'sub3', <AppstoreAddOutlined />, [
        getItem('교육과정 관리', 'g6', <BlockOutlined />, [
            getItem(<Link to="/contents/imagesmanagement">그룹 관리</Link>, '13', <FileTextOutlined />),
            getItem(<Link to="/contents/imagesmanagement">과정 분류</Link>, '14', <FileTextOutlined />),
            getItem(<Link to="/contents/imagesmanagement">과정 등록</Link>, '15', <FileTextOutlined />)
        ]),
        getItem('교육차수 관리', 'g7', <BlockOutlined />, [
            getItem(<Link to="/contents/imagesmanagement">차수 등록</Link>, '16', <FileTextOutlined />),
            getItem(<Link to="/contents/imagesmanagement">차수별 메뉴관리</Link>, '17', <FileTextOutlined />)
        ]),
        getItem(<Link to="/contents/imagesmanagement">교육과정</Link>, '177', <FileTextOutlined />)
    ]),

    getItem('교육생 관리', 'sub4', <AppstoreAddOutlined />, [
        getItem(<Link to="/contents/imagesmanagement">교육생 정보조회</Link>, '18', <FileTextOutlined />),
        getItem(<Link to="/contents/imagesmanagement">교육생 차수관리</Link>, '19', <FileTextOutlined />)
        // getItem('교육생 좌석관리', '20', <FileTextOutlined />)
    ]),

    getItem('강사 관리', 'sub5', <AppstoreAddOutlined />, [
        getItem('교육생 좌석 배치', '21', <FileTextOutlined />),
        getItem('교육생 과정 진행도', '22', <FileTextOutlined />),
        getItem('교육생 평가 관리', '23', <FileTextOutlined />),
        getItem('교육 환경설정', '24', <FileTextOutlined />)
    ]),

    getItem('통계', 'sub6', <AppstoreAddOutlined />, [
        getItem('교육실적조회', 'g8', <BlockOutlined />, [
            getItem(<Link to="/contents/imagesmanagement">평가점수 조회</Link>, '26', <FileTextOutlined />),
            getItem(<Link to="/contents/imagesmanagement">교육평가 조회</Link>, '27', <FileTextOutlined />),
            getItem(<Link to="/contents/imagesmanagement">문제별 오답률 조회</Link>, '28', <FileTextOutlined />),
            // getItem('설문조사 결과 조회', '29', <FileTextOutlined />),
            getItem(<Link to="/contents/imagesmanagement">교육생 평가 조회</Link>, '30', <FileTextOutlined />)
        ]),
        getItem('최종평가조회', 'g9', <BlockOutlined />, [
            getItem(<Link to="/contents/imagesmanagement">교육생 점수 순위조회</Link>, '31', <FileTextOutlined />),
            getItem(<Link to="/contents/imagesmanagement">기관별 평가 점수 조회</Link>, '32', <FileTextOutlined />),
            getItem(<Link to="/contents/imagesmanagement">연도/회차별 교육평균 조회</Link>, '33', <FileTextOutlined />)
        ])
    ]),

    getItem('환경설정', 'sub7', <AppstoreAddOutlined />, [
        getItem(<Link to="/contents/imagesmanagement">공지사항 관리</Link>, '34', <FileTextOutlined />),
        getItem('설문조사 관리', '35', <FileTextOutlined />),
        getItem('강의실 관리', '36', <FileTextOutlined />),
        getItem(<Link to="/contents/imagesmanagement">공통코드 관리</Link>, '37', <FileTextOutlined />),
        getItem('교육생 권한 관리', '38', <FileTextOutlined />),
        getItem('관리자 권한 관리', '39', <FileTextOutlined />),
        getItem('사용자 관리', '40', <FileTextOutlined />),
        getItem('컴포넌트 관리', '41', <FileTextOutlined />),
        getItem('메시지 관리', '42', <FileTextOutlined />)
    ])
];
const LeftMenus = () => {
    const [defaultSelectedKeys] = useState(cookies.load('defaultSelectedKey') === undefined ? '' : cookies.load('defaultSelectedKey'));
    const [defaultOpenKeys] = useState(cookies.load('defaultOpenKey') === undefined ? '' : cookies.load('defaultOpenKey'));
    const [defaultOpenKeySubs] = useState(cookies.load('defaultOpenKeySub') === undefined ? '' : cookies.load('defaultOpenKeySub'));

    const onClick = (e) => {
        const expires = new Date();
        expires.setMinutes(expires.getDay() + 1);
        cookies.save('defaultSelectedKey', e.keyPath[0], expires);
        cookies.save('defaultOpenKey', e.keyPath[2], expires);
        cookies.save('defaultOpenKeySub', e.keyPath[1], expires);
    };

    // const theme = useTheme();
    // const navigate = useNavigate();

    const DashCalls = () => {
        cookies.remove('defaultSelectedKey', { path: '/' }, 1000);
        cookies.remove('defaultOpenKey', { path: '/' }, 1000);
        cookies.remove('defaultOpenKeySub', { path: '/' }, 1000);

        // navigate('/');
        window.location.replace('/');
        // location.reload();
    };

    return (
        <>
            <DrawerHeaderStyled sx={{ height: '120px' }}>
                <Stack direction="row" spacing={1} alignItems="center" onClick={DashCalls}>
                    <Link>
                        <div style={{ textAlign: 'center', fontSize: '18px' }}>XBT ADMINISTRATOR</div>
                        <div style={{ textAlign: 'center', fontSize: '12px', color: '#fff' }}>X-ray Based Training System</div>
                    </Link>
                </Stack>
            </DrawerHeaderStyled>

            <Menu
                onClick={onClick}
                defaultSelectedKeys={[defaultSelectedKeys]}
                defaultOpenKeys={[defaultOpenKeys, defaultOpenKeySubs]}
                mode="inline"
                inlineCollapsed={!open}
                items={items}
                theme={'dark'}
            />
        </>
    );
};
export default LeftMenus;
