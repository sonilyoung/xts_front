/* eslint-disable no-unused-vars */
import { Link, useNavigate } from 'react-router-dom';
import cookies from 'react-cookies';
import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Stack } from '@mui/material';

// project import
import DrawerHeaderStyled from './DrawerHeaderStyled';
// import Logo from 'components/Logo';

// ==============================|| DRAWER HEADER 로고 ||============================== //

const DrawerHeader = ({ open }) => {
    const navigate = useNavigate();
    const theme = useTheme();

    const DashCall = () => {
        cookies.save('defaultSelectedKey', '');
        cookies.save('defaultOpenKey', '');
        cookies.save('defaultOpenKeySub', '');
        navigate('/');
    };

    return (
        <DrawerHeaderStyled theme={theme} open={open} sx={{ marginLeft: '20px' }}>
            <Stack direction="row" spacing={1} alignItems="center" onClick={DashCall}>
                {/* <Logo /> */}
                <Link to="">
                    <div style={{ textAlign: 'center', fontSize: '18px' }}>XBT ADMINISTRATOR</div>
                    <div style={{ textAlign: 'center', fontSize: '12px', color: '#999' }}>X-ray Based Training System</div>
                </Link>
            </Stack>
        </DrawerHeaderStyled>
    );
};

DrawerHeader.propTypes = {
    open: PropTypes.bool
};
export default DrawerHeader;
