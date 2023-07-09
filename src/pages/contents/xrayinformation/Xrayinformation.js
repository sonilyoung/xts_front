/* eslint-disable*/
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Typography } from '@mui/material';
// assets
import { SearchOutlined } from '@ant-design/icons';
// material-ui
import { Box, FormControl, InputAdornment, OutlinedInput } from '@mui/material';
import {
    Col,
    Row,
    Space,
    Card,
    Table,
    Tooltip,
    Tag,
    Button,
    Upload,
    Drawer,
    Divider,
    Input,
    Select,
    Switch,
    Form,
    Modal,
    Dragger,
    Skeleton
} from 'antd';

import {
    useGetXrayinformationListMutation,
    useGetXrayinformationSubListMutation,
    useInsertXrayContentsMutation, //xray컨텐츠등록
    useUpdateXrayContentsMutation, //xray컨텐츠수정
    useDeleteXrayContentsMutation, //xray컨텐츠삭제
    useInsertXrayUnitMutation, //xray컨텐츠 물품등록
    useDeleteXrayUnitMutation, //xray컨텐츠 물품삭제
    useSelectUnitPopupListMutation, //물품팝업리스트
    useSelectImgMutation
} from '../../../hooks/api/ContentsManagement/ContentsManagement';

import { PlusOutlined, EditFilled, DeleteFilled, UploadOutlined, MinusCircleOutlined, ExclamationCircleFilled } from '@ant-design/icons';

// project import
import MainCard from 'components/MainCard';

const { confirm } = Modal;

