/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from 'react';
import { Tag, Col, Row, Button, Form, Tooltip, Space, DatePicker, Select, Divider } from 'antd';

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

    const rangePickerRef = useRef();
    const [procName, setProcName] = useState(props.ProcName);
    const [procSeq, setProcCd] = useState(props.ProcSeq);
    const [eduStartDate, setEduStartDate] = useState(props.EduStartDate);
    const [eduEndDate, setEduEndDate] = useState(props.EduEndDate);
    const [totStudyDate, setTotStudyDate] = useState(props.TotStudyDate);

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

    // 총교육일수에 맞춰 일자입력 폼 설정 Start
    const initialTotStudyDateList = Array.from({ length: totStudyDate }, () => ({
        eduStartDate: eduStartDate,
        eduEndDate: eduEndDate
    }));
    const [totStudyDateList, setTotStudyDateList] = useState(initialTotStudyDateList);
    // 총교육일수에 맞춰 일자입력 폼 설정 End

    // 총교육일수에 맞춰 모듈선택 폼 설정 Start
    const initialTotModuleList = Array.from({ length: totStudyDate }, () => ({}));
    const [moduleList, setModuleList] = useState(initialTotModuleList);
    // 총교육일수에 맞춰 모듈선택 폼 설정 End

    const handel_Add = () => {
        props.StudySet(totStudyDateList, moduleList);
    };

    useEffect(() => {
        handel_selectModuleList_Api(); // 조회
    }, []);

    return (
        <>
            <MainCard title="학습 일정별 학습과정 설정" style={{ marginTop: 30 }}>
                <Form layout="horizontal" form={form}>
                    <Row gutter={24} style={{ marginBottom: 14 }}>
                        <Col span={20} style={{ textAlign: 'center' }}>
                            <Tag color="#108ee9" style={{ float: 'left', padding: '11px 280px', borderRadius: '5px', fontSize: '14px' }}>
                                {procName} {procSeq}차
                            </Tag>
                        </Col>
                        <Col span={4}>
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

                    {Array.from({ length: totStudyDate }, (_, index) => (
                        <Row gutter={24} key={index}>
                            <Col span={7}>
                                <RangePicker
                                    ref={rangePickerRef}
                                    style={{ height: '38px' }}
                                    name={`Day ${index + 1}`}
                                    id={`Day ${index + 1}`}
                                    defaultValue={[dayjs(eduStartDate, 'YYYY-MM-DD'), dayjs(eduEndDate, 'YYYY-MM-DD')]}
                                    // value={{
                                    //     start: dayjs(eduStartDate[index], 'YYYY-MM-DD'),
                                    //     end: dayjs(eduEndDate[index], 'YYYY-MM-DD')
                                    // }}
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
                                    disabled={totStudyDate - 1 === index ? [false, true] : index === 0 ? [true, false] : [false, false]}
                                />
                            </Col>
                            <Col span={1}>
                                <Divider />
                            </Col>
                            <Col span={16}>
                                <Form.Item name={`EduDay00${index + 1}`}>
                                    <Space.Compact size="large">
                                        <Select
                                            placeholder="# 메뉴 선택"
                                            mode="multiple"
                                            style={{
                                                width: '560px',
                                                fontSize: '16px'
                                            }}
                                            onChange={(e) => {
                                                setModuleList((prevList) => {
                                                    const newList = [...prevList];
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
                                </Form.Item>
                            </Col>
                        </Row>
                    ))}
                </Form>
            </MainCard>
        </>
    );
};
