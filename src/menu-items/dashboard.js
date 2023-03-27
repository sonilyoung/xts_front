// assets
import { DashboardOutlined } from '@ant-design/icons';

// icons
const icons = {
    DashboardOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
    id: 'group-dashboard',
    title: 'Navigation',
    type: 'group',
    children: [
        {
            id: '',
            title: '',
            type: 'item',
            url: '/',
            icon: icons.DashboardOutlined,
            breadcrumbs: true
        },
        {
            id: 'dashboard',
            title: '',
            type: 'item',
            url: '/dashboard',
            icon: icons.DashboardOutlined,
            breadcrumbs: true
        }
    ]
};

export default dashboard;
