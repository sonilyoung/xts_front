/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Typography } from '@mui/material';
import { Col, Row, Button, Form, Input, Drawer, Table, Space, Tooltip, Tag, Switch, Modal, DatePicker, Descriptions } from 'antd';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
//import 'antd/dist/antd.css';
import {
    useGetNoticeListMutation,
    useInsertNoticeMutation,
    useSelectNoticeMutation,
    useUpdateNoticeMutation
} from '../../../hooks/api/ContentsManagement/ContentsManagement';
import { PlusOutlined, EditFilled, DeleteFilled, ExclamationCircleFilled } from '@ant-design/icons';

// project import
import MainCard from 'components/MainCard';

export const Notices = () => {
    const { confirm } = Modal;
    const { TextArea } = Input;
    dayjs.extend(weekday);
    dayjs.extend(localeData);
    const [form] = Form.useForm();

    const [getNoticeList] = useGetNoticeListMutation(); // hooks api호출
    const [itemContainer, setItemContainer] = useState({}); // 리스트 값(원래 변수명: noticeList)
    const [dataSource, setDataSource] = useState([]); // Table 데이터 값
    const [dataSourceView, setDataSourceView] = useState([]); // Table 데이터 값
    const [noticeId, setNoticeId] = useState(); //선택 값
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); //셀렉트 박스 option Selected 값
    const [dataEdit, setDataEdit] = useState(false); //수정
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal창
    const [loading, setLoading] = useState(false); // 로딩 초기값
    const [loadingView, setLoadingView] = useState(false); // 로딩 초기값
    const [open, setOpen] = useState(false); // Drawer 추가 우측폼 상태

    const handleCall = async () => {
        const GetNoticeList = await getNoticeList({});
        setDataSource([
            ...GetNoticeList?.data?.RET_DATA.map((noticeData, noticeIndex) => ({
                key: noticeData.noticeId, //갱신, 삭제 등에 필요한 데이터
                rowdata0: noticeIndex, //index값
                rowdata1: noticeData.title, // 제목
                rowdata2: noticeData.contents, // 내용
                rowdata3: noticeData.insertDate, // 생성일자
                rowdata4: noticeData.useYn // 사용 여부
            }))
        ]);
    };

    const handleCallView = (ViewData) => {
        setIsModalOpen(true);
        console.log(`${dataSource[ViewData]?.rowdata4}`);
        setDataSourceView(
            dataSource[ViewData] != undefined
                ? {
                      key: `${dataSource[ViewData]?.key}`, //갱신, 삭제 등에 필요한 데이터
                      rowdata0: `${ViewData}`, //index값
                      rowdata1: `${dataSource[ViewData]?.rowdata1}`, // 제목
                      rowdata2: `${dataSource[ViewData]?.rowdata2}`, // 내용
                      rowdata3: `${dataSource[ViewData]?.rowdata3}`, // 생성일자
                      rowdata4: `${dataSource[ViewData]?.rowdata4}` // 사용 여부
                  }
                : ''
            /*ViewData === '1'
                ? {
                      key: '1',
                      rowdata0: '1',
                      rowdata1: '공지사항 테스트 1',
                      rowdata2: '공지사항 테스트 1\nContents\t줄바꿈\n테스트',
                      rowdata3: '2023-01-05'
                  }
                : ViewData === '2'
                ? {
                      key: '2',
                      rowdata0: '2',
                      rowdata1: '공지사항 테스트 2',
                      rowdata2: '공지사항 테스트 2 Contents',
                      rowdata3: '2023-01-12'
                  }
                : ViewData === '3'
            */
        );
    };

    // 상세
    const [SelectNotice] = useSelectNoticeMutation();
    const handle_SelectNotice_Api = async (noticeId) => {
        const SelectNoticeDetailResponse = await SelectNotice({
            noticeId: noticeId
        });
        setItemContainer(SelectNoticeDetailResponse.data.RET_DATA);
    };

    const defaultColumns = [
        {
            width: '80px',
            title: 'No',
            dataIndex: 'rowdata0',
            align: 'center',
            render: (text) => (
                <div style={{ cursor: 'pointer' }}>
                    <Tooltip title="Click">
                        <div>{text}</div>
                    </Tooltip>
                </div>
            )
        },
        {
            title: '제목',
            dataIndex: 'rowdata1',
            align: 'center',
            render: (text) => (
                <div style={{ cursor: 'pointer' }}>
                    <Button
                        type="text"
                        onClick={() => {
                            setLoadingView(true);
                            setNoticeId(record.key);
                            handleCallView(record.rowdata0);
                        }}
                    >
                        {text}
                    </Button>
                </div>
            )
        },
        {
            width: '180px',
            title: '사용여부',
            key: 'key',
            dataIndex: 'rowdata2',
            render: (_, { rowdata4 }) =>
                rowdata4 === 'Y' ? (
                    <Tag style={{ width: '60px', borderRadius: '5px', padding: '0 10px' }} color="#87d068">
                        {rowdata4}
                    </Tag>
                ) : (
                    <Tag style={{ width: '60px', borderRadius: '5px', padding: '0 10px' }}> {rowdata4}</Tag>
                ),
            align: 'center'
        },
        {
            width: '200px',
            title: '공지일자',
            dataIndex: 'rowdata3',
            render: (_, { rowdata3 }) => <>{rowdata3 === '' || rowdata3 === null ? '-' : rowdata3}</>,
            align: 'center'
        },
        {
            width: '120px',
            title: '수정',
            render: (_, { key }) => (
                <>
                    <Tooltip title="수정" color="#108ee9">
                        <Button
                            type="primary"
                            onClick={() => {
                                handleEdit(key);
                            }}
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
        console.log('new Data: ', newData);
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
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave
            })
        };
    });

    // 수정버튼
    const handleEdit = async (key) => {
        await handle_SelectNotice_Api(key);
        form.resetFields();
        setIsModalOpen(false);
        setDataEdit(true);
        setOpen(true);
    };

    // 추가
    const handleAdd = () => {
        setOpen(true);
        setDataEdit(false);
        //setItemContainer({});
        console.log('add', itemContainer);
        form.resetFields();
    };

    // 추가 취소
    const onAddClose = () => {
        setOpen(false);
        setDataEdit(false);
        setItemContainer({});
        console.log('cancel', itemContainer);
        form.resetFields();
    };

    // 수정
    const [UpdateNotice] = useUpdateNoticeMutation();
    // 추가
    const [InsertNotice] = useInsertNoticeMutation();
    // 등록자명(로그인 한 관리자명) 가져올 필요 있음
    // 추가 등록 및 수정 처리
    const NoticeSubmit = async () => {
        if (dataEdit === true) {
            setItemContainer({ ...itemContainer, updateDate: `${dayjs(new Date())}` });
            console.table(itemContainer);
            //await UpdateNotice(itemContainer);
            Modal.success({
                content: '수정 완료',
                onOk() {
                    setOpen(false);
                    setIsModalOpen(true);
                    handleCallView(noticeId);
                    setDataEdit(false);
                    form.resetFields();
                }
            });
        } else {
            setItemContainer({ ...itemContainer, insertDate: dayjs(new Date()) });
            console.table(itemContainer);
            //await InsertNotice(itemContainer);
            Modal.success({
                content: '추가 완료',
                onOk() {
                    setOpen(false);
                    setDataEdit(false);
                    form.resetFields();
                }
            });
        }
    };

    // 삭제처리
    const handleDel = () => {
        setDataEdit(false);
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
                setIsModalOpen(false);
                setDataEdit(false);
            },
            onCancel() {
                Modal.error({
                    content: '삭제취소'
                });
            }
        });
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

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        // setLoadingView(true);
        handleCall();
    }, []);

    return (
        <>
            <MainCard title="공지사항 관리">
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
                                <Tooltip title="삭제" color="#f50">
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
                        bordered={true}
                        dataSource={dataSource}
                        loading={loading}
                        columns={columns}
                        rowSelection={{ ...rowSelection }}
                        rowClassName={(record) => {
                            return record.key === noticeId ? `table-row-lightblue` : '';
                        }}
                    />
                </Typography>
            </MainCard>

            {/* 공지사항 추가 및 수정 폼 Start */}
            <Drawer
                maskClosable={false}
                title={`공지사항 ${dataEdit === true ? '수정' : '추가'}`}
                onClose={onAddClose}
                open={open}
                width={400}
                style={{ top: '60px' }}
                bodyStyle={{
                    Top: 100,
                    paddingBottom: 0
                }}
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
                                        onClick={NoticeSubmit}
                                        style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                        type="primary"
                                    >
                                        수정
                                    </Button>
                                </Tooltip>
                            ) : (
                                <Tooltip title="추가" placement="bottom" color="#108ee9">
                                    <Button
                                        onClick={NoticeSubmit}
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
                                    name="NoticeData"
                                    label="공지일자"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter Notice Subject'
                                        }
                                    ]}
                                    initialValue={dayjs(new Date())}
                                    //defaultValue={dayjs(new Date())}
                                >
                                    <DatePicker style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                {/* label="제목" -> label="Subject"로 변경 : Sejun */}
                                <Form.Item
                                    name="Subject"
                                    label="제목"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter Notice Subject'
                                        }
                                    ]}
                                    initialValue={dataSourceView?.rowdata1}
                                >
                                    <Input
                                        className="Subject"
                                        placeholder="Please Enter Notice Subject"
                                        onChange={(e) => setItemContainer({ ...itemContainer, title: e.target.value })}
                                        value={itemContainer?.rowdata1}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                {/* label="내용" -> label="Contents"로 변경 : Sejun */}
                                <Form.Item
                                    name="Contents"
                                    label="내용"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter Notice Contents'
                                        }
                                    ]}
                                    initialValue={dataSourceView?.rowdata2}
                                >
                                    <TextArea
                                        className="Contents"
                                        placeholder="Please Enter Notice Contents"
                                        autoSize={{
                                            minRows: 5,
                                            maxRows: 10
                                        }}
                                        onChange={(e) => setItemContainer({ ...itemContainer, contents: e.target.value })}
                                        value={itemContainer?.rowdata2}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                {/* label="사용여부" -> label="UseYn"으로 변경 : Sejun */}
                                <Form.Item label="사용여부" name="useYn" valuePropName="checked">
                                    <Switch
                                        className="UseYn"
                                        checkedChildren="사용"
                                        unCheckedChildren="미사용"
                                        style={{ width: '80px' }}
                                        defaultChecked={dataSourceView?.rowdata4 === 'Y' ? true : false}
                                        onChange={(checked, event) => {
                                            setItemContainer({ ...itemContainer, useYn: checked });
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </MainCard>
            </Drawer>
            {/* 공지사항 추가 및 수정 폼 End */}

            {/* 모달 창 Start */}
            <Modal
                open={isModalOpen}
                width={800}
                onOk={handleOk}
                onCancel={handleCancel}
                style={{ left: 130 }}
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
                <Descriptions title={dataSourceView.rowdata1} style={{ marginTop: 20 }}>
                    <Row>
                        <Col span={8}></Col>
                        <Col span={8} offset={8} style={{ textAlign: 'right' }}>
                            <Space>
                                {/* <Tooltip title="수정" color="#108ee9">
                                    <Button
                                        type="primary"
                                        onClick={handleEdit}
                                        style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                        icon={<EditFilled />}
                                    >
                                        수정
                                    </Button>
                                </Tooltip> */}
                                <Tooltip title="삭제" color="#f50">
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
                </Descriptions>
                <Descriptions bordered style={{ marginTop: '-1px' }}>
                    <Descriptions.Item label="공지일자" style={{ textAlign: 'center', width: '150px' }}>
                        <div style={{ textAlign: 'left' }}>{dataSourceView?.rowdata3}</div>
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions bordered style={{ marginTop: '-1px' }}>
                    <Descriptions.Item label="제목" style={{ textAlign: 'center', width: '150px' }}>
                        <div style={{ textAlign: 'left' }}>{dataSourceView?.rowdata1}</div>
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions bordered style={{ marginTop: '-1px' }}>
                    <Descriptions.Item label="내용" style={{ textAlign: 'center', width: '150px' }}>
                        <div style={{ textAlign: 'left' }}>
                            {dataSourceView?.rowdata2?.split('/\n/g').map((line) => {
                                return <div style={{ whiteSpace: 'pre-wrap' }}>{line}</div>;
                            })}
                        </div>
                    </Descriptions.Item>
                </Descriptions>
            </Modal>
            {/* 모달 창 End */}
            {/* 테스트 */}
            <Descriptions>
                <Descriptions.Item label="title" style={{ textAlign: 'center', width: '150px' }}>
                    <div style={{ textAlign: 'left' }}>{`${itemContainer?.title}`}</div>
                </Descriptions.Item>
            </Descriptions>
            <Descriptions>
                <Descriptions.Item label="contents" style={{ textAlign: 'center', width: '150px' }}>
                    <div style={{ textAlign: 'left' }}>{`${itemContainer?.contents}`}</div>
                </Descriptions.Item>
            </Descriptions>
            <Descriptions>
                <Descriptions.Item label="useYn" style={{ textAlign: 'center', width: '150px' }}>
                    <div style={{ textAlign: 'left' }}>{`${itemContainer?.useYn}`}</div>
                </Descriptions.Item>
            </Descriptions>
            <Descriptions>
                <Descriptions.Item label="DatasourceViewUseYn" style={{ textAlign: 'center', width: '150px' }}>
                    <div style={{ textAlign: 'left' }}>{`${dataSourceView?.rowdata4}`}</div>
                </Descriptions.Item>
            </Descriptions>
            {/* 테스트 */}
        </>
    );
};
