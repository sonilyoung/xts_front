/* eslint-disable*/
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Typography } from '@mui/material';
import { Col, Row, Button, Form, Input, Table, Select, Space, Tooltip, Tag, Badge, Divider, Card, Modal ,Drawer } from 'antd';
import 'antd/dist/antd.css';
import { useGetLanguageApplyListMutation,useInsertLanguageApplyMutation,useGetLanguageApplyMutation,useDeleteLanguageApplyMutation,useUpdateLanguageApplyMutation } from '../../hooks/api/SystemManagement/SystemManagement';
import {
    useGetLanguageListMutation
} from '../../hooks/api/ContentsManagement/ContentsManagement';
import { PlusOutlined, EditFilled, DeleteFilled, ExclamationCircleFilled } from '@ant-design/icons';

// project import
import MainCard from 'components/MainCard';

export const SystemMessage = () => {
    const { confirm } = Modal;
    const [form] = Form.useForm();

    const [getLanguageApplyList] = useGetLanguageApplyListMutation(); //목록 hooks api호출
    const [getLanguage] = useGetLanguageApplyMutation(); //상세 hooks api호출
    const [insertLanguage] = useInsertLanguageApplyMutation(); //등록 hooks api호출
    const [deleteLanguage] = useDeleteLanguageApplyMutation(); //삭제 hooks api호출
    const [updateLanguage] = useUpdateLanguageApplyMutation(); //수정 hooks api호출
    const [getLanguageList] = useGetLanguageListMutation(); // 언어 hooks api호출

    const [dataSource, setDataSource] = useState([]); // Table 데이터 값
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); //셀렉트 박스 option Selected 값
    const [loading, setLoading] = useState(false); // 로딩 초기값
    const [open, setOpen] = useState(false); // Drawer 추가 우측폼 상태
    const [dataEdit, setDataEdit] = useState(false); // Drawer 수정 우측폼 상태

    // 추가 및 수정 input 기본값 정리
    const [languageCdVal, setLanguageCdVal] = useState();
    const [unitParams, setUnitParams] = useState({});
    const [refresh, setRefresh] = useState(false); //리프레쉬
    const [languageCode, setLanguageCode] = useState('kor');
    const [languageSelect, setLanguageSelect] = useState([]); //셀렉트 박스 option Default 값

    const handleLanguage = async () => {
        const Languageresponse = await getLanguageApplyList({
            //"groupId" : "login",    
            "languageCode" : languageCode             
        });
        
        setDataSource([
            ...Languageresponse?.data?.RET_DATA.map((d, i) => 
            ({
                key: d.codeNo,
                rowdata0: i + 1,
                rowdata1: d.codeDesc,//구분
                rowdata2: d.groupId,//그룹코드 
                rowdata3: d.codeName,//메세지코드
                rowdata4: d[d.groupId+d.sortOrder]//메세지
            }))
        ]);
        setLoading(false);
    };

    // 언어 셀렉트 Default 값 선언
    const selectLanguage = async () => {
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
            width: '80px',
            title: 'No',
            dataIndex: 'rowdata0',
            align: 'center'
        },
        {
            title: '구분',
            dataIndex: 'rowdata1',
            align: 'center'
        },
        {
            title: '그룹코드',
            dataIndex: 'rowdata2',
            align: 'center'
        },
        {
            title: '메세지코드',
            dataIndex: 'rowdata3',
            align: 'center'
        },        
        {
            title: '메세지',
            dataIndex: 'rowdata4',
            align: 'center'
        },        
        {
            width: '100px',
            title: '수정',
            render: (rowdata1) => (
                <>
                    <Tooltip title="수정" color="#108ee9">
                        <Button  onClick={()=>handleUnitMod({rowdata1})} type="primary" style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }} icon={<EditFilled />}>
                            수정
                        </Button>
                    </Tooltip>
                </>
            ),
            align: 'center'
        }       
    ];

    // const handleDelete = (key) => {
    //     const newData = dataSource.filter((item) => item.key !== key);
    //     setDataSource(newData);
    // };

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

    // 추가
    const handleAdd = () => {
        console.log('언어 추가');
        setDataEdit(false);
        setOpen(true);
        setUnitParams(null);
        form.resetFields();
    };

    // 물품 수정 버튼
    const handleUnitMod = async (e) => {
        
        console.log('groupId:', e.rowdata1.rowdata2);
        console.log('codeName:', e.rowdata1.rowdata3);
        const response = await getLanguage({
            "groupId" : e.rowdata1.rowdata2,
            "codeName" : e.rowdata1.rowdata3,
            "languageCode" : languageCode
        });
        
        //console.log('unitName2:',response.data.RET_DATA.unitName);
        setUnitParams(response.data.RET_DATA);
        //params = response.data.RET_DATA;
        form.resetFields();
        setDataEdit(true);        
        setOpen(true);
        
    };       
    
    // 추가 취소
    const onAddClose = () => {
        setOpen(false);
        setDataEdit(false);
        setUnitParams(null);
        form.resetFields();
    };

    // 추가 등록
    const insertSubmit = async() => {

        const response = await insertLanguage({
            "languageCode" : unitParams?.languageCode, 
            "groupId" :  unitParams?.groupId, 
            "sortOrder" : unitParams?.sortOrder,   
            "codeValue" : unitParams?.codeValue,    
            "codeName" : unitParams?.codeName,    
            "codeDesc" : unitParams?.codeDesc,    
        });

        setRefresh(response);
        Modal.success({
            content: '추가 완료',
            onOk() {
                setOpen(false);
                setDataEdit(false);
                form.resetFields();
            }
        });
    };

    // 수정
    const updateSubmit = async() => {
        console.log(unitParams);
        const response = await updateLanguage({
            "codeNo" : unitParams?.codeNo,
            "languageCode" : unitParams?.languageCode, 
            "groupId" :  unitParams?.groupId, 
            "sortOrder" : unitParams?.sortOrder,   
            "codeValue" : unitParams?.codeValue,    
            "codeName" : unitParams?.codeName,    
            "codeDesc" : unitParams?.codeDesc,    
        });

        setRefresh(response);
        Modal.success({
            content: '수정 완료',
            onOk() {
                setOpen(false);
                setDataEdit(false);
                form.resetFields();
            }
        });        
    };    

    // 삭제
    const deleteSubmit = async() => {
        const response = await deleteLanguage({
            "codeNo" : unitParams?.codeNo
        });

        setRefresh(response);
        Modal.success({
            content: '삭제 완료',
            onOk() {
                setOpen(false);
                setDataEdit(false);
                form.resetFields();
            }
        });
    };    

    // 수정 버튼
    const handleEdit = (EditKey) => {
        console.log(EditKey);
        setUnitParams({ ...unitParams, "codeNo": EditKey })
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

    const handelUser = () => {
        console.log('사용여부');
    };

    const onChange = (value) => {
        console.log(`selected ${value}`);
        setLanguageCode(value);
    };

    const onSearch = (value) => {
        console.log('search:', value);
    };

    useEffect(() => {
        setLoading(true);
        handleLanguage();
        selectLanguage();
    }, [languageCode, refresh]);

    return (
        <>
            <MainCard title="시스템 메세지 관리">
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
                        //rowSelection={rowSelection}
                    />
                </Typography>
            </MainCard>

            {/* 언어추가 폼 Start */}
            <Drawer
                maskClosable={false}
                title={`언어 ${dataEdit === true ? '수정' : '추가'}`}
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
                                        onClick={updateSubmit}
                                        style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                        type="primary"
                                    >
                                        수정
                                    </Button>
                                </Tooltip>
                            ) : (
                                <Tooltip title="추가" placement="bottom" color="#108ee9">
                                    <Button
                                        onClick={insertSubmit}
                                        style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                        type="primary"
                                    >
                                        저장
                                    </Button>
                                </Tooltip>
                            )}
                            <Tooltip title="삭제">
                                <Button type="danger" onClick={deleteSubmit} style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}>
                                    삭제
                                </Button>
                            </Tooltip>                            
                        </Space>
                    </>
                }
            >
                <MainCard>
                    <Form layout="vertical" form={form}>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    label="구분"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter codeDesc'
                                        }
                                    ]}
                                >
                                    <Input 
                                        name="codeDesc"
                                        value={unitParams?.codeDesc}
                                        defaultValue={unitParams?.codeDesc}
                                        onChange={(e) => setUnitParams({ ...unitParams, "codeDesc": e.target.value })}                                    
                                        placeholder="Please Enter codeDesc" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    label="그룹코드"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter groupId'
                                        }
                                    ]}
                                >
                                    <Input
                                        name="groupId"
                                        value={unitParams?.groupId}
                                        defaultValue={unitParams?.groupId}
                                        onChange={(e) => setUnitParams({ ...unitParams, "groupId": e.target.value })}                                    
                                        style={{
                                            width: '100%'
                                        }}
                                        placeholder="Please Enter groupId"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    label="메세지코드"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter codeName'
                                        }
                                    ]}
                                >
                                    <Input
                                        name="codeName"
                                        value={unitParams?.codeName}
                                        defaultValue={unitParams?.codeName}
                                        onChange={(e) => setUnitParams({ ...unitParams, "codeName": e.target.value })}                                    
                                        style={{
                                            width: '100%'
                                        }}
                                        placeholder="Please Enter codeName"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    label="메세지"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter codeValue'
                                        }
                                    ]}
                                >
                                    <Input
                                        name="codeValue"
                                        value={unitParams?.codeValue}
                                        defaultValue={unitParams?.codeValue}
                                        onChange={(e) => setUnitParams({ ...unitParams, "codeValue": e.target.value })}                                    
                                        style={{
                                            width: '100%'
                                        }}
                                        placeholder="Please Enter codeValue"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>     
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    label="정렬"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter sortOrder'
                                        }
                                    ]}
                                >
                                    <Input
                                        name="sortOrder"
                                        value={unitParams?.sortOrder}
                                        defaultValue={unitParams?.sortOrder}
                                        onChange={(e) => setUnitParams({ ...unitParams, "sortOrder": e.target.value })}                                    
                                        style={{
                                            width: '100%'
                                        }}
                                        placeholder="Please Enter sortOrder"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>                                                                      
                        <Divider style={{ margin: '10px 0' }} />
                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="languageCode"
                                    label="언어 선택"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter languageCode'
                                        }
                                    ]}
                                >
                                <Select
                                    defaultValue={unitParams?.languageCode}
                                    onChange={(e) => setUnitParams({ ...unitParams, "languageCode": e })}
                                    style={{
                                        width: '100%'
                                    }}
                                    options={[
                                        {
                                            value: 'kor',
                                            label: '한국어'
                                        },
                                        {
                                            value: 'eng',
                                            label: '영어'
                                        },
                                    ]}
                                />
                                </Form.Item>
                            </Col>
                        </Row>                       
                    </Form>
                </MainCard>
            </Drawer>
            {/* 언어추가 폼 End */}
        </>
    );
};
