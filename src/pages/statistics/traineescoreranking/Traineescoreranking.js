/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Button, Table, Tag, Badge, Space, Modal } from 'antd';
import { Typography } from '@mui/material';

import { EyeOutlined } from '@ant-design/icons';
const { confirm } = Modal;

// project import
import MainCard from 'components/MainCard';

export const Traineescoreranking = () => {
    const [dataSource, setDataSource] = useState([]); // 상단 Table 데이터 값
    const [dataSourceSub, setDataSourceSub] = useState([]); // 하단 Table 데이터 값
    const [loading, setLoading] = useState(false);
    const [loadingSub, setLoadingSub] = useState(false);
    const [evaluationModalOpen, setEvaluationModalOpen] = useState(false); //평가 교육생 Modal
    const [subTable, setSubTable] = useState('');
    const [titleText, setTitleText] = useState('');

    const handleCall = () => {
        setDataSource([
            {
                rowdata0: '1',
                rowdata1: '2022',
                rowdata2: 'Test',
                rowdata3: '1차'
            },
            {
                rowdata0: '2',
                rowdata1: '2021',
                rowdata2: 'CBT X-ray',
                rowdata3: '1차'
            },
            {
                rowdata0: '3',
                rowdata1: '2020',
                rowdata2: 'X-ray 판독 초기',
                rowdata3: '2차'
            },
            {
                rowdata0: '4',
                rowdata1: '2019',
                rowdata2: 'X-ray 판독 초기',
                rowdata3: '1차'
            }
        ]);
        setLoading(false);
    };
    const handleCallSub = (keydata, keydata1, keydata2, keydata3) => {
        setTitleText(`${keydata1}, ${keydata2}, ${keydata3}`);
        keydata === '1'
            ? setDataSourceSub([
                  {
                      rowdata0: '1',
                      rowdata1: 'user2',
                      rowdata2: 'USER2',
                      rowdata3: '원자력연구원',
                      rowdata4: '0111',
                      rowdata5: '전체',
                      rowdata6: '2022-05-21 15:26:05',
                      rowdata7: '85',
                      rowdata8: 'X',
                      rowdata9: '합격',
                      rowdata10: '1'
                  },
                  {
                      rowdata0: '2',
                      rowdata1: 'hjh',
                      rowdata2: '황재홍',
                      rowdata3: '한수원(월성)',
                      rowdata4: '개발팀',
                      rowdata5: '전체',
                      rowdata6: '2022-05-21 14:56:51',
                      rowdata7: '82.5',
                      rowdata8: 'X',
                      rowdata9: '합격',
                      rowdata10: '1'
                  },
                  {
                      rowdata0: '3',
                      rowdata1: 'user1',
                      rowdata2: 'USER1',
                      rowdata3: '원자력환경공단',
                      rowdata4: 'G-ANTECH',
                      rowdata5: '전체',
                      rowdata6: '2022-05-21 15:21:41',
                      rowdata7: '82.5',
                      rowdata8: 'X',
                      rowdata9: '합격',
                      rowdata10: '1'
                  }
              ])
            : keydata === '2'
            ? setDataSourceSub([
                  {
                      rowdata0: '1',
                      rowdata1: 'test',
                      rowdata2: 'TestUser',
                      rowdata3: 'G-ANTECH',
                      rowdata4: '-',
                      rowdata5: '전체',
                      rowdata6: '2021-06-07 13:46:04',
                      rowdata7: '92.5',
                      rowdata8: 'X',
                      rowdata9: '합격',
                      rowdata10: '3'
                  },
                  {
                      rowdata0: '2',
                      rowdata1: 'ksk',
                      rowdata2: '김슬기',
                      rowdata3: '한수원(한빛)',
                      rowdata4: '개발팀',
                      rowdata5: '전체',
                      rowdata6: '2021-10-31 09:59:38',
                      rowdata7: '97.5',
                      rowdata8: 'X',
                      rowdata9: '합격',
                      rowdata10: '4'
                  }
              ])
            : keydata === '3'
            ? setDataSourceSub([
                  {
                      rowdata0: '1',
                      rowdata1: 'testuser1',
                      rowdata2: '테스트유저',
                      rowdata3: '원자력연료(주)',
                      rowdata4: '-',
                      rowdata5: '전체',
                      rowdata6: '2020-09-06 17:09:12',
                      rowdata7: '30',
                      rowdata8: 'X',
                      rowdata9: '불합격',
                      rowdata10: '1'
                  },
                  {
                      rowdata0: '2',
                      rowdata1: 'user3',
                      rowdata2: 'USER3',
                      rowdata3: '한수원(고리)',
                      rowdata4: '부서1',
                      rowdata5: '전체',
                      rowdata6: '2020-12-12 15:48:37',
                      rowdata7: '32.5',
                      rowdata8: 'X',
                      rowdata9: '불합격',
                      rowdata10: '3'
                  },
                  {
                      rowdata0: '3',
                      rowdata1: 'KKTS',
                      rowdata2: '대문자',
                      rowdata3: '한수원(본사)',
                      rowdata4: '-',
                      rowdata5: '전체',
                      rowdata6: '2020-10-30 17:48:44',
                      rowdata7: '30',
                      rowdata8: 'X',
                      rowdata9: '불합격',
                      rowdata10: '4'
                  },
                  {
                      rowdata0: '4',
                      rowdata1: 'kkt',
                      rowdata2: '설현',
                      rowdata3: '한수원(한울)',
                      rowdata4: '개발팀',
                      rowdata5: '전체',
                      rowdata6: '2020-07-12 23:00:18',
                      rowdata7: '25',
                      rowdata8: 'X',
                      rowdata9: '불합격',
                      rowdata10: '4'
                  }
              ])
            : keydata === '4'
            ? setDataSourceSub([
                  {
                      rowdata0: '1',
                      rowdata1: 'yun',
                      rowdata2: '윤은석',
                      rowdata3: '그린피아',
                      rowdata4: 'SI사업본부',
                      rowdata5: '전체',
                      rowdata6: '2019-07-25 18:20:19',
                      rowdata7: '20',
                      rowdata8: 'O',
                      rowdata9: '불합격',
                      rowdata10: '1'
                  },
                  {
                      rowdata0: '2',
                      rowdata1: 'kt',
                      rowdata2: '태희',
                      rowdata3: '한수원(한빛)',
                      rowdata4: '-',
                      rowdata5: '전체',
                      rowdata6: '2019-06-17 10:27:51',
                      rowdata7: '32.5',
                      rowdata8: 'X',
                      rowdata9: '불합격',
                      rowdata10: '3'
                  }
              ])
            : setDataSourceSub([]);
        setLoadingSub(false);
    };
    const defaultColumns = [
        {
            width: '70px',
            title: 'No.',
            dataIndex: 'rowdata0',
            align: 'center'
        },
        {
            width: '80px',
            title: '교육년도',
            dataIndex: 'rowdata1',
            align: 'center'
        },
        {
            title: '과정명',
            dataIndex: 'rowdata2',
            align: 'center'
        },
        {
            width: '80px',
            title: '과정차수',
            dataIndex: 'rowdata3',
            align: 'center'
        },
        {
            width: '180px',
            title: '평가 교육생',
            dataIndex: '',
            align: 'center',
            key: 'rowdata1',
            render: (record) => (
                <Space wrap>
                    <Button
                        type="primary"
                        onClick={() => Evaluation_Detail(record.rowdata0, record.rowdata1, record.rowdata2, record.rowdata3)}
                        style={{ width: '130px', borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                        icon={<EyeOutlined />}
                    >
                        평가 교육생
                    </Button>
                </Space>
            )
        }
    ];

    const defaultColumnsSub = [
        {
            width: '80px',
            title: 'No.',
            dataIndex: 'rowdata0',
            align: 'center'
        },
        {
            width: '120px',
            title: '교육생ID',
            dataIndex: 'rowdata1',
            align: 'center'
        },
        {
            title: '교육생명',
            dataIndex: 'rowdata2',
            align: 'center'
        },
        {
            title: '기관',
            dataIndex: 'rowdata3',
            align: 'center'
        },
        {
            title: '부서',
            dataIndex: 'rowdata4',
            align: 'center'
        },
        {
            width: '80px',
            title: '평가과목',
            dataIndex: 'rowdata5',
            align: 'center'
        },
        {
            title: '평가일자',
            dataIndex: 'rowdata6',
            align: 'center'
        },
        {
            width: '80px',
            title: '취득점수',
            dataIndex: 'rowdata7',
            align: 'center',
            render: (_, { rowdata7 }) => (
                <>
                    <Badge count={rowdata7.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} color="#87d068" overflowCount={9999} />
                </>
            )
        },
        {
            width: '110px',
            title: '금지물품금지여부',
            dataIndex: 'rowdata8',
            align: 'center',
            render: (_, { rowdata8 }) =>
                rowdata8 === 'O' ? (
                    <Tag style={{ width: '60px', borderRadius: '5px', padding: '0 10px' }} color="#87d068">
                        {rowdata8}
                    </Tag>
                ) : (
                    <Tag style={{ width: '60px', borderRadius: '5px', padding: '0 10px' }}> {rowdata8}</Tag>
                )
        },
        {
            width: '100px',
            title: '합격여부',
            dataIndex: 'rowdata9',
            align: 'center',
            render: (_, { rowdata9 }) =>
                rowdata9 === '합격' ? (
                    <Tag style={{ width: '60px', borderRadius: '5px', padding: '0 10px' }} color="#87d068">
                        {rowdata9}
                    </Tag>
                ) : (
                    <Tag style={{ width: '60px', borderRadius: '5px', padding: '0 10px' }}> {rowdata9}</Tag>
                )
        },
        {
            width: '80px',
            title: '평가횟수',
            dataIndex: 'rowdata10',
            align: 'center',
            render: (_, { rowdata10 }) => (
                <>
                    <Badge count={rowdata10.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} color="#2db7f5" overflowCount={9999} />
                </>
            )
        }
    ];

    // 평가과목 Modal
    const Evaluation_Detail = (keydata, keydata1, keydata2, keydata3) => {
        setEvaluationModalOpen(true);
        setSubTable(keydata);
        handleCallSub(keydata, keydata1, keydata2, keydata3);
    };

    const Evaluation_handleOk = () => {
        setEvaluationModalOpen(false);
    };

    const Evaluation_handleCancel = () => {
        setEvaluationModalOpen(false);
    };

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

    const columnsSub = defaultColumnsSub.map((col) => {
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

    useEffect(() => {
        setLoading(true); // 로딩 호출
        handleCall(); // api 호출
    }, []);

    return (
        <>
            <MainCard title="교육생 점수 순위 조회">
                <Typography variant="body1"></Typography>
                <Table
                    bordered
                    dataSource={dataSource}
                    loading={loading}
                    columns={columns}
                    rowClassName={(record) => {
                        return record.rowdata0 === subTable ? `table-row-lightblue` : '';
                    }}
                />
            </MainCard>

            {/* 모달 창 Start */}
            <Modal
                open={evaluationModalOpen}
                onOk={Evaluation_handleOk}
                onCancel={Evaluation_handleCancel}
                width={1250}
                style={{
                    left: 100
                }}
                footer={[
                    <Button
                        type="primary"
                        onClick={Evaluation_handleCancel}
                        style={{ width: '100px', borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                    >
                        Close
                    </Button>
                ]}
            >
                <MainCard title={`평가 교육생 [${titleText}]`} style={{ marginTop: 30 }}>
                    <Typography variant="body1">
                        <Table size="Middle" bordered={true} dataSource={dataSourceSub} loading={loadingSub} columns={columnsSub} />
                    </Typography>
                </MainCard>
            </Modal>
            {/* 모달 창 End */}
        </>
    );
};
// export default Traineescoreranking;
