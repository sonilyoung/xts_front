/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Typography } from '@mui/material';
import {
    Col,
    Row,
    Button,
    Form,
    Input,
    Select,
    Drawer,
    Table,
    Space,
    Tooltip,
    Modal,
    DatePicker,
    Descriptions,
    Badge,
    Card,
    Divider,
    Tag
} from 'antd';
import 'antd/dist/antd.css';
import { PlusOutlined, EditFilled, EyeOutlined, DeleteFilled, ExclamationCircleFilled } from '@ant-design/icons';

// 학습과정 관리 : 조회, 상세, 등록, 등록-(커리큘럼 메뉴목록 조회), 수정, 삭제, 커리큘럼 교육생삭제, 학습일정 상세정보 팝업, 학습생 인원 상세정보 팝업
import {
    useSelectBaselineListMutation, // 학습과정 관리 조회
    useSelectBaselineMutation, // 학습과정 관리 상세
    useInsertBaselineMutation, // 학습과정 관리 등록
    useUpdateBaselineMutation, // 학습과정 관리 수정
    useDeleteBaselineMutation // 학습과정 관리 삭제
} from '../../../hooks/api/CurriculumManagement/CurriculumManagement';

import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';

// project import
import MainCard from 'components/MainCard';

import { StudentSch } from 'pages/educurriculum/eduprocadd/StudentSch'; // 교육생 검색
import { StudentDetail } from 'pages/educurriculum/eduprocadd/StudentDetail'; // 교육생 정보

import { StudySch } from 'pages/educurriculum/eduprocadd/StudySch'; // 학습일 검색
import { StudySchDetail } from 'pages/educurriculum/eduprocadd/StudySchDetail'; // 교육생 정보

