import React, { useEffect, useState, useRef } from 'react';

import { Card, Button, Row, Col, Form, Input, Radio, Space, Divider, Typography, message, Tooltip, Modal } from 'antd';
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';

import '@toast-ui/editor/dist/i18n/ko-kr';
import '@toast-ui/editor/dist/toastui-editor.css';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import { Editor } from '@toast-ui/react-editor';

import { useSelectNoticeMutation } from '../../../hooks/api/ContentsManagement/ContentsManagement';

export const NoticeEditor = (props) => {
    const editorRef = useRef(null);
    const [SelectNoticeApi] = useSelectNoticeMutation(); // hooks api호출 상세 호출

    const handleCallView = async () => {
        const SelectNoticeApiRequest = await SelectNoticeApi({
            noticeId: props.noticeId
        });
        editorRef.current?.getInstance().setMarkdown(SelectNoticeApiRequest.data.RET_DATA.contents);
    };

    const editor_onChange = (html) => {
        props.editor_onChange(html);
    };

    useEffect(() => {
        props.noticeId === null ? '' : handleCallView();
    }, []);

    return (
        <>
            <Editor
                ref={editorRef}
                initialValue={' '}
                initialEditType="wysiwyg"
                hideModeSwitch={false}
                height="400px"
                usageStatistics={false}
                useCommandShortcut={true}
                name="contents"
                onChange={() => editor_onChange(editorRef.current?.getInstance().getHTML())}
                plugins={[colorSyntax]}
                language="ko-KR"
            />
        </>
    );
};
