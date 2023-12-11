/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { Table, Tag, Col, Row, Button, Input } from 'antd';
import { useSelectUserListPopMutation } from '../../../hooks/api/StudentsManagement/StudentsManagement';

// project import
import MainCard from 'components/MainCard';

export const StudentSch = (props) => {
    const [dataSource, setDataSource] = useState([]); // Table 데이터 값
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState(); //셀렉트 박스 option Selected 값

    const [searchval, setSearchval] = useState(null);

    // ===============================
    // Api 호출 Start
    // 조회 ======================================================
    const [SelectUserListPopApi] = useSelectUserListPopMutation(); // 교육생 정보 hooks api호출
    const [selectUserListPopData, setSelectUserListPopData] = useState(); // 교육생 정보 리스트 값

    const handle_SelectUserListPop_Api = async () => {
        const SelectUserListPopresponse = await SelectUserListPopApi({
            // searchval: searchval,
            procCd: props.ProcCdValue
        });

        setSelectUserListPopData(SelectUserListPopresponse?.data?.RET_DATA);
        setDataSource([
            ...SelectUserListPopresponse?.data?.RET_DATA.map((d, i) => ({
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
            width: '220px',
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
            render: (_, { useYn }) => <>{useYn === 'Y' ? <Tag color={'green'}>사용</Tag> : <Tag color={'volcano'}>미사용</Tag>}</>
        }
    ];

    const onChange = (pagination, filters, sorter, extra) => {
        // console.log('params', pagination, filters, sorter, extra);
    };

    //체크 박스 이벤트
    const onSelectChange = (newSelectedRowKeys) => {
        // console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    //체크 박스 선택
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange
    };

    const StudentOk = () => {
        props.StudentsCnt(selectedRowKeys);
    };

    const onSearch = (value) => {
        setSearchval(value);
    };

    useEffect(() => {
        setSelectedRowKeys(props.StudentValue);
        setLoading(true);
        handle_SelectUserListPop_Api();
    }, [props.ProcCdValue, props.StudentValue]);

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
                        <Col span={14} style={{ textAlign: 'right' }}></Col>
                    </Row>
                    <Table
                        columns={columns}
                        dataSource={dataSource}
                        rowSelection={{ ...rowSelection }}
                        bordered={true}
                        onChange={onChange}
                        loading={loading}
                        size="middle"
                    />
                    <Row style={{ width: '100%', marginTop: '10px' }}>
                        <Col>
                            <Button
                                type="primary"
                                onClick={StudentOk}
                                style={{ width: '100px', borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                            >
                                선택 완료 [{selectedRowKeys?.length}]
                            </Button>
                        </Col>
                    </Row>
                </Typography>
            </MainCard>
        </>
    );
};
