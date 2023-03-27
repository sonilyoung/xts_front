/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Typography } from '@mui/material';
import { Col, Row, Button, Form, Input, Table, Select, Space, Tooltip, Tag, Badge, Modal } from 'antd';
import { useGetGroupListMutation, useGetLanguageListMutation } from '../../../hooks/api/ContentsManagement/ContentsManagement';
import { EditFilled, DeleteFilled } from '@ant-design/icons';

// project import
import MainCard from 'components/MainCard';

import { ExclamationCircleFilled } from '@ant-design/icons';
const { confirm } = Modal;

export const Goodsgroup = () => {
    const [getGroupList] = useGetGroupListMutation(); // 콘텐츠 그룹 hooks api호출
    const [groupBodyList, setGroupBodyList] = useState(); // 콘텐츠 그룹 리스트 값
    const [getLanguageList] = useGetLanguageListMutation(); // 언어 hooks api호출
    const [languageSelect, setLanguageSelect] = useState([]); //셀렉트 박스 option Default 값
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); //셀렉트 박스 option Selected 값
    const [dataSource, setDataSource] = useState([]); // Table 데이터 값
    const [defaultLanguage, setDefaultLanguage] = useState('kor');
    const [loading, setLoading] = useState(false);

    // 그룹 데이터 값 선언
    const handleGroup = async () => {
        const Groupresponse = await getGroupList({
            languageCode: defaultLanguage
        });
        setGroupBodyList(Groupresponse?.data?.RET_DATA);
        setDataSource([
            ...Groupresponse?.data?.RET_DATA.map((d, i) => ({
                key: d.unitGroupCd,
                rowdata0: i + 1,
                rowdata1: d.unitGroupCd,
                rowdata2: d.groupName,
                rowdata3: d.groupDesc,
                rowdata4: d.actionDiv,
                rowdata5: d.openYn,
                rowdata6: d.passYn,
                rowdata7: d.useYn,
                // rowdata8: d.updId,
                // rowdata9: d.updDt,
                rowdata10: d.imgFile,
                rowdata11: d.parentUnitGroupCd,
                rowdata12: d.insertDate
            }))
        ]);
        setLoading(false);
    };

    // 언어 셀렉트 Default 값 선언
    const handleLanguage = async () => {
        const Languageresponse = await getLanguageList({});
        setLanguageSelect([
            ...Languageresponse?.data?.RET_DATA?.map((lan) => ({
                value: lan.languageCode,
                label: lan.languageName
            }))
        ]);
    };

    const EditableContext = React.createContext(null);
    const EditableRow = ({ index, ...props }) => {
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
                // Data값이 변경될 경우 체크박스 체크
                if (record[dataIndex] !== values[dataIndex]) {
                    selectedRowKeys.length <= '0'
                        ? onSelectChange([...selectedRowKeys, record.key])
                        : selectedRowKeys.map((srk) => (srk === record.key ? '' : onSelectChange([...selectedRowKeys, record.key])));
                }
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

    const defaultColumns = [
        {
            width: '50px',
            title: 'No',
            dataIndex: 'rowdata0',
            align: 'center'
        },
        {
            width: '105px',
            title: '물품분류코드',
            dataIndex: 'rowdata1',
            align: 'center'
        },
        {
            width: '180px',
            title: '물품분류명칭',
            dataIndex: 'rowdata2',
            editable: true,
            align: 'center'
        },
        {
            title: '물품분류설명',
            dataIndex: 'rowdata3',
            editable: true,
            align: 'center'
        },
        // {
        //     width: '100px',
        //     title: 'Action구분',
        //     dataIndex: 'rowdata4',
        //     editable: true
        // },
        {
            width: '90px',
            title: '개봉여부',
            dataIndex: 'rowdata5',
            align: 'center',
            render: (_, { rowdata5 }) => (
                <>{rowdata5 === 'CLOSE' ? <Badge count={rowdata5} color="#bfbfbf" /> : <Badge count={rowdata5} color="#52c41a" />}</>
            )
        },
        {
            width: '100px',
            title: '통과여부',
            dataIndex: 'rowdata6',
            align: 'center',
            render: (_, { rowdata6 }) => (
                <>{rowdata6 === 'PASS' ? <Badge count={rowdata6} color="#2db7f5" /> : <Badge count={rowdata6} color="#faad14" />}</>
            )
        },
        {
            width: '80px',
            title: '사용여부',
            dataIndex: 'rowdata7',
            align: 'center',
            render: (_, { rowdata7 }) => (
                <>
                    {rowdata7 === 'Y' ? (
                        <Tag color={'green'} key={rowdata7} onClick={(e) => handelUser()}>
                            사용
                        </Tag>
                    ) : (
                        <Tag color={'volcano'} key={rowdata7} onClick={(e) => handelUser()}>
                            미사용
                        </Tag>
                    )}
                </>
            )
        },
        {
            width: '120px',
            title: '이미지파일',
            dataIndex: 'rowdata10',
            render: (_, { rowdata10 }) =>
                rowdata10 === '' || rowdata10 === undefined || rowdata10 === null ? (
                    <>-</>
                ) : (
                    <img src={'data:image/png;base64,' + rowdata10} width="90" alt="images" />
                ),
            align: 'center'
        },
        {
            width: '110px',
            title: '하위물품분류',
            dataIndex: 'rowdata11',
            align: 'center'
        }
        // {
        //     width: '100px',
        //     title: '등록일자',
        //     dataIndex: 'rowdata12',
        //     align: 'center'
        // }
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

    const onChange = (value) => {
        console.log(`selected ${value}`);
        setDefaultLanguage(value);
    };

    const onSearch = (value) => {
        console.log('search:', value);
    };

    const handelUser = (e) => {
        console.log(e, '사용여부');
    };

    useEffect(() => {
        setLoading(true); // 로딩 호출
        handleGroup(); // 그룹 api 호출
        handleLanguage(); // api 호출
    }, [defaultLanguage]);

    return (
        <>
            <MainCard title="그룹 관리">
                <Typography variant="body1">
                    <Row style={{ marginBottom: 16 }}>
                        <Col span={8}>
                            <Select
                                showSearch
                                placeholder=" Language Select "
                                optionFilterProp="children"
                                onChange={onChange}
                                onSearch={onSearch}
                                options={[...languageSelect]}
                            />
                        </Col>
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
                        components={components}
                        rowClassName={() => 'editable-row'}
                        bordered={true}
                        dataSource={dataSource}
                        loading={loading}
                        columns={columns}
                        rowSelection={rowSelection}
                    />
                </Typography>
            </MainCard>
        </>
    );
};
