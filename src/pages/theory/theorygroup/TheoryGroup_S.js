/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Col, Row, Button, Form, Input, Table, Drawer, Space, Tooltip, Tag, Switch, Divider, Skeleton, Modal } from 'antd';
// import { useGetTheoryGroupListMutation } from '../../../hooks/api/EduManagement/EduManagement';

// project import
import MainCard from 'components/MainCard';

import { PlusOutlined, EditFilled, DeleteFilled, ExclamationCircleFilled } from '@ant-design/icons';

export const TheoryGroup_S = ({ ...props }) => {
    const { confirm } = Modal;
    const [form] = Form.useForm();

    // const [getTheoryGroupList] = useGetTheoryGroupListMutation();
    const [TheoryGroupList, setTheoryGroupList] = useState();
    const [dataSource, setdataSource] = useState([]);
    const [selectedRowKeys, setselectedRowKeys] = useState([]); //셀렉트 박스 option Selected 값(소분류)
    const [loading, setloading] = useState(false);
    const [open, setOpen] = useState(false); // Drawer 추가 우측폼 상태
    const [dataEdit, setDataEdit] = useState(false); // Drawer 수정 우측폼 상태

    // 추가 및 수정 input 기본값 정리
    const [procGroupCdVal, setProcGroupCdVal] = useState();
    const [procGroupNmVal, setProcGroupNmVal] = useState();
    const [procGroupYnVal, setProcGroupYnVal] = useState();

    // 소분류 API 호출
    const handleTheoryGroup = async (procGroupCd) => {
        // const TheoryGroupresponse = await getTheoryGroupList({
        //     searchType: '3',
        //     procGroupCd: procGroupCd
        // });
        // setTheoryGroupList(TheoryGroupresponse?.data?.RET_DATA);
        // setdataSource([
        //     ...TheoryGroupresponse?.data?.RET_DATA.map((s, i) => ({
        //         key: s.procGroupCd,
        //         rowdata0: i + 1,
        //         rowdata1: s.procGroupNo,
        //         rowdata2: s.procGroupCd,
        //         rowdata3: s.procGroupNm,
        //         rowdata4: s.procGroupDc,
        //         rowdata5: s.procGroupSort,
        //         rowdata6: s.useYn,
        //         rowdata7: s.parentProcGroupCd,
        //         rowdata8: s.topProcGroupCd,
        //         rowdata9: s.searchType,
        //         rowdata10: 'S'
        //     }))
        // ]);
        // setloading(false);
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
                // Data값이 변경될 경우 체크박스 체크
                if (record[dataIndex] != values[dataIndex]) {
                    selectedRowKeys.length <= 0
                        ? onSelectChange([record.key])
                        : selectedRowKeys.map((d_S) => (d_S === record.key ? '' : onSelectChange([...selectedRowKeys, record.key])));
                }
            } catch (errInfo) {
                console.log('Save failed:', errInfo);
            }
        };

        let childNode = children;
        if (editable) {
            childNode = editing ? (
                <>
                    <Form.Item
                        style={{ margin: '0 auto', width: '100%' }}
                        name={dataIndex}
                        rules={[{ required: true, message: `${title} is required.` }]}
                    >
                        <Input size="small" ref={inputRef} onPressEnter={save} onBlur={save} />
                    </Form.Item>
                </>
            ) : (
                <>
                    <div className="editable-cell-value-wrap" onClick={toggleEdit} aria-hidden="true">
                        {children}
                    </div>
                </>
            );
        }
        return <td {...restProps}>{childNode}</td>;
    };

    const defaultcolumns = [
        // {
        //     width: '60px',
        //     title: 'No',
        //     dataIndex: 'rowdata0',
        //     align: 'center'
        // },
        {
            title: '소분류코드',
            dataIndex: 'rowdata2',
            align: 'center'
        },
        {
            title: '소분류명',
            dataIndex: 'rowdata3',
            datatype: 'rowdata10',
            align: 'center'
        },
        {
            title: '사용여부',
            dataIndex: 'rowdata6',
            render: (_, { rowdata6 }) => (
                <>
                    {rowdata6 === '1' ? (
                        <Tag color={'green'} key={rowdata6}>
                            사용
                        </Tag>
                    ) : (
                        <Tag color={'volcano'} key={rowdata6}>
                            미사용
                        </Tag>
                    )}
                </>
            ),
            align: 'center'
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

    const handleSave = (row) => {
        const newData = row.rowdata10 === 'L' ? [...dataSource_l] : row.rowdata10 === 'M' ? [...dataSource_m] : [...dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row
        });
        setdataSource(newData);
    };

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell
        }
    };

    const columns = defaultcolumns.map((col) => {
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

    //체크 박스 이벤트 (소분류)
    const onSelectChange = (newselectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newselectedRowKeys);
        setselectedRowKeys(newselectedRowKeys);
    };

    //체크 박스 선택 (소분류)
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange
    };

    // 중분류 추가 버튼
    const handleAdd = () => {
        setDataEdit(false);
        setOpen(true);
    };

    // 중분류 수정 버튼
    const handleEdit = (EditKey) => {
        console.log(EditKey);
        setDataEdit(true);
        setOpen(true);
    };

    // 소분류 삭제
    const handleDel = () => {
        if (selectedRowKeys == '') {
            Modal.error({
                content: '[소분류] 삭제할 항목을 선택해주세요.'
            });
        } else {
            confirm({
                title: '[소분류] 선택한 소분류 항목을 삭제하시겠습니까?',
                icon: <ExclamationCircleFilled />,
                content: selectedRowKeys + ' 항목의 데이터',
                okText: '예',
                okType: 'danger',
                cancelText: '아니오',
                onOk() {
                    Modal.success({
                        content: '[소분류] 삭제완료'
                    });
                },
                onCancel() {
                    Modal.error({
                        content: '[소분류] 삭제취소'
                    });
                }
            });
        }
    };

    // 추가 및 수정 취소
    const onAddClose = () => {
        setOpen(false);
        setDataEdit(false);
        form.resetFields();
    };

    // 추가 및 수정 처리
    const onAddSubmit = () => {
        console.log(procGroupCdVal, procGroupNmVal, procGroupYnVal);
        if (dataEdit === true) {
            Modal.success({
                content: '수정 완료',
                onOk() {
                    setOpen(false);
                    setDataEdit(false);
                    handleTheoryGroup(props.procGroupCd_S);
                    form.resetFields();
                }
            });
        } else {
            Modal.success({
                content: '추가 완료',
                onOk() {
                    setOpen(false);
                    setDataEdit(false);
                    handleTheoryGroup(props.procGroupCd_S);
                    form.resetFields();
                }
            });
        }
    };
    useEffect(() => {
        // setloading(true);
        handleTheoryGroup(props.procGroupCd_S);
    }, [props.procGroupCd_S]);

    return (
        <>
            <Skeleton loading={loading} active>
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
                    pagination={false}
                    rowSelection={rowSelection}
                />
            </Skeleton>
            {/* 분류추가 폼 Start */}
            <Drawer
                title={`소분류 ${dataEdit === true ? '수정' : '추가'}`}
                onClose={onAddClose}
                open={open}
                width={400}
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
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="procGroupCd"
                                    defaultValue={procGroupCdVal}
                                    onChange={(e) => setProcGroupCdVal(e.target.value)}
                                    label="소분류 분류코드"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter Group Code'
                                        }
                                    ]}
                                >
                                    <Input placeholder="Please Enter Group Code" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="procGroupNm"
                                    defaultValue={procGroupCdVal}
                                    onChange={(e) => setProcGroupCdVal(e.target.value)}
                                    label="소분류 분류명"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter Group Name'
                                        }
                                    ]}
                                >
                                    <Input
                                        style={{
                                            width: '100%'
                                        }}
                                        placeholder="Please Enter Group Name"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item name="useYn" label="소분류 사용여부">
                                    <Switch
                                        checkedChildren="사용"
                                        unCheckedChildren="미사용"
                                        defaultValue={procGroupCdVal}
                                        onChange={(e) => setProcGroupCdVal(e.target.value)}
                                        style={{ width: '80px' }}
                                    />
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
