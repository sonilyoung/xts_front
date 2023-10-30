/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { Typography, Table, Tag, Tooltip, Button, Descriptions, Modal, Input, Space, Row, Col, Card } from 'antd';
import {
    useSelectBaselineUserListMutation,
    useSelectBaselineUserMutation,
    useUpdateBaselineUserMutation
} from '../../../hooks/api/StudentsManagement/StudentsManagement';
import excel from '../../../assets/xbt_file/File_Excel.png';
import { PlusOutlined, DeleteFilled, FileProtectOutlined, AudioOutlined } from '@ant-design/icons';

import * as XLSX from 'xlsx-js-style';
import { saveAs } from 'file-saver';

const { Title } = Typography;
const { Search } = Input;
const suffix = (
    <AudioOutlined
        style={{
            fontSize: 16,
            color: '#1677ff'
        }}
    />
);
// project import
import MainCard from 'components/MainCard';

export const Teacherstudent = () => {
    const { confirm } = Modal;
    const [dataSource, setDataSource] = useState([]); // Table 데이터 값
    const [loading, setLoading] = useState(false);
    const [practiceScoreValue, setPracticeScoreValue] = useState(null); // 실습 점수
    const [practiceHumanScoreValue, setPracticeHumanScoreValue] = useState(null); // 대인 점수
    const [practiceCarScoreValue, setPracticeCarScoreValue] = useState(null); // 차량 점수
    const [procCdChk, setProcCdChk] = useState(''); // 차수 코드
    const [userIdChk, setUserIdChk] = useState(''); // 교육생 아이디
    const [eduCd, setEduCd] = useState(''); // 교육 코드

    const [evalOpen, setEvalOpen] = useState(false);
    const [searchval, setSearchval] = useState();

    // ===============================
    // Api 호출 Start
    // 조회 ======================================================
    const [SelectBaselineUserListApi] = useSelectBaselineUserListMutation(); // 교육생 정보 hooks api호출
    const handle_SelectBaselineUserList_Api = async () => {
        const SelectBaselineUserListResponse = await SelectBaselineUserListApi({
            searchval: searchval
        });
        setDataSource([
            ...SelectBaselineUserListResponse?.data?.RET_DATA.map((d, i) => ({
                key: i,
                userNo: i + 1,
                procCd: d.procCd, //차수시퀀스
                procYear: d.procYear, //차수년도
                procSeq: d.procSeq, //차수
                procNm: d.procNm, //차수명
                userId: d.userId,
                userNm: d.userNm,
                compNm: d.compNm, //회사명
                gainScore: d.gainScore, //총 획득점수
                passYn: d.passYn, //합격 불합격 여부 (Y 합격 N 불합격 ING 진행중)
                eduCode: d.eduCode,
                eduName: d.eduName,
                eduStartDate: d.eduStartDate, //교육시작일
                eduEndDate: d.eduEndDate, //교육종료일
                endingYn: d.endingYn //완료여부 (Y 완료 N 미완료 ING 진행중)
            }))
        ]);
        setLoading(false);
    };

    // 평가 가중치 팝업 정보조회 ======================================================
    const [SelectBaselineUserApi] = useSelectBaselineUserMutation(); // 교육생 정보 hooks api호출
    const [evaluationInfoData, setEvaluationInfoData] = useState(); // XBT 평가 정보
    const [theoryInfoData, setTheoryInfoData] = useState(); // 이론 평가 정보
    const [practiceInfoData, setPracticeInfoData] = useState(); // 실습 평가 정보

    const handle_SelectBaselineUser_Api = async (procCd, userId) => {
        const SelectBaselineUserResponse = await SelectBaselineUserApi({
            procCd: procCd,
            userId: userId
        });
        setEvaluationInfoData(SelectBaselineUserResponse?.data?.RET_DATA?.evaluationInfo);
        setTheoryInfoData(SelectBaselineUserResponse?.data?.RET_DATA?.theoryInfo);
        setPracticeInfoData(SelectBaselineUserResponse?.data?.RET_DATA?.practiceInfo);
    };

    // 교육생 실기점수 업데이트  ======================================================
    const [UpdateBaselineUserApi] = useUpdateBaselineUserMutation(); // 교육생 정보 hooks api호출
    const handle_UpdateBaselineUser_Api = async () => {
        const UpdateBaselineUserResponse = await UpdateBaselineUserApi({
            procCd: procCdChk,
            userId: userIdChk,
            practiceScore: practiceScoreValue === null ? '0' : practiceScoreValue, // 실습 점수
            practiceHumanScore: practiceHumanScoreValue, // 대인 점수
            practiceCarScore: practiceCarScoreValue // 차량 점수
        });
        if (UpdateBaselineUserResponse?.data?.RET_CODE === '0100') {
            Modal.success({
                content: '실습 점수 저장 완료',
                onOk() {
                    handle_SelectBaselineUser_Api(procCdChk, userIdChk);
                    handle_SelectBaselineUserList_Api();
                }
            });
        } else {
            Modal.error({
                content: UpdateBaselineUserResponse?.data?.RET_DESC,
                onOk() {}
            });
        }
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
            width: '110px',
            title: '차수',
            dataIndex: 'procSeq',
            sorter: (a, b) => a.procSeq - b.procSeq,
            ellipsis: true,
            align: 'center',
            render: (_, { procYear, procSeq }) => <>{`${procYear}년 - ${procSeq}차`}</>
        },
        {
            width: '210px',
            title: '차수명',
            dataIndex: 'procNm',
            sorter: (a, b) => a.procNm.localeCompare(b.procNm, 'ko', { sensitivity: 'base' }),
            ellipsis: true,
            align: 'center'
        },
        {
            width: '120px',
            title: '교육생 ID',
            dataIndex: 'userId',
            sorter: (a, b) => a.userId.localeCompare(b.userId, 'ko', { sensitivity: 'base' }),
            ellipsis: true,
            align: 'center'
        },
        {
            width: '120px',
            title: '교육생 명',
            dataIndex: 'userNm',
            sorter: (a, b) => a.userNm.localeCompare(b.userNm, 'ko', { sensitivity: 'base' }),
            ellipsis: true,
            align: 'center'
        },
        {
            title: '교육 구분',
            dataIndex: 'eduName',
            sorter: (a, b) => a.userNm.localeCompare(b.eduName, 'ko', { sensitivity: 'base' }),
            ellipsis: true,
            align: 'center'
        },
        {
            title: '기관',
            dataIndex: 'compNm',
            ellipsis: true,
            align: 'center'
        },
        {
            width: '100px',
            title: '평가 가중치',
            dataIndex: 'gainScore',
            align: 'center',
            render: (_, { gainScore, procCd, userId, eduCode }) => (
                <>
                    <Space>
                        <Tooltip title="평가 가중치" color="#108ee9">
                            <Button
                                type="primary"
                                style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                icon={<FileProtectOutlined />}
                                onClick={() => handle_Score(procCd, userId, eduCode)}
                            >
                                {gainScore === '0' || gainScore === null || gainScore === undefined ? '0' : gainScore}
                            </Button>
                        </Tooltip>
                    </Space>
                </>
            )
        },
        {
            width: '100px',
            title: '학격여부',
            align: 'center',
            render: (_, { passYn }) => (
                <>
                    {passYn === 'Y' ? (
                        <Tag color="#2db7f5" style={{ padding: '5px 12px', borderRadius: '5px' }}>
                            합격
                        </Tag>
                    ) : passYn === 'N' ? (
                        <Tag color="#f50" style={{ padding: '5px 12px', borderRadius: '5px' }}>
                            불합격
                        </Tag>
                    ) : passYn === 'ING' ? (
                        <Tag color="#108ee9" style={{ padding: '5px 12px', borderRadius: '5px' }}>
                            진행중
                        </Tag>
                    ) : (
                        <Tag>-</Tag>
                    )}
                </>
            )
        },
        {
            width: '200px',
            title: '교육일',
            align: 'center',
            dataIndex: 'eduStartDate',
            render: (_, { eduStartDate, eduEndDate }) => (
                <div>
                    {eduStartDate} ~ {eduEndDate}
                </div>
            )
        },
        {
            width: '110px',
            title: '교육완료여부',
            dataIndex: 'useYn',
            align: 'center',
            render: (_, { endingYn }) => (
                <>
                    {endingYn === 'Y' ? (
                        <Tag color="#2db7f5" style={{ padding: '5px 12px', borderRadius: '5px' }}>
                            완료
                        </Tag>
                    ) : endingYn === 'N' ? (
                        <Tag color="#f50" style={{ padding: '5px 12px', borderRadius: '5px' }}>
                            미완료
                        </Tag>
                    ) : endingYn === 'ING' ? (
                        <Tag color="#108ee9" style={{ padding: '5px 12px', borderRadius: '5px' }}>
                            교육중
                        </Tag>
                    ) : (
                        <Tag>-</Tag>
                    )}
                </>
            )
        }
    ];

    const handle_Score = (procCd, userId, eduCode) => {
        setProcCdChk(procCd);
        setUserIdChk(userId);
        setEduCd(eduCode);
        handle_SelectBaselineUser_Api(procCd, userId);
        setEvalOpen(true);
    };

    const handel_practiceScore = () => {
        handle_UpdateBaselineUser_Api();
    };

    // Modal 닫기
    const handleCancel = () => {
        setEvalOpen(false);
        setPracticeScoreValue(null);
    };

    const onChange = (pagination, filters, sorter, extra) => {
        //console.log('params', pagination, filters, sorter, extra);
        //setSortedInfo(sorter);
    };

    const onSearch = (value) => {
        setSearchval(value);
    };

    // ===============================
    // 교육생 인증평가표 다운로드(검색조건) Start
    const handle_cer_down = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const down_fileName = `certification_evaluation_${year}${month}${day}.xlsx`;
        const headers = ['번호', '소속', '성명', '이론점수', '실기점수', '평가결과'];

        // body 데이터 Css적용
        const allBordersStyle = {
            style: 'thin',
            color: { rgb: '000000' }
        };

        // body 데이터 Css적용
        const allBordersStyle_2 = {
            style: 'medium',
            color: { rgb: '000000' }
        };

        const data = [
            [
                {
                    v: '자격 인증평가결과 총괄표',
                    s: {
                        font: { sz: 18, bold: true, name: 'HY헤드라인M' },
                        alignment: { horizontal: 'center', vertical: 'center' }
                    }
                }
            ],
            [],
            [
                {
                    v: '○ 자격인증 : 제1 차 항공경비초기 인증평가',
                    s: {
                        font: { sz: 13, bold: true, name: '굴림' },
                        alignment: { vertical: 'center' }
                    }
                }
            ],
            [
                {
                    v: `○ 평가일자 : ${year}. ${month}. ${day}`,
                    s: {
                        font: { sz: 13, bold: true, name: '굴림' },
                        alignment: { vertical: 'center' }
                    }
                }
            ],
            [
                {
                    v: '○ 평가장소 : 한국보안인재개발원',
                    s: {
                        font: { sz: 13, bold: true, name: '굴림' },
                        alignment: { vertical: 'center' }
                    }
                }
            ],
            [],
            [
                {
                    v: '○ 평가결과 확인',
                    s: {
                        font: { sz: 13, bold: true, name: '굴림' },
                        alignment: { vertical: 'center' }
                    }
                }
            ],
            [
                {
                    v: '구분',
                    s: {
                        font: { sz: 11, bold: true, bold: true, name: '굴림', color: { rgb: '000000' } },
                        fill: { fgColor: { rgb: 'e3e3e3' } },
                        alignment: { horizontal: 'center', vertical: 'center' },
                        border: {
                            top: allBordersStyle,
                            bottom: allBordersStyle,
                            right: allBordersStyle,
                            left: allBordersStyle
                        }
                    }
                },
                {
                    v: '소속',
                    s: {
                        font: { sz: 11, bold: true, bold: true, name: '굴림', color: { rgb: '000000' } },
                        fill: { fgColor: { rgb: 'e3e3e3' } },
                        alignment: { horizontal: 'center', vertical: 'center' },
                        border: {
                            top: allBordersStyle,
                            bottom: allBordersStyle,
                            right: allBordersStyle,
                            left: allBordersStyle
                        }
                    }
                },
                {
                    v: '성명',
                    s: {
                        font: { sz: 11, bold: true, bold: true, name: '굴림', color: { rgb: '000000' } },
                        fill: { fgColor: { rgb: 'e3e3e3' } },
                        alignment: { horizontal: 'center', vertical: 'center' },
                        border: {
                            top: allBordersStyle,
                            bottom: allBordersStyle,
                            right: allBordersStyle,
                            left: allBordersStyle
                        }
                    }
                },
                {
                    v: '',
                    s: {
                        font: { sz: 11, bold: true, bold: true, name: '굴림', color: { rgb: '000000' } },
                        fill: { fgColor: { rgb: 'e3e3e3' } },
                        alignment: { horizontal: 'center', vertical: 'center' },
                        border: {
                            top: allBordersStyle,
                            bottom: allBordersStyle,
                            right: allBordersStyle,
                            left: allBordersStyle
                        }
                    }
                },
                {
                    v: '서명',
                    s: {
                        font: { sz: 11, bold: true, bold: true, name: '굴림', color: { rgb: '000000' } },
                        fill: { fgColor: { rgb: 'e3e3e3' } },
                        alignment: { horizontal: 'center', vertical: 'center' },
                        border: {
                            top: allBordersStyle,
                            bottom: allBordersStyle,
                            right: allBordersStyle,
                            left: allBordersStyle
                        }
                    }
                },
                {
                    v: '',
                    s: {
                        font: { sz: 11, bold: true, bold: true, name: '굴림', color: { rgb: '000000' } },
                        fill: { fgColor: { rgb: 'e3e3e3' } },
                        alignment: { horizontal: 'center', vertical: 'center' },
                        border: {
                            top: allBordersStyle,
                            bottom: allBordersStyle,
                            right: allBordersStyle,
                            left: allBordersStyle
                        }
                    }
                }
            ],
            [
                {
                    v: '평가관',
                    s: {
                        font: { sz: 12, bold: true, name: '굴림' },
                        alignment: { horizontal: 'center', vertical: 'center' },
                        border: {
                            top: allBordersStyle,
                            bottom: allBordersStyle,
                            right: allBordersStyle,
                            left: allBordersStyle
                        }
                    }
                },
                {
                    v: '한국보안인재개발원 교수',
                    s: {
                        font: { sz: 12, bold: true, name: '굴림' },
                        alignment: { horizontal: 'center', vertical: 'center' },
                        border: {
                            top: allBordersStyle,
                            bottom: allBordersStyle,
                            right: allBordersStyle
                        }
                    }
                },
                {
                    v: '',
                    s: {
                        font: { sz: 12, bold: true, name: '굴림' },
                        alignment: { horizontal: 'center', vertical: 'center' },
                        border: {
                            top: allBordersStyle,
                            bottom: allBordersStyle,
                            right: allBordersStyle
                        }
                    }
                },
                {
                    v: '',
                    s: {
                        font: { sz: 12, bold: true, name: '굴림' },
                        alignment: { horizontal: 'center', vertical: 'center' },
                        border: {
                            top: allBordersStyle,
                            bottom: allBordersStyle,
                            right: allBordersStyle
                        }
                    }
                },
                {
                    v: '',
                    s: {
                        font: { sz: 12, bold: true, name: '굴림' },
                        alignment: { horizontal: 'center', vertical: 'center' },
                        border: {
                            top: allBordersStyle,
                            bottom: allBordersStyle,
                            right: allBordersStyle
                        }
                    }
                },
                {
                    v: '',
                    s: {
                        font: { sz: 12, bold: true, name: '굴림' },
                        alignment: { horizontal: 'center', vertical: 'center' },
                        border: {
                            top: allBordersStyle,
                            bottom: allBordersStyle,
                            right: allBordersStyle
                        }
                    }
                }
            ],
            [
                {
                    v: '입회관',
                    s: {
                        font: { sz: 12, bold: true, name: '굴림' },
                        alignment: { horizontal: 'center', vertical: 'center' },
                        border: {
                            top: allBordersStyle,
                            bottom: allBordersStyle,
                            right: allBordersStyle,
                            left: allBordersStyle
                        }
                    }
                },
                {
                    v: '국토교통부 항공보안감독관',
                    s: {
                        font: { sz: 12, bold: true, name: '굴림' },
                        alignment: { horizontal: 'center', vertical: 'center' },
                        border: {
                            top: allBordersStyle,
                            bottom: allBordersStyle,
                            right: allBordersStyle,
                            left: allBordersStyle
                        }
                    }
                },
                {
                    v: '',
                    s: {
                        font: { sz: 12, bold: true, name: '굴림' },
                        alignment: { horizontal: 'center', vertical: 'center' },
                        border: {
                            top: allBordersStyle,
                            bottom: allBordersStyle,
                            right: allBordersStyle,
                            left: allBordersStyle
                        }
                    }
                },
                {
                    v: '',
                    s: {
                        font: { sz: 12, bold: true, name: '굴림' },
                        alignment: { horizontal: 'center', vertical: 'center' },
                        border: {
                            top: allBordersStyle,
                            bottom: allBordersStyle,
                            right: allBordersStyle,
                            left: allBordersStyle
                        }
                    }
                },
                {
                    v: '',
                    s: {
                        font: { sz: 12, bold: true, name: '굴림' },
                        alignment: { horizontal: 'center', vertical: 'center' },
                        border: {
                            top: allBordersStyle,
                            bottom: allBordersStyle,
                            right: allBordersStyle,
                            left: allBordersStyle
                        }
                    }
                },
                {
                    v: '',
                    s: {
                        font: { sz: 12, bold: true, name: '굴림' },
                        alignment: { horizontal: 'center', vertical: 'center' },
                        border: {
                            top: allBordersStyle,
                            bottom: allBordersStyle,
                            right: allBordersStyle,
                            left: allBordersStyle
                        }
                    }
                }
            ],
            [],
            [
                {
                    v: '○ 인증평가 결과',
                    s: {
                        font: { sz: 13, bold: true, name: '굴림' },
                        alignment: { vertical: 'center' }
                    }
                }
            ],
            [
                {
                    v: `평가인원  ${dataSource.length} 명,        합격     명,        불합격     명`,
                    s: {
                        font: { sz: 12, bold: true, name: '굴림' },
                        alignment: { horizontal: 'center', vertical: 'center' },
                        border: {
                            top: allBordersStyle,
                            bottom: allBordersStyle,
                            right: allBordersStyle,
                            left: allBordersStyle
                        }
                    }
                },
                {
                    v: '',
                    s: {
                        border: {
                            top: allBordersStyle,
                            bottom: allBordersStyle,
                            right: allBordersStyle,
                            left: allBordersStyle
                        }
                    }
                },
                {
                    v: '',
                    s: {
                        border: {
                            top: allBordersStyle,
                            bottom: allBordersStyle,
                            right: allBordersStyle,
                            left: allBordersStyle
                        }
                    }
                },
                {
                    v: '',
                    s: {
                        border: {
                            top: allBordersStyle,
                            bottom: allBordersStyle,
                            right: allBordersStyle,
                            left: allBordersStyle
                        }
                    }
                },
                {
                    v: '',
                    s: {
                        border: {
                            top: allBordersStyle,
                            bottom: allBordersStyle,
                            right: allBordersStyle,
                            left: allBordersStyle
                        }
                    }
                },
                {
                    v: '',
                    s: {
                        border: {
                            top: allBordersStyle,
                            bottom: allBordersStyle,
                            right: allBordersStyle,
                            left: allBordersStyle
                        }
                    }
                }
            ],
            headers
        ];

        dataSource.forEach((item, index) => {
            data.push([
                {
                    v: index + 1,
                    s: {
                        font: { sz: 11, bold: true, name: '굴림' },
                        alignment: { horizontal: 'center', vertical: 'center' },
                        border: {
                            top: allBordersStyle,
                            bottom: allBordersStyle,
                            right: allBordersStyle,
                            left: allBordersStyle
                        }
                    }
                },
                {
                    v: item.compNm,
                    s: {
                        font: { sz: 11, bold: true, name: '굴림' },
                        alignment: { horizontal: 'center', vertical: 'center' },
                        border: {
                            top: allBordersStyle,
                            bottom: allBordersStyle,
                            right: allBordersStyle,
                            left: allBordersStyle
                        }
                    }
                },
                {
                    v: item.userNm,
                    s: {
                        font: { sz: 11, bold: true, name: '굴림' },
                        alignment: { horizontal: 'center', vertical: 'center' },
                        border: {
                            top: allBordersStyle,
                            bottom: allBordersStyle,
                            right: allBordersStyle,
                            left: allBordersStyle
                        }
                    }
                },
                {
                    v: item.theoryScore === undefined ? 0 : item.theoryScore,
                    s: {
                        font: { sz: 11, bold: true, name: '굴림' },
                        alignment: { horizontal: 'center', vertical: 'center' },
                        border: {
                            top: allBordersStyle,
                            bottom: allBordersStyle,
                            right: allBordersStyle,
                            left: allBordersStyle
                        }
                    }
                },
                {
                    v: item.practiceScore === undefined ? 0 : item.practiceScore,
                    s: {
                        font: { sz: 11, bold: true, name: '굴림' },
                        alignment: { horizontal: 'center', vertical: 'center' },
                        border: {
                            top: allBordersStyle,
                            bottom: allBordersStyle,
                            right: allBordersStyle,
                            left: allBordersStyle
                        }
                    }
                },
                {
                    v: item.passYn,
                    s: {
                        font: { sz: 11, bold: true, name: '굴림' },
                        alignment: { horizontal: 'center', vertical: 'center' },
                        border: {
                            top: allBordersStyle,
                            bottom: allBordersStyle,
                            right: allBordersStyle,
                            left: allBordersStyle
                        }
                    }
                }
            ]);
        });

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet(data);

        // 병합할 셀 범위 지정
        worksheet['!merges'] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }, // Merging A1 to F1
            { s: { r: 1, c: 0 }, e: { r: 1, c: 5 } }, // Merging A2 to F2
            { s: { r: 2, c: 0 }, e: { r: 2, c: 5 } }, // Merging A3 to F3
            { s: { r: 3, c: 0 }, e: { r: 3, c: 5 } }, // Merging A4 to F4
            { s: { r: 4, c: 0 }, e: { r: 4, c: 5 } }, // Merging A5 to F5
            { s: { r: 5, c: 0 }, e: { r: 5, c: 5 } }, // Merging A6 to F6
            { s: { r: 6, c: 0 }, e: { r: 6, c: 5 } }, // Merging A7 to F7

            { s: { r: 7, c: 2 }, e: { r: 7, c: 3 } }, // Merging E8 to F8 (성명)
            { s: { r: 7, c: 4 }, e: { r: 7, c: 5 } }, // Merging E8 to F8 (서명)
            { s: { r: 8, c: 2 }, e: { r: 8, c: 3 } }, // Merging C9 to D9 (성명)
            { s: { r: 8, c: 4 }, e: { r: 8, c: 5 } }, // Merging E9 to F9 (서명)
            { s: { r: 9, c: 2 }, e: { r: 9, c: 3 } }, // Merging C10 to D10 (성명)
            { s: { r: 9, c: 4 }, e: { r: 9, c: 5 } }, // Merging E10 to F10 (서명)
            { s: { r: 10, c: 0 }, e: { r: 10, c: 5 } }, // Merging A11 to F11
            { s: { r: 11, c: 0 }, e: { r: 11, c: 5 } }, // Merging A12 to F12
            { s: { r: 12, c: 0 }, e: { r: 12, c: 5 } } // Merging A13 to F13
        ];

        worksheet['!rows'] = [
            { hpt: 45, hpx: 45, level: 0 }, // 1라인
            { hpt: 10, hpx: 10, level: 0 }, // 2라인
            { hpt: 25, hpx: 25, level: 0 }, // 3라인
            { hpt: 25, hpx: 25, level: 0 }, // 4라인
            { hpt: 25, hpx: 25, level: 0 }, // 5라인
            { hpt: 10, hpx: 10, level: 0 }, // 6라인
            { hpt: 25, hpx: 25, level: 0 }, // 7라인
            { hpt: 35, hpx: 35, level: 0 }, // 8라인
            { hpt: 62, hpx: 62, level: 0 }, // 9라인
            { hpt: 62, hpx: 62, level: 0 }, // 10라인
            { hpt: 20, hpx: 20, level: 0 }, // 11라인
            { hpt: 25, hpx: 25, level: 0 }, // 12라인
            { hpt: 45, hpx: 45, level: 0 }, // 13라인
            { hpt: 35, hpx: 35, level: 0 } // 14라인
        ];

        for (let c = 0; c < data[13].length; c++) {
            worksheet['!cols'] = [];
            worksheet['!cols'][0] = { wpx: 70 };
            worksheet['!cols'][1] = { wpx: 260 };
            worksheet['!cols'][2] = { wpx: 100 };
            worksheet['!cols'][3] = { wpx: 100 };
            worksheet['!cols'][4] = { wpx: 100 };
            worksheet['!cols'][5] = { wpx: 100 };
            worksheet[XLSX.utils.encode_cell({ r: 13, c })].s = {
                font: { sz: 11, bold: true, bold: true, name: '굴림', color: { rgb: '000000' } },
                fill: { fgColor: { rgb: 'e3e3e3' } },
                alignment: { horizontal: 'center', vertical: 'center' },
                border: {
                    top: allBordersStyle,
                    bottom: allBordersStyle,
                    right: allBordersStyle,
                    left: allBordersStyle
                }
            };
        }

        for (let r = 1; r < data.length; r++) {
            if (r > 13) {
                worksheet['!rows'][r] = { hpx: 25 };
                // worksheet['!rows'] = Array(data[r].length).fill({ hpx: 30 });
            }
        }

        XLSX.utils.book_append_sheet(workbook, worksheet, '인증 평가');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, down_fileName);
    };

    // 교육생 인증평가표 다운로드(검색조건) End
    // ===============================

    useEffect(() => {
        setLoading(true);
        handle_SelectBaselineUserList_Api();
    }, [searchval]);

    return (
        <>
            <MainCard title="교육생 정보조회">
                <Typography variant="body1">
                    <Row gutter={[8, 8]} style={{ marginBottom: 16 }}>
                        <Col span={8}>
                            <div style={{ display: 'flex', justifyContent: 'flex-start', fontSize: '14px' }}>
                                <Input.Search
                                    placeholder="※ 통합 검색 (차수명, 교육생ID, 교육생명, 교육구분, 기관)"
                                    style={{ width: 483 }}
                                    onSearch={onSearch}
                                    allowClear
                                    enterButton
                                    size="middle"
                                    className="custom-search-input"
                                />
                            </div>
                        </Col>
                        <Col span={16} style={{ textAlign: 'right' }}>
                            <Space>
                                {window.localStorage.getItem('authCd') === '0000' ? (
                                    <>
                                        <Tooltip title="인증평가표 다운로드(검색조건)">
                                            <Button
                                                type="default"
                                                onClick={() => handle_cer_down()}
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
                                                인증평가표 다운로드(검색조건)
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title="교육생 평가점수 업로드">
                                            <Button
                                                type="default"
                                                // onClick={() => setExceluploadModal(true)}
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
                                                교육생 평가점수 업로드
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title="교육생 평가표 다운로드 [평가완료]">
                                            <Button
                                                type="default"
                                                // onClick={handle_download}
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
                                                교육생 평가표 다운로드 [평가완료]
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title="추가">
                                            <Button
                                                type="success"
                                                // onClick={handleAdd}
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
                                                // onClick={handleDel}
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
                    <Descriptions style={{ marginTop: '20px' }}></Descriptions>
                    <Table
                        rowClassName={(record) => {
                            return record.userId === userIdChk ? `table-row-lightblue` : '';
                        }}
                        columns={columns}
                        dataSource={dataSource}
                        bordered={true}
                        onChange={onChange}
                        loading={loading}
                    />
                </Typography>
            </MainCard>

            {/* 평가, 가중치 점수 - XBT평가, 이론평가, 실습평가 */}
            <Modal
                open={evalOpen}
                closable={false}
                width={1100}
                style={{
                    left: 130,
                    zIndex: 999
                }}
                footer={[
                    <Button
                        type="primary"
                        onClick={handleCancel}
                        style={{ width: '100px', borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                    >
                        Close
                    </Button>
                ]}
            >
                <>
                    <Card style={{ width: '100%' }} title={<span style={{ fontSize: '15px' }}>※ XBT 평가</span>}>
                        <Space>
                            <Descriptions layout="vertical" bordered column={5}>
                                <Descriptions.Item style={{ textAlign: 'center', width: '240px' }} label="평가명">
                                    {evaluationInfoData?.procNm || '-'}
                                </Descriptions.Item>
                                <Descriptions.Item style={{ textAlign: 'center' }} label="문항수">
                                    {evaluationInfoData?.questionCnt || '-'}
                                </Descriptions.Item>
                                <Descriptions.Item style={{ textAlign: 'center' }} label="정답">
                                    {evaluationInfoData?.rightCnt || '-'}
                                </Descriptions.Item>
                                <Descriptions.Item style={{ textAlign: 'center' }} label="오답">
                                    {evaluationInfoData?.wrongCnt || '-'}
                                </Descriptions.Item>
                                <Descriptions.Item style={{ textAlign: 'center', fontWeight: 'bold' }} label="평점">
                                    {evaluationInfoData?.evaluationScore || '-'}
                                </Descriptions.Item>
                            </Descriptions>
                            <Title level={2} style={{ marginLeft: '20px' }}>
                                X
                            </Title>
                            <Descriptions layout="vertical" bordered style={{ marginLeft: '20px' }}>
                                <Descriptions.Item style={{ textAlign: 'center', fontWeight: 'bold' }} label="XBT평가 비중율(%) ">
                                    {evaluationInfoData?.evaluationTotalScore || '0'}%
                                </Descriptions.Item>
                            </Descriptions>
                            <Title level={2} style={{ marginLeft: '20px' }}>
                                =
                            </Title>
                            <Descriptions layout="vertical" bordered style={{ marginLeft: '20px' }}>
                                <Descriptions.Item style={{ textAlign: 'center', fontWeight: 'bold' }} label="XBT평가 최종점수">
                                    <space style={{ color: '#108ee9' }}>{evaluationInfoData?.gainScore || '-'}</space>
                                </Descriptions.Item>
                            </Descriptions>
                        </Space>
                    </Card>
                    <br />
                    <br />
                    <Card style={{ width: '100%' }} title={<span style={{ fontSize: '15px' }}>※ 이론 평가</span>}>
                        <Space>
                            <Descriptions layout="vertical" bordered column={5}>
                                <Descriptions.Item style={{ textAlign: 'center', width: '240px' }} label="평가명">
                                    {theoryInfoData?.procNm || '-'}
                                </Descriptions.Item>
                                <Descriptions.Item style={{ textAlign: 'center' }} label="문항수">
                                    {theoryInfoData?.questionCnt || '-'}
                                </Descriptions.Item>
                                <Descriptions.Item style={{ textAlign: 'center' }} label="정답">
                                    {theoryInfoData?.rightCnt || '-'}
                                </Descriptions.Item>
                                <Descriptions.Item style={{ textAlign: 'center' }} label="오답">
                                    {theoryInfoData?.wrongCnt || '-'}
                                </Descriptions.Item>
                                <Descriptions.Item style={{ textAlign: 'center', fontWeight: 'bold' }} label="평점">
                                    {theoryInfoData?.theoryScore || '-'}
                                </Descriptions.Item>
                            </Descriptions>
                            <Title level={2} style={{ marginLeft: '20px' }}>
                                X
                            </Title>
                            <Descriptions layout="vertical" bordered style={{ marginLeft: '20px' }}>
                                <Descriptions.Item style={{ textAlign: 'center', fontWeight: 'bold' }} label="이론평가 비중율(%) ">
                                    {theoryInfoData?.theoryTotalScore || '0'}%
                                </Descriptions.Item>
                            </Descriptions>
                            <Title level={2} style={{ marginLeft: '20px' }}>
                                =
                            </Title>
                            <Descriptions layout="vertical" bordered style={{ marginLeft: '20px' }}>
                                <Descriptions.Item style={{ textAlign: 'center', fontWeight: 'bold' }} label="이론평가 최종점수">
                                    <space style={{ color: '#108ee9' }}>{theoryInfoData?.gainScore || '-'}</space>
                                </Descriptions.Item>
                            </Descriptions>
                        </Space>
                    </Card>
                    <br />
                    <br />
                    <Card style={{ width: '100%' }} title={<span style={{ fontSize: '15px' }}>※ 실습 평가</span>}>
                        <Space>
                            <Descriptions layout="vertical" bordered column={3}>
                                <Descriptions.Item style={{ textAlign: 'center', width: '240px' }} label="평가명">
                                    {practiceInfoData?.procNm || '-'}
                                </Descriptions.Item>
                                <Descriptions.Item style={{ textAlign: 'center' }} label="점수">
                                    <Input
                                        name="choice"
                                        placeholder="※ 실습 평가 점수"
                                        value={practiceScoreValue === null ? practiceInfoData?.practiceScore : practiceScoreValue}
                                        onChange={(e) => {
                                            setPracticeScoreValue(e.target.value);
                                        }}
                                        style={{ width: '125px', textAlign: 'center' }}
                                    />
                                </Descriptions.Item>
                                <Descriptions.Item style={{ textAlign: 'center' }} label="저장">
                                    <Tooltip title="저장" placement="bottom" color="#108ee9">
                                        <Button
                                            onClick={() => handel_practiceScore()}
                                            style={{ width: '75px', tborderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                            type="primary"
                                        >
                                            저장
                                        </Button>
                                    </Tooltip>
                                </Descriptions.Item>
                            </Descriptions>
                            <Title level={2} style={{ marginLeft: '20px' }}>
                                X
                            </Title>
                            <Descriptions layout="vertical" bordered style={{ marginLeft: '20px' }}>
                                <Descriptions.Item style={{ textAlign: 'center', fontWeight: 'bold' }} label="실습평가 비중율(%) ">
                                    {practiceInfoData?.practiceTotalScore || '0'}%
                                </Descriptions.Item>
                            </Descriptions>
                            <Title level={2} style={{ marginLeft: '20px' }}>
                                =
                            </Title>
                            <Descriptions layout="vertical" bordered style={{ marginLeft: '20px' }}>
                                <Descriptions.Item style={{ textAlign: 'center', fontWeight: 'bold' }} label="실습평가 최종점수">
                                    <space style={{ color: '#108ee9' }}>{practiceInfoData?.gainScore || '-'}</space>
                                </Descriptions.Item>
                            </Descriptions>
                        </Space>
                    </Card>
                    <br />
                </>

                {/* {eduCd !== '4' && eduCd !== '6' ? (
                    <>
                        <Space>
                            <Descriptions title="※ XBT 평가" layout="vertical" bordered column={5}>
                                <Descriptions.Item style={{ textAlign: 'center', width: '190px' }} label="평가명">
                                    {evaluationInfoData?.procNm || '-'}
                                </Descriptions.Item>
                                <Descriptions.Item style={{ textAlign: 'center' }} label="문항수">
                                    {evaluationInfoData?.questionCnt || '-'}
                                </Descriptions.Item>
                                <Descriptions.Item style={{ textAlign: 'center' }} label="정답">
                                    {evaluationInfoData?.rightCnt || '-'}
                                </Descriptions.Item>
                                <Descriptions.Item style={{ textAlign: 'center' }} label="오답">
                                    {evaluationInfoData?.wrongCnt || '-'}
                                </Descriptions.Item>
                                <Descriptions.Item style={{ textAlign: 'center', fontWeight: 'bold' }} label="평점">
                                    {evaluationInfoData?.evaluationScore || '-'}
                                </Descriptions.Item>
                            </Descriptions>
                            <Title level={1} style={{ marginTop: '65px', marginLeft: '30px' }}>
                                X
                            </Title>
                            <Descriptions layout="vertical" bordered style={{ marginTop: '45px', marginLeft: '30px' }}>
                                <Descriptions.Item style={{ textAlign: 'center', fontWeight: 'bold' }} label="XBT 평가 가중치(%) ">
                                    {evaluationInfoData?.evaluationTotalScore || '0'}%
                                </Descriptions.Item>
                            </Descriptions>
                            <Title level={1} style={{ marginTop: '65px', marginLeft: '30px' }}>
                                =
                            </Title>
                            <Descriptions layout="vertical" bordered style={{ marginTop: '45px', marginLeft: '30px' }}>
                                <Descriptions.Item style={{ textAlign: 'center', fontWeight: 'bold' }} label="XBT 평가 최종 점수">
                                    <space style={{ color: '#108ee9' }}>{evaluationInfoData?.gainScore || '-'}</space>
                                </Descriptions.Item>
                            </Descriptions>
                        </Space>
                        <br />
                        <br />
                        <br />
                    </>
                ) : eduCd === '4' ? (
                    <>
                        <Space>
                            <Descriptions title="※ 대인 실기평가" layout="vertical" bordered column={3}>
                                <Descriptions.Item style={{ textAlign: 'center', width: '190px' }} label="평가명">
                                    {practiceInfoData?.procNm || '-'}
                                </Descriptions.Item>
                                <Descriptions.Item style={{ textAlign: 'center' }} label="점수">
                                    <Input
                                        name="choice"
                                        placeholder="※ 대인 실기평가 점수"
                                        value={
                                            practiceHumanScoreValue === null
                                                ? practiceInfoData?.practiceHumanScore
                                                : practiceHumanScoreValue
                                        }
                                        onChange={(e) => {
                                            setPracticeHumanScoreValue(e.target.value);
                                        }}
                                        style={{ width: '145px' }}
                                    />
                                </Descriptions.Item>
                                <Descriptions.Item style={{ textAlign: 'center' }} label="저장">
                                    <Tooltip title="저장" placement="bottom" color="#108ee9">
                                        <Button
                                            onClick={() => handel_practiceScore()}
                                            style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                            type="primary"
                                        >
                                            저장
                                        </Button>
                                    </Tooltip>
                                </Descriptions.Item>
                            </Descriptions>
                            <Title level={1} style={{ marginTop: '65px', marginLeft: '30px' }}>
                                X
                            </Title>
                            <Descriptions layout="vertical" bordered style={{ marginTop: '45px', marginLeft: '30px' }}>
                                <Descriptions.Item style={{ textAlign: 'center', fontWeight: 'bold' }} label="대인 실기 평가 가중치(%) ">
                                    {practiceInfoData?.practiceHumanTotalScore || '0'}%
                                </Descriptions.Item>
                            </Descriptions>
                            <Title level={1} style={{ marginTop: '65px', marginLeft: '30px' }}>
                                =
                            </Title>
                            <Descriptions layout="vertical" bordered style={{ marginTop: '45px', marginLeft: '30px' }}>
                                <Descriptions.Item style={{ textAlign: 'center', fontWeight: 'bold' }} label="대인 실기 평가 최종 점수">
                                    <space style={{ color: '#108ee9' }}>{practiceInfoData?.humanGainScore || '-'}</space>
                                </Descriptions.Item>
                            </Descriptions>
                        </Space>
                        <br />
                        <br />
                        <br />
                    </>
                ) : eduCd === '6' ? (
                    <>
                        <Space>
                            <Descriptions title="※ 대인 실기평가" layout="vertical" bordered column={3}>
                                <Descriptions.Item style={{ textAlign: 'center', width: '190px' }} label="평가명">
                                    {practiceInfoData?.procNm || '-'}
                                </Descriptions.Item>
                                <Descriptions.Item style={{ textAlign: 'center' }} label="점수">
                                    <Input
                                        name="choice"
                                        placeholder="※ 대인 실기평가 점수"
                                        value={
                                            practiceHumanScoreValue === null
                                                ? practiceInfoData?.practiceHumanScore
                                                : practiceHumanScoreValue
                                        }
                                        onChange={(e) => {
                                            setPracticeHumanScoreValue(e.target.value);
                                        }}
                                        style={{ width: '145px' }}
                                    />
                                </Descriptions.Item>
                                <Descriptions.Item style={{ textAlign: 'center' }} label="저장">
                                    <Tooltip title="저장" placement="bottom" color="#108ee9">
                                        <Button
                                            onClick={() => handel_practiceScore()}
                                            style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                            type="primary"
                                        >
                                            저장
                                        </Button>
                                    </Tooltip>
                                </Descriptions.Item>
                            </Descriptions>
                            <Title level={1} style={{ marginTop: '65px', marginLeft: '30px' }}>
                                X
                            </Title>
                            <Descriptions layout="vertical" bordered style={{ marginTop: '45px', marginLeft: '30px' }}>
                                <Descriptions.Item style={{ textAlign: 'center', fontWeight: 'bold' }} label="대인 실기 평가 가중치(%) ">
                                    {practiceInfoData?.practiceHumanTotalScore || '0'}%
                                </Descriptions.Item>
                            </Descriptions>
                            <Title level={1} style={{ marginTop: '65px', marginLeft: '30px' }}>
                                =
                            </Title>
                            <Descriptions layout="vertical" bordered style={{ marginTop: '45px', marginLeft: '30px' }}>
                                <Descriptions.Item style={{ textAlign: 'center', fontWeight: 'bold' }} label="대인 실기 평가 최종 점수">
                                    <space style={{ color: '#108ee9' }}>{practiceInfoData?.humanGainScore || '-'}</space>
                                </Descriptions.Item>
                            </Descriptions>
                        </Space>
                        <br />
                        <br />
                        <br />
                        <Space>
                            <Descriptions title="※ 차량 실기평가" layout="vertical" bordered column={3}>
                                <Descriptions.Item style={{ textAlign: 'center', width: '190px' }} label="평가명">
                                    {practiceInfoData?.procNm || '-'}
                                </Descriptions.Item>
                                <Descriptions.Item style={{ textAlign: 'center' }} label="점수">
                                    <Input
                                        name="choice"
                                        placeholder="※ 차량 실기평가 점수"
                                        value={practiceCarScoreValue === null ? practiceInfoData?.practiceCarScore : practiceCarScoreValue}
                                        onChange={(e) => {
                                            setPracticeCarScoreValue(e.target.value);
                                        }}
                                        style={{ width: '145px' }}
                                    />
                                </Descriptions.Item>
                                <Descriptions.Item style={{ textAlign: 'center' }} label="저장">
                                    <Tooltip title="저장" placement="bottom" color="#108ee9">
                                        <Button
                                            onClick={() => handel_practiceScore()}
                                            style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                            type="primary"
                                        >
                                            저장
                                        </Button>
                                    </Tooltip>
                                </Descriptions.Item>
                            </Descriptions>
                            <Title level={1} style={{ marginTop: '65px', marginLeft: '30px' }}>
                                X
                            </Title>
                            <Descriptions layout="vertical" bordered style={{ marginTop: '45px', marginLeft: '30px' }}>
                                <Descriptions.Item style={{ textAlign: 'center', fontWeight: 'bold' }} label="차량 실기 평가 가중치(%) ">
                                    {practiceInfoData?.practiceCarTotalScore || '0'}%
                                </Descriptions.Item>
                            </Descriptions>
                            <Title level={1} style={{ marginTop: '65px', marginLeft: '30px' }}>
                                =
                            </Title>
                            <Descriptions layout="vertical" bordered style={{ marginTop: '45px', marginLeft: '30px' }}>
                                <Descriptions.Item style={{ textAlign: 'center', fontWeight: 'bold' }} label="차량 실기 평가 최종 점수">
                                    <space style={{ color: '#108ee9' }}>{practiceInfoData?.carGainScore || '-'}</space>
                                </Descriptions.Item>
                            </Descriptions>
                        </Space>
                        <br />
                        <br />
                        <br />
                    </>
                ) : (
                    ''
                )}
                <Space>
                    <Descriptions title="※ 이론 평가" layout="vertical" bordered column={5}>
                        <Descriptions.Item style={{ textAlign: 'center', width: '190px' }} label="평가명">
                            {theoryInfoData?.procNm || '-'}
                        </Descriptions.Item>
                        <Descriptions.Item style={{ textAlign: 'center' }} label="문항수">
                            {theoryInfoData?.questionCnt || '-'}
                        </Descriptions.Item>
                        <Descriptions.Item style={{ textAlign: 'center' }} label="정답">
                            {theoryInfoData?.rightCnt || '-'}
                        </Descriptions.Item>
                        <Descriptions.Item style={{ textAlign: 'center' }} label="오답">
                            {theoryInfoData?.wrongCnt || '-'}
                        </Descriptions.Item>
                        <Descriptions.Item style={{ textAlign: 'center', fontWeight: 'bold' }} label="평점">
                            {theoryInfoData?.theoryScore || '-'}
                        </Descriptions.Item>
                    </Descriptions>
                    <Title level={1} style={{ marginTop: '65px', marginLeft: '30px' }}>
                        X
                    </Title>
                    <Descriptions layout="vertical" bordered style={{ marginTop: '45px', marginLeft: '30px' }}>
                        <Descriptions.Item style={{ textAlign: 'center', fontWeight: 'bold' }} label="이론 평가 가중치(%) ">
                            {theoryInfoData?.theoryTotalScore || '0'}%
                        </Descriptions.Item>
                    </Descriptions>
                    <Title level={1} style={{ marginTop: '65px', marginLeft: '30px' }}>
                        =
                    </Title>
                    <Descriptions layout="vertical" bordered style={{ marginTop: '45px', marginLeft: '30px' }}>
                        <Descriptions.Item style={{ textAlign: 'center', fontWeight: 'bold' }} label="이론 평가 최종 점수">
                            <space style={{ color: '#108ee9' }}>{theoryInfoData?.gainScore || '-'}</space>
                        </Descriptions.Item>
                    </Descriptions>
                </Space>
                <br />
                <br />
                <br />
                {eduCd !== '4' && eduCd !== '6' ? (
                    <Space>
                        <Descriptions title="※ 실습 평가" layout="vertical" bordered column={3}>
                            <Descriptions.Item style={{ textAlign: 'center', width: '190px' }} label="평가명">
                                {practiceInfoData?.procNm || '-'}
                            </Descriptions.Item>
                            <Descriptions.Item style={{ textAlign: 'center' }} label="점수">
                                <Input
                                    name="choice"
                                    placeholder="※ 실습 평가 점수"
                                    value={practiceScoreValue === null ? practiceInfoData?.practiceScore : practiceScoreValue}
                                    onChange={(e) => {
                                        setPracticeScoreValue(e.target.value);
                                    }}
                                    style={{ width: '145px' }}
                                />
                            </Descriptions.Item>
                            <Descriptions.Item style={{ textAlign: 'center' }} label="저장">
                                <Tooltip title="저장" placement="bottom" color="#108ee9">
                                    <Button
                                        onClick={() => handel_practiceScore()}
                                        style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                        type="primary"
                                    >
                                        저장
                                    </Button>
                                </Tooltip>
                            </Descriptions.Item>
                        </Descriptions>
                        <Title level={1} style={{ marginTop: '65px', marginLeft: '30px' }}>
                            X
                        </Title>
                        <Descriptions layout="vertical" bordered style={{ marginTop: '45px', marginLeft: '30px' }}>
                            <Descriptions.Item style={{ textAlign: 'center', fontWeight: 'bold' }} label="실습 평가 가중치(%) ">
                                {practiceInfoData?.practiceTotalScore || '0'}%
                            </Descriptions.Item>
                        </Descriptions>
                        <Title level={1} style={{ marginTop: '65px', marginLeft: '30px' }}>
                            =
                        </Title>
                        <Descriptions layout="vertical" bordered style={{ marginTop: '45px', marginLeft: '30px' }}>
                            <Descriptions.Item style={{ textAlign: 'center', fontWeight: 'bold' }} label="실습 평가 최종 점수">
                                <space style={{ color: '#108ee9' }}>{practiceInfoData?.gainScore || '-'}</space>
                            </Descriptions.Item>
                        </Descriptions>
                    </Space>
                ) : (
                    ''
                )} */}
            </Modal>
        </>
    );
};
