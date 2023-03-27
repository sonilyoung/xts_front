/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Col, Row, Button, Form, Input, Table, Space, Tooltip, Drawer, Select, Divider, Modal } from 'antd';
import { useGetEduClassListMutation } from '../../../hooks/api/EduManagement/EduManagement';
import { Typography } from '@mui/material';

// project import
import MainCard from 'components/MainCard';

import { PlusOutlined, EditFilled, DeleteFilled, ExclamationCircleFilled } from '@ant-design/icons';

export const EduClass = () => {
    const { confirm } = Modal;
    const { Option } = Select;
    const [form] = Form.useForm();

    const [getEduClassList] = useGetEduClassListMutation(); // hooks api호출
    const [eduClassList, setEduClassList] = useState(); // 리스트 값
    const [dataSource, setDataSource] = useState([]); // Table 데이터 값
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); //셀렉트 박스 option Selected 값
    const [loading, setLoading] = useState(false); // 로딩 초기값
    const [open, setOpen] = useState(false); // Drawer 추가 우측폼 상태
    const [dataEdit, setDataEdit] = useState(false); // Drawer 수정 우측폼 상태

    // 추가 및 수정 input 기본값 정리
    const [procGroupDtlGroupNmVal, setProcGroupDtlGroupNmVal] = useState();
    const [largeGroupCdVal, setLargeGroupCdVal] = useState();
    const [middleGroupCdVal, setMiddleGroupCdVal] = useState();
    const [smallGroupCdVal, setSmallGroupCdVal] = useState();

    // 그룹 데이터 값 선언
    const handleEduClass = async () => {
        const EduClassresponse = await getEduClassList({});
        setEduClassList(EduClassresponse?.data?.RET_DATA);
        setDataSource([
            ...EduClassresponse?.data?.RET_DATA.map((d, i) => ({
                key: d.procGroupDtlGroupCd,
                rowdata0: i + 1,
                rowdata1: d.procGroupDtlGroupCd,
                rowdata2: d.procGroupDtlGroupNm,
                rowdata3: d.largeGroupCd,
                rowdata4: d.middleGroupCd,
                rowdata5: d.smallGroupCd,
                rowdata6: d.largeGroupNm,
                rowdata7: d.middleGroupNm,
                rowdata8: d.smallGroupNm,
                rowdata9: d.insertDate,
                rowdata10: d.insertId,
                rowdata11: d.updateDate,
                rowdata12: d.updateId
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
            title: '과정분류상세코드',
            dataIndex: 'rowdata1',
            align: 'center'
        },
        {
            title: '과정분류상세코드명',
            dataIndex: 'rowdata2',
            align: 'center'
        },
        {
            title: '대분류코드',
            dataIndex: 'rowdata6',
            align: 'center'
        },
        {
            title: '중분류코드',
            dataIndex: 'rowdata7',
            align: 'center'
        },
        {
            title: '소분류코드',
            dataIndex: 'rowdata8',
            align: 'center'
        },
        {
            title: '등록ID',
            dataIndex: 'rowdata10',
            align: 'center'
        },
        {
            title: '등록일자',
            dataIndex: 'rowdata9',
            align: 'center'
        },
        {
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

    // 타이틀 컬럼  = 데이터 컬럼 Index세팅
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

    // 추가 버튼
    const handleAdd = () => {
        setDataEdit(false);
        setOpen(true);
    };

    // 수정버튼
    const handleEdit = (EditKey) => {
        console.log(EditKey);
        setDataEdit(true);
        setOpen(true);
    };

    // 삭제 버튼
    const handleDel = () => {
        if (selectedRowKeys == '') {
            Modal.error({
                content: '삭제할 항목을 선택해주세요.'
            });
        } else {
            confirm({
                title: '선택한 과정을 삭제하시겠습니까?',
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

    // 추가 취소
    const onAddClose = () => {
        setOpen(false);
        setDataEdit(false);
        form.resetFields();
    };

    // 추가 및 수정 처리
    const onAddSubmit = () => {
        console.log(procGroupDtlGroupNmVal, largeGroupCdVal, middleGroupCdVal, smallGroupCdVal);
        if (dataEdit === true) {
            Modal.success({
                content: '수정 완료',
                onOk() {
                    setOpen(false);
                    setDataEdit(false);
                    handleEduClass();
                    form.resetFields();
                }
            });
        } else {
            Modal.success({
                content: '추가 완료',
                onOk() {
                    setOpen(false);
                    setDataEdit(false);
                    handleEduClass();
                    form.resetFields();
                }
            });
        }
    };

    useEffect(() => {
        setLoading(true); // 로딩 호출
        handleEduClass(); // api 호출
    }, []);

    return (
        <>
            <MainCard title="과정 분류">
                <Typography variant="body1">
                    <Row style={{ marginBottom: 16 }}>
                        <Col span={8}></Col>
                        <Col span={8} offset={8} style={{ textAlign: 'right' }}>
                            <Space>
                                <Tooltip title="추가">
                                    <Button
                                        onClick={handleAdd}
                                        style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                        icon={<PlusOutlined />}
                                    >
                                        추가
                                    </Button>
                                </Tooltip>
                                {/* <Tooltip title="수정">
                                    <Button
                                        type="primary"
                                        onClick={handleEdit}
                                        style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                        icon={<EditFilled />}
                                    >
                                        수정
                                    </Button>
                                </Tooltip> */}
                                <Tooltip title="삭제">
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

            {/* 분류추가 폼 Start */}
            <Drawer
                maskClosable={false}
                title={`과정 분류 ${dataEdit === true ? '수정' : '추가'}`}
                onClose={onAddClose}
                open={open}
                width={350}
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
                                        onClick={onAddSubmit}
                                        style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                        type="primary"
                                    >
                                        수정
                                    </Button>
                                </Tooltip>
                            ) : (
                                <Tooltip title="추가" placement="bottom" color="#108ee9">
                                    <Button
                                        onClick={onAddSubmit}
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
                                    name="procGroupDtlGroupNm"
                                    defaultValue={procGroupDtlGroupNmVal}
                                    onChange={(e) => setProcGroupDtlGroupNmVal(e.target.value)}
                                    label="과정분류상세코드명"
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
                        <Divider style={{ margin: '10px 0' }} />
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="largeGroupNm"
                                    defaultValue={largeGroupCdVal}
                                    onChange={(e) => setLargeGroupCdVal(e.target.value)}
                                    label="대분류 코드"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please select an LargeGroup Code'
                                        }
                                    ]}
                                >
                                    <Select placeholder="Please select an LargeGroup Code">
                                        <Option value="1">대분류 코드 1</Option>
                                        <Option value="2">대분류 코드 2</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="middleGroupNm"
                                    defaultValue={middleGroupCdVal}
                                    onChange={(e) => setMiddleGroupCdVal(e.target.value)}
                                    label="중분류 코드"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please select an MiddleGroup Code'
                                        }
                                    ]}
                                >
                                    <Select placeholder="Please select an MiddleGroup Code">
                                        <Option value="1">중분류 코드 1</Option>
                                        <Option value="2">중분류 코드 2</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="smallGroupNm"
                                    defaultValue={smallGroupCdVal}
                                    onChange={(e) => setSmallGroupCdVal(e.target.value)}
                                    label="소분류 코드"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please select an SmallGroup Code'
                                        }
                                    ]}
                                >
                                    <Select placeholder="Please select an SmallGroup Code">
                                        <Option value="1">소분류 코드 1</Option>
                                        <Option value="2">소분류 코드 2</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </MainCard>
            </Drawer>
            {/* 분류추가 폼 End */}
        </>
    );
};
// export default EduClass;
