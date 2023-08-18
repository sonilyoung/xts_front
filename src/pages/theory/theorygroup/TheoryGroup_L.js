/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Col, Row, Button, Form, Input, Table, Drawer, Space, Tooltip, Tag, Radio, Divider, Modal } from 'antd';

import {
    useSelectTheoryGroupListMutation,
    useSelectTheoryGroupMutation,
    useInsertTheoryGroupMutation,
    useUpdateTheoryGroupMutation,
    useDeleteTheoryGroupMutation
} from '../../../hooks/api/TheoryGroupManagement/TheoryGroupManagement';

// project import
import MainCard from 'components/MainCard';

import { PlusOutlined, EditFilled, DeleteFilled, ExclamationCircleFilled } from '@ant-design/icons';

export const TheoryGroup_L = ({ ...props }) => {
    const { confirm } = Modal;
    const [form] = Form.useForm();

    const [itemContainer, setItemContainer] = useState({}); // 항목 컨테이너
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); //셀렉트 박스 option Selected 값(대분류)
    const [selectprocGroupCd, setSelectprocGroupCd] = useState('');
    const [groupNoData, setGroupNoData] = useState(''); //수정 선택한 값

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false); // Drawer 추가 우측폼 상태
    const [dataEdit, setDataEdit] = useState(false); // Drawer 수정 우측폼 상태

    // 추가 및 수정 input 기본값 정리
    const [procGroupCdVal, setProcGroupCdVal] = useState();
    const [procGroupNmVal, setProcGroupNmVal] = useState();
    const [procGroupYnVal, setProcGroupYnVal] = useState();

    // ===============================
    // Api 호출 Start
    // 조회 ======================================================
    const [SelectTheoryGroupListApi] = useSelectTheoryGroupListMutation();
    const [selectTheoryGroupListData, setSelectTheoryGroupListData] = useState();
    const handle_SelectTheoryGroupList_Api = async () => {
        const SelectTheoryGroupListresponse = await SelectTheoryGroupListApi({
            groupType: 'L',
            theoryParentGroupCd: ''
        });
        setSelectTheoryGroupListData([
            ...SelectTheoryGroupListresponse?.data?.RET_DATA.map((d, i) => ({
                key: d.groupNo,
                rowdata0: i + 1,
                rowdata1: d.groupType,
                rowdata2: d.theoryGroupCd,
                rowdata3: d.theoryGroupName,
                rowdata4: d.theoryParentGroupCd,
                rowdata5: d.useYn
            }))
        ]);
        setLoading(false);
    };

    // 상세 ======================================================
    const [SelectTheoryGroupApi] = useSelectTheoryGroupMutation();
    const handle_SelectTheoryGroup_Api = async (groupNo) => {
        const SelectTheoryGroupresponse = await SelectTheoryGroupApi({
            groupNo: groupNo
        });
        setGroupNoData(SelectTheoryGroupresponse?.data?.RET_DATA.groupNo);
        setItemContainer(SelectTheoryGroupresponse?.data?.RET_DATA);
    };

    // 등록 ======================================================
    const [InsertTheoryGroupApi] = useInsertTheoryGroupMutation(); // 교육생 정보 hooks api호출
    const handle_InsertTheoryGroup_Api = async () => {
        const InsertTheoryGroupresponse = await InsertTheoryGroupApi({
            groupType: 'L',
            theoryGroupCd: itemContainer.theoryGroupCd,
            theoryGroupName: itemContainer.theoryGroupName,
            theoryParentGroupCd: '',
            useYn: itemContainer.useYn
        });
        InsertTheoryGroupresponse?.data?.RET_CODE === '0100'
            ? Modal.success({
                  content: '등록 완료',
                  onOk() {
                      setOpen(false);
                      setDataEdit(false);
                      form.resetFields();
                      handle_SelectTheoryGroupList_Api();
                  }
              })
            : Modal.error({
                  content: '등록 오류',
                  onOk() {}
              });
    };
    // 수정 ======================================================
    const [UpdateTheoryGroupApi] = useUpdateTheoryGroupMutation(); // 수정 hooks api호출
    const handel_UpdateUser_Api = async () => {
        const UpdateTheoryGroupresponse = await UpdateTheoryGroupApi({
            groupNo: groupNoData,
            groupType: itemContainer.groupType,
            theoryGroupCd: itemContainer.theoryGroupCd,
            theoryGroupName: itemContainer.theoryGroupName,
            theoryParentGroupCd: '',
            useYn: itemContainer.useYn
        });
        UpdateTheoryGroupresponse?.data?.RET_CODE === '0100'
            ? Modal.success({
                  content: '수정 완료',
                  onOk() {
                      setOpen(false);
                      setDataEdit(false);
                      form.resetFields();
                      handle_SelectTheoryGroupList_Api();
                  }
              })
            : Modal.error({
                  content: '수정 오류',
                  onOk() {}
              });
    };
    // 삭제 ======================================================
    const [DeleteTheoryGroupApi] = useDeleteTheoryGroupMutation(); // 삭제 hooks api호출
    const handel_DeleteTheoryGroup_Api = async (userIdList) => {
        const DeleteTheoryGroupresponse = await DeleteTheoryGroupApi({
            groupNoList: userIdList
        });
        DeleteTheoryGroupresponse?.data?.RET_CODE === '0300'
            ? Modal.success({
                  content: '삭제 완료',
                  onOk() {
                      handle_SelectTheoryGroupList_Api();
                  }
              })
            : Modal.error({
                  content: '삭제 오류',
                  onOk() {}
              });
    };

    // Api 호출 End
    // ===============================

    const defaultColumns = [
        {
            width: '50px',
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
            title: '대분류코드',
            dataIndex: 'rowdata2',
            align: 'center',
            render: (text) => (
                <div style={{ cursor: 'pointer' }}>
                    <div>{text}</div>
                </div>
            )
        },
        {
            title: '대분류명',
            dataIndex: 'rowdata3',
            datatype: 'rowdata1',
            align: 'center',
            render: (text) => (
                <div style={{ cursor: 'pointer' }}>
                    <div>{text}</div>
                </div>
            )
        },
        {
            width: '70px',
            title: '사용여부',
            dataIndex: 'rowdata5',
            render: (_, { rowdata5 }) => (
                <>
                    {rowdata5 === 'Y' ? (
                        <Tag color={'green'} key={rowdata5}>
                            사용
                        </Tag>
                    ) : (
                        <Tag color={'volcano'} key={rowdata5}>
                            미사용
                        </Tag>
                    )}
                </>
            ),
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

    const handleSave = (row) => {
        const newData = [...selectTheoryGroupListData];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row
        });
        setSelectTheoryGroupListData(newData);
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

    //체크 박스 이벤트 (대분류)
    const onSelectChange = (newselectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newselectedRowKeys);
        setSelectedRowKeys(newselectedRowKeys);
    };

    //체크 박스 선택 (대분류)
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange
    };

    // 대분류 추가 버튼
    const handleAdd = () => {
        setItemContainer({});
        setDataEdit(false);
        setOpen(true);
        form.resetFields();
    };

    // 대분류 수정 버튼
    const handleEdit = (EditKey) => {
        handle_SelectTheoryGroup_Api(EditKey);
        setDataEdit(true);
        setOpen(true);
    };

    // 대분류 삭제
    const handleDel = () => {
        if (selectedRowKeys == '') {
            Modal.error({
                content: '삭제할 [대분류] 항목을 선택해주세요.'
            });
        } else {
            confirm({
                title: '선택한 [대분류] 항목을 삭제하시겠습니까?',
                icon: <ExclamationCircleFilled />,
                // content: selectedRowKeys + ' 항목의 데이터',
                okText: '예',
                okType: 'danger',
                cancelText: '아니오',
                onOk() {
                    handel_DeleteTheoryGroup_Api(selectedRowKeys);
                },
                onCancel() {}
            });
        }
    };

    // 추가 및 수정 취소
    const onAddClose = () => {
        setItemContainer({});
        setOpen(false);
        form.resetFields();
    };

    // 추가 및 수정 처리
    const onAddSubmit = () => {
        if (dataEdit === true) {
            handel_UpdateUser_Api(); // 수정
        } else {
            handle_InsertTheoryGroup_Api(); // 추가(등록)
        }
    };

    const handleTheoryGroup_M = (procGroupCd_M) => {
        props.TheoryGroup_Call_M(procGroupCd_M);
    };

    useEffect(() => {
        setLoading(true);
        handle_SelectTheoryGroupList_Api();
    }, []);

    return (
        <>
            <Row style={{ marginBottom: 16 }}>
                <Col span={16} offset={8} style={{ textAlign: 'right' }}>
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
                                type="primary"
                                danger
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
                rowClassName={(record) => {
                    return record.rowdata2 === selectprocGroupCd ? `table-row-lightblue` : '';
                }}
                bordered={true}
                dataSource={selectTheoryGroupListData}
                loading={loading}
                columns={columns}
                pagination={false}
                rowSelection={rowSelection}
                onRow={(record) => {
                    return {
                        onClick: () => {
                            if (record.rowdata2 !== selectprocGroupCd) {
                                setSelectprocGroupCd(record.rowdata2);
                                handleTheoryGroup_M(record.rowdata2);
                            }
                        }
                    };
                }}
            />

            {/* 분류추가 폼 Start */}
            <Drawer
                maskClosable={false}
                title={`대분류 ${dataEdit === true ? '수정' : '추가'}`}
                onClose={onAddClose}
                open={open}
                width={400}
                style={{ top: '60px' }}
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
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    label="대분류 분류코드"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter Group Code'
                                        }
                                    ]}
                                >
                                    <Input
                                        placeholder="Please Enter Group Code"
                                        name="theoryGroupCd"
                                        value={itemContainer?.theoryGroupCd}
                                        onChange={(e) => setItemContainer({ ...itemContainer, theoryGroupCd: e.target.value })}
                                        disabled={dataEdit}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    label="대분류 분류명"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter Group Name'
                                        }
                                    ]}
                                >
                                    <Input
                                        name="theoryGroupName"
                                        value={itemContainer?.theoryGroupName}
                                        style={{
                                            width: '100%'
                                        }}
                                        onChange={(e) => setItemContainer({ ...itemContainer, theoryGroupName: e.target.value })}
                                        placeholder="Please Enter Group Name"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item label="대분류 사용여부">
                                    <Radio.Group
                                        name="useYn"
                                        onChange={(e) => setItemContainer({ ...itemContainer, useYn: e.target.value })}
                                        buttonStyle="solid"
                                        value={itemContainer?.useYn}
                                    >
                                        <Radio.Button value="Y">
                                            <span style={{ padding: '0 15px' }}>사용</span>
                                        </Radio.Button>
                                        <span style={{ padding: '0 10px' }}></span>
                                        <Radio.Button value="N">
                                            <span style={{ padding: '0 15px' }}>미사용</span>
                                        </Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </MainCard>
            </Drawer>
            {/* 분류추가 폼 End */}
        </>
    );
};
