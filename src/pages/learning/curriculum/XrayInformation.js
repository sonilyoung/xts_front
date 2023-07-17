/* eslint-disable*/
import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { Row, Col, Table, Button, Select, Form, Modal, Divider, Transfer, Tooltip, Popover } from 'antd';
import difference from 'lodash/difference';
// 학습모듈 관리 - 랜덤추출, 물품팝업조회, 모듈에 등록된 문제목록 가져오기
import {
    useSelectModuleRandomMutation, // 랜덤추출
    useSelectModuleXrayPopListMutation, // 물품팝업조회
    useSelectModuleQuestionMutation // 모듈에 등록된 문제목록 가져오기
} from '../../../hooks/api/CurriculumManagement/CurriculumManagement';

import { useSelectImgMutation } from '../../../hooks/api/ContentsManagement/ContentsManagement';

// project import
import MainCard from 'components/MainCard';

export const XrayInformation = (props) => {
    const { confirm } = Modal;
    const [form] = Form.useForm();
    const [randemBoxOpen, setRandemBoxOpen] = useState(false);
    const [targetKeys, setTargetKeys] = useState();
    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [mockData, setMockData] = useState([]);
    const [tooltipImg, setTooltipImg] = useState();

    const [randemLevel, setRandemLevel] = useState(0); // 난이도 레벨
    const [randemlimit, setRandemlimit] = useState(5); // 출제 문항수

    // 물품팝업조회 ======================================================
    const [selectModuleXrayPopListApi] = useSelectModuleXrayPopListMutation(); // 물품팝업조회 hooks api호출
    const handle_SelectModuleXrayPopList_Api = async () => {
        const selectModuleXrayPopListresponse = await selectModuleXrayPopListApi({});
        setMockData([
            ...selectModuleXrayPopListresponse?.data?.RET_DATA.map((d, i) => ({
                key: d.bagScanId,
                rowdata0: i + 1,
                rowdata1: d.bagScanId /*가방촬영id*/,
                rowdata2: d.unitId /*물품id*/,
                rowdata3: d.unitName /*물품명*/,
                rowdata4: d.openYn /*개봉여부*/,
                rowdata5: d.passYn /*통과여부*/,
                rowdata6: d.actionDivName /*action구분*/,
                rowdata7: d.studyLvl /*학습Level*/,
                rowdata8: d.actionDiv /*action구분*/
            }))
        ]);
        setLoading(false);
    };

    // 랜덤추출 ======================================================
    const [selectModuleRandomApi] = useSelectModuleRandomMutation(); // 랜덤추출 hooks api호출
    const handle_selectModuleRandom_Api = async (randemLevel, randemlimit) => {
        if (randemLevel === '0') {
            handle_SelectModuleXrayPopList_Api();
        } else {
            const selectModuleXrayPopListresponse = await selectModuleRandomApi({
                studyLvl: randemLevel,
                questionCnt: randemlimit
            });
            setMockData([
                ...selectModuleXrayPopListresponse?.data?.RET_DATA.map((d, i) => ({
                    key: d.bagScanId,
                    rowdata0: i + 1,
                    rowdata1: d.bagScanId /*가방촬영id*/,
                    rowdata2: d.unitId /*물품id*/,
                    rowdata3: d.unitName /*물품명*/,
                    rowdata4: d.openYn /*개봉여부*/,
                    rowdata5: d.passYn /*통과여부*/,
                    rowdata6: d.actionDivName /*action구분*/,
                    rowdata7: d.studyLvl /*학습Level*/,
                    rowdata8: d.actionDiv /*action구분*/
                }))
            ]);
            setLoading(false);
        }
    };

    // Tooltip 가방이미지 가져오기
    const [SelectImgApi] = useSelectImgMutation(); // 이미지조회 api 정보
    const handleTooltipImg = async (targetId, command) => {
        const SelectImgResponse = await SelectImgApi({
            bagScanId: targetId,
            command: command
        }); // 비동기 함수 호출

        setTooltipImg(SelectImgResponse?.data?.RET_DATA.imgReal);
    };

    const handleMouseOver = (targetId, command) => {
        // Call the function to fetch the image and update the Tooltip state
        handleTooltipImg(targetId, command);
    };

    const handleMouseOut = () => {
        // Clear the Tooltip image state when the mouse leaves
        setTooltipImg(null);
    };

    const TableTransfer = ({ leftColumns, rightColumns, ...restProps }) => (
        <Transfer {...restProps}>
            {({ direction, filteredItems, onItemSelectAll, onItemSelect, selectedKeys: listSelectedKeys, disabled: listDisabled }) => {
                const columns = direction === 'left' ? leftColumns : rightColumns;
                const rowSelection = {
                    getCheckboxProps: (item) => ({
                        disabled: listDisabled || item.disabled
                    }),
                    onSelectAll(selected, selectedRows) {
                        const treeSelectedKeys = selectedRows.filter((item) => !item.disabled).map(({ key }) => key);
                        const diffKeys = selected
                            ? difference(treeSelectedKeys, listSelectedKeys)
                            : difference(listSelectedKeys, treeSelectedKeys);
                        onItemSelectAll(diffKeys, selected);
                    },
                    onSelect({ key }, selected) {
                        onItemSelect(key, selected);
                    },
                    selectedRowKeys: listSelectedKeys
                };
                return (
                    <>
                        <Table
                            rowSelection={rowSelection}
                            columns={columns}
                            dataSource={filteredItems}
                            size="middle"
                            style={{
                                marginBottom: '10px',
                                padding: '0 10px',
                                pointerEvents: listDisabled ? 'none' : undefined
                            }}
                            onRow={({ key, disabled: itemDisabled }) => ({
                                onClick: () => {
                                    if (itemDisabled || listDisabled) return;
                                    onItemSelect(key, !listSelectedKeys.includes(key));
                                }
                            })}
                        />
                    </>
                );
            }}
        </Transfer>
    );

    const leftTableColumns = [
        {
            title: '가방촬영ID',
            dataIndex: 'rowdata1',
            align: 'center'
            // render: (_, { rowdata1 }) => (
            //     <>
            //         <Popover
            //             content={tooltipImg ? <img src={'data:image/png;base64,' + tooltipImg} alt="" style={{ width: '550px' }} /> : ''}
            //             title=""
            //             placement="bottomLeft"
            //         >
            //         {rowdata1}
            //         </Popover>
            //     </>
            // )
        },
        {
            title: '정답물품',
            dataIndex: 'rowdata3',
            align: 'center'
        },
        {
            title: '개봉여부',
            dataIndex: 'rowdata4',
            align: 'center'
        },
        {
            title: '통과여부',
            dataIndex: 'rowdata5',
            align: 'center'
        },
        {
            title: 'Action구분',
            dataIndex: 'rowdata6',
            align: 'center',
            render: (_, { rowdata6 }) => <>{rowdata6}</>
        },
        {
            title: '난이도 Level',
            dataIndex: 'rowdata7',
            align: 'center',
            render: (_, { rowdata7 }) => <> {rowdata7 + 'Lv'} </>
        }
    ];
    const rightTableColumns = [
        {
            title: '가방촬영ID',
            dataIndex: 'rowdata1',
            align: 'center'
        },
        {
            title: '정답물품',
            dataIndex: 'rowdata3',
            align: 'center'
        },
        {
            title: '개봉여부',
            dataIndex: 'rowdata4',
            align: 'center'
        },
        {
            title: '통과여부',
            dataIndex: 'rowdata5',
            align: 'center'
        },
        {
            title: 'Action구분',
            dataIndex: 'rowdata6',
            align: 'center',
            render: (_, { rowdata6 }) => <>{rowdata6}</>
        },
        {
            title: '난이도 Level',
            dataIndex: 'rowdata7',
            align: 'center',
            render: (_, { rowdata7 }) => <> {rowdata7 + 'Lv'} </>
        }
    ];

    const QuestionsOk = () => {
        props.QuestionCnt(targetKeys);
    };

    // 랜덤박스 오픈
    const Questions_Randem = () => {
        setRandemBoxOpen(true);
    };

    // 랜덤박스 오픈
    const Randem_handleclose = () => {
        setRandemLevel(null);
        setRandemlimit(null);
        setRandemBoxOpen(false);
    };

    // 랜덤 추출
    const Questions_handleRandem = () => {
        handle_selectModuleRandom_Api(randemLevel, randemlimit);
        setRandemBoxOpen(false);
    };

    // 출제 문제항 Arr Start
    const questionsArr = [];
    for (let i = 5; i <= 100; i += 5) {
        questionsArr.push({ value: i.toString(), label: i.toString() + ' 문항' });
    }
    // 출제 문제항 Arr End

    const onChange = (nextTargetKeys) => {
        setTargetKeys(nextTargetKeys);
    };

    useEffect(() => {
        setLoading(true); // 로딩 호출
        setTargetKeys(props.BagList === undefined ? '' : props.BagList);
        handle_SelectModuleXrayPopList_Api(); // 그룹 api 호출
    }, [props.BagList]);
    return (
        <>
            <TableTransfer
                dataSource={mockData}
                targetKeys={targetKeys}
                disabled={disabled}
                showSearch={true}
                onChange={onChange}
                filterOption={(inputValue, item) => {
                    const searchableRowdata7 = item.rowdata7 ? `${item.rowdata7}Lv` : '';
                    const lowerCasedInputValue = inputValue.toLowerCase(); // 검색어를 소문자로 변환
                    const lowerCasedSearchableRowdata7 = searchableRowdata7.toLowerCase(); // searchableRowdata7를 소문자로 변환
                    return (
                        item.rowdata1.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1 ||
                        (item.rowdata3 && item.rowdata3.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1) || // rowdata3이 null인 경우를 처리
                        item.rowdata4.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1 ||
                        item.rowdata5.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1 ||
                        item.rowdata6.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1 ||
                        lowerCasedSearchableRowdata7.indexOf(lowerCasedInputValue) !== -1 // 대소문자를 구분하지 않고 비교
                    );
                }}
                leftColumns={leftTableColumns}
                // leftColumns={leftTableColumns.map((column) => ({
                //     ...column,
                //     onCell: (record) => ({
                //         onMouseOver: () => {
                //             if (!tooltipImg) {
                //                 handleMouseOver(record.rowdata1, '403');
                //             }
                //         },
                //         onMouseOut: handleMouseOut
                //     })
                // }))}
                rightColumns={rightTableColumns}
            />
            <Row style={{ marginTop: '15px' }}>
                <Col span={12}>
                    <Button
                        type="primary"
                        danger
                        onClick={Questions_Randem}
                        style={{
                            width: '100px',
                            borderRadius: '5px',
                            boxShadow: '2px 3px 0px 0px #dbdbdb'
                        }}
                    >
                        랜덤 선택
                    </Button>
                </Col>

                <Col span={12}>
                    <Button
                        type="primary"
                        onClick={QuestionsOk}
                        style={{ marginLeft: '20px', width: '100px', borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                    >
                        선택 완료 [{targetKeys?.length}]
                    </Button>
                </Col>
            </Row>

            {/* 랜덤박스 Modal Start */}
            <Modal
                open={randemBoxOpen}
                onCancel={Randem_handleclose}
                width={400}
                style={{
                    top: 250,
                    left: 130,
                    zIndex: 999
                }}
                footer={[]}
            >
                <>
                    <MainCard form={form} style={{ marginTop: '30px' }} title="랜덤 선택">
                        <Form layout="vertical">
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Form.Item
                                        name="Randem_Level"
                                        label="난이도 레벨"
                                        rules={[
                                            {
                                                required: true
                                            }
                                        ]}
                                    >
                                        <Select
                                            defaultValue={{
                                                value: randemLevel,
                                                label: '# 난이도 레벨'
                                            }}
                                            style={{
                                                width: '100%'
                                            }}
                                            options={[
                                                {
                                                    value: '0',
                                                    label: 'All Level'
                                                },
                                                {
                                                    value: '1',
                                                    label: 'Level 1'
                                                },
                                                {
                                                    value: '2',
                                                    label: 'Level 2'
                                                },
                                                {
                                                    value: '3',
                                                    label: 'Level 3'
                                                },
                                                {
                                                    value: '4',
                                                    label: 'Level 4'
                                                },
                                                {
                                                    value: '5',
                                                    label: 'Level 5'
                                                }
                                            ]}
                                            onChange={(value) => setRandemLevel(value)}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Divider style={{ margin: '10px 0' }} />
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Form.Item
                                        name="Randem_limit"
                                        label="출제 문항수"
                                        rules={[
                                            {
                                                required: true
                                            }
                                        ]}
                                    >
                                        <Select
                                            disabled={randemLevel === '0' ? true : false}
                                            defaultValue={{
                                                value: randemlimit,
                                                label: '# 출제 문항수'
                                            }}
                                            style={{
                                                width: '100%'
                                            }}
                                            options={questionsArr}
                                            onChange={(value) => setRandemlimit(value)}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Button
                                type="primary"
                                onClick={Questions_handleRandem}
                                style={{ width: '100%', borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                            >
                                랜덤 추출
                            </Button>
                        </Form>
                    </MainCard>
                </>
            </Modal>
            {/* 랜덤박스 Modal End */}
        </>
    );
};
