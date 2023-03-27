/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
    Col,
    Row,
    Space,
    Card,
    Table,
    Tooltip,
    Tag,
    Button,
    Upload,
    Drawer,
    Divider,
    Input,
    Select,
    Switch,
    Form,
    Modal,
    Dragger
} from 'antd';
import { Typography } from '@mui/material';
import './index.css';
import { PlusOutlined, EditFilled, DeleteFilled, UploadOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useGetUnitListMutation } from '../../../hooks/api/ContentsManagement/ContentsManagement';

// project import
import MainCard from 'components/MainCard';

export const ImagesManagement = () => {
    const { confirm } = Modal;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false); // 로딩 초기값
    const [getUnitList] = useGetUnitListMutation(); // hooks api호출
    const [unitList, setUnitList] = useState(); // 리스트 값
    const [dataSource, setDataSource] = useState([]); // Table 데이터 값
    const [open, setOpen] = useState(false); // Drawer 추가 우측폼 상태
    const [dataEdit, setDataEdit] = useState(false); // Drawer 수정 우측폼 상태
    const [fileListR, setFileListR] = useState([]); // 파일 업로드 실물 이미지
    const [fileListF, setFileListF] = useState([]); // 파일 업로드 정면 이미지
    const [fileListS, setFileListS] = useState([]); // 파일 업로드 측면 이미지
    const [uploading, setUploading] = useState(false);//이미지업로드

    const [unitLanguageModalOpen, setUnitLanguageModalOpen] = useState(false); // 물품명칭 언어추가 Modal

    const handleUnit = async () => {
        const getUnitListResponse = await getUnitList({ languageCode: 'kor' });
        setUnitList(getUnitListResponse?.data?.RET_DATA);
        setDataSource([
            ...getUnitListResponse?.data?.RET_DATA.map((d, i) => ({
                key: d.unitScanId,
                rowdata0: i + 1,
                rowdata1: d.unitId,
                rowdata2: d.unitGroupName,
                rowdata3: d.unitName,
                rowdata4: d.useYn === 'Y' ? '사용' : '미사용'
            }))
        ]);
        //setLoading(false);
    };

    const imagescolumns = [
        {
            width: '60px',
            title: 'No',
            dataIndex: 'rowdata0',
            align: 'center'
        },
        {
            title: '물품ID',
            dataIndex: 'rowdata1',
            align: 'center'
        },
        {
            title: '물품분류',
            dataIndex: 'rowdata2',
            align: 'center'
        },
        {
            title: '물품명칭',
            dataIndex: 'rowdata3',
            align: 'center'
        },
        {
            title: '사용여부',
            dataIndex: 'rowdata4',
            align: 'center',
            render: (_, { rowdata1, rowdata4 }) => (
                <>
                    {rowdata4 === 'Y' ? (
                        <Tag color={'green'} key={rowdata1}>
                            {'사용'}
                        </Tag>
                    ) : (
                        <Tag color={'volcano'} key={rowdata1}>
                            {'미사용'}
                        </Tag>
                    )}
                </>
            )
        },
        {
            width: '100px',
            title: '수정',
            render: () => (
                <>
                    <Tooltip title="수정" color="#108ee9">
                        <Button type="primary" style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }} icon={<EditFilled />}>
                            수정
                        </Button>
                    </Tooltip>
                </>
            ),
            align: 'center'
        }
    ];
    const imagesdata = [
        {
            rowdata0: '1',
            rowdata1: '10010',
            rowdata2: '도검류',
            rowdata3: '칼(5.5cm 이상)',
            rowdata4: 'Y'
        },
        {
            rowdata0: '2',
            rowdata1: '10011',
            rowdata2: '인화성물질류',
            rowdata3: '라이타 기름',
            rowdata4: 'Y'
        },
        {
            rowdata0: '3',
            rowdata1: '10012',
            rowdata2: '도검류',
            rowdata3: '접이식칼-2',
            rowdata4: 'Y'
        },
        {
            rowdata0: '4',
            rowdata1: '10013',
            rowdata2: '도검류',
            rowdata3: '7.62mm 비활성탄',
            rowdata4: 'Y'
        },
        {
            rowdata0: '5',
            rowdata1: '10014',
            rowdata2: '도검류',
            rowdata3: '38구경 탄 & 탄창',
            rowdata4: 'Y'
        }
    ];

    // rowSelection, row selection
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User',
            // Column configuration not to be checked
            name: record.name
        })
    };

    // 추가 버튼
    const handleAdd = () => {
        setDataEdit(false);
        setOpen(true);
    };

    // 추가 취소
    const onAddClose = () => {
        setOpen(false);
        setDataEdit(false);
        form.resetFields();
    };

    // 추가 및 수정 처리
    const onAddSubmit = () => {
        if (dataEdit === true) {
            Modal.success({
                content: '수정 완료',
                onOk() {
                    setOpen(false);
                    setDataEdit(false);
                    form.resetFields();
                }
            });
        } else {
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

    // 물품명칭 언어 추가 Start
    const Unit_Language = () => {
        setUnitLanguageModalOpen(true);
    };
    const Unit_LanguageOk = () => {
        setUnitLanguageModalOpen(false);
        form.resetFields();
    };
    const Unit_LanguageCancel = () => {
        setUnitLanguageModalOpen(false);
        form.resetFields();
    };
    const Unit_LanguageAdd = (values) => {
        console.log('Received values of form:', values);
    };

    // 물품명칭 언어 추가 End

    // 실물 이미지 업로드 처리
    const handleUpload = () => {
        const formData = new FormData();
        //fileListR.forEach((file) => formData.append('files', file));
        formData.append('files', fileListR);

        // formData.append('fileR', fileListR);

        //formData.append('files[]', fileListF);
        //formData.append('files[]', fileListS);

        console.log(fileListR);
        //console.log(fileListS);

        // setUploading(true);
        // fetch('https://www.mocky.io/v2/5cc8019d300000980a055e76', {
        //     method: 'POST',
        //     body: formData
        // })
        //     .then((res) => res.json())
        //     .then(() => {
        //         setFileListR([]);
        //         message.success('upload successfully.');
        //     })
        //     .catch(() => {
        //         message.error('upload failed.');
        //     })
        //     .finally(() => {
        //         setUploading(false);
        //     });
    };

    // 정면 이미지 업로드 처리
    const handleUploadF = () => {
        const formData = new FormData();
        fileListF.forEach((file) => {
            formData.append('files[]', file);
            setFileListR(formData.file);
        });
        console.log(fileListR);
        setUploadingF(true);
    };

    // 측면 이미지 업로드 처리
    const handleUploadS = () => {
        const formData = new FormData();
        fileListS.forEach((file) => {
            formData.append('files[]', file);
        });
        setUploadingS(true);
        fetch('https://www.mocky.io/v2/5cc8019d300000980a055e76', {
            method: 'POST',
            body: formData
        })
            .then((res) => res.json())
            .then(() => {
                setFileListS([]);
                message.success('upload successfully.');
            })
            .catch(() => {
                message.error('upload failed.');
            })
            .finally(() => {
                setUploadingS(false);
            });
    };
    const propsR = {
        onRemove: (file) => {
            const index = fileListR.indexOf(file);
            const newFileListR = fileListR.slice();
            newFileListR.splice(index, 1);
            setFileListF(newFileListR);
        },
        beforeUpload: (file) => {
            setFileListR([...fileListR, file]);

            console.log(file);
            // console.log(file);
            return false;
        },
        fileListR
    };

    const propsF = {
        onRemove: (file) => {
            const index = fileListF.indexOf(file);
            const newFileListF = fileListF.slice();
            newFileListF.splice(index, 1);
            setFileListF(newFileListF);
        },
        beforeUpload: (file) => {
            setFileListF([...fileListF, file]);
            return false;
        },
        fileListF
    };

    const propsS = {
        onRemove: (file) => {
            const index = fileListS.indexOf(file);
            const newFileListS = fileListS.slice();
            newFileListS.splice(index, 1);
            setFileListS(newFileListS);
        },
        beforeUpload: (file) => {
            setFileListS([...fileListS, file]);
            return false;
        },
        fileListS
    };

    const onFinish = (values) => {
        console.log('Success:', values);
        console.log(fileListR);
        // console.log(...fileListR);
    };

    useEffect(() => {
        handleUnit();
    }, []);

    return (
        <>
            <MainCard title="물품 이미지">
                <Typography variant="body1">
                    <Row gutter={[16, 16]}>
                        <Col span={11} style={{ textAlign: 'center', padding: '0 10px' }}>
                            <Row gutter={24} style={{ paddingBottom: '15px' }}>
                                <Col span={24} offset={10}>
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
                            <Table rowSelection={rowSelection} columns={imagescolumns} dataSource={dataSource} />
                        </Col>
                        <Col span={13} style={{ textAlign: 'center' }}>
                            <Form
                                layout="horizontal"
                                // onValuesChange={onFormLayoutChange}
                                onFinish={onFinish}
                                // onFinishFailed={onFinishFailed}
                                // disabled={componentDisabled}
                            >
                                <Row gutter={24} style={{ paddingBottom: '15px' }}>
                                    <Col span={24} offset={10}>
                                        <Space>
                                            <Tooltip title="업로드">
                                                <Button
                                                    type="success"
                                                    // onClick={handleUpload}
                                                    htmlType="submit"
                                                    loding={uploading}
                                                    style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                                    icon={<PlusOutlined />}
                                                >
                                                    업로드
                                                </Button>
                                            </Tooltip>
                                        </Space>
                                    </Col>
                                </Row>

                                <Row gutter={[16, 16]}>
                                    <Col span={12}>
                                        <Form.Item name="FileR">
                                            <Space direction="vertical">
                                                <Card
                                                    size="small"
                                                    style={{
                                                        width: 350
                                                    }}
                                                >
                                                    <Upload {...propsR} listType="picture">
                                                        <Button
                                                            icon={<UploadOutlined />}
                                                            style={{ height: '40px', padding: '0 120px', backgroundColor: '#f0f0f0' }}
                                                        >
                                                            실물 이미지
                                                        </Button>
                                                    </Upload>
                                                </Card>
                                            </Space>
                                            <Space direction="vertical">
                                                <Card
                                                    style={{
                                                        width: 350,
                                                        height: 230
                                                    }}
                                                >
                                                    <Col span={24}>이미지</Col>
                                                </Card>
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item name="FileD">
                                            <Space direction="vertical">
                                                <Card
                                                    style={{
                                                        width: 350,
                                                        height: 68
                                                    }}
                                                >
                                                    3D 이미지
                                                </Card>
                                            </Space>
                                            <Space direction="vertical">
                                                <Card
                                                    style={{
                                                        width: 350,
                                                        height: 230
                                                    }}
                                                >
                                                    <Col span={24}>이미지</Col>
                                                </Card>
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <br />
                                <Row gutter={[16, 16]}>
                                    <Col span={12}>
                                        <Form.Item name="FileF">
                                            <Space direction="vertical">
                                                <Card
                                                    size="small"
                                                    style={{
                                                        width: 350
                                                    }}
                                                >
                                                    <Upload {...propsF} listType="picture">
                                                        <Button
                                                            icon={<UploadOutlined />}
                                                            style={{ height: '40px', padding: '0 120px', backgroundColor: '#f0f0f0' }}
                                                        >
                                                            Front 이미지
                                                        </Button>
                                                    </Upload>
                                                </Card>
                                            </Space>
                                            <Space direction="vertical">
                                                <Card
                                                    style={{
                                                        width: 350,
                                                        height: 230
                                                    }}
                                                >
                                                    <Col span={24}>이미지</Col>
                                                </Card>
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item name="FileS">
                                            <Space direction="vertical">
                                                <Card
                                                    size="small"
                                                    style={{
                                                        width: 350
                                                    }}
                                                >
                                                    <Upload {...propsS} listType="picture">
                                                        <Button
                                                            icon={<UploadOutlined />}
                                                            style={{ height: '40px', padding: '0 120px', backgroundColor: '#f0f0f0' }}
                                                        >
                                                            Side 이미지
                                                        </Button>
                                                    </Upload>
                                                </Card>
                                            </Space>
                                            <Space direction="vertical">
                                                <Card
                                                    style={{
                                                        width: 350,
                                                        height: 230
                                                    }}
                                                >
                                                    <Col span={24}>이미지</Col>
                                                </Card>
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        </Col>
                    </Row>
                </Typography>
            </MainCard>

            {/* 물품 이미지 추가 폼 Start */}
            <Drawer
                maskClosable={false}
                title={`물품 이미지 ${dataEdit === true ? '수정' : '추가'}`}
                onClose={onAddClose}
                open={open}
                width={500}
                style={{ top: '60px', zIndex: 888 }}
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
                            <Tooltip title="삭제">
                                <Button type="danger" style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}>
                                    삭제
                                </Button>
                            </Tooltip>
                        </Space>
                    </>
                }
            >
                <MainCard>
                    <Form name="Unit_Add" layout="vertical" form={form}>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="unitId"
                                    label="물품분류"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter Items Type'
                                        }
                                    ]}
                                >
                                    <Select
                                        defaultValue={{
                                            value: 0,
                                            label: '# 물품분류 선택'
                                        }}
                                        style={{
                                            width: '100%'
                                        }}
                                        options={[
                                            {
                                                value: 'Item01',
                                                label: '총기류'
                                            },
                                            {
                                                value: 'Item02',
                                                label: '폭발물류'
                                            },
                                            {
                                                value: 'Item03',
                                                label: '실탄류'
                                            },
                                            {
                                                value: 'Item04',
                                                label: '도검류'
                                            },
                                            {
                                                value: 'Item05',
                                                label: '일반무기류'
                                            },
                                            {
                                                value: 'Item06',
                                                label: '위장무기류'
                                            },
                                            {
                                                value: 'Item07',
                                                label: '공구/생활용품류'
                                            },
                                            {
                                                value: 'Item08',
                                                label: '인화성물질류'
                                            },
                                            {
                                                value: 'Item09',
                                                label: '위험물질류'
                                            },
                                            {
                                                value: 'Item10',
                                                label: '액체, 겔 물품류'
                                            },
                                            {
                                                value: 'Item11',
                                                label: '주류'
                                            },
                                            {
                                                value: 'Item12',
                                                label: '전기/전자제품류'
                                            },
                                            {
                                                value: 'Item13',
                                                label: '확인물품류'
                                            },
                                            {
                                                value: 'Item14',
                                                label: '통과류'
                                            }
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />
                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="unitName"
                                    label="물품명칭"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter Language Name'
                                        }
                                    ]}
                                >
                                    <Input
                                        style={{
                                            width: '100%'
                                        }}
                                        placeholder="Please Enter Language Name"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.List name="UnitLanguage">
                                    {(fields, { add, remove }) => (
                                        <>
                                            {fields.map(({ key, name, ...restField }) => (
                                                <Space
                                                    key={key}
                                                    style={{
                                                        display: 'flex',
                                                        marginBottom: 8
                                                    }}
                                                    align="baseline"
                                                >
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'unitLanguage']}
                                                        rules={[
                                                            {
                                                                required: true
                                                            }
                                                        ]}
                                                    >
                                                        <Select
                                                            defaultValue={{
                                                                value: 0,
                                                                label: '# 언어 선택'
                                                            }}
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
                                                                {
                                                                    value: 'chn',
                                                                    label: '중국어'
                                                                },
                                                                {
                                                                    value: 'jpn',
                                                                    label: '일본어'
                                                                }
                                                            ]}
                                                        />
                                                    </Form.Item>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'unitLanguageName']}
                                                        rules={[
                                                            {
                                                                required: true
                                                            }
                                                        ]}
                                                    >
                                                        <Input
                                                            style={{
                                                                width: '100%'
                                                            }}
                                                            placeholder="# 물품명칭"
                                                        />
                                                    </Form.Item>

                                                    <MinusCircleOutlined onClick={() => remove(name)} />
                                                </Space>
                                            ))}
                                            <Form.Item>
                                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                    언어추가
                                                </Button>
                                            </Form.Item>
                                        </>
                                    )}
                                </Form.List>
                            </Col>
                        </Row>
                    </Form>
                </MainCard>
            </Drawer>
            {/* 이미지 관리 추가 폼 End */}

            {/* 물품명칭 언어 추가 Modal Start */}
            <Modal
                open={unitLanguageModalOpen}
                onOk={Unit_LanguageOk}
                onCancel={Unit_LanguageCancel}
                title="물품명칭 언어 추가"
                width={450}
                style={{
                    left: 130,
                    zIndex: 999
                }}
                footer={[
                    <Button
                        type="primary"
                        onClick={Unit_LanguageCancel}
                        style={{ width: '100px', borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                    >
                        Close
                    </Button>
                ]}
            >
                <MainCard>
                    <Form layout="vertical" name="Unit_Language_Add" form={form} onFinish={Unit_LanguageAdd}>
                        <Form.Item>
                            <Row gutter={24} style={{ marginBottom: 10 }}>
                                <Col offset={19}>
                                    <Space>
                                        <Tooltip title="저장" placement="bottom" color="#108ee9">
                                            <Button
                                                style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                                type="primary"
                                                htmlType="submit"
                                            >
                                                저장
                                            </Button>
                                        </Tooltip>
                                    </Space>
                                </Col>
                            </Row>
                        </Form.Item>
                    </Form>
                </MainCard>
            </Modal>
            {/* 물품명칭 언어 추가 Modal End */}
        </>
    );
};
