/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from 'react';
import { Row, Col, Button } from 'antd';
import './WatermarkPrint.css';
import html2canvas from 'html2canvas'; // html2canvas 라이브러리 추가
import 'canvas-toBlob';

import { useSelectCertificationUserMutation } from '../../../hooks/api/StudentsManagement/StudentsManagement';

// 증명서 공백 위쪽 25mm, 왼쪽 22mm, 오른쪽 22mm, 아래쪽 15mm

export const CertificatesPrint = (props) => {
    const [loading, setLoading] = useState(false);
    const contentRef = useRef(null);

    // 이수증 상세
    const [SelectCertificationUserApi] = useSelectCertificationUserMutation(); // 상세 hooks api호출
    const [certificationUserDetail, setCertificationUserDetail] = useState(null);
    const handel_SelectCertificationUser_Api = async (userId, procCd, procSeq) => {
        const SelectCertificationUserResponse = await SelectCertificationUserApi({
            userId: userId,
            procCd: procCd,
            procSeq: procSeq
        });
        setCertificationUserDetail(SelectCertificationUserResponse.data.RET_DATA);
        setLoading(false);
    };

    const date = new Date(certificationUserDetail?.birthDay);
    const Sdate = new Date(certificationUserDetail?.eduStartDate);
    const Edate = new Date(certificationUserDetail?.eduEndDate);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const BirthDate = date.toLocaleDateString('en-US', options);
    const ESDate = Sdate.toLocaleDateString('en-US', options);
    const EEDate = Edate.toLocaleDateString('en-US', options);

    // 프린트 버튼 클릭 시 HTML을 이미지로 변환하고 저장
    const handlePrint = () => {
        const content = contentRef.current;

        html2canvas(content, { useCORS: true }).then((canvas) => {
            canvas.toBlob((blob) => {
                const imgURL = URL.createObjectURL(blob);
                const img = new Image();
                img.src = imgURL;
                img.onload = () => {
                    const uniqueWindowName = 'printWindow' + Date.now();
                    const printWindow = window.open('', uniqueWindowName, 'width=' + window.innerWidth + ',height=' + window.innerHeight);
                    printWindow.document.open();
                    printWindow.document.write('<html><body>');
                    printWindow.document.write('<img src="' + imgURL + '" style="margin-left:40px"/>');
                    printWindow.document.write('</body></html>');
                    printWindow.document.close();
                    printWindow.onload = () => {
                        printWindow.print();
                        printWindow.onafterprint = () => {
                            printWindow.close();
                            URL.revokeObjectURL(imgURL); // 이미지 URL 해제
                        };
                    };
                };
            });
        });
    };

    useEffect(() => {
        setLoading(true);
        handel_SelectCertificationUser_Api(props.userId_props, props.procCd_props, props.procSeq_props);
    }, [props.userId_props, props.procCd_props, props.procSeq_props]);

    return (
        <>
            <div className="watermark-print" ref={contentRef}>
                <div className="watermark-logo" />
                <div className="content">
                    <div
                        style={{
                            textAlign: 'center',
                            fontSize: '12px',
                            fontWeight: '600',
                            fontFamily: 'Verdana',
                            fontFamily: 'KoPubWorldDotumProBold',
                            letterSpacing: '0.03em',
                            paddingTop: '50px'
                        }}
                    >
                        Certificate Number : KSSA202311060001
                    </div>
                    <p style={{ margin: '30px 0px' }}></p>

                    <div
                        style={{
                            textAlign: 'center',
                            fontSize: '35px',
                            fontFamily: 'KoPubWorldBatangProBold'
                        }}
                    >
                        교육이수증명서
                    </div>
                    <div
                        style={{
                            textAlign: 'center',
                            fontSize: '18px',
                            marginTop: '-5px',
                            fontFamily: 'KoPubWorldDotumProBold',
                            letterSpacing: '0.03em'
                        }}
                    >
                        Certificate of Completion
                    </div>
                    <p style={{ margin: '40px 0px' }}></p>
                    <Row>
                        <Col span={7}>
                            <Row>
                                <Col style={{ fontSize: '18px', width: '60px', fontFamily: 'KoPubWorldBatangProMedium' }}>성명 : </Col>
                                <Col style={{ fontSize: '18px', fontFamily: 'KoPubWorldBatangProMedium' }}>
                                    {certificationUserDetail?.userNm}
                                </Col>
                            </Row>
                            <Row>
                                <Col style={{ fontSize: '13px', width: '60px', fontFamily: 'KoPubWorldBatangRight' }}>Name</Col>
                                <Col style={{ fontSize: '13px', fontFamily: 'KoPubWorldDotumProMedium' }}>
                                    {certificationUserDetail?.userNmEn}
                                </Col>
                            </Row>
                        </Col>
                        <Col span={10} offset={7}>
                            <Row>
                                <Col style={{ fontSize: '18px', width: '90px', fontFamily: 'KoPubWorldBatangProMedium' }}>생년월일 : </Col>
                                <Col style={{ fontSize: '18px', fontFamily: 'KoPubWorldBatangProMedium' }}>
                                    {certificationUserDetail?.birthDay}
                                </Col>
                            </Row>
                            <Row>
                                <Col style={{ fontSize: '13px', width: '90px', fontFamily: 'KoPubWorldDotumProMedium' }}>Date of Birth</Col>
                                <Col style={{ fontSize: '13px', fontFamily: 'KoPubWorldDotumProMedium' }}>{BirthDate}</Col>
                            </Row>
                        </Col>
                    </Row>
                    <p style={{ margin: '10px 0px' }}></p>
                    <Row>
                        <Col span={24}>
                            <Row>
                                <Col style={{ fontSize: '18px', width: '60px', fontFamily: 'KoPubWorldBatangProMedium' }}>주소 : </Col>
                                <Col style={{ fontSize: '18px', fontFamily: 'KoPubWorldBatangProMedium' }}>
                                    {certificationUserDetail?.address}
                                </Col>
                            </Row>
                            <Row>
                                <Col style={{ fontSize: '13px', width: '60px', fontFamily: 'KoPubWorldDotumProMedium' }}>Address</Col>
                                <Col style={{ fontSize: '13px', fontFamily: 'KoPubWorldDotumProMedium' }}>
                                    {certificationUserDetail?.addressEn}
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <p style={{ margin: '40px 0px' }}></p>
                    <Row>
                        <Col span={24}>
                            <Row>
                                <Col style={{ fontSize: '17px', fontFamily: 'KoPubWorldBatangProMedium' }}>
                                    위 사람은 『항공보안법』 제28조, 같은 법 시행규칙 제15조 및 국가민간항공보안 교육훈련지침에 따른
                                    교육과정을 이수하였음을 증명합니다.
                                </Col>
                            </Row>
                            <Row>
                                <Col style={{ fontSize: '12.2px', fontFamily: 'KoPubWorldDotumProLight' }}>
                                    The person named above has successfully completed all the required training course in accordance with
                                    the article 28 of Aviation Security Act, Article 15 of the Enforcement Rules and National Civil Aviation
                                    Security Education and Training Guideline.
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <p style={{ margin: '40px 0px' }}></p>
                    <Row>
                        <Col span={24}>
                            <Row>
                                <Col
                                    style={{
                                        fontSize: '18px',
                                        fontFamily: 'KoPubWorldBatangProMedium',
                                        width: '105px',
                                        letterSpacing: '0.20em'
                                    }}
                                >
                                    과정명 :{' '}
                                </Col>
                                <Col style={{ fontSize: '18px', fontFamily: 'KoPubWorldBatangProMedium' }}>
                                    {certificationUserDetail?.eduName}
                                </Col>
                            </Row>
                            <Row>
                                <Col style={{ fontSize: '13px', width: '105px' }}>Course</Col>
                                <Col style={{ fontSize: '13px', fontFamily: 'KoPubWorldDotumProMedium' }}>
                                    Aviation Security Initial Training
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <p style={{ margin: '10px 0px' }}></p>
                    <Row>
                        <Col span={24}>
                            <Row>
                                <Col style={{ fontSize: '18px', fontFamily: 'KoPubWorldBatangProMedium', width: '105px' }}>교육기간 : </Col>
                                <Col style={{ fontSize: '18px', fontFamily: 'KoPubWorldBatangProMedium' }}>
                                    {certificationUserDetail?.eduStartDate.split('-')[0]}
                                    {'. '}
                                    {certificationUserDetail?.eduStartDate.split('-')[1]}
                                    {'. '}
                                    {certificationUserDetail?.eduStartDate.split('-')[2]} ~{' '}
                                    {certificationUserDetail?.eduEndDate.split('-')[0]}
                                    {'. '} {certificationUserDetail?.eduEndDate.split('-')[1]}
                                    {'. '}
                                    {certificationUserDetail?.eduEndDate.split('-')[2]}
                                </Col>
                            </Row>
                            <Row>
                                <Col style={{ fontSize: '13px', width: '105px', fontFamily: 'KoPubWorldDotumProMedium' }}>Period</Col>
                                <Col style={{ fontSize: '13px', fontFamily: 'KoPubWorldDotumProMedium' }}>
                                    {ESDate} ~ {EEDate}
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    <p style={{ margin: '35px 0px' }}></p>
                    <Row>
                        <Col span={24}>
                            <Row>
                                <Col style={{ fontSize: '18px', width: '100%', textAlign: 'center', fontFamily: 'KoPubWorldBatangBold' }}>
                                    {certificationUserDetail?.eduEndDate.split('-')[0]}년{' '}
                                    {certificationUserDetail?.eduEndDate.split('-')[1]}월{' '}
                                    {certificationUserDetail?.eduEndDate.split('-')[2]}일
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <p style={{ margin: '35px 0px' }}></p>
                    <Row>
                        <Col span={24}>
                            <Row>
                                <Col
                                    style={{
                                        fontSize: '25px',
                                        width: '100%',
                                        textAlign: 'center',
                                        fontWeight: 'bold',
                                        position: 'relative'
                                    }}
                                >
                                    <text style={{ fontFamily: 'KoPubWorldBatangBold', zIndex: 101 }}>한국보안인재개발원장</text>
                                    <div
                                        style={{
                                            backgroundImage: `url(${require('../../../assets/images/auth/KakaoTalk_20231106_120921812_01.png')}`,
                                            position: 'absolute',
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: 'center',
                                            backgroundSize: 'contain',
                                            top: '-35px',
                                            left: '123px',
                                            width: '100%',
                                            height: '80px',
                                            zIndex: 100
                                        }}
                                    ></div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </div>
            <div style={{ textAlign: 'right', marginTop: '20px' }}>
                <Button type="primary" style={{ width: '160px', height: ' 60px', lineHeight: '30px' }} onClick={handlePrint}>
                    이수 증명서 출력
                </Button>
            </div>
        </>
    );
};
