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
    Badge,
    Card,
    Divider,
    Tag
} from 'antd';
import 'antd/dist/antd.css';
import { PlusOutlined, DeleteFilled, EditFilled, ExclamationCircleFilled, CopyOutlined } from '@ant-design/icons';

// 학습모듈 관리 - 조회, 등록, 상세, 수정, 삭제 가져오기
import {
    useSelectModuleListMutation, // 조회
    useInsertModuleMutation, // 등록
    useSelectModuleMutation, // 상세
    useUpdateModuleMutation, // 수정
    useDeleteModuleMutation // 삭제
} from '../../../hooks/api/CurriculumManagement/CurriculumManagement';

// project import
import MainCard from 'components/MainCard';

import { XrayInformation } from 'pages/learning/curriculum/XrayInformation';

export const Curriculum = () => {
    const { confirm } = Modal;
    const [form] = Form.useForm();

    const [moduleId, setModuleId] = useState(); // 선택된 모듈 ID
    const [questionsModalOpen, setQuestionsModalOpen] = useState(); // 문항출제 팝업
    const [modulecopyModalOpen, setModulecopyModalOpen] = useState(); // 모듈복사 팝업
    const [bagList, setBagList] = useState([null]); // 출제문항 목록 배열
    const [itemContainer, setItemContainer] = useState({}); // 항목 컨테이너
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); //셀렉트 박스 option Selected 값
    const [open, setOpen] = useState(false);
    const [dataEdit, setDataEdit] = useState(false); // Drawer 수정 우측폼 상태

    const [moduleNm, setModuleNm] = useState(); // 모듈 복사 모듈명
    const [copyModuleNm, setCopyModuleNm] = useState(); // 모듈 복사 모듈명
    const [confirmLoading, setConfirmLoading] = useState(false); // 복사 버튼 로딩

    // ===============================
    // Api 호출 Start
    // 조회 ======================================================
    const [selectModuleListApi] = useSelectModuleListMutation(); // 조회 hooks api호출
    const [selectModuleListData, setSelectModuleListData] = useState([]); // 조회 Data 값
    const [selectModuleListLoading, setSelectModuleListLoading] = useState(false); // 로딩
    const handel_selectModuleList_Api = async () => {
        const SelectModuleListresponse = await selectModuleListApi({});
        setSelectModuleListData([
            ...SelectModuleListresponse?.data?.RET_DATA.map((d, i) => ({
                key: d.moduleId,
                rowdata0: i + 1, // 시퀀스
                rowdata1: d.moduleNm, // 모듈명
                rowdata2: d.studyLvl, // 난이도레벨
                rowdata3: d.slideSpeed, // 슬라이드스피드
                rowdata4: d.questionCnt, // 출제문제수
                rowdata5: d.moduleType, // 모듈타입
                rowdata6: d.learningType, // 학습방식
                rowdata7: d.failToPass, // 금지물품 통과시 불합격 처리
                rowdata8: d.useYn, // 사용여부
                rowdata9: d.insertDate, // 등록일자
                rowdata10: d.moduleDesc // 모듈설명
            }))
        ]);
        setSelectModuleListLoading(false);
    };
    const defaultColumns = [
        {
            title: 'No.',
            dataIndex: 'rowdata0',
            align: 'center'
        },
        {
            title: '모듈명',
            dataIndex: 'rowdata1',
            align: 'center',
            render: (_, { rowdata1, rowdata10 }) => (
                <Tooltip placement="top" title={rowdata10} arrow={true}>
                    {rowdata1}
                </Tooltip>
            )
        },

        {
            title: '모듈타입',
            dataIndex: 'rowdata5',
            align: 'center',
            render: (_, { rowdata5 }) => <> {rowdata5 === 's' ? 'Slide' : 'Cut'} </>
        },
        {
            title: '학습방식',
            dataIndex: 'rowdata6',
            align: 'center',
            render: (_, { rowdata6 }) => <> {rowdata6 === 'l' ? '학습' : '평가'} </>
        },
        {
            title: '난이도 레벨',
            dataIndex: 'rowdata2',
            align: 'center',
            render: (_, { rowdata2 }) => <> {rowdata2 + 'Lv'} </>
        },
        {
            title: '슬라이드 스피드',
            dataIndex: 'rowdata3',
            align: 'center',
            render: (_, { rowdata3 }) => <> {rowdata3 === '0' ? '-' : rowdata3 + '초'} </>
        },
        {
            title: '출제 문항 수',
            dataIndex: 'rowdata4',
            align: 'center'
        },

        {
            title: '금지물품 통과시 불합격 처리',
            dataIndex: 'rowdata7',
            align: 'center',
            render: (_, { rowdata7 }) => (
                <>
                    {rowdata7 === 'Y' ? (
                        <Tag color={'green'} key={rowdata7}>
                            사용
                        </Tag>
                    ) : (
                        <Tag color={'volcano'} key={rowdata7}>
                            미사용
                        </Tag>
                    )}
                </>
            )
        },
        {
            title: '사용여부',
            dataIndex: 'rowdata8',
            align: 'center',
            render: (_, { rowdata8 }) => (
                <>
                    {rowdata8 === 'Y' ? (
                        <Tag color={'green'} key={rowdata8}>
                            사용
                        </Tag>
                    ) : (
                        <Tag color={'volcano'} key={rowdata8}>
                            미사용
                        </Tag>
                    )}
                </>
            )
        },
        {
            title: '등록일자',
            dataIndex: 'rowdata9',
            align: 'center'
        },
        {
            title: '수정',
            render: (_, { key, rowdata1 }) => (
                <>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
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

                        <Tooltip title="복사" color="#f6951d">
                            <Button
                                type="default"
                                onClick={() => handleCopy(key, rowdata1)}
                                style={{
                                    backgroundColor: '#f6951d',
                                    borderColor: '#f6951d',
                                    color: '#ffffff',
                                    borderRadius: '5px',
                                    boxShadow: '2px 3px 0px 0px #dbdbdb'
                                }}
                                icon={<CopyOutlined />}
                            >
                                복사
                            </Button>
                        </Tooltip>
                    </div>
                </>
            ),
            align: 'center'
        }
    ];

    // 등록 ======================================================
    const [insertModuleApi] = useInsertModuleMutation(); // 등록 hooks api호출
    const handel_insertModule_Api = async () => {
        const SelectModuleListresponse = await insertModuleApi({
            moduleNm: itemContainer.moduleNm,
            moduleDesc: itemContainer.moduleDesc,
            studyLvl: itemContainer.studyLvl,
            slideSpeed: itemContainer.slideSpeed,
            moduleType: itemContainer.moduleType,
            learningType: itemContainer.learningType,
            failToPass: itemContainer.failToPass,
            timeLimit: itemContainer.timeLimit,
            useYn: itemContainer.useYn,
            questionCnt: itemContainer.questionCnt,
            bagList: bagList
        });

        SelectModuleListresponse?.data?.RET_CODE === '0100'
            ? Modal.success({
                  content: '등록 완료',
                  onOk() {
                      setOpen(false);
                      setDataEdit(false);
                      form.resetFields();
                      handel_selectModuleList_Api();
                  }
              })
            : Modal.error({
                  content: '등록 오류',
                  onOk() {}
              });
    };

    // 상세정보 ======================================================
    const [selectModuleApi] = useSelectModuleMutation(); // 상세 hooks api호출
    const handel_SelectModule_Api = async (moduleId) => {
        const SelectModuleresponse = await selectModuleApi({
            moduleId: moduleId
        });

        setItemContainer(SelectModuleresponse.data.RET_DATA);
        setBagList(SelectModuleresponse.data.RET_DATA.bagList);
    };

    // 수정 ======================================================
    const [updateModulApi] = useUpdateModuleMutation(); // 수정 hooks api호출
    const handel_UpdateModul_Api = async (moduleId) => {
        const UpdateModulresponse = await updateModulApi({
            moduleId: moduleId,
            moduleNm: itemContainer.moduleNm,
            moduleDesc: itemContainer.moduleDesc,
            studyLvl: itemContainer.studyLvl,
            slideSpeed: itemContainer.slideSpeed,
            moduleType: itemContainer.moduleType,
            learningType: itemContainer.learningType,
            failToPass: itemContainer.failToPass,
            timeLimit: itemContainer.timeLimit,
            useYn: itemContainer.useYn,
            questionCnt: itemContainer.questionCnt,
            bagList: bagList
        });

        UpdateModulresponse?.data?.RET_CODE === '0100'
            ? Modal.success({
                  content: '수정 완료',
                  onOk() {
                      setOpen(false);
                      setDataEdit(false);
                      form.resetFields();
                      handel_selectModuleList_Api();
                  }
              })
            : Modal.error({
                  content: '수정 오류',
                  onOk() {}
              });
    };

    // 삭제 ======================================================
    const [deleteModuleApi] = useDeleteModuleMutation(); // 삭제 hooks api호출
    const handel_DeleteModule_Api = async (moduleId) => {
        const DeleteModuleresponse = await deleteModuleApi({
            moduleIdList: moduleId
        });
        DeleteModuleresponse?.data?.RET_CODE === '0300'
            ? Modal.success({
                  content: '삭제 완료',
                  onOk() {
                      handel_selectModuleList_Api();
                  }
              })
            : Modal.error({
                  content: '삭제 오류',
                  onOk() {}
              });
    };
    // Api 호출 End
    // ===============================

    // 제한 시간 Value 설정 Start
    const Minute_Opt = [];
    for (let i = 5; i <= 120; i += 5) {
        Minute_Opt.push({ value: i.toString(), label: i.toString() + '분' });
    }
    // 제한 시간 Value 설정 End

    const handleSave = (row) => {
        const newData = [...selectModuleListData];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row
        });
        setSelectModuleListData(newData);
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

    // 출제 문항 검색 Modal Start
    const Questions_Modal = () => {
        setQuestionsModalOpen(true);
    };

    // 출제 문항 선택 완료 (Modal 닫기)
    const Questions_handleOk = (Question_Value) => {
        // console.log('문제 출제:', Question_Value);
        setBagList(Question_Value);
        setItemContainer({ ...itemContainer, questionCnt: Question_Value.length });
        setQuestionsModalOpen(false);
    };

    // 출제 문항 Modal 닫기
    const Questions_handleCancel = () => {
        setQuestionsModalOpen(false);
    };

    // 모듈 복사 Modal 닫기
    const copy_handlecancel = () => {
        setCopyModuleNm('');
        setModulecopyModalOpen(false);
    };

    // 모듈 복사 Modal 복사처리
    const copy_handle = () => {
        console.log(copyModuleNm);
        setConfirmLoading(true);
        setTimeout(() => {
            setModulecopyModalOpen(false);
            setConfirmLoading(false);
        }, 1000);
        setCopyModuleNm('');
    };

    //체크 박스 이벤트
    const onSelectChange = (newSelectedRowKeys) => {
        // console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    //체크 박스 선택
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange
    };

    // 추가 버튼
    const handleAdd = () => {
        setItemContainer(null);
        form.resetFields();
        setDataEdit(false);
        setOpen(true);
    };

    // 추가/수정 취소
    const onAddClose = () => {
        setBagList(null);
        setItemContainer(null);
        form.resetFields();
        setOpen(false);
        setDataEdit(false);
    };

    // 수정 버튼
    const handleEdit = (moduleId) => {
        handel_SelectModule_Api(moduleId);
        setModuleId(moduleId);
        form.resetFields();
        setDataEdit(true);
        setOpen(true);
    };

    // 복사 버튼
    const handleCopy = (moduleId, moduleNm) => {
        setModuleId(moduleId);
        setModuleNm(moduleNm);

        form.resetFields();
        setModulecopyModalOpen(true);
    };

    // 추가 및 수정 처리
    const onAddSubmit = () => {
        if (dataEdit === true) {
            handel_UpdateModul_Api(moduleId);
        } else {
            handel_insertModule_Api();
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
                    handel_DeleteModule_Api(selectedRowKeys);
                },
                onCancel() {}
            });
        }
    };

    useEffect(() => {
        setSelectModuleListLoading(true); // 로딩 호출
        handel_selectModuleList_Api(); // 조회
    }, []);

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
                        rowClassName={() => 'editable-row'}
                        bordered={true}
                        dataSource={selectModuleListData}
                        loading={selectModuleListLoading}
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
                                    name="form01"
                                    label="모듈명"
                                    rules={[
                                        {
                                            required: true,
                                            message: '※ 모듈명을 입력하세요'
                                        }
                                    ]}
                                >
                                    <Row>
                                        <Col>
                                            <Input
                                                style={{
                                                    width: '390px'
                                                }}
                                                name="moduleNm"
                                                onChange={(e) => setItemContainer({ ...itemContainer, moduleNm: e.target.value })}
                                                placeholder="# 모듈명"
                                                value={itemContainer?.moduleNm}
                                            />
                                        </Col>
                                    </Row>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="form02"
                                    label="모듈설명"
                                    rules={[
                                        {
                                            required: true,
                                            message: '※ 모듈설명을 입력하세요'
                                        }
                                    ]}
                                >
                                    <Row>
                                        <Col>
                                            <Input
                                                style={{
                                                    width: '390px'
                                                }}
                                                name="moduleDesc"
                                                placeholder="# 모듈설명"
                                                onChange={(e) => setItemContainer({ ...itemContainer, moduleDesc: e.target.value })}
                                                value={itemContainer?.moduleDesc}
                                            />
                                        </Col>
                                    </Row>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    name="form03"
                                    label="모듈타입"
                                    rules={[
                                        {
                                            required: true,
                                            message: '※ 모듈타입을 선택하세요'
                                        }
                                    ]}
                                >
                                    <Row>
                                        <Col>
                                            <Radio.Group
                                                name="moduleType"
                                                onChange={(e) => setItemContainer({ ...itemContainer, moduleType: e.target.value })}
                                                buttonStyle="solid"
                                                value={itemContainer?.moduleType}
                                            >
                                                <Radio.Button value="s">
                                                    <span style={{ padding: '0 3px' }}>Slide 방식</span>
                                                </Radio.Button>
                                                <span style={{ padding: '0 3px' }}></span>
                                                <Radio.Button value="c">
                                                    <span style={{ padding: '0 3px' }}>Cut 방식</span>
                                                </Radio.Button>
                                            </Radio.Group>
                                        </Col>
                                    </Row>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="form04"
                                    label="문제 속도"
                                    rules={[
                                        {
                                            required: true,
                                            message: '※ 문제 속도를 선택하세요'
                                        }
                                    ]}
                                >
                                    <Row>
                                        <Col>
                                            <Select
                                                name="slideSpeed"
                                                defaultValue={{
                                                    value: '',
                                                    label: '# 속도'
                                                }}
                                                style={{
                                                    width: '180px'
                                                }}
                                                value={itemContainer?.slideSpeed}
                                                onChange={(e) => setItemContainer({ ...itemContainer, slideSpeed: e })}
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
                                        </Col>
                                    </Row>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    name="form05"
                                    label="학습방식"
                                    rules={[
                                        {
                                            required: true,
                                            message: '※ 학습방식을 선택하세요'
                                        }
                                    ]}
                                >
                                    <Row>
                                        <Col>
                                            <Select
                                                name="learningType"
                                                defaultValue={{
                                                    value: '',
                                                    label: '# 학습방식'
                                                }}
                                                style={{
                                                    width: '180px'
                                                }}
                                                value={itemContainer?.learningType}
                                                onChange={(e) => setItemContainer({ ...itemContainer, learningType: e })}
                                                options={[
                                                    {
                                                        value: 'l',
                                                        label: '학습'
                                                    },
                                                    {
                                                        value: 'e',
                                                        label: '평가'
                                                    },
                                                    {
                                                        value: 'ai',
                                                        label: 'AI강화학습'
                                                    },
                                                    {
                                                        value: 'as',
                                                        label: '오답문제풀이'
                                                    }
                                                ]}
                                            />
                                        </Col>
                                    </Row>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="form06"
                                    label="금지물품 통과시 불합격 처리"
                                    rules={[
                                        {
                                            required: true,
                                            message: '※ 금지물품 통과시 불합격 처리를 선택하세요'
                                        }
                                    ]}
                                >
                                    <Row>
                                        <Col>
                                            <Radio.Group
                                                name="failToPass"
                                                onChange={(e) => setItemContainer({ ...itemContainer, failToPass: e.target.value })}
                                                buttonStyle="solid"
                                                value={itemContainer?.failToPass}
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
                            <Col span={12}>
                                <Form.Item
                                    name="form07"
                                    label="난이도 레벨"
                                    rules={[
                                        {
                                            required: true,
                                            message: '※ 난이도 레벨을 선택하세요'
                                        }
                                    ]}
                                >
                                    <Row>
                                        <Col>
                                            <Select
                                                name="studyLvl"
                                                defaultValue={{
                                                    value: '',
                                                    label: '# 난이도레벨'
                                                }}
                                                style={{
                                                    width: '180px'
                                                }}
                                                value={itemContainer?.studyLvl}
                                                onChange={(e) => setItemContainer({ ...itemContainer, studyLvl: e })}
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
                                        </Col>
                                    </Row>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="form08"
                                    label="제한시간"
                                    rules={[
                                        {
                                            required: true,
                                            message: '※ 제한시간을 선택하세요'
                                        }
                                    ]}
                                >
                                    <Row>
                                        <Col>
                                            <Select
                                                name="timeLimit"
                                                defaultValue={{
                                                    value: '',
                                                    label: '# 제한시간'
                                                }}
                                                style={{
                                                    width: '180px'
                                                }}
                                                value={itemContainer?.timeLimit}
                                                onChange={(e) => setItemContainer({ ...itemContainer, timeLimit: e })}
                                                options={Minute_Opt}
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
                                    name="form09"
                                    label="사용여부"
                                    rules={[
                                        {
                                            required: true,
                                            message: '※ 사용여부를 선택하세요'
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
                        <Card bordered style={{ textAlign: 'center', margin: '20px 0' }}>
                            <Row>
                                <Col span={24}>
                                    <div>총 출제 문항 수</div>
                                    <Badge
                                        style={{ width: '40px', marginTop: '5px' }}
                                        count={itemContainer?.questionCnt}
                                        color="#52c41a"
                                        overflowCount={9999}
                                    />
                                </Col>
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
                width={1500}
                style={{
                    top: 90,
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
                <XrayInformation QuestionCnt={Questions_handleOk} BagList={bagList?.slice()} />
            </Modal>
            {/* 출제 문항 검색 Modal End */}

            {/* 모듈 복사 Modal Start */}
            <Modal
                title="모듈 복사"
                closable={false}
                open={modulecopyModalOpen}
                onCancel={copy_handlecancel}
                confirmLoading={confirmLoading}
                onOk={copy_handle}
                width={500}
                okText="복사"
                cancelText="취소"
                style={{
                    top: 90,
                    left: 130,
                    zIndex: 999
                }}
            >
                <Card size="small" style={{ marginBottom: '20px', background: '#a7a9ad', color: '#ffffff' }}>
                    복사 대상 모듈명 : {moduleNm}
                </Card>

                <Card title="모듈 복사 명을 입력하세요" size="small">
                    <Input
                        style={{
                            width: '363px'
                        }}
                        name="moduleNm"
                        onChange={(e) => setCopyModuleNm(e.target.value)}
                        placeholder="# 모듈명"
                        value={copyModuleNm}
                    />
                </Card>
            </Modal>
            {/* 모듈 복사 Modal End */}
        </>
    );
};
