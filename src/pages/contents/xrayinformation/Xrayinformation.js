/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Typography } from '@mui/material';
import { Col, Row, Button, Form, Input, Table, Select, Space, Tooltip, Skeleton, Modal } from 'antd';
import {
    useGetXrayinformationListMutation,
    useGetXrayinformationSubListMutation
} from '../../../hooks/api/ContentsManagement/ContentsManagement';

import { EditFilled, DeleteFilled, ExclamationCircleFilled } from '@ant-design/icons';

// project import
import MainCard from 'components/MainCard';

const { confirm } = Modal;

export const Xrayinformation = () => {
    const [getXrayinformationList] = useGetXrayinformationListMutation(); // 콘텐츠 정보 관리 hooks api호출
    const [getXrayinformationSubList] = useGetXrayinformationSubListMutation(); // 콘텐츠 정보 관리 hooks api호출
    const [xrayinformationList, setXrayinformationList] = useState(); // 콘텐츠 정보관리 리스트 상단 값
    const [xrayinformationSubList, setXrayinformationSubList] = useState(); // 콘텐츠 정보관리 리스트 하단 값
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); //셀렉트 박스 option Selected 값(상단)
    const [selectedRowKeysSub, setSelectedRowKeysSub] = useState([]); //셀렉트 박스 option Selected 값(하단)
    const [dataSource, setDataSource] = useState([]); // 상단 Table 데이터 값
    const [dataSourceSub, setDataSourceSub] = useState([]); // 하단 Table 데이터 값
    const [bagScanId, setBagScanId] = useState('');

    const [loading, setLoading] = useState(false);
    const [loadingSub, setLoadingSub] = useState(false);

    // 데이터 값 선언
    const handleXrayinformation = async () => {
        const Xrayinformationresponse = await getXrayinformationList({});
        setXrayinformationList(Xrayinformationresponse?.data?.RET_DATA);
        setDataSource([
            ...Xrayinformationresponse?.data?.RET_DATA.map((d, i) => ({
                key: d.unitId,
                rowdata0: i + 1,
                rowdata1: d.bagScanId /*가방촬영id*/,
                rowdata2: d.unitId /*물품id*/,
                rowdata3: d.unitName /*물품명*/,
                rowdata4: d.openYn /*개봉여부*/,
                rowdata5: d.passYn /*통과여부*/,
                rowdata6: d.actionDiv /*action구분*/,
                rowdata7: d.studyLvl /*학습레벨*/,
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

    const handleXrayinformationSub = async (Select_bagScanId) => {
        const XrayinformationresponseSub = await getXrayinformationSubList({
            bagScanId: Select_bagScanId
        });
        setXrayinformationSubList(XrayinformationresponseSub?.data?.RET_DATA);
        setDataSourceSub([
            ...XrayinformationresponseSub?.data?.RET_DATA.map((s, i) => ({
                key: s.unitId,
                rowdata0: i + 1,
                rowdata1: s.bagScanId /*가방촬영id*/,
                rowdata2: s.unitId /*물품id*/,
                rowdata3: s.unitName /*물품명*/,
                rowdata4: s.openYn /*개봉여부*/,
                rowdata5: s.passYn /*통과여부*/,
                rowdata6: s.actionDiv /*action구분*/,
                rowdata7: s.studyLvl /*학습레벨*/,
                rowdata8: s.useYn /*사용여부*/,
                rowdata9: s.frontUseYn /*정면사용여부*/,
                rowdata10: s.sideUseYn /*측면사용여부*/,
                rowdata11: s.decipMachineCd /*판독기기코드*/,
                rowdata12: s.duplexYn /*양방향여부*/,
                rowdata13: s.seq /*순번*/,
                rowdata14: s.insertDate /*등록일시*/,
                rowdata15: s.insertId /*등록자*/,
                rowdata16: s.updateDate /*수정일시*/,
                rowdata17: s.updateId /*수정자*/,
                rowdata18: s.unitDesc /*물품설명*/
            }))
        ]);
        setLoadingSub(false);
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
            width: '100px',
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
            width: '100px',
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
        },
        {
            width: '100px',
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
            width: '100px',
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
            width: '100px',
            title: 'Action구분',
            dataIndex: 'rowdata6',
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
            width: '120px',
            title: '학습레벨',
            dataIndex: 'rowdata7',
            align: 'center',
            render: (_, { rowdata7 }) =>
                dataSource.length >= 1 ? (
                    <Select
                        labelInValue
                        defaultValue={{
                            value: `${rowdata7}`
                        }}
                        style={{
                            width: '100%'
                        }}
                        onChange={handleChange}
                        options={[
                            {
                                value: '1',
                                label: '1레벨'
                            },
                            {
                                value: '2',
                                label: '2레벨'
                            },
                            {
                                value: '3',
                                label: '3레벨'
                            },
                            {
                                value: '4',
                                label: '4레벨'
                            }
                        ]}
                    />
                ) : null
        },
        {
            width: '120px',
            title: '사용여부',
            dataIndex: 'rowdata8',
            align: 'center',
            render: (_, { rowdata8 }) =>
                dataSource.length >= 1 ? (
                    <Select
                        labelInValue
                        defaultValue={{
                            value: `${rowdata8}`
                        }}
                        style={{
                            width: '100%'
                        }}
                        onChange={handleChange}
                        options={[
                            {
                                value: '0',
                                label: '미사용'
                            },
                            {
                                value: '1',
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
            width: '100px',
            title: '가방촬영ID',
            dataIndex: 'rowdata1',
            align: 'center'
        },
        {
            width: '90px',
            title: '순번',
            dataIndex: 'rowdata13',
            align: 'center'
        },
        {
            width: '100px',
            title: '물품ID',
            dataIndex: 'rowdata2',
            align: 'center'
        },
        {
            width: '180px',
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
            width: '100px',
            title: 'Action구분',
            dataIndex: 'rowdata6',
            align: 'center'
        }
    ];

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

    // 수정 (상단)
    const handleEdit = () => {
        if (selectedRowKeys == '') {
            Modal.error({
                content: '수정할 항목을 선택해주세요.'
            });
        } else {
            Modal.success({
                content: '수정완료'
            });
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
                    Modal.success({
                        content: '삭제완료'
                    });
                },
                onCancel() {
                    Modal.error({
                        content: '삭제취소'
                    });
                }
            });
        }
    };

    // 수정 (하단)
    const handleEditSub = () => {
        if (selectedRowKeysSub == '') {
            Modal.error({
                content: '수정할 항목을 선택해주세요.'
            });
        } else {
            Modal.success({
                content: '수정완료'
            });
        }
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
                    Modal.success({
                        content: '삭제완료'
                    });
                },
                onCancel() {
                    Modal.error({
                        content: '삭제취소'
                    });
                }
            });
        }
    };

    useEffect(() => {
        setLoading(true); // 로딩 호출
        handleXrayinformation(); // 그룹 api 호출
    }, []);

    return (
        <>
            <MainCard title="정보 관리">
                <Typography variant="body1">
                    <Row style={{ marginBottom: '5px' }}>
                        <Col span={8}></Col>
                        <Col span={8} offset={8} style={{ textAlign: 'right' }}>
                            <Space>
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
                        components={components}
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
                                onDoubleClick: () => {
                                    if (record.rowdata0 !== bagScanId) {
                                        setLoadingSub(true);
                                        setBagScanId(record.rowdata0);
                                        handleXrayinformationSub(record.rowdata0);
                                    }
                                }
                            };
                        }}
                        scroll={{
                            y: 245
                        }}
                    />
                    <Skeleton loading={loadingSub} active>
                        <Row style={{ marginTop: '20px', marginBottom: '5px' }}>
                            <Col span={8}></Col>
                            <Col span={8} offset={8} style={{ textAlign: 'right' }}>
                                <Space>
                                    <Tooltip title="수정">
                                        <Button
                                            type="primary"
                                            onClick={handleEditSub}
                                            style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                            icon={<EditFilled />}
                                        >
                                            수정
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title="삭제">
                                        <Button
                                            type="danger"
                                            onClick={handleDelSub}
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
                            components={components}
                            rowClassName={() => 'editable-row'}
                            bordered={true}
                            dataSource={dataSourceSub}
                            columns={columnsSub}
                            loading={loadingSub}
                            rowSelection={rowSelectionSub}
                            pagination={false}
                            scroll={{
                                y: 300
                            }}
                        />
                    </Skeleton>
                </Typography>
            </MainCard>
        </>
    );
};
