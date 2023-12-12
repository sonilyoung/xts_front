/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from 'react';
import { Tag, Col, Row, Form, DatePicker, Tooltip, Divider } from 'antd';

// project import
import MainCard from 'components/MainCard';

import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';

import { ClockCircleOutlined, CheckOutlined, ReconciliationOutlined, PushpinOutlined, NotificationOutlined } from '@ant-design/icons';
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

    const [hoveredCol, setHoveredCol] = useState(null);
    // ===============================
    // Api 호출 Start
    // 모듈 목록 조회 ======================================================
    const [SelectBaselineEduDateListApi] = useSelectBaselineEduDateListMutation(); // 조회 hooks api호출
    const [selectBaselineEduDateListData, setSelectBaselineEduDateListData] = useState([]); // 조회 Data 값
    const handel_SelectBaselineEduDateList_Api = async () => {
        const SelectBaselineEduDateListresponse = await SelectBaselineEduDateListApi({
            procCd: props.EduDayView
        });
        // console.log(SelectBaselineEduDateListresponse?.data?.RET_DATA?.scheduleList);
        setSelectBaselineEduDateListData(SelectBaselineEduDateListresponse?.data?.RET_DATA?.scheduleList);
    };

    // Api 호출 End
    // ===============================

    const handleMouseOver = (colName) => {
        setHoveredCol(colName);
    };

    const handleMouseLeave = () => {
        setHoveredCol(null);
    };

    useEffect(() => {
        handel_SelectBaselineEduDateList_Api(); // 조회
    }, [props.EduDayView]);

    return (
        <>
            <MainCard title="교육 일정 상세정보">
                <Form layout="horizontal" form={form}>
                    <Row gutter={24} style={{ marginBottom: 14 }}>
                        <Col span={24} style={{ textAlign: 'center' }}>
                            <Tag color="#108ee9" style={{ width: '100%', padding: '18px 0', borderRadius: '5px' }}>
                                <div
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                        fontWeight: '600',
                                        fontSize: '19px'
                                    }}
                                >{`[${selectBaselineEduDateListData[0]?.procYear}년] ${selectBaselineEduDateListData[0]?.procNm} - ${selectBaselineEduDateListData[0]?.procSeq}차`}</div>
                            </Tag>
                        </Col>
                    </Row>

                    <Row gutter={[16, 8]} style={{ lineHeight: '56px', marginBottom: '5px' }}>
                        <Col span={4}>
                            <Tag
                                icon={<PushpinOutlined />}
                                style={{
                                    backgroundColor: hoveredCol === '0' ? '#ff4d4f' : '',
                                    color: hoveredCol === '0' ? '#ffffff' : '',
                                    padding: '15px 0',
                                    textAlign: 'center',
                                    width: '190px',
                                    borderRadius: '5px',
                                    borderBottom: '3px solid #d9d9d9'
                                }}
                            >
                                <text style={{ color: hoveredCol === '0' ? '#ffffff' : '', fontWeight: '600', fontSize: '14px' }}>
                                    일정
                                </text>
                            </Tag>
                        </Col>
                        <Col span={4}>
                            <Tag
                                icon={<PushpinOutlined />}
                                style={{
                                    backgroundColor: hoveredCol === '1' ? '#ff4d4f' : '',
                                    color: hoveredCol === '1' ? '#ffffff' : '',
                                    padding: '15px 0',
                                    textAlign: 'center',
                                    width: '190px',
                                    borderRadius: '5px',
                                    borderBottom: '3px solid #d9d9d9'
                                }}
                            >
                                <text style={{ color: hoveredCol === '1' ? '#ffffff' : '', fontWeight: '600', fontSize: '14px' }}>
                                    학습 모듈
                                </text>
                            </Tag>
                        </Col>
                        <Col span={4}>
                            <Tag
                                icon={<PushpinOutlined />}
                                style={{
                                    backgroundColor: hoveredCol === '2' ? '#ff4d4f' : '',
                                    color: hoveredCol === '2' ? '#ffffff' : '',
                                    padding: '15px 0',
                                    textAlign: 'center',
                                    width: '190px',
                                    borderRadius: '5px',
                                    borderBottom: '3px solid #d9d9d9'
                                }}
                            >
                                <text style={{ color: hoveredCol === '2' ? '#ffffff' : '', fontWeight: '600', fontSize: '14px' }}>
                                    평가 모듈
                                </text>
                            </Tag>
                        </Col>
                        <Col span={9}>
                            <Tag
                                icon={<PushpinOutlined />}
                                style={{
                                    backgroundColor: hoveredCol === '3' ? '#ff4d4f' : '',
                                    color: hoveredCol === '3' ? '#ffffff' : '',
                                    padding: '15px 0',
                                    textAlign: 'center',
                                    width: '430px',
                                    borderRadius: '5px',
                                    borderBottom: '3px solid #d9d9d9'
                                }}
                            >
                                <text style={{ color: hoveredCol === '3' ? '#ffffff' : '', fontWeight: '600', fontSize: '14px' }}>
                                    메뉴
                                </text>
                            </Tag>
                        </Col>
                        <Col span={3}>
                            <Tag
                                icon={<PushpinOutlined />}
                                style={{
                                    backgroundColor: hoveredCol === '4' ? '#ff4d4f' : '',
                                    color: hoveredCol === '4' ? '#ffffff' : '',
                                    padding: '15px 0',
                                    textAlign: 'center',
                                    width: '130px',
                                    borderRadius: '5px',
                                    borderBottom: '3px solid #d9d9d9'
                                }}
                            >
                                <text style={{ color: hoveredCol === '4' ? '#ffffff' : '', fontWeight: '600', fontSize: '14px' }}>
                                    교육상태
                                </text>
                            </Tag>
                        </Col>
                    </Row>
                    {selectBaselineEduDateListData?.map((d, i) => (
                        <>
                            <Row gutter={[16, 8]} style={{ lineHeight: '56px' }} key={i}>
                                {/* 일정 */}
                                <Col span={4} onMouseOver={() => handleMouseOver('0')} onMouseLeave={handleMouseLeave}>
                                    <Tag
                                        icon={<ClockCircleOutlined />}
                                        style={{ padding: '10px 0', textAlign: 'center', width: '190px', borderRadius: '5px' }}
                                    >
                                        {d.eduStartDate} ~ {d.eduEndDate}
                                    </Tag>
                                </Col>
                                {/* 학습 모듈 */}
                                <Col span={4} onMouseOver={() => handleMouseOver('1')} onMouseLeave={handleMouseLeave}>
                                    <Tag
                                        icon={<ClockCircleOutlined />}
                                        style={{ padding: '10px 0', textAlign: 'center', width: '190px', borderRadius: '5px' }}
                                    >
                                        {d.moduleNm}
                                    </Tag>
                                </Col>
                                {/* 평가 모듈 */}
                                <Col span={4} onMouseOver={() => handleMouseOver('2')} onMouseLeave={handleMouseLeave}>
                                    <Tag
                                        icon={<ClockCircleOutlined />}
                                        style={{ padding: '10px 0', textAlign: 'center', width: '190px', borderRadius: '5px' }}
                                    >
                                        {d.moduleNm}
                                    </Tag>
                                </Col>
                                {/* 메뉴 */}
                                <Col span={9} onMouseOver={() => handleMouseOver('3')} onMouseLeave={handleMouseLeave}>
                                    {d.menuList[0]?.map((m, c) => (
                                        <Tag
                                            icon={<ReconciliationOutlined />}
                                            color={d.learnYn === 'true' ? '#4ae100' : d.learnYn === 'false' ? '#aeb1ac' : ''}
                                            style={{ padding: '10px', textAlign: 'center', borderRadius: '5px' }}
                                            key={c}
                                        >
                                            {m.menuNm} {m.moduleType === 's' ? '[ Slide ]' : m.moduleType === 'c' ? '[ Cut ]' : ''}
                                        </Tag>
                                    ))}
                                </Col>
                                {/* 교육상태 */}
                                <Col span={3} onMouseOver={() => handleMouseOver('4')} onMouseLeave={handleMouseLeave}>
                                    {d.learnYn === 'true' ? (
                                        <Tooltip title={`${d.eduStartDate} ~ ${d.eduEndDate} 교육진행 기간 중`}>
                                            <Tag
                                                icon={<ClockCircleOutlined />}
                                                color={'#4ae100'}
                                                style={{ padding: '10px 0', textAlign: 'center', width: '130px', borderRadius: '5px' }}
                                            >
                                                교육진행
                                            </Tag>
                                        </Tooltip>
                                    ) : d.learnYn === 'false' ? (
                                        <Tooltip title="교육일정이 완료 되었습니다.">
                                            <Tag
                                                icon={<CheckOutlined />}
                                                color="#aeb1ac"
                                                style={{ padding: '10px 0', textAlign: 'center', width: '130px', borderRadius: '5px' }}
                                            >
                                                교육완료
                                            </Tag>
                                        </Tooltip>
                                    ) : d.learnYn === 'future' ? (
                                        <Tooltip title="교육이 예정 되어 있습니다.">
                                            <Tag
                                                icon={<NotificationOutlined />}
                                                // onClick={() => eduComplete('Day 1')}
                                                color=""
                                                style={{ padding: '10px 0', textAlign: 'center', width: '130px', borderRadius: '5px' }}
                                            >
                                                교육예정
                                            </Tag>
                                        </Tooltip>
                                    ) : (
                                        ''
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
