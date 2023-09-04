/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Table, Badge, Button, Modal, Row, Col, Space, Input } from 'antd';
import { Typography } from '@mui/material';

import { useSelectStatisticsEvaluationGroupListMutation } from '../../../hooks/api/StatisticsManagement/StatisticsManagement';

// project import
import MainCard from 'components/MainCard';

export const Evaluation_Contentgroup = () => {
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]); // 학습 실적 Table 데이터 값

    const [searchval, setSearchval] = useState(null);

    const [SelectStatisticsEvaluationGroupListApi] = useSelectStatisticsEvaluationGroupListMutation(); // 콘텐츠 정보 관리 hooks api호출
    const handel_SelectStatisticsEvaluationGroupList_Api = async () => {
        const SelectStatisticsEvaluationGroupListresponse = await SelectStatisticsEvaluationGroupListApi({
            searchval: searchval
        });
        setDataSource([
            ...SelectStatisticsEvaluationGroupListresponse?.data?.RET_DATA.map((d, i) => ({
                key: d.procCd /* 차수번호 */,
                rowdata0: i + 1,
                rowdata1: d.procYear /* 차수년도 */,
                rowdata2: d.procName /* 차수명 */,
                rowdata3: d.procSeq /* 차수 */,
                rowdata4: d.groupName /* 물품분류명 */,
                rowdata5: d.rightCnt /* 정답수 */,
                rowdata6: d.wrongCnt /* 오답수 */,
                rowdata7: d.totalCnt /* 총문항수 */
            }))
        ]);
        setLoading(false);
    };

    const defaultColumns = [
        {
            title: 'No.',
            dataIndex: 'rowdata0',
            align: 'center'
        },
        {
            title: '학습년도',
            dataIndex: 'rowdata1',
            align: 'center'
        },
        {
            title: '물품분류명칭',
            dataIndex: 'rowdata4',
            align: 'center'
        },
        {
            title: '차수명(차수)',
            dataIndex: 'rowdata2',
            align: 'center',
            render: (_, { rowdata2, rowdata3 }) => (
                <>
                    {rowdata2} [{rowdata3}차]
                </>
            )
        },
        {
            title: '총문항수',
            dataIndex: 'rowdata7',
            align: 'center',
            render: (_, { rowdata7 }) => (
                <>
                    <Badge
                        style={{ width: '35px', height: '35px', lineHeight: '35px', borderRadius: '50%' }}
                        count={rowdata7.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        color="blue"
                        overflowCount={999}
                    />
                </>
            )
        },
        {
            title: '정답수',
            dataIndex: 'rowdata5',
            align: 'center',
            render: (_, { rowdata5 }) => (
                <>
                    <Badge
                        style={{ width: '35px', height: '35px', lineHeight: '35px', borderRadius: '50%' }}
                        count={rowdata5.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        color="green"
                        overflowCount={999}
                    />
                </>
            )
        },
        {
            title: '오답수',
            dataIndex: 'rowdata6',
            align: 'center',
            render: (_, { rowdata6 }) => (
                <>
                    <Badge
                        style={{ width: '35px', height: '35px', lineHeight: '35px', borderRadius: '50%' }}
                        count={rowdata6.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        color="volcano"
                        overflowCount={999}
                    />
                </>
            )
        }
    ];

    const columns = defaultColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title
                // handleSave
            })
        };
    });

    const onSearch = (value) => {
        setSearchval(value);
    };

    useEffect(() => {
        setLoading(true); // 로딩 호출
        handel_SelectStatisticsEvaluationGroupList_Api(); // 조회
    }, [searchval]);

    return (
        <>
            <MainCard title="평가 컨텐츠 그룹별 출제 문항">
                <Typography variant="body1">
                    <Row gutter={[8, 8]} style={{ marginBottom: 16 }}>
                        <Col span={12}>
                            <div style={{ display: 'flex', justifyContent: 'flex-start', fontSize: '14px' }}>
                                <Space size="middle">
                                    <Input.Search
                                        placeholder="※ 통합 검색 (학습년도, 물품분류명칭, 차수명, 차수)"
                                        style={{ width: 483 }}
                                        onSearch={onSearch}
                                        allowClear
                                        enterButton
                                        size="middle"
                                        className="custom-search-input"
                                    />
                                </Space>
                            </div>
                        </Col>
                    </Row>
                </Typography>
                <Table rowClassName={() => 'editable-row'} bordered dataSource={dataSource} loading={loading} columns={columns} />
            </MainCard>
        </>
    );
};
