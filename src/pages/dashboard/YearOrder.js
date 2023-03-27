/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { useState } from 'react';
// import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Badge, Tooltip } from 'antd';

// third-party
// import NumberFormat from 'react-number-format';
import ReactApexChart from 'react-apexcharts';

// project import
import Dot from 'components/@extended/Dot';

function createData(year, avg, total, personnel, pass, passper) {
    return { year, avg, total, personnel, pass, passper };
}

const rows = [
    createData('2016년', 48, 672.5, 14, 5, 36),
    createData('2017년', 38, 761.4, 20, 9, 45),
    createData('2018년', 32, 730.2, 23, 12, 52),
    createData('2019년', 34, 854.1, 25, 18, 72),
    createData('2020년', 25, 661, 26, 6, 23),
    createData('2021년', 45, 678, 15, 10, 67),
    createData('2022년', 43, 781.2, 18, 16, 89)
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
        colors: ['#FDD835'],
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
        id: 'year',
        align: 'center',
        disablePadding: false,
        label: '교육년도'
    },
    {
        id: 'avg',
        align: 'center',
        disablePadding: true,
        label: '평균점수'
    },
    {
        id: 'total',
        align: 'center',
        disablePadding: false,
        label: '합계점수'
    },
    {
        id: 'personnel',
        align: 'center',
        disablePadding: false,
        label: '교육인원'
    },
    {
        id: 'pass',
        align: 'center',
        disablePadding: false,
        label: '합격자수'
    },
    {
        id: 'passper',
        align: 'center',
        disablePadding: false,
        label: '합격률'
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
    const [orderBy] = useState('trackingNo');
    const [selected] = useState([]);

    const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;

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
                        {stableSort(rows, getComparator(order, orderBy)).map((row) => {
                            const isItemSelected = isSelected(row.trackingNo);
                            // const labelId = `enhanced-table-checkbox-${index}`;

                            return (
                                <TableRow
                                    hover
                                    role="checkbox"
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    key={row.trackingNo}
                                    selected={isItemSelected}
                                >
                                    <TableCell align="center" style={{ width: '15%', fontSize: '14px', fontWeight: '700' }}>
                                        {row.year}
                                    </TableCell>
                                    <TableCell align="center" style={{ width: '10%', fontSize: '14px' }}>
                                        {row.avg}
                                    </TableCell>
                                    <TableCell align="center" style={{ width: '15%', fontSize: '14px' }}>
                                        {row.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    </TableCell>
                                    {/* <TableCell align="center">{row.aper}%</TableCell> */}
                                    <TableCell align="center" style={{ width: '20%', fontSize: '14px' }}>
                                        <Badge
                                            count={row.personnel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            color="#faad14"
                                            overflowCount={9999}
                                        />
                                    </TableCell>
                                    <TableCell align="center" style={{ width: '20%', fontSize: '14px' }}>
                                        <Badge
                                            count={row.pass.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            color="#52c41a"
                                            overflowCount={9999}
                                        />
                                    </TableCell>{' '}
                                    <TableCell align="center" style={{ width: '20%' }}>
                                        <div style={{ float: 'left', marign: '0', align: 'center' }}>
                                            <Tooltip title={`${row.passper}%`}>
                                                <ReactApexChart
                                                    options={areaChartOptions.options}
                                                    // series={areaChartOptions.series}
                                                    series={[row.passper]}
                                                    type="radialBar"
                                                    height={70}
                                                />
                                            </Tooltip>
                                        </div>
                                        {/* row.cper% */}
                                    </TableCell>
                                    {/* <TableCell align="left">
                                        <OrderStatus status={row.bper} />
                                    </TableCell> 
                                    <TableCell align="center">
                                        <NumberFormat value={row.protein} displayType="text" thousandSeparator prefix="$" />
                                    </TableCell>
                                    */}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
