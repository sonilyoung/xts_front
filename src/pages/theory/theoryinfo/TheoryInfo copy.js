/* eslint-disable*/
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Typography } from '@mui/material';
import { Col, Row, Button, Form, Input, Table, Select, Space, Tooltip, Tag, Badge, Divider, Card, Modal, Drawer } from 'antd';
import 'antd/dist/antd.css';

import { PlusOutlined, EditFilled, DeleteFilled, ExclamationCircleFilled } from '@ant-design/icons';

// project import
import MainCard from 'components/MainCard';

export const TheoryInfo = () => {
    const { confirm } = Modal;
    const [form] = Form.useForm();

    const [TheoryInfoList, setTheoryInfoList] = useState(); // 리스트 값
    const [dataSource, setDataSource] = useState([]); // Table 데이터 값
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); //셀렉트 박스 option Selected 값
    const [loading, setLoading] = useState(false); // 로딩 초기값
    const [open, setOpen] = useState(false); // Drawer 추가 우측폼 상태
    const [dataEdit, setDataEdit] = useState(false); // Drawer 수정 우측폼 상태

    // 추가 및 수정 input 기본값 정리
    const [TheoryInfoNmVal, setTheoryInfoNmVal] = useState();
    const [TheoryInfoCdVal, setTheoryInfoCdVal] = useState();
    const [unitParams, setUnitParams] = useState({});
    const [refresh, setRefresh] = useState(false); //리프레쉬

    const handleTheoryInfo = () => {
        setDataSource([
            {
                key: '1',
                rowdata0: '1',
                rowdata1: 'S000001',
                rowdata2: '사지선다형',
                rowdata3: '2레벨',
                rowdata4: '발전소 반입 금지 물품은 무엇입니까?',
                rowdata5: '테스트',
                rowdata6: '사용',
                rowdata7: '2023-05-27'
            },
            {
                key: '2',
                rowdata0: '2',
                rowdata1: 'S000002',
                rowdata2: '사지선다형',
                rowdata3: '3레벨',
                rowdata4: 'What are the power plants bring prohihited goods?',
                rowdata5: '관리자',
                rowdata6: '사용',
                rowdata7: '2023-05-27'
            },
            {
                key: '3',
                rowdata0: '3',
                rowdata1: 'S000003',
                rowdata2: '사지선다형',
                rowdata3: '1레벨',
                rowdata4: '테스트 입니다.',
                rowdata5: '테스트',
                rowdata6: '사용',
                rowdata7: '2023-05-27'
            },
            {
                key: '4',
                rowdata0: '4',
                rowdata1: 'S000004',
                rowdata2: '사지선다형',
                rowdata3: '1레벨',
                rowdata4: '테스트 중입니다.',
                rowdata5: '테스트',
                rowdata6: '사용',
                rowdata7: '2023-05-28'
            },
            {
                key: '5',
                rowdata0: '5',
                rowdata1: 'S000005',
                rowdata2: '사지선다형',
                rowdata3: '2레벨',
                rowdata4: '발전소 반입 금지 물품은 무엇입니까?',
                rowdata5: '테스트',
                rowdata6: '사용',
                rowdata7: '2023-05-28'
            }
        ]);
    };
    const defaultColumns = [
        {
            width: '80px',
            title: 'No',
            dataIndex: 'rowdata0',
            align: 'center'
        },
        {
            title: '문제ID',
            dataIndex: 'rowdata1',
            align: 'center'
        },
        {
            title: '문제타입',
            dataIndex: 'rowdata2',
            align: 'center'
        },
        {
            title: '학습레벨',
            dataIndex: 'rowdata3',
            align: 'center'
        },
        {
            title: '질문',
            dataIndex: 'rowdata4',
            align: 'center'
        },
        {
            title: '출제자',
            dataIndex: 'rowdata5',
            align: 'center'
        },
        {
            title: '사용여부',
            key: 'tags',
            dataIndex: 'rowdata6',
            render: (_, { tags, rowdata6 }) => (
                <>
                    {tags.map((tag) => {
                        let color = rowdata6 === '사용' ? 'green' : 'volcano';
                        return (
                            <Tag color={color} key={tag} onClick={handelUser}>
                                {rowdata6.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
            align: 'center'
        },
        {
            title: '등록일자',
            dataIndex: 'rowdata7',
            render: (_, { rowdata7 }) => <>{rowdata7 === '' || rowdata7 === null ? '-' : rowdata7}</>,
            align: 'center'
        },
        {
            width: '150px',
            title: '수정',
            render: (_, { key }) => (
                <>
                    <Tooltip title="수정" color="#108ee9">
                        <Button
                            type="primary"
                            onClick={() => handleUnitMod(key)}
                            style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                            icon={<EditFilled />}
                        >
                            수정
                        </Button>
                    </Tooltip>
                </>
            ),
            align: 'center'
        }
    ];

    const handleSave = (row) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row
        });
        setDataSource(newData);
    };

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
                title: col.title,
                handleSave
            })
        };
    });

    //체크 박스 이벤트
    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    //체크 박스 선택
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange
    };

    // 추가
    const handleAdd = () => {
        console.log('언어 추가');
        setDataEdit(false);
        setOpen(true);
        setUnitParams(null);
        form.resetFields();
    };

    // 물품 수정 버튼
    const handleUnitMod = async (e) => {
        console.log('상세:', e);
        const response = await getTheoryInfo({
            codeNo: e
        });

        //console.log('unitName2:',response.data.RET_DATA.unitName);
        setUnitParams(response.data.RET_DATA);
        //params = response.data.RET_DATA;
        form.resetFields();
        setDataEdit(true);
        setOpen(true);
    };

    // 추가 취소
    const onAddClose = () => {
        setOpen(false);
        setDataEdit(false);
        setUnitParams(null);
        form.resetFields();
    };

    // 추가 등록
    const insertSubmit = async () => {
        setRefresh(response);
        Modal.success({
            content: '추가 완료',
            onOk() {
                setOpen(false);
                setDataEdit(false);
                form.resetFields();
            }
        });
    };

    // 수정
    const updateSubmit = async () => {
        setRefresh(response);
        Modal.success({
            content: '수정 완료',
            onOk() {
                setOpen(false);
                setDataEdit(false);
                form.resetFields();
            }
        });
    };

    // 삭제
    const deleteSubmit = async () => {
        setRefresh(response);
        Modal.success({
            content: '삭제 완료',
            onOk() {
                setOpen(false);
                setDataEdit(false);
                form.resetFields();
            }
        });
    };

    // 수정 버튼
    const handleEdit = (EditKey) => {
        console.log(EditKey);
        setDataEdit(true);
        setOpen(true);
    };

    // 삭제
    const handleDel = () => {
        if (selectedRowKeys == '') {
            Modal.error({
                content: '삭제할 항목을 선택해주세요.'
            });
        } else {
            confirm({
                title: '선택한 항목을 삭제하시겠습니까?',
                icon: <ExclamationCircleFilled />,
                content: selectedRowKeys + ' 항목의 데이터',
                okText: '예',
                okType: 'danger',
                cancelText: '아니오',
                onOk() {
                    Modal.success({
                        content: '삭제완료'
                    });
                },
                onCancel() {
                    Modal.error({
                        content: '삭제취소'
                    });
                }
            });
        }
    };

    const handelUser = () => {
        console.log('사용여부');
    };
    useEffect(() => {
        setLoading(true);
        handleTheoryInfo();
    }, [refresh]);

    return (
        <>
            <MainCard title="언어 관리">
                <Typography variant="body1">
                    <Row style={{ marginBottom: 16 }}>
                        <Col span={8}></Col>
                        <Col span={8} offset={8} style={{ textAlign: 'right' }}>
                            <Space>
                                <Tooltip title="추가">
                                    <Button
                                        type="success"
                                        onClick={handleAdd}
                                        style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                        icon={<PlusOutlined />}
                                    >
                                        추가
                                    </Button>
                                </Tooltip>
                            </Space>
                        </Col>
                    </Row>

                    <Table
                        bordered={true}
                        dataSource={dataSource}
                        loading={loading}
                        columns={columns}
                        rowClassName={() => 'editable-row'}
                        rowSelection={rowSelection}
                    />
                </Typography>
            </MainCard>

            {/* 언어추가 폼 Start */}
            <Drawer
                maskClosable={false}
                title={`언어 ${dataEdit === true ? '수정' : '추가'}`}
                onClose={onAddClose}
                open={open}
                width={400}
                style={{ top: '60px' }}
                extra={
                    <>
                        <Space>
                            <Tooltip title="취소" placement="bottom">
                                <Button onClick={onAddClose} style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}>
                                    취소
                                </Button>
                            </Tooltip>
                            {dataEdit === true ? (
                                <Tooltip title="수정" placement="bottom" color="#108ee9">
                                    <Button
                                        onClick={updateSubmit}
                                        style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                        type="primary"
                                    >
                                        수정
                                    </Button>
                                </Tooltip>
                            ) : (
                                <Tooltip title="추가" placement="bottom" color="#108ee9">
                                    <Button
                                        onClick={insertSubmit}
                                        style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                        type="primary"
                                    >
                                        추가
                                    </Button>
                                </Tooltip>
                            )}
                            <Tooltip title="삭제">
                                <Button
                                    type="danger"
                                    onClick={deleteSubmit}
                                    style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                >
                                    삭제
                                </Button>
                            </Tooltip>
                        </Space>
                    </>
                }
            >
                <MainCard>
                    <Form layout="vertical" form={form}>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    label="언어명"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter TheoryInfo Name'
                                        }
                                    ]}
                                >
                                    <Input
                                        name="TheoryInfoName"
                                        value={unitParams?.TheoryInfoName}
                                        defaultValue={unitParams?.TheoryInfoName}
                                        onChange={(e) => setUnitParams({ ...unitParams, TheoryInfoName: e.target.value })}
                                        placeholder="Please Enter TheoryInfo Name"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    label="언어코드"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter TheoryInfo Code'
                                        }
                                    ]}
                                >
                                    <Input
                                        name="TheoryInfoCode"
                                        value={unitParams?.TheoryInfoCode}
                                        defaultValue={unitParams?.TheoryInfoCode}
                                        onChange={(e) => setUnitParams({ ...unitParams, TheoryInfoCode: e.target.value })}
                                        style={{
                                            width: '100%'
                                        }}
                                        placeholder="Please Enter TheoryInfo Code"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />
                        <Form.Item
                            name="useYn"
                            label="사용여부"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please Enter useYn Name'
                                }
                            ]}
                        >
                            <Select
                                defaultValue={unitParams?.useYn}
                                onChange={(e) => setUnitParams({ ...unitParams, useYn: e })}
                                style={{
                                    width: '100%'
                                }}
                                options={[
                                    {
                                        value: 'Y',
                                        label: '사용'
                                    },
                                    {
                                        value: 'N',
                                        label: '미사용'
                                    }
                                ]}
                            />
                        </Form.Item>
                    </Form>
                </MainCard>
            </Drawer>
            {/* 언어추가 폼 End */}
        </>
    );
};