export const EduProcAdd = () => {
    const { confirm } = Modal;
    const [form] = Form.useForm();
    dayjs.extend(weekday);
    dayjs.extend(localeData);
    const { RangePicker } = DatePicker;
    const { Option } = Select;

    // Loading Start
    const [loading, setLoading] = useState(false);
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
    const [procCdValue, setProcCdValue] = useState([]); // 차수관리 아이디
    const [studyDayArry, setStudyDayArry] = useState([]); // 학습일수 배열
    const [moduleArry, setModuleArry] = useState([]); //  모듈 배열
    const [stuList, setStuList] = useState([]); // 상세 - 교육생 배열 정보

    // Data source End

    // Title Text Start
    const [eduDayViewTitle, setEduDayViewTitle] = useState();
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
            render: (_, { rowdata3 }) => <> {rowdata3 === '0' ? '-' : rowdata3 + '차'} </>
        },
        {
            title: '교육기간',
            dataIndex: 'rowdata4',
            align: 'center'
        },
        {
            title: '총교육일정',
            dataIndex: 'rowdata7',
            align: 'center',
            render: (_, { rowdata1, rowdata7 }) => (
                <>
                    <Tooltip title="학습일 정보" color="#108ee9">
                        <Button
                            type="primary"
                            onClick={() => EduDayView_Modal(rowdata1)}
                            style={{ borderRadius: '5px', width: '70px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
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
                            style={{ borderRadius: '5px', width: '70px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
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
            procSeq: itemContainer.procSeq,
            procName: itemContainer.procName,
            eduStartDate: itemContainer.eduStartDate,
            eduEndDate: itemContainer.eduEndDate,
            totStudyDate: itemContainer.totStudyDate,
            studyLvl: itemContainer.studyLvl,
            limitPersonCnt: itemContainer.limitPersonCnt,
            endingStdScore: itemContainer.endingStdScore,
            practiceTotalScore: itemContainer.practiceTotalScore,
            evaluationTotalScore: itemContainer.evaluationTotalScore,
            theoryTotalScore: itemContainer.theoryTotalScore,
            scheduleList: studyDayArry,
            menuList: moduleArry,
            userList: stuList
        });

        InsertBaselineresponse?.data?.RET_CODE === '0100'
            ? Modal.success({
                  content: '등록 완료',
                  onOk() {
                      setOpen(false);
                      setDataEdit(false);
                      form.resetFields();
                      handel_SelectBaselineList_Api();
                  }
              })
            : Modal.error({
                  content: '등록 오류',
                  onOk() {}
              });
    };

    // 상세 ======================================================
    // useSelectBaselineMutation // 차수 관리 상세
    const [SelectBaselineApi] = useSelectBaselineMutation(); // 상세 hooks api호출
    const handel_SelectBaseline_Api = async (procCd) => {
        const SelectBaselineresponse = await SelectBaselineApi({
            procCd: procCd
        });
        console.log(SelectBaselineresponse?.data?.RET_DATA);
        setItemContainer(SelectBaselineresponse?.data?.RET_DATA);
        setStudyDayArry(SelectBaselineresponse?.data?.RET_DATA?.scheduleList);
        setModuleArry(SelectBaselineresponse?.data?.RET_DATA?.menuList);
        setStuList(SelectBaselineresponse?.data?.RET_DATA?.userList);
    };
    // 차수 관리 수정 ======================================================
    const [UpdateBaselineApi] = useUpdateBaselineMutation(); // 수정 hooks api호출
    const handel_UpdateBaseline_Api = async () => {
        const UpdateBaselineresponse = await UpdateBaselineApi({
            procCd: procCdValue,
            procSeq: itemContainer.procSeq,
            procName: itemContainer.procName,
            eduStartDate: itemContainer.eduStartDate,
            eduEndDate: itemContainer.eduEndDate,
            totStudyDate: itemContainer.totStudyDate,
            studyLvl: itemContainer.studyLvl,
            limitPersonCnt: itemContainer.limitPersonCnt,
            endingStdScore: itemContainer.endingStdScore,
            practiceTotalScore: itemContainer.practiceTotalScore,
            evaluationTotalScore: itemContainer.evaluationTotalScore,
            theoryTotalScore: itemContainer.theoryTotalScore,
            scheduleList: studyDayArry,
            menuList: moduleArry,
            userList: stuList
        });

        UpdateBaselineresponse?.data?.RET_CODE === '0100'
            ? Modal.success({
                  content: '수정 완료',
                  onOk() {
                      setOpen(false);
                      setDataEdit(false);
                      form.resetFields();
                      handel_SelectBaselineList_Api();
                  }
              })
            : Modal.error({
                  content: '수정 오류',
                  onOk() {}
              });
    };

    // 삭제 ======================================================
    // // 차수 관리 삭제
    const [DeleteBaselineApi] = useDeleteBaselineMutation(); // 삭제 hooks api호출
    const handel_DeleteBaseline_Api = async (procCd) => {
        const DeleteBaselineresponse = await DeleteBaselineApi({
            procCdList: procCd
        });
        DeleteBaselineresponse?.data?.RET_CODE === '0300'
            ? Modal.success({
                  content: '삭제 완료',
                  onOk() {
                      handel_SelectBaselineList_Api();
                  }
              })
            : Modal.error({
                  content: '삭제 오류',
                  onOk() {}
              });
    };

    // Api 호출 End
    // ===============================

    const Scoreoptions = [
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

    //체크 박스 이벤트 (학습생)
    const onSelectChangeStudentSearch = (newSelectedRowKeysSub) => {
        //console.log('selectedRowKeysStudentSearch changed: ', newSelectedRowKeysSub);
        setSelectedRowKeysStudentSearch(newSelectedRowKeysSub);
    };

    //체크 박스 선택 (학습생)
    const rowSelectionStudentSearch = {
        selectedRowKeysStudentSearch,
        onChange: onSelectChangeStudentSearch
    };

    //체크 박스 이벤트
    const onSelectChange = (newSelectedRowKeys) => {
        //console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    //체크 박스 선택
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange
    };

    // 추가 버튼
    const handleAdd = () => {
        setItemContainer(null);
        setStudyDayArry(null);
        setModuleArry(null);
        setStuList(null);
        setOpen(true);
        setDataEdit(false);
    };

    // 추가 / 수정 취소
    const onAddClose = () => {
        setItemContainer(null);
        setProcCdValue(null);
        setOpen(false);
        setDataEdit(false);
        form.resetFields();
    };

    // 수정 버튼
    const handleEdit = (EditKey) => {
        handel_SelectBaseline_Api(EditKey);
        setProcCdValue(EditKey);
        setDataEdit(true);
        setOpen(true);
    };

    // 추가 및 수정 처리
    const onAddSubmit = () => {
        if (dataEdit === true) {
            handel_UpdateBaseline_Api();
        } else {
            handel_InsertBaseline_Api();
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
                okText: '예',
                okType: 'danger',
                cancelText: '아니오',
                onOk() {
                    handel_DeleteBaseline_Api(selectedRowKeys);
                },
                onCancel() {}
            });
        }
    };

    // 교육생 선택 완료 (Modal 닫기)
    const Student_handleOk = (Student_Value) => {
        setStuList(Student_Value);
        setItemContainer({ ...itemContainer, limitPersonCnt: Student_Value.length });
        setStudentModalOpen(false);
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

    const Student_handleCancel = () => {
        setStudentModalOpen(false);
    };

    // 학습생 검색 Modal End

    // 학습 일정 상세정보 Start
    const EduDayView_Modal = (rowdata1) => {
        setEduDayViewModalOpen(true);
        setEduDayViewTitle(rowdata1);
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

    // 교육생 인원 modal창 닫기
    const StudentView_handleCancel = () => {
        setStudentViewModalOpen(false);
    };

    // 학습일 설정 (일자, 모듈, 메뉴) 값
    const handel_Study_Set = (totStudyDateList, menuListSet) => {
        setStudyDayArry(totStudyDateList);
        setModuleArry(menuListSet);
        setEduDayModalOpen(false);
        // console.log(totStudyDateList);
        // console.log(menuListSet);
    };

    useEffect(() => {
        setLoading(true); // 로딩 호출
        handel_SelectBaselineList_Api(); // 조회
    }, []);

    return (
        <>
            <MainCard title="차수 관리">
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
                width={600}
                style={{ top: '60px' }}
                extra={
                    <>
                        <Space>
                            <Tooltip title="차수 취소" placement="bottom">
                                <Button onClick={onAddClose} style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}>
                                    취소
                                </Button>
                            </Tooltip>
                            {dataEdit === true ? (
                                <Tooltip title="차수 수정" placement="bottom" color="#108ee9">
                                    <Button
                                        onClick={onAddSubmit}
                                        style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                        type="primary"
                                    >
                                        수정
                                    </Button>
                                </Tooltip>
                            ) : (
                                <Tooltip title="차수 추가" placement="bottom" color="#108ee9">
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
                {localStorage.getItem('LoginId')}
                <MainCard>
                    <Form layout="vertical" form={form} autoComplete="off">
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
                                >
                                    <Row>
                                        <Col>
                                            <Input
                                                style={{
                                                    width: '490px'
                                                }}
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
                                        <Col>
                                            <Select
                                                name="procSeq"
                                                style={{
                                                    width: '490px'
                                                }}
                                                onChange={(e) => setItemContainer({ ...itemContainer, procSeq: e })}
                                                value={
                                                    itemContainer?.procSeq === undefined || itemContainer?.procSeq === null
                                                        ? {
                                                              value: 0,
                                                              label: '# 차수 선택'
                                                          }
                                                        : itemContainer?.procSeq
                                                }
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
                                            message: '※ 교육기간'
                                        }
                                    ]}
                                >
                                    <Row>
                                        <Col>
                                            <RangePicker
                                                name="EduData"
                                                style={{ width: '490px' }}
                                                onChange={(dates) => {
                                                    const [start, end] = dates;
                                                    const eduStartDate = start.format('YYYY-MM-DD');
                                                    const eduEndDate = end.format('YYYY-MM-DD');
                                                    const totStudyDays = dayjs(eduEndDate).diff(eduStartDate, 'days') + 1;
                                                    setItemContainer({
                                                        ...itemContainer,
                                                        eduStartDate,
                                                        eduEndDate,
                                                        totStudyDate: String(totStudyDays)
                                                    });
                                                }}
                                                value={[
                                                    itemContainer?.eduStartDate ? dayjs(itemContainer.eduStartDate) : dayjs(new Date()),
                                                    itemContainer?.eduEndDate ? dayjs(itemContainer.eduEndDate) : ''
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
                                            message: '※ 총교육일수'
                                        }
                                    ]}
                                >
                                    <Row>
                                        <Col>
                                            <Input
                                                placeholder="# 총교육일수"
                                                name="totStudyDate"
                                                id="totStudyDate"
                                                onChange={(e) => {
                                                    setItemContainer({ ...itemContainer, totStudyDate: String(e.target.value) });
                                                }}
                                                value={itemContainer?.totStudyDate}
                                                style={{ width: '490px' }}
                                            />
                                        </Col>
                                    </Row>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={24}>
                            <Col span={24}>
                                <Button
                                    style={{ marginBottom: '30px', width: '100%', height: '52px', borderRadius: '5px' }}
                                    type="primary"
                                    onClick={EduDay_Modal}
                                    disabled={!itemContainer?.eduStartDate || !itemContainer?.eduEndDate || !itemContainer?.totStudyDate}
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
                                                style={{
                                                    width: '236px'
                                                }}
                                                options={Scoreoptions}
                                                onChange={(e) => setItemContainer({ ...itemContainer, endingStdScore: e })}
                                                value={
                                                    itemContainer?.endingStdScore === undefined || itemContainer?.endingStdScore === null
                                                        ? {
                                                              value: 0,
                                                              label: '# 수료 기준점수'
                                                          }
                                                        : itemContainer?.endingStdScore
                                                }
                                            />
                                        </Col>
                                    </Row>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="form06"
                                    label="이론평가 가중치(%)"
                                    rules={[
                                        {
                                            required: true,
                                            message: '※ 이론평가 가중치 선택'
                                        }
                                    ]}
                                >
                                    <Row>
                                        <Col>
                                            <Input
                                                name="theoryTotalScore"
                                                addonAfter="%"
                                                onChange={(e) => {
                                                    const value = parseInt(e.target.value);
                                                    if (!isNaN(value) && value <= 100) {
                                                        setItemContainer({ ...itemContainer, theoryTotalScore: value });
                                                    }
                                                }}
                                                value={
                                                    itemContainer?.theoryTotalScore === undefined ||
                                                    itemContainer?.theoryTotalScore === null
                                                        ? 0
                                                        : itemContainer?.theoryTotalScore
                                                }
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
                                    label="실기평가 가중치(%)"
                                    rules={[
                                        {
                                            required: true,
                                            message: '※ 실기평가 가중치 선택'
                                        }
                                    ]}
                                >
                                    <Row>
                                        <Col>
                                            <Input
                                                name="practiceTotalScore"
                                                addonAfter="%"
                                                onChange={(e) => {
                                                    const value = parseInt(e.target.value);
                                                    if (!isNaN(value) && value <= 100) {
                                                        setItemContainer({ ...itemContainer, practiceTotalScore: value });
                                                    }
                                                }}
                                                value={
                                                    itemContainer?.practiceTotalScore === undefined ||
                                                    itemContainer?.practiceTotalScore === null
                                                        ? 0
                                                        : itemContainer?.practiceTotalScore
                                                }
                                            />
                                        </Col>
                                    </Row>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="form08"
                                    label="XBT 평가 가중치(%)"
                                    rules={[
                                        {
                                            required: true,
                                            message: '※ XBT 평가 가중치 선택'
                                        }
                                    ]}
                                >
                                    <Row>
                                        <Col>
                                            <Input
                                                name="evaluationTotalScore"
                                                addonAfter="%"
                                                onChange={(e) => {
                                                    const value = parseInt(e.target.value);
                                                    if (!isNaN(value) && value <= 100) {
                                                        setItemContainer({ ...itemContainer, evaluationTotalScore: value });
                                                    }
                                                }}
                                                value={
                                                    itemContainer?.evaluationTotalScore === undefined ||
                                                    itemContainer?.evaluationTotalScore === null
                                                        ? 0
                                                        : itemContainer?.evaluationTotalScore
                                                }
                                            />
                                        </Col>
                                    </Row>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={24}>
                                <Descriptions title="" layout="vertical" bordered column={4}>
                                    <Descriptions.Item label="이론 평가" style={{ textAlign: 'center' }}>
                                        <Tag color="default" style={{ padding: '5px 10px', borderRadius: '8px' }}>
                                            {itemContainer?.theoryTotalScore || 0}%
                                        </Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="실기 평가" style={{ textAlign: 'center' }}>
                                        <Tag color="default" style={{ padding: '5px 10px', borderRadius: '8px' }}>
                                            {itemContainer?.practiceTotalScore || 0}%
                                        </Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="XBT 평가" style={{ textAlign: 'center' }}>
                                        <Tag color="default" style={{ padding: '5px 10px', borderRadius: '8px' }}>
                                            {itemContainer?.evaluationTotalScore || 0}%
                                        </Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="가중치 비율(%)" style={{ textAlign: 'center' }}>
                                        <Tag color="processing" style={{ padding: '5px 10px', borderRadius: '8px' }}>
                                            {parseInt(itemContainer?.theoryTotalScore || 0) +
                                                parseInt(itemContainer?.practiceTotalScore || 0) +
                                                parseInt(itemContainer?.evaluationTotalScore || 0)}
                                            %
                                        </Tag>
                                    </Descriptions.Item>
                                </Descriptions>
                            </Col>
                        </Row>

                        <Divider style={{ margin: '10px 0' }} />
                        <Card bordered style={{ textAlign: 'center' }}>
                            <Row gutter={24}>
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
                        <Row gutter={24}>
                            <Col span={24}>
                                <Button
                                    style={{ marginBottom: '30px', width: '100%', height: '52px', borderRadius: '5px' }}
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
                width={1250}
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
                    key={procCdValue}
                    TotStudyDate={itemContainer?.totStudyDate}
                    EduStartDate={itemContainer?.eduStartDate}
                    EduEndDate={itemContainer?.eduEndDate}
                    StudySet={handel_Study_Set}
                    SetScheduleList={studyDayArry}
                    SetMenuList={moduleArry}
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
                <StudentSch StudentsCnt={Student_handleOk} StudentValue={stuList} ProcCdValue={procCdValue} />
            </Modal>
            {/* 교육생 검색 Modal End */}

            {/* 학습일자 상세정보 Modal Start */}
            <Modal
                open={eduDayViewModalOpen}
                closable={false}
                width={1250}
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
                <StudySchDetail EduDayView={eduDayViewTitle} />
            </Modal>
            {/* 학습일자 상세정보 Modal End */}

            {/* 교육생 상세정보 Modal Start */}
            <Modal
                open={studentViewModalOpen}
                // onOk={StudentView_handleOk}
                closable={false}
                width={700}
                style={{
                    left: 130,
                    zIndex: 999
                }}
                footer={[
                    <Button
                        type="primary"
                        onClick={StudentView_handleCancel}
                        style={{
                            width: '100px',
                            borderRadius: '5px',
                            boxShadow: '2px 3px 0px 0px #dbdbdb'
                        }}
                    >
                        Close
                    </Button>
                ]}
            >
                <StudentDetail ProcCdValue={procCdValue} />
            </Modal>
            {/* 교육생 상세정보 Modal End */}
        </>
    );
};
