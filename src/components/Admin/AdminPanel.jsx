import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Layout, Menu, Avatar, Dropdown, Badge, Card, Row, Col, Statistic,
  Table, Tag, Button, Input, Space, Popconfirm, Tabs, message,
  Select, Form, Modal, Spin, Alert
} from 'antd';
import {
  DashboardOutlined, UserOutlined, DatabaseOutlined, DollarOutlined,
  LogoutOutlined, SearchOutlined, EditOutlined, DeleteOutlined,
  CheckCircleOutlined, CloseCircleOutlined, FileSearchOutlined,
  LineChartOutlined, SecurityScanOutlined, CheckCircleFilled
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

// Toastify
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { Header, Sider, Content } = Layout;
const { Option } = Select;

// DUY NHẤT 1 BIẾN API_BASE – THEO YÊU CẦU CỦA BẠN
const API_BASE = 'http://localhost:8000/api/admin/api';

const ENDPOINTS = {
  popularDatasets: `${API_BASE}/Analytics/popular-datasets`,
  users: `${API_BASE}/User/users`,
  pendingDatasets: `${API_BASE}/Moderation/pending-datasets`,
  trendReports: `${API_BASE}/Analytics/trend-reports`,
  forecastDemand: `${API_BASE}/Analytics/forecast/demand`,
  paymentPending: `${API_BASE}/Payment/pending`,
  policies: `${API_BASE}/Policy`,
  securityKeys: `${API_BASE}/Security`,
};

// MOCK DATA
const MOCK_PENDING_DATASETS = [
  { datasetId: "mock-001", title: "EV Charging Patterns - Hanoi 2025", providerName: "Hanoi Power Corp", uploadedAt: "2025-11-16T10:00:00" },
  { datasetId: "mock-002", title: "Battery Health Dataset - VinFast", providerName: "VinFast Analytics", uploadedAt: "2025-11-15T14:30:00" }
];

const MOCK_FORECAST = {
  growthRate: "+12.3%",
  peakHours: ["18:00", "19:00", "20:00"],
  next30Days: [
    { date: "2025-11-18", demand: 1320 },
    { date: "2025-11-19", demand: 1400 },
    { date: "2025-11-20", demand: 1380 },
    { date: "2025-11-21", demand: 1450 },
    { date: "2025-11-22", demand: 1520 },
  ]
};

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchText, setSearchText] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Data states
  const [stats, setStats] = useState({ users: 0, datasets: 0, revenue: 0, pending: 0 });
  const [users, setUsers] = useState([]);
  const [pendingDatasets, setPendingDatasets] = useState([]);
  const [popularDatasets, setPopularDatasets] = useState([]);
  const [trendReports, setTrendReports] = useState([]);
  const [forecastDemand, setForecastDemand] = useState(null);
  const [paymentPending, setPaymentPending] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [securityKeys, setSecurityKeys] = useState([]);
  const [loading, setLoading] = useState({});

  // Refresh functions
  const refreshPendingDatasets = async () => {
    try {
      const res = await axios.get(ENDPOINTS.pendingDatasets);
      const data = res.data && res.data.length > 0 ? res.data : MOCK_PENDING_DATASETS;
      setPendingDatasets(data.map((d, i) => ({ ...d, key: d.datasetId || `mock-${i}` })));
    } catch {
      setPendingDatasets(MOCK_PENDING_DATASETS.map(d => ({ ...d, key: d.datasetId })));
    }
  };

  const refreshUsers = async () => {
    try {
      const res = await axios.get(ENDPOINTS.users);
      setUsers((res.data || []).map(u => ({
        ...u,
        key: u.userId,
        name: u.displayName || u.email || 'N/A',
        role: (u.roles || ['consumer'])[0]?.toLowerCase() || 'consumer',
        organizationVerified: u.organizationVerified || u.isVerified || false
      })));
    } catch (err) {
      console.error('Lỗi tải users:', err);
    }
  };

  const refreshPayments = async () => {
    try {
      const res = await axios.get(ENDPOINTS.paymentPending);
      setPaymentPending((res.data || []).map(p => ({ ...p, key: p.paymentId })));
    } catch {}
  };

  const refreshPolicies = async () => {
    try {
      const res = await axios.get(ENDPOINTS.policies);
      setPolicies((res.data || []).map(p => ({ ...p, key: p.accessPolicyId || p.policyId })));
    } catch {}
  };

  const refreshSecurityKeys = async () => {
    try {
      const res = await axios.get(ENDPOINTS.securityKeys);
      setSecurityKeys((res.data || []).map(k => ({ ...k, key: k.apiKeyId })));
    } catch {}
  };

  useEffect(() => {
    setLoading(prev => ({ ...prev, [activeTab]: true }));
    const load = async () => {
      if (activeTab === 'dashboard') {
        try {
          const [popRes, pendRes] = await Promise.all([
            axios.get(ENDPOINTS.popularDatasets),
            axios.get(ENDPOINTS.pendingDatasets).catch(() => ({ data: [] }))
          ]);
          const pop = popRes.data || [];
          setPopularDatasets(pop.map((d, i) => ({ ...d, key: d.datasetId || i })));
          setStats(prev => ({
            ...prev,
            pending: (pendRes.data?.length || MOCK_PENDING_DATASETS.length)
          }));
        } catch {}
      }
      if (activeTab === 'users') refreshUsers();
      if (activeTab === 'moderation') refreshPendingDatasets();
      if (activeTab === 'payment') refreshPayments();
      if (activeTab === 'policy') {
        refreshPolicies();
        refreshSecurityKeys();
      }
      setLoading(prev => ({ ...prev, [activeTab]: false }));
    };
    load();
  }, [activeTab]);

  // ACTION HANDLERS
  const handleApproveDataset = async (record) => {
    if (record.datasetId?.startsWith('mock')) return toast.info('Demo data');
    try {
      await axios.post(`${API_BASE}/Moderation/approve/${record.datasetId}`);
      toast.success('Duyệt dataset thành công!');
      refreshPendingDatasets();
    } catch (err) {
      toast.error('Lỗi duyệt dataset');
    }
  };

  const handleRejectDataset = async (record) => {
    if (record.datasetId?.startsWith('mock')) return;
    try {
      await axios.post(`${API_BASE}/Moderation/reject/${record.datasetId}`);
      toast.success('Từ chối thành công!');
      refreshPendingDatasets();
    } catch {
      toast.error('Lỗi từ chối');
    }
  };

  const handleUpdateUserRole = async (values) => {
    if (!selectedUser?.userId) {
      toast.error('Không có User ID');
      return;
    }

    // ✅ Mapping đúng theo swagger: roleIds là array of integers
    const roleMap = { 
      consumer: 3,  // ID 3
      provider: 2,  // ID 2
      admin: 1      // ID 1
    };

    try {
      const url = `${API_BASE}/User/users/${selectedUser.userId}/roles`;
      const payload = {
        roleIds: [roleMap[values.role]]  // ✅ Array of integers
      };

      console.log('Updating role:', { url, payload });
      
      const response = await axios.put(url, payload);
      console.log('Success:', response.data);
      
      toast.success('Cập nhật vai trò thành công!');
      setIsModalOpen(false);
      refreshUsers();
    } catch (err) {
      console.error('Chi tiết lỗi:', {
        status: err.response?.status,
        message: err.response?.data?.message || err.message,
        data: err.response?.data,
        url: err.config?.url,
        payload: err.config?.data,
      });
      
      toast.error(`Lỗi cập nhật: ${err.response?.data?.message || err.message}`);
    }
  };

  // XÁC MINH TỔ CHỨC – CÓ TOAST + ĐỔI ICON
  const handleVerifyOrg = async (organizationId, userId) => {
    if (!organizationId) return toast.warning('Không có Organization ID');

    try {
      await axios.post(`${API_BASE}/User/organizations/${organizationId}/verify`);
      
      toast.success('Xác minh tổ chức thành công!', {
        icon: <CheckCircleFilled style={{ color: '#52c41a' }} />,
      });

      // Cập nhật ngay state → đổi nút thành icon verified
      setUsers(prev => prev.map(u => 
        u.userId === userId ? { ...u, organizationVerified: true } : u
      ));

    } catch (err) {
      toast.error('Xác minh thất bại: ' + (err.response?.data?.message || 'Lỗi hệ thống'));
    }
  };

  const handleDistributePayment = async (paymentId) => {
    try {
      await axios.post(`${API_BASE}/Payment/distribute/${paymentId}`);
      toast.success('Phân phối tiền thành công!');
      refreshPayments();
    } catch {
      toast.error('Lỗi phân phối');
    }
  };

  const handleDeletePolicy = async (policyId) => {
    try {
      await axios.delete(`${API_BASE}/Policy/${policyId}`);
      toast.success('Xóa chính sách thành công!');
      refreshPolicies();
    } catch {
      toast.error('Lỗi xóa chính sách');
    }
  };

  const handleRevokeKey = async (apiKeyId) => {
    try {
      await axios.post(`${API_BASE}/Security/revoke/${apiKeyId}`);
      toast.success('Thu hồi key thành công!');
      refreshSecurityKeys();
    } catch {
      toast.error('Lỗi thu hồi');
    }
  };

  const menuItems = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: 'Tổng quan' },
    { key: 'users', icon: <UserOutlined />, label: 'User & Org' },
    { key: 'moderation', icon: <FileSearchOutlined />, label: 'Moderation' },
    { key: 'payment', icon: <DollarOutlined />, label: 'Payment' },
    { key: 'policy', icon: <SecurityScanOutlined />, label: 'Policy & Security' },
  ];

  const renderContent = () => {
    if (loading[activeTab]) return <div className="text-center py-5"><Spin size="large" /></div>;

    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <h2 className="mb-4 fw-bold">Tổng quan hệ thống</h2>
            <Row gutter={16} className="mb-5">
              <Col xs={12} md={6}><Card><Statistic title="Người dùng" value={1234} prefix={<UserOutlined />} /></Card></Col>
              <Col xs={12} md={6}><Card><Statistic title="Dataset" value={89} prefix={<DatabaseOutlined />} /></Card></Col>
              <Col xs={12} md={6}><Card><Statistic title="Doanh thu" value={284750000} prefix="₫" valueStyle={{ color: '#22c55e' }} formatter={v => v.toLocaleString()} /></Card></Col>
              <Col xs={12} md={6}><Card><Statistic title="Chờ duyệt" value={stats.pending} valueStyle={{ color: '#f59e0b' }} /></Card></Col>
            </Row>
          </>
        );

      case 'users':
        const filtered = users.filter(u => 
          u.name.toLowerCase().includes(searchText.toLowerCase()) || 
          u.email?.toLowerCase().includes(searchText.toLowerCase())
        );
        return (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="fw-bold">Quản lý User & Organization</h2>
              <Input prefix={<SearchOutlined />} placeholder="Tìm kiếm..." onChange={e => setSearchText(e.target.value)} style={{ width: 300 }} />
            </div>
            <Table dataSource={filtered} columns={[
              { title: 'Tên', dataIndex: 'name' },
              { title: 'Email', dataIndex: 'email' },
              { title: 'Vai trò', dataIndex: 'role', render: r => <Tag color={r === 'admin' ? 'red' : r === 'provider' ? 'blue' : 'green'}>{r}</Tag> },
              {
                title: 'Hành động',
                width: 260,
                render: (_, record) => (
                  <Space>
                    <Button size="small" icon={<EditOutlined />} onClick={() => { setSelectedUser(record); setIsModalOpen(true); }} />
                    
                    {record.role === 'provider' && record.organizationId && !record.organizationVerified ? (
                      <Button 
                        size="small" 
                        type="primary" 
                        onClick={() => handleVerifyOrg(record.organizationId, record.userId)}
                      >
                        Xác minh
                      </Button>
                    ) : record.role === 'provider' && record.organizationVerified ? (
                      <Tag icon={<CheckCircleFilled style={{ color: '#52c41a' }} />} color="success">
                        Đã xác minh
                      </Tag>
                    ) : null}
                  </Space>
                )
              }
            ]} />

            <Modal title="Chỉnh sửa vai trò" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
              <Form layout="vertical" onFinish={handleUpdateUserRole} initialValues={{ role: selectedUser?.role }}>
                <Form.Item name="role" label="Vai trò">
                  <Select>
                    <Option value="consumer">Consumer</Option>
                    <Option value="provider">Provider</Option>
                    <Option value="admin">Admin</Option>
                  </Select>
                </Form.Item>
                <Form.Item><Button type="primary" htmlType="submit">Lưu thay đổi</Button></Form.Item>
              </Form>
            </Modal>
          </>
        );

      case 'moderation':
        return (
          <>
            <h2 className="mb-4 fw-bold">Moderation - Dataset chờ duyệt</h2>
            {pendingDatasets.length === 0 ? <Alert message="Không có dataset chờ duyệt" type="info" /> : (
              <Table dataSource={pendingDatasets} columns={[
                { title: 'Tên Dataset', dataIndex: 'title' },
                { title: 'Provider', dataIndex: 'providerName' },
                { title: 'Upload', dataIndex: 'uploadedAt', render: t => t ? new Date(t).toLocaleString('vi-VN') : 'N/A' },
                {
                  title: 'Hành động',
                  render: (_, r) => (
                    <Space>
                      <Button type="primary" size="small" onClick={() => handleApproveDataset(r)} disabled={r.datasetId?.startsWith('mock')}>Duyệt</Button>
                      <Button danger size="small" onClick={() => handleRejectDataset(r)} disabled={r.datasetId?.startsWith('mock')}>Từ chối</Button>
                    </Space>
                  )
                }
              ]} />
            )}
          </>
        );

      case 'payment':
        return (
          <>
            <h2 className="mb-4 fw-bold">Payment - Phân phối doanh thu</h2>
            <Table dataSource={paymentPending} columns={[
              { title: 'Payment ID', dataIndex: 'paymentId' },
              { title: 'Số tiền', dataIndex: 'amount', render: v => v?.toLocaleString() + ' ₫' },
              { title: 'Ngày thanh toán', dataIndex: 'paidAt', render: d => d ? new Date(d).toLocaleDateString('vi-VN') : 'N/A' },
              { title: '', render: (_, r) => <Button type="primary" size="small" onClick={() => handleDistributePayment(r.paymentId)}>Phân phối</Button> },
            ]} />
          </>
        );

      case 'policy':
        return (
          <>
            <h2 className="mb-4 fw-bold">Policy & Security</h2>
            <Tabs items={[
              {
                label: 'Chính sách truy cập',
                key: 'policy',
                children: (
                  <Table dataSource={policies} columns={[
                    { title: 'Tên', dataIndex: 'name' },
                    { title: 'Mô tả', dataIndex: 'description' },
                    {
                      title: '',
                      render: (_, r) => (
                        <Popconfirm title="Xóa chính sách này?" onConfirm={() => handleDeletePolicy(r.accessPolicyId || r.policyId)}>
                          <Button danger size="small" icon={<DeleteOutlined />} />
                        </Popconfirm>
                      )
                    }
                  ]} />
                )
              },
              {
                label: 'API Keys',
                key: 'security',
                children: (
                  <Table dataSource={securityKeys} columns={[
                    { title: 'Tổ chức', dataIndex: 'organizationName' },
                    { title: 'Mô tả', dataIndex: 'description' },
                    { title: 'Hết hạn', dataIndex: 'expiresAt', render: d => d ? new Date(d).toLocaleDateString('vi-VN') : 'Vô hạn' },
                    { title: '', render: (_, r) => <Button danger size="small" onClick={() => handleRevokeKey(r.apiKeyId)}>Thu hồi</Button> },
                  ]} />
                )
              }
            ]} />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={240} className="bg-white shadow-sm">
        <div className="p-4 text-center">
          <div style={{ fontSize: '2.5rem', color: '#dc3545', fontWeight: 'bold' }}>A</div>
          <h3 className="mt-2 fw-bold text-danger">Admin Panel</h3>
        </div>
        <Menu mode="inline" selectedKeys={[activeTab]} onClick={e => setActiveTab(e.key)} items={menuItems} style={{ borderRight: 0 }} />
      </Sider>

      <Layout>
        <Header className="bg-white shadow-sm d-flex justify-content-end align-items-center px-4">
          <Dropdown menu={{ items: [{ key: 'logout', label: 'Đăng xuất', icon: <LogoutOutlined />, onClick: () => { localStorage.clear(); navigate('/login'); } }] }}>
            <div className="d-flex align-items-center cursor-pointer">
              <Badge dot><Avatar size={40} style={{ backgroundColor: '#dc3545' }}>AD</Avatar></Badge>
              <span className="ms-3 fw-bold">Admin</span>
            </div>
          </Dropdown>
        </Header>

        <Content className="p-5 bg-light">
          {renderContent()}
        </Content>
      </Layout>

      {/* Toastify Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Layout>
  );
}