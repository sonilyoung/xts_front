/* eslint-disable no-unused-vars */
// import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// third-party
import ReactApexChart from 'react-apexcharts';

// 연도별합격별
import { useSelectMainYearStatisticsMutation } from '../../hooks/api/MainManagement/MainManagement';

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
    const [series, setSeries] = useState([]);
    const [loading, setLoading] = useState(false);

    // ===============================
    // Api 호출 Start
    // 조회 ======================================================
    const [SelectMainYearStatisticsApi] = useSelectMainYearStatisticsMutation(); // 콘텐츠 정보 관리 hooks api호출
    const handel_SelectMainYearStatistics_Api = async () => {
        const SelectMainYearStatisticsResponse = await SelectMainYearStatisticsApi({});
        setOptions((prevState) => ({
            ...prevState,
            xaxis: {
                categories: SelectMainYearStatisticsResponse?.data?.RET_DATA?.categories
            },
            yaxis: {
                title: {
                    text: undefined
                }
            }
        }));

        setSeries([
            {
                name: '교육인원',
                data: SelectMainYearStatisticsResponse?.data?.RET_DATA?.totCntList
            },
            {
                name: '합격자',
                data: SelectMainYearStatisticsResponse?.data?.RET_DATA?.passCntList
            },
            {
                name: '평균',
                data: SelectMainYearStatisticsResponse?.data?.RET_DATA?.passPercentList
            }
        ]);
        setLoading(false);
    };
    // Api 호출 Start
    // ===============================

    useEffect(() => {
        setLoading(true);
        handel_SelectMainYearStatistics_Api();
    }, []);

    return (
        <div id="chart">
            <ReactApexChart loading={loading} options={options} series={series} type="line" height={400} />
        </div>
    );
};

export default IncomeAreaChart;
