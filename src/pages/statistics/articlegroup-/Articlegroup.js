/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
// material-ui
import { Typography } from '@mui/material';

// project import
import MainCard from 'components/MainCard';

import ReactApexChart from 'react-apexcharts';

// chart options
const areaChartOptions = {
    chart: {
        type: 'line',
        dropShadow: {
            enabled: true,
            color: '#000',
            top: 10,
            left: 5,
            blur: 5,
            opacity: 0.1
        }
    },
    colors: ['#faad14', '#52c41a', '#FF0000'],
    dataLabels: {
        enabled: true
    },
    stroke: {
        width: [3, 3],
        curve: 'straight',
        dashArray: [0, 3],
        curve: 'smooth'
    },
    yaxis: {
        min: -10,
        max: 40,
        tickAmount: 3
    },
    grid: {
        borderColor: '#e7e7e7',
        row: {
            colors: ['#f3f3f3', '#fff', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.7
        }
    },
    legend: {
        tooltipHoverFormatter: function (val, opts) {
            return (
                val +
                ' : ' +
                opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
                ' '
            );
        }
    },
    markers: {
        size: 0,
        hover: {
            sizeOffset: 6
        }
    }
};

export const Articlegroup = () => {
    const [options, setOptions] = useState(areaChartOptions);
    useEffect(() => {
        setOptions((prevState) => ({
            ...prevState,
            xaxis: {
                categories: [
                    '총기류',
                    '총기부품류',
                    '폭발물류',
                    '폭발물구성품',
                    '도화선',
                    '실탄류',
                    '도검류',
                    '일반무기',
                    '스포츠용품류',
                    '위장무기류',
                    '공구/생활용품류',
                    '금속류',
                    '인화성물질류',
                    '위험물질류',
                    '액체, 겔 물품',
                    '주류',
                    '전기/전자제품',
                    '저장장치류',
                    '확인물품',
                    '의약품류',
                    '위험물질',
                    '통과',
                    '기타개인용품류',
                    '의류/직물류',
                    '가정용품류',
                    '화장품류',
                    '보석류',
                    '문구용품류',
                    '종이류',
                    '장난감류',
                    '깡통류',
                    '식료품류',
                    '가방류'
                ]
            },
            yaxis: {
                title: {
                    text: undefined
                }
            }
        }));
    }, []);

    const [series, setSeries] = useState([
        {
            name: '총출제',
            data: [
                150, 220, 323, 225, 126, 215, 218, 114, 220, 123, 325, 126, 215, 118, 114, 220, 123, 95, 126, 215, 218, 114, 220, 123, 225,
                126, 315, 218, 118, 122, 232, 122, 121
            ]
        },
        {
            name: '정답',
            data: [
                80, 95, 112, 98, 123, 110, 116, 85, 89, 102, 108, 123, 150, 106, 75, 59, 112, 108, 123, 110, 116, 105, 99, 102, 108, 203,
                101, 116, 101, 104, 109, 113, 109
            ]
        },
        {
            name: '오답',
            data: [
                70, 115, 225, 20, 25, 20, 15, 7, 9, 18, 20, 25, 20, 15, 7, 9, 18, 20, 25, 20, 15, 7, 9, 18, 20, 25, 20, 15, 22, 11, 9, 13,
                10
            ]
        }
    ]);

    return (
        <>
            <MainCard title="물품 그룹별 조회">
                <Typography variant="body1">
                    <div id="chart">
                        <ReactApexChart options={options} series={series} type="line" height={400} />
                    </div>
                </Typography>
            </MainCard>
        </>
    );
};
