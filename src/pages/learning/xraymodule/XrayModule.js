/* eslint-disable no-unused-vars */
// material-ui
import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import {
    Col,
    Row,
    Button,
    Table,
    Select,
    Space,
    Tooltip,
    Tag,
    Badge,
    Modal,
    Form,
    Input,
    InputNumber,
    Switch,
    Statistic,
    Card,
    Divider,
    Drawer
} from 'antd';
import { useGetXrayModuleListMutation } from '../../../hooks/api/LearningMaqnagement/LearningMaqnagement';
import { useGetLanguageListMutation } from '../../../hooks/api/ContentsManagement/ContentsManagement';
import { PlusOutlined, EditFilled, DeleteFilled } from '@ant-design/icons';

// project import
import MainCard from 'components/MainCard';

import { ExclamationCircleFilled } from '@ant-design/icons';

export const XrayModule = () => {
    const { confirm } = Modal;
    const [form] = Form.useForm();
    const [getXrayModuleList] = useGetXrayModuleListMutation(); // 콘텐츠 그룹 hooks api호출
    const [xrayModuleList, setXrayModuleList] = useState(); // 콘텐츠 그룹 리스트 값
    const [getLanguageList] = useGetLanguageListMutation(); // 언어 hooks api호출
    const [languageSelect, setLanguageSelect] = useState([]); //셀렉트 박스 option Default 값
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); //셀렉트 박스 option Selected 값
    const [dataSource, setDataSource] = useState([]); // Table 데이터 값
    const [defaultLanguage, setDefaultLanguage] = useState('kr');
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false); // Drawer 추가 우측폼 상태
    const [dataEdit, setDataEdit] = useState(false); // Drawer 수정 우측폼 상태

    // 추가 및 수정 input 기본값 정리
    const [xrayEduModuleNmVal, setXrayEduModuleNmVal] = useState();
    const [xrayEduModuleDcVal, setXrayEduModuleDcVal] = useState();
    const [supportRequestVal, setSupportRequestVal] = useState(0);
    const [openLimitVal, setOpenLimitVal] = useState(0);
    const [openPassVal, setOpenPassVal] = useState(0);
    const [passVal, setPassVal] = useState(0);
    const [seteqQuestionVal, setSeteqQuestionVal] = useState(0);

    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10
        }
    });

    // 데이터 값 선언
    const handleXrayModule = async () => {
        const XrayModuleresponse = await getXrayModuleList({
            languageCode: defaultLanguage
        });
        setXrayModuleList(XrayModuleresponse?.data?.RET_DATA);
        setDataSource([
            ...XrayModuleresponse?.data?.RET_DATA.map((d, i) => ({
                key: d.xrayEduModuleId,
                rowdata0: i + 1,
                rowdata1: d.xrayEduModuleId /*x-ray교육모듈id*/,
                rowdata2: d.xrayEduModuleNm /*x-ray교육모듈명칭*/,
                rowdata3: d.xrayEduModuleDc /*x-ray교육모듈설명*/,
                rowdata4: d.allCaseCnt /*전체건수*/,
                rowdata5: d.supportRequestCaseCnt /*지원요청건수*/,
                rowdata6: d.openLimitCaseCnt /*개봉제한건수*/,
                rowdata7: d.openPassCaseCnt /*개봉통과건수*/,
                rowdata8: d.passCaseCnt /*통과건수*/,
                rowdata9: d.useYn /*사용여부*/,
                rowdata10: d.insertDt /*등록일시*/,
                rowdata11: d.insertId /*등록자*/,
                rowdata12: d.updateDt /*수정일시*/,
                rowdata13: d.updateId /*수정자*/,
                rowdata14: d.seteqQuestionCnt /*출제문제수*/
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
        setLoading(false);
    };

    const columns = [
        {
            width: '80px',
            title: 'No',
            dataIndex: 'rowdata0',
            align: 'center'
        },
        {
            title: '교육모듈ID',
            dataIndex: 'rowdata1',
            align: 'center'
        },
        {
            title: '교육모듈명칭',
            dataIndex: 'rowdata2',
            align: 'center'
        },
        {
            title: '교육모듈설명',
            dataIndex: 'rowdata3',
            align: 'center'
        },
        {
            title: '콘텐츠개수',
            dataIndex: '',
            align: 'center',
            children: [
                {
                    title: '전체',
                    dataIndex: 'rowdata4',
                    align: 'center',
                    render(_, { rowdata4 }) {
                        return {
                            props: {
                                style: { background: '#ebf1f8' }
                            },
                            children: (
                                <div>
                                    <Badge
                                        count={rowdata4.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        color="#52c41a"
                                        overflowCount={9999}
                                    />
                                </div>
                            )
                        };
                    }
                },
                {
                    title: '금지',
                    dataIndex: 'rowdata5',
                    align: 'center',
                    render(_, { rowdata5 }) {
                        return {
                            props: {
                                style: { background: '#ebf1f8' }
                            },
                            children: (
                                <div>
                                    <Badge
                                        count={rowdata5.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        color="#faad14"
                                        overflowCount={9999}
                                    />
                                </div>
                            )
                        };
                    }
                },
                {
                    title: '개봉/제한',
                    dataIndex: 'rowdata6',
                    align: 'center',
                    render(_, { rowdata6 }) {
                        return {
                            props: {
                                style: { background: '#ebf1f8' }
                            },
                            children: (
                                <div>
                                    <Badge
                                        count={rowdata6.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        color="#faad14"
                                        overflowCount={9999}
                                    />
                                </div>
                            )
                        };
                    }
                },
                {
                    title: '개봉/통과',
                    dataIndex: 'rowdata7',
                    align: 'center',
                    render(_, { rowdata7 }) {
                        return {
                            props: {
                                style: { background: '#ebf1f8' }
                            },
                            children: (
                                <div>
                                    <Badge
                                        count={rowdata7.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        color="#faad14"
                                        overflowCount={9999}
                                    />
                                </div>
                            )
                        };
                    }
                },
                {
                    title: '통과',
                    dataIndex: 'rowdata8',
                    align: 'center',
                    render(_, { rowdata8 }) {
                        return {
                            props: {
                                style: { background: '#ebf1f8' }
                            },
                            children: (
                                <div>
                                    <Badge
                                        count={rowdata8.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        color="#faad14"
                                        overflowCount={9999}
                                    />
                                </div>
                            )
                        };
                    }
                }
            ]
        },
        {
            title: '지정형문항수',
            dataIndex: 'rowdata14',
            key: 'insertDate',
            align: 'center',
            render(_, { rowdata14 }) {
                return {
                    props: {
                        style: { background: '#ebf1f8' }
                    },
                    children: (
                        <div>
                            <Badge
                                count={rowdata14.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                color="#87d068"
                                overflowCount={9999}
                            />
                        </div>
                    )
                };
            }
        },
        {
            title: '사용여부',
            dataIndex: 'rowdata9',
            render: (_, { rowdata9 }) => (
                <>
                    {rowdata9 === '1' ? (
                        <Tag color={'green'} key={rowdata9}>
                            사용
                        </Tag>
                    ) : (
                        <Tag color={'volcano'} key={rowdata9}>
                            미사용
                        </Tag>
                    )}
                </>
            ),
            align: 'center'
        },
        {
            title: '등록자ID',
            dataIndex: 'rowdata11',
            key: 'insertId',
            align: 'center'
        },
        {
            title: '등록일자',
            dataIndex: 'rowdata10',
            key: 'insertDate',
            align: 'center'
        },
        {
            width: '120px',
            title: '수정',
            render: (_, { key }) => (
                <>
                    <Tooltip title="수정" color="#108ee9">
                        <Button
                            type="primary"
                            onClick={() => handleEdit(key)}
                            style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                            icon={<EditFilled />}
                        >
                            수정
                        </Button>
                    </Tooltip>
                </>
            ),
            align: 'center'
        }
    ];

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setSelectedRowKeys(selectedRowKeys);
        },
        onSelect: (record, selected, selectedRows) => {
            console.log(record, selected, selectedRows);
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
            console.log(selected, selectedRows, changeRows);
        }
    };

    const onChange = (value) => {
        console.log(`selected ${value}`);
        setDefaultLanguage(value);
    };

    const onSearch = (value) => {
        console.log('search:', value);
    };

    // 추가 버튼
    const handleAdd = () => {
        setOpen(true);
        setDataEdit(false);
    };

    // 추가 취소
    const onAddClose = () => {
        setOpen(false);
        setDataEdit(false);
        form.resetFields();
    };

    // 추가 및 수정 처리
    const EditSubmit = () => {
        console.log(xrayEduModuleNmVal, xrayEduModuleDcVal);

        if (dataEdit === true) {
            Modal.success({
                content: '수정 완료',
                onOk() {
                    setOpen(false);
                    setDataEdit(false);
                    handleXrayModule();
                    handleLanguage();
                    form.resetFields();
                }
            });
        } else {
            Modal.success({
                content: '추가 완료',
                onOk() {
                    setOpen(false);
                    setDataEdit(false);
                    handleXrayModule();
                    handleLanguage();
                    form.resetFields();
                }
            });
        }
    };

    // 수정 버튼
    const handleEdit = (EditKey) => {
        console.log(EditKey);
        setDataEdit(true);
        setOpen(true);
    };

    // 삭제 버튼
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

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter
        });

        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setData([]);
        }
    };

    useEffect(() => {
        setLoading(true);
        handleXrayModule();
        handleLanguage();
    }, [defaultLanguage]);

    return (
        <>
            <MainCard title="X-ray 판독모듈 구성">
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
                                <Tooltip title="삭제" color="#f50">
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
                        {...tableParams}
                        columns={columns}
                        rowSelection={{
                            ...rowSelection
                        }}
                        bordered={true}
                        dataSource={dataSource}
                        loading={loading}
                        onChange={handleTableChange}
                        pagination={tableParams.pagination}
                    />
                </Typography>
            </MainCard>

            {/* 추가 및 수정 폼 Start */}
            <Drawer
                maskClosable={false}
                title={`X-ray 판독모듈 구성 ${dataEdit === true ? '수정' : '추가'}`}
                onClose={onAddClose}
                open={open}
                width={550}
                style={{ top: '60px' }}
                extra={
                    <>
                        <Space style={{ marginTop: '120px' }}>
                            <Tooltip title="취소" placement="bottom">
                                <Button onClick={onAddClose} style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}>
                                    취소
                                </Button>
                            </Tooltip>
                            {dataEdit === true ? (
                                <Tooltip title="수정" color="#108ee9">
                                    <Button
                                        type="primary"
                                        onClick={EditSubmit}
                                        style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                        icon={<EditFilled />}
                                    >
                                        수정
                                    </Button>
                                </Tooltip>
                            ) : (
                                <Tooltip title="추가" placement="bottom" color="#108ee9">
                                    <Button
                                        onClick={EditSubmit}
                                        style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                        type="primary"
                                    >
                                        추가
                                    </Button>
                                </Tooltip>
                            )}
                        </Space>
                    </>
                }
            >
                <MainCard>
                    <Form layout="vertical" form={form}>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="xrayEduModuleNm"
                                    defaultValue={xrayEduModuleNmVal}
                                    onChange={(e) => setXrayEduModuleNmVal(e.target.value)}
                                    label="교육모듈 명칭"
                                    rules={[
                                        {
                                            required: true,
                                            message: '교육모듈 명칭'
                                        }
                                    ]}
                                >
                                    <Input placeholder="Please Enter Subject" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="xrayEduModuleDc"
                                    defaultValue={xrayEduModuleDcVal}
                                    onChange={(e) => setXrayEduModuleDcVal(e.target.value)}
                                    label="교육모듈 설명"
                                    rules={[
                                        {
                                            required: true,
                                            message: '교육모듈 설명'
                                        }
                                    ]}
                                >
                                    <Input
                                        style={{
                                            width: '100%'
                                        }}
                                        placeholder="Please Enter Contents"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="languageCode"
                                    label="콘텐츠 개수"
                                    rules={[
                                        {
                                            required: true,
                                            message: '콘텐츠 개수'
                                        }
                                    ]}
                                >
                                    <Card bordered style={{ textAlign: 'center' }}>
                                        <Row>
                                            <Col span={24}>
                                                <div>전체</div>
                                                <Badge
                                                    style={{ width: '40px' }}
                                                    count={(supportRequestVal + openLimitVal + openPassVal + passVal).toString()}
                                                    color="#52c41a"
                                                    overflowCount={9999}
                                                />{' '}
                                            </Col>
                                        </Row>

                                        <Divider style={{ margin: '10px 0' }} />
                                        <Row gutter={8}>
                                            <Col span={6}>
                                                <Form.Item
                                                    name="supportRequestCaseCnt"
                                                    defaultValue={supportRequestVal}
                                                    onChange={(e) => setSupportRequestVal(e)}
                                                    label="금지"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '금지'
                                                        }
                                                    ]}
                                                >
                                                    <InputNumber
                                                        min={0}
                                                        style={{
                                                            width: '100%'
                                                        }}
                                                        placeholder="Please Enter Count Contents"
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={6}>
                                                <Form.Item
                                                    name="openLimitCaseCnt"
                                                    defaultValue={openLimitVal}
                                                    onChange={(e) => setOpenLimitVal(e)}
                                                    label="개봉/제한"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Please Enter Open to confinement '
                                                        }
                                                    ]}
                                                >
                                                    <InputNumber
                                                        min={0}
                                                        style={{
                                                            width: '개봉/제한'
                                                        }}
                                                        placeholder="Please Enter Open to Pass"
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={6}>
                                                <Form.Item
                                                    name="openPassCaseCnt"
                                                    defaultValue={openPassVal}
                                                    onChange={(e) => setOpenPassVal(e)}
                                                    label="개봉/통과"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '개봉/통과'
                                                        }
                                                    ]}
                                                >
                                                    <InputNumber
                                                        min={0}
                                                        style={{
                                                            width: '100%'
                                                        }}
                                                        placeholder="Please Enter Count Contents"
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={6}>
                                                <Form.Item
                                                    name="passCaseCnt"
                                                    defaultValue={passVal}
                                                    onChange={(e) => setPassVal(e)}
                                                    label="통과"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '통과'
                                                        }
                                                    ]}
                                                >
                                                    <InputNumber
                                                        min={0}
                                                        style={{
                                                            width: '100%'
                                                        }}
                                                        placeholder="Please Enter Count Contents"
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="seteqQuestionCnt"
                                    defaultValue={seteqQuestionVal}
                                    onChange={(e) => setSeteqQuestionVal(e)}
                                    label="지정형문항수"
                                    rules={[
                                        {
                                            required: true,
                                            message: '지정형문항수'
                                        }
                                    ]}
                                >
                                    <InputNumber
                                        style={{
                                            width: '100%'
                                        }}
                                        placeholder="Please Enter Count Contents"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item name="useYn" label="사용여부">
                                    <Switch
                                        checkedChildren="사용"
                                        unCheckedChildren="미사용"
                                        defaultValue="사용"
                                        style={{ width: '80px' }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </MainCard>
            </Drawer>
            {/* 추가 폼 End */}
        </>
    );
};
// export default XrayModule;
