import React, { useEffect, useState, useRef } from 'react';

import { useDropzone } from 'react-dropzone';

import { Card, Button, Row, Col, Form, Input, Radio, Space, Divider, Typography, message, Tooltip, Modal } from 'antd';
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';

import '@toast-ui/editor/dist/i18n/ko-kr';
import '@toast-ui/editor/dist/toastui-editor.css';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import { Editor } from '@toast-ui/react-editor';

//itemContainer, editor_onChange, editor_add_files
export const NoticeEditor = ({ itemContainer, editor_onChange, editor_add_files, editor_delete_files }) => {
    const editorRef = useRef(null);
    console.log(itemContainer?.contents);
    console.log(editorRef);
    const [command, setCommand] = useState('false'); // 파일 업로드 여부
    const [uploadedFiles, setUploadedFiles] = useState([]); // 파일 업로드 값

    const handleDrop = (acceptedFiles) => {
        console.log(uploadedFiles);
        const remainingSlots = 5 - uploadedFiles.length;
        const filesToUpload = acceptedFiles.slice(0, remainingSlots);
        filesToUpload.forEach((file) => {
            // PDF 파일 유효성 검사 및 처리
            // const isPdf = file.type === 'application/pdf';
            // if (!isPdf) {
            //     message.error('You can only upload PDF file!');
            //     return;
            // }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('Files must be smaller than 2MB!');
                return;
            }

            // 파일 정보 및 base64 변환
            const reader = new FileReader();
            reader.onload = () => {
                const base64Pdf = reader.result;
                const uploadedPdf = {
                    name: file.name,
                    base64Pdf: base64Pdf
                };
                // 업로드된 PDF 파일 추가
                setUploadedFiles((prevFiles) => [...prevFiles, uploadedPdf]);
            };
            reader.readAsDataURL(file);
        });
        //setSelectedFiles(filesToUpload);
        editor_add_files(filesToUpload);
        setCommand('true');
    };

    const {
        getRootProps: getRootProps,
        getInputProps: getInputProps,
        isDragActive: isDragActive
    } = useDropzone({
        onDrop: handleDrop
        // accept: 'application/pdf' // 허용할 파일 유형을 PDF로 지정
    });

    return (
        <>
            <Editor
                ref={editorRef}
                initialValue={itemContainer?.contents} // 글 수정 시 사용
                initialEditType="wysiwyg" // wysiwyg & markdown
                // previewStyle="vertical"
                hideModeSwitch={false}
                height="400px"
                usageStatistics={false}
                useCommandShortcut={true}
                name="contents"
                // onLoad={(instance) => {
                //     editorRef.current
                // }}
                onChange={() => editor_onChange(editorRef.current?.getInstance().getHTML())}
                plugins={[colorSyntax]}
                language="ko-KR"
            />
            <div>{itemContainer?.contents}</div>
            {uploadedFiles?.length === 0 ? (
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Button
                        {...getRootProps()}
                        className={`dropzone ${isDragActive ? 'active' : ''}`}
                        style={{ width: '100%', height: '90px', fontSize: '13px' }}
                        size="large"
                        disabled={uploadedFiles?.length >= 5}
                    >
                        <p>
                            <UploadOutlined />
                        </p>
                        <input {...getInputProps()} />
                        {isDragActive ? (
                            <>
                                <div style={{ width: '100%' }}> 파일을 여기에 놓아주세요...</div>
                            </>
                        ) : (
                            <>
                                <div style={{ width: '100%' }}>파일을 드래그하거나 클릭하여 업로드하세요.</div>
                            </>
                        )}
                    </Button>
                </Space>
            ) : (
                <>
                    <Card>
                        <Space style={{ textAlign: 'center' }}>
                            <Row gutter={24}>
                                {uploadedFiles?.map((file, index) => (
                                    <>
                                        <Col key={index} span={23} style={{ display: 'flex', height: '50px' }}>
                                            <Tooltip title="삭제" placement="right" color="#ff4d4f">
                                                <Button type="danger" icon={<DeleteOutlined />} onClick={() => editor_delete_files(index)}>
                                                    {file.originalFileName === undefined ? file.name : file.originalFileName}
                                                </Button>
                                            </Tooltip>
                                        </Col>
                                    </>
                                ))}
                            </Row>
                        </Space>
                    </Card>
                </>
            )}
        </>
    );
};
