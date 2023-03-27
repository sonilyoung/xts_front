/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
// project import
import { EduGroup_L } from './EduGroup_L';
import { EduGroup_M } from './EduGroup_M';
import { EduGroup_S } from './EduGroup_S';

import { Col, Row } from 'antd';
import { Typography } from '@mui/material';
import MainCard from 'components/MainCard';

export const EduGroup = () => {
    const [procGroupCd_L, setProcGroupCd_L] = useState('');
    const [procGroupCd_M, setProcGroupCd_M] = useState('');
    const [procGroupCd_S, setProcGroupCd_S] = useState('');

    const EduGroup_Call_M = (procGroupCd_M) => {
        setProcGroupCd_L(procGroupCd_M);
        setProcGroupCd_M(procGroupCd_M);
        setProcGroupCd_S('');
        console.log(procGroupCd_M);
    };

    const EduGroup_Call_S = (procGroupCd_S) => {
        setProcGroupCd_S(procGroupCd_S);
        console.log(procGroupCd_S);
    };

    return (
        <MainCard title="그룹 관리">
            <Typography variant="body1">
                <Row gutter={[16, 8]}>
                    <Col span={8}>
                        <EduGroup_L typeselect="L" procGroupCd_L={procGroupCd_L} EduGroup_Call_M={EduGroup_Call_M} />
                    </Col>
                    <Col span={8}>
                        <EduGroup_M typeselect="M" procGroupCd_M={procGroupCd_M} EduGroup_Call_S={EduGroup_Call_S} />
                    </Col>
                    <Col span={8}>
                        <EduGroup_S typeselect="S" procGroupCd_S={procGroupCd_S} />
                    </Col>
                </Row>
            </Typography>
        </MainCard>
    );
};
// export default EduGroup;
