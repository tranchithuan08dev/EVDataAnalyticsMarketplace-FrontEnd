import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Col, Row, Statistic, Table, Spin, Alert, Typography } from 'antd';
import { DownloadOutlined, DollarOutlined, DatabaseOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title } = Typography;

const API_URL = 'http://localhost:8000/api/provider/Revenue/dashboard/62F3F1A1-5283-4C64-9AB4-00879BE22EFD';

/**
 * Component hiển thị Bảng điều khiển Doanh thu từ API.
 */
const DashboardHome = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hook useEffect để thực hiện lời gọi API khi component được mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL);
        // Lưu dữ liệu vào trạng thái
        setData(response.data);
      } catch (err) {
        // Xử lý lỗi
        console.error("Lỗi khi gọi API:", err);
        setError("Không thể tải dữ liệu. Vui lòng kiểm tra console để biết chi tiết.");
      } finally {
        // Dừng trạng thái tải
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Mảng phụ thuộc rỗng đảm bảo chỉ chạy một lần khi mount

  // -----------------------------------------------------
  // Hiển thị trạng thái tải và lỗi
  // -----------------------------------------------------

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Lỗi tải dữ liệu"
        description={error}
        type="error"
        showIcon
        style={{ margin: '20px' }}
      />
    );
  }

  if (!data) {
    return (
      <Alert
        message="Không có dữ liệu"
        description="API trả về dữ liệu rỗng."
        type="info"
        showIcon
        style={{ margin: '20px' }}
      />
    );
  }
  
  // -----------------------------------------------------
  // Cấu hình Bảng (Table) cho "recentDatasets"
  // -----------------------------------------------------

  const tableColumns = [
    {
      title: 'Tên Tập Dữ Liệu',
      dataIndex: 'datasetTitle',
      key: 'datasetTitle',
    },
    {
      title: 'Số Lượt Tải',
      dataIndex: 'downloadCount',
      key: 'downloadCount',
      sorter: (a, b) => a.downloadCount - b.downloadCount,
      align: 'right',
    },
    {
      title: 'Doanh Thu',
      dataIndex: 'revenue',
      key: 'revenue',
      // Hiển thị dưới dạng tiền tệ
      render: (text) => `$${text.toFixed(2)}`,
      sorter: (a, b) => a.revenue - b.revenue,
      align: 'right',
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Đã duyệt', value: 'Đã duyệt' },
        { text: 'Đang chờ', value: 'Đang chờ' },
        // Thêm các trạng thái khác nếu có
      ],
      onFilter: (value, record) => record.status.indexOf(value) === 0,
    },
  ];

  // -----------------------------------------------------
  // Render Bảng điều khiển
  // -----------------------------------------------------

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>📊 Bảng Điều Khiển Doanh Thu</Title>
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        {/* Thẻ 1: Tổng Doanh Thu */}
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="Tổng Doanh Thu"
              value={data.totalRevenue}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix={<DollarOutlined />}
              suffix="USD"
            />
          </Card>
        </Col>

        {/* Thẻ 2: Tổng Lượt Tải */}
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="Tổng Lượt Tải"
              value={data.totalDownloadCount}
              valueStyle={{ color: '#0052d9' }}
              prefix={<DownloadOutlined />}
            />
          </Card>
        </Col>

        {/* Thẻ 3: Tổng Số Tập Dữ Liệu */}
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="Tổng Số Tập Dữ Liệu"
              value={data.totalDatasets}
              valueStyle={{ color: '#d97b00' }}
              prefix={<DatabaseOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: '24px' }}>
        {/* Thẻ thông tin bổ sung */}
        <Col span={24}>
          <Card>
            <p>
              **Thời gian báo cáo:**{' '}
              {moment(data.reportDate).format('HH:mm:ss ngày DD/MM/YYYY')}
            </p>
          </Card>
        </Col>
      </Row>

      {/* Bảng chi tiết các Tập Dữ Liệu Gần Đây */}
      <Row>
        <Col span={24}>
          <Card
            title="Tập Dữ Liệu Gần Đây"
            bordered={false}
          >
            <Table
              columns={tableColumns}
              dataSource={data.recentDatasets}
              rowKey="datasetTitle" // Sử dụng datasetTitle làm khóa duy nhất
              pagination={{ pageSize: 5 }} // Giới hạn 5 hàng mỗi trang
              scroll={{ x: 'max-content' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardHome;