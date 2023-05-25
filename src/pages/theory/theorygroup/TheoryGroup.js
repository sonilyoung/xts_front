/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
// project import
import { TheoryGroup_L } from './TheoryGroup_L';
import { TheoryGroup_M } from './TheoryGroup_M';
import { TheoryGroup_S } from './TheoryGroup_S';

import { Col, Row } from 'antd';
import { Typography } from '@mui/material';
import MainCard from 'components/MainCard';

export const TheoryGroup = () => {
    const [procGroupCd_L, setProcGroupCd_L] = useState('');
    const [procGroupCd_M, setProcGroupCd_M] = useState('');
    const [procGroupCd_S, setProcGroupCd_S] = useState('');

    const TheoryGroup_Call_M = (procGroupCd_M) => {
        setProcGroupCd_L(procGroupCd_M);
        setProcGroupCd_M(procGroupCd_M);
        setProcGroupCd_S('');
        console.log(procGroupCd_M);
    };

    const TheoryGroup_Call_S = (procGroupCd_S) => {
        setProcGroupCd_S(procGroupCd_S);
        console.log(procGroupCd_S);
    };

    return (
        <MainCard title="그룹 관리">
            <Typography variant="body1">
                <Row gutter={[16, 8]}>
                    <Col span={8}>
                        <TheoryGroup_L typeselect="L" procGroupCd_L={procGroupCd_L} TheoryGroup_Call_M={TheoryGroup_Call_M} />
                    </Col>
                    <Col span={8}>
                        <TheoryGroup_M typeselect="M" procGroupCd_M={procGroupCd_M} TheoryGroup_Call_S={TheoryGroup_Call_S} />
                    </Col>
                    <Col span={8}>
                        <TheoryGroup_S typeselect="S" procGroupCd_S={procGroupCd_S} />
                    </Col>
                </Row>
            </Typography>
        </MainCard>
    );
};
// export default TheoryGroup;
