/* eslint-disable */
import React, { useState } from 'react';
import { Row, Col, Form, Space, Card, Button, Input, Typography, Modal, Upload, Image, Progress, Select } from 'antd';

import MainCard from 'components/MainCard';
import loding_01 from '../../../assets/images/loding_01.svg';
import sync_01 from '../../../assets/images/sync_01.svg';

// AI 의사색채 : 이미지생성, 진행률, 목록, 상세, 동기화
import {
    useTwodGenerationMutation, // 카이스트2D 생성
    useSelectTwodImgMutation, // 카이스트2D 이미지가져오기
    useSelectKaistTwodGenerationMutation // 카이스트2D 생성 이미지상세
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

    // ===============================
    // Api 호출 Start
    // 2D 이미지 생성 ======================================================
    const [TwodGenerationApi] = useTwodGenerationMutation(); // 콘텐츠 정보 관리 hooks api호출
    const handel_TwodGeneration_Api = async () => {
        const TwodGenerationResponse = await TwodGenerationApi({
            category: itemContainer.category,
            categoryCnt: itemContainer.categoryCnt,
            fileName: itemContainer.fileName
        });

        // 진행률
        let counter = '12';
        const intervalId = setInterval(() => {
            counter++;
            setProsess_percent(counter);
        }, 500);

        if (TwodGenerationResponse?.data?.RET_CODE === '0000') {
            clearInterval(intervalId);
            setProsess_percent('100');
            setCreateLoding(false);
            // console.log('성공');
        } else {
            clearInterval(intervalId);
            setProsess_percent('0');
            setCreateLoding(false);
            // console.log('실패');
        }
    };

    // 2D 생성된 이미지 가져오기 ======================================================
    const [SelectTwoDImgApi] = useSelectTwodImgMutation(); // 콘텐츠 정보 관리 hooks api호출
    const handel_SelectTwoDImg_Api = async (fileName) => {
        const SelectTwoDImgResponse = await SelectTwoDImgApi({
            fileName: fileName
        });
        handel_SelectKaistTwodGeneration_Api(fileName);
        setCreateLoding(false);
    };

    // 2D 생성된 이미지 상세 ======================================================
    const [SelectKaistTwodGenerationApi] = useSelectKaistTwodGenerationMutation(); // 콘텐츠 정보 관리 hooks api호출
    const [selectKaistTwodGenerationData, setSelectKaistTwodGenerationData] = useState(null); // 콘텐츠 정보관리 리스트 상단 값
    const handel_SelectKaistTwodGeneration_Api = async (fileName) => {
        const SelectKaistTwodGenerationResponse = await SelectKaistTwodGenerationApi({
            fileName: fileName
        });
        console.log(SelectKaistTwodGenerationResponse?.data?.RET_DATA);
        setSelectKaistTwodGenerationData(SelectKaistTwodGenerationResponse?.data?.RET_DATA);
        setCreateLoding(false);
    };

    // Api 호출 End
    // ===============================

    const Create2D = () => {
        handel_TwodGeneration_Api();
        setCreateLoding(true);
    };

    const Show2D = () => {
        handel_SelectTwoDImg_Api(itemContainer.fileName);
        setCreateLoding(true);
    };

    return (
        <>
            <Typography variant="body1">
                <MainCard>
                    <Row>
                        <Col span={24}>
                            <Card title={<span style={{ fontSize: '1.0rem' }}>2D 영상합성</span>}>
                                <Space style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Form layout="horizontal" form={form}>
                                        <Row>
                                            <Col
                                                xs={{
                                                    span: 24,
                                                    offset: 1
                                                }}
                                                lg={{
                                                    span: 16,
                                                    offset: 2
                                                }}
                                            >
                                                <Form.Item
                                                    name="form05"
                                                    label="카테고리"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '※ 카테고리'
                                                        }
                                                    ]}
                                                >
                                                    <Row>
                                                        <Col>
                                                            <Space.Compact size="large">
                                                                <Select
                                                                    style={{ width: '405px' }}
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
                                                                        {
                                                                            value: 'Electronic cigarettes',
                                                                            label: 'Electronic cigarettes'
                                                                        },
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
                                                                        {
                                                                            value: 'SupplymentaryBattery',
                                                                            label: 'SupplymentaryBattery'
                                                                        },
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
                                                                    style={{ width: '418px' }}
                                                                    name="fileName"
                                                                    onChange={(e) =>
                                                                        setItemContainer({
                                                                            ...itemContainer,
                                                                            fileName: e.target.value
                                                                        })
                                                                    }
                                                                    value={itemContainer?.fileName}
                                                                />
                                                            </Space.Compact>
                                                        </Col>
                                                    </Row>
                                                </Form.Item>
                                            </Col>

                                            <Col
                                                xs={{
                                                    span: 24,
                                                    offset: 1
                                                }}
                                                lg={{
                                                    span: 4,
                                                    offset: 2
                                                }}
                                            >
                                                <Space>
                                                    <Button
                                                        type="primary"
                                                        onClick={() => Create2D()}
                                                        style={{ width: '250px', height: '170px' }}
                                                    >
                                                        <span style={{ fontSize: '18px' }}>2D 영상 합성</span>
                                                    </Button>
                                                    {selectKaistTwodGenerationData === '' ||
                                                    selectKaistTwodGenerationData === undefined ||
                                                    selectKaistTwodGenerationData === null ? (
                                                        ''
                                                    ) : (
                                                        <Button
                                                            type="primary"
                                                            danger
                                                            onClick={() => Show2D()}
                                                            style={{ width: '250px', height: '170px' }}
                                                        >
                                                            <span style={{ fontSize: '18px' }}>
                                                                2D 합성 영상
                                                                <br />
                                                                가져오기
                                                            </span>
                                                        </Button>
                                                    )}
                                                </Space>
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
                    <Space>
                        <Row gutter={[16, 16]}>
                            {selectKaistTwodGenerationData?.towdGenList.map((d, i) => (
                                <Col key={i} span={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Space
                                        direction="vertical"
                                        style={{
                                            justifyContent: 'center',
                                            border: '1px solid #f39898',
                                            padding: '3px 5px'
                                        }}
                                    >
                                        <Image src={'data:image/png;base64,' + d} alt="image" />
                                    </Space>
                                </Col>
                            ))}
                        </Row>
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
