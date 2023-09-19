import React, { useState } from 'react';
import { Modal } from 'antd';
import RainEffect from './RainEffect';

export const CommonRain = () => {
    const { confirm } = Modal;
    const [isModalOpen, setIsModalOpen] = useState(true);

    return (
        <>
            {/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}> */}
            <RainEffect />
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

            {/* </div> */}
        </>
    );
};
