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
            getItem(<Link to="/contents/imagesmanagement">이미지 관리</Link>, '3', <FileTextOutlined />)
        ]),
        getItem('X-ray 콘텐츠 관리', 'g2', <BlockOutlined />, [
            getItem(<Link to="/contents/xrayinformation">정보 관리</Link>, '4', <FileTextOutlined />),
            getItem(<Link to="/contents/xrayinformationimage">이미지 관리</Link>, '5', <FileTextOutlined />)
        ])
    ]),

    getItem('강사 관리', 'sub2', <AppstoreAddOutlined />, [
        getItem(<Link to="/teacher/teacherinformation">강사 정보조회</Link>, '6', <FileTextOutlined />),
        getItem(<Link to="/teacher/theoryinformation">이론강의 정보조회</Link>, '7', <FileTextOutlined />),
        getItem(<Link to="/teacher/teacherstudent">교육생 조회</Link>, '8', <FileTextOutlined />)
    ]),

    getItem('학습 관리', 'sub3', <AppstoreAddOutlined />, [
        getItem(<Link to="/learning/curriculum">모듈 관리</Link>, '10', <FileTextOutlined />),
        getItem(<Link to="/educurriculum/eduprocadd">차수 관리</Link>, '177', <FileTextOutlined />),
        getItem(<Link to="/learning/xraypoint">배점 관리</Link>, '11', <BlockOutlined />)
    ]),

    getItem('이론 교육 관리', 'sub4', <AppstoreAddOutlined />, [
        getItem(<Link to="/theory/theorygroup">그룹 관리</Link>, '12', <FileTextOutlined />),
        getItem(<Link to="/theory/theoryinfo">교육 관리</Link>, '13', <FileTextOutlined />)
    ]),

    getItem('교육생 관리', 'sub5', <AppstoreAddOutlined />, [
        getItem(<Link to="/student/studentinformation">교육생 정보조회</Link>, '18', <FileTextOutlined />)
    ]),

    getItem('통계', 'sub6', <AppstoreAddOutlined />, [
        getItem('교육실적조회', 'g8', <BlockOutlined />, [
            getItem(<Link to="/statistics/evaluationscore">평가점수 조회</Link>, '27', <FileTextOutlined />),
            getItem(<Link to="/statistics/wronganswerrate">문제별 오답률 조회</Link>, '29', <FileTextOutlined />)
            // getItem('설문조사 결과 조회', '29', <FileTextOutlined />),
        ])
    ]),

    getItem('환경설정', 'sub7', <AppstoreAddOutlined />, [
        getItem(<Link to="/preferences/notices">공지사항 관리</Link>, '34', <FileTextOutlined />),
        getItem(<Link to="/preferences/commoncode">공통코드 관리</Link>, '37', <FileTextOutlined />),
        getItem('메뉴관리', '41', <FileTextOutlined />),
        getItem(<Link to="/preferences/system">시스템메세지 관리</Link>, '38', <FileTextOutlined />)
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
