/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Typography } from '@mui/material';
import { Col, Row, Button, Form, Input, Select, Drawer, Table, Space, Tooltip, Modal, DatePicker, Tag } from 'antd';
import 'antd/dist/antd.css';
import {
    PlusOutlined,
    EditFilled,
    EyeOutlined,
    DeleteFilled,
    ExclamationCircleFilled,
    ClockCircleOutlined,
    CheckOutlined
} from '@ant-design/icons';

import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';

// project import
import MainCard from 'components/MainCard';

export const EduProcAdd = () => {
    const { confirm } = Modal;
    const [form] = Form.useForm();
    dayjs.extend(weekday);
    dayjs.extend(localeData);
    const { RangePicker } = DatePicker;
    const { Option } = Select;

    // Loading Start
    const [loading, setLoading] = useState(false);
    const [loadingStudent, setLoadingStudent] = useState(false);
    // Loading End

    // Selected Start
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); //셀렉트 박스 option Selected 값
    const [selectedRowKeysStudentSearch, setSelectedRowKeysStudentSearch] = useState([]); //셀렉트 박스 option Selected 값
    // Selected End

    // Modal창 Start
    const [open, setOpen] = useState(false);
    const [eduDayModalOpen, setEduDayModalOpen] = useState(false); // 학습일정 설정 Modal창
    const [studentModalOpen, setStudentModalOpen] = useState(false); // 학습생 검색 Modal창
    const [eduDayViewModalOpen, setEduDayViewModalOpen] = useState(false); // 학습일정 상세정보 Modal창
    const [studentViewModalOpen, setStudentViewModalOpen] = useState(false); // 학습생 상세정보 Modal창
    // Modal창 End

    // Data source Start
    // const [dataSource, setDataSource] = useState([]); // 차수 데이터 소스
    const [eduDaydataSource, setEduDayDataSource] = useState([]); // 학습일정 데이터 소스
    // const [studentdataSourceSearch, setStudentdataSourceSearch] = useState([]); // 학습생 검색 데이터 소스
    const [studentdataSourceView, setStudentdataSourceView] = useState([]); // 학습생 상세정보 데이터 소스
    // Data source End

    // Title Text Start
    const [eduDayViewTitle, setEduDayViewTitle] = useState();
    const [studentViewTitle, setStudentViewTitle] = useState();
    // Title Text End

    // Edit State Start
    const [dataEdit, setDataEdit] = useState(false); // Drawer 수정 우측폼 상태
    // Edit State End

    // 차수 Arr Start
    const baseLineArr = [];
    for (let i = 1; i <= 20; i++) {
        baseLineArr.push({ value: i, label: i });
    }
    // 차수 Arr End

    const [dataSource, setDataSource] = useState([
        {
            rowdata0: '1',
            rowdata1: '초급 과정',
            rowdata2: '1',
            rowdata3: '2023-03-06 ~ 2023-03-10',
            rowdata4: '1 / 5일',
            rowdata5: '80',
            rowdata6: '15'
        },
        {
            rowdata0: '2',
            rowdata1: '초급 심화 과정',
            rowdata2: '2',
            rowdata3: '2023-03-13 ~ 2023-03-17',
            rowdata4: '2 / 5일',
            rowdata5: '80',
            rowdata6: '18'
        },
        {
            rowdata0: '3',
            rowdata1: '중급 과정',
            rowdata2: '3',
            rowdata3: '2023-03-20 ~ 2023-03-24',
            rowdata4: '1 / 5일',
            rowdata5: '80',
            rowdata6: '20'
        },
        {
            rowdata0: '4',
            rowdata1: '중급 심화 과정',
            rowdata2: '4',
            rowdata3: '2023-03-27 ~ 2023-03-31',
            rowdata4: '1 / 5일',
            rowdata5: '80',
            rowdata6: '11'
        },
        {
            rowdata0: '5',
            rowdata1: '전문가 과정',
            rowdata2: '5',
            rowdata3: '2023-04-03 ~ 2023-04-07',
            rowdata4: '1 / 5일',
            rowdata5: '80',
            rowdata6: '8'
        }
    ]);

    const defaultColumns = [
        {
            width: '80px',
            title: 'No.',
            dataIndex: 'rowdata0',
            align: 'center'
        },
        {
            title: '학습 과정',
            dataIndex: 'rowdata1',
            align: 'center'
        },
        {
            title: '차수',
            dataIndex: 'rowdata2',
            align: 'center',
            render: (_, { rowdata2 }) => <> {rowdata2 === '0' ? '-' : rowdata2 + '차'} </>
        },
        {
            title: '학습 일정',
            dataIndex: 'rowdata3',
            align: 'center'
        },
        {
            title: '학습일',
            dataIndex: 'rowdata4',
            align: 'center',
            render: (_, { rowdata1, rowdata2, rowdata4 }) => (
                <>
                    <Tooltip title="학습일 정보" color="#108ee9">
                        <Button
                            type="primary"
                            onClick={() => EduDayView_Modal(rowdata1, rowdata2)}
                            style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                            icon={<EyeOutlined />}
                        >
                            {rowdata4}
                        </Button>
                    </Tooltip>
                </>
            )
        },
        {
            title: '배점',
            dataIndex: 'rowdata5',
            align: 'center'
        },
        {
            title: '학습생 인원',
            dataIndex: 'rowdata6',
            align: 'center',
            render: (_, { rowdata1, rowdata2, rowdata6 }) => (
                <>
                    <Tooltip title="학습생 정보" color="#108ee9">
                        <Button
                            type="primary"
                            onClick={() => StudentView_Modal(rowdata1, rowdata2)}
                            style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                            icon={<EyeOutlined />}
                        >
                            {rowdata6}
                        </Button>
                    </Tooltip>
                </>
            )
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

    const [studentdataSourceSearch, setStudentdataSourceSearch] = useState([
        {
            rowdata0: '1',
            rowdata1: '홍길동'
        },
        {
            rowdata0: '2',
            rowdata1: '김삿갓'
        },
        {
            rowdata0: '3',
            rowdata1: '테스터'
        },
        {
            rowdata0: '4',
            rowdata1: '아무개'
        }
    ]);
    const studentColumnsSearch = [
        {
            width: '80px',
            title: 'No.',
            dataIndex: 'rowdata0',
            align: 'center'
        },
        {
            title: '학습생',
            dataIndex: 'rowdata1',
            align: 'center'
        }
    ];

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

    //차수 리스트 Start
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
    // 차수 리스트 End

    const StudenthandleSaveSearch = (row) => {
        const newData = [...studentColumnsSearch];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row
        });
        setStudentColumnsSearch(newData);
    };

    const studentcomponentsSearch = {
        body: {
            row: EditableRow,
            cell: EditableCell
        }
    };

    const studentSearchcolumns = studentColumnsSearch.map((col) => {
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
                StudenthandleSaveSearch
            })
        };
    });
    // 학습생 검색 End

    //체크 박스 이벤트 (학습생)
    const onSelectChangeStudentSearch = (newSelectedRowKeysSub) => {
        console.log('selectedRowKeysStudentSearch changed: ', newSelectedRowKeysSub);
        setSelectedRowKeysStudentSearch(newSelectedRowKeysSub);
    };

    //체크 박스 선택 (학습생)
    const rowSelectionStudentSearch = {
        selectedRowKeysStudentSearch,
        onChange: onSelectChangeStudentSearch
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

    const onRangeChange = (date, dateString) => {
        console.log('Start : ' + dateString[0]);
        console.log('End : ' + dateString[1]);
    };

    // 학습 일정 설정 Start
    const EduDay_Modal = () => {
        setEduDayModalOpen(true);
    };
    const EduDay_handleOk = () => {
        setEduDayModalOpen(false);
    };
    const EduDay_handleCancel = () => {
        setEduDayModalOpen(false);
    };
    // 학습 일정 설정 End

    // 학습생 검색 Modal Start
    const Student_Modal = () => {
        setStudentModalOpen(true);
    };
    const Student_handleOk = () => {
        setStudentModalOpen(false);
    };
    const Student_handleCancel = () => {
        setStudentModalOpen(false);
    };
    // 학습생 검색 Modal End

    // 학습 일정 상세정보 Start
    const EduDayView_Modal = (rowdata1, rowdata2) => {
        setEduDayViewModalOpen(true);
        setEduDayViewTitle(rowdata1 + ' ' + rowdata2);
    };
    const EduDayView_handleOk = () => {
        setEduDayViewModalOpen(false);
    };
    const EduDayView_handleCancel = () => {
        setEduDayViewModalOpen(false);
    };
    // 학습 일정 상세정보 End

    // 학습생 일정 상세정보 Start
    const StudentView_Modal = (rowdata1, rowdata2) => {
        setStudentViewModalOpen(true);
        setStudentViewTitle(rowdata1 + ' ' + rowdata2);
    };
    const StudentView_handleOk = () => {
        setEduDayViewModalOpen(false);
    };
    const StudentView_handleCancel = () => {
        setStudentViewModalOpen(false);
    };
    // 학습생 일정 상세정보 End

    const handleChange = (value) => {
        console.log(`selected ${value}`);
    };

    const eduComplete = (txt) => {
        confirm({
            title: '학습완료 처리하시겠습까?',
            icon: <ExclamationCircleFilled />,
            // content: txt + ' 학습완료! ',
            okText: '예',
            okType: 'danger',
            cancelText: '아니오',
            onOk() {
                Modal.success({
                    content: '학습완료'
                });
            },
            onCancel() {}
        });
    };
    return (
        <>
            <MainCard title="학습과정 관리">
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

            {/* 추가 폼 Start */}
            <Drawer
                maskClosable={false}
                title={`학습과정 ${dataEdit === true ? '수정' : '추가'}`}
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
                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="EduProcedure"
                                    label="학습과정 선택"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter Curriculum.'
                                        }
                                    ]}
                                >
                                    <Select
                                        defaultValue={{
                                            value: 0,
                                            label: '# 학습과정 선택'
                                        }}
                                        style={{
                                            width: '100%'
                                        }}
                                        options={[
                                            {
                                                value: 'Lv1',
                                                label: 'Level 1'
                                            },
                                            {
                                                value: 'Lv2',
                                                label: 'Level 2'
                                            },
                                            {
                                                value: 'Lv3',
                                                label: 'Level 3'
                                            },
                                            {
                                                value: 'Lv4',
                                                label: 'Level 4'
                                            },
                                            {
                                                value: 'Lv5',
                                                label: 'Level 5'
                                            }
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="BaseLine"
                                    label="차수 선택"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter Slide Speed.'
                                        }
                                    ]}
                                >
                                    <Select
                                        defaultValue={{
                                            value: 0,
                                            label: '# 차수 선택'
                                        }}
                                        style={{
                                            width: '100%'
                                        }}
                                        options={baseLineArr}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="EduData"
                                    label="학습 일정"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter EduData.'
                                        }
                                    ]}
                                >
                                    <RangePicker defaultValue={dayjs(new Date())} onChange={onRangeChange} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="EduDayChk"
                                    label="학습일수"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter quantity.'
                                        }
                                    ]}
                                >
                                    <Input placeholder="# 일수" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={24}>
                            <Col span={24}>
                                <Button
                                    style={{ marginBottom: '30px', width: '100%', height: '40px', borderRadius: '5px' }}
                                    type="primary"
                                    onClick={EduDay_Modal}
                                >
                                    학습일자 설정
                                </Button>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="EduPoints"
                                    label="수료기준점수"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter Points Selected.'
                                        }
                                    ]}
                                >
                                    <Select
                                        defaultValue={{
                                            value: 0,
                                            label: '# 수료기준점수'
                                        }}
                                        style={{
                                            width: '100%'
                                        }}
                                        options={[
                                            {
                                                value: '60',
                                                label: '60'
                                            },
                                            {
                                                value: '70',
                                                label: '70'
                                            },
                                            {
                                                value: '80',
                                                label: '80'
                                            },
                                            {
                                                value: '90',
                                                label: '90'
                                            },
                                            {
                                                value: '100',
                                                label: '100'
                                            }
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="EduDayChk"
                                    label="학습생 제한수"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter quantity.'
                                        }
                                    ]}
                                >
                                    <Input placeholder="# 제한수" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={24}>
                            <Col span={24}>
                                <Button
                                    style={{ marginBottom: '30px', width: '100%', height: '40px', borderRadius: '5px' }}
                                    type="primary"
                                    onClick={Student_Modal}
                                >
                                    학습생 검색
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </MainCard>
            </Drawer>
            {/* 추가 폼 End */}
            {/* 학습일자 설정 Modal Start */}
            <Modal
                open={eduDayModalOpen}
                onOk={EduDay_handleOk}
                onCancel={EduDay_handleCancel}
                width={700}
                style={{
                    left: 130,
                    zIndex: 999
                }}
                footer={[
                    <Button
                        type="primary"
                        onClick={EduDay_handleCancel}
                        style={{ width: '100px', borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                    >
                        Close
                    </Button>
                ]}
            >
                <MainCard title="학습 일정별 학습과정 설정" style={{ marginTop: 30 }}>
                    <Form layout="horizontal" form={form}>
                        <Row gutter={24} style={{ marginBottom: 14 }}>
                            <Col span={20} style={{ textAlign: 'center' }}>
                                <Tag color="#108ee9" style={{ padding: '11px 220px', borderRadius: '5px', fontSize: '14px' }}>
                                    2023년 1차
                                </Tag>
                            </Col>
                            <Col span={4}>
                                <Space>
                                    <Tooltip title="저장">
                                        <Tag
                                            color="#ff4d4f"
                                            style={{
                                                float: 'right',
                                                cursor: 'pointer',
                                                padding: '11px 25px',
                                                borderRadius: '5px',
                                                fontSize: '14px'
                                            }}
                                        >
                                            저장
                                        </Tag>
                                    </Tooltip>
                                </Space>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={4}>
                                <Tag icon={<ClockCircleOutlined />} color="#108ee9" style={{ padding: '5px 18px', borderRadius: '5px' }}>
                                    Day 1
                                </Tag>
                            </Col>
                            <Col span={20}>
                                <Form.Item name="EduDay001">
                                    <Select
                                        mode="multiple"
                                        style={{
                                            width: '100%'
                                        }}
                                        onChange={handleChange}
                                        options={[
                                            {
                                                value: '물품연습 모듈',
                                                label: '물품연습 모듈'
                                            },
                                            {
                                                value: '학습 모듈',
                                                label: '학습 모듈'
                                            },
                                            {
                                                value: 'AI강화학습 모듈',
                                                label: 'AI강화학습 모듈'
                                            },
                                            {
                                                value: '평가 모듈',
                                                label: '평가 모듈'
                                            }
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={4}>
                                <Tag icon={<ClockCircleOutlined />} color="#108ee9" style={{ padding: '5px 18px', borderRadius: '5px' }}>
                                    Day 2
                                </Tag>
                            </Col>
                            <Col span={20}>
                                <Form.Item name="EduDay002">
                                    <Select
                                        mode="multiple"
                                        style={{
                                            width: '100%'
                                        }}
                                        onChange={handleChange}
                                        options={[
                                            {
                                                value: '물품연습 모듈',
                                                label: '물품연습 모듈'
                                            },
                                            {
                                                value: '학습 모듈',
                                                label: '학습 모듈'
                                            },
                                            {
                                                value: 'AI강화학습 모듈',
                                                label: 'AI강화학습 모듈'
                                            },
                                            {
                                                value: '평가 모듈',
                                                label: '평가 모듈'
                                            }
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={4}>
                                <Tag icon={<ClockCircleOutlined />} color="#108ee9" style={{ padding: '5px 18px', borderRadius: '5px' }}>
                                    Day 3
                                </Tag>
                            </Col>
                            <Col span={20}>
                                <Form.Item name="EduDay003">
                                    <Select
                                        mode="multiple"
                                        style={{
                                            width: '100%'
                                        }}
                                        onChange={handleChange}
                                        options={[
                                            {
                                                value: '물품연습 모듈',
                                                label: '물품연습 모듈'
                                            },
                                            {
                                                value: '학습 모듈',
                                                label: '학습 모듈'
                                            },
                                            {
                                                value: 'AI강화학습 모듈',
                                                label: 'AI강화학습 모듈'
                                            },
                                            {
                                                value: '평가 모듈',
                                                label: '평가 모듈'
                                            }
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={4}>
                                <Tag icon={<ClockCircleOutlined />} color="#108ee9" style={{ padding: '5px 18px', borderRadius: '5px' }}>
                                    Day 4
                                </Tag>
                            </Col>
                            <Col span={20}>
                                <Form.Item name="EduDay004">
                                    <Select
                                        mode="multiple"
                                        style={{
                                            width: '100%'
                                        }}
                                        onChange={handleChange}
                                        options={[
                                            {
                                                value: '물품연습 모듈',
                                                label: '물품연습 모듈'
                                            },
                                            {
                                                value: '학습 모듈',
                                                label: '학습 모듈'
                                            },
                                            {
                                                value: 'AI강화학습 모듈',
                                                label: 'AI강화학습 모듈'
                                            },
                                            {
                                                value: '평가 모듈',
                                                label: '평가 모듈'
                                            }
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={4}>
                                <Tag icon={<ClockCircleOutlined />} color="#108ee9" style={{ padding: '5px 18px', borderRadius: '5px' }}>
                                    Day 5
                                </Tag>
                            </Col>
                            <Col span={20}>
                                <Form.Item name="EduDay005">
                                    <Select
                                        placeholder="Select Module"
                                        defaultValue={['물품연습 모듈']}
                                        optionLabelProp="label"
                                        mode="multiple"
                                        style={{
                                            width: '100%'
                                        }}
                                        onChange={handleChange}
                                        options={[
                                            {
                                                value: '물품연습 모듈',
                                                label: '물품연습 모듈'
                                            },
                                            {
                                                value: '학습 모듈',
                                                label: '학습 모듈'
                                            },
                                            {
                                                value: 'AI강화학습 모듈',
                                                label: 'AI강화학습 모듈'
                                            },
                                            {
                                                value: '평가 모듈',
                                                label: '평가 모듈'
                                            }
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </MainCard>
            </Modal>
            {/* 학습일자 설정 Modal End */}

            {/* 학습생 검색 Modal Start */}
            <Modal
                open={studentModalOpen}
                onOk={Student_handleOk}
                onCancel={Student_handleCancel}
                width={1000}
                style={{
                    left: 130,
                    zIndex: 999
                }}
                footer={[
                    <Button
                        type="primary"
                        onClick={Student_handleCancel}
                        style={{ width: '100px', borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                    >
                        Close
                    </Button>
                ]}
            >
                <MainCard title="학습생 검색" style={{ marginTop: 30 }}>
                    <Typography variant="body1">
                        <Table
                            components={studentcomponentsSearch}
                            rowClassName={() => 'editable-row'}
                            bordered={true}
                            dataSource={studentdataSourceSearch}
                            loading={loadingStudent}
                            columns={studentSearchcolumns}
                            pagination={false}
                            rowSelection={rowSelectionStudentSearch}
                        />
                    </Typography>
                </MainCard>
            </Modal>
            {/* 학습생 검색 Modal End */}

            {/* 학습일자 상세정보 Modal Start */}
            <Modal
                open={eduDayViewModalOpen}
                onOk={EduDayView_handleOk}
                onCancel={EduDayView_handleCancel}
                width={700}
                style={{
                    left: 130,
                    zIndex: 999
                }}
                footer={[
                    <Button
                        type="primary"
                        onClick={EduDayView_handleCancel}
                        style={{ width: '100px', borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                    >
                        Close
                    </Button>
                ]}
            >
                <MainCard title="학습 일정 상세정보" style={{ marginTop: 30 }}>
                    <Form layout="horizontal" form={form}>
                        <Row gutter={24} style={{ marginBottom: 14 }}>
                            <Col span={24} style={{ textAlign: 'center' }}>
                                <Tag color="#108ee9" style={{ width: '100%', padding: '11px 0', borderRadius: '5px', fontSize: '14px' }}>
                                    {eduDayViewTitle}
                                </Tag>
                            </Col>
                        </Row>

                        <Row gutter={24} style={{ lineHeight: '41px' }}>
                            <Col span={4}>
                                <Tag icon={<ClockCircleOutlined />} color="#108ee9" style={{ padding: '5px 18px', borderRadius: '5px' }}>
                                    Day 1
                                </Tag>
                            </Col>
                            <Col span={16}>
                                <Tag icon={<ClockCircleOutlined />} color="#2db7f5" style={{ padding: '5px 12px' }}>
                                    물품연습 모듈
                                </Tag>
                            </Col>
                            <Col span={4}>
                                <Tag
                                    icon={<CheckOutlined />}
                                    onClick={() => eduComplete('Day 1')}
                                    color="#2db7f5"
                                    style={{ padding: '5px 7px', cursor: 'pointer' }}
                                >
                                    학습완료
                                </Tag>
                            </Col>
                        </Row>
                        <Row gutter={24} style={{ lineHeight: '41px' }}>
                            <Col span={4}>
                                <Tag icon={<ClockCircleOutlined />} color="#108ee9" style={{ padding: '5px 18px', borderRadius: '5px' }}>
                                    Day 2
                                </Tag>
                            </Col>
                            <Col span={16}>
                                <Tag icon={<ClockCircleOutlined />} style={{ padding: '5px 12px' }}>
                                    학습 모듈
                                </Tag>
                                <Tag icon={<ClockCircleOutlined />} style={{ padding: '5px 12px' }}>
                                    AI강화학습 모듈
                                </Tag>
                            </Col>
                            <Col span={4}>
                                <Tag
                                    icon={<ClockCircleOutlined />}
                                    onClick={() => eduComplete('Day 2')}
                                    style={{ padding: '5px 7px', cursor: 'pointer' }}
                                >
                                    학습진행
                                </Tag>
                            </Col>
                        </Row>
                        <Row gutter={24} style={{ lineHeight: '41px' }}>
                            <Col span={4}>
                                <Tag icon={<ClockCircleOutlined />} color="#108ee9" style={{ padding: '5px 18px', borderRadius: '5px' }}>
                                    Day 3
                                </Tag>
                            </Col>
                            <Col span={16}>
                                <Tag icon={<ClockCircleOutlined />} style={{ padding: '5px 12px' }}>
                                    학습 모듈
                                </Tag>
                                <Tag icon={<ClockCircleOutlined />} style={{ padding: '5px 12px' }}>
                                    AI강화학습 모듈
                                </Tag>
                            </Col>
                            <Col span={4}>
                                <Tag
                                    icon={<ClockCircleOutlined />}
                                    onClick={() => eduComplete('Day 3')}
                                    style={{ padding: '5px 7px', cursor: 'pointer' }}
                                >
                                    학습진행
                                </Tag>
                            </Col>
                        </Row>
                        <Row gutter={24} style={{ lineHeight: '41px' }}>
                            <Col span={4}>
                                <Tag icon={<ClockCircleOutlined />} color="#108ee9" style={{ padding: '5px 18px', borderRadius: '5px' }}>
                                    Day 4
                                </Tag>
                            </Col>
                            <Col span={16}>
                                <Tag icon={<ClockCircleOutlined />} style={{ padding: '5px 12px' }}>
                                    학습 모듈
                                </Tag>
                                <Tag icon={<ClockCircleOutlined />} style={{ padding: '5px 12px' }}>
                                    AI강화학습 모듈
                                </Tag>
                            </Col>
                            <Col span={4}>
                                <Tag
                                    icon={<ClockCircleOutlined />}
                                    onClick={() => eduComplete('Day 4')}
                                    style={{ padding: '5px 7px', cursor: 'pointer' }}
                                >
                                    학습진행
                                </Tag>
                            </Col>
                        </Row>
                        <Row gutter={24} style={{ lineHeight: '41px' }}>
                            <Col span={4}>
                                <Tag icon={<ClockCircleOutlined />} color="#108ee9" style={{ padding: '5px 18px', borderRadius: '5px' }}>
                                    Day 5
                                </Tag>
                            </Col>
                            <Col span={16}>
                                <Tag icon={<ClockCircleOutlined />} style={{ padding: '5px 12px' }}>
                                    평가 모듈
                                </Tag>
                            </Col>
                            <Col span={4}>
                                <Tag
                                    icon={<ClockCircleOutlined />}
                                    onClick={() => eduComplete('Day 5')}
                                    style={{ padding: '5px 7px', cursor: 'pointer' }}
                                >
                                    학습진행
                                </Tag>
                            </Col>
                        </Row>
                    </Form>
                </MainCard>
            </Modal>
            {/* 학습일자 상세정보 Modal End */}

            {/* 학습생 상세정보 Modal Start */}
            <Modal
                open={studentViewModalOpen}
                onOk={StudentView_handleOk}
                onCancel={StudentView_handleCancel}
                width={700}
                style={{
                    left: 130,
                    zIndex: 999
                }}
                footer={[
                    <Button
                        type="primary"
                        onClick={StudentView_handleCancel}
                        style={{ width: '100px', borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                    >
                        Close
                    </Button>
                ]}
            >
                <MainCard title="학습생 상세정보" style={{ marginTop: 30 }}>
                    <Form layout="horizontal" form={form}>
                        <Row gutter={24} style={{ marginBottom: 14 }}>
                            <Col span={24} style={{ textAlign: 'center' }}>
                                <Tag color="#108ee9" style={{ width: '100%', padding: '11px 0', borderRadius: '5px', fontSize: '14px' }}>
                                    {studentViewTitle}
                                </Tag>
                            </Col>
                        </Row>
                        학습생 정보
                    </Form>
                </MainCard>
            </Modal>
            {/* 학습생 상세정보 Modal End */}
        </>
    );
};
