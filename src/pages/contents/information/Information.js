/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Typography } from '@mui/material';
import { Col, Row, Button, Form, Input, Table, Select, Space, Tooltip, Tag, Drawer, Divider, Switch, Modal } from 'antd';
import { useGetInformationListMutation, useGetLanguageListMutation } from '../../../hooks/api/ContentsManagement/ContentsManagement';
import { PlusOutlined, EditFilled, DeleteFilled, ExclamationCircleFilled } from '@ant-design/icons';

// project import
import MainCard from 'components/MainCard';

export const InforMation = () => {
    const { confirm } = Modal;
    const { TextArea } = Input;
    const [form] = Form.useForm();

    const [getInformationList] = useGetInformationListMutation(); // 콘텐츠 정보 관리 hooks api호출
    const [informationList, setInformationList] = useState(); // 콘텐츠 정보관리 리스트 값
    const [getLanguageList] = useGetLanguageListMutation(); // 언어 hooks api호출
    const [languageSelect, setLanguageSelect] = useState([]); //셀렉트 박스 option Default 값
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); //셀렉트 박스 option Selected 값
    const [dataSource, setDataSource] = useState([]); // Table 데이터 값
    const [defaultLanguage, setDefaultLanguage] = useState('kr');
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false); // Drawer 추가 우측폼 상태
    const [dataEdit, setDataEdit] = useState(false); // Drawer 수정 우측폼 상태

    // 추가 및 수정 input 기본값 정리
    const [unitIdVal, setUnitIdVal] = useState();
    const [unitNmVal, setUnitNmVal] = useState();
    const [unitDcVal, setUnitDcVal] = useState();
    const [unitYnVal, setUnitYnVal] = useState();

    // 데이터 값 선언
    const handleGroup = async () => {
        const Informationresponse = await getInformationList({
            languageCode: defaultLanguage
        });
        setInformationList(Informationresponse?.data?.RET_DATA);
        setDataSource([
            ...Informationresponse?.data?.RET_DATA.map((d, i) => ({
                key: d.unitId,
                rowdata0: i + 1,
                rowdata1: d.unitGroupCd,
                rowdata2: d.unitId,
                rowdata3: d.unitName,
                rowdata4: d.unitDesc,
                rowdata5: d.useYn,
                rowdata6: d.useYnNm,
                rowdata7: d.parentUnitGroupCd,
                // rowdata8: d.languageCode
                // rowdata9: d.updateList,
                rowdata10: d.insertDate
                // rowdata11: d.insertId
                //rowdata12: d.updateDate,
                //rowdata13: d.updateId
            }))
        ]);
        setLoading(false);
    };

    // 언어 셀렉트 Default 값 선언
    const handleLanguage = async () => {
        const Languageresponse = await getLanguageList({});
        setLanguageSelect([
            ...Languageresponse?.data?.RET_DATA?.map((lan) => ({
                value: lan.languageCode,
                label: lan.languageName
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
                // Data값이 변경될 경우 체크박스 체크
                if (record[dataIndex] !== values[dataIndex]) {
                    selectedRowKeys.length <= '0'
                        ? onSelectChange([...selectedRowKeys, record.key])
                        : selectedRowKeys.map((srk) => (srk === record.key ? '' : onSelectChange([...selectedRowKeys, record.key])));
                }
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
            width: '40px',
            title: 'No',
            dataIndex: 'rowdata0',
            align: 'center'
        },
        {
            width: '150px',
            title: '물품분류코드',
            dataIndex: 'rowdata1',
            align: 'center'
        },
        {
            width: '100px',
            title: '물품ID',
            dataIndex: 'rowdata2',
            align: 'center'
        },
        {
            width: '190px',
            title: '물품명',
            dataIndex: 'rowdata3',
            align: 'center',
            render: (_, { rowdata3 }) => <>{rowdata3 === '' || rowdata3 === null ? '-' : rowdata3}</>
        },
        {
            title: '물품설명',
            dataIndex: 'rowdata4',
            align: 'center',
            render: (_, { rowdata4 }) => <>{rowdata4 === '' || rowdata4 === null ? '-' : rowdata4}</>
        },
        {
            width: '100px',
            title: '사용여부',
            dataIndex: 'rowdata5',
            align: 'center',
            render: (_, { rowdata5, rowdata6 }) => (
                <>
                    {rowdata5 === '1' ? (
                        <Tag color={'green'} key={rowdata5}>
                            {rowdata6}
                        </Tag>
                    ) : (
                        <Tag color={'volcano'} key={rowdata5}>
                            {rowdata6}
                        </Tag>
                    )}
                </>
            )
        },
        {
            width: '120px',
            title: '등록일자',
            dataIndex: 'rowdata10',
            align: 'center',
            render: (_, { rowdata10 }) => <>{rowdata10 === '' || rowdata10 === null ? '-' : rowdata10}</>
        },
        {
            width: '150px',
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

    // 체크 박스 이벤트
    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    // 체크 박스 선택
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange
    };

    // 추가 버튼
    const handleAdd = () => {
        setDataEdit(false);
        setOpen(true);
    };

    // 수정버튼
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
                },
                onCancel() {
                    Modal.error({
                        content: '삭제취소'
                    });
                }
            });
        }
    };

    const onChange = (value) => {
        console.log(`selected ${value}`);
        setDefaultLanguage(value);
    };

    const onSearch = (value) => {
        console.log('search:', value);
    };

    // 추가 취소
    const onAddClose = () => {
        setOpen(false);
        setDataEdit(false);
        form.resetFields();
    };

    // 추가 및 수정 처리
    const onAddSubmit = () => {
        console.log(unitIdVal, unitNmVal, unitDcVal, unitYnVal);
        if (dataEdit === true) {
            Modal.success({
                content: '수정 완료',
                onOk() {
                    setOpen(false);
                    setDataEdit(false);
                    handleGroup();
                    handleLanguage();
                    form.resetFields();
                }
            });
        } else {
            Modal.success({
                content: '추가 완료',
                onOk() {
                    setOpen(false);
                    setDataEdit(false);
                    handleGroup();
                    handleLanguage();
                    form.resetFields();
                }
            });
        }
    };

    useEffect(() => {
        setLoading(true); // 로딩 호출
        handleGroup(); // 그룹 api 호출
        handleLanguage(); // 언어 api 호출
    }, [defaultLanguage]);

    return (
        <>
            <MainCard title="정보 관리">
                <Typography variant="body1">
                    <Row style={{ marginBottom: 16 }}>
                        <Col span={8}>
                            <Select
                                showSearch
                                placeholder=" Language Select "
                                optionFilterProp="children"
                                onChange={onChange}
                                onSearch={onSearch}
                                options={[...languageSelect]}
                            />
                        </Col>
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
                        components={components}
                        rowClassName={() => 'editable-row'}
                        bordered={true}
                        dataSource={dataSource}
                        loading={loading}
                        columns={columns}
                        rowSelection={rowSelection}
                    />
                </Typography>
            </MainCard>

            {/* 정보관리 추가 폼 Start */}
            <Drawer
                title={`정보 관리 ${dataEdit === true ? '수정' : '추가'}`}
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
                                    name="unitId"
                                    defaultValue={unitIdVal}
                                    onChange={(e) => setUnitIdVal(e.target.value)}
                                    label="물품ID"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter Language Name'
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
                                    name="unitName"
                                    defaultValue={unitNmVal}
                                    onChange={(e) => setUnitNmVal(e.target.value)}
                                    label="물품명"
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
                                <Form.Item
                                    name="unitDesc"
                                    defaultValue={unitDcVal}
                                    onChange={(e) => setUnitDcVal(e.target.value)}
                                    label="물품설명"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter Notice Contents'
                                        }
                                    ]}
                                >
                                    <TextArea
                                        placeholder="Please Enter Notice Contents"
                                        autoSize={{
                                            minRows: 5,
                                            maxRows: 10
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="useYn"
                                    defaultValue={unitYnVal}
                                    onChange={(e) => setUnitYnValVal(e.target.value)}
                                    label="사용여부"
                                >
                                    <Switch checkedChildren="사용" unCheckedChildren="미사용" style={{ width: '80px' }} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </MainCard>
            </Drawer>
            {/* 정보관리 추가 폼 End */}
        </>
    );
};
