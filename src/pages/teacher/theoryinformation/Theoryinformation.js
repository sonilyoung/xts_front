/* eslint-disable no-unused-vars */
import { useEffect, useState, Fragment } from 'react';
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
    Typography,
    message
} from 'antd';
const { Text, Link } = Typography;
import 'antd/dist/antd.css';

import {
    useSelectTheoryFileListMutation, // 이론교육 조회
    useSelectTheoryFileMutation, // 이론교육 상세
    useInsertTheoryFileMutation, // 이론교육 등록
    useUpdateTheoryFileMutation, // 이론교육 수정
    useDeleteTheoryFileMutation // 이론교육 삭제
} from '../../../hooks/api/TeacherManagement/TeacherManagement';

import {
    PlusOutlined,
    EditFilled,
    DeleteFilled,
    ExclamationCircleFilled,
    DeleteOutlined,
    UploadOutlined,
    FilePdfOutlined
} from '@ant-design/icons';
import { useDropzone } from 'react-dropzone';

// project import
import MainCard from 'components/MainCard';

export const Theoryinformation = () => {
    const { confirm } = Modal;
    const [form] = Form.useForm();

    const [dataSource, setDataSource] = useState([]); // Table 데이터 값
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false); // Drawer 추가 우측폼 상태
    const [dataEdit, setDataEdit] = useState(false); // Drawer 수정 우측폼 상태

    const [selectedRowKeys, setSelectedRowKeys] = useState([]); //셀렉트 박스 option Selected 값
    const [theoryNoKey, setTheoryNoKey] = useState([]); // 선택한 이론강의 아이디 값

    const [command, setCommand] = useState('false'); // PDF파일 업로드 여부
    const [uploadedFiles, setUploadedFiles] = useState([]); // PDF파일 업로드 값
    const [selectedFiles, setSelectedFiles] = useState([]); // PDF파일 업로드

    const [idChk, setIdChk] = useState(false); // 선택한 이론강의 아이디 값
    const [itemContainer, setItemContainer] = useState({}); // 항목 컨테이너
    const [searchval, setSearchval] = useState(null);
    // ===============================
    // Api 호출 Start
    // 조회 ======================================================
    const [SelectTheoryFileListApi] = useSelectTheoryFileListMutation(); // 이론강의 정보 hooks api호출
    const [selectTheoryFileListData, setSelectTheoryFileListData] = useState(); // 이론강의 정보 리스트 값
    const handle_SelectTheoryFileList_Api = async () => {
        const SelectTheoryFileListresponse = await SelectTheoryFileListApi({
            searchval: searchval
        });
        // console.log(SelectTheoryFileListresponse?.data?.RET_DATA);
        setSelectTheoryFileListData(SelectTheoryFileListresponse?.data?.RET_DATA);
        // console.log(SelectTheoryFileListresponse?.data?.RET_DATA);
        setDataSource([
            ...SelectTheoryFileListresponse?.data?.RET_DATA.map((d, i) => ({
                key: d.theoryNo,
                Num: i + 1,
                eduCode: d.eduCode,
                theoryNo: d.theoryNo,
                title: d.title,
                files: d.files,
                contents: d.contents,
                useYn: d.useYn,
                insertDate: d.insertDate
            }))
        ]);
        setLoading(false);
    };

    // 등록 ======================================================
    const [InsertTheoryFileApi] = useInsertTheoryFileMutation(); // 교육생 정보 hooks api호출
    const handle_InsertTheoryFile_Api = async () => {
        let formData = new FormData();
        const params = {
            eduCode: itemContainer.eduCode,
            title: itemContainer.title,
            contents: itemContainer.contents,
            useYn: itemContainer.useYn
        };
        formData.append('params', new Blob([JSON.stringify(params)], { type: 'application/json' }));

        Object.values(selectedFiles).forEach((Theoryfiles) => {
            formData.append('files', Theoryfiles);
        });

        const InsertTheoryFileresponse = await InsertTheoryFileApi(formData);
        InsertTheoryFileresponse?.data?.RET_CODE === '0100'
            ? Modal.success({
                  content: '등록 완료',
                  onOk() {
                      setOpen(false);
                      setDataEdit(false);
                      form.resetFields();
                      handle_SelectTheoryFileList_Api();
                  }
              })
            : Modal.error({
                  content: '등록 오류',
                  onOk() {}
              });
    };

    // 상세 ======================================================
    const [SelectTheoryFileApi] = useSelectTheoryFileMutation(); // 상세 hooks api호출
    const handel_SelectTheoryFile_Api = async (theoryNo) => {
        const SelectTheoryFileresponse = await SelectTheoryFileApi({
            theoryNo: theoryNo
        });
        console.log(SelectTheoryFileresponse.data.RET_DATA);
        setItemContainer(SelectTheoryFileresponse.data.RET_DATA);
    };

    // 수정 ======================================================
    const [UpdateTheoryFileApi] = useUpdateTheoryFileMutation(); // 수정 hooks api호출
    const handel_UpdateTheoryFile_Api = async () => {
        let formData = new FormData();
        Object.values(selectedFiles).forEach((Theoryfiles) => {
            formData.append('files', Theoryfiles);
        });
        const params = {
            theoryNo: theoryNoKey,
            eduCode: itemContainer.eduCode,
            title: itemContainer.title,
            contents: itemContainer.contents,
            useYn: itemContainer.useYn
        };
        formData.append('params', new Blob([JSON.stringify(params)], { type: 'application/json' }));

        const UpdateTheoryFileresponse = await UpdateTheoryFileApi({ formData });
        UpdateTheoryFileresponse?.data?.RET_CODE === '0100'
            ? Modal.success({
                  content: '수정 완료',
                  onOk() {
                      setOpen(false);
                      setDataEdit(false);
                      form.resetFields();
                      handle_InsertTheoryFile_Api();
                  }
              })
            : Modal.error({
                  content: '수정 오류',
                  onOk() {}
              });
    };
    // 삭제 ======================================================
    const [DeleteTheoryFileApi] = useDeleteTheoryFileMutation(); // 삭제 hooks api호출
    const handel_DeleteTheoryFile_Api = async (theoryNo) => {
        const DeleteTheoryFileresponse = await DeleteTheoryFileApi({
            theoryNoList: theoryNo
        });
        DeleteTheoryFileresponse?.data?.RET_CODE === '0300'
            ? Modal.success({
                  content: '삭제 완료',
                  onOk() {
                      handle_InsertTheoryFile_Api();
                  }
              })
            : Modal.error({
                  content: '삭제 오류',
                  onOk() {}
              });
    };

    // Api 호출 End
    // ===============================
    const columns = [
        {
            width: '70px',
            title: 'No',
            dataIndex: 'Num',
            sorter: (a, b) => a.Num.length - b.Num.length,
            ellipsis: true,
            align: 'center'
        },
        // {
        //     title: '이론 강의ID',
        //     dataIndex: 'theoryNo',
        //     sorter: (a, b) => a.name.length - b.name.length,
        //     ellipsis: true,
        //     align: 'center'
        // },
        {
            title: '이론 과정',
            dataIndex: 'eduCode',
            sorter: (a, b) => a.eduCode.length - b.eduCode.length,
            ellipsis: true,
            align: 'center',
            render: (_, { eduCode }) => <>{eduCode === '1' ? '보안검색요원 초기교육' : '항공경비요원 초기교육'}</>
        },
        {
            title: '이론 강의명',
            dataIndex: 'title',
            sorter: (a, b) => a.title - b.title,
            ellipsis: true,
            align: 'center'
        },
        {
            title: '이론 강의내용',
            dataIndex: 'contents',
            align: 'center'
        },
        {
            title: '이론 강의파일',
            dataIndex: 'files',
            align: 'center',
            render: (_, record) => (
                <>
                    {record?.files?.map((f, i) => (
                        <Tooltip title={f.originalFileName} key={i}>
                            <a
                                href={`${decodeURIComponent(`${f.filePath}/${f.saveFileName}`)}`}
                                target="_blank"
                                onClick={(e) => {
                                    e.preventDefault();
                                    window.open(
                                        `${decodeURIComponent(`${f.filePath}/${f.saveFileName}`)}`,
                                        'PDFViewer',
                                        // 'width=1000,height=800'
                                        `width=${window.innerWidth - 60},height=${window.innerHeight},left=20,top=20`
                                    );
                                }}
                            >
                                <FilePdfOutlined style={{ fontSize: '25px', margin: '0 5px' }} />
                            </a>
                        </Tooltip>
                    ))}
                </>
            )
        },
        {
            width: '85px',
            title: '사용여부',
            dataIndex: 'useYn',
            align: 'center',
            render: (_, { useYn }) => (
                <>
                    {useYn === 'Y' ? (
                        <Tag color={'green'} key={useYn}>
                            사용
                        </Tag>
                    ) : (
                        <Tag color={'volcano'} key={useYn}>
                            미사용
                        </Tag>
                    )}
                </>
            )
        },
        {
            width: '110px',
            title: '등록일자',
            dataIndex: 'insertDate',
            align: 'center'
        },
        {
            width: '120px',
            title: '수정',
            render: (_, { theoryNo }) => (
                <>
                    <Tooltip title="수정" color="#108ee9">
                        <Button
                            type="primary"
                            onClick={() => handleEdit(theoryNo)}
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

    const handleDrop = (acceptedFiles) => {
        const remainingSlots = 5 - uploadedFiles.length;
        const filesToUpload = acceptedFiles.slice(0, remainingSlots);
        filesToUpload.forEach((file) => {
            // PDF 파일 유효성 검사 및 처리
            const isPdf = file.type === 'application/pdf';
            if (!isPdf) {
                message.error('You can only upload PDF file!');
                return;
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('PDF must be smaller than 2MB!');
                return;
            }

            // 파일 정보 및 base64 변환
            const reader = new FileReader();
            reader.onload = () => {
                const base64Pdf = reader.result;
                const uploadedPdf = {
                    name: file.name,
                    base64Pdf: base64Pdf
                };
                // 업로드된 PDF 파일 추가
                setUploadedFiles((prevFiles) => [...prevFiles, uploadedPdf]);
            };
            reader.readAsDataURL(file);
        });
        setSelectedFiles(filesToUpload);
        setCommand('true');
    };

    const {
        getRootProps: getRootProps,
        getInputProps: getInputProps,
        isDragActive: isDragActive
    } = useDropzone({
        onDrop: handleDrop,
        accept: 'application/pdf' // 허용할 파일 유형을 PDF로 지정
    });

    // 업로드 된 pdf파일 삭제
    const handleFileDelete = (index) => {
        setUploadedFiles((prevFiles) => {
            const updatedFiles = [...prevFiles];
            updatedFiles.splice(index, 1);
            return updatedFiles;
        });
    };

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
        //setSortedInfo(sorter);
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

    // 수정 버튼 클릭
    const handleEdit = (theoryNo) => {
        handel_SelectTheoryFile_Api(theoryNo);
        setTheoryNoKey(theoryNo);
        form.resetFields();
        setDataEdit(true);
        setIdChk(true);
        setOpen(true);
    };

    // 추가 버튼
    const handleAdd = () => {
        setItemContainer([]);
        form.resetFields();
        setDataEdit(false);
        setOpen(true);
    };

    // 추가 및 수정 취소
    const onAddClose = () => {
        setItemContainer([]);
        form.resetFields();
        setOpen(false);
    };

    // 추가 및 수정 처리
    const onAddSubmit = () => {
        if (dataEdit === true) {
            handel_UpdateTheoryFile_Api();
        } else {
            handle_InsertTheoryFile_Api();
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
                // content: selectedRowKeys + ' 번째 항목의 데이터',
                okText: '예',
                okType: 'danger',
                cancelText: '아니오',
                onOk() {
                    handel_DeleteTheoryFile_Api(selectedRowKeys);
                },
                onCancel() {}
            });
        }
    };

    const onSearch = (value) => {
        setSearchval(value);
    };

    useEffect(() => {
        setLoading(true);
        handle_SelectTheoryFileList_Api();
    }, [searchval]);

    return (
        <>
            <MainCard title="이론강의 정보조회">
                <Typography variant="body1">
                    <Row gutter={[8, 8]} style={{ marginBottom: 16 }}>
                        <Col span={12}>
                            <div style={{ display: 'flex', justifyContent: 'flex-start', fontSize: '14px' }}>
                                <Input.Search
                                    placeholder="※ 통합 검색 (이론 과정, 이론 강의명, 이론 강의내용)"
                                    style={{ width: 483 }}
                                    onSearch={onSearch}
                                    allowClear
                                    enterButton
                                    size="middle"
                                    className="custom-search-input"
                                />
                            </div>
                        </Col>
                        <Col span={12} style={{ textAlign: 'right' }}>
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
                        rowClassName={(record) => {
                            return record.key === theoryNoKey ? `table-row-lightblue` : '';
                        }}
                        columns={columns}
                        dataSource={dataSource}
                        rowSelection={{ ...rowSelection }}
                        bordered={true}
                        onChange={onChange}
                        loading={loading}
                    />
                </Typography>
            </MainCard>

            {/* 이론강의 등록 Start */}
            <Drawer
                maskClosable={false}
                title={`이론강의 ${dataEdit === true ? '수정' : '추가'}`}
                onClose={onAddClose}
                open={open}
                width={700}
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
                <Form layout="vertical" form={form}>
                    <Card>
                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    label="교육 과정명"
                                    rules={[
                                        {
                                            required: true,
                                            message: '교육과정명'
                                        }
                                    ]}
                                >
                                    <Select
                                        name="eduCode"
                                        defaultValue="# 교육과정"
                                        style={{
                                            width: '100%'
                                        }}
                                        onChange={(e) => setItemContainer({ ...itemContainer, eduCode: e })}
                                        value={itemContainer?.eduCode}
                                        options={[
                                            {
                                                label: '보안검색요원 초기교육',
                                                value: '1'
                                            },
                                            {
                                                label: '항공경비요원 초기교육',
                                                value: '2'
                                            }
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    label="이론명"
                                    rules={[
                                        {
                                            required: true,
                                            message: '이론명'
                                        }
                                    ]}
                                >
                                    <Input
                                        name="title"
                                        style={{
                                            width: '100%'
                                        }}
                                        placeholder="이론명"
                                        onChange={(e) => setItemContainer({ ...itemContainer, title: e.target.value })}
                                        value={itemContainer?.title}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    label="이론내용"
                                    rules={[
                                        {
                                            required: true,
                                            message: '이론내용'
                                        }
                                    ]}
                                >
                                    <Input
                                        name="contents"
                                        style={{
                                            width: '100%'
                                        }}
                                        placeholder="이론내용"
                                        onChange={(e) => setItemContainer({ ...itemContainer, contents: e.target.value })}
                                        value={itemContainer?.contents}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />
                        <Row gutter={24}>
                            <Col span={24}>
                                {uploadedFiles?.length === 0 ? (
                                    <Space wrap>
                                        <Button
                                            {...getRootProps()}
                                            className={`dropzone ${isDragActive ? 'active' : ''}`}
                                            style={{ padding: '10px 173px', height: '150px' }}
                                            size="large"
                                            disabled={uploadedFiles?.length >= 5}
                                        >
                                            <p>
                                                <UploadOutlined />
                                            </p>
                                            <input {...getInputProps()} />
                                            {isDragActive ? (
                                                <p> PDF파일을 여기에 놓아주세요...</p>
                                            ) : (
                                                <>
                                                    <p>
                                                        <Text type="warning">PDF 파일</Text>
                                                        <br />
                                                        PDF 파일을 드래그하거나 클릭하여 업로드하세요.
                                                    </p>
                                                </>
                                            )}
                                        </Button>
                                    </Space>
                                ) : (
                                    <>
                                        <Card>
                                            <Space style={{ textAlign: 'center' }}>
                                                <Row gutter={24}>
                                                    {uploadedFiles?.map((file, index) => (
                                                        <>
                                                            <Col key={index} span={23} style={{ display: 'flex', height: '50px' }}>
                                                                <Tooltip title="삭제" placement="right" color="#ff4d4f">
                                                                    <Button
                                                                        type="danger"
                                                                        icon={<DeleteOutlined />}
                                                                        onClick={() => handleFileDelete(index)}
                                                                    >
                                                                        {file.name}
                                                                    </Button>
                                                                </Tooltip>
                                                            </Col>
                                                        </>
                                                    ))}
                                                </Row>
                                            </Space>
                                        </Card>
                                    </>
                                )}
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />
                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    label="사용여부"
                                    rules={[
                                        {
                                            required: true,
                                            message: '사용여부'
                                        }
                                    ]}
                                    initialValue={itemContainer?.useYn}
                                >
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
                    </Card>
                </Form>
            </Drawer>
            {/* 이론강의 등록 End */}

            {/* 이론강의 등록 Excel Start */}
            {/* 이론강의 등록 Excel End */}
        </>
    );
};
