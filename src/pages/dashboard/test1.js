export const ApexChart = ({ props }) => {
    const [series, setSeries] = useState([
        {
            data: makeData()
        }
    ]);

    const options = {
        chart: {
            id: 'barYear',
            height: 400,
            width: '100%',
            type: 'bar',
            events: {
                dataPointSelection: function (e, chart, opts) {
                    var quarterChartEl = document.querySelector('#chart-quarter');
                    var yearChartEl = document.querySelector('#chart-year');

                    if (opts.selectedDataPoints[0].length === 1) {
                        if (quarterChartEl.classList.contains('active')) {
                            updateQuarterChart(chart, 'barQuarter');
                        } else {
                            yearChartEl.classList.add('chart-quarter-activated');
                            quarterChartEl.classList.add('active');
                            updateQuarterChart(chart, 'barQuarter');
                        }
                    } else {
                        updateQuarterChart(chart, 'barQuarter');
                    }

                    if (opts.selectedDataPoints[0].length === 0) {
                        yearChartEl.classList.remove('chart-quarter-activated');
                        quarterChartEl.classList.remove('active');
                    }
                },
                updated: function (chart) {
                    updateQuarterChart(chart, 'barQuarter');
                }
            }
        },
        plotOptions: {
            bar: {
                distributed: true,
                horizontal: true,
                barHeight: '75%',
                dataLabels: {
                    position: 'bottom'
                }
            }
        },
        dataLabels: {
            enabled: true,
            textAnchor: 'start',
            style: {
                colors: ['#fff']
            },
            formatter: function (val, opt) {
                return opt.w.globals.labels[opt.dataPointIndex];
            },
            offsetX: 0,
            dropShadow: {
                enabled: true
            }
        },

        colors: colors,

        states: {
            normal: {
                filter: {
                    type: 'desaturate'
                }
            },
            active: {
                allowMultipleDataPointsSelection: true,
                filter: {
                    type: 'darken',
                    value: 1
                }
            }
        },
        tooltip: {
            x: {
                show: false
            },
            y: {
                title: {
                    formatter: function (val, opts) {
                        return opts.w.globals.labels[opts.dataPointIndex];
                    }
                }
            }
        },
        title: {
            text: 'Yearly Results',
            offsetX: 15
        },
        subtitle: {
            text: '(Click on bar to see details)',
            offsetX: 15
        },
        yaxis: {
            labels: {
                show: false
            }
        }
    };

    const [seriesQuarter, setSeriesQuarter] = useState([
        {
            data: makeData()
        }
    ]);

    const optionsQuarter = {
        chart: {
            id: 'barQuarter',
            height: 400,
            width: '100%',
            type: 'bar',
            stacked: true
        },
        plotOptions: {
            bar: {
                columnWidth: '50%',
                horizontal: false
            }
        },
        legend: {
            show: false
        },
        grid: {
            yaxis: {
                lines: {
                    show: false
                }
            },
            xaxis: {
                lines: {
                    show: true
                }
            }
        },
        yaxis: {
            labels: {
                show: false
            }
        },
        title: {
            text: 'Quarterly Results',
            offsetX: 10
        },
        tooltip: {
            x: {
                formatter: function (val, opts) {
                    return opts.w.globals.seriesNames[opts.seriesIndex];
                }
            },
            y: {
                title: {
                    formatter: function (val, opts) {
                        return opts.w.globals.labels[opts.dataPointIndex];
                    }
                }
            }
        }
    };

    const changeData = () => {
        Apex.exec('barYear', 'updateSeries', [
            {
                data: makeData()
            }
        ]);
    };

    return (
        <div id="wrap">
            <select id="model" class="flat-select" onChange={() => this.changeData()}>
                <option value="iphone5">iPhone 5</option>
                <option value="iphone6">iPhone 6</option>
                <option value="iphone7">iPhone 7</option>
            </select>
            <div id="chart-year">
                <ReactApexChart options={options} series={series} type="bar" height={400} />
            </div>
            <div id="chart-quarter">
                <ReactApexChart options={optionsQuarter} series={seriesQuarter} type="bar" height={400} />
            </div>
        </div>
    );
};
