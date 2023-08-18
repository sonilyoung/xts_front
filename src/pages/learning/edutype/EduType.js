/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Typography } from '@mui/material';
import { Col, Row, Button, Form, Input, Select, Drawer, Table, Space, Tooltip, Tag, Switch, Divider, Modal } from 'antd';
import 'antd/dist/antd.css';
import { PlusOutlined, EditFilled, DeleteFilled, ExclamationCircleFilled } from '@ant-design/icons';
import { useGetEduTypeListMutation } from '../../../hooks/api/LearningMaqnagement/LearningMaqnagement';

// project import
import MainCard from 'components/MainCard';

export const EduType = () => {
    const { confirm } = Modal;
    const [form] = Form.useForm();

    const [getEduTypeList] = useGetEduTypeListMutation();
    const [eduTypeList, setEduTypeList] = useState();
    const [dataSource, setDataSource] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); //셀렉트 박스 option Selected 값
    const [open, setOpen] = useState(false);
    const [dataEdit, setDataEdit] = useState(false); // Drawer 수정 우측폼 상태

    // 추가 및 수정 input 기본값 정리
    const [eduTypeIdVal, setEduTypeIdVal] = useState();
    const [eduTypeNmVal, setEduTypeNmVal] = useState();
    const [eduTypeDcVal, setEduTypeDcVal] = useState();
    const [pointsStdIdVal, setPointsStdIdVal] = useState();
    const [eduTypeYnVal, setEduTypeYnVal] = useState();

    const handleEduType = async () => {
        const EduTyperesponse = await getEduTypeList({});
        setEduTypeList(EduTyperesponse?.data?.RET_DATA);
        setDataSource([
            ...EduTyperesponse?.data?.RET_DATA.map((d, i) => ({
                key: d.eduTypeId,
                rowdata0: i + 1,
                rowdata1: d.eduTypeId /* 교육타입ID */,
                rowdata2: d.eduTypeNm /* 교육타입명 */,
                rowdata3: d.eduTypeDc /* 교육타입 설명 */,
                rowdata4: d.useYn /* 사용유무 */,
                rowdata5: d.pointsStdId /* 배점기준ID */,
                rowdata6: d.pointsStdNm /* 배점기준명칭 */,
                rowdata7: d.insertDate /* 등록일자 */,
                rowdata8: d.insertId /* 등록자ID */,
                rowdata9: d.updateDate /* 수정일자 */,
                rowdata10: d.updateId /* 수정자ID */
            }))
        ]);
        setLoading(false);
    };

    const [loading, setLoading] = useState(false);
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
            title: '교육타입ID',
            dataIndex: 'rowdata1',
            align: 'center'
        },
        {
            title: '교육타입명',
            dataIndex: 'rowdata2',
            align: 'center'
        },
        {
            title: '교육타입설명',
            dataIndex: 'rowdata3',
            align: 'center'
        },
        {
            title: '배정방식',
            dataIndex: 'rowdata6',
            render: (_, { rowdata5, rowdata6 }) => (
                <>
                    <Select
                        labelInValue
                        defaultValue={{
                            value: rowdata5,
                            label: rowdata6
                        }}
                        style={{
                            width: '100%'
                        }}
                        onChange={handleChange}
                        options={[
                            {
                                value: '1',
                                label: '초기 교육 배점'
                            },
                            {
                                value: '2',
                                label: '테스트1'
                            },
                            {
                                value: '3',
                                label: '배점기준_테스트'
                            },
                            {
                                value: '4',
                                label: '1기 교육 배점'
                            }
                        ]}
                    />
                </>
            ),
            align: 'center'
        },
        {
            title: '사용여부',
            dataIndex: 'rowdata4',
            render: (_, { rowdata4 }) => (
                <>
                    {rowdata4 === 'Y' ? (
                        <Tag color={'green'} key={rowdata4}>
                            사용
                        </Tag>
                    ) : (
                        <Tag color={'volcano'} key={rowdata4}>
                            미사용
                        </Tag>
                    )}
                </>
            ),
            align: 'center'
        },
        {
            title: '등록일자',
            dataIndex: 'rowdata7',
            align: 'center',
            render: (_, { rowdata7 }) => <>{rowdata7 === '' || rowdata7 === null ? '-' : rowdata7}</>
        },
        {
            width: '130px',
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

    // 배정방식 (수정시)
    const handleChange = (e) => {
        console.log(e);
    };

    // 배정방식 (추가시)
    const AddChange = (e) => {
        console.log(e);
    };

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
        setOpen(true);
        setDataEdit(false);
    };

    // 추가 취소
    const onAddClose = () => {
        setOpen(false);
        setDataEdit(false);
        form.resetFields();
    };

    // 수정 버튼
    const handleEdit = (EditKey) => {
        console.log(EditKey);
        setDataEdit(true);
        setOpen(true);
    };

    // 추가 및 수정 처리
    const onAddSubmit = () => {
        console.log(eduTypeIdVal, eduTypeNmVal, eduTypeDcVal, pointsStdIdVal, eduTypeYnVal);
        if (dataEdit === true) {
            Modal.success({
                content: '수정 완료',
                onOk() {
                    setOpen(false);
                    setDataEdit(false);
                    handleEduType();
                    form.resetFields();
                }
            });
        } else {
            Modal.success({
                content: '추가 완료',
                onOk() {
                    setOpen(false);
                    setDataEdit(false);
                    handleEduType();
                    form.resetFields();
                }
            });
        }
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

    useEffect(() => {
        setLoading(true);
        handleEduType();
    }, []);

    return (
        <>
            <MainCard title="교육 타입관리">
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
                                <Tooltip title="삭제">
                                    <Button
                                        type="primary"
                                        danger
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

            {/* 추가 폼 Start */}
            <Drawer
                maskClosable={false}
                title={`교육 타입 ${dataEdit === true ? '수정' : '추가'}`}
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
                                    name="EduTypeName"
                                    defaultValue={eduTypeIdVal}
                                    onChange={(e) => setEduTypeIdVal(e.target.value)}
                                    label="교육타입명"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter Edu Type Name.'
                                        }
                                    ]}
                                >
                                    <Input placeholder="Please Enter Edu Type Name." />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="EduTypeContent"
                                    defaultValue={eduTypeDcVal}
                                    onChange={(e) => setEduTypeDcVal(e.target.value)}
                                    label="교육타입설명"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter Edu Type Content.'
                                        }
                                    ]}
                                >
                                    <Input.TextArea rows={4} placeholder="please enter Edu Type Content." />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="PointType"
                                    defaultValue={pointsStdIdVal}
                                    onChange={(e) => setPointsStdIdVal(e.target.value)}
                                    label="배점방식"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter Point Type.'
                                        }
                                    ]}
                                >
                                    <Select
                                        defaultValue={{
                                            value: 0,
                                            label: '# 배점 방식 선택 #'
                                        }}
                                        style={{
                                            width: '100%'
                                        }}
                                        onChange={AddChange}
                                        options={[
                                            {
                                                value: '1',
                                                label: '초기 교육 배점'
                                            },
                                            {
                                                value: '2',
                                                label: '테스트1'
                                            },
                                            {
                                                value: '3',
                                                label: '배점기준_테스트'
                                            },
                                            {
                                                value: '4',
                                                label: '1기 교육 배점'
                                            }
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item name="useYn" label="사용여부">
                                    <Switch
                                        checkedChildren="사용"
                                        unCheckedChildren="미사용"
                                        defaultValue={eduTypeYnVal}
                                        onChange={(e) => setEduTypeYnVal(e.target.value)}
                                        style={{ width: '80px' }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </MainCard>
            </Drawer>
            {/* 추가 폼 End */}
        </>
    );
};
// export default EduType;
