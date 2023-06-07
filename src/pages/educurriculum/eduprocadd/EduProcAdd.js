/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Typography } from '@mui/material';
import { Col, Row, Button, Form, Input, Select, Drawer, Table, Space, Tooltip, Modal, DatePicker, Tag, Badge, Card, Divider } from 'antd';
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
import moment from 'moment';

import { StudentSch } from 'pages/educurriculum/eduprocadd/StudentSch'; // 교육생 검색
import { StudentDetil } from 'pages/educurriculum/eduprocadd/StudentDetil'; // 교육생 정보

import { StudySch } from 'pages/educurriculum/eduprocadd/StudySch'; // 학습일 검색

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
    const [studentsList, setStudentsList] = useState([]); // 교육생 목록 배열
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

    const [menuList, setMenuList] = useState([]); // 메뉴 정보
    const [moduleList, setModuleList] = useState([]); // 모듈 정보

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
                key: d.procCd,
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

    // 등록 ======================================================
    const [InsertBaselineApi] = useInsertBaselineMutation(); // 등록 hooks api호출
    const handel_InsertBaseline_Api = async () => {
        const InsertBaselineresponse = await InsertBaselineApi({
            moduleNm: itemContainer.moduleNm,
            moduleDesc: itemContainer.moduleDesc,
            studyLvl: itemContainer.studyLvl,
            slideSpeed: itemContainer.slideSpeed,
            moduleType: itemContainer.moduleType,
            learningType: itemContainer.learningType,
            failToPass: itemContainer.failToPass,
            timeLimit: itemContainer.timeLimit,
            useYn: itemContainer.useYn,
            questionCnt: itemContainer.questionCnt,
            bagList: bagList
        });

        InsertBaselineresponse?.data?.RET_CODE === '0100'
            ? Modal.success({
                  content: '등록 완료',
                  onOk() {
                      setOpen(false);
                      setDataEdit(false);
                      form.resetFields();
                      handel_selectModuleList_Api();
                  }
              })
            : Modal.success({
                  content: '등록 오류',
                  onOk() {}
              });
    };

    // 상세 ======================================================
    // useSelectBaselineMutation // 학습과정 관리 상세

    // setBagList(SelectModuleresponse.data.RET_DATA.bagList);
    // 수정 ======================================================

    //useUpdateBaselineMutation // 학습과정 관리 수정
    // 삭제 ======================================================

    //useDeleteBaselineMutation // 학습과정 관리 삭제

    // 커리큘럼 메뉴목록 조회
    //useSelectModuleMenuListMutation

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

    const Scoreoptions = [
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

    const columns = defaultColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
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

    const studentSearchcolumns = studentColumnsSearch.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
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

    // 교육생 선택 완료 (Modal 닫기)
    const Student_handleOk = (Student_Value) => {
        console.log('교육생 :', Student_Value);
        setStudentsList(Student_Value);
        setItemContainer({ ...itemContainer, limitPersonCnt: Student_Value.length });
        setStudentModalOpen(false);
    };

    const onRangeDayChange = (date, dateString) => {
        // setStartEdudate(dateString[0]);
        setEndEdudate(dateString[1]);
        // console.log('Start : ' + dateString[0]);
        // console.log('End : ' + dateString[1]);
    };

    // 학습 일정 설정 Start
    const EduDay_Modal = () => {
        if (itemContainer.totStudyDate === '' || itemContainer.totStudyDate === undefined) {
            Modal.error({
                content: '총교육일수를 입력해주세요!',
                onOk() {}
            });
        } else {
            setEduDayModalOpen(true);
        }
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

    // 학습일 설정 (일자, 모듈, 메뉴) 값
    const handel_Study_Set = (totStudyDateList, moduleList, menuList) => {
        console.log(totStudyDateList);
        console.log(moduleList);
        console.log(menuList);
        setEduDayModalOpen(false);
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
                            <Tooltip title="학습과정 취소" placement="bottom">
                                <Button onClick={onAddClose} style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}>
                                    취소
                                </Button>
                            </Tooltip>
                            {dataEdit === true ? (
                                <Tooltip title="학습과정 수정" placement="bottom" color="#108ee9">
                                    <Button
                                        onClick={onAddSubmit}
                                        style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                        type="primary"
                                    >
                                        수정
                                    </Button>
                                </Tooltip>
                            ) : (
                                <Tooltip title="학습과정 추가" placement="bottom" color="#108ee9">
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
                                    name="form01"
                                    label="차수명"
                                    rules={[
                                        {
                                            required: true,
                                            message: '차수명 입력'
                                        }
                                    ]}
                                    style={{
                                        width: '100%'
                                    }}
                                >
                                    <Row>
                                        <Col span={24}>
                                            <Input
                                                name="procName"
                                                placeholder="# 차수명"
                                                onChange={(e) => setItemContainer({ ...itemContainer, procName: e.target.value })}
                                                value={itemContainer?.procName}
                                            />
                                        </Col>
                                    </Row>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="form02"
                                    label="차수"
                                    rules={[
                                        {
                                            required: true,
                                            message: '차수 선택'
                                        }
                                    ]}
                                >
                                    <Row>
                                        <Col span={24}>
                                            <Select
                                                name="procSeq"
                                                defaultValue={{
                                                    value: 0,
                                                    label: '# 차수 선택'
                                                }}
                                                style={{
                                                    width: '100%'
                                                }}
                                                onChange={(e) => setItemContainer({ ...itemContainer, procSeq: e })}
                                                value={itemContainer?.procSeq}
                                                options={baseLineArr}
                                            />
                                        </Col>
                                    </Row>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="form03"
                                    label="교육기간"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter EduData.'
                                        }
                                    ]}
                                >
                                    <Row>
                                        <Col span={24}>
                                            <RangePicker
                                                name="EduData"
                                                defaultValue={dayjs(new Date())}
                                                style={{ width: '100%' }}
                                                onChange={(dates) => {
                                                    const [start, end] = dates;
                                                    setItemContainer({
                                                        ...itemContainer,
                                                        eduEndDate: end.format('YYYY-MM-DD'),
                                                        ...itemContainer,
                                                        eduStartDate: start.format('YYYY-MM-DD')
                                                    });
                                                }}
                                                value={[
                                                    itemContainer?.eduStartDate ? moment(itemContainer.eduStartDate) : null,
                                                    itemContainer?.eduEndDate ? moment(itemContainer.eduEndDate) : null
                                                ]}
                                            />
                                        </Col>
                                    </Row>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="form04"
                                    label="총교육일수"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter quantity.'
                                        }
                                    ]}
                                >
                                    <Row>
                                        <Col span={24}>
                                            <Input
                                                placeholder="# 일수"
                                                name="totStudyDate"
                                                onChange={(e) => setItemContainer({ ...itemContainer, totStudyDate: e.target.value })}
                                                value={itemContainer?.totStudyDate}
                                            />
                                        </Col>
                                    </Row>
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
                                    학습일 설정
                                </Button>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    name="form05"
                                    label="수료 기준점수"
                                    rules={[
                                        {
                                            required: true,
                                            message: '※ 수료 기준점수 선택'
                                        }
                                    ]}
                                >
                                    <Row>
                                        <Col>
                                            <Select
                                                name="endingStdScore"
                                                defaultValue={{
                                                    value: 0,
                                                    label: '# 수료 기준점수'
                                                }}
                                                style={{
                                                    width: '210px'
                                                }}
                                                options={Scoreoptions}
                                                onChange={(e) => setItemContainer({ ...itemContainer, endingStdScore: e })}
                                                value={itemContainer?.endingStdScore}
                                            />
                                        </Col>
                                    </Row>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="form06"
                                    label="이론 가중치"
                                    rules={[
                                        {
                                            required: true,
                                            message: '※ 이론 가중치 선택'
                                        }
                                    ]}
                                >
                                    <Row>
                                        <Col>
                                            <Select
                                                name="theoryTotalScore"
                                                defaultValue={{
                                                    value: 0,
                                                    label: '# 이론 가중치'
                                                }}
                                                style={{
                                                    width: '210px'
                                                }}
                                                options={Scoreoptions}
                                                onChange={(e) => setItemContainer({ ...itemContainer, theoryTotalScore: e })}
                                                value={itemContainer?.theoryTotalScore}
                                            />
                                        </Col>
                                    </Row>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    name="form07"
                                    label="실기 가중치"
                                    rules={[
                                        {
                                            required: true,
                                            message: '※ 실기 가중치 선택'
                                        }
                                    ]}
                                >
                                    <Row>
                                        <Col span={12}>
                                            <Select
                                                name="practiceTotalScore"
                                                defaultValue={{
                                                    value: 0,
                                                    label: '# 실기 가중치'
                                                }}
                                                style={{
                                                    width: '210px'
                                                }}
                                                options={Scoreoptions}
                                                onChange={(e) => setItemContainer({ ...itemContainer, practiceTotalScore: e })}
                                                value={itemContainer?.practiceTotalScore}
                                            />
                                        </Col>
                                    </Row>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="form08"
                                    label="평가 가중치"
                                    rules={[
                                        {
                                            required: true,
                                            message: '※ 평가 가중치 선택'
                                        }
                                    ]}
                                >
                                    <Row>
                                        <Col span={12}>
                                            <Select
                                                name="evaluationTotalScore"
                                                defaultValue={{
                                                    value: 0,
                                                    label: '# 평가 가중치'
                                                }}
                                                style={{
                                                    width: '210px'
                                                }}
                                                options={Scoreoptions}
                                                onChange={(e) => setItemContainer({ ...itemContainer, evaluationTotalScore: e })}
                                                value={itemContainer?.evaluationTotalScore}
                                            />
                                        </Col>
                                    </Row>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Divider style={{ margin: '10px 0' }} />
                        <Card bordered style={{ textAlign: 'center', margin: '20px 0' }}>
                            <Row>
                                <Col span={24}>
                                    <div>교육생 수</div>
                                    <Badge
                                        style={{ width: '40px', marginTop: '5px' }}
                                        count={itemContainer?.limitPersonCnt}
                                        color="#52c41a"
                                        overflowCount={9999}
                                    />
                                </Col>
                            </Row>
                        </Card>
                        {/* <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="EduStudentChk"
                                    label="교육생 수"
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
                        </Row> */}

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
            {/* 학습일 설정 Modal Start */}
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
                <StudySch
                    ProcName={itemContainer?.procName}
                    ProcSeq={itemContainer?.procSeq}
                    TotStudyDate={itemContainer?.totStudyDate}
                    MenuList={menuList.slice()}
                    ModuleList={moduleList.slice()}
                    EduStartDate={itemContainer?.eduStartDate}
                    EduEndDate={itemContainer?.eduEndDate}
                    StudySet={handel_Study_Set}
                />
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
                <StudentSch StudentsCnt={Student_handleOk} StudentsList={studentsList.slice()} />
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
                <StudentDetil />
            </Modal>
            {/* 교육생 상세정보 Modal End */}
        </>
    );
};
