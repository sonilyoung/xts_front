/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
    Col,
    Row,
    Button,
    Form,
    Input,
    Table,
    Drawer,
    Switch,
    DatePicker,
    Space,
    Tooltip,
    Tag,
    Modal,
    Divider,
    Descriptions,
    Skeleton
} from 'antd';
import { Typography } from '@mui/material';
import {
    useGetUserBaselineListMutation,
    useGetUserBaselineSubListMutation,
    useGetUserBaselineSubDetailMutation,
    useGetUserBaselineSubDetailListMutation
} from '../../../hooks/api/StudentsManagement/StudentsManagement';

import { PlusOutlined, EditFilled, DeleteFilled, EyeOutlined, ExclamationCircleFilled } from '@ant-design/icons';
const { confirm } = Modal;

// project import
import MainCard from 'components/MainCard';
import { InputNumber } from '../../../../node_modules/antd/lib/index';

export const Baseline = () => {
    const { confirm } = Modal;
    const [form] = Form.useForm();

    const [getUserBaselineList] = useGetUserBaselineListMutation();
    const [getUserBaselineSubList] = useGetUserBaselineSubListMutation();
    const [getUserBaselineSubDetail] = useGetUserBaselineSubDetailMutation();
    const [getUserBaselineSubDetailList] = useGetUserBaselineSubDetailListMutation();

    const [userBaselineList, setUserBaselineList] = useState();
    const [userBaselineSubList, setUserBaselineSubList] = useState();
    const [userBaselineSubDetail, setUserBaselineSubDetail] = useState();
    const [userBaselineSubDetailList, setUserBaselineSubDetailList] = useState();

    const [dataSource, setDataSource] = useState([]);
    const [dataSourceSub, setDataSourceSub] = useState([]);
    // const [dataSourceSubDetail, setDataSourceSubDetail] = useState([]);
    const [dataSourceSubDetailList, setDataSourceSubDetailList] = useState([]);

    const [userBaselineSubList_Cho, setUserBaselineSubList_Cho] = useState();

    const [dataSourceStudent, setDataSourceStudent] = useState([]);

    const [loading, setLoading] = useState(false);
    const [loadingSub, setLoadingSub] = useState(false);
    const [loadingStudent, setLoadingStudent] = useState(false);

    const [selectedRowKeys, setSelectedRowKeys] = useState([]); //셀렉트 박스 option Selected 값
    const [selectedRowKeysSub, setSelectedRowKeysSub] = useState([]); //셀렉트 박스 option Selected 값
    const [selectedRowKeysStudent, setSelectedRowKeysStudent] = useState([]); //셀렉트 박스 option Selected 값

    const [open, setOpen] = useState(false);
    const [openSub, setOpenSub] = useState(false);
    const [dataEdit, setDataEdit] = useState(false); // Drawer 상단 수정 우측폼 상태
    const [dataEditSub, setDataEditSub] = useState(false); // Drawer 하단단 수정 우측폼 상태

    const [procCdData, setProcCdData] = useState();
    const [procYearData, setProcYearData] = useState();
    const [procSeqData, setProcSeqData] = useState();

    const [userModalOpen, setUserModalOpen] = useState(false); //교육생정보 Modal
    const [classModalOpen, setClassModalOpen] = useState(false); //평가과목 Modal
    const [studentModalOpen, setStudentModalOpen] = useState(false); //교육생 검색 Modal

    // 차수관리 조회
    const handleUserBaselineList = async () => {
        const userBaselineListresponse = await getUserBaselineList({
            searchType: '1',
            procGroupCd: ''
        });
        setUserBaselineList(userBaselineListresponse?.data?.RET_DATA);
        setDataSource([
            ...userBaselineListresponse?.data?.RET_DATA.map((d, i) => ({
                key: d.procCd,
                rowdata0: i + 1,
                rowdata1: d.procCd /*과장코드*/,
                rowdata2: d.procYear /* 과정년도 */,
                rowdata3: d.procSeq /* 과정차수 */,
                rowdata4: d.procNm /* 과정명 */,
                rowdata5: d.eduDate /* 학습기간 */,
                rowdata6: d.trainees /* 교육인원 */,
                rowdata7: d.endingProcessEndYn /* 수료처리완료여부 */
            }))
        ]);
        setLoading(false);
    };

    // 차수관리 상세정보
    const handleUserBaselineSubList = async (procCd, procYear, procSeq) => {
        setProcCdData(procCd);
        setProcYearData(procYear);
        setProcSeqData(procSeq);
        const userBaselineSubListresponse = await getUserBaselineSubList({
            procCd: procCd,
            procYear: procYear,
            procSeq: procSeq
        });
        setUserBaselineSubList(userBaselineSubListresponse?.data?.RET_DATA);
        setDataSourceSub([
            ...userBaselineSubListresponse?.data?.RET_DATA.map((s, i) => ({
                key: s.userId,
                rowdata0: i + 1,
                rowdata1: s.procCd /* 과정코드 */,
                rowdata2: s.userId /* 사용자id */,
                rowdata3: s.userNm /* 사용자명 */,
                rowdata4: s.goinStatusCd /* 입교상태코드 */,
                rowdata5: s.goinStatus /* 입교상태 */,
                rowdata6: s.procYear /* 교육년도 */,
                rowdata7: s.procSeq /* 교육차수 */
            }))
        ]);
        setLoadingSub(false);
    };

    // 차수관리 교육생정보
    const handleUserBaselineSubDetail = async (procCd, userId) => {
        const userBaselineSubDetailresponse = await getUserBaselineSubDetail({
            procCd: procCd,
            procYear: procYearData,
            procSeq: procSeqData,
            userId: userId
        });
        setUserBaselineSubDetail(userBaselineSubDetailresponse?.data?.RET_DATA);
    };

    // 차수관리 평가과목정보
    const handleUserBaselineSubDetailList = async (procCd, userId) => {
        const userBaselineSubDetailListresponse = await getUserBaselineSubDetailList({
            procCd: procCd,
            procYear: procYearData,
            procSeq: procSeqData,
            userId: userId
        });
        setUserBaselineSubDetailList(userBaselineSubDetailListresponse?.data?.RET_DATA);
        setDataSourceSubDetailList([
            ...userBaselineSubDetailListresponse?.data?.RET_DATA.map((ds, i) => ({
                key: ds.userId,
                rowdata0: i + 1,
                rowdata1: ds.procCd /* 과정코드 */,
                rowdata2: ds.procYear /*교육년도*/,
                rowdata3: ds.procSeq /*교육차수*/,
                rowdata4: ds.userId /*사용자ID*/,
                rowdata5: ds.evaluationSubjectCd /*평가과목코드*/,
                rowdata6: ds.evaluationSubjectName /*평가과목*/,
                rowdata7: ds.realScore /*실기점수*/,
                rowdata8: ds.totScore /*취득점수*/,
                rowdata9: ds.patternPassYn /*합격여부*/,
                rowdata10: ds.endTest /*평가완료여부*/
            }))
        ]);
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
            width: '100px',
            title: '교육년도',
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
            title: '과정명-차수',
            key: 'tags',
            dataIndex: 'rowdata4',
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
            title: '학습기간',
            key: 'tags',
            dataIndex: 'rowdata5',
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
            title: '교육인원',
            key: 'tags',
            dataIndex: 'rowdata6',
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
            width: '110px',
            title: '교육상태',
            dataIndex: 'rowdata7',
            align: 'center',
            render: (_, { rowdata1, rowdata7 }) => (
                <>
                    <Tag color={rowdata7 === '진행중' ? 'green' : 'volcano'} key={rowdata1}>
                        {rowdata7}
                    </Tag>
                </>
            )
        },
        {
            width: '120px',
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

    const defaultColumnsSub = [
        {
            width: '60px',
            title: 'No',
            dataIndex: 'rowdata0',
            align: 'center'
        },
        {
            title: '교육생ID',
            dataIndex: 'rowdata2',
            align: 'center'
        },
        {
            title: '교육생명',
            dataIndex: 'rowdata3',
            align: 'center'
        },
        {
            title: '입교상태',
            dataIndex: 'rowdata5',
            align: 'center',
            render: (_, { rowdata4, rowdata5 }) => (
                <>
                    <Tag color={rowdata4 === '1' ? 'green' : 'volcano'} key={rowdata4} onClick={(e) => handelUser()}>
                        {rowdata5}
                    </Tag>
                </>
            )
        },
        {
            width: '180px',
            title: '교육생정보',
            dataIndex: '',
            align: 'center',
            key: 'rowdata1',
            render: (record) => (
                <Space wrap>
                    <Button
                        type="primary"
                        onClick={() => User_Detail(record.rowdata1, record.rowdata2)}
                        style={{ width: '100px', borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                        icon={<EyeOutlined />}
                    >
                        교육생정보
                    </Button>
                </Space>
            )
        },
        {
            width: '180px',
            title: '평가과목',
            dataIndex: '',
            align: 'center',
            key: 'rowdata1',
            render: (record) => (
                <Space wrap>
                    <Button
                        type="primary"
                        onClick={() => Class_Detail(record.rowdata1, record.rowdata2)}
                        style={{ width: '100px', borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                        icon={<EyeOutlined />}
                    >
                        평가과목
                    </Button>
                </Space>
            )
        },
        {
            width: '120px',
            title: '수정',
            render: (_, { key }) => (
                <>
                    <Tooltip title="수정" color="#108ee9">
                        <Button
                            type="primary"
                            onClick={() => handleEditSub(key)}
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

    const defaultColumnsStudent = [
        {
            width: '60px',
            title: 'No',
            dataIndex: 'rowdata0',
            align: 'center'
        },
        {
            title: '교육생ID',
            dataIndex: 'rowdata2',
            align: 'center'
        }
    ];

    const defaultColumnsSubDetail = [
        {
            width: '60px',
            title: 'No',
            dataIndex: 'rowdata0',
            align: 'center'
        },
        {
            title: '평가과목',
            dataIndex: 'rowdata6',
            align: 'center'
        },
        {
            title: '실기점수',
            dataIndex: 'rowdata7',
            align: 'center'
        },
        {
            title: '취득점수',
            dataIndex: 'rowdata8',
            align: 'center'
        },
        {
            title: '합격여부',
            dataIndex: 'rowdata9',
            align: 'center'
        },
        {
            title: '평가완료여부',
            dataIndex: 'rowdata10',
            align: 'center'
        }
    ];

    // 교육생정보 Modal
    const User_Detail = (procCd, userId) => {
        setUserModalOpen(true);
        handleUserBaselineSubDetail(procCd, userId);
    };

    const User_handleOk = () => {
        setUserModalOpen(false);
    };

    const User_handleCancel = () => {
        setUserModalOpen(false);
    };

    // 평가과목 Modal
    const Class_Detail = (procCd, userId) => {
        setClassModalOpen(true);
        handleUserBaselineSubDetailList(procCd, userId);
    };

    const Class_handleOk = () => {
        setClassModalOpen(false);
    };

    const Class_handleCancel = () => {
        setClassModalOpen(false);
    };

    // 교육생 검색 Modal
    const Student_Modal = () => {
        setStudentModalOpen(true);
    };

    const Student_handleOk = () => {
        setStudentModalOpen(false);
    };

    const Student_handleCancel = () => {
        setStudentModalOpen(false);
    };

    // 상단 Start
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
    // 상단 End

    // 하단 Start
    const handleSaveSub = (row) => {
        const newData = [...dataSourceSub];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row
        });
        setDataSourceSub(newData);
    };

    const componentsSub = {
        body: {
            row: EditableRow,
            cell: EditableCell
        }
    };

    const columnsSub = defaultColumnsSub.map((col) => {
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
                handleSaveSub
            })
        };
    });
    // 하단 End

    // 평가과목 Start
    const handleSaveSubDetail = (row) => {
        const newData = [...dataSourceSubDetail];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row
        });
        setDataSourceSubDetailList(newData);
    };

    const componentsSubDetail = {
        body: {
            row: EditableRow,
            cell: EditableCell
        }
    };

    const columnsSubDetail = defaultColumnsSubDetail.map((col) => {
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
                handleSaveSubDetail
            })
        };
    });
    // 평가과목 End

    // 교육생 검색 Start
    const handleSaveStudent = (row) => {
        const newData = [...dataSourceStudent];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row
        });
        // setDataSourceStudent(newData);
    };

    const componentsStudent = {
        body: {
            row: EditableRow,
            cell: EditableCell
        }
    };

    const columnsStudent = defaultColumnsStudent.map((col) => {
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
                handleSaveStudent
            })
        };
    });
    // 교육생 검색 End

    //체크 박스 이벤트
    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    //체크 박스 이벤트
    const onSelectChangeSub = (newSelectedRowKeysSub) => {
        console.log('selectedRowKeysSub changed: ', newSelectedRowKeysSub);
        setSelectedRowKeysSub(newSelectedRowKeysSub);
    };

    //체크 박스 이벤트
    const onSelectChangeStudent = (newSelectedRowKeysSub) => {
        console.log('selectedRowKeysSub changed: ', newSelectedRowKeysSub);
        setSelectedRowKeysSub(newSelectedRowKeysSub);
    };

    //체크 박스 선택
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange
    };

    //체크 박스 선택
    const rowSelectionSub = {
        selectedRowKeysSub,
        onChange: onSelectChangeSub
    };

    //체크 박스 선택
    const rowSelectionStudent = {
        selectedRowKeysStudent,
        onChange: onSelectChangeStudent
    };

    // 상단 추가 버튼
    const handleAdd = () => {
        setOpen(true);
        setDataEdit(false);
    };

    // 상단 추가 취소
    const onAddClose = () => {
        setOpen(false);
        setDataEdit(false);
        form.resetFields();
    };

    // 상단 추가 및 수정 처리
    const baselineSubmit = () => {
        // console.log(xrayEduModuleNmVal, xrayEduModuleDcVal);
        if (dataEdit === true) {
            Modal.success({
                content: '수정 완료',
                onOk() {
                    setOpen(false);
                    setDataEdit(false);
                    handleUserBaselineList();
                    form.resetFields();
                }
            });
        } else {
            Modal.success({
                content: '추가 완료',
                onOk() {
                    setOpen(false);
                    setDataEdit(false);
                    handleUserBaselineList();
                    form.resetFields();
                }
            });
        }
    };

    // 상단 수정 버튼
    const handleEdit = (EditKey) => {
        console.log(EditKey);
        setDataEdit(true);
        setOpen(true);
    };

    // 상단 삭제
    const handleDel = () => {
        if (selectedRowKeys == '') {
            Modal.error({
                content: '삭제할 항목을 선택해주세요.'
            });
        } else {
            confirm({
                title: '선택한 차수를 삭제하시겠습니까?',
                icon: <ExclamationCircleFilled />,
                content: selectedRowKeys + ' 의 하위 항목 모두 삭제됨.',
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

    // 하단 추가
    const handleAddSub = () => {
        setDataEditSub(false);
        setOpenSub(true);
    };

    // 하단 추가 취소
    const onAddCloseSub = () => {
        setOpenSub(false);
        setDataEditSub(false);
        form.resetFields();
    };

    // 하단 추가 및 수정 처리
    const baselineSubmitSub = () => {
        // console.log(xrayEduModuleNmVal, xrayEduModuleDcVal);
        if (dataEdit === true) {
            Modal.success({
                content: '수정 완료',
                onOk() {
                    setOpenSub(false);
                    setDataEditSub(false);
                    handleUserBaselineSubList(procCdData, procYearData, procSeqData);
                    form.resetFields();
                }
            });
        } else {
            Modal.success({
                content: '추가 완료',
                onOk() {
                    setOpenSub(false);
                    setDataEditSub(false);
                    handleUserBaselineSubList(procCdData, procYearData, procSeqData);
                    form.resetFields();
                }
            });
        }
    };

    // 하단 수정 버튼
    const handleEditSub = (EditKey) => {
        console.log(EditKey);
        setDataEditSub(true);
        setOpenSub(true);
    };

    // 하단 삭제
    const handleDelSub = () => {
        if (selectedRowKeysSub == '') {
            Modal.error({
                content: '삭제할 항목을 선택해주세요.'
            });
        } else {
            confirm({
                title: '선택한 항목을 삭제하시겠습니까?',
                icon: <ExclamationCircleFilled />,
                content: selectedRowKeysSub + ' 항목의 데이터 삭제.',
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
        handleUserBaselineList();
    }, []);

    return (
        <>
            <MainCard title="교육생 차수관리">
                <Typography variant="body1">
                    <Row style={{ marginBottom: 20 }}>
                        <Col span={16} offset={8} style={{ textAlign: 'right' }}>
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
                        pagination={true}
                        rowSelection={rowSelection}
                        onRow={(record) => {
                            return {
                                onDoubleClick: () => {
                                    if (record.rowdata1 !== userBaselineSubList_Cho) {
                                        setLoadingSub(true);
                                        setUserBaselineSubList_Cho(record.rowdata1);
                                        handleUserBaselineSubList(record.rowdata1, record.rowdata2, record.rowdata3);
                                    }
                                }
                            };
                        }}
                    />
                    <Skeleton loading={loading} active>
                        <Row style={{ marginBottom: 20, marginTop: 30 }}>
                            <Col span={16} offset={8} style={{ textAlign: 'right' }}>
                                <Space>
                                    <Tooltip title="추가">
                                        <Button
                                            onClick={handleAddSub}
                                            style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                            icon={<PlusOutlined />}
                                        >
                                            추가
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title="삭제">
                                        <Button
                                            type="danger"
                                            onClick={handleDelSub}
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
                            components={componentsSub}
                            rowClassName={() => 'editable-row'}
                            bordered={true}
                            dataSource={dataSourceSub}
                            loading={loadingSub}
                            columns={columnsSub}
                            pagination={false}
                            rowSelection={rowSelectionSub}
                        />
                    </Skeleton>
                </Typography>
            </MainCard>

            {/* 모달 창 Start */}
            {/* 하단 교육생정보 */}
            <Modal
                open={userModalOpen}
                onOk={User_handleOk}
                onCancel={User_handleCancel}
                width={700}
                style={{
                    left: 130
                }}
                footer={[
                    <Button
                        type="primary"
                        onClick={User_handleCancel}
                        style={{ width: '100px', borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                    >
                        Close
                    </Button>
                ]}
            >
                <Descriptions title="교육생 정보" bordered style={{ marginTop: 30 }}>
                    <Descriptions.Item label="교육년도" style={{ width: '150px' }}>
                        {userBaselineSubDetail?.procYear === null || userBaselineSubDetail?.procYear === ''
                            ? '-'
                            : `${userBaselineSubDetail?.procYear}년`}
                    </Descriptions.Item>
                    <Descriptions.Item label="이수학점" style={{ width: '150px' }}>
                        {userBaselineSubDetail?.procGainGrade === null || userBaselineSubDetail?.procGainGrade === ''
                            ? '-'
                            : userBaselineSubDetail?.procGainGrade}
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions bordered style={{ marginTop: '-1px' }}>
                    <Descriptions.Item label="교육과정 / 차수" span={3} style={{ width: '150px' }}>
                        {userBaselineSubDetail?.procNm === null || userBaselineSubDetail?.procNm === ''
                            ? '-'
                            : userBaselineSubDetail?.procNm}
                        {` / `}
                        {userBaselineSubDetail?.procSeq === null || userBaselineSubDetail?.procSeq === ''
                            ? '-'
                            : `${userBaselineSubDetail?.procSeq}차`}
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions bordered style={{ marginTop: '-1px' }}>
                    <Descriptions.Item label="학습기간" span={3} style={{ width: '150px' }}>
                        {userBaselineSubDetail?.startDate === null || userBaselineSubDetail?.startDate === ''
                            ? '-'
                            : userBaselineSubDetail?.startDate}
                        {` ~ `}
                        {userBaselineSubDetail?.endDate === null || userBaselineSubDetail?.endDate === ''
                            ? '-'
                            : userBaselineSubDetail?.endDate}
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions bordered style={{ marginTop: '-1px' }}>
                    <Descriptions.Item label="기관" style={{ width: '150px' }}>
                        {userBaselineSubDetail?.company === null || userBaselineSubDetail?.company === ''
                            ? '-'
                            : userBaselineSubDetail?.company}
                    </Descriptions.Item>
                    <Descriptions.Item label="부서" style={{ width: '150px' }}>
                        {userBaselineSubDetail?.dept === null || userBaselineSubDetail?.dept === '' ? '-' : userBaselineSubDetail?.dept}
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions bordered style={{ marginTop: '-1px' }}>
                    <Descriptions.Item label="입교상태" style={{ width: '150px' }}>
                        {userBaselineSubDetail?.goinStatus === null || userBaselineSubDetail?.goinStatus === ''
                            ? '-'
                            : userBaselineSubDetail?.goinStatus}
                    </Descriptions.Item>
                    <Descriptions.Item label="출석율" style={{ width: '150px' }}>
                        {userBaselineSubDetail?.attendPercent === null || userBaselineSubDetail?.attendPercent === ''
                            ? '0'
                            : `${userBaselineSubDetail?.attendPercent}%`}
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions bordered style={{ marginTop: '-1px' }}>
                    <Descriptions.Item label="미입교사유" span={3} style={{ width: '150px' }}>
                        {userBaselineSubDetail?.unGoinReasonCd === null || userBaselineSubDetail?.unGoinReasonCd === ''
                            ? ''
                            : `[${userBaselineSubDetail?.unGoinReasonCd}]`}
                        {userBaselineSubDetail?.unGoinReason === null || userBaselineSubDetail?.unGoinReason === ''
                            ? '-'
                            : userBaselineSubDetail?.unGoinReason}
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions bordered style={{ marginTop: '-1px' }}>
                    <Descriptions.Item label="취득점수" style={{ width: '150px' }}>
                        {userBaselineSubDetail?.gainScore === null || userBaselineSubDetail?.gainScore === ''
                            ? '0'
                            : userBaselineSubDetail?.gainScore}
                    </Descriptions.Item>
                    <Descriptions.Item label="석차" style={{ width: '150px' }}>
                        {userBaselineSubDetail?.xtsRank === null || userBaselineSubDetail?.xtsRank === ''
                            ? '0'
                            : userBaselineSubDetail?.xtsRank}
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions bordered style={{ marginTop: '-1px' }}>
                    <Descriptions.Item label="수료여부" style={{ width: '150px' }}>
                        {userBaselineSubDetail?.endingYn === null || userBaselineSubDetail?.endingYn === '' ? (
                            '-'
                        ) : userBaselineSubDetail?.endingYn === 'Y' ? (
                            <span>수료</span>
                        ) : (
                            <span>미수료</span>
                        )}
                    </Descriptions.Item>
                    <Descriptions.Item label="합격여부" style={{ width: '150px' }}>
                        {userBaselineSubDetail?.passYn === null || userBaselineSubDetail?.passYn === '' ? (
                            '-'
                        ) : userBaselineSubDetail?.passYn === 'Y' ? (
                            <span>합격</span>
                        ) : (
                            <span>불합격</span>
                        )}
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions bordered style={{ marginTop: '-1px' }}>
                    <Descriptions.Item label="미수료사유" span={3} style={{ width: '150px' }}>
                        {userBaselineSubDetail?.unEndingReasonCd === null || userBaselineSubDetail?.unEndingReasonCd === ''
                            ? ''
                            : `[${userBaselineSubDetail?.unEndingReasonCd}] `}
                        {userBaselineSubDetail?.unEndingReasonNm === null || userBaselineSubDetail?.unEndingReasonNm === ''
                            ? '-'
                            : userBaselineSubDetail?.unEndingReasonNm}
                    </Descriptions.Item>
                </Descriptions>
            </Modal>

            {/* 하단 평가과목 */}
            <Modal
                open={classModalOpen}
                onOk={Class_handleOk}
                onCancel={Class_handleCancel}
                width={1000}
                style={{
                    left: 130
                }}
                footer={[
                    <Button
                        type="primary"
                        onClick={Class_handleCancel}
                        style={{ width: '100px', borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                    >
                        Close
                    </Button>
                ]}
            >
                <MainCard title="평가과목" style={{ marginTop: 30 }}>
                    <Typography variant="body1">
                        <Table
                            components={componentsSubDetail}
                            rowClassName={() => 'editable-row'}
                            bordered={true}
                            dataSource={dataSourceSubDetailList}
                            loading={loadingSub}
                            columns={columnsSubDetail}
                            pagination={false}
                            rowSelection={rowSelectionSub}
                        />
                    </Typography>
                </MainCard>
            </Modal>

            {/* 교육생 검색 */}
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
                <MainCard title="교육생 검색" style={{ marginTop: 30 }}>
                    <Typography variant="body1">
                        <Table
                            components={componentsStudent}
                            rowClassName={() => 'editable-row'}
                            bordered={true}
                            dataSource={dataSourceStudent}
                            loading={loadingStudent}
                            columns={columnsStudent}
                            pagination={false}
                            rowSelection={rowSelectionStudent}
                        />
                    </Typography>
                </MainCard>
            </Modal>
            {/* 모달 창 End */}

            {/* 추가 폼 (상단) Start */}
            <Drawer
                maskClosable={false}
                title="교육생 차수관리"
                onClose={onAddClose}
                open={open}
                width={650}
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
                                <Tooltip title="수정" placement="bottom">
                                    <Button
                                        onClick={baselineSubmit}
                                        style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                        type="primary"
                                    >
                                        수정
                                    </Button>
                                </Tooltip>
                            ) : (
                                <Tooltip title="추가" placement="bottom">
                                    <Button
                                        onClick={baselineSubmit}
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
                                    name="procYear"
                                    defaultValue={procYearVal}
                                    onChange={(e) => setProcYearVal(e.target.value)}
                                    label="교육년도"
                                    rules={[
                                        {
                                            required: true,
                                            message: '교육년도'
                                        }
                                    ]}
                                >
                                    <Input placeholder="교육년도" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="procNm"
                                    defaultValue={procNmVal}
                                    onChange={(e) => setProcNmVal(e.target.value)}
                                    label="과정명"
                                    rules={[
                                        {
                                            required: true,
                                            message: '과정명'
                                        }
                                    ]}
                                >
                                    <Input
                                        style={{
                                            width: '100%'
                                        }}
                                        placeholder="과정명"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="procNm"
                                    defaultValue={procNmVal}
                                    onChange={(e) => setProcNmVal(e.target.value)}
                                    label="차수"
                                    rules={[
                                        {
                                            required: true,
                                            message: '차수(숫자)'
                                        }
                                    ]}
                                >
                                    <InputNumber
                                        style={{
                                            width: '100%'
                                        }}
                                        addonAfter="차수"
                                        placeholder="차수(숫자)"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="eduDate"
                                    label="학습기간"
                                    rules={[
                                        {
                                            required: true,
                                            message: '학습기간 선택'
                                        }
                                    ]}
                                >
                                    <DatePicker.RangePicker
                                        style={{
                                            width: '100%'
                                        }}
                                        getPopupContainer={(trigger) => trigger.parentElement}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="trainees"
                                    label="교육인원"
                                    rules={[
                                        {
                                            required: true,
                                            message: '교육인원(숫자)'
                                        }
                                    ]}
                                >
                                    <InputNumber
                                        style={{
                                            width: '100%'
                                        }}
                                        placeholder="교육인원(숫자)"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item name="endingProcessEndYn" label="교육상태">
                                    <Switch checkedChildren="완료" unCheckedChildren="미완료" defaultChecked style={{ width: '100px' }} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </MainCard>
            </Drawer>
            {/* 추가 폼 (상단) End */}

            {/* 추가 폼 (하단) Start */}
            <Drawer
                maskClosable={false}
                title="교육생 차수관리"
                onClose={onAddCloseSub}
                open={openSub}
                width={400}
                style={{ top: '60px', zIndex: 99 }}
                extra={
                    <>
                        <Space>
                            <Tooltip title="취소" placement="bottom">
                                <Button onClick={onAddCloseSub} style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}>
                                    취소
                                </Button>
                            </Tooltip>
                            {dataEdit === true ? (
                                <Tooltip title="수정" placement="bottom">
                                    <Button
                                        onClick={baselineSubmitSub}
                                        style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                        type="primary"
                                    >
                                        수정
                                    </Button>
                                </Tooltip>
                            ) : (
                                <Tooltip title="추가" placement="bottom">
                                    <Button
                                        onClick={baselineSubmitSub}
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
                <Button
                    style={{ marginBottom: '30px', width: '100%', height: '40px', borderRadius: '5px' }}
                    type="primary"
                    onClick={Student_Modal}
                >
                    교육생 검색
                </Button>

                <MainCard>
                    <Form autoComplete="off" layout="vertical" form={form}>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="userId"
                                    label="교육생ID"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter  Name'
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
                                    name="userNm"
                                    label="교육생명"
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
                                <Form.Item name="goinStatus" label="입교상태">
                                    <Switch checkedChildren="입교" unCheckedChildren="미입교" defaultChecked style={{ width: '80px' }} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </MainCard>
            </Drawer>
            {/* 추가 폼 (하단) End */}
        </>
    );
};
// export default Baseline;
