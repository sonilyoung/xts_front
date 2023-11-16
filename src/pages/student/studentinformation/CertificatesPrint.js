/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from 'react';
import { Row, Col, Button } from 'antd';
import './WatermarkPrint.css';
import html2canvas from 'html2canvas'; // html2canvas 라이브러리 추가
import 'canvas-toBlob';

import { useSelectCertificationUserMutation, useInsertCertNumberMutation } from '../../../hooks/api/StudentsManagement/StudentsManagement';

// 증명서 공백 위쪽 25mm, 왼쪽 22mm, 오른쪽 22mm, 아래쪽 15mm

export const CertificatesPrint = (props) => {
    const [loading, setLoading] = useState(false);
    const contentRef = useRef(null);

    // 이수증 상세
    const [SelectCertificationUserApi] = useSelectCertificationUserMutation(); // 상세 hooks api호출
    const [certificationUserDetail, setCertificationUserDetail] = useState(null);
    const handel_SelectCertificationUser_Api = async (Corps_props) => {
        // console.log(Corps_props);
        const SelectCertificationUserResponse = await SelectCertificationUserApi(Corps_props);

        // console.log(SelectCertificationUserResponse.data.RET_DATA);
        setCertificationUserDetail(SelectCertificationUserResponse.data.RET_DATA);
        setLoading(false);
    };

    // 이수증 등록
    const [InsertCertNumberApi] = useInsertCertNumberMutation(); // 상세 hooks api호출
    const handel_InsertCertNumber_Api = async () => {
        const InsertCertNumberResponse = await InsertCertNumberApi([
            {
                certificationId: certificationUserDetail?.certificationId,
                procCd: certificationUserDetail?.procCd,
                procYear: certificationUserDetail?.procYear,
                procSeq: certificationUserDetail?.procSeq,
                eduCode: certificationUserDetail?.eduCode,
                eduName: certificationUserDetail?.eduName,
                userId: certificationUserDetail?.userId,
                userNm: certificationUserDetail?.userNm,
                practiceScore: certificationUserDetail?.practiceScore,
                theoryScore: certificationUserDetail?.theoryScore,
                evaluationScore: certificationUserDetail?.evaluationScore,
                passYn: certificationUserDetail?.passYn,
                eduStartDate: certificationUserDetail?.eduStartDate,
                eduEndDate: certificationUserDetail?.eduEndDate,
                endingYn: certificationUserDetail?.endingYn
            }
        ]);
    };

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
                            URL.revokeObjectURL(imgURL); // 이미지 URL 해제
                            printWindow.close();
                        };
                    };
                };
            });
        });
        handel_InsertCertNumber_Api();
    };

    useEffect(() => {
        setLoading(true);
        handel_SelectCertificationUser_Api(props.Corps_props);
    }, [props.Corps_props]);

    return (
        <>
            <div
                style={{
                    position: 'fixed',
                    top: '100px',
                    left: '58%',
                    transform: 'translateX(-50%)'
                }}
            >
                <Button type="primary" style={{ width: '150px', height: ' 30px', lineHeight: '15px' }} onClick={handlePrint}>
                    이수 증명서 출력
                </Button>
            </div>
            <div ref={contentRef}>
                {certificationUserDetail?.map((d, i) => (
                    <>
                        <div className="watermark-print" key={i}>
                            <div className="watermark-logo" />
                            <div className="content" id={i}>
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
                                    Certificate Number : {d.certificationId}
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
                                            <Col style={{ fontSize: '18px', width: '60px', fontFamily: 'KoPubWorldBatangProMedium' }}>
                                                성명 :{' '}
                                            </Col>
                                            <Col style={{ fontSize: '18px', fontFamily: 'KoPubWorldBatangProMedium' }}>{d.userNm}</Col>
                                        </Row>
                                        <Row>
                                            <Col style={{ fontSize: '13px', width: '60px', fontFamily: 'KoPubWorldBatangRight' }}>Name</Col>
                                            <Col style={{ fontSize: '13px', fontFamily: 'KoPubWorldDotumProMedium' }}>{d.userNmEn}</Col>
                                        </Row>
                                    </Col>
                                    <Col span={10} offset={7}>
                                        <Row>
                                            <Col style={{ fontSize: '18px', width: '90px', fontFamily: 'KoPubWorldBatangProMedium' }}>
                                                생년월일 :{' '}
                                            </Col>
                                            <Col style={{ fontSize: '18px', fontFamily: 'KoPubWorldBatangProMedium' }}>{d.birthDay}</Col>
                                        </Row>
                                        <Row>
                                            <Col style={{ fontSize: '13px', width: '90px', fontFamily: 'KoPubWorldDotumProMedium' }}>
                                                Date of Birth
                                            </Col>
                                            <Col style={{ fontSize: '13px', fontFamily: 'KoPubWorldDotumProMedium' }}>
                                                {new Date(d.birthDay).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>

                                <p style={{ margin: '10px 0px' }}></p>
                                <Row>
                                    <Col span={24}>
                                        <Row>
                                            <Col style={{ fontSize: '18px', width: '60px', fontFamily: 'KoPubWorldBatangProMedium' }}>
                                                주소 :{' '}
                                            </Col>
                                            <Col style={{ fontSize: '18px', fontFamily: 'KoPubWorldBatangProMedium' }}>{d.address}</Col>
                                        </Row>
                                        <Row>
                                            <Col style={{ fontSize: '13px', width: '60px', fontFamily: 'KoPubWorldDotumProMedium' }}>
                                                Address
                                            </Col>
                                            <Col style={{ fontSize: '13px', fontFamily: 'KoPubWorldDotumProMedium' }}>{d.addressEn}</Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <p style={{ margin: '30px 0px' }}></p>
                                <Row>
                                    <Col span={24}>
                                        <Row>
                                            <Col style={{ fontSize: '17px', fontFamily: 'KoPubWorldBatangProMedium' }}>
                                                위 사람은 『항공보안법』 제28조, 같은 법 시행규칙 제15조 및 국가민간항공보안 교육훈련지침에
                                                따른 교육과정을 이수하였음을 증명합니다.
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col style={{ fontSize: '12.2px', fontFamily: 'KoPubWorldDotumProLight' }}>
                                                The person named above has successfully completed all the required training course in
                                                accordance with the article 28 of Aviation Security Act, Article 15 of the Enforcement Rules
                                                and National Civil Aviation Security Education and Training Guideline.
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <p style={{ margin: '30px 0px' }}></p>
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
                                            <Col style={{ fontSize: '18px', fontFamily: 'KoPubWorldBatangProMedium' }}>{d.eduName}</Col>
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
                                            <Col style={{ fontSize: '18px', fontFamily: 'KoPubWorldBatangProMedium', width: '105px' }}>
                                                교육기간 :{' '}
                                            </Col>
                                            <Col style={{ fontSize: '18px', fontFamily: 'KoPubWorldBatangProMedium' }}>
                                                {d.eduStartDate.split('-')[0]}
                                                {'. '}
                                                {d.eduStartDate.split('-')[1]}
                                                {'. '}
                                                {d.eduStartDate.split('-')[2]} ~ {d.eduEndDate.split('-')[0]}
                                                {'. '} {d.eduEndDate.split('-')[1]}
                                                {'. '}
                                                {d.eduEndDate.split('-')[2]}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col style={{ fontSize: '13px', width: '105px', fontFamily: 'KoPubWorldDotumProMedium' }}>
                                                Period
                                            </Col>
                                            <Col style={{ fontSize: '13px', fontFamily: 'KoPubWorldDotumProMedium' }}>
                                                {new Date(d.birthDay).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}{' '}
                                                ~{' '}
                                                {new Date(d.birthDay).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>

                                <p style={{ margin: '30px 0px' }}></p>
                                <Row>
                                    <Col span={24}>
                                        <Row>
                                            <Col
                                                style={{
                                                    fontSize: '18px',
                                                    width: '100%',
                                                    textAlign: 'center',
                                                    fontFamily: 'KoPubWorldBatangBold'
                                                }}
                                            >
                                                {d.eduEndDate.split('-')[0]}년 {d.eduEndDate.split('-')[1]}월 {d.eduEndDate.split('-')[2]}일
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <p style={{ margin: '30px 0px' }}></p>
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
                                                <text style={{ fontFamily: 'KoPubWorldBatangBold', zIndex: 101 }}>
                                                    한국보안인재개발원장
                                                </text>
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
                    </>
                ))}
            </div>
        </>
    );
};
