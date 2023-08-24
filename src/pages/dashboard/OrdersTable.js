/* eslint-disable*/
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

// material-ui
import { Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Badge, Tooltip, Button } from 'antd';

// third-party
import ReactApexChart from 'react-apexcharts';

// project import
import Dot from 'components/@extended/Dot';

// 교육상황
import { useSelectMainEduStatisticsMutation } from '../../hooks/api/MainManagement/MainManagement';

export const OrdersTable = () => {
    const [order] = useState('asc');
    const [orderBy] = useState('userName');
    const [selected] = useState([]);
    const [loading, setLoading] = useState(false);
    const isSelected = (userName) => selected.indexOf(userName) !== -1;

    // ===============================
    // Api 호출 Start
    // 조회 ======================================================
    const [SelectMainEduStatisticsApi] = useSelectMainEduStatisticsMutation(); // 콘텐츠 정보 관리 hooks api호출
    const [selectMainEduStatisticsData, setSelectMainEduStatisticsData] = useState(); // 콘텐츠 정보관리 리스트 상단 값
    const handel_SelectMainEduStatistics_Api = async () => {
        const SelectMainEduStatisticsResponse = await SelectMainEduStatisticsApi({});
        setSelectMainEduStatisticsData(
            SelectMainEduStatisticsResponse?.data?.RET_DATA.map((d) =>
                createData(
                    d.userNm,
                    <span>
                        [{d.procYear}] {d.procName} {d.procSeq}차
                    </span>,
                    d.limitPersonCnt,
                    `${d.eduStartDate} ~ ${d.eduEndDate}`,
                    d.eduPercent
                )
            )
        );

        setLoading(false);
    };
    // Api 호출 Start
    // ===============================

    function createData(userName, name, totalcnt, bcnt, cper) {
        return { userName, name, totalcnt, bcnt, cper };
    }

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
            colors: ['#1ab7ea'],
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

    function descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    // ==============================|| ORDER TABLE - HEADER CELL ||============================== //

    const headCells = [
        {
            id: 'userName',
            align: 'center',
            disablePadding: false,
            label: '강사'
        },
        {
            id: 'name',
            align: 'center',
            disablePadding: true,
            label: '차수명(차수)'
        },
        {
            id: 'totalcnt',
            align: 'center',
            disablePadding: false,
            label: '교육인원'
        },
        {
            id: 'bcnt',
            align: 'center',
            disablePadding: false,
            label: '교육일정'
        },
        {
            id: 'cper',
            align: 'center',
            disablePadding: false,
            label: '교육진행율(%)'
        }
    ];

    // ==============================|| ORDER TABLE - HEADER ||============================== //

    function OrderTableHead({ order, orderBy }) {
        return (
            <TableHead>
                <TableRow>
                    {headCells.map((headCell) => (
                        <TableCell
                            style={{ fontSize: '14px', background: 'rgb(221 219 219)' }}
                            key={headCell.id}
                            align={headCell.align}
                            padding={headCell.disablePadding ? 'none' : 'normal'}
                            sortDirection={orderBy === headCell.id ? order : false}
                        >
                            {headCell.label}
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
        );
    }

    OrderTableHead.propTypes = {
        order: PropTypes.string,
        orderBy: PropTypes.string
    };

    // ==============================|| ORDER TABLE - STATUS ||============================== //

    const OrderStatus = ({ status }) => {
        let color;
        let title;

        switch (status) {
            case 0:
                color = 'warning';
                title = 'Pending';
                break;
            case 1:
                color = 'success';
                title = 'Approved';
                break;
            case 2:
                color = 'error';
                title = 'Rejected';
                break;
            default:
                color = 'primary';
                title = 'None';
        }

        return (
            <Stack direction="row" spacing={1} alignItems="center">
                <Dot color={color} />
                <Typography>{title}</Typography>
            </Stack>
        );
    };

    OrderStatus.propTypes = {
        status: PropTypes.number
    };

    // ==============================|| ORDER TABLE ||============================== //

    useEffect(() => {
        setLoading(true); // 로딩 호출
        handel_SelectMainEduStatistics_Api(); // 리스트
    }, []);

    return (
        <Box>
            <TableContainer
                sx={{
                    width: '100%',
                    overflowX: 'auto',
                    position: 'relative',
                    display: 'block',
                    maxWidth: '100%',
                    '& td, & th': { whiteSpace: 'nowrap' }
                }}
            >
                <Table
                    aria-labelledby="tableTitle"
                    sx={{
                        '& .MuiTableCell-root:first-of-type': {
                            pl: 2
                        },
                        '& .MuiTableCell-root:last-of-type': {
                            pr: 3
                        }
                    }}
                >
                    <OrderTableHead order={order} orderBy={orderBy} />
                    <TableBody>
                        {selectMainEduStatisticsData?.map((row, index) => {
                            const isItemSelected = isSelected(row.userName);
                            const labelId = `enhanced-table-checkbox-${index}`;

                            return (
                                <TableRow
                                    hover
                                    role="checkbox"
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    key={row.userName}
                                    selected={isItemSelected}
                                >
                                    <TableCell align="center" style={{ width: '20%', fontSize: '14px' }}>
                                        {row.userName}
                                    </TableCell>
                                    <TableCell align="center" style={{ width: '25%', fontSize: '14px' }}>
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="center" style={{ width: '20%', fontSize: '14px' }}>
                                        <Button type="text">
                                            <Badge
                                                count={row.totalcnt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                color="#faad14"
                                                style={{ padding: '0 20px' }}
                                                overflowCount={9999}
                                            />
                                        </Button>
                                    </TableCell>
                                    <TableCell align="center" style={{ width: '20%', fontSize: '14px' }}>
                                        {row.bcnt}
                                    </TableCell>
                                    <TableCell align="center" style={{ width: '15%' }}>
                                        <div style={{ float: 'left', marign: '0' }}>
                                            <Tooltip title={`${row.cper}%`}>
                                                <ReactApexChart
                                                    options={areaChartOptions.options}
                                                    series={[row.cper]}
                                                    type="radialBar"
                                                    height={70}
                                                />
                                            </Tooltip>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};
