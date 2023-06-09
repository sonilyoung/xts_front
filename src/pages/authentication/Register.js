/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Row, Col, Space, Button, Divider, Form, Input, DatePicker, Card, Radio, Select } from 'antd';
import locale from 'antd/es/date-picker/locale/ko_KR';
import MainCard from 'components/MainCard';
import moment from 'moment';

// material-ui
import { Grid, Stack, Typography } from '@mui/material';

// project import
import FirebaseRegister from './auth-forms/AuthRegister';
import AuthWrapper from './AuthWrapper';

// ================================|| REGISTER ||================================ //

const Register = () => {
    const { RangePicker } = DatePicker;
    const [form] = Form.useForm();
    const [idChk, setIdChk] = useState(false); // 선택한 교육생 아이디 값
    const [itemContainer, setItemContainer] = useState({}); // 항목 컨테이너
    return (
        <Grid container spacing={3}>
            {/* <Grid item xs={12}>
                <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
                    <Typography variant="h3">Sign up</Typography>
                    <Typography component={Link} to="/login" variant="body1" sx={{ textDecoration: 'none' }} color="primary">
                        Already have an account?
                    </Typography>
                </Stack>
            </Grid>
            <Grid item xs={12}>
                <FirebaseRegister />
            </Grid> */}
            <MainCard title="교육생 정보조회">
                <Typography variant="body1">
                    <Form layout="horizontal" form={form}>
                        {/* <Form layout="vertical" form={form}> */}
                        <Card>
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Form.Item
                                        label="교육과정명"
                                        rules={[
                                            {
                                                required: true,
                                                message: '교육과정명'
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
                                                    label: '보안검색요원 초기교육',
                                                    value: '보안검색요원 초기교육'
                                                },
                                                {
                                                    label: '항공경비요원 초기교육',
                                                    value: '항공경비요원 초기교육'
                                                }
                                            ]}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Form.Item
                                        label="입교신청일"
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
                                            onChange={(e) => {
                                                setItemContainer({ ...itemContainer, writeDate: e.format('YYYY-MM-DD') });
                                            }}
                                            placeholder="입교신청일"
                                            style={{
                                                width: '100%'
                                            }}
                                            value={itemContainer?.writeDate ? moment(itemContainer.writeDate) : null}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Divider style={{ margin: '10px 0' }} />
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
                                        {idChk ? ( // 수정의 경우
                                            <Input
                                                name="userId"
                                                placeholder="아이디"
                                                onChange={(e) => setItemContainer({ ...itemContainer, userId: e.target.value })}
                                                value={itemContainer?.userId}
                                                disabled={idChk}
                                            />
                                        ) : (
                                            // 등록의 경우
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
                                                <Button
                                                    style={{
                                                        width: 80
                                                    }}
                                                    onClick={() => handel_IdChk(itemContainer?.userId)}
                                                    disabled={idChk}
                                                >
                                                    사용가능
                                                </Button>
                                            </Space>
                                        )}
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
                            </Row>
                            <Divider style={{ margin: '10px 0' }} />
                            <Row gutter={24}>
                                <Col span={12}>
                                    <Form.Item
                                        label="성명(국문)"
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
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
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
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Divider style={{ margin: '10px 0' }} />
                            <Row gutter={24}>
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
                            <Row gutter={24}>
                                <Col span={12}>
                                    <Form.Item
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
                                            onChange={(e) => setItemContainer({ ...itemContainer, registNumber: e.target.value })}
                                            value={itemContainer?.registNumber}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="생년월일"
                                        rules={[
                                            {
                                                required: true,
                                                message: '생년월일'
                                            }
                                        ]}
                                    >
                                        <DatePicker
                                            name="birthDay"
                                            onChange={(e) => {
                                                setItemContainer({
                                                    ...itemContainer,
                                                    birthDay: e.format('YYYY-MM-DD')
                                                });
                                            }}
                                            value={itemContainer?.birthDay ? moment(itemContainer.birthDay) : null}
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
                                            />
                                        </span>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Divider style={{ margin: '10px 0' }} />
                            <Row gutter={24}>
                                <Col span={12}>
                                    <Form.Item
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
                                            placeholder="전화번호"
                                            onChange={(e) => setItemContainer({ ...itemContainer, telNo: e.target.value })}
                                            value={itemContainer?.telNo}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="휴대폰번호"
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
                                            placeholder="휴대폰번호"
                                            onChange={(e) => setItemContainer({ ...itemContainer, hpNo: e.target.value })}
                                            value={itemContainer?.hpNo}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Divider style={{ margin: '10px 0' }} />
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
                            </Row>
                            <Divider style={{ margin: '10px 0' }} />
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Form.Item
                                        label="주소"
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
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                        <Divider style={{ margin: '10px 0' }} />
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
                                                renderExtraFooter={() => 'extra footer'}
                                                picker="month"
                                                locale={locale}
                                                onChange={(dates) => {
                                                    const [start, end] = dates;
                                                    setItemContainer({
                                                        ...itemContainer,
                                                        militaryEndDate: end.format('YYYY-MM'),
                                                        ...itemContainer,
                                                        militaryStartDate: start.format('YYYY-MM')
                                                    });
                                                }}
                                                value={[
                                                    itemContainer?.militaryStartDate ? moment(itemContainer.militaryStartDate) : null,
                                                    itemContainer?.militaryEndDate ? moment(itemContainer.militaryEndDate) : null
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
                        </Card>
                        <Divider style={{ margin: '10px 0' }} />
                        <Card>
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Form.Item label="보안경력유무">
                                        <Radio.Group
                                            name="careerYn"
                                            buttonStyle="solid"
                                            onChange={(e) => setItemContainer({ ...itemContainer, careerYn: e.target.value })}
                                            value={itemContainer?.careerYn}
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
                                            <Form.Item label="보안검색경력 [1]">
                                                <Space>
                                                    <DatePicker.RangePicker
                                                        style={{
                                                            width: '100%'
                                                        }}
                                                        renderExtraFooter={() => 'extra footer'}
                                                        picker="month"
                                                        locale={locale}
                                                        onChange={(dates) => {
                                                            const [start, end] = dates;
                                                            setItemContainer({
                                                                ...itemContainer,
                                                                careerEndDate1: end.format('YYYY-MM'),
                                                                ...itemContainer,
                                                                careerStartDate1: start.format('YYYY-MM')
                                                            });
                                                        }}
                                                        value={[
                                                            itemContainer?.careerStartDate1 ? moment(itemContainer.careerStartDate1) : null,
                                                            itemContainer?.careerEndDate1 ? moment(itemContainer.careerEndDate1) : null
                                                        ]}
                                                    />
                                                    <Input
                                                        name="careerCompany1"
                                                        onChange={(e) =>
                                                            setItemContainer({ ...itemContainer, careerCompany1: e.target.value })
                                                        }
                                                        addonBefore="소속"
                                                        placeholder="#소속"
                                                        value={itemContainer?.careerCompany1}
                                                    />
                                                    <Input
                                                        name="careerPosition1"
                                                        onChange={(e) =>
                                                            setItemContainer({ ...itemContainer, careerPosition1: e.target.value })
                                                        }
                                                        addonBefore="직책(직위)"
                                                        placeholder="#직책(직위)"
                                                        value={itemContainer?.careerPosition1}
                                                    />
                                                </Space>
                                                <br />
                                                <br />
                                                <Space direction="vertical">
                                                    <Input
                                                        name="career1"
                                                        onChange={(e) => setItemContainer({ ...itemContainer, career1: e.target.value })}
                                                        addonBefore="담당업무"
                                                        style={{ width: '585px' }}
                                                        placeholder="#담당업무"
                                                        value={itemContainer?.career1}
                                                    />
                                                </Space>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    {/* 2 */}
                                    <Divider style={{ margin: '10px 0' }} />
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
                                                            const [start2, end2] = dates;
                                                            setItemContainer({
                                                                ...itemContainer,
                                                                careerEndDate2: end2.format('YYYY-MM'),
                                                                ...itemContainer,
                                                                careerStartDate2: start2.format('YYYY-MM')
                                                            });
                                                        }}
                                                        value={[
                                                            itemContainer?.careerStartDate2 ? moment(itemContainer.careerStartDate2) : null,
                                                            itemContainer?.careerEndDate2 ? moment(itemContainer.careerEndDate2) : null
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
                                    </Row>
                                </>
                            ) : (
                                ''
                            )}
                        </Card>
                    </Form>
                </Typography>
            </MainCard>
        </Grid>
    );
};
export default Register;
