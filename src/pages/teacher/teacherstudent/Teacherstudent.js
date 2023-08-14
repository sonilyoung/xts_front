/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { Typography, Table, Tag, Tooltip, Button, Descriptions, Modal, Input, Space, Card } from 'antd';
import {
    useSelectBaselineUserListMutation,
    useSelectBaselineUserMutation,
    useUpdateBaselineUserMutation
} from '../../../hooks/api/StudentsManagement/StudentsManagement';

import { FileProtectOutlined, AudioOutlined } from '@ant-design/icons';
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
    const [procCdChk, setProcCdChk] = useState(''); // 실습 점수
    const [userIdChk, setUserIdChk] = useState(''); // 실습 점수
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
            practiceScore: practiceScoreValue
        });
        if (UpdateBaselineUserResponse?.data?.RET_CODE === '0100') {
            Modal.success({
                content: '실습 점수 저장 완료',
                onOk() {
                    handle_SelectBaselineUser_Api(procCdChk, userIdChk);
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
            align: 'center'
        },
        {
            title: '기관',
            dataIndex: 'compNm',
            align: 'center'
        },
        {
            width: '100px',
            title: '평가 가중치',
            dataIndex: 'gainScore',
            align: 'center',
            render: (_, { gainScore, procCd, userId }) => (
                <>
                    <Space>
                        <Tooltip title="평가 가중치" color="#108ee9">
                            <Button
                                type="primary"
                                style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                icon={<FileProtectOutlined />}
                                onClick={() => handle_Score(procCd, userId)}
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

    const handle_Score = (procCd, userId) => {
        setProcCdChk(procCd);
        setUserIdChk(userId);
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

    useEffect(() => {
        setLoading(true);
        handle_SelectBaselineUserList_Api();
    }, [searchval]);

    return (
        <>
            <MainCard title="교육생 정보조회">
                <Typography variant="body1">
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Input.Search
                            placeholder="※ 통합 검색 (차수명, 교육생ID, 교육생명, 교육구분, 기관)"
                            style={{ width: 480 }}
                            onSearch={onSearch}
                            allowClear
                            enterButton
                            size="large"
                            className="custom-search-input"
                        />
                    </div>
                    <Descriptions style={{ marginTop: '20px' }}></Descriptions>
                    <Table columns={columns} dataSource={dataSource} bordered={true} onChange={onChange} loading={loading} />
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
            </Modal>
        </>
    );
};
