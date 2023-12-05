/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from 'react';
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
    Descriptions,
    Upload,
    Spin,
    Typography
} from 'antd';
const { Title, Paragraph, Text, Link } = Typography;

import locale from 'antd/es/date-picker/locale/ko_KR';

import excel from '../../../assets/xbt_file/File_Excel.png';

//import * as XLSX from 'xlsx';
import * as XLSX from 'xlsx-js-style';
import { saveAs } from 'file-saver';

import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
const { RangePicker } = DatePicker;

import {
    useSelectUserListMutation,
    useSelectUserMutation,
    useInsertUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useSelectUserCheckMutation,
    useSelectCertificationUserListMutation,
    useInsertStudentExcelMutation,
    useRemoveFaceApiMutation
} from '../../../hooks/api/StudentsManagement/StudentsManagement';

import {
    PlusOutlined,
    EditFilled,
    DeleteFilled,
    ExclamationCircleFilled,
    FileProtectOutlined,
    DownloadOutlined,
    UploadOutlined,
    FileExcelTwoTone
} from '@ant-design/icons';

import { CertificatesPrint } from './CertificatesPrint';

// project import
import MainCard from 'components/MainCard';
import moment from 'moment';

export const Studentinformation = () => {
    dayjs.extend(weekday);
    dayjs.extend(localeData);

    const { confirm } = Modal;
    const [form] = Form.useForm();
    const contentRef = useRef(null);

    const [dataSource, setDataSource] = useState([]); // Table 데이터 값
    const [loading, setLoading] = useState(false);
    const [excelloading, setExcelloading] = useState(false);
    const [open, setOpen] = useState(false); // Drawer 추가 우측폼 상태
    const [dataEdit, setDataEdit] = useState(false); // Drawer 수정 우측폼 상태

    const [selectedRowKeys, setSelectedRowKeys] = useState([]); //셀렉트 박스 option Selected 값
    const [userId, setUserId] = useState([]); // 선택한 교육생 아이디 값
    const [userNmValue, setUserNmValue] = useState([]); // 선택한 교육생 이름 값
    const [excelfile_base, setExcelfile_base] = useState(null); // 엑셀 파일 초기값
    const [fileVale, setFileVale] = useState(null); // 엑셀 파일 정보

    const [idChk, setIdChk] = useState(false); // 선택한 교육생 아이디 값
    const [itemContainer, setItemContainer] = useState({}); // 항목 컨테이너

    const [passResultModal, setPassResultModal] = useState(false); // 합격 여부 modal
    const [certificatesModal, setCertificatesModal] = useState(false); // 수료증(이수증) 개인 modal
    // const [certificates_corps_Modal, setCertificates_corps_Modal] = useState(false); // 수료증(이수증) 단체 modal
    const [exceluploadModal, setExceluploadModal] = useState(false); // 엑셀 업로드 modal
    const [distinct_Modal, setDistinct_Modal] = useState(false); // 엑셀 교육생 중복 modal

    const [propsItem, setPropsItem] = useState(null); // 수료증(이수증) props
    const [userId_props, setUserId_props] = useState(null); // 수료증(이수증) props

    const [distinct_student, setDistinct_Student] = useState(null); // 엑셀 업로드 중복 리스트

    const [searchval, setSearchval] = useState(null);
    // ===============================
    // Api 호출 Start
    // 조회 ======================================================
    const [SelectUserListApi] = useSelectUserListMutation(); // 교육생 정보 hooks api호출
    const handle_SelectUserList_Api = async () => {
        const SelectUserListresponse = await SelectUserListApi({
            searchval: searchval
        });
        setDataSource([
            ...SelectUserListresponse?.data?.RET_DATA.map((d, i) => ({
                key: {
                    userId: d.userId,
                    procCd: d.procCd,
                    procSeq: d.procSeq,
                    eduCode: d.eduCode
                },
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
                classType: d.classType,
                writeDate: d.writeDate,
                loginStart: d.loginStart,
                loginLast: d.loginLast,
                loginError: d.loginError,
                pwPrior: d.pwPrior,
                pwChange: d.pwChange,
                pwUpdate: d.pwUpdate,
                pwPeriod: d.pwPeriod,
                useYn: d.useYn,
                faceType: d.faceType,
                faceYn: d.faceYn,
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
            useYn: itemContainer.useYn,
            faceType: itemContainer.faceType,
            eduName: itemContainer.eduName, //                      교육과정명
            classType: itemContainer.classType, //                  반
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
        //console.log(SelectUserresponse.data.RET_DATA);
    };

    // 수정 ======================================================
    const [UpdateUserApi] = useUpdateUserMutation(); // 수정 hooks api호출
    const handel_UpdateUser_Api = async () => {
        const UpdateUserresponse = await UpdateUserApi({
            useYn: itemContainer.useYn, //                          사용여부
            faceType: itemContainer.faceType, //                    안면인식사용여부
            eduName: itemContainer.eduName, //                      교육과정명
            classType: itemContainer.classType, //                  반
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
        });
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
            userIdList: userIdList.map((row) => row[0])
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

    // 교육생 엑셀 파일 업로드
    const [InsertStudentExcelApi] = useInsertStudentExcelMutation(); // 상세 hooks api호출
    const handel_InsertStudentExcel_Api = async () => {
        let formData = new FormData();
        const params = {};
        formData.append('params', new Blob([JSON.stringify(params)], { type: 'application/json' }));
        // console.log(excelfile_base);
        formData.append('excelFile', fileVale);
        const InsertStudentExcelResponse = await InsertStudentExcelApi(formData);
        InsertStudentExcelResponse?.data?.RET_CODE === '9996' // 이미 존재하는 아이디
            ? Modal.success({
                  content: InsertStudentExcelResponse?.data?.RET_DESC,
                  onOk() {
                      setDistinct_Modal(true);
                      setDistinct_Student([
                          ...InsertStudentExcelResponse?.data?.RET_DATA.map((d, i) => ({
                              Distinct_key: d.userNo,
                              Distinct_userNo: i + 1,
                              Distinct_userId: d.userId,
                              Distinct_userNm: d.userNm
                          }))
                      ]);
                      setExceluploadModal(false);
                  }
              })
            : InsertStudentExcelResponse?.data?.RET_CODE === '0100' // 등록 완료
            ? Modal.success({
                  content: InsertStudentExcelResponse?.data?.RET_DESC,
                  onOk() {
                      handle_SelectUserList_Api();
                  }
              })
            : InsertStudentExcelResponse?.data?.RET_CODE === '0800' // 등록 에러
            ? Modal.error({
                  content: '삭제 오류',
                  onOk() {}
              })
            : '';

        // console.log(InsertStudentExcelResponse);
        setExcelloading(false);
    };
    // Api 호출 End
    // ===============================
    const distinct_columns = [
        {
            title: 'No',
            dataIndex: 'Distinct_userNo'
        },
        {
            title: '아이디',
            dataIndex: 'Distinct_userId'
        },
        {
            title: '이름',
            dataIndex: 'Distinct_userNm'
        }
    ];

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
            width: '130px',
            title: '교육생 명',
            dataIndex: 'userNm',
            sorter: (a, b) => a.userNm.length - b.userNm.length,
            ellipsis: true,
            align: 'center'
        },
        {
            title: '소속',
            dataIndex: 'company',
            align: 'center'
        },
        {
            width: '250px',
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
            title: '안면인식 사용여부',
            align: 'center',
            render: (_, { faceType }) => (
                <>
                    {faceType === 'Y' ? (
                        <Tag color={'green'} key={faceType}>
                            사용
                        </Tag>
                    ) : (
                        <Tag color={'volcano'} key={faceType}>
                            미사용
                        </Tag>
                    )}
                </>
            )
        },
        {
            title: '안면인식 등록여부',
            align: 'center',
            render: (_, { faceYn, userId }) => (
                <>
                    {faceYn === 'Y' ? (
                        <Tooltip title="안면인식 등록_삭제" color="#108ee9">
                            <Tag
                                color={'#108ee9'}
                                key={faceYn}
                                onClick={() => FaceImageRemove(userId)}
                                style={{ padding: '5px 10px', cursor: 'pointer' }}
                            >
                                등록_삭제
                            </Tag>
                        </Tooltip>
                    ) : (
                        <Tooltip title="안면인식 미등록" color={'volcano'}>
                            <Tag color={'volcano'} key={faceYn} style={{ padding: '5px 10px' }}>
                                미등록
                            </Tag>
                        </Tooltip>
                    )}
                </>
            )
        },
        {
            title: '이수증 출력 [개인]',
            align: 'center',
            render: (_, { userId, userNm }) => (
                <>
                    <Tooltip title="이수증 출력 [개인]" color="#108ee9">
                        <Button
                            type="primary"
                            onClick={() => passResultModal_handleOpen(userId, userNm)}
                            style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                            icon={<FileProtectOutlined />}
                        >
                            이수증 출력 [개인]
                        </Button>
                    </Tooltip>
                </>
            ),
            width: '160px'
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

    // 안면인식 이미지 삭제
    const [RemoveFaceApi] = useRemoveFaceApiMutation();
    const FaceImageRemove = async (userId) => {
        const RemoveFaceApiResponse = await RemoveFaceApi({
            userId: userId
        });
        // console.log('얼굴삭제 : ', RemoveFaceApiResponse?.data);
        if (RemoveFaceApiResponse?.data?.RET_CODE === '0000') {
            handle_SelectUserList_Api();
        } else {
            Modal.error({
                content: '오류가 발생했습니다.'
            });
        }
    };

    const onChange = (pagination, filters, sorter, extra) => {
        // console.log('params', pagination, filters, sorter, extra);
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
        setUserId_props(userId);
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

    // 이수증명서 Modal Opem (단체)
    const Certificates_Print_Corps = () => {
        if (selectedRowKeys == '') {
            Modal.error({
                content: '출력할 항목을 선택해주세요.'
            });
        } else {
            setPropsItem(selectedRowKeys);
            setPassResultModal(false);
            setCertificatesModal(true);
        }
    };

    // 이수증명서 Modal Opem (개인)
    const Certificates_Print = (userId, procCd, procSeq, eduCode) => {
        setPropsItem([{ userId: userId, procCd: procCd, procSeq: procSeq, eduCode: eduCode }]);
        setPassResultModal(false);
        setCertificatesModal(true);
    };

    // 이수증명서 Modal Close
    const certificatesModal_handleCancel = () => {
        setUserId_props(null);
        setPropsItem('');
        setCertificatesModal(false);
    };

    // 엑셀 업로드 교육생 중복 Modal Close
    const distinct_handleCancel = () => {
        setDistinct_Modal(false);
    };

    const onSearch = (value) => {
        setSearchval(value);
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

    // ===============================
    // 회원 엑셀 샘플 Start
    const handle_sample = () => {
        const fileName = 'xbt_member_sample.xlsx';
        const filePath = `${process.env.PUBLIC_URL}/${fileName}`;
        fetch(filePath)
            .then((response) => response.blob())
            .then((blob) => {
                saveAs(blob, fileName);
            })
            .catch((error) => {
                console.error('Error fetching or saving the file:', error);
            });
    };
    // 회원 엑셀 샘플 End
    // ===============================

    // ===============================
    // 교육생 엑셀 업로드 Start
    const handle_upload = (file_excel) => {
        const reader = new FileReader();
        reader.readAsDataURL(file_excel);
        reader.onloadend = () => {
            setExcelfile_base(reader.result);
            setFileVale(file_excel);
        };
    };

    // 엑셀파일 삭제
    const FrontRemove = () => {
        setExcelfile_base(null);
    };

    // Modal Close
    const upload_handleCancel = () => {
        setExcelfile_base(null);
        setExceluploadModal(false);
    };
    // 교육생 엑셀 업로드 End
    // ===============================

    // ===============================
    // 회원 리스트 다운로드 (검색별) Start
    const generateWorksheet = (data) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const headers = Object.keys(data[0]);
        const content = Object.keys(data);

        // header 데이터 Css적용
        for (let i = 0; i < headers.length; i++) {
            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: i });
            worksheet['!rows'] = [{ hpx: 30 }];
            worksheet['!cols'] = [];
            worksheet['!cols'][1] = { wpx: 80 };
            worksheet['!cols'][2] = { wpx: 80 };
            worksheet['!cols'][3] = { wpx: 80 };
            worksheet['!cols'][4] = { wpx: 80 };
            worksheet['!cols'][5] = { wpx: 80 };
            worksheet['!cols'][6] = { wpx: 110 };
            worksheet['!cols'][7] = { wpx: 110 };
            worksheet['!cols'][8] = { wpx: 150 };
            worksheet['!cols'][9] = { wpx: 230 };
            worksheet['!cols'][10] = { wpx: 95 };
            worksheet['!cols'][11] = { wpx: 95 };
            worksheet['!cols'][12] = { wpx: 95 };
            worksheet['!cols'][14] = { wpx: 95 };
            worksheet['!cols'][15] = { wpx: 95 };
            worksheet['!cols'][16] = { wpx: 95 };

            worksheet[cellAddress].s = {
                font: { sz: 10, bold: true, color: { rgb: 'ffffff' } },
                fill: { fgColor: { rgb: '000000' } },
                alignment: { horizontal: 'center', vertical: 'center' },
                border: { left: { style: 'thin', color: { rgb: 'ffffff' } } }
            };
        }

        // body 데이터 Css적용
        const allBordersStyle = {
            style: 'thin',
            color: { rgb: '000000' }
        };

        for (let r = 1; r <= data.length; r++) {
            for (let c = 0; c < headers.length; c++) {
                const cellAddress = XLSX.utils.encode_cell({ r: r, c: c });
                worksheet[cellAddress].s = {
                    hpx: 80,
                    font: { sz: 10 },
                    alignment: { horizontal: 'center', vertical: 'center' },
                    border: {
                        top: allBordersStyle,
                        bottom: allBordersStyle,
                        right: allBordersStyle,
                        left: allBordersStyle
                    }
                };
            }
        }

        return worksheet;
    };

    const searchData = dataSource.map((d, i) => ({
        번호: i + 1,
        아이디: d.userId,
        이름: d.userNm,
        소속: d.company,
        부서: d.dept,
        직급: d.position,
        전화번호: d.telNo,
        휴대폰번호: d.hpNo,
        이메일: d.email,
        교육명: d.eduName,
        등록일자: d.writeDate,
        최초로그인: d.loginStart,
        마지막로그인: d.loginLast,
        사용여부: d.useYn,
        등록자: d.insertId,
        수정자: d.updateId,
        수정일자: d.updateDate
    }));

    const handle_download = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const down_fileName = `member_list_${year}${month}${day}.xlsx`;

        // const worksheet = XLSX.utils.json_to_sheet(searchData);
        const worksheet = generateWorksheet(searchData);

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'XBT MEMBER LIST');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, down_fileName);
    };
    // 회원 리스트 다운로드 (검색별) End
    // ===============================

    useEffect(() => {
        setLoading(true);
        handle_SelectUserList_Api();
    }, [searchval]);

    return (
        <>
            <MainCard title="교육생 정보조회">
                <Typography variant="body1">
                    <Row gutter={[8, 8]} style={{ marginBottom: 16 }}>
                        <Col span={10}>
                            <div style={{ display: 'flex', justifyContent: 'flex-start', fontSize: '14px' }}>
                                <Input.Search
                                    placeholder="※ 통합 검색 (교육생ID, 교육생명, 기관, 부서, 직위, 교육구분, 입교신청일)"
                                    style={{ width: 483 }}
                                    onSearch={onSearch}
                                    allowClear
                                    enterButton
                                    size="middle"
                                    className="custom-search-input"
                                />
                            </div>
                        </Col>
                        <Col span={14} style={{ textAlign: 'right' }}>
                            <Space>
                                {window.localStorage.getItem('authCd') === '0000' ? (
                                    <>
                                        <Tooltip title="교육생 다중 추가 샘플">
                                            <Button
                                                type="default"
                                                onClick={() => handle_sample()}
                                                style={{
                                                    borderRadius: '5px',
                                                    boxShadow: '2px 3px 0px 0px #dbdbdb',
                                                    borderColor: '#4da462',
                                                    backgroundColor: '#4da462',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    color: '#ffffff'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.color = '#1677ff';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.color = '#ffffff';
                                                }}
                                            >
                                                <img src={excel} alt="Excel Icon" style={{ marginRight: '8px', width: '35px' }} />
                                                Member Sample
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title="교육생 다중 추가 업로드">
                                            <Button
                                                type="default"
                                                onClick={() => setExceluploadModal(true)}
                                                style={{
                                                    borderRadius: '5px',
                                                    boxShadow: '2px 3px 0px 0px #dbdbdb',
                                                    borderColor: '#4da462',
                                                    backgroundColor: '#4da462',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    color: '#ffffff'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.color = '#1677ff';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.color = '#ffffff';
                                                }}
                                            >
                                                <img src={excel} alt="Excel Icon" style={{ marginRight: '8px', width: '35px' }} />
                                                Member Upload
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title="교육생 리스트 다운로드 [검색별]">
                                            <Button
                                                type="default"
                                                onClick={handle_download}
                                                style={{
                                                    borderRadius: '5px',
                                                    boxShadow: '2px 3px 0px 0px #dbdbdb',
                                                    borderColor: '#4da462',
                                                    backgroundColor: '#4da462',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    color: '#ffffff'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.color = '#1677ff';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.color = '#ffffff';
                                                }}
                                            >
                                                <img src={excel} alt="Excel Icon" style={{ marginRight: '8px', width: '35px' }} />
                                                Member List Download
                                            </Button>
                                        </Tooltip>
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
                                                type="primary"
                                                danger
                                                onClick={handleDel}
                                                style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                                icon={<DeleteFilled />}
                                            >
                                                삭제
                                            </Button>
                                        </Tooltip>
                                    </>
                                ) : (
                                    ''
                                )}
                            </Space>
                        </Col>
                    </Row>
                    <Row gutter={[8, 8]} style={{ marginBottom: 20 }}>
                        <Col></Col>
                        <Col span={24} style={{ textAlign: 'right' }}>
                            <Tooltip title="이수증 출력(선택된 교육생)">
                                <Button
                                    type="primary"
                                    onClick={() => Certificates_Print_Corps()}
                                    style={{ borderRadius: '5px', padding: '0px 20px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                    icon={<FileProtectOutlined />}
                                >
                                    이수증 출력(선택된 교육생)
                                </Button>
                            </Tooltip>
                        </Col>
                    </Row>
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
                extra={
                    <>
                        <Space style={{ marginTop: '120px' }}>
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
                        {/* {idChk ? ( */}
                        <Row gutter={24}>
                            <Col span={12}>
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
                                        value={itemContainer?.useYn === 'Y' ? 'Y' : 'N'}
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
                            <Col span={12}>
                                <Form.Item
                                    label="안면인식 사용여부"
                                    rules={[
                                        {
                                            required: true,
                                            message: '안면인식 사용여부'
                                        }
                                    ]}
                                    initialValue={itemContainer?.faceType}
                                >
                                    <Radio.Group
                                        name="faceType"
                                        onChange={(e) => setItemContainer({ ...itemContainer, faceType: e.target.value })}
                                        buttonStyle="solid"
                                        value={itemContainer?.faceType === 'Y' ? 'Y' : 'N'}
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
                        {/* ) : ( '' )} */}
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    label={
                                        <span style={{ fontSize: '15px' }}>
                                            <span style={{ color: 'red', paddingRight: '5px' }}>*</span>교육과정명
                                        </span>
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message: '교육과정명'
                                        }
                                    ]}
                                    initialValue={itemContainer?.eduName}
                                >
                                    <Space direction="vertical">
                                        <Select
                                            name="eduName"
                                            defaultValue={[{ label: '# 교육과정', value: '0' }]}
                                            style={{ width: '280px' }}
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
                                                },
                                                {
                                                    label: '항공보안검색 감독자 초기 교육 [2일/16시간]',
                                                    value: '7'
                                                },
                                                {
                                                    label: '항공보안검색 감독자 정기 교육 [1일/8시간]',
                                                    value: '8'
                                                },
                                                {
                                                    label: '항공보안경비 감독자 초기 교육 [2일/16시간]',
                                                    value: '9'
                                                },
                                                {
                                                    label: '항공보안경비 감독자 정기 교육 [1일/8시간]',
                                                    value: '10'
                                                },
                                                {
                                                    label: '공항/항공사 보안 정기 교육 [2일/16시간]',
                                                    value: '11'
                                                },
                                                {
                                                    label: '감독자·책임자 초기 교육 [1일/8시간]',
                                                    value: '12'
                                                },
                                                {
                                                    label: '행동탐지요원 초기 교육 [2일/16시간]',
                                                    value: '13'
                                                },
                                                {
                                                    label: '행동탐지요원 정기 교육 [1일/8시간]',
                                                    value: '14'
                                                }
                                            ]}
                                        />

                                        {itemContainer?.eduName > 3 ? (
                                            <Select
                                                name="classType"
                                                defaultValue={[{ label: '# Class', value: '0' }]}
                                                style={{
                                                    width: '280px'
                                                }}
                                                onChange={(e) => setItemContainer({ ...itemContainer, classType: e })}
                                                value={itemContainer?.classType}
                                                options={[
                                                    {
                                                        label: 'A반',
                                                        value: 'A'
                                                    },
                                                    {
                                                        label: 'B반',
                                                        value: 'B'
                                                    }
                                                ]}
                                            />
                                        ) : (
                                            ''
                                        )}
                                    </Space>
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
                                        locale={locale}
                                        name="writeDate"
                                        onChange={(date) => {
                                            setItemContainer({ ...itemContainer, writeDate: date.format('YYYY-MM-DD') });
                                        }}
                                        placeholder="입교신청일"
                                        style={{
                                            width: '100%'
                                        }}
                                        value={
                                            itemContainer?.writeDate
                                                ? dayjs(itemContainer.writeDate)
                                                : setItemContainer({ ...itemContainer, writeDate: dayjs(new Date()).format('YYYY-MM-DD') })
                                        }
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />
                        {/* <Row gutter={24}>
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
                        <Divider style={{ margin: '10px 0' }} /> */}
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
                        <Divider style={{ margin: '10px 0' }} /> */}
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
                                        locale={locale}
                                        name="birthDay"
                                        onChange={(date) => {
                                            setItemContainer({
                                                ...itemContainer,
                                                birthDay: date.format('YYYY-MM-DD')
                                            });
                                        }}
                                        value={itemContainer?.birthDay ? dayjs(itemContainer.birthDay) : dayjs(new Date())}
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
                                        onChange={(e) => setItemContainer({ ...itemContainer, registNumber: e.target.value })}
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
                        {/* <Divider style={{ margin: '10px 0' }} />
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
                        </Row> */}
                        <Divider style={{ margin: '10px 0' }} />
                        <Row gutter={24}>
                            <Col span={12}>
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
                                        placeholder="휴대폰번호"
                                        // onChange={(e) => setItemContainer({ ...itemContainer, hpNo: e.target.value })}
                                        onChange={(e) => handlePhoneNumberChange('hpNo', e.target.value)}
                                        value={itemContainer?.hpNo}
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
                    <Divider style={{ margin: '10px 0' }} /> */}
                    {/* <Card>
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
                                                setItemContainer({
                                                    ...itemContainer,
                                                    militaryEndDate: dates[1],
                                                    ...itemContainer,
                                                    militaryStartDate: dates[0]
                                                });
                                            }}
                                            value={[
                                                itemContainer?.militaryStartDate ? dayjs(itemContainer.militaryStartDate) : '',
                                                itemContainer?.militaryEndDate ? dayjs(itemContainer.militaryEndDate) : ''
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
                    <Divider style={{ margin: '10px 0' }} /> */}
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
                                                    renderExtraFooter={() => 'extra footer'}
                                                    picker="month"
                                                    locale={locale}
                                                    onChange={(dates) => {
                                                        setItemContainer({
                                                            ...itemContainer,
                                                            careerEndDate1: dates[1],
                                                            ...itemContainer,
                                                            careerStartDate1: dates[0]
                                                        });
                                                    }}
                                                    value={[
                                                        itemContainer?.careerStartDate1 ? dayjs(itemContainer.careerStartDate1) : '',
                                                        itemContainer?.careerEndDate1 ? dayjs(itemContainer.careerEndDate1) : ''
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
                                                            careerEndDate2: dates[1],
                                                            ...itemContainer,
                                                            careerStartDate2: dates[0]
                                                        });
                                                    }}
                                                    value={[
                                                        itemContainer?.careerStartDate2 ? dayjs(itemContainer.careerStartDate2) : '',
                                                        itemContainer?.careerEndDate2 ? dayjs(itemContainer.careerEndDate2) : ''
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
                                        onClick={() => Certificates_Print(d.userId, d.procCd, d.procSeq, d.eduCode)}
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
                width={600}
                height={600}
                style={{
                    top: 90,
                    left: 130,
                    zIndex: 999
                }}
                // footer={[
                //     <div style={{ textAlign: 'right', marginTop: '20px' }}>
                //         <Button
                //             type="primary"
                //             style={{ width: '160px', height: ' 60px', lineHeight: '30px' }}
                //             // onClick={handlePrint}
                //         >
                //             이수 증명서 출력
                //         </Button>
                //     </div>
                // ]}
                footer={''}
            >
                <div
                    ref={contentRef}
                    style={{
                        maxWidth: window.innerWidth,
                        maxHeight: window.innerHeight - 200, // 원하는 최대 높이로 설정
                        overflowY: 'auto' // 수직 스크롤바 추가
                    }}
                >
                    <CertificatesPrint Corps_props={propsItem} />
                </div>
            </Modal>
            {/* 수료증 Print End */}

            {/* 교육생 Excel Start */}
            <Modal
                title="교육생 Excel 업로드"
                closable={true}
                open={exceluploadModal}
                onCancel={upload_handleCancel}
                width={700}
                height={802}
                style={{
                    top: 90,
                    left: 130,
                    zIndex: 999
                }}
                footer={null}
            >
                {/* <Spin loading={excelloading}> */}
                <Row gutter={[100, 24]}>
                    <Col span={12}>
                        <Space direction="vertical">
                            <Upload maxCount={1} customRequest={({ file }) => handle_upload(file)} showUploadList={false}>
                                <Button
                                    accept=".xlsx, .xls"
                                    type="text"
                                    style={{
                                        width: '320px',
                                        height: '40px',
                                        padding: '10px',
                                        backgroundColor: '#f0f0f0',
                                        marginBottom: '10px'
                                    }}
                                    icon={<UploadOutlined />}
                                >
                                    교육생 Excel 찾기...
                                </Button>
                            </Upload>
                            {excelfile_base === null ? (
                                ''
                            ) : (
                                <>
                                    <Space
                                        style={{
                                            width: '100%',
                                            justifyContent: 'space-between',
                                            border: '1px solid #f39898',
                                            padding: '3px 5px'
                                        }}
                                    >
                                        <span>{fileVale?.name}</span>
                                        <Button onClick={FrontRemove} type="text">
                                            <DeleteFilled />
                                            삭제
                                        </Button>
                                    </Space>
                                </>
                            )}
                        </Space>
                    </Col>
                    <Col span={12}>
                        {excelfile_base === null ? (
                            ''
                        ) : (
                            <Button
                                type="primary"
                                style={{
                                    width: '250px',
                                    height: '100px',
                                    padding: '10px',
                                    marginBottom: '10px'
                                }}
                                icon={<UploadOutlined />}
                                onClick={() => handel_InsertStudentExcel_Api()}
                            >
                                Excel Upload
                            </Button>
                        )}
                    </Col>
                </Row>
                {/* </Spin> */}
            </Modal>
            {/* 교육생 Excel End */}

            {/* Excel 업로드 교육생 중복 리스트 Start */}
            <Modal
                title="교육생 중복 리스트"
                closable={true}
                open={distinct_Modal}
                onCancel={distinct_handleCancel}
                width={700}
                height={802}
                style={{
                    top: 90,
                    left: 130,
                    zIndex: 999
                }}
                footer={null}
            >
                <Paragraph>
                    <pre>
                        ※ 중복된 교육생은 <Text strong>"수정"</Text> 에서 <Text strong>"교육과정명"</Text>을 변경하시기 바랍니다.
                    </pre>
                </Paragraph>
                {distinct_Modal ? <Table columns={distinct_columns} dataSource={distinct_student} size="middle" /> : ''}
            </Modal>
            {/* Excel 업로드 교육생 중복 리스트 End */}
        </>
    );
};
