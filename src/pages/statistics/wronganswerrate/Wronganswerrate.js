/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Table, Tooltip, Badge } from 'antd';
import { Typography } from '@mui/material';

// project import
import MainCard from 'components/MainCard';

import ReactApexChart from 'react-apexcharts';

export const Wronganswerrate = () => {
    const [loading, setLoading] = useState(false);
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

    const [dataSource, setDataSource] = useState([
        {
            rowdata0: '1',
            rowdata1: 'X00241',
            rowdata2: 13,
            rowdata3: 15,
            rowdata4: 87,
            rowdata5: '1레벨',
            rowdata6: '2023-02-01',
            rowdata7: 4,
            rowdata8: 42,
            rowdata9: 10
        },
        {
            rowdata0: '2',
            rowdata1: 'X00244',
            rowdata2: 2,
            rowdata3: '2',
            rowdata4: '100',
            rowdata5: '1레벨',
            rowdata6: '2023-02-02',
            rowdata7: '13',
            rowdata8: '26',
            rowdata9: '50'
        },
        {
            rowdata0: '3',
            rowdata1: 'X00248',
            rowdata2: 60,
            rowdata3: 61,
            rowdata4: 98,
            rowdata5: '1레벨',
            rowdata6: '2023-02-03',
            rowdata7: 1,
            rowdata8: 15,
            rowdata9: 7
        },
        {
            rowdata0: '4',
            rowdata1: 'X00250',
            rowdata2: 37,
            rowdata3: 104,
            rowdata4: 36,
            rowdata5: '1레벨',
            rowdata6: '2023-02-04',
            rowdata7: 4,
            rowdata8: 42,
            rowdata9: 10
        },
        {
            rowdata0: '5',
            rowdata1: 'X00252',
            rowdata2: 2,
            rowdata3: 5,
            rowdata4: 40,
            rowdata5: '1레벨',
            rowdata6: '2023-02-05',
            rowdata7: 0,
            rowdata8: 0,
            rowdata9: 0
        },
        {
            rowdata0: '6',
            rowdata1: 'X00254',
            rowdata2: 39,
            rowdata3: 104,
            rowdata4: 38,
            rowdata5: '1레벨',
            rowdata6: '2023-02-06',
            rowdata7: 0,
            rowdata8: 0,
            rowdata9: 0
        },
        {
            rowdata0: '7',
            rowdata1: 'X00255',
            rowdata2: 34,
            rowdata3: 104,
            rowdata4: 33,
            rowdata5: '1레벨',
            rowdata6: '2023-02-07',
            rowdata7: 0,
            rowdata8: 0,
            rowdata9: 0
        },
        {
            rowdata0: '8',
            rowdata1: 'X00257',
            rowdata2: 2,
            rowdata3: 2,
            rowdata4: 100,
            rowdata5: '1레벨',
            rowdata6: '2023-02-08',
            rowdata7: 0,
            rowdata8: 0,
            rowdata9: 0
        },
        {
            rowdata0: '9',
            rowdata1: 'X00258',
            rowdata2: 1,
            rowdata3: 4,
            rowdata4: 25,
            rowdata5: '1레벨',
            rowdata6: '2023-02-09',
            rowdata7: 0,
            rowdata8: 0,
            rowdata9: 0
        },
        {
            rowdata0: '10',
            rowdata1: 'X00260',
            rowdata2: 60,
            rowdata3: 60,
            rowdata4: 100,
            rowdata5: '1레벨',
            rowdata6: '2023-02-10',
            rowdata7: 0,
            rowdata8: 0,
            rowdata9: 0
        },
        {
            rowdata0: '11',
            rowdata1: 'X00261',
            rowdata2: 2,
            rowdata3: 2,
            rowdata4: 100,
            rowdata5: '1레벨',
            rowdata6: '2023-02-11',
            rowdata7: 0,
            rowdata8: 0,
            rowdata9: 0
        }
    ]);
    const [count, setCount] = useState(dataSource.length);

    const defaultColumns = [
        {
            width: '80px',
            title: 'No.',
            dataIndex: 'rowdata0',
            align: 'center'
        },
        {
            title: '가방촬영ID',
            dataIndex: 'rowdata1',
            align: 'center'
        },
        {
            width: '120px',
            title: '오답 건수',
            dataIndex: 'rowdata2',
            align: 'center',
            render: (_, { rowdata2 }) => (
                <>
                    <Badge count={rowdata2.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} color="#faad14" overflowCount={9999} />
                </>
            )
        },
        {
            width: '120px',
            title: '총 건수',
            dataIndex: 'rowdata3',
            align: 'center',
            render: (_, { rowdata3 }) => (
                <>
                    <Badge count={rowdata3.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} color="#52c41a" overflowCount={9999} />
                </>
            )
        },
        {
            width: '180px',
            title: '오답률',
            dataIndex: 'rowdata4',
            align: 'center',
            render: (_, { rowdata4 }) => (
                <div style={{ float: 'left', marign: '0', align: 'center' }}>
                    <Tooltip title={`${rowdata4}%`}>
                        <ReactApexChart
                            options={areaChartOptions.options}
                            // series={areaChartOptions.series}
                            series={[rowdata4]}
                            type="radialBar"
                            height={70}
                        />
                    </Tooltip>
                </div>
            )
        },
        {
            width: '120px',
            title: '학습레벨',
            dataIndex: 'rowdata5',
            align: 'center'
        },
        {
            width: '120px',
            title: '수정일자',
            dataIndex: 'rowdata6',
            align: 'center'
        },
        {
            width: '120px',
            title: '수정전 오답 건수',
            dataIndex: 'rowdata7',
            align: 'center',
            render: (_, { rowdata7 }) => (
                <>
                    <Badge count={rowdata7.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} color="#faad14" overflowCount={9999} />
                </>
            )
        },
        {
            width: '120px',
            title: '수정전 총 건수',
            dataIndex: 'rowdata8',
            align: 'center',
            render: (_, { rowdata8 }) => (
                <>
                    <Badge count={rowdata8.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} color="#52c41a" overflowCount={9999} />
                </>
            )
        },
        {
            width: '180px',
            title: '수정전 오답률',
            dataIndex: 'rowdata9',
            align: 'center',
            render: (_, { rowdata9 }) => (
                <div style={{ float: 'left', marign: '0', align: 'center' }}>
                    <Tooltip title={`${rowdata9}%`}>
                        <ReactApexChart
                            options={areaChartOptions.options}
                            // series={areaChartOptions.series}
                            series={[rowdata9]}
                            type="radialBar"
                            height={70}
                        />
                    </Tooltip>
                </div>
            )
        }
    ];

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

    return (
        <>
            <MainCard title="문제별 오답률 조회">
                <Typography variant="body1">
                    <Table rowClassName={() => 'editable-row'} bordered dataSource={dataSource} loading={loading} columns={columns} />
                </Typography>
            </MainCard>
        </>
    );
};
// export default Wronganswerrate;
