/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from 'react';
import { Row, Col, Space, Button, Divider, Form, Input, DatePicker, Card, Radio, Select, Modal } from 'antd';
import locale from 'antd/es/date-picker/locale/ko_KR';
import MainCard from 'components/MainCard';
// import moment from 'moment';

// material-ui
import { Grid, Stack, Typography } from '@mui/material';
import { useInsertStuUserMutation, useSelectStuUserCheckMutation } from '../../hooks/api/StudentsManagement/StudentsManagement';

import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';

const { RangePicker } = DatePicker;
// ================================|| REGISTER ||================================ //

const Register = () => {
    dayjs.extend(weekday);
    dayjs.extend(localeData);

    const [form] = Form.useForm();
    const [idChk, setIdChk] = useState(false); // 선택한 교육생 아이디 값
    const [itemContainer, setItemContainer] = useState({}); // 항목 컨테이너
    const [loading, setLoading] = useState(false);

    // ===============================
    // Api 호출 Start
    // 등록 ======================================================
    const [InsertStuUserApi] = useInsertStuUserMutation(); // 교육생 정보 hooks api호출
    const handle_InsertStuUser_Api = async () => {
        const InsertStuUserresponse = await InsertStuUserApi({
            eduName: itemContainer.eduName, //                      교육과정명
            writeDate: itemContainer.writeDate === undefined ? dayjs(new Date()).format('YYYY-MM-DD') : itemContainer.writeDate, //                  입교신청일
            userId: itemContainer.userId, //                        아이디
            userPw: itemContainer.userPw, //                        패스워드
            userNm: itemContainer.userNm, //                        성명국문
            userNmCh: itemContainer.userNmCh, //                    성명한문
            userNmEn: itemContainer.userNmEn, //                    성명영어
            sex: itemContainer.sex, //                              성별 1 남 2여
            registNumber: itemContainer.registNumber, //            주민번호
            birthDay: itemContainer.birthDay, //                    생일
            age: itemContainer.age, //                              나이
            telNo: itemContainer.telNo, //                          전화번호
            hpNo: itemContainer.hpNo, //                            핸드폰번호
            email: itemContainer.email, //                          이메일
            address: itemContainer.address, //                      주소
            company: itemContainer.company, //                      소속회사명
            employStatusYn: itemContainer.employStatusYn, //        재직여부
            dept: itemContainer.dept, //                            소속
            position: itemContainer.position, //                    직책
            work: itemContainer.work, //                            담당업무
            lastEdu: itemContainer.lastEdu, //                      최종학력
            lastEduName: itemContainer.lastEduName, //              최종학력명
            lastEduDept: itemContainer.lastEduDept, //              최종학력학과
            lastEduYear: itemContainer.lastEduYear, //              최종학력년제
            lastEduEnd: itemContainer.lastEduEnd, //                졸업 Y /재학 N
            militaryStartDate: itemContainer.militaryStartDate, //  군경력시작일
            militaryEndDate: itemContainer.militaryEndDate, //      군경력 종료일
            militaryCareer: itemContainer.militaryCareer, //        군별
            militaryClass: itemContainer.militaryClass, //          병과
            militaryEnd: itemContainer.militaryEnd, //              최종계급
            careerYn: itemContainer.careerYn, //                    보안경력유무
            career1: itemContainer.career1, //                      보안검색경력담당업무1
            careerStartDate1: itemContainer.careerStartDate1, //    보안검색경력시작일1
            careerEndDate1: itemContainer.careerEndDate1, //        보안검색경력종료일1
            careerCompany1: itemContainer.careerCompany1, //        보안검색경력소속1
            careerPosition1: itemContainer.careerPosition1, //      보안검색경력직책1
            career2: itemContainer.career2,
            careerStartDate2: itemContainer.careerStartDate2,
            careerEndDate2: itemContainer.careerEndDate2,
            careerCompany2: itemContainer.careerCompany2,
            careerPosition2: itemContainer.careerPosition2
        });
        setLoading(false);
        console.log('itemContainer', itemContainer);
        console.log('InsertStuUserresponse : ', InsertStuUserresponse);
        InsertStuUserresponse?.data?.RET_CODE === '0100'
            ? Modal.success({
                  content: '등록 완료',
                  onOk() {
                      form.resetFields();
                      window.close();
                  }
              })
            : Modal.error({
                  content: '등록 오류',
                  onOk() {}
              });
    };

    // 아이디 중복 체크 ===========================================
    const [SelectStuUserCheckApi] = useSelectStuUserCheckMutation(); // 상세 hooks api호출
    const handel_SelectStuUserCheck_Api = async (userId) => {
        const SelectStuUserCheckresponse = await SelectStuUserCheckApi({
            userId: userId
        });

        // console.log(SelectStuUserCheckresponse.data);
        SelectStuUserCheckresponse.data.RET_CODE === '9996'
            ? (setItemContainer({ ...itemContainer, userId: '' }),
              setIdChk(false),
              Modal.success({
                  content: SelectStuUserCheckresponse.data.RET_DESC,
                  onOk() {}
              }))
            : setIdChk(true);
    };
    // Api 호출 End
    // ===============================

    // 등록 취소
    const onAddClose = () => {
        setItemContainer([]);
        form.resetFields();
        window.close();
    };

    // 등록 처리
    const onAddSubmit = () => {
        setLoading(true); // 로딩 호출
        handle_InsertStuUser_Api();
    };

    // 아이디 중복 체크 버튼 클릭 이벤트
    const handel_IdChk = (user_id) => {
        if (user_id === undefined) {
            Modal.success({
                content: '아이디를 입력해주세요!',
                onOk() {}
            });
        } else {
            if (user_id.length < '4') {
                Modal.success({
                    content: '아이디는 최소 "4"자 이상 입력해주시기 바랍니다.',
                    onOk() {}
                });
            } else {
                handel_SelectStuUserCheck_Api(user_id);
            }
        }
    };

    const formatPhoneNumber = (input) => {
        const cleanedInput = input.replace(/\D/g, '');
        const formattedNumber = cleanedInput.replace(/^(\d{3})(\d{3,4})(\d{4})$/, '$1$2$3');
        return formattedNumber;
    };

    const handlePhoneNumberChange = (fieldName, inputValue) => {
        const formattedNumber = formatPhoneNumber(inputValue);
        setItemContainer((prevValues) => ({
            ...prevValues,
            [fieldName]: formattedNumber
        }));
    };

    const formatResidentRegistrationNumber = (input) => {
        const cleanedInput = input.replace(/\D/g, '');
        const formattedNumber = cleanedInput.replace(/^(\d{6})(\d{1,7})$/, '$1-$2');
        return formattedNumber;
    };

    const handleResidentNumberChange = (inputValue) => {
        const formattedNumber = formatResidentRegistrationNumber(inputValue);
        setItemContainer((prevValues) => ({
            ...prevValues,
            registNumber: formattedNumber
        }));
    };

    const calculateAge = (dob) => {
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };
    const handleDOBChange = (date, dateString) => {
        setItemContainer((prevValues) => ({
            ...prevValues,
            birthDay: dateString,
            age: calculateAge(dateString).toString()
        }));
    };

    return (
        <Grid container spacing={3}>
            <MainCard>
                <h1 style={{ margin: '30px 0px 10px 0px', textAlign: 'center', color: '#155eb6' }}>X-ray Security Training</h1>
                <h1 style={{ margin: '10px 0px 30px 0px', textAlign: 'center', color: '#0e276c' }}>XBT 회원가입</h1>
                <Typography variant="body1">
                    <Form layout="horizontal" form={form}>
                        <Card loading={loading}>
                            <Row gutter={24}>
                                <Col span={12}>
                                    <Form.Item
                                        label={
                                            <span style={{ fontSize: '15px' }}>
                                                <span style={{ color: 'red', paddingRight: '5px' }}>*</span>교육과정
                                            </span>
                                        }
                                        rules={[
                                            {
                                                required: true,
                                                message: '교육과정'
                                            }
                                        ]}
                                        initialValue={itemContainer?.eduName}
                                    >
                                        <Select
                                            name="eduName"
                                            defaultValue="# 교육과정"
                                            style={{
                                                width: '100%'
                                            }}
                                            onChange={(e) => setItemContainer({ ...itemContainer, eduName: e })}
                                            value={itemContainer?.eduName}
                                            options={[
                                                {
                                                    label: '보안검색요원 초기 교육 [5일/40시간]',
                                                    value: '1'
                                                },
                                                {
                                                    label: '보안검색요원 정기 교육 [1일/8시간]',
                                                    value: '2'
                                                },
                                                {
                                                    label: '보안검색요원 인증평가 교육 [1일/4시간]',
                                                    value: '3'
                                                },
                                                {
                                                    label: '항공경비요원 초기교육 [4일/30시간]',
                                                    value: '4'
                                                },
                                                {
                                                    label: '항공경비요원 정기 교육 [1일/8시간]',
                                                    value: '5'
                                                },
                                                {
                                                    label: '항공경비요원 인증평가 교육 [1일/4시간]',
                                                    value: '6'
                                                }
                                            ]}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label={
                                            <span style={{ fontSize: '15px' }}>
                                                <span style={{ color: 'red', paddingRight: '5px' }}>*</span>입교신청일
                                            </span>
                                        }
                                        rules={[
                                            {
                                                required: true,
                                                message: '입교신청일'
                                            }
                                        ]}
                                        initialValue={itemContainer?.writeDate}
                                    >
                                        <DatePicker
                                            name="writeDate"
                                            onChange={(date) => {
                                                setItemContainer({ ...itemContainer, writeDate: date });
                                            }}
                                            placeholder="입교신청일"
                                            style={{
                                                width: '100%'
                                            }}
                                            value={dayjs(itemContainer?.writeDate)}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            {/* <Divider style={{ margin: '10px 0' }} />
                            <Row gutter={24}>
                                <Col span={12}>
                                    <Form.Item
                                        label="아이디"
                                        rules={[
                                            {
                                                required: true,
                                                message: '아이디'
                                            }
                                        ]}
                                        initialValue={itemContainer?.userId}
                                    >
                                        <Space direction="horizontal">
                                            <div className="form-group">
                                                <Input
                                                    name="userId"
                                                    placeholder="아이디"
                                                    onChange={(e) => setItemContainer({ ...itemContainer, userId: e.target.value })}
                                                    value={itemContainer?.userId}
                                                    disabled={idChk}
                                                />
                                            </div>
                                            {idChk === false ? (
                                                <Button
                                                    style={{
                                                        width: 80
                                                    }}
                                                    onClick={() => handel_IdChk(itemContainer?.userId)}
                                                    disabled={idChk}
                                                >
                                                    중복체크
                                                </Button>
                                            ) : (
                                                <Button
                                                    style={{
                                                        width: 80
                                                    }}
                                                    disabled={idChk}
                                                >
                                                    사용가능
                                                </Button>
                                            )}
                                        </Space>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="비밀번호"
                                        rules={[
                                            {
                                                required: true,
                                                message: '비밀번호'
                                            }
                                        ]}
                                        initialValue={itemContainer?.userPw}
                                    >
                                        <Input
                                            name="userPw"
                                            type="password"
                                            placeholder="비밀번호"
                                            onChange={(e) => setItemContainer({ ...itemContainer, userPw: e.target.value })}
                                            value={itemContainer?.userPw}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row> */}
                            <Divider style={{ margin: '10px 0' }} />
                            <Row gutter={24}>
                                <Col span={12}>
                                    <Form.Item
                                        label={
                                            <span style={{ fontSize: '15px' }}>
                                                <span style={{ color: 'red', paddingRight: '5px' }}>*</span>성명(국문)
                                            </span>
                                        }
                                        rules={[
                                            {
                                                required: true,
                                                message: '성명(국문)'
                                            }
                                        ]}
                                        initialValue={itemContainer?.userNm}
                                    >
                                        <Input
                                            name="userNm"
                                            style={{
                                                width: '100%'
                                            }}
                                            placeholder="성명(국문)"
                                            onChange={(e) => setItemContainer({ ...itemContainer, userNm: e.target.value })}
                                            value={itemContainer?.userNm}
                                            autoComplete="off"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    {/* <Form.Item
                                        label="성명(한문)"
                                        rules={[
                                            {
                                                required: true,
                                                message: '성명(한문)'
                                            }
                                        ]}
                                        initialValue={itemContainer?.userNmCh}
                                    >
                                        <Input
                                            name="userNmCh"
                                            style={{
                                                width: '100%'
                                            }}
                                            placeholder="성명(한문)"
                                            onChange={(e) => setItemContainer({ ...itemContainer, userNmCh: e.target.value })}
                                            value={itemContainer?.userNmCh}
                                        />
                                    </Form.Item> */}
                                    <Form.Item
                                        label={
                                            <span style={{ fontSize: '15px' }}>
                                                <span style={{ color: 'red', paddingRight: '5px' }}>*</span>성명(영문)
                                            </span>
                                        }
                                        rules={[
                                            {
                                                required: true,
                                                message: '성명(영문)'
                                            }
                                        ]}
                                        initialValue={itemContainer?.userNmEn}
                                    >
                                        <Input
                                            name="userNmEn"
                                            style={{
                                                width: '100%'
                                            }}
                                            placeholder="성명(영문)"
                                            onChange={(e) => setItemContainer({ ...itemContainer, userNmEn: e.target.value })}
                                            value={itemContainer?.userNmEn}
                                            autoComplete="off"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Divider style={{ margin: '10px 0' }} />
                            {/* <Row gutter={24}>
                                <Col span={12}>
                                    <Form.Item
                                        label="성명(영문)"
                                        rules={[
                                            {
                                                required: true,
                                                message: '성명(영문)'
                                            }
                                        ]}
                                        initialValue={itemContainer?.userNmEn}
                                    >
                                        <Input
                                            name="userNmEn"
                                            style={{
                                                width: '100%'
                                            }}
                                            placeholder="성명(영문)"
                                            onChange={(e) => setItemContainer({ ...itemContainer, userNmEn: e.target.value })}
                                            value={itemContainer?.userNmEn}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="성별"
                                        rules={[
                                            {
                                                required: true,
                                                message: '성별'
                                            }
                                        ]}
                                        initialValue={itemContainer?.sex}
                                    >
                                        <Radio.Group
                                            name="sex"
                                            onChange={(e) => setItemContainer({ ...itemContainer, sex: e.target.value })}
                                            buttonStyle="solid"
                                            value={itemContainer?.sex}
                                        >
                                            <Radio.Button value="1">
                                                <span style={{ padding: '0 15px' }}>남</span>
                                            </Radio.Button>
                                            <span style={{ padding: '0 10px' }}></span>
                                            <Radio.Button value="2">
                                                <span style={{ padding: '0 15px' }}>여</span>
                                            </Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                            </Row> 
                            <Divider style={{ margin: '10px 0' }} />
                            */}
                            <Row gutter={24}>
                                <Col span={12}>
                                    <Form.Item
                                        label={
                                            <span style={{ fontSize: '15px' }}>
                                                <span style={{ color: 'red', paddingRight: '5px' }}>*</span>생년월일
                                            </span>
                                        }
                                        rules={[
                                            {
                                                required: true,
                                                message: '생년월일'
                                            }
                                        ]}
                                    >
                                        <DatePicker
                                            name="birthDay"
                                            onChange={handleDOBChange}
                                            value={itemContainer.birthDay === undefined ? '' : dayjs(itemContainer?.birthDay)}
                                            placeholder="생년월일"
                                            style={{
                                                width: '48%'
                                            }}
                                        />

                                        <span style={{ marginLeft: '10px' }}>
                                            <Input
                                                name="age"
                                                addonBefore="(만"
                                                addonAfter="세)"
                                                onChange={(e) => setItemContainer({ ...itemContainer, age: e.target.value })}
                                                maxLength={2}
                                                style={{
                                                    width: '43%',
                                                    margin: '0 3px'
                                                }}
                                                value={itemContainer?.age}
                                                autoComplete="off"
                                            />
                                        </span>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    {/* <Form.Item
                                        label="주민등록번호"
                                        rules={[
                                            {
                                                required: true,
                                                message: '주민등록번호'
                                            }
                                        ]}
                                        initialValue={itemContainer?.registNumber}
                                    >
                                        <Input
                                            name="registNumber"
                                            style={{
                                                width: '100%',
                                                margin: '0 3px'
                                            }}
                                            placeholder="주민등록번호 (숫자만 입력)"
                                            onChange={(e) => handleResidentNumberChange(e.target.value)}
                                            value={itemContainer?.registNumber}
                                        />
                                    </Form.Item> */}
                                    <Form.Item
                                        label={
                                            <span style={{ fontSize: '15px' }}>
                                                <span style={{ color: 'red', paddingRight: '5px' }}>*</span>성별
                                            </span>
                                        }
                                        rules={[
                                            {
                                                required: true,
                                                message: '성별'
                                            }
                                        ]}
                                        initialValue={itemContainer?.sex}
                                    >
                                        <Radio.Group
                                            name="sex"
                                            onChange={(e) => setItemContainer({ ...itemContainer, sex: e.target.value })}
                                            buttonStyle="solid"
                                            value={itemContainer?.sex}
                                        >
                                            <Radio.Button value="1">
                                                <span style={{ padding: '0 15px' }}>남</span>
                                            </Radio.Button>
                                            <span style={{ padding: '0 10px' }}></span>
                                            <Radio.Button value="2">
                                                <span style={{ padding: '0 15px' }}>여</span>
                                            </Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Divider style={{ margin: '10px 0' }} />
                            <Row gutter={24}>
                                <Col span={12}>
                                    {/* <Form.Item
                                        label="전화번호"
                                        rules={[
                                            {
                                                required: true,
                                                message: '전화번호'
                                            }
                                        ]}
                                        initialValue={itemContainer?.telNo}
                                    >
                                        <Input
                                            name="telNo"
                                            style={{
                                                width: '100%'
                                            }}
                                            placeholder="전화번호 (숫자만 입력)"
                                            // onChange={(e) => setItemContainer({ ...itemContainer, telNo: e.target.value })}
                                            onChange={(e) => handlePhoneNumberChange('telNo', e.target.value)}
                                            value={itemContainer?.telNo}
                                        />
                                    </Form.Item> */}
                                    <Form.Item
                                        label={<span style={{ fontSize: '15px' }}>E-mail</span>}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'E-mail'
                                            }
                                        ]}
                                        initialValue={itemContainer?.email}
                                    >
                                        <Input
                                            name="email"
                                            style={{
                                                width: '100%'
                                            }}
                                            placeholder="E-mail"
                                            onChange={(e) => setItemContainer({ ...itemContainer, email: e.target.value })}
                                            value={itemContainer?.email}
                                            autoComplete="off"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label={
                                            <span style={{ fontSize: '15px' }}>
                                                <span style={{ color: 'red', paddingRight: '5px' }}>*</span>휴대폰번호
                                            </span>
                                        }
                                        rules={[
                                            {
                                                required: true,
                                                message: '휴대폰번호'
                                            }
                                        ]}
                                        initialValue={itemContainer?.hpNo}
                                    >
                                        <Input
                                            name="hpNo"
                                            style={{
                                                width: '100%'
                                            }}
                                            placeholder="휴대폰번호 (숫자만 입력)"
                                            // onChange={(e) => setItemContainer({ ...itemContainer, hpNo: e.target.value })}
                                            onChange={(e) => handlePhoneNumberChange('hpNo', e.target.value)}
                                            value={itemContainer?.hpNo}
                                            autoComplete="off"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            {/* <Divider style={{ margin: '10px 0' }} />
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Form.Item
                                        label="E-mail"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'E-mail'
                                            }
                                        ]}
                                        initialValue={itemContainer?.email}
                                    >
                                        <Input
                                            name="email"
                                            style={{
                                                width: '100%'
                                            }}
                                            placeholder="E-mail"
                                            onChange={(e) => setItemContainer({ ...itemContainer, email: e.target.value })}
                                            value={itemContainer?.email}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row> */}
                            <Divider style={{ margin: '10px 0' }} />
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Form.Item
                                        label={
                                            <span style={{ fontSize: '15px' }}>
                                                <span style={{ color: 'red', paddingRight: '5px' }}>*</span>주소
                                            </span>
                                        }
                                        rules={[
                                            {
                                                required: true,
                                                message: '주소'
                                            }
                                        ]}
                                        initialValue={itemContainer?.address}
                                    >
                                        <Input
                                            name="address"
                                            style={{
                                                width: '100%'
                                            }}
                                            placeholder="주소"
                                            onChange={(e) => setItemContainer({ ...itemContainer, address: e.target.value })}
                                            value={itemContainer?.address}
                                            autoComplete="off"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Divider style={{ margin: '10px 0' }} />
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Form.Item
                                        label={
                                            <span style={{ fontSize: '15px' }}>
                                                <span style={{ color: 'red', paddingRight: '5px' }}>*</span>소속
                                            </span>
                                        }
                                        rules={[
                                            {
                                                required: true,
                                                message: '소속'
                                            }
                                        ]}
                                        initialValue={itemContainer?.company}
                                    >
                                        <Input
                                            name="company"
                                            style={{
                                                width: '100%'
                                            }}
                                            placeholder="소속"
                                            onChange={(e) => setItemContainer({ ...itemContainer, company: e.target.value })}
                                            value={itemContainer?.company}
                                            autoComplete="off"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                        {/* <Divider style={{ margin: '10px 0' }} />
                        <Card>
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Form.Item
                                        label="소속회사명"
                                        rules={[
                                            {
                                                required: true,
                                                message: '소속회사명'
                                            }
                                        ]}
                                        initialValue={itemContainer?.company}
                                    >
                                        <Input
                                            name="company"
                                            style={{
                                                width: '100%'
                                            }}
                                            placeholder="소속회사명"
                                            onChange={(e) => setItemContainer({ ...itemContainer, company: e.target.value })}
                                            value={itemContainer?.company}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Divider style={{ margin: '10px 0' }} />
                            <Row gutter={24}>
                                <Col span={12}>
                                    <Form.Item
                                        label="재직여부"
                                        rules={[
                                            {
                                                required: true,
                                                message: '재직여부'
                                            }
                                        ]}
                                        initialValue={itemContainer?.employStatusYn}
                                    >
                                        <Select
                                            name="employStatusYn"
                                            value={itemContainer?.employStatusYn}
                                            style={{
                                                width: '285px'
                                            }}
                                            onChange={(e) => setItemContainer({ ...itemContainer, employStatusYn: e })}
                                            options={[
                                                {
                                                    label: '자사근로자',
                                                    value: '1'
                                                },
                                                {
                                                    label: '채용예정자',
                                                    value: '2'
                                                }
                                            ]}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="소속/직책"
                                        rules={[
                                            {
                                                required: true,
                                                message: '소속/직책'
                                            }
                                        ]}
                                    >
                                        <Input
                                            name="dept"
                                            style={{
                                                width: '45%'
                                            }}
                                            onChange={(e) => setItemContainer({ ...itemContainer, dept: e.target.value })}
                                            placeholder="소속"
                                            value={itemContainer?.dept}
                                        />
                                        <span style={{ margin: '0 4%' }}>/</span>
                                        <Input
                                            name="position"
                                            style={{
                                                width: '45%'
                                            }}
                                            onChange={(e) => setItemContainer({ ...itemContainer, position: e.target.value })}
                                            placeholder="직책"
                                            value={itemContainer?.position}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Divider style={{ margin: '10px 0' }} />
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Form.Item
                                        label="담당업무"
                                        rules={[
                                            {
                                                required: true,
                                                message: '담당업무'
                                            }
                                        ]}
                                    >
                                        <Input
                                            name="work"
                                            style={{
                                                width: '100%'
                                            }}
                                            placeholder="담당업무"
                                            onChange={(e) => setItemContainer({ ...itemContainer, work: e.target.value })}
                                            value={itemContainer?.work}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row> 
                        </Card>
                        <Divider style={{ margin: '10px 0' }} />
                         <Card>
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Form.Item label="최종학력">
                                        <Space>
                                            <Select
                                                name="lastEdu"
                                                defaultValue="# 최종학력 선택"
                                                style={{
                                                    width: '200px'
                                                }}
                                                onChange={(e) => setItemContainer({ ...itemContainer, lastEdu: e })}
                                                options={[
                                                    {
                                                        label: '고등학교 졸업',
                                                        value: '1'
                                                    },
                                                    {
                                                        label: '전문대학교 졸업',
                                                        value: '2'
                                                    },
                                                    {
                                                        label: '전문대학 재학',
                                                        value: '3'
                                                    },
                                                    {
                                                        label: '대학교 졸업',
                                                        value: '4'
                                                    },
                                                    {
                                                        label: '대학교 재학',
                                                        value: '5'
                                                    },
                                                    {
                                                        label: '대학원 졸업',
                                                        value: '6'
                                                    },
                                                    {
                                                        label: '대학원 재학',
                                                        value: '7'
                                                    }
                                                ]}
                                                value={itemContainer?.lastEdu}
                                            />
                                            <Input
                                                name="lastEduName"
                                                style={{ width: '375px' }}
                                                onChange={(e) => setItemContainer({ ...itemContainer, lastEduName: e.target.value })}
                                                value={itemContainer?.lastEduName}
                                                addonAfter={
                                                    itemContainer?.lastEdu === '1' || itemContainer?.lastEdu === undefined
                                                        ? '고등학교'
                                                        : '대학교'
                                                }
                                            />
                                        </Space>
                                        <br />
                                        <br />
                                        <Space>
                                            <Input
                                                name="lastEduDept"
                                                onChange={(e) => setItemContainer({ ...itemContainer, lastEduDept: e.target.value })}
                                                style={{ width: '200px' }}
                                                addonAfter="과"
                                                value={itemContainer?.lastEduDept}
                                            />
                                            <Input
                                                name="lastEduYear"
                                                onChange={(e) => setItemContainer({ ...itemContainer, lastEduYear: e.target.value })}
                                                style={{ textAlign: 'center', width: '100px' }}
                                                maxLength={1}
                                                addonAfter="년제"
                                                value={itemContainer?.lastEduYear}
                                            />
                                            <Radio.Group
                                                buttonStyle="solid"
                                                name="lastEduEnd"
                                                onChange={(e) => setItemContainer({ ...itemContainer, lastEduEnd: e.target.value })}
                                                value={itemContainer?.lastEduEnd}
                                            >
                                                <Radio.Button value="Y">
                                                    <span style={{ padding: '0 20px' }}>졸업</span>
                                                </Radio.Button>
                                                <span style={{ padding: '0 5px' }}></span>
                                                <Radio.Button value="N">
                                                    <span style={{ padding: '0 20px' }}>재학</span>
                                                </Radio.Button>
                                            </Radio.Group>
                                        </Space>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                        <Divider style={{ margin: '10px 0' }} />
                        <Card>
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Form.Item label="군경력">
                                        <Space>
                                            <DatePicker.RangePicker
                                                style={{
                                                    width: '195px'
                                                }}
                                                // renderExtraFooter={() => 'extra footer'}
                                                picker="month"
                                                locale={locale}
                                                onChange={(dates) => {
                                                    setItemContainer({
                                                        ...itemContainer,
                                                        militaryEndDate: dates[1].format('YYYY-MM-DD'),
                                                        ...itemContainer,
                                                        militaryStartDate: dates[0].format('YYYY-MM-DD')
                                                    });
                                                }}
                                                value={[
                                                    itemContainer?.militaryStartDate ? dayjs(itemContainer?.militaryStartDate) : '',
                                                    itemContainer?.militaryEndDate ? dayjs(itemContainer?.militaryEndDate) : ''
                                                ]}
                                            />
                                            <Input
                                                style={{
                                                    width: '113px',
                                                    border: '1px solid #d9d9d9',
                                                    height: '32px'
                                                }}
                                                name="militaryCareer"
                                                onChange={(e) => setItemContainer({ ...itemContainer, militaryCareer: e.target.value })}
                                                addonBefore="군별"
                                                placeholder="#육군"
                                                value={itemContainer?.militaryCareer}
                                            />
                                            <Input
                                                style={{
                                                    width: '113px'
                                                }}
                                                name="militaryClass"
                                                onChange={(e) => setItemContainer({ ...itemContainer, militaryClass: e.target.value })}
                                                addonBefore="병과"
                                                placeholder="#보병"
                                                value={itemContainer?.militaryClass}
                                            />
                                            <Input
                                                style={{
                                                    width: '140px'
                                                }}
                                                name="militaryEnd"
                                                onChange={(e) => setItemContainer({ ...itemContainer, militaryEnd: e.target.value })}
                                                addonBefore="최종계급"
                                                placeholder="#병장"
                                                value={itemContainer?.militaryEnd}
                                            />
                                        </Space>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card> */}
                        <Divider style={{ margin: '10px 0' }} />
                        <Card>
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Form.Item label="보안경력유무">
                                        <Radio.Group
                                            name="careerYn"
                                            buttonStyle="solid"
                                            onChange={(e) => setItemContainer({ ...itemContainer, careerYn: e.target.value })}
                                            value={itemContainer?.careerYn || 'N'}
                                        >
                                            <Radio.Button value="Y">
                                                <span style={{ padding: '0 10px' }}>유</span>
                                            </Radio.Button>
                                            <span style={{ padding: '0 5px' }}></span>
                                            <Radio.Button value="N">
                                                <span style={{ padding: '0 10px' }}>무</span>
                                            </Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                            </Row>
                            {itemContainer?.careerYn === 'Y' ? (
                                <>
                                    {/* 1 */}
                                    <Divider style={{ margin: '10px 0' }} />
                                    <Row gutter={24}>
                                        <Col span={24}>
                                            <Form.Item label="보안검색경력">
                                                <Space>
                                                    <DatePicker.RangePicker
                                                        style={{
                                                            width: '100%'
                                                        }}
                                                        // renderExtraFooter={() => 'extra footer'}
                                                        picker="month"
                                                        locale={locale}
                                                        onChange={(dates) => {
                                                            setItemContainer({
                                                                ...itemContainer,
                                                                careerEndDate1: dates[1].format('YYYY-MM-DD'),
                                                                ...itemContainer,
                                                                careerStartDate1: dates[0].format('YYYY-MM-DD')
                                                            });
                                                        }}
                                                        value={[
                                                            itemContainer?.careerStartDate1 ? dayjs(itemContainer.careerStartDate1) : '',
                                                            itemContainer?.careerEndDate1 ? dayjs(itemContainer.careerEndDate1) : ''
                                                        ]}
                                                        autoComplete="off"
                                                    />
                                                    <Input
                                                        name="careerCompany1"
                                                        onChange={(e) =>
                                                            setItemContainer({ ...itemContainer, careerCompany1: e.target.value })
                                                        }
                                                        addonBefore="소속"
                                                        placeholder="#소속"
                                                        value={itemContainer?.careerCompany1}
                                                        autoComplete="off"
                                                    />
                                                    <Input
                                                        name="careerPosition1"
                                                        onChange={(e) =>
                                                            setItemContainer({ ...itemContainer, careerPosition1: e.target.value })
                                                        }
                                                        addonBefore="직책(직위)"
                                                        placeholder="#직책(직위)"
                                                        value={itemContainer?.careerPosition1}
                                                        autoComplete="off"
                                                    />
                                                </Space>
                                                <br />
                                                <br />
                                                <Space direction="vertical">
                                                    <Input
                                                        name="career1"
                                                        onChange={(e) => setItemContainer({ ...itemContainer, career1: e.target.value })}
                                                        addonBefore="담당업무"
                                                        style={{ width: '41.3vw' }}
                                                        placeholder="#담당업무"
                                                        value={itemContainer?.career1}
                                                        autoComplete="off"
                                                    />
                                                </Space>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    {/* 2 */}
                                    {/* <Divider style={{ margin: '10px 0' }} />
                                    <Row gutter={24}>
                                        <Col span={24}>
                                            <Form.Item label="보안검색경력 [2]">
                                                <Space>
                                                    <DatePicker.RangePicker
                                                        style={{
                                                            width: '100%'
                                                        }}
                                                        renderExtraFooter={() => 'extra footer'}
                                                        picker="month"
                                                        locale={locale}
                                                        onChange={(dates) => {
                                                            setItemContainer({
                                                                ...itemContainer,
                                                                careerEndDate2: dates[1].format('YYYY-MM-DD'),
                                                                ...itemContainer,
                                                                careerStartDate2: dates[0].format('YYYY-MM-DD')
                                                            });
                                                        }}
                                                        value={[
                                                            itemContainer?.careerStartDate2 ? dayjs(itemContainer.careerStartDate2) : '',
                                                            itemContainer?.careerEndDate2 ? dayjs(itemContainer.careerEndDate2) : ''
                                                        ]}
                                                    />
                                                    <Input
                                                        name="careerCompany2"
                                                        onChange={(e) =>
                                                            setItemContainer({ ...itemContainer, careerCompany2: e.target.value })
                                                        }
                                                        addonBefore="소속"
                                                        placeholder="#소속"
                                                        value={itemContainer?.careerCompany2}
                                                    />
                                                    <Input
                                                        name="careerPosition2"
                                                        onChange={(e) =>
                                                            setItemContainer({ ...itemContainer, careerPosition2: e.target.value })
                                                        }
                                                        addonBefore="직책(직위)"
                                                        placeholder="#직책(직위)"
                                                        value={itemContainer?.careerPosition2}
                                                    />
                                                </Space>
                                                <br />
                                                <br />
                                                <Space direction="vertical">
                                                    <Input
                                                        name="career2"
                                                        onChange={(e) => setItemContainer({ ...itemContainer, career2: e.target.value })}
                                                        addonBefore="담당업무"
                                                        style={{ width: '585px' }}
                                                        placeholder="#담당업무"
                                                        value={itemContainer?.career2}
                                                    />
                                                </Space>
                                            </Form.Item>
                                        </Col>
                                    </Row> */}
                                </>
                            ) : (
                                ''
                            )}
                        </Card>
                    </Form>
                    <Row gutter={16} style={{ marginTop: '20px' }} justify="center">
                        <Space>
                            <Col>
                                <Button onClick={onAddClose} style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}>
                                    취 소
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    onClick={onAddSubmit}
                                    style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                    type="primary"
                                >
                                    회원가입
                                </Button>
                            </Col>
                        </Space>
                    </Row>
                </Typography>
            </MainCard>
        </Grid>
    );
};
export default Register;
