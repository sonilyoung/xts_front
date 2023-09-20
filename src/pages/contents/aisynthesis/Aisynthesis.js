/* eslint-disable */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Row, Col, Form, Space, Card, Button, Input, Typography, Modal } from 'antd';
// import { Typography } from '@mui/material';
import { PlusOutlined, EditFilled, DeleteFilled, UploadOutlined, MinusCircleOutlined } from '@ant-design/icons';

import MainCard from 'components/MainCard';
import noImage from 'assets/images/no_imgae.png';

export const Aisynthesis = () => {
    const { confirm } = Modal;
    const [form] = Form.useForm();
    const { Text, Link } = Typography;

    const [loading, setLoading] = useState(false); // 로딩 초기값
    const [dataSource, setDataSource] = useState([]); // Table 데이터 값

    const colStyle = {
        border: '1px solid #cdcdcd',
        textAlign: 'center'
    };

    return (
        <>
            <Typography variant="body1">
                <MainCard>
                    <Row gutter={[24, 24]}>
                        <Col span={12}>
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
                                            value="X00000"
                                            style={{ width: '150px' }}
                                            readonly
                                        />
                                        <Button type="primary">의사색채 영상합성</Button>
                                    </Space>
                                }
                            >
                                <Space style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Row gutter={[24, 24]}>
                                        <Col span={12}>
                                            <Button
                                                icon={<UploadOutlined />}
                                                style={{
                                                    width: '320px',
                                                    height: '40px',
                                                    padding: '10px',
                                                    backgroundColor: '#f0f0f0',
                                                    marginBottom: '10px'
                                                }}
                                            >
                                                정면이미지
                                            </Button>
                                            <input type="file" name="3DimgFront" style={{ display: 'none' }} />
                                            <img src={noImage} width={320} height={220} alt="real image" />
                                        </Col>
                                        <Col span={12}>
                                            <Button
                                                icon={<UploadOutlined />}
                                                style={{
                                                    width: '320px',
                                                    height: '40px',
                                                    padding: '10px',
                                                    backgroundColor: '#f0f0f0',
                                                    marginBottom: '10px'
                                                }}
                                            >
                                                측면이미지
                                            </Button>
                                            <input type="file" name="3DimgSide" style={{ display: 'none' }} />
                                            <img src={noImage} width={320} height={220} alt="real image" />
                                        </Col>
                                    </Row>
                                </Space>
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card
                                title={<span style={{ fontSize: '0.9rem' }}>2D 영상합성</span>}
                                extra={<Button type="primary">2D 영상합성</Button>}
                            >
                                <Space style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Row gutter={[24, 24]}>
                                        <Col span={12}>
                                            <Button
                                                icon={<UploadOutlined />}
                                                style={{
                                                    width: '320px',
                                                    height: '40px',
                                                    padding: '10px',
                                                    backgroundColor: '#f0f0f0',
                                                    marginBottom: '10px'
                                                }}
                                            >
                                                정면이미지
                                            </Button>
                                            <input type="file" name="2DimgFront" style={{ display: 'none' }} />
                                            <img src={noImage} width={320} height={220} alt="real image" />
                                        </Col>
                                        <Col span={12}>
                                            <Button
                                                icon={<UploadOutlined />}
                                                style={{
                                                    width: '320px',
                                                    height: '40px',
                                                    padding: '10px',
                                                    backgroundColor: '#f0f0f0',
                                                    marginBottom: '10px'
                                                }}
                                            >
                                                측면이미지
                                            </Button>
                                            <input type="file" name="2DimgSide" style={{ display: 'none' }} />
                                            <img src={noImage} width={320} height={220} alt="real image" />
                                        </Col>
                                    </Row>
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
                                <Space style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Row justify="space-between">
                                        <Col span={4} style={colStyle}>
                                            <Button
                                                icon={<UploadOutlined />}
                                                style={{
                                                    width: '100px',
                                                    height: '30px',
                                                    padding: '5px',
                                                    backgroundColor: '#f0f0f0',
                                                    margin: '10px 0px'
                                                }}
                                            >
                                                컬러 1
                                            </Button>
                                            <input type="file" name="imgFrontColor" style={{ display: 'none' }} />
                                            <img src={noImage} width={100} height={100} alt="real image" />
                                        </Col>
                                        <Col span={4} style={colStyle}>
                                            <Button
                                                icon={<UploadOutlined />}
                                                style={{
                                                    width: '100px',
                                                    height: '30px',
                                                    padding: '5px',
                                                    backgroundColor: '#f0f0f0',
                                                    margin: '10px 0px'
                                                }}
                                            >
                                                무기물
                                            </Button>
                                            <input type="file" name="ImgFrontColorMineral" style={{ display: 'none' }} />
                                            <img src={noImage} width={100} height={100} alt="real image" />
                                        </Col>
                                        <Col span={4} style={colStyle}>
                                            <Button
                                                icon={<UploadOutlined />}
                                                style={{
                                                    width: '100px',
                                                    height: '30px',
                                                    padding: '5px',
                                                    backgroundColor: '#f0f0f0',
                                                    margin: '10px 0px'
                                                }}
                                            >
                                                유기물
                                            </Button>
                                            <input type="file" name="imgFrontColorOrganism" style={{ display: 'none' }} />
                                            <img src={noImage} width={100} height={100} alt="real image" />
                                        </Col>
                                        <Col span={4} style={colStyle}>
                                            <Button
                                                icon={<UploadOutlined />}
                                                style={{
                                                    width: '100px',
                                                    height: '30px',
                                                    padding: '5px',
                                                    backgroundColor: '#f0f0f0',
                                                    margin: '10px 0px'
                                                }}
                                            >
                                                반전
                                            </Button>
                                            <input type="file" name="ImgFrontColorReversal" style={{ display: 'none' }} />
                                            <img src={noImage} width={100} height={100} alt="real image" />
                                        </Col>
                                        <Col span={4} style={colStyle}>
                                            <Button
                                                icon={<UploadOutlined />}
                                                style={{
                                                    width: '100px',
                                                    height: '30px',
                                                    padding: '5px',
                                                    backgroundColor: '#f0f0f0',
                                                    margin: '10px 0px'
                                                }}
                                            >
                                                채도 1
                                            </Button>
                                            <input type="file" name="imgFrontColorBwRate1" style={{ display: 'none' }} />
                                            <img src={noImage} width={100} height={100} alt="real image" />
                                        </Col>
                                    </Row>
                                </Space>

                                <Space style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '15px' }}>
                                    <Row justify="space-between">
                                        <Col span={4} style={colStyle}>
                                            <Button
                                                icon={<UploadOutlined />}
                                                style={{
                                                    width: '100px',
                                                    height: '30px',
                                                    padding: '5px',
                                                    backgroundColor: '#f0f0f0',
                                                    margin: '10px 0px'
                                                }}
                                            >
                                                채도 2
                                            </Button>
                                            <input type="file" name="imgFrontColorBwRate2" style={{ display: 'none' }} />
                                            <img src={noImage} width={100} height={100} alt="real image" />
                                        </Col>
                                        <Col span={4} style={colStyle}>
                                            <Button
                                                icon={<UploadOutlined />}
                                                style={{
                                                    width: '100px',
                                                    height: '30px',
                                                    padding: '5px',
                                                    backgroundColor: '#f0f0f0',
                                                    margin: '10px 0px'
                                                }}
                                            >
                                                채도 3
                                            </Button>
                                            <input type="file" name="imgFrontColorBwRate3" style={{ display: 'none' }} />
                                            <img src={noImage} width={100} height={100} alt="real image" />
                                        </Col>
                                        <Col span={4} style={colStyle}>
                                            <Button
                                                icon={<UploadOutlined />}
                                                style={{
                                                    width: '100px',
                                                    height: '30px',
                                                    padding: '5px',
                                                    backgroundColor: '#f0f0f0',
                                                    margin: '10px 0px'
                                                }}
                                            >
                                                채도 4
                                            </Button>
                                            <input type="file" name="imgFrontColorBwRate4" style={{ display: 'none' }} />
                                            <img src={noImage} width={100} height={100} alt="real image" />
                                        </Col>
                                        <Col span={4} style={colStyle}>
                                            <Button
                                                icon={<UploadOutlined />}
                                                style={{
                                                    width: '100px',
                                                    height: '30px',
                                                    padding: '5px',
                                                    backgroundColor: '#f0f0f0',
                                                    margin: '10px 0px'
                                                }}
                                            >
                                                채도 5
                                            </Button>
                                            <input type="file" name="imgFrontColorBwRate5" style={{ display: 'none' }} />
                                            <img src={noImage} width={100} height={100} alt="real image" />
                                        </Col>
                                        <Col span={4} style={colStyle}>
                                            <Button
                                                icon={<UploadOutlined />}
                                                style={{
                                                    width: '100px',
                                                    height: '30px',
                                                    padding: '5px',
                                                    backgroundColor: '#f0f0f0',
                                                    margin: '10px 0px'
                                                }}
                                            >
                                                채도 6
                                            </Button>
                                            <input type="file" name="imgFrontColorBwRate6" style={{ display: 'none' }} />
                                            <img src={noImage} width={100} height={100} alt="real image" />
                                        </Col>
                                    </Row>
                                </Space>

                                <Space style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '15px' }}>
                                    <Row justify="space-between">
                                        <Col span={4} style={colStyle}>
                                            <Button
                                                icon={<UploadOutlined />}
                                                style={{
                                                    width: '100px',
                                                    height: '30px',
                                                    padding: '5px',
                                                    backgroundColor: '#f0f0f0',
                                                    margin: '10px 0px'
                                                }}
                                            >
                                                흑백
                                            </Button>
                                            <input type="file" name="imgFrontBw" style={{ display: 'none' }} />
                                            <img src={noImage} width={100} height={100} alt="real image" />
                                        </Col>
                                        <Col span={4} style={colStyle}>
                                            <Button
                                                icon={<UploadOutlined />}
                                                style={{
                                                    width: '100px',
                                                    height: '30px',
                                                    padding: '5px',
                                                    backgroundColor: '#f0f0f0',
                                                    margin: '10px 0px'
                                                }}
                                            >
                                                흑백무기물
                                            </Button>
                                            <input type="file" name="imgFrontBwMineral" style={{ display: 'none' }} />
                                            <img src={noImage} width={100} height={100} alt="real image" />
                                        </Col>
                                        <Col span={4} style={colStyle}>
                                            <Button
                                                icon={<UploadOutlined />}
                                                style={{
                                                    width: '100px',
                                                    height: '30px',
                                                    padding: '5px',
                                                    backgroundColor: '#f0f0f0',
                                                    margin: '10px 0px'
                                                }}
                                            >
                                                흑백유기물
                                            </Button>
                                            <input type="file" name="imgFrontBwOrganism" style={{ display: 'none' }} />
                                            <img src={noImage} width={100} height={100} alt="real image" />
                                        </Col>
                                        <Col span={4} style={colStyle}>
                                            <Button
                                                icon={<UploadOutlined />}
                                                style={{
                                                    width: '100px',
                                                    height: '30px',
                                                    padding: '5px',
                                                    backgroundColor: '#f0f0f0',
                                                    margin: '10px 0px'
                                                }}
                                            >
                                                흑백반전
                                            </Button>
                                            <input type="file" name="imgFrontBwReversal" style={{ display: 'none' }} />
                                            <img src={noImage} width={100} height={100} alt="real image" />
                                        </Col>
                                        <Col span={4} style={colStyle}>
                                            <Button
                                                icon={<UploadOutlined />}
                                                style={{
                                                    width: '100px',
                                                    height: '30px',
                                                    padding: '5px',
                                                    backgroundColor: '#f0f0f0',
                                                    margin: '10px 0px'
                                                }}
                                            >
                                                흑백채도 1
                                            </Button>
                                            <input type="file" name="imgFrontBwBwRate1" style={{ display: 'none' }} />
                                            <img src={noImage} width={100} height={100} alt="real image" />
                                        </Col>
                                    </Row>
                                </Space>

                                <Space style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '15px' }}>
                                    <Row justify="space-between">
                                        <Col span={4} style={colStyle}>
                                            <Button
                                                icon={<UploadOutlined />}
                                                style={{
                                                    width: '100px',
                                                    height: '30px',
                                                    padding: '5px',
                                                    backgroundColor: '#f0f0f0',
                                                    margin: '10px 0px'
                                                }}
                                            >
                                                흑백채도 2
                                            </Button>
                                            <input type="file" name="imgFrontBwBwRate2" style={{ display: 'none' }} />
                                            <img src={noImage} width={100} height={100} alt="real image" />
                                        </Col>
                                        <Col span={4} style={colStyle}>
                                            <Button
                                                icon={<UploadOutlined />}
                                                style={{
                                                    width: '100px',
                                                    height: '30px',
                                                    padding: '5px',
                                                    backgroundColor: '#f0f0f0',
                                                    margin: '10px 0px'
                                                }}
                                            >
                                                흑백채도 3
                                            </Button>
                                            <input type="file" name="imgFrontBwBwRate3" style={{ display: 'none' }} />
                                            <img src={noImage} width={100} height={100} alt="real image" />
                                        </Col>
                                        <Col span={4} style={colStyle}>
                                            <Button
                                                icon={<UploadOutlined />}
                                                style={{
                                                    width: '100px',
                                                    height: '30px',
                                                    padding: '5px',
                                                    backgroundColor: '#f0f0f0',
                                                    margin: '10px 0px'
                                                }}
                                            >
                                                흑백채도 4
                                            </Button>
                                            <input type="file" name="imgFrontBwBwRate4" style={{ display: 'none' }} />
                                            <img src={noImage} width={100} height={100} alt="real image" />
                                        </Col>
                                        <Col span={4} style={colStyle}>
                                            <Button
                                                icon={<UploadOutlined />}
                                                style={{
                                                    width: '100px',
                                                    height: '30px',
                                                    padding: '5px',
                                                    backgroundColor: '#f0f0f0',
                                                    margin: '10px 0px'
                                                }}
                                            >
                                                흑백채도 5
                                            </Button>
                                            <input type="file" name="imgFrontBwBwRate5" style={{ display: 'none' }} />
                                            <img src={noImage} width={100} height={100} alt="real image" />
                                        </Col>
                                        <Col span={4} style={colStyle}>
                                            <Button
                                                icon={<UploadOutlined />}
                                                style={{
                                                    width: '100px',
                                                    height: '30px',
                                                    padding: '5px',
                                                    backgroundColor: '#f0f0f0',
                                                    margin: '10px 0px'
                                                }}
                                            >
                                                흑백채도 6
                                            </Button>
                                            <input type="file" name="imgFrontBwBwRate6" style={{ display: 'none' }} />
                                            <img src={noImage} width={100} height={100} alt="real image" />
                                        </Col>
                                    </Row>
                                </Space>
                            </Card>
                        </Col>

                        {/* 측면 */}
                        <Col span={12}>
                            <Card style={{ border: '1px solid #f28b82' }} title={<h4>측면</h4>}>
                                <Space style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Row justify="space-between">
                                        <Col span={4} style={colStyle}>
                                            <Button
                                                icon={<UploadOutlined />}
                                                style={{
                                                    width: '100px',
                                                    height: '30px',
                                                    padding: '5px',
                                                    backgroundColor: '#f0f0f0',
                                                    margin: '10px 0px'
                                                }}
                                            >
                                                컬러
                                            </Button>
                                            <input type="file" name="imgSideColor" style={{ display: 'none' }} />
                                            <img src={noImage} width={100} height={100} alt="real image" />
                                        </Col>
                                        <Col span={4} style={colStyle}>
                                            <Button
                                                icon={<UploadOutlined />}
                                                style={{
                                                    width: '100px',
                                                    height: '30px',
                                                    padding: '5px',
                                                    backgroundColor: '#f0f0f0',
                                                    margin: '10px 0px'
                                                }}
                                            >
                                                무기물
                                            </Button>
                                            <input type="file" name="imgSideColorMineral" style={{ display: 'none' }} />
                                            <img src={noImage} width={100} height={100} alt="real image" />
                                        </Col>
                                        <Col span={4} style={colStyle}>
                                            <Button
                                                icon={<UploadOutlined />}
                                                style={{
                                                    width: '100px',
                                                    height: '30px',
                                                    padding: '5px',
                                                    backgroundColor: '#f0f0f0',
                                                    margin: '10px 0px'
                                                }}
                                            >
                                                유기물
                                            </Button>
                                            <input type="file" name="imgSideColorOrganism" style={{ display: 'none' }} />
                                            <img src={noImage} width={100} height={100} alt="real image" />
                                        </Col>
                                        <Col span={4} style={colStyle}>
                                            <Button
                                                icon={<UploadOutlined />}
                                                style={{
                                                    width: '100px',
                                                    height: '30px',
                                                    padding: '5px',
                                                    backgroundColor: '#f0f0f0',
                                                    margin: '10px 0px'
                                                }}
                                            >
                                                반전
                                            </Button>
                                            <input type="file" name="imgSideColorReversal" style={{ display: 'none' }} />
                                            <img src={noImage} width={100} height={100} alt="real image" />
                                        </Col>
                                        <Col span={4} style={colStyle}>
                                            <Button
                                                icon={<UploadOutlined />}
                                                style={{
                                                    width: '100px',
                                                    height: '30px',
                                                    padding: '5px',
                                                    backgroundColor: '#f0f0f0',
                                                    margin: '10px 0px'
                                                }}
                                            >
                                                채도 1
                                            </Button>
                                            <input type="file" name="imgSideColorBwRate1" style={{ display: 'none' }} />
                                            <img src={noImage} width={100} height={100} alt="real image" />
                                        </Col>
                                    </Row>
                                </Space>

                                <Space style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '15px' }}>
                                    <Row justify="space-between">
                                        <Col span={4} style={colStyle}>
                                            <Button
                                                icon={<UploadOutlined />}
                                                style={{
                                                    width: '100px',
                                                    height: '30px',
                                                    padding: '5px',
                                                    backgroundColor: '#f0f0f0',
                                                    margin: '10px 0px'
                                                }}
                                            >
                                                채도 2
                                            </Button>
                                            <input type="file" name="imgSideColorBwRate2" style={{ display: 'none' }} />
                                            <img src={noImage} width={100} height={100} alt="real image" />
                                        </Col>
                                        <Col span={4} style={colStyle}>
                                            <Button
                                                icon={<UploadOutlined />}
                                                style={{
                                                    width: '100px',
                                                    height: '30px',
                                                    padding: '5px',
                                                    backgroundColor: '#f0f0f0',
                                                    margin: '10px 0px'
                                                }}
                                            >
                                                채도 3
                                            </Button>
                                            <input type="file" name="imgSideColorBwRate3" style={{ display: 'none' }} />
                                            <img src={noImage} width={100} height={100} alt="real image" />
                                        </Col>
                                        <Col span={4} style={colStyle}>
                                            <Button
                                                icon={<UploadOutlined />}
                                                style={{
                                                    width: '100px',
                                                    height: '30px',
                                                    padding: '5px',
                                                    backgroundColor: '#f0f0f0',
                                                    margin: '10px 0px'
                                                }}
                                            >
                                                채도 4
                                            </Button>
                                            <input type="file" name="imgSideColorBwRate4" style={{ display: 'none' }} />
                                            <img src={noImage} width={100} height={100} alt="real image" />
                                        </Col>
                                        <Col span={4} style={colStyle}>
                                            <Button
                                                icon={<UploadOutlined />}
                                                style={{
                                                    width: '100px',
                                                    height: '30px',
                                                    padding: '5px',
                                                    backgroundColor: '#f0f0f0',
                                                    margin: '10px 0px'
                                                }}
                                            >
                                                채도 5
                                            </Button>
                                            <input type="file" name="imgSideColorBwRate5" style={{ display: 'none' }} />
                                            <img src={noImage} width={100} height={100} alt="real image" />
                                        </Col>
                                        <Col span={4} style={colStyle}>
                                            <Button
                                                icon={<UploadOutlined />}
                                                style={{
                                                    width: '100px',
                                                    height: '30px',
                                                    padding: '5px',
                                                    backgroundColor: '#f0f0f0',
                                                    margin: '10px 0px'
                                                }}
                                            >
                                                채도 6
                                            </Button>
                                            <input type="file" name="imgSideColorBwRate6" style={{ display: 'none' }} />
                                            <img src={noImage} width={100} height={100} alt="real image" />
                                        </Col>
                                    </Row>
                                </Space>

                                <Space style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '15px' }}>
                                    <Row justify="space-between">
                                        <Col span={4} style={colStyle}>
                                            <Button
                                                icon={<UploadOutlined />}
                                                style={{
                                                    width: '100px',
                                                    height: '30px',
                                                    padding: '5px',
                                                    backgroundColor: '#f0f0f0',
                                                    margin: '10px 0px'
                                                }}
                                            >
                                                흑백
                                            </Button>
                                            <input type="file" name="imgSideBw" style={{ display: 'none' }} />
                                            <img src={noImage} width={100} height={100} alt="real image" />
                                        </Col>
                                        <Col span={4} style={colStyle}>
                                            <Button
                                                icon={<UploadOutlined />}
                                                style={{
                                                    width: '100px',
                                                    height: '30px',
                                                    padding: '5px',
                                                    backgroundColor: '#f0f0f0',
                                                    margin: '10px 0px'
                                                }}
                                            >
                                                흑백무기물
                                            </Button>
                                            <input type="file" name="imgSideBwMinerals" style={{ display: 'none' }} />
                                            <img src={noImage} width={100} height={100} alt="real image" />
                                        </Col>
                                        <Col span={4} style={colStyle}>
                                            <Button
                                                icon={<UploadOutlined />}
                                                style={{
                                                    width: '100px',
                                                    height: '30px',
                                                    padding: '5px',
                                                    backgroundColor: '#f0f0f0',
                                                    margin: '10px 0px'
                                                }}
                                            >
                                                흑백유기물
                                            </Button>
                                            <input type="file" name="imgSideBwOrganism" style={{ display: 'none' }} />
                                            <img src={noImage} width={100} height={100} alt="real image" />
                                        </Col>
                                        <Col span={4} style={colStyle}>
                                            <Button
                                                icon={<UploadOutlined />}
                                                style={{
                                                    width: '100px',
                                                    height: '30px',
                                                    padding: '5px',
                                                    backgroundColor: '#f0f0f0',
                                                    margin: '10px 0px'
                                                }}
                                            >
                                                흑백반전
                                            </Button>
                                            <input type="file" name="imgSideBwReversal" style={{ display: 'none' }} />
                                            <img src={noImage} width={100} height={100} alt="real image" />
                                        </Col>
                                        <Col span={4} style={colStyle}>
                                            <Button
                                                icon={<UploadOutlined />}
                                                style={{
                                                    width: '100px',
                                                    height: '30px',
                                                    padding: '5px',
                                                    backgroundColor: '#f0f0f0',
                                                    margin: '10px 0px'
                                                }}
                                            >
                                                흑백채도 1
                                            </Button>
                                            <input type="file" name="imgSideBwBwRate1" style={{ display: 'none' }} />
                                            <img src={noImage} width={100} height={100} alt="real image" />
                                        </Col>
                                    </Row>
                                </Space>

                                <Space style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '15px' }}>
                                    <Row justify="space-between">
                                        <Col span={4} style={colStyle}>
                                            <Button
                                                icon={<UploadOutlined />}
                                                style={{
                                                    width: '100px',
                                                    height: '30px',
                                                    padding: '5px',
                                                    backgroundColor: '#f0f0f0',
                                                    margin: '10px 0px'
                                                }}
                                            >
                                                흑백채도 2
                                            </Button>
                                            <input type="file" name="imgSideBwBwRate2" style={{ display: 'none' }} />
                                            <img src={noImage} width={100} height={100} alt="real image" />
                                        </Col>
                                        <Col span={4} style={colStyle}>
                                            <Button
                                                icon={<UploadOutlined />}
                                                style={{
                                                    width: '100px',
                                                    height: '30px',
                                                    padding: '5px',
                                                    backgroundColor: '#f0f0f0',
                                                    margin: '10px 0px'
                                                }}
                                            >
                                                흑백채도 3
                                            </Button>
                                            <input type="file" name="imgSideBwBwRate3" style={{ display: 'none' }} />
                                            <img src={noImage} width={100} height={100} alt="real image" />
                                        </Col>
                                        <Col span={4} style={colStyle}>
                                            <Button
                                                icon={<UploadOutlined />}
                                                style={{
                                                    width: '100px',
                                                    height: '30px',
                                                    padding: '5px',
                                                    backgroundColor: '#f0f0f0',
                                                    margin: '10px 0px'
                                                }}
                                            >
                                                흑백채도 4
                                            </Button>
                                            <input type="file" name="imgSideBwBwRate4" style={{ display: 'none' }} />
                                            <img src={noImage} width={100} height={100} alt="real image" />
                                        </Col>
                                        <Col span={4} style={colStyle}>
                                            <Button
                                                icon={<UploadOutlined />}
                                                style={{
                                                    width: '100px',
                                                    height: '30px',
                                                    padding: '5px',
                                                    backgroundColor: '#f0f0f0',
                                                    margin: '10px 0px'
                                                }}
                                            >
                                                흑백채도 5
                                            </Button>
                                            <input type="file" name="imgSideBwBwRate5" style={{ display: 'none' }} />
                                            <img src={noImage} width={100} height={100} alt="real image" />
                                        </Col>
                                        <Col span={4} style={colStyle}>
                                            <Button
                                                icon={<UploadOutlined />}
                                                style={{
                                                    width: '100px',
                                                    height: '30px',
                                                    padding: '5px',
                                                    backgroundColor: '#f0f0f0',
                                                    margin: '10px 0px'
                                                }}
                                            >
                                                흑백채도 6
                                            </Button>
                                            <input type="file" name="imgSideBwBwRate6" style={{ display: 'none' }} />
                                            <img src={noImage} width={100} height={100} alt="real image" />
                                        </Col>
                                    </Row>
                                </Space>
                            </Card>
                        </Col>
                    </Row>
                </MainCard>
            </Typography>
        </>
    );
};
