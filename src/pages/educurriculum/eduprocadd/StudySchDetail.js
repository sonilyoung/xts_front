/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from 'react';
import { Tag, Col, Row, Form, DatePicker, Tooltip, Divider } from 'antd';

// project import
import MainCard from 'components/MainCard';

import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';

import { ClockCircleOutlined, CheckOutlined, ReconciliationOutlined } from '@ant-design/icons';
// 모듈 목록 조회
import { useSelectBaselineEduDateListMutation } from '../../../hooks/api/CurriculumManagement/CurriculumManagement';

export const StudySchDetail = (props) => {
    const [form] = Form.useForm();
    dayjs.extend(weekday);
    dayjs.extend(localeData);
    const { RangePicker } = DatePicker;

    const rangePickerRef = useRef();
    const [procName, setProcName] = useState(props.ProcName);
    const [procSeq, setProcCd] = useState(props.ProcSeq);
    const [eduStartDate, setEduStartDate] = useState(props.EduStartDate);
    const [eduEndDate, setEduEndDate] = useState(props.EduEndDate);
    const [totStudyDate, setTotStudyDate] = useState(props.TotStudyDate);

    // ===============================
    // Api 호출 Start
    // 모듈 목록 조회 ======================================================
    const [SelectBaselineEduDateListApi] = useSelectBaselineEduDateListMutation(); // 조회 hooks api호출
    const [selectBaselineEduDateListData, setSelectBaselineEduDateListData] = useState([]); // 조회 Data 값
    const handel_SelectBaselineEduDateList_Api = async () => {
        const SelectBaselineEduDateListresponse = await SelectBaselineEduDateListApi({
            procCd: props.EduDayView
        });
        console.log(SelectBaselineEduDateListresponse?.data?.RET_DATA?.scheduleList);
        setSelectBaselineEduDateListData(SelectBaselineEduDateListresponse?.data?.RET_DATA?.scheduleList);
    };

    // Api 호출 End
    // ===============================

    useEffect(() => {
        handel_SelectBaselineEduDateList_Api(); // 조회
    }, [props.EduDayView]);

    return (
        <>
            <MainCard title="교육 일정 상세정보" style={{ marginTop: 30 }}>
                <Form layout="horizontal" form={form}>
                    <Row gutter={24} style={{ marginBottom: 14 }}>
                        <Col span={24} style={{ textAlign: 'center' }}>
                            <Tag color="#108ee9" style={{ width: '100%', padding: '11px 0', borderRadius: '5px', fontSize: '14px' }}>
                                {`[${selectBaselineEduDateListData[0]?.procYear}년] ${selectBaselineEduDateListData[0]?.procNm} - ${selectBaselineEduDateListData[0]?.procSeq}차`}
                            </Tag>
                        </Col>
                    </Row>
                    {selectBaselineEduDateListData?.map((d, i) => (
                        <>
                            <Row gutter={24} style={{ lineHeight: '56px' }} key={i}>
                                <Col span={6}>
                                    <Tag icon={<ClockCircleOutlined />} style={{ padding: '10px 10px', borderRadius: '5px' }}>
                                        {d.eduStartDate} ~ {d.eduEndDate}
                                    </Tag>
                                </Col>
                                <Col span={15}>
                                    {d.menuList[0]?.map((m, c) => (
                                        <Tag
                                            icon={<ReconciliationOutlined />}
                                            color="#2db7f5"
                                            style={{ padding: '10px 10px', borderRadius: '5px' }}
                                            key={c}
                                        >
                                            {m.menuNm} {m.moduleType === 's' ? '[ Slide ]' : m.moduleType === 'c' ? '[ Cut ]' : ''}
                                        </Tag>
                                    ))}
                                </Col>
                                <Col span={3}>
                                    {d.learnYn === true ? (
                                        <Tooltip title={`${d.eduStartDate} ~ ${d.eduEndDate} 교육진행 기간 중`}>
                                            <Tag icon={<ClockCircleOutlined />} style={{ padding: '10px 10px', borderRadius: '5px' }}>
                                                교육진행
                                            </Tag>
                                        </Tooltip>
                                    ) : (
                                        <Tooltip title="교육일정이 완료 되었습니다.">
                                            <Tag
                                                icon={<CheckOutlined />}
                                                // onClick={() => eduComplete('Day 1')}
                                                color="#2db7f5"
                                                style={{ padding: '10px 10px', borderRadius: '5px' }}
                                            >
                                                교육완료
                                            </Tag>
                                        </Tooltip>
                                    )}
                                </Col>
                            </Row>
                            <Divider style={{ margin: '10px 0' }} />
                        </>
                    ))}
                </Form>
            </MainCard>
        </>
    );
};
