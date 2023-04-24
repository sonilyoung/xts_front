/* eslint-disable */
import React, { useContext, useEffect, useRef, useState } from 'react';
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
    Dragger
} from 'antd';
import { Typography } from '@mui/material';
import './index.css';
import { PlusOutlined, EditFilled, DeleteFilled, UploadOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useGetUnitListMutation, useInsertUnitMutation, useUpdateUnitMutation, useDeleteUnitMutation, useSaveUnitImgMutation, useGetUnitMutation} from '../../../hooks/api/ContentsManagement/ContentsManagement';
import MenuItem from '@mui/material/MenuItem';
// project import
import MainCard from 'components/MainCard';
import noImage from 'assets/images/no_imgae.png';
import loadingImg from 'assets/images/loading.gif';

//데모시연을위한이미지
import dimg1 from 'assets/images/demo/1.gif';
import dimg2 from 'assets/images/demo/1.jpg';
import dimg3 from 'assets/images/demo/1.jpg';
import dimg4 from 'assets/images/demo/1.jpg';
import dimg5 from 'assets/images/demo/1.jpg';
import dimg6 from 'assets/images/demo/1.jpg';
import dimg7 from 'assets/images/demo/1.jpg';
import dimg8 from 'assets/images/demo/1.jpg';
import dimg9 from 'assets/images/demo/1.jpg';
import dimg10 from 'assets/images/demo/1.jpg';
import dimg11 from 'assets/images/demo/1.jpg';
import dimg12 from 'assets/images/demo/1.jpg';
import dimg13 from 'assets/images/demo/1.jpg';

