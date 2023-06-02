/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Typography } from '@mui/material';
import { Col, Row, Button, Form, Input, Table, Space, Tooltip, Tag, Skeleton, Modal, Drawer, Divider, Radio, Select } from 'antd';

// Xray배점관리 조회, Xray배점관리 등록, Xray배점관리 상세, Xray배점관리 수정, Xray배점관리 삭제
import {
    useSelectPointStdListMutation, // 조회 (상단)
    useInsertPointStdMutation, // 등록 (상단)
    useSelectPointStdMutation, // 상세 (상단)
    useUpdatePointStdMutation, // 수정 (상단)
    useDeletePointStdMutation, // 삭제 (상단)
    useSelectPointStdDetailListMutation, // 조회 (상단)
    useInsertPointStdDetailMutation, // 등록 (상단)
    useSelectPointStdDetailMutation, // 상세 (상단)
    useUpdatePointStdDetailMutation, // 수정 (상단)
    useDeletePointStdDetailMutation // 삭제 (상단)
} from '../../../hooks/api/CurriculumManagement/CurriculumManagement';

import { PlusOutlined, EditFilled, DeleteFilled, ExclamationCircleFilled } from '@ant-design/icons';

// project import
import MainCard from 'components/MainCard';

export const XrayPoint = () => {
    const { confirm } = Modal;
    const [form] = Form.useForm();

    const [itemContainer, setItemContainer] = useState({}); // 항목 컨테이너 (상단)
    const [loading, setLoading] = useState(false); // 로딩바 (상단)
    const [dataEdit, setDataEdit] = useState(false); // Drawer 수정 우측폼 상태 (상단)

    const [itemContainerSub, setItemContainerSub] = useState({}); // 항목 컨테이너 (하단)
    const [loadingSub, setLoadingSub] = useState(false); // 로딩바 (하단)
    const [dataEditSub, setDataEditSub] = useState(false); // Drawer 수정 우측폼 상태 (하단)

    // ===============================
    // Api 호출 Start
    // (상단) 조회 ======================================================
    const [SelectPointStdListApi] = useSelectPointStdListMutation(); // 콘텐츠 정보 관리 hooks api호출
    const [selectPointStdListData, setSelectPointStdListData] = useState(); // 콘텐츠 정보관리 리스트 상단 값
    const [dataSource, setDataSource] = useState([]); // 상단 Table 데이터 값
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); //셀렉트 박스 option Selected 값(상단)
    const [pointsStdNo, setPointsStdNo] = useState();
    const [open, setOpen] = useState(false);

    const handle_SelectPointStdList_Api = async () => {
        const SelectPointStdListresponse = await SelectPointStdListApi({});
        setSelectPointStdListData(SelectPointStdListresponse?.data?.RET_DATA);
        setDataSource([
            ...SelectPointStdListresponse?.data?.RET_DATA.map((d, i) => ({
                key: d.pointsStdNo,
                rowdata0: i + 1,
                rowdata1: d.pointsDetailNo, //
                rowdata2: d.pointsStdNm,
                rowdata3: d.pointsStdDc,
                rowdata4: d.useYn,
                rowdata5: d.pointsStdId,
                rowdata6: d.actionDiv,
                rowdata7: d.actionDivName,
                rowdata8: d.banUnitScore,
                rowdata9: d.limitUnitScore,
                rowdata10: d.questionUnitScore,
                rowdata11: d.passUnitScore,
                rowdata12: d.insertDate,
                rowdata13: d.insertId,
                rowdata14: d.updateDate,
                rowdata15: d.updateId
            }))
        ]);
        setLoading(false);
    };

    // (상단)등록 ======================================================
    const [InsertPointStdApi] = useInsertPointStdMutation(); // 등록 hooks api호출
    const handel_InsertPointStd_Api = async () => {
        const InsertPointStdresponse = await InsertPointStdApi({
            pointsStdNm: itemContainer.pointsStdNm,
            pointsStdDc: itemContainer.pointsStdDc,
            useYn: itemContainer.useYn
        });

        InsertPointStdresponse?.data?.RET_CODE === '0100'
            ? Modal.success({
                  content: '등록 완료',
                  onOk() {
                      setOpen(false);
                      setDataEdit(false);
                      form.resetFields();
                      handle_SelectPointStdList_Api();
                  }
              })
            : Modal.success({
                  content: '등록 오류',
                  onOk() {}
              });
    };

    // (상단)상세정보 ======================================================
    const [SelectPointStdApi] = useSelectPointStdMutation(); // 상세 hooks api호출
    const handel_SelectPointStd_Api = async (pointsStdNo) => {
        const SelectPointStdresponse = await SelectPointStdApi({
            pointsStdNo: pointsStdNo
        });
        setItemContainer(SelectPointStdresponse.data.RET_DATA);
    };

    // (상단)수정 ======================================================
    const [UpdatePointStdApi] = useUpdatePointStdMutation(); // 수정 hooks api호출
    const handel_UpdatePoint_Api = async (pointsStdNo) => {
        const UpdatePointresponse = await UpdatePointStdApi({
            pointsStdNo: pointsStdNo,
            pointsStdNm: itemContainer.pointsStdNm,
            pointsStdDc: itemContainer.pointsStdDc,
            useYn: itemContainer.useYn
        });

        UpdatePointresponse?.data?.RET_CODE === '0100'
            ? Modal.success({
                  content: '수정 완료',
                  onOk() {
                      setOpen(false);
                      setDataEdit(false);
                      form.resetFields();
                      handle_SelectPointStdList_Api();
                  }
              })
            : Modal.success({
                  content: '수정 오류',
                  onOk() {}
              });
    };

    // (상단)삭제 ======================================================
    const [DeletePointStdApi] = useDeletePointStdMutation(); // 삭제 hooks api호출
    const handel_DeletePointStd_Api = async (pointsStdNo) => {
        const DeletePointStdresponse = await DeletePointStdApi({
            pointsStdNo: pointsStdNo
        });
        DeletePointStdresponse?.data?.RET_CODE === '0300'
            ? Modal.success({
                  content: '삭제 완료',
                  onOk() {
                      handle_SelectPointStdList_Api();
                  }
              })
            : Modal.success({
                  content: '삭제 오류',
                  onOk() {}
              });
    };

    // 상단 테이블 Title
    const defaultColumns = [
        {
            width: '80px',
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
            title: '배점기준명칭',
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
            title: '배점기준설명',
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
            title: '사용여부',
            dataIndex: 'rowdata4',
            align: 'center',
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
            )
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

    // (하단)조회 ======================================================
    const [SelectPointStdDetailListApi] = useSelectPointStdDetailListMutation(); // 콘텐츠 정보 관리 hooks api호출
    const [selectPointStdDetailListData, setSelectPointStdDetailListData] = useState(); // 콘텐츠 정보관리 리스트 상단 값
    const [dataSourceSub, setDataSourceSub] = useState([]); // 하단 Table 데이터 값
    const [selectedRowKeysSub, setSelectedRowKeysSub] = useState([]); //셀렉트 박스 option Selected 값(하단)
    const [pointsDetailNo, setPointsDetailNo] = useState();
    const [openSub, setOpenSub] = useState(false);

    const handle_SelectPointStdDetailList_Api = async (pointsStdNo) => {
        const SelectPointStdDetailListresponse = await SelectPointStdDetailListApi({
            pointsStdNo: pointsStdNo
        });
        setSelectPointStdDetailListData(SelectPointStdDetailListresponse?.data?.RET_DATA);
        setDataSourceSub([
            ...SelectPointStdDetailListresponse?.data?.RET_DATA.map((d, i) => ({
                keySub: d.pointsStdNo,
                rowdata0: i + 1,
                rowdata1: d.pointsDetailNo, //
                rowdata2: d.pointsStdNm,
                rowdata3: d.pointsStdDc,
                rowdata4: d.useYn,
                rowdata5: d.pointsStdId,
                rowdata6: d.actionDiv,
                rowdata7: d.actionDivName,
                rowdata8: d.banUnitScore,
                rowdata9: d.limitUnitScore,
                rowdata10: d.questionUnitScore,
                rowdata11: d.passUnitScore,
                rowdata12: d.insertDate,
                rowdata13: d.insertId,
                rowdata14: d.updateDate,
                rowdata15: d.updateId
            }))
        ]);
        setLoadingSub(false);
    };

    // (하단)등록 ======================================================
    const [InsertPointStdDetailApi] = useInsertPointStdDetailMutation(); // 등록 hooks api호출
    const handel_InsertPointStdDetail_Api = async () => {
        const InsertPointStdDetailresponse = await InsertPointStdDetailApi({
            pointsStdNm: itemContainer.pointsStdNm,
            pointsStdDc: itemContainer.pointsStdDc,
            useYn: itemContainer.useYn
        });

        InsertPointStdDetailresponse?.data?.RET_CODE === '0100'
            ? Modal.success({
                  content: '등록 완료',
                  onOk() {
                      setOpen(false);
                      setDataEdit(false);
                      form.resetFields();
                      handle_SelectPointStdDetailList_Api();
                  }
              })
            : Modal.success({
                  content: '등록 오류',
                  onOk() {}
              });
    };

    // (하단)상세 ======================================================
    const [SelectPointStdDetailApi] = useSelectPointStdDetailMutation(); // 상세 hooks api호출
    const handel_SelectPointStdDetail_Api = async (pointsDetailNo) => {
        const SelectPointStdDetailresponse = await SelectPointStdDetailApi({
            pointsDetailNo: pointsDetailNo
        });
        setItemContainerSub(SelectPointStdDetailresponse.data.RET_DATA);
    };

    // (하단)수정 ======================================================
    const [UpdatePointStdDetailApi] = useUpdatePointStdDetailMutation(); // 수정 hooks api호출
    const handel_UpdatePointStdDetail_Api = async (pointsStdNo) => {
        const UpdatePointStdDetailresponse = await UpdatePointStdDetailApi({
            pointsStdNo: pointsStdNo,
            pointsStdNm: itemContainer.pointsStdNm,
            pointsStdDc: itemContainer.pointsStdDc,
            useYn: itemContainer.useYn
        });

        UpdatePointStdDetailresponse?.data?.RET_CODE === '0100'
            ? Modal.success({
                  content: '수정 완료',
                  onOk() {
                      setOpen(false);
                      setDataEdit(false);
                      form.resetFields();
                      handle_SelectPointStdDetailList_Api();
                  }
              })
            : Modal.success({
                  content: '수정 오류',
                  onOk() {}
              });
    };

    // (하단)삭제 ======================================================
    const [DeletePointStdDetailApi] = useDeletePointStdDetailMutation(); // 삭제 hooks api호출
    const handel_DeletePointStdDetail_Api = async (pointsStdNo) => {
        const DeletePointStdDetailresponse = await DeletePointStdDetailApi({
            pointsStdNo: pointsStdNo
        });
        DeletePointStdDetailresponse?.data?.RET_CODE === '0300'
            ? Modal.success({
                  content: '삭제 완료',
                  onOk() {
                      handle_SelectPointStdDetailList_Api();
                  }
              })
            : Modal.success({
                  content: '삭제 오류',
                  onOk() {}
              });
    };

    // 하단 테이블 title
    const defaultColumnsSub = [
        {
            width: '80px',
            title: 'No',
            dataIndex: 'rowdata0',
            align: 'center'
        },
        {
            title: 'Action구분',
            dataIndex: 'rowdata7',
            align: 'center'
        },
        {
            title: '금지물품점수',
            dataIndex: 'rowdata8',
            align: 'center'
        },
        {
            title: '제한물품점수',
            dataIndex: 'rowdata9',
            align: 'center'
        },
        {
            title: '의심물품점수',
            dataIndex: 'rowdata10',
            align: 'center'
        },
        {
            title: '통과물품점수',
            dataIndex: 'rowdata11',
            align: 'center'
        },
        {
            title: '수정',
            render: (_, { rowdata1 }) => (
                <>
                    <Tooltip title="수정" color="#108ee9">
                        <Button
                            type="primary"
                            onClick={() => handleEditSub(rowdata1)}
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
    // Api 호출 End
    // ===============================

    // 상단 이벤트 Start =========================================
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

    //체크 박스 이벤트(상단)
    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    //체크 박스 선택 (상단)
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange
    };

    // 추가 버튼 (상단)
    const handleAdd = () => {
        setItemContainer(null);
        form.resetFields();
        setDataEdit(false);
        setOpen(true);
    };

    // 추가 취소 (상단)
    const onAddClose = () => {
        setItemContainer(null);
        form.resetFields();
        setOpen(false);
        setDataEdit(false);
    };

    // 수정 버튼 (상단)
    const handleEdit = (pointsStdNo) => {
        handel_SelectPointStd_Api(pointsStdNo);
        setPointsStdNo(pointsStdNo);
        form.resetFields();
        setDataEdit(true);
        setOpen(true);
    };

    // 추가 및 수정 처리 (상단)
    const onAddSubmit = () => {
        if (dataEdit === true) {
            // 수정
            handel_UpdatePoint_Api(pointsStdNo);
        } else {
            // 등록
            handel_InsertPointStd_Api();
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
                title: '선택한 항목을 삭제하시겠습니까?',
                icon: <ExclamationCircleFilled />,
                // content: selectedRowKeys + ' 번째 항목의 데이터',
                okText: '예',
                okType: 'danger',
                cancelText: '아니오',
                onOk() {
                    handel_DeletePointStd_Api(selectedRowKeys);
                },
                onCancel() {}
            });
        }
    };
    // 상단 End =========================================

    // 하단 Start =========================================
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

    const columnsSub = defaultColumnsSub.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSaveSub
            })
        };
    });

    //체크 박스 이벤트(하단)
    const onSelectChangeSub = (newSelectedRowKeysSub) => {
        console.log('selectedRowKeysSub changed: ', newSelectedRowKeysSub);
        setSelectedRowKeysSub(newSelectedRowKeysSub);
    };

    //체크 박스 선택 (하단)
    const rowSelectionSub = {
        selectedRowKeysSub,
        onChange: onSelectChangeSub
    };

    // 추가 버튼 (하단)
    const handleAddSub = () => {
        setItemContainerSub(null);
        form.resetFields();
        setDataEditSub(false);
        setOpenSub(true);
    };

    // 추가 취소 (하단)
    const onAddCloseSub = () => {
        setItemContainerSub(null);
        form.resetFields();
        setDataEditSub(false);
        setOpenSub(false);
    };

    // 수정 버튼 (하단)
    const handleEditSub = (pointsDetailNo) => {
        handel_SelectPointStdDetail_Api(pointsDetailNo);
        setPointsDetailNo(pointsDetailNo);
        form.resetFields();
        setDataEditSub(true);
        setOpenSub(true);
    };

    // 추가 및 수정 처리 (하단)
    const onAddSubmitSub = () => {
        if (dataEdit === true) {
            handel_UpdatePointStdDetail_Api(pointsStdNoSub);
        } else {
            handel_InsertPointStdDetail_Api();
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
                title: '선택한 항목을 삭제하시겠습니까?',
                icon: <ExclamationCircleFilled />,
                // content: selectedRowKeys + ' 번째 항목의 데이터',
                okText: '예',
                okType: 'danger',
                cancelText: '아니오',
                onOk() {
                    handel_DeletePointStdDetail_Api(selectedRowKeysSub);
                },
                onCancel() {}
            });
        }
    };

    useEffect(() => {
        setLoading(true); // 로딩 호출
        handle_SelectPointStdList_Api(); // api 호출
    }, []);

    return (
        <>
            <MainCard title="X-ray 판독 배점관리">
                <Typography variant="body1">
                    <Row gutter={24}>
                        <Col span={12}>
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
                                size="small"
                                bordered={true}
                                dataSource={dataSource}
                                loading={loading}
                                columns={columns}
                                rowSelection={rowSelection}
                                rowClassName={(record) => {
                                    return record.rowdata0 === pointsStdNo ? `table-row-lightblue` : '';
                                }}
                                onRow={(record) => {
                                    return {
                                        onDoubleClick: () => {
                                            if (record.rowdata0 !== pointsStdNo) {
                                                setLoadingSub(true);
                                                setPointsStdNo(record.rowdata0);
                                                handle_SelectPointStdDetailList_Api(record.rowdata0);
                                            }
                                        }
                                    };
                                }}
                            />
                        </Col>
                        <Col span={12}>
                            {/* 하단 상세 영역 */}
                            <Skeleton loading={loadingSub} active>
                                <Row style={{ marginBottom: 16 }}>
                                    <Col span={8}></Col>
                                    <Col span={8} offset={8} style={{ textAlign: 'right' }}>
                                        <Space>
                                            <Tooltip title="추가">
                                                <Button
                                                    type="success"
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
                                    size="small"
                                    rowClassName={() => 'editable-row'}
                                    bordered={true}
                                    dataSource={dataSourceSub}
                                    columns={columnsSub}
                                    loading={loadingSub}
                                    rowSelection={rowSelectionSub}
                                    pagination={false}
                                />
                            </Skeleton>
                        </Col>
                    </Row>
                </Typography>
            </MainCard>

            {/* 상단 추가 폼 Start */}
            <Drawer
                maskClosable={false}
                title={`X-ray 판독 배점 ${dataEdit === true ? '수정' : '추가'}`}
                onClose={onAddClose}
                open={open}
                width={500}
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
                                <Form.Item label="배점기준명칭" initialValue={itemContainer?.pointsStdNm}>
                                    <Input
                                        name="pointsStdNm"
                                        onChange={(e) => setItemContainer({ ...itemContainer, pointsStdNm: e.target.value })}
                                        placeholder="# 배점기준명칭"
                                        value={itemContainer?.pointsStdNm}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item label="배점기준설명" initialValue={itemContainer?.pointsStdDc}>
                                    <Input
                                        name="pointsStdDc"
                                        placeholder="# 배점기준설명"
                                        onChange={(e) => setItemContainer({ ...itemContainer, pointsStdDc: e.target.value })}
                                        value={itemContainer?.pointsStdDc}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />
                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item label="사용여부" initialValue={itemContainer?.useYn}>
                                    <Radio.Group
                                        name="useYn"
                                        onChange={(e) => setItemContainer({ ...itemContainer, useYn: e.target.value })}
                                        buttonStyle="solid"
                                        value={itemContainer?.useYn}
                                    >
                                        <Radio.Button value="Y">
                                            <span style={{ padding: '0 10px' }}>사용</span>
                                        </Radio.Button>
                                        <span style={{ padding: '0 10px' }}></span>
                                        <Radio.Button value="N">
                                            <span style={{ padding: '0 10px' }}>미사용</span>
                                        </Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </MainCard>
            </Drawer>
            {/* 상단 추가 폼 End */}

            {/* 하단 추가 폼 Start */}
            <Drawer
                maskClosable={false}
                title={`X-ray 판독 배점 ${dataEdit === true ? '수정' : '추가'}`}
                onClose={onAddCloseSub}
                open={openSub}
                width={500}
                style={{ top: '60px' }}
                extra={
                    <>
                        <Space>
                            <Tooltip title="취소" placement="bottom">
                                <Button onClick={onAddCloseSub} style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}>
                                    취소
                                </Button>
                            </Tooltip>
                            {dataEdit === true ? (
                                <Tooltip title="수정" placement="bottom" color="#108ee9">
                                    <Button
                                        onClick={onAddSubmitSub}
                                        style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                        type="primary"
                                    >
                                        수정
                                    </Button>
                                </Tooltip>
                            ) : (
                                <Tooltip title="추가" placement="bottom" color="#108ee9">
                                    <Button
                                        onClick={onAddSubmitSub}
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
                                <Form.Item label="Action" initialValue={itemContainerSub?.Action}>
                                    <Select
                                        name="Action"
                                        defaultValue={{
                                            value: '',
                                            label: '# Action구분'
                                        }}
                                        style={{
                                            width: '100%'
                                        }}
                                        value={itemContainerSub?.Action}
                                        onChange={(e) => setItemContainerSub({ ...itemContainerSub, Action: e })}
                                        options={[
                                            {
                                                value: '0',
                                                label: '개봉/금지'
                                            },
                                            {
                                                value: '1',
                                                label: '미개봉/금지'
                                            },
                                            {
                                                value: '2',
                                                label: '개봉/제한'
                                            },
                                            {
                                                value: '3',
                                                label: '개봉/통과'
                                            },
                                            {
                                                value: '4',
                                                label: '미개봉/통과'
                                            }
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item label="금지물품점수" initialValue={itemContainerSub?.banUnitScore}>
                                    <Input
                                        name="banUnitScore"
                                        placeholder="# 금지물품점수"
                                        onChange={(e) => setItemContainerSub({ ...itemContainerSub, banUnitScore: e.target.value })}
                                        value={itemContainerSub?.banUnitScore}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="제한물품점수" initialValue={itemContainerSub?.limitUnitScore}>
                                    <Input
                                        name="limitUnitScore"
                                        placeholder="# 제한물품점수"
                                        onChange={(e) => setItemContainerSub({ ...itemContainerSub, limitUnitScore: e.target.value })}
                                        value={itemContainerSub?.limitUnitScore}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item label="의심물품점수" initialValue={itemContainerSub?.questionUnitScore}>
                                    <Input
                                        name="questionUnitScore"
                                        placeholder="# 의심물품점수"
                                        onChange={(e) => setItemContainerSub({ ...itemContainerSub, questionUnitScore: e.target.value })}
                                        value={itemContainerSub?.questionUnitScore}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="통과물품점수" initialValue={itemContainerSub?.passUnitScore}>
                                    <Input
                                        name="passUnitScore"
                                        placeholder="# 통과물품점수"
                                        onChange={(e) => setItemContainerSub({ ...itemContainerSub, passUnitScore: e.target.value })}
                                        value={itemContainerSub?.passUnitScore}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </MainCard>
            </Drawer>
            {/* 하단 추가 폼 End */}
        </>
    );
};
// export default XrayPoint;
