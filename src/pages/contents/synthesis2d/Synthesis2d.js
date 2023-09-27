/* eslint-disable */
import React, { useState } from 'react';
import { Row, Col, Form, Space, Card, Button, Input, Typography, Modal, Upload, Image, Progress, Select } from 'antd';
// import { Typography } from '@mui/material';
import { RetweetOutlined, DeleteFilled, UploadOutlined } from '@ant-design/icons';

import MainCard from 'components/MainCard';
import noImage from 'assets/images/no_imgae.png';
import loding_01 from '../../../assets/images/loding_01.svg';
import sync_01 from '../../../assets/images/sync_01.svg';

// AI 의사색채 : 이미지생성, 진행률, 목록, 상세, 동기화
import {
    useSudoImgExcuteMutation,
    useSelectProgressPerMutation,
    useSelectKaistXrayContentsListMutation,
    useSelectKaistXrayImgContentsMutation,
    useSyncImagesMutation
} from '../../../hooks/api/AisynthesisManagement/AisynthesisManagement';

export const Synthesis2d = () => {
    const { confirm } = Modal;
    const [form] = Form.useForm();
    const { Text, Link } = Typography;
    const barColors = {
        '0%': '#87d068',
        '50%': '#ffe58f',
        '100%': '#ffccc7'
    };

    const [itemContainer, setItemContainer] = useState([]); // 의사색채 이미지 생성 로딩 초기값
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
            handel_SelectKaistXrayImgContents_Api(SudoImgExcuteResponse?.data?.RET_DATA?.bagScanId);
            setProsess_percent('100');
            // console.log('성공');
        } else {
            clearInterval(intervalId);
            // console.log('실패');
        }
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

    // Api 호출 End
    // ===============================

    return (
        <>
            <Typography variant="body1">
                <MainCard>
                    <Row gutter={[24, 24]}>
                        <Col span={16}>
                            <Card
                                title={<span style={{ fontSize: '0.9rem' }}>2D 영상합성</span>}
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
                                            2D 영상합성
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
                        <Col span={8}>
                            <Card title={<span style={{ fontSize: '0.9rem' }}>추출 설정</span>}>
                                <Space>
                                    <Form layout="horizontal" form={form}>
                                        <Row gutter={[24, 24]}>
                                            <Col span={24}>
                                                <Form.Item
                                                    name="form05"
                                                    label="Category"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '※ Category'
                                                        }
                                                    ]}
                                                >
                                                    <Row>
                                                        <Col>
                                                            <Space.Compact size="large">
                                                                <Select
                                                                    style={{ width: '400px' }}
                                                                    label="Select"
                                                                    allowClear
                                                                    placeholder="Select a Category"
                                                                    options={[
                                                                        { value: 'Aerosol', label: 'Aerosol' },
                                                                        { value: 'Alcohol', label: 'Alcohol' },
                                                                        { value: 'Axe', label: 'Axe' },
                                                                        { value: 'Bat', label: 'Bat' },
                                                                        { value: 'Battery', label: 'Battery' },
                                                                        { value: 'Bullet', label: 'Bullet' },
                                                                        { value: 'Chisel', label: 'Chisel' },
                                                                        { value: 'Electronic cigarettes', label: 'Electronic cigarettes' },
                                                                        {
                                                                            value: 'Electronic cigarettes(Liquid)',
                                                                            label: 'Electronic cigarettes(Liquid)'
                                                                        },
                                                                        { value: 'Firecracker', label: 'Firecracker' },
                                                                        { value: 'Gun', label: 'Gun' },
                                                                        { value: 'GunParts', label: 'GunParts' },
                                                                        { value: 'Hammer', label: 'Hammer' },
                                                                        { value: 'HandCuffs', label: 'HandCuffs' },
                                                                        { value: 'HDD', label: 'HDD' },
                                                                        { value: 'Knife', label: 'Knife' },
                                                                        { value: 'Laptop', label: 'Laptop' },
                                                                        { value: 'Lighter', label: 'Lighter' },
                                                                        { value: 'Liquid', label: 'Liquid' },
                                                                        { value: 'Match', label: 'Match' },
                                                                        { value: 'MetalPipe', label: 'MetalPipe' },
                                                                        { value: 'NailClippers', label: 'NailClippers' },
                                                                        { value: 'Plier', label: 'Plier' },
                                                                        { value: 'PrtableGas', label: 'PrtableGas' },
                                                                        { value: 'Saw', label: 'Saw' },
                                                                        { value: 'Scissors', label: 'Scissors' },
                                                                        { value: 'Screwdriver', label: 'Screwdriver' },
                                                                        { value: 'SmartPhone', label: 'SmartPhone' },
                                                                        { value: 'SolidFuel', label: 'SolidFuel' },
                                                                        { value: 'Spanner', label: 'Spanner' },
                                                                        { value: 'SSD', label: 'SSD' },
                                                                        { value: 'stun gun', label: 'stun gun' },
                                                                        { value: 'SupplymentaryBattery', label: 'SupplymentaryBattery' },
                                                                        { value: 'TabletPC', label: 'TabletPC' },
                                                                        { value: 'Thinner', label: 'Thinner' },
                                                                        { value: 'Throwing Knife', label: 'Throwing Knife' },
                                                                        { value: 'USB', label: 'USB' },
                                                                        { value: 'ZippoOil', label: 'ZippoOil' }
                                                                    ]}
                                                                    onChange={(e) => setItemContainer({ ...itemContainer, category: e })}
                                                                    value={itemContainer?.category}
                                                                />
                                                            </Space.Compact>
                                                        </Col>
                                                    </Row>
                                                </Form.Item>
                                            </Col>
                                            <Col span={24}>
                                                <Form.Item
                                                    name="form05"
                                                    label="추출 수량"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '※ 추출 수량'
                                                        }
                                                    ]}
                                                >
                                                    <Row>
                                                        <Col>
                                                            <Space.Compact size="large">
                                                                <Select
                                                                    style={{ width: '400px' }}
                                                                    label="Select"
                                                                    allowClear
                                                                    placeholder="Select a Extraction Quantity"
                                                                    options={[
                                                                        { value: '1', label: '1' },
                                                                        { value: '2', label: '2' },
                                                                        { value: '3', label: '3' },
                                                                        { value: '4', label: '4' },
                                                                        { value: '5', label: '5' },
                                                                        { value: '6', label: '6' },
                                                                        { value: '7', label: '7' },
                                                                        { value: '8', label: '8' },
                                                                        { value: '9', label: '9' },
                                                                        { value: '10', label: '10' },
                                                                        { value: '11', label: '11' },
                                                                        { value: '12', label: '12' },
                                                                        { value: '13', label: '13' },
                                                                        { value: '14', label: '14' },
                                                                        { value: '15', label: '15' },
                                                                        { value: '16', label: '16' },
                                                                        { value: '17', label: '17' },
                                                                        { value: '18', label: '18' },
                                                                        { value: '19', label: '19' },
                                                                        { value: '20', label: '20' }
                                                                    ]}
                                                                    onChange={(e) => setItemContainer({ ...itemContainer, categoryCnt: e })}
                                                                    value={itemContainer?.categoryCnt}
                                                                />
                                                            </Space.Compact>
                                                        </Col>
                                                    </Row>
                                                </Form.Item>
                                            </Col>
                                            <Col span={24}>
                                                <Form.Item
                                                    name="form05"
                                                    label="파일명"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '※ 파일명'
                                                        }
                                                    ]}
                                                >
                                                    <Row>
                                                        <Col>
                                                            <Space.Compact size="large">
                                                                <Input
                                                                    style={{ width: '420px' }}
                                                                    name="fileName"
                                                                    onChange={(e) =>
                                                                        setItemContainer({ ...itemContainer, fileName: e.target.value })
                                                                    }
                                                                    value={itemContainer?.fileName}
                                                                />
                                                            </Space.Compact>
                                                        </Col>
                                                    </Row>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Space>
                            </Card>
                        </Col>
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
                                            title="컬러 1"
                                            size="small"
                                            style={{
                                                width: '140px',
                                                border: '1px solid #cdcdcd',
                                                textAlign: 'center'
                                            }}
                                        >
                                            <input type="file" name="imgFrontColor" style={{ display: 'none' }} />
                                            <img
                                                src={
                                                    selectKaistXrayImgContentsData?.imgFrontColor !== undefined
                                                        ? `data:image/png;base64, ${selectKaistXrayImgContentsData?.imgFrontColor}`
                                                        : noImage
                                                }
                                                width={110}
                                                height={110}
                                                alt="imgFrontColor"
                                            />
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
                                            <img
                                                src={
                                                    selectKaistXrayImgContentsData?.imgFrontColorMineral !== undefined
                                                        ? `data:image/png;base64, ${selectKaistXrayImgContentsData?.imgFrontColorMineral}`
                                                        : noImage
                                                }
                                                width={110}
                                                height={110}
                                                alt="real image"
                                            />
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
                                            <img
                                                src={
                                                    selectKaistXrayImgContentsData?.imgFrontColorOrganism !== undefined
                                                        ? `data:image/png;base64, ${selectKaistXrayImgContentsData?.imgFrontColorOrganism}`
                                                        : noImage
                                                }
                                                width={110}
                                                height={110}
                                                alt="real image"
                                            />
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
                                            <img
                                                src={
                                                    selectKaistXrayImgContentsData?.imgFrontColorReversal !== undefined
                                                        ? `data:image/png;base64, ${selectKaistXrayImgContentsData?.imgFrontColorReversal}`
                                                        : noImage
                                                }
                                                width={110}
                                                height={110}
                                                alt="real image"
                                            />
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
                                            <img
                                                src={
                                                    selectKaistXrayImgContentsData?.imgFrontColorBwRate1 !== undefined
                                                        ? `data:image/png;base64, ${selectKaistXrayImgContentsData?.imgFrontColorBwRate1}`
                                                        : noImage
                                                }
                                                width={110}
                                                height={110}
                                                alt="real image"
                                            />
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
                                            <img
                                                src={
                                                    selectKaistXrayImgContentsData?.imgFrontColorBwRate2 !== undefined
                                                        ? `data:image/png;base64, ${selectKaistXrayImgContentsData?.imgFrontColorBwRate2}`
                                                        : noImage
                                                }
                                                width={110}
                                                height={110}
                                                alt="real image"
                                            />
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
                                            <img
                                                src={
                                                    selectKaistXrayImgContentsData?.imgFrontColorBwRate3 !== undefined
                                                        ? `data:image/png;base64, ${selectKaistXrayImgContentsData?.imgFrontColorBwRate3}`
                                                        : noImage
                                                }
                                                width={110}
                                                height={110}
                                                alt="real image"
                                            />
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
                                            <img
                                                src={
                                                    selectKaistXrayImgContentsData?.imgFrontColorBwRate4 !== undefined
                                                        ? `data:image/png;base64, ${selectKaistXrayImgContentsData?.imgFrontColorBwRate4}`
                                                        : noImage
                                                }
                                                width={110}
                                                height={110}
                                                alt="real image"
                                            />
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
                                            <img
                                                src={
                                                    selectKaistXrayImgContentsData?.imgFrontColorBwRate5 !== undefined
                                                        ? `data:image/png;base64, ${selectKaistXrayImgContentsData?.imgFrontColorBwRate5}`
                                                        : noImage
                                                }
                                                width={110}
                                                height={110}
                                                alt="real image"
                                            />
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
                                            <img
                                                src={
                                                    selectKaistXrayImgContentsData?.imgFrontColorBwRate6 !== undefined
                                                        ? `data:image/png;base64, ${selectKaistXrayImgContentsData?.imgFrontColorBwRate6}`
                                                        : noImage
                                                }
                                                width={110}
                                                height={110}
                                                alt="real image"
                                            />
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
                                            <img
                                                src={
                                                    selectKaistXrayImgContentsData?.imgFrontBw !== undefined
                                                        ? `data:image/png;base64, ${selectKaistXrayImgContentsData?.imgFrontBw}`
                                                        : noImage
                                                }
                                                width={110}
                                                height={110}
                                                alt="real image"
                                            />
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
                                            <img
                                                src={
                                                    selectKaistXrayImgContentsData?.imgFrontBwMineral !== undefined
                                                        ? `data:image/png;base64, ${selectKaistXrayImgContentsData?.imgFrontBwMineral}`
                                                        : noImage
                                                }
                                                width={110}
                                                height={110}
                                                alt="real image"
                                            />
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
                                            <img
                                                src={
                                                    selectKaistXrayImgContentsData?.imgFrontBwOrganism !== undefined
                                                        ? `data:image/png;base64, ${selectKaistXrayImgContentsData?.imgFrontBwOrganism}`
                                                        : noImage
                                                }
                                                width={110}
                                                height={110}
                                                alt="real image"
                                            />
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
                                            <img
                                                src={
                                                    selectKaistXrayImgContentsData?.imgFrontBwReversal !== undefined
                                                        ? `data:image/png;base64, ${selectKaistXrayImgContentsData?.imgFrontBwReversal}`
                                                        : noImage
                                                }
                                                width={110}
                                                height={110}
                                                alt="real image"
                                            />
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
                                            <img
                                                src={
                                                    selectKaistXrayImgContentsData?.imgFrontBwBwRate1 !== undefined
                                                        ? `data:image/png;base64, ${selectKaistXrayImgContentsData?.imgFrontBwBwRate1}`
                                                        : noImage
                                                }
                                                width={110}
                                                height={110}
                                                alt="real image"
                                            />
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
                                            <img
                                                src={
                                                    selectKaistXrayImgContentsData?.imgFrontBwBwRate2 !== undefined
                                                        ? `data:image/png;base64, ${selectKaistXrayImgContentsData?.imgFrontBwBwRate2}`
                                                        : noImage
                                                }
                                                width={110}
                                                height={110}
                                                alt="real image"
                                            />
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
                                            <img
                                                src={
                                                    selectKaistXrayImgContentsData?.imgFrontBwBwRate3 !== undefined
                                                        ? `data:image/png;base64, ${selectKaistXrayImgContentsData?.imgFrontBwBwRate3}`
                                                        : noImage
                                                }
                                                width={110}
                                                height={110}
                                                alt="real image"
                                            />
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
                                            <img
                                                src={
                                                    selectKaistXrayImgContentsData?.imgFrontBwBwRate4 !== undefined
                                                        ? `data:image/png;base64, ${selectKaistXrayImgContentsData?.imgFrontBwBwRate4}`
                                                        : noImage
                                                }
                                                width={110}
                                                height={110}
                                                alt="real image"
                                            />
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
                                            <img
                                                src={
                                                    selectKaistXrayImgContentsData?.imgFrontBwBwRate5 !== undefined
                                                        ? `data:image/png;base64, ${selectKaistXrayImgContentsData?.imgFrontBwBwRate5}`
                                                        : noImage
                                                }
                                                width={110}
                                                height={110}
                                                alt="real image"
                                            />
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
                                            <img
                                                src={
                                                    selectKaistXrayImgContentsData?.imgFrontBwBwRate6 !== undefined
                                                        ? `data:image/png;base64, ${selectKaistXrayImgContentsData?.imgFrontBwBwRate6}`
                                                        : noImage
                                                }
                                                width={110}
                                                height={110}
                                                alt="real image"
                                            />
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
                                            <img
                                                src={
                                                    selectKaistXrayImgContentsData?.imgSideColor !== undefined
                                                        ? `data:image/png;base64, ${selectKaistXrayImgContentsData?.imgSideColor}`
                                                        : noImage
                                                }
                                                width={110}
                                                height={110}
                                                alt="real image"
                                            />
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
                                            <img
                                                src={
                                                    selectKaistXrayImgContentsData?.imgSideColorMineral !== undefined
                                                        ? `data:image/png;base64, ${selectKaistXrayImgContentsData?.imgSideColorMineral}`
                                                        : noImage
                                                }
                                                width={110}
                                                height={110}
                                                alt="real image"
                                            />
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
                                            <img
                                                src={
                                                    selectKaistXrayImgContentsData?.imgSideColorOrganism !== undefined
                                                        ? `data:image/png;base64, ${selectKaistXrayImgContentsData?.imgSideColorOrganism}`
                                                        : noImage
                                                }
                                                width={110}
                                                height={110}
                                                alt="real image"
                                            />
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
                                            <img
                                                src={
                                                    selectKaistXrayImgContentsData?.imgSideColorReversal !== undefined
                                                        ? `data:image/png;base64, ${selectKaistXrayImgContentsData?.imgSideColorReversal}`
                                                        : noImage
                                                }
                                                width={100}
                                                height={100}
                                                alt="real image"
                                            />
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
                                            <img
                                                src={
                                                    selectKaistXrayImgContentsData?.imgSideColorBwRate1 !== undefined
                                                        ? `data:image/png;base64, ${selectKaistXrayImgContentsData?.imgSideColorBwRate1}`
                                                        : noImage
                                                }
                                                width={110}
                                                height={110}
                                                alt="real image"
                                            />
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
                                            <img
                                                src={
                                                    selectKaistXrayImgContentsData?.imgSideColorBwRate2 !== undefined
                                                        ? `data:image/png;base64, ${selectKaistXrayImgContentsData?.imgSideColorBwRate2}`
                                                        : noImage
                                                }
                                                width={110}
                                                height={110}
                                                alt="real image"
                                            />
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
                                            <img
                                                src={
                                                    selectKaistXrayImgContentsData?.imgSideColorBwRate3 !== undefined
                                                        ? `data:image/png;base64, ${selectKaistXrayImgContentsData?.imgSideColorBwRate3}`
                                                        : noImage
                                                }
                                                width={110}
                                                height={110}
                                                alt="real image"
                                            />
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
                                            <img
                                                src={
                                                    selectKaistXrayImgContentsData?.imgSideColorBwRate4 !== undefined
                                                        ? `data:image/png;base64, ${selectKaistXrayImgContentsData?.imgSideColorBwRate4}`
                                                        : noImage
                                                }
                                                width={110}
                                                height={110}
                                                alt="real image"
                                            />
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
                                            <img
                                                src={
                                                    selectKaistXrayImgContentsData?.imgSideColorBwRate5 !== undefined
                                                        ? `data:image/png;base64, ${selectKaistXrayImgContentsData?.imgSideColorBwRate5}`
                                                        : noImage
                                                }
                                                width={110}
                                                height={110}
                                                alt="real image"
                                            />
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
                                            <img
                                                src={
                                                    selectKaistXrayImgContentsData?.imgSideColorBwRate6 !== undefined
                                                        ? `data:image/png;base64, ${selectKaistXrayImgContentsData?.imgSideColorBwRate6}`
                                                        : noImage
                                                }
                                                width={110}
                                                height={110}
                                                alt="real image"
                                            />
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
                                            <img
                                                src={
                                                    selectKaistXrayImgContentsData?.imgSideBw !== undefined
                                                        ? `data:image/png;base64, ${selectKaistXrayImgContentsData?.imgSideBw}`
                                                        : noImage
                                                }
                                                width={110}
                                                height={110}
                                                alt="real image"
                                            />
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
                                            <img
                                                src={
                                                    selectKaistXrayImgContentsData?.imgSideBwMinerals !== undefined
                                                        ? `data:image/png;base64, ${selectKaistXrayImgContentsData?.imgSideBwMinerals}`
                                                        : noImage
                                                }
                                                width={110}
                                                height={110}
                                                alt="real image"
                                            />
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
                                            <img
                                                src={
                                                    selectKaistXrayImgContentsData?.imgSideBwOrganism !== undefined
                                                        ? `data:image/png;base64, ${selectKaistXrayImgContentsData?.imgSideBwOrganism}`
                                                        : noImage
                                                }
                                                width={110}
                                                height={110}
                                                alt="real image"
                                            />
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
                                            <img
                                                src={
                                                    selectKaistXrayImgContentsData?.imgSideBwReversal !== undefined
                                                        ? `data:image/png;base64, ${selectKaistXrayImgContentsData?.imgSideBwReversal}`
                                                        : noImage
                                                }
                                                width={110}
                                                height={110}
                                                alt="real image"
                                            />
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
                                            <img
                                                src={
                                                    selectKaistXrayImgContentsData?.imgSideBwBwRate1 !== undefined
                                                        ? `data:image/png;base64, ${selectKaistXrayImgContentsData?.imgSideBwBwRate1}`
                                                        : noImage
                                                }
                                                width={110}
                                                height={110}
                                                alt="real image"
                                            />
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
                                            <img
                                                src={
                                                    selectKaistXrayImgContentsData?.imgSideBwBwRate2 !== undefined
                                                        ? `data:image/png;base64, ${selectKaistXrayImgContentsData?.imgSideBwBwRate2}`
                                                        : noImage
                                                }
                                                width={110}
                                                height={110}
                                                alt="real image"
                                            />
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
                                            <img
                                                src={
                                                    selectKaistXrayImgContentsData?.imgSideBwBwRate3 !== undefined
                                                        ? `data:image/png;base64, ${selectKaistXrayImgContentsData?.imgSideBwBwRate3}`
                                                        : noImage
                                                }
                                                width={110}
                                                height={110}
                                                alt="real image"
                                            />
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
                                            <img
                                                src={
                                                    selectKaistXrayImgContentsData?.imgSideBwBwRate4 !== undefined
                                                        ? `data:image/png;base64, ${selectKaistXrayImgContentsData?.imgSideBwBwRate4}`
                                                        : noImage
                                                }
                                                width={110}
                                                height={110}
                                                alt="real image"
                                            />
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
                                            <img
                                                src={
                                                    selectKaistXrayImgContentsData?.imgSideBwBwRate5 !== undefined
                                                        ? `data:image/png;base64, ${selectKaistXrayImgContentsData?.imgSideBwBwRate5}`
                                                        : noImage
                                                }
                                                width={110}
                                                height={110}
                                                alt="real image"
                                            />
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
                                            <img
                                                src={
                                                    selectKaistXrayImgContentsData?.imgSideBwBwRate6 !== undefined
                                                        ? `data:image/png;base64, ${selectKaistXrayImgContentsData?.imgSideBwBwRate6}`
                                                        : noImage
                                                }
                                                width={110}
                                                height={110}
                                                alt="real image"
                                            />
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
