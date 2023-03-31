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
    colors: ['#faad14', '#52c41a', '#FF0000'],
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
                categories: ['2016', '2017', '2018', '2019', '2020', '2021', '2022']
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
            name: '교육인원',
            data: [14, 20, 23, 25, 26, 15, 18]
        },
        {
            name: '합격자',
            data: [5, 9, 12, 18, 23, 10, 16]
        },
        {
            name: '평균',
            data: [7, 9, 18, 20, 25, 20, 15]
        }
    ]);

    return (
        <div id="chart">
            <ReactApexChart options={options} series={series} type="line" height={400} />
        </div>
    );
};

export default IncomeAreaChart;
