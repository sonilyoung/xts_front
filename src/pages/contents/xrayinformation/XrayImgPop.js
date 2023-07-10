/* eslint-disable*/
import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';
// assets
import { SearchOutlined } from '@ant-design/icons';
// material-ui
import { Box, FormControl, InputAdornment, OutlinedInput } from '@mui/material';
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
    Skeleton
} from 'antd';
// project import
import MainCard from 'components/MainCard';

export const XrayImgPop = (popupimg) => {
   return (
      <>
         <MainCard>
            <Form layout="vertical" name="Unit_Language_Add">
                  <Form.Item>
                     <Row >
                        <Col style={{ textAlign: 'center', padding: '0 10px' }}>
                              <img src={'data:image/png;base64,'+ popupimg} />
                        </Col>
                     </Row>
                  </Form.Item>
            </Form>
         </MainCard>
      </>
   );
};