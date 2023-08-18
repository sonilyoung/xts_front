/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Col, Row, Button, Form, Input, Table, Drawer, Space, Tooltip, Tag, Switch, Divider, Modal } from 'antd';
import { useGetEduGroupListMutation } from '../../../hooks/api/EduManagement/EduManagement';
import { Typography } from '@mui/material';

// project import
import MainCard from 'components/MainCard';

import { PlusOutlined, EditFilled, DeleteFilled, ExclamationCircleFilled } from '@ant-design/icons';
const { confirm } = Modal;

export const EduGroup_S = () => {
    const [getEduGroupList] = useGetEduGroupListMutation();

    const [eduGroupList_l, setEduGroupList_l] = useState();
    const [eduGroupList_m, setEduGroupList_m] = useState();
    const [eduGroupList_s, setEduGroupList_s] = useState();

    const [dataSource_l, setDataSource_l] = useState([]);
    const [dataSource_m, setDataSource_m] = useState([]);
    const [dataSource_s, setDataSource_s] = useState([]);

    const [procGroupCd_m, setProcGroupCd_m] = useState();
    const [procGroupCd_s, setProcGroupCd_s] = useState();

    const [selectedRowKeys, setSelectedRowKeys] = useState([]); //셀렉트 박스 option Selected 값(대분류)
    const [selectedRowKeys_m, setSelectedRowKeys_m] = useState([]); //셀렉트 박스 option Selected 값(중분류)
    const [selectedRowKeys_s, setSelectedRowKeys_s] = useState([]); //셀렉트 박스 option Selected 값(소분류)

    const [loading, setLoading] = useState(false);
    const [loading_m, setLoading_m] = useState(false);
    const [loading_s, setLoading_s] = useState(false);
    const [open, setOpen] = useState(false); // Drawer 추가 우측폼 상태
    const [typeselect, setTypeselect] = useState(''); // 대, 중, 소 분류

    // 대분류 API 호출
    const handleEduGroup_L = async () => {
        const eduGroupresponse_l = await getEduGroupList({
            searchType: '1',
            procGroupCd: ''
        });
        setEduGroupList_l(eduGroupresponse_l?.data?.RET_DATA);
        setDataSource_l([
            ...eduGroupresponse_l?.data?.RET_DATA.map((l, i) => ({
                key: l.procGroupCd,
                rowdata0: i + 1,
                rowdata1: l.procGroupNo,
                rowdata2: l.procGroupCd,
                rowdata3: l.procGroupNm,
                rowdata4: l.procGroupDc,
                rowdata5: l.procGroupSort,
                rowdata6: l.useYn,
                rowdata7: l.parentProcGroupCd,
                rowdata8: l.topProcGroupCd,
                rowdata9: l.searchType,
                rowdata10: 'L'
            }))
        ]);
        setLoading(false);
    };

    // 중분류 API 호출
    const handleEduGroup_M = async (procGroupCd_M) => {
        const eduGroupresponse_m = await getEduGroupList({
            searchType: '2',
            procGroupCd: procGroupCd_M
        });
        setEduGroupList_m(eduGroupresponse_m?.data?.RET_DATA);
        setDataSource_m([
            ...eduGroupresponse_m?.data?.RET_DATA.map((m, i) => ({
                key: m.procGroupCd,
                rowdata0: i + 1,
                rowdata1: m.procGroupNo,
                rowdata2: m.procGroupCd,
                rowdata3: m.procGroupNm,
                rowdata4: m.procGroupDc,
                rowdata5: m.procGroupSort,
                rowdata6: m.useYn,
                rowdata7: m.parentProcGroupCd,
                rowdata8: m.topProcGroupCd,
                rowdata9: m.searchType,
                rowdata10: 'M'
            }))
        ]);
        setLoading_m(false);
    };

    // 소분류 API 호출
    const handleEduGroup_S = async (procGroupCd_S) => {
        const eduGroupresponse_s = await getEduGroupList({
            searchType: '3',
            procGroupCd: procGroupCd_S
        });
        setEduGroupList_s(eduGroupresponse_s?.data?.RET_DATA);
        setDataSource_s([
            ...eduGroupresponse_s?.data?.RET_DATA.map((s, i) => ({
                key: s.procGroupCd,
                rowdata0: i + 1,
                rowdata1: s.procGroupNo,
                rowdata2: s.procGroupCd,
                rowdata3: s.procGroupNm,
                rowdata4: s.procGroupDc,
                rowdata5: s.procGroupSort,
                rowdata6: s.useYn,
                rowdata7: s.parentProcGroupCd,
                rowdata8: s.topProcGroupCd,
                rowdata9: s.searchType,
                rowdata10: 'S'
            }))
        ]);
        setLoading_s(false);
    };

    const EditableContext = React.createContext(null);
    const EditableRow = ({ index, ...props }) => {
        const [form] = Form.useForm();
        return (
            <Form form={form} component={false}>
                <EditableContext.Provider value={form}>
                    <tr {...props} />
                </EditableContext.Provider>
            </Form>
        );
    };
    const EditableCell = ({ title, editable, children, dataIndex, record, handleSave, ...restProps }) => {
        const [editing, setEditing] = useState(false);
        const inputRef = useRef(null);
        const form = useContext(EditableContext);
        useEffect(() => {
            if (editing) {
                inputRef.current.focus();
            }
        }, [editing]);

        const toggleEdit = () => {
            setEditing(!editing);
            form.setFieldsValue({
                [dataIndex]: record[dataIndex]
            });
        };

        const save = async () => {
            try {
                const values = await form.validateFields();
                toggleEdit();
                handleSave({
                    ...record,
                    ...values
                });
                // Data값이 변경될 경우 체크박스 체크
                if (record[dataIndex] != values[dataIndex]) {
                    if (record.rowdata10 == 'L') {
                        selectedRowKeys.length <= 0
                            ? onSelectChange_l([record.key])
                            : selectedRowKeys.map((d_l) => (d_l === record.key ? '' : onSelectChange_l([...selectedRowKeys, record.key])));
                    } else if (record.rowdata10 == 'M') {
                        selectedRowKeys_m.length <= 0
                            ? onSelectChange_m([record.key])
                            : selectedRowKeys_m.map((d_m) =>
                                  d_m === record.key ? '' : onSelectChange_m([...selectedRowKeys_m, record.key])
                              );
                    } else {
                        selectedRowKeys_s.length <= 0
                            ? onSelectChange_s([record.key])
                            : selectedRowKeys_s.map((d_s) =>
                                  d_s === record.key ? '' : onSelectChange_s([...selectedRowKeys_s, record.key])
                              );
                    }
                }
            } catch (errInfo) {
                console.log('Save failed:', errInfo);
            }
        };

        let childNode = children;
        if (editable) {
            childNode = editing ? (
                <>
                    <Form.Item
                        style={{ margin: '0 auto', width: '100%' }}
                        name={dataIndex}
                        rules={[{ required: true, message: `${title} is required.` }]}
                    >
                        <Input size="small" ref={inputRef} onPressEnter={save} onBlur={save} />
                    </Form.Item>
                </>
            ) : (
                <>
                    <div className="editable-cell-value-wrap" onClick={toggleEdit} aria-hidden="true">
                        {children}
                    </div>
                </>
            );
        }
        return <td {...restProps}>{childNode}</td>;
    };

    const defaultColumns_L = [
        {
            width: '60px',
            title: 'No',
            dataIndex: 'rowdata0',
            align: 'center',
            render: (text) => (
                <div style={{ cursor: 'pointer' }}>
                    <Tooltip title="Double Click">
                        <div>{text}</div>
                    </Tooltip>
                </div>
            )
        },
        {
            title: '대분류코드',
            dataIndex: 'rowdata2',
            align: 'center',
            render: (text) => (
                <div style={{ cursor: 'pointer' }}>
                    <Tooltip title="Double Click">
                        <div>{text}</div>
                    </Tooltip>
                </div>
            )
        },
        {
            title: '대분류명',
            dataIndex: 'rowdata3',
            editable: true,
            datatype: 'rowdata10',
            align: 'center'
        },
        {
            title: '사용여부',
            dataIndex: 'rowdata6',
            render: (_, { rowdata6 }) => (
                <>
                    {rowdata6 === '1' ? (
                        <Tag color={'green'} key={rowdata6} onClick={(e) => handelUser()}>
                            사용
                        </Tag>
                    ) : (
                        <Tag color={'volcano'} key={rowdata6} onClick={(e) => handelUser()}>
                            미사용
                        </Tag>
                    )}
                </>
            ),
            align: 'center'
        }
    ];

    const defaultColumns_M = [
        {
            width: '60px',
            title: 'No',
            dataIndex: 'rowdata0',
            align: 'center',
            render: (text) => (
                <div style={{ cursor: 'pointer' }}>
                    <Tooltip title="Double Click">
                        <div>{text}</div>
                    </Tooltip>
                </div>
            )
        },
        {
            title: '중분류코드',
            dataIndex: 'rowdata2',
            align: 'center',
            render: (text) => (
                <div style={{ cursor: 'pointer' }}>
                    <Tooltip title="Double Click">
                        <div>{text}</div>
                    </Tooltip>
                </div>
            )
        },
        {
            title: '중분류명',
            dataIndex: 'rowdata3',
            editable: true,
            datatype: 'rowdata10',
            align: 'center'
        },
        {
            title: '사용여부',
            dataIndex: 'rowdata6',
            render: (_, { rowdata6 }) => (
                <>
                    {rowdata6 === '1' ? (
                        <Tag color={'green'} key={rowdata6} onClick={(e) => handelUser()}>
                            사용
                        </Tag>
                    ) : (
                        <Tag color={'volcano'} key={rowdata6} onClick={(e) => handelUser()}>
                            미사용
                        </Tag>
                    )}
                </>
            ),
            align: 'center'
        }
    ];

    const defaultColumns_S = [
        {
            width: '60px',
            title: 'No',
            dataIndex: 'rowdata0',
            align: 'center'
        },
        {
            title: '소분류코드',
            dataIndex: 'rowdata2',
            align: 'center'
        },
        {
            title: '소분류명',
            dataIndex: 'rowdata3',
            editable: true,
            datatype: 'rowdata10',
            align: 'center'
        },
        {
            title: '사용여부',
            dataIndex: 'rowdata6',
            render: (_, { rowdata6 }) => (
                <>
                    {rowdata6 === '1' ? (
                        <Tag color={'green'} key={rowdata6} onClick={() => handelUser()}>
                            사용
                        </Tag>
                    ) : (
                        <Tag color={'volcano'} key={rowdata6} onClick={() => handelUser()}>
                            미사용
                        </Tag>
                    )}
                </>
            ),
            align: 'center'
        }
    ];

    const handleSave = (row) => {
        const newData = row.rowdata10 === 'L' ? [...dataSource_l] : row.rowdata10 === 'M' ? [...dataSource_m] : [...dataSource_s];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row
        });
        row.rowdata10 === 'L' ? setDataSource_l(newData) : row.rowdata10 === 'M' ? setDataSource_m(newData) : setDataSource_s(newData);
    };

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell
        }
    };
    const columns_L = defaultColumns_L.map((col) => {
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

    const columns_M = defaultColumns_M.map((col) => {
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

    const columns_S = defaultColumns_S.map((col) => {
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

    //체크 박스 이벤트 (대분류)
    const onSelectChange_l = (newselectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newselectedRowKeys);
        setSelectedRowKeys(newselectedRowKeys);
    };

    //체크 박스 이벤트 (중분류)
    const onSelectChange_m = (newSelectedRowKeys_m) => {
        console.log('selectedRowKeys_m changed: ', newSelectedRowKeys_m);
        setSelectedRowKeys_m(newSelectedRowKeys_m);
    };

    //체크 박스 이벤트 (소분류)
    const onSelectChange_s = (newSelectedRowKeys_s) => {
        console.log('selectedRowKeys_s changed: ', newSelectedRowKeys_s);
        setSelectedRowKeys_s(newSelectedRowKeys_s);
    };

    //체크 박스 선택 (대분류)
    const rowSelection_l = {
        selectedRowKeys,
        onChange: onSelectChange_l
    };

    //체크 박스 선택 (중분류)
    const rowSelection_m = {
        selectedRowKeys_m,
        onChange: onSelectChange_m
    };

    //체크 박스 선택 (소분류)
    const rowSelection_s = {
        selectedRowKeys_s,
        onChange: onSelectChange_s
    };

    // 대분류 추가
    const handleAdd_L = () => {
        console.log('추가');
        setOpen(true);
        setTypeselect('L');
    };

    // 대분류 수정
    const handleEdit_L = () => {
        if (selectedRowKeys == '') {
            Modal.error({
                content: '[대분류] 수정할 항목을 선택해주세요.'
            });
        } else {
            Modal.success({
                content: '[대분류] 수정완료'
            });
            setTypeselect('L');
        }
    };

    // 대분류 삭제
    const handleDel_L = () => {
        if (selectedRowKeys == '') {
            Modal.error({
                content: '[대분류] 삭제할 항목을 선택해주세요.'
            });
        } else {
            setTypeselect('L');
            confirm({
                title: '[대분류] 선택한 대분류 항목을 삭제하시겠습니까?',
                icon: <ExclamationCircleFilled />,
                content: selectedRowKeys + ' 항목의 데이터',
                okText: '예',
                okType: 'danger',
                cancelText: '아니오',
                onOk() {
                    Modal.success({
                        content: '[대분류] 삭제완료'
                    });
                },
                onCancel() {
                    Modal.error({
                        content: '[대분류] 삭제취소'
                    });
                }
            });
        }
    };

    // 중분류 추가
    const handleAdd_M = () => {
        console.log('추가');
        setOpen(true);
        setTypeselect('M');
    };

    // 중분류 수정
    const handleEdit_M = () => {
        if (selectedRowKeys_m == '') {
            Modal.error({
                content: '[중분류] 수정할 항목을 선택해주세요.'
            });
        } else {
            Modal.success({
                content: '[중분류] 수정완료'
            });
            setTypeselect('M');
        }
    };

    // 중분류 삭제
    const handleDel_M = () => {
        if (selectedRowKeys_m == '') {
            Modal.error({
                content: '[중분류] 삭제할 항목을 선택해주세요.'
            });
        } else {
            setTypeselect('M');
            confirm({
                title: '[중분류] 선택한 중분류 항목을 삭제하시겠습니까?',
                icon: <ExclamationCircleFilled />,
                content: selectedRowKeys_m + ' 항목의 데이터',
                okText: '예',
                okType: 'danger',
                cancelText: '아니오',
                onOk() {
                    Modal.success({
                        content: '[중분류] 삭제완료'
                    });
                },
                onCancel() {
                    Modal.error({
                        content: '[중분류] 삭제취소'
                    });
                }
            });
        }
    };

    // 소분류 추가
    const handleAdd_S = () => {
        console.log('추가');
        setOpen(true);
        setTypeselect('S');
    };

    // 소분류 수정
    const handleEdit_S = () => {
        if (selectedRowKeys_s == '') {
            Modal.error({
                content: '[소분류] 수정할 항목을 선택해주세요.'
            });
        } else {
            Modal.success({
                content: '[소분류] 수정완료'
            });
            setTypeselect('S');
        }
    };

    // 소분류 삭제
    const handleDel_S = () => {
        if (selectedRowKeys_s == '') {
            Modal.error({
                content: '[소분류] 삭제할 항목을 선택해주세요.'
            });
        } else {
            setTypeselect('S');
            confirm({
                title: '[소분류] 선택한 소분류 항목을 삭제하시겠습니까?',
                icon: <ExclamationCircleFilled />,
                content: selectedRowKeys_s + ' 항목의 데이터',
                okText: '예',
                okType: 'danger',
                cancelText: '아니오',
                onOk() {
                    Modal.success({
                        content: '[소분류] 삭제완료'
                    });
                },
                onCancel() {
                    Modal.error({
                        content: '[소분류] 삭제취소'
                    });
                }
            });
        }
    };

    const handelUser = () => {
        console.log('사용여부');
    };

    const onAddClose = () => {
        setOpen(false);
    };

    const groupSubmit = () => {
        console.log(typeselect, '추가');
    };

    useEffect(() => {
        setLoading(true);
        handleEduGroup_L();
    }, []);

    return (
        <>
            <MainCard title="그룹 관리">
                <Typography variant="body1">
                    <Row gutter={[16, 8]}>
                        {/* 대분류 영역 Start */}
                        <Col span={8}>
                            <Row style={{ marginBottom: 16 }}>
                                <Col span={16} offset={8} style={{ textAlign: 'right' }}>
                                    <Space>
                                        <Tooltip title="추가">
                                            <Button
                                                type="success"
                                                onClick={handleAdd_L}
                                                style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                                icon={<PlusOutlined />}
                                            >
                                                추가
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title="수정">
                                            <Button
                                                type="primary"
                                                onClick={handleEdit_L}
                                                style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                                icon={<EditFilled />}
                                            >
                                                수정
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title="삭제">
                                            <Button
                                                type="primary"
                                                danger
                                                onClick={handleDel_L}
                                                style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                                icon={<DeleteFilled />}
                                            >
                                                삭제
                                            </Button>
                                        </Tooltip>
                                    </Space>
                                </Col>
                            </Row>
                            <Table
                                components={components}
                                rowClassName={() => 'editable-row'}
                                bordered={true}
                                dataSource={dataSource_l}
                                loading={loading}
                                columns={columns_L}
                                pagination={false}
                                rowSelection={rowSelection_l}
                                onRow={(record) => {
                                    return {
                                        onDoubleClick: () => {
                                            if (record.rowdata2 !== procGroupCd_m) {
                                                setLoading_m(true);
                                                setProcGroupCd_m(record.rowdata2);
                                                handleEduGroup_M(record.rowdata2);
                                                setDataSource_s([]); // 소분류 초기화 설정
                                            }
                                        }
                                    };
                                }}
                            />
                        </Col>
                        {/* 대분류 영역 End */}

                        {/* 중분류 영역 Start */}
                        <Col span={8}>
                            <Row style={{ marginBottom: 16 }}>
                                <Col span={16} offset={8} style={{ textAlign: 'right' }}>
                                    <Space>
                                        <Tooltip title="추가">
                                            <Button
                                                type="success"
                                                onClick={handleAdd_M}
                                                style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                                icon={<PlusOutlined />}
                                            >
                                                추가
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title="수정">
                                            <Button
                                                type="primary"
                                                onClick={handleEdit_M}
                                                style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                                icon={<EditFilled />}
                                            >
                                                수정
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title="삭제">
                                            <Button
                                                type="primary"
                                                danger
                                                onClick={handleDel_M}
                                                style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                                icon={<DeleteFilled />}
                                            >
                                                삭제
                                            </Button>
                                        </Tooltip>
                                    </Space>
                                </Col>
                            </Row>
                            <Table
                                components={components}
                                rowClassName={() => 'editable-row'}
                                bordered={true}
                                dataSource={dataSource_m}
                                loading={loading_m}
                                columns={columns_M}
                                pagination={false}
                                rowSelection={rowSelection_m}
                                onRow={(record) => {
                                    return {
                                        onDoubleClick: () => {
                                            if (record.rowdata2 !== procGroupCd_s) {
                                                setLoading_s(true);
                                                setProcGroupCd_s(record.rowdata2);
                                                handleEduGroup_S(record.rowdata2);
                                            }
                                        }
                                    };
                                }}
                            />
                        </Col>
                        {/* 중분류 영역 End */}

                        {/* 소분류 영역 Start */}
                        <Col span={8}>
                            <Row style={{ marginBottom: 16 }}>
                                <Col span={16} offset={8} style={{ textAlign: 'right' }}>
                                    <Space>
                                        <Tooltip title="추가">
                                            <Button
                                                type="success"
                                                onClick={handleAdd_S}
                                                style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                                icon={<PlusOutlined />}
                                            >
                                                추가
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title="수정">
                                            <Button
                                                type="primary"
                                                onClick={handleEdit_S}
                                                style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                                icon={<EditFilled />}
                                            >
                                                수정
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title="삭제">
                                            <Button
                                                type="primary"
                                                danger
                                                onClick={handleDel_S}
                                                style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                                icon={<DeleteFilled />}
                                            >
                                                삭제
                                            </Button>
                                        </Tooltip>
                                    </Space>
                                </Col>
                            </Row>
                            <Table
                                components={components}
                                rowClassName={() => 'editable-row'}
                                bordered={true}
                                dataSource={dataSource_s}
                                loading={loading_s}
                                columns={columns_S}
                                pagination={false}
                                rowSelection={rowSelection_s}
                            />
                        </Col>
                        {/* 소분류 영역 End */}
                    </Row>
                </Typography>

                {/* 분류추가 폼 Start */}
                <Drawer
                    title={
                        typeselect === 'L' ? '대분류 추가' : typeselect === 'M' ? '중분류 추가' : typeselect === 'S' ? '소분류 추가' : ''
                    }
                    onClose={onAddClose}
                    open={open}
                    width={400}
                    style={{ top: '60px' }}
                    extra={
                        <>
                            <Space style={{ marginTop: '120px' }}>
                                <Tooltip title="취소" placement="bottom">
                                    <Button onClick={onAddClose} style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}>
                                        취소
                                    </Button>
                                </Tooltip>
                                <Tooltip title="추가" placement="bottom">
                                    <Button
                                        onClick={groupSubmit}
                                        style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                        type="primary"
                                    >
                                        추가
                                    </Button>
                                </Tooltip>
                            </Space>
                        </>
                    }
                >
                    <MainCard>
                        <Form layout="vertical" hideRequiredMark>
                            <Row gutter={16}>
                                <Col span={24}>
                                    <Form.Item
                                        name="procGroupCd"
                                        label={`${
                                            typeselect === 'L'
                                                ? '대분류'
                                                : typeselect === 'M'
                                                ? '중분류'
                                                : typeselect === 'S'
                                                ? '소분류'
                                                : ''
                                        } 분류코드`}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please Enter Group Code'
                                            }
                                        ]}
                                    >
                                        <Input placeholder="Please Enter Group Code" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Divider />
                            <Row gutter={16}>
                                <Col span={24}>
                                    <Form.Item
                                        name="procGroupNm"
                                        label={`${
                                            typeselect === 'L'
                                                ? '대분류'
                                                : typeselect === 'M'
                                                ? '중분류'
                                                : typeselect === 'S'
                                                ? '소분류'
                                                : ''
                                        } 분류명`}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please Enter Group Name'
                                            }
                                        ]}
                                    >
                                        <Input
                                            style={{
                                                width: '100%'
                                            }}
                                            placeholder="Please Enter Group Name"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Divider />
                            <Row gutter={16}>
                                <Col span={24}>
                                    <Form.Item
                                        name="useYn"
                                        label={`${
                                            typeselect === 'L'
                                                ? '대분류'
                                                : typeselect === 'M'
                                                ? '중분류'
                                                : typeselect === 'S'
                                                ? '소분류'
                                                : ''
                                        } 사용여부`}
                                    >
                                        <Switch
                                            checkedChildren="사용"
                                            unCheckedChildren="미사용"
                                            defaultChecked
                                            style={{ width: '80px' }}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </MainCard>
                </Drawer>
                {/* 분류추가 폼 End */}
            </MainCard>
        </>
    );
};
// export default EduGroup;
