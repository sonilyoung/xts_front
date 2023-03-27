/* eslint-disable no-unused-vars */
// material-ui
import { Stack } from '@mui/material';

// project import
import MainCard from 'components/MainCard';

// assets
// import avatar from 'assets/images/users/avatar-group.png';
import AnimateButton from 'components/@extended/AnimateButton';

// ==============================|| DRAWER CONTENT - NAVIGATION CARD ||============================== //

const NavCard = () => (
    <MainCard sx={{ bgcolor: 'grey.50', m: 0 }} style={{ border: '0', borderRadius: '0', borderColor: '#ffffff', color: '#7f8083' }}>
        <Stack alignItems="center">
            {/* <CardMedia component="img" image={avatar} sx={{ width: 112 }} />
            <Stack alignItems="center">
                <Typography variant="h5">Jun Project</Typography>
                <Typography variant="h6" color="secondary">
                    Checkout Jun features
                </Typography>
            </Stack> */}
            <AnimateButton>JUN Copyright @2023 </AnimateButton>
        </Stack>
    </MainCard>
);

export default NavCard;
