/* eslint-disable*/
import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { Row, Col, Table, Button, Select, Form, Modal, Divider, Tag } from 'antd';

// 학습모듈 관리 - 랜덤추출, 물품팝업조회, 모듈에 등록된 문제목록 가져오기
import {
    useSelectModuleRandomMutation, // 랜덤추출
    useSelectModuleXrayPopListMutation, // 물품팝업조회
    useSelectModuleQuestionMutation // 모듈에 등록된 문제목록 가져오기
} from '../../../hooks/api/CurriculumManagement/CurriculumManagement';

// project import
import MainCard from 'components/MainCard';

export const XrayInformation = (props) => {
    const { confirm } = Modal;
    const [randemBoxOpen, setRandemBoxOpen] = useState(false);

    const [selectedRowKeys, setSelectedRowKeys] = useState([]); //셀렉트 박스 option Selected 값(상단)

    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const [randemLevel, setRandemLevel] = useState(0); // 난이도 레벨
    const [randemlimit, setRandemlimit] = useState(5); // 출제 문항수

    // ===============================
    // Api 호출 Start

    // 물품팝업조회 ======================================================
    const [selectModuleXrayPopListApi] = useSelectModuleXrayPopListMutation(); // 물품팝업조회 hooks api호출
    const [selectModuleXrayPopListData, setSelectModuleXrayPopListData] = useState(); // 물품팝업조회 Data 값
    // 데이터 값 선언
    const handle_SelectModuleXrayPopList_Api = async () => {
        const selectModuleXrayPopListresponse = await selectModuleXrayPopListApi({});
        // setSelectModuleXrayPopListData(selectModuleXrayPopListresponse?.data?.RET_DATA);
        setSelectModuleXrayPopListData([
            ...selectModuleXrayPopListresponse?.data?.RET_DATA.map((d, i) => ({
                key: d.bagScanId,
                rowdataNo: i,
                rowdata0: i + 1,
                rowdata1: d.bagScanId /*가방촬영id*/,
                rowdata2: d.unitId /*물품id*/,
                rowdata3: d.unitName /*물품명*/,
                rowdata4: d.openYn /*개봉여부*/,
                rowdata5: d.passYn /*통과여부*/,
                rowdata6: d.actionDivName,
                rowdata7: d.actionDiv /*action구분*/,
                rowdata8: d.studyLvl /*학습Level*/,
                rowdata9: d.useYn /*사용여부*/,
                rowdata10: d.frontUseYn /*정면사용여부*/,
                rowdata11: d.sideUseYn /*측면사용여부*/,
                rowdata12: d.decipMachineCd /*판독기기코드*/,
                rowdata13: d.duplexYn /*양방향여부*/,
                rowdata14: d.seq /*순번*/,
                rowdata15: d.insertDate /*등록일시*/,
                rowdata16: d.insertId /*등록자*/,
                rowdata17: d.updateDate /*수정일시*/,
                rowdata18: d.updateId /*수정자*/
            }))
        ]);
        setLoading(false);
    };

    // 랜덤추출 ======================================================
    const [selectModuleRandomApi] = useSelectModuleRandomMutation(); // 랜덤추출 hooks api호출
    // 랜덤 데이터 값 선언
    const handle_selectModuleRandom_Api = async (randemLevel, randemlimit) => {
        if (randemLevel === '0') {
            handle_SelectModuleXrayPopList_Api();
        } else {
            const selectModuleXrayPopListresponse = await selectModuleRandomApi({
                studyLvl: randemLevel,
                questionCnt: randemlimit
            });
            // setSelectModuleXrayPopListData(selectModuleXrayPopListresponse?.data?.RET_DATA);
            setSelectModuleXrayPopListData([
                ...selectModuleXrayPopListresponse?.data?.RET_DATA.map((d, i) => ({
                    key: d.bagScanId,
                    rowdataNo: i,
                    rowdata0: i + 1,
                    rowdata1: d.bagScanId /*가방촬영id*/,
                    rowdata2: d.unitId /*물품id*/,
                    rowdata3: d.unitName /*물품명*/,
                    rowdata4: d.openYn /*개봉여부*/,
                    rowdata5: d.passYn /*통과여부*/,
                    rowdata6: d.actionDivName,
                    rowdata7: d.actionDiv /*action구분*/,
                    rowdata8: d.studyLvl /*학습Level*/,
                    rowdata9: d.useYn /*사용여부*/,
                    rowdata10: d.frontUseYn /*정면사용여부*/,
                    rowdata11: d.sideUseYn /*측면사용여부*/,
                    rowdata12: d.decipMachineCd /*판독기기코드*/,
                    rowdata13: d.duplexYn /*양방향여부*/,
                    rowdata14: d.seq /*순번*/,
                    rowdata15: d.insertDate /*등록일시*/,
                    rowdata16: d.insertId /*등록자*/,
                    rowdata17: d.updateDate /*수정일시*/,
                    rowdata18: d.updateId /*수정자*/
                }))
            ]);
            setLoading(false);
        }
    };
    // 모듈에 등록된 문제목록 가져오기 ======================================================
    const [selectModuleQuestionApi] = useSelectModuleQuestionMutation(); // 모듈에 등록된 문제목록 가져오기 hooks api호출
    const [selectModuleQuestionData, setSelectModuleQuestionData] = useState(); // 모듈에 등록된 문제목록 가져오기 Data 값

    // Api 호출 End
    // ===============================

    // 상단 테이블 Title
    const defaultColumns = [
        {
            width: '90px',
            title: 'No',
            dataIndex: 'rowdata0',
            align: 'center'
        },
        {
            width: '120px',
            title: '가방촬영ID',
            dataIndex: 'rowdata1',
            align: 'center'
        },
        {
            width: '120px',
            title: '물품ID',
            dataIndex: 'rowdata2',
            align: 'center'
        },
        {
            title: '정답물품',
            dataIndex: 'rowdata3',
            align: 'center'
        },
        {
            width: '80px',
            title: '개봉여부',
            dataIndex: 'rowdata4',
            align: 'center'
        },
        {
            width: '80px',
            title: '통과여부',
            dataIndex: 'rowdata5',
            align: 'center'
        },
        {
            width: '80px',
            title: 'Action구분',
            dataIndex: 'rowdata6',
            align: 'center',
            render: (_, { rowdata6 }) => <>{rowdata6}</>
        },
        {
            width: '100px',
            title: '난이도 Level',
            dataIndex: 'rowdata8',
            align: 'center',
            render: (_, { rowdata8 }) => <> {rowdata8 + 'Lv'} </>
        },
        {
            width: '80px',
            title: '사용여부',
            dataIndex: 'rowdata9',
            align: 'center',
            render: (_, { rowdata9 }) => (
                <>
                    {rowdata9 === 'Y' ? (
                        <Tag color={'green'} key={rowdata9}>
                            사용
                        </Tag>
                    ) : (
                        <Tag color={'volcano'} key={rowdata9}>
                            미사용
                        </Tag>
                    )}
                </>
            )
        }
    ];

    // 출제 문제항 Arr Start
    const questionsArr = [];
    for (let i = 5; i <= 100; i += 5) {
        questionsArr.push({ value: i.toString(), label: i.toString() + ' 문항' });
    }
    // 출제 문제항 Arr End

    // 타이틀 컬럼  = 데이터 컬럼 Index세팅
    const handleSave = (row) => {
        const newData = [...selectModuleXrayPopListData];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row
        });
        setSelectModuleXrayPopListData(newData);
    };

    const columns = defaultColumns.map((col) => {
        return {
            ...col,
            onCell: (record) => {
                return {
                    record,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave
                };
            }
        };
    });

    //체크 박스 이벤트 (상단)
    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    //체크 박스 선택 (상단)
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange
    };

    const QuestionsOk = () => {
        props.QuestionCnt(selectedRowKeys);
    };

    // 랜덤박스 오픈
    const Questions_Randem = () => {
        setRandemBoxOpen(true);
    };

    // 랜덤 추출
    const Questions_handleRandem = () => {
        console.log('난이도 레벨 : ', randemLevel);
        console.log('출제 문항수 : ', randemlimit);
        handle_selectModuleRandom_Api(randemLevel, randemlimit);
        setRandemBoxOpen(false);
    };

    useEffect(() => {
        setLoading(true); // 로딩 호출
        handle_SelectModuleXrayPopList_Api(); // 그룹 api 호출
    }, []);

    return (
        <>
            <MainCard title="출제 문항">
                <Typography variant="body1">
                    <Table
                        size="middle"
                        bordered={true}
                        dataSource={selectModuleXrayPopListData}
                        loading={loading}
                        columns={columns}
                        rowSelection={rowSelection}
                    />
                    <Row style={{ width: '100%', margin: '10px 0px' }}>
                        <Col span={3}>
                            <Button
                                type="primary"
                                onClick={QuestionsOk}
                                style={{ width: '100px', borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                            >
                                선택 완료 [{selectedRowKeys.length}]
                            </Button>
                        </Col>
                        <Col span={3}>
                            <Button
                                type="primary"
                                danger
                                onClick={Questions_Randem}
                                style={{ marginLeft: '20px', width: '100px', borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                            >
                                랜덤 선택
                            </Button>
                        </Col>
                    </Row>
                </Typography>
            </MainCard>

            {/* 랜덤박스 Modal Start */}
            <Modal
                open={randemBoxOpen}
                width={400}
                style={{
                    top: 250,
                    left: 130,
                    zIndex: 999
                }}
                footer={[]}
            >
                <>
                    <MainCard form={form} style={{ marginTop: '30px' }} title="랜덤 선택">
                        <Form layout="vertical">
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Form.Item
                                        name="Randem_Level"
                                        label="난이도 레벨"
                                        rules={[
                                            {
                                                required: true
                                            }
                                        ]}
                                    >
                                        <Select
                                            defaultValue={{
                                                value: randemLevel,
                                                label: '# 난이도 레벨'
                                            }}
                                            style={{
                                                width: '100%'
                                            }}
                                            options={[
                                                {
                                                    value: '0',
                                                    label: 'All Level'
                                                },
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
                                            onChange={(value) => setRandemLevel(value)}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Divider style={{ margin: '10px 0' }} />
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Form.Item
                                        name="Randem_limit"
                                        label="출제 문항수"
                                        rules={[
                                            {
                                                required: true
                                            }
                                        ]}
                                    >
                                        <Select
                                            disabled={randemLevel === '0' ? true : false}
                                            defaultValue={{
                                                value: randemlimit,
                                                label: '# 출제 문항수'
                                            }}
                                            style={{
                                                width: '100%'
                                            }}
                                            options={questionsArr}
                                            onChange={(value) => setRandemlimit(value)}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Button
                                type="primary"
                                onClick={Questions_handleRandem}
                                style={{ width: '100%', borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                            >
                                랜덤 추출
                            </Button>
                        </Form>
                    </MainCard>
                </>
            </Modal>
            {/* 랜덤박스 Modal End */}
        </>
    );
};
