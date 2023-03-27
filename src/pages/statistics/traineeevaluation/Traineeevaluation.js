/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Table, Space, Tooltip, Tag, Badge, Modal } from 'antd';
import { Typography } from '@mui/material';

import { EyeOutlined } from '@ant-design/icons';
const { confirm } = Modal;

// project import
import MainCard from 'components/MainCard';

export const Traineeevaluation = () => {
    const [dataSource, setDataSource] = useState([]); // 상단 Table 데이터 값
    const [dataSourceSub, setDataSourceSub] = useState([]); // 하단 Table 데이터 값
    const [loading, setLoading] = useState(false);
    const [loadingSub, setLoadingSub] = useState(false);
    const [ModalOpen, setModalOpen] = useState(false); //평가 교육생 Modal
    const [subTable, setSubTable] = useState('');
    const [titleText, setTitleText] = useState('');

    const handleCall = () => {
        setDataSource([
            {
                rowdata0: '1',
                rowdata1: '2023',
                rowdata2: 'X-ray 판독 초급',
                rowdata3: '1차'
            },
            {
                rowdata0: '2',
                rowdata1: '2022',
                rowdata2: 'X-ray 판독 중급',
                rowdata3: '1차'
            },
            {
                rowdata0: '3',
                rowdata1: '2021',
                rowdata2: 'X-ray 판독 초급',
                rowdata3: '1차'
            },
            {
                rowdata0: '4',
                rowdata1: '2020',
                rowdata2: 'X-ray 판독 중급',
                rowdata3: '1차'
            },
            {
                rowdata0: '5',
                rowdata1: '2019',
                rowdata2: 'X-ray 판독 초급',
                rowdata3: '1차'
            },
            {
                rowdata0: '6',
                rowdata1: '2018',
                rowdata2: 'X-ray 판독 중급',
                rowdata3: '1차'
            },
            {
                rowdata0: '7',
                rowdata1: '2017',
                rowdata2: 'X-ray 판독 초급',
                rowdata3: '1차'
            },
            {
                rowdata0: '8',
                rowdata1: '2016',
                rowdata2: 'X-ray 판독 중급',
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
                      rowdata1: 'KKTS',
                      rowdata2: '대문자',
                      rowdata3: '한수원(본사)',
                      rowdata4: '',
                      rowdata5: '최종평가',
                      rowdata6: '2023-01-30',
                      rowdata7: 30,
                      rowdata8: 0,
                      rowdata9: '불합격',
                      rowdata10: 2,
                      rowdata11: 2,
                      rowdata12: 1,
                      rowdata13: 1
                  },
                  {
                      rowdata0: '2',
                      rowdata1: 'KKTS',
                      rowdata2: '대문자',
                      rowdata3: '한수원(본사)',
                      rowdata4: '',
                      rowdata5: '최종평가',
                      rowdata6: '2023-01-30',
                      rowdata7: 30,
                      rowdata8: 0,
                      rowdata9: '불합격',
                      rowdata10: 1,
                      rowdata11: 1,
                      rowdata12: 1,
                      rowdata13: 1
                  },
                  {
                      rowdata0: '3',
                      rowdata1: 'cbt01',
                      rowdata2: 'CBT01',
                      rowdata3: 'CBT',
                      rowdata4: 'CBT',
                      rowdata5: '단계평가',
                      rowdata6: '2023-01-22',
                      rowdata7: 35,
                      rowdata8: 6,
                      rowdata9: '불합격',
                      rowdata10: 1,
                      rowdata11: 1,
                      rowdata12: 1,
                      rowdata13: 1
                  }
              ])
            : keydata === '2'
            ? setDataSourceSub([
                  {
                      rowdata0: '1',
                      rowdata1: 'hjh',
                      rowdata2: '황재홍',
                      rowdata3: '한수원(월성)',
                      rowdata4: '개발팀',
                      rowdata5: '단계평가',
                      rowdata6: '2022-02-13',
                      rowdata7: 30,
                      rowdata8: 0,
                      rowdata9: '불합격',
                      rowdata10: 23,
                      rowdata11: 2,
                      rowdata12: 1,
                      rowdata13: 3
                  },
                  {
                      rowdata0: '2',
                      rowdata1: 'ksk',
                      rowdata2: '김슬기',
                      rowdata3: '한수원(한빛)',
                      rowdata4: '개발팀',
                      rowdata5: '단계평가',
                      rowdata6: '2022-04-16',
                      rowdata7: 30,
                      rowdata8: 0,
                      rowdata9: '불합격',
                      rowdata10: 22,
                      rowdata11: 2,
                      rowdata12: 1,
                      rowdata13: 2
                  },
                  {
                      rowdata0: '3',
                      rowdata1: 'kwj',
                      rowdata2: '김원중',
                      rowdata3: '한수원(광산)',
                      rowdata4: '개발팀',
                      rowdata5: '단계평가',
                      rowdata6: '2022-07-05',
                      rowdata7: 10,
                      rowdata8: 6,
                      rowdata9: '불합격',
                      rowdata10: 21,
                      rowdata11: 2,
                      rowdata12: 1,
                      rowdata13: 1
                  },
                  {
                      rowdata0: '4',
                      rowdata1: 'hgd',
                      rowdata2: '홍길동',
                      rowdata3: '한수원(연산)',
                      rowdata4: '개발팀',
                      rowdata5: '단계평가',
                      rowdata6: '2022-09-18',
                      rowdata7: 85,
                      rowdata8: 0,
                      rowdata9: '합격',
                      rowdata10: 1,
                      rowdata11: 1,
                      rowdata12: 1,
                      rowdata13: 1
                  },
                  {
                      rowdata0: '5',
                      rowdata1: 'hjh',
                      rowdata2: '황재홍',
                      rowdata3: '한수원(월성)',
                      rowdata4: '개발팀',
                      rowdata5: '단계평가',
                      rowdata6: '2022-11-21',
                      rowdata7: 82.5,
                      rowdata8: 0,
                      rowdata9: '합격',
                      rowdata10: 5,
                      rowdata11: 1,
                      rowdata12: 1,
                      rowdata13: 5
                  }
              ])
            : keydata === '3'
            ? setDataSourceSub([
                  {
                      rowdata0: '1',
                      rowdata1: 'hjh',
                      rowdata2: '황재홍',
                      rowdata3: '한수원(월성)',
                      rowdata4: '개발팀',
                      rowdata5: '단계평가',
                      rowdata6: '2021-05-21',
                      rowdata7: 87.5,
                      rowdata8: 0,
                      rowdata9: '합격',
                      rowdata10: 20,
                      rowdata11: 1,
                      rowdata12: 4,
                      rowdata13: 5
                  },
                  {
                      rowdata0: '2',
                      rowdata1: 'hjh',
                      rowdata2: '황재홍',
                      rowdata3: '한수원(월성)',
                      rowdata4: '개발팀',
                      rowdata5: '단계평가',
                      rowdata6: '2016-05-21',
                      rowdata7: 82.5,
                      rowdata8: 0,
                      rowdata9: '합격',
                      rowdata10: 19,
                      rowdata11: 1,
                      rowdata12: 4,
                      rowdata13: 4
                  }
              ])
            : keydata === '4'
            ? setDataSourceSub([
                  {
                      rowdata0: '1',
                      rowdata1: 'kkt',
                      rowdata2: '설현',
                      rowdata3: '한수원(한울)',
                      rowdata4: '개발팀',
                      rowdata5: '',
                      rowdata6: '2018-01-11',
                      rowdata7: 25,
                      rowdata8: 0,
                      rowdata9: '불합격',
                      rowdata10: 1,
                      rowdata11: 1,
                      rowdata12: 1,
                      rowdata13: 1
                  },
                  {
                      rowdata0: '2',
                      rowdata1: 'ksk',
                      rowdata2: '김슬기',
                      rowdata3: '한수원(한빛)',
                      rowdata4: '개발팀',
                      rowdata5: '단계평가',
                      rowdata6: '2017-09-13',
                      rowdata7: 30,
                      rowdata8: 0,
                      rowdata9: '불합격',
                      rowdata10: 6,
                      rowdata11: 1,
                      rowdata12: 2,
                      rowdata13: 1
                  },
                  {
                      rowdata0: '3',
                      rowdata1: 'kt',
                      rowdata2: '태희',
                      rowdata3: '한수원(한빛)',
                      rowdata4: '',
                      rowdata5: '단계평가',
                      rowdata6: '2016-06-13',
                      rowdata7: 99,
                      rowdata8: 0,
                      rowdata9: '합격',
                      rowdata10: 1,
                      rowdata11: 1,
                      rowdata12: 1,
                      rowdata13: 1
                  }
              ])
            : setDataSourceSub([]);
        setLoadingSub(false);
    };

    const defaultColumns = [
        {
            width: '80px',
            title: 'No.',
            dataIndex: 'rowdata0',
            align: 'center'
        },
        {
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
            title: '과정차수',
            dataIndex: 'rowdata3',
            align: 'center'
        },
        {
            width: '180px',
            title: '교육생 정보',
            dataIndex: '',
            align: 'center',
            key: 'rowdata1',
            render: (_, { rowdata0, rowdata1, rowdata2, rowdata3 }) => (
                <Space wrap>
                    <Button
                        type="primary"
                        onClick={() => Edu_Detail(rowdata0, rowdata1, rowdata2, rowdata3)}
                        style={{ width: '130px', borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                        icon={<EyeOutlined />}
                    >
                        교육생 정보
                    </Button>
                </Space>
            )
        }
    ];

    const defaultColumnsSub = [
        {
            width: '60px',
            title: 'No.',
            dataIndex: 'rowdata0',
            align: 'center'
        },
        {
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
            title: '금지물품금지여부',
            dataIndex: 'rowdata8',
            align: 'center'
        },
        {
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
            title: '평가횟수',
            dataIndex: 'rowdata10',
            align: 'center',
            render: (_, { rowdata10 }) => (
                <>
                    <Badge count={rowdata10.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} color="#2db7f5" overflowCount={9999} />
                </>
            )
        },
        {
            title: '평가회차',
            dataIndex: 'rowdata11',
            align: 'center',
            render: (_, { rowdata11 }) => (
                <>
                    <Badge count={rowdata11.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} color="#55acee" overflowCount={9999} />
                </>
            )
        },
        {
            title: '단계',
            dataIndex: 'rowdata12',
            align: 'center',
            render: (_, { rowdata12 }) => (
                <>
                    <Badge count={rowdata12.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} color="#108ee9" overflowCount={9999} />
                </>
            )
        },
        {
            title: '세트',
            dataIndex: 'rowdata13',
            align: 'center',
            render: (_, { rowdata13 }) => (
                <>
                    <Badge count={rowdata13.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} color="#3b5999" overflowCount={9999} />
                </>
            )
        }
    ];

    // 교육생 정보 Modal
    const Edu_Detail = (keydata, keydata1, keydata2, keydata3) => {
        setModalOpen(true);
        setSubTable(keydata);
        handleCallSub(keydata, keydata1, keydata2, keydata3);
    };

    const Edu_handleOk = () => {
        setModalOpen(false);
    };

    const Edu_handleCancel = () => {
        setModalOpen(false);
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

    // 상세정보
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
            <MainCard title="교육생 평가 조회">
                <Typography variant="body1"></Typography>
                <Table
                    bordered
                    dataSource={dataSource}
                    loading={loading}
                    columns={columns}
                    rowClassName={(record) => {
                        return record.rowdata0 === subTable ? `table-row-lightblue` : '';
                    }}
                    onRow={(record) => {
                        return {
                            onDoubleClick: () => {
                                if (record.rowdata0 !== subTable) {
                                    setLoadingSub(true);
                                    setSubTable(record.rowdata0);
                                    handleCallSub(record.rowdata0, record.rowdata1, record.rowdata2, record.rowdata3);
                                }
                            }
                        };
                    }}
                />
            </MainCard>

            {/* 모달 창 Start */}
            <Modal
                open={ModalOpen}
                onOk={Edu_handleOk}
                onCancel={Edu_handleCancel}
                width={1250}
                style={{
                    left: 100
                }}
                footer={[
                    <Button
                        type="primary"
                        onClick={Edu_handleCancel}
                        style={{ width: '100px', borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                    >
                        Close
                    </Button>
                ]}
            >
                <MainCard title={`교육생 [${titleText}]`} style={{ marginTop: 30 }}>
                    <Typography variant="body1">
                        <Table size="Middle" bordered={true} dataSource={dataSourceSub} loading={loadingSub} columns={columnsSub} />
                    </Typography>
                </MainCard>
            </Modal>
            {/* 모달 창 End */}
        </>
    );
};
// export default Traineeevaluation;
