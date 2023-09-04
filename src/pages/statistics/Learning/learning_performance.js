/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Table, Badge, Button, Modal, Row, Col, Input, Space } from 'antd';
import { Typography } from '@mui/material';

import {
    useSelectStatisticsLearningListMutation,
    useSelectStatisticsLearningMutation,
    useSelectStatisticsLearningDetailMutation
} from '../../../hooks/api/StatisticsManagement/StatisticsManagement';

// project import
import MainCard from 'components/MainCard';

export const Learning_Performance = () => {
    const { confirm } = Modal;
    const [loading, setLoading] = useState(false);
    const [stuloading, setStuLoading] = useState(false);
    const [cntloading, setCntLoading] = useState(false);

    const [dataSource, setDataSource] = useState([]); // 학습 실적 Table 데이터 값
    const [studataSource, setStuDataSource] = useState([]); // 학습 실적 교육생 Table 데이터 값
    const [cntdataSource, setCntDataSource] = useState([]); // 학습 횟수 Table 데이터 값

    const [procCd_Value, setProcCd_Value] = useState(null);
    const [ModalOpen, setModalOpen] = useState(false); // Modal창
    const [ModalTitle, setModalTitle] = useState(null); // Modal Title
    const [CntModalOpen, setCntModalOpen] = useState(false); // Modal창
    const [CntModalTitle, setCntModalTitle] = useState(null); // Modal Title

    const [searchval, setSearchval] = useState(null);

    // 학습 실적 Data
    const [SelectStatisticsLearningListApi] = useSelectStatisticsLearningListMutation(); // 콘텐츠 정보 관리 hooks api호출
    const handel_SelectStatisticsLearningList_Api = async () => {
        const SelectStatisticsLearningListresponse = await SelectStatisticsLearningListApi({
            searchval: searchval
        });
        setDataSource([
            ...SelectStatisticsLearningListresponse?.data?.RET_DATA.map((d, i) => ({
                key: d.procCd /* 차수번호 */,
                rowdata0: i + 1,
                rowdata1: d.procYear /* 차수년도 */,
                rowdata2: d.procName /* 차수명 */,
                rowdata3: d.procSeq /* 차수 */,
                rowdata4: d.averageScore /* 평균 */,
                rowdata5: d.studentCnt /* 전체학생수 */,
                rowdata6: d.playStudentCnt /* 참여학생수 */
            }))
        ]);
        setLoading(false);
    };
    // 학습 실적 컬럼
    const defaultColumns = [
        {
            title: 'No.',
            dataIndex: 'rowdata0',
            align: 'center'
        },
        {
            title: '학습년도',
            dataIndex: 'rowdata1',
            align: 'center'
        },
        {
            title: '차수명 [차수]',
            dataIndex: 'rowdata2',
            align: 'center',
            render: (_, { rowdata2, rowdata3 }) => (
                <>
                    {rowdata2} [{rowdata3}차]
                </>
            )
        },
        {
            title: '평균점수',
            dataIndex: 'rowdata4',
            align: 'center',
            render: (_, { rowdata4 }) => (
                <>
                    <Badge
                        style={{ width: '35px', height: '35px', lineHeight: '35px', borderRadius: '50%' }}
                        count={rowdata4.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        status={rowdata4 >= '90' ? 'success' : rowdata4 < '80' ? 'error' : 'warning'}
                        overflowCount={999}
                    />
                </>
            )
        },
        {
            title: '교육인원',
            dataIndex: 'rowdata5',
            align: 'center',
            render: (_, { key, rowdata1, rowdata2, rowdata3, rowdata5, rowdata6 }) => (
                <>
                    <Button
                        style={{
                            border: '0xp',
                            background: '#1677ff',
                            color: '#fff',
                            borderRadius: '7px',
                            width: '70px',
                            boxShadow: '2px 3px 0px 0px #e3e3e3'
                        }}
                        onClick={() => Student_Default(rowdata1, rowdata2, rowdata3, key)}
                    >
                        {rowdata6} / {rowdata5}
                    </Button>
                </>
            )
        }
    ];

    // 학습 교육생 Data
    const [SelectStatisticsLearningApi] = useSelectStatisticsLearningMutation(); // 콘텐츠 정보 관리 hooks api호출
    const handel_SelectStatisticsLearning_Api = async (procCd_Value) => {
        const SelectStatisticsLearningresponse = await SelectStatisticsLearningApi({
            procCd: procCd_Value
        });
        setProcCd_Value(procCd_Value);
        setStuDataSource([
            ...SelectStatisticsLearningresponse?.data?.RET_DATA.map((d, i) => ({
                key: d.procCd /* 차수번호 */,
                rowdata0: i + 1,
                rowdata1: d.userName /* 교육생 명 */,
                rowdata2: d.totalCnt /* 총문항수 */,
                rowdata3: d.rightCnt /* 정답수 */,
                rowdata4: d.wrongCnt /* 오답수 */,
                rowdata5: d.trySeq /* 학습횟수 */,
                rowdata6: d.userId /* 교육생 아이디 */
            }))
        ]);
        setStuLoading(false);
    };
    // 학습 교육생 컬럼
    const studefaultColumns = [
        {
            title: 'No.',
            dataIndex: 'rowdata0',
            align: 'center'
        },
        {
            title: '교육생',
            dataIndex: 'rowdata1',
            align: 'center'
        },
        {
            title: '총문항수',
            dataIndex: 'rowdata2',
            align: 'center',
            render: (_, { rowdata2 }) => (
                <>
                    <Badge
                        style={{ width: '35px', height: '35px', lineHeight: '35px', borderRadius: '50%' }}
                        count={rowdata2.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        color="blue"
                        overflowCount={999}
                    />
                </>
            )
        },
        {
            title: '정답수',
            dataIndex: 'rowdata3',
            align: 'center',
            render: (_, { rowdata3 }) => (
                <>
                    <Badge
                        style={{ width: '35px', height: '35px', lineHeight: '35px', borderRadius: '50%' }}
                        count={rowdata3.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        color="green"
                        overflowCount={999}
                    />
                </>
            )
        },
        {
            title: '오답수',
            dataIndex: 'rowdata4',
            align: 'center',
            render: (_, { rowdata4 }) => (
                <>
                    <Badge
                        style={{ width: '35px', height: '35px', lineHeight: '35px', borderRadius: '50%' }}
                        count={rowdata4.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        color="volcano"
                        overflowCount={999}
                    />
                </>
            )
        },
        {
            title: '학습횟수',
            dataIndex: 'rowdata5',
            align: 'center',
            render: (_, { rowdata1, rowdata5, rowdata6 }) => (
                <>
                    <Button
                        style={{
                            border: '0xp',
                            background: '#1677ff',
                            color: '#fff',
                            borderRadius: '7px',
                            width: '70px',
                            boxShadow: '2px 3px 0px 0px #e3e3e3'
                        }}
                        onClick={() => Cnt_Default(rowdata1, rowdata6)}
                    >
                        {rowdata5}회
                    </Button>
                </>
            )
        }
    ];

    // 학습횟수 Data
    const [SelectStatisticsLearningDetailApi] = useSelectStatisticsLearningDetailMutation(); // 콘텐츠 정보 관리 hooks api호출
    const handel_SelectStatisticsLearningDetail_Api = async (userId_Value) => {
        const SelectStatisticsLearningDetailresponse = await SelectStatisticsLearningDetailApi({
            procCd: procCd_Value,
            userId: userId_Value
        });
        setCntDataSource([
            ...SelectStatisticsLearningDetailresponse?.data?.RET_DATA.map((d, i) => ({
                key: d.procCd /*차수번호*/,
                rowdata0: d.trySeq /*횟수*/,
                rowdata1: d.gainScore /*점수*/,
                rowdata2: d.rightCnt /*정답수*/,
                rowdata3: d.wrongCnt /*오답수*/,
                rowdata4: d.totalCnt /*출제문항수*/
            }))
        ]);
        setCntLoading(false);
    };
    // 학습 횟수 컬럼
    const cntdefaultColumns = [
        {
            title: '횟수',
            dataIndex: 'rowdata0',
            align: 'center',
            render: (_, { rowdata0 }) => <>{rowdata0}회</>
        },
        {
            title: '출제문항수',
            dataIndex: 'rowdata4',
            align: 'center',
            render: (_, { rowdata4 }) => (
                <>
                    <Badge
                        style={{ width: '35px', height: '35px', lineHeight: '35px', borderRadius: '50%' }}
                        count={rowdata4.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        color="blue"
                        overflowCount={999}
                    />
                </>
            )
        },
        {
            title: '점수',
            dataIndex: 'rowdata1',
            align: 'center',
            render: (_, { rowdata1 }) => (
                <>
                    <Badge
                        style={{ width: '35px', height: '35px', lineHeight: '35px', borderRadius: '50%' }}
                        count={rowdata1.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        color="gold"
                        overflowCount={999}
                    />
                </>
            )
        },
        {
            title: '정답수',
            dataIndex: 'rowdata2',
            align: 'center',
            render: (_, { rowdata2 }) => (
                <>
                    <Badge
                        style={{ width: '35px', height: '35px', lineHeight: '35px', borderRadius: '50%' }}
                        count={rowdata2.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        color="green"
                        overflowCount={999}
                    />
                </>
            )
        },
        {
            title: '오답수',
            dataIndex: 'rowdata3',
            align: 'center',
            render: (_, { rowdata3 }) => (
                <>
                    <Badge
                        style={{ width: '35px', height: '35px', lineHeight: '35px', borderRadius: '50%' }}
                        count={rowdata3.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        color="volcano"
                        overflowCount={999}
                    />
                </>
            )
        }
    ];

    // 학습 실적 컬럼
    const columns = defaultColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title
                // handleSave
            })
        };
    });

    // 학습 교육생 컬럼
    const stucolumns = studefaultColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title
                // handleSave
            })
        };
    });

    // 학습 횟수 컬럼
    const cntcolumns = cntdefaultColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title
                // handleSave
            })
        };
    });

    // 교육생 조회
    const Student_Default = (title1, title2, title3, key) => {
        setModalTitle(`[${title1}년] ${title2} [${title3}차]`);
        setStuLoading(true);
        handel_SelectStatisticsLearning_Api(key);
        setModalOpen(true);
    };

    const handleCancel = () => {
        setModalTitle(null);
        setModalOpen(false);
    };

    // 학습 횟수 조회
    const Cnt_Default = (userNm, userId) => {
        setCntModalTitle(userNm);
        setCntLoading(true);
        handel_SelectStatisticsLearningDetail_Api(userId);
        setCntModalOpen(true);
    };

    const cnt_handleCancel = () => {
        setCntModalOpen(false);
    };

    const onSearch = (value) => {
        setSearchval(value);
    };

    useEffect(() => {
        setLoading(true); // 로딩 호출
        handel_SelectStatisticsLearningList_Api(); // 조회
    }, [searchval]);

    return (
        <>
            <MainCard title="학습 실적 조회">
                <Typography variant="body1">
                    <Row gutter={[8, 8]} style={{ marginBottom: 16 }}>
                        <Col span={12}>
                            <div style={{ display: 'flex', justifyContent: 'flex-start', fontSize: '14px' }}>
                                <Space size="middle">
                                    <Input.Search
                                        placeholder="※ 통합 검색 (학습년도, 차수명, 차수)"
                                        style={{ width: 483 }}
                                        onSearch={onSearch}
                                        allowClear
                                        enterButton
                                        size="middle"
                                        className="custom-search-input"
                                    />
                                </Space>
                            </div>
                        </Col>
                    </Row>
                </Typography>
                <Table rowClassName={() => 'editable-row'} bordered dataSource={dataSource} loading={loading} columns={columns} />
            </MainCard>

            {/* 교육생 Modal Start */}
            <Modal
                open={ModalOpen}
                // onOk={handleOk}
                onCancel={handleCancel}
                width={1000}
                style={{
                    left: 130,
                    zIndex: 999
                }}
                footer={null}
            >
                <MainCard title={`${ModalTitle}`} style={{ marginTop: '30px' }}>
                    <Typography variant="body1"></Typography>
                    <Table
                        rowClassName={() => 'editable-row'}
                        bordered
                        dataSource={studataSource}
                        loading={stuloading}
                        columns={stucolumns}
                    />
                </MainCard>
            </Modal>
            {/* 교육생 설정 Modal End */}

            {/* 학습횟수 Modal Start */}
            <Modal
                open={CntModalOpen}
                // onOk={handleOk}
                onCancel={cnt_handleCancel}
                width={600}
                style={{
                    left: 130,
                    zIndex: 999
                }}
                footer={null}
            >
                <MainCard title={`${ModalTitle} - [${CntModalTitle}]`} style={{ marginTop: '30px' }}>
                    <Typography variant="body1"></Typography>
                    <Table
                        rowClassName={() => 'editable-row'}
                        bordered
                        dataSource={cntdataSource}
                        loading={cntloading}
                        columns={cntcolumns}
                    />
                </MainCard>
            </Modal>
            {/* 교육생 설정 Modal End */}
        </>
    );
};
// export default Educationaleval;
