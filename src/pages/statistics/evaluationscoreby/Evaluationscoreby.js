/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Button, Table, Tag, Tooltip, Badge, Space, Modal } from 'antd';
import { Typography } from '@mui/material';

import { EyeOutlined } from '@ant-design/icons';
const { confirm } = Modal;

// project import
import MainCard from 'components/MainCard';

import ReactApexChart from 'react-apexcharts';

export const Evaluationscoreby = () => {
    const [dataSource, setDataSource] = useState([]); // 상단 Table 데이터 값
    const [dataSourceEdu, setDataSourceEdu] = useState([]); // 하단 Table 데이터 값
    const [dataSourcePass, setDataSourcePass] = useState([]); // 하단 Table 데이터 값

    const [loading, setLoading] = useState(false);
    const [loadingEdu, setLoadingEdu] = useState(false);
    const [loadingPass, setLoadingPass] = useState(false);

    const [eduModalOpen, setEduModalOpen] = useState(false); //평가 교육생 Modal
    const [passModalOpen, setPassModalOpen] = useState(false); //평가 교육생 Modal
    const [subTable, setSubTable] = useState('');
    const [eduTable, setEduTable] = useState('');
    const [passTable, setPassTable] = useState('');
    const [titleText, setTitleText] = useState('');

    const areaChartOptions = {
        options: {
            chart: {
                width: 10,
                height: 10,
                type: 'radialBar',
                sparkline: {
                    enabled: true
                }
            },
            dataLabels: {
                enabled: false
            },
            colors: ['#f50'],
            plotOptions: {
                radialBar: {
                    startAngle: -135,
                    endAngle: 225,
                    hollow: {
                        margin: 0,
                        size: '50%',
                        background: '#fff'
                    },
                    track: {
                        background: '#fff',
                        strokeWidth: '52%',
                        margin: 0,
                        dropShadow: {
                            enabled: true,
                            top: 0,
                            left: 0,
                            blur: 0,
                            opacity: 0.35
                        }
                    },
                    dataLabels: {
                        show: true,
                        name: {
                            show: false
                        },
                        value: {
                            formatter: function (val) {
                                return parseInt(val) + '%';
                            },
                            color: '#111',
                            fontSize: '12px',
                            show: true,
                            offsetY: 5
                        }
                    }
                }
            }
        }
    };

    const handleCall = () => {
        setDataSource([
            {
                rowdata0: '1',
                rowdata1: '2022',
                rowdata2: '한수원(본사)',
                rowdata3: '30',
                rowdata4: '30',
                rowdata5: '1',
                rowdata6: '0',
                rowdata7: '0'
            },
            {
                rowdata0: '2',
                rowdata1: '2022',
                rowdata2: '한수원(gksdnf)',
                rowdata3: '25',
                rowdata4: '25',
                rowdata5: '1',
                rowdata6: '0',
                rowdata7: '0'
            },
            {
                rowdata0: '3',
                rowdata1: '2021',
                rowdata2: '한수원(한빛)',
                rowdata3: '61',
                rowdata4: '122.5',
                rowdata5: '2',
                rowdata6: '1',
                rowdata7: '50'
            },
            {
                rowdata0: '4',
                rowdata1: '2020',
                rowdata2: '한수원(고리)',
                rowdata3: '29',
                rowdata4: '57.5',
                rowdata5: '2',
                rowdata6: '0',
                rowdata7: '0'
            },
            {
                rowdata0: '5',
                rowdata1: '2020',
                rowdata2: '한수원(월성)',
                rowdata3: '83',
                rowdata4: '82.5',
                rowdata5: '1',
                rowdata6: '1',
                rowdata7: '100'
            },
            {
                rowdata0: '6',
                rowdata1: '2019',
                rowdata2: '원자력연구원',
                rowdata3: '85',
                rowdata4: '85',
                rowdata5: '1',
                rowdata6: '1',
                rowdata7: '100'
            },
            {
                rowdata0: '7',
                rowdata1: '2018',
                rowdata2: '원자력연료(주)',
                rowdata3: '30',
                rowdata4: '30',
                rowdata5: '1',
                rowdata6: '0',
                rowdata7: '0'
            },
            {
                rowdata0: '8',
                rowdata1: '2017',
                rowdata2: '원자력환경공단',
                rowdata3: '83',
                rowdata4: '82.5',
                rowdata5: '1',
                rowdata6: '1',
                rowdata7: '100'
            },
            {
                rowdata0: '9',
                rowdata1: '2016',
                rowdata2: '그린피아',
                rowdata3: '20',
                rowdata4: '20',
                rowdata5: '1',
                rowdata6: '0',
                rowdata7: '0'
            },
            {
                rowdata0: '10',
                rowdata1: '2016',
                rowdata2: 'G-ANTTECH',
                rowdata3: '46',
                rowdata4: '137.5',
                rowdata5: '3',
                rowdata6: '1',
                rowdata7: '33'
            }
        ]);
        setLoading(false);
    };
    const handleCallEdu = (keydata, keydata1, keydata2) => {
        setTitleText(`${keydata1}, ${keydata2}`);
        keydata === '1'
            ? setDataSourceEdu([
                  {
                      rowdata0: '1',
                      rowdata1: 'KKTS',
                      rowdata2: '대문자',
                      rowdata3: '-',
                      rowdata4: '2022-10-30',
                      rowdata5: '30',
                      rowdata6: 'X',
                      rowdata7: '불합격',
                      rowdata8: '4'
                  }
              ])
            : keydata === '2'
            ? setDataSourceEdu([
                  {
                      rowdata0: '1',
                      rowdata1: 'kkt',
                      rowdata2: '설현',
                      rowdata3: '개발팀',
                      rowdata4: '2022-07-12',
                      rowdata5: '25',
                      rowdata6: 'X',
                      rowdata7: '불합격',
                      rowdata8: '4'
                  }
              ])
            : keydata === '3'
            ? setDataSourceEdu([
                  {
                      rowdata0: '1',
                      rowdata1: 'ksk',
                      rowdata2: '김슬기',
                      rowdata3: '개발팀',
                      rowdata4: '2022-10-31',
                      rowdata5: '97.5',
                      rowdata6: 'X',
                      rowdata7: '합격',
                      rowdata8: '4'
                  },
                  {
                      rowdata0: '2',
                      rowdata1: 'kt',
                      rowdata2: '태희',
                      rowdata3: '-',
                      rowdata4: '2022-06-17',
                      rowdata5: '25',
                      rowdata6: 'O',
                      rowdata7: '불합격',
                      rowdata8: '4'
                  }
              ])
            : keydata === '4'
            ? setDataSourceEdu([
                  {
                      rowdata0: '1',
                      rowdata1: 'user3',
                      rowdata2: 'USER3',
                      rowdata3: '부서1',
                      rowdata4: '2022-02-26',
                      rowdata5: '25',
                      rowdata6: 'X',
                      rowdata7: '불합격',
                      rowdata8: '2'
                  },
                  {
                      rowdata0: '2',
                      rowdata1: 'user3',
                      rowdata2: 'USER3',
                      rowdata3: '부서1',
                      rowdata4: '2022-12-12',
                      rowdata5: '32.5',
                      rowdata6: 'X',
                      rowdata7: '불합격',
                      rowdata8: '3'
                  }
              ])
            : keydata === '5'
            ? setDataSourceEdu([
                  {
                      rowdata0: '1',
                      rowdata1: 'hjh',
                      rowdata2: '황재홍',
                      rowdata3: '개발팀',
                      rowdata4: '2022-05-21',
                      rowdata5: '82.5',
                      rowdata6: 'X',
                      rowdata7: '합격',
                      rowdata8: '1'
                  }
              ])
            : keydata === '6'
            ? setDataSourceEdu([
                  {
                      rowdata0: '1',
                      rowdata1: 'user2',
                      rowdata2: 'USER2',
                      rowdata3: '0111',
                      rowdata4: '2022-05-21',
                      rowdata5: '85',
                      rowdata6: 'X',
                      rowdata7: '합격',
                      rowdata8: '1'
                  }
              ])
            : keydata === '7'
            ? setDataSourceEdu([
                  {
                      rowdata0: '1',
                      rowdata1: 'testuser1',
                      rowdata2: '테스트유저',
                      rowdata3: '-',
                      rowdata4: '2022-09-06',
                      rowdata5: '30',
                      rowdata6: 'X',
                      rowdata7: '불합격',
                      rowdata8: '1'
                  }
              ])
            : keydata === '87'
            ? setDataSourceEdu([
                  {
                      rowdata0: '1',
                      rowdata1: 'user1',
                      rowdata2: 'USER1',
                      rowdata3: 'G-ANTECH',
                      rowdata4: '2022-05-21',
                      rowdata5: '82.5',
                      rowdata6: 'X',
                      rowdata7: '합격',
                      rowdata8: '1'
                  }
              ])
            : keydata === '9'
            ? setDataSourceEdu([
                  {
                      rowdata0: '1',
                      rowdata1: 'yun',
                      rowdata2: '윤은석',
                      rowdata3: 'SI사업본부',
                      rowdata4: '2022-07-25',
                      rowdata5: '20',
                      rowdata6: 'X',
                      rowdata7: '불합격',
                      rowdata8: '1'
                  }
              ])
            : keydata === '10'
            ? setDataSourceEdu([
                  {
                      rowdata0: '1',
                      rowdata1: 'test',
                      rowdata2: 'TestUser',
                      rowdata3: '-',
                      rowdata4: '2016-12-22',
                      rowdata5: '92.5',
                      rowdata6: 'X',
                      rowdata7: '합격',
                      rowdata8: '3'
                  },
                  {
                      rowdata0: '1',
                      rowdata1: 'test',
                      rowdata2: 'TestUser',
                      rowdata3: '-',
                      rowdata4: '2016-06-07',
                      rowdata5: '30',
                      rowdata6: 'X',
                      rowdata7: '불합격',
                      rowdata8: '1'
                  },
                  {
                      rowdata0: '1',
                      rowdata1: 'test',
                      rowdata2: 'TestUser',
                      rowdata3: '-',
                      rowdata4: '2016-02-01',
                      rowdata5: '15',
                      rowdata6: 'O',
                      rowdata7: '불합격',
                      rowdata8: '2'
                  }
              ])
            : setDataSourceEdu([]);
        setLoadingEdu(false);
    };

    const handleCallPass = (keydata, keydata1, keydata2) => {
        setTitleText(`${keydata1}, ${keydata2}`);
        keydata === '1'
            ? setDataSourcePass([
                  {
                      rowdata0: '1',
                      rowdata1: 'X-ray 판독 초기',
                      rowdata2: '1차',
                      rowdata3: '30',
                      rowdata4: '30',
                      rowdata5: '1',
                      rowdata6: '0',
                      rowdata7: '0'
                  }
              ])
            : keydata === '2'
            ? setDataSourcePass([
                  {
                      rowdata0: '1',
                      rowdata1: 'X-ray 판독 초기',
                      rowdata2: '1차',
                      rowdata3: '25',
                      rowdata4: '25',
                      rowdata5: '1',
                      rowdata6: '0',
                      rowdata7: '0'
                  }
              ])
            : keydata === '3'
            ? setDataSourcePass([
                  {
                      rowdata0: '1',
                      rowdata1: 'X-ray 판독 초기',
                      rowdata2: '1차',
                      rowdata3: '61',
                      rowdata4: '122.5',
                      rowdata5: '2',
                      rowdata6: '1',
                      rowdata7: '50'
                  }
              ])
            : keydata === '4'
            ? setDataSourcePass([
                  {
                      rowdata0: '1',
                      rowdata1: 'X-ray 판독 초기',
                      rowdata2: '1차',
                      rowdata3: '29',
                      rowdata4: '57.5',
                      rowdata5: '2',
                      rowdata6: '0',
                      rowdata7: '0'
                  }
              ])
            : keydata === '5'
            ? setDataSourcePass([
                  {
                      rowdata0: '1',
                      rowdata1: 'X-ray 판독 초기',
                      rowdata2: '1차',
                      rowdata3: '83',
                      rowdata4: '82.5',
                      rowdata5: '1',
                      rowdata6: '1',
                      rowdata7: '100'
                  }
              ])
            : keydata === '6'
            ? setDataSourcePass([
                  {
                      rowdata0: '1',
                      rowdata1: 'X-ray 판독 초기',
                      rowdata2: '1차',
                      rowdata3: '85',
                      rowdata4: '85',
                      rowdata5: '1',
                      rowdata6: '1',
                      rowdata7: '100'
                  }
              ])
            : keydata === '7'
            ? setDataSourcePass([
                  {
                      rowdata0: '1',
                      rowdata1: 'X-ray 판독 초기',
                      rowdata2: '1차',
                      rowdata3: '30',
                      rowdata4: '30',
                      rowdata5: '1',
                      rowdata6: '0',
                      rowdata7: '0'
                  }
              ])
            : keydata === '8'
            ? setDataSourcePass([
                  {
                      rowdata0: '1',
                      rowdata1: 'X-ray 판독 초기',
                      rowdata2: '1차',
                      rowdata3: '83',
                      rowdata4: '82.5',
                      rowdata5: '1',
                      rowdata6: '1',
                      rowdata7: '100'
                  }
              ])
            : keydata === '9'
            ? setDataSourcePass([
                  {
                      rowdata0: '1',
                      rowdata1: 'X-ray 판독 초기',
                      rowdata2: '1차',
                      rowdata3: '20',
                      rowdata4: '20',
                      rowdata5: '1',
                      rowdata6: '0',
                      rowdata7: '0'
                  }
              ])
            : keydata === '10'
            ? setDataSourcePass([
                  {
                      rowdata0: '1',
                      rowdata1: 'X-ray 판독 초기',
                      rowdata2: '1차',
                      rowdata3: '46',
                      rowdata4: '137.5',
                      rowdata5: '3',
                      rowdata6: '1',
                      rowdata7: '33'
                  }
              ])
            : setDataSourcePass([]);
        setLoadingPass(false);
    };

    const defaultColumns = [
        {
            width: '70px',
            title: 'No.',
            dataIndex: 'rowdata0',
            align: 'center'
        },
        {
            width: '150px',
            title: '교육년도',
            dataIndex: 'rowdata1',
            align: 'center'
        },
        {
            title: '기관',
            dataIndex: 'rowdata2',
            align: 'center'
        },
        {
            width: '150px',
            title: '평균점수',
            dataIndex: 'rowdata3',
            align: 'center',
            render: (_, { rowdata3 }) => (
                <>
                    <Badge count={rowdata3.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} color="#87d068" overflowCount={9999} />
                </>
            )
        },
        {
            width: '150px',
            title: '합계점수',
            dataIndex: 'rowdata4',
            align: 'center',
            render: (_, { rowdata4 }) => (
                <>
                    <Badge count={rowdata4.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} color="#faad14" overflowCount={9999} />
                </>
            )
        },
        {
            width: '150px',
            title: '교육인원',
            dataIndex: 'rowdata5',
            align: 'center',
            render: (_, { rowdata0, rowdata1, rowdata2, rowdata5 }) => (
                <Space wrap>
                    <Button
                        type="primary"
                        style={{ width: '70px', borderRadius: '5px', boxShadow: '2px 2px 0px 0px #dbdbdb' }}
                        onClick={() => Edu_Detail(rowdata0, rowdata1, rowdata2)}
                        icon={<EyeOutlined />}
                    >
                        {rowdata5}
                    </Button>
                </Space>
            )
        },
        {
            width: '150px',
            title: '합격자수',
            dataIndex: 'rowdata6',
            align: 'center',
            render: (_, { rowdata6 }) => (
                <>
                    <Badge count={rowdata6.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} color="#52c41a" overflowCount={9999} />
                </>
            )
        },
        {
            width: '150px',
            title: '합격률',
            dataIndex: 'rowdata7',
            align: 'center',
            render: (_, { rowdata0, rowdata1, rowdata2, rowdata7 }) => (
                <Space wrap>
                    <Button
                        type="primary"
                        style={{ width: '100px', borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                        onClick={() => Pass_Detail(rowdata0, rowdata1, rowdata2)}
                        icon={<EyeOutlined />}
                    >
                        {rowdata7}%
                    </Button>
                </Space>
            )
        }
    ];

    const defaultColumnsEdu = [
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
            title: '부서',
            dataIndex: 'rowdata3',
            align: 'center'
        },
        {
            title: '평가일자',
            dataIndex: 'rowdata4',
            align: 'center'
        },
        {
            width: '80px',
            title: '취득점수',
            dataIndex: 'rowdata5',
            align: 'center',
            render: (_, { rowdata5 }) => (
                <>
                    <Badge count={rowdata5.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} color="#87d068" overflowCount={9999} />
                </>
            )
        },
        {
            width: '110px',
            title: '금지물품금지여부',
            dataIndex: 'rowdata6',
            align: 'center',
            render: (_, { rowdata6 }) =>
                rowdata6 === 'O' ? (
                    <Tag style={{ width: '60px', borderRadius: '5px', padding: '0 10px' }} color="#87d068">
                        {rowdata6}
                    </Tag>
                ) : (
                    <Tag style={{ width: '60px', borderRadius: '5px', padding: '0 10px' }}> {rowdata6}</Tag>
                )
        },
        {
            width: '100px',
            title: '합격여부',
            dataIndex: 'rowdata7',
            align: 'center',
            render: (_, { rowdata7 }) =>
                rowdata7 === '합격' ? (
                    <Tag style={{ width: '60px', borderRadius: '5px', padding: '0 10px' }} color="#87d068">
                        {rowdata7}
                    </Tag>
                ) : (
                    <Tag style={{ width: '60px', borderRadius: '5px', padding: '0 10px' }}> {rowdata7}</Tag>
                )
        },
        {
            width: '80px',
            title: '평가횟수',
            dataIndex: 'rowdata8',
            align: 'center',
            render: (_, { rowdata8 }) => (
                <>
                    <Badge count={rowdata8.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} color="#2db7f5" overflowCount={9999} />
                </>
            )
        }
    ];

    const defaultColumnsPass = [
        {
            width: '80px',
            title: 'No.',
            dataIndex: 'rowdata0',
            align: 'center'
        },
        {
            width: '120px',
            title: '과정명',
            dataIndex: 'rowdata1',
            align: 'center'
        },
        {
            title: '교육차수',
            dataIndex: 'rowdata2',
            align: 'center'
        },
        {
            title: '평균점수',
            dataIndex: 'rowdata3',
            align: 'center',
            render: (_, { rowdata3 }) => (
                <>
                    <Badge count={rowdata3.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} color="#87d068" overflowCount={9999} />
                </>
            )
        },
        {
            title: '합격점수',
            dataIndex: 'rowdata4',
            align: 'center',
            render: (_, { rowdata3 }) => (
                <>
                    <Badge count={rowdata3.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} color="#faad14" overflowCount={9999} />
                </>
            )
        },
        {
            width: '80px',
            title: '교육인원',
            dataIndex: 'rowdata5',
            align: 'center',
            render: (_, { rowdata5 }) => (
                <>
                    <Badge count={rowdata5.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} color="#bfbfbf" overflowCount={9999} />
                </>
            )
        },
        {
            title: '합격자수',
            dataIndex: 'rowdata6',
            align: 'center',
            render: (_, { rowdata6 }) => (
                <>
                    <Badge count={rowdata6.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} color="#52c41a" overflowCount={9999} />
                </>
            )
        },
        {
            width: '80px',
            title: '합격률',
            dataIndex: 'rowdata7',
            align: 'center',
            render: (_, { rowdata7 }) => (
                <div style={{ float: 'left', marign: '0', align: 'center' }}>
                    <Tooltip title={`${rowdata7}%`}>
                        <ReactApexChart
                            options={areaChartOptions.options}
                            // series={areaChartOptions.series}
                            series={[rowdata7]}
                            type="radialBar"
                            height={70}
                        />
                    </Tooltip>
                </div>
            )
        }
    ];

    // 기관 교육생 Modal
    const Edu_Detail = (keydata, keydata1, keydata2) => {
        setEduModalOpen(true);
        setSubTable(keydata);
        handleCallEdu(keydata, keydata1, keydata2);
    };

    const Edu_handleOk = () => {
        setEduModalOpen(false);
    };

    const Edu_handleCancel = () => {
        setEduModalOpen(false);
    };

    // 합격률 Modal
    const Pass_Detail = (keydata, keydata1, keydata2) => {
        setPassModalOpen(true);
        setSubTable(keydata);
        handleCallPass(keydata, keydata1, keydata2);
    };

    const Pass_handleOk = () => {
        setPassModalOpen(false);
    };

    const Pass_handleCancel = () => {
        setPassModalOpen(false);
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

    const columnsEdu = defaultColumnsEdu.map((col) => {
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

    const columnsPass = defaultColumnsPass.map((col) => {
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
            <MainCard title="기관별 평가 점수 조회">
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
            {/* 기관 교육생 */}
            <Modal
                open={eduModalOpen}
                onOk={Edu_handleOk}
                onCancel={Edu_handleCancel}
                width={1250}
                style={{
                    top: 80,
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
                <MainCard title={`기관 교육생 [${titleText}]`} style={{ marginTop: 30 }}>
                    <Typography variant="body1">
                        <Table
                            size="small"
                            bordered={true}
                            dataSource={dataSourceEdu}
                            loading={loadingEdu}
                            columns={columnsEdu}
                            pagination={false}
                            rowClassName={(record) => {
                                return record.rowdata0 === eduTable ? `table-row-lightblue` : '';
                            }}
                        />
                    </Typography>
                </MainCard>
            </Modal>

            {/* 합격율 */}
            <Modal
                open={passModalOpen}
                onOk={Pass_handleOk}
                onCancel={Pass_handleCancel}
                width={1250}
                style={{
                    top: 80,
                    left: 100
                }}
                footer={[
                    <Button
                        type="primary"
                        onClick={Pass_handleCancel}
                        style={{ width: '100px', borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                    >
                        Close
                    </Button>
                ]}
            >
                <MainCard title={`기관 교육생 [${titleText}]`} style={{ marginTop: 30 }}>
                    <Typography variant="body1">
                        <Table
                            size="small"
                            bordered={true}
                            dataSource={dataSourcePass}
                            loading={loadingPass}
                            columns={columnsPass}
                            pagination={false}
                            rowClassName={(record) => {
                                return record.rowdata0 === passTable ? `table-row-lightblue` : '';
                            }}
                        />
                    </Typography>
                </MainCard>
            </Modal>
            {/* 모달 창 End */}
        </>
    );
};
// export default Evaluationscoreby;
