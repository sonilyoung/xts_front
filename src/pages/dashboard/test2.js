/* eslint-disable no-unused-vars */
// import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// third-party
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
    colors: ['#77B6EA', '#FDD835'],
    dataLabels: {
        enabled: true
    },
    stroke: {
        width: [3, 3],
        curve: 'straight',
        dashArray: [0, 5],
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
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
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

// ==============================|| INCOME AREA CHART ||============================== //
const IncomeAreaChart = () => {
    const [options, setOptions] = useState(areaChartOptions);
    useEffect(() => {
        setOptions((prevState) => ({
            ...prevState,
            // colors: [theme.palette.primary.main, theme.palette.primary[400]],
            xaxis: {
                categories: [
                    '총기류',
                    '폭발물',
                    '실탄류',
                    '도검류',
                    '일반무기',
                    '위장무기',
                    '공구/생활용품',
                    '인화성물질',
                    '위험물질',
                    '액체, 겔 물품',
                    '주류',
                    '전기/전자제품',
                    '확인물품',
                    '통과'
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
            name: '총건수',
            data: [1152, 1207, 1183, 1261, 1110, 982, 902, 898, 1274, 1388, 724, 919, 758, 1683]
        },
        {
            name: '오답건수',
            data: [61, 98, 99, 64, 57, 101, 11, 97, 55, 75, 11, 38, 84, 108]
        }
    ]);

    return (
        <div id="chart">
            <ReactApexChart options={options} series={series} type="line" height={400} />
        </div>
    );
};

export default IncomeAreaChart;
