/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { Table, Tag, Button } from 'antd';

// 학습과정 관리 학습생 인원 상세정보 팝업
import { useSelectBaselineStuListMutation } from '../../../hooks/api/CurriculumManagement/CurriculumManagement';

// project import
import MainCard from 'components/MainCard';

export const StudentDetail = (props) => {
    const [dataSource, setDataSource] = useState([]); // Table 데이터 값
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); //셀렉트 박스 option Selected 값

    // ===============================
    // Api 호출 Start
    // 조회 ======================================================
    const [SelectBaselineStuListApi] = useSelectBaselineStuListMutation(); // 교육생 정보 hooks api호출
    const handle_SelectBaselineStuList_Api = async () => {
        const SelectBaselineStuListresponse = await SelectBaselineStuListApi({
            procCd: props.ProcCdValue
        });
        console.log(SelectBaselineStuListresponse?.data?.RET_DATA);
        setDataSource([
            ...SelectBaselineStuListresponse?.data?.RET_DATA.map((d, i) => ({
                key: d.userId,
                userNo: i + 1,
                // compNm: "2",
                // deptNm: "교육훈련실",
                // endingYn: 'N',
                // gainScore: '0',
                // insertDate: '2023-06-18',
                // insertId: 'admin',
                // passYn: 'ING',
                // procCd: 61,
                procNm: d.procNm,
                // procSeq: '1',
                // procYear: '2023',
                // studentNo: 110,
                userId: d.userId,
                userNm: d.userNm
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
            width: '230px',
            title: '교육 구분',
            dataIndex: 'procNm',
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

    useEffect(() => {
        setLoading(true);
        handle_SelectBaselineStuList_Api();
    }, [props.ProcCdValue]);

    return (
        <>
            <MainCard title="교육생 정보조회">
                <Typography variant="body1">
                    <Table columns={columns} size="middle" dataSource={dataSource} bordered={true} onChange={onChange} loading={loading} />
                </Typography>
            </MainCard>
        </>
    );
};
