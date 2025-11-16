import { Layout, Menu, Avatar, Dropdown, Badge } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { ShopOutlined, DashboardOutlined, UploadOutlined, DatabaseOutlined, DollarOutlined, LogoutOutlined } from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

export default function ProviderLayout({ children }) {
  const navigate = useNavigate();

  const menu = (
    <Menu>
      <Menu.Item key="profile">Hồ sơ</Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={() => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
      }}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={240} className="bg-white shadow-sm">
        <div className="p-4 text-center">
          <ShopOutlined style={{ fontSize: '2.5rem', color: '#22c55e' }} />
          <h3 className="mt-2 fw-bold">Data Provider</h3>
        </div>
        <Menu mode="inline" defaultSelectedKeys={['dashboard']} style={{ borderRight: 0 }}>
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
            <Link to="/provider/dashboard">Tổng quan</Link>
          </Menu.Item>
          <Menu.Item key="upload" icon={<UploadOutlined />}>
            <Link to="/provider/upload">Đăng tải</Link>
          </Menu.Item>
          <Menu.Item key="datasets" icon={<DatabaseOutlined />}>
            <Link to="/provider/datasets">Quản lý</Link>
          </Menu.Item>
          <Menu.Item key="revenue" icon={<DollarOutlined />}>
            <Link to="/provider/revenue">Doanh thu</Link>
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Header className="bg-white shadow-sm d-flex justify-content-end align-items-center px-4">
          <Dropdown overlay={menu} trigger={['click']}>
            <div className="d-flex align-items-center cursor-pointer">
              <Badge count={2} size="small">
                <Avatar shape="circle" size={40} style={{ backgroundColor: '#22c55e' }}>
                  VD
                </Avatar>
              </Badge>
              <span className="ms-2 fw-bold">VinData Co.</span>
            </div>
          </Dropdown>
        </Header>
        <Content className="p-5 bg-light">{children}</Content>
      </Layout>
    </Layout>
  );
}