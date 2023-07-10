import React from 'react';

function PrintButton() {
    const handlePrint = () => {
        window.print();
    };

    return <button onClick={handlePrint}>증명서 출력</button>;
}

export default PrintButton;
