/* eslint-disable */
import React, { useState } from 'react';
import { Row, Col, Form, Space, Card, Button, Input, Typography, Modal, Upload, Image, Progress } from 'antd';
// import { Typography } from '@mui/material';
import { RetweetOutlined, DeleteFilled, UploadOutlined } from '@ant-design/icons';

import MainCard from 'components/MainCard';
import noImage from 'assets/images/no_imgae.png';
import loding_01 from '../../../assets/images/loding_01.svg';
import sync_01 from '../../../assets/images/sync_01.svg';

// AI 의사색채 : 이미지생성, 진행률, 목록, 상세, 동기화
import {
    useSudoImgExcuteMutation, // 이미지 생성
    useSelectSudoImgMutation, // 이미지 가져오기
    // useSelectProgressPerMutation, // 이미지 생성 진행률
    useSelectKaistXrayContentsListMutation, // 이미지 목록
    useSelectKaistXrayImgContentsMutation, // 이미지 상세
    useSyncImagesMutation // 이미지 동기화
} from '../../../hooks/api/AisynthesisManagement/AisynthesisManagement';

export const Aisynthesis = () => {
    const { confirm } = Modal;
    const [form] = Form.useForm();
    const { Text, Link } = Typography;
    const barColors = {
        '0%': '#87d068',
        '50%': '#ffe58f',
        '100%': '#ffccc7'
    };

    const [prosess_percent, setProsess_percent] = useState('6'); // 의사색채 이미지 생성 로딩 초기값
    const [createLoding, setCreateLoding] = useState(false); // 의사색채 이미지 생성 로딩 초기값
    const [syncLoding, setSyncLoding] = useState(false); // 동기화 로딩 초기값

    const [frontImg, setFrontImg] = useState(null); // 정면 이미지 초기값
    const [sideImg, setSideImg] = useState(null); // 측면 이미지 초기값
    const [frontImg_Base, setFrontImg_Base] = useState(null); // 정면 이미지 초기값
    const [sideImg_Base, setSideImg_Base] = useState(null); // 측면 이미지 초기값

    const [frontImg_2D, setFrontImg_2D] = useState(null); // 정면 이미지 초기값
    const [sideImg_2D, setSideImg_2D] = useState(null); // 측면 이미지 초기값
    const [frontImg_2D_Base, setFrontImg_2D_Base] = useState(null); // 정면 이미지 초기값
    const [sideImg_2D_Base, setSideImg_2D_Base] = useState(null); // 측면 이미지 초기값

    const [bagScanId, setBagScanId] = useState(null); // 의사색채 가방아이디

    // ===============================
    // Api 호출 Start
    // 이미지 생성 ======================================================
    const [SudoImgExcuteApi] = useSudoImgExcuteMutation(); // 콘텐츠 정보 관리 hooks api호출
    const handel_SudoImgExcute_Api = async () => {
        let formData = new FormData();
        const params = {};
        formData.append('params', new Blob([JSON.stringify(params)], { type: 'application/json' }));
        formData.append('frontImg', frontImg);
        formData.append('sideImg', sideImg);

        // 진행률
        let counter = '12';
        const intervalId = setInterval(() => {
            counter++;
            setProsess_percent(counter);
        }, 500);

        const SudoImgExcuteResponse = await SudoImgExcuteApi(formData);

        if (SudoImgExcuteResponse?.data?.RET_CODE === '0000') {
            setBagScanId(SudoImgExcuteResponse?.data?.RET_DATA?.bagScanId);
            clearInterval(intervalId);
            setProsess_percent('100');
            // console.log('성공');
        } else {
            clearInterval(intervalId);
            // console.log('실패');
        }
    };

    // 이미지 가져오기 ======================================================
    const [SelectSudoImgApi] = useSelectSudoImgMutation(); // 콘텐츠 정보 관리 hooks api호출
    const [selectSudoImgData, setSelectSudoImgData] = useState(); // 콘텐츠 정보관리 리스트 상단 값
    const handel_SelectSudoImg_Api = async (bagScanId) => {
        const SelectSudoImgResponse = await SelectSudoImgApi({
            bagScanId: bagScanId
        });
        setSelectSudoImgData(SelectSudoImgResponse?.data?.RET_DATA);
        setCreateLoding(false);
    };

    // 이미지 목록 ======================================================
    const [SelectKaistXrayContentsListApi] = useSelectKaistXrayContentsListMutation(); // 콘텐츠 정보 관리 hooks api호출
    const [selectKaistXrayContentsListData, setSelectKaistXrayContentsListData] = useState(); // 콘텐츠 정보관리 리스트 상단 값
    const handel_SelectKaistXrayContentsList_Api = async (bagScanId) => {
        const SelectKaistXrayContentsListResponse = await SelectKaistXrayContentsListApi({
            bagScanId: bagScanId
        });
        setSelectKaistXrayContentsListData(SelectKaistXrayContentsListResponse?.data?.RET_DATA);
        setCreateLoding(false);
    };

    // 이미지 상세 ======================================================
    const [SelectKaistXrayImgContentsApi] = useSelectKaistXrayImgContentsMutation(); // 콘텐츠 정보 관리 hooks api호출
    const [selectKaistXrayImgContentsData, setSelectKaistXrayImgContentsData] = useState(); // 콘텐츠 정보관리 리스트 상단 값
    const handel_SelectKaistXrayImgContents_Api = async (bagScanId) => {
        const SelectKaistXrayImgContentsResponse = await SelectKaistXrayImgContentsApi({
            bagScanId: bagScanId
        });
        setSelectKaistXrayImgContentsData(SelectKaistXrayImgContentsResponse?.data?.RET_DATA);
        setCreateLoding(false);
    };

    // 이미지 동기화  ======================================================
    const [SyncImagesApi] = useSyncImagesMutation(); // 콘텐츠 정보 관리 hooks api호출
    const handel_SyncImages_Api = async () => {
        const SyncImagesResponse = await SyncImagesApi({});
        if (SyncImagesResponse?.data?.RET_CODE === '0000') {
            Modal.success({
                title: 'Success Message',
                content: '동기화 성공'
            });
            setFrontImg(null);
            setSideImg(null);
            setFrontImg_Base(null);
            setSideImg_Base(null);
            setBagScanId();
            setSelectKaistXrayImgContentsData();
        } else {
            Modal.error({
                title: 'Error Message',
                content: '동기화 실패'
            });
        }
        setSyncLoding(false);
    };

    // Api 호출 End
    // ===============================

    // ===============================
    // 정면 이미지 업로드(의사색채) Start
    const FrontImgUpload = (frontfile) => {
        const reader = new FileReader();
        reader.readAsDataURL(frontfile);
        reader.onloadend = () => {
            setFrontImg_Base(reader.result);
            setFrontImg(frontfile);
        };
    };
    // 삭제
    const FrontRemove = () => {
        setFrontImg(null);
        setFrontImg_Base(null);
    };
    // 정면 이미지 업로드(의사색채) End
    // ===============================

    // ===============================
    // 측면 이미지 업로드(의사색채) Start
    const SideImgUpload = (sidefile) => {
        const reader = new FileReader();
        reader.readAsDataURL(sidefile);
        reader.onloadend = () => {
            setSideImg_Base(reader.result);
            setSideImg(sidefile);
        };
    };
    // 삭제
    const SideRemove = () => {
        setSideImg(null);
        setSideImg_Base(null);
    };
    // 측면 이미지 업로드(의사색채) End
    // ===============================

    // ===============================
    // 2D 정면 이미지 업로드(의사색채) Start
    const FrontImg2DUpload = (frontfile) => {
        const reader = new FileReader();
        reader.readAsDataURL(frontfile);
        reader.onloadend = () => {
            setFrontImg_2D(frontfile);
            setFrontImg_2D_Base(reader.result);
        };
    };
    // 삭제
    const Front2DRemove = () => {
        setFrontImg_2D(null);
        setFrontImg_2D_Base(null);
    };
    // 2D 정면 이미지 업로드(의사색채) End
    // ===============================

    // ===============================
    // 2D 측면 이미지 업로드(의사색채) Start
    const SideImg2DUpload = (sidefile) => {
        const reader = new FileReader();
        reader.readAsDataURL(sidefile);
        reader.onloadend = () => {
            setSideImg_2D(sidefile);
            setSideImg_2D_Base(reader.result);
        };
    };
    // 삭제
    const Side2DRemove = () => {
        setSideImg_2D(null);
        setSideImg_2D_Base(null);
    };
    // 2D 측면 이미지 업로드(의사색채) End
    // ===============================

    // 의사색체 영상합성 버튼 클릭
    const SudoCreate = () => {
        if (frontImg === null) {
            Modal.warning({
                title: 'Warning Message',
                content: '정면 이미지를 업로드해 주세요!'
            });
        } else if (sideImg === null) {
            Modal.warning({
                title: 'Warning Message',
                content: '측면 이미지를 업로드해 주세요!'
            });
        } else {
            handel_SudoImgExcute_Api();
            setCreateLoding(true);
        }
    };

    // 의사색체 이미지 가져오기
    const importImg = () => {
        handel_SelectSudoImg_Api();
    };

    // 동기화
    const handel_sync = () => {
        handel_SyncImages_Api();
        setSyncLoding(true);
    };
    return (
        <>
            <Typography variant="body1">
                <MainCard>
                    <Row>
                        <Col span={24}>
                            <Card
                                title={<span style={{ fontSize: '0.9rem' }}>의사색채 영상합성</span>}
                                extra={
                                    <Space>
                                        <Input
                                            prefix={
                                                <Text code style={{ fontSize: '0.9rem' }}>
                                                    ScanId
                                                </Text>
                                            }
                                            value={bagScanId}
                                            style={{
                                                width: '140px',
                                                backgroundColor: '#dadde6'
                                            }}
                                            readonly
                                        />
                                        <Button type="primary" onClick={() => SudoCreate()}>
                                            의사색채 영상합성
                                        </Button>
                                    </Space>
                                }
                            >
                                <Space style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Row gutter={[200, 24]}>
                                        <Col span={12}>
                                            <Space direction="vertical">
                                                <Upload
                                                    maxCount={1}
                                                    customRequest={({ file }) => FrontImgUpload(file)}
                                                    showUploadList={false}
                                                >
                                                    <Button
                                                        type="text"
                                                        style={{
                                                            width: '320px',
                                                            height: '40px',
                                                            padding: '10px',
                                                            backgroundColor: '#f0f0f0',
                                                            marginBottom: '10px'
                                                        }}
                                                        icon={<UploadOutlined />}
                                                    >
                                                        정면이미지
                                                    </Button>
                                                </Upload>
                                                {frontImg_Base === null ? (
                                                    <img src={noImage} width={320} height={220} alt="Front image" />
                                                ) : (
                                                    <>
                                                        <Space
                                                            style={{
                                                                width: '100%',
                                                                justifyContent: 'space-between',
                                                                border: '1px solid #f39898',
                                                                padding: '3px 5px'
                                                            }}
                                                        >
                                                            <span>{frontImg?.name}</span>
                                                            <Button onClick={FrontRemove} type="text">
                                                                <DeleteFilled />
                                                                삭제
                                                            </Button>
                                                        </Space>
                                                        <div
                                                            style={{
                                                                width: '320px',
                                                                height: '220px',
                                                                padding: '10px',
                                                                backgroundColor: '#f0f0f0',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}
                                                        >
                                                            <Image
                                                                src={frontImg_Base}
                                                                alt="Front image"
                                                                style={{
                                                                    maxWidth: '100%',
                                                                    maxHeight: '100%',
                                                                    width: 'auto',
                                                                    height: 'auto'
                                                                }}
                                                            />
                                                        </div>
                                                    </>
                                                )}
                                            </Space>
                                        </Col>
                                        <Col span={12}>
                                            <Space direction="vertical">
                                                <Upload
                                                    maxCount={1}
                                                    customRequest={({ file }) => SideImgUpload(file)}
                                                    showUploadList={false}
                                                >
                                                    <Button
                                                        type="text"
                                                        style={{
                                                            width: '320px',
                                                            height: '40px',
                                                            padding: '10px',
                                                            backgroundColor: '#f0f0f0',
                                                            marginBottom: '10px'
                                                        }}
                                                        icon={<UploadOutlined />}
                                                    >
                                                        측면이미지
                                                    </Button>
                                                </Upload>
                                                {sideImg_Base === null ? (
                                                    <img src={noImage} width={320} height={220} alt="Side image" />
                                                ) : (
                                                    <>
                                                        <Space
                                                            style={{
                                                                width: '100%',
                                                                justifyContent: 'space-between',
                                                                border: '1px solid #f39898',
                                                                padding: '3px 5px'
                                                            }}
                                                        >
                                                            <span>{sideImg?.name}</span>
                                                            <Button onClick={SideRemove} type="text">
                                                                <DeleteFilled />
                                                                삭제
                                                            </Button>
                                                        </Space>
                                                        <div
                                                            style={{
                                                                width: '320px',
                                                                height: '220px',
                                                                padding: '10px',
                                                                backgroundColor: '#f0f0f0',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}
                                                        >
                                                            <Image
                                                                src={sideImg_Base}
                                                                alt="Side image"
                                                                style={{
                                                                    maxWidth: '100%',
                                                                    maxHeight: '100%',
                                                                    width: 'auto',
                                                                    height: 'auto'
                                                                }}
                                                            />
                                                        </div>
                                                    </>
                                                )}
                                            </Space>
                                        </Col>
                                    </Row>
                                </Space>
                            </Card>
                        </Col>
                        {/* <Col span={12}>
                            <Card
                                title={<span style={{ fontSize: '0.9rem' }}>2D 영상합성</span>}
                                extra={<Button type="primary">2D 영상합성</Button>}
                            >
                                <Space style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Row gutter={[24, 24]}>
                                        <Col span={12}>
                                            <Space direction="vertical">
                                                <Upload
                                                    maxCount={1}
                                                    customRequest={({ file }) => FrontImg2DUpload(file)}
                                                    showUploadList={false}
                                                >
                                                    <Button
                                                        type="text"
                                                        style={{
                                                            width: '320px',
                                                            height: '40px',
                                                            padding: '10px',
                                                            backgroundColor: '#f0f0f0',
                                                            marginBottom: '10px'
                                                        }}
                                                        icon={<UploadOutlined />}
                                                    >
                                                        정면이미지
                                                    </Button>
                                                </Upload>
                                                {frontImg_2D_Base === null ? (
                                                    <img src={noImage} width={320} height={220} alt="Side image" />
                                                ) : (
                                                    <>
                                                        <Space
                                                            style={{
                                                                width: '100%',
                                                                justifyContent: 'space-between',
                                                                border: '1px solid #f39898',
                                                                padding: '3px 5px'
                                                            }}
                                                        >
                                                            <span>{frontImg_2D?.name}</span>
                                                            <Button onClick={Front2DRemove} type="text">
                                                                <DeleteFilled />
                                                                삭제
                                                            </Button>
                                                        </Space>
                                                        <div
                                                            style={{
                                                                width: '320px',
                                                                height: '220px',
                                                                padding: '10px',
                                                                backgroundColor: '#f0f0f0',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}
                                                        >
                                                            <Image
                                                                src={frontImg_2D_Base}
                                                                alt="Side image"
                                                                style={{
                                                                    maxWidth: '100%',
                                                                    maxHeight: '100%',
                                                                    width: 'auto',
                                                                    height: 'auto'
                                                                }}
                                                            />
                                                        </div>
                                                    </>
                                                )}
                                            </Space>
                                        </Col>
                                        <Col span={12}>
                                            <Space direction="vertical">
                                                <Upload
                                                    maxCount={1}
                                                    customRequest={({ file }) => SideImg2DUpload(file)}
                                                    showUploadList={false}
                                                >
                                                    <Button
                                                        type="text"
                                                        style={{
                                                            width: '320px',
                                                            height: '40px',
                                                            padding: '10px',
                                                            backgroundColor: '#f0f0f0',
                                                            marginBottom: '10px'
                                                        }}
                                                        icon={<UploadOutlined />}
                                                    >
                                                        측면이미지
                                                    </Button>
                                                </Upload>
                                                {sideImg_2D_Base === null ? (
                                                    <img src={noImage} width={320} height={220} alt="Side image" />
                                                ) : (
                                                    <>
                                                        <Space
                                                            style={{
                                                                width: '100%',
                                                                justifyContent: 'space-between',
                                                                border: '1px solid #f39898',
                                                                padding: '3px 5px'
                                                            }}
                                                        >
                                                            <span>{sideImg_2D?.name}</span>
                                                            <Button onClick={Side2DRemove} type="text">
                                                                <DeleteFilled />
                                                                삭제
                                                            </Button>
                                                        </Space>
                                                        <div
                                                            style={{
                                                                width: '320px',
                                                                height: '220px',
                                                                padding: '10px',
                                                                backgroundColor: '#f0f0f0',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}
                                                        >
                                                            <Image
                                                                src={sideImg_2D_Base}
                                                                alt="Side image"
                                                                style={{
                                                                    maxWidth: '100%',
                                                                    maxHeight: '100%',
                                                                    width: 'auto',
                                                                    height: 'auto'
                                                                }}
                                                            />
                                                        </div>
                                                    </>
                                                )}
                                            </Space>
                                        </Col>
                                    </Row>
                                </Space>
                            </Card>
                        </Col> */}
                    </Row>
                </MainCard>
                <br />
                {/* 의사색채 이미지 */}
                <MainCard>
                    <Row gutter={[24, 24]}>
                        {/* 정면 */}
                        <Col span={12}>
                            <Card style={{ border: '1px solid #f28b82' }} title={<h4>정면</h4>}>
                                <Row justify="space-around" style={{ margin: '15px -15px 0px -15px' }}>
                                    <Col span={4}>
                                        <Card
                                            title="컬러"
                                            size="small"
                                            style={{
                                                width: '140px',
                                                border: '1px solid #cdcdcd',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {selectKaistXrayImgContentsData?.imgFrontColor !== undefined ? (
                                                <Image
                                                    src={`data:image/png;base64, ${selectKaistXrayImgContentsData?.imgFrontColor}`}
                                                    width={110}
                                                    height={110}
                                                    alt="imgFrontColor"
                                                />
                                            ) : (
                                                <img src={noImage} width={110} height={110} alt="imgFrontColor" />
                                            )}
                                        </Card>
                                    </Col>
                                    <Col span={4}>
                                        <Card
                                            title="무기물"
                                            size="small"
                                            style={{
                                                width: '140px',
                                                border: '1px solid #cdcdcd',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {selectKaistXrayImgContentsData?.imgFrontColorMineral !== undefined ? (
                                                <Image
                                                    src={`data:image/png;base64, ${selectKaistXrayImgContentsData?.imgFrontColorMineral}`}
                                                    width={110}
                                                    height={110}
                                                    alt="imgFrontColorMineral"
                                                />
                                            ) : (
                                                <img src={noImage} width={110} height={110} alt="imgFrontColorMineral" />
                                            )}
                                        </Card>
                                    </Col>
                                    <Col span={4}>
                                        <Card
                                            title="유기물"
                                            size="small"
                                            style={{
                                                width: '140px',
                                                border: '1px solid #cdcdcd',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {selectKaistXrayImgContentsData?.imgFrontColorOrganism !== undefined ? (
                                                <Image
                                                    src={`data:image/png;base64, ${selectKaistXrayImgContentsData?.imgFrontColorOrganism}`}
                                                    width={110}
                                                    height={110}
                                                    alt="imgFrontColorOrganism"
                                                />
                                            ) : (
                                                <img src={noImage} width={110} height={110} alt="imgFrontColorOrganism" />
                                            )}
                                        </Card>
                                    </Col>
                                    <Col span={4}>
                                        <Card
                                            title="반전"
                                            size="small"
                                            style={{
                                                width: '140px',
                                                border: '1px solid #cdcdcd',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {selectKaistXrayImgContentsData?.imgFrontColorReversal !== undefined ? (
                                                <Image
                                                    src={`data:image/png;base64, ${selectKaistXrayImgContentsData?.imgFrontColorReversal}`}
                                                    width={110}
                                                    height={110}
                                                    alt="imgFrontColorReversal"
                                                />
                                            ) : (
                                                <img src={noImage} width={110} height={110} alt="imgFrontColorReversal" />
                                            )}
                                        </Card>
                                    </Col>
                                    <Col span={4}>
                                        <Card
                                            title="채도 1"
                                            size="small"
                                            style={{
                                                width: '140px',
                                                border: '1px solid #cdcdcd',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {selectKaistXrayImgContentsData?.imgFrontColorBwRate1 !== undefined ? (
                                                <Image
                                                    src={`data:image/png;base64, ${selectKaistXrayImgContentsData?.imgFrontColorBwRate1}`}
                                                    width={110}
                                                    height={110}
                                                    alt="imgFrontColorBwRate1"
                                                />
                                            ) : (
                                                <img src={noImage} width={110} height={110} alt="imgFrontColorBwRate1" />
                                            )}
                                        </Card>
                                    </Col>
                                </Row>

                                <Row justify="space-around" style={{ margin: '15px -15px 0px -15px' }}>
                                    <Col span={4}>
                                        <Card
                                            title="채도 2"
                                            size="small"
                                            style={{
                                                width: '140px',
                                                border: '1px solid #cdcdcd',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {selectKaistXrayImgContentsData?.imgFrontColorBwRate2 !== undefined ? (
                                                <Image
                                                    src={`data:image/png;base64, ${selectKaistXrayImgContentsData?.imgFrontColorBwRate2}`}
                                                    width={110}
                                                    height={110}
                                                    alt="imgFrontColorBwRate2"
                                                />
                                            ) : (
                                                <img src={noImage} width={110} height={110} alt="imgFrontColorBwRate2" />
                                            )}
                                        </Card>
                                    </Col>
                                    <Col span={4}>
                                        <Card
                                            title="채도 3"
                                            size="small"
                                            style={{
                                                width: '140px',
                                                border: '1px solid #cdcdcd',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {selectKaistXrayImgContentsData?.imgFrontColorBwRate3 !== undefined ? (
                                                <Image
                                                    src={`data:image/png;base64, ${selectKaistXrayImgContentsData?.imgFrontColorBwRate3}`}
                                                    width={110}
                                                    height={110}
                                                    alt="imgFrontColorBwRate3"
                                                />
                                            ) : (
                                                <img src={noImage} width={110} height={110} alt="imgFrontColorBwRate3" />
                                            )}
                                        </Card>
                                    </Col>
                                    <Col span={4}>
                                        <Card
                                            title="채도 4"
                                            size="small"
                                            style={{
                                                width: '140px',
                                                border: '1px solid #cdcdcd',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {selectKaistXrayImgContentsData?.imgFrontColorBwRate4 !== undefined ? (
                                                <Image
                                                    src={`data:image/png;base64, ${selectKaistXrayImgContentsData?.imgFrontColorBwRate4}`}
                                                    width={110}
                                                    height={110}
                                                    alt="imgFrontColorBwRate4"
                                                />
                                            ) : (
                                                <img src={noImage} width={110} height={110} alt="imgFrontColorBwRate4" />
                                            )}
                                        </Card>
                                    </Col>
                                    <Col span={4}>
                                        <Card
                                            title="채도 5"
                                            size="small"
                                            style={{
                                                width: '140px',
                                                border: '1px solid #cdcdcd',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {selectKaistXrayImgContentsData?.imgFrontColorBwRate5 !== undefined ? (
                                                <Image
                                                    src={`data:image/png;base64, ${selectKaistXrayImgContentsData?.imgFrontColorBwRate5}`}
                                                    width={110}
                                                    height={110}
                                                    alt="imgFrontColorBwRate5"
                                                />
                                            ) : (
                                                <img src={noImage} width={110} height={110} alt="imgFrontColorBwRate5" />
                                            )}
                                        </Card>
                                    </Col>
                                    <Col span={4}>
                                        <Card
                                            title="채도 6"
                                            size="small"
                                            style={{
                                                width: '140px',
                                                border: '1px solid #cdcdcd',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {selectKaistXrayImgContentsData?.imgFrontColorBwRate6 !== undefined ? (
                                                <Image
                                                    src={`data:image/png;base64, ${selectKaistXrayImgContentsData?.imgFrontColorBwRate6}`}
                                                    width={110}
                                                    height={110}
                                                    alt="imgFrontColorBwRate6"
                                                />
                                            ) : (
                                                <img src={noImage} width={110} height={110} alt="imgFrontColorBwRate6" />
                                            )}
                                        </Card>
                                    </Col>
                                </Row>

                                <Row justify="space-around" style={{ margin: '15px -15px 0px -15px' }}>
                                    <Col span={4}>
                                        <Card
                                            title="흑백"
                                            size="small"
                                            style={{
                                                width: '140px',
                                                border: '1px solid #cdcdcd',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {selectKaistXrayImgContentsData?.imgFrontBw !== undefined ? (
                                                <Image
                                                    src={`data:image/png;base64, ${selectKaistXrayImgContentsData?.imgFrontBw}`}
                                                    width={110}
                                                    height={110}
                                                    alt="imgFrontBw"
                                                />
                                            ) : (
                                                <img src={noImage} width={110} height={110} alt="imgFrontBw" />
                                            )}
                                        </Card>
                                    </Col>
                                    <Col span={4}>
                                        <Card
                                            title="흑백무기물"
                                            size="small"
                                            style={{
                                                width: '140px',
                                                border: '1px solid #cdcdcd',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {selectKaistXrayImgContentsData?.imgFrontBwMineral !== undefined ? (
                                                <Image
                                                    src={`data:image/png;base64, ${selectKaistXrayImgContentsData?.imgFrontBwMineral}`}
                                                    width={110}
                                                    height={110}
                                                    alt="imgFrontBwMineral"
                                                />
                                            ) : (
                                                <img src={noImage} width={110} height={110} alt="imgFrontBwMineral" />
                                            )}
                                        </Card>
                                    </Col>
                                    <Col span={4}>
                                        <Card
                                            title="흑백유기물"
                                            size="small"
                                            style={{
                                                width: '140px',
                                                border: '1px solid #cdcdcd',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {selectKaistXrayImgContentsData?.imgFrontBwOrganism !== undefined ? (
                                                <Image
                                                    src={`data:image/png;base64, ${selectKaistXrayImgContentsData?.imgFrontBwOrganism}`}
                                                    width={110}
                                                    height={110}
                                                    alt="imgFrontBwOrganism"
                                                />
                                            ) : (
                                                <img src={noImage} width={110} height={110} alt="imgFrontBwOrganism" />
                                            )}
                                        </Card>
                                    </Col>
                                    <Col span={4}>
                                        <Card
                                            title="흑백반전"
                                            size="small"
                                            style={{
                                                width: '140px',
                                                border: '1px solid #cdcdcd',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {selectKaistXrayImgContentsData?.imgFrontBwReversal !== undefined ? (
                                                <Image
                                                    src={`data:image/png;base64, ${selectKaistXrayImgContentsData?.imgFrontBwReversal}`}
                                                    width={110}
                                                    height={110}
                                                    alt="imgFrontBwReversal"
                                                />
                                            ) : (
                                                <img src={noImage} width={110} height={110} alt="imgFrontBwReversal" />
                                            )}
                                        </Card>
                                    </Col>
                                    <Col span={4}>
                                        <Card
                                            title="흑백채도 1"
                                            size="small"
                                            style={{
                                                width: '140px',
                                                border: '1px solid #cdcdcd',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {selectKaistXrayImgContentsData?.imgFrontBwBwRate1 !== undefined ? (
                                                <Image
                                                    src={`data:image/png;base64, ${selectKaistXrayImgContentsData?.imgFrontBwBwRate1}`}
                                                    width={110}
                                                    height={110}
                                                    alt="imgFrontBwBwRate1"
                                                />
                                            ) : (
                                                <img src={noImage} width={110} height={110} alt="imgFrontBwBwRate1" />
                                            )}
                                        </Card>
                                    </Col>
                                </Row>

                                <Row justify="space-around" style={{ margin: '15px -15px 0px -15px' }}>
                                    <Col span={4}>
                                        <Card
                                            title="흑백채도 2"
                                            size="small"
                                            style={{
                                                width: '140px',
                                                border: '1px solid #cdcdcd',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {selectKaistXrayImgContentsData?.imgFrontBwBwRate2 !== undefined ? (
                                                <Image
                                                    src={`data:image/png;base64, ${selectKaistXrayImgContentsData?.imgFrontBwBwRate2}`}
                                                    width={110}
                                                    height={110}
                                                    alt="imgFrontBwBwRate2"
                                                />
                                            ) : (
                                                <img src={noImage} width={110} height={110} alt="imgFrontBwBwRate2" />
                                            )}
                                        </Card>
                                    </Col>
                                    <Col span={4}>
                                        <Card
                                            title="흑백채도 3"
                                            size="small"
                                            style={{
                                                width: '140px',
                                                border: '1px solid #cdcdcd',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {selectKaistXrayImgContentsData?.imgFrontBwBwRate3 !== undefined ? (
                                                <Image
                                                    src={`data:image/png;base64, ${selectKaistXrayImgContentsData?.imgFrontBwBwRate3}`}
                                                    width={110}
                                                    height={110}
                                                    alt="imgFrontBwBwRate3"
                                                />
                                            ) : (
                                                <img src={noImage} width={110} height={110} alt="imgFrontBwBwRate3" />
                                            )}
                                        </Card>
                                    </Col>
                                    <Col span={4}>
                                        <Card
                                            title="흑백채도 4"
                                            size="small"
                                            style={{
                                                width: '140px',
                                                border: '1px solid #cdcdcd',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {selectKaistXrayImgContentsData?.imgFrontBwBwRate4 !== undefined ? (
                                                <Image
                                                    src={`data:image/png;base64, ${selectKaistXrayImgContentsData?.imgFrontBwBwRate4}`}
                                                    width={110}
                                                    height={110}
                                                    alt="imgFrontBwBwRate4"
                                                />
                                            ) : (
                                                <img src={noImage} width={110} height={110} alt="imgFrontBwBwRate4" />
                                            )}
                                        </Card>
                                    </Col>
                                    <Col span={4}>
                                        <Card
                                            title="흑백채도 5"
                                            size="small"
                                            style={{
                                                width: '140px',
                                                border: '1px solid #cdcdcd',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {selectKaistXrayImgContentsData?.imgFrontBwBwRate5 !== undefined ? (
                                                <Image
                                                    src={`data:image/png;base64, ${selectKaistXrayImgContentsData?.imgFrontBwBwRate5}`}
                                                    width={110}
                                                    height={110}
                                                    alt="imgFrontBwBwRate5"
                                                />
                                            ) : (
                                                <img src={noImage} width={110} height={110} alt="imgFrontBwBwRate5" />
                                            )}
                                        </Card>
                                    </Col>
                                    <Col span={4}>
                                        <Card
                                            title="흑백채도 6"
                                            size="small"
                                            style={{
                                                width: '140px',
                                                border: '1px solid #cdcdcd',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {selectKaistXrayImgContentsData?.imgFrontBwBwRate6 !== undefined ? (
                                                <Image
                                                    src={`data:image/png;base64, ${selectKaistXrayImgContentsData?.imgFrontBwBwRate6}`}
                                                    width={110}
                                                    height={110}
                                                    alt="imgFrontBwBwRate6"
                                                />
                                            ) : (
                                                <img src={noImage} width={110} height={110} alt="imgFrontBwBwRate6" />
                                            )}
                                        </Card>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>

                        {/* 측면 */}
                        <Col span={12}>
                            <Card style={{ border: '1px solid #f28b82' }} title={<h4>측면</h4>}>
                                <Row justify="space-around" style={{ margin: '15px -15px 0px -15px' }}>
                                    <Col span={4}>
                                        <Card
                                            title="컬러"
                                            size="small"
                                            style={{
                                                width: '140px',
                                                border: '1px solid #cdcdcd',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {selectKaistXrayImgContentsData?.imgSideColor !== undefined ? (
                                                <Image
                                                    src={`data:image/png;base64, ${selectKaistXrayImgContentsData?.imgSideColor}`}
                                                    width={110}
                                                    height={110}
                                                    alt="imgSideColor"
                                                />
                                            ) : (
                                                <img src={noImage} width={110} height={110} alt="imgSideColor" />
                                            )}
                                        </Card>
                                    </Col>
                                    <Col span={4}>
                                        <Card
                                            title="무기물"
                                            size="small"
                                            style={{
                                                width: '140px',
                                                border: '1px solid #cdcdcd',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {selectKaistXrayImgContentsData?.imgSideColorMineral !== undefined ? (
                                                <Image
                                                    src={`data:image/png;base64, ${selectKaistXrayImgContentsData?.imgSideColorMineral}`}
                                                    width={110}
                                                    height={110}
                                                    alt="imgSideColorMineral"
                                                />
                                            ) : (
                                                <img src={noImage} width={110} height={110} alt="imgSideColorMineral" />
                                            )}
                                        </Card>
                                    </Col>
                                    <Col span={4}>
                                        <Card
                                            title="유기물"
                                            size="small"
                                            style={{
                                                width: '140px',
                                                border: '1px solid #cdcdcd',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {selectKaistXrayImgContentsData?.imgSideColorOrganism !== undefined ? (
                                                <Image
                                                    src={`data:image/png;base64, ${selectKaistXrayImgContentsData?.imgSideColorOrganism}`}
                                                    width={110}
                                                    height={110}
                                                    alt="imgSideColorOrganism"
                                                />
                                            ) : (
                                                <img src={noImage} width={110} height={110} alt="imgSideColorOrganism" />
                                            )}
                                        </Card>
                                    </Col>
                                    <Col span={4}>
                                        <Card
                                            title="반전"
                                            size="small"
                                            style={{
                                                width: '140px',
                                                border: '1px solid #cdcdcd',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {selectKaistXrayImgContentsData?.imgSideColorReversal !== undefined ? (
                                                <Image
                                                    src={`data:image/png;base64, ${selectKaistXrayImgContentsData?.imgSideColorReversal}`}
                                                    width={110}
                                                    height={110}
                                                    alt="imgSideColorReversal"
                                                />
                                            ) : (
                                                <img src={noImage} width={110} height={110} alt="imgSideColorReversal" />
                                            )}
                                        </Card>
                                    </Col>
                                    <Col span={4}>
                                        <Card
                                            title="채도 1"
                                            size="small"
                                            style={{
                                                width: '140px',
                                                border: '1px solid #cdcdcd',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {selectKaistXrayImgContentsData?.imgSideColorBwRate1 !== undefined ? (
                                                <Image
                                                    src={`data:image/png;base64, ${selectKaistXrayImgContentsData?.imgSideColorBwRate1}`}
                                                    width={110}
                                                    height={110}
                                                    alt="imgSideColorBwRate1"
                                                />
                                            ) : (
                                                <img src={noImage} width={110} height={110} alt="imgSideColorBwRate1" />
                                            )}
                                        </Card>
                                    </Col>
                                </Row>

                                <Row justify="space-around" style={{ margin: '15px -15px 0px -15px' }}>
                                    <Col span={4}>
                                        <Card
                                            title="채도 2"
                                            size="small"
                                            style={{
                                                width: '140px',
                                                border: '1px solid #cdcdcd',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {selectKaistXrayImgContentsData?.imgSideColorBwRate2 !== undefined ? (
                                                <Image
                                                    src={`data:image/png;base64, ${selectKaistXrayImgContentsData?.imgSideColorBwRate2}`}
                                                    width={110}
                                                    height={110}
                                                    alt="imgSideColorBwRate2"
                                                />
                                            ) : (
                                                <img src={noImage} width={110} height={110} alt="imgSideColorBwRate2" />
                                            )}
                                        </Card>
                                    </Col>
                                    <Col span={4}>
                                        <Card
                                            title="채도 3"
                                            size="small"
                                            style={{
                                                width: '140px',
                                                border: '1px solid #cdcdcd',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {selectKaistXrayImgContentsData?.imgSideColorBwRate3 !== undefined ? (
                                                <Image
                                                    src={`data:image/png;base64, ${selectKaistXrayImgContentsData?.imgSideColorBwRate3}`}
                                                    width={110}
                                                    height={110}
                                                    alt="imgSideColorBwRate3"
                                                />
                                            ) : (
                                                <img src={noImage} width={110} height={110} alt="imgSideColorBwRate3" />
                                            )}
                                        </Card>
                                    </Col>
                                    <Col span={4}>
                                        <Card
                                            title="채도 4"
                                            size="small"
                                            style={{
                                                width: '140px',
                                                border: '1px solid #cdcdcd',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {selectKaistXrayImgContentsData?.imgSideColorBwRate4 !== undefined ? (
                                                <Image
                                                    src={`data:image/png;base64, ${selectKaistXrayImgContentsData?.imgSideColorBwRate4}`}
                                                    width={110}
                                                    height={110}
                                                    alt="imgSideColorBwRate4"
                                                />
                                            ) : (
                                                <img src={noImage} width={110} height={110} alt="imgSideColorBwRate4" />
                                            )}
                                        </Card>
                                    </Col>
                                    <Col span={4}>
                                        <Card
                                            title="채도 5"
                                            size="small"
                                            style={{
                                                width: '140px',
                                                border: '1px solid #cdcdcd',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {selectKaistXrayImgContentsData?.imgSideColorBwRate5 !== undefined ? (
                                                <Image
                                                    src={`data:image/png;base64, ${selectKaistXrayImgContentsData?.imgSideColorBwRate5}`}
                                                    width={110}
                                                    height={110}
                                                    alt="imgSideColorBwRate5"
                                                />
                                            ) : (
                                                <img src={noImage} width={110} height={110} alt="imgSideColorBwRate5" />
                                            )}
                                        </Card>
                                    </Col>
                                    <Col span={4}>
                                        <Card
                                            title="채도 6"
                                            size="small"
                                            style={{
                                                width: '140px',
                                                border: '1px solid #cdcdcd',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {selectKaistXrayImgContentsData?.imgSideColorBwRate6 !== undefined ? (
                                                <Image
                                                    src={`data:image/png;base64, ${selectKaistXrayImgContentsData?.imgSideColorBwRate6}`}
                                                    width={110}
                                                    height={110}
                                                    alt="imgSideColorBwRate6"
                                                />
                                            ) : (
                                                <img src={noImage} width={110} height={110} alt="imgSideColorBwRate6" />
                                            )}
                                        </Card>
                                    </Col>
                                </Row>

                                <Row justify="space-around" style={{ margin: '15px -15px 0px -15px' }}>
                                    <Col span={4}>
                                        <Card
                                            title="흑백"
                                            size="small"
                                            style={{
                                                width: '140px',
                                                border: '1px solid #cdcdcd',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {selectKaistXrayImgContentsData?.imgSideBw !== undefined ? (
                                                <Image
                                                    src={`data:image/png;base64, ${selectKaistXrayImgContentsData?.imgSideBw}`}
                                                    width={110}
                                                    height={110}
                                                    alt="imgSideBw"
                                                />
                                            ) : (
                                                <img src={noImage} width={110} height={110} alt="imgSideBw" />
                                            )}
                                        </Card>
                                    </Col>
                                    <Col span={4}>
                                        <Card
                                            title="흑백무기물"
                                            size="small"
                                            style={{
                                                width: '140px',
                                                border: '1px solid #cdcdcd',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {selectKaistXrayImgContentsData?.imgSideBwMinerals !== undefined ? (
                                                <Image
                                                    src={`data:image/png;base64, ${selectKaistXrayImgContentsData?.imgSideBwMinerals}`}
                                                    width={110}
                                                    height={110}
                                                    alt="imgSideBwMinerals"
                                                />
                                            ) : (
                                                <img src={noImage} width={110} height={110} alt="imgSideBwMinerals" />
                                            )}
                                        </Card>
                                    </Col>
                                    <Col span={4}>
                                        <Card
                                            title="흑백유기물"
                                            size="small"
                                            style={{
                                                width: '140px',
                                                border: '1px solid #cdcdcd',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {selectKaistXrayImgContentsData?.imgSideBwOrganism !== undefined ? (
                                                <Image
                                                    src={`data:image/png;base64, ${selectKaistXrayImgContentsData?.imgSideBwOrganism}`}
                                                    width={110}
                                                    height={110}
                                                    alt="imgSideBwOrganism"
                                                />
                                            ) : (
                                                <img src={noImage} width={110} height={110} alt="imgSideBwOrganism" />
                                            )}
                                        </Card>
                                    </Col>
                                    <Col span={4}>
                                        <Card
                                            title="흑백반전"
                                            size="small"
                                            style={{
                                                width: '140px',
                                                border: '1px solid #cdcdcd',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {selectKaistXrayImgContentsData?.imgSideBwReversal !== undefined ? (
                                                <Image
                                                    src={`data:image/png;base64, ${selectKaistXrayImgContentsData?.imgSideBwReversal}`}
                                                    width={110}
                                                    height={110}
                                                    alt="imgSideBwReversal"
                                                />
                                            ) : (
                                                <img src={noImage} width={110} height={110} alt="imgSideBwReversal" />
                                            )}
                                        </Card>
                                    </Col>
                                    <Col span={4}>
                                        <Card
                                            title="흑백채도 1"
                                            size="small"
                                            style={{
                                                width: '140px',
                                                border: '1px solid #cdcdcd',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {selectKaistXrayImgContentsData?.imgSideBwBwRate1 !== undefined ? (
                                                <Image
                                                    src={`data:image/png;base64, ${selectKaistXrayImgContentsData?.imgSideBwBwRate1}`}
                                                    width={110}
                                                    height={110}
                                                    alt="imgSideBwBwRate1"
                                                />
                                            ) : (
                                                <img src={noImage} width={110} height={110} alt="imgSideBwBwRate1" />
                                            )}
                                        </Card>
                                    </Col>
                                </Row>

                                {/* <Space style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '15px' }}> */}
                                <Row justify="space-around" style={{ margin: '15px -15px 0px -15px' }}>
                                    <Col span={4}>
                                        <Card
                                            title="흑백채도 2"
                                            size="small"
                                            style={{
                                                width: '140px',
                                                border: '1px solid #cdcdcd',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {selectKaistXrayImgContentsData?.imgSideBwBwRate2 !== undefined ? (
                                                <Image
                                                    src={`data:image/png;base64, ${selectKaistXrayImgContentsData?.imgSideBwBwRate2}`}
                                                    width={110}
                                                    height={110}
                                                    alt="imgSideBwBwRate2"
                                                />
                                            ) : (
                                                <img src={noImage} width={110} height={110} alt="imgSideBwBwRate2" />
                                            )}
                                        </Card>
                                    </Col>
                                    <Col span={4}>
                                        <Card
                                            title="흑백채도 3"
                                            size="small"
                                            style={{
                                                width: '140px',
                                                border: '1px solid #cdcdcd',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {selectKaistXrayImgContentsData?.imgSideBwBwRate3 !== undefined ? (
                                                <Image
                                                    src={`data:image/png;base64, ${selectKaistXrayImgContentsData?.imgSideBwBwRate3}`}
                                                    width={110}
                                                    height={110}
                                                    alt="imgSideBwBwRate3"
                                                />
                                            ) : (
                                                <img src={noImage} width={110} height={110} alt="imgSideBwBwRate3" />
                                            )}
                                        </Card>
                                    </Col>
                                    <Col span={4}>
                                        <Card
                                            title="흑백채도 4"
                                            size="small"
                                            style={{
                                                width: '140px',
                                                border: '1px solid #cdcdcd',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {selectKaistXrayImgContentsData?.imgSideBwBwRate4 !== undefined ? (
                                                <Image
                                                    src={`data:image/png;base64, ${selectKaistXrayImgContentsData?.imgSideBwBwRate4}`}
                                                    width={110}
                                                    height={110}
                                                    alt="imgSideBwBwRate4"
                                                />
                                            ) : (
                                                <img src={noImage} width={110} height={110} alt="imgSideBwBwRate4" />
                                            )}
                                        </Card>
                                    </Col>
                                    <Col span={4}>
                                        <Card
                                            title="흑백채도 5"
                                            size="small"
                                            style={{
                                                width: '140px',
                                                border: '1px solid #cdcdcd',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {selectKaistXrayImgContentsData?.imgSideBwBwRate5 !== undefined ? (
                                                <Image
                                                    src={`data:image/png;base64, ${selectKaistXrayImgContentsData?.imgSideBwBwRate5}`}
                                                    width={110}
                                                    height={110}
                                                    alt="imgSideBwBwRate5"
                                                />
                                            ) : (
                                                <img src={noImage} width={110} height={110} alt="imgSideBwBwRate5" />
                                            )}
                                        </Card>
                                    </Col>
                                    <Col span={4}>
                                        <Card
                                            title="흑백채도 6"
                                            size="small"
                                            style={{
                                                width: '140px',
                                                border: '1px solid #cdcdcd',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {selectKaistXrayImgContentsData?.imgSideBwBwRate6 !== undefined ? (
                                                <Image
                                                    src={`data:image/png;base64, ${selectKaistXrayImgContentsData?.imgSideBwBwRate6}`}
                                                    width={110}
                                                    height={110}
                                                    alt="imgSideBwBwRate6"
                                                />
                                            ) : (
                                                <img src={noImage} width={110} height={110} alt="imgSideBwBwRate6" />
                                            )}
                                        </Card>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                    <Space style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '50px' }}>
                        <Button
                            style={{
                                padding: '10px 35px',
                                height: '70px',
                                borderRadius: '5px'
                            }}
                            type="primary"
                            danger
                            disabled={selectKaistXrayImgContentsData === undefined ? true : false}
                            onClick={() => handel_sync()}
                        >
                            <span
                                style={{
                                    fontSize: '18px',
                                    fontWeight: '600',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <RetweetOutlined style={{ fontSize: '35px', marginRight: '10px', fontWeight: '900' }} /> 동기화
                            </span>
                        </Button>
                    </Space>
                </MainCard>
            </Typography>

            {/* 의사색채 로딩바 Modal Start */}
            <Modal
                open={createLoding}
                closable={false}
                centered
                width={245}
                style={{
                    left: 130,
                    zIndex: 999
                }}
                footer={null}
            >
                <img src={loding_01} alt="" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
                <Progress percent={prosess_percent} strokeColor={barColors} />
            </Modal>
            {/* 의사색채 로딩바 Modal End */}

            {/* 동기화 로딩바 Modal Start */}
            <Modal
                open={syncLoding}
                closable={false}
                centered
                width={210}
                style={{
                    left: 130,
                    zIndex: 999
                }}
                footer={null}
            >
                <img src={sync_01} alt="" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
            </Modal>
            {/* 동기화 로딩바 Modal End */}
        </>
    );
};
