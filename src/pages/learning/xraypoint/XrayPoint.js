/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Typography } from '@mui/material';
import { Col, Row, Button, Form, Input, Table, Space, Tooltip, Tag, Skeleton, Modal, Drawer, Divider, Radio, Card } from 'antd';

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

    const [dataSource, setDataSource] = useState([]); // 상단 Table 데이터 값
    const [dataSourceSub, setDataSourceSub] = useState([]); // 하단 Table 데이터 값

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
            : Modal.error({
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
            : Modal.error({
                  content: '수정 오류',
                  onOk() {}
              });
    };

    // (상단)삭제 ======================================================
    const [DeletePointStdApi] = useDeletePointStdMutation(); // 삭제 hooks api호출
    const handel_DeletePointStd_Api = async (pointsStdNo) => {
        const DeletePointStdresponse = await DeletePointStdApi({
            pointsStdNoList: pointsStdNo
        });
        DeletePointStdresponse?.data?.RET_CODE === '0300'
            ? Modal.success({
                  content: '삭제 완료',
                  onOk() {
                      handle_SelectPointStdList_Api();
                  }
              })
            : Modal.error({
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
                    <div>{text}</div>
                </div>
            )
        },
        {
            title: '배점기준명칭',
            dataIndex: 'rowdata2',
            align: 'center',
            render: (text) => (
                <div style={{ cursor: 'pointer' }}>
                    <div>{text}</div>
                </div>
            )
        },
        {
            title: '배점기준설명',
            dataIndex: 'rowdata3',
            align: 'center',
            render: (text) => (
                <div style={{ cursor: 'pointer' }}>
                    <div>{text}</div>
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
    const [pointsDetailNo, setPointsDetailNo] = useState();
    const [openSub, setOpenSub] = useState(false);

    const handle_SelectPointStdDetailList_Api = async (pointsStdNo) => {
        const SelectPointStdDetailListresponse = await SelectPointStdDetailListApi({
            pointsStdNo: pointsStdNo
        });
        setDataSourceSub([
            ...SelectPointStdDetailListresponse?.data?.RET_DATA.map((d, i) => ({
                key: i,
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
                rowdata15: d.updateId,
                rowdata16: d.pointsStdNo
            }))
        ]);
        setLoadingSub(false);
    };

    // (하단)상세 ======================================================
    const [SelectPointStdDetailApi] = useSelectPointStdDetailMutation(); // 상세 hooks api호출
    const handel_SelectPointStdDetail_Api = async () => {
        const SelectPointStdDetailresponse = await SelectPointStdDetailApi({
            // pointsDetailNo: pointsDetailNo
            pointsStdNo: pointsStdNo
        });
        setItemContainerSub(SelectPointStdDetailresponse.data.RET_DATA);
    };

    // (하단)수정 ======================================================
    const [UpdatePointStdDetailApi] = useUpdatePointStdDetailMutation(); // 수정 hooks api호출
    const handel_UpdatePointStdDetail_Api = async (pointsStdNo) => {
        const UpdatePointStdDetailresponse = await UpdatePointStdDetailApi({
            updateList: [
                {
                    pointsDetailNo: itemContainerSub.actionDiv0.pointsDetailNo,
                    banUnitScore: itemContainerSub.actionDiv0.banUnitScore,
                    limitUnitScore: itemContainerSub.actionDiv0.limitUnitScore,
                    questionUnitScore: itemContainerSub.actionDiv0.questionUnitScore,
                    passUnitScore: itemContainerSub.actionDiv0.passUnitScore
                },
                {
                    pointsDetailNo: itemContainerSub.actionDiv1.pointsDetailNo,
                    banUnitScore: itemContainerSub.actionDiv1.banUnitScore,
                    limitUnitScore: itemContainerSub.actionDiv1.limitUnitScore,
                    questionUnitScore: itemContainerSub.actionDiv1.questionUnitScore,
                    passUnitScore: itemContainerSub.actionDiv1.passUnitScore
                },
                {
                    pointsDetailNo: itemContainerSub.actionDiv2.pointsDetailNo,
                    banUnitScore: itemContainerSub.actionDiv2.banUnitScore,
                    limitUnitScore: itemContainerSub.actionDiv2.limitUnitScore,
                    questionUnitScore: itemContainerSub.actionDiv2.questionUnitScore,
                    passUnitScore: itemContainerSub.actionDiv2.passUnitScore
                },
                {
                    pointsDetailNo: itemContainerSub.actionDiv3.pointsDetailNo,
                    banUnitScore: itemContainerSub.actionDiv3.banUnitScore,
                    limitUnitScore: itemContainerSub.actionDiv3.limitUnitScore,
                    questionUnitScore: itemContainerSub.actionDiv3.questionUnitScore,
                    passUnitScore: itemContainerSub.actionDiv3.passUnitScore
                },
                {
                    pointsDetailNo: itemContainerSub.actionDiv4.pointsDetailNo,
                    banUnitScore: itemContainerSub.actionDiv4.banUnitScore,
                    limitUnitScore: itemContainerSub.actionDiv4.limitUnitScore,
                    questionUnitScore: itemContainerSub.actionDiv4.questionUnitScore,
                    passUnitScore: itemContainerSub.actionDiv4.passUnitScore
                }
            ]
        });

        UpdatePointStdDetailresponse?.data?.RET_CODE === '0100'
            ? Modal.success({
                  content: '수정 완료',
                  onOk() {
                      handle_SelectPointStdDetailList_Api(pointsStdNo);
                      setItemContainerSub(null);
                      setOpenSub(false);
                      form.resetFields();
                  }
              })
            : Modal.error({
                  content: '수정 오류',
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
        }
    ];
    // Api 호출 End
    // ===============================

    const setRules = [
        {
            pattern: /^[0-9]*$/,
            message: '· 숫자만 입력.'
        },
        {
            required: true,
            max: 3
        },
        {
            validator: (_, value) => {
                if (Number(value) <= 100) {
                    return Promise.resolve();
                } else {
                    return Promise.reject('· 100 이하의 값만 입력.');
                }
            }
        }
    ];

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

    // 추가 취소 (하단)
    const onAddCloseSub = () => {
        setItemContainerSub(null);
        form.resetFields();
        setDataEditSub(false);
        setOpenSub(false);
    };

    // 수정 버튼 (하단)
    const handleEditSub = (pointsDetailNo) => {
        handel_SelectPointStdDetail_Api(pointsStdNo);
        setPointsDetailNo(pointsDetailNo);
        form.resetFields();
        setDataEditSub(true);
        setOpenSub(true);
    };

    // 추가 및 수정 처리 (하단)
    const onAddSubmitSub = () => {
        handel_UpdatePointStdDetail_Api(pointsStdNo);
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
                                    return record.key === pointsStdNo ? `table-row-lightblue` : '';
                                }}
                                onRow={(record) => {
                                    return {
                                        onClick: () => {
                                            if (record.key !== pointsStdNo) {
                                                setLoadingSub(true);
                                                setPointsStdNo(record.key);
                                                handle_SelectPointStdDetailList_Api(record.key);
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
                                            <Tooltip title="수정">
                                                <Button
                                                    type="primary"
                                                    onClick={() => handleEditSub(pointsStdNo)}
                                                    style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                                    icon={<PlusOutlined />}
                                                >
                                                    수정
                                                </Button>
                                            </Tooltip>
                                        </Space>
                                    </Col>
                                </Row>
                                <Table
                                    rowClassName={() => 'editable-row'}
                                    bordered={true}
                                    dataSource={dataSourceSub}
                                    columns={columnsSub}
                                    loading={loadingSub}
                                    // rowSelection={rowSelectionSub}
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
                title="X-ray 판독 배점 수정"
                onClose={onAddCloseSub}
                open={openSub}
                width={810}
                style={{ top: '60px' }}
                extra={
                    <>
                        <Space>
                            <Tooltip title="취소" placement="bottom">
                                <Button onClick={onAddCloseSub} style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}>
                                    취소
                                </Button>
                            </Tooltip>

                            <Tooltip title="수정" placement="bottom" color="#108ee9">
                                <Button
                                    onClick={onAddSubmitSub}
                                    style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                    type="primary"
                                >
                                    수정
                                </Button>
                            </Tooltip>
                        </Space>
                    </>
                }
            >
                <MainCard>
                    <Form layout="vertical" form={form}>
                        <Card title="개봉/금지" size="small" type="inner">
                            <Row gutter={24} style={{ marginBottom: '-20px' }}>
                                <Col span={6}>
                                    <Form.Item
                                        name="Score1"
                                        label="금지물품점수"
                                        rules={setRules}
                                        initialValue={itemContainerSub?.actionDiv0?.banUnitScore}
                                    >
                                        <Row>
                                            <Col>
                                                <Input
                                                    name="banUnitScore"
                                                    placeholder="# 금지물품점수"
                                                    onChange={(e) =>
                                                        setItemContainerSub({
                                                            ...itemContainerSub,
                                                            actionDiv0: {
                                                                ...itemContainerSub.actionDiv0,
                                                                banUnitScore: e.target.value
                                                            }
                                                        })
                                                    }
                                                    value={itemContainerSub?.actionDiv0?.banUnitScore}
                                                    maxLength={3}
                                                />
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="Score2"
                                        label="제한물품점수"
                                        rules={setRules}
                                        initialValue={itemContainerSub?.actionDiv0?.limitUnitScore}
                                    >
                                        <Row>
                                            <Col>
                                                <Input
                                                    name="limitUnitScore"
                                                    placeholder="# 제한물품점수"
                                                    onChange={(e) =>
                                                        setItemContainerSub({
                                                            ...itemContainerSub,
                                                            actionDiv0: {
                                                                ...itemContainerSub.actionDiv0,
                                                                limitUnitScore: e.target.value
                                                            }
                                                        })
                                                    }
                                                    value={itemContainerSub?.actionDiv0?.limitUnitScore}
                                                    maxLength={3}
                                                />
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="Score3"
                                        label="의심물품점수"
                                        rules={setRules}
                                        initialValue={itemContainerSub?.actionDiv0?.questionUnitScore}
                                    >
                                        <Row>
                                            <Col>
                                                <Input
                                                    name="questionUnitScore"
                                                    placeholder="# 의심물품점수"
                                                    onChange={(e) =>
                                                        setItemContainerSub({
                                                            ...itemContainerSub,
                                                            actionDiv0: {
                                                                ...itemContainerSub.actionDiv0,
                                                                questionUnitScore: e.target.value
                                                            }
                                                        })
                                                    }
                                                    value={itemContainerSub?.actionDiv0?.questionUnitScore}
                                                    maxLength={3}
                                                />
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="Score4"
                                        label="통과물품점수"
                                        rules={setRules}
                                        initialValue={itemContainerSub?.actionDiv0?.passUnitScore}
                                    >
                                        <Row>
                                            <Col>
                                                <Input
                                                    name="passUnitScore"
                                                    placeholder="# 통과물품점수"
                                                    onChange={(e) =>
                                                        setItemContainerSub({
                                                            ...itemContainerSub,
                                                            actionDiv0: {
                                                                ...itemContainerSub.actionDiv0,
                                                                passUnitScore: e.target.value
                                                            }
                                                        })
                                                    }
                                                    value={itemContainerSub?.actionDiv0?.passUnitScore}
                                                    maxLength={3}
                                                />
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                        <Divider style={{ margin: '10px 0' }} />
                        <Card title="미개봉/금지" size="small" type="inner">
                            <Row gutter={24} style={{ marginBottom: '-20px' }}>
                                <Col span={6}>
                                    <Form.Item
                                        name="Score5"
                                        label="금지물품점수"
                                        rules={setRules}
                                        initialValue={itemContainerSub?.actionDiv1?.banUnitScore}
                                    >
                                        <Row>
                                            <Col>
                                                <Input
                                                    name="banUnitScore"
                                                    placeholder="# 금지물품점수"
                                                    onChange={(e) =>
                                                        setItemContainerSub({
                                                            ...itemContainerSub,
                                                            actionDiv1: {
                                                                ...itemContainerSub.actionDiv1,
                                                                banUnitScore: e.target.value
                                                            }
                                                        })
                                                    }
                                                    value={itemContainerSub?.actionDiv1?.banUnitScore}
                                                    maxLength={3}
                                                />
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="Score6"
                                        label="제한물품점수"
                                        rules={setRules}
                                        initialValue={itemContainerSub?.actionDiv1?.limitUnitScore}
                                    >
                                        <Row>
                                            <Col>
                                                <Input
                                                    name="limitUnitScore"
                                                    placeholder="# 제한물품점수"
                                                    onChange={(e) =>
                                                        setItemContainerSub({
                                                            ...itemContainerSub,
                                                            actionDiv1: {
                                                                ...itemContainerSub.actionDiv1,
                                                                limitUnitScore: e.target.value
                                                            }
                                                        })
                                                    }
                                                    value={itemContainerSub?.actionDiv1?.limitUnitScore}
                                                    maxLength={3}
                                                />
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="Score7"
                                        label="의심물품점수"
                                        rules={setRules}
                                        initialValue={itemContainerSub?.actionDiv1?.questionUnitScore}
                                    >
                                        <Row>
                                            <Col>
                                                <Input
                                                    name="questionUnitScore"
                                                    placeholder="# 의심물품점수"
                                                    onChange={(e) =>
                                                        setItemContainerSub({
                                                            ...itemContainerSub,
                                                            actionDiv1: {
                                                                ...itemContainerSub.actionDiv1,
                                                                questionUnitScore: e.target.value
                                                            }
                                                        })
                                                    }
                                                    value={itemContainerSub?.actionDiv1?.questionUnitScore}
                                                    maxLength={3}
                                                />
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="Score8"
                                        label="통과물품점수"
                                        rules={setRules}
                                        initialValue={itemContainerSub?.actionDiv1?.passUnitScore}
                                    >
                                        <Row>
                                            <Col>
                                                <Input
                                                    name="passUnitScore"
                                                    placeholder="# 통과물품점수"
                                                    onChange={(e) =>
                                                        setItemContainerSub({
                                                            ...itemContainerSub,
                                                            actionDiv1: {
                                                                ...itemContainerSub.actionDiv1,
                                                                passUnitScore: e.target.value
                                                            }
                                                        })
                                                    }
                                                    value={itemContainerSub?.actionDiv1?.passUnitScore}
                                                    maxLength={3}
                                                />
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                        <Divider style={{ margin: '10px 0' }} />
                        <Card title="개봉/제한" size="small" type="inner">
                            <Row gutter={24} style={{ marginBottom: '-20px' }}>
                                <Col span={6}>
                                    <Form.Item
                                        name="Score9"
                                        label="금지물품점수"
                                        rules={setRules}
                                        initialValue={itemContainerSub?.actionDiv2?.banUnitScore}
                                    >
                                        <Row>
                                            <Col>
                                                <Input
                                                    name="banUnitScore"
                                                    placeholder="# 금지물품점수"
                                                    onChange={(e) =>
                                                        setItemContainerSub({
                                                            ...itemContainerSub,
                                                            actionDiv2: {
                                                                ...itemContainerSub.actionDiv2,
                                                                banUnitScore: e.target.value
                                                            }
                                                        })
                                                    }
                                                    value={itemContainerSub?.actionDiv2?.banUnitScore}
                                                    maxLength={3}
                                                />
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="Score10"
                                        label="제한물품점수"
                                        rules={setRules}
                                        initialValue={itemContainerSub?.actionDiv2?.limitUnitScore}
                                    >
                                        <Row>
                                            <Col>
                                                <Input
                                                    name="limitUnitScore"
                                                    placeholder="# 제한물품점수"
                                                    onChange={(e) =>
                                                        setItemContainerSub({
                                                            ...itemContainerSub,
                                                            actionDiv2: {
                                                                ...itemContainerSub.actionDiv2,
                                                                limitUnitScore: e.target.value
                                                            }
                                                        })
                                                    }
                                                    value={itemContainerSub?.actionDiv2?.limitUnitScore}
                                                    maxLength={3}
                                                />
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="Score11"
                                        label="의심물품점수"
                                        rules={setRules}
                                        initialValue={itemContainerSub?.actionDiv2?.questionUnitScore}
                                    >
                                        <Row>
                                            <Col>
                                                <Input
                                                    name="questionUnitScore"
                                                    placeholder="# 의심물품점수"
                                                    onChange={(e) =>
                                                        setItemContainerSub({
                                                            ...itemContainerSub,
                                                            actionDiv2: {
                                                                ...itemContainerSub.actionDiv2,
                                                                questionUnitScore: e.target.value
                                                            }
                                                        })
                                                    }
                                                    value={itemContainerSub?.actionDiv2?.questionUnitScore}
                                                    maxLength={3}
                                                />
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="Score12"
                                        label="통과물품점수"
                                        rules={setRules}
                                        initialValue={itemContainerSub?.actionDiv2?.passUnitScore}
                                    >
                                        <Row>
                                            <Col>
                                                <Input
                                                    name="passUnitScore"
                                                    placeholder="# 통과물품점수"
                                                    onChange={(e) =>
                                                        setItemContainerSub({
                                                            ...itemContainerSub,
                                                            actionDiv2: {
                                                                ...itemContainerSub.actionDiv2,
                                                                passUnitScore: e.target.value
                                                            }
                                                        })
                                                    }
                                                    value={itemContainerSub?.actionDiv2?.passUnitScore}
                                                    maxLength={3}
                                                />
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                        <Divider style={{ margin: '10px 0' }} />
                        <Card title="개봉/통과" size="small" type="inner">
                            <Row gutter={24} style={{ marginBottom: '-20px' }}>
                                <Col span={6}>
                                    <Form.Item
                                        name="Score13"
                                        label="금지물품점수"
                                        rules={setRules}
                                        initialValue={itemContainerSub?.actionDiv3?.banUnitScore}
                                    >
                                        <Row>
                                            <Col>
                                                <Input
                                                    name="banUnitScore"
                                                    placeholder="# 금지물품점수"
                                                    onChange={(e) =>
                                                        setItemContainerSub({
                                                            ...itemContainerSub,
                                                            actionDiv3: {
                                                                ...itemContainerSub.actionDiv3,
                                                                banUnitScore: e.target.value
                                                            }
                                                        })
                                                    }
                                                    value={itemContainerSub?.actionDiv3?.banUnitScore}
                                                    maxLength={3}
                                                />
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="Score14"
                                        label="제한물품점수"
                                        rules={setRules}
                                        initialValue={itemContainerSub?.actionDiv3?.limitUnitScore}
                                    >
                                        <Row>
                                            <Col>
                                                <Input
                                                    name="limitUnitScore"
                                                    placeholder="# 제한물품점수"
                                                    onChange={(e) =>
                                                        setItemContainerSub({
                                                            ...itemContainerSub,
                                                            actionDiv3: {
                                                                ...itemContainerSub.actionDiv3,
                                                                limitUnitScore: e.target.value
                                                            }
                                                        })
                                                    }
                                                    value={itemContainerSub?.actionDiv3?.limitUnitScore}
                                                    maxLength={3}
                                                />
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="Score15"
                                        label="의심물품점수"
                                        rules={setRules}
                                        initialValue={itemContainerSub?.actionDiv3?.questionUnitScore}
                                    >
                                        <Row>
                                            <Col>
                                                <Input
                                                    name="questionUnitScore"
                                                    placeholder="# 의심물품점수"
                                                    onChange={(e) =>
                                                        setItemContainerSub({
                                                            ...itemContainerSub,
                                                            actionDiv3: {
                                                                ...itemContainerSub.actionDiv3,
                                                                questionUnitScore: e.target.value
                                                            }
                                                        })
                                                    }
                                                    value={itemContainerSub?.actionDiv3?.questionUnitScore}
                                                    maxLength={3}
                                                />
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="Score16"
                                        label="통과물품점수"
                                        rules={setRules}
                                        initialValue={itemContainerSub?.actionDiv3?.passUnitScore}
                                    >
                                        <Row>
                                            <Col>
                                                <Input
                                                    name="passUnitScore"
                                                    placeholder="# 통과물품점수"
                                                    onChange={(e) =>
                                                        setItemContainerSub({
                                                            ...itemContainerSub,
                                                            actionDiv3: {
                                                                ...itemContainerSub.actionDiv3,
                                                                passUnitScore: e.target.value
                                                            }
                                                        })
                                                    }
                                                    value={itemContainerSub?.actionDiv3?.passUnitScore}
                                                    maxLength={3}
                                                />
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                        <Divider style={{ margin: '10px 0' }} />
                        <Card title="미개봉/통과" size="small" type="inner">
                            <Row gutter={24} style={{ marginBottom: '-20px' }}>
                                <Col span={6}>
                                    <Form.Item
                                        name="Score17"
                                        label="금지물품점수"
                                        rules={setRules}
                                        initialValue={itemContainerSub?.actionDiv4?.banUnitScore}
                                    >
                                        <Row>
                                            <Col>
                                                <Input
                                                    name="banUnitScore"
                                                    placeholder="# 금지물품점수"
                                                    onChange={(e) =>
                                                        setItemContainerSub({
                                                            ...itemContainerSub,
                                                            actionDiv4: {
                                                                ...itemContainerSub.actionDiv4,
                                                                banUnitScore: e.target.value
                                                            }
                                                        })
                                                    }
                                                    value={itemContainerSub?.actionDiv4?.banUnitScore}
                                                    maxLength={3}
                                                />
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="Score18"
                                        label="제한물품점수"
                                        rules={setRules}
                                        initialValue={itemContainerSub?.actionDiv4?.limitUnitScore}
                                    >
                                        <Row>
                                            <Col>
                                                <Input
                                                    name="limitUnitScore"
                                                    placeholder="# 제한물품점수"
                                                    onChange={(e) =>
                                                        setItemContainerSub({
                                                            ...itemContainerSub,
                                                            actionDiv4: {
                                                                ...itemContainerSub.actionDiv4,
                                                                limitUnitScore: e.target.value
                                                            }
                                                        })
                                                    }
                                                    value={itemContainerSub?.actionDiv4?.limitUnitScore}
                                                    maxLength={3}
                                                />
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="Score19"
                                        label="의심물품점수"
                                        rules={setRules}
                                        initialValue={itemContainerSub?.actionDiv4?.questionUnitScore}
                                    >
                                        <Row>
                                            <Col>
                                                <Input
                                                    name="questionUnitScore"
                                                    placeholder="# 의심물품점수"
                                                    onChange={(e) =>
                                                        setItemContainerSub({
                                                            ...itemContainerSub,
                                                            actionDiv4: {
                                                                ...itemContainerSub.actionDiv4,
                                                                questionUnitScore: e.target.value
                                                            }
                                                        })
                                                    }
                                                    value={itemContainerSub?.actionDiv4?.questionUnitScore}
                                                    maxLength={3}
                                                />
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="Score20"
                                        label="통과물품점수"
                                        rules={setRules}
                                        initialValue={itemContainerSub?.actionDiv4?.passUnitScore}
                                    >
                                        <Row>
                                            <Col>
                                                <Input
                                                    name="passUnitScore"
                                                    placeholder="# 통과물품점수"
                                                    onChange={(e) =>
                                                        setItemContainerSub({
                                                            ...itemContainerSub,
                                                            actionDiv4: {
                                                                ...itemContainerSub.actionDiv4,
                                                                passUnitScore: e.target.value
                                                            }
                                                        })
                                                    }
                                                    value={itemContainerSub?.actionDiv4?.passUnitScore}
                                                    maxLength={3}
                                                />
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    </Form>
                </MainCard>
            </Drawer>
            {/* 하단 추가 폼 End */}
        </>
    );
};
// export default XrayPoint;
