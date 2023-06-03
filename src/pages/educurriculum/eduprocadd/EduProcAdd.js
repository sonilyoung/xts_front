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

// 학습과정 관리 : 조회, 상세, 등록, 등록-(커리큘럼 메뉴목록 조회), 수정, 삭제, 커리큘럼 교육생삭제, 학습일정 상세정보 팝업, 학습생 인원 상세정보 팝업
import {
    useSelectBaselineListMutation, // 학습과정 관리 조회
    useSelectBaselineMutation, // 학습과정 관리 상세
    useInsertBaselineMutation, // 학습과정 관리 등록
    useSelectModuleMenuListMutation, // 학습과정 관리 등록-(커리큘럼 메뉴목록 조회)
    useUpdateBaselineMutation, // 학습과정 관리 수정
    useDeleteBaselineMutation, // 학습과정 관리 삭제
    useDeleteBaselineStudentMutation, // 학습과정 관리 커리큘럼 교육생 삭제
    useSelectBaselineEduDateListMutation // 학습과정 관리 학습일정 상세정보 팝업
} from '../../../hooks/api/CurriculumManagement/CurriculumManagement';

import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';

// project import
import MainCard from 'components/MainCard';

import { StudentSch } from 'pages/educurriculum/eduprocadd/StudentSch'; // 교육생 검색
import { StudentDetil } from 'pages/educurriculum/eduprocadd/StudentDetil'; // 교육생 정보

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
    const [open, setOpen] = useState(false); // 추가, 수정 (우측 슬라이드)
    const [eduDayModalOpen, setEduDayModalOpen] = useState(false); // 학습일정 설정 Modal창
    const [studentModalOpen, setStudentModalOpen] = useState(false); // 학습생 검색 Modal창
    const [eduDayViewModalOpen, setEduDayViewModalOpen] = useState(false); // 학습일정 상세정보 Modal창
    const [studentViewModalOpen, setStudentViewModalOpen] = useState(false); // 학습생 상세정보 Modal창
    // Modal창 End

    // Data source Start
    const [itemContainer, setItemContainer] = useState({}); // 항목 컨테이너
    const [studyDayArry, setStudyDayArry] = useState([]); // 학습일수 배열
    const [studentArry, setStudentArry] = useState([]); // 교육생 배열
    const [procCdValue, setProcCdValue] = useState([]); // 교육생 정보 조회

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

    // ===============================
    // Api 호출 Start
    // 조회 ======================================================
    const [SelectBaselineListApi] = useSelectBaselineListMutation(); // 콘텐츠 정보 관리 hooks api호출
    const [selectBaselineListData, setSelectBaselineListData] = useState(); // 콘텐츠 정보관리 리스트 상단 값
    const handel_SelectBaselineList_Api = async () => {
        const SelectBaselineListresponse = await SelectBaselineListApi({});
        setSelectBaselineListData([
            ...SelectBaselineListresponse?.data?.RET_DATA.map((d, i) => ({
                key: d.moduleId,
                rowdata0: i + 1, // 시퀀스
                rowdata1: d.procCd, // 차수내부번호
                rowdata2: d.procName, // 차수명
                rowdata3: d.procSeq, // 차수
                rowdata4: d.eduDate, // 교육기간
                rowdata5: d.eduStartDate, // 교육시작일
                rowdata6: d.eduEndDate, // 교육종료일
                rowdata7: d.totStudyDate, // 총교육일수
                rowdata8: d.limitPersonCnt, // 제한인원수
                rowdata9: d.endingStdScore, // 수료기준점수
                rowdata10: d.timeDiff, // 진행된학습일
                rowdata11: d.totTimeDiff // 총학습일
            }))
        ]);
        setLoading(false);
    };

    // 학습일정 상세정보 팝업 ======================================================
    const [SelectBaselineEduDateListApi] = useSelectBaselineEduDateListMutation(); // 콘텐츠 정보 관리 hooks api호출
    const [selectBaselineEduDateListData, setSelectBaselineEduDateListData] = useState(); // 콘텐츠 정보관리 리스트 상단 값
    const handel_SelectBaselineEduDateList_Api = async (procCd) => {
        const SelectBaselineEduDateListresponse = await SelectBaselineEduDateListApi({
            procCd: procCd
        });
        console.log(SelectBaselineEduDateListresponse?.data?.RET_DATA);
        setSelectBaselineEduDateListData(SelectBaselineEduDateListresponse?.data?.RET_DATA);
    };

    // Api 호출 End
    // ===============================

    const defaultColumns = [
        {
            width: '70px',
            title: 'No.',
            dataIndex: 'rowdata0',
            align: 'center'
        },
        {
            title: '차수명',
            dataIndex: 'rowdata2',
            align: 'center'
        },
        {
            title: '차수',
            dataIndex: 'rowdata3',
            align: 'center',
            render: (_, { rowdata2 }) => <> {rowdata2 === '0' ? '-' : rowdata2 + '차'} </>
        },
        {
            title: '교육기간',
            dataIndex: 'rowdata4',
            align: 'center'
        },
        // {
        //     title: '교육시작일',
        //     dataIndex: 'rowdata5',
        //     align: 'center'
        // },
        // {
        //     title: '교육종료일',
        //     dataIndex: 'rowdata6',
        //     align: 'center'
        // },

        // {
        //     title: '학습일',
        //     dataIndex: 'rowdata4',
        //     align: 'center',
        //     render: (_, { rowdata1, rowdata2, rowdata4 }) => (
        //         <>
        //             <Tooltip title="학습일 정보" color="#108ee9">
        //                 <Button
        //                     type="primary"
        //                     onClick={() => EduDayView_Modal(rowdata1, rowdata2)}
        //                     style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
        //                     icon={<EyeOutlined />}
        //                 >
        //                     {rowdata4}
        //                 </Button>
        //             </Tooltip>
        //         </>
        //     )
        // },
        {
            title: '총교육일수',
            dataIndex: 'rowdata7',
            align: 'center',
            render: (_, { rowdata1, rowdata7 }) => (
                <>
                    <Tooltip title="학습일 정보" color="#108ee9">
                        <Button
                            type="primary"
                            onClick={() => EduDayView_Modal(rowdata1)}
                            style={{ borderRadius: '5px', width: '80px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                            icon={<EyeOutlined />}
                        >
                            <span style={{ padding: '0 5px' }}>{rowdata7}</span>
                        </Button>
                    </Tooltip>
                </>
            )
        },
        {
            title: '제한인원수',
            dataIndex: 'rowdata8',
            align: 'center'
        },
        {
            title: '교육생 인원',
            dataIndex: 'rowdata8',
            align: 'center',
            render: (_, { rowdata1, rowdata8 }) => (
                <>
                    <Tooltip title="교육생 정보" color="#108ee9">
                        <Button
                            type="primary"
                            onClick={() => StudentView_Modal(rowdata1)}
                            style={{ borderRadius: '5px', width: '80px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                            icon={<EyeOutlined />}
                        >
                            <span style={{ padding: '0 5px' }}>{rowdata8}</span>
                        </Button>
                    </Tooltip>
                </>
            )
        },
        {
            title: '수료기준점수',
            dataIndex: 'rowdata9',
            align: 'center'
        },
        {
            title: '이론가중치',
            dataIndex: 'rowdata9',
            align: 'center'
        },
        {
            title: '실기가중치',
            dataIndex: 'rowdata9',
            align: 'center'
        },
        {
            title: '평가가중치',
            dataIndex: 'rowdata9',
            align: 'center'
        },
        {
            title: '진행된학습일',
            dataIndex: 'rowdata10',
            align: 'center'
        },
        {
            title: '총학습일',
            dataIndex: 'rowdata11',
            align: 'center'
        },
        {
            width: '90px',
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
        const newData = [...selectBaselineListData];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row
        });
        setSelectBaselineListData(newData);
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
        setStartEdudate(dateString[0]);
        setEndEdudate(dateString[1]);
        // console.log('Start : ' + dateString[0]);
        // console.log('End : ' + dateString[1]);
    };

    const onRangeDayChange = (date, dateString) => {
        // setStartEdudate(dateString[0]);
        setEndEdudate(dateString[1]);
        // console.log('Start : ' + dateString[0]);
        // console.log('End : ' + dateString[1]);
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
    const EduDayView_Modal = (rowdata1) => {
        setEduDayViewModalOpen(true);
        setEduDayViewTitle(rowdata1);
        handel_SelectBaselineEduDateList_Api(rowdata1);
    };
    const EduDayView_handleOk = () => {
        setEduDayViewModalOpen(false);
    };
    const EduDayView_handleCancel = () => {
        setEduDayViewModalOpen(false);
    };
    // 학습 일정 상세정보 End

    // 학습생 일정 상세정보 Start
    const StudentView_Modal = (rowdata1) => {
        setStudentViewModalOpen(true);
        setProcCdValue(rowdata1);
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

    useEffect(() => {
        setLoading(true); // 로딩 호출
        handel_SelectBaselineList_Api(); // 조회
    }, []);

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
                        dataSource={selectBaselineListData}
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
                width={550}
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
                                    label="차수명"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter ProcName.'
                                        }
                                    ]}
                                >
                                    <Input name="ProcName" placeholder="# 차수명" />
                                    {/* onChange={(e) => setProcName(e.target.value)} /> */}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    label="차수"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter Slide Speed.'
                                        }
                                    ]}
                                >
                                    <Select
                                        name="BaseLine"
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
                                    label="교육기간"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter EduData.'
                                        }
                                    ]}
                                >
                                    <RangePicker name="EduData" defaultValue={dayjs(new Date())} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="eduDays"
                                    label="총교육일수"
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
                            <Col span={12}>
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
                            <Col span={12}>
                                <Form.Item
                                    name="theoryTotalScore"
                                    label="이론가중치"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter theoryTotalScore Selected.'
                                        }
                                    ]}
                                >
                                    <Select
                                        defaultValue={{
                                            value: 0,
                                            label: '# 이론가중치'
                                        }}
                                        style={{
                                            width: '100%'
                                        }}
                                        options={[
                                            {
                                                value: '10',
                                                label: '10'
                                            },
                                            {
                                                value: '20',
                                                label: '20'
                                            },
                                            {
                                                value: '30',
                                                label: '30'
                                            },
                                            {
                                                value: '40',
                                                label: '40'
                                            },
                                            {
                                                value: '50',
                                                label: '50'
                                            },
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
                            <Col span={12}>
                                <Form.Item
                                    name="practiceTotalScore"
                                    label="실기가중치"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter practiceTotalScore Selected.'
                                        }
                                    ]}
                                >
                                    <Select
                                        defaultValue={{
                                            value: 0,
                                            label: '# 실기가중치'
                                        }}
                                        style={{
                                            width: '100%'
                                        }}
                                        options={[
                                            {
                                                value: '10',
                                                label: '10'
                                            },
                                            {
                                                value: '20',
                                                label: '20'
                                            },
                                            {
                                                value: '30',
                                                label: '30'
                                            },
                                            {
                                                value: '40',
                                                label: '40'
                                            },
                                            {
                                                value: '50',
                                                label: '50'
                                            },
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
                            <Col span={12}>
                                <Form.Item
                                    name="evaluationTotalScore"
                                    label="평가가중치"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter evaluationTotalScore Selected.'
                                        }
                                    ]}
                                >
                                    <Select
                                        defaultValue={{
                                            value: 0,
                                            label: '# 평가가중치'
                                        }}
                                        style={{
                                            width: '100%'
                                        }}
                                        options={[
                                            {
                                                value: '10',
                                                label: '10'
                                            },
                                            {
                                                value: '20',
                                                label: '20'
                                            },
                                            {
                                                value: '30',
                                                label: '30'
                                            },
                                            {
                                                value: '40',
                                                label: '40'
                                            },
                                            {
                                                value: '50',
                                                label: '50'
                                            },
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
                                    name="EduStudentChk"
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
                                    교육생 검색
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
                width={950}
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
                                <Tag
                                    color="#108ee9"
                                    style={{ float: 'left', padding: '11px 280px', borderRadius: '5px', fontSize: '14px' }}
                                >
                                    2023년 {}차
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
                                                padding: '11px 46px',
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

                        {Array.from({ length: 3 }, (_, index) => (
                            <Row gutter={24} key={index}>
                                <Col span={7}>
                                    <RangePicker
                                        style={{ height: '88px' }}
                                        name={`Day ${index + 1}`}
                                        id={`Day ${index + 1}`}
                                        defaultValue={[dayjs('2023-06-01', 'YYYY-MM-DD'), dayjs('2023-06-10', 'YYYY-MM-DD')]}
                                        onChange={onRangeDayChange}
                                        disabled={3 - 1 === index ? [false, true] : index === 0 ? [true, false] : [false, false]}
                                    />
                                </Col>

                                <Col span={17}>
                                    <Form.Item name={`EduDay00${index + 1}`}>
                                        <Select
                                            placeholder="# 모듈 선택"
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

                                    <Form.Item name={`EduDay10${index + 1}`}>
                                        <Select
                                            placeholder="# 메뉴 선택"
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
                        ))}
                    </Form>
                </MainCard>
            </Modal>
            {/* 학습일자 설정 Modal End */}

            {/* 교육생 검색 Modal Start */}
            <Modal
                open={studentModalOpen}
                closable={false}
                width={1400}
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
                <StudentSch />
            </Modal>
            {/* 교육생 검색 Modal End */}

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

            {/* 교육생 상세정보 Modal Start */}
            <Modal
                open={studentViewModalOpen}
                onOk={StudentView_handleOk}
                onCancel={StudentView_handleCancel}
                width={1400}
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
                <StudentDetil procCdValue={procCdValue} />
            </Modal>
            {/* 교육생 상세정보 Modal End */}
        </>
    );
};
