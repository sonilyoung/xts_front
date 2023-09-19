/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
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
// import 'antd/dist/antd.css';
import { PlusOutlined, EditFilled, DeleteFilled, ExclamationCircleFilled, DeleteOutlined, UploadOutlined } from '@ant-design/icons';

import { useDropzone } from 'react-dropzone';

// project import
import MainCard from 'components/MainCard';

import {
    useSelectTheoryGroupListMutation,
    useSelectTheoryListMutation, // 이론 교육 조회
    useSelectTheoryMutation, // 이론 교육 상세
    useInsertTheoryMutation, // 이론 교육 등록
    useUpdateTheoryMutation, // 이론 교육 수정
    useDeleteTheoryMutation // 이론 교육 삭제
} from '../../../hooks/api/TheoryGroupManagement/TheoryGroupManagement';

export const TheoryInfo = () => {
    const { confirm } = Modal;
    const [form] = Form.useForm();

    const [loading, setLoading] = useState(false);
    const [loading_L, setLoading_L] = useState(false);
    const [loading_M, setLoading_M] = useState(false);
    const [loading_S, setLoading_S] = useState(false);
    const [itemContainer, setItemContainer] = useState(null); // 항목 컨테이너
    const [questionIdKey, setQuestionIdKey] = useState(null); // 선택 이론 교육 고유 key
    const [command, setCommand] = useState('false'); // 이미지 업로드 여부

    const [selectedRowKeys, setSelectedRowKeys] = useState([]); //셀렉트 박스 option Selected 값
    const [open, setOpen] = useState(false);
    const [dataEdit, setDataEdit] = useState(false); // Drawer 수정 우측폼 상태

    const [questionType, setQuestionType] = useState(''); // 문제 타입
    const [uploadedImages3, setUploadedImages3] = useState([null]); // 이미지선다형 이미지
    const [selectedImage3, setSelectedImage3] = useState([]);
    const [uploadedImages4, setUploadedImages4] = useState([null]); // 이미지 + 사지선다형 이미지
    const [selectedImage4, setSelectedImage4] = useState([]);
    const [searchval, setSearchval] = useState(null);

    // ===============================
    // Api 호출 Start
    const [SelectTheoryGroupListApi] = useSelectTheoryGroupListMutation();

    // 이론 교육 조회 ======================================================
    const [SelectTheoryListApi] = useSelectTheoryListMutation();
    const [selectTheoryListData, setSelectTheoryListData] = useState();
    const handle_SelectTheoryList_Api = async () => {
        const SelectTheoryListresponse = await SelectTheoryListApi({
            searchval: searchval
        });
        setSelectTheoryListData([
            ...SelectTheoryListresponse?.data?.RET_DATA.map((d, i) => ({
                key: d.questionId,
                rowdata0: i + 1,
                rowdata1: d.questionId, //문제아이디
                rowdata2: d.studyLvl, //학습레벨
                rowdata3: d.questionType, //사지선다(A), OX퀴즈(B), 이미지사지선다(C), 이미지+사지선다(D)
                rowdata4: d.useYn, //사용여부
                rowdata5: d.lageGroupCd, //대그룹코드
                rowdata6: d.middleGroupCd, //중그룹코드
                rowdata7: d.smallGroupCd, //소그룹코드
                rowdata8: d.question, //질문
                rowdata9: d.choice1, //선택지문1
                rowdata10: d.choice2, //선택지문2
                rowdata11: d.choice3, //선택지문3
                rowdata12: d.choice4, //선택지문4
                rowdata13: d.actionDiv, //정답
                rowdata14: d.usinsertId, // 등록아이디
                rowdata15: d.insertDate // 등록일자
            }))
        ]);
        setLoading(false);
    };

    // 이론 교육 등록 ======================================================
    const [InsertTheoryApi] = useInsertTheoryMutation(); // 등록 hooks api호출
    const handel_InsertTheory_Api = async () => {
        let formData = new FormData();
        const params = {
            studyLvl: itemContainer.studyLvl,
            questionType: questionType,
            lageGroupCd: itemContainer.lageGroupCd,
            middleGroupCd: itemContainer.middleGroupCd,
            smallGroupCd: itemContainer.smallGroupCd,
            question: itemContainer.question,
            choice1: itemContainer.choice1,
            choice2: itemContainer.choice2,
            choice3: itemContainer.choice3,
            choice4: itemContainer.choice4,
            actionDiv: itemContainer.actionDiv,
            useYn: itemContainer.useYn
        };
        formData.append('params', new Blob([JSON.stringify(params)], { type: 'application/json' }));

        if (questionType == 'C') {
            Object.values(selectedImage3).forEach((images3) => {
                formData.append('files', images3);
            });
        } else if (questionType == 'D') {
            Object.values(selectedImage4).forEach((images4) => {
                formData.append('files', images4);
            });
        } else {
        }
        const InsertTheoryResponse = await InsertTheoryApi(formData);
        InsertTheoryResponse?.data?.RET_CODE === '0100'
            ? Modal.success({
                  content: '등록 완료',
                  onOk() {
                      setOpen(false);
                      setDataEdit(false);

                      form.resetFields();
                      setItemContainer(null);
                      setSelectedImage3(null);
                      setUploadedImages3(null);
                      setSelectedImage4(null);
                      setUploadedImages4(null);
                      setCommand('false');
                      handle_SelectTheoryList_Api();
                  }
              })
            : Modal.error({
                  content: '등록 오류',
                  onOk() {}
              });
    };

    // 이론 교육 상세 ======================================================

    const [SelectTheoryApi] = useSelectTheoryMutation(); // 상세 hooks api호출
    const handel_SelectTheory_Api = async (questionId) => {
        const SelectTheoryresponse = await SelectTheoryApi({
            questionId: questionId
        });
        if (SelectTheoryresponse?.data?.RET_DATA?.questionType === 'C') {
            setUploadedImages3([
                {
                    name: SelectTheoryresponse?.data?.RET_DATA?.choice1,
                    base64Image: 'data:image/png;base64,' + SelectTheoryresponse?.data?.RET_DATA?.choiceImg1
                },
                {
                    name: SelectTheoryresponse?.data?.RET_DATA?.choice2,
                    base64Image: 'data:image/png;base64,' + SelectTheoryresponse?.data?.RET_DATA?.choiceImg2
                },
                {
                    name: SelectTheoryresponse?.data?.RET_DATA?.choice3,
                    base64Image: 'data:image/png;base64,' + SelectTheoryresponse?.data?.RET_DATA?.choiceImg3
                },
                {
                    name: SelectTheoryresponse?.data?.RET_DATA?.choice4,
                    base64Image: 'data:image/png;base64,' + SelectTheoryresponse?.data?.RET_DATA?.choiceImg4
                }
            ]);
            setSelectedImage3([
                {
                    name: SelectTheoryresponse?.data?.RET_DATA?.multiPlusImgName,
                    base64Image: 'data:image/png;base64,' + SelectTheoryresponse?.data?.RET_DATA?.multiPlusImg
                }
            ]);
        } else if (SelectTheoryresponse?.data?.RET_DATA?.questionType === 'D') {
            setUploadedImages4([
                {
                    name: SelectTheoryresponse?.data?.RET_DATA?.multiPlusImgName,
                    base64Image: 'data:image/png;base64,' + SelectTheoryresponse?.data?.RET_DATA?.multiPlusImg
                }
            ]);
            setSelectedImage4([
                {
                    name: SelectTheoryresponse?.data?.RET_DATA?.multiPlusImgName,
                    base64Image: 'data:image/png;base64,' + SelectTheoryresponse?.data?.RET_DATA?.multiPlusImg
                }
            ]);
        }
        setItemContainer(SelectTheoryresponse.data.RET_DATA);
    };
    // 이론 교육 수정 ======================================================
    const [UpdateTheoryApi] = useUpdateTheoryMutation(); // 수정 hooks api호출
    const handel_UpdateTheory_Api = async () => {
        let formData = new FormData();
        const params = {
            questionId: questionIdKey,
            command: command,
            studyLvl: itemContainer.studyLvl,
            questionType: itemContainer.questionType,
            lageGroupCd: itemContainer.lageGroupCd,
            middleGroupCd: itemContainer.middleGroupCd,
            smallGroupCd: itemContainer.smallGroupCd,
            question: itemContainer.question,
            choice1: itemContainer.choice1,
            choice2: itemContainer.choice2,
            choice3: itemContainer.choice3,
            choice4: itemContainer.choice4,
            actionDiv: itemContainer.actionDiv,
            useYn: itemContainer.useYn
        };
        formData.append('params', new Blob([JSON.stringify(params)], { type: 'application/json' }));

        if (command === 'true') {
            if (itemContainer.questionType == 'C') {
                Object.values(selectedImage3).forEach((images3) => {
                    formData.append('files', images3);
                });
            } else if (itemContainer.questionType == 'D') {
                Object.values(selectedImage4).forEach((images4) => {
                    formData.append('files', images4);
                });
            } else {
            }
        } else {
        }
        const UpdateTheoryresponse = await UpdateTheoryApi(formData);
        UpdateTheoryresponse?.data?.RET_CODE === '0100'
            ? Modal.success({
                  content: '수정 완료',
                  onOk() {
                      setOpen(false);
                      setDataEdit(false);
                      form.resetFields();
                      setItemContainer(null);
                      setSelectedImage3(null);
                      setUploadedImages3(null);
                      setSelectedImage4(null);
                      setUploadedImages4(null);
                      setCommand('false');
                      handle_SelectTheoryList_Api();
                  }
              })
            : Modal.error({
                  content: '수정 오류',
                  onOk() {}
              });
    };

    // 이론 교육 삭제 ======================================================
    const [DeleteTheoryApi] = useDeleteTheoryMutation(); // 삭제 hooks api호출
    const handel_DeleteTheory_Api = async (questionId) => {
        const DeleteTheoryresponse = await DeleteTheoryApi({
            questionIdList: questionId
        });
        // console.log(DeleteTheoryresponse?.data);
        DeleteTheoryresponse?.data?.RET_CODE === '0300'
            ? Modal.success({
                  content: '삭제 완료',
                  onOk() {
                      handle_SelectTheoryList_Api();
                      setSelectedRowKeys(null);
                  }
              })
            : Modal.error({
                  content: '삭제 오류',
                  onOk() {}
              });
    };
    // 대분류 조회 ======================================================
    const [lTheoryGroupData, setLTheoryGroupData] = useState();
    const handle_L_TheoryGroup_Api = async () => {
        const SelectTheoryGroupListresponse = await SelectTheoryGroupListApi({
            groupType: 'L',
            theoryParentGroupCd: ''
        });
        setLTheoryGroupData(
            SelectTheoryGroupListresponse?.data?.RET_DATA?.map((l, i) => ({
                value: l.theoryGroupCd,
                label: l.theoryGroupName,
                key: i
            }))
        );
        setLoading_L(false);
    };

    // 중분류 조회 ======================================================
    const [mTheoryGroupData, setMTheoryGroupData] = useState();
    const handle_M_TheoryGroup_Api = async (procGroupCd) => {
        const SelectTheoryGroupListresponse = await SelectTheoryGroupListApi({
            groupType: 'M',
            theoryParentGroupCd: procGroupCd
        });
        setMTheoryGroupData(
            SelectTheoryGroupListresponse?.data?.RET_DATA?.map((m, i) => ({
                value: m.theoryGroupCd,
                label: m.theoryGroupName,
                key: i
            }))
        );
        setLoading_M(false);
    };

    // 소분류 조회 ======================================================
    const [sTheoryGroupData, setSTheoryGroupData] = useState();
    const handle_S_TheoryGroup_Api = async (procGroupCd) => {
        const SelectTheoryGroupListresponse = await SelectTheoryGroupListApi({
            groupType: 'S',
            theoryParentGroupCd: procGroupCd
        });
        setSTheoryGroupData(
            SelectTheoryGroupListresponse?.data?.RET_DATA?.map((s, i) => ({
                value: s.theoryGroupCd,
                label: s.theoryGroupName,
                key: i
            }))
        );
        setLoading_S(false);
    };

    // Api 호출 End
    // ===============================

    // 이미지 업로드 Start
    // 이미지선다형 문제
    const handleDrop3 = (acceptedFiles3) => {
        const remainingSlots3 = 4 - uploadedImages3.length;
        const filesToUpload3 = acceptedFiles3.slice(0, remainingSlots3);
        filesToUpload3.forEach((file) => {
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
            const reader3 = new FileReader();
            reader3.onload = () => {
                const base64Image = reader3.result;
                const uploadedImage3 = {
                    name: file.name,
                    // size: file.size,
                    // type: file.type,
                    base64Image: base64Image
                    // localPath: file.path // 로컬 폴더 경로 추가
                };
                // 업로드된 이미지 추가
                setUploadedImages3((prevImages3) => [...prevImages3, uploadedImage3]);
            };
            reader3.readAsDataURL(file);
        });
        setSelectedImage3(filesToUpload3);
        setCommand('true');
    };
    const {
        getRootProps: getRootProps3,
        getInputProps: getInputProps3,
        isDragActive: isDragActive3
    } = useDropzone({
        onDrop: handleDrop3
    });

    // 이미지 삭제
    const handleImageDelete3 = (index) => {
        const updatedImages3 = [...uploadedImages3];
        updatedImages3.splice(index, 1);
        setUploadedImages3(updatedImages3);
    };

    // 이미지+사지선다형 문제
    const handleDrop4 = (acceptedFiles4) => {
        const remainingSlots4 = 1 - uploadedImages4.length;
        const filesToUpload4 = acceptedFiles4.slice(0, remainingSlots4);
        filesToUpload4.forEach((file) => {
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
            const reader4 = new FileReader();
            reader4.onload = () => {
                const base64Image = reader4.result;
                const uploadedImage4 = {
                    name: file.name,
                    // size: file.size,
                    // type: file.type,
                    base64Image: base64Image
                    // localPath: file.path // 로컬 폴더 경로 추가
                };
                // 업로드된 이미지 추가
                setUploadedImages4((prevImages4) => [...prevImages4, uploadedImage4]);
            };
            reader4.readAsDataURL(file);
        });
        setSelectedImage4(filesToUpload4);
        setCommand('true');
    };
    const {
        getRootProps: getRootProps4,
        getInputProps: getInputProps4,
        isDragActive: isDragActive4
    } = useDropzone({
        onDrop: handleDrop4
    });

    // 이미지 삭제
    const handleImageDelete4 = (index) => {
        const updatedImages4 = [...uploadedImages4];
        updatedImages4.splice(index, 1);
        setUploadedImages4(updatedImages4);
    };
    // 이미지 업로드 End

    const defaultColumns = [
        {
            width: '80px',
            title: 'No',
            dataIndex: 'rowdata0',
            align: 'center'
        },
        {
            width: '90px',
            title: '문제ID',
            dataIndex: 'rowdata1',
            align: 'center'
        },
        {
            width: '90px',
            title: '문제타입',
            dataIndex: 'rowdata3',
            align: 'center',
            render: (_, { rowdata3 }) => (
                <>
                    {' '}
                    {rowdata3 === 'A'
                        ? '사지선다'
                        : rowdata3 === 'B'
                        ? 'OX퀴즈'
                        : rowdata3 === 'C'
                        ? '이미지사지선다'
                        : rowdata3 === 'D'
                        ? '이미지+사지선다'
                        : ''}
                </>
            )
        },
        {
            width: '90px',
            title: '학습레벨',
            dataIndex: 'rowdata2',
            align: 'center',
            render: (_, { rowdata2 }) => <> {rowdata2 + 'Lv'} </>
        },
        {
            title: '질문',
            dataIndex: 'rowdata8',
            align: 'center'
        },
        {
            width: '90px',
            title: '출제자',
            dataIndex: 'rowdata14',
            align: 'center'
        },
        {
            width: '80px',
            title: '사용여부',
            key: 'tags',
            dataIndex: 'rowdata4',
            render: (_, { rowdata4 }) => <>{rowdata4 === 'Y' ? <Tag color={'green'}>사용</Tag> : <Tag color={'volcano'}>미사용</Tag>}</>,
            align: 'center'
        },
        {
            width: '100px',
            title: '등록일자',
            dataIndex: 'rowdata15',
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
        const newData = [...selectTheoryListData];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row
        });
        setSelectTheoryListData(newData);
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

    // 추가, 수정 취소
    const onAddClose = () => {
        setOpen(false);
        setDataEdit(false);
        form.resetFields();
        setItemContainer(null);
        setSelectedImage3(null);
        setUploadedImages3(null);
        setSelectedImage4(null);
        setUploadedImages4(null);
        setCommand('false');
    };

    // 수정 버튼
    const handleEdit = (EditKey) => {
        handel_SelectTheory_Api(EditKey);
        setQuestionIdKey(EditKey);
        setDataEdit(true);
        setOpen(true);
    };

    // 추가 및 수정 처리
    const onAddSubmit = () => {
        if (dataEdit === true) {
            handel_UpdateTheory_Api();
        } else {
            handel_InsertTheory_Api();
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
                // content: selectedRowKeys + ' 항목의 데이터',
                okText: '예',
                okType: 'danger',
                cancelText: '아니오',
                onOk() {
                    handel_DeleteTheory_Api(selectedRowKeys);
                },
                onCancel() {
                    setSelectedRowKeys(null);
                }
            });
        }
    };

    const onSearch = (value) => {
        setSearchval(value);
    };

    useEffect(() => {
        setLoading(true);
        handle_SelectTheoryList_Api();
        // setLoading_L(true); // 대분류 로딩
        // handle_L_TheoryGroup_Api(); // 대분류 Api
    }, [searchval]);

    useEffect(() => {
        handle_L_TheoryGroup_Api(); // 대분류 Api
        handle_M_TheoryGroup_Api(itemContainer?.lageGroupCd); // 대분류 Api
        handle_S_TheoryGroup_Api(itemContainer?.middleGroupCd); // 대분류 Api
    }, [questionIdKey]);

    return (
        <>
            <MainCard title="교육 관리">
                <Typography variant="body1">
                    <Row gutter={[8, 8]} style={{ marginBottom: 16 }}>
                        <Col span={12}>
                            <div style={{ display: 'flex', justifyContent: 'flex-start', fontSize: '14px' }}>
                                <Input.Search
                                    placeholder="※ 통합 검색 (문제ID, 문제타입, 학습레벨, 질문)"
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
                            return record.key === questionIdKey ? `table-row-lightblue` : '';
                        }}
                        bordered={true}
                        dataSource={selectTheoryListData}
                        loading={loading}
                        columns={columns}
                        rowSelection={rowSelection}
                        size="middle"
                    />
                </Typography>
            </MainCard>

            {/* 추가 폼 Start */}
            <Drawer
                maskClosable={false}
                title={`교육 관리 ${dataEdit === true ? '수정' : '추가'}`}
                onClose={onAddClose}
                open={open}
                width={650}
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
                    <Form layout="vertical" form={form} autoComplete="off">
                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="form01"
                                    label="문제 타입"
                                    rules={[
                                        {
                                            required: true,
                                            message: '※ 문제 타입 선택'
                                        }
                                    ]}
                                >
                                    <Row>
                                        <Col>
                                            <Select
                                                name="questionType"
                                                style={{ width: '540px' }}
                                                // defaultValue={{
                                                //     value: '',
                                                //     label: '# 문제 타입 선택'
                                                // }}
                                                options={[
                                                    {
                                                        value: '',
                                                        label: '# 문제 타입 선택'
                                                    },
                                                    {
                                                        value: 'A',
                                                        label: '사지선다형'
                                                    },
                                                    {
                                                        value: 'B',
                                                        label: 'O/X형'
                                                    },
                                                    {
                                                        value: 'C',
                                                        label: '이미지선다형'
                                                    },
                                                    {
                                                        value: 'D',
                                                        label: '이미지+사지선다형'
                                                    }
                                                ]}
                                                onChange={(e) => {
                                                    setQuestionType(e);
                                                    form.resetFields();
                                                    setItemContainer(null);
                                                    setUploadedImages3([]);
                                                    setUploadedImages4([]);
                                                }}
                                                value={
                                                    itemContainer?.questionType === null || itemContainer?.questionType === undefined
                                                        ? questionType
                                                        : itemContainer?.questionType
                                                }
                                                disabled={dataEdit}
                                            />
                                        </Col>
                                    </Row>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    name="form00"
                                    label="학습 레벨"
                                    rules={[
                                        {
                                            required: true,
                                            message: '차수명 입력'
                                        }
                                    ]}
                                >
                                    <Row>
                                        <Col>
                                            <Select
                                                name="studyLvl"
                                                defaultValue={{
                                                    value: 0,
                                                    label: '# 학습 레벨'
                                                }}
                                                style={{
                                                    width: '260px'
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
                                                onChange={(e) => {
                                                    setItemContainer({ ...itemContainer, studyLvl: e });
                                                }}
                                                value={itemContainer?.studyLvl}
                                            />
                                        </Col>
                                    </Row>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="form05"
                                    label="사용여부"
                                    rules={[
                                        {
                                            required: true,
                                            message: '※ 사용여부 선택'
                                        }
                                    ]}
                                >
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
                        <Divider style={{ margin: '10px 0' }} />

                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="form02"
                                    label="대분류"
                                    rules={[
                                        {
                                            required: true,
                                            message: '※ 대분류 선택'
                                        }
                                    ]}
                                >
                                    <Row>
                                        <Col>
                                            <Select
                                                name="lageGroupCd"
                                                defaultValue={{
                                                    value: 0,
                                                    label: '# 대분류'
                                                }}
                                                style={{
                                                    width: '540px'
                                                }}
                                                loading={loading_L}
                                                options={lTheoryGroupData}
                                                onChange={(e) => {
                                                    setItemContainer({ ...itemContainer, lageGroupCd: e });
                                                    setLoading_M(true);
                                                    handle_M_TheoryGroup_Api(e);
                                                }}
                                                value={itemContainer?.lageGroupCd}
                                            />
                                        </Col>
                                    </Row>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />

                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="form03"
                                    label="중분류"
                                    rules={[
                                        {
                                            required: true,
                                            message: '※ 중분류 선택'
                                        }
                                    ]}
                                >
                                    <Row>
                                        <Col>
                                            <Select
                                                name="middleGroupCd"
                                                defaultValue={{
                                                    value: 0,
                                                    label: '# 중분류'
                                                }}
                                                style={{
                                                    width: '540px'
                                                }}
                                                loading={loading_M}
                                                options={mTheoryGroupData}
                                                onChange={(e) => {
                                                    setItemContainer({ ...itemContainer, middleGroupCd: e });
                                                    setLoading_S(true);
                                                    handle_S_TheoryGroup_Api(e);
                                                }}
                                                value={itemContainer?.middleGroupCd}
                                            />
                                        </Col>
                                    </Row>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />

                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="form04"
                                    label="소분류"
                                    rules={[
                                        {
                                            required: true,
                                            message: '※ 소분류 선택'
                                        }
                                    ]}
                                >
                                    <Row>
                                        <Col>
                                            <Select
                                                name="smallGroupCd"
                                                defaultValue={{
                                                    value: 0,
                                                    label: '# 소분류'
                                                }}
                                                style={{
                                                    width: '540px'
                                                }}
                                                loading={loading_S}
                                                options={sTheoryGroupData}
                                                onChange={(e) => {
                                                    setItemContainer({ ...itemContainer, smallGroupCd: e });
                                                }}
                                                value={itemContainer?.smallGroupCd}
                                            />
                                        </Col>
                                    </Row>
                                </Form.Item>
                            </Col>
                        </Row>
                        {questionType === 'A' || itemContainer?.questionType === 'A' ? (
                            <>
                                <Divider style={{ margin: '10px 0' }} />
                                <Card bordered style={{ height: '110px' }}>
                                    <Row gutter={24}>
                                        <Col span={24}>
                                            <Form.Item
                                                name="formChk0"
                                                label="질문"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: '※ 질문 입력'
                                                    }
                                                ]}
                                            >
                                                <Row>
                                                    <Col>
                                                        <Input
                                                            name="question"
                                                            style={{ width: '490px' }}
                                                            placeholder="# 질문"
                                                            value={itemContainer?.question}
                                                            onChange={(e) =>
                                                                setItemContainer({ ...itemContainer, question: e.target.value })
                                                            }
                                                        />
                                                    </Col>
                                                </Row>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Card>
                                <p style={{ margin: '10px 0' }} />
                                <Card bordered>
                                    <Row gutter={24}>
                                        <Col span={24}>
                                            <Space>
                                                <Form.Item
                                                    name="formChk1"
                                                    label="1"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '※ 1번 항목 입력'
                                                        }
                                                    ]}
                                                >
                                                    <Row>
                                                        <Col>
                                                            <Input
                                                                name="choice1"
                                                                placeholder="# 1"
                                                                value={itemContainer?.choice1}
                                                                onChange={(e) => {
                                                                    setItemContainer({ ...itemContainer, choice1: e.target.value });
                                                                }}
                                                                style={{ width: '404px' }}
                                                            />
                                                        </Col>
                                                    </Row>
                                                </Form.Item>
                                                <Radio.Button
                                                    name="actionDiv"
                                                    checked={itemContainer?.actionDiv === '1'}
                                                    onChange={() => setItemContainer({ ...itemContainer, actionDiv: '1' })}
                                                    style={
                                                        itemContainer?.actionDiv === '1'
                                                            ? {
                                                                  marginTop: '7px',
                                                                  backgroundColor: '#1890ff',
                                                                  color: '#ffffff'
                                                              }
                                                            : { marginTop: '7px' }
                                                    }
                                                >
                                                    정답 선택
                                                </Radio.Button>
                                            </Space>
                                        </Col>
                                    </Row>
                                    <Row gutter={24}>
                                        <Col span={24}>
                                            <Space>
                                                <Form.Item
                                                    name="formChk2"
                                                    label="2"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '※ 2번 항목 입력'
                                                        }
                                                    ]}
                                                >
                                                    <Row>
                                                        <Col>
                                                            <Input
                                                                name="choice2"
                                                                placeholder="# 2"
                                                                value={itemContainer?.choice2}
                                                                onChange={(e) => {
                                                                    setItemContainer({ ...itemContainer, choice2: e.target.value });
                                                                }}
                                                                style={{ width: '404px' }}
                                                            />
                                                        </Col>
                                                    </Row>
                                                </Form.Item>
                                                <Radio.Button
                                                    name="actionDiv"
                                                    checked={itemContainer?.actionDiv === '2'}
                                                    onChange={() => setItemContainer({ ...itemContainer, actionDiv: '2' })}
                                                    style={
                                                        itemContainer?.actionDiv === '2'
                                                            ? {
                                                                  marginTop: '7px',
                                                                  backgroundColor: '#1890ff',
                                                                  color: '#ffffff'
                                                              }
                                                            : { marginTop: '7px' }
                                                    }
                                                >
                                                    정답 선택
                                                </Radio.Button>
                                            </Space>
                                        </Col>
                                    </Row>
                                    <Row gutter={24}>
                                        <Col span={24}>
                                            <Space>
                                                <Form.Item
                                                    name="formChk3"
                                                    label="3"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '※ 3번 항목 입력'
                                                        }
                                                    ]}
                                                >
                                                    <Row>
                                                        <Col>
                                                            <Input
                                                                name="choice3"
                                                                placeholder="# 3"
                                                                value={itemContainer?.choice3}
                                                                onChange={(e) => {
                                                                    setItemContainer({ ...itemContainer, choice3: e.target.value });
                                                                }}
                                                                style={{ width: '404px' }}
                                                            />
                                                        </Col>
                                                    </Row>
                                                </Form.Item>
                                                <Radio.Button
                                                    name="actionDiv"
                                                    checked={itemContainer?.actionDiv === '3'}
                                                    onChange={() => setItemContainer({ ...itemContainer, actionDiv: '3' })}
                                                    style={
                                                        itemContainer?.actionDiv === '3'
                                                            ? {
                                                                  marginTop: '7px',
                                                                  backgroundColor: '#1890ff',
                                                                  color: '#ffffff'
                                                              }
                                                            : { marginTop: '7px' }
                                                    }
                                                >
                                                    정답 선택
                                                </Radio.Button>
                                            </Space>
                                        </Col>
                                    </Row>
                                    <Row gutter={24}>
                                        <Col span={24}>
                                            <Space>
                                                <Form.Item
                                                    name="formChk4"
                                                    label="4"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '※ 4번 항목 입력'
                                                        }
                                                    ]}
                                                >
                                                    <Row>
                                                        <Col>
                                                            <Input
                                                                name="choice4"
                                                                placeholder="# 4"
                                                                value={itemContainer?.choice4}
                                                                onChange={(e) => {
                                                                    setItemContainer({ ...itemContainer, choice4: e.target.value });
                                                                }}
                                                                style={{ width: '404px' }}
                                                            />
                                                        </Col>
                                                    </Row>
                                                </Form.Item>
                                                <Radio.Button
                                                    name="actionDiv"
                                                    checked={itemContainer?.actionDiv === '4'}
                                                    onChange={() => setItemContainer({ ...itemContainer, actionDiv: '4' })}
                                                    style={
                                                        itemContainer?.actionDiv === '4'
                                                            ? {
                                                                  marginTop: '7px',
                                                                  backgroundColor: '#1890ff',
                                                                  color: '#ffffff'
                                                              }
                                                            : { marginTop: '7px' }
                                                    }
                                                >
                                                    정답 선택
                                                </Radio.Button>
                                            </Space>
                                        </Col>
                                    </Row>
                                </Card>
                            </>
                        ) : questionType === 'B' || itemContainer?.questionType === 'B' ? ( //질문 : Quest_answer2, 정답 : Quest_answer2_1 ~ Quest_answer2_4
                            <>
                                <Divider style={{ margin: '10px 0' }} />
                                <Card bordered style={{ height: '110px' }}>
                                    <Row gutter={24}>
                                        <Col span={24}>
                                            <Form.Item
                                                name="formChk1"
                                                label="질문"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Please Enter Question.'
                                                    }
                                                ]}
                                            >
                                                <Row>
                                                    <Col>
                                                        <Input
                                                            name="question"
                                                            placeholder="# 질문"
                                                            style={{ width: '510px' }}
                                                            value={itemContainer?.question}
                                                            onChange={(e) =>
                                                                setItemContainer({ ...itemContainer, question: e.target.value })
                                                            }
                                                        />
                                                    </Col>
                                                </Row>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Card>
                                <p style={{ margin: '10px 0' }} />
                                <Card bordered>
                                    <Row gutter={24}>
                                        <Col span={24}>
                                            <Form.Item
                                                name="formChk1"
                                                label="정답"
                                                rules={[
                                                    {
                                                        required: true
                                                    }
                                                ]}
                                            >
                                                <Row>
                                                    <Col>
                                                        <Radio.Group
                                                            name="choice1"
                                                            onChange={(e) =>
                                                                setItemContainer({ ...itemContainer, actionDiv: e.target.value })
                                                            }
                                                            buttonStyle="solid"
                                                            value={itemContainer?.actionDiv}
                                                            style={{ textAlign: 'center' }}
                                                        >
                                                            <Radio.Button
                                                                value="O"
                                                                style={{ height: '80px', lineHeight: '80px', padding: '0 40px' }}
                                                            >
                                                                <span style={{ fontSize: '16px' }}>O</span>
                                                            </Radio.Button>
                                                            <span style={{ padding: '0 10px' }}></span>
                                                            <Radio.Button
                                                                value="X"
                                                                style={{ height: '80px', lineHeight: '80px', padding: '0 40px' }}
                                                            >
                                                                <span style={{ fontSize: '16px' }}>X</span>
                                                            </Radio.Button>
                                                        </Radio.Group>
                                                    </Col>
                                                </Row>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Card>
                            </>
                        ) : questionType === 'C' || itemContainer?.questionType === 'C' ? ( //질문 : Quest_quest3, 정답 : Quest_answer3
                            <>
                                <Divider style={{ margin: '10px 0' }} />
                                <Card bordered style={{ height: '110px' }}>
                                    <Row gutter={24}>
                                        <Col span={24}>
                                            <Form.Item
                                                name="formChk1"
                                                label="질문"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Please Enter Question.'
                                                    }
                                                ]}
                                            >
                                                <Row>
                                                    <Col>
                                                        <Input
                                                            name="question"
                                                            placeholder="# 질문"
                                                            style={{ width: '510px' }}
                                                            value={itemContainer?.question}
                                                            onChange={(e) =>
                                                                setItemContainer({ ...itemContainer, question: e.target.value })
                                                            }
                                                        />
                                                    </Col>
                                                </Row>
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
                                            {uploadedImages3?.length === 0 ? (
                                                <Space wrap>
                                                    <Button
                                                        {...getRootProps3()}
                                                        className={`dropzone ${isDragActive3 ? 'active' : ''}`}
                                                        style={{ padding: '10px 160px', height: '150px' }}
                                                        size="large"
                                                        disabled={uploadedImages3?.length >= 4}
                                                    >
                                                        <p>
                                                            <UploadOutlined />
                                                        </p>
                                                        <input {...getInputProps3()} type="file" />
                                                        {isDragActive3 ? (
                                                            <p>이미지를 여기에 놓아주세요...</p>
                                                        ) : (
                                                            <>
                                                                <p>
                                                                    <Text type="warning">이미지선다형</Text>
                                                                    <br />
                                                                    이미지를 드래그하거나 클릭하여 업로드하세요.
                                                                </p>
                                                            </>
                                                        )}
                                                    </Button>
                                                </Space>
                                            ) : (
                                                <>
                                                    <Card bordered>
                                                        <Row gutter={24}>
                                                            <Col span={24}>
                                                                <h2>정답을 선택해주세요</h2>
                                                            </Col>
                                                        </Row>
                                                        <Space style={{ textAlign: 'center' }}>
                                                            <Row gutter={24}>
                                                                {uploadedImages3?.map((image3, index) => (
                                                                    <Col key={index} span={12}>
                                                                        <Form.Item
                                                                            name={`formChk${index + 1}`}
                                                                            style={{ marginTop: '6px' }}
                                                                        >
                                                                            <Row>
                                                                                <Col>
                                                                                    <Button
                                                                                        name="Quest_answer3"
                                                                                        type="danger"
                                                                                        icon={<DeleteOutlined />}
                                                                                        onClick={() => handleImageDelete3(index)}
                                                                                        style={{ marginBottom: '6px' }}
                                                                                    >
                                                                                        {image3.name}
                                                                                    </Button>
                                                                                    <img
                                                                                        src={image3.base64Image}
                                                                                        alt={image3.name}
                                                                                        style={{ width: '120px' }}
                                                                                    />
                                                                                    <Radio.Button
                                                                                        name={`choice${index + 1}`}
                                                                                        onChange={() =>
                                                                                            setItemContainer({
                                                                                                ...itemContainer,
                                                                                                actionDiv: index + 1
                                                                                            })
                                                                                        }
                                                                                        style={
                                                                                            itemContainer?.actionDiv === index + 1
                                                                                                ? {
                                                                                                      width: '120px',
                                                                                                      top: '10px',
                                                                                                      backgroundColor: '#1890ff',
                                                                                                      color: '#ffffff'
                                                                                                  }
                                                                                                : { width: '120px', top: '10px' }
                                                                                        }
                                                                                        value={itemContainer?.actionDiv}
                                                                                    >
                                                                                        정답 선택
                                                                                    </Radio.Button>
                                                                                </Col>
                                                                            </Row>
                                                                        </Form.Item>
                                                                    </Col>
                                                                ))}
                                                            </Row>
                                                        </Space>
                                                    </Card>
                                                </>
                                            )}
                                        </Space>
                                    </Col>
                                </Row>
                            </>
                        ) : questionType === 'D' || itemContainer?.questionType === 'D' ? ( //질문 : Quest_quest4, 정답 : Quest_answer4
                            <>
                                <Divider style={{ margin: '10px 0' }} />
                                <Card bordered style={{ height: '110px' }}>
                                    <Row gutter={24}>
                                        <Col span={24}>
                                            <Form.Item
                                                name="formChk"
                                                label="질문"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Please Enter Question.'
                                                    }
                                                ]}
                                            >
                                                <Row>
                                                    <Col>
                                                        <Input
                                                            name="question"
                                                            placeholder="# 질문"
                                                            value={itemContainer?.question}
                                                            onChange={(e) =>
                                                                setItemContainer({ ...itemContainer, question: e.target.value })
                                                            }
                                                            style={{ width: '490px' }}
                                                        />
                                                    </Col>
                                                </Row>
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
                                            {uploadedImages4?.length === 0 ? (
                                                <Space wrap>
                                                    <Button
                                                        {...getRootProps4()}
                                                        className={`dropzone ${isDragActive4 ? 'active' : ''}`}
                                                        style={{ padding: '10px 160px', height: '150px' }}
                                                        size="large"
                                                        disabled={uploadedImages4?.length >= 1}
                                                    >
                                                        <p>
                                                            <UploadOutlined />
                                                        </p>
                                                        <input {...getInputProps4()} />
                                                        {isDragActive4 ? (
                                                            <p>이미지를 여기에 놓아주세요...</p>
                                                        ) : (
                                                            <>
                                                                <p>
                                                                    <Text type="warning">이미지+사지선다형</Text>
                                                                    <br />
                                                                    이미지를 드래그하거나 클릭하여 업로드하세요.
                                                                </p>
                                                            </>
                                                        )}
                                                    </Button>
                                                </Space>
                                            ) : (
                                                <>
                                                    <Card bordered>
                                                        <Space style={{ textAlign: 'center', marginBottom: '20px' }}>
                                                            <Row gutter={24}>
                                                                {uploadedImages4?.map((image4, index) => (
                                                                    <React.Fragment key={index}>
                                                                        <Col span={12}>
                                                                            <img
                                                                                src={image4.base64Image}
                                                                                alt={image4.name}
                                                                                style={{ width: '120px' }}
                                                                            />
                                                                        </Col>
                                                                        <Col
                                                                            span={12}
                                                                            style={{
                                                                                display: 'flex',
                                                                                alignItems: 'center'
                                                                            }}
                                                                        >
                                                                            <Form.Item name={`imageanswer${index + 1}`}>
                                                                                <Row>
                                                                                    <Col>
                                                                                        <Button
                                                                                            type="danger"
                                                                                            icon={<DeleteOutlined />}
                                                                                            onClick={() => handleImageDelete4(index)}
                                                                                            alt="삭제"
                                                                                            title="삭제"
                                                                                        >
                                                                                            {image4.name}
                                                                                        </Button>
                                                                                    </Col>
                                                                                </Row>
                                                                            </Form.Item>
                                                                        </Col>
                                                                    </React.Fragment>
                                                                ))}
                                                            </Row>
                                                        </Space>
                                                        <Divider style={{ margin: '10px 0' }} />
                                                        <Row gutter={24}>
                                                            <Col span={24}>
                                                                <h2>정답을 입력해주세요</h2>
                                                            </Col>
                                                        </Row>
                                                        <Row gutter={24}>
                                                            <Col span={24}>
                                                                <Space>
                                                                    <Form.Item
                                                                        name="formChk1"
                                                                        label="1"
                                                                        rules={[
                                                                            {
                                                                                required: true,
                                                                                message: 'Please Enter Question.'
                                                                            }
                                                                        ]}
                                                                    >
                                                                        <Row>
                                                                            <Col>
                                                                                <Input
                                                                                    name="choice1"
                                                                                    placeholder="# 1"
                                                                                    onChange={(e) => {
                                                                                        setItemContainer({
                                                                                            ...itemContainer,
                                                                                            choice1: e.target.value
                                                                                        });
                                                                                    }}
                                                                                    style={{ width: '404px' }}
                                                                                    value={itemContainer?.choice1}
                                                                                />
                                                                            </Col>
                                                                        </Row>
                                                                    </Form.Item>
                                                                    <Radio.Button
                                                                        name="actionDiv"
                                                                        checked={itemContainer?.actionDiv === '1'}
                                                                        onChange={() =>
                                                                            setItemContainer({
                                                                                ...itemContainer,
                                                                                actionDiv: '1'
                                                                            })
                                                                        }
                                                                        style={
                                                                            itemContainer?.actionDiv === '1'
                                                                                ? {
                                                                                      marginTop: '7px',
                                                                                      backgroundColor: '#1890ff',
                                                                                      color: '#ffffff'
                                                                                  }
                                                                                : { marginTop: '7px' }
                                                                        }
                                                                    >
                                                                        정답 선택
                                                                    </Radio.Button>
                                                                </Space>
                                                            </Col>
                                                        </Row>
                                                        <Row gutter={24}>
                                                            <Col span={24}>
                                                                <Space>
                                                                    <Form.Item
                                                                        name="formChk2"
                                                                        label="2"
                                                                        rules={[
                                                                            {
                                                                                required: true,
                                                                                message: 'Please Enter Question.'
                                                                            }
                                                                        ]}
                                                                    >
                                                                        <Row>
                                                                            <Col>
                                                                                <Input
                                                                                    name="choice2"
                                                                                    placeholder="# 2"
                                                                                    value={itemContainer?.choice2}
                                                                                    onChange={(e) => {
                                                                                        setItemContainer({
                                                                                            ...itemContainer,
                                                                                            choice2: e.target.value
                                                                                        });
                                                                                    }}
                                                                                    style={{ width: '404px' }}
                                                                                />
                                                                            </Col>
                                                                        </Row>
                                                                    </Form.Item>
                                                                    <Radio.Button
                                                                        name="actionDiv"
                                                                        checked={itemContainer?.actionDiv === '2'}
                                                                        onChange={() =>
                                                                            setItemContainer({
                                                                                ...itemContainer,
                                                                                actionDiv: '2'
                                                                            })
                                                                        }
                                                                        style={
                                                                            itemContainer?.actionDiv === '2'
                                                                                ? {
                                                                                      marginTop: '7px',
                                                                                      backgroundColor: '#1890ff',
                                                                                      color: '#ffffff'
                                                                                  }
                                                                                : { marginTop: '7px' }
                                                                        }
                                                                    >
                                                                        정답 선택
                                                                    </Radio.Button>
                                                                </Space>
                                                            </Col>
                                                        </Row>
                                                        <Row gutter={24}>
                                                            <Col span={24}>
                                                                <Space>
                                                                    <Form.Item
                                                                        name="formChk2"
                                                                        label="3"
                                                                        rules={[
                                                                            {
                                                                                required: true,
                                                                                message: 'Please Enter Question.'
                                                                            }
                                                                        ]}
                                                                    >
                                                                        <Row>
                                                                            <Col>
                                                                                <Input
                                                                                    name="choice3"
                                                                                    placeholder="# 3"
                                                                                    value={itemContainer?.choice3}
                                                                                    onChange={(e) => {
                                                                                        setItemContainer({
                                                                                            ...itemContainer,
                                                                                            choice3: e.target.value
                                                                                        });
                                                                                    }}
                                                                                    style={{ width: '404px' }}
                                                                                />
                                                                            </Col>
                                                                        </Row>
                                                                    </Form.Item>
                                                                    <Radio.Button
                                                                        name="actionDiv"
                                                                        checked={itemContainer?.actionDiv === '3'}
                                                                        onChange={() =>
                                                                            setItemContainer({
                                                                                ...itemContainer,
                                                                                actionDiv: '3'
                                                                            })
                                                                        }
                                                                        style={
                                                                            itemContainer?.actionDiv === '3'
                                                                                ? {
                                                                                      marginTop: '7px',
                                                                                      backgroundColor: '#1890ff',
                                                                                      color: '#ffffff'
                                                                                  }
                                                                                : { marginTop: '7px' }
                                                                        }
                                                                    >
                                                                        정답 선택
                                                                    </Radio.Button>
                                                                </Space>
                                                            </Col>
                                                        </Row>
                                                        <Row gutter={24}>
                                                            <Col span={24}>
                                                                <Space>
                                                                    <Form.Item
                                                                        name="formChk2"
                                                                        label="4"
                                                                        rules={[
                                                                            {
                                                                                required: true,
                                                                                message: 'Please Enter Question.'
                                                                            }
                                                                        ]}
                                                                    >
                                                                        <Row>
                                                                            <Col>
                                                                                <Input
                                                                                    name="choice4"
                                                                                    placeholder="# 4"
                                                                                    value={itemContainer?.choice4}
                                                                                    onChange={(e) => {
                                                                                        setItemContainer({
                                                                                            ...itemContainer,
                                                                                            choice4: e.target.value
                                                                                        });
                                                                                    }}
                                                                                    style={{ width: '404px' }}
                                                                                />
                                                                            </Col>
                                                                        </Row>
                                                                    </Form.Item>
                                                                    <Radio.Button
                                                                        name="actionDiv"
                                                                        checked={itemContainer?.actionDiv === '4'}
                                                                        onChange={() =>
                                                                            setItemContainer({
                                                                                ...itemContainer,
                                                                                actionDiv: '4'
                                                                            })
                                                                        }
                                                                        style={
                                                                            itemContainer?.actionDiv === '4'
                                                                                ? {
                                                                                      marginTop: '7px',
                                                                                      backgroundColor: '#1890ff',
                                                                                      color: '#ffffff'
                                                                                  }
                                                                                : { marginTop: '7px' }
                                                                        }
                                                                    >
                                                                        정답 선택
                                                                    </Radio.Button>
                                                                </Space>
                                                            </Col>
                                                        </Row>
                                                    </Card>
                                                </>
                                            )}
                                        </Space>
                                    </Col>
                                </Row>
                            </>
                        ) : (
                            ''
                        )}
                    </Form>
                </MainCard>
            </Drawer>
            {/* 추가 폼 End */}
        </>
    );
};
