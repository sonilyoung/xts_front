/* eslint-disable */
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
    Col,
    Row,
    Space,
    Card,
    Table,
    Tooltip,
    Tag,
    Button,
    Upload,
    Drawer,
    Divider,
    Input,
    Select,
    Switch,
    Form,
    Modal,
    Dragger,
    Descriptions
} from 'antd';
import { Typography } from '@mui/material';
import { PlusOutlined, EditFilled, DeleteFilled, UploadOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { 
    useGetXrayinformationListMutation, 
    useSelectXrayImgContentsMutation,
    useUpdateXrayContentsImgMutation,
    useXrayImageUploadMutation
} from '../../../hooks/api/ContentsManagement/ContentsManagement';
import MenuItem from '@mui/material/MenuItem';
// project import
import MainCard from 'components/MainCard';
import noImage from 'assets/images/no_imgae.png';
import loadingImg from 'assets/images/loading.gif';


export const XrayinfoWrite = () => {
    const [getXrayinformationList] = useGetXrayinformationListMutation(); // 콘텐츠 정보 관리 hooks api호출

    const { confirm } = Modal;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false); // 로딩 초기값

    const [saveXrayImg] = useUpdateXrayContentsImgMutation(); // xray이미지 db저장 api
    const [uploadXrayImg] = useXrayImageUploadMutation(); // xray이미지 서버저장 api
    const [xrayDetail] = useSelectXrayImgContentsMutation(); // xray 이미지상세

    const [dataSource, setDataSource] = useState([]); // Table 데이터 값
    const [xrayinformationList, setXrayinformationList] = useState([]); // xray 컨텐츠 리스트
    
    const [open, setOpen] = useState(false); // Drawer 추가 우측폼 상태
    const [dataEdit, setDataEdit] = useState(false); // Drawer 수정 우측폼 상태
    const [imgEdit, setImgEdit] = useState(false); // 이미지업로드를 위한 상태값
    const [uploading, setUploading] = useState(false); // 이미지업로드
    const [unitLanguageModalOpen, setUnitLanguageModalOpen] = useState(false); // 물품명칭 언어추가 Modal

    const [imgRealEdit, setImgRealEdit] = useState(null);
    const [imgFrontEdit, setImgFrontEdit] = useState(null);
    const [imgSideEdit, setImgSideEdit] = useState(null);




    const [fileReal, setFileReal] = useState(null);
    const [fileFront, setFileFront] = useState(null);
    const [fileSide, setFileSide] = useState(null);
    const [fileThreed, setFileThreed] = useState(null);//3d 데모 이미지

    const [unitGroupCd, setUnitGroupCd] = useState(); // xray그룹
    const [languageCode, setLanguageCode] = useState('kr'); // 언어코드
    const [studyLvl, setStudyLvl] = useState('1'); // 스터디레벨
    const [unitName, setUnitName] = useState(); // xray이름
    const [unitDesc, setUnitDesc] = useState(); // xray설명
    const [useYn, setUseYn] = useState(); // 사용유무

    const [bagScanId, setBagScanId] = useState(); // 수정키
    const [unitScanThreed, setUnitScanThreed] = useState(); // 데모용을 위한 3d이미지구분키

    //const params = useRef(); // 수정화면
    const [refresh, setRefresh] = useState(false); //리프레쉬
    const [unitParams, setUnitParams] = useState({imgReal : ''});
    const [onSearchItem, setOnSearchItem] = useState(false); // 물품명칭 언어추가 Modal

    const handleinformationList = async () => {
        const getXrayinforResponse = await getXrayinformationList({ });
        setXrayinformationList(getXrayinforResponse?.data?.RET_DATA);
        setDataSource([
            ...getXrayinforResponse?.data?.RET_DATA.map((d, i) => ({
                key: d.bagScanId,
                rowdata0: i + 1,
                rowdata1: d.bagScanId,
                rowdata2: d.actionDivName
            }))
        ]);
        setLoading(false);
    };

    const imagescolumns = [
        {
            width: '60px',
            title: 'No',
            dataIndex: 'rowdata0',
            align: 'center'
        },
        {
            title: 'Scan ID',
            dataIndex: 'rowdata1',
            align: 'center'
        },
        {
            title: 'ActionDivName',
            dataIndex: 'rowdata2',
            align: 'center'
        }        
    ];

    // rowSelection, row selection
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        //getCheckboxProps: (record) => ({
            //disabled: record.name === 'Disabled User',
            // Column configuration not to be checked
            //name: record.name
        //})
    };

    // 물품 추가 버튼
    const handleAdd = () => {
        setDataEdit(false);
        setOpen(true);
        setUnitParams(null);
        form.resetFields();        
    };

    // 이미지가져오기
    const getUnitImgList = async (k) => {
        setBagScanId(k);
        const response = await xrayDetail({
            "bagScanId" : k
        });
        
        console.log('이미지가져오기:',response.data.RET_DATA);
        setUnitParams(response.data.RET_DATA);
        //params = response.data.RET_DATA;

        //setImgRealEdit(true);
        //setImgFrontEdit(true);
       // setImgSideEdit(true);        
    };        

    // 물품 수정 버튼
    const xrayinformationListMod = async (e) => {

        const response = await xrayDetail({
            "languageCode" : languageCode,
            "bagScanId" : e?.rowdata1?.key
        });
        
        setUnitParams(response.data.RET_DATA);
        //params = response.data.RET_DATA;
        form.resetFields();
        setDataEdit(true);        
        setImgEdit(true);
        setOpen(true);

        setImgRealEdit(true);
        setImgFrontEdit(true);
        setImgSideEdit(true);

    };    

    // 추가 취소
    const onAddClose = () => {
        setOpen(false);
        setDataEdit(false);
        form.resetFields();
    };


    // 추가 및 수정 처리
    const onAddSubmit = () => {
        if (dataEdit === true) {
            Modal.success({
                content: '수정 완료',
                onOk() {
                    setOpen(false);
                    setDataEdit(false);
                    form.resetFields();
                }
            });
        } else {
            Modal.success({
                content: '추가 완료',
                onOk() {
                    setOpen(false);
                    setDataEdit(false);
                    form.resetFields();
                }
            });
        }
    };

    //xray저장
    const onSaveSubmit = async () => {
        console.log('저장:',unitParams);
        /*
        const response = await insertUnit({
            "unitGroupCd" : unitParams?.unitGroupCd,
            "languageCode" : languageCode,
            "studyLvl" : unitParams?.studyLvl,
            "unitName" : unitParams?.unitName,
            "unitDesc" : unitParams?.unitDesc,
            "useYn" : unitParams?.useYn
        });
        setRefresh(response);
        Modal.success({
            content: '추가 완료',
            onOk() {
                setOpen(false);
                setDataEdit(false);
                form.resetFields();
            }
        });
        */
    };

    //xray수정
    const onUpdateSubmit = async () => {
        
        console.log('수정:',unitParams);
        /*
        const response = await unitUpdate({
            "bagScanId" : unitParams?.bagScanId,
            "unitGroupCd" : unitParams?.unitGroupCd,
            "languageCode" : unitParams?.languageCode,
            "studyLvl" : unitParams?.studyLvl,
            "unitName" : unitParams?.unitName,
            "unitDesc" : unitParams?.unitDesc,
            "useYn" : unitParams?.useYn
        });
        setRefresh(response);
        Modal.success({
            content: '수정 완료',
            onOk() {
                setOpen(false);
                setDataEdit(false);
                form.resetFields();
            }
        });
        */
    };    

    //xray삭제
    const onDelete = async () => {
        /*
        const response = await unitDelete({
            "bagScanId" : unitParams?.bagScanId,
            "languageCode" : unitParams?.languageCode
        });
        setRefresh(response);
        Modal.success({
            content: '삭제 완료',
            onOk() {
                setOpen(false);
                setDataEdit(false);
                form.resetFields();
            }
        });        
        */
    }    

    // 물품명칭 언어 추가 Start
    const Unit_Language = () => {
        setOnSearchItem(true);
    };
    const Unit_ModalOk = () => {
        setOnSearchItem(false);
        form.resetFields();
    };
    const Unit_ModalCancel = () => {
        setOnSearchItem(false);
        form.resetFields();
    };
    const Unit_LanguageAdd = (values) => {
        console.log('Received values of form:', values);
    };

    // 물품명칭 언어 추가 End


    // 각각업로드될 이미지param
    const [imgReal,	setImgReal	]	=	useState('');
    const [imgFrontDanger,	setImgFrontDanger	]	=	useState('');
    const [imgSideDanger,	setImgSideDanger	]	=	useState('');
    const [imgSide,	setImgSide	]	=	useState('');
    const [imgFront,	setImgFront	]	=	useState('');
    const [imgFrontColor,	setImgFrontColor	]	=	useState('');
    const [imgFrontColorOrganism,	setimgFrontColorOrganism	]	=	useState('');
    const [ImgFrontColorMineral,	setImgFrontColorMineral	]	=	useState('');
    const [ImgFrontColorReversal,	setImgFrontColorReversal	]	=	useState('');
    const [imgFrontColorBwRate1,	setImgFrontColorBwRate1	]	=	useState('');
    const [imgFrontColorBwRate2,	setImgFrontColorBwRate2	]	=	useState('');
    const [imgFrontColorBwRate3,	setImgFrontColorBwRate3	]	=	useState('');
    const [imgFrontColorBwRate4,	setImgFrontColorBwRate4	]	=	useState('');
    const [imgFrontColorBwRate5,	setImgFrontColorBwRate5	]	=	useState('');
    const [imgFrontColorBwRate6,	setImgFrontColorBwRate6	]	=	useState('');
    const [imgFrontBw,	setImgFrontBw	]	=	useState('');
    const [imgFrontBwMineral,	setimgFrontBwMineral	]	=	useState('');
    const [imgFrontBwOrganism,	setimgFrontBwOrganism	]	=	useState('');
    const [imgFrontBwReversal,	setImgFrontBwReversal	]	=	useState('');
    const [imgFrontBwBwRate1,	setImgFrontBwBwRate1	]	=	useState('');
    const [imgFrontBwBwRate2,	setImgFrontBwBwRate2	]	=	useState('');
    const [imgFrontBwBwRate3,	setImgFrontBwBwRate3	]	=	useState('');
    const [imgFrontBwBwRate4,	setImgFrontBwBwRate4	]	=	useState('');
    const [imgFrontBwBwRate5,	setImgFrontBwBwRate5	]	=	useState('');
    const [imgFrontBwBwRate6,	setImgFrontBwBwRate6	]	=	useState('');
    const [imgSideColor,	setImgSideColor	]	=	useState('');
    const [imgSideColorMineral,	setimgSideColorMineral	]	=	useState('');
    const [imgSideColorOrganism,	setimgSideColorOrganism	]	=	useState('');
    const [imgSideColorReversal,	setimgSideColorReversal	]	=	useState('');
    const [imgSideColorBwRate1,	setImgSideColorBwRate1	]	=	useState('');
    const [imgSideColorBwRate2,	setImgSideColorBwRate2	]	=	useState('');
    const [imgSideColorBwRate3,	setImgSideColorBwRate3	]	=	useState('');
    const [imgSideColorBwRate4,	setImgSideColorBwRate4	]	=	useState('');
    const [imgSideColorBwRate5,	setImgSideColorBwRate5	]	=	useState('');
    const [imgSideColorBwRate6,	setImgSideColorBwRate6	]	=	useState('');
    const [imgSideBw,	setImgSideBw	]	=	useState('');
    const [imgSideBwMinerals,	setimgSideBwMinerals	]	=	useState('');
    const [imgSideBwOrganism,	setimgSideBwOrganism	]	=	useState('');
    const [imgSideBwReversal,	setImgSideBwReversal	]	=	useState('');
    const [imgSideBwBwRate1,	setImgSideBwBwRate1	]	=	useState('');
    const [imgSideBwBwRate2,	setImgSideBwBwRate2	]	=	useState('');
    const [imgSideBwBwRate3,	setImgSideBwBwRate3	]	=	useState('');
    const [imgSideBwBwRate4,	setImgSideBwBwRate4	]	=	useState('');
    const [imgSideBwBwRate5,	setImgSideBwBwRate5	]	=	useState('');
    const [imgSideBwBwRate6,	setImgSideBwBwRate6	]	=	useState('');
    
    //화면에표시될이미지
    const [pimgReal,	setpimgReal	]	=	useState('');
    const [pimgFrontDanger,	setpimgFrontDanger	]	=	useState('');
    const [pimgSideDanger,	setpimgSideDanger ]	=	useState('');
    const [pimgSide,	setpimgSide	]	=	useState('');
    const [pimgFront,	setpimgFront	]	=	useState('');
    const [pimgFrontColor,	setpimgFrontColor	]	=	useState('');
    const [pimgFrontColorMineral,	setpimgFrontColorMineral	]	=	useState('');
    const [pimgFrontColorOrganism,	setpimgFrontColorOrganism	]	=	useState('');
    const [pimgFrontColorReversal,	setpimgFrontColorReversal	]	=	useState('');
    const [pimgFrontColorBwRate1,	setpimgFrontColorBwRate1	]	=	useState('');
    const [pimgFrontColorBwRate2,	setpimgFrontColorBwRate2	]	=	useState('');
    const [pimgFrontColorBwRate3,	setpimgFrontColorBwRate3	]	=	useState('');
    const [pimgFrontColorBwRate4,	setpimgFrontColorBwRate4	]	=	useState('');
    const [pimgFrontColorBwRate5,	setpimgFrontColorBwRate5	]	=	useState('');
    const [pimgFrontColorBwRate6,	setpimgFrontColorBwRate6	]	=	useState('');
    const [pimgFrontBw,	setpimgFrontBw	]	=	useState('');
    const [pimgFrontBwMineral,	setpimgFrontBwMineral	]	=	useState('');
    const [pimgFrontBwOrganism,	setpimgFrontBwOrganism	]	=	useState('');
    const [pimgFrontBwReversal,	setpimgFrontBwReversal	]	=	useState('');
    const [pimgFrontBwBwRate1,	setpimgFrontBwBwRate1	]	=	useState('');
    const [pimgFrontBwBwRate2,	setpimgFrontBwBwRate2	]	=	useState('');
    const [pimgFrontBwBwRate3,	setpimgFrontBwBwRate3	]	=	useState('');
    const [pimgFrontBwBwRate4,	setpimgFrontBwBwRate4	]	=	useState('');
    const [pimgFrontBwBwRate5,	setpimgFrontBwBwRate5	]	=	useState('');
    const [pimgFrontBwBwRate6,	setpimgFrontBwBwRate6	]	=	useState('');
    const [pimgSideColor,	setpimgSideColor	]	=	useState('');
    const [pimgSideColorMineral,	setpimgSideColorMineral	]	=	useState('');
    const [pimgSideColorOrganism,	setpimgSideColorOrganism	]	=	useState('');
    const [pimgSideColorReversal,	setpimgSideColorReversal	]	=	useState('');
    const [pimgSideColorBwRate1,	setpimgSideColorBwRate1	]	=	useState('');
    const [pimgSideColorBwRate2,	setpimgSideColorBwRate2	]	=	useState('');
    const [pimgSideColorBwRate3,	setpimgSideColorBwRate3	]	=	useState('');
    const [pimgSideColorBwRate4,	setpimgSideColorBwRate4	]	=	useState('');
    const [pimgSideColorBwRate5,	setpimgSideColorBwRate5	]	=	useState('');
    const [pimgSideColorBwRate6,	setpimgSideColorBwRate6	]	=	useState('');
    const [pimgSideBw,	setpimgSideBw	]	=	useState('');
    const [pimgSideBwMinerals,	setpimgSideBwMinerals	]	=	useState('');
    const [pimgSideBwOrganism,	setpimgSideBwOrganism	]	=	useState('');
    const [pimgSideBwReversal,	setpimgSideBwReversal	]	=	useState('');
    const [pimgSideBwBwRate1,	setpimgSideBwBwRate1	]	=	useState('');
    const [pimgSideBwBwRate2,	setpimgSideBwBwRate2	]	=	useState('');
    const [pimgSideBwBwRate3,	setpimgSideBwBwRate3	]	=	useState('');
    const [pimgSideBwBwRate4,	setpimgSideBwBwRate4	]	=	useState('');
    const [pimgSideBwBwRate5,	setpimgSideBwBwRate5	]	=	useState('');
    const [pimgSideBwBwRate6,	setpimgSideBwBwRate6	]	=	useState('');    
    const [pimgMultiple,	setPimgMultiple	]	=	useState([]);    
    

    // 이미지 업로드 input의 onChange
    const imgRefFrontColor1 = useRef();//정면컬러1
    const imgRefFrontColor2 = useRef();//정면컬러2
    const imgRefFrontColor3 = useRef();//정면컬러3
    const imgRefFrontColor4 = useRef();//정면컬러4
    const imgRefFrontColor5 = useRef();//정면컬러5
    const imgRefFrontColor6 = useRef();//정면컬러6
    const imgRefFrontColor7 = useRef();//정면컬러7
    const imgRefFrontColor8 = useRef();//정면컬러8
    const imgRefFrontColor9 = useRef();//정면컬러9
    const imgRefFrontColor10 = useRef();//정면컬러10
    const imgRefBwColor1 = useRef();//정면흑백1
    const imgRefBwColor2 = useRef();//정면흑백2
    const imgRefBwColor3 = useRef();//정면흑백3
    const imgRefBwColor4 = useRef();//정면흑백4
    const imgRefBwColor5 = useRef();//정면흑백5
    const imgRefBwColor6 = useRef();//정면흑백6
    const imgRefBwColor7 = useRef();//정면흑백7
    const imgRefBwColor8 = useRef();//정면흑백8
    const imgRefBwColor9 = useRef();//정면흑백9
    const imgRefBwColor10 = useRef();//정면흑백10
    const imgRefSideColor1 = useRef();//측면컬러1
    const imgRefSideColor2 = useRef();//측면컬러2
    const imgRefSideColor3 = useRef();//측면컬러3
    const imgRefSideColor4 = useRef();//측면컬러4
    const imgRefSideColor5 = useRef();//측면컬러5
    const imgRefSideColor6 = useRef();//측면컬러6
    const imgRefSideColor7 = useRef();//측면컬러7
    const imgRefSideColor8 = useRef();//측면컬러8
    const imgRefSideColor9 = useRef();//측면컬러9
    const imgRefSideColor10 = useRef();//측면컬러10
    const imgRefSideBw1 = useRef();//측면흑백1
    const imgRefSideBw2 = useRef();//측면흑백2
    const imgRefSideBw3 = useRef();//측면흑백3
    const imgRefSideBw4 = useRef();//측면흑백4
    const imgRefSideBw5 = useRef();//측면흑백5
    const imgRefSideBw6 = useRef();//측면흑백6
    const imgRefSideBw7 = useRef();//측면흑백7
    const imgRefSideBw8 = useRef();//측면흑백8
    const imgRefSideBw9 = useRef();//측면흑백9
    const imgRefSideBw10 = useRef();//측면흑백10
    const imgRefReal = useRef();//실물이미지
    const imgRefFront = useRef();//정면이미지
    const imgRefSide = useRef();//측면이미지

    const imgRefFrontDanger = useRef();//정면위험이미지
    const imgRefSideDanger = useRef();//측면위험이미지
    

    const clickSaveImgRefFrontColor1 = e =>  {
        setImgEdit(false);
        imgRefFrontColor1.current.click();
    };

    const saveImgRefFrontColor1 = () => {
        const file = imgRefFrontColor1.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setpimgFrontColor(reader.result);
        };
        setImgFrontColor(file);
        setImgRealEdit(false);
    };    


    const clickSaveImgRefFrontColor2 = e =>  {
        setImgEdit(false);
        imgRefFrontColor2.current.click();
    };    

    const saveImgRefFrontColor2 = () => {
        const file = imgRefFrontColor2.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setpimgFrontColorOrganism(reader.result);
        };
        setimgFrontColorOrganism(file);
        //setImgRealEdit(false);
    };    


    const clickSaveImgRefFrontColor3 = e =>  {
        setImgEdit(false);
        imgRefFrontColor3.current.click();
    };        

    const saveImgRefFrontColor3 = () => {
        const file = imgRefFrontColor3.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setpimgFrontColorMineral(reader.result);
        };
        setImgFrontColorMineral(file);
        //setImgRealEdit(false);
    };    


    const clickSaveImgRefFrontColor4 = e =>  {
        setImgEdit(false);
        imgRefFrontColor4.current.click();
    };        


    const saveImgRefFrontColor4 = () => {
        const file = imgRefFrontColor4.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setpimgFrontColorReversal(reader.result);
        };
        setImgFrontColorReversal(file);
        //setImgRealEdit(false);
    };    

    const clickSaveImgRefFrontColor5 = e =>  {
        setImgEdit(false);
        imgRefFrontColor5.current.click();
    };     

    const saveImgRefFrontColor5 = () => {
        const file = imgRefFrontColor5.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setpimgFrontColorBwRate1(reader.result);
        };
        setImgFrontColorBwRate1(file);
        //setImgRealEdit(false);
    };    

    const clickSaveImgRefFrontColor6 = e =>  {
        setImgEdit(false);
        imgRefFrontColor6.current.click();
    };     

    const saveImgRefFrontColor6 = () => {
        const file = imgRefFrontColor6.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setpimgFrontColorBwRate2(reader.result);
        };
        setImgFrontColorBwRate2(file);
        //setImgRealEdit(false);
    };   
    
    const clickSaveImgRefFrontColor7 = e =>  {
        setImgEdit(false);
        imgRefFrontColor7.current.click();
    };     

    const saveImgRefFrontColor7 = () => {
        const file = imgRefFrontColor7.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setpimgFrontColorBwRate3(reader.result);
        };
        setImgFrontColorBwRate3(file);
        //setImgRealEdit(false);
    };   
    
    const clickSaveImgRefFrontColor8 = e =>  {
        setImgEdit(false);
        imgRefFrontColor8.current.click();
    };     

    const saveImgRefFrontColor8 = () => {
        const file = imgRefFrontColor8.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setpimgFrontColorBwRate4(reader.result);
        };
        setImgFrontColorBwRate4(file);
        //setImgRealEdit(false);
    };   
    
    const clickSaveImgRefFrontColor9 = e =>  {
        setImgEdit(false);
        imgRefFrontColor9.current.click();
    };     

    const saveImgRefFrontColor9 = () => {
        const file = imgRefFrontColor9.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setpimgFrontColorBwRate5(reader.result);
        };
        setImgFrontColorBwRate5(file);
        //setImgRealEdit(false);
    };   
    
    const clickSaveImgRefFrontColor10 = e =>  {
        setImgEdit(false);
        imgRefFrontColor10.current.click();
    };     

    const saveImgRefFrontColor10 = () => {
        const file = imgRefFrontColor10.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setpimgFrontColorBwRate6(reader.result);
        };
        setImgFrontColorBwRate6(file);
        //setImgRealEdit(false);
    };       

    const clickSaveImgRefBwColor1 = e =>  {
        setImgEdit(false);
        imgRefBwColor1.current.click();
    };     

    const saveImgRefBwColor1 = () => {
        const file = imgRefBwColor1.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setpimgFrontBw(reader.result);
        };
        setImgFrontBw(file);
        //setImgRealEdit(false);
    };    

    const clickSaveImgRefBwColor2 = e =>  {
        setImgEdit(false);
        imgRefBwColor2.current.click();
    };     


    const saveImgRefBwColor2 = () => {
        const file = imgRefBwColor2.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setpFisetimgFrontBwMineralleReal(reader.result);
        };
        setimgFrontBwMineral(file);
        //setImgRealEdit(false);
    };    

    const clickSaveImgRefBwColor3 = e =>  {
        setImgEdit(false);
        imgRefBwColor3.current.click();
    };     


    const saveImgRefBwColor3 = () => {
        const file = imgRefBwColor3.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setpimgFrontBwOrganism(reader.result);
        };
        setimgFrontBwOrganism(file);
        //setImgRealEdit(false);
    };    

    const clickSaveImgRefBwColor4 = e =>  {
        setImgEdit(false);
        imgRefBwColor4.current.click();
    };     
    
    const saveImgRefBwColor4 = () => {
        const file = imgRefBwColor4.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setpimgFrontBwReversal(reader.result);
        };
        setImgFrontBwReversal(file);
        //setImgRealEdit(false);
    };    

    const clickSaveImgRefBwColor5 = e =>  {
        setImgEdit(false);
        imgRefBwColor5.current.click();
    };         

    const saveImgRefBwColor5 = () => {
        const file = imgRefBwColor5.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setpimgFrontBwBwRate1(reader.result);
        };
        setImgFrontBwBwRate1(file);
        //setImgRealEdit(false);
    };    

    const clickSaveImgRefBwColor6 = e =>  {
        setImgEdit(false);
        imgRefBwColor6.current.click();
    };         

    const saveImgRefBwColor6 = () => {
        const file = imgRefBwColor6.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setpimgFrontBwBwRate2(reader.result);
        };
        setImgFrontBwBwRate2(file);
        //setImgRealEdit(false);
    };  
    
    const clickSaveImgRefBwColor7 = e =>  {
        setImgEdit(false);
        imgRefBwColor7.current.click();
    };         

    const saveImgRefBwColor7 = () => {
        const file = imgRefBwColor7.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setpimgFrontBwBwRate3(reader.result);
        };
        setImgFrontBwBwRate3(file);
        //setImgRealEdit(false);
    };  

    const clickSaveImgRefBwColor8 = e =>  {
        setImgEdit(false);
        imgRefBwColor8.current.click();
    };         

    const saveImgRefBwColor8 = () => {
        const file = imgRefBwColor8.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setpimgFrontBwBwRate4(reader.result);
        };
        setImgFrontBwBwRate4(file);
        //setImgRealEdit(false);
    };  
    const clickSaveImgRefBwColor9 = e =>  {
        setImgEdit(false);
        imgRefBwColor9.current.click();
    };         

    const saveImgRefBwColor9 = () => {
        const file = imgRefBwColor9.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setpimgFrontBwBwRate5(reader.result);
        };
        setImgFrontBwBwRate5(file);
        //setImgRealEdit(false);
    };  

    const clickSaveImgRefBwColor10 = e =>  {
        setImgEdit(false);
        imgRefBwColor10.current.click();
    };         

    const saveImgRefBwColor10 = () => {
        const file = imgRefBwColor10.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setpimgFrontBwBwRate6(reader.result);
        };
        setImgFrontBwBwRate6(file);
        //setImgRealEdit(false);
    }; 


    const clickSaveImgRefSideColor1 = e =>  {
        setImgEdit(false);
        imgRefSideColor1.current.click();
    };     

    const saveImgRefSideColor1  = () => {
        const file = imgRefSideColor1.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setpimgSideColor(reader.result);
        };
        setImgSideColor(file);
        //setImgRealEdit(false);
    };    

    const clickSaveImgRefSideColor2 = e =>  {
        setImgEdit(false);
        imgRefSideColor2.current.click();
    };   

    const saveImgRefSideColor2  = () => {
        const file = imgRefSideColor2.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setpimgSideColorMineral(reader.result);
        };
        setimgSideColorMineral(file);
        //setImgRealEdit(false);
    };    

    const clickSaveImgRefSideColor3 = e =>  {
        setImgEdit(false);
        saveImgRefSideColor3.current.click();
    };   

    const saveImgRefSideColor3  = () => {
        const file = imgRefSideColor3.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setpimgSideColorOrganism(reader.result);
        };
        setimgSideColorOrganism(file);
        //setImgRealEdit(false);
    };    

    const clickSaveImgRefSideColor4 = e =>  {
        setImgEdit(false);
        saveImgRefSideColor4.current.click();
    };  

    const saveImgRefSideColor4  = () => {
        const file = imgRefSideColor4.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setpimgSideColorReversal(reader.result);
        };
        setimgSideColorReversal(file);
        //setImgRealEdit(false);
    };    

    const clickSaveImgRefSideColor5 = e =>  {
        setImgEdit(false);
        imgRefSideColor5.current.click();
    };      

    const saveImgRefSideColor5  = () => {
        const file = imgRefSideColor5.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setpimgSideColorBwRate1(reader.result);
        };
        setImgSideColorBwRate1(file);
        //setImgRealEdit(false);
    };    

    const clickSaveImgRefSideColor6 = e =>  {
        setImgEdit(false);
        imgRefSideColor6.current.click();
    };      

    const saveImgRefSideColor6  = () => {
        const file = imgRefSideColor6.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setpimgSideColorBwRate2(reader.result);
        };
        setImgSideColorBwRate2(file);
        //setImgRealEdit(false);
    };    

    const clickSaveImgRefSideColor7 = e =>  {
        setImgEdit(false);
        imgRefSideColor7.current.click();
    };      

    const saveImgRefSideColor7  = () => {
        const file = imgRefSideColor7.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setpimgSideColorBwRate3(reader.result);
        };
        setImgSideColorBwRate3(file);
        //setImgRealEdit(false);
    };    

    const clickSaveImgRefSideColor8 = e =>  {
        setImgEdit(false);
        imgRefSideColor8.current.click();
    };      

    const saveImgRefSideColor8  = () => {
        const file = imgRefSideColor8.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setpimgSideColorBwRate4(reader.result);
        };
        setImgSideColorBwRate4(file);
        //setImgRealEdit(false);
    };    

    const clickSaveImgRefSideColor9 = e =>  {
        setImgEdit(false);
        imgRefSideColor9.current.click();
    };      

    const saveImgRefSideColor9  = () => {
        const file = imgRefSideColor9.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setpimgSideColorBwRate5(reader.result);
        };
        setImgSideColorBwRate5(file);
        //setImgRealEdit(false);
    };    

    const clickSaveImgRefSideColor10 = e =>  {
        setImgEdit(false);
        imgRefSideColor10.current.click();
    };      

    const saveImgRefSideColor10  = () => {
        const file = imgRefSideColor10.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setpimgSideColorBwRate6(reader.result);
        };
        setImgSideColorBwRate6(file);
        //setImgRealEdit(false);
    };    


    const clickSaveImgRefSideBw1 = e =>  {
        setImgEdit(false);
        imgRefSideBw1.current.click();
    };     
    
    const saveImgRefSideBw1  = () => {
        const file = imgRefSideBw1.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setpimgSideBw(reader.result);
        };
        setImgSideBw(file);
        //setImgRealEdit(false);
    };    

    const clickSaveImgRefSideBw2 = e =>  {
        setImgEdit(false);
        imgRefSideBw2.current.click();
    };      

    const saveImgRefSideBw2  = () => {
        const file = imgRefSideBw2.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setpimgSideBwMinerals(reader.result);
        };
        setimgSideBwMinerals(file);
        //setImgRealEdit(false);
    };   

    const clickSaveImgRefSideBw3 = e =>  {
        setImgEdit(false);
        imgRefSideBw3.current.click();
    };      

    const saveImgRefSideBw3  = () => {
        const file = imgRefSideBw3.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setpimgSideBwOrganism(reader.result);
        };
        setimgSideBwOrganism(file);
        //setImgRealEdit(false);
    };

    const clickSaveImgRefSideBw4 = e =>  {
        setImgEdit(false);
        imgRefSideBw4.current.click();
    };      

    const saveImgRefSideBw4 = () => {
        const file = imgRefSideBw4.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setpimgSideBwReversal(reader.result);
        };
        setImgSideBwReversal(file);
        //setImgRealEdit(false);
    };   
    
    const clickSaveImgRefSideBw5 = e =>  {
        setImgEdit(false);
        imgRefSideBw5.current.click();
    };   
    
    const saveImgRefSideBw5 = () => {
        const file = imgRefSideBw5.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setpimgSideBwBwRate1(reader.result);
        };
        setImgSideBwBwRate1(file);
        //setImgRealEdit(false);
    };     

    
    const clickSaveImgRefSideBw6 = e =>  {
        setImgEdit(false);
        imgRefSideBw6.current.click();
    };   
    
    const saveImgRefSideBw6 = () => {
        const file = imgRefSideBw6.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setpimgSideBwBwRate2(reader.result);
        };
        setImgSideBwBwRate2(file);
        //setImgRealEdit(false);
    };  
    
    
    const clickSaveImgRefSideBw7 = e =>  {
        setImgEdit(false);
        imgRefSideBw7.current.click();
    };   
    
    const saveImgRefSideBw7 = () => {
        const file = imgRefSideBw7.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setpimgSideBwBwRate3(reader.result);
        };
        setImgSideBwBwRate3(file);
        //setImgRealEdit(false);
    };  
    
    
    const clickSaveImgRefSideBw8 = e =>  {
        setImgEdit(false);
        imgRefSideBw8.current.click();
    };   

    const saveImgRefSideBw8 = () => {
        const file = imgRefSideBw8.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setpimgSideBwBwRate4(reader.result);
        };
        setImgSideBwBwRate4(file);
        //setImgRealEdit(false);
    };  
        

    const clickSaveImgRefSideBw9 = e =>  {
        setImgEdit(false);
        imgRefSideBw9.current.click();
    };       
    
    const saveImgRefSideBw9 = () => {
        const file = imgRefSideBw9.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setpimgSideBwBwRate5(reader.result);
        };
        setImgSideBwBwRate5(file);
        //setImgRealEdit(false);
    };  
    
    
    const clickSaveImgRefSideBw10 = e =>  {
        setImgEdit(false);
        imgRefSideBw10.current.click();
    };   
    
    const saveImgRefSideBw10 = () => {
        const file = imgRefSideBw10.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setpimgSideBwBwRate6(reader.result);
        };
        setImgSideBwBwRate6(file);
        //setImgRealEdit(false);
    };  

    const clickSaveImgRefReal = e =>  {
        setImgEdit(false);
        imgRefReal.current.click();
    };       

    const saveImgRefReal = () => {
        const file = imgRefReal.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setpimgReal(reader.result);
        };
        setImgReal(file);
        //setImgRealEdit(false);
    }; 

    const clickSaveImgRefFront = e =>  {
        setImgEdit(false);
        imgRefFront.current.click();
    };       

    const saveImgRefFront = () => {
        const file = imgRefFront.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setpimgFront(reader.result);
        };
        setImgFront(file);
        //setImgRealEdit(false);
    }; 

    const clickSaveImgRefSide = e =>  {
        setImgEdit(false);
        imgRefSide.current.click();
    };       


    const saveImgRefSide = () => {
        const file = imgRefSide.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setpimgSide(reader.result);
        };
        setImgSide(file);
        //setImgRealEdit(false);
    }; 



    const clickSaveImgRefFrontDanger = e =>  {
        setImgEdit(false);
        imgRefFrontDanger.current.click();
    };       

    const saveImgRefFrontDanger = () => {
        const file = imgRefFrontDanger.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setpimgFrontDanger(reader.result);
        };
        setImgReal(file);
        //setImgRealEdit(false);
    }; 
    

    const clickSaveImgRefSideDanger = e =>  {
        setImgEdit(false);
        imgRefSideDanger.current.click();
    };       

    const saveImgRefSideDanger = () => {
        const file = imgRefSideDanger.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setpimgSideDanger(reader.result);
        };
        setImgReal(file);
        //setImgRealEdit(false);
    };     

    //3d생성
    const handleThreed = () => {
        console.log(unitScanThreed);
        alert('기능 준비중');
        //clearTimeout(timer);
    }

    // 실물 이미지 업로드 처리
    const handleUpload = async () => {
        console.log('bagScanId: ', bagScanId);

        if(bagScanId===undefined){
            Modal.error({
                content: '이미지 업로드 할 xray가방을 선택해주세요.',
                onOk() {
                    setOpen(false);
                    setDataEdit(false);
                    form.resetFields();
                }
            });            
            return false;
        }

        let formData = new FormData();
        const params = { bagScanId: bagScanId};
        formData.append("params", new Blob([JSON.stringify(params)], { type: 'application/json' }));
        formData.append("imgReal", imgReal);
        formData.append("imgSide", imgSide);
        formData.append("imgFront", imgFront);
        formData.append("imgFrontColor", imgFrontColor);
        formData.append("imgFrontColorOrganism", imgFrontColorOrganism);
        formData.append("ImgFrontColorMineral", ImgFrontColorMineral);
        formData.append("ImgFrontColorReversal", ImgFrontColorReversal);
        formData.append("imgFrontColorBwRate1", imgFrontColorBwRate1);
        formData.append("imgFrontColorBwRate2", imgFrontColorBwRate2);
        formData.append("imgFrontColorBwRate3", imgFrontColorBwRate3);
        formData.append("imgFrontColorBwRate4", imgFrontColorBwRate4);
        formData.append("imgFrontColorBwRate5", imgFrontColorBwRate5);
        formData.append("imgFrontColorBwRate6", imgFrontColorBwRate6);
        formData.append("imgFrontBw", imgFrontBw);
        formData.append("imgFrontBwMineral", imgFrontBwMineral);
        formData.append("imgFrontBwOrganism", imgFrontBwOrganism);
        formData.append("imgFrontBwReversal", imgFrontBwReversal);
        formData.append("imgFrontBwBwRate1", imgFrontBwBwRate1);
        formData.append("imgFrontBwBwRate2", imgFrontBwBwRate2);
        formData.append("imgFrontBwBwRate3", imgFrontBwBwRate3);
        formData.append("imgFrontBwBwRate4", imgFrontBwBwRate4);
        formData.append("imgFrontBwBwRate5", imgFrontBwBwRate5);
        formData.append("imgFrontBwBwRate6", imgFrontBwBwRate6);
        formData.append("imgSideColor", imgSideColor);
        formData.append("imgSideColorMineral", imgSideColorMineral);
        formData.append("imgSideColorOrganism", imgSideColorOrganism);
        formData.append("imgSideColorReversal", imgSideColorReversal);
        formData.append("imgSideColorBwRate1", imgSideColorBwRate1);
        formData.append("imgSideColorBwRate2", imgSideColorBwRate2);
        formData.append("imgSideColorBwRate3", imgSideColorBwRate3);
        formData.append("imgSideColorBwRate4", imgSideColorBwRate4);
        formData.append("imgSideColorBwRate5", imgSideColorBwRate5);
        formData.append("imgSideColorBwRate6", imgSideColorBwRate6);
        formData.append("imgSideBw", imgSideBw);
        formData.append("imgSideBwMinerals", imgSideBwMinerals);
        formData.append("imgSideBwOrganism", imgSideBwOrganism);
        formData.append("imgSideBwReversal", imgSideBwReversal);
        formData.append("imgSideBwBwRate1", imgSideBwBwRate1);
        formData.append("imgSideBwBwRate2", imgSideBwBwRate2);
        formData.append("imgSideBwBwRate3", imgSideBwBwRate3);
        formData.append("imgSideBwBwRate4", imgSideBwBwRate4);
        formData.append("imgSideBwBwRate5", imgSideBwBwRate5);
        formData.append("imgSideBwBwRate6", imgSideBwBwRate6);
       
        const response = await saveXrayImg(formData);
        console.log('결과:', response);
        setRefresh(response);

        //setImgRealEdit(false);
        //setImgFrontEdit(false);
        //setImgSideEdit(false);

        Modal.success({
            content: '추가 완료',
            onOk() {
                setOpen(false);
                setDataEdit(false);
                form.resetFields();
            }
        });        
    };

    const handleChange = (e) => {
        e.preventDefault();
        e.persist();
        console.log(e.target.files);
        
        let files = e.target.files
        setPimgMultiple(files);
        
      };    

    // 이미지 추가 등록
    const insertSubmit = async () => {
        if (unitParams?.bagScanId.length <= 0) {
            Modal.error({
                content: 'bagScanId를 입력하세요.',
                onOk() {
                    setOpen(false);
                    setDataEdit(false);
                    form.resetFields();
                }
            });
            return false;
        }

        console.log("bagScanId:", unitParams?.bagScanId);
        console.log("files:", pimgMultiple);

        let formData = new FormData();
        const params = { targetName: unitParams?.bagScanId, command : "xray"};
        formData.append("params", new Blob([JSON.stringify(params)], { type: 'application/json' }));
        Object.values(pimgMultiple).forEach((pimgMultiple) => formData.append("files", pimgMultiple));
        //formData.append("files", pimgMultiple);
        const response = await uploadXrayImg(formData);

        setRefresh(response);
        Modal.success({
            content: '추가 완료',
            onOk() {
                setOpen(false);
                setDataEdit(false);
                form.resetFields();
            }
        });
    };    

    const onFinish = (values) => {
        console.log('Success:', values);
        // console.log(...fileListR);
    };

    const [popupimg, setPopupimg] = useState('');

    const handleImgPop = (e) => {
        setOnSearchItem(true);
        setPopupimg(e);	
    }
    
    useEffect(() => {
        setLoading(true); // 로딩 호출
        //console.log('useEffect2');
        handleinformationList();
    }, [refresh])    

    return (
        <>  

            <Form
                layout="horizontal"
                // onValuesChange={onFormLayoutChange}
                onFinish={onFinish}
                // onFinishFailed={onFinishFailed}
                // disabled={componentDisabled}
            >        
            <MainCard title="물품 이미지">
                <Typography variant="body1">
                    <Row gutter={[0, 0]}>

                        
                        <Col span={4} style={{ textAlign: 'center', padding: '0 10px' }}>

                            <Table 
                                columns={imagescolumns} dataSource={dataSource} 
                                onRow={(record, rowIndex) => {
                                    return {
                                      onClick: event => { 
                                         console.log(record);
                                         setImgRealEdit(true);
                                         getUnitImgList(record.key);
                                      }, // click row
                                      onDoubleClick: event => {}, // double click row
                                      onContextMenu: event => {}, // right button click row
                                      onMouseEnter: event => {}, // mouse enter row
                                      onMouseLeave: event => {}, // mouse leave row
                                    };
                                  }}
                                  onHeaderRow={(columns, index) => {
                                    return {
                                      onClick: () => {}, // click header row
                                    };
                                  }}                           
                                loading={loading}
                            />
                        </Col>

                        {/*정면 (컬러 ,흑백) 엑스레이정면, 엑스레이측면, 실물*/}
                        <Col span={10} style={{ width : '100%' }}>
                                <Row gutter={10} style={{ paddingBottom: '15px' }}>
                                    <Col span={48} offset={0}>
                                        <Space  direction="right">
                                            <Tooltip title="업로드">
                                            </Tooltip>
                                        </Space>


                                        <Space direction="right">
                                            <Tooltip title="3D생성">
                                            </Tooltip>
                                        </Space>                                         
                                    </Col>
                                </Row>

                                <Row gutter={[8, 8]}>
                                    <Col span={4}>
                                        <Form.Item name="File1">
                                            <Space direction="vertical">
                                                <Card
                                                    size="small"
                                                    style={{
                                                        width: 100,
                                                        height: 50
                                                    }}
                                                >
                                                        <Button 
                                                            onClick={clickSaveImgRefFrontColor1}
                                                            icon={<UploadOutlined />}
                                                            style={{ height: '30px', padding: '0px 0px 0px 0px', backgroundColor: '#f0f0f0' }}
                                                        >
                                                            정면컬러1
                                                        </Button>                                                        
                                                        <input type="file"
                                                                //ref={fileInput1}
                                                                /*onChange={handleChange} */
                                                                onChange={saveImgRefFrontColor1}
                                                                ref={imgRefFrontColor1}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img onClick={()=>handleImgPop(unitParams?.resultImg?.imgFrontColor)} src={unitParams?.resultImg?.imgFrontColor!==null && unitParams?.resultImg?.imgFrontColor!==undefined ? 'data:image/png;base64,' + unitParams?.resultImg?.imgFrontColor : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={pimgFrontColor ? pimgFrontColor :noImage} width={100} height={100} alt="real image"/>
                                                }                                                
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item name="File2">
                                            <Space direction="vertical">
                                                <Card
                                                    size="small"
                                                    style={{
                                                        width: 100,
                                                        height: 50
                                                    }}
                                                >
                                                        <Button 
                                                            onClick={clickSaveImgRefFrontColor2}
                                                            icon={<UploadOutlined />}
                                                            style={{ height: '30px', padding: '0px 0px 0px 0px', backgroundColor: '#f0f0f0' }}
                                                        >
                                                            정면컬러2
                                                        </Button>                                                        
                                                        <input type="file"
                                                                //ref={fileInput1}
                                                                /*onChange={handleChange} */
                                                                onChange={saveImgRefFrontColor2}
                                                                ref={imgRefFrontColor2}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img onClick={()=>handleImgPop(unitParams?.resultImg?.imgFrontColorMineral)} src={unitParams?.resultImg?.imgFrontColorMineral!==null && unitParams?.resultImg?.imgFrontColorMineral!==undefined ? 'data:image/png;base64,' + unitParams?.resultImg?.imgFrontColorMineral : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={pimgFrontColorMineral ? pimgFrontColorMineral :noImage} width={100} height={100} alt="real image"/>
                                                }                                                
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item name="File3">
                                            <Space direction="vertical">
                                                <Card
                                                    size="small"
                                                    style={{
                                                        width: 100,
                                                        height: 50
                                                    }}
                                                >
                                                        <Button 
                                                            onClick={clickSaveImgRefFrontColor3}
                                                            icon={<UploadOutlined />}
                                                            style={{ height: '30px', padding: '0px 0px 0px 0px', backgroundColor: '#f0f0f0' }}
                                                        >
                                                            정면컬러3
                                                        </Button>                                                        
                                                        <input type="file"
                                                                //ref={fileInput1}
                                                                /*onChange={handleChange} */
                                                                onChange={saveImgRefFrontColor3}
                                                                ref={imgRefFrontColor3}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img onClick={()=>handleImgPop(unitParams?.resultImg?.imgFrontColorOrganism)} src={unitParams?.resultImg?.imgFrontColorOrganism!==null && unitParams?.resultImg?.imgFrontColorOrganism!==undefined ? 'data:image/png;base64,' + unitParams?.resultImg?.imgFrontColorOrganism : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={pimgFrontColorOrganism ? pimgFrontColorOrganism :noImage} width={100} height={100} alt="real image"/>
                                                }                                                
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item name="File4">
                                            <Space direction="vertical">
                                                <Card
                                                    size="small"
                                                    style={{
                                                        width: 100,
                                                        height: 50
                                                    }}
                                                >
                                                        <Button 
                                                            onClick={clickSaveImgRefFrontColor4}
                                                            icon={<UploadOutlined />}
                                                            style={{ height: '30px', padding: '0px 0px 0px 0px', backgroundColor: '#f0f0f0' }}
                                                        >
                                                            정면컬러4
                                                        </Button>                                                        
                                                        <input type="file"
                                                                //ref={fileInput1}
                                                                /*onChange={handleChange} */
                                                                onChange={saveImgRefFrontColor4}
                                                                ref={imgRefFrontColor4}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img onClick={()=>handleImgPop(unitParams?.resultImg?.imgFrontColorReversal)} src={unitParams?.resultImg?.imgFrontColorReversal!==null && unitParams?.resultImg?.imgFrontColorReversal!==undefined ? 'data:image/png;base64,' + unitParams?.resultImg?.imgFrontColorReversal: noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={pimgFrontColorReversal ? pimgFrontColorReversal :noImage} width={100} height={100} alt="real image"/>
                                                }                                                
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item name="File5">
                                            <Space direction="vertical">
                                                <Card
                                                    size="small"
                                                    style={{
                                                        width: 100,
                                                        height: 50
                                                    }}
                                                >
                                                        <Button 
                                                            onClick={clickSaveImgRefFrontColor5}
                                                            icon={<UploadOutlined />}
                                                            style={{ height: '30px', padding: '0px 0px 0px 0px', backgroundColor: '#f0f0f0' }}
                                                        >
                                                            정면컬러5
                                                        </Button>                                                        
                                                        <input type="file"
                                                                //ref={fileInput1}
                                                                /*onChange={handleChange} */
                                                                onChange={saveImgRefFrontColor5}
                                                                ref={imgRefFrontColor5}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img onClick={()=>handleImgPop(unitParams?.resultImg?.imgFrontColorBwRate1)} src={unitParams?.resultImg?.imgFrontColorBwRate1!==null && unitParams?.resultImg?.imgFrontColorBwRate1!==undefined ? 'data:image/png;base64,' + unitParams?.resultImg?.imgFrontColorBwRate1 : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={pimgFrontColorBwRate1 ? pimgFrontColorBwRate1 :noImage} width={100} height={100} alt="real image"/>
                                                }                                                
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                </Row>


                                <Row gutter={[8, 8]}>
									<Col span={4}>
                                        <Form.Item name="File6">
                                            <Space direction="vertical">
                                                <Card
                                                    size="small"
                                                    style={{
                                                        width: 100,
                                                        height: 50
                                                    }}
                                                >
                                                        <Button 
                                                            onClick={clickSaveImgRefFrontColor6}
                                                            icon={<UploadOutlined />}
                                                            style={{ height: '30px', padding: '0px 0px 0px 0px', backgroundColor: '#f0f0f0' }}
                                                        >
                                                            정면컬러6
                                                        </Button>                                                        
                                                        <input type="file"
                                                                //ref={fileInput1}
                                                                /*onChange={handleChange} */
                                                                onChange={saveImgRefFrontColor6}
                                                                ref={imgRefFrontColor6}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img onClick={()=>handleImgPop(unitParams?.resultImg?.imgFrontColorBwRate2)} src={unitParams?.resultImg?.imgFrontColorBwRate2!==null && unitParams?.resultImg?.imgFrontColorBwRate2!==undefined ? 'data:image/png;base64,' + unitParams?.resultImg?.imgFrontColorBwRate2 : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={pimgFrontColorBwRate2 ? pimgFrontColorBwRate2 :noImage} width={100} height={100} alt="real image"/>
                                                }                                                
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item name="File7">
                                            <Space direction="vertical">
                                                <Card
                                                    size="small"
                                                    style={{
                                                        width: 100,
                                                        height: 50
                                                    }}
                                                >
                                                        <Button 
                                                            onClick={clickSaveImgRefFrontColor7}
                                                            icon={<UploadOutlined />}
                                                            style={{ height: '30px', padding: '0px 0px 0px 0px', backgroundColor: '#f0f0f0' }}
                                                        >
                                                            정면컬러7
                                                        </Button>                                                        
                                                        <input type="file"
                                                                //ref={fileInput1}
                                                                /*onChange={handleChange} */
                                                                onChange={saveImgRefFrontColor7}
                                                                ref={imgRefFrontColor7}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img onClick={()=>handleImgPop(unitParams?.resultImg?.imgFrontColorBwRate3)} src={unitParams?.resultImg?.imgFrontColorBwRate3!==null && unitParams?.resultImg?.imgFrontColorBwRate3!==undefined ? 'data:image/png;base64,' + unitParams?.resultImg?.imgFrontColorBwRate3 : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={pimgFrontColorBwRate3 ? pimgFrontColorBwRate3 :noImage} width={100} height={100} alt="real image"/>
                                                }                                                
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item name="File8">
                                            <Space direction="vertical">
                                                <Card
                                                    size="small"
                                                    style={{
                                                        width: 100,
                                                        height: 50
                                                    }}
                                                >
                                                        <Button 
                                                            onClick={clickSaveImgRefFrontColor8}
                                                            icon={<UploadOutlined />}
                                                            style={{ height: '30px', padding: '0px 0px 0px 0px', backgroundColor: '#f0f0f0' }}
                                                        >
                                                            정면컬러8
                                                        </Button>                                                        
                                                        <input type="file"
                                                                //ref={fileInput1}
                                                                /*onChange={handleChange} */
                                                                onChange={saveImgRefFrontColor8}
                                                                ref={imgRefFrontColor8}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img onClick={()=>handleImgPop(unitParams?.resultImg?.imgFrontColorBwRate4)} src={unitParams?.resultImg?.imgFrontColorBwRate4!==null && unitParams?.resultImg?.imgFrontColorBwRate4!==undefined ? 'data:image/png;base64,' + unitParams?.resultImg?.imgFrontColorBwRate4 : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={pimgFrontColorBwRate4 ? pimgFrontColorBwRate4 :noImage} width={100} height={100} alt="real image"/>
                                                }                                                
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item name="File9">
                                            <Space direction="vertical">
                                                <Card
                                                    size="small"
                                                    style={{
                                                        width: 100,
                                                        height: 50
                                                    }}
                                                >
                                                        <Button 
                                                            onClick={clickSaveImgRefFrontColor9}
                                                            icon={<UploadOutlined />}
                                                            style={{ height: '30px', padding: '0px 0px 0px 0px', backgroundColor: '#f0f0f0' }}
                                                        >
                                                            정면컬러9
                                                        </Button>                                                        
                                                        <input type="file"
                                                                //ref={fileInput1}
                                                                /*onChange={handleChange} */
                                                                onChange={saveImgRefFrontColor9}
                                                                ref={imgRefFrontColor9}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img onClick={()=>handleImgPop(unitParams?.resultImg?.imgFrontColorBwRate5)} src={unitParams?.resultImg?.imgFrontColorBwRate5!==null && unitParams?.resultImg?.imgFrontColorBwRate5!==undefined? 'data:image/png;base64,' + unitParams?.resultImg?.imgFrontColorBwRate5 : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={pimgFrontColorBwRate5 ? pimgFrontColorBwRate5 :noImage} width={100} height={100} alt="real image"/>
                                                }                                                
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item name="File10">
                                            <Space direction="vertical">
                                                <Card
                                                    size="small"
                                                    style={{
                                                        width: 100,
                                                        height: 50
                                                    }}
                                                >
                                                        <Button 
                                                            onClick={clickSaveImgRefFrontColor10}
                                                            icon={<UploadOutlined />}
                                                            style={{ height: '30px', padding: '0px 0px 0px 0px', backgroundColor: '#f0f0f0' }}
                                                        >
                                                            정면컬러10
                                                        </Button>                                                        
                                                        <input type="file"
                                                                //ref={fileInput1}
                                                                /*onChange={handleChange} */
                                                                onChange={saveImgRefFrontColor10}
                                                                ref={imgRefFrontColor10}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img onClick={()=>handleImgPop(unitParams?.resultImg?.imgFrontColorBwRate6)} src={unitParams?.resultImg?.imgFrontColorBwRate6!==null && unitParams?.resultImg?.imgFrontColorBwRate6!==undefined ? 'data:image/png;base64,' + unitParams?.resultImg?.imgFrontColorBwRate6 : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={pimgFrontColorBwRate6 ? pimgFrontColorBwRate6 :noImage} width={100} height={100} alt="real image"/>
                                                }                                                
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                </Row>									                                


                                {/*정면흑백*/}
                                <Row gutter={[8, 8]}>
                                    <Col span={4}>
                                        <Form.Item name="File1">
                                            <Space direction="vertical">
                                                <Card
                                                    size="small"
                                                    style={{
                                                        width: 100,
                                                        height: 50
                                                    }}
                                                >
                                                        <Button 
                                                            onClick={clickSaveImgRefBwColor1}
                                                            icon={<UploadOutlined />}
                                                            style={{ height: '30px', padding: '0px 0px 0px 0px', backgroundColor: '#f0f0f0' }}
                                                        >
                                                            정면흑백1
                                                        </Button>                                                        
                                                        <input type="file"
                                                                //ref={fileInput1}
                                                                /*onChange={handleChange} */
                                                                onChange={saveImgRefBwColor1}
                                                                ref={imgRefBwColor1 }
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img onClick={()=>handleImgPop(unitParams?.resultImg?.imgFrontBw)} src={unitParams?.resultImg?.imgFrontBw!==null && unitParams?.resultImg?.imgFrontBw!==undefined ? 'data:image/png;base64,' + unitParams?.resultImg?.imgFrontBw : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={pimgFrontBw ? pimgFrontBw :noImage} width={100} height={100} alt="real image"/>
                                                }                                                
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item name="File2">
                                            <Space direction="vertical">
                                                <Card
                                                    size="small"
                                                    style={{
                                                        width: 100,
                                                        height: 50
                                                    }}
                                                >
                                                        <Button 
                                                            onClick={clickSaveImgRefBwColor2}
                                                            icon={<UploadOutlined />}
                                                            style={{ height: '30px', padding: '0px 0px 0px 0px', backgroundColor: '#f0f0f0' }}
                                                        >
                                                            정면흑백2
                                                        </Button>                                                        
                                                        <input type="file"
                                                                //ref={fileInput1}
                                                                /*onChange={handleChange} */
                                                                onChange={saveImgRefBwColor2}
                                                                ref={imgRefBwColor2 }
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img onClick={()=>handleImgPop(unitParams?.resultImg?.imgFrontBwMineral)} src={unitParams?.resultImg?.imgFrontBwMineral!==null && unitParams?.resultImg?.imgFrontBwMineral!==undefined ? 'data:image/png;base64,' + unitParams?.resultImg?.imgFrontBwMineral : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={pimgFrontBwMineral ? pimgFrontBwMineral :noImage} width={100} height={100} alt="real image"/>
                                                }                                                
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item name="File3">
                                            <Space direction="vertical">
                                                <Card
                                                    size="small"
                                                    style={{
                                                        width: 100,
                                                        height: 50
                                                    }}
                                                >
                                                        <Button 
                                                            onClick={clickSaveImgRefBwColor3}
                                                            icon={<UploadOutlined />}
                                                            style={{ height: '30px', padding: '0px 0px 0px 0px', backgroundColor: '#f0f0f0' }}
                                                        >
                                                            정면흑백3
                                                        </Button>                                                        
                                                        <input type="file"
                                                                //ref={fileInput1}
                                                                /*onChange={handleChange} */
                                                                onChange={saveImgRefBwColor3}
                                                                ref={imgRefBwColor3 }
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img onClick={()=>handleImgPop(unitParams?.resultImg?.imgFrontBwOrganism)} src={unitParams?.resultImg?.imgFrontBwOrganism!==null && unitParams?.resultImg?.imgFrontBwOrganism!==undefined ? 'data:image/png;base64,' + unitParams?.resultImg?.imgFrontBwOrganism : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={pimgFrontBwOrganism ? pimgFrontBwOrganism :noImage} width={100} height={100} alt="real image"/>
                                                }                                                
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item name="File4">
                                            <Space direction="vertical">
                                                <Card
                                                    size="small"
                                                    style={{
                                                        width: 100,
                                                        height: 50
                                                    }}
                                                >
                                                        <Button 
                                                            onClick={clickSaveImgRefBwColor4}
                                                            icon={<UploadOutlined />}
                                                            style={{ height: '30px', padding: '0px 0px 0px 0px', backgroundColor: '#f0f0f0' }}
                                                        >
                                                            정면흑백4
                                                        </Button>                                                        
                                                        <input type="file"
                                                                //ref={fileInput1}
                                                                /*onChange={handleChange} */
                                                                onChange={saveImgRefBwColor4}
                                                                ref={imgRefBwColor4}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img onClick={()=>handleImgPop(unitParams?.resultImg?.imgFrontBwReversal)} src={unitParams?.resultImg?.imgFrontBwReversal!==null && unitParams?.resultImg?.imgFrontBwReversal!==undefined ? 'data:image/png;base64,' + unitParams?.resultImg?.imgFrontBwReversal : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={pimgFrontBwReversal ? pimgFrontBwReversal :noImage} width={100} height={100} alt="real image"/>
                                                }                                                
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item name="File5">
                                            <Space direction="vertical">
                                                <Card
                                                    size="small"
                                                    style={{
                                                        width: 100,
                                                        height: 50
                                                    }}
                                                >
                                                        <Button 
                                                            onClick={clickSaveImgRefBwColor5}
                                                            icon={<UploadOutlined />}
                                                            style={{ height: '30px', padding: '0px 0px 0px 0px', backgroundColor: '#f0f0f0' }}
                                                        >
                                                            정면흑백5
                                                        </Button>                                                        
                                                        <input type="file"
                                                                //ref={fileInput1}
                                                                /*onChange={handleChange} */
                                                                onChange={saveImgRefBwColor5}
                                                                ref={imgRefBwColor5}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img onClick={()=>handleImgPop(unitParams?.resultImg?.imgFrontBwBwRate1)} src={unitParams?.resultImg?.imgFrontBwBwRate1!==null && unitParams?.resultImg?.imgFrontBwBwRate1!==undefined ? 'data:image/png;base64,' + unitParams?.resultImg?.imgFrontBwBwRate1 : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={pimgFrontBwBwRate1 ? pimgFrontBwBwRate1 :noImage} width={100} height={100} alt="real image"/>
                                                }                                                
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                {/*정면흑백*/}
                                <Row gutter={[8, 8]}>
									<Col span={4}>
                                        <Form.Item name="File6">
                                            <Space direction="vertical">
                                                <Card
                                                    size="small"
                                                    style={{
                                                        width: 100,
                                                        height: 50
                                                    }}
                                                >
                                                        <Button 
                                                            onClick={clickSaveImgRefBwColor6}
                                                            icon={<UploadOutlined />}
                                                            style={{ height: '30px', padding: '0px 0px 0px 0px', backgroundColor: '#f0f0f0' }}
                                                        >
                                                            정면흑백6
                                                        </Button>                                                        
                                                        <input type="file"
                                                                //ref={fileInput1}
                                                                /*onChange={handleChange} */
                                                                onChange={saveImgRefBwColor6}
                                                                ref={imgRefBwColor6}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img onClick={()=>handleImgPop(unitParams?.resultImg?.imgFrontBwBwRate2)} src={unitParams?.resultImg?.imgFrontBwBwRate2!==null && unitParams?.resultImg?.imgFrontBwBwRate2!==undefined ? 'data:image/png;base64,' + unitParams?.resultImg?.imgFrontBwBwRate2 : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={pimgFrontBwBwRate2 ? pimgFrontBwBwRate2 :noImage} width={100} height={100} alt="real image"/>
                                                }                                                
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item name="File7">
                                            <Space direction="vertical">
                                                <Card
                                                    size="small"
                                                    style={{
                                                        width: 100,
                                                        height: 50
                                                    }}
                                                >
                                                        <Button 
                                                            onClick={clickSaveImgRefBwColor7}
                                                            icon={<UploadOutlined />}
                                                            style={{ height: '30px', padding: '0px 0px 0px 0px', backgroundColor: '#f0f0f0' }}
                                                        >
                                                            정면흑백7
                                                        </Button>                                                        
                                                        <input type="file"
                                                                //ref={fileInput1}
                                                                /*onChange={handleChange} */
                                                                onChange={saveImgRefBwColor7}
                                                                ref={imgRefBwColor7}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img onClick={()=>handleImgPop(unitParams?.resultImg?.imgFrontBwBwRate3)} src={unitParams?.resultImg?.imgFrontBwBwRate3!==null && unitParams?.resultImg?.imgFrontBwBwRate3!==undefined ? 'data:image/png;base64,' + unitParams?.resultImg?.imgFrontBwBwRate3 : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={pimgFrontBwBwRate3 ? pimgFrontBwBwRate3 :noImage} width={100} height={100} alt="real image"/>
                                                }                                                
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item name="File8">
                                            <Space direction="vertical">
                                                <Card
                                                    size="small"
                                                    style={{
                                                        width: 100,
                                                        height: 50
                                                    }}
                                                >
                                                        <Button 
                                                            onClick={clickSaveImgRefBwColor8}
                                                            icon={<UploadOutlined />}
                                                            style={{ height: '30px', padding: '0px 0px 0px 0px', backgroundColor: '#f0f0f0' }}
                                                        >
                                                            정면흑백8
                                                        </Button>                                                        
                                                        <input type="file"
                                                                //ref={fileInput1}
                                                                /*onChange={handleChange} */
                                                                onChange={saveImgRefBwColor8}
                                                                ref={imgRefBwColor8}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img onClick={()=>handleImgPop(unitParams?.resultImg?.imgFrontBwBwRate4)} src={unitParams?.resultImg?.imgFrontBwBwRate4!==null && unitParams?.resultImg?.imgFrontBwBwRate4!==undefined? 'data:image/png;base64,' + unitParams?.resultImg?.imgFrontBwBwRate4 : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={pimgFrontBwBwRate4 ? pimgFrontBwBwRate4 :noImage} width={100} height={100} alt="real image"/>
                                                }                                                
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item name="File9">
                                            <Space direction="vertical">
                                                <Card
                                                    size="small"
                                                    style={{
                                                        width: 100,
                                                        height: 50
                                                    }}
                                                >
                                                        <Button 
                                                            onClick={clickSaveImgRefBwColor9}
                                                            icon={<UploadOutlined />}
                                                            style={{ height: '30px', padding: '0px 0px 0px 0px', backgroundColor: '#f0f0f0' }}
                                                        >
                                                            정면흑백9
                                                        </Button>                                                        
                                                        <input type="file"
                                                                //ref={fileInput1}
                                                                /*onChange={handleChange} */
                                                                onChange={saveImgRefBwColor9}
                                                                ref={imgRefBwColor9}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img onClick={()=>handleImgPop(unitParams?.resultImg?.imgFrontBwBwRate5)} src={unitParams?.resultImg?.imgFrontBwBwRate5!==null && unitParams?.resultImg?.imgFrontBwBwRate5!==undefined ? 'data:image/png;base64,' + unitParams?.resultImg?.imgFrontBwBwRate5 : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={pimgFrontBwBwRate5 ? pimgFrontBwBwRate5 :noImage} width={100} height={100} alt="real image"/>
                                                }                                                
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item name="File10">
                                            <Space direction="vertical">
                                                <Card
                                                    size="small"
                                                    style={{
                                                        width: 100,
                                                        height: 50
                                                    }}
                                                >
                                                        <Button 
                                                            onClick={clickSaveImgRefBwColor10}
                                                            icon={<UploadOutlined />}
                                                            style={{ height: '30px', padding: '0px 0px 0px 0px', backgroundColor: '#f0f0f0' }}
                                                        >
                                                            정면흑백10
                                                        </Button>                                                        
                                                        <input type="file"
                                                                //ref={fileInput1}
                                                                /*onChange={handleChange} */
                                                                onChange={saveImgRefBwColor10}
                                                                ref={imgRefBwColor10}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img onClick={()=>handleImgPop(unitParams?.resultImg?.imgFrontBwBwRate6)} src={unitParams?.resultImg?.imgFrontBwBwRate6!==null && unitParams?.resultImg?.imgFrontBwBwRate6!==undefined ? 'data:image/png;base64,' + unitParams?.resultImg?.imgFrontBwBwRate6 : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={pimgFrontBwBwRate6 ? pimgFrontBwBwRate6 :noImage} width={100} height={100} alt="real image"/>
                                                }                                                
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                {/*정면 측면 실물 이미지*/}
                                <Row gutter={[8, 8]}>
                                    {/*정면*/}
                                    <Col span={4}>
                                    <Form.Item name="File11">
                                    <Space direction="vertical">
                                        <Card
                                            size="small"
                                            style={{
                                                width: 100,
                                                height: 50
                                            }}
                                        >
                                                <Button 
                                                    onClick={clickSaveImgRefFront}
                                                    icon={<UploadOutlined />}
                                                    style={{ height: '30px', padding: '0px 0px 0px 0px', backgroundColor: '#f0f0f0' }}
                                                >
                                                    정면이미지
                                                </Button>                                                        
                                                <input type="file"
                                                        //ref={fileInput1}
                                                        /*onChange={handleChange} */
                                                        onChange={saveImgRefFront}
                                                        ref={imgRefReal }
                                                        style={{ display: "none" }} />                                                     
                                        </Card>
                                    </Space>

                                    <Space direction="vertical">
                                        {imgRealEdit === true ?  
                                        <img onClick={()=>handleImgPop(unitParams?.resultImg?.imgFront)} src={unitParams?.resultImg?.imgFront!==null && unitParams?.resultImg?.imgFront!==undefined ? 'data:image/png;base64,' + unitParams?.resultImg?.imgFront : noImage} width={100} height={100} alt="real image" />
                                        : 
                                        <img src={pimgFront ? pimgFront :noImage} width={100} height={100} alt="real image"/>
                                        }                                                
                                    </Space>
                                    </Form.Item>
                                    </Col>

                                    {/*측면*/}
                                    <Col span={4}>
                                    <Form.Item name="File12">
                                    <Space direction="vertical">
                                        <Card
                                            size="small"
                                            style={{
                                                width: 100,
                                                height: 50
                                            }}
                                        >
                                                <Button 
                                                    onClick={clickSaveImgRefSide}
                                                    icon={<UploadOutlined />}
                                                    style={{ height: '30px', padding: '0px 0px 0px 0px', backgroundColor: '#f0f0f0' }}
                                                >
                                                    측면이미지
                                                </Button>                                                        
                                                <input type="file"
                                                        //ref={fileInput1}
                                                        /*onChange={handleChange} */
                                                        onChange={saveImgRefSide}
                                                        ref={imgRefFront }
                                                        style={{ display: "none" }} />                                                     
                                        </Card>
                                    </Space>

                                    <Space direction="vertical">
                                        {imgRealEdit === true ?  
                                        <img onClick={()=>handleImgPop(unitParams?.resultImg?.imgSide)} src={unitParams?.resultImg?.imgSide!==null && unitParams?.resultImg?.imgSide!==undefined? 'data:image/png;base64,' + unitParams?.resultImg?.imgSide : noImage} width={100} height={100} alt="real image" />
                                        : 
                                        <img src={pimgSide ? pimgSide :noImage} width={100} height={100} alt="real image"/>
                                        }                                                
                                    </Space>
                                    </Form.Item>
                                    </Col>



                                    {/*정면위험물품이미지*/}
                                    <Col span={4}>
                                    <Form.Item name="File15">
                                    <Space direction="vertical">
                                        <Card
                                            size="small"
                                            style={{
                                                width: 100,
                                                height: 50
                                            }}
                                        >
                                                <Button 
                                                    onClick={clickSaveImgRefFrontDanger}
                                                    icon={<UploadOutlined />}
                                                    style={{ height: '30px', padding: '0px 0px 0px 0px', backgroundColor: '#f0f0f0' }}
                                                >
                                                    정면위험물품이미지
                                                </Button>                                                        
                                                <input type="file"
                                                        //ref={fileInput1}
                                                        /*onChange={handleChange} */
                                                        onChange={saveImgRefFrontDanger}
                                                        ref={imgRefFrontDanger }
                                                        style={{ display: "none" }} />                                                     
                                        </Card>
                                    </Space>

                                    <Space direction="vertical">
                                        {imgRealEdit === true ?  
                                        <img onClick={()=>handleImgPop(unitParams?.resultImg?.imgFrontDanger)} src={unitParams?.resultImg?.imgFrontDanger!==null && unitParams?.resultImg?.imgFrontDanger!==undefined ? 'data:image/png;base64,' + unitParams?.resultImg?.imgFrontDanger : noImage} width={100} height={100} alt="front danger image" />
                                        : 
                                        <img src={pimgFrontDanger ? pimgFrontDanger :noImage} width={100} height={100} alt="front danger image"/>
                                        }                                                
                                    </Space>
                                    </Form.Item>
                                    </Col>  


                                    {/*측면위험물품이미지*/}
                                    <Col span={4}>
                                    <Form.Item name="File16">
                                    <Space direction="vertical">
                                        <Card
                                            size="small"
                                            style={{
                                                width: 100,
                                                height: 50
                                            }}
                                        >
                                                <Button 
                                                    onClick={clickSaveImgRefSideDanger}
                                                    icon={<UploadOutlined />}
                                                    style={{ height: '30px', padding: '0px 0px 0px 0px', backgroundColor: '#f0f0f0' }}
                                                >
                                                    측면위험물품이미지
                                                </Button>                                                        
                                                <input type="file"
                                                        //ref={fileInput1}
                                                        /*onChange={handleChange} */
                                                        onChange={saveImgRefSideDanger}
                                                        ref={imgRefSide }
                                                        style={{ display: "none" }} />                                                     
                                        </Card>
                                    </Space>

                                    <Space direction="vertical">
                                        {imgRealEdit === true ?  
                                        <img onClick={()=>handleImgPop(unitParams?.resultImg?.imgSideDanger)} src={unitParams?.resultImg?.imgSideDanger!==null && unitParams?.resultImg?.imgSideDanger!==undefined ? 'data:image/png;base64,' + unitParams?.resultImg?.imgSideDanger : noImage} width={100} height={100} alt="side danger image" />
                                        : 
                                        <img src={pimgSideDanger ? pimgSideDanger :noImage} width={100} height={100} alt="side danger image"/>
                                        }                                                
                                    </Space>
                                    </Form.Item>
                                    </Col>                                      


                                    

                                    {/*실물*/}
                                    <Col span={4}>
                                    <Form.Item name="File13">
                                    <Space direction="vertical">
                                        <Card
                                            size="small"
                                            style={{
                                                width: 100,
                                                height: 50
                                            }}
                                        >
                                                <Button 
                                                    onClick={clickSaveImgRefReal}
                                                    icon={<UploadOutlined />}
                                                    style={{ height: '30px', padding: '0px 0px 0px 0px', backgroundColor: '#f0f0f0' }}
                                                >
                                                    실물이미지
                                                </Button>                                                        
                                                <input type="file"
                                                        //ref={fileInput1}
                                                        /*onChange={handleChange} */
                                                        onChange={saveImgRefReal}
                                                        ref={imgRefSide }
                                                        style={{ display: "none" }} />                                                     
                                        </Card>
                                    </Space>

                                    <Space direction="vertical">
                                        {imgRealEdit === true ?  
                                        <img onClick={()=>handleImgPop(unitParams?.resultImg?.imgReal)} src={unitParams?.resultImg?.imgReal!==null && unitParams?.resultImg?.imgReal!==undefined ? 'data:image/png;base64,' + unitParams?.resultImg?.imgReal : noImage} width={100} height={100} alt="real image" />
                                        : 
                                        <img src={pimgReal ? pimgReal :noImage} width={100} height={100} alt="real image"/>
                                        }                                                
                                    </Space>
                                    </Form.Item>
                                    </Col>  
                                </Row>                                

                        </Col>
                        
                        
                        

                        {/*측면이미지*/}
                        <Col span={10} style={{ width : '100%' }}>
                                <Row gutter={10} style={{ paddingBottom: '15px' }}>
                                    <Col span={48} offset={0}>
                                        <Space  direction="right">
                                            <Tooltip title="업로드">
                                                <Button
                                                    type="success"
                                                    onClick={handleUpload}
                                                    htmlType="submit"
                                                    loading={uploading}
                                                    style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                                    icon={<PlusOutlined />}
                                                >
                                                    업로드
                                                </Button>
                                            </Tooltip>
                                        </Space>

                                    </Col>
                                    <Col span={8} offset={8} style={{ textAlign: 'right' }}>
                                        <Space>
                                            <Tooltip title="추가">
                                                <Button
                                                    type="success"
                                                    onClick={handleAdd}
                                                    style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                                    icon={<PlusOutlined />}
                                                >
                                                    추가
                                                </Button>
                                            </Tooltip>
                                        </Space>
                                    </Col>                                    
                                </Row>

                                <Row gutter={[8, 8]}>
                                    <Col span={4}>
                                        <Form.Item name="File1">
                                            <Space direction="vertical">
                                                <Card
                                                    size="small"
                                                    style={{
                                                        width: 100,
                                                        height: 50
                                                    }}
                                                >
                                                        <Button 
                                                            onClick={clickSaveImgRefSideColor1}
                                                            icon={<UploadOutlined />}
                                                            style={{ height: '30px', padding: '0px 0px 0px 0px', backgroundColor: '#f0f0f0' }}
                                                        >
                                                            측면컬러1
                                                        </Button>                                                        
                                                        <input type="file"
                                                                //ref={fileInput1}
                                                                /*onChange={handleChange} */
                                                                onChange={saveImgRefSideColor1 }
                                                                ref={imgRefSideColor1 }
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img onClick={()=>handleImgPop(unitParams?.resultImg?.imgSideColor)} src={unitParams?.resultImg?.imgSideColor!==null && unitParams?.resultImg?.imgSideColor!==undefined ? 'data:image/png;base64,' + unitParams?.resultImg?.imgSideColor : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={pimgSideColor ? pimgSideColor :noImage} width={100} height={100} alt="real image"/>
                                                }                                                
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item name="File2">
                                            <Space direction="vertical">
                                                <Card
                                                    size="small"
                                                    style={{
                                                        width: 100,
                                                        height: 50
                                                    }}
                                                >
                                                        <Button 
                                                            onClick={clickSaveImgRefSideColor2}
                                                            icon={<UploadOutlined />}
                                                            style={{ height: '30px', padding: '0px 0px 0px 0px', backgroundColor: '#f0f0f0' }}
                                                        >
                                                            측면컬러2
                                                        </Button>                                                        
                                                        <input type="file"
                                                                //ref={fileInput1}
                                                                /*onChange={handleChange} */
                                                                onChange={saveImgRefSideColor2}
                                                                ref={imgRefSideColor2}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img onClick={()=>handleImgPop(unitParams?.resultImg?.imgSideColorMineral)} src={unitParams?.resultImg?.imgSideColorMineral!==null && unitParams?.resultImg?.imgSideColorMineral!==undefined ? 'data:image/png;base64,' + unitParams?.resultImg?.imgSideColorMineral : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={pimgSideColorMineral ? pimgSideColorMineral :noImage} width={100} height={100} alt="real image"/>
                                                }                                                
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item name="File3">
                                            <Space direction="vertical">
                                                <Card
                                                    size="small"
                                                    style={{
                                                        width: 100,
                                                        height: 50
                                                    }}
                                                >
                                                        <Button 
                                                            onClick={clickSaveImgRefSideColor3}
                                                            icon={<UploadOutlined />}
                                                            style={{ height: '30px', padding: '0px 0px 0px 0px', backgroundColor: '#f0f0f0' }}
                                                        >
                                                            측면컬러3
                                                        </Button>                                                        
                                                        <input type="file"
                                                                //ref={fileInput1}
                                                                /*onChange={handleChange} */
                                                                onChange={saveImgRefSideColor3}
                                                                ref={imgRefSideColor3}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img onClick={()=>handleImgPop(unitParams?.resultImg?.imgSideColorOrganism)} src={unitParams?.resultImg?.imgSideColorOrganism!==null && unitParams?.resultImg?.imgSideColorOrganism!==undefined ? 'data:image/png;base64,' + unitParams?.resultImg?.imgSideColorOrganism : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={pimgSideColorOrganism ? pimgSideColorOrganism :noImage} width={100} height={100} alt="real image"/>
                                                }                                                
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item name="File4">
                                            <Space direction="vertical">
                                                <Card
                                                    size="small"
                                                    style={{
                                                        width: 100,
                                                        height: 50
                                                    }}
                                                >
                                                        <Button 
                                                            onClick={clickSaveImgRefSideColor4}
                                                            icon={<UploadOutlined />}
                                                            style={{ height: '30px', padding: '0px 0px 0px 0px', backgroundColor: '#f0f0f0' }}
                                                        >
                                                            측면컬러4
                                                        </Button>                                                        
                                                        <input type="file"
                                                                //ref={fileInput1}
                                                                /*onChange={handleChange} */
                                                                onChange={saveImgRefSideColor4}
                                                                ref={imgRefSideColor4}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img onClick={()=>handleImgPop(unitParams?.resultImg?.imgSideColorReversal)} src={unitParams?.resultImg?.imgSideColorReversal!==null && unitParams?.resultImg?.imgSideColorReversal!==undefined ? 'data:image/png;base64,' + unitParams?.resultImg?.imgSideColorReversal : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={pimgSideColorReversal ? pimgSideColorReversal :noImage} width={100} height={100} alt="real image"/>
                                                }                                                
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item name="File5">
                                            <Space direction="vertical">
                                                <Card
                                                    size="small"
                                                    style={{
                                                        width: 100,
                                                        height: 50
                                                    }}
                                                >
                                                        <Button 
                                                            onClick={clickSaveImgRefSideColor5}
                                                            icon={<UploadOutlined />}
                                                            style={{ height: '30px', padding: '0px 0px 0px 0px', backgroundColor: '#f0f0f0' }}
                                                        >
                                                            측면컬러5
                                                        </Button>                                                        
                                                        <input type="file"
                                                                //ref={fileInput1}
                                                                /*onChange={handleChange} */
                                                                onChange={saveImgRefSideColor5}
                                                                ref={imgRefSideColor5}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img onClick={()=>handleImgPop(unitParams?.resultImg?.imgSideColorBwRate1)} src={unitParams?.resultImg?.imgSideColorBwRate1!==null && unitParams?.resultImg?.imgSideColorBwRate1!==undefined ? 'data:image/png;base64,' + unitParams?.resultImg?.imgSideColorBwRate1 : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={pimgSideColorBwRate1 ? pimgSideColorBwRate1 :noImage} width={100} height={100} alt="real image"/>
                                                }                                                
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                </Row>


                                <Row gutter={[8, 8]}>
									<Col span={4}>
                                        <Form.Item name="File6">
                                            <Space direction="vertical">
                                                <Card
                                                    size="small"
                                                    style={{
                                                        width: 100,
                                                        height: 50
                                                    }}
                                                >
                                                        <Button 
                                                            onClick={clickSaveImgRefSideColor6}
                                                            icon={<UploadOutlined />}
                                                            style={{ height: '30px', padding: '0px 0px 0px 0px', backgroundColor: '#f0f0f0' }}
                                                        >
                                                            측면컬러6
                                                        </Button>                                                        
                                                        <input type="file"
                                                                //ref={fileInput1}
                                                                /*onChange={handleChange} */
                                                                onChange={saveImgRefSideColor6}
                                                                ref={imgRefSideColor6}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img onClick={()=>handleImgPop(unitParams?.resultImg?.imgSideColorBwRate2)} src={unitParams?.resultImg?.imgSideColorBwRate2!==null && unitParams?.resultImg?.imgSideColorBwRate2!==undefined ? 'data:image/png;base64,' + unitParams?.resultImg?.imgSideColorBwRate2 : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={pimgSideColorBwRate2 ? pimgSideColorBwRate2 :noImage} width={100} height={100} alt="real image"/>
                                                }                                                
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item name="File7">
                                            <Space direction="vertical">
                                                <Card
                                                    size="small"
                                                    style={{
                                                        width: 100,
                                                        height: 50
                                                    }}
                                                >
                                                        <Button 
                                                            onClick={clickSaveImgRefSideColor7}
                                                            icon={<UploadOutlined />}
                                                            style={{ height: '30px', padding: '0px 0px 0px 0px', backgroundColor: '#f0f0f0' }}
                                                        >
                                                            측면컬러7
                                                        </Button>                                                        
                                                        <input type="file"
                                                                //ref={fileInput1}
                                                                /*onChange={handleChange} */
                                                                onChange={saveImgRefSideColor7}
                                                                ref={imgRefSideColor7}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img onClick={()=>handleImgPop(unitParams?.resultImg?.imgSideColorBwRate3)} src={unitParams?.resultImg?.imgSideColorBwRate3!==null && unitParams?.resultImg?.imgSideColorBwRate3!==undefined ? 'data:image/png;base64,' + unitParams?.resultImg?.imgSideColorBwRate3 : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={pimgSideColorBwRate3 ? pimgSideColorBwRate3 :noImage} width={100} height={100} alt="real image"/>
                                                }                                                
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item name="File8">
                                            <Space direction="vertical">
                                                <Card
                                                    size="small"
                                                    style={{
                                                        width: 100,
                                                        height: 50
                                                    }}
                                                >
                                                        <Button 
                                                            onClick={clickSaveImgRefSideColor8}
                                                            icon={<UploadOutlined />}
                                                            style={{ height: '30px', padding: '0px 0px 0px 0px', backgroundColor: '#f0f0f0' }}
                                                        >
                                                            측면컬러8
                                                        </Button>                                                        
                                                        <input type="file"
                                                                //ref={fileInput1}
                                                                /*onChange={handleChange} */
                                                                onChange={saveImgRefSideColor8}
                                                                ref={imgRefSideColor8}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img onClick={()=>handleImgPop(unitParams?.resultImg?.imgSideColorBwRate4)} src={unitParams?.resultImg?.imgSideColorBwRate4!==null &&unitParams?.resultImg?.imgSideColorBwRate4!==undefined ? 'data:image/png;base64,' + unitParams?.resultImg?.imgSideColorBwRate4 : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={pimgSideColorBwRate4 ? pimgSideColorBwRate4 :noImage} width={100} height={100} alt="real image"/>
                                                }                                                
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item name="File9">
                                            <Space direction="vertical">
                                                <Card
                                                    size="small"
                                                    style={{
                                                        width: 100,
                                                        height: 50
                                                    }}
                                                >
                                                        <Button 
                                                            onClick={clickSaveImgRefSideColor9}
                                                            icon={<UploadOutlined />}
                                                            style={{ height: '30px', padding: '0px 0px 0px 0px', backgroundColor: '#f0f0f0' }}
                                                        >
                                                            측면컬러9
                                                        </Button>                                                        
                                                        <input type="file"
                                                                //ref={fileInput1}
                                                                /*onChange={handleChange} */
                                                                onChange={saveImgRefSideColor9}
                                                                ref={imgRefSideColor9}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img onClick={()=>handleImgPop(unitParams?.resultImg?.imgSideColorBwRate5)} src={unitParams?.resultImg?.imgSideColorBwRate5!==null && unitParams?.resultImg?.imgSideColorBwRate5!==undefined? 'data:image/png;base64,' + unitParams?.resultImg?.imgSideColorBwRate5 : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={pimgSideColorBwRate5 ? pimgSideColorBwRate5 :noImage} width={100} height={100} alt="real image"/>
                                                }                                                
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item name="File10">
                                            <Space direction="vertical">
                                                <Card
                                                    size="small"
                                                    style={{
                                                        width: 100,
                                                        height: 50
                                                    }}
                                                >
                                                        <Button 
                                                            onClick={clickSaveImgRefSideColor10}
                                                            icon={<UploadOutlined />}
                                                            style={{ height: '30px', padding: '0px 0px 0px 0px', backgroundColor: '#f0f0f0' }}
                                                        >
                                                            측면컬러10
                                                        </Button>                                                        
                                                        <input type="file"
                                                                //ref={fileInput1}
                                                                /*onChange={handleChange} */
                                                                onChange={saveImgRefSideColor10}
                                                                ref={imgRefSideColor10}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img onClick={()=>handleImgPop(unitParams?.resultImg?.imgSideColorBwRate6)} src={unitParams?.resultImg?.imgSideColorBwRate6!==null&&unitParams?.resultImg?.imgSideColorBwRate6!==undefined ? 'data:image/png;base64,' + unitParams?.resultImg?.imgSideColorBwRate6 : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={pimgSideColorBwRate6 ? pimgSideColorBwRate6 :noImage} width={100} height={100} alt="real image"/>
                                                }                                                
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                </Row>									                                

                                {/*정면컬러*/}
                                <Row gutter={[8, 8]}>
                                    <Col span={4}>
                                        <Form.Item name="File1">
                                            <Space direction="vertical">
                                                <Card
                                                    size="small"
                                                    style={{
                                                        width: 100,
                                                        height: 50
                                                    }}
                                                >
                                                        <Button 
                                                            onClick={clickSaveImgRefSideBw1}
                                                            icon={<UploadOutlined />}
                                                            style={{ height: '30px', padding: '0px 0px 0px 0px', backgroundColor: '#f0f0f0' }}
                                                        >
                                                            측면흑백1
                                                        </Button>                                                        
                                                        <input type="file"
                                                                //ref={fileInput1}
                                                                /*onChange={handleChange} */
                                                                onChange={saveImgRefSideBw1}
                                                                ref={imgRefSideBw1 }
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img onClick={()=>handleImgPop(unitParams?.resultImg?.imgSideBw)} src={unitParams?.resultImg?.imgSideBw!==null && unitParams?.resultImg?.imgSideBw!==undefined ? 'data:image/png;base64,' + unitParams?.resultImg?.imgSideBw : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={pimgSideBw ? pimgSideBw :noImage} width={100} height={100} alt="real image"/>
                                                }                                                
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item name="File2">
                                            <Space direction="vertical">
                                                <Card
                                                    size="small"
                                                    style={{
                                                        width: 100,
                                                        height: 50
                                                    }}
                                                >
                                                        <Button 
                                                            onClick={clickSaveImgRefSideBw2}
                                                            icon={<UploadOutlined />}
                                                            style={{ height: '30px', padding: '0px 0px 0px 0px', backgroundColor: '#f0f0f0' }}
                                                        >
                                                            측면흑백2
                                                        </Button>                                                        
                                                        <input type="file"
                                                                //ref={fileInput1}
                                                                /*onChange={handleChange} */
                                                                onChange={saveImgRefSideBw2}
                                                                ref={imgRefSideBw2}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img onClick={()=>handleImgPop(unitParams?.resultImg?.imgSideBwMinerals)} src={unitParams?.resultImg?.imgSideBwMinerals!==null && unitParams?.resultImg?.imgSideBwMinerals!==undefined? 'data:image/png;base64,' + unitParams?.resultImg?.imgSideBwMinerals : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={pimgSideBwMinerals ? pimgSideBwMinerals :noImage} width={100} height={100} alt="real image"/>
                                                }                                                
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item name="File3">
                                            <Space direction="vertical">
                                                <Card
                                                    size="small"
                                                    style={{
                                                        width: 100,
                                                        height: 50
                                                    }}
                                                >
                                                        <Button 
                                                            onClick={clickSaveImgRefSideBw3}
                                                            icon={<UploadOutlined />}
                                                            style={{ height: '30px', padding: '0px 0px 0px 0px', backgroundColor: '#f0f0f0' }}
                                                        >
                                                            측면흑백3
                                                        </Button>                                                        
                                                        <input type="file"
                                                                //ref={fileInput1}
                                                                /*onChange={handleChange} */
                                                                onChange={saveImgRefSideBw3}
                                                                ref={imgRefSideBw3}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img onClick={()=>handleImgPop(unitParams?.resultImg?.imgSideBwOrganism)} src={unitParams?.resultImg?.imgSideBwOrganism!==null && unitParams?.resultImg?.imgSideBwOrganism!==undefined? 'data:image/png;base64,' + unitParams?.resultImg?.imgSideBwOrganism : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={pimgSideBwOrganism ? pimgSideBwOrganism :noImage} width={100} height={100} alt="real image"/>
                                                }                                                
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item name="File4">
                                            <Space direction="vertical">
                                                <Card
                                                    size="small"
                                                    style={{
                                                        width: 100,
                                                        height: 50
                                                    }}
                                                >
                                                        <Button 
                                                            onClick={clickSaveImgRefSideBw4}
                                                            icon={<UploadOutlined />}
                                                            style={{ height: '30px', padding: '0px 0px 0px 0px', backgroundColor: '#f0f0f0' }}
                                                        >
                                                            측면흑백4
                                                        </Button>                                                        
                                                        <input type="file"
                                                                //ref={fileInput1}
                                                                /*onChange={handleChange} */
                                                                onChange={saveImgRefSideBw4}
                                                                ref={imgRefSideBw4}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img onClick={()=>handleImgPop(unitParams?.resultImg?.imgSideBwReversal)} src={unitParams?.resultImg?.imgSideBwReversal!==null&&unitParams?.resultImg?.imgSideBwReversal!==undefined ? 'data:image/png;base64,' + unitParams?.resultImg?.imgSideBwReversal : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={pimgSideBwReversal ? pimgSideBwReversal :noImage} width={100} height={100} alt="real image"/>
                                                }                                                
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item name="File5">
                                            <Space direction="vertical">
                                                <Card
                                                    size="small"
                                                    style={{
                                                        width: 100,
                                                        height: 50
                                                    }}
                                                >
                                                        <Button 
                                                            onClick={clickSaveImgRefSideBw5}
                                                            icon={<UploadOutlined />}
                                                            style={{ height: '30px', padding: '0px 0px 0px 0px', backgroundColor: '#f0f0f0' }}
                                                        >
                                                            측면흑백5
                                                        </Button>                                                        
                                                        <input type="file"
                                                                //ref={fileInput1}
                                                                /*onChange={handleChange} */
                                                                onChange={saveImgRefSideBw5}
                                                                ref={imgRefSideBw5}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img onClick={()=>handleImgPop(unitParams?.resultImg?.imgSideBwBwRate1)} src={unitParams?.resultImg?.imgSideBwBwRate1!==null && unitParams?.resultImg?.imgSideBwBwRate1!==undefined? 'data:image/png;base64,' + unitParams?.resultImg?.imgSideBwBwRate1 : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={pimgSideBwBwRate1 ? pimgSideBwBwRate1 :noImage} width={100} height={100} alt="real image"/>
                                                }                                                
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                {/*정면흑백*/}
                                <Row gutter={[8, 8]}>
									<Col span={4}>
                                        <Form.Item name="File6">
                                            <Space direction="vertical">
                                                <Card
                                                    size="small"
                                                    style={{
                                                        width: 100,
                                                        height: 50
                                                    }}
                                                >
                                                        <Button 
                                                            onClick={clickSaveImgRefSideBw6}
                                                            icon={<UploadOutlined />}
                                                            style={{ height: '30px', padding: '0px 0px 0px 0px', backgroundColor: '#f0f0f0' }}
                                                        >
                                                            측면흑백6
                                                        </Button>                                                        
                                                        <input type="file"
                                                                //ref={fileInput1}
                                                                /*onChange={handleChange} */
                                                                onChange={saveImgRefSideBw6}
                                                                ref={imgRefSideBw6}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img onClick={()=>handleImgPop(unitParams?.resultImg?.imgSideBwBwRate2)} src={unitParams?.resultImg?.imgSideBwBwRate2!==null && unitParams?.resultImg?.imgSideBwBwRate2!==undefined ? 'data:image/png;base64,' + unitParams?.resultImg?.imgSideBwBwRate2 : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={pimgSideBwBwRate2 ? pimgSideBwBwRate2 :noImage} width={100} height={100} alt="real image"/>
                                                }                                                
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item name="File7">
                                            <Space direction="vertical">
                                                <Card
                                                    size="small"
                                                    style={{
                                                        width: 100,
                                                        height: 50
                                                    }}
                                                >
                                                        <Button 
                                                            onClick={clickSaveImgRefSideBw7}
                                                            icon={<UploadOutlined />}
                                                            style={{ height: '30px', padding: '0px 0px 0px 0px', backgroundColor: '#f0f0f0' }}
                                                        >
                                                            측면흑백7
                                                        </Button>                                                        
                                                        <input type="file"
                                                                //ref={fileInput1}
                                                                /*onChange={handleChange} */
                                                                onChange={saveImgRefSideBw7}
                                                                ref={imgRefSideBw7}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img onClick={()=>handleImgPop(unitParams?.resultImg?.imgSideBwBwRate3)} src={unitParams?.resultImg?.imgSideBwBwRate3!==null &&unitParams?.resultImg?.imgSideBwBwRate3!==undefined ? 'data:image/png;base64,' + unitParams?.resultImg?.imgSideBwBwRate3 : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={pimgSideBwBwRate3 ? pimgSideBwBwRate3 :noImage} width={100} height={100} alt="real image"/>
                                                }                                                
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item name="File8">
                                            <Space direction="vertical">
                                                <Card
                                                    size="small"
                                                    style={{
                                                        width: 100,
                                                        height: 50
                                                    }}
                                                >
                                                        <Button 
                                                            onClick={clickSaveImgRefSideBw8}
                                                            icon={<UploadOutlined />}
                                                            style={{ height: '30px', padding: '0px 0px 0px 0px', backgroundColor: '#f0f0f0' }}
                                                        >
                                                            측면흑백8
                                                        </Button>                                                        
                                                        <input type="file"
                                                                //ref={fileInput1}
                                                                /*onChange={handleChange} */
                                                                onChange={saveImgRefSideBw8}
                                                                ref={imgRefSideBw8}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img onClick={()=>handleImgPop(unitParams?.resultImg?.imgSideBwBwRate4)} src={unitParams?.resultImg?.imgSideBwBwRate4!==null && unitParams?.resultImg?.imgSideBwBwRate4!==undefined? 'data:image/png;base64,' + unitParams?.resultImg?.imgSideBwBwRate4 : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={pimgSideBwBwRate4 ? pimgSideBwBwRate4 :noImage} width={100} height={100} alt="real image"/>
                                                }                                                
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item name="File9">
                                            <Space direction="vertical">
                                                <Card
                                                    size="small"
                                                    style={{
                                                        width: 100,
                                                        height: 50
                                                    }}
                                                >
                                                        <Button 
                                                            onClick={clickSaveImgRefSideBw9}
                                                            icon={<UploadOutlined />}
                                                            style={{ height: '30px', padding: '0px 0px 0px 0px', backgroundColor: '#f0f0f0' }}
                                                        >
                                                            측면흑백9
                                                        </Button>                                                        
                                                        <input type="file"
                                                                //ref={fileInput1}
                                                                /*onChange={handleChange} */
                                                                onChange={saveImgRefSideBw9}
                                                                ref={imgRefSideBw9}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img onClick={()=>handleImgPop(unitParams?.resultImg?.imgSideBwBwRate5)} src={unitParams?.resultImg?.imgSideBwBwRate5!==null && unitParams?.resultImg?.imgSideBwBwRate5!==undefined? 'data:image/png;base64,' + unitParams?.resultImg?.imgSideBwBwRate5 : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={pimgSideBwBwRate5 ? pimgSideBwBwRate5 :noImage} width={100} height={100} alt="real image"/>
                                                }                                                
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item name="File10">
                                            <Space direction="vertical">
                                                <Card
                                                    size="small"
                                                    style={{
                                                        width: 100,
                                                        height: 50
                                                    }}
                                                >
                                                        <Button 
                                                            onClick={clickSaveImgRefSideBw10}
                                                            icon={<UploadOutlined />}
                                                            style={{ height: '30px', padding: '0px 0px 0px 0px', backgroundColor: '#f0f0f0' }}
                                                        >
                                                            측면흑백10
                                                        </Button>                                                        
                                                        <input type="file"
                                                                //ref={fileInput1}
                                                                /*onChange={handleChange} */
                                                                onChange={saveImgRefSideBw10}
                                                                ref={imgRefSideBw10}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img onClick={()=>handleImgPop(unitParams?.resultImg?.imgSideBwBwRate6)} src={unitParams?.resultImg?.imgSideBwBwRate6!==null && unitParams?.resultImg?.imgSideBwBwRate6!==undefined? 'data:image/png;base64,' + unitParams?.resultImg?.imgSideBwBwRate6 : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={pimgSideBwBwRate6 ? pimgSideBwBwRate6 :noImage} width={100} height={100} alt="real image"/>
                                                }                                                
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                </Row>

                        </Col>                        
                    </Row>





                </Typography>
            </MainCard>
            </Form>


            {/* 이미지 Modal Start */}
            <Modal
                open={onSearchItem}
                onOk={Unit_ModalOk}
                onCancel={Unit_ModalCancel}
                title="물품추가"
                width={650}
                style={{
                    left: 130,
                    zIndex: 999
                }}
                footer={[
                    <Button
                        type="primary"
                        onClick={Unit_ModalCancel}
                        style={{ width: '100px', borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                    >
                        close
                    </Button>
                ]}
            >
                <MainCard>
                    <Form layout="vertical" name="Unit_Language_Add" form={form} onFinish={Unit_LanguageAdd}>
                        <Form.Item>
                            <Row >
                                <Col style={{ textAlign: 'center', padding: '0 10px' }}>
                                    <img src={'data:image/png;base64,'+ popupimg} />
                                </Col>
                            </Row>
                        </Form.Item>
                    </Form>
                </MainCard>
            </Modal>
            
            {/* 이미지추가 폼 Start */}
            <Drawer
                maskClosable={false}
                title={`이미지 추가`}
                onClose={onAddClose}
                open={open}
                width={400}
                style={{ top: '60px' }}
                extra={
                    <>
                        <Space>
                            <Tooltip title="취소" placement="bottom">
                                <Button onClick={onAddClose} style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}>
                                    취소
                                </Button>
                            </Tooltip>
                            <Tooltip title="추가" placement="bottom" color="#108ee9">
                                <Button
                                    onClick={insertSubmit}
                                    style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                    type="primary"
                                >
                                    추가
                                </Button>
                            </Tooltip>
                        </Space>
                    </>
                }
            >
                <MainCard>
                    <Form layout="vertical" form={form}>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    label="bagScanId"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter bagScanId'
                                        }
                                    ]}
                                >
                                    <Input
                                        name="bagScanId"
                                        value={unitParams?.bagScanId}
                                        defaultValue={unitParams?.bagScanId}
                                        onChange={(e) => setUnitParams({ ...unitParams, bagScanId: e.target.value })}
                                        placeholder="Please Enter bagScanId"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    label="xray 파일"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter xray 파일'
                                        }
                                    ]}
                                >
                                    <input type="file"
                                            //ref={fileInput1}
                                            /*onChange={handleChange} */
                                            onChange={handleChange}
                                            multiple/>  
                                </Form.Item>
                            </Col>
                        </Row>    

                        <Descriptions title="xray 이미지명 설명" bordered>
                            <Descriptions.Item>
                            실사이미지 - 403 <br/>
                            정면XRAY위험물품표시 - 401 <br/>
                            측면XRAY위험물품표시 - 402 <br/> <br/>

                            정면컬러 - 101 <br/>
                            정면무기물 - 102 <br/>
                            정면유기물 - 103 <br/>
                            정면반전 - 104 <br/>
                            정면채도 - 105 <br/>
                            정면채도 - 106 <br/>
                            정면채도 - 107 <br/>
                            정면채도 - 108 <br/>
                            정면채도 - 109 <br/>
                            정면채도 - 110 <br/> <br/>

                            정면흑백 - 111 <br/>
                            정면흑백무기물 - 112 <br/>
                            정면흑백유기물 - 113 <br/>
                            정면흑백반전 - 114 <br/>
                            정면흑백채도 - 115 <br/>
                            정면흑백채도 - 116 <br/>
                            정면흑백채도 - 117 <br/>
                            정면흑백채도 - 118 <br/>
                            정면흑백채도 - 119 <br/>
                            정면흑백채도 - 120 <br/> <br/>

                            측면컬러 - 201 <br/>
                            측면무기물 - 202 <br/>
                            측면유기물 - 203 <br/>
                            측면반전 - 204 <br/>
                            측면채도 - 205 <br/>
                            측면채도 - 206 <br/>
                            측면채도 - 207 <br/>
                            측면채도 - 208 <br/>
                            측면채도 - 209 <br/>
                            측면채도 - 210 <br/> <br/>
                            
                            측면흑백 - 211 <br/>
                            측면흑백무기물 - 212 <br/>
                            측면흑백유기물 - 213 <br/>
                            측면흑백반전 - 214 <br/>
                            측면흑백채도 - 215 <br/>
                            측면흑백채도 - 216 <br/>
                            측면흑백채도 - 217 <br/>
                            측면흑백채도 - 218 <br/>
                            측면흑백채도 - 219 <br/>
                            측면흑백채도 - 220 <br/>
                            </Descriptions.Item>
                        </Descriptions>                                 

                    </Form>
                </MainCard>
            </Drawer>            
        </>
    );
};
