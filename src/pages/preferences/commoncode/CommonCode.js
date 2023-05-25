/* eslint-disable no-unused-vars */
// material-ui
import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { Col, Row, Button, Table, Select, Space, Tooltip, Tag } from 'antd';
import { EnterOutlined } from '@ant-design/icons';

import { useGetCommonListMutation } from '../../../hooks/api/PreferencesManagement/PreferencesManagement';
import { useGetLanguageListMutation } from '../../../hooks/api/ContentsManagement/ContentsManagement';

// project import
import MainCard from 'components/MainCard';

export const CommonCode = () => {
    const [getCommonList] = useGetCommonListMutation(); // 콘텐츠 그룹 hooks api호출
    const [commonCodeList, setCommonCodeList] = useState(); // 콘텐츠 그룹 리스트 값
    const [getLanguageList] = useGetLanguageListMutation(); // 언어 hooks api호출
    const [languageSelect, setLanguageSelect] = useState([]); //셀렉트 박스 option Default 값
    const [dataSource, setDataSource] = useState([]); // Table 데이터 값
    const [defaultLanguage, setDefaultLanguage] = useState('kr');
    const [loading, setLoading] = useState(false);

    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10
        }
    });

    // 그룹 데이터 값 선언
    const handleCommonCode = async () => {
        const CommonCoderesponse = await getCommonList({
            languageCode: defaultLanguage
        });
        setCommonCodeList(CommonCoderesponse?.data?.RET_DATA);
        setDataSource([
            ...CommonCoderesponse?.data?.RET_DATA.map((d, i) => ({
                key: i,
                no: i + 1,
                codeId: d.codeId,
                codeName: d.codeName,
                useYn: d.useYn,
                insertId: d.insertId,
                insertDate: d.insertDate,
                children: d.subList.map((sl) => ({
                    key: i + 1 + sl.sortOrder,
                    no: <EnterOutlined style={{ transform: 'scalex(-1)' }} />,
                    codeId: sl.codeId,
                    codeName: sl.codeName,
                    useYn: sl.useYn,
                    insertId: sl.insertId,
                    insertDate: sl.insertDate
                }))
            }))
        ]);
        setLoading(false);
    };

    // 언어 셀렉트 Default 값 선언
    const handleLanguage = async () => {
        const Languageresponse = await getLanguageList({});
        setLanguageSelect([
            ...Languageresponse?.data?.RET_DATA?.map((lan) => ({
                value: lan.languageCode,
                label: lan.languageName
            }))
        ]);
        setLoading(false);
    };

    const columns = [
        {
            title: 'No',
            dataIndex: 'no',
            key: 'no',
            width: '95px',
            align: 'center'
        },
        {
            title: '공통코드',
            dataIndex: 'codeId',
            key: 'codeId',
            align: 'center'
        },
        {
            title: '공통코드명',
            dataIndex: 'codeName',
            key: 'codeName',
            align: 'center'
        },
        {
            title: '사용여부',
            dataIndex: 'useYn',
            key: 'useYn',
            render: (_, { useYn }) => (
                <>
                    {useYn === '1' ? (
                        <Tag color={'green'} key={useYn} onClick={() => handelUser()}>
                            사용
                        </Tag>
                    ) : (
                        <Tag color={'volcano'} key={useYn} onClick={() => handelUser()}>
                            미사용
                        </Tag>
                    )}
                </>
            ),
            align: 'center'
        },
        {
            title: '등록자ID',
            dataIndex: 'insertId',
            key: 'insertId',
            align: 'center'
        },
        {
            title: '등록일자',
            dataIndex: 'insertDate',
            key: 'insertDate',
            align: 'center'
        }
    ];

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        onSelect: (record, selected, selectedRows) => {
            console.log(record, selected, selectedRows);
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
            console.log(selected, selectedRows, changeRows);
        }
    };

    const onChange = (value) => {
        console.log(`selected ${value}`);
        setDefaultLanguage(value);
    };

    const onSearch = (value) => {
        console.log('search:', value);
    };

    // 언어 수정
    const handleEdit = () => {
        console.log('수정');
    };

    // 언어 삭제
    const handleDel = () => {
        console.log('삭제');
    };

    const handelUser = (e) => {
        console.log(e, '사용여부');
    };

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter
        });
    };

    useEffect(() => {
        setLoading(true);
        handleCommonCode();
        handleLanguage();
    }, [defaultLanguage]);

    return (
        <>
            <MainCard title="공통코드 관리">
                <Typography variant="body1">
                    <Row style={{ marginBottom: 16 }}>
                        <Col span={8}>
                            <Select
                                showSearch
                                placeholder=" Language Select "
                                optionFilterProp="children"
                                onChange={onChange}
                                onSearch={onSearch}
                                options={[...languageSelect]}
                            />
                        </Col>
                        <Col span={8} offset={8} style={{ textAlign: 'right' }}>
                            <Space>
                                <Tooltip title="수정">
                                    <Button
                                        type="primary"
                                        style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                        onClick={handleEdit}
                                    >
                                        수정
                                    </Button>
                                </Tooltip>
                                <Tooltip title="삭제">
                                    <Button
                                        type="danger"
                                        style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                        onClick={handleDel}
                                    >
                                        삭제
                                    </Button>
                                </Tooltip>
                            </Space>
                        </Col>
                    </Row>

                    <Table
                        {...tableParams}
                        columns={columns}
                        rowSelection={{
                            ...rowSelection
                        }}
                        rowClassName={(record) => (record.children !== undefined ? 'table-row-light' : 'table-row-lightblue')}
                        bordered={true}
                        dataSource={dataSource}
                        loading={loading}
                        onChange={handleTableChange}
                    />
                </Typography>
            </MainCard>
        </>
    );
};
// export default CommonCode;
