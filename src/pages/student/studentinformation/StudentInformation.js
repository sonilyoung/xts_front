/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { Table, Tag } from 'antd';
import { useGetStudentInformationListMutation } from '../../../hooks/api/StudentsManagement/StudentsManagement';

// project import
import MainCard from 'components/MainCard';

export const Studentinformation = () => {
    const [getStudentInformationList] = useGetStudentInformationListMutation(); // 교육생 정보 hooks api호출
    const [studentInformationList, setStudentInformationList] = useState(); // 교육생 정보 리스트 값
    const [dataSource, setDataSource] = useState([]); // Table 데이터 값
    const [loading, setLoading] = useState(false);

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

    useEffect(() => {
        setLoading(true);
        handleStudents();
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
                </Typography>
            </MainCard>
        </>
    );
};
// export default Studentinformation;
