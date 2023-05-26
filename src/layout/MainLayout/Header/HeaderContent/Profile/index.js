/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGetLoginInfoMutation } from '../../../../../hooks/api/MainManagement/MainManagement';
import { remove } from '../../../../../services/core/User/Token';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Avatar,
    Box,
    ButtonBase,
    CardContent,
    ClickAwayListener,
    Grid,
    IconButton,
    Paper,
    Popper,
    Stack,
    Tab,
    Tabs,
    Typography
} from '@mui/material';
import 'antd/dist/antd.css';
import { Modal, Tooltip } from 'antd';
// import { ExclamationCircleOutlined } from '@ant-design/icons';

// project import
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';
import ProfileTab from './ProfileTab';
import SettingTab from './SettingTab';

// 아바타 이미지
// import avatar1 from 'assets/images/users/avatar-1.png';
// import avatar2 from 'assets/images/users/avatar-2.png';
// import avatar3 from 'assets/images/users/avatar-3.png';
// import avatar4 from 'assets/images/users/avatar-4.png';
// 아이콘 이미지
import { ApiFilled, UserOutlined, LoginOutlined } from '@ant-design/icons';

// tab panel wrapper
function TabPanel({ children, value, index, ...other }) {
    return (
        <div role="tabpanel" hidden={value !== index} id={`profile-tabpanel-${index}`} aria-labelledby={`profile-tab-${index}`} {...other}>
            {value === index && children}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
};

function a11yProps(index) {
    return {
        id: `profile-tab-${index}`,
        'aria-controls': `profile-tabpanel-${index}`
    };
}

// ==============================|| HEADER CONTENT - PROFILE ||============================== //

const Profile = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const iconBackColorOpen = 'grey.300';
    const [getLoginInfo] = useGetLoginInfoMutation();

    // 모달창 세팅
    const [Modal_Out, setModal_Out] = useState(false);
    const [confirmLoading_Out, setConfirmLoading_Out] = useState(false);
    const [modalText_Out, setModalText_Out] = useState('로그아웃 하시겠습니까?');

    // 회원 정보 호출
    const [loginInfo, setLoginInfo] = useState({});
    const handleLoginInfo = async () => {
        const response = await getLoginInfo();
        setLoginInfo(response.data.RET_DATA);
    };

    // 로그아웃 처리
    const handleLogout = async () => {
        // setModalText_Out('로그아웃 완료!');
        setConfirmLoading_Out(true);
        setTimeout(() => {
            setModal_Out(false);
            setConfirmLoading_Out(false);
            remove();
            window.sessionStorage.removeItem('firstLoad');
            navigate('/login');
        }, 1000);
    };

    // 로그아웃 취소
    const handleCancel = () => {
        // console.log('로그아웃 취소');
        setModal_Out(false);
    };

    const anchorRef = useRef(null);
    const [open, setOpen] = useState(false);
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        handleLoginInfo();
    }, []);

    return (
        <Box sx={{ flexShrink: 0, ml: 0.75 }}>
            {loginInfo && loginInfo ? (
                <>
                    <ButtonBase
                        sx={{
                            p: 0.25,
                            bgcolor: open ? iconBackColorOpen : 'transparent',
                            borderRadius: 1,
                            '&:hover': { bgcolor: 'secondary.lighter' }
                        }}
                        aria-label="open profile"
                        ref={anchorRef}
                        aria-controls={open ? 'profile-grow' : undefined}
                        aria-haspopup="true"
                        onClick={handleToggle}
                    >
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 0.5 }}>
                            {/* <Avatar alt="profile user" src={avatar4} sx={{ width: 32, height: 32 }} /> */}
                            <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                            <Typography variant="subtitle1">{loginInfo.userNm}</Typography>
                        </Stack>
                    </ButtonBase>

                    <Popper
                        placement="bottom-end"
                        open={open}
                        anchorEl={anchorRef.current}
                        role={undefined}
                        transition
                        disablePortal
                        popperOptions={{
                            modifiers: [
                                {
                                    name: 'offset',
                                    options: {
                                        offset: [0, 9]
                                    }
                                }
                            ]
                        }}
                    >
                        {({ TransitionProps }) => (
                            <Transitions type="fade" in={open} {...TransitionProps}>
                                {open && (
                                    <Paper
                                        sx={{
                                            boxShadow: theme.customShadows.z1,
                                            width: 290,
                                            minWidth: 240,
                                            maxWidth: 290,
                                            [theme.breakpoints.down('md')]: {
                                                maxWidth: 250
                                            }
                                        }}
                                    >
                                        <ClickAwayListener onClickAway={handleClose}>
                                            <MainCard elevation={0} border={false} content={false}>
                                                <CardContent sx={{ px: 2.5, pt: 3 }}>
                                                    <Grid container justifyContent="space-between" alignItems="center">
                                                        <Grid item>
                                                            <Stack direction="row" spacing={1.25} alignItems="center">
                                                                <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                                                                <Stack>
                                                                    <Typography variant="h6">{loginInfo.userNm}</Typography>
                                                                    <Typography variant="body2" color="textSecondary">
                                                                        {loginInfo.userId}
                                                                    </Typography>
                                                                </Stack>
                                                            </Stack>
                                                        </Grid>
                                                        <Grid item>
                                                            <IconButton onClick={() => setModal_Out(true)}>
                                                                <ApiFilled style={{ fontSize: '18px', color: 'hotpink' }} />
                                                            </IconButton>
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                                {open && (
                                                    <>
                                                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                                            <Tabs
                                                                variant="fullWidth"
                                                                value={value}
                                                                onChange={handleChange}
                                                                aria-label="profile tabs"
                                                            >
                                                                <Tab
                                                                    sx={{
                                                                        display: 'flex',
                                                                        flexDirection: 'row',
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center',
                                                                        textTransform: 'capitalize'
                                                                    }}
                                                                    icon={
                                                                        <UserOutlined
                                                                            style={{
                                                                                fontSize: '18px',
                                                                                marginRight: '10px',
                                                                                marginButtom: '0'
                                                                            }}
                                                                        />
                                                                    }
                                                                    label="Profile"
                                                                    {...a11yProps(0)}
                                                                />
                                                                {/* <Tab
                                                                    sx={{
                                                                        display: 'flex',
                                                                        flexDirection: 'row',
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center',
                                                                        textTransform: 'capitalize'
                                                                    }}
                                                                    icon={
                                                                        <SettingOutlined style={{ marginBottom: 0, marginRight: '10px' }} />
                                                                    }
                                                                    label="Setting"
                                                                    {...a11yProps(1)}
                                                                /> */}
                                                            </Tabs>
                                                        </Box>
                                                        <TabPanel value={value} index={0} dir={theme.direction}>
                                                            <ProfileTab handleLogout={() => setModal_Out(true)} />
                                                        </TabPanel>
                                                        <TabPanel value={value} index={1} dir={theme.direction}>
                                                            <SettingTab />
                                                        </TabPanel>
                                                    </>
                                                )}
                                            </MainCard>
                                        </ClickAwayListener>
                                    </Paper>
                                )}
                            </Transitions>
                        )}
                    </Popper>
                </>
            ) : (
                <span>
                    <Tooltip title="로그인" color="#2db7f5" key="#2db7f5">
                        <IconButton style={{ fontSize: '20px' }}>
                            <Link to="/login">
                                <LoginOutlined />
                            </Link>
                        </IconButton>
                    </Tooltip>
                </span>
            )}
            <Modal title="알림" open={Modal_Out} onOk={handleLogout} confirmLoading={confirmLoading_Out} onCancel={handleCancel}>
                <p>{modalText_Out}</p>
            </Modal>
        </Box>
    );
};

export default Profile;