export const ImagesManagement = () => {

    const { confirm } = Modal;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false); // 로딩 초기값

    const [getUnitList] = useGetUnitListMutation(); // 단품정보 리스트 api
    const [saveUnitImg] = useSaveUnitImgMutation(); // 단품이미지 저장 api
    const [insertUnit] = useInsertUnitMutation(); // 단품저장 api
    const [unitList, setUnitList] = useState(); // 리스트 값
    const [unitDetail] = useGetUnitMutation(); // 단품저장 api
    const [unitUpdate] = useUpdateUnitMutation(); // 단품수정 api
    const [unitDelete] = useDeleteUnitMutation(); // 단품수정 api

    const [dataSource, setDataSource] = useState([]); // Table 데이터 값
    const [open, setOpen] = useState(false); // Drawer 추가 우측폼 상태
    const [dataEdit, setDataEdit] = useState(false); // Drawer 수정 우측폼 상태
    const [imgEdit, setImgEdit] = useState(false); // 이미지업로드를 위한 상태값
    const [uploading, setUploading] = useState(false); // 이미지업로드
    const [unitLanguageModalOpen, setUnitLanguageModalOpen] = useState(false); // 물품명칭 언어추가 Modal
    const [realImg, setRealImg] = useState(null);
    const [frontImg, setFrontImg] = useState(null);
    const [sideImg, setSideImg] = useState(null);

    const [realImgEdit, setRealImgEdit] = useState(true);
    const [frontImgEdit, setFrontImgEdit] = useState(true);
    const [sideImgEdit, setSideImgEdit] = useState(true);

    
    const [threedImg, setThreedImg] = useState(null);

    const [fileReal, setFileReal] = useState(null);
    const [fileFront, setFileFront] = useState(null);
    const [fileSide, setFileSide] = useState(null);
    const [fileThreed, setFileThreed] = useState(null);//3d 데모 이미지

    const [unitGroupCd, setUnitGroupCd] = useState(); // 단품그룹
    const [languageCode, setLanguageCode] = useState('kor'); // 언어코드
    const [studyLvl, setStudyLvl] = useState('1'); // 스터디레벨
    const [unitName, setUnitName] = useState(); // 단품이름
    const [unitDesc, setUnitDesc] = useState(); // 단품설명
    const [useYn, setUseYn] = useState(); // 사용유무

    const [unitScanId, setUnitScanId] = useState(); // 수정키
    const [unitId, setUnitId] = useState(); // unitId
    const [unitScanThreed, setUnitScanThreed] = useState(); // 데모용을 위한 3d이미지구분키

    //const params = useRef(); // 수정화면
    const [refresh, setRefresh] = useState(false); //리프레쉬
    const [unitParams, setUnitParams] = useState({});

    const handleUnit = async () => {
        const getUnitListResponse = await getUnitList({ languageCode: languageCode });
        setUnitList(getUnitListResponse?.data?.RET_DATA);
        setDataSource([
            ...getUnitListResponse?.data?.RET_DATA.map((d, i) => ({
                key: d.unitScanId,
                rowdata0: i + 1,
                rowdata1: d.unitId,
                rowdata2: d.unitGroupCd,
                rowdata3: d.unitGroupName,
                rowdata4: d.unitName,
                rowdata5: d.useYn
            }))
        ]);
        setLoading(false);
    };

    const imagescolumns = [
        {
            width: '60px',
            title: 'No',
            dataIndex: 'rowdata0',
            align: 'center'
        },
        {
            title: '물품ID',
            dataIndex: 'rowdata1',
            align: 'center'
        },
        {
            title: '물품분류코드',
            dataIndex: 'rowdata2',
            align: 'center'
        },        
        {
            title: '물품분류',
            dataIndex: 'rowdata3',
            align: 'center'
        },
        {
            title: '물품명칭',
            dataIndex: 'rowdata4',
            align: 'center'
        },
        {
            title: '사용여부',
            dataIndex: 'rowdata5',
            align: 'center',
            render: (_, { rowdata1, rowdata4 }) => (
                <>
                    {rowdata4 === 'Y' ? (
                        <Tag color={'green'} key={rowdata1}>
                            {'사용'}
                        </Tag>
                    ) : (
                        <Tag color={'volcano'} key={rowdata1}>
                            {'미사용'}
                        </Tag>
                    )}
                </>
            )
        },
        {
            width: '100px',
            title: '수정',
            render: (rowdata1) => (
                <>
                    <Tooltip title="수정" color="#108ee9">
                        <Button  onClick={()=>handleUnitMod({rowdata1})} type="primary" style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }} icon={<EditFilled />}>
                            수정
                        </Button>
                    </Tooltip>
                </>
            ),
            align: 'center'
        }
    ];

    // rowSelection, row selection
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        //getCheckboxProps: (record) => ({
            //disabled: record.name === 'Disabled User',
            // Column configuration not to be checked
            //name: record.name
        //})
    };

    // 물품 추가 버튼
    const handleAdd = () => {
        setDataEdit(false);
        setOpen(true);
        setUnitParams(null);
        form.resetFields();        
    };

    // 이미지가져오기
    const getUnitImgList = async (e, u, g) => {
        setUnitScanId(e);
        setUnitId(u);
        setUnitScanThreed(g);
        setFileThreed(null);
        const response = await unitDetail({
            "languageCode" : languageCode,
            "unitScanId" : e
        });
        
        console.log('이미지가져오기:',response.data.RET_DATA);
        setUnitParams(response.data.RET_DATA);
        //params = response.data.RET_DATA;

        setRealImgEdit(true);
        setFrontImgEdit(true);
        setSideImgEdit(true);        
    };        

    // 물품 수정 버튼
    const handleUnitMod = async (e) => {

        const response = await unitDetail({
            "languageCode" : languageCode,
            "unitScanId" : e?.rowdata1?.key
        });
        
        setUnitParams(response.data.RET_DATA);
        //params = response.data.RET_DATA;
        form.resetFields();
        setDataEdit(true);        
        setImgEdit(true);
        setOpen(true);

        setRealImgEdit(true);
        setFrontImgEdit(true);
        setSideImgEdit(true);

    };    

    // 추가 취소
    const onAddClose = () => {
        setOpen(false);
        setDataEdit(false);
        form.resetFields();
    };


    // 추가 및 수정 처리
    const onAddSubmit = () => {
        if (dataEdit === true) {
            Modal.success({
                content: '수정 완료',
                onOk() {
                    setOpen(false);
                    setDataEdit(false);
                    form.resetFields();
                }
            });
        } else {
            Modal.success({
                content: '추가 완료',
                onOk() {
                    setOpen(false);
                    setDataEdit(false);
                    form.resetFields();
                }
            });
        }
    };

    //단품저장
    const onSaveSubmit = async () => {
        console.log('저장:',unitParams);

        const response = await insertUnit({
            "unitGroupCd" : unitParams?.unitGroupCd,
            "languageCode" : languageCode,
            "studyLvl" : unitParams?.studyLvl,
            "unitName" : unitParams?.unitName,
            "unitDesc" : unitParams?.unitDesc,
            "useYn" : unitParams?.useYn
        });
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
        
        console.log('수정:',unitParams);

        const response = await unitUpdate({
            "unitScanId" : unitParams?.unitScanId,
            "unitGroupCd" : unitParams?.unitGroupCd,
            "languageCode" : unitParams?.languageCode,
            "studyLvl" : unitParams?.studyLvl,
            "unitName" : unitParams?.unitName,
            "unitDesc" : unitParams?.unitDesc,
            "useYn" : unitParams?.useYn
        });
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
        const response = await unitDelete({
            "unitScanId" : unitParams?.unitScanId,
            "languageCode" : unitParams?.languageCode
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
    }    

    // 물품명칭 언어 추가 Start
    const Unit_Language = () => {
        setUnitLanguageModalOpen(true);
    };
    const Unit_LanguageOk = () => {
        setUnitLanguageModalOpen(false);
        form.resetFields();
    };
    const Unit_LanguageCancel = () => {
        setUnitLanguageModalOpen(false);
        form.resetFields();
    };
    const Unit_LanguageAdd = (values) => {
        console.log('Received values of form:', values);
    };

    // 물품명칭 언어 추가 End


    // 이미지 업로드 input의 onChange
    const imgRef1 = useRef();
    const saverealImg = () => {
        const file = imgRef1.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setFileReal(reader.result);
        };
        setRealImg(file);
        setRealImgEdit(false);
    };    

    const imgRef2 = useRef();
    const savefrontImg = () => {
        const file = imgRef2.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setFileFront(reader.result);
        };
        setFrontImg(file);
        setFrontImgEdit(false);
    };  
    
    const imgRef3 = useRef();
    const saveSideImg = () => {
        const file = imgRef3.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setFileSide(reader.result);
        };
        setSideImg(file);
        setSideImgEdit(false);
    };      

    /*
    const imgRef4 = useRef();
    const saveThreedImg = () => {
        const file = imgRef4.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setFileThreed(reader.result);
        };
        setThreedImg(file);
    };*/
    
        
    const fileInput1 = React.createRef();
    const handleButtonClick1 = e =>  {
        //setDataEdit(false);
        setImgEdit(false);
        imgRef1.current.click();
    };

    const fileInput2 = React.createRef();
    const handleButtonClick2 = e => {
        //setDataEdit(false);
        setImgEdit(false);
        imgRef2.current.click();
    };

    const fileInput3 = React.createRef();
    const handleButtonClick3 = e => {
        //setDataEdit(false);
        setImgEdit(false);
        imgRef3.current.click();
    };    

    //3d생성
    const handleThreed = () => {
        console.log(unitScanThreed);

        //로딩이미지
        setFileThreed(loadingImg);
        const timer = setTimeout(() => {
            console.log('Initial timeout!');
            if(unitScanThreed==='G000001'){//총기류
                setFileThreed(dimg1);
            }else if(unitScanThreed==='G000002'){//폭발물류
                setFileThreed(dimg2);
            }else if(unitScanThreed==='G000003'){//실탄류
                setFileThreed(dimg3);
            }else if(unitScanThreed==='G000004'){//도검류
                setFileThreed(dimg4);
            }else if(unitScanThreed==='G000005'){//일반무기류    
                setFileThreed(dimg5);
            }else if(unitScanThreed==='G000006'){//위장무기류
                setFileThreed(dimg6);
            }else if(unitScanThreed==='G000007'){//공구/생활용품류
                setFileThreed(dimg7);
            }else if(unitScanThreed==='G000008'){//인화성물질류
                setFileThreed(dimg8);
            }else if(unitScanThreed==='G000009'){//위험물질류
                setFileThreed(dimg9);
            }else if(unitScanThreed==='G000010'){//액체, 겔 물종류
                setFileThreed(dimg10);
            }else if(unitScanThreed==='G000011'){//주류
                setFileThreed(dimg11);
            }else if(unitScanThreed==='G000012'){//전기/전자제품류                  
                setFileThreed(dimg12);
            }else{//확인물품류
                setFileThreed(dimg13);
            }            
            
        }, 5000);
        
        //clearTimeout(timer);
    }

    // 실물 이미지 업로드 처리
    const handleUpload = async () => {
        
        if(unitScanId===undefined){
            Modal.error({
                content: '이미지 업로드 할 대상을 선택해주세요.',
                onOk() {
                    setOpen(false);
                    setDataEdit(false);
                    form.resetFields();
                }
            });            
            return false;
        }

        let formData = new FormData();
        const params = { 
            unitScanId: unitScanId,
            unitId: unitId,
            unitGroupCd: unitScanThreed
        };
        formData.append("params", new Blob([JSON.stringify(params)], { type: 'application/json' }));
        formData.append("realImg", realImg);
        formData.append("frontImg", frontImg);
        formData.append("sideImg", sideImg);     
       
        console.log('realImg: ', realImg);
        const response = await saveUnitImg(formData);
        console.log('결과:', response);
        setRefresh(response);

        setRealImgEdit(false);
        setFrontImgEdit(false);
        setSideImgEdit(false);

        Modal.success({
            content: '추가 완료',
            onOk() {
                setOpen(false);
                setDataEdit(false);
                form.resetFields();
            }
        });        
    };

    const onFinish = (values) => {
        console.log('Success:', values);
        // console.log(...fileListR);
    };

    useEffect(() => {
        setLoading(true); // 로딩 호출
        console.log('useEffect2');
        handleUnit();
    }, [refresh])    

    return (
        <>  
            <MainCard title="물품 이미지">
                <Typography variant="body1">
                    <Row gutter={[16, 16]}>
                        <Col span={11} style={{ textAlign: 'center', padding: '0 10px' }}>
                            <Row gutter={24} style={{ paddingBottom: '15px' }}>
                                <Col span={24} offset={10}>
                                    <Space>
                                        <Tooltip title="물품 추가">
                                            <Button
                                                type="success"
                                                onClick={handleAdd}
                                                style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                                icon={<PlusOutlined />}
                                            >
                                                물품 추가
                                            </Button>
                                        </Tooltip>
                                    </Space>
                                </Col>
                            </Row>
                            <Table 
                                columns={imagescolumns} dataSource={dataSource} 
                                onRow={(record, rowIndex) => {
                                    return {
                                      onClick: event => { 
                                         console.log(record);
                                         setDataEdit(true);
                                         getUnitImgList(record.key, record.rowdata1, record.rowdata2);
                                      }, // click row
                                      onDoubleClick: event => {}, // double click row
                                      onContextMenu: event => {}, // right button click row
                                      onMouseEnter: event => {}, // mouse enter row
                                      onMouseLeave: event => {}, // mouse leave row
                                    };
                                  }}
                                  onHeaderRow={(columns, index) => {
                                    return {
                                      onClick: () => {}, // click header row
                                    };
                                  }}                           
                                loading={loading}
                            />
                        </Col>
                        <Col span={13} style={{ textAlign: 'center' }}>
                            <Form
                                layout="horizontal"
                                // onValuesChange={onFormLayoutChange}
                                onFinish={onFinish}
                                // onFinishFailed={onFinishFailed}
                                // disabled={componentDisabled}
                            >
                                <Row gutter={24} style={{ paddingBottom: '15px' }}>
                                    <Col span={24} offset={8}>
                                        <Space>
                                            <Tooltip title="업로드">
                                                <Button
                                                    type="success"
                                                    onClick={handleUpload}
                                                    htmlType="submit"
                                                    loding={uploading}
                                                    style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                                    icon={<PlusOutlined />}
                                                >
                                                    업로드
                                                </Button>
                                            </Tooltip>
                                        </Space>


                                        <Space direction="vertical">
                                            <Tooltip title="3D생성">
                                                    <Button
                                                        type="success"
                                                        onClick={handleThreed}
                                                        htmlType="submit"
                                                        loding={uploading}
                                                        style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                                        icon={<PlusOutlined />}
                                                    >
                                                        3D이미지생성
                                                    </Button>
                                            </Tooltip>
                                            </Space>                                         
                                    </Col>
                                </Row>

                                <Row gutter={[16, 16]}>
                                    <Col span={12}>
                                        <Form.Item name="FileR">
                                            <Space direction="vertical">
                                                <Card
                                                    size="small"
                                                    style={{
                                                        width: 350
                                                    }}
                                                >
                                                        <Button 
                                                            onClick={handleButtonClick1}
                                                            icon={<UploadOutlined />}
                                                            style={{ height: '40px', padding: '0 120px', backgroundColor: '#f0f0f0' }}
                                                        >
                                                            real image
                                                        </Button>                                                        
                                                        <input type="file"
                                                                //ref={fileInput1}
                                                                /*onChange={handleChange} */
                                                                onChange={saverealImg}
                                                                ref={imgRef1}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {realImgEdit === true ?  
                                                <img src={unitParams.realImg!==null ? 'data:image/png;base64,' + unitParams.realImg : noImage} width={280} height={280} alt="real image" />
                                                : 
                                                <img src={fileReal ? fileReal :noImage} width={280} height={280} alt="real image"/>
                                                }                                                
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item name="FileD">
                                            <Space direction="vertical">
                                                <Card
                                                    size="small"
                                                    style={{
                                                        width: 350
                                                    }}
                                                >
                                                        <Button 
                                                            style={{ height: '40px', padding: '0 120px', backgroundColor: '#FFFFFF' }}
                                                        >
                                                            3D image
                                                        </Button>                                                        
                                                </Card>
                                            </Space>
                                            <Space direction="vertical">
                                                <img src={fileThreed ? fileThreed :noImage} width={280} height={280} alt="3D image"/>
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <br />
                                <Row gutter={[16, 16]}>
                                    <Col span={12}>
                                        <Form.Item name="FileF">
                                            <Space direction="vertical">
                                                <Card
                                                    size="small"
                                                    style={{
                                                        width: 350
                                                    }}
                                                >
                                                        <Button 
                                                            onClick={handleButtonClick2}
                                                            icon={<UploadOutlined />}
                                                            style={{ height: '40px', padding: '0 120px', backgroundColor: '#f0f0f0' }}
                                                        >
                                                            front image
                                                        </Button>                                                        
                                                        <input type="file"
                                                                //ref={fileInput1}
                                                                /*onChange={handleChange} */
                                                                onChange={savefrontImg}
                                                                ref={imgRef2}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>
                                            <Space direction="vertical">
                                                {frontImgEdit === true ?  
                                                <img src={unitParams.frontImg!==null ? 'data:image/png;base64,' + unitParams.frontImg : noImage} width={280} height={280} alt="front image" />
                                                : 
                                                <img src={fileFront ? fileFront :noImage} width={280} height={280} alt="front image"/>
                                                }                                                   
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item name="FileS">
                                        <Space direction="vertical">
                                                <Card
                                                    size="small"
                                                    style={{
                                                        width: 350
                                                    }}
                                                >
                                                        <Button 
                                                            onClick={handleButtonClick3}
                                                            icon={<UploadOutlined />}
                                                            style={{ height: '40px', padding: '0 120px', backgroundColor: '#f0f0f0' }}
                                                        >
                                                            side image
                                                        </Button>                                                        
                                                        <input type="file"
                                                                //ref={fileInput1}
                                                                /*onChange={handleChange} */
                                                                onChange={saveSideImg}
                                                                ref={imgRef3}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>
                                            <Space direction="vertical">
                                                {sideImgEdit === true ?  
                                                <img src={unitParams.sideImg!==null ? 'data:image/png;base64,' + unitParams.sideImg : noImage} width={280} height={280} alt="side image" />
                                                : 
                                                <img src={fileSide ? fileSide :noImage} width={280} height={280} alt="side image"/>
                                                }                                                  
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        </Col>
                    </Row>
                </Typography>
            </MainCard>

            {/* 물품 이미지 추가 폼 Start */}
            <Drawer
                maskClosable={false}
                title={`물품 이미지 ${dataEdit === true ? '수정' : '추가'}`}
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
                                <Button type="danger" onClick={onDelete} style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}>
                                    삭제
                                </Button>
                            </Tooltip>
                        </Space>
                    </>
                }
            >
                <MainCard>
                    <Form name="Unit_Add" layout="vertical" form={form}>
                        <Row gutter={16}>
                            <Col span={24}>

                                <Form.Item
                                    name="unitId"
                                    label="물품분류"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter Items Type'
                                        }
                                    ]}
                                >
                                    <Select
                                        //onChange={(e) => setUnitGroupCd(e.target.value)}
                                        //onChange={handleGroupUnit}
                                        onChange={(e) => setUnitParams({ ...unitParams, "unitGroupCd": e })}
                                        defaultValue = {()=>unitParams?.unitGroupCd}
                                        style={{
                                            width: '100%'
                                        }}
                                        options={[
                                            {
                                                value: 'G000001',
                                                label: '총기류'
                                            },
                                            {
                                                value: 'G000002',
                                                label: '폭발물류'
                                            },
                                            {
                                                value: 'G000003',
                                                label: '실탄류'
                                            },
                                            {
                                                value: 'G000004',
                                                label: '도검류'
                                            },
                                            {
                                                value: 'G000005',
                                                label: '일반무기류'
                                            },
                                            {
                                                value: 'G000006',
                                                label: '위장무기류'
                                            },
                                            {
                                                value: 'G000007',
                                                label: '공구/생활용품류'
                                            },
                                            {
                                                value: 'G000008',
                                                label: '인화성물질류'
                                            },
                                            {
                                                value: 'G000009',
                                                label: '위험물질류'
                                            },
                                            {
                                                value: 'G000010',
                                                label: '액체, 겔 물품류'
                                            },
                                            {
                                                value: 'G000011',
                                                label: '주류'
                                            },
                                            {
                                                value: 'G000012',
                                                label: '전기/전자제품류'
                                            },
                                            {
                                                value: 'G000013',
                                                label: '확인물품류'
                                            }
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />

                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="unitName"
                                    label="물품명칭"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter unitName Name'
                                        }
                                    ]}
                                >
                                    <Input
                                        type="text"
                                        name="unitName"                                    
                                        value={unitParams?.unitName}
                                        defaultValue={unitParams?.unitName}
                                        onChange={(e) => setUnitParams({ ...unitParams, "unitName": e.target.value })}
                                        style={{
                                            width: '100%'
                                        }}
                                        placeholder="Please Enter unitName Name"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="unitDesc"
                                    label="물품설명"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter unitDesc Name'
                                        }
                                    ]}
                                >
                                    <Input
                                        type="text"
                                        name="unitDesc"                                       
                                        value={unitParams?.unitDesc}
                                        defaultValue={unitParams?.unitDesc}
                                        onChange={(e) => setUnitParams({ ...unitParams, "unitDesc": e.target.value })}
                                        style={{
                                            width: '100%'
                                        }}
                                        placeholder="Please Enter unitDesc Name"
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
                                    defaultValue = {()=>unitParams?.useYn}
                                    onChange={(e) => setUnitParams({ ...unitParams, "useYn": e })}
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
                                        },
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
                                    onChange={(e) => setUnitParams({ ...unitParams, "languageCode": e })}
                                    style={{
                                        width: '100%'
                                    }}
                                    options={[
                                        {
                                            value: 'kor',
                                            label: '한국어'
                                        },
                                        {
                                            value: 'eng',
                                            label: '영어'
                                        },
                                    ]}
                                />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </MainCard>
            </Drawer>
            {/* 이미지 관리 추가 폼 End */}

            {/* 물품명칭 언어 추가 Modal Start */}
            <Modal
                open={unitLanguageModalOpen}
                onOk={Unit_LanguageOk}
                onCancel={Unit_LanguageCancel}
                title="물품명칭 언어 추가"
                width={450}
                style={{
                    left: 130,
                    zIndex: 999
                }}
                footer={[
                    <Button
                        type="primary"
                        onClick={Unit_LanguageCancel}
                        style={{ width: '100px', borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                    >
                        Close
                    </Button>
                ]}
            >
                <MainCard>
                    <Form layout="vertical" name="Unit_Language_Add" form={form} onFinish={Unit_LanguageAdd}>
                        <Form.Item>
                            <Row gutter={24} style={{ marginBottom: 10 }}>
                                <Col offset={19}>
                                    <Space>
                                        <Tooltip title="저장" placement="bottom" color="#108ee9">
                                            <Button
                                                style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                                type="primary"
                                                htmlType="submit"
                                            >
                                                저장
                                            </Button>
                                        </Tooltip>
                                    </Space>
                                </Col>
                            </Row>
                        </Form.Item>
                    </Form>
                </MainCard>
            </Modal>
            
            {/* 물품명칭 언어 추가 Modal End */}
            
        </>
    );
};
