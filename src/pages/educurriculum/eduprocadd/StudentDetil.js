/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { Table, Tag, Col, Row, Button } from 'antd';

// 학습과정 관리 학습생 인원 상세정보 팝업
import { useSelectBaselineStuListMutation } from '../../../hooks/api/CurriculumManagement/CurriculumManagement';

// project import
import MainCard from 'components/MainCard';

export const StudentDetil = (props) => {
    const [dataSource, setDataSource] = useState([]); // Table 데이터 값
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); //셀렉트 박스 option Selected 값

    // ===============================
    // Api 호출 Start
    // 조회 ======================================================
    const [SelectBaselineStuListApi] = useSelectBaselineStuListMutation(); // 교육생 정보 hooks api호출
    const handle_SelectBaselineStuList_Api = async () => {
        const SelectBaselineStuListresponse = await SelectBaselineStuListApi({
            procCd: props.procCdValue
        });
        // console.log(SelectBaselineStuListresponse?.data?.RET_DATA);
        setDataSource([
            ...SelectBaselineStuListresponse?.data?.RET_DATA.map((d, i) => ({
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
            title: '부서',
            dataIndex: 'dept',
            align: 'center'
        },
        {
            title: '직위',
            dataIndex: 'position',
            align: 'center'
        },
        {
            width: '170px',
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

    useEffect(() => {
        setLoading(true);
        handle_SelectBaselineStuList_Api();
    }, []);

    return (
        <>
            <MainCard title="교육생 정보조회">
                <Typography variant="body1">
                    <Table
                        columns={columns}
                        dataSource={dataSource}
                        rowSelection={{ ...rowSelection }}
                        bordered={true}
                        onChange={onChange}
                        loading={loading}
                    />
                    <Row style={{ width: '100%', margin: '10px 0px' }}>
                        <Col span={3}>
                            <Button
                                type="primary"
                                // onClick={QuestionsOk}
                                style={{ width: '100px', borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                            >
                                선택 완료 [{}]
                            </Button>
                        </Col>
                    </Row>
                </Typography>
            </MainCard>
        </>
    );
};
