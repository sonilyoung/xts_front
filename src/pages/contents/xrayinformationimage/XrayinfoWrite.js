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
    Dragger
} from 'antd';
import { Typography } from '@mui/material';
import { PlusOutlined, EditFilled, DeleteFilled, UploadOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { 
    useGetXrayinformationListMutation, 
    useSelectXrayImgContentsMutation,
    useUpdateXrayContentsImgMutation
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

    const [saveXrayImg] = useUpdateXrayContentsImgMutation(); // xray이미지 저장 api
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
    const [languageCode, setLanguageCode] = useState('kor'); // 언어코드
    const [studyLvl, setStudyLvl] = useState('1'); // 스터디레벨
    const [unitName, setUnitName] = useState(); // xray이름
    const [unitDesc, setUnitDesc] = useState(); // xray설명
    const [useYn, setUseYn] = useState(); // 사용유무

    const [bagScanId, setBagScanId] = useState(); // 수정키
    const [unitScanThreed, setUnitScanThreed] = useState(); // 데모용을 위한 3d이미지구분키

    //const params = useRef(); // 수정화면
    const [refresh, setRefresh] = useState(false); //리프레쉬
    const [unitParams, setUnitParams] = useState({imgReal : ''});

    const handleinformationList = async () => {
        const getXrayinforResponse = await getXrayinformationList({ });
        setXrayinformationList(getXrayinforResponse?.data?.RET_DATA);
        setDataSource([
            ...getXrayinforResponse?.data?.RET_DATA.map((d, i) => ({
                key: d.bagScanId,
                rowdata0: i + 1,
                rowdata1: d.bagScanId
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
        setUnitLanguageModalOpen(true);
    };
    const Unit_LanguageOk = () => {
        setUnitLanguageModalOpen(false);
        form.resetFields();
    };
    const Unit_LanguageCancel = () => {
        setUnitLanguageModalOpen(false);
        form.resetFields();
    };
    const Unit_LanguageAdd = (values) => {
        console.log('Received values of form:', values);
    };

    // 물품명칭 언어 추가 End


    // 각각업로드될 이미지param
    const [imgReal,	setImgReal	]	=	useState('');
    const [imgSide,	setImgSide	]	=	useState('');
    const [imgFront,	setImgFront	]	=	useState('');
    const [imgFrontCollar,	setImgFrontCollar	]	=	useState('');
    const [imgFrontOrganism,	setImgFrontOrganism	]	=	useState('');
    const [imgFrontCollarOutline,	setImgFrontCollarOutline	]	=	useState('');
    const [imgFrontCollarReversal,	setImgFrontCollarReversal	]	=	useState('');
    const [imgFrontCollarBwRate1,	setImgFrontCollarBwRate1	]	=	useState('');
    const [imgFrontCollarBwRate2,	setImgFrontCollarBwRate2	]	=	useState('');
    const [imgFrontCollarBwRate3,	setImgFrontCollarBwRate3	]	=	useState('');
    const [imgFrontCollarBwRate4,	setImgFrontCollarBwRate4	]	=	useState('');
    const [imgFrontCollarBwRate5,	setImgFrontCollarBwRate5	]	=	useState('');
    const [imgFrontCollarBwRate6,	setImgFrontCollarBwRate6	]	=	useState('');
    const [imgFrontBw,	setImgFrontBw	]	=	useState('');
    const [imgFrontMinerals,	setImgFrontMinerals	]	=	useState('');
    const [imgFrontBwOutline,	setImgFrontBwOutline	]	=	useState('');
    const [imgFrontBwReversal,	setImgFrontBwReversal	]	=	useState('');
    const [imgFrontBwBwRate1,	setImgFrontBwBwRate1	]	=	useState('');
    const [imgFrontBwBwRate2,	setImgFrontBwBwRate2	]	=	useState('');
    const [imgFrontBwBwRate3,	setImgFrontBwBwRate3	]	=	useState('');
    const [imgFrontBwBwRate4,	setImgFrontBwBwRate4	]	=	useState('');
    const [imgFrontBwBwRate5,	setImgFrontBwBwRate5	]	=	useState('');
    const [imgFrontBwBwRate6,	setImgFrontBwBwRate6	]	=	useState('');
    const [imgSideCollar,	setImgSideCollar	]	=	useState('');
    const [imgSideOrganism,	setImgSideOrganism	]	=	useState('');
    const [imgSideCollarOutline,	setImgSideCollarOutline	]	=	useState('');
    const [imgSideCollarReversal,	setImgSideCollarReversal	]	=	useState('');
    const [imgSideCollarBwRate1,	setImgSideCollarBwRate1	]	=	useState('');
    const [imgSideCollarBwRate2,	setImgSideCollarBwRate2	]	=	useState('');
    const [imgSideCollarBwRate3,	setImgSideCollarBwRate3	]	=	useState('');
    const [imgSideCollarBwRate4,	setImgSideCollarBwRate4	]	=	useState('');
    const [imgSideCollarBwRate5,	setImgSideCollarBwRate5	]	=	useState('');
    const [imgSideCollarBwRate6,	setImgSideCollarBwRate6	]	=	useState('');
    const [imgSideBw,	setImgSideBw	]	=	useState('');
    const [imgSideMinerals,	setImgSideMinerals	]	=	useState('');
    const [imgSideBwOutline,	setImgSideBwOutline	]	=	useState('');
    const [imgSideBwReversal,	setImgSideBwReversal	]	=	useState('');
    const [imgSideBwBwRate1,	setImgSideBwBwRate1	]	=	useState('');
    const [imgSideBwBwRate2,	setImgSideBwBwRate2	]	=	useState('');
    const [imgSideBwBwRate3,	setImgSideBwBwRate3	]	=	useState('');
    const [imgSideBwBwRate4,	setImgSideBwBwRate4	]	=	useState('');
    const [imgSideBwBwRate5,	setImgSideBwBwRate5	]	=	useState('');
    const [imgSideBwBwRate6,	setImgSideBwBwRate6	]	=	useState('');
    


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
    

    const clickSaveImgRefFrontColor1 = e =>  {
        setImgEdit(false);
        imgRefFrontColor1.current.click();
    };

    const saveImgRefFrontColor1 = () => {
        const file = imgRefFrontColor1.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setFileReal(reader.result);
        };
        setImgReal(file);
        //setImgRealEdit(false);
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
            setFileReal(reader.result);
        };
        setImgReal(file);
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
            setFileReal(reader.result);
        };
        setImgReal(file);
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
            setFileReal(reader.result);
        };
        setImgReal(file);
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
            setFileReal(reader.result);
        };
        setImgReal(file);
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
            setFileReal(reader.result);
        };
        setImgReal(file);
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
            setFileReal(reader.result);
        };
        setImgReal(file);
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
            setFileReal(reader.result);
        };
        setImgReal(file);
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
            setFileReal(reader.result);
        };
        setImgReal(file);
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
            setFileReal(reader.result);
        };
        setImgReal(file);
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
            setFileReal(reader.result);
        };
        setImgReal(file);
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
            setFileReal(reader.result);
        };
        setImgReal(file);
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
            setFileReal(reader.result);
        };
        setImgReal(file);
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
            setFileReal(reader.result);
        };
        setImgReal(file);
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
            setFileReal(reader.result);
        };
        setImgReal(file);
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
            setFileReal(reader.result);
        };
        setImgReal(file);
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
            setFileReal(reader.result);
        };
        setImgReal(file);
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
            setFileReal(reader.result);
        };
        setImgReal(file);
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
            setFileReal(reader.result);
        };
        setImgReal(file);
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
            setFileReal(reader.result);
        };
        setImgReal(file);
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
            setFileReal(reader.result);
        };
        setImgReal(file);
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
            setFileReal(reader.result);
        };
        setImgReal(file);
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
            setFileReal(reader.result);
        };
        setImgReal(file);
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
            setFileReal(reader.result);
        };
        setImgReal(file);
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
            setFileReal(reader.result);
        };
        setImgReal(file);
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
            setFileReal(reader.result);
        };
        setImgReal(file);
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
            setFileReal(reader.result);
        };
        setImgReal(file);
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
            setFileReal(reader.result);
        };
        setImgReal(file);
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
            setFileReal(reader.result);
        };
        setImgReal(file);
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
            setFileReal(reader.result);
        };
        setImgReal(file);
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
            setFileReal(reader.result);
        };
        setImgReal(file);
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
            setFileReal(reader.result);
        };
        setImgReal(file);
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
            setFileReal(reader.result);
        };
        setImgReal(file);
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
            setFileReal(reader.result);
        };
        setImgReal(file);
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
            setFileReal(reader.result);
        };
        setImgReal(file);
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
            setFileReal(reader.result);
        };
        setImgReal(file);
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
            setFileReal(reader.result);
        };
        setImgReal(file);
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
            setFileReal(reader.result);
        };
        setImgReal(file);
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
            setFileReal(reader.result);
        };
        setImgReal(file);
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
            setFileReal(reader.result);
        };
        setImgReal(file);
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
            setFileReal(reader.result);
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
            setFileReal(reader.result);
        };
        setImgReal(file);
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
            setFileReal(reader.result);
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
        
        if(bagScanId===undefined){
            Modal.error({
                content: '이미지 업로드 할 대상을 선택해주세요.',
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
        formData.append("imgFront", imgFront);
        formData.append("imgSide", imgSide);     
       
        console.log('imgReal: ', imgReal);
        const response = await saveXrayImg(formData);
        console.log('결과:', response);
        setRefresh(response);

        setImgRealEdit(false);
        setImgFrontEdit(false);
        setImgSideEdit(false);

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
                                         //setDataEdit(true);
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
                                                <img src={unitParams.imgReal!==null ? 'data:image/png;base64,' + unitParams.imgReal : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={fileReal ? fileReal :noImage} width={100} height={100} alt="real image"/>
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
                                                <img src={unitParams.imgReal!==null ? 'data:image/png;base64,' + unitParams.imgReal : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={fileReal ? fileReal :noImage} width={100} height={100} alt="real image"/>
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
                                                <img src={unitParams.imgReal!==null ? 'data:image/png;base64,' + unitParams.imgReal : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={fileReal ? fileReal :noImage} width={100} height={100} alt="real image"/>
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
                                                <img src={unitParams.imgReal!==null ? 'data:image/png;base64,' + unitParams.imgReal : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={fileReal ? fileReal :noImage} width={100} height={100} alt="real image"/>
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
                                                <img src={unitParams.imgReal!==null ? 'data:image/png;base64,' + unitParams.imgReal : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={fileReal ? fileReal :noImage} width={100} height={100} alt="real image"/>
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
                                                <img src={unitParams.imgReal!==null ? 'data:image/png;base64,' + unitParams.imgReal : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={fileReal ? fileReal :noImage} width={100} height={100} alt="real image"/>
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
                                                <img src={unitParams.imgReal!==null ? 'data:image/png;base64,' + unitParams.imgReal : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={fileReal ? fileReal :noImage} width={100} height={100} alt="real image"/>
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
                                                <img src={unitParams.imgReal!==null ? 'data:image/png;base64,' + unitParams.imgReal : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={fileReal ? fileReal :noImage} width={100} height={100} alt="real image"/>
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
                                                <img src={unitParams.imgReal!==null ? 'data:image/png;base64,' + unitParams.imgReal : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={fileReal ? fileReal :noImage} width={100} height={100} alt="real image"/>
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
                                                <img src={unitParams.imgReal!==null ? 'data:image/png;base64,' + unitParams.imgReal : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={fileReal ? fileReal :noImage} width={100} height={100} alt="real image"/>
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
                                                                ref={imgRef1}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img src={unitParams.imgReal!==null ? 'data:image/png;base64,' + unitParams.imgReal : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={fileReal ? fileReal :noImage} width={100} height={100} alt="real image"/>
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
                                                                ref={imgRef1}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img src={unitParams.imgReal!==null ? 'data:image/png;base64,' + unitParams.imgReal : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={fileReal ? fileReal :noImage} width={100} height={100} alt="real image"/>
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
                                                                ref={imgRef1}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img src={unitParams.imgReal!==null ? 'data:image/png;base64,' + unitParams.imgReal : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={fileReal ? fileReal :noImage} width={100} height={100} alt="real image"/>
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
                                                                ref={imgRef1}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img src={unitParams.imgReal!==null ? 'data:image/png;base64,' + unitParams.imgReal : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={fileReal ? fileReal :noImage} width={100} height={100} alt="real image"/>
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
                                                                ref={imgRef1}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img src={unitParams.imgReal!==null ? 'data:image/png;base64,' + unitParams.imgReal : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={fileReal ? fileReal :noImage} width={100} height={100} alt="real image"/>
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
                                                                ref={imgRef1}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img src={unitParams.imgReal!==null ? 'data:image/png;base64,' + unitParams.imgReal : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={fileReal ? fileReal :noImage} width={100} height={100} alt="real image"/>
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
                                                                ref={imgRef1}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img src={unitParams.imgReal!==null ? 'data:image/png;base64,' + unitParams.imgReal : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={fileReal ? fileReal :noImage} width={100} height={100} alt="real image"/>
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
                                                                ref={imgRef1}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img src={unitParams.imgReal!==null ? 'data:image/png;base64,' + unitParams.imgReal : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={fileReal ? fileReal :noImage} width={100} height={100} alt="real image"/>
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
                                                                ref={imgRef1}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img src={unitParams.imgReal!==null ? 'data:image/png;base64,' + unitParams.imgReal : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={fileReal ? fileReal :noImage} width={100} height={100} alt="real image"/>
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
                                                                ref={imgRef1}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img src={unitParams.imgReal!==null ? 'data:image/png;base64,' + unitParams.imgReal : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={fileReal ? fileReal :noImage} width={100} height={100} alt="real image"/>
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
                                                        ref={imgRef1}
                                                        style={{ display: "none" }} />                                                     
                                        </Card>
                                    </Space>

                                    <Space direction="vertical">
                                        {imgRealEdit === true ?  
                                        <img src={unitParams.imgReal!==null ? 'data:image/png;base64,' + unitParams.imgReal : noImage} width={100} height={100} alt="real image" />
                                        : 
                                        <img src={fileReal ? fileReal :noImage} width={100} height={100} alt="real image"/>
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
                                                        ref={imgRef1}
                                                        style={{ display: "none" }} />                                                     
                                        </Card>
                                    </Space>

                                    <Space direction="vertical">
                                        {imgRealEdit === true ?  
                                        <img src={unitParams.imgReal!==null ? 'data:image/png;base64,' + unitParams.imgReal : noImage} width={100} height={100} alt="real image" />
                                        : 
                                        <img src={fileReal ? fileReal :noImage} width={100} height={100} alt="real image"/>
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
                                                        ref={imgRef1}
                                                        style={{ display: "none" }} />                                                     
                                        </Card>
                                    </Space>

                                    <Space direction="vertical">
                                        {imgRealEdit === true ?  
                                        <img src={unitParams.imgReal!==null ? 'data:image/png;base64,' + unitParams.imgReal : noImage} width={100} height={100} alt="real image" />
                                        : 
                                        <img src={fileReal ? fileReal :noImage} width={100} height={100} alt="real image"/>
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


                                        <Space direction="right">
                                            <Tooltip title="3D생성">
                                                    <Button
                                                        type="success"
                                                        onClick={handleThreed}
                                                        htmlType="submit"
                                                        loading={uploading}
                                                        style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                                        icon={<PlusOutlined />}
                                                    >
                                                        3D이미지생성
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
                                                                ref={imgRef1}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img src={unitParams.imgReal!==null ? 'data:image/png;base64,' + unitParams.imgReal : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={fileReal ? fileReal :noImage} width={100} height={100} alt="real image"/>
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
                                                                ref={imgRef1}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img src={unitParams.imgReal!==null ? 'data:image/png;base64,' + unitParams.imgReal : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={fileReal ? fileReal :noImage} width={100} height={100} alt="real image"/>
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
                                                                ref={imgRef1}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img src={unitParams.imgReal!==null ? 'data:image/png;base64,' + unitParams.imgReal : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={fileReal ? fileReal :noImage} width={100} height={100} alt="real image"/>
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
                                                                ref={imgRef1}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img src={unitParams.imgReal!==null ? 'data:image/png;base64,' + unitParams.imgReal : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={fileReal ? fileReal :noImage} width={100} height={100} alt="real image"/>
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
                                                                ref={imgRef1}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img src={unitParams.imgReal!==null ? 'data:image/png;base64,' + unitParams.imgReal : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={fileReal ? fileReal :noImage} width={100} height={100} alt="real image"/>
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
                                                                ref={imgRef1}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img src={unitParams.imgReal!==null ? 'data:image/png;base64,' + unitParams.imgReal : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={fileReal ? fileReal :noImage} width={100} height={100} alt="real image"/>
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
                                                                ref={imgRef1}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img src={unitParams.imgReal!==null ? 'data:image/png;base64,' + unitParams.imgReal : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={fileReal ? fileReal :noImage} width={100} height={100} alt="real image"/>
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
                                                                ref={imgRef1}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img src={unitParams.imgReal!==null ? 'data:image/png;base64,' + unitParams.imgReal : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={fileReal ? fileReal :noImage} width={100} height={100} alt="real image"/>
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
                                                                ref={imgRef1}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img src={unitParams.imgReal!==null ? 'data:image/png;base64,' + unitParams.imgReal : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={fileReal ? fileReal :noImage} width={100} height={100} alt="real image"/>
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
                                                                ref={imgRef1}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img src={unitParams.imgReal!==null ? 'data:image/png;base64,' + unitParams.imgReal : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={fileReal ? fileReal :noImage} width={100} height={100} alt="real image"/>
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
                                                                ref={imgRef1}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img src={unitParams.imgReal!==null ? 'data:image/png;base64,' + unitParams.imgReal : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={fileReal ? fileReal :noImage} width={100} height={100} alt="real image"/>
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
                                                                ref={imgRef1}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img src={unitParams.imgReal!==null ? 'data:image/png;base64,' + unitParams.imgReal : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={fileReal ? fileReal :noImage} width={100} height={100} alt="real image"/>
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
                                                                ref={imgRef1}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img src={unitParams.imgReal!==null ? 'data:image/png;base64,' + unitParams.imgReal : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={fileReal ? fileReal :noImage} width={100} height={100} alt="real image"/>
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
                                                                ref={imgRef1}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img src={unitParams.imgReal!==null ? 'data:image/png;base64,' + unitParams.imgReal : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={fileReal ? fileReal :noImage} width={100} height={100} alt="real image"/>
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
                                                                ref={imgRef1}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img src={unitParams.imgReal!==null ? 'data:image/png;base64,' + unitParams.imgReal : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={fileReal ? fileReal :noImage} width={100} height={100} alt="real image"/>
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
                                                                ref={imgRef1}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img src={unitParams.imgReal!==null ? 'data:image/png;base64,' + unitParams.imgReal : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={fileReal ? fileReal :noImage} width={100} height={100} alt="real image"/>
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
                                                                ref={imgRef1}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img src={unitParams.imgReal!==null ? 'data:image/png;base64,' + unitParams.imgReal : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={fileReal ? fileReal :noImage} width={100} height={100} alt="real image"/>
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
                                                                ref={imgRef1}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img src={unitParams.imgReal!==null ? 'data:image/png;base64,' + unitParams.imgReal : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={fileReal ? fileReal :noImage} width={100} height={100} alt="real image"/>
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
                                                                ref={imgRef1}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img src={unitParams.imgReal!==null ? 'data:image/png;base64,' + unitParams.imgReal : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={fileReal ? fileReal :noImage} width={100} height={100} alt="real image"/>
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
                                                                ref={imgRef1}
                                                                style={{ display: "none" }} />                                                     
                                                </Card>
                                            </Space>

                                            <Space direction="vertical">
                                                {imgRealEdit === true ?  
                                                <img src={unitParams.imgReal!==null ? 'data:image/png;base64,' + unitParams.imgReal : noImage} width={100} height={100} alt="real image" />
                                                : 
                                                <img src={fileReal ? fileReal :noImage} width={100} height={100} alt="real image"/>
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
            {/* 물품 이미지 추가 폼 Start */}
            <Drawer
                maskClosable={false}
                title={`물품 이미지 ${dataEdit === true ? '수정' : '추가'}`}
                onClose={onAddClose}
                open={open}
                width={500}
                style={{ top: '60px', zIndex: 888 }}
                extra={
                    <>
                        <Space>
                            <Tooltip title="취소" placement="bottom">
                                <Button onClick={onAddClose} style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}>
                                    취소
                                </Button>
                            </Tooltip>
                            {dataEdit === true ? (
                                <Tooltip title="수정" placement="bottom" color="#108ee9">
                                    <Button
                                        onClick={onUpdateSubmit}
                                        style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                        type="primary"
                                    >
                                        수정
                                    </Button>
                                </Tooltip>
                            ) : (
                                <Tooltip title="추가" placement="bottom" color="#108ee9">
                                    <Button
                                        onClick={onSaveSubmit}
                                        style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                        type="primary"
                                    >
                                        저장
                                    </Button>
                                </Tooltip>
                            )}
                            <Tooltip title="삭제">
                                <Button type="danger" onClick={onDelete} style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}>
                                    삭제
                                </Button>
                            </Tooltip>
                        </Space>
                    </>
                }
            >
                <MainCard>
                    <Form name="Unit_Add" layout="vertical" form={form}>
                        <Row gutter={16}>
                            <Col span={24}>

                                <Form.Item
                                    name="unitId"
                                    label="물품분류"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter Items Type'
                                        }
                                    ]}
                                >
                                    <Select
                                        //onChange={(e) => setUnitGroupCd(e.target.value)}
                                        //onChange={handleGroupUnit}
                                        onChange={(e) => setUnitParams({ ...unitParams, "unitGroupCd": e })}
                                        defaultValue = {()=>unitParams?.unitGroupCd}
                                        style={{
                                            width: '100%'
                                        }}
                                        options={[
                                            {
                                                value: 'G000001',
                                                label: '총기류'
                                            },
                                            {
                                                value: 'G000002',
                                                label: '폭발물류'
                                            },
                                            {
                                                value: 'G000003',
                                                label: '실탄류'
                                            },
                                            {
                                                value: 'G000004',
                                                label: '도검류'
                                            },
                                            {
                                                value: 'G000005',
                                                label: '일반무기류'
                                            },
                                            {
                                                value: 'G000006',
                                                label: '위장무기류'
                                            },
                                            {
                                                value: 'G000007',
                                                label: '공구/생활용품류'
                                            },
                                            {
                                                value: 'G000008',
                                                label: '인화성물질류'
                                            },
                                            {
                                                value: 'G000009',
                                                label: '위험물질류'
                                            },
                                            {
                                                value: 'G000010',
                                                label: '액체, 겔 물품류'
                                            },
                                            {
                                                value: 'G000011',
                                                label: '주류'
                                            },
                                            {
                                                value: 'G000012',
                                                label: '전기/전자제품류'
                                            },
                                            {
                                                value: 'G000013',
                                                label: '확인물품류'
                                            }
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '10px 0' }} />

                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="unitName"
                                    label="물품명칭"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter unitName Name'
                                        }
                                    ]}
                                >
                                    <Input
                                        type="text"
                                        name="unitName"                                    
                                        value={unitParams?.unitName}
                                        defaultValue={unitParams?.unitName}
                                        onChange={(e) => setUnitParams({ ...unitParams, "unitName": e.target.value })}
                                        style={{
                                            width: '100%'
                                        }}
                                        placeholder="Please Enter unitName Name"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="unitDesc"
                                    label="물품설명"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter unitDesc Name'
                                        }
                                    ]}
                                >
                                    <Input
                                        type="text"
                                        name="unitDesc"                                       
                                        value={unitParams?.unitDesc}
                                        defaultValue={unitParams?.unitDesc}
                                        onChange={(e) => setUnitParams({ ...unitParams, "unitDesc": e.target.value })}
                                        style={{
                                            width: '100%'
                                        }}
                                        placeholder="Please Enter unitDesc Name"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="useYn"
                                    label="사용 유무"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter useYn Name'
                                        }
                                    ]}
                                >
                                <Select
                                    defaultValue = {()=>unitParams?.useYn}
                                    onChange={(e) => setUnitParams({ ...unitParams, "useYn": e })}
                                    style={{
                                        width: '100%'
                                    }}
                                    options={[
                                        {
                                            value: 'Y',
                                            label: '사용'
                                        },
                                        {
                                            value: 'N',
                                            label: '미사용'
                                        },
                                    ]}
                                />    
                                </Form.Item>                            
                            </Col>
                        </Row>

                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="languageCode"
                                    label="언어 선택"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter languageCode'
                                        }
                                    ]}
                                >
                                <Select
                                    defaultValue={unitParams?.languageCode}
                                    onChange={(e) => setUnitParams({ ...unitParams, "languageCode": e })}
                                    style={{
                                        width: '100%'
                                    }}
                                    options={[
                                        {
                                            value: 'kor',
                                            label: '한국어'
                                        },
                                        {
                                            value: 'eng',
                                            label: '영어'
                                        },
                                    ]}
                                />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </MainCard>
            </Drawer>
            {/* 이미지 관리 추가 폼 End */}

            {/* 물품명칭 언어 추가 Modal Start */}
            <Modal
                open={unitLanguageModalOpen}
                onOk={Unit_LanguageOk}
                onCancel={Unit_LanguageCancel}
                title="물품명칭 언어 추가"
                width={450}
                style={{
                    left: 130,
                    zIndex: 999
                }}
                footer={[
                    <Button
                        type="primary"
                        onClick={Unit_LanguageCancel}
                        style={{ width: '100px', borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                    >
                        Close
                    </Button>
                ]}
            >
                <MainCard>
                    <Form layout="vertical" name="Unit_Language_Add" form={form} onFinish={Unit_LanguageAdd}>
                        <Form.Item>
                            <Row gutter={24} style={{ marginBottom: 10 }}>
                                <Col offset={19}>
                                    <Space>
                                        <Tooltip title="저장" placement="bottom" color="#108ee9">
                                            <Button
                                                style={{ borderRadius: '5px', boxShadow: '2px 3px 0px 0px #dbdbdb' }}
                                                type="primary"
                                                htmlType="submit"
                                            >
                                                저장
                                            </Button>
                                        </Tooltip>
                                    </Space>
                                </Col>
                            </Row>
                        </Form.Item>
                    </Form>
                </MainCard>
            </Modal>
            
            {/* 물품명칭 언어 추가 Modal End */}
            
        </>
    );
};
