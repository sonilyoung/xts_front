/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Typography } from '@mui/material';
import { Col, Row, Button, Form, Input, Table, Space, Tooltip, Tag, Skeleton, Modal } from 'antd';
import { useGetXrayPointListMutation, useGetXrayPointSubListMutation } from '../../../hooks/api/LearningMaqnagement/LearningMaqnagement';
import { EditFilled, DeleteFilled, ExclamationCircleFilled } from '@ant-design/icons';

// project import
import MainCard from 'components/MainCard';

const { confirm } = Modal;

export const XrayPoint = () => {
    const [getXrayPointList] = useGetXrayPointListMutation(); // 콘텐츠 정보 관리 hooks api호출
    const [getXrayPointSubList] = useGetXrayPointSubListMutation(); // 콘텐츠 정보 관리 hooks api호출
    const [xrayPointList, setXrayPointList] = useState(); // 콘텐츠 정보관리 리스트 상단 값
    const [xrayPointSubList, setXrayPointSubList] = useState(); // 콘텐츠 정보관리 리스트 하단 값
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); //셀렉트 박스 option Selected 값(상단)
    const [selectedRowKeysSub, setSelectedRowKeysSub] = useState([]); //셀렉트 박스 option Selected 값(하단)
    const [dataSource, setDataSource] = useState([]); // 상단 Table 데이터 값
    const [dataSourceSub, setDataSourceSub] = useState([]); // 하단 Table 데이터 값
    const [bagScanId, setBagScanId] = useState('');

    const [loading, setLoading] = useState(false);
    const [loadingSub, setLoadingSub] = useState(false);

    // 데이터 값 선언
    const handleXrayPoint = async () => {
        const xrayPointresponse = await getXrayPointList({});
        setXrayPointList(xrayPointresponse?.data?.RET_DATA);
        setDataSource([
            ...xrayPointresponse?.data?.RET_DATA.map((d, i) => ({
                key: d.pointsStdId,
                rowdata0: i + 1,
                rowdata1: d.pointsStdId /* 배점기준id */,
                rowdata2: d.pointsStdNm /* 배점기준명칭 */,
                rowdata3: d.pointsStdDc /* 배점기준설명 */,
                rowdata4: d.useYn /* 사용여부 */
            }))
        ]);
        setLoading(false);
    };

    const handleXrayPointSub = async (Select_bagScanId) => {
        const xrayPointresponseSub = await getXrayPointSubList({
            bagScanId: Select_bagScanId
        });
        setXrayPointSubList(xrayPointresponseSub?.data?.RET_DATA);
        setDataSourceSub([
            ...xrayPointresponseSub?.data?.RET_DATA.map((s, i) => ({
                key: s.pointsStdId,
                rowdata0: i + 1,
                rowdata1: s.pointsStdId /* 배점기준id */,
                rowdata2: s.actionDiv /* action구분 */,
                rowdata3: s.actionNm /* action구분명 */,
                rowdata4: s.banUnitScore /* 금지물품점수 */,
                rowdata5: s.limitUnitScore /* 제한물품점수 */,
                rowdata6: s.questionUnitScore /* 의심물품점수 */,
                rowdata7: s.passUnitScore /* 통과물품점수 */
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
            title: '배점기준ID',
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
            title: '배점기준명칭',
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
            title: '배점기준설명',
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
            title: '사용여부',
            dataIndex: 'rowdata4',
            align: 'center',
            render: (_, { rowdata4 }) => (
                <>
                    {rowdata4 === '1' ? (
                        <Tag color={'green'} key={rowdata4} onClick={() => handelUser('1')}>
                            사용
                        </Tag>
                    ) : (
                        <Tag color={'volcano'} key={rowdata4} onClick={() => handelUser('0')}>
                            미사용
                        </Tag>
                    )}
                </>
            )
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
            title: 'Action구분',
            dataIndex: 'rowdata3',
            align: 'center'
        },
        {
            title: '금지물품점수',
            dataIndex: 'rowdata4',
            align: 'center'
        },
        {
            title: '제한물품점수',
            dataIndex: 'rowdata5',
            align: 'center'
        },
        {
            title: '의심물품점수',
            dataIndex: 'rowdata6',
            align: 'center'
        },
        {
            title: '통과물품점수',
            dataIndex: 'rowdata7',
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

    //체크 박스 이벤트(상단)
    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    //체크 박스 이벤트(하단)
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

    const handelUser = (value) => {
        console.log(`selected ${value}`);
    };

    // 수정
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

    // 수정
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

    // 삭제
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
        handleXrayPoint(); // api 호출
    }, []);

    return (
        <>
            <MainCard title="X-ray 판독 배점관리">
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
                                        handleXrayPointSub(record.rowdata0);
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
// export default XrayPoint;
