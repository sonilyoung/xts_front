/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import './WatermarkPrint.css';
import { useSelectCertificationUserMutation } from '../../../hooks/api/StudentsManagement/StudentsManagement';

export const CertificatesPrint = (props) => {
    const [loading, setLoading] = useState(false);

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

    useEffect(() => {
        setLoading(true);
        handel_SelectCertificationUser_Api(props.userId_props, props.procCd_props, props.procSeq_props);
    }, [props.userId_props, props.procCd_props, props.procSeq_props]);

    return (
        <>
            <div className="watermark-print">
                <div className="watermark-logo" />
                <div className="content">
                    <div>증서번호 제 20230710 - A1234 호</div>
                    <p style={{ margin: '80px 0px' }}></p>

                    <div style={{ textAlign: 'center', letterSpacing: '0.3em', fontSize: '38px', fontWeight: 'bold' }}>이 수 증 명 서</div>
                    <p style={{ margin: '80px 0px' }}></p>
                    <table style={{ widht: '100%', lineHeight: '2.3em', fontSize: '16px' }}>
                        <tr>
                            <td style={{ letterSpacing: '1.9em', width: '100px', alignItems: 'flex-start' }}>성명</td>
                            <td>{' : '}</td>
                            <td style={{ paddingLeft: '25px', letterSpacing: '2.7em' }}>{certificationUserDetail?.userNm}</td>
                        </tr>
                        <tr>
                            <td>&nbsp;</td>
                            <td>{' : '}</td>
                            <td style={{ paddingLeft: '25px', wordSpacing: '13px' }}>{certificationUserDetail?.userNmEn}</td>
                        </tr>
                        <tr>
                            <td style={{ letterSpacing: '0.1em', width: '100px', alignItems: 'flex-start' }}>생년월일</td>
                            <td>{' : '}</td>
                            <td style={{ paddingLeft: '25px' }}>
                                {certificationUserDetail?.birthDay.split('-')[0]}년 {certificationUserDetail?.birthDay.split('-')[1]}월{' '}
                                {certificationUserDetail?.birthDay.split('-')[2]}일
                            </td>
                        </tr>
                    </table>
                    <p style={{ margin: '30px 0px' }}></p>
                    <table style={{ widht: '100%', lineHeight: '2.5em', fontSize: '16px' }}>
                        <tr>
                            <td
                                style={{
                                    letterSpacing: '1.9em',
                                    width: '100px',
                                    alignItems: 'center'
                                }}
                            >
                                주소
                            </td>
                            <td style={{ alignSelf: 'flex-start' }}>{' : '}</td>
                            <td style={{ paddingLeft: '25px', letterSpacing: '0.1em' }}>{certificationUserDetail?.address}</td>
                        </tr>
                    </table>
                    <p style={{ margin: '60px 0px' }}></p>
                    <table style={{ widht: '100%', lineHeight: '2em', fontSize: '17px' }}>
                        <tr>
                            <td style={{ letterSpacing: '0.1em', textAlign: 'center', fontWeight: 'bold' }}>
                                위 사람은 『항공보안법』 제28조, 같은 법 시행규칙 제15조 및 국가민간항공보안 교육훈련지침에 따른 교육과정을
                                이수하였음을 증명합니다.
                            </td>
                        </tr>
                    </table>
                    <p style={{ margin: '60px 0px' }}></p>
                    <table style={{ widht: '100%', lineHeight: '2.3em', fontSize: '16px' }}>
                        <tr>
                            <td style={{ letterSpacing: '0.6em', width: '100px', alignItems: 'flex-start' }}>과정명</td>
                            <td>{' : '}</td>
                            <td style={{ paddingLeft: '25px', letterSpacing: '0.1em' }}>{certificationUserDetail?.eduName}</td>
                        </tr>
                        <tr>
                            <td style={{ letterSpacing: '0.1em', width: '100px', alignItems: 'flex-start' }}>교육기간</td>
                            <td>{' : '}</td>
                            <td style={{ paddingLeft: '25px', letterSpacing: '0.05em' }}>
                                {certificationUserDetail?.eduStartDate.split('-')[0]}년{' '}
                                {certificationUserDetail?.eduStartDate.split('-')[1]}월{' '}
                                {certificationUserDetail?.eduStartDate.split('-')[2]}일 ~{' '}
                                {certificationUserDetail?.eduEndDate.split('-')[0]}년 {certificationUserDetail?.eduEndDate.split('-')[1]}월{' '}
                                {certificationUserDetail?.eduEndDate.split('-')[2]}일 ({certificationUserDetail?.eduTime}시간)
                            </td>
                        </tr>
                    </table>
                    <p style={{ margin: '60px 0px' }}></p>
                    <div
                        style={{
                            widht: '100%',
                            letterSpacing: '0.1em',
                            wordSpacing: '10px',
                            textAlign: 'center',
                            fontSize: '15px'
                        }}
                    >
                        {certificationUserDetail?.toDay.split('-')[0]}년 {certificationUserDetail?.toDay.split('-')[1]}월{' '}
                        {certificationUserDetail?.toDay.split('-')[2]}일
                    </div>

                    <hr style={{ width: '100%', margin: '60px 0px' }}></hr>
                    <table style={{ width: '100%', lineHeight: '2.3em', fontSize: '16px', tableLayout: 'fixed' }}>
                        <colgroup>
                            <col style={{ width: '80%' }} />
                            <col style={{ width: '20%' }} />
                        </colgroup>
                        <tbody>
                            <tr>
                                <td
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: '9vh',
                                        letterSpacing: '0.1em',
                                        wordSpacing: '10px',
                                        textAlign: 'center',
                                        fontSize: '21px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    교 육 기 관 장
                                </td>
                                <td
                                    style={{
                                        alignItems: 'center',
                                        border: '1px solid #ccc',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        height: '9vh'
                                    }}
                                >
                                    직 인
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};
