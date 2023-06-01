/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import {
    Row,
    Col,
    Space,
    Table,
    Tag,
    Tooltip,
    Button,
    Drawer,
    Switch,
    Divider,
    Form,
    Input,
    DatePicker,
    Card,
    Radio,
    Select,
    Modal
} from 'antd';
import locale from 'antd/es/date-picker/locale/ko_KR';
const { RangePicker } = DatePicker;

import {
    useSelectUserListMutation,
    useSelectUserMutation,
    useInsertUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation
} from '../../../hooks/api/StudentsManagement/StudentsManagement';

import { PlusOutlined, EditFilled, DeleteFilled, ExclamationCircleFilled } from '@ant-design/icons';

// project import
import MainCard from 'components/MainCard';

export const Studentinformation = () => {
    const { confirm } = Modal;
    const [form] = Form.useForm();
    const [getStudentInformationList] = useSelectUserListMutation(); // 교육생 정보 hooks api호출
    const [studentInformationList, setStudentInformationList] = useState(); // 교육생 정보 리스트 값
    const [dataSource, setDataSource] = useState([]); // Table 데이터 값
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false); // Drawer 추가 우측폼 상태
    const [dataEdit, setDataEdit] = useState(false); // Drawer 수정 우측폼 상태

    // 입교신청서 및 기본정보
    const [userId, setUserId] = useState(); // 아이디
    const [userPw, setUserPw] = useState(); // 비밀번호
    const [userNm, setUserNm] = useState(); // 회원명(국문)
    const [authCd, setAuthCd] = useState(); // 권한코드( 0001 학생)
    const [eduName, setEduName] = useState(); // 보안검색요원초기교육
    const [userNmCh, setUserNmCh] = useState(); // 회원명(한문)
    const [userNmEn, setUserNmEn] = useState(); // 회원명(영문)
    const [sex, setSex] = useState(); // 성별
    const [birthDay, setBirthDay] = useState(); // 생년월일
    const [age, setAge] = useState(); // 나이(만)
    const [address, setAddress] = useState(); // 주소
    const [email, setEmail] = useState(); // 이메일
    const [department, setDepartment] = useState(); // 소속
    const [position, setPosition] = useState(); // 직책
    const [work, setWork] = useState(); // 담당업무
    const [telNo, setTelNo] = useState(); // 전화번호
    const [hpNo, setHpNo] = useState(); // 휴대폰번호
    const [careerYn, setCareerYn] = useState('N'); // 보안검색 경력유무
    const [career1, setCareer1] = useState(); // 보안검색 경력1
    const [career2, setCareer2] = useState(); // 보안검색 경력2
    const [career3, setCareer3] = useState(); // 보안검색 경력3
    const [career4, setCareer4] = useState(); // 보안검색 경력4
    const [career5, setCareer5] = useState(); // 보안검색 경력5
    const [lastEduSchool, setLastEduSchool] = useState(); // 최종출신학교
    const [militaryCareer, setMilitaryCareer] = useState(); // 군경력
    const [registNumber, setRegistNumber] = useState(); // 주민번호
    const [employStatusYn, setEmployStatusYn] = useState(); // 재직여부
    const [lastEdu, setLastEdu] = useState(); // 최종학력
    const [company, setCompany] = useState(); // 소속회사명

    const [writeDate, setWriteDate] = useState(); // 입교신청일

    // 데이터 값 선언
    const handleStudents = async () => {
        const StudentInformationresponse = await getStudentInformationList({});
        setStudentInformationList(StudentInformationresponse?.data?.RET_DATA);
        setDataSource([
            ...StudentInformationresponse?.data?.RET_DATA.map((d, i) => ({
                key: i,
                userNo: d.userNo,
                userId: d.userId,
                userNm: d.userNm,
                userPw: d.userPw,
                userPhoto: d.userPhoto,
                iauthCd: d.iauthCd,
                authNm: d.authNm,
                company: d.company,
                dept: d.dept,
                position: d.position,
                trainingDiv: d.trainingDiv,
                telNo: d.telNo,
                hpNo: d.hpNo,
                email: d.email,
                loginStart: d.loginStart,
                loginLast: d.loginLast,
                loginError: d.loginError,
                pwPrior: d.pwPrior,
                pwChange: d.pwChange,
                pwUpdate: d.pwUpdate,
                pwPeriod: d.pwPeriod,
                useYn: d.useYn,
                insertId: d.insertId,
                insertDate: d.insertDate,
                updateId: d.updateId,
                updateDate: d.updateDate
            }))
        ]);
        setLoading(false);
    };

    const columns = [
        Table.SELECTION_COLUMN,
        {
            width: '70px',
            title: 'No',
            dataIndex: 'userNo',
            sorter: (a, b) => a.name.length - b.name.length,
            ellipsis: true,
            align: 'center'
        },
        {
            title: '사용자ID',
            dataIndex: 'userId',
            sorter: (a, b) => a.name.length - b.name.length,
            ellipsis: true,
            align: 'center'
        },
        {
            title: '사용자명',
            dataIndex: 'userNm',
            sorter: (a, b) => a.chinese - b.chinese,
            ellipsis: true,
            align: 'center'
        },
        {
            title: '기관',
            dataIndex: 'company',
            align: 'center'
        },
        {
            width: '100px',
            title: '부서',
            dataIndex: 'dept',
            align: 'center'
        },
        {
            width: '90px',
            title: '직위',
            dataIndex: 'position',
            align: 'center'
        },
        {
            title: '교육구분',
            dataIndex: 'trainingDiv',
            align: 'center'
        },
        // ,
        // {
        //     title: '최초로그인',
        //     dataIndex: 'loginStart',
        //     align: 'center'
        // }
        {
            title: '최종로그인',
            dataIndex: 'loginLast',
            align: 'center'
        },
        {
            width: '90px',
            title: '사용여부',
            dataIndex: 'useYn',
            align: 'center',
            render: (_, { useYn }) => (
                <>
                    {useYn === '1' ? (
                        <Tag color={'green'} key={useYn} onClick={() => handelUser()}>
                            사용
                        </Tag>
                    ) : (
                        <Tag color={'volcano'} key={useYn} onClick={() => handelUser()}>
                            미사용
                        </Tag>
                    )}
                </>
            )
        },
        {
            title: '교육생 사진',
            dataIndex: 'userPhoto',
            align: 'center'
        },
        {
            title: '등록일자',
            dataIndex: 'insertDate',
            align: 'center'
        },
        {
            title: '수정',
            render: (_, { userNo }) => (
                <>
                    <Tooltip title="수정" color="#108ee9">
                        <Button
                            type="primary"
                            onClick={() => handleEdit(userNo)}
                            style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                            icon={<EditFilled />}
                        >
                            수정
                        </Button>
                    </Tooltip>
                </>
            ),
            align: 'center'
        }
    ];
    //const [data, setData] = useState();
    //const [loading, setLoading] = useState(false);

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
        //setSortedInfo(sorter);
    };

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        onSelect: (record, selected, selectedRows) => {
            console.log(record, selected, selectedRows);
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
            console.log(selected, selectedRows, changeRows);
        }
    };

    const handelUser = (e) => {
        console.log(e, '사용여부');
    };

    // 추가 버튼
    const handleAdd = () => {
        setDataEdit(false);
        setOpen(true);
    };

    // 추가 및 수정 취소
    const onAddClose = () => {
        setOpen(false);
        form.resetFields();
    };

    // 추가 및 수정 처리
    const onAddSubmit = () => {
        // console.log(procGroupCdVal, procGroupNmVal, procGroupYnVal);
        if (dataEdit === true) {
            Modal.success({
                content: '수정 완료',
                onOk() {
                    setOpen(false);
                    setDataEdit(false);
                    // handleTheoryGroup();
                    form.resetFields();
                }
            });
        } else {
            Modal.success({
                content: '추가 완료',
                onOk() {
                    setOpen(false);
                    setDataEdit(false);
                    // handleTheoryGroup();
                    form.resetFields();
                }
            });
        }
    };

    useEffect(() => {
        setLoading(true);
        handleStudents();
    }, []);

    return (
        <>
            <MainCard title="교육생 정보조회">
                <Typography variant="body1">
                    <Row style={{ marginBottom: 16 }}>
                        <Col span={16} offset={8} style={{ textAlign: 'right' }}>
                            <Space>
                                <Tooltip title="추가">
                                    <Button
                                        type="success"
                                        onClick={handleAdd}
                                        style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                        icon={<PlusOutlined />}
                                    >
                                        추가
                                    </Button>
                                </Tooltip>
                            </Space>
                        </Col>
                    </Row>
                    <Table
                        columns={columns}
                        dataSource={dataSource}
                        rowSelection={{ ...rowSelection }}
                        bordered={true}
                        onChange={onChange}
                        loading={loading}
                    />
                </Typography>
            </MainCard>

            {/* 교육생 등록 Start */}
            <Drawer
                maskClosable={false}
                title={`대분류 ${dataEdit === true ? '수정' : '추가'}`}
                onClose={onAddClose}
                open={open}
                width={700}
                style={{ top: '60px' }}
                extra={
                    <>
                        <Space>
                            <Tooltip title="취소" placement="bottom">
                                <Button onClick={onAddClose} style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}>
                                    취소
                                </Button>
                            </Tooltip>
                            {dataEdit === true ? (
                                <Tooltip title="수정" placement="bottom" color="#108ee9">
                                    <Button
                                        onClick={onAddSubmit}
                                        style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                        type="primary"
                                    >
                                        수정
                                    </Button>
                                </Tooltip>
                            ) : (
                                <Tooltip title="추가" placement="bottom" color="#108ee9">
                                    <Button
                                        onClick={onAddSubmit}
                                        style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                        type="primary"
                                    >
                                        추가
                                    </Button>
                                </Tooltip>
                            )}
                        </Space>
                    </>
                }
            >
                <Form layout="vertical" form={form}>
                    <Card>
                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="eduName"
                                    label="교육과정명"
                                    onChange={(e) => setEduName(e.target.value)}
                                    rules={[
                                        {
                                            required: true,
                                            message: '교육과정명'
                                        }
                                    ]}
                                >
                                    <Select
                                        defaultValue="# 교육과정"
                                        style={{
                                            width: '285px'
                                        }}
                                        onChange={(e) => setLastEduSchool(e)}
                                        options={[
                                            {
                                                label: '보안검색요원 초기교육',
                                                value: '1'
                                            },
                                            {
                                                label: '항공경비요원 초기교육',
                                                value: '2'
                                            }
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="writeDate"
                                    label="입교신청일"
                                    rules={[
                                        {
                                            required: true,
                                            message: '입교신청일'
                                        }
                                    ]}
                                >
                                    <DatePicker
                                        onChange={(e) => setWriteDate(e)}
                                        placeholder="입교신청일"
                                        style={{
                                            width: '100%'
                                        }}
                                        value={writeDate}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    name="userId"
                                    onChange={(e) => setUserId(e.target.value)}
                                    label="아이디"
                                    rules={[
                                        {
                                            required: true,
                                            message: '아이디'
                                        }
                                    ]}
                                >
                                    <Input placeholder="아이디" value={userId} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="userPw"
                                    onChange={(e) => setUserPw(e.target.value)}
                                    label="비밀번호"
                                    rules={[
                                        {
                                            required: true,
                                            message: '비밀번호'
                                        }
                                    ]}
                                >
                                    <Input type="password" placeholder="비밀번호" value={userPw} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    name="userNm"
                                    onChange={(e) => setUserNm(e.target.value)}
                                    label="성명(국문)"
                                    rules={[
                                        {
                                            required: true,
                                            message: '성명(국문)'
                                        }
                                    ]}
                                >
                                    <Input
                                        style={{
                                            width: '100%'
                                        }}
                                        placeholder="성명(국문)"
                                        value={userNm}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="userNmCh"
                                    onChange={(e) => setUserNmCh(e.target.value)}
                                    label="성명(한문)"
                                    rules={[
                                        {
                                            required: true,
                                            message: '성명(한문)'
                                        }
                                    ]}
                                >
                                    <Input
                                        style={{
                                            width: '100%'
                                        }}
                                        placeholder="성명(한문)"
                                        value={userNmCh}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    name="UserNmEn"
                                    onChange={(e) => setUserNmEn(e.target.value)}
                                    label="성명(영문)"
                                    rules={[
                                        {
                                            required: true,
                                            message: '성명(영문)'
                                        }
                                    ]}
                                >
                                    <Input
                                        style={{
                                            width: '100%'
                                        }}
                                        placeholder="성명(영문)"
                                        value={userNmEn}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="sex"
                                    label="성별"
                                    rules={[
                                        {
                                            required: true,
                                            message: '성별'
                                        }
                                    ]}
                                >
                                    <Radio.Group onChange={(e) => setSex(e.target.value)} buttonStyle="solid" defaultValue={sex}>
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
                                    name="registNumber"
                                    label="주민등록번호"
                                    rules={[
                                        {
                                            required: true,
                                            message: '주민등록번호'
                                        }
                                    ]}
                                >
                                    <Input
                                        onChange={(e) => setRegistNumber(e.target.value)}
                                        style={{
                                            width: '100%',
                                            margin: '0 3px'
                                        }}
                                        value={registNumber}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="birthDay"
                                    label="생년월일"
                                    rules={[
                                        {
                                            required: true,
                                            message: '생년월일'
                                        }
                                    ]}
                                >
                                    <DatePicker
                                        onChange={(e) => setBirthDay(e)}
                                        // onChange={onChange}
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
                                            onChange={(e) => setSex(e.target.value)}
                                            maxLength={2}
                                            style={{
                                                width: '43%',
                                                margin: '0 3px'
                                            }}
                                            value={age}
                                        />
                                    </span>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    name="telNo"
                                    label="전화번호"
                                    onChange={(e) => setTelNo(e.target.value)}
                                    rules={[
                                        {
                                            required: true,
                                            message: '전화번호'
                                        }
                                    ]}
                                >
                                    <Input
                                        style={{
                                            width: '100%'
                                        }}
                                        placeholder="전화번호"
                                        value={telNo}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="hpNo"
                                    label="휴대폰번호"
                                    onChange={(e) => setHpNo(e.target.value)}
                                    rules={[
                                        {
                                            required: true,
                                            message: '휴대폰번호'
                                        }
                                    ]}
                                >
                                    <Input
                                        style={{
                                            width: '100%'
                                        }}
                                        placeholder="휴대폰번호"
                                        value={hpNo}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />
                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    label="E-mail"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'E-mail'
                                        }
                                    ]}
                                >
                                    <Input
                                        style={{
                                            width: '100%'
                                        }}
                                        placeholder="E-mail"
                                        value={email}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />
                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="address"
                                    onChange={(e) => setAddress(e.target.value)}
                                    label="주소"
                                    rules={[
                                        {
                                            required: true,
                                            message: '주소'
                                        }
                                    ]}
                                >
                                    <Input
                                        style={{
                                            width: '100%'
                                        }}
                                        placeholder="주소"
                                        value={address}
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
                                    name="company"
                                    label="소속회사명"
                                    onChange={(e) => setCompany(e.target.value)}
                                    rules={[
                                        {
                                            required: true,
                                            message: '소속회사명'
                                        }
                                    ]}
                                >
                                    <Input
                                        style={{
                                            width: '100%'
                                        }}
                                        placeholder="소속회사명"
                                        value={company}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    name="employStatusYn"
                                    onChange={(e) => setEmployStatusYn(e.target.value)}
                                    label="재직여부"
                                    rules={[
                                        {
                                            required: true,
                                            message: '재직여부'
                                        }
                                    ]}
                                >
                                    <Select
                                        defaultValue="# 최종학력 선택"
                                        style={{
                                            width: '285px'
                                        }}
                                        onChange={(e) => setLastEduSchool(e)}
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
                                    name="department"
                                    label="소속/직책"
                                    rules={[
                                        {
                                            required: true,
                                            message: '소속/직책'
                                        }
                                    ]}
                                >
                                    <Input
                                        style={{
                                            width: '45%'
                                        }}
                                        onChange={(e) => setDepartment(e.target.value)}
                                        placeholder="소속"
                                        value={department}
                                    />
                                    <span style={{ margin: '0 4%' }}>/</span>

                                    <Input
                                        style={{
                                            width: '45%'
                                        }}
                                        onChange={(e) => setPosition(e.target.value)}
                                        placeholder="직책"
                                        value={department}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />
                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="work"
                                    label="담당업무"
                                    onChange={(e) => setWork(e.target.value)}
                                    rules={[
                                        {
                                            required: true,
                                            message: '담당업무'
                                        }
                                    ]}
                                >
                                    <Input
                                        style={{
                                            width: '100%'
                                        }}
                                        placeholder="담당업무"
                                        value={work}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                    <Divider style={{ margin: '10px 0' }} />
                    <Card>
                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item name="lastEduSchool" label="최종출신학교" onChange={(e) => setLastEduSchool(e)}>
                                    <Space direction="vertical">
                                        <DatePicker
                                            style={{
                                                width: '100%'
                                            }}
                                            renderExtraFooter={() => 'extra footer'}
                                            picker="month"
                                            locale={locale}
                                            format="YYYY년 M월"
                                            value={career1}
                                        />
                                    </Space>
                                </Form.Item>
                                <Form.Item>
                                    <Space>
                                        <span style={{ margin: '0 10px' }}>
                                            <Input style={{ width: '63%' }} placeholder="과" />과
                                        </span>
                                        <span style={{ margin: '0 10px' }}>
                                            <Input style={{ width: '50%' }} placeholder="년" />년
                                        </span>
                                        <span style={{ margin: '0 10px' }}>졸업 / 재학</span>
                                    </Space>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />
                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item name="lastEduSchool" label="최종학력">
                                    <Space>
                                        <Select
                                            defaultValue="# 최종학력 선택"
                                            style={{
                                                width: '200px'
                                            }}
                                            onChange={(e) => setLastEduSchool(e)}
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
                                            value={lastEduSchool}
                                        />
                                        <Input
                                            style={{ width: '375px' }}
                                            addonAfter={lastEduSchool === '1' || lastEduSchool === undefined ? '고등학교' : '대학교'}
                                        />
                                    </Space>
                                    <br />
                                    <br />
                                    <Space>
                                        <Input style={{ width: '200px' }} addonAfter="과" />
                                        <Input style={{ textAlign: 'center', width: '100px' }} maxLength={1} addonAfter="년제" />
                                        <Radio.Group buttonStyle="solid">
                                            {/* onChange={(e) => setSex(e.target.value)} buttonStyle="solid" defaultValue={sex} */}
                                            <Radio.Button value="1">
                                                <span style={{ padding: '0 20px' }}>졸업</span>
                                            </Radio.Button>
                                            <span style={{ padding: '0 5px' }}></span>
                                            <Radio.Button value="2">
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
                                <Form.Item name="militaryCareer" label="군경력" onChange={(e) => setMilitaryCareer(e.target.value)}>
                                    <Space>
                                        <DatePicker.RangePicker
                                            style={{
                                                width: '180px'
                                            }}
                                            renderExtraFooter={() => 'extra footer'}
                                            picker="month"
                                            locale={locale}
                                            value={militaryCareer}
                                        />
                                        <Input addonBefore="군별" placeholder="#육군" />
                                        <Input addonBefore="병과" placeholder="#보병" />
                                        <Input addonBefore="최종계급" placeholder="#병장" />
                                    </Space>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                    <Divider style={{ margin: '10px 0' }} />
                    <Card>
                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item name="careerYn" label="보안경력유무">
                                    <Radio.Group
                                        buttonStyle="solid"
                                        onChange={(e) => setCareerYn(e.target.value)}
                                        value={careerYn}
                                        defaultValue={careerYn}
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
                        {careerYn === 'Y' ? (
                            <>
                                {/* 1 */}
                                <Divider style={{ margin: '10px 0' }} />
                                <Row gutter={24}>
                                    <Col span={24}>
                                        <Form.Item name="career1" label="보안검색경력 [1]" onChange={(e) => setCareer1(e)}>
                                            <Space>
                                                <DatePicker.RangePicker
                                                    style={{
                                                        width: '100%'
                                                    }}
                                                    renderExtraFooter={() => 'extra footer'}
                                                    picker="month"
                                                    locale={locale}
                                                    value={career1}
                                                />
                                                <Input addonBefore="소속" placeholder="#소속" />
                                                <Input addonBefore="직책(직위)" placeholder="#직책(직위)" />
                                            </Space>
                                            <br />
                                            <br />
                                            <Space direction="vertical">
                                                <Input addonBefore="담당업무" style={{ width: '585px' }} placeholder="#담당업무" />
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                {/* 2 */}
                                <Divider style={{ margin: '10px 0' }} />
                                <Row gutter={24}>
                                    <Col span={24}>
                                        <Form.Item name="career2" label="보안검색경력 [2]" onChange={(e) => setCareer2(e)}>
                                            <Space>
                                                <DatePicker.RangePicker
                                                    style={{
                                                        width: '100%'
                                                    }}
                                                    renderExtraFooter={() => 'extra footer'}
                                                    picker="month"
                                                    locale={locale}
                                                    value={career2}
                                                />
                                                <Input addonBefore="소속" placeholder="#소속" />
                                                <Input addonBefore="직책(직위)" placeholder="#직책(직위)" />
                                            </Space>
                                            <br />
                                            <br />
                                            <Space direction="vertical">
                                                <Input addonBefore="담당업무" style={{ width: '585px' }} placeholder="#담당업무" />
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                {/* 3 */}
                                <Divider style={{ margin: '10px 0' }} />
                                <Row gutter={24}>
                                    <Col span={24}>
                                        <Form.Item name="career3" label="보안검색경력 [3]" onChange={(e) => setCareer3(e)}>
                                            <Space>
                                                <DatePicker.RangePicker
                                                    style={{
                                                        width: '100%'
                                                    }}
                                                    renderExtraFooter={() => 'extra footer'}
                                                    picker="month"
                                                    locale={locale}
                                                    value={career3}
                                                />
                                                <Input addonBefore="소속" placeholder="#소속" />
                                                <Input addonBefore="직책(직위)" placeholder="#직책(직위)" />
                                            </Space>
                                            <br />
                                            <br />
                                            <Space direction="vertical">
                                                <Input addonBefore="담당업무" style={{ width: '585px' }} placeholder="#담당업무" />
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                {/* 4 */}
                                <Divider style={{ margin: '10px 0' }} />
                                <Row gutter={24}>
                                    <Col span={24}>
                                        <Form.Item name="career4" label="보안검색경력 [4]" onChange={(e) => setCareer4(e)}>
                                            <Space>
                                                <DatePicker.RangePicker
                                                    style={{
                                                        width: '100%'
                                                    }}
                                                    renderExtraFooter={() => 'extra footer'}
                                                    picker="month"
                                                    locale={locale}
                                                    value={career4}
                                                />
                                                <Input addonBefore="소속" placeholder="#소속" />
                                                <Input addonBefore="직책(직위)" placeholder="#직책(직위)" />
                                            </Space>
                                            <br />
                                            <br />
                                            <Space direction="vertical">
                                                <Input addonBefore="담당업무" style={{ width: '585px' }} placeholder="#담당업무" />
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                {/* 5 */}
                                <Divider style={{ margin: '10px 0' }} />
                                <Row gutter={24}>
                                    <Col span={24}>
                                        <Form.Item name="career5" label="보안검색경력 [5]" onChange={(e) => setCareer5(e)}>
                                            <Space>
                                                <DatePicker.RangePicker
                                                    style={{
                                                        width: '100%'
                                                    }}
                                                    renderExtraFooter={() => 'extra footer'}
                                                    picker="month"
                                                    locale={locale}
                                                    value={career5}
                                                />
                                                <Input addonBefore="소속" placeholder="#소속" />
                                                <Input addonBefore="직책(직위)" placeholder="#직책(직위)" />
                                            </Space>
                                            <br />
                                            <br />
                                            <Space direction="vertical">
                                                <Input addonBefore="담당업무" style={{ width: '585px' }} placeholder="#담당업무" />
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
            </Drawer>
            {/* 교육생 등록 End */}

            {/* 교육생 등록 Excel Start */}
            {/* 교육생 등록 Excel End */}
        </>
    );
};
// export default Studentinformation;
