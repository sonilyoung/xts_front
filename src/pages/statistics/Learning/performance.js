/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Table, Badge, Button } from 'antd';
import { Typography } from '@mui/material';

// project import
import MainCard from 'components/MainCard';

export const Learning_Performance = () => {
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([
        {
            rowdata0: '1',
            rowdata1: '2023',
            rowdata2: '항공보안검색요원 초기 교육과정 [5차]',
            rowdata3: '80',
            rowdata4: '40',
            rowdata5: '88%'
        },
        {
            rowdata0: '2',
            rowdata1: '2023',
            rowdata2: '항공경비요원 초기 교육과정 [5차]',
            rowdata3: '70',
            rowdata4: '40',
            rowdata5: '80%'
        },
        {
            rowdata0: '3',
            rowdata1: '2023',
            rowdata2: '항공보안검색요원 정기 교육과정 [4차]',
            rowdata3: '90',
            rowdata4: '45',
            rowdata5: '80%'
        },
        {
            rowdata0: '4',
            rowdata1: '2023',
            rowdata2: '항공경비요원 정기 교육과정 [4차]',
            rowdata3: '88',
            rowdata4: '50',
            rowdata5: '70%'
        },
        {
            rowdata0: '5',
            rowdata1: '2023',
            rowdata2: '항공보안검색요원 초기 교육과정 [3차]',
            rowdata3: '80',
            rowdata4: '40',
            rowdata5: '80%'
        },
        {
            rowdata0: '6',
            rowdata1: '2023',
            rowdata2: '항공경비요원 초기 교육과정 [3차]',
            rowdata3: '76',
            rowdata4: '35',
            rowdata5: '60%'
        },
        {
            rowdata0: '7',
            rowdata1: '2022',
            rowdata2: '항공보안검색요원 초기 교육과정 [2차]',
            rowdata3: '90',
            rowdata4: '40',
            rowdata5: '70%'
        },
        {
            rowdata0: '8',
            rowdata1: '2022',
            rowdata2: '항공경비요원 초기 교육과정 [2차]',
            rowdata3: '90',
            rowdata4: '40',
            rowdata5: '80%'
        },
        {
            rowdata0: '9',
            rowdata1: '2022',
            rowdata2: '항공보안검색요원 정기 교육과정 [1차]',
            rowdata3: '80',
            rowdata4: '30',
            rowdata5: '80%'
        },
        {
            rowdata0: '10',
            rowdata1: '2022',
            rowdata2: '항공경비요원 정기 교육과정 [1차]',
            rowdata3: '70',
            rowdata4: '35',
            rowdata5: '70%'
        },
        {
            rowdata0: '11',
            rowdata1: '2022',
            rowdata2: '항공보안검색요원 초기 교육과정 [1차]',
            rowdata3: '60',
            rowdata4: '45',
            rowdata5: '90%'
        }
    ]);
    const [count, setCount] = useState(dataSource.length);

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
            title: '차수명 [차수]',
            dataIndex: 'rowdata2',
            align: 'center'
        },
        {
            title: '평균점수',
            dataIndex: 'rowdata3',
            align: 'center',
            render: (_, { rowdata3 }) => (
                <>
                    <Badge
                        count={rowdata3.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        status={rowdata3 >= '90' ? 'success' : rowdata3 < '80' ? 'error' : 'warning'}
                        overflowCount={99}
                    />
                </>
            )
        },
        {
            title: '교육인원',
            dataIndex: 'rowdata4',
            align: 'center',
            render: (_, { rowdata4 }) => (
                <>
                    <Button
                        style={{
                            border: '0xp',
                            background: '#1677ff',
                            color: '#fff',
                            borderRadius: '7px',
                            width: '70px',
                            boxShadow: '2px 3px 0px 0px #e8f2ff'
                        }}
                    >
                        {rowdata4}
                    </Button>
                </>
            )
        },
        {
            title: '합격율',
            dataIndex: 'rowdata5',
            align: 'center'
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

    return (
        <>
            <MainCard title="학습 실적 조회">
                <Typography variant="body1"></Typography>
                <Table rowClassName={() => 'editable-row'} bordered dataSource={dataSource} loading={loading} columns={columns} />
            </MainCard>
        </>
    );
};
// export default Educationaleval;
