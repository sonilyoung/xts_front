/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import useWindowSize from 'react-use/lib/useWindowSize';
import { Modal } from 'antd';
import Confetti from 'react-confetti';

export const CommonFlower = () => {
    const { confirm } = Modal;
    const { width, height } = useWindowSize();

    const [isModalOpen, setIsModalOpen] = useState(true); // 로그인창 Modal창

    // gravity 값을 조절하여 컨페티의 스피드를 설정합니다.
    const confettiOptions = {
        gravity: 0.035, // 1보다 큰 값으로 설정하면 컨페티가 빠르게 떨어집니다.
        Pieces: '2000'
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Confetti width={width} height={height} {...confettiOptions} />
            <Modal open={isModalOpen} width={620} centered={true} style={{ left: '5%' }} footer={[]}>
                <div style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <br />
                    <br />
                    <h1>Congratulations!</h1>
                    <br />
                    <br />
                    <br />
                    <p>Your message here.</p>
                    <br />
                    <br />
                </div>
            </Modal>
        </div>
    );
};
