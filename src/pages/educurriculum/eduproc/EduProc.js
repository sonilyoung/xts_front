/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Typography } from '@mui/material';
import { Col, Row, Button, Form, Input, Table, Space, Tooltip, Tag, Modal, Badge, Descriptions } from 'antd';
import { useGetEduProcListMutation, useGetEduProcDetailMutation } from '../../../hooks/api/EduManagement/EduManagement';
import { EditFilled, DeleteFilled, EyeOutlined, ExclamationCircleFilled } from '@ant-design/icons';

// project import
import MainCard from 'components/MainCard';

export const EduProc = () => {
    const { confirm } = Modal;
    const [getEduProcList] = useGetEduProcListMutation(); // 교육과정 등록 hooks api호출
    const [getEduProcDetail] = useGetEduProcDetailMutation(); // 교육과정 상세정보 hooks api호출
    const [eduProcList, setEduProcList] = useState(); // 교육과정 등록 리스트 상단 값
    const [eduProcDetailList, setEduProcDetailList] = useState(); // 교육과정 상세정보 리스트 하단 값
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); //셀렉트 박스 option Selected 값
    const [dataSource, setDataSource] = useState([]); // 상단 Table 데이터 값
    const [detailTitle, setDetailTitle] = useState([]); // Detail 데이터 값
    const [detailScore, setDetailScore] = useState([]); // Detail 데이터 값
    const [detailPercent, setDetailPercent] = useState([]); // Detail 데이터 값
    const [bagScanId, setBagScanId] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 데이터 값 선언
    const handleEduProc = async () => {
        const EduProcresponse = await getEduProcList({});
        setEduProcList(EduProcresponse?.data?.RET_DATA);
        //console.log(EduProcresponse?.data?.RET_DATA);
        setDataSource([
            ...EduProcresponse?.data?.RET_DATA.map((d, i) => ({
                key: d.procCd,
                rowdata0: i + 1,
                rowdata1: d.procCd /* 과정코드 */,
                rowdata2: d.procNm /* 과정명 */,
                rowdata3: d.procGroupDtlGroup /* 과정분류 */,
                rowdata4: d.procGroupDtlGroupNm /* 과정분류상세분류명 */,
                rowdata5: d.largeGroupCd /* 대분류코드 */,
                rowdata6: d.largeGroupCdNm /* 대분류코드명 */,
                rowdata7: d.middleGroupCd /* 중분류코드 */,
                rowdata8: d.middleGroupCdNm /* 중분류코드명 */,
                rowdata9: d.smallGroupCd /* 소분류코드 */,
                rowdata10: d.smallGroupCdNm /* 소분류코드명 */,
                rowdata11: d.totStudyDate /* 총학습일자(교육일수) */,
                rowdata12: d.totStudyTime /* 총학습시간(교육시간) */,
                rowdata13: d.limitPersonCnt /* 한계인원수(정원) */,
                rowdata14: d.grade /* 학점 */,
                rowdata15: d.score100 /* 점수100 */,
                rowdata16: d.endingStdScore /* 수료기준점수 */,
                rowdata17: d.endingStdAttendPercent /* 수료기준출석율 */,
                rowdata18: d.procIntroTarget /* 과정소개목적 */,
                rowdata19: d.procDcContent /* 과정설명내용 */,
                rowdata20: d.useYn /* xbt사용여부 */
            }))
        ]);
        setLoading(false);
    };

    // 데이터 값 선언
    const handleEduProcDetail = async (Cho_procCd) => {
        const EduProcresponse = await getEduProcDetail({
            procCd: Cho_procCd
        });
        setEduProcDetailList(EduProcresponse?.data?.RET_DATA);
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
            align: 'center'
        },
        {
            title: '과정코드',
            dataIndex: 'rowdata1',
            align: 'center'
        },
        {
            title: '과정명',
            dataIndex: 'rowdata2',
            align: 'center'
        },
        {
            title: '과정분류',
            dataIndex: 'rowdata3',
            align: 'center'
        },
        {
            title: '상세분류',
            dataIndex: 'rowdata4',
            align: 'center'
        },
        {
            title: '교육시간',
            dataIndex: 'rowdata12',
            align: 'center'
        },
        {
            title: '학점',
            dataIndex: 'rowdata14',
            align: 'center'
        },
        {
            title: '교육일수',
            dataIndex: 'rowdata11',
            align: 'center'
        },
        {
            title: '정원',
            dataIndex: 'rowdata13',
            align: 'center'
        },
        {
            title: '상세정보',
            dataIndex: '',
            align: 'center',
            key: 'rowdata1',
            render: (record) => (
                <Space wrap>
                    <Button
                        type="primary"
                        key={record.rowdata1}
                        onClick={() => Detail_Show(record.rowdata1, record.rowdata2, record.rowdata16, record.rowdata17)}
                        style={{ width: '100px', borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                        icon={<EyeOutlined />}
                    >
                        Detail
                    </Button>
                </Space>
            )
        }
    ];

    const Detail_Show = (e, n, s, p) => {
        setIsModalOpen(true);
        setDetailTitle(n);
        setDetailScore(s);
        setDetailPercent(p);
        handleEduProcDetail(e);
        console.log('상세정보 procCd : ', e);
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

    // 수정
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

    // 삭제
    const handleDel = () => {
        if (selectedRowKeys == '') {
            Modal.error({
                content: '삭제할 항목을 선택해주세요.'
            });
        } else {
            confirm({
                title: '선택한 과정 항목을 삭제하시겠습니까?',
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
        setLoading(true); // 로딩 호출
        handleEduProc(); // api 호출
    }, []);

    return (
        <>
            <MainCard title="과정 등록">
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
                        // rowClassName={(record) => {
                        //     return record.rowdata0 === bagScanId ? `table-row-lightblue` : '';
                        // }}
                        onRow={(record) => {
                            return {
                                onClick: () => {
                                    if (record.rowdata0 !== bagScanId) {
                                        setLoadingDetail(true);
                                        setBagScanId(record.rowdata0);
                                    }
                                }
                            };
                        }}
                    />
                </Typography>
            </MainCard>

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
                    <Descriptions.Item label="과정명" span={3} style={{ width: '250px' }}>
                        {detailTitle}
                    </Descriptions.Item>
                    <Descriptions.Item label="과정분류" span={3} style={{ width: '250px' }}>
                        {detailTitle}
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions bordered style={{ marginTop: '8px' }}>
                    <Descriptions.Item label="교육시간" style={{ width: '250px' }}>
                        {eduProcDetailList?.totStudyTime === null || eduProcDetailList?.totStudyTime === ''
                            ? '-'
                            : eduProcDetailList?.totStudyTime}
                    </Descriptions.Item>
                    <Descriptions.Item label="교육일수" style={{ width: '250px' }}>
                        {eduProcDetailList?.totStudyDate === null || eduProcDetailList?.totStudyDate === ''
                            ? '-'
                            : eduProcDetailList?.totStudyDate}
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions bordered style={{ marginTop: '-1px' }}>
                    <Descriptions.Item label="정원" style={{ width: '250px' }}>
                        {eduProcDetailList?.limitPersonCnt === null || eduProcDetailList?.limitPersonCnt === ''
                            ? '0'
                            : eduProcDetailList?.limitPersonCnt}
                    </Descriptions.Item>
                    <Descriptions.Item label="학점" style={{ width: '250px' }}>
                        {eduProcDetailList?.grade === null || eduProcDetailList?.grade === '' ? '0' : eduProcDetailList?.grade}
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions bordered style={{ marginTop: '-1px' }}>
                    <Descriptions.Item label="수료기준(점)" style={{ width: '250px' }}>
                        {detailScore === null || detailScore === '' ? '0' : detailScore}
                    </Descriptions.Item>
                    <Descriptions.Item label="출석기준(%)" style={{ width: '250px' }}>
                        {detailPercent === null || detailPercent === '' ? '0' : detailPercent}
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions bordered style={{ marginTop: '8px' }}>
                    <Descriptions.Item label="교육타입" style={{ width: '250px' }}>
                        {eduProcDetailList?.eduType === null || eduProcDetailList?.eduType === '' ? '-' : eduProcDetailList?.eduType}
                    </Descriptions.Item>
                    <Descriptions.Item label="X-ray 판독 평가방식" style={{ width: '250px' }}>
                        {eduProcDetailList?.xrayLastTestType === null || eduProcDetailList?.xrayLastTestType === ''
                            ? '-'
                            : eduProcDetailList?.xrayLastTestType}
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions bordered style={{ marginTop: '-1px' }}>
                    <Descriptions.Item label="X-ray 판독 연습단계" style={{ width: '250px' }}>
                        {eduProcDetailList?.xrayStrStage === null || eduProcDetailList?.xrayStrStage === ''
                            ? '-'
                            : `${eduProcDetailList?.xrayStrStage}단계`}
                        ~
                        {eduProcDetailList?.xrayEndStage === null || eduProcDetailList?.xrayEndStage === ''
                            ? '-'
                            : `${eduProcDetailList?.xrayEndStage}단계`}
                    </Descriptions.Item>
                    <Descriptions.Item label="Body 판독 연습단계" style={{ width: '250px' }}>
                        {eduProcDetailList?.bodyStrStage === null || eduProcDetailList?.bodyStrStage === ''
                            ? '-'
                            : `${eduProcDetailList?.bodyStrStage}단계`}
                        ~
                        {eduProcDetailList?.bodyEndStage === null || eduProcDetailList?.bodyEndStage === ''
                            ? '-'
                            : `${eduProcDetailList?.bodyEndStage}단계`}
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions bordered style={{ marginTop: '-1px' }}>
                    <Descriptions.Item label="X-ray 판독 평가횟수" style={{ width: '250px' }}>
                        {eduProcDetailList?.decipLastTestEffectCnt === null || eduProcDetailList?.decipLastTestEffectCnt === ''
                            ? '-'
                            : eduProcDetailList?.decipLastTestEffectCnt}
                    </Descriptions.Item>
                    <Descriptions.Item label="이론평가횟수" style={{ width: '250px' }}>
                        {eduProcDetailList?.theoryLastTestEffectCnt === null || eduProcDetailList?.theoryLastTestEffectCnt === ''
                            ? '-'
                            : eduProcDetailList?.theoryLastTestEffectCnt}
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions bordered style={{ marginTop: '8px' }}>
                    <Descriptions.Item label="금지물품 통과시 불합격 처리 여부" style={{ width: '250px' }}>
                        {eduProcDetailList?.banPassFailProcess === null || eduProcDetailList?.banPassFailProcess === ''
                            ? '-'
                            : eduProcDetailList?.banPassFailProcess}
                    </Descriptions.Item>
                    <Descriptions.Item label="X-ray 판독 연습 반복 여부" style={{ width: '250px' }}>
                        {eduProcDetailList?.repeatedStudyingYn === null || eduProcDetailList?.repeatedStudyingYn === ''
                            ? '-'
                            : eduProcDetailList?.repeatedStudyingYn}
                    </Descriptions.Item>
                </Descriptions>
            </Modal>
        </>
    );
};
// export default EduProc;
