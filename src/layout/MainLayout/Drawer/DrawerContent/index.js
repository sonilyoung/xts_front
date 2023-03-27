/* eslint-disable no-unused-vars */
// project import
// import NavCard from './NavCard';
import LeftMenus from './LeftMenus/LeftMenus';
import SimpleBar from 'components/third-party/SimpleBar';

// ==============================|| DRAWER CONTENT ||============================== //
const DrawerContent = () => (
    <SimpleBar
        sx={{
            '& .simplebar-content': {
                display: 'flex',
                flexDirection: 'column',
                bgcolor: '#001529'
            }
        }}
    >
        <LeftMenus />
        {/* <NavCard /> */}
    </SimpleBar>
);

export default DrawerContent;
