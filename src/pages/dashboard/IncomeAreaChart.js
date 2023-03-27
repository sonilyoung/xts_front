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
                    'Aerosol',
                    'Alcohol',
                    'Ax',
                    'Bat',
                    'Battery',
                    'Bullet',
                    'Chisel',
                    'Electronic',
                    'Cigarettes',
                    'Liquid',
                    'Firecracker',
                    'Gun',
                    'Gun Parts',
                    'Hammer',
                    'HandCuffs',
                    'HDD',
                    'Laptop',
                    'Lighter',
                    'Liquid',
                    'Match',
                    'Metal Pipe',
                    'Nail Clippers',
                    'Plier',
                    'Prtable Gas',
                    'Saw',
                    'Scissors',
                    'Screwdriver',
                    'SmartPhone',
                    'Spanner',
                    'SSD',
                    'Supp',
                    'Tablet PC',
                    'Thinner',
                    'Knife',
                    'USB',
                    'Zippo Oil',
                    'Solid Fuel',
                    'Stun Gun'
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
            data: [
                119, 249, 244, 25, 104, 71, 119, 41, 40, 11, 9, 109, 2, 12, 242, 70, 104, 104, 42, 58, 183, 55, 19, 20, 41, 161, 106, 36,
                133, 15, 1, 106, 105, 79, 1, 55, 308, 3
            ]
        },
        {
            name: '오답건수',
            data: [
                82, 136, 133, 1, 66, 4, 77, 38, 25, 8, 1, 49, 2, 6, 149, 30, 53, 63, 20, 58, 114, 38, 8, 3, 11, 57, 64, 5, 102, 13, 0, 67,
                61, 69, 1, 38, 175, 1
            ]
        }
    ]);

    return (
        <div id="chart">
            <ReactApexChart options={options} series={series} type="line" height={400} />
        </div>
    );
};

export default IncomeAreaChart;
