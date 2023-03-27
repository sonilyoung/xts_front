/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Typography } from '@mui/material';
import { Col, Row, Button, Form, Input, Table, Space, Tooltip, Tag, Modal, Skeleton, Descriptions } from 'antd';
import {
    useGetEduBaselineListMutation,
    useGetEduBaselineDetailMutation,
    useGetEduBaselineSubListMutation
} from '../../../hooks/api/EduManagement/EduManagement';
import { EditFilled, DeleteFilled, EyeOutlined, ExclamationCircleFilled } from '@ant-design/icons';

const { confirm } = Modal;

// project import
import MainCard from 'components/MainCard';

export const EduBaseLine = () => {
    const [getEduBaselineList] = useGetEduBaselineListMutation(); // 차수등록 상단 리스트 hooks api호출
    const [getEduBaselineDetail] = useGetEduBaselineDetailMutation(); // 차수등록 중간 상세정보 hooks api호출
    const [getEduBaselineSubList] = useGetEduBaselineSubListMutation(); // 차수등록 하단 리스트 hooks api호출
    const [eduBaseLineList, setEduBaseLineList] = useState(); // 차수등록 상단 리스트 값
    const [eduBaseLineDetail, setEduBaseLineDetail] = useState(); // 차수등록 중간 상세정보 값
    const [eduBaseLineSubList, setEduBaseLineSubList] = useState(); // 차수등록 하단 리스트 값
    const [dataSource, setDataSource] = useState([]); // 상단 Table 데이터 값
    const [dataSourceSub, setDataSourceSub] = useState([]); // 하단 Table 데이터 값

    const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 셀렉트(체크) 박스 option Selected 값 (상단)
    const [selectedRowKeysSub, setSelectedRowKeysSub] = useState([]); // 셀렉트(체크) 박스 option Selected 값 (하단)

    const [loading, setLoading] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [loadingSub, setLoadingSub] = useState(false);

    const [detailTitle, setDetailTitle] = useState([]); // Detail 데이터 값
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal창
    const [procCd, setProcCd] = useState();
    const [procYear, setProcYear] = useState();
    const [procSeq, setProcSeq] = useState();

    // 데이터 값 선언 (상단)
    const handleEduBaseLine = async () => {
        const eduBaseLineresponse = await getEduBaselineList({});
        setEduBaseLineList(eduBaseLineresponse?.data?.RET_DATA);
        setDataSource([
            ...eduBaseLineresponse?.data?.RET_DATA.map((d, i) => ({
                key: d.procCd,
                rowdata0: i + 1,
                rowdata1: d.procCd /* 과정코드 */,
                rowdata2: d.procYear /* 과정년도 */,
                rowdata3: d.procNm /* 과정명 */,
                rowdata4: d.procSeq /* 차수 */,
                rowdata5: d.eduDate /* 학습기간 */,
                rowdata6: d.timeGrade /* 시간/학점 */,
                rowdata7: d.totStudyTime /* 교육기간 */,
                rowdata8: d.limitPersonCnt /* 한계인원수 */,
                rowdata9: d.endingProcessEndStatus /* 수료처리완료여부 */
            }))
        ]);
        setLoading(false);
    };

    // 데이터 값 선언 (Detail)
    const handleEduBaseLineDetail = async (procCd) => {
        const eduBaseLineDetailresponse = await getEduBaselineDetail({
            procCd: 1
        });
        setEduBaseLineDetail(eduBaseLineDetailresponse?.data?.RET_DATA);
        setLoadingDetail(false);
    };

    // 데이터 값 선언 (하단)
    const handleEduBaseLineSub = async (procCd, procYear, procSeq) => {
        console.log(procCd, procYear, procSeq);
        const eduBaseLineresponseSub = await getEduBaselineSubList({
            procCd: procCd,
            procYear: procYear,
            procSeq: procSeq
        });
        setEduBaseLineSubList(eduBaseLineresponseSub?.data?.RET_DATA);
        setDataSourceSub([
            ...eduBaseLineresponseSub?.data?.RET_DATA.map((s, i) => ({
                key: s.procCd,
                rowdata0: i + 1,
                rowdata1: s.procCd /* 키값 */,
                rowdata2: s.procYear /* 과정년도 */,
                rowdata3: s.procSeq /* 과정차수 */,
                rowdata4: s.pattern,
                rowdata5: s.procNm /* xbt과정 */,
                rowdata6: s.realTestUseYn /* 실기평가설정 */,
                rowdata7: s.evaluationSubjectCd /* 평가과목코드 */,
                rowdata8: s.evaluationSubjectNm /* 평가과목 */,
                rowdata9: s.realPresco /* 실기만점 */,
                rowdata10: s.patternPlusScore /* 가중치 */,
                rowdata11: s.patternFallScore /* 과락점수 */,
                rowdata12: s.patternWbtProcDiv
            }))
        ]);
        setLoadingSub(false);
    };

    const EditableContext = React.createContext(null);
    const EditableRow = ({ ...props }) => {
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

    // 상단 테이블 Title
    const defaultColumns = [
        {
            width: '90px',
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
            width: '80px',
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
            title: '과정명 - 차수',
            dataIndex: 'rowdata3',
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
            width: '80px',
            title: '시간/학점',
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
            width: '80px',
            title: '교육기간',
            dataIndex: 'rowdata7',
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
            width: '80px',
            title: '교육인원',
            dataIndex: 'rowdata8',
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
            width: '90px',
            title: '교육상태',
            dataIndex: 'rowdata9',
            align: 'center',
            render: (_, { rowdata1, rowdata9 }) => (
                <>
                    <Tag color={rowdata9 === '진행중' ? 'green' : 'volcano'} key={rowdata1} onClick={() => handelUser(rowdata9)}>
                        {rowdata9}
                    </Tag>
                </>
            )
        },
        {
            width: '150px',
            title: '상세정보',
            dataIndex: '',
            align: 'center',
            key: 'rowdata1',
            render: (record) => (
                <Space wrap>
                    <Button
                        type="primary"
                        key={record.rowdata1}
                        onClick={() => Detail_Show(record.rowdata1, record.rowdata3)}
                        style={{ width: '100px', borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                        icon={<EyeOutlined />}
                    >
                        Detail
                    </Button>
                </Space>
            )
        }
    ];

    // 하단 테이블 title
    const defaultColumnsSub = [
        {
            width: '90px',
            title: 'No',
            dataIndex: 'rowdata0',
            align: 'center'
        },
        {
            title: '평가과목',
            dataIndex: 'rowdata8',
            align: 'center'
        },
        {
            title: '실기평가설정',
            dataIndex: 'rowdata6',
            align: 'center'
        },
        {
            width: '100px',
            title: '실기만점',
            dataIndex: 'rowdata9',
            align: 'center'
        },
        {
            width: '100px',
            title: '가중치',
            dataIndex: 'rowdata10',
            align: 'center'
        },
        {
            width: '100px',
            title: '과락점수',
            dataIndex: 'rowdata11',
            align: 'center'
        },
        {
            title: 'XBT과정',
            dataIndex: 'rowdata5',
            align: 'center'
        }
    ];

    const handelUser = (value) => {
        console.log(`selected ${value}`);
    };

    // 상세정보
    const Detail_Show = (procCd, title) => {
        setIsModalOpen(true);
        setLoadingDetail(true);
        setDetailTitle(title);
        handleEduBaseLineDetail(procCd);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

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

    // 타이틀 컬럼  = 데이터 컬럼 Index세팅
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

    //체크 박스 선택 (상단)
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange
    };

    //체크 박스 선택 (하단)
    const rowSelectionSub = {
        selectedRowKeysSub,
        onChange: onSelectChangeSub
    };

    // 수정 (상단)
    const handleEdit = () => {
        if (selectedRowKeys == '') {
            Modal.error({
                content: '수정할 항목을 선택해주세요.'
            });
        } else {
            Modal.success({
                content: '수정완료'
            });
        }
    };

    // 삭제 (상단)
    const handleDel = () => {
        if (selectedRowKeys == '') {
            Modal.error({
                content: '삭제할 항목을 선택해주세요.'
            });
        } else {
            confirm({
                title: '선택한 차수를 삭제하시겠습니까?',
                icon: <ExclamationCircleFilled />,
                content: selectedRowKeys + ' 차수의 데이터',
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

    // 수정 (하단)
    const handleEditSub = () => {
        if (selectedRowKeysSub == '') {
            Modal.error({
                content: '수정할 항목을 선택해주세요.'
            });
        } else {
            Modal.success({
                content: '수정완료'
            });
        }
    };

    // 삭제 (하단)
    const handleDelSub = () => {
        if (selectedRowKeysSub == '') {
            Modal.error({
                content: '삭제할 항목을 선택해주세요.'
            });
        } else {
            confirm({
                title: '선택한 평가과목을 삭제하시겠습니까?',
                icon: <ExclamationCircleFilled />,
                content: selectedRowKeysSub + ' 평가과목의 데이터',
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
        setLoading(true); // 로딩 호출
        handleEduBaseLine(); // api 호출
    }, []);

    return (
        <>
            <MainCard title="차수 등록">
                <Typography variant="body1">
                    <Row style={{ marginBottom: '5px' }}>
                        <Col span={8}></Col>
                        <Col span={8} offset={8} style={{ textAlign: 'right' }}>
                            <Space>
                                <Tooltip title="수정">
                                    <Button
                                        type="primary"
                                        onClick={handleEdit}
                                        style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                        icon={<EditFilled />}
                                    >
                                        수정
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
                        size="small"
                        components={components}
                        bordered={true}
                        dataSource={dataSource}
                        loading={loading}
                        columns={columns}
                        rowSelection={rowSelection}
                        rowClassName={(record) => {
                            return record.rowdata1 === procCd ? `table-row-lightblue` : '';
                        }}
                        onRow={(record) => {
                            return {
                                onDoubleClick: () => {
                                    if (record.rowdata1 !== procCd) {
                                        setLoadingSub(true);
                                        setProcCd(record.rowdata1);
                                        setProcYear(record.rowdata2);
                                        setProcSeq(record.rowdata4);
                                        handleEduBaseLineSub(record.rowdata1, record.rowdata2, record.rowdata4);
                                    }
                                }
                            };
                        }}
                        scroll={{
                            y: 350
                        }}
                    />
                    <Skeleton loading={loadingSub} active>
                        <Row style={{ marginTop: '20px', marginBottom: '5px' }}>
                            <Col span={8}></Col>
                            <Col span={8} offset={8} style={{ textAlign: 'right' }}>
                                <Space>
                                    <Tooltip title="수정">
                                        <Button
                                            type="primary"
                                            onClick={handleEditSub}
                                            style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                            icon={<EditFilled />}
                                        >
                                            수정
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
                            size="small"
                            components={components}
                            rowClassName={() => 'editable-row'}
                            bordered={true}
                            dataSource={dataSourceSub}
                            columns={columnsSub}
                            loading={loadingSub}
                            rowSelection={rowSelectionSub}
                            pagination={false}
                            scroll={{
                                y: 300
                            }}
                        />
                    </Skeleton>
                </Typography>
            </MainCard>

            {/* 모달 창 Start */}
            <Modal
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                width={1000}
                style={{
                    left: 130
                }}
                footer={[
                    <Button
                        type="primary"
                        onClick={handleCancel}
                        style={{ width: '100px', borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                    >
                        Close
                    </Button>
                ]}
            >
                <Descriptions title={detailTitle} bordered style={{ marginTop: 30 }}>
                    <Descriptions.Item label="교육년도" style={{ width: '150px' }}>
                        {eduBaseLineDetail?.procYear}
                    </Descriptions.Item>
                    <Descriptions.Item label="교육과정" style={{ width: '200px' }}>
                        {eduBaseLineDetail?.procNm}
                    </Descriptions.Item>
                    <Descriptions.Item label="교육차수" style={{ width: '150px' }}>
                        {eduBaseLineDetail?.procSeq}차
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions bordered style={{ marginTop: '-1px' }}>
                    <Descriptions.Item label="수강신청" style={{ width: '250px' }}>
                        {eduBaseLineDetail?.sugangReqStartDate === null || eduBaseLineDetail?.sugangReqStartDate === ''
                            ? '-'
                            : `${eduBaseLineDetail?.sugangReqStartDate}`}
                        ~
                        {eduBaseLineDetail?.sugangReqDeadlineDt === null || eduBaseLineDetail?.sugangReqDeadlineDt === ''
                            ? '-'
                            : `${eduBaseLineDetail?.sugangReqDeadlineDt}`}
                    </Descriptions.Item>
                    <Descriptions.Item label="학습기간" style={{ width: '250px' }}>
                        {eduBaseLineDetail?.eduStartDate === null || eduBaseLineDetail?.eduStartDate === ''
                            ? '-'
                            : `${eduBaseLineDetail?.eduStartDate}`}
                        ~
                        {eduBaseLineDetail?.eduEndDate === null || eduBaseLineDetail?.eduEndDate === ''
                            ? '-'
                            : `${eduBaseLineDetail?.eduEndDate}`}
                    </Descriptions.Item>
                </Descriptions>

                <Descriptions bordered style={{ marginTop: '8px' }}>
                    <Descriptions.Item label="교육시간" style={{ width: '250px' }}>
                        {eduBaseLineDetail?.totStudyTime === null || eduBaseLineDetail?.totStudyTime === ''
                            ? '-'
                            : eduBaseLineDetail?.totStudyTime}
                    </Descriptions.Item>
                    <Descriptions.Item label="교육일수" style={{ width: '250px' }}>
                        {eduBaseLineDetail?.totStudyDate === null || eduBaseLineDetail?.totStudyDate === ''
                            ? '-'
                            : eduBaseLineDetail?.totStudyDate}
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions bordered style={{ marginTop: '-1px' }}>
                    <Descriptions.Item label="교육인원" style={{ width: '250px' }}>
                        {eduBaseLineDetail?.limitPersonCnt === null || eduBaseLineDetail?.limitPersonCnt === ''
                            ? '0'
                            : eduBaseLineDetail?.limitPersonCnt}
                    </Descriptions.Item>
                    <Descriptions.Item label="학점" style={{ width: '250px' }}>
                        {eduBaseLineDetail?.procGainGrade === null || eduBaseLineDetail?.procGainGrade === ''
                            ? '0'
                            : eduBaseLineDetail?.procGainGrade}
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions bordered style={{ marginTop: '-1px' }}>
                    <Descriptions.Item label="수료기준(점)" style={{ width: '250px' }}>
                        {eduBaseLineDetail?.endingStdScore === null || eduBaseLineDetail?.endingStdScore === ''
                            ? '0'
                            : eduBaseLineDetail?.endingStdScore}
                    </Descriptions.Item>
                    <Descriptions.Item label="출석기준(%)" style={{ width: '250px' }}>
                        {eduBaseLineDetail?.endingStdAttendPercent === null || eduBaseLineDetail?.endingStdAttendPercent === ''
                            ? '0'
                            : eduBaseLineDetail?.endingStdAttendPercent}
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions bordered style={{ marginTop: '8px' }}>
                    <Descriptions.Item label="교육타입" style={{ width: '250px' }}>
                        {eduBaseLineDetail?.eduType === null || eduBaseLineDetail?.eduType === '' ? '-' : eduBaseLineDetail?.eduType}
                    </Descriptions.Item>
                    <Descriptions.Item label="X-ray 판독 평가방식" style={{ width: '250px' }}>
                        {eduBaseLineDetail?.xrayLastTestType === null || eduBaseLineDetail?.xrayLastTestType === ''
                            ? '-'
                            : eduBaseLineDetail?.xrayLastTestType}
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions bordered style={{ marginTop: '-1px' }}>
                    <Descriptions.Item label="X-ray 판독 연습단계" style={{ width: '250px' }}>
                        {eduBaseLineDetail?.xrayStrStage === null || eduBaseLineDetail?.xrayStrStage === ''
                            ? '-'
                            : `${eduBaseLineDetail?.xrayStrStage}단계`}
                        ~
                        {eduBaseLineDetail?.xrayEndStage === null || eduBaseLineDetail?.xrayEndStage === ''
                            ? '-'
                            : `${eduBaseLineDetail?.xrayEndStage}단계`}
                    </Descriptions.Item>
                    <Descriptions.Item label="Body 판독 연습단계" style={{ width: '250px' }}>
                        {eduBaseLineDetail?.bodyStrStage === null || eduBaseLineDetail?.bodyStrStage === ''
                            ? '-'
                            : `${eduBaseLineDetail?.bodyStrStage}단계`}
                        ~
                        {eduBaseLineDetail?.bodyEndStage === null || eduBaseLineDetail?.bodyEndStage === ''
                            ? '-'
                            : `${eduBaseLineDetail?.bodyEndStage}단계`}
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions bordered style={{ marginTop: '-1px' }}>
                    <Descriptions.Item label="X-ray 판독 평가횟수" style={{ width: '250px' }}>
                        {eduBaseLineDetail?.decipLastTestEffect === null || eduBaseLineDetail?.decipLastTestEffect === ''
                            ? '-'
                            : eduBaseLineDetail?.decipLastTestEffect}
                    </Descriptions.Item>
                    <Descriptions.Item label="이론평가횟수" style={{ width: '250px' }}>
                        {eduBaseLineDetail?.theoryLastTestEffect === null || eduBaseLineDetail?.theoryLastTestEffect === ''
                            ? '-'
                            : eduBaseLineDetail?.theoryLastTestEffect}
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions bordered style={{ marginTop: '8px' }}>
                    <Descriptions.Item label="금지물품 통과시 불합격 처리 여부" style={{ width: '250px' }}>
                        {eduBaseLineDetail?.banPassFailProcess === null || eduBaseLineDetail?.banPassFailProcess === ''
                            ? '-'
                            : eduBaseLineDetail?.banPassFailProcess}
                    </Descriptions.Item>
                    <Descriptions.Item label="X-ray 판독 연습 반복 여부" style={{ width: '250px' }}>
                        {eduBaseLineDetail?.repeatedStudyingYn === null || eduBaseLineDetail?.repeatedStudyingYn === ''
                            ? '-'
                            : eduBaseLineDetail?.repeatedStudyingYn}
                    </Descriptions.Item>
                </Descriptions>
            </Modal>
            {/* 모달 창 End */}
        </>
    );
};
// export default EduBaseLine;
