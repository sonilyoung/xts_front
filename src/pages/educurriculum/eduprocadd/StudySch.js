/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { Tag, Col, Row, Button, Form, Tooltip, Space, DatePicker, Select } from 'antd';

// project import
import MainCard from 'components/MainCard';

import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';

export const StudySch = (props) => {
    const [form] = Form.useForm();
    dayjs.extend(weekday);
    dayjs.extend(localeData);
    const { RangePicker } = DatePicker;

    const [loading, setLoading] = useState(false);
    const [procName, setProcName] = useState(props.ProcName);
    const [procSeq, setProcCd] = useState(props.ProcSeq);
    const [eduStartDate, setEduStartDate] = useState(props.EduStartDate);
    const [eduEndDate, setEduEndDate] = useState(props.EduEndDate);
    const [totStudyDate, setTotStudyDate] = useState(props.TotStudyDate);

    // 총교육일수에 맞춰 일자입력 폼 설정 Start
    const initialTotStudyDateList = Array.from({ length: totStudyDate }, () => ({
        totStudyDateListStart: '',
        totStudyDateListEnd: ''
    }));
    const [totStudyDateList, setTotStudyDateList] = useState(initialTotStudyDateList);
    // 총교육일수에 맞춰 일자입력 폼 설정 End

    // 총교육일수에 맞춰 모듈선택 폼 설정 Start
    const initialTotModuleList = Array.from({ length: totStudyDate }, () => ({
        module_ini: ''
    }));
    const [menuList, setMenuList] = useState(initialTotModuleList);
    // 총교육일수에 맞춰 모듈선택 폼 설정 End

    // 총교육일수에 맞춰 메뉴선택 폼 설정 Start
    const initialTotMenuList = Array.from({ length: totStudyDate }, () => ({
        menu_ini: ''
    }));
    const [moduleList, setModuleList] = useState(initialTotMenuList);
    // 총교육일수에 맞춰 메뉴선택 폼 설정 End

    const handel_Add = () => {
        props.StudySet(totStudyDateList, moduleList, menuList);
    };
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
                                    style={{ height: '88px' }}
                                    name={`Day ${index + 1}`}
                                    id={`Day ${index + 1}`}
                                    defaultValue={[dayjs(eduStartDate, 'YYYY-MM-DD'), dayjs(eduEndDate, 'YYYY-MM-DD')]}
                                    onChange={(dates) => {
                                        const [start, end] = dates;
                                        setTotStudyDateList((prevList) => {
                                            const newList = prevList.map((item, i) => {
                                                if (i === index) {
                                                    return {
                                                        ...item,
                                                        totStudyDateListStart: start.format('YYYY-MM-DD'),
                                                        totStudyDateListEnd: end.format('YYYY-MM-DD')
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
                            <Col span={1}>&nbsp;</Col>
                            <Col span={16}>
                                <Form.Item name={`EduDay00${index + 1}`}>
                                    <Select
                                        placeholder="# 모듈 선택"
                                        mode="multiple"
                                        style={{
                                            width: '100%'
                                        }}
                                        onChange={(e) => {
                                            setModuleList((prevList) => {
                                                const newList = [...prevList];
                                                newList[index] = e;
                                                return newList;
                                            });
                                        }}
                                        options={[
                                            {
                                                value: '물품연습 모듈',
                                                label: '물품연습 모듈'
                                            },
                                            {
                                                value: '학습 모듈',
                                                label: '학습 모듈'
                                            },
                                            {
                                                value: 'AI강화학습 모듈',
                                                label: 'AI강화학습 모듈'
                                            },
                                            {
                                                value: '평가 모듈',
                                                label: '평가 모듈'
                                            }
                                        ]}
                                    />
                                </Form.Item>

                                <Form.Item name={`EduDay10${index + 1}`}>
                                    <Select
                                        placeholder="# 메뉴 선택"
                                        mode="multiple"
                                        style={{
                                            width: '100%'
                                        }}
                                        onChange={(e) => {
                                            setMenuList((prevList) => {
                                                const newList = [...prevList];
                                                newList[index] = e;
                                                return newList;
                                            });
                                        }}
                                        options={[
                                            {
                                                value: '물품연습',
                                                label: '물품연습'
                                            },
                                            {
                                                value: '학습',
                                                label: '학습'
                                            },
                                            {
                                                value: 'AI강화학습',
                                                label: 'AI강화학습'
                                            },
                                            {
                                                value: '평가',
                                                label: '평가'
                                            },
                                            {
                                                value: '이론1',
                                                label: '이론1'
                                            },
                                            {
                                                value: '이론2',
                                                label: '이론2'
                                            }
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    ))}
                </Form>
            </MainCard>
        </>
    );
};
