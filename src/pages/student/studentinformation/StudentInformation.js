/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from 'react';
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
    Divider,
    Form,
    Input,
    DatePicker,
    Card,
    Radio,
    Select,
    Modal,
    Descriptions
} from 'antd';
import locale from 'antd/es/date-picker/locale/ko_KR';
const { RangePicker } = DatePicker;

import {
    useSelectUserListMutation,
    useSelectUserMutation,
    useInsertUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useSelectUserCheckMutation,
    useSelectCertificationUserListMutation
} from '../../../hooks/api/StudentsManagement/StudentsManagement';

import { PlusOutlined, EditFilled, DeleteFilled, ExclamationCircleFilled, FileProtectOutlined } from '@ant-design/icons';

import { CertificatesPrint } from './CertificatesPrint';

// project import
import MainCard from 'components/MainCard';
import moment from 'moment';

export const Studentinformation = () => {
    const { confirm } = Modal;
    const [form] = Form.useForm();
    const contentRef = useRef(null);

    const [dataSource, setDataSource] = useState([]); // Table 데이터 값
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false); // Drawer 추가 우측폼 상태
    const [dataEdit, setDataEdit] = useState(false); // Drawer 수정 우측폼 상태

    const [selectedRowKeys, setSelectedRowKeys] = useState([]); //셀렉트 박스 option Selected 값
    const [userId, setUserId] = useState([]); // 선택한 교육생 아이디 값
    const [userNmValue, setUserNmValue] = useState([]); // 선택한 교육생 이름 값

    const [idChk, setIdChk] = useState(false); // 선택한 교육생 아이디 값
    const [itemContainer, setItemContainer] = useState({}); // 항목 컨테이너

    const [passResultModal, setPassResultModal] = useState(false); // 합격 여부 modal
    const [certificatesModal, setCertificatesModal] = useState(false); // 수료증(이수증) modal

    const [userId_props, setUserId_props] = useState(null); // 수료증(이수증) props
    const [procCd_props, setProcCd_props] = useState(null); // 수료증(이수증) props
    const [procSeq_props, setProcSeq_props] = useState(null); // 수료증(이수증) props

    const [searchval, setSearchval] = useState(null);
    // ===============================
    // Api 호출 Start
    // 조회 ======================================================
    const [SelectUserListApi] = useSelectUserListMutation(); // 교육생 정보 hooks api호출
    const [selectUserListData, setSelectUserListData] = useState(); // 교육생 정보 리스트 값
    const handle_SelectUserList_Api = async () => {
        const SelectUserListresponse = await SelectUserListApi({});
        setSelectUserListData(SelectUserListresponse?.data?.RET_DATA);
        setDataSource([
            ...SelectUserListresponse?.data?.RET_DATA.map((d, i) => ({
                key: d.userId,
                userNo: i + 1,
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
                eduName: d.eduName,
                writeDate: d.writeDate,
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

    // 등록 ======================================================
    const [InsertUserApi] = useInsertUserMutation(); // 교육생 정보 hooks api호출
    const handle_InsertUser_Api = async () => {
        const InsertUserresponse = await InsertUserApi({
            eduName: itemContainer.eduName, //                      교육과정명
            writeDate: itemContainer.writeDate, //                  입교신청일
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
            careerPosition1: itemContainer.careerPosition1, //       보안검색경력직책1
            career2: itemContainer.career2,
            careerStartDate2: itemContainer.careerStartDate2,
            careerEndDate2: itemContainer.careerEndDate2,
            careerCompany2: itemContainer.careerCompany2,
            careerPosition2: itemContainer.careerPosition2
            // career3: itemContainer.career3,
            // careerStartDate3: itemContainer.careerStartDate3,
            // careerEndDate3: itemContainer.careerEndDate3,
            // careerCompany3: itemContainer.careerCompany3,
            // careerPosition3: itemContainer.careerPosition3,
            // career4: itemContainer.career4,
            // careerStartDate4: itemContainer.careerStartDate4,
            // careerEndDate4: itemContainer.careerEndDate4,
            // careerCompany4: itemContainer.careerCompany4,
            // careerPosition4: itemContainer.careerPosition4,
            // career5: itemContainer.career5,
            // careerStartDate5: itemContainer.careerStartDate5,
            // careerEndDate5: itemContainer.careerEndDate5,
            // careerCompany5: itemContainer.careerCompany5,
            // careerPosition5: itemContainer.careerPosition5
        });
        InsertUserresponse?.data?.RET_CODE === '0100'
            ? Modal.success({
                  content: '등록 완료',
                  onOk() {
                      setOpen(false);
                      setDataEdit(false);
                      form.resetFields();
                      handle_SelectUserList_Api();
                  }
              })
            : Modal.error({
                  content: '등록 오류',
                  onOk() {}
              });
    };

    // 아이디 중복 체크 ===========================================
    const [SelectUserCheckApi] = useSelectUserCheckMutation(); // 상세 hooks api호출
    const handel_SelectUserCheck_Api = async (userId) => {
        const SelectUserCheckresponse = await SelectUserCheckApi({
            userId: userId
        });
        SelectUserCheckresponse.data.RET_CODE === '9996'
            ? (setItemContainer({ ...itemContainer, userId: '' }),
              setIdChk(false),
              Modal.success({
                  content: SelectUserCheckresponse.data.RET_DESC,
                  onOk() {}
              }))
            : setIdChk(true);
    };

    // 상세 ======================================================
    const [SelectUserApi] = useSelectUserMutation(); // 상세 hooks api호출
    const handel_SelectUser_Api = async (userId) => {
        const SelectUserresponse = await SelectUserApi({
            userId: userId
        });
        setItemContainer(SelectUserresponse.data.RET_DATA);
    };

    // 수정 ======================================================
    const [UpdateUserApi] = useUpdateUserMutation(); // 수정 hooks api호출
    const handel_UpdateUser_Api = async () => {
        const UpdateUserresponse = await UpdateUserApi({
            useYn: itemContainer.useYn, //                          사용여부
            eduName: itemContainer.eduName, //                      교육과정명
            writeDate: itemContainer.writeDate, //                  입교신청일
            userId: userId, //                                      아이디
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
            careerPosition1: itemContainer.careerPosition1, //       보안검색경력직책1
            career2: itemContainer.career2,
            careerStartDate2: itemContainer.careerStartDate2,
            careerEndDate2: itemContainer.careerEndDate2,
            careerCompany2: itemContainer.careerCompany2,
            careerPosition2: itemContainer.careerPosition2
            // career3: itemContainer.career3,
            // careerStartDate3: itemContainer.careerStartDate3,
            // careerEndDate3: itemContainer.careerEndDate3,
            // careerCompany3: itemContainer.careerCompany3,
            // careerPosition3: itemContainer.careerPosition3,
            // career4: itemContainer.career4,
            // careerStartDate4: itemContainer.careerStartDate4,
            // careerEndDate4: itemContainer.careerEndDate4,
            // careerCompany4: itemContainer.careerCompany4,
            // careerPosition4: itemContainer.careerPosition4,
            // career5: itemContainer.career5,
            // careerStartDate5: itemContainer.careerStartDate5,
            // careerEndDate5: itemContainer.careerEndDate5,
            // careerCompany5: itemContainer.careerCompany5,
            // careerPosition5: itemContainer.careerPosition5
        });
        // console.log(userId);
        // console.log(UpdateUserresponse);
        UpdateUserresponse?.data?.RET_CODE === '0100'
            ? Modal.success({
                  content: '수정 완료',
                  onOk() {
                      setOpen(false);
                      setDataEdit(false);
                      form.resetFields();
                      handle_SelectUserList_Api();
                  }
              })
            : Modal.error({
                  content: '수정 오류',
                  onOk() {}
              });
    };
    // 삭제 ======================================================
    const [DeleteUserApi] = useDeleteUserMutation(); // 삭제 hooks api호출
    const handel_DeleteUser_Api = async (userIdList) => {
        const DeleteUserresponse = await DeleteUserApi({
            userIdList: userIdList
        });
        DeleteUserresponse?.data?.RET_CODE === '0300'
            ? Modal.success({
                  content: '삭제 완료',
                  onOk() {
                      handle_SelectUserList_Api();
                  }
              })
            : Modal.error({
                  content: '삭제 오류',
                  onOk() {}
              });
    };

    // 이수증 리스트
    const [SelectCertificationUserListApi] = useSelectCertificationUserListMutation(); // 상세 hooks api호출
    const [certificationUserList, setCertificationUserList] = useState(null);
    const handel_SelectCertificationUserList_Api = async (userId) => {
        const SelectCertificationUserListResponse = await SelectCertificationUserListApi({
            userId: userId
        });
        setCertificationUserList(SelectCertificationUserListResponse.data.RET_DATA);
    };

    // Api 호출 End
    // ===============================
    const columns = [
        {
            width: '70px',
            title: 'No',
            dataIndex: 'userNo',
            sorter: (a, b) => a.userNo - b.userNo,
            ellipsis: true,
            align: 'center'
        },
        {
            title: '교육생 ID',
            dataIndex: 'userId',
            sorter: (a, b) => a.userId.length - b.userId.length,
            ellipsis: true,
            align: 'center'
        },
        {
            title: '교육생 명',
            dataIndex: 'userNm',
            sorter: (a, b) => a.userNm.length - b.userNm.length,
            ellipsis: true,
            align: 'center'
        },
        {
            title: '기관',
            dataIndex: 'company',
            align: 'center'
        },
        {
            width: '110px',
            title: '부서',
            dataIndex: 'dept',
            align: 'center'
        },
        {
            width: '110px',
            title: '직위',
            dataIndex: 'position',
            align: 'center'
        },
        {
            title: '교육 구분',
            dataIndex: 'eduName',
            align: 'center'
        },
        {
            title: '입교 신청일',
            dataIndex: 'writeDate',
            align: 'center'
        },
        {
            width: '85px',
            title: '사용여부',
            dataIndex: 'useYn',
            align: 'center',
            render: (_, { useYn }) => (
                <>
                    {useYn === 'Y' ? (
                        <Tag color={'green'} key={useYn}>
                            사용
                        </Tag>
                    ) : (
                        <Tag color={'volcano'} key={useYn}>
                            미사용
                        </Tag>
                    )}
                </>
            )
        },
        {
            title: '학격여부',
            align: 'center',
            render: (_, { userId, userNm }) => (
                <>
                    <Tooltip title="학격여부" color="#108ee9">
                        <Button
                            type="primary"
                            onClick={() => passResultModal_handleOpen(userId, userNm)}
                            style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                            icon={<FileProtectOutlined />}
                        >
                            학격여부
                        </Button>
                    </Tooltip>
                </>
            )
        },
        {
            width: '110px',
            title: '등록일자',
            dataIndex: 'insertDate',
            align: 'center'
        },
        {
            width: '120px',
            title: '수정',
            render: (_, { userId }) => (
                <>
                    <Tooltip title="수정" color="#108ee9">
                        <Button
                            type="primary"
                            onClick={() => handleEdit(userId)}
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

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    //체크 박스 이벤트
    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    //체크 박스 선택
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange
    };

    // 수정 버튼 클릭
    const handleEdit = (userId) => {
        handel_SelectUser_Api(userId);
        setUserId(userId);
        form.resetFields();
        setDataEdit(true);
        setIdChk(true);
        setOpen(true);
    };

    // 추가 버튼
    const handleAdd = () => {
        setItemContainer([]);
        form.resetFields();
        setDataEdit(false);
        setOpen(true);
    };

    // 추가 및 수정 취소
    const onAddClose = () => {
        setItemContainer([]);
        form.resetFields();
        setOpen(false);
    };

    // 추가 및 수정 처리
    const onAddSubmit = () => {
        if (dataEdit === true) {
            handel_UpdateUser_Api();
        } else {
            handle_InsertUser_Api();
        }
    };

    // 아이디 중복 체크 버튼 클릭 이벤트
    const handel_IdChk = (user_id) => {
        handel_SelectUserCheck_Api(user_id);
    };

    // 삭제
    const handleDel = () => {
        if (selectedRowKeys == '') {
            Modal.error({
                content: '삭제할 항목을 선택해주세요.'
            });
        } else {
            confirm({
                title: '선택한 항목을 삭제하시겠습니까?',
                icon: <ExclamationCircleFilled />,
                okText: '예',
                okType: 'danger',
                cancelText: '아니오',
                onOk() {
                    handel_DeleteUser_Api(selectedRowKeys);
                },
                onCancel() {}
            });
        }
    };

    // 합격여부 Modal Open
    const passResultModal_handleOpen = (userId, userNm) => {
        handel_SelectCertificationUserList_Api(userId);
        setPassResultModal(true);
        setUserId_props(userId);
        setUserNmValue(userNm);
    };

    // 합격여부 Modal Close
    const passResultModal_handleCancel = () => {
        setPassResultModal(false);
    };

    // 이수증명서 Modal Opem
    const Certificates_Print = (userId, procCd, procSeq) => {
        setUserId_props(userId);
        setProcCd_props(procCd);
        setProcSeq_props(procSeq);
        setCertificatesModal(true);
    };

    const handlePrint = () => {
        const content = contentRef.current;
        if (content) {
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
              <html>
                <head>
                  <title>Print</title>
                  <style>
                    @media print {
                      @page {
                        size: A4;
                      }
                    }
                  </style>
                </head>
                <body>
                ${content.innerHTML}
                  <script>
                    window.onload = function() {
                      window.print();
                    };
      
                    window.onafterprint = function() {
                      window.close();
                    };
      
                    window.onbeforeunload = function() {
                      if (printWindow && !printWindow.closed) {
                        printWindow.close();
                      }
                    };
                  </script>
                </body>
              </html>
            `);
            printWindow.document.title = '이수증명서(' + userNmValue + ').pdf';
            printWindow.document.close();
        }
    };

    // 이수증명서 Modal Close
    const certificatesModal_handleCancel = () => {
        setUserId_props(null);
        setProcCd_props(null);
        setProcSeq_props(null);
        setCertificatesModal(false);
    };

    const onSearch = (value) => {
        setSearchval(value);
    };

    useEffect(() => {
        setLoading(true);
        handle_SelectUserList_Api();

        const handleUnload = () => {
            if (printWindow && !printWindow.closed) {
                printWindow.close();
            }
        };

        window.addEventListener('beforeunload', handleUnload);

        return () => {
            window.removeEventListener('beforeunload', handleUnload);
        };
    }, []);

    return (
        <>
            <MainCard title="교육생 정보조회">
                <Typography variant="body1">
                    <Row gutter={[8, 8]} style={{ marginBottom: 16 }}>
                        <Col span={12}>
                            <div style={{ display: 'flex', justifyContent: 'flex-start', fontSize: '14px' }}>
                                <Input.Search
                                    placeholder="※ 통합 검색 (이론 과정, 이론 강의명, 이론 강의내용)"
                                    style={{ width: 483 }}
                                    onSearch={onSearch}
                                    allowClear
                                    enterButton
                                    size="middle"
                                    className="custom-search-input"
                                />
                            </div>
                        </Col>
                        <Col span={12} style={{ textAlign: 'right' }}>
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
                                <Tooltip title="삭제">
                                    <Button
                                        type="danger"
                                        onClick={handleDel}
                                        style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                        icon={<DeleteFilled />}
                                    >
                                        삭제
                                    </Button>
                                </Tooltip>
                            </Space>
                        </Col>
                    </Row>
                    {/* userId */}
                    <Table
                        columns={columns}
                        dataSource={dataSource}
                        rowSelection={{ ...rowSelection }}
                        rowClassName={(record) => {
                            return record.userId === userId_props ? `table-row-lightblue` : '';
                        }}
                        bordered={true}
                        onChange={onChange}
                        loading={loading}
                        size="middle"
                    />
                </Typography>
            </MainCard>

            {/* 교육생 등록 Start */}
            <Drawer
                maskClosable={false}
                title={`교육생 ${dataEdit === true ? '수정' : '추가'}`}
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
                        {idChk ? (
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Form.Item
                                        label="사용여부"
                                        rules={[
                                            {
                                                required: true,
                                                message: '사용여부'
                                            }
                                        ]}
                                        initialValue={itemContainer?.useYn}
                                    >
                                        <Radio.Group
                                            name="useYn"
                                            onChange={(e) => setItemContainer({ ...itemContainer, useYn: e.target.value })}
                                            buttonStyle="solid"
                                            value={itemContainer?.useYn}
                                        >
                                            <Radio.Button value="Y">
                                                <span style={{ padding: '0 15px' }}>사용</span>
                                            </Radio.Button>
                                            <span style={{ padding: '0 10px' }}></span>
                                            <Radio.Button value="N">
                                                <span style={{ padding: '0 15px' }}>미사용</span>
                                            </Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                            </Row>
                        ) : (
                            ''
                        )}

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
                                        defaultValue={[{ label: '# 교육과정', value: '0' }]}
                                        style={{
                                            width: '100%'
                                        }}
                                        onChange={(e) => setItemContainer({ ...itemContainer, eduName: e })}
                                        value={itemContainer?.eduCode}
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
                                        // onChange={(e) => setItemContainer({ ...itemContainer, writeDate: e.format('YYYY-MM-DD') })}
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
                                            <Input
                                                name="userId"
                                                placeholder="아이디"
                                                onChange={(e) => setItemContainer({ ...itemContainer, userId: e.target.value })}
                                                value={itemContainer?.userId}
                                                disabled={idChk}
                                            />
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
                                                width: '113px'
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
                                                    onChange={(e) => setItemContainer({ ...itemContainer, careerCompany1: e.target.value })}
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
                                                        setItemContainer({ ...itemContainer, careerStartDate2: start2.format('YYYY-MM') });
                                                        setItemContainer({ ...itemContainer, careerEndDate2: end2.format('YYYY-MM') });
                                                    }}
                                                    value={[
                                                        itemContainer?.careerStartDate2 ? moment(itemContainer.careerStartDate2) : null,
                                                        itemContainer?.careerEndDate2 ? moment(itemContainer.careerEndDate2) : null
                                                    ]}
                                                />
                                                <Input
                                                    name="careerCompany2"
                                                    onChange={(e) => setItemContainer({ ...itemContainer, careerCompany2: e.target.value })}
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
                                {/* 3 ~ 5 */}
                                {/* <Divider style={{ margin: '10px 0' }} />
                                <Row gutter={24}>
                                    <Col span={24}>
                                        <Form.Item label="보안검색경력 [3]">
                                            <Space>
                                                <DatePicker.RangePicker
                                                    style={{
                                                        width: '100%'
                                                    }}
                                                    renderExtraFooter={() => 'extra footer'}
                                                    picker="month"
                                                    locale={locale}
                                                    onChange={(dates) => {
                                                        const [start3, end3] = dates;
                                                        setItemContainer({ ...itemContainer, careerStartDate3: start3.format('YYYY-MM') });
                                                        setItemContainer({ ...itemContainer, careerEndDate3: end3.format('YYYY-MM') });
                                                    }}
                                                    // value={[itemContainer?.careerStartDate3, itemContainer?.careerEndDate3]}
                                                />
                                                <Input
                                                    name="careerCompany3"
                                                    onChange={(e) => setItemContainer({ ...itemContainer, careerCompany3: e.target.value })}
                                                    addonBefore="소속"
                                                    placeholder="#소속"
                                                    value={itemContainer?.careerCompany3}
                                                />
                                                <Input
                                                    name="careerPosition3"
                                                    onChange={(e) =>
                                                        setItemContainer({ ...itemContainer, careerPosition3: e.target.value })
                                                    }
                                                    addonBefore="직책(직위)"
                                                    placeholder="#직책(직위)"
                                                    value={itemContainer?.careerPosition3}
                                                />
                                            </Space>
                                            <br />
                                            <br />
                                            <Space direction="vertical">
                                                <Input
                                                    name="career3"
                                                    onChange={(e) => setItemContainer({ ...itemContainer, career3: e.target.value })}
                                                    addonBefore="담당업무"
                                                    style={{ width: '585px' }}
                                                    placeholder="#담당업무"
                                                    value={itemContainer?.career3}
                                                />
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                
                                <Divider style={{ margin: '10px 0' }} />
                                <Row gutter={24}>
                                    <Col span={24}>
                                        <Form.Item label="보안검색경력 [4]">
                                            <Space>
                                                <DatePicker.RangePicker
                                                    style={{
                                                        width: '100%'
                                                    }}
                                                    renderExtraFooter={() => 'extra footer'}
                                                    picker="month"
                                                    locale={locale}
                                                    onChange={(dates) => {
                                                        const [start4, end4] = dates;
                                                        setItemContainer({ ...itemContainer, careerStartDate4: start4.format('YYYY-MM') });
                                                        setItemContainer({ ...itemContainer, careerEndDate4: end4.format('YYYY-MM') });
                                                    }}
                                                    // value={[itemContainer?.careerStartDate4, itemContainer?.careerEndDate4]}
                                                />
                                                <Input
                                                    name="careerCompany4"
                                                    onChange={(e) => setItemContainer({ ...itemContainer, careerCompany4: e.target.value })}
                                                    addonBefore="소속"
                                                    placeholder="#소속"
                                                    value={itemContainer?.careerCompany4}
                                                />
                                                <Input
                                                    name="careerPosition4"
                                                    onChange={(e) =>
                                                        setItemContainer({ ...itemContainer, careerPosition4: e.target.value })
                                                    }
                                                    addonBefore="직책(직위)"
                                                    placeholder="#직책(직위)"
                                                    value={itemContainer?.careerPosition4}
                                                />
                                            </Space>
                                            <br />
                                            <br />
                                            <Space direction="vertical">
                                                <Input
                                                    name="career4"
                                                    onChange={(e) => setItemContainer({ ...itemContainer, career4: e.target.value })}
                                                    addonBefore="담당업무"
                                                    style={{ width: '585px' }}
                                                    placeholder="#담당업무"
                                                    value={itemContainer?.career4}
                                                />
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                
                                <Divider style={{ margin: '10px 0' }} />
                                <Row gutter={24}>
                                    <Col span={24}>
                                        <Form.Item label="보안검색경력 [5]">
                                            <Space>
                                                <DatePicker.RangePicker
                                                    style={{
                                                        width: '100%'
                                                    }}
                                                    renderExtraFooter={() => 'extra footer'}
                                                    picker="month"
                                                    locale={locale}
                                                    onChange={(dates) => {
                                                        const [start5, end5] = dates;
                                                        setItemContainer({ ...itemContainer, careerStartDate5: start5.format('YYYY-MM') });
                                                        setItemContainer({ ...itemContainer, careerEndDate5: end5.format('YYYY-MM') });
                                                    }}
                                                    // value={[itemContainer?.careerStartDate5, itemContainer?.careerEndDate5]}
                                                />
                                                <Input
                                                    name="careerCompany5"
                                                    onChange={(e) => setItemContainer({ ...itemContainer, careerCompany5: e.target.value })}
                                                    addonBefore="소속"
                                                    placeholder="#소속"
                                                    value={itemContainer?.careerCompany5}
                                                />
                                                <Input
                                                    name="careerPosition5"
                                                    onChange={(e) =>
                                                        setItemContainer({ ...itemContainer, careerPosition5: e.target.value })
                                                    }
                                                    addonBefore="직책(직위)"
                                                    placeholder="#직책(직위)"
                                                    value={itemContainer?.careerPosition5}
                                                />
                                            </Space>
                                            <br />
                                            <br />
                                            <Space direction="vertical">
                                                <Input
                                                    name="career5"
                                                    onChange={(e) => setItemContainer({ ...itemContainer, career5: e.target.value })}
                                                    addonBefore="담당업무"
                                                    style={{ width: '585px' }}
                                                    placeholder="#담당업무"
                                                    value={itemContainer?.career5}
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
            </Drawer>
            {/* 교육생 등록 End */}

            {/* 교육생 등록 Excel Start */}
            {/* 교육생 등록 Excel End */}

            {/* 학격여부 Start */}
            <Modal
                title="합격 여부"
                closable={false}
                open={passResultModal}
                width={700}
                style={{
                    top: 90,
                    left: 130,
                    zIndex: 999
                }}
                footer={[
                    <Button
                        type="primary"
                        onClick={passResultModal_handleCancel}
                        style={{
                            width: '100px',
                            borderRadius: '5px',
                            boxShadow: '2px 3px 0px 0px #dbdbdb'
                        }}
                    >
                        Close
                    </Button>
                ]}
            >
                <h4>[{userNmValue}]</h4>
                {certificationUserList?.map((d, i) => (
                    <>
                        <Space>
                            <Card
                                title={
                                    <Space style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h3 style={{ fontSize: '16px', margin: 0 }}>
                                            {d.eduName} {d.procSeq}차
                                        </h3>
                                        {d.passYn === 'Y' ? <Tag color="green"> 합격</Tag> : <Tag color="volcano">불합격</Tag>}
                                    </Space>
                                }
                                size="small"
                                style={
                                    d.passYn === 'Y'
                                        ? { marginBottom: '20px', border: '1px solid #f50' }
                                        : { marginBottom: '20px', border: '1px solid #ccc' }
                                }
                            >
                                <Descriptions layout="vertical" bordered style={{ width: '450px', marginBottom: '15px' }}>
                                    <Descriptions.Item style={{ textAlign: 'center' }} label="XBT 평가">
                                        {d.evaluationScore}점
                                    </Descriptions.Item>
                                    <Descriptions.Item style={{ textAlign: 'center' }} label="이론 평가">
                                        {d.theoryScore}점
                                    </Descriptions.Item>
                                    <Descriptions.Item style={{ textAlign: 'center' }} label="실습 평가 ">
                                        {d.practiceScore}점
                                    </Descriptions.Item>
                                </Descriptions>
                            </Card>
                            {d.passYn === 'Y' ? (
                                <>
                                    <Button
                                        type="primary"
                                        danger
                                        onClick={() => Certificates_Print(d.userId, d.procCd, d.procSeq)}
                                        style={{ width: '160px', borderRadius: '12px', marginLeft: '10px', height: '85px' }}
                                    >
                                        이수 증명서
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button type="primary" disabled block style={{ width: '160px', marginLeft: '10px', height: '65px' }}>
                                        불합격
                                    </Button>
                                </>
                            )}
                        </Space>
                    </>
                ))}
            </Modal>
            {/* 학격여부 Excel End */}

            {/* 수료증 Print Start */}
            <Modal
                title="이수 증명서"
                closable={true}
                open={certificatesModal}
                onCancel={certificatesModal_handleCancel}
                width={730}
                height={842}
                style={{
                    top: 90,
                    left: 130,
                    zIndex: 999
                }}
                footer={
                    <div style={{ textAlign: 'right', marginTop: '20px' }}>
                        <Button type="primary" style={{ width: '160px', height: ' 60px', lineHeight: '30px' }} onClick={handlePrint}>
                            이수 증명서 출력
                        </Button>
                    </div>
                }
            >
                <div ref={contentRef}>
                    <CertificatesPrint userId_props={userId_props} procCd_props={procCd_props} procSeq_props={procSeq_props} />
                </div>
            </Modal>
            {/* 수료증 Print End */}
        </>
    );
};
