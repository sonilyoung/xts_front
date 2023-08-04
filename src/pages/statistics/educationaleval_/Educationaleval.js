/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Table, Tag, Badge } from 'antd';
import { Typography } from '@mui/material';

// project import
import MainCard from 'components/MainCard';

export const Educationaleval = () => {
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([
        {
            rowdata0: '1',
            rowdata1: '2016',
            rowdata2: '-',
            rowdata3: '1차',
            rowdata4: 'KKTS',
            rowdata5: '대문자',
            rowdata6: '한수원(본사)',
            rowdata7: '-',
            rowdata8: '단계',
            rowdata9: '2017-09-13',
            rowdata10: 80,
            rowdata11: 30,
            rowdata12: '불합격'
        },
        {
            rowdata0: '2',
            rowdata1: '2016',
            rowdata2: '-',
            rowdata3: '1차',
            rowdata4: 'KKTS',
            rowdata5: '대문자',
            rowdata6: '한수원(본사)',
            rowdata7: '-',
            rowdata8: '최종',
            rowdata9: '2017-10-30',
            rowdata10: 80,
            rowdata11: 30,
            rowdata12: '불합격'
        },
        {
            rowdata0: '3',
            rowdata1: '2016',
            rowdata2: '-',
            rowdata3: '1차',
            rowdata4: 'cbt01',
            rowdata5: 'CBT01',
            rowdata6: 'CBT',
            rowdata7: 'CBT',
            rowdata8: '단계',
            rowdata9: '2022-07-22',
            rowdata10: 80,
            rowdata11: 35,
            rowdata12: '불합격'
        },
        {
            rowdata0: '4',
            rowdata1: '2016',
            rowdata2: '-',
            rowdata3: '1차',
            rowdata4: 'hjh',
            rowdata5: '황재홍',
            rowdata6: '한수원(월성)',
            rowdata7: '개발팀',
            rowdata8: '단계',
            rowdata9: '2017-09-13',
            rowdata10: 80,
            rowdata11: 74.57,
            rowdata12: '불합격'
        },
        {
            rowdata0: '5',
            rowdata1: '2016',
            rowdata2: '-',
            rowdata3: '1차',
            rowdata4: 'hjh',
            rowdata5: '황재홍',
            rowdata6: '한수원(월성)',
            rowdata7: '개발팀',
            rowdata8: '최종',
            rowdata9: '2016-05-21',
            rowdata10: 80,
            rowdata11: 82.5,
            rowdata12: '합격'
        },
        {
            rowdata0: '6',
            rowdata1: '2016',
            rowdata2: '-',
            rowdata3: '1차',
            rowdata4: 'kkt',
            rowdata5: '설현',
            rowdata6: '한수원(한울)',
            rowdata7: '개발팀',
            rowdata8: '단계',
            rowdata9: '2018-07-24',
            rowdata10: 80,
            rowdata11: 34.82,
            rowdata12: '불합격'
        },
        {
            rowdata0: '7',
            rowdata1: '2016',
            rowdata2: '-',
            rowdata3: '1차',
            rowdata4: 'kkt',
            rowdata5: '설현',
            rowdata6: '한수원(한울)',
            rowdata7: '개발팀',
            rowdata8: '최종',
            rowdata9: '2016-07-12',
            rowdata10: 80,
            rowdata11: 25,
            rowdata12: '불합격'
        },
        {
            rowdata0: '8',
            rowdata1: '2016',
            rowdata2: '-',
            rowdata3: '1차',
            rowdata4: 'kkt',
            rowdata5: '설현',
            rowdata6: '한수원(한울)',
            rowdata7: '개발팀',
            rowdata8: '변경',
            rowdata9: '2018-07-24',
            rowdata10: 80,
            rowdata11: 0,
            rowdata12: '불합격'
        },
        {
            rowdata0: '9',
            rowdata1: '2016',
            rowdata2: '-',
            rowdata3: '1차',
            rowdata4: 'ksk',
            rowdata5: '김슬기',
            rowdata6: '한수원(한빛)',
            rowdata7: '개발팀',
            rowdata8: '단계',
            rowdata9: '2017-09-13',
            rowdata10: 80,
            rowdata11: 30,
            rowdata12: '불합격'
        },
        {
            rowdata0: '10',
            rowdata1: '2016',
            rowdata2: '-',
            rowdata3: '1차',
            rowdata4: 'ksk',
            rowdata5: '김슬기',
            rowdata6: '한수원(한빛)',
            rowdata7: '개발팀',
            rowdata8: '최종',
            rowdata9: '2017-10-31',
            rowdata10: 80,
            rowdata11: 97.5,
            rowdata12: '합격'
        },
        {
            rowdata0: '11',
            rowdata1: '2016',
            rowdata2: '-',
            rowdata3: '1차',
            rowdata4: 'kt',
            rowdata5: '태희',
            rowdata6: '한수원(한빛)',
            rowdata7: '-',
            rowdata8: '단계',
            rowdata9: '2017-09-13',
            rowdata10: 80,
            rowdata11: 25,
            rowdata12: '불합격'
        }
    ]);
    const [count, setCount] = useState(dataSource.length);

    const defaultColumns = [
        {
            width: '70px',
            title: 'No.',
            dataIndex: 'rowdata0',
            align: 'center'
        },
        {
            width: '80px',
            title: '교육년도',
            dataIndex: 'rowdata1',
            align: 'center'
        },
        {
            title: '과정명',
            dataIndex: 'rowdata2',
            align: 'center'
        },
        {
            width: '80px',
            title: '과정차수',
            dataIndex: 'rowdata3',
            align: 'center'
        },
        {
            title: '사용자ID',
            dataIndex: 'rowdata4',
            align: 'center'
        },
        {
            title: '교육생명',
            dataIndex: 'rowdata5',
            align: 'center'
        },
        {
            title: '기관',
            dataIndex: 'rowdata6',
            align: 'center'
        },
        {
            title: '부서',
            dataIndex: 'rowdata7',
            align: 'center'
        },
        {
            width: '80px',
            title: '교육타입',
            dataIndex: 'rowdata8',
            align: 'center'
        },
        {
            title: '평가일자',
            dataIndex: 'rowdata9',
            align: 'center'
        },
        {
            width: '80px',
            title: '과락점수',
            dataIndex: 'rowdata10',
            align: 'center',
            render: (_, { rowdata10 }) => (
                <>
                    <Badge count={rowdata10.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} color="#faad14" overflowCount={9999} />
                </>
            )
        },
        {
            title: '취득점수',
            dataIndex: 'rowdata11',
            align: 'center',
            render: (_, { rowdata11 }) => (
                <>
                    <Badge count={rowdata11.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} color="#87d068" overflowCount={9999} />
                </>
            )
        },
        {
            width: '80px',
            title: '합격여부',
            dataIndex: 'rowdata12',
            align: 'center',
            render: (_, { rowdata12 }) =>
                rowdata12 === '합격' ? (
                    <Tag style={{ width: '60px', borderRadius: '5px', padding: '0 10px' }} color="#87d068">
                        {rowdata12}
                    </Tag>
                ) : (
                    <Tag style={{ width: '60px', borderRadius: '5px', padding: '0 10px' }}> {rowdata12}</Tag>
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

    return (
        <>
            <MainCard title="교육평가 조회">
                <Typography variant="body1"></Typography>
                <Table rowClassName={() => 'editable-row'} bordered dataSource={dataSource} loading={loading} columns={columns} />
            </MainCard>
        </>
    );
};
// export default Educationaleval;
