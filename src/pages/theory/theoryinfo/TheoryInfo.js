/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import {
    Col,
    Row,
    Button,
    Form,
    Input,
    Select,
    Drawer,
    Table,
    Space,
    Tooltip,
    Switch,
    Radio,
    Modal,
    Card,
    Divider,
    Tag,
    Upload,
    message
} from 'antd';
import 'antd/dist/antd.css';
import { PlusOutlined, EditFilled, DeleteFilled, ExclamationCircleFilled, DeleteOutlined, UploadOutlined } from '@ant-design/icons';

import { useDropzone } from 'react-dropzone';

// project import
import MainCard from 'components/MainCard';

import { XrayInformation } from 'pages/learning/curriculum/XrayInformation';

export const TheoryInfo = () => {
    const { confirm } = Modal;
    const [form] = Form.useForm();

    const [questionsModalOpen, setQuestionsModalOpen] = useState();
    const [question_props_value, setQuestion_props_value] = useState([]);
    const [questionmethod, setQuestionMethod] = useState('s'); // 문항방식 Slide/Cut 방식
    const [loading, setLoading] = useState(false);
    const [uploading, setUpLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); //셀렉트 박스 option Selected 값
    const [open, setOpen] = useState(false);
    const [dataEdit, setDataEdit] = useState(false); // Drawer 수정 우측폼 상태
    const [questionType, setQuestionType] = useState(); // 문제 유형

    const [uploadedImages, setUploadedImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    // 이미지 업로드 Start
    const handleDrop = (acceptedFiles) => {
        const remainingSlots = 4 - uploadedImages.length;
        const filesToUpload = acceptedFiles.slice(0, remainingSlots);
        filesToUpload.forEach((file) => {
            // 이미지 파일 유효성 검사 및 처리
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                message.error('You can only upload JPG/PNG file!');
                return;
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('Image must be smaller than 2MB!');
                return;
            }

            // 파일 정보 및 base64 변환
            const reader = new FileReader();
            reader.onload = () => {
                const base64Image = reader.result;
                const uploadedImage = {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    base64Image: base64Image
                };
                // 업로드된 이미지 추가
                setUploadedImages((prevImages) => [...prevImages, uploadedImage]);
                console.log(uploadedImage);
            };
            reader.readAsDataURL(file);
        });
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: handleDrop });

    // 이미지 정답 라디오버튼 클릭
    const handleImageSelect = (image) => {
        setSelectedImage(image);
    };

    // 이미지 삭제
    const handleImageDelete = (index) => {
        const updatedImages = [...uploadedImages];
        updatedImages.splice(index, 1);
        setUploadedImages(updatedImages);
    };

    // 이미지 업로드 End

    // 제한 시간 Value 설정 Start
    const Minute_Opt = [];
    for (let i = 5; i <= 120; i += 5) {
        Minute_Opt.push({ value: i.toString(), label: i.toString() + '분' });
    }
    // 제한 시간 Value 설정 End

    const [dataSource, setDataSource] = useState([
        {
            key: '1',
            rowdata0: '1',
            rowdata1: 'S000001',
            rowdata2: '사지선다형',
            rowdata3: '2레벨',
            rowdata4: '발전소 반입 금지 물품은 무엇입니까?',
            rowdata5: '테스트',
            rowdata6: '사용',
            rowdata7: '2023-05-27'
        },
        {
            key: '2',
            rowdata0: '2',
            rowdata1: 'S000002',
            rowdata2: '사지선다형',
            rowdata3: '3레벨',
            rowdata4: 'What are the power plants bring prohihited goods?',
            rowdata5: '관리자',
            rowdata6: '사용',
            rowdata7: '2023-05-27'
        },
        {
            key: '3',
            rowdata0: '3',
            rowdata1: 'S000003',
            rowdata2: '사지선다형',
            rowdata3: '1레벨',
            rowdata4: '테스트 입니다.',
            rowdata5: '테스트',
            rowdata6: '사용',
            rowdata7: '2023-05-27'
        },
        {
            key: '4',
            rowdata0: '4',
            rowdata1: 'S000004',
            rowdata2: '사지선다형',
            rowdata3: '1레벨',
            rowdata4: '테스트 중입니다.',
            rowdata5: '테스트',
            rowdata6: '사용',
            rowdata7: '2023-05-28'
        },
        {
            key: '5',
            rowdata0: '5',
            rowdata1: 'S000005',
            rowdata2: '사지선다형',
            rowdata3: '2레벨',
            rowdata4: '발전소 반입 금지 물품은 무엇입니까?',
            rowdata5: '테스트',
            rowdata6: '사용',
            rowdata7: '2023-05-28'
        }
    ]);

    const defaultColumns = [
        {
            width: '80px',
            title: 'No',
            dataIndex: 'rowdata0',
            align: 'center'
        },
        {
            title: '문제ID',
            dataIndex: 'rowdata1',
            align: 'center'
        },
        {
            title: '문제타입',
            dataIndex: 'rowdata2',
            align: 'center'
        },
        {
            title: '학습레벨',
            dataIndex: 'rowdata3',
            align: 'center'
        },
        {
            title: '질문',
            dataIndex: 'rowdata4',
            align: 'center'
        },
        {
            title: '출제자',
            dataIndex: 'rowdata5',
            align: 'center'
        },
        {
            title: '사용여부',
            key: 'tags',
            dataIndex: 'rowdata6',
            render: (_, { rowdata6 }) => (
                <>
                    {rowdata6 === '사용' ? (
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
            title: '등록일자',
            dataIndex: 'rowdata7',
            align: 'center'
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
            <MainCard title="정보 관리">
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
                title={`정보 관리 ${dataEdit === true ? '수정' : '추가'}`}
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
                            <Col span={12}>
                                <Form.Item
                                    name="Level"
                                    label="학습 레벨"
                                    rules={[
                                        {
                                            required: true
                                        }
                                    ]}
                                >
                                    <Select
                                        defaultValue={{
                                            value: 0,
                                            label: '# 학습 레벨'
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
                                    name="Question_Type"
                                    label="문제 타입"
                                    rules={[
                                        {
                                            required: true
                                        }
                                    ]}
                                >
                                    <Select
                                        defaultValue={{
                                            value: { questionType },
                                            label: '# 문제 유형'
                                        }}
                                        style={{
                                            width: '100%'
                                        }}
                                        options={[
                                            {
                                                value: '1',
                                                label: '사지선다형'
                                            },
                                            {
                                                value: '2',
                                                label: 'O/X형'
                                            },
                                            {
                                                value: '3',
                                                label: '이미지선다형'
                                            },
                                            {
                                                value: '4',
                                                label: '이미지+사지선다형'
                                            }
                                        ]}
                                        onChange={(value) => setQuestionType(value)}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />
                        <Form.Item
                            name="Level"
                            label="문제 타입"
                            rules={[
                                {
                                    required: true
                                }
                            ]}
                        >
                            <Row gutter={24}>
                                <Col span={8}>
                                    <Select
                                        defaultValue={{
                                            value: 0,
                                            label: '# 대분류'
                                        }}
                                        style={{
                                            width: '100%'
                                        }}
                                        options={[
                                            {
                                                value: '1',
                                                label: '대분류'
                                            }
                                        ]}
                                    />
                                </Col>
                                <Col span={8}>
                                    <Select
                                        defaultValue={{
                                            value: 0,
                                            label: '# 중분류'
                                        }}
                                        style={{
                                            width: '100%'
                                        }}
                                        options={[
                                            {
                                                value: '1',
                                                label: '중분류'
                                            }
                                        ]}
                                    />
                                </Col>
                                <Col span={8}>
                                    <Select
                                        defaultValue={{
                                            value: 0,
                                            label: '# 소분류'
                                        }}
                                        style={{
                                            width: '100%'
                                        }}
                                        options={[
                                            {
                                                value: '1',
                                                label: '소분류'
                                            }
                                        ]}
                                    />
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
                        </Form.Item>
                        {questionType === '1' ? (
                            <>
                                <Divider style={{ margin: '10px 0' }} />
                                <Card bordered style={{ height: '110px' }}>
                                    <Row>
                                        <Col span={24}>
                                            <Form.Item
                                                name="Question"
                                                label="질문"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Please Enter Question.'
                                                    }
                                                ]}
                                            >
                                                <Input placeholder="# 질문" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Card>
                                <p style={{ margin: '10px 0' }} />
                                <Card bordered>
                                    <Row gutter={24}>
                                        <Col span={12}>
                                            <Form.Item
                                                name="Question"
                                                label="정답"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Please Enter Question.'
                                                    }
                                                ]}
                                            >
                                                <Input placeholder="# 정답" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                name="Question"
                                                label="오답"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Please Enter Question.'
                                                    }
                                                ]}
                                            >
                                                <Input placeholder="# 오답" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={24}>
                                        <Col span={12}>
                                            <Form.Item
                                                name="Question"
                                                label="오답"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Please Enter Question.'
                                                    }
                                                ]}
                                            >
                                                <Input placeholder="# 오답" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                name="Question"
                                                label="오답"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Please Enter Question.'
                                                    }
                                                ]}
                                            >
                                                <Input placeholder="# 오답" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Card>
                            </>
                        ) : questionType === '2' ? (
                            <>
                                <Divider style={{ margin: '10px 0' }} />
                                <Card bordered style={{ height: '110px' }}>
                                    <Row gutter={24}>
                                        <Col span={24}>
                                            <Form.Item
                                                name="Question"
                                                label="질문"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Please Enter Question.'
                                                    }
                                                ]}
                                            >
                                                <Input placeholder="# 질문" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Card>
                                <p style={{ margin: '10px 0' }} />
                                <Row gutter={24}>
                                    <Col span={12}>
                                        <Form.Item
                                            name="QuestionType"
                                            label="정답"
                                            rules={[
                                                {
                                                    required: true
                                                }
                                            ]}
                                        >
                                            <Radio.Group onChange={onChange} buttonStyle="solid" defaultValue="o">
                                                <Radio.Button value="o">
                                                    <span style={{ padding: '0 15px' }}>O</span>
                                                </Radio.Button>
                                                <span style={{ padding: '0 10px' }}></span>
                                                <Radio.Button value="x">
                                                    <span style={{ padding: '0 15px' }}>X</span>
                                                </Radio.Button>
                                            </Radio.Group>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </>
                        ) : questionType === '3' ? (
                            <>
                                <Divider style={{ margin: '10px 0' }} />
                                <Card bordered style={{ height: '110px' }}>
                                    <Row gutter={24}>
                                        <Col span={24}>
                                            <Form.Item
                                                name="Question"
                                                label="질문"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Please Enter Question.'
                                                    }
                                                ]}
                                            >
                                                <Input placeholder="# 질문" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Card>
                                <p style={{ margin: '10px 0' }} />
                                <Row gutter={24}>
                                    <Col span={24}>
                                        <Space
                                            direction="vertical"
                                            style={{
                                                width: '100%'
                                            }}
                                            size="large"
                                        >
                                            {/* <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
                                                <input {...getInputProps()} />
                                                {isDragActive ? (
                                                    <p>이미지를 여기에 놓아주세요...</p>
                                                ) : (
                                                    <p>이미지를 드래그하거나 클릭하여 업로드하세요.</p>
                                                )}
                                            </div>
                                             */}
                                            <Space wrap>
                                                <Button
                                                    {...getRootProps()}
                                                    className={`dropzone ${isDragActive ? 'active' : ''}`}
                                                    style={{ padding: '10px 85px', height: '150px' }}
                                                    size="large"
                                                    disabled={uploadedImages.length >= 4}
                                                >
                                                    <p>
                                                        <UploadOutlined />
                                                    </p>
                                                    <input {...getInputProps()} />
                                                    {isDragActive ? (
                                                        <p>이미지를 여기에 놓아주세요...</p>
                                                    ) : (
                                                        <>
                                                            <p>이미지를 드래그하거나 클릭하여 업로드하세요.</p>
                                                        </>
                                                    )}
                                                </Button>
                                            </Space>
                                            {uploadedImages.length > 0 && (
                                                <>
                                                    <h2>정답을 선택해주세요</h2>
                                                    <Space style={{ textAlign: 'center' }}>
                                                        <Row gutter={24}>
                                                            {uploadedImages.map((image, index) => (
                                                                <Col key={index} span={12}>
                                                                    <img
                                                                        src={image.base64Image}
                                                                        alt={image.name}
                                                                        style={{ width: '120px' }}
                                                                    />
                                                                    <p>{image.name}</p>
                                                                    <p>{image.size} bytes</p>
                                                                    <p>{image.type}</p>
                                                                    <Form.Item name={`imageanswer${index + 1}`}>
                                                                        <Radio
                                                                            checked={selectedImage === index}
                                                                            onChange={() => handleImageSelect(index)}
                                                                        >
                                                                            정답
                                                                        </Radio>
                                                                        <Button
                                                                            type="danger"
                                                                            icon={<DeleteOutlined />}
                                                                            onClick={() => handleImageDelete(index)}
                                                                        ></Button>
                                                                    </Form.Item>
                                                                </Col>
                                                            ))}
                                                        </Row>
                                                    </Space>
                                                </>
                                            )}
                                        </Space>
                                    </Col>
                                </Row>
                            </>
                        ) : questionType === '4' ? (
                            ''
                        ) : (
                            ''
                        )}
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
