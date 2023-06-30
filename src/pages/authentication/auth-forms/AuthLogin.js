/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Modal, message } from 'antd';

// material-ui
import {
    Button,
    Checkbox,
    FormControlLabel,
    FormHelperText,
    Grid,
    Link,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
    Typography
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import { EyeOutlined, EyeInvisibleOutlined, PoweroffOutlined } from '@ant-design/icons';

// 토큰
import { useUserToken } from '../../../hooks/core/UserToken';
import { useLoginMutation } from '../../../hooks/api/LoginManagement/LoginManagement';
// ============================|| FIREBASE - LOGIN ||============================ //

const AuthLogin = () => {
    // 아이디 저장 및 체크
    const LS_KEY_ID = 'LS_KEY_ID';
    const LS_KEY_SAVE_ID_FLAG = 'LS_KEY_SAVE_ID_FLAG';
    const navigate = useNavigate();
    const [valueId, setValueId] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const [saveIDFlag, setSaveIDFlag] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    // 로그인 토큰 정보
    const [userToken] = useUserToken();

    // 로그인 api 정보
    const [login] = useLoginMutation();

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    // 아이디 저장
    const handleSaveIDFlag = (e) => {
        if (e.target.checked === false) {
            setValueId('');
        }
        localStorage.setItem(LS_KEY_SAVE_ID_FLAG, !saveIDFlag);
        setSaveIDFlag(!saveIDFlag);
    };

    const handleLogin = async (values) => {
        const userLoginResponse = await login({
            loginId: values.Adminid,
            loginPw: values.Password
        });

        if (userLoginResponse.data.RET_CODE === '0000') {
            const jwtToken = userLoginResponse.data.RET_DATA.accessToken;
            userToken.setItem(jwtToken);
            localStorage.setItem('LoginId', values.Adminid);

            if (true) {
                if (saveIDFlag) localStorage.setItem(LS_KEY_ID, values.Adminid);
            }

            messageApi.open({
                type: 'success',
                content: values.Adminid + '님 로그인 했습니다.'
            });

            setTimeout(() => {
                navigate('/');
            }, 1000);

            // Modal.success({
            //     content: values.Adminid + ' .',
            //     onOk() {
            //         navigate('/');
            //     }
            // });
        } else {
            Modal.error({ title: 'Error', content: '로그인에 실패하였습니다.' });
        }
    };

    useEffect(() => {
        let idFlag = JSON.parse(localStorage.getItem(LS_KEY_SAVE_ID_FLAG));
        if (idFlag !== null) setSaveIDFlag(idFlag);
        if (idFlag === false) localStorage.setItem(LS_KEY_ID, '');
        let data = localStorage.getItem(LS_KEY_ID);
        if (data !== null) setValueId(data);
    }, []);

    return (
        <div>
            {contextHolder}
            <Formik
                initialValues={{
                    Adminid: localStorage.getItem(LS_KEY_SAVE_ID_FLAG) === 'false' ? '' : localStorage.getItem(LS_KEY_ID),
                    Password: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    Adminid: Yup.string().required('아이디를 입력해주세요.').min(4, '4자 이상 입력해주세요!'),
                    Password: Yup.string().required('비밀번호를 입력해주세요.').min(4, '4자 이상 입력해주세요!')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        setStatus({ success: true });
                        setSubmitting(true);
                        handleLogin(values);
                    } catch (err) {
                        setStatus({ success: false });
                        setErrors({ submit: err.message });
                        setSubmitting(false);
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Stack spacing={2}>
                                    <InputLabel htmlFor="Adminid-login">아이디</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.id && errors.id)}
                                        id="Adminid-login"
                                        type="Adminid"
                                        value={values.id}
                                        name="Adminid"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="Enter Adminid"
                                    />
                                    {touched.Adminid && errors.Adminid && (
                                        <FormHelperText error Adminid="standard-weight-helper-text-id-login">
                                            {errors.Adminid}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack spacing={2}>
                                    <InputLabel htmlFor="Password-login">비밀번호</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.Password && errors.Password)}
                                        id="Password-login"
                                        type={showPassword ? 'text' : 'Password'}
                                        value={values.Password}
                                        name="Password"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="Enter Password"
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle Password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                    size="large"
                                                >
                                                    {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                    {touched.Password && errors.Password && (
                                        <FormHelperText error id="standard-weight-helper-text-Password-login">
                                            {errors.Password}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>

                            <Grid item xs={12} sx={{ mt: -1 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={saveIDFlag}
                                                onChange={handleSaveIDFlag}
                                                name="saveId"
                                                id="saveId"
                                                color="primary"
                                                size="small"
                                            />
                                        }
                                        label={<Typography variant="h6">아이디 저장</Typography>}
                                    />
                                    <Link variant="h6" component={RouterLink} to="" color="text.primary">
                                        비밀번호를 잊으 셨나요?
                                    </Link>
                                </Stack>
                            </Grid>
                            {errors.submit && (
                                <Grid item xs={12}>
                                    <FormHelperText error>{errors.submit}</FormHelperText>
                                </Grid>
                            )}
                            <Grid item xs={12}>
                                <AnimateButton>
                                    <Button
                                        fullWidth
                                        icon={<PoweroffOutlined />}
                                        size="large"
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                    >
                                        로그인
                                    </Button>
                                </AnimateButton>
                            </Grid>
                        </Grid>
                    </form>
                )}
            </Formik>
        </div>
    );
};

export default AuthLogin;
