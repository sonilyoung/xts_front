/* eslint-disable*/
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Typography } from '@mui/material';
import { Col, Row, Button, Form, Input, Table, Select, Space, Tooltip, Tag, Badge, Divider, Card, Modal, Drawer } from 'antd';
import { PlusOutlined, EditFilled, DeleteFilled, UploadOutlined, MinusCircleOutlined } from '@ant-design/icons';
import {
    useGetLanguageListMutation,
    useGetGroupListMutation,
    useGetGroupMutation,
    useInsertUnitGroupMutation, //그룹등록
    useUpdateUnitGroupMutation, //그룹수정
    useDeleteUnitGroupMutation, //그룹삭제
    useInsertUnitGroupImgMutation //이미지등록
} from '../../../hooks/api/ContentsManagement/ContentsManagement';

// project import
import MainCard from 'components/MainCard';
import noImage from 'assets/images/no_imgae.png';
import { ExclamationCircleFilled } from '@ant-design/icons';
const { confirm } = Modal;

export const Goodsgroup = () => {
    const [getLanguageList] = useGetLanguageListMutation(); // 언어 hooks api호출

    const [getGroupList] = useGetGroupListMutation(); // 목록 콘텐츠 그룹 hooks api호출
    const [getGroup] = useGetGroupMutation(); // 상세 콘텐츠 그룹 hooks api호출
    const [insertGroup] = useInsertUnitGroupMutation(); // 등록 콘텐츠 그룹 hooks api호출
    const [updateGroup] = useUpdateUnitGroupMutation(); // 수정 콘텐츠 그룹 hooks api호출
    const [deleteGroup] = useDeleteUnitGroupMutation(); // 삭제 콘텐츠 그룹 hooks api호출
    const [saveImg] = useInsertUnitGroupImgMutation(); // 이미지등록 콘텐츠 그룹 hooks api호출

    const [groupBodyList, setGroupBodyList] = useState(); // 콘텐츠 그룹 리스트 값
    const [languageSelect, setLanguageSelect] = useState([]); //셀렉트 박스 option Default 값
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); //셀렉트 박스 option Selected 값
    const [dataSource, setDataSource] = useState([]); // Table 데이터 값
    const [languageCode, setLanguageCode] = useState('kr');
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false); // Drawer 추가 우측폼 상태
    const [dataEdit, setDataEdit] = useState(false); // Drawer 수정 우측폼 상태
    const [imgEdit, setImgEdit] = useState(false); // 이미지업로드를 위한 상태값
    const [refresh, setRefresh] = useState(false); //리프레쉬
    const [form] = Form.useForm();
    const [imgFile1, setImgFile1] = useState('');
    const [imgFile, setImgFile] = useState(null); // 파일 업로드 실물 이미지
    const [searchval, setSearchval] = useState();

    const [unitParams, setUnitParams] = useState({
        parentUnitGroupCd: '',
        openYn: '',
        passYn: '',
        languageCode: '',
        groupName: '',
        groupDesc: '',
        useYn: ''
    });

    // 그룹 데이터 값 선언
    const handleGroup = async () => {
        const Groupresponse = await getGroupList({
            languageCode: languageCode
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
            width: '120px',
            title: '개봉여부',
            dataIndex: 'rowdata5',
            align: 'center',
            render: (_, { rowdata5 }) => (
                <>{rowdata5 === 'CLOSE' ? <Badge count={rowdata5} color="#bfbfbf" /> : <Badge count={rowdata5} color="#52c41a" />}</>
            )
        },
        {
            width: '150px',
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
                    <img src={'data:image/svg+xml;base64,' + rowdata10} width="90" alt="images" />
                ),
            align: 'center'
        },
        {
            width: '110px',
            title: '수정',
            align: 'center',
            render: (rowdata1) => (
                <>
                    <Tooltip title="수정" color="#108ee9">
                        <Button
                            onClick={() => handleUnitMod({ rowdata1 })}
                            type="primary"
                            style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                            icon={<EditFilled />}
                        >
                            수정
                        </Button>
                    </Tooltip>
                </>
            )
        }
        //{
        //width: '110px',
        //title: '하위물품분류',
        //dataIndex: 'rowdata11',
        //align: 'center'
        //}
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

    const fileInput1 = React.createRef();
    const handleButtonClick1 = (e) => {
        imgRef1.current.click();
    };

    // 이미지 업로드 input의 onChange
    const imgRef1 = useRef();
    const saveImgFile1 = () => {
        const file = imgRef1.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setImgFile1(reader.result);
        };
        setImgFile(file);
        setImgEdit(false);
    };

    // 실물 이미지 업로드 처리
    /*const handleUpload = async () => {
        let formData = new FormData();
        
        formData.append('params', new Blob([JSON.stringify(params)], { type: 'application/json' }));

        formData.append('imgFile', imgFile);
        console.log('imgFile: ', imgFile);

        const response = await saveImg(formData);
        console.log('결과:', response);
        setRefresh(response);
    };*/

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
        setLanguageCode(value);
    };

    const onlangSearch = (value) => {
        console.log('search:', value);
    };

    const handelUser = (e) => {
        console.log(e, '사용여부');
    };

    // 물품 추가 버튼
    const handleAdd = () => {
        setDataEdit(false);
        setOpen(true);
        setUnitParams(null);
        form.resetFields();
    };

    // 물품 수정 버튼
    const handleUnitMod = async (e) => {
        console.log('상세:', e);
        const response = await getGroup({
            languageCode: languageCode,
            unitGroupCd: e?.rowdata1?.key
        });

        //console.log('unitName2:',response.data.RET_DATA.unitName);
        setUnitParams(response.data.RET_DATA);
        //params = response.data.RET_DATA;
        form.resetFields();
        setDataEdit(true);
        setImgEdit(true);
        setOpen(true);
    };

    // 추가 취소
    const onAddClose = () => {
        setOpen(false);
        setDataEdit(false);
        form.resetFields();
    };

    //단품저장
    const onSaveSubmit = async () => {
        console.log('저장:', unitParams);

        const response = await insertGroup({
            parentUnitGroupCd: unitParams?.parentUnitGroupCd,
            openYn: unitParams?.openYn,
            passYn: unitParams?.passYn,
            useYn: unitParams?.useYn,
            languageCode: unitParams?.languageCode,
            groupName: unitParams?.groupName,
            groupDesc: unitParams?.groupDesc
        });

        let formData = new FormData();
        const params = { unitGroupCd: unitParams?.unitGroupCd };
        formData.append('params', new Blob([JSON.stringify(params)], { type: 'application/json' }));
        formData.append('imgFile', imgFile);
        console.log('imgFile: ', imgFile);
        const responseFile = await saveImg(formData);

        setRefresh(response);
        Modal.success({
            content: '추가 완료',
            onOk() {
                setOpen(false);
                setDataEdit(false);
                form.resetFields();
            }
        });
    };

    //단품수정
    const onUpdateSubmit = async () => {
        console.log('수정:', unitParams);

        const response = await updateGroup({
            unitGroupCd: unitParams?.unitGroupCd,
            parentUnitGroupCd: unitParams?.parentUnitGroupCd,
            openYn: unitParams?.openYn,
            passYn: unitParams?.passYn,
            useYn: unitParams?.useYn,
            languageCode: unitParams?.languageCode,
            groupName: unitParams?.groupName,
            groupDesc: unitParams?.groupDesc
        });

        let formData = new FormData();
        const params = { unitGroupCd: unitParams?.unitGroupCd };
        formData.append('params', new Blob([JSON.stringify(params)], { type: 'application/json' }));
        formData.append('imgFile', imgFile);
        console.log('imgFile: ', imgFile);
        const responseFile = await saveImg(formData);
        setImgFile(null);

        setRefresh(response);
        Modal.success({
            content: '수정 완료',
            onOk() {
                setOpen(false);
                setDataEdit(false);
                form.resetFields();
            }
        });
    };

    //단품삭제
    const onDelete = async () => {
        const response = await deleteGroup({
            unitGroupCd: unitParams?.unitGroupCd,
            languageCode: unitParams?.languageCode
        });
        setRefresh(response);
        Modal.success({
            content: '삭제 완료',
            onOk() {
                setOpen(false);
                setDataEdit(false);
                form.resetFields();
            }
        });
    };

    const onSearch = (value) => {
        setSearchval(value);
    };

    useEffect(() => {
        setLoading(true); // 로딩 호출
        handleGroup(); // 그룹 api 호출
        handleLanguage(); // api 호출
    }, [languageCode, refresh, searchval]);

    return (
        <>
            <MainCard title="반입금지물품 관리">
                <Typography variant="body1">
                    <Row style={{ marginBottom: 16 }}>
                        <Col span={16}>
                            <Select
                                showSearch
                                placeholder=" Language Select "
                                optionFilterProp="children"
                                onChange={onChange}
                                onSearch={onlangSearch}
                                options={[...languageSelect]}
                            />
                        </Col>
                        <Col span={16} offset={8} style={{ textAlign: 'right' }}>
                            <Space>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '14px' }}>
                                    <Input.Search
                                        placeholder="※ 통합 검색 (물품분류코드, 물품분류명칭, 물품분류설명)"
                                        style={{ width: 480 }}
                                        onSearch={onSearch}
                                        allowClear
                                        enterButton
                                        size="middle"
                                        className="custom-search-input"
                                    />
                                </div>
                                <Tooltip title="추가">
                                    <Button
                                        type="primary"
                                        onClick={handleAdd}
                                        style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                        icon={<EditFilled />}
                                    >
                                        추가
                                    </Button>
                                </Tooltip>
                            </Space>
                        </Col>
                    </Row>
                    <Table
                        components={components}
                        //rowClassName={() => 'editable-row'}
                        bordered={true}
                        dataSource={dataSource}
                        loading={loading}
                        columns={columns}
                        //rowSelection={rowSelection}
                    />
                </Typography>
            </MainCard>

            {/* 반입금지물품 추가 폼 Start */}
            <Drawer
                maskClosable={false}
                title={`반입금지물품 ${dataEdit === true ? '수정' : '추가'}`}
                onClose={onAddClose}
                open={open}
                width={500}
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
                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="groupName"
                                    label="물품명"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter groupName Name'
                                        }
                                    ]}
                                >
                                    <Input
                                        type="text"
                                        name="groupName"
                                        value={unitParams?.groupName}
                                        defaultValue={unitParams?.groupName}
                                        onChange={(e) => setUnitParams({ ...unitParams, groupName: e.target.value })}
                                        style={{
                                            width: '100%'
                                        }}
                                        placeholder="Please Enter groupName Name"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />

                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="groupDesc"
                                    label="물품설명"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter groupDesc Name'
                                        }
                                    ]}
                                >
                                    <Input
                                        type="text"
                                        name="groupDesc"
                                        value={unitParams?.groupDesc}
                                        defaultValue={unitParams?.groupDesc}
                                        onChange={(e) => setUnitParams({ ...unitParams, groupDesc: e.target.value })}
                                        style={{
                                            width: '100%'
                                        }}
                                        placeholder="Please Enter groupDesc Name"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="openYn"
                                    label="개봉여부"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter openYn Name'
                                        }
                                    ]}
                                >
                                    <Select
                                        defaultValue={() => unitParams?.openYn}
                                        onChange={(e) => setUnitParams({ ...unitParams, openYn: e })}
                                        style={{
                                            width: '100%'
                                        }}
                                        options={[
                                            {
                                                value: 'OPEN',
                                                label: '개봉'
                                            },
                                            {
                                                value: 'CLOSE',
                                                label: '미개봉'
                                            }
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="passYn"
                                    label="통과여부"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter passYn Name'
                                        }
                                    ]}
                                >
                                    <Select
                                        defaultValue={() => unitParams?.passYn}
                                        onChange={(e) => setUnitParams({ ...unitParams, passYn: e })}
                                        style={{
                                            width: '100%'
                                        }}
                                        options={[
                                            {
                                                value: 'Prohibited',
                                                label: '금지'
                                            },
                                            {
                                                value: 'Restricted',
                                                label: '제한'
                                            },
                                            {
                                                value: 'PASS',
                                                label: '통과'
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
                                    label="사용유무"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter useYn'
                                        }
                                    ]}
                                >
                                    <Select
                                        defaultValue={unitParams?.useYn}
                                        onChange={(e) => setUnitParams({ ...unitParams, useYn: e })}
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
                            <Col span={24}>
                                <Form.Item
                                    name="languageCode"
                                    label="언어 선택"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter languageCode'
                                        }
                                    ]}
                                >
                                    <Select
                                        defaultValue={unitParams?.languageCode}
                                        onChange={(e) => setUnitParams({ ...unitParams, languageCode: e })}
                                        style={{
                                            width: '100%'
                                        }}
                                        options={[
                                            {
                                                value: 'kr',
                                                label: '한국어'
                                            },
                                            {
                                                value: 'en',
                                                label: '영어'
                                            }
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item name="FileR">
                                    <Space direction="vertical">
                                        <Card
                                            size="small"
                                            style={{
                                                width: 200
                                            }}
                                        >
                                            <Button
                                                onClick={handleButtonClick1}
                                                icon={<UploadOutlined />}
                                                style={{ height: '40px', width: '170px', padding: '0 10px', backgroundColor: '#f0f0f0' }}
                                            >
                                                반입금지물품 이미지
                                            </Button>
                                            <input
                                                type="file"
                                                //ref={fileInput1}
                                                /*onChange={handleChange} */
                                                onChange={saveImgFile1}
                                                ref={imgRef1}
                                                style={{ display: 'none' }}
                                            />
                                        </Card>
                                    </Space>
                                    <Space direction="vertical">
                                        {imgEdit === true ? (
                                            <img
                                                src={unitParams.imgFile !== null ? 'data:image/png;base64,' + unitParams.imgFile : noImage}
                                                width={280}
                                                height={280}
                                                alt="real image"
                                            />
                                        ) : (
                                            <img src={imgFile1 ? imgFile1 : noImage} width={200} height={200} alt="real image" />
                                        )}
                                    </Space>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </MainCard>
            </Drawer>
            {/* 이미지 관리 추가 폼 End */}
        </>
    );
};
