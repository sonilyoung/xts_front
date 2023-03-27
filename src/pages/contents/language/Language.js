/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Typography } from '@mui/material';
import { Col, Row, Button, Form, Input, Drawer, Table, Space, Tooltip, Tag, Switch, Divider, Modal } from 'antd';
import 'antd/dist/antd.css';
import { useGetLanguageListMutation } from '../../../hooks/api/ContentsManagement/ContentsManagement';
import { PlusOutlined, EditFilled, DeleteFilled, ExclamationCircleFilled } from '@ant-design/icons';

// project import
import MainCard from 'components/MainCard';

export const Language = () => {
    const { confirm } = Modal;
    const [form] = Form.useForm();

    const [getLanguageList] = useGetLanguageListMutation(); // hooks api호출
    const [languageList, setLanguageList] = useState(); // 리스트 값
    const [dataSource, setDataSource] = useState([]); // Table 데이터 값
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); //셀렉트 박스 option Selected 값
    const [loading, setLoading] = useState(false); // 로딩 초기값
    const [open, setOpen] = useState(false); // Drawer 추가 우측폼 상태
    const [dataEdit, setDataEdit] = useState(false); // Drawer 수정 우측폼 상태

    // 추가 및 수정 input 기본값 정리
    const [languageNmVal, setLanguageNmVal] = useState();
    const [languageCdVal, setLanguageCdVal] = useState();

    const handleLanguage = async () => {
        const Languageresponse = await getLanguageList({});
        setLanguageList(Languageresponse?.data?.RET_DATA);
        setDataSource([
            ...Languageresponse?.data?.RET_DATA.map((d, i) => ({
                key: d.codeNo,
                rowdata0: i + 1,
                rowdata1: d.languageName,
                rowdata2: d.languageCode,
                rowdata3: d.useYn === 'Y' ? '사용' : '미사용',
                rowdata4: d.insertId,
                rowdata5: d.insertDate,
                tags: ['1']
            }))
        ]);
        setLoading(false);
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
                if (record[dataIndex] !== values[dataIndex]) {
                    selectedRowKeys.length <= '0'
                        ? onSelectChange([...selectedRowKeys, record.key])
                        : selectedRowKeys.map((srk) => (srk === record.key ? '' : onSelectChange([...selectedRowKeys, record.key])));
                }
            } catch (errInfo) {
                console.log('Save failed:', errInfo);
            }
        };

        let childNode = children;
        if (editable) {
            childNode = editing ? (
                <Form.Item style={{ margin: 0 }} name={dataIndex} rules={[{ required: true, message: `${title} is required.` }]}>
                    <Input ref={inputRef} onPressEnter={save} onBlur={save} />
                </Form.Item>
            ) : (
                <div className="editable-cell-value-wrap" onClick={toggleEdit} aria-hidden="true">
                    {children}
                </div>
            );
        }
        return <td {...restProps}>{childNode}</td>;
    };

    const defaultColumns = [
        {
            width: '80px',
            title: 'No',
            dataIndex: 'rowdata0',
            align: 'center'
        },
        {
            title: '언어',
            dataIndex: 'rowdata1',
            align: 'center'
        },
        {
            title: '언어코드',
            dataIndex: 'rowdata2',
            align: 'center'
        },
        {
            title: '사용여부',
            key: 'tags',
            dataIndex: 'rowdata3',
            render: (_, { tags, rowdata3 }) => (
                <>
                    {tags.map((tag) => {
                        let color = rowdata3 === '사용' ? 'green' : 'volcano';
                        return (
                            <Tag color={color} key={tag} onClick={handelUser}>
                                {rowdata3.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
            align: 'center'
        },
        {
            title: '등록자',
            dataIndex: 'rowdata4',
            render: (_, { rowdata4 }) => <>{rowdata4 === '' || rowdata4 === null ? '-' : rowdata4}</>,
            align: 'center'
        },
        {
            title: '등록일자',
            dataIndex: 'rowdata5',
            render: (_, { rowdata5 }) => <>{rowdata5 === '' || rowdata5 === null ? '-' : rowdata5}</>,
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
                            onClick={() => handleEdit(key)}
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

    // const handleDelete = (key) => {
    //     const newData = dataSource.filter((item) => item.key !== key);
    //     setDataSource(newData);
    // };

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

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell
        }
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
        setOpen(true);
    };

    // 추가 취소
    const onAddClose = () => {
        setOpen(false);
        setDataEdit(false);
        form.resetFields();
    };

    // 추가 등록
    const languageSubmit = () => {
        console.log(languageNmVal, languageCdVal);
        if (dataEdit === true) {
            Modal.success({
                content: '수정 완료',
                onOk() {
                    setOpen(false);
                    setDataEdit(false);
                    handleLanguage();
                    form.resetFields();
                }
            });
        } else {
            Modal.success({
                content: '추가 완료',
                onOk() {
                    setOpen(false);
                    setDataEdit(false);
                    handleLanguage();
                    form.resetFields();
                }
            });
        }
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
        handleLanguage();
    }, []);

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
                                <Tooltip title="삭제" color="#f50">
                                    <Button
                                        type="danger"
                                        onClick={handleDel}
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
                        dataSource={dataSource}
                        loading={loading}
                        columns={columns}
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
                                        onClick={languageSubmit}
                                        style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                        type="primary"
                                    >
                                        수정
                                    </Button>
                                </Tooltip>
                            ) : (
                                <Tooltip title="추가" placement="bottom" color="#108ee9">
                                    <Button
                                        onClick={languageSubmit}
                                        style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                        type="primary"
                                    >
                                        추가
                                    </Button>
                                </Tooltip>
                            )}
                        </Space>
                    </>
                }
            >
                <MainCard>
                    <Form layout="vertical" form={form}>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="languageName"
                                    defaultValue={languageNmVal}
                                    onChange={(e) => setLanguageNmVal(e.target.value)}
                                    label="언어명"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter Language Name'
                                        }
                                    ]}
                                >
                                    <Input placeholder="Please Enter Language Name" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="languageCode"
                                    defaultValue={languageCdVal}
                                    onChange={(e) => setLanguageCdVal(e.target.value)}
                                    label="언어코드"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter Language Code'
                                        }
                                    ]}
                                >
                                    <Input
                                        style={{
                                            width: '100%'
                                        }}
                                        placeholder="Please Enter Language Code"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item name="useYn" label="사용여부">
                                    <Switch checkedChildren="사용" unCheckedChildren="미사용" defaultChecked style={{ width: '80px' }} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </MainCard>
            </Drawer>
            {/* 언어추가 폼 End */}
        </>
    );
};
