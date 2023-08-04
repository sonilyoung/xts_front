/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Table, Tag, Badge } from 'antd';
import { Typography } from '@mui/material';

// project import
import MainCard from 'components/MainCard';

export const Evaluation_Contentgroup = () => {
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([
        {
            rowdata0: '1',
            rowdata1: '2016',
            rowdata2: '항공보안검색요원 초기 교육과정[1차]',
            rowdata3: '총기류',
            rowdata4: '80',
            rowdata5: '60',
            rowdata6: '20%'
        },
        {
            rowdata0: '2',
            rowdata1: '2016',
            rowdata2: '항공보안검색요원 초기 교육과정[1차]',
            rowdata3: '총기부품류',
            rowdata4: '80',
            rowdata5: '70',
            rowdata6: '10%'
        },
        {
            rowdata0: '3',
            rowdata1: '2016',
            rowdata2: '항공보안검색요원 초기 교육과정[1차]',
            rowdata3: '폭발물류1',
            rowdata4: '60',
            rowdata5: '40',
            rowdata6: '60%'
        },
        {
            rowdata0: '4',
            rowdata1: '2016',
            rowdata2: '항공보안검색요원 초기 교육과정[1차]',
            rowdata3: '폭발물구성품',
            rowdata4: '70',
            rowdata5: '50',
            rowdata6: '80%'
        },
        {
            rowdata0: '5',
            rowdata1: '2016',
            rowdata2: '항공보안검색요원 초기 교육과정[1차]',
            rowdata3: '도화선',
            rowdata4: '50',
            rowdata5: '50',
            rowdata6: '0%'
        },
        {
            rowdata0: '6',
            rowdata1: '2016',
            rowdata2: '항공보안검색요원 초기 교육과정[1차]',
            rowdata3: '실탄류',
            rowdata4: '60',
            rowdata5: '50',
            rowdata6: '10%'
        },
        {
            rowdata0: '7',
            rowdata1: '2016',
            rowdata2: '항공보안검색요원 초기 교육과정[1차]',
            rowdata3: '도검류',
            rowdata4: '70',
            rowdata5: '40',
            rowdata6: '40%'
        },
        {
            rowdata0: '8',
            rowdata1: '2016',
            rowdata2: '항공보안검색요원 초기 교육과정[1차]',
            rowdata3: '일반무기',
            rowdata4: '70',
            rowdata5: '30',
            rowdata6: '60%'
        },
        {
            rowdata0: '9',
            rowdata1: '2016',
            rowdata2: '항공보안검색요원 초기 교육과정[1차]',
            rowdata3: '스포츠용품류',
            rowdata4: '80',
            rowdata5: '40',
            rowdata6: '50%'
        },
        {
            rowdata0: '10',
            rowdata1: '2016',
            rowdata2: '항공보안검색요원 초기 교육과정[1차]',
            rowdata3: '위장무기류',
            rowdata4: '80',
            rowdata5: '70',
            rowdata6: '10%'
        },
        {
            rowdata0: '11',
            rowdata1: '2016',
            rowdata2: '항공보안검색요원 초기 교육과정[1차]',
            rowdata3: '공구/생활용품류',
            rowdata4: '60',
            rowdata5: '60',
            rowdata6: '0'
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
            title: '물품분류명칭',
            dataIndex: 'rowdata3',
            align: 'center'
        },
        {
            title: '차수명(차수)',
            dataIndex: 'rowdata2',
            align: 'center'
        },

        {
            title: '총문항수',
            dataIndex: 'rowdata4',
            align: 'center'
        },
        {
            title: '정답률',
            dataIndex: 'rowdata5',
            align: 'center'
        },
        {
            title: '오답률',
            dataIndex: 'rowdata6',
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
            <MainCard title="평가 컨텐츠 그룹별 출제 문항">
                <Typography variant="body1"></Typography>
                <Table rowClassName={() => 'editable-row'} bordered dataSource={dataSource} loading={loading} columns={columns} />
            </MainCard>
        </>
    );
};
