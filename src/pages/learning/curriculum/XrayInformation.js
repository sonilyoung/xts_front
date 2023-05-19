/* eslint-disable*/
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Typography } from '@mui/material';
import { Table, Button, Input, Form, Modal } from 'antd';

import { useGetXrayinformationListMutation } from '../../../hooks/api/ContentsManagement/ContentsManagement';

// project import
import MainCard from 'components/MainCard';

export const XrayInformation = (props) => {
    const { confirm } = Modal;
    const [getXrayinformationList] = useGetXrayinformationListMutation(); // 콘텐츠 정보 관리 hooks api호출
    const [xrayinformationList, setXrayinformationList] = useState(); // 콘텐츠 정보관리 리스트 상단 값

    const [selectedRowKeys, setSelectedRowKeys] = useState([]); //셀렉트 박스 option Selected 값(상단)
    const [dataSource, setDataSource] = useState([]); // 상단 Table 데이터 값

    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

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

    const EditableContext = React.createContext(null);
    const EditableRow = ({ ...props }) => {
        const [form] = Form.useForm();
        return (
            <Form form={form} component={false}>
                <EditableContext.Provider value={form}>
                    <tr {...props} />
                </EditableContext.Provider>
            </Form>
        );
    };

    const EditableCell = ({ title, editable, children, dataIndex, record, handleSave, ...restProps }) => {
        const [editing, setEditing] = useState(false);
        const inputRef = useRef(null);
        const form = useContext(EditableContext);
        useEffect(() => {
            if (editing) {
                inputRef.current.focus();
            }
        }, [editing]);

        const toggleEdit = () => {
            setEditing(!editing);
            form.setFieldsValue({
                [dataIndex]: record[dataIndex]
            });
        };

        const save = async () => {
            try {
                const values = await form.validateFields();
                toggleEdit();
                handleSave({
                    ...record,
                    ...values
                });
            } catch (errInfo) {
                console.log('Save failed:', errInfo);
            }
        };
        let childNode = children;
        if (editable) {
            childNode = editing ? (
                <Form.Item style={{ margin: 0 }} name={dataIndex} rules={[{ required: true, message: `${title} is required.` }]}>
                    <Input ref={inputRef} onPressEnter={save} onBlur={save} />
                </Form.Item>
            ) : (
                <div className="editable-cell-value-wrap" onClick={toggleEdit} aria-hidden="true">
                    {children}
                </div>
            );
        }
        return <td {...restProps}>{childNode}</td>;
    };

    // 상단 테이블 Title
    const defaultColumns = [
        {
            width: '90px',
            title: 'No',
            dataIndex: 'rowdata0',
            align: 'center'
        },
        {
            width: '120px',
            title: '가방촬영ID',
            dataIndex: 'rowdata1',
            align: 'center'
        },
        {
            width: '120px',
            title: '물품ID',
            dataIndex: 'rowdata2',
            align: 'center'
        },
        {
            title: '정답물품',
            dataIndex: 'rowdata3',
            align: 'center'
        },
        {
            width: '80px',
            title: '개봉여부',
            dataIndex: 'rowdata4',
            align: 'center'
        },
        {
            width: '80px',
            title: '통과여부',
            dataIndex: 'rowdata5',
            align: 'center'
        },
        {
            width: '80px',
            title: 'Action구분',
            dataIndex: 'rowdata6',
            align: 'center'
        },
        {
            width: '80px',
            title: '학습Level',
            dataIndex: 'rowdata7',
            align: 'center'
        },
        {
            width: '80px',
            title: '사용여부',
            dataIndex: 'rowdata8',
            align: 'center'
        }
    ];

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

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell
        }
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

    //체크 박스 이벤트 (상단)
    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    //체크 박스 선택 (상단)
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange
    };

    const QuestionsOk = () => {
        //console.log(selectedRowKeys);
        props.QuestionCnt(selectedRowKeys);
    };

    useEffect(() => {
        setLoading(true); // 로딩 호출
        handleXrayinformation(); // 그룹 api 호출
    }, []);

    return (
        <>
            <MainCard title="정보 관리">
                <Typography variant="body1">
                    <Table
                        size="middle"
                        components={components}
                        bordered={true}
                        dataSource={dataSource}
                        loading={loading}
                        columns={columns}
                        rowSelection={rowSelection}
                    />
                    <Button
                        type="primary"
                        onClick={QuestionsOk}
                        style={{ width: '100px', borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                    >
                        선택 완료
                    </Button>
                </Typography>
            </MainCard>
        </>
    );
};
