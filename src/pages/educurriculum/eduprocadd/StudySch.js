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
    const [moduleListSet, setModuleListSet] = useState();
    const [totStudyDateList, setTotStudyDateList] = useState({ eduStartDate: null, eduEndDate: null });
    // ===============================
    // Api 호출 Start

    // 모듈 목록 조회 ======================================================
    const [SelectModuleListApi] = useSelectModuleListMutation(); // 조회 hooks api호출
    const [SelectModuleListData, setSelectModuleListData] = useState([]); // 조회 Data 값
    const handel_selectModuleList_Api = async () => {
        const SelectModuleListresponse = await SelectModuleListApi({});
        setSelectModuleListData(SelectModuleListresponse?.data?.RET_DATA);
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
        const updatedModuleListSet = moduleListSet.map((item) => (item === undefined ? 0 : item));
        props.StudySet(totStudyDateList, menuListSet, updatedModuleListSet);
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

        setModuleListSet(props.SetModuleList !== null ? props.SetModuleList : Array(props.TotStudyDate).fill(0));

        setMenuListSet(props.SetMenuList);
    }, [props.SetScheduleList, props.TotStudyDate, props.SetModuleList, props.SetMenuList]);
    return (
        <>
            <MainCard title="학습 일정별 학습과정 설정" style={{ marginTop: 30 }}>
                <Form layout="horizontal" form={form}>
                    <Row gutter={24} style={{ marginBottom: 14 }}>
                        <Col span={20} offset={20}>
                            <Space>
                                <Tooltip title="저장">
                                    <Tag
                                        color="#ff4d4f"
                                        style={{
                                            float: 'right',
                                            cursor: 'pointer',
                                            padding: '11px 40px',
                                            borderRadius: '5px',
                                            fontSize: '14px'
                                        }}
                                        onClick={handel_Add}
                                    >
                                        학습과정 적용
                                    </Tag>
                                </Tooltip>
                            </Space>
                        </Col>
                    </Row>
                    <Row gutter={[24, 8]}>
                        <Col span={6}>
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
                                    color: '#ffffff'
                                }}
                            >
                                일자 설정
                            </Card>
                        </Col>
                        <Col span={6}>
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
                                    color: '#ffffff'
                                }}
                            >
                                모듈 설정
                            </Card>
                        </Col>
                        <Col span={12}>
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
                                    color: '#ffffff'
                                }}
                            >
                                메뉴 설정
                            </Card>
                        </Col>
                    </Row>
                    {Array.from(totStudyDateList, (_, index) => (
                        // {/* {Array.from({ length: props.TotStudyDate }, (_, index) => ( */}
                        <div key={index}>
                            <Divider style={{ margin: '10px 0' }} />
                            <Row gutter={[24, 8]} key={index}>
                                {/* 일자 설정 */}
                                <Col span={6}>
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

                                {/* 모듈 설정 */}
                                <Col span={6}>
                                    <Space.Compact size="large">
                                        <Select
                                            name="moduleList"
                                            showArrow
                                            placeholder="# 모듈 선택"
                                            style={{
                                                width: '272px',
                                                fontSize: '16px'
                                            }}
                                            value={
                                                moduleListSet === null || moduleListSet === undefined || moduleListSet === ''
                                                    ? ''
                                                    : moduleListSet[index]
                                            }
                                            onChange={(value) => {
                                                setModuleListSet((prevList) => {
                                                    const newModuleList = [...prevList];
                                                    newModuleList[index] = value;
                                                    return newModuleList;
                                                });
                                            }}
                                            options={[
                                                {
                                                    value: '0', // Empty value
                                                    label: '# 모듈 선택' // Placeholder label
                                                },
                                                ...SelectModuleListData.map((d) => ({
                                                    value: d.moduleId,
                                                    label: d.moduleNm
                                                }))
                                            ]}
                                        />
                                    </Space.Compact>
                                </Col>
                                {/* 메뉴 설정 */}
                                {console.log(SelectMenuListData)}

                                <Col span={12}>
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
                                                width: '567px',
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
