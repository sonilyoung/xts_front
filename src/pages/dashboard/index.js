/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import '../../../src/';
// material-ui
import { FloatButton } from 'antd';
import { Box, Grid, Typography } from '@mui/material';

// project import
import { OrdersTable } from './OrdersTable';
import Schedule from './Schedule';
import IncomeAreaChart from './IncomeAreaChart';
import YearOrder from './YearOrder';
import YearPassPer from './YearPassPer';
import MainCard from 'components/MainCard';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export const DashboardDefault = () => {
    let [stateShow, setStateShow] = useState(false);
    useEffect(() => {
        let timer = setTimeout(() => {
            setStateShow(true);
        }, 300);
        return () => {
            clearTimeout(timer);
        };
    }, [stateShow]);

    return (
        <>
            {stateShow === true ? (
                <Grid container>
                    {/* row 1 */}
                    {/* <Grid item xs={12} mb={7} lg={12}>
                        <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item>
                                <Typography variant="h5">교육 스케쥴</Typography>
                            </Grid>
                        </Grid>
                        <MainCard content={false} sx={{ mt: 1.5 }}>
                            <Box sx={{ pt: 1, pr: 2 }}>
                                <Schedule />
                            </Box>
                        </MainCard>
                    </Grid> */}

                    {/* row 2 */}
                    <Grid item xs={12} mb={15} lg={12}>
                        <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item>
                                <Typography variant="h5">교육상황</Typography>
                            </Grid>
                            <Grid item />
                        </Grid>
                        <MainCard sx={{ mt: 2 }} content={false}>
                            <OrdersTable />
                        </MainCard>
                    </Grid>

                    {/* row 3 */}
                    <Grid item xs={12} mb={7} lg={12}>
                        <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item>
                                <Typography variant="h5">연도별 합격건</Typography>
                            </Grid>
                        </Grid>
                        <MainCard content={false} sx={{ mt: 1.5 }}>
                            <Box sx={{ pt: 1, pr: 2 }}>
                                <YearPassPer />
                            </Box>
                        </MainCard>
                    </Grid>

                    {/* row 4 
                    <Grid item xs={12} lg={12}>
                        <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item>
                                <Typography variant="h5">연도별 합격률</Typography>
                            </Grid>
                            <Grid item />
                        </Grid>
                        <MainCard sx={{ mt: 2 }} content={false}>
                            <YearOrder />
                        </MainCard>
                    </Grid>*/}
                </Grid>
            ) : null}
            <FloatButton.BackTop />
        </>
    );
};

// export default DashboardDefault;
