/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Col, Row, Button, Form, Input, Table, Checkbox, Drawer, Space, Tooltip, Divider, Skeleton, Modal } from 'antd';
import { Typography } from '@mui/material';
import { useGetEduBaselineMenuListMutation, useGetEduBaselineMenuSubListMutation } from '../../../hooks/api/EduManagement/EduManagement';
import { LineOutlined, PlusOutlined, EditFilled, DeleteFilled, ExclamationCircleFilled } from '@ant-design/icons';

// project import
import MainCard from 'components/MainCard';
import { InputNumber } from '../../../../node_modules/antd/lib/index';

export const EduBaselineMenu = () => {
    const { confirm } = Modal;
    const [form] = Form.useForm();

    const [getEduBaselineMenuList] = useGetEduBaselineMenuListMutation();
    const [getEduBaselineMenuSubList] = useGetEduBaselineMenuSubListMutation();

    const [eduBaselineMenuList, setEduBaselineMenuList] = useState();
    const [eduBaselineMenuSubList, setEduBaselineMenuSubList] = useState();

    const [eduBaselineMenuSub_Cho, setEduBaselineMenuSub_Cho] = useState();

    const [dataSource, setDataSource] = useState([]);
    const [dataSourceSub, setDataSourceSub] = useState([]);

    const [selectedRowKeys, setSelectedRowKeys] = useState([]); //셀렉트 박스 option Selected 값(대분류)

    const [loading, setLoading] = useState(false);
    const [loadingSub, setLoadingSub] = useState(false);
    const [open, setOpen] = useState(false); // Drawer 추가 우측폼 상태
    const [dataEdit, setDataEdit] = useState(false); // Drawer 수정 우측폼 상태
    const [procYearVal, setProcYearVal] = useState(); //  교육년도 입력값
    const [procNmVal, setProcNmVal] = useState(); // 과정명 입력값
    const [procSeqVal, setProcSeqVal] = useState(); // 차수 입력값

    const handleEduBaselineMenu = async () => {
        const eduBaselineMenuresponse = await getEduBaselineMenuList({
            searchType: '1',
            procGroupCd: ''
        });
        setEduBaselineMenuList(eduBaselineMenuresponse?.data?.RET_DATA);
        setDataSource([
            ...eduBaselineMenuresponse?.data?.RET_DATA.map((d, i) => ({
                key: d.procCd,
                rowdata0: i + 1,
                rowdata1: d.procCd /* 키값 */,
                rowdata2: d.procYear /* 년도 */,
                rowdata3: d.procSeq /* 차수 */,
                rowdata4: d.procNm /* 과정명 */,
                rowdata5: d.menuNo,
                rowdata6: d.menuNm,
                rowdata7: d.menuCd
            }))
        ]);
        setLoading(false);
    };

    const handleEduBaselineMenuSub = async (procCd, procYear, procSeq) => {
        console.log(procCd, procYear, procSeq);
        const eduBaselineMenuresponseSub = await getEduBaselineMenuSubList({
            procCd: procCd,
            procYear: procYear,
            procSeq: procSeq
        });
        setEduBaselineMenuSubList(eduBaselineMenuresponseSub?.data?.RET_DATA);
        setDataSourceSub([
            ...eduBaselineMenuresponseSub?.data?.RET_DATA.map((s, i) => ({
                key: s.codeNo,
                rowdata0: i + 1,
                rowdata1: s.procCd,
                rowdata2: s.procYear,
                rowdata3: s.procSeq,
                rowdata4: s.procNm,
                rowdata5: s.menuNo /* 키값 */,
                rowdata6: s.menuNm /* 메뉴명 */,
                rowdata7: s.menuCd /* 메뉴코드 */
            }))
        ]);
        setLoadingSub(false);
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
                    <Tooltip title="Click">
                        <div>{text}</div>
                    </Tooltip>
                </div>
            )
        },
        {
            width: '90px',
            title: '교육년도',
            dataIndex: 'rowdata2',
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
            title: '과정명',
            key: 'tags',
            dataIndex: 'rowdata4',
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
            width: '80px',
            title: '교육차수',
            dataIndex: 'rowdata3',
            align: 'center',
            render: (_, { rowdata3 }) => (
                <>
                    <div style={{ cursor: 'pointer' }}>
                        <Tooltip title="Click">
                            <div>{rowdata3}차</div>
                        </Tooltip>
                    </div>
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
            width: '40px',
            title: <Checkbox />,
            dataIndex: '',
            render: (_, record) => (dataSourceSub.length >= 1 ? <Checkbox onChange={onChange}></Checkbox> : null),
            align: 'center'
        },
        {
            width: '60px',
            title: 'No',
            dataIndex: 'rowdata0',
            align: 'center'
        },
        {
            title: '설명',
            dataIndex: 'rowdata6',
            render: (_, { rowdata6 }) => (
                <>
                    <span style={{ marginRight: '5px' }}>
                        <LineOutlined />
                    </span>
                    {rowdata6}
                </>
            )
        },
        {
            width: '120px',
            title: '메뉴코드',
            key: 'tags',
            dataIndex: 'rowdata7',
            align: 'center'
        }
    ];

    const handleDelete = (key) => {
        const newData = dataSource.filter((item) => item.key !== key);
        setDataSource(newData);
    };

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

    //체크 박스 선택
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange
    };

    // 추가
    const handleAdd = () => {
        setDataEdit(false);
        setOpen(true);
    };

    // 수정 버튼
    const handleEdit = (EditKey) => {
        console.log(EditKey);
        setDataEdit(true);
        setOpen(true);
    };

    // 삭제
    const handleDel = () => {
        if (selectedRowKeys == '') {
            Modal.error({
                content: '삭제할 항목을 선택해주세요.'
            });
        } else {
            confirm({
                title: '선택한 대분류 항목을 삭제하시겠습니까?',
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

    const onChange = (e) => {
        console.log(`checked = ${e.target.checked}`);
    };

    // 추가 및 수정 취소
    const onAddClose = () => {
        setDataEdit(false);
        setOpen(false);
        form.resetFields();
    };

    // 추가 및 수정 처리
    const baselinemenuSubmit = () => {
        console.log(procYearVal, procNmVal, procSeqVal);
        if (dataEdit === true) {
            Modal.success({
                content: '수정 완료',
                onOk() {
                    setOpen(false);
                    setDataEdit(false);
                    handleEduBaselineMenu();
                    form.resetFields();
                }
            });
        } else {
            Modal.success({
                content: '추가 완료',
                onOk() {
                    setOpen(false);
                    setDataEdit(false);
                    handleEduBaselineMenu();
                    form.resetFields();
                }
            });
        }
    };

    useEffect(() => {
        setLoading(true);
        handleEduBaselineMenu();
    }, []);

    return (
        <>
            <MainCard title="차수별 메뉴관리">
                <Typography variant="body1">
                    <Row gutter={[16, 12]}>
                        {/* 좌측 영역 */}
                        <Col span={12}>
                            <Row style={{ marginBottom: 16 }}>
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
                                                style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                                onClick={handleEdit}
                                                icon={<EditFilled />}
                                            >
                                                수정
                                            </Button>
                                        </Tooltip> */}
                                        <Tooltip title="삭제">
                                            <Button
                                                type="primary"
                                                danger
                                                style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                                onClick={handleDel}
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
                                dataSource={dataSource}
                                loading={loading}
                                columns={columns}
                                pagination={false}
                                rowSelection={rowSelection}
                                onRow={(record) => {
                                    return {
                                        onClick: () => {
                                            if (record.rowdata1 !== eduBaselineMenuSub_Cho) {
                                                setLoadingSub(true);
                                                setEduBaselineMenuSub_Cho(record.rowdata1);
                                                handleEduBaselineMenuSub(record.rowdata1, record.rowdata2, record.rowdata3);
                                            }
                                        }
                                    };
                                }}
                            />
                        </Col>
                        {/* 우측 영역 */}
                        <Col span={12}>
                            <Skeleton loading={loadingSub} active>
                                <Row style={{ marginBottom: 47 }}>
                                    <Col span={12} offset={12} style={{ textAlign: 'right' }}></Col>
                                </Row>
                                <Table
                                    size="small"
                                    components={componentsSub}
                                    rowClassName={() => 'editable-row'}
                                    bordered={true}
                                    dataSource={dataSourceSub}
                                    loading={loadingSub}
                                    columns={columnsSub}
                                    pagination={false}
                                />
                            </Skeleton>
                        </Col>
                    </Row>
                </Typography>
            </MainCard>

            {/* 분류추가 폼 Start */}
            <Drawer
                maskClosable={false}
                title={`차수별 메뉴관리 ${dataEdit === true ? '수정' : '추가'}`}
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
                                        onClick={baselinemenuSubmit}
                                        style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                        type="primary"
                                    >
                                        수정
                                    </Button>
                                </Tooltip>
                            ) : (
                                <Tooltip title="추가" placement="bottom" color="#108ee9">
                                    <Button
                                        onClick={baselinemenuSubmit}
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
                                            message: '교육년도를 입력해주세요.'
                                        }
                                    ]}
                                >
                                    <InputNumber
                                        style={{
                                            width: '100%'
                                        }}
                                        addonAfter="년"
                                        placeholder="교육년도를 입력해주세요."
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="procNm"
                                    defaultValue={procNmVal}
                                    onChange={(e) => setProcNmVal(e.target.value)}
                                    label="과정명"
                                    rules={[
                                        {
                                            required: true,
                                            message: '과정명을 입력해주세요.'
                                        }
                                    ]}
                                >
                                    <Input
                                        style={{
                                            width: '100%'
                                        }}
                                        placeholder="과정명을 입력해주세요."
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="procSeq"
                                    defaultValue={procSeqVal}
                                    onChange={(e) => setProcSeqVal(e.target.value)}
                                    label="차수"
                                    rules={[
                                        {
                                            required: true,
                                            message: '차수를 입력해 주세요.'
                                        }
                                    ]}
                                >
                                    <InputNumber
                                        style={{
                                            width: '100%'
                                        }}
                                        addonAfter="차"
                                        placeholder="차수를 입력해 주세요."
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
// export default EduBaselineMenu;
