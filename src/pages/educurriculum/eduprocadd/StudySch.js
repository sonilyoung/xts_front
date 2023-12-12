/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { Tag, Col, Row, Form, Tooltip, Space, DatePicker, Select, Divider, Card, Typography } from 'antd';

const { Title, Paragraph, Text, Link } = Typography;

// project import
import MainCard from 'components/MainCard';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';

// 모듈 목록 조회
import { useSelectModuleListMutation, useSelectMenuListMutation } from '../../../hooks/api/CurriculumManagement/CurriculumManagement';

export const StudySch = (props) => {
    const [form] = Form.useForm();
    dayjs.extend(weekday);
    dayjs.extend(localeData);
    const { RangePicker } = DatePicker;

    const [menuListSet, setMenuListSet] = useState();
    const [moduleListSet1, setModuleListSet1] = useState();
    const [moduleListSet2, setModuleListSet2] = useState();
    const [totStudyDateList, setTotStudyDateList] = useState({ eduStartDate: null, eduEndDate: null });

    const [hoveredCol, setHoveredCol] = useState(null);

    // ===============================
    // Api 호출 Start

    // 모듈 목록 조회 ======================================================
    const [SelectModuleListApi] = useSelectModuleListMutation(); // 조회 hooks api호출
    const [SelectModuleListData1, setSelectModuleListData1] = useState([]); // 조회 Data 값
    const [SelectModuleListData2, setSelectModuleListData2] = useState([]); // 조회 Data 값

    const handel_selectModuleList_Api = async () => {
        const SelectModuleListresponse = await SelectModuleListApi({});
        setSelectModuleListData1(SelectModuleListresponse?.data?.RET_DATA);
    };

    // 메뉴 목록 조회 ======================================================
    const [SelectMenuListApi] = useSelectMenuListMutation(); // 조회 hooks api호출
    const [SelectMenuListData, setSelectMenuListData] = useState([]); // 조회 Data 값
    const handel_selectMenuList_Api = async () => {
        const SelectMenuListresponse = await SelectMenuListApi({});
        setSelectMenuListData(SelectMenuListresponse?.data?.RET_DATA);
    };

    // Api 호출 End
    // ===============================

    const handel_Add = () => {
        const updatedModuleListSet1 = moduleListSet1.map((item) => (item === undefined ? 0 : item));
        props.StudySet(totStudyDateList, menuListSet, updatedModuleListSet1);
    };

    const handleMouseOver = (colName) => {
        setHoveredCol(colName);
    };

    const handleMouseLeave = () => {
        setHoveredCol(null);
    };

    useEffect(() => {
        handel_selectModuleList_Api(); // 모듈 조회
        handel_selectMenuList_Api(); // 메뉴 조회
    }, []);

    useEffect(() => {
        if (props.SetScheduleList === null) {
            const initialTotStudyDateList = Array.from({ length: props.TotStudyDate }, () => ({
                eduStartDate: props.EduStartDate,
                eduEndDate: props.EduEndDate
            }));
            setTotStudyDateList(initialTotStudyDateList);
        } else {
            const initialTotStudyDateList = Array.from({ length: props.TotStudyDate }, (_, index) => ({
                eduStartDate: props.SetScheduleList[index] === undefined ? props.EduStartDate : props.SetScheduleList[index].eduStartDate,
                eduEndDate: props.SetScheduleList[index] === undefined ? props.EduEndDate : props.SetScheduleList[index].eduEndDate
            }));
            setTotStudyDateList(initialTotStudyDateList);
        }

        setModuleListSet1(props.SetModuleList !== null ? props.SetModuleList : Array(props.TotStudyDate).fill(0));

        setMenuListSet(props.SetMenuList);
    }, [props.SetScheduleList, props.TotStudyDate, props.SetModuleList, props.SetMenuList]);
    return (
        <>
            <MainCard title="학습 일정별 학습과정 설정" style={{ marginTop: 30 }}>
                <Form layout="horizontal" form={form}>
                    <Row justify="end" style={{ marginBottom: 14 }}>
                        <Col span={12} style={{ textAlign: 'right' }}>
                            <Space>
                                <Tooltip title="저장">
                                    <Tag
                                        color="#ff4d4f"
                                        style={{
                                            float: 'right',
                                            cursor: 'pointer',
                                            padding: '15px 45px',
                                            borderRadius: '5px',
                                            fontSize: '14px',
                                            fontWeight: '800'
                                        }}
                                        onClick={handel_Add}
                                    >
                                        학습 과정 적용
                                    </Tag>
                                </Tooltip>
                            </Space>
                        </Col>
                    </Row>
                    <Row gutter={[16, 8]}>
                        <Col span={5}>
                            <Card
                                style={{
                                    width: '100%',
                                    height: '50px',
                                    marginBottom: '5px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                    background: '#a7a9ad',
                                    color: '#ffffff',
                                    backgroundColor: hoveredCol === '0' ? '#ff4d4f' : '#a7a9ad'
                                }}
                            >
                                <div style={{ fontSize: '14px' }}>일자 설정</div>
                            </Card>
                        </Col>
                        <Col span={4}>
                            <Card
                                style={{
                                    width: '100%',
                                    height: '50px',
                                    marginBottom: '5px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                    background: '#a7a9ad',
                                    color: '#ffffff',
                                    backgroundColor: hoveredCol === '1' ? '#ff4d4f' : '#a7a9ad'
                                }}
                            >
                                <div style={{ fontSize: '14px' }}>학습 모듈 설정</div>
                            </Card>
                        </Col>
                        <Col span={4}>
                            <Card
                                style={{
                                    width: '100%',
                                    height: '50px',
                                    marginBottom: '5px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                    background: '#a7a9ad',
                                    color: '#ffffff',
                                    backgroundColor: hoveredCol === '2' ? '#ff4d4f' : '#a7a9ad'
                                }}
                            >
                                <div style={{ fontSize: '14px' }}>평가 모듈 설정</div>
                            </Card>
                        </Col>
                        <Col span={11}>
                            <Card
                                style={{
                                    width: '100%',
                                    height: '50px',
                                    marginBottom: '5px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                    background: '#a7a9ad',
                                    color: '#ffffff',

                                    backgroundColor: hoveredCol === '3' ? '#ff4d4f' : '#a7a9ad'
                                }}
                            >
                                <div style={{ fontSize: '14px' }}>메뉴 설정</div>
                            </Card>
                        </Col>
                    </Row>
                    {Array.from(totStudyDateList, (_, index) => (
                        // {/* {Array.from({ length: props.TotStudyDate }, (_, index) => ( */}
                        <div key={index}>
                            <Divider style={{ margin: '15px 0', borderColor: '#d7d8d9', borderWidth: '2px' }} />
                            <Row gutter={[16, 8]} key={index}>
                                {/* 일자 설정 */}
                                <Col span={5} onMouseOver={() => handleMouseOver('0')} onMouseLeave={handleMouseLeave}>
                                    <RangePicker
                                        style={{ height: '38px' }}
                                        name={`Day ${index + 1}`}
                                        id={`Day ${index + 1}`}
                                        value={[
                                            dayjs(totStudyDateList[index].eduStartDate, 'YYYY-MM-DD'),
                                            dayjs(totStudyDateList[index].eduEndDate, 'YYYY-MM-DD')
                                        ]}
                                        onChange={(dates) => {
                                            const [start, end] = dates;
                                            setTotStudyDateList((prevList) => {
                                                const newList = prevList.map((item, i) => {
                                                    if (i === index) {
                                                        return {
                                                            ...item,
                                                            eduStartDate: start.format('YYYY-MM-DD'),
                                                            eduEndDate: end.format('YYYY-MM-DD')
                                                        };
                                                    }
                                                    return item;
                                                });
                                                return newList;
                                            });
                                        }}
                                        disabled={
                                            totStudyDateList.length - 1 === index
                                                ? [false, false]
                                                : index === 0
                                                ? [false, false]
                                                : [false, false]
                                        }
                                    />
                                </Col>

                                {/* 학습 모듈 설정 */}
                                <Col span={4} onMouseOver={() => handleMouseOver('1')} onMouseLeave={handleMouseLeave}>
                                    <Space.Compact size="large" wrap>
                                        <Select
                                            name="moduleList1"
                                            showArrow
                                            placeholder="# 학습 모듈 선택"
                                            style={{
                                                width: '195px',
                                                fontSize: '16px'
                                            }}
                                            value={
                                                moduleListSet1 === null || moduleListSet1 === undefined || moduleListSet1 === ''
                                                    ? ''
                                                    : moduleListSet1[index]
                                            }
                                            onChange={(value) => {
                                                setModuleListSet1((prevList) => {
                                                    const newModuleList = [...prevList];
                                                    newModuleList[index] = value;
                                                    return newModuleList;
                                                });
                                            }}
                                            options={[
                                                {
                                                    value: '0', // Empty value
                                                    label: '# 학습 모듈 선택' // Placeholder label
                                                },
                                                ...SelectModuleListData1.map((d) => ({
                                                    value: d.moduleId,
                                                    label: d.moduleNm
                                                }))
                                            ]}
                                        />
                                    </Space.Compact>
                                </Col>

                                {/* 평가 모듈 설정 */}
                                <Col span={4} onMouseOver={() => handleMouseOver('2')} onMouseLeave={handleMouseLeave}>
                                    <Space.Compact size="large" wrap>
                                        <Select
                                            name="moduleList2"
                                            showArrow
                                            placeholder="# 평가 모듈 선택"
                                            style={{
                                                width: '195px',
                                                fontSize: '16px'
                                            }}
                                            value={
                                                moduleListSet2 === null || moduleListSet2 === undefined || moduleListSet2 === ''
                                                    ? ''
                                                    : moduleListSet2[index]
                                            }
                                            onChange={(value) => {
                                                setModuleListSet2((prevList) => {
                                                    const newModuleList = [...prevList];
                                                    newModuleList[index] = value;
                                                    return newModuleList;
                                                });
                                            }}
                                            options={[
                                                {
                                                    value: '0', // Empty value
                                                    label: '# 평가 모듈 선택' // Placeholder label
                                                },
                                                ...SelectModuleListData2.map((d) => ({
                                                    value: d.moduleId,
                                                    label: d.moduleNm
                                                }))
                                            ]}
                                        />
                                    </Space.Compact>
                                </Col>
                                {/* 메뉴 설정 */}
                                {console.log(SelectMenuListData)}

                                <Col span={11} onMouseOver={() => handleMouseOver('3')} onMouseLeave={handleMouseLeave}>
                                    <Space.Compact size="large">
                                        <Select
                                            name="menuList"
                                            placeholder="# 메뉴 선택"
                                            mode="multiple"
                                            showArrow
                                            value={
                                                menuListSet === null || menuListSet === undefined || menuListSet === ''
                                                    ? []
                                                    : menuListSet[index]
                                            }
                                            style={{
                                                width: '570px',
                                                fontSize: '16px'
                                            }}
                                            onChange={(e) => {
                                                setMenuListSet((prevList) => {
                                                    const newList = Array.from(prevList || []);
                                                    newList[index] = e;
                                                    return newList;
                                                });
                                            }}
                                            options={SelectMenuListData.map((d) => ({
                                                value: d.menuCd,
                                                label: d.menuName
                                            }))}
                                        />
                                    </Space.Compact>
                                </Col>
                            </Row>
                        </div>
                    ))}
                </Form>
            </MainCard>
        </>
    );
};
