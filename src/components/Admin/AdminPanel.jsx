import { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Badge, Card, Row, Col, Statistic, Table, Tag, Button, Input, Space, Popconfirm, Tabs, message, Select, Form, Modal, Descriptions } from 'antd';
import { 
  DashboardOutlined, UserOutlined, DatabaseOutlined, DollarOutlined, 
  LogoutOutlined, SearchOutlined, EditOutlined, DeleteOutlined, 
  CheckCircleOutlined, CloseCircleOutlined, FileSearchOutlined,
  LineChartOutlined, SecurityScanOutlined, FileTextOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { TabPane } = Tabs;
const { Option } = Select;

// === DỮ LIỆU MẪU ===
const stats = {
  users: 1234, datasets: 567, revenue: 28400000, pending: 23
};

const users = [
  { id: 1, name: "Nguyễn Văn A", email: "a@example.com", role: "User", org: "Cá nhân", status: "Active" },
  { id: 2, name: "VinData Co.", email: "vin@data.com", role: "Provider", org: "VinData Co.", status: "Verified" },
  { id: 3, name: "EV Tech", email: "ev@tech.com", role: "Provider", org: "EV Tech", status: "Pending" },
];

const pendingDatasets = [
  { id: 1, title: "Hành vi lái xe #12", provider: "VinData Co.", versionId: "v1", detail: "500 xe, 6 tháng" },
  { id: 2, title: "Pin VF8", provider: "EV Tech", versionId: "v2", detail: "1000 mẫu pin" },
];

const popularDatasets = [
  { id: 1, title: "Hành vi lái xe Q3", downloads: 245, revenue: 850000 },
  { id: 2, title: "Sạc công cộng", downloads: 189, revenue: 680000 },
];

const paymentPending = [
  { id: 1, provider: "VinData Co.", amount: 1840000, status: "Pending" },
];

const policies = [
  { id: 1, title: "Chính sách bảo mật", content: "Dữ liệu người dùng được mã hóa..." },
];

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchText, setSearchText] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // === DROPDOWN ADMIN ===
  const adminMenu = (
    <Menu>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={() => {
        localStorage.clear();
        navigate('/login');
      }}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  // === SIDEBAR MENU ===
  const menuItems = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: 'Tổng quan' },
    { key: 'users', icon: <UserOutlined />, label: 'User & Role & Org' },
    { key: 'moderation', icon: <FileSearchOutlined />, label: 'Moderation' },
    { key: 'analytics', icon: <LineChartOutlined />, label: 'Analytics' },
    { key: 'payment', icon: <DollarOutlined />, label: 'Payment' },
    { key: 'policy', icon: <SecurityScanOutlined />, label: 'Policy & Security' },
  ];

  // === RENDER THEO TAB ===
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <h2 className="mb-4 fw-bold">Tổng quan hệ thống</h2>
            <Row gutter={16} className="mb-5">
              <Col xs={12} md={6}><Card><Statistic title="Người dùng" value={stats.users} prefix={<UserOutlined />} /></Card></Col>
              <Col xs={12} md={6}><Card><Statistic title="Dataset" value={stats.datasets} prefix={<DatabaseOutlined />} /></Card></Col>
              <Col xs={12} md={6}><Card><Statistic title="Doanh thu" value={stats.revenue} prefix="₫" valueStyle={{ color: '#22c55e' }} /></Card></Col>
              <Col xs={12} md={6}><Card><Statistic title="Chờ duyệt" value={stats.pending} valueStyle={{ color: '#f59e0b' }} /></Card></Col>
            </Row>
            <Card title="Dataset nổi bật">
              <Table dataSource={popularDatasets} columns={[
                { title: 'Tên', dataIndex: 'title' },
                { title: 'Tải xuống', dataIndex: 'downloads' },
                { title: 'Doanh thu', dataIndex: 'revenue', render: v => `${(v/1000).toFixed(0)}K ₫` },
              ]} pagination={false} />
            </Card>
          </>
        );

      case 'users':
        return (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="fw-bold">User, Role & Organization</h2>
              <Input prefix={<SearchOutlined />} placeholder="Tìm kiếm..." onChange={e => setSearchText(e.target.value)} style={{ width: 300 }} />
            </div>
            <Table
              dataSource={users.filter(u => u.name.toLowerCase().includes(searchText.toLowerCase()) || u.email.includes(searchText))}
              columns={[
                { title: 'Tên', dataIndex: 'name' },
                { title: 'Email', dataIndex: 'email' },
                { title: 'Vai trò', dataIndex: 'role', render: r => <Tag color={r === 'Provider' ? 'blue' : 'green'}>{r}</Tag> },
                { title: 'Tổ chức', dataIndex: 'org' },
                { title: 'Trạng thái', dataIndex: 'status', render: s => <Tag color={s === 'Active' ? 'green' : s === 'Verified' ? 'blue' : 'orange'}>{s}</Tag> },
                {
                  title: '',
                  render: (_, record) => (
                    <Space>
                      <Button size="small" icon={<EditOutlined />} onClick={() => {
                        setSelectedUser(record);
                        setIsModalOpen(true);
                      }} />
                      {record.status === 'Pending' && (
                        <Button size="small" type="primary" onClick={() => message.success('Đã xác minh!')}>Xác minh</Button>
                      )}
                    </Space>
                  )
                },
              ]}
            />
            <Modal title="Chỉnh sửa User/Role/Org" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
              {selectedUser && (
                <Form layout="vertical">
                  <Form.Item label="Vai trò">
                    <Select defaultValue={selectedUser.role}>
                      <Option value="User">User</Option>
                      <Option value="Provider">Provider</Option>
                      <Option value="Admin">Admin</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="Tổ chức">
                    <Input defaultValue={selectedUser.org} />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary">Lưu</Button>
                  </Form.Item>
                </Form>
              )}
            </Modal>
          </>
        );

      case 'moderation':
        return (
          <>
            <h2 className="mb-4 fw-bold">Moderation</h2>
            <Tabs defaultActiveKey="pending">
              <TabPane tab="Chờ duyệt" key="pending">
                <Table dataSource={pendingDatasets} columns={[
                  { title: 'Tên dataset', dataIndex: 'title' },
                  { title: 'Provider', dataIndex: 'provider' },
                  { title: 'Phiên bản', dataIndex: 'versionId' },
                  { title: 'Chi tiết', dataIndex: 'detail' },
                  {
                    title: 'Hành động',
                    render: () => (
                      <Space>
                        <Button size="small" type="primary" icon={<CheckCircleOutlined />} onClick={() => message.success('Đã duyệt!')}>Duyệt</Button>
                        <Button size="small" danger icon={<CloseCircleOutlined />} onClick={() => message.error('Đã từ chối!')}>Từ chối</Button>
                      </Space>
                    )
                  },
                ]} />
              </TabPane>
            </Tabs>
          </>
        );

      case 'analytics':
        return (
          <>
            <h2 className="mb-4 fw-bold">Analytics</h2>
            <Card title="Báo cáo xu hướng">
              <p className="text-center py-5 text-muted">Biểu đồ xu hướng (API: /api/Analytics/trend-reports)</p>
            </Card>
            <Card title="Dự báo nhu cầu" className="mt-4">
              <p className="text-center py-5 text-muted">Biểu đồ dự báo (API: /api/Analytics/forecast/demand)</p>
            </Card>
          </>
        );

      case 'payment':
        return (
          <>
            <h2 className="mb-4 fw-bold">Payment</h2>
            <Table dataSource={paymentPending} columns={[
              { title: 'Provider', dataIndex: 'provider' },
              { title: 'Số tiền', dataIndex: 'amount', render: v => `${(v/1000).toFixed(0)}K ₫` },
              { title: 'Trạng thái', dataIndex: 'status', render: () => <Tag color="orange">Chờ xử lý</Tag> },
              {
                title: '',
                render: () => (
                  <Button type="primary" size="small" onClick={() => message.success('Đã phân phối!')}>Phân phối</Button>
                )
              },
            ]} />
          </>
        );

      case 'policy':
        return (
          <>
            <h2 className="mb-4 fw-bold">Policy & Security</h2>
            <Tabs defaultActiveKey="policy">
              <TabPane tab="Chính sách" key="policy">
                <Table dataSource={policies} columns={[
                  { title: 'Tiêu đề', dataIndex: 'title' },
                  { title: 'Nội dung', dataIndex: 'content', render: c => c.substring(0, 50) + '...' },
                  {
                    title: '',
                    render: () => (
                      <Space>
                        <Button size="small" icon={<EditOutlined />} />
                        <Popconfirm title="Xóa chính sách?" okText="Xóa">
                          <Button size="small" danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                      </Space>
                    )
                  },
                ]} />
                <Button type="primary" className="mt-3">Thêm chính sách</Button>
              </TabPane>
              <TabPane tab="Security" key="security">
                <Card title="API Key Management">
                  <p>GET /api/Security → Liệt kê key</p>
                  <Button danger className="mt-2" onClick={() => message.success('Đã thu hồi key!')}>Thu hồi key</Button>
                </Card>
              </TabPane>
            </Tabs>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* SIDEBAR */}
      <Sider width={240} className="bg-white shadow-sm">
        <div className="p-4 text-center">
          <div style={{ fontSize: '2rem', color: '#dc3545' }}>A</div>
          <h3 className="mt-2 fw-bold text-danger">Admin Panel</h3>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[activeTab]}
          onClick={(e) => setActiveTab(e.key)}
          items={menuItems}
          style={{ borderRight: 0 }}
        />
      </Sider>

      {/* MAIN */}
      <Layout>
        <Header className="bg-white shadow-sm d-flex justify-content-end align-items-center px-4">
          <Dropdown overlay={adminMenu} trigger={['click']}>
            <div className="d-flex align-items-center cursor-pointer">
              <Badge dot>
                <Avatar shape="circle" size={40} style={{ backgroundColor: '#dc3545' }}>AD</Avatar>
              </Badge>
              <span className="ms-2 fw-bold">Admin</span>
            </div>
          </Dropdown>
        </Header>
        <Content className="p-5 bg-light">
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
}