export const Xrayinformation = () => {
    const [getXrayinformationList] = useGetXrayinformationListMutation(); // 콘텐츠 정보 관리 hooks api호출
    const [getXrayinformationSubList] = useGetXrayinformationSubListMutation(); // 콘텐츠 정보 관리 hooks api호출
    const [xrayinformationList, setXrayinformationList] = useState(); // 콘텐츠 정보관리 리스트 상단 값
    const [xrayinformationSubList, setXrayinformationSubList] = useState(); // 콘텐츠 정보관리 리스트 하단 값

    const [insertXrayContents] = useInsertXrayContentsMutation(); // xray컨텐츠등록 hooks api호출
    const [updateXrayContents] = useUpdateXrayContentsMutation(); // xray컨텐츠수정 hooks api호출
    const [deleteXrayContents] = useDeleteXrayContentsMutation(); // xray컨텐츠삭제 hooks api호출
    const [insertXrayUnit] = useInsertXrayUnitMutation(); // xray컨텐츠 물품등록 hooks api호출
    const [deleteXrayUnit] = useDeleteXrayUnitMutation(); // xray컨텐츠 물품삭제 hooks api호출
    const [selectUnitPopupList] = useSelectUnitPopupListMutation(); // xray컨텐츠 물품삭제 hooks api호출
    const [SelectImgApi] = useSelectImgMutation();// 이미지조회 api 정보

    const [unitPopupList, setUnitPopupList] = useState([]);
    const [targetUnitPopupList, setTargetUnitPopupList] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); //셀렉트 박스 option Selected 값(상단)
    const [selectedRowKeysSub, setSelectedRowKeysSub] = useState([]); //셀렉트 박스 option Selected 값(하단)
    const [selectedKeyPop, setSelectedKeyPop] = useState([]); //셀렉트 박스 option Selected 값(하단)
    const [dataSource, setDataSource] = useState([]); // 상단 Table 데이터 값
    const [dataSourceSub, setDataSourceSub] = useState([]); // 하단 Table 데이터 값
    const [dataSourcePop, setDataSourcePop] = useState([]); // 단품팝업목록
    const [updateDataSource, setUpdateDataSource] = useState([]); // 상단 Table 수정값

    const [bagScanId, setBagScanId] = useState('');
    //const [command, setCommand] = useState('');

    const [loading, setLoading] = useState(false);
    const [loadingSub, setLoadingSub] = useState(false);
    const [loadingPop, setLoadingPop] = useState(false);
    const [params, setParams] = useState({});
    const [form] = Form.useForm();
    const [dataEdit, setDataEdit] = useState(false); // Drawer 수정 우측폼 상태
    const [open, setOpen] = useState(false); // Drawer 추가 우측폼 상태
    const [onSearchItem, setOnSearchItem] = useState(false); // 물품명칭 언어추가 Modal
    const [onImgPop, setOnImgPop] = useState(false); // 이미지팝업

    //실사이미지
    const [imgReal,	setimgReal]	=	useState('');

    const [searchtext, setSearchtext] = useState('');

    // 통합검색 엔터처리
    const searchEnter = (e) => {
        if (e.key === 'Enter') {
            console.log(searchtext);
            handleSelectUnitPopupList(searchtext);
        }
    };    

    // 데이터 값 선언
    const handleXrayinformation = async () => {
        const Xrayinformationresponse = await getXrayinformationList({});
        setXrayinformationList(Xrayinformationresponse?.data?.RET_DATA);
        setDataSource([
            ...Xrayinformationresponse?.data?.RET_DATA.map((d, i) => ({
                key: d.bagScanId,
                rowdataNo: i,
                rowdata0: i + 1,
                rowdata1: d.bagScanId /*가방촬영id*/,
                rowdata2: d.unitId /*물품id*/,
                rowdata3: d.unitName /*물품명*/,
                rowdata4: d.openYn /*개봉여부*/,
                rowdata5: d.passYn /*통과여부*/,
                rowdata6: d.actionDiv /*action구분*/,
                rowdata7: d.studyLvl /*학습Level*/,
                rowdata8: d.useYn /*사용여부*/,
                rowdata9: d.frontUseYn /*정면사용여부*/,
                rowdata10: d.sideUseYn /*측면사용여부*/,
                rowdata11: d.decipMachineCd /*판독기기코드*/,
                rowdata12: d.duplexYn /*양방향여부*/,
                rowdata13: d.seq /*순번*/,
                rowdata14: d.insertDate /*등록일시*/,
                rowdata15: d.insertId /*등록자*/,
                rowdata16: d.updateDate /*수정일시*/,
                rowdata17: d.updateId /*수정자*/
            }))
        ]);
        setLoading(false);
    };

    //이미지팝업 정보 가져오기
    const selectImg = async (targetId, command) => {
        const SelectImgResponse = await SelectImgApi({
            bagScanId: targetId,
            command: command
        }); // 비동기 함수 호출    
        //setOnImgPop(true);
        setPopupimg(SelectImgResponse?.data?.RET_DATA.imgReal);       
        handleAdd();
    };

    const handleXrayinformationSub = async (Select_bagScanId) => {
        const XrayinformationresponseSub = await getXrayinformationSubList({
            bagScanId: Select_bagScanId
        });
        setXrayinformationSubList(XrayinformationresponseSub?.data?.RET_DATA);
        setDataSourceSub([
            ...XrayinformationresponseSub?.data?.RET_DATA.map((s, i) => ({
                key: s.bagConstNo,
                rowdataNo: i,
                rowdata0: i + 1,
                rowdata1: s.bagScanId /*가방촬영id*/,
                rowdata2: s.unitId /*물품id*/,
                rowdata3: s.unitName /*물품명*/,
                rowdata4: s.openYn /*개봉여부*/,
                rowdata5: s.passYn /*통과여부*/,
                rowdata6: s.actionDiv /*action구분*/,
                rowdata7: s.studyLvl /*학습Level*/,
                rowdata8: s.useYn /*사용여부*/,
                rowdata13: s.seq /*순번*/,
                rowdata14: s.insertDate /*등록일시*/,
                rowdata15: s.insertId /*등록자*/,
                rowdata16: s.answerItem /*정답물품*/,
                rowdata18: s.unitDesc /*물품설명*/,
            }))
        ]);
        setLoadingSub(false);
    };


    const [popupimg, setPopupimg] = useState('');

    const handelImgPop = (targetBagScanId, command) => {
        console.log('targetBagScanId:', targetBagScanId);	
        selectImg(targetBagScanId, command);
    }    
    
    //이미지팝업창 오픈
    const handleImgPop = (e) => {
        setOnImgPop(true);
        setPopupimg(e);	
    }
    //이미지팝업창
    const Unit_ModalOk = () => {
        setOnImgPop(false);
        form.resetFields();
    };
    //이미지팝업창
    const Unit_ModalCancel = () => {
        setOnImgPop(false);
        form.resetFields();
    };    

    // 상단 테이블 Title
    const defaultColumns = [
        {
            width: '90px',
            title: 'No',
            dataIndex: 'rowdata0',
            align: 'center',
            render: (text) => (
                <div style={{ cursor: 'pointer' }}>
                    <Tooltip title="Double Click">
                        <div>{text}</div>
                    </Tooltip>
                </div>
            )
        },
        {
            width: '90px',
            title: '가방촬영ID',
            dataIndex: 'rowdata1',
            align: 'center',
            render: (text) => (
                <div style={{ cursor: 'pointer' }}>
                    <Tooltip title="Double Click">
                        <div>{text}</div>
                    </Tooltip>
                </div>
            )
        },
        {
            width: '90px',
            title: '가방촬영ID',
            dataIndex: 'rowdata1',
            align: 'center',
            render: (rowdata1) => (
                <div style={{ cursor: 'pointer' }}>
                    <Tooltip title="수정" color="#108ee9">
                        <Button
                            type="primary"
                            onClick={() => handelImgPop(rowdata1, "403")}
                            style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                            icon={<EditFilled />}
                        >
                            이미지
                        </Button>
                    </Tooltip>
                </div>
            )
        },        
        {
            width: '90px',
            title: '물품ID',
            dataIndex: 'rowdata2',
            align: 'center',
            render: (text) => (
                <div style={{ cursor: 'pointer' }}>
                    <Tooltip title="Double Click">
                        <div>{text}</div>
                    </Tooltip>
                </div>
            )
        },
        /*
        {
            title: '정답물품',
            dataIndex: 'rowdata3',
            align: 'center',
            render: (text) => (
                <div style={{ cursor: 'pointer' }}>
                    <Tooltip title="Double Click">
                        <div>{text}</div>
                    </Tooltip>
                </div>
            )
        },*/
        {
            width: '90px',
            title: '개봉여부',
            dataIndex: 'rowdata4',
            align: 'center',
            render: (text) => (
                <div style={{ cursor: 'pointer' }}>
                    <Tooltip title="Double Click">
                        <div>{text}</div>
                    </Tooltip>
                </div>
            )
        },
        {
            width: '90px',
            title: '통과여부',
            dataIndex: 'rowdata5',
            align: 'center',
            render: (text) => (
                <div style={{ cursor: 'pointer' }}>
                    <Tooltip title="Double Click">
                        <div>{text}</div>
                    </Tooltip>
                </div>
            )
        },
        {
            width: '90px',
            title: 'Action구분',
            dataIndex: 'rowdata6',
            align: 'center',
            render: (_, { rowdata1, rowdataNo}) =>
                dataSource.length >= 1 ? (
                    <Select
                        labelInValue
                        style={{
                            width: '100%'
                        }}
                        //onChange={handleChange}
                        defaultValue={xrayinformationList[rowdataNo]?.actionDiv}
                        onChange={(e) => {
                            var arrTemp = [];
                            xrayinformationList.forEach(function (t) {
                                if (t.bagScanId === rowdata1) {
                                    //object copy
                                    const tempTargetAdd = { ...t, actionDiv: e.value };
                                    arrTemp.push(tempTargetAdd);
                                } else {
                                    arrTemp.push(t);
                                }
                            });
                            setXrayinformationList(arrTemp);
                        }}
                        options={[
                            {
                                value: '0',
                                label: '0'
                            },
                            {
                                value: '1',
                                label: '1'
                            },
                            {
                                value: '2',
                                label: '2'
                            },
                            {
                                value: '3',
                                label: '3'
                            },
                            {
                                value: '4',
                                label: '4'
                            }
                        ]}
                    />
                ) : null
        },
        {
            width: '100px',
            title: '학습 난이도',
            dataIndex: 'rowdata7',
            align: 'center',
            render: (_, { rowdata1, rowdataNo, rowdata7 }) =>
                dataSource.length >= 1 ? (
                    <Select
                        labelInValue
                        style={{
                            width: '100%'
                        }}
                        //onChange={handleChange}
                        defaultValue={xrayinformationList[rowdataNo]?.studyLvl}
                        onChange={(e) => {
                            var arrTemp = [];
                            xrayinformationList.forEach(function (t) {
                                if (t.bagScanId === rowdata1) {
                                    //object copy
                                    const tempTargetAdd = { ...t, studyLvl: e.value };
                                    arrTemp.push(tempTargetAdd);
                                } else {
                                    arrTemp.push(t);
                                }
                            });
                            setXrayinformationList(arrTemp);
                        }}
                        options={[
                            {
                                value: '1',
                                label: '1Level'
                            },
                            {
                                value: '2',
                                label: '2Level'
                            },
                            {
                                value: '3',
                                label: '3Level'
                            },
                            {
                                value: '4',
                                label: '4Level'
                            },
                            {
                                value: '5',
                                label: '5Level'
                            }
                        ]}
                    />
                ) : null
        },
        {
            width: '100px',
            title: '사용여부',
            dataIndex: 'rowdata8',
            align: 'center',
            render: (_, { rowdata1, rowdataNo, rowdata8 }) =>
                dataSource.length >= 1 ? (
                    <Select
                        labelInValue
                        style={{
                            width: '100%'
                        }}
                        //onChange={handleChange}
                        defaultValue={xrayinformationList[rowdataNo]?.useYn}
                        onChange={(e) => {
                            var arrTemp = [];
                            xrayinformationList.forEach(function (t) {
                                if (t.bagScanId === rowdata1) {
                                    //object copy
                                    const tempTargetAdd = { ...t, useYn: e.value };
                                    arrTemp.push(tempTargetAdd);
                                } else {
                                    arrTemp.push(t);
                                }
                            });
                            setXrayinformationList(arrTemp);
                        }}
                        options={[
                            {
                                value: 'N',
                                label: '미사용'
                            },
                            {
                                value: 'Y',
                                label: '사용'
                            }
                        ]}
                    />
                ) : null
        }
    ];

    // 하단 테이블 title
    const defaultColumnsSub = [
        {
            width: '90px',
            title: 'No',
            dataIndex: 'rowdata0',
            align: 'center'
        },
        {
            width: '90px',
            title: '가방촬영ID',
            dataIndex: 'rowdata1',
            align: 'center'
        },
        {
            width: '90px',
            title: '물품ID',
            dataIndex: 'rowdata2',
            align: 'center'
        },
        {
            title: '물품명칭',
            dataIndex: 'rowdata3',
            align: 'center'
        },
        {
            title: '물품설명',
            dataIndex: 'rowdata18',
            align: 'center'
        },
        {
            width: '90px',
            title: '개봉여부',
            dataIndex: 'rowdata4',
            align: 'center'
        },
        {
            width: '90px',
            title: '통과여부',
            dataIndex: 'rowdata5',
            align: 'center'
        },
        {
            width: '90px',
            title: 'Action구분',
            dataIndex: 'rowdata6',
            align: 'center'
        },
        {
            width: '90px',
            title: 'Seq',
            dataIndex: 'rowdata13',
            align: 'center',
            render: (_, { rowdata1, rowdata2, rowdata13 }) => (
                <Select
                    labelInValue
                    defaultValue={{
                        value: rowdata13
                    }}
                    style={{
                        width: '100%'
                    }}
                    //onChange={handleChange}
                    onChange={(seq) => {
                        var arrTemp = [];
                        //var tempTarget = targetUnitPopupList.find(v => v.unitScanId === rowdata1);
                        //Object.preventExtensions(tempTarget);
                        targetUnitPopupList.forEach(function (t) {

                            console.log('unitId:', t.unitId );
                            console.log('rowdata2:', rowdata2);

                            if (t.unitId === rowdata2) {
                                console.log('1');
                                //object copy
                                const tempTargetAdd = { ...t, seq: seq.value };
                                arrTemp.push(tempTargetAdd);
                            } else {
                                console.log('2');
                                arrTemp.push(t);
                            }
                        });

                        //arrTemp.push(tempTargetAdd);
                        //setTargetUnitPopupList([...targetUnitPopupList, arrTemp]);

                        setTargetUnitPopupList(arrTemp);
                        console.log('targetUnitPopupList:', arrTemp);
                    }}
                    options={[
                        {
                            value: '1',
                            label: '1'
                        },
                        {
                            value: '2',
                            label: '2'
                        },
                        {
                            value: '3',
                            label: '3'
                        },
                        {
                            value: '4',
                            label: '4'
                        },
                        {
                            value: '5',
                            label: '5'
                        }
                    ]}
                />
            )
        },
        /*
        {
            width: '150px',
            title: '정답물품',
            dataIndex: 'rowdata16',
            align: 'center',
            render: (_, { rowdata1, rowdata2, rowdata16 }) => (
                <Select
                    labelInValue
                    defaultValue={{
                        value: rowdata16
                    }}
                    style={{
                        width: '100%'
                    }}
                    //onChange={handleChange}
                    onChange={(selectedAnswerItem) => {
                        var arrTemp = [];
                        //var tempTarget = targetUnitPopupList.find(v => v.unitScanId === rowdata1);
                        //Object.preventExtensions(tempTarget);
                        targetUnitPopupList.forEach(function (t) {
                            console.log('타겟:', t);
                            if (t.unitScanId === rowdata1) {
                                //object copy
                                console.log('확인1');
                                const tempTargetAdd = { ...t, answerItem: selectedAnswerItem.value };
                                arrTemp.push(tempTargetAdd);
                            } else {
                                console.log('확인2');
                                arrTemp.push(t);
                            }
                        });

                        //arrTemp.push(tempTargetAdd);
                        //setTargetUnitPopupList([...targetUnitPopupList, arrTemp]);

                        setTargetUnitPopupList(arrTemp);
                        console.log('targetUnitPopupList:', targetUnitPopupList);
                    }}
                    options={[
                        {
                            value: 'N',
                            label: '미정답'
                        },
                        {
                            value: 'Y',
                            label: '정답'
                        }
                    ]}
                />
            )
        }
        */
    ];

    // 팝업 테이블 title
    const defaultColumnsPop = [
        {
            width: '50px',
            title: 'No',
            dataIndex: 'rowdata0',
            align: 'center'
        },
        {
            width: '100px',
            title: '가방촬영ID',
            dataIndex: 'rowdata1',
            align: 'center'
        },
        {
            width: '100px',
            title: '물품ID',
            dataIndex: 'rowdata2',
            align: 'center'
        },
        {
            width: '100px',
            title: '물품명칭',
            dataIndex: 'rowdata3',
            align: 'center'
        },
        {
            title: '물품설명',
            dataIndex: 'rowdata18',
            align: 'center'
        },
        {
            width: '100px',
            title: '개봉여부',
            dataIndex: 'rowdata4',
            align: 'center'
        },
        {
            width: '100px',
            title: '통과여부',
            dataIndex: 'rowdata5',
            align: 'center'
        },
        {
            width: '200px',
            title: 'Action구분',
            dataIndex: 'rowdata6',
            align: 'center'
        }
    ];

    //정답물품선택
    const handleChange = (value) => {
        console.log(`selected ${value}`);
    };

    // 타이틀 컬럼  = 데이터 컬럼 Index세팅
    const handleSave = (row) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row
        });
        setDataSource(newData);
    };


    const columns = defaultColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave
            })
        };
    });

    const columnsSub = defaultColumnsSub.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave
            })
        };
    });

    const columnsPop = defaultColumnsPop.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave
            })
        };
    });

    //체크 박스 이벤트 (상단)
    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    //체크 박스 이벤트 (하단)
    const onSelectChangeSub = (newSelectedRowKeysSub) => {
        console.log('selectedRowKeysSub changed: ', newSelectedRowKeysSub);
        setSelectedRowKeysSub(newSelectedRowKeysSub);
    };

    //체크 박스 이벤트 (팝업)
    const onSelectChangePop = (selectedKeyPop) => {
        console.log('selectedKeyPop changed: ', selectedKeyPop);
        setSelectedKeyPop(selectedKeyPop);
    };

    //체크 박스 선택 (상단)
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange
    };

    //체크 박스 선택 (하단)
    const rowSelectionSub = {
        selectedRowKeysSub,
        onChange: onSelectChangeSub
    };

    //체크 박스 선택 (팝업)
    const rowSelectionPop = {
        selectedKeyPop,
        onChange: onSelectChangePop
    };

    // 수정 (상단)
    const handleEdit = async () => {
        setLoading(true);

        console.log('수정 selectedRowKeys:', selectedRowKeys);



        if (selectedRowKeys == '') {
            Modal.error({
                content: '수정할 항목을 선택해주세요.'
            });
        } else {

            var arrTemp = [];
            xrayinformationList.forEach(function (t) {
                selectedRowKeys.forEach(function (tg) {
                    //console.log(tg);
                    if (t.bagScanId === tg) {
                        //object copy
                        arrTemp.push(t);
                    }
                });             

            });            

            console.log('수정 arrTemp:', arrTemp);
            const response = await updateXrayContents({
                paramList: arrTemp
            });
            setLoading(false);

            if (response?.data?.RET_CODE === '0000' || response?.data?.RET_CODE === '0100') {
                Modal.success({
                    content: response?.data?.RET_DESC
                });
            } else {
                Modal.success({
                    content: response?.data?.RET_DESC
                });
            }
            handleXrayinformation(); // 그룹 api 호출
        }
    };

    // 삭제 (상단)
    const handleDel = () => {
        if (selectedRowKeys == '') {
            Modal.error({
                content: '삭제할 항목을 선택해주세요.'
            });
        } else {
            confirm({
                title: '선택한 항목을 삭제하시겠습니까?',
                icon: <ExclamationCircleFilled />,
                content: selectedRowKeys + ' 항목의 데이터',
                okText: '예',
                okType: 'danger',
                cancelText: '아니오',
                onOk() {
                    onDeleteSubmit();
                },
                onCancel() {
                    //Modal.error({
                    //content: '삭제취소'
                    //});
                }
            });
        }
    };

    // 삭제 (하단)
    const onDeleteBottomSubmit = async () => {
        setLoading(true);
        console.log('삭제:', selectedRowKeysSub);

        const response = await deleteXrayUnit({
            bagConstList: selectedRowKeysSub
        });
        setLoading(false);

        if (response?.data?.RET_CODE === '0000' || response?.data?.RET_CODE === '0100') {
            Modal.success({
                content: response?.data?.RET_DESC
            });
        } else {
            Modal.success({
                content: response?.data?.RET_DESC
            });
        }
        handleXrayinformationSub(bagScanId); // 그룹 api 호출
    };       

    const onSaveSubmit = async () => {
        setLoading(true);
        //params.unitScanId = targetUnitPopupList[0].unitScanId;
        //params.unitId = targetUnitPopupList[0].unitId;
        //params.unitGroupCd = targetUnitPopupList[0].unitGroupCd;
        console.log('저장:', params);
        const response = await insertXrayContents({
            studyLvl: params?.studyLvl,
            //"unitId" : params?.unitId,
            //"unitScanId" : params?.unitScanId,
            useYn: params?.useYn
            //"unitGroupCd" : params?.unitGroupCd
        });
        setLoading(false);
        if (response?.data?.RET_CODE === '0000' || response?.data?.RET_CODE === '0100') {
            Modal.success({
                content: response?.data?.RET_DESC
            });
        } else {
            Modal.success({
                content: response?.data?.RET_DESC
            });
        }
        handleXrayinformation(); // 그룹 api 호출
        //handleXrayinformationSub(params?.unitScanId);
    };

    const onDeleteSubmit = async () => {
        setLoading(true);
        console.log('삭제:', selectedRowKeys);

        const response = await deleteXrayContents({
            bagScanIds: selectedRowKeys
        });
        setLoading(false);

        if (response?.data?.RET_CODE === '0000' || response?.data?.RET_CODE === '0100') {
            Modal.success({
                content: response?.data?.RET_DESC
            });
        } else {
            Modal.success({
                content: response?.data?.RET_DESC
            });
        }
        handleXrayinformation(); // 그룹 api 호출
    };

    const onDelete = async () => {
        setLoading(true);
        params.unitScanId = targetUnitPopupList.unitScanId;
        params.unitId = targetUnitPopupList.unitId;
        params.unitGroupCd = targetUnitPopupList.unitGroupCd;
        console.log('저장:', params);
        const response = await insertXrayContents({
            studyLvl: params?.studyLvl,
            unitId: params?.unitId,
            unitScanId: params?.unitScanId,
            useYn: params?.useYn,
            unitGroupCd: params?.unitGroupCd
        });
        setLoading(false);
        if (response?.data?.RET_CODE === '0000' || response?.data?.RET_CODE === '0100') {
            Modal.success({
                content: response?.data?.RET_DESC
            });
        } else {
            Modal.success({
                content: response?.data?.RET_DESC
            });
        }
        handleXrayinformation(); // 그룹 api 호출
        //handleXrayinformationSub(params?.unitScanId);
    };

    // 하단 저장
    const handleSaveSub = async () => {
        setLoading(true);

        console.log('하단저장');
        console.log('bagScanId:', bagScanId);

        const response = await insertXrayUnit({
            bagScanId: bagScanId,
            paramList: targetUnitPopupList
        });
        setLoading(false);
        if (response?.data?.RET_CODE === '0000' || response?.data?.RET_CODE === '0100') {
            Modal.success({
                content: response?.data?.RET_DESC
            });
        } else {
            Modal.success({
                content: response?.data?.RET_DESC
            });
        }
        handleXrayinformation(); // 그룹 api 호출
        //handleXrayinformationSub(params?.unitScanId);
    };

    // 수정 (하단)
    const handleEditSub = () => {
        Modal.success({
            content: '저장완료'
        });
    };

    // 삭제 (하단)
    const handleDelSub = () => {
        if (selectedRowKeysSub == '') {
            Modal.error({
                content: '삭제할 항목을 선택해주세요.'
            });
        } else {
            confirm({
                title: '선택한 항목을 삭제하시겠습니까?',
                icon: <ExclamationCircleFilled />,
                content: selectedRowKeysSub + ' 항목의 데이터',
                okText: '예',
                okType: 'danger',
                cancelText: '아니오',
                onOk() {
                    onDeleteBottomSubmit();
                },
                onCancel() {
                    //Modal.error({
                    //content: '삭제취소'
                    //});
                }
            });
        }
    };

    // 추가버튼(상단)
    const handleAdd = () => {
        setDataEdit(false);
        setOpen(true);
        setParams(null);
        form.resetFields();
    };

    // 추가 취소(상단)
    const onAddClose = () => {
        console.log('취소');
        setOpen(false);
        setDataEdit(false);
        form.resetFields();
    };

    // 물품명칭 언어 추가 Start
    const Unit_Language = () => {
        setOnSearchItem(true);
    };
    const Unit_LanguageOk = () => {
        setOnSearchItem(false);
        form.resetFields();
    };
    const Unit_LanguageCancel = () => {
        setOnSearchItem(false);
        form.resetFields();
    };
    const Unit_LanguageAdd = (values) => {
        console.log('Received values of form:', values);
    };

    //물품팝업리스트호출
    const handleUnitPoupList = () => {
        setOnSearchItem(true);
        handleSelectUnitPopupList();
    };

    //물품팝업리스트
    const handleSelectUnitPopupList = async (searchval) => {
        const popupList = await selectUnitPopupList({ languageCode: 'kr', searchval: searchval });
        setUnitPopupList(popupList?.data?.RET_DATA);
        setTargetUnitPopupList(popupList?.data?.RET_DATA);
        setDataSourcePop([
            ...popupList?.data?.RET_DATA.map((s, i) => ({
                key: s.unitScanId,
                rowdata0: i + 1,
                rowdata1: s.unitScanId /*가방촬영id*/,
                rowdata2: s.unitId /*물품id*/,
                rowdata3: s.unitName /*물품명*/,
                rowdata4: s.openYn /*개봉여부*/,
                rowdata5: s.passYn /*통과여부*/,
                rowdata6: s.actionDiv /*action구분*/,
                rowdata7: s.studyLvl /*학습Level*/,
                rowdata8: s.useYn /*사용여부*/,
                rowdata13: s.seq /*순번*/,
                rowdata14: s.insertDate /*등록일시*/,
                rowdata15: s.insertId /*등록자*/,
                rowdata18: s.unitDesc /*물품설명*/
            }))
        ]);
        setLoadingSub(false);
    };

    //물품선택팝업 -> 선택버튼클릭
    const handleSelectPop = () => {
        let arrTemp = [];
        selectedKeyPop.forEach(function (e) {
            arrTemp.push(unitPopupList.find((v) => v.unitScanId === e));
        });
        setTargetUnitPopupList(arrTemp);
        //form.resetFields();

        setDataSourceSub(
            arrTemp.map((s, i) => ({
                key: s.unitScanId,
                rowdata0: i + 1,
                rowdata1: s.unitScanId /*가방촬영id*/,
                rowdata2: s.unitId /*물품id*/,
                rowdata3: s.unitName /*물품명*/,
                rowdata4: s.openYn /*개봉여부*/,
                rowdata5: s.passYn /*통과여부*/,
                rowdata6: s.actionDiv /*action구분*/,
                rowdata7: s.studyLvl /*학습Level*/,
                rowdata8: s.useYn /*사용여부*/,
                rowdata13: s.seq /*순번*/,
                rowdata14: s.insertDate /*등록일시*/,
                rowdata15: s.insertId /*등록자*/,
                rowdata18: s.unitDesc /*물품설명*/
            }))
        ); //하단리스트목록초기화
        setOnSearchItem(false); //팝업창닫기
    };

    useEffect(() => {
        setLoading(true); // 로딩 호출
        handleXrayinformation(); // 그룹 api 호출
    }, []);

    return (
        <>
            <MainCard title="정보 관리">
                <Typography variant="body1">
                    <Row>
                        <Col span={8}>
                            0 | 개봉/금지 | OPEN / Prohibited <br/>
                            1 | 미개봉/금지 | CLOSE / Prohibited <br/>
                            2 | 개봉/제한 | OPEN / Restricted <br/>
                            3 | 개봉/통과 | OPEN / PASS <br/>
                            4 | 미개봉/통과 | CLOSE / PASS
                        </Col>  
                    </Row>
                    <Row style={{ marginBottom: '5px' }}>
                        <Col span={8}></Col>
                        <Col span={8} offset={8} style={{ textAlign: 'right' }}>
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
                                <Tooltip title="수정">
                                    <Button
                                        type="primary"
                                        onClick={handleEdit}
                                        style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                        icon={<EditFilled />}
                                    >
                                        수정
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
                    <Table
                        size="small"
                        bordered={true}
                        dataSource={dataSource}
                        loading={loading}
                        columns={columns}
                        rowSelection={rowSelection}
                        rowClassName={(record) => {
                            return record.rowdata0 === bagScanId ? `table-row-lightblue` : '';
                        }}
                        onRow={(record) => {
                            return {
                                /*이벤트
                                onDoubleClick: () => {
                                    if (record.rowdata0 !== bagScanId) {
                                        setLoadingSub(true);
                                        setBagScanId(record.rowdata0);
                                        handleXrayinformationSub(record.rowdata0);
                                    }
                                }*/

                                onDoubleClick: () => {
                                    console.log('click:', record.rowdata1);
                                    if (record.rowdata0 !== bagScanId) {
                                        setLoadingSub(true);
                                        setBagScanId(record.rowdata1);
                                        handleXrayinformationSub(record.rowdata1);
                                    }
                                }
                            };
                        }}
                        scroll={{
                            y: 245
                        }}
                    />

                    {/*</Skeleton>*/}
                </Typography>
            </MainCard>

            <MainCard>
                {/*<Skeleton loading={loadingSub} active>*/}
                <Row style={{ marginTop: '20px', marginBottom: '5px' }}>
                    <Col span={8}></Col>
                    <Col span={8} offset={8} style={{ textAlign: 'right' }}>
                        <Space>
                            <Tooltip title="물품추가">
                                <Button
                                    type="success"
                                    onClick={() => handleUnitPoupList()}
                                    style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                    icon={<PlusOutlined />}
                                >
                                    물품추가
                                </Button>
                            </Tooltip>

                            <Tooltip title="물품저장">
                                <Button
                                    type="primary"
                                    onClick={handleSaveSub}
                                    style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                    icon={<EditFilled />}
                                >
                                    물품저장
                                </Button>
                            </Tooltip>
                            <Tooltip title="물품삭제">
                                <Button
                                    type="danger"
                                    onClick={handleDelSub}
                                    style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                    icon={<DeleteFilled />}
                                >
                                    물품삭제
                                </Button>
                            </Tooltip>
                        </Space>
                    </Col>
                </Row>                
                <Form layout="vertical" name="tableSub" >
                    <Form.Item>
                        <Table
                            size="small"
                            rowClassName={() => 'editable-row'}
                            bordered={true}
                            dataSource={dataSourceSub}
                            columns={columnsSub}
                            loading={loadingSub}
                            rowSelection={rowSelectionSub}
                            pagination={true}
                            scroll={{
                                y: 300
                            }}
                        />
                    </Form.Item>
                </Form>
            </MainCard>

            {/* Xray 가방 추가 폼 Start */}
            <Drawer
                maskClosable={false}
                title={`Xray 가방 ${dataEdit === true ? '수정' : '추가'}`}
                onClose={onAddClose}
                open={open}
                width={800}
                style={{ top: '60px', zIndex: 888 }}
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
                                        onClick={onUpdateSubmit}
                                        style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                        type="primary"
                                    >
                                        수정
                                    </Button>
                                </Tooltip>
                            ) : (
                                <Tooltip title="추가" placement="bottom" color="#108ee9">
                                    <Button
                                        onClick={onSaveSubmit}
                                        style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                        type="primary"
                                    >
                                        저장
                                    </Button>
                                </Tooltip>
                            )}
                            <Tooltip title="삭제">
                                <Button
                                    type="danger"
                                    onClick={onDelete}
                                    style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                >
                                    삭제
                                </Button>
                            </Tooltip>
                        </Space>
                    </>
                }
            >




                <MainCard>
                    <Form name="Unit_Add" layout="vertical" form={form}>
                        <Divider style={{ margin: '10px 0' }} />

                        {/* 일단 주석처리
                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="unitId"
                                    label="물품Id"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter unitId Name'
                                        }
                                    ]}
                                >
                                    <Space>
                                        <Input
                                            type="text"
                                            name="unitId"                                    
                                            value={targetUnitPopupList?.unitId}
                                            defaultValue={targetUnitPopupList?.unitId}
                                            onChange={(e) => setParams({ ...params, "unitId": e.target.value })}
                                            style={{
                                                width: '100%'
                                            }}
                                            placeholder="Please Enter unitId"
                                        />
                                        <Tooltip title="물품선택" placement="bottom">
                                            <Button onClick={()=>handleUnitPoupList()} style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}>
                                            물품선택
                                            </Button>
                                        </Tooltip>   
                                    </Space>                                 
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="unitScanId"
                                    label="물품ScanId"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter unitScanId'
                                        }
                                    ]}
                                >
                                    <Input
                                        type="text"
                                        name="unitScanId"                                       
                                        value={targetUnitPopupList?.unitScanId}
                                        defaultValue={targetUnitPopupList?.unitScanId}
                                        onChange={(e) => setParams({ ...params, "unitScanId": e.target.value })}
                                        style={{
                                            width: '100%'
                                        }}
                                        placeholder="Please Enter unitScanId"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        */}

                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="studyLvl"
                                    label="학습Level"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter 학습Level Name'
                                        }
                                    ]}
                                >
                                    <Select
                                        defaultValue={() => params?.studyLvl}
                                        onChange={(e) => setParams({ ...params, studyLvl: e })}
                                        style={{
                                            width: '100%'
                                        }}
                                        options={[
                                            {
                                                value: '1',
                                                label: '1 Level'
                                            },
                                            {
                                                value: '2',
                                                label: '2 Level'
                                            },
                                            {
                                                value: '3',
                                                label: '3 Level'
                                            },
                                            {
                                                value: '4',
                                                label: '4 Level'
                                            },
                                            {
                                                value: '5',
                                                label: '5 Level'
                                            }
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="useYn"
                                    label="사용 유무"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter useYn Name'
                                        }
                                    ]}
                                >
                                    <Select
                                        defaultValue={() => params?.useYn}
                                        onChange={(e) => setParams({ ...params, useYn: e })}
                                        style={{
                                            width: '100%'
                                        }}
                                        options={[
                                            {
                                                value: 'Y',
                                                label: '사용'
                                            },
                                            {
                                                value: 'N',
                                                label: '미사용'
                                            }
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>


                        <Row gutter={24}>
                            <Col span={24} style={{ textAlign: 'center', padding: '0 10px' }}>
                                <img src={'data:image/png;base64,'+ popupimg} />
                            </Col>
                        </Row>     

                    </Form>
                </MainCard>
            </Drawer>
            {/* 추가 폼 End */}

            {/* 물품추가 Modal Start */}
            <Modal
                open={onSearchItem}
                onOk={Unit_LanguageOk}
                onCancel={Unit_LanguageCancel}
                title="물품추가"
                width={1200}
                style={{
                    left: 130,
                    zIndex: 999
                }}
                footer={[
                    <Button
                        type="default"
                        onClick={handleSelectPop}
                        style={{ width: '100px', borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                    >
                        select
                    </Button>,
                    <Button
                        type="primary"
                        onClick={Unit_LanguageCancel}
                        style={{ width: '100px', borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                    >
                        close
                    </Button>
                ]}
            >
                <MainCard>

                    <Row gutter={24}>
                        <Box sx={{ width: '100%', ml: { xs: 0, md: 1 } }}>
                            <FormControl sx={{ width: { xs: '100%', md: 224 } }}>
                                <OutlinedInput
                                    size="small"
                                    id="header-search"
                                    startAdornment={
                                        <InputAdornment position="start" sx={{ mr: -0.5 }}>
                                            <SearchOutlined />
                                        </InputAdornment>
                                    }
                                    aria-describedby="header-search-text"
                                    inputProps={{
                                        'aria-label': 'weight'
                                    }}
                                    value={searchtext}
                                    onChange={(e) => setSearchtext(e.target.value)}
                                    onKeyPress={searchEnter}
                                    placeholder="Search..."
                                />
                            </FormControl>
                        </Box>                            
                    </Row>

                        
                    <Form layout="vertical" name="Unit_Language_Add" form={form} onFinish={Unit_LanguageAdd}>
                        <Form.Item>
                            <Table
                                size="small"
                                rowClassName={() => 'editable-row'}
                                bordered={true}
                                dataSource={dataSourcePop}
                                columns={columnsPop}
                                loading={loadingPop}
                                rowSelection={rowSelectionPop}
                                pagination={true}
                                scroll={{
                                    y: 300
                                }}
                            />
                        </Form.Item>
                    </Form>
                </MainCard>
            </Modal>
            {/* 물품추가 Modal End */}

            {/* 이미지팝업 Modal Start */}
            <Modal
                open={onImgPop}
                onOk={Unit_ModalOk}
                onCancel={Unit_ModalCancel}
                title="물품추가"
                width={800}
                style={{
                    top: 0,
                    left: 0,
                    zIndex: 999
                }}
                footer={[
                    <Button
                        type="primary"
                        onClick={Unit_ModalCancel}
                        style={{ width: '100px', borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                    >
                        close
                    </Button>
                ]}
            >
                <MainCard>
                    <Form layout="vertical" name="Unit_Language_Add" form={form} onFinish={Unit_LanguageAdd}>
                        <Form.Item>
                            <Row >
                                <Col style={{ textAlign: 'center', padding: '0 10px' }}>
                                    <img src={'data:image/png;base64,'+ popupimg} />
                                </Col>
                            </Row>
                        </Form.Item>
                    </Form>
                </MainCard>
            </Modal>

        </>
    );
};
