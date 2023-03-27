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

function createData(trackingNo, name, totalcnt, bcnt, cper) {
    return { trackingNo, name, totalcnt, bcnt, cper };
}

const rows = [
    createData(
        84564564,
        <span>
            Aerosol
            <br />
            [에어로졸]
        </span>,
        119,
        82,
        69
    ),
    createData(
        84564565,
        <span>
            Alcohol
            <br />
            [알콜]
        </span>,
        249,
        136,
        55
    ),
    createData(
        84564566,
        <span>
            Ax <br /> [도끼]
        </span>,
        244,
        133,
        55
    ),
    createData(
        84564567,
        <span>
            Bat
            <br />
            [배트]
        </span>,
        25,
        1,
        4
    ),
    createData(
        84564568,
        <span>
            Battery
            <br />
            [배터리]
        </span>,
        104,
        66,
        63
    ),
    createData(
        84564569,
        <span>
            Bullet
            <br />
            [총알]
        </span>,
        71,
        4,
        6
    ),
    createData(
        84564570,
        <span>
            Chisel
            <br />
            [조각끌]
        </span>,
        119,
        77,
        65
    ),
    createData(
        84564571,
        <span>
            Electronic
            <br />
            [전자]
        </span>,
        41,
        38,
        93
    ),
    createData(
        84564574,
        <span>
            Cigarettes
            <br />
            [담배]
        </span>,
        9,
        1,
        11
    ),
    createData(
        84564575,
        <span>
            Liquid
            <br />
            [액체]
        </span>,
        109,
        49,
        45
    ),
    createData(
        84564576,
        <span>
            Firecracker
            <br />
            [폭죽]
        </span>,
        2,
        2,
        100
    ),
    createData(
        84564577,
        <span>
            Gun
            <br />
            [총]
        </span>,
        12,
        6,
        50
    ),
    createData(
        84564578,
        <span>
            GunParts
            <br />
            [건파츠]
        </span>,
        242,
        149,
        62
    ),
    createData(
        84564579,
        <span>
            Hammer
            <br />
            [망치]
        </span>,
        70,
        30,
        43
    ),
    createData(
        84564580,
        <span>
            HandCuffs
            <br />
            [수갑]
        </span>,
        104,
        53,
        51
    ),
    createData(
        84564581,
        <span>
            HDD
            <br />
            [하드디스크]
        </span>,
        104,
        63,
        61
    ),
    createData(
        84564582,
        <span>
            Laptop
            <br />
            [노트북]
        </span>,
        42,
        20,
        48
    ),
    createData(
        84564583,
        <span>
            Lighter
            <br />
            [라이타]
        </span>,
        58,
        58,
        100
    ),
    createData(
        84564585,
        <span>
            Match
            <br />
            [성냥]
        </span>,
        55,
        38,
        69
    ),
    createData(
        84564586,
        <span>
            MetalPipe
            <br />
            [메탈파이프]
        </span>,
        19,
        8,
        42
    ),
    createData(
        84564587,
        <span>
            NailClippers
            <br />
            [손톱깎이]
        </span>,
        20,
        3,
        15
    ),
    createData(
        84564588,
        <span>
            Plier
            <br />
            [펜치]
        </span>,
        41,
        11,
        27
    ),
    createData(
        84564589,
        <span>
            Prtable Gas
            <br />
            [휴대용 가스]
        </span>,
        161,
        57,
        35
    ),
    createData(
        84564590,
        <span>
            Saw
            <br />
            [톱]
        </span>,
        106,
        64,
        60
    ),
    createData(
        84564591,
        <span>
            Scissors
            <br />
            [가위]
        </span>,
        36,
        5,
        14
    ),
    createData(
        84564592,
        <span>
            Screwdriver
            <br />
            [드라이버]
        </span>,
        133,
        102,
        7
    ),
    createData(
        84564593,
        <span>
            SmartPhone
            <br />
            [스마트 폰]
        </span>,
        15,
        13,
        87
    ),
    createData(
        84564594,
        <span>
            Spanner
            <br />
            [스패너]
        </span>,
        1,
        0,
        0
    ),
    createData(
        84564595,
        <span>
            SSD
            <br />
            [하드디스크]
        </span>,
        106,
        67,
        63
    ),
    createData(
        84564596,
        <span>
            Supp
            <br />
            [좌약]
        </span>,
        105,
        61,
        58
    ),
    createData(
        84564598,
        <span>
            Tablet PC
            <br />
            [테블릿 PC]
        </span>,
        79,
        69,
        87
    ),
    createData(
        84564599,
        <span>
            Thinner
            <br />
            [희석제]
        </span>,
        1,
        1,
        100
    ),
    createData(
        84564602,
        <span>
            USB
            <br />
            [이동식 기억장치]
        </span>,
        3,
        3,
        100
    ),
    createData(
        84564603,
        <span>
            Zippo Oil
            <br />
            [라이터 기름]
        </span>,
        18,
        17,
        94
    ),
    createData(
        84564604,
        <span>
            Knife
            <br />
            [칼]
        </span>,
        19,
        3,
        16
    ),
    createData(
        84564605,
        <span>
            SolidFuel
            <br />
            [고체연료]
        </span>,
        4,
        4,
        100
    ),
    createData(
        84564606,
        <span>
            Stungun
            <br />
            [전기총]
        </span>,
        34,
        20,
        59
    )
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
        id: 'trackingNo',
        align: 'center',
        disablePadding: false,
        label: '제품번호'
    },
    {
        id: 'name',
        align: 'center',
        disablePadding: true,
        label: '상품명'
    },
    {
        id: 'totalcnt',
        align: 'center',
        disablePadding: false,
        label: '총건수'
        // },
        // {
        //     id: 'aper',
        //     align: 'center',
        //     disablePadding: false,
        //     label: '정답률'
    },
    {
        id: 'bcnt',
        align: 'center',
        disablePadding: false,
        label: '오답건수'
    },
    {
        id: 'cper',
        align: 'center',
        disablePadding: false,
        label: '오답률'
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
                        {stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
                            const isItemSelected = isSelected(row.trackingNo);
                            const labelId = `enhanced-table-checkbox-${index}`;

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
                                    <TableCell align="center" style={{ width: '20%', fontSize: '14px' }}>
                                        {row.trackingNo}
                                    </TableCell>
                                    <TableCell align="center" style={{ width: '25%', fontSize: '14px' }}>
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="center" style={{ width: '20%', fontSize: '14px' }}>
                                        <Badge
                                            count={row.totalcnt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            color="#faad14"
                                            overflowCount={9999}
                                        />
                                        {/* {row.totalcnt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} */}
                                    </TableCell>
                                    {/* <TableCell align="center">{row.aper}%</TableCell> */}
                                    <TableCell align="center" style={{ width: '20%', fontSize: '14px' }}>
                                        <Badge
                                            count={row.bcnt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            color="#52c41a"
                                            overflowCount={9999}
                                        />
                                        {/* {row.bcnt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} */}
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
