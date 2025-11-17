import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Row, Col, Statistic, Table, Tag, Button, Spin, Alert, Empty } from 'antd';
import { DollarOutlined, DatabaseOutlined, DownloadOutlined, LoadingOutlined } from '@ant-design/icons';

// API endpoint
const REVENUE_API_BASE = 'http://localhost:8000/api/provider/Revenue/dashboard';
const TEMP_PROVIDER_ID = 'fcf0c8c4-4d5a-45a8-badf-114462567445';

export default function DashboardHome() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // ✅ Thêm config axios giống Swagger
        const axiosConfig = {
          method: 'GET',
          url: `${REVENUE_API_BASE}/${TEMP_PROVIDER_ID}`,
          headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json',
          },
          withCredentials: true, // Nếu cần gửi cookie/credentials
        };
        
        console.log('Fetching:', axiosConfig.url);
        const response = await axios(axiosConfig);
        console.log('Success:', response.data);
        setDashboardData(response.data);
      } catch (err) {
        console.error('Lỗi chi tiết:', {
          status: err.response?.status,
          message: err.message,
          url: err.config?.url,
          data: err.response?.data,
        });
        setError(`Lỗi tải dữ liệu: ${err.response?.status || err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format currency
  const formatCurrency = (value) => {
    if (!value) return '₫0';
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M ₫`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K ₫`;
    return `${value.toFixed(0)} ₫`;
  };

  // Table columns
  const columns = [
    {
      title: 'Tên Dataset',
      dataIndex: 'datasetTitle',
      key: 'datasetTitle',
      render: (text) => <strong style={{ color: '#047857' }}>{text}</strong>,
    },
    {
      title: 'Tải xuống',
      dataIndex: 'downloadCount',
      key: 'downloadCount',
      render: (count) => (
        <>
          <DownloadOutlined style={{ marginRight: 8, color: '#047857' }} />
          {count}
        </>
      ),
      align: 'center',
    },
    {
      title: 'Doanh thu',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (revenue) => (
        <span style={{ fontWeight: '700', color: '#047857' }}>
          ${revenue ? revenue.toFixed(2) : '0.00'}
        </span>
      ),
      align: 'right',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color="success">{status}</Tag>,
      align: 'center',
    },
  ];

  // Loading state
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <Spin 
          indicator={<LoadingOutlined style={{ fontSize: 32, color: '#047857' }} spin />} 
          tip="Đang tải dữ liệu dashboard..."
        />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert
        message="Lỗi tải dữ liệu"
        description={error}
        type="error"
        showIcon
        style={{ marginBottom: 16 }}
      />
    );
  }

  // No data state
  if (!dashboardData) {
    return <Empty description="Không có dữ liệu dashboard" />;
  }

  return (
    <>
      <h2 className="mb-4 fw-bold" style={{ color: '#047857' }}>Tổng quan</h2>
      
      {/* Statistics Cards */}
      <Row gutter={16} className="mb-5">
        <Col xs={24} sm={12} md={6}>
          <Card 
            className="stat-card"
            bordered={false}
            style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(4,120,87,0.1)' }}
          >
            <Statistic
              title="Doanh thu"
              value={dashboardData.totalRevenue || 0}
              prefix={<DollarOutlined style={{ color: '#047857' }} />}
              suffix=""
              valueStyle={{ color: '#047857', fontSize: 24, fontWeight: '700' }}
              formatter={(value) => `$${parseFloat(value).toFixed(2)}`}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card 
            className="stat-card"
            bordered={false}
            style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(4,120,87,0.1)' }}
          >
            <Statistic
              title="Tập dữ liệu"
              value={dashboardData.totalDatasets || 0}
              prefix={<DatabaseOutlined style={{ color: '#047857' }} />}
              valueStyle={{ color: '#047857', fontSize: 24, fontWeight: '700' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card 
            className="stat-card"
            bordered={false}
            style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(4,120,87,0.1)' }}
          >
            <Statistic
              title="Tải xuống"
              value={dashboardData.totalDownloadCount || 0}
              prefix={<DownloadOutlined style={{ color: '#047857' }} />}
              valueStyle={{ color: '#047857', fontSize: 24, fontWeight: '700' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card 
            className="stat-card"
            bordered={false}
            style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(4,120,87,0.1)' }}
          >
            <Statistic
              title="Ngày báo cáo"
              value={new Date(dashboardData.reportDate).toLocaleDateString('vi-VN')}
              valueStyle={{ color: '#047857', fontSize: 16, fontWeight: '600' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Datasets Table */}
      <Card 
        title={
          <span style={{ color: '#047857', fontWeight: '700', fontSize: 16 }}>
            Dataset Gần đây
          </span>
        }
        extra={<Button type="link" style={{ color: '#047857' }}>Xem tất cả</Button>}
        bordered={false}
        style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(4,120,87,0.1)' }}
      >
        <Table
          dataSource={dashboardData.recentDatasets || []}
          columns={columns}
          pagination={false}
          rowKey="datasetTitle"
          locale={{ emptyText: 'Không có dữ liệu' }}
          className="dashboard-table"
        />
      </Card>
    </>
  );
}