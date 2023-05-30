/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Typography } from '@mui/material';
import { Col, Row, Button, Form, Input, Select, Drawer, Table, Space, Tooltip, Switch, Radio, Modal, Badge, Card, Divider } from 'antd';
import 'antd/dist/antd.css';
import { PlusOutlined, EditFilled, DeleteFilled, ExclamationCircleFilled, AppstoreOutlined, BarsOutlined } from '@ant-design/icons';

// project import
import MainCard from 'components/MainCard';

import { XrayInformation } from 'pages/learning/curriculum/XrayInformation';

export const Curriculum = () => {
    const { confirm } = Modal;
    const [form] = Form.useForm();

    const [questionsModalOpen, setQuestionsModalOpen] = useState();
    const [question_props_value, setQuestion_props_value] = useState([]);
    const [questionmethod, setQuestionMethod] = useState('s'); // 문항방식 Slide/Cut 방식
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); //셀렉트 박스 option Selected 값
    const [open, setOpen] = useState(false);
    const [dataEdit, setDataEdit] = useState(false); // Drawer 수정 우측폼 상태

    // 제한 시간 Value 설정 Start
    const Minute_Opt = [];
    for (let i = 5; i <= 120; i += 5) {
        Minute_Opt.push({ value: i.toString(), label: i.toString() + '분' });
    }
    // 제한 시간 Value 설정 End

    const [dataSource, setDataSource] = useState([
        {
            rowdata0: '1',
            rowdata1: '물품연습 모듈',
            rowdata2: '0',
            rowdata3: '50',
            rowdata4: '2023-03-16'
        },
        {
            rowdata0: '2',
            rowdata1: '단계학습 모듈',
            rowdata2: '3',
            rowdata3: '30',
            rowdata4: '2023-03-16'
        },
        {
            rowdata0: '3',
            rowdata1: 'AI강화학습 모듈',
            rowdata2: '3',
            rowdata3: '40',
            rowdata4: '2023-03-16'
        },
        {
            rowdata0: '4',
            rowdata1: '평가',
            rowdata2: '2',
            rowdata3: '25',
            rowdata4: '2023-03-16'
        }
    ]);

    const defaultColumns = [
        {
            width: '80px',
            title: 'No.',
            dataIndex: 'rowdata0',
            align: 'center'
        },
        {
            title: '모듈명',
            dataIndex: 'rowdata1',
            align: 'center'
        },
        {
            title: '슬라이드 속도',
            dataIndex: 'rowdata2',
            align: 'center',
            render: (_, { rowdata2 }) => <> {rowdata2 === '0' ? '-' : rowdata2 + '초'} </>
        },
        {
            title: '출제 문항 수',
            dataIndex: 'rowdata3',
            align: 'center'
        },
        {
            title: '등록일자',
            dataIndex: 'rowdata4',
            align: 'center'
        },
        {
            width: '130px',
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

    // 출제 문항 검색 Modal Start
    const Questions_Modal = () => {
        setQuestionsModalOpen(true);
    };

    // 출제 문항 선택 완료 (Modal 닫기)
    const Questions_handleOk = (Question_Value) => {
        console.log('문제 출제:', Question_Value);
        setQuestion_props_value(Question_Value);
        setQuestionsModalOpen(false);
    };

    // 출제 문항 Modal 닫기
    const Questions_handleCancel = () => {
        setQuestionsModalOpen(false);
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

    // 추가 버튼
    const handleAdd = () => {
        setOpen(true);
        setDataEdit(false);
    };

    // 추가 취소
    const onAddClose = () => {
        setOpen(false);
        setDataEdit(false);
        form.resetFields();
    };

    // 수정 버튼
    const handleEdit = (EditKey) => {
        console.log(EditKey);
        setDataEdit(true);
        setOpen(true);
    };

    // 추가 및 수정 처리
    const onAddSubmit = () => {
        console.log(eduTypeIdVal, eduTypeNmVal, eduTypeDcVal, pointsStdIdVal, eduTypeYnVal);
        if (dataEdit === true) {
            Modal.success({
                content: '수정 완료',
                onOk() {
                    setOpen(false);
                    setDataEdit(false);
                    handleEduType();
                    form.resetFields();
                }
            });
        } else {
            Modal.success({
                content: '추가 완료',
                onOk() {
                    setOpen(false);
                    setDataEdit(false);
                    handleEduType();
                    form.resetFields();
                }
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

    const onChange = ({ target: { value } }) => {
        console.log(value);
        setQuestionMethod(value);
    };

    return (
        <>
            <MainCard title="커리큘럼 모듈 관리">
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
                        rowSelection={rowSelection}
                    />
                </Typography>
            </MainCard>

            {/* 추가 폼 Start */}
            <Drawer
                maskClosable={false}
                title={`학습 커리큘럼 모듈 ${dataEdit === true ? '수정' : '추가'}`}
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
                                <Form.Item
                                    name="ModuleName"
                                    label="모듈명"
                                    rules={[
                                        {
                                            required: true,
                                            message: '모듈명'
                                        }
                                    ]}
                                >
                                    <Input placeholder="# 모듈명" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    name="SlideSpeed"
                                    label="슬라이드(문제) 속도"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter Slide Speed.'
                                        }
                                    ]}
                                >
                                    <Select
                                        defaultValue={{
                                            value: 0,
                                            label: '# 속도'
                                        }}
                                        style={{
                                            width: '100%'
                                        }}
                                        options={[
                                            {
                                                value: '1',
                                                label: '1'
                                            },
                                            {
                                                value: '2',
                                                label: '2'
                                            },
                                            {
                                                value: '3',
                                                label: '3'
                                            },
                                            {
                                                value: '4',
                                                label: '4'
                                            },
                                            {
                                                value: '5',
                                                label: '5'
                                            }
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="QuestionType"
                                    label="학습방식 (평가/학습)"
                                    rules={[
                                        {
                                            required: true
                                        }
                                    ]}
                                >
                                    <Radio.Group onChange={onChange} buttonStyle="solid" defaultValue="s">
                                        <Radio.Button value="l"> 학습 </Radio.Button>
                                        <Radio.Button value="e"> 평가 </Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    name="QuestionType"
                                    label="모듈타입 (슬라이드 / 컷)"
                                    rules={[
                                        {
                                            required: true
                                        }
                                    ]}
                                >
                                    <Radio.Group onChange={onChange} buttonStyle="solid" defaultValue="s">
                                        <Radio.Button value="s"> Slide 방식 </Radio.Button>
                                        <Radio.Button value="c"> Cut 방식 </Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    name="QuestionType"
                                    label="금지물품 통과시 불합격 처리"
                                    rules={[
                                        {
                                            required: true
                                        }
                                    ]}
                                >
                                    <Radio.Group onChange={onChange} buttonStyle="solid" defaultValue="s">
                                        <Radio.Button value="Y"> 사용 </Radio.Button>
                                        <Radio.Button value="N"> 미사용 </Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    name="Level"
                                    label="난이도 레벨"
                                    rules={[
                                        {
                                            required: true
                                        }
                                    ]}
                                >
                                    <Select
                                        defaultValue={{
                                            value: 0,
                                            label: '# 난이도레벨'
                                        }}
                                        style={{
                                            width: '100%'
                                        }}
                                        options={[
                                            {
                                                value: '1',
                                                label: 'Level 1'
                                            },
                                            {
                                                value: '2',
                                                label: 'Level 2'
                                            },
                                            {
                                                value: '3',
                                                label: 'Level 3'
                                            },
                                            {
                                                value: '4',
                                                label: 'Level 4'
                                            },
                                            {
                                                value: '5',
                                                label: 'Level 5'
                                            }
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="limit_time "
                                    label="제한시간"
                                    rules={[
                                        {
                                            required: true
                                        }
                                    ]}
                                >
                                    <Select
                                        defaultValue={{
                                            value: 0,
                                            label: '# 제한시간'
                                        }}
                                        style={{
                                            width: '100%'
                                        }}
                                        options={Minute_Opt}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />
                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="useYn"
                                    label="사용여부"
                                    rules={[
                                        {
                                            required: true
                                        }
                                    ]}
                                >
                                    <Switch checkedChildren="사용" unCheckedChildren="미사용" style={{ width: '80px' }} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />
                        <Card bordered style={{ textAlign: 'center', margin: '20px 0' }}>
                            <Row>
                                <Col span={24}>
                                    <div>총 출제 문항 수</div>
                                    <Badge
                                        style={{ width: '40px', marginTop: '5px' }}
                                        count={question_props_value.length}
                                        color="#52c41a"
                                        overflowCount={9999}
                                    />
                                </Col>

                                {/* 테스트 */}
                                {/* {question_props_value.map((q) => {
                                    return <Col span={4}>{q}</Col>;
                                })} */}
                                {/* 테스트 */}
                            </Row>
                        </Card>
                        <Divider style={{ margin: '10px 0' }} />
                        <Row gutter={24}>
                            <Col span={24}>
                                <Button
                                    style={{ marginBottom: '30px', width: '100%', height: '40px', borderRadius: '5px' }}
                                    type="primary"
                                    onClick={Questions_Modal}
                                >
                                    출제 문항 검색
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </MainCard>
            </Drawer>
            {/* 추가 폼 End */}

            {/* 출제 문항 검색 Modal Start */}
            <Modal
                open={questionsModalOpen}
                closable={false}
                width={1200}
                style={{
                    left: 130,
                    zIndex: 999
                }}
                footer={[
                    <Button
                        type="primary"
                        onClick={Questions_handleCancel}
                        style={{ width: '100px', borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                    >
                        Close
                    </Button>
                ]}
            >
                <XrayInformation QuestionCnt={Questions_handleOk} />
            </Modal>
            {/* 출제 문항 검색 Modal End */}
        </>
    );
};
