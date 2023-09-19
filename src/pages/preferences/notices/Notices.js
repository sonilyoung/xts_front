/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from 'react';
import { Typography } from '@mui/material';
import { Col, Row, Button, Form, Input, Drawer, Table, Space, Tooltip, Tag, Switch, Modal, DatePicker, Descriptions, Radio } from 'antd';
import MainCard from 'components/MainCard';
import {
    useGetNoticeListMutation,
    useInsertNoticeMutation,
    useSelectNoticeMutation,
    useUpdateNoticeMutation,
    useDeleteNoticeMutation
} from '../../../hooks/api/ContentsManagement/ContentsManagement';
import { PlusOutlined, EditFilled, DeleteFilled, ExclamationCircleFilled } from '@ant-design/icons';

import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';

//test
import { NoticeEditor } from './NoticeEditor';

const { RangePicker } = DatePicker;

export const Notices = () => {
    const currentDateTime = new Date();
    const minutes = currentDateTime.getMinutes();
    const seconds = currentDateTime.getSeconds();

    dayjs.extend(weekday);
    dayjs.extend(localeData);

    const { confirm } = Modal;
    const { TextArea } = Input;
    const [form] = Form.useForm();

    const [getNoticeList] = useGetNoticeListMutation(); // hooks api호출 리스트 호출
    const [SelectNoticeApi] = useSelectNoticeMutation(); // hooks api호출 상세 호출

    const [itemContainer, setItemContainer] = useState({}); // 리스트 값(원래 변수명: noticeList)
    const [dataSource, setDataSource] = useState([]); // Table 데이터 값
    const [dataSourceView, setDataSourceView] = useState([]); // Table 데이터 값
    const [noticeId, setNoticeId] = useState(null); //선택 값
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); //셀렉트 박스 option Selected 값
    const [dataEdit, setDataEdit] = useState(false); //수정
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal창
    const [loading, setLoading] = useState(false); // 로딩 초기값
    const [loadingView, setLoadingView] = useState(false); // 로딩 초기값
    const [open, setOpen] = useState(false); // Drawer 추가 우측폼 상태

    //Editor
    const editor = useRef(null);
    const [uploadedFiles, setUploadedFiles] = useState([]); // 파일 업로드 값
    const [selectedFiles, setSelectedFiles] = useState([]); // 파일 업로드

    const handleCall = async () => {
        const GetNoticeList = await getNoticeList({});
        setDataSource([
            ...GetNoticeList?.data?.RET_DATA.map((noticeData, noticeIndex) => ({
                key: noticeData.noticeId, //갱신, 삭제 등에 필요한 데이터
                rowdata0: noticeIndex + 1, //index값
                rowdata1: noticeData.title, // 제목
                rowdata2: noticeData.contents, // 내용
                rowdata3: noticeData.insertDate, // 생성일자
                rowdata4: noticeData.useYn // 사용 여부
            }))
        ]);
    };

    const handleCallView = async (ViewData) => {
        const SelectNoticeApiRequest = await SelectNoticeApi({
            noticeId: ViewData
        });
        setItemContainer(SelectNoticeApiRequest.data.RET_DATA);
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
            render: (_, { key, rowdata1 }) => (
                <Button
                    type="text"
                    onClick={() => {
                        setLoadingView(true);
                        setIsModalOpen(true);
                        // setNoticeId(rowdata0);
                        handleCallView(key);
                    }}
                >
                    {rowdata1}
                </Button>
            )
        },
        {
            width: '180px',
            title: '사용여부',
            key: 'key',
            dataIndex: 'rowdata2',
            render: (_, { rowdata4 }) =>
                rowdata4 === 'Y' ? (
                    <Tag style={{ width: '60px', borderRadius: '5px', padding: '0 10px', textAlign: 'center' }} color="#87d068">
                        사용
                    </Tag>
                ) : (
                    <Tag style={{ width: '60px', borderRadius: '5px', padding: '0 10px', textAlign: 'center' }}> 미사용</Tag>
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
        form.resetFields();
        handleCallView(key);
        setNoticeId(key);
        setIsModalOpen(false);
        setDataEdit(true);
        setOpen(true);
    };

    // 추가
    const handleAdd = () => {
        setOpen(true);
        setDataEdit(false);
        form.resetFields();
    };

    // 추가 취소
    const onAddClose = () => {
        setOpen(false);
        setDataEdit(false);
        setItemContainer({});
        setNoticeId(null);
        form.resetFields();
    };

    // Editor에서 수정된 값 적용
    const editor_onChange = (html) => {
        setItemContainer({ ...itemContainer, contents: html });
    };

    // TODO: useYn
    // 수정 ======================================================
    const [UpdateNotice] = useUpdateNoticeMutation();
    const Notice_Update_Submit = async () => {
        const UpdateModulResponse = await UpdateNotice({
            noticeId: noticeId,
            title: itemContainer.title,
            contents: itemContainer.contents
            // useYn: itemContainer.useYn
        });

        UpdateModulResponse?.data?.RET_CODE === '0100'
            ? Modal.success({
                  content: '수정 완료',
                  onOk() {
                      setOpen(false);
                      setDataEdit(false);
                      form.resetFields();
                      handleCall();
                  }
              })
            : Modal.error({
                  content: '수정 오류',
                  onOk() {}
              });
    };

    // TODO: useYn 추가 요청
    const [InsertNotice] = useInsertNoticeMutation();
    const Notice_Insert_Submit = async () => {
        console.log(itemContainer);

        const InsertModulResponse = await InsertNotice({
            title: itemContainer.title,
            contents: itemContainer.contents,
            useYn: itemContainer.useYn,
            insertDate: itemContainer.insertDate
        });
        console.log(InsertModulResponse.data);

        InsertModulResponse?.data?.RET_CODE === '0100'
            ? Modal.success({
                  content: '추가 완료',
                  onOk() {
                      setOpen(false);
                      setDataEdit(false);
                      form.resetFields();
                      handleCall();
                  }
              })
            : Modal.error({
                  content: '추가 오류',
                  onOk() {}
              });
    };

    const [DeleteNotice] = useDeleteNoticeMutation();
    // 삭제처리
    const Notice_Delete_Submit = () => {
        setDataEdit(false);
        confirm({
            title: '선택한 항목을 삭제하시겠습니까?',
            icon: <ExclamationCircleFilled />,
            content: selectedRowKeys + ' 항목의 데이터',
            okText: '예',
            okType: 'danger',
            cancelText: '아니오',
            async onOk() {
                const DeleteNoticeResponse = await DeleteNotice({
                    noticeId: selectedRowKeys
                });
                DeleteNoticeResponse?.data?.RET_CODE === '0100'
                    ? Modal.success({
                          content: '삭제 완료'
                      })
                    : Modal.error({
                          content: '삭제 오류'
                      });
                setIsModalOpen(false);
                setDataEdit(false);
                handleCall();
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
                                        onClick={Notice_Delete_Submit}
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
                width={1000}
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
                                        onClick={Notice_Update_Submit}
                                        style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                        type="primary"
                                    >
                                        수정
                                    </Button>
                                </Tooltip>
                            ) : (
                                <Tooltip title="추가" placement="bottom" color="#108ee9">
                                    <Button
                                        onClick={Notice_Insert_Submit}
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
                                    label="공지일자"
                                    rules={[
                                        {
                                            required: true,
                                            message: '공지일자'
                                        }
                                    ]}
                                    initialValue={itemContainer?.insertDate}
                                >
                                    <Row>
                                        <Col>
                                            <DatePicker
                                                name="insertDate"
                                                onChange={(date) => {
                                                    setItemContainer({ ...itemContainer, insertDate: date });
                                                }}
                                                placeholder="공지일자"
                                                style={{
                                                    width: '560px'
                                                }}
                                                value={itemContainer?.insertDate ? dayjs(itemContainer.insertDate) : dayjs(new Date())}
                                            />
                                        </Col>
                                    </Row>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="Subject"
                                    label="제목"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter Notice Subject'
                                        }
                                    ]}
                                    initialValue={itemContainer?.title}
                                >
                                    <Row>
                                        <Col>
                                            <Input
                                                name="title"
                                                placeholder="Please Enter Notice title"
                                                onChange={(e) => setItemContainer({ ...itemContainer, title: e.target.value })}
                                                value={itemContainer?.title}
                                                style={{ width: '560px' }}
                                            />
                                        </Col>
                                    </Row>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
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
                                    initialValue={itemContainer?.contents}
                                >
                                    <Row>
                                        <Col>
                                            <NoticeEditor noticeId={noticeId} editor_onChange={editor_onChange}></NoticeEditor>
                                        </Col>
                                    </Row>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={24}>
                                {/* label="사용여부" -> label="UseYn"으로 변경 : Sejun */}
                                <Form.Item label="사용여부" name="useYn">
                                    <Row>
                                        <Col>
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
                                        </Col>
                                    </Row>
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
                <Descriptions title={itemContainer?.rowdata1} style={{ marginTop: 20 }}>
                    <Row>
                        <Col span={8}></Col>
                        <Col span={8} offset={8} style={{ textAlign: 'right' }}>
                            <Space>
                                <Tooltip title="삭제" color="#f50">
                                    <Button
                                        type="danger"
                                        onClick={Notice_Delete_Submit}
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
                        <div style={{ textAlign: 'left' }}>{itemContainer?.insertDate}</div>
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions bordered style={{ marginTop: '-1px' }}>
                    <Descriptions.Item label="제목" style={{ textAlign: 'center', width: '150px' }}>
                        <div style={{ textAlign: 'left' }}>{itemContainer?.title}</div>
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions bordered style={{ marginTop: '-1px' }}>
                    <Descriptions.Item label="내용" style={{ textAlign: 'center', width: '150px' }}>
                        <div style={{ textAlign: 'left' }}>
                            {itemContainer?.contents?.split('/\n/g').map((line) => {
                                return <div style={{ whiteSpace: 'pre-wrap' }}>{line}</div>;
                            })}
                        </div>
                    </Descriptions.Item>
                </Descriptions>
            </Modal>
            {/* 모달 창 End */}
        </>
    );
};
