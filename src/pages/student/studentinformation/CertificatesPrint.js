/* eslint-disable no-unused-vars */
import './WatermarkPrint.css';
export const CertificatesPrint = () => {
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
                            <td style={{ paddingLeft: '25px', letterSpacing: '2.7em' }}>김원중</td>
                        </tr>
                        <tr>
                            <td>&nbsp;</td>
                            <td>{' : '}</td>
                            <td style={{ paddingLeft: '25px', wordSpacing: '13px' }}>Kim Won Joong</td>
                        </tr>
                        <tr>
                            <td style={{ letterSpacing: '0.1em', width: '100px', alignItems: 'flex-start' }}>생년월일</td>
                            <td>{' : '}</td>
                            <td style={{ paddingLeft: '25px' }}>1978년 10월 08일</td>
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
                            <td style={{ paddingLeft: '25px', letterSpacing: '0.1em' }}>
                                경기도 남양주시 천마산로65 파라곤아파트 102동102호
                            </td>
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
                            <td style={{ paddingLeft: '25px', letterSpacing: '0.1em' }}>보안검색요원 초기교육</td>
                        </tr>
                        <tr>
                            <td style={{ letterSpacing: '0.1em', width: '100px', alignItems: 'flex-start' }}>교육기간</td>
                            <td>{' : '}</td>
                            <td style={{ paddingLeft: '25px', letterSpacing: '0.1em' }}>2023년 07월 10일 ~ 2023년 07월 14일 (40시간)</td>
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
                        2023년 07월 14일
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
