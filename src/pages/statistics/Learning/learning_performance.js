/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Table, Badge, Button, Modal } from 'antd';
import { Typography } from '@mui/material';

// project import
import MainCard from 'components/MainCard';

export const Learning_Performance = () => {
    const { confirm } = Modal;
    const [loading, setLoading] = useState(false);
    const [stuloading, setStuLoading] = useState(false);
    const [cntloading, setCntLoading] = useState(false);

    const [ModalOpen, setModalOpen] = useState(false); // Modal창
    const [ModalTitle, setModalTitle] = useState(null); // Modal Title
    const [CntModalOpen, setCntModalOpen] = useState(false); // Modal창
    const [CntModalTitle, setCntModalTitle] = useState(null); // Modal Title

    // 학습 실적 Data
    const [dataSource, setDataSource] = useState([
        {
            rowdata0: '1',
            rowdata1: '2023',
            rowdata2: '항공보안검색요원 초기 교육과정 [5차]',
            rowdata3: '80',
            rowdata4: '40'
        },
        {
            rowdata0: '2',
            rowdata1: '2023',
            rowdata2: '항공경비요원 초기 교육과정 [5차]',
            rowdata3: '70',
            rowdata4: '40'
        },
        {
            rowdata0: '3',
            rowdata1: '2023',
            rowdata2: '항공보안검색요원 정기 교육과정 [4차]',
            rowdata3: '90',
            rowdata4: '45'
        },
        {
            rowdata0: '4',
            rowdata1: '2023',
            rowdata2: '항공경비요원 정기 교육과정 [4차]',
            rowdata3: '88',
            rowdata4: '50'
        },
        {
            rowdata0: '5',
            rowdata1: '2023',
            rowdata2: '항공보안검색요원 초기 교육과정 [3차]',
            rowdata3: '80',
            rowdata4: '40'
        },
        {
            rowdata0: '6',
            rowdata1: '2023',
            rowdata2: '항공경비요원 초기 교육과정 [3차]',
            rowdata3: '76',
            rowdata4: '35'
        },
        {
            rowdata0: '7',
            rowdata1: '2022',
            rowdata2: '항공보안검색요원 초기 교육과정 [2차]',
            rowdata3: '90',
            rowdata4: '40'
        },
        {
            rowdata0: '8',
            rowdata1: '2022',
            rowdata2: '항공경비요원 초기 교육과정 [2차]',
            rowdata3: '90',
            rowdata4: '40'
        },
        {
            rowdata0: '9',
            rowdata1: '2022',
            rowdata2: '항공보안검색요원 정기 교육과정 [1차]',
            rowdata3: '80',
            rowdata4: '30'
        },
        {
            rowdata0: '10',
            rowdata1: '2022',
            rowdata2: '항공경비요원 정기 교육과정 [1차]',
            rowdata3: '70',
            rowdata4: '35'
        },
        {
            rowdata0: '11',
            rowdata1: '2022',
            rowdata2: '항공보안검색요원 초기 교육과정 [1차]',
            rowdata3: '60',
            rowdata4: '45'
        }
    ]);

    // 학습 교육생 Data
    const [studataSource, setStuDataSource] = useState([
        {
            rowdata0: '1',
            rowdata1: '홍길동',
            rowdata2: '80',
            rowdata3: '60',
            rowdata4: '20',
            rowdata5: '2'
        }
    ]);

    // 학습횟수 Data
    const [cntdataSource, setCntDataSource] = useState([
        {
            rowdata0: '1',
            rowdata1: '80',
            rowdata2: '25',
            rowdata3: '15'
        },
        {
            rowdata0: '2',
            rowdata1: '60',
            rowdata2: '35',
            rowdata3: '5'
        }
    ]);

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
            align: 'center'
        },
        {
            title: '평균점수',
            dataIndex: 'rowdata3',
            align: 'center',
            render: (_, { rowdata3 }) => (
                <>
                    <Badge
                        style={{ width: '60px', height: '25px', lineHeight: '25px' }}
                        count={rowdata3.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        status={rowdata3 >= '90' ? 'success' : rowdata3 < '80' ? 'error' : 'warning'}
                        overflowCount={99}
                    />
                </>
            )
        },
        {
            title: '교육인원',
            dataIndex: 'rowdata4',
            align: 'center',
            render: (_, { rowdata1, rowdata2, rowdata4 }) => (
                <>
                    <Button
                        style={{
                            border: '0xp',
                            background: '#1677ff',
                            color: '#fff',
                            borderRadius: '7px',
                            width: '70px',
                            boxShadow: '2px 3px 0px 0px #e8f2ff'
                        }}
                        onClick={() => Student_Default(rowdata1, rowdata2)}
                    >
                        {rowdata4}
                    </Button>
                </>
            )
        }
    ];

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
                        style={{ width: '60px', height: '25px', lineHeight: '25px' }}
                        count={rowdata2.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        color="blue"
                        overflowCount={99}
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
                        style={{ width: '60px', height: '25px', lineHeight: '25px' }}
                        count={rowdata3.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        color="green"
                        overflowCount={99}
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
                        style={{ width: '60px', height: '25px', lineHeight: '25px' }}
                        count={rowdata4.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        color="volcano"
                        overflowCount={99}
                    />
                </>
            )
        },
        {
            title: '학습횟수',
            dataIndex: 'rowdata6',
            align: 'center',
            render: (_, { rowdata1, rowdata5 }) => (
                <>
                    <Button
                        style={{
                            border: '0xp',
                            background: '#1677ff',
                            color: '#fff',
                            borderRadius: '7px',
                            width: '70px',
                            boxShadow: '2px 3px 0px 0px #e8f2ff'
                        }}
                        onClick={() => Cnt_Default(rowdata1)}
                    >
                        {rowdata5}회
                    </Button>
                </>
            )
        }
    ];

    // 학습 횟수 컬럼
    const cntdefaultColumns = [
        {
            title: '횟수',
            dataIndex: 'rowdata0',
            align: 'center',
            render: (_, { rowdata0 }) => <>{rowdata0}회</>
        },
        {
            title: '점수',
            dataIndex: 'rowdata1',
            align: 'center',
            render: (_, { rowdata1 }) => (
                <>
                    <Badge
                        style={{ width: '60px', height: '25px', lineHeight: '25px' }}
                        count={rowdata1.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        color="gold"
                        overflowCount={99}
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
                        style={{ width: '60px', height: '25px', lineHeight: '25px' }}
                        count={rowdata2.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        color="green"
                        overflowCount={99}
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
                        style={{ width: '60px', height: '25px', lineHeight: '25px' }}
                        count={rowdata3.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        color="volcano"
                        overflowCount={99}
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

    const Student_Default = (title1, title2) => {
        setModalTitle(`${title1}년 ${title2}`);
        setModalOpen(true);
    };

    const handleCancel = () => {
        setModalTitle(null);
        setModalOpen(false);
    };

    const Cnt_Default = (title1) => {
        setCntModalTitle(title1);
        setCntModalOpen(true);
    };

    const cnt_handleCancel = () => {
        setCntModalOpen(false);
    };

    return (
        <>
            <MainCard title="학습 실적 조회">
                <Typography variant="body1">Search </Typography>
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
