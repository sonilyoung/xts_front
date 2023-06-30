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
import { useSelectModuleMenuListMutation } from '../../../hooks/api/CurriculumManagement/CurriculumManagement';

export const StudySch = (props) => {
    const [form] = Form.useForm();
    dayjs.extend(weekday);
    dayjs.extend(localeData);
    const { RangePicker } = DatePicker;

    // const [eduStartDate, setEduStartDate] = useState(props.EduStartDate);
    // const [eduEndDate, setEduEndDate] = useState(props.EduEndDate);
    // const [totStudyDate, setTotStudyDate] = useState(props.TotStudyDate);
    const [scheduleSet, setScheduleListSet] = useState(props.SetScheduleList);
    const [menuListSet, setMenuListSet] = useState(props.SetMenuList);
    const [totStudyDateList, setTotStudyDateList] = useState({ eduStartDate: null, eduEndDate: null });
    // ===============================
    // Api 호출 Start
    // 모듈 목록 조회 ======================================================
    const [SelectModuleMenuListApi] = useSelectModuleMenuListMutation(); // 조회 hooks api호출
    const [SelectModuleMenuListData, setSelectModuleMenuListData] = useState([]); // 조회 Data 값
    const handel_selectModuleList_Api = async () => {
        const SelectModuleMenuListresponse = await SelectModuleMenuListApi({});
        setSelectModuleMenuListData(SelectModuleMenuListresponse?.data?.RET_DATA);
    };

    // Api 호출 End
    // ===============================

    const handel_Add = () => {
        props.StudySet(totStudyDateList, menuListSet);
    };

    useEffect(() => {
        handel_selectModuleList_Api(); // 조회
    }, []);

    useEffect(() => {
        const initialTotStudyDateList = Array.from({ length: props.TotStudyDate }, () => ({
            eduStartDate: props.EduStartDate,
            eduEndDate: props.EduEndDate
        }));
        setTotStudyDateList(initialTotStudyDateList);
    }, [props.TotStudyDate, props.EduStartDate, props.EduEndDate]);

    return (
        <>
            <MainCard title="학습 일정별 학습과정 설정" style={{ marginTop: 30 }}>
                <Form layout="horizontal" form={form}>
                    <Row gutter={24} style={{ marginBottom: 14 }}>
                        {/* <Col span={20} style={{ textAlign: 'center' }}>
                            <Tag color="#108ee9" style={{ float: 'left', padding: '11px 280px', borderRadius: '5px', fontSize: '14px' }}>
                                {procName} {procSeq}차
                            </Tag>
                        </Col> */}
                        <Col span={20} offset={20}>
                            <Space>
                                <Tooltip title="저장">
                                    <Tag
                                        color="#ff4d4f"
                                        style={{
                                            float: 'right',
                                            cursor: 'pointer',
                                            padding: '11px 46px',
                                            borderRadius: '5px',
                                            fontSize: '14px'
                                        }}
                                        onClick={handel_Add}
                                    >
                                        저장
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
                                                ? [false, true]
                                                : index === 0
                                                ? [true, false]
                                                : [false, false]
                                        }
                                    />
                                </Col>
                                <Col span={6}>
                                    <Select
                                        placeholder="# 모듈 선택"
                                        name="modules"
                                        showArrow
                                        style={{
                                            width: '100%'
                                        }}
                                        // options={Scoreoptions}
                                        // onChange={(e) => setItemContainer({ ...itemContainer, endingStdScore: e })}
                                        // value={
                                        //     itemContainer?.endingStdScore === undefined || itemContainer?.endingStdScore === null
                                        //         ? {
                                        //               value: 0,
                                        //               label: '# 수료 기준점수'
                                        //           }
                                        //         : itemContainer?.endingStdScore
                                        // }
                                    />
                                </Col>
                                <Col span={12}>
                                    <Space.Compact size="large">
                                        <Select
                                            placeholder="# 메뉴 선택"
                                            mode="multiple"
                                            showArrow
                                            value={
                                                menuListSet === null || menuListSet === undefined || menuListSet === ''
                                                    ? []
                                                    : menuListSet[index]
                                            }
                                            style={{
                                                width: '560px',
                                                fontSize: '16px'
                                            }}
                                            onChange={(e) => {
                                                setMenuListSet((prevList) => {
                                                    const newList = Array.from(prevList || []);
                                                    newList[index] = e;
                                                    return newList;
                                                });
                                            }}
                                            options={SelectModuleMenuListData.map((d) => ({
                                                value: d.menuCd,
                                                label:
                                                    d.menuName +
                                                    (d.moduleType === 'c' ? ' [Cut] ' : d.moduleType === 's' ? ' [Slide] ' : '')
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
