/* eslint-disable */
// Loading.js
import React from 'react';
import Spinner from 'assets/images/loading.gif';
const Background = {
  position: "absolute",
  width: "100vw",
  height: "100vh",
  top: "0",
  left: "0",
  background: "#ffffffb7",
  zIndex: "999",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: center
}

const LoadingText = {
  font: "1rem Noto Sans KR",
  textAlign: "center"
}


export default () => {
  return (
    <div style={{Background}}>
      <div style={{LoadingText}}>잠시만 기다려 주세요.</div>
      <img src={Spinner} alt="로딩중" width="5%" />
    </div>
  );
};