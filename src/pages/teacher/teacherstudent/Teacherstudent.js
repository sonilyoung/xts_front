/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
// import { Typography } from '@mui/material';
import { Typography, Table, Tag, Tooltip, Button, Descriptions, Modal, Input, Divider } from 'antd';

const { Title } = Typography;

import { useSelectUserListMutation } from '../../../hooks/api/StudentsManagement/StudentsManagement';

import { FileProtectOutlined } from '@ant-design/icons';

// project import
import MainCard from 'components/MainCard';
import { Space } from '../../../../node_modules/antd/lib/index';

export const Teacherstudent = () => {
    const { confirm } = Modal;
    const [dataSource, setDataSource] = useState([]); // Table 데이터 값
    const [loading, setLoading] = useState(false);

    const [selectedRowKeys, setSelectedRowKeys] = useState([]); //셀렉트 박스 option Selected 값
    const [evalOpen, setEvalOpen] = useState(false);

    // ===============================
    // Api 호출 Start
    // 조회 ======================================================
    const [SelectUserListApi] = useSelectUserListMutation(); // 교육생 정보 hooks api호출
    const [selectUserListData, setSelectUserListData] = useState(); // 교육생 정보 리스트 값
    const handle_SelectUserList_Api = async () => {
        const SelectUserListresponse = await SelectUserListApi({});
        setSelectUserListData(SelectUserListresponse?.data?.RET_DATA);
        setDataSource([
            ...SelectUserListresponse?.data?.RET_DATA.map((d, i) => ({
                key: d.userId,
                userNo: i + 1,
                userId: d.userId,
                userNm: d.userNm,
                userPw: d.userPw,
                userPhoto: d.userPhoto,
                iauthCd: d.iauthCd,
                authNm: d.authNm,
                company: d.company,
                dept: d.dept,
                position: d.position,
                trainingDiv: d.trainingDiv,
                telNo: d.telNo,
                hpNo: d.hpNo,
                email: d.email,
                eduName: d.eduName,
                writeDate: d.writeDate,
                loginStart: d.loginStart,
                loginLast: d.loginLast,
                loginError: d.loginError,
                pwPrior: d.pwPrior,
                pwChange: d.pwChange,
                pwUpdate: d.pwUpdate,
                pwPeriod: d.pwPeriod,
                useYn: d.useYn,
                insertId: d.insertId,
                insertDate: d.insertDate,
                updateId: d.updateId,
                updateDate: d.updateDate
            }))
        ]);
        setLoading(false);
    };

    // Api 호출 End
    // ===============================
    const columns = [
        {
            width: '70px',
            title: 'No',
            dataIndex: 'userNo',
            sorter: (a, b) => a.userNo - b.userNo,
            ellipsis: true,
            align: 'center'
        },
        {
            width: '170px',
            title: '교육생 ID',
            dataIndex: 'userId',
            sorter: (a, b) => a.userId.length - b.userId.length,
            ellipsis: true,
            align: 'center'
        },
        {
            width: '170px',
            title: '교육생 명',
            dataIndex: 'userNm',
            sorter: (a, b) => a.userNm.length - b.userNm.length,
            ellipsis: true,
            align: 'center'
        },
        {
            width: '180px',
            title: '기관',
            dataIndex: 'company',
            align: 'center'
        },
        // {
        //     width: '110px',
        //     title: '부서',
        //     dataIndex: 'dept',
        //     align: 'center'
        // },
        // {
        //     width: '110px',
        //     title: '직위',
        //     dataIndex: 'position',
        //     align: 'center'
        // },
        {
            width: '170px',
            title: '교육 구분',
            dataIndex: 'eduName',
            align: 'center'
        },
        {
            width: '100px',
            title: '평가 가중치',
            dataIndex: 'writeDate',
            align: 'center',
            render: (_, { userId }) => (
                <>
                    <Space>
                        <Tooltip title="XBT" color="#108ee9">
                            <Button
                                type="primary"
                                style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                icon={<FileProtectOutlined />}
                                onClick={() => setEvalOpen(true)}
                            >
                                66점
                            </Button>
                        </Tooltip>
                    </Space>
                </>
            )
        },
        {
            width: '85px',
            title: '사용여부',
            dataIndex: 'useYn',
            align: 'center',
            render: (_, { useYn }) => (
                <>
                    {useYn === 'Y' ? (
                        <Tag color={'green'} key={useYn}>
                            사용
                        </Tag>
                    ) : (
                        <Tag color={'volcano'} key={useYn}>
                            미사용
                        </Tag>
                    )}
                </>
            )
        },
        {
            width: '140px',
            title: '학격여부',
            align: 'center',
            render: (_, { useYn }) => <>{useYn === 'Y' ? '합격' : '불합격'}</>
        },
        {
            width: '110px',
            title: '등록일자',
            dataIndex: 'insertDate',
            align: 'center'
        }
    ];

    // Modal 닫기
    const handleCancel = () => {
        setEvalOpen(false);
    };

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
        //setSortedInfo(sorter);
    };

    //체크 박스 이벤트
    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    //체크 박스 선택
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange
    };

    useEffect(() => {
        setLoading(true);
        handle_SelectUserList_Api();
    }, []);

    return (
        <>
            <MainCard title="교육생 정보조회">
                <Typography variant="body1">
                    <Table
                        columns={columns}
                        dataSource={dataSource}
                        rowSelection={{ ...rowSelection }}
                        bordered={true}
                        onChange={onChange}
                        loading={loading}
                    />
                </Typography>
            </MainCard>

            {/* 평가, 가중치 점수 - XBT평가, 이론평가, 실습평가 */}
            <Modal
                open={evalOpen}
                closable={false}
                width={1100}
                style={{
                    left: 130,
                    zIndex: 999
                }}
                footer={[
                    <Button
                        type="primary"
                        onClick={handleCancel}
                        style={{ width: '100px', borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                    >
                        Close
                    </Button>
                ]}
            >
                <Space>
                    <Descriptions title="※ XBT 평가" layout="vertical" bordered column={5}>
                        <Descriptions.Item style={{ textAlign: 'center', width: '190px' }} label="평가명">
                            XBT 평가
                        </Descriptions.Item>
                        <Descriptions.Item style={{ textAlign: 'center' }} label="문항수">
                            10
                        </Descriptions.Item>
                        <Descriptions.Item style={{ textAlign: 'center' }} label="정답">
                            8
                        </Descriptions.Item>
                        <Descriptions.Item style={{ textAlign: 'center' }} label="오답">
                            2
                        </Descriptions.Item>
                        <Descriptions.Item style={{ textAlign: 'center' }} label="평점">
                            80
                        </Descriptions.Item>
                    </Descriptions>
                    <Title level={1} style={{ marginTop: '65px', marginLeft: '30px' }}>
                        X
                    </Title>
                    <Descriptions layout="vertical" bordered style={{ marginTop: '45px', marginLeft: '30px' }}>
                        <Descriptions.Item style={{ textAlign: 'center' }} label="XBT 평가 가중치(%) ">
                            30%
                        </Descriptions.Item>
                    </Descriptions>
                    <Title level={1} style={{ marginTop: '65px', marginLeft: '30px' }}>
                        =
                    </Title>
                    <Descriptions layout="vertical" bordered style={{ marginTop: '45px', marginLeft: '30px' }}>
                        <Descriptions.Item style={{ textAlign: 'center' }} label="XBT 평가 최종 점수">
                            32
                        </Descriptions.Item>
                    </Descriptions>
                </Space>
                <br />
                <br />
                <br />
                <Space>
                    <Descriptions title="※ 이론 평가" layout="vertical" bordered column={5}>
                        <Descriptions.Item style={{ textAlign: 'center', width: '190px' }} label="평가명">
                            이론 평가
                        </Descriptions.Item>
                        <Descriptions.Item style={{ textAlign: 'center' }} label="문항수">
                            45
                        </Descriptions.Item>
                        <Descriptions.Item style={{ textAlign: 'center' }} label="정답">
                            35
                        </Descriptions.Item>
                        <Descriptions.Item style={{ textAlign: 'center' }} label="오답">
                            10
                        </Descriptions.Item>
                        <Descriptions.Item style={{ textAlign: 'center' }} label="평점">
                            78
                        </Descriptions.Item>
                    </Descriptions>
                    <Title level={1} style={{ marginTop: '65px', marginLeft: '30px' }}>
                        X
                    </Title>
                    <Descriptions layout="vertical" bordered style={{ marginTop: '45px', marginLeft: '30px' }}>
                        <Descriptions.Item style={{ textAlign: 'center' }} label="이론 평가 가중치(%) ">
                            40%
                        </Descriptions.Item>
                    </Descriptions>
                    <Title level={1} style={{ marginTop: '65px', marginLeft: '30px' }}>
                        =
                    </Title>
                    <Descriptions layout="vertical" bordered style={{ marginTop: '45px', marginLeft: '30px' }}>
                        <Descriptions.Item style={{ textAlign: 'center' }} label="XBT 평가 최종 점수">
                            31
                        </Descriptions.Item>
                    </Descriptions>
                </Space>
                <br />
                <br />
                <br />
                <Space>
                    <Descriptions title="※ 실습 평가" layout="vertical" bordered column={3}>
                        <Descriptions.Item style={{ textAlign: 'center', width: '190px' }} label="평가명">
                            실습 평가
                        </Descriptions.Item>
                        <Descriptions.Item style={{ textAlign: 'center' }} label="점수">
                            <Input
                                name="choice"
                                placeholder="※ 실습 평가 점수"
                                // value={itemContainer?.choice4}
                                // onChange={(e) => {
                                //     setItemContainer({
                                //         ...itemContainer,
                                //         choice4: e.target.value
                                //     });
                                // }}
                                style={{ width: '145px' }}
                            />
                        </Descriptions.Item>
                        <Descriptions.Item style={{ textAlign: 'center' }} label="저장">
                            <Tooltip title="저장" placement="bottom" color="#108ee9">
                                <Button
                                    // onClick={onAddSubmit}
                                    style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                    type="primary"
                                >
                                    저장
                                </Button>
                            </Tooltip>
                        </Descriptions.Item>
                    </Descriptions>
                    <Title level={1} style={{ marginTop: '65px', marginLeft: '30px' }}>
                        X
                    </Title>
                    <Descriptions layout="vertical" bordered style={{ marginTop: '45px', marginLeft: '30px' }}>
                        <Descriptions.Item style={{ textAlign: 'center' }} label="실습 평가 가중치(%) ">
                            30%
                        </Descriptions.Item>
                    </Descriptions>
                    <Title level={1} style={{ marginTop: '65px', marginLeft: '30px' }}>
                        =
                    </Title>
                    <Descriptions layout="vertical" bordered style={{ marginTop: '45px', marginLeft: '30px' }}>
                        <Descriptions.Item style={{ textAlign: 'center' }} label="XBT 평가 최종 점수">
                            -
                        </Descriptions.Item>
                    </Descriptions>
                </Space>
            </Modal>
        </>
    );
};
