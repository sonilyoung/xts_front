/* eslint-disable*/
import PropTypes from 'prop-types';
import { useState } from 'react';
// import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Badge, Tooltip, Button } from 'antd';

// third-party
// import NumberFormat from 'react-number-format';
import ReactApexChart from 'react-apexcharts';

// project import
import Dot from 'components/@extended/Dot';

function createData(userName, name, totalcnt, bcnt, cper) {
    return { userName, name, totalcnt, bcnt, cper };
}

const rows = [
    createData('강민', <span>x-ray 판독 초급2023 - 1차</span>, 40, '2023-08-07 ~ 2023-08-11', 10),
    createData('김갑분', <span>x-ray 판독 중급2023 - 1차</span>, 50, '2023-08-14 ~ 2023-08-18', 0),
    createData('김상철', <span>x-ray 판독 고급2023 - 1차</span>, 50, '2023-08-21 ~ 2023-08-25', 0),
    createData('서희원', <span>x-ray 판독 초급2023 - 1차</span>, 40, '2023-08-28 ~ 2023-09-01', 0),
    createData('홍서방', <span>x-ray 판독 중급2023 - 1차</span>, 30, '2023-09-04 ~ 2023-09-08', 0)
];

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

function getComparator(order, orderBy) {
    return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
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

export default function OrderTable() {
    const [order] = useState('asc');
    const [orderBy] = useState('userName');
    const [selected] = useState([]);

    const isSelected = (userName) => selected.indexOf(userName) !== -1;

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
                        {stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
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
                                    {/* <TableCell align="center">{row.aper}%</TableCell> */}
                                    <TableCell align="center" style={{ width: '20%', fontSize: '14px' }}>
                                        {row.bcnt}
                                    </TableCell>
                                    <TableCell align="center" style={{ width: '15%' }}>
                                        <div style={{ float: 'left', marign: '0' }}>
                                            <Tooltip title={`${row.cper}%`}>
                                                <ReactApexChart
                                                    options={areaChartOptions.options}
                                                    // series={areaChartOptions.series}
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
}
