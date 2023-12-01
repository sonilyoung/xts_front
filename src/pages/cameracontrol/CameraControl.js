import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import Camera, { FACING_MODES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import tracking from 'tracking'; // tracking.js 라이브러리
import { Modal, Button } from 'antd';
import './CameraControl.css';

export const CameraControl = () => {
    const [cameraOpen, setCameraOpen] = useState(false);
    // 상태 변수 초기화
    const [image, setImage] = useState(null);
    const [usingWebcam, setUsingWebcam] = useState(true);

    // Refs 생성
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        // 컴포넌트가 마운트되었을 때 실행될 로직

        const handleCapture = async () => {
            // 웹캠 사용 중인 경우 웹캠에서 스크린샷을 캡처하고 이미지 업데이트
            if (usingWebcam) {
                // const imageSrc = webcamRef.current.getScreenshot();
                const imageSrc = webcamRef.current?.getScreenshot();

                setImage(imageSrc);
            }
        };

        // 노트북 카메라 사용으로 변경하고 캡처 수행
        setUsingWebcam(false);
        handleCapture();

        const video = document.getElementById('video');

        if (video) {
            // video 요소가 존재하는지 확인
            const canvas = canvasRef.current;

            if (canvas) {
                // canvas 요소가 존재하는지 확인
                const context = canvas.getContext('2d');

                if (context) {
                    // context가 유효한지 확인

                    // tracking.js를 사용하여 얼굴을 감지
                    const tracker = new tracking.ObjectTracker('face');

                    tracker.setInitialScale(4);
                    tracker.setStepSize(2);
                    tracker.setEdgesDensity(0.1);

                    tracking.track(video, tracker, { camera: true });

                    // 얼굴 감지 시 작업 수행
                    tracker.on('track', (event) => {
                        context.clearRect(0, 0, canvas.width, canvas.height);
                        event.data.forEach((rect) => {
                            // Draw a person-shaped area around the detected face
                            context.strokeStyle = '#FF0000';
                            context.strokeRect(rect.x, rect.y, rect.width, rect.height);
                            context.beginPath();
                            context.moveTo(rect.x, rect.y);
                            context.lineTo(rect.x + rect.width, rect.y);
                            context.lineTo(rect.x + rect.width / 2, rect.y - rect.height / 2);
                            context.closePath();
                            context.fillStyle = 'rgba(255, 0, 0, 0.3)';
                            context.fill();
                        });
                    });
                } else {
                    console.error('getContext is null');
                }
            } else {
                console.error('canvasRef is null');
            }
        } else {
            console.error('video is null');
        }
    }, []);

    const showModal = () => {
        setCameraOpen(true);
    };

    const handleCancel = () => {
        setCameraOpen(false);
    };

    const retakeImage = () => {
        setImage(null);
    };

    const cameraStyles = {
        width: '180px', // 원하는 가로 크기로 조정
        height: '120px' // 원하는 세로 크기로 조정
    };

    return (
        <div>
            <h1>사진 찍기</h1>
            <div>
                <Button type="primary" onClick={showModal}>
                    Open Camera
                </Button>
                <Modal
                    open={cameraOpen}
                    onCancel={handleCancel}
                    centered
                    width={550}
                    style={{
                        left: 130,
                        zIndex: 999
                    }}
                    footer={null}
                >
                    {usingWebcam ? (
                        <div>
                            <h2>WebCam</h2>
                            {image ? (
                                <img src={image} alt="사진" style={{ width: '500px' }} title={image} />
                            ) : (
                                <Webcam audio={false} height={220} ref={webcamRef} screenshotFormat="image/jpeg" width={380} />
                            )}
                        </div>
                    ) : (
                        <>
                            <div>
                                <h2>NoteBook Camera</h2>
                                {image ? (
                                    <img src={image} alt="사진" style={{ width: '500px' }} title={image} />
                                ) : (
                                    <>
                                        <Camera
                                            idealFacingMode={FACING_MODES.USER}
                                            onTakePhoto={(dataUri) => {
                                                setImage(dataUri);
                                            }}
                                            imageType="image/jpeg"
                                            imageOutputType="blob"
                                            height={cameraStyles.height}
                                            width={cameraStyles.width}
                                            style={cameraStyles}
                                        />

                                        <canvas id="canvas" ref={canvasRef}></canvas>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                    {image && (
                        <Button type="primary" onClick={retakeImage}>
                            Retake
                        </Button>
                    )}
                </Modal>
            </div>
        </div>
    );
};

// import React, { useState, useEffect, useRef } from 'react';
// import Webcam from 'react-webcam';
// import Camera, { FACING_MODES } from 'react-html5-camera-photo';
// import 'react-html5-camera-photo/build/css/index.css';
// import tracking from 'tracking/build/tracking';
// import 'tracking/build/data/face';

// import { Modal, Button } from 'antd';
// import './CameraControl.css';

// export const CameraControl = () => {
//     const [isModalVisible, setIsModalVisible] = useState(false);
//     const [capturedImage, setCapturedImage] = useState(null);
//     const [usingWebcam, setUsingWebcam] = useState(true);

//     const webcamRef = useRef(null);
//     const canvasRef = useRef(null);

//     useEffect(() => {
//         if (usingWebcam) {
//             startWebcam();
//         } else {
//             startNotebookCamera();
//         }
//     }, [usingWebcam]);

//     const startWebcam = () => {
//         if (webcamRef.current) {
//             const imageSrc = webcamRef.current.getScreenshot();
//             setCapturedImage(imageSrc);
//         }
//     };

//     const startNotebookCamera = () => {
//         const video = document.getElementById('video');
//         const canvas = canvasRef.current;
//         const context = canvas.getContext('2d');

//         const tracker = new tracking.ObjectTracker('face');
//         tracker.setInitialScale(4);
//         tracker.setStepSize(2);
//         tracker.setEdgesDensity(0.1);
//         tracking.track(video, tracker, { camera: true });

//         tracker.on('track', (event) => {
//             context.clearRect(0, 0, canvas.width, canvas.height);
//             event.data.forEach((rect) => {
//                 context.strokeStyle = '#FF0000';
//                 context.strokeRect(rect.x, rect.y, rect.width, rect.height);
//                 context.beginPath();
//                 context.moveTo(rect.x, rect.y);
//                 context.lineTo(rect.x + rect.width, rect.y);
//                 context.lineTo(rect.x + rect.width / 2, rect.y - rect.height / 2);
//                 context.closePath();
//                 context.fillStyle = 'rgba(0, 0, 255, 0.3)';
//                 context.fill();
//                 if (canvas.toDataURL) {
//                     setCapturedImage(canvas.toDataURL('image/jpeg'));
//                 }
//             });
//         });
//     };

//     const showModal = () => {
//         setIsModalVisible(true);
//     };

//     const handleOk = () => {
//         setIsModalVisible(false);
//     };

//     const handleCancel = () => {
//         setIsModalVisible(false);
//     };

//     const retakeImage = () => {
//         setCapturedImage(null);
//     };

//     return (
//         <div>
//             <h1>사진 찍기</h1>
//             <div>
//                 <Button type="primary" onClick={showModal}>
//                     Open Camera
//                 </Button>
//                 <Modal visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} width={400} footer={null}>
//                     <div>
//                         {usingWebcam ? (
//                             <div>
//                                 <h2>웹캠</h2>
//                                 {capturedImage ? (
//                                     <img src={capturedImage} alt="사진" />
//                                 ) : (
//                                     <Webcam
//                                         audio={false}
//                                         height={120}
//                                         ref={webcamRef}
//                                         screenshotFormat="image/jpeg"
//                                         width={240}
//                                         mirrored={true}
//                                     />
//                                 )}
//                             </div>
//                         ) : (
//                             <div>
//                                 <h2>노트북 카메라</h2>
//                                 {capturedImage ? (
//                                     <img src={capturedImage} alt="사진" />
//                                 ) : (
//                                     <div>
//                                         <Camera
//                                             idealFacingMode={FACING_MODES.USER}
//                                             onTakePhoto={(dataUri) => {
//                                                 setCapturedImage(dataUri);
//                                             }}
//                                             height={120}
//                                             width={240}
//                                         />
//                                         <canvas id="canvas" ref={canvasRef}></canvas>
//                                     </div>
//                                 )}
//                             </div>
//                         )}
//                     </div>
//                     {capturedImage && (
//                         <Button type="primary" onClick={retakeImage}>
//                             Retake
//                         </Button>
//                     )}
//                 </Modal>
//             </div>
//         </div>
//     );
// };

// // 1. 파일명은 'CameraControl.js'로 한다.
// // 2. 모달창은 'antd'에서 제공하는 <Modal>창의 사이즈는 '400X300'의 모달창을 띄운다.
// // 3. 모달창의 사이즈 안에  웹캠이 있는지 없는지 체크하여 웹캠이 없으면 노트북 카메라를 이용하여 사용자의 모습을 캡쳐하려 한다.
// // 5. 카메라에는 사용자 모습의 윤각이 빨간색으로 표시되고 영역이 맞춰지면 파란색으로 표시되게 한다.
// // 6. 카메라의 윤각이 파란색으로 표시되면 사용자의 모습을 캡쳐한다.
// // 7. 캡쳐된 이미지는 <div>에 출력되게 하며, 파일명을 userImage로 지정한다.
// // 8. 카메라를 다시 찍을수 있도록 버튼을 카메라 영역의 '10px' 밑에 만들어 다시 찍을수 있도록 한다.
// // 이와 같은 조건으로 리액트, 컴포넌트를 제발 만들어 주세요.
