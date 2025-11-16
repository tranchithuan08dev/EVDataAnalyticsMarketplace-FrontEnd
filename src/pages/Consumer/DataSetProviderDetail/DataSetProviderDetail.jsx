// File: DataProviderDetail.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Descriptions, Table, Tag, Typography, Space, Spin, Alert, Button } from 'antd';
import { ArrowLeftOutlined, LoadingOutlined, GlobalOutlined, MailOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

// ⭐️ URL API chi tiết đã được cập nhật thành HTTPS
const DETAIL_API_BASE_URL = 'http://localhost:8000/api/provider/Datasets/provider/';

// Hàm định dạng ngày
const formatDate = (dateString) => {
  return dateString ? new Date(dateString).toLocaleDateString('vi-VN') : 'N/A';
};

// ======================================================
// 1. Component Hiển thị Thông tin Nhà Cung Cấp
// ======================================================
const ProviderInfo = ({ provider }) => (
  <Card
    title={
      <Space>
        <Title level={4} style={{ margin: 0 }}>
          <span style={{color: '#047857'}}>⭐</span> {provider.organizationName || 'Chi Tiết Nhà Cung Cấp'}
        </Title>
        <Tag color={provider.isVerified ? "success" : "default"}>
          {provider.isVerified ? "ĐÃ XÁC MINH" : "CHƯA XÁC MINH"}
        </Tag>
      </Space>
    }
    style={{ marginBottom: 24 }}
  >
    <p style={{marginBottom: 16, color: '#4b5563', fontSize: '15px'}}>{provider.organizationDescription}</p>

    <Descriptions column={{ xs: 1, sm: 2, lg: 3 }} bordered size="small">
      <Descriptions.Item label="ID">{provider.providerId}</Descriptions.Item>
      <Descriptions.Item label="Loại Tổ Chức">{provider.orgType}</Descriptions.Item>
      <Descriptions.Item label="Quốc Gia">{provider.country}</Descriptions.Item>
      <Descriptions.Item label="Email Liên Hệ">
        <MailOutlined style={{marginRight: 8}} />
        <a href={`mailto:${provider.contactEmail}`}>{provider.contactEmail}</a>
      </Descriptions.Item>
      <Descriptions.Item label="Website">
        <GlobalOutlined style={{marginRight: 8}} />
        <a href={provider.website} target="_blank" rel="noopener noreferrer">Xem Website</a>
      </Descriptions.Item>
      <Descriptions.Item label="Ngày Tham Gia">{formatDate(provider.joinedAt)}</Descriptions.Item>
    </Descriptions>
  </Card>
);

// ======================================================
// 2. Component Bảng Danh sách Bộ Dữ Liệu
// ======================================================
const DatasetsTable = ({ datasets }) => {
  const columns = [
    {
      title: 'Tiêu Đề',
      dataIndex: 'title',
      key: 'title',
      width: 150,
      render: (text, record) => (
        <>
          <Text strong>{text}</Text>
          <p style={{ margin: 0, fontSize: 12, color: '#888' }}>ID: {record.datasetId}</p>
        </>
      ),
    },
    {
      title: 'Mô Tả Ngắn',
      dataIndex: 'shortDescription',
      key: 'shortDescription',
    },
    {
      title: 'Phạm Vi',
      dataIndex: 'region',
      key: 'region',
      width: 100,
    },
    {
      title: 'Phân Loại',
      dataIndex: 'category',
      key: 'category',
      width: 150,
      render: category => <Tag color="blue">{category}</Tag>,
    },
    {
      title: 'Các Loại Dữ Liệu',
      dataIndex: 'dataTypes',
      key: 'dataTypes',
      width: 180,
      render: types => (
        <Space size={[0, 8]} wrap>
          {Array.isArray(types) ? types.map(type => (
            <Tag key={type}>{String(type).toUpperCase().replace('_', ' ')}</Tag>
          )) : <Tag>N/A</Tag>}
        </Space>
      ),
    },
    {
      title: 'Tình Trạng',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: status => {
        let color = 'default';
        if (status === 'pending-update') color = 'warning';
        if (status === 'public') color = 'success';
        return <Tag color={color}>{status ? status.toUpperCase().replace('-', ' ') : 'N/A'}</Tag>;
      },
    },
    {
      title: 'Cập Nhật Lần Cuối',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 140,
      render: formatDate,
    },
  ];

  return (
    <Card title={<Title level={4} style={{ margin: 0 }}>📊 Danh Sách Bộ Dữ Liệu ({datasets.length})</Title>}>
      <Table
        columns={columns}
        dataSource={datasets.map(d => ({ ...d, key: d.datasetId }))}
        pagination={{ pageSize: 5 }}
        scroll={{ x: 1000 }}
        size="middle"
        locale={{ emptyText: 'Nhà cung cấp này chưa có bộ dữ liệu công khai nào.' }}
      />
    </Card>
  );
};


// ======================================================
// 3. Component Chính (DataProviderDetail)
// ======================================================
const DataProviderDetail = () => {
  // Lấy providerId từ URL
  const { providerId } = useParams();
  // Khởi tạo navigate để quay lại
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!providerId) {
        setError("Lỗi: Không tìm thấy Provider ID trong URL.");
        setLoading(false);
        return;
    }

    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        // Gọi API với URL và ID chính xác
        // Lưu ý: Có thể cần cấu hình Axios để bỏ qua lỗi SSL cho localhost HTTPS
        const response = await axios.get(`${DETAIL_API_BASE_URL}${providerId}/details`);

        const detailData = {
            provider: response.data.provider || {},
            // Đảm bảo datasets là một mảng
            datasets: Array.isArray(response.data.datasets) ? response.data.datasets : []
        };

        setData(detailData);
      } catch (err) {
        console.error(`Lỗi khi tải chi tiết nhà cung cấp ${providerId}:`, err.message);
        setError(`Không thể tải chi tiết nhà cung cấp (ID: ${providerId}). Lỗi kết nối API: ${err.message}.`);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [providerId]); // Chạy lại khi providerId thay đổi

  if (loading) {
    const antIcon = <LoadingOutlined style={{ fontSize: 32, color: '#047857' }} spin />;
    return (
      <div style={{ minHeight: '500px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '50px' }}>
        <Spin indicator={antIcon} tip={`Đang tải chi tiết cho Provider ID: ${providerId}...`} size="large" />
      </div>
    );
  }

  if (error || !data || !data.provider.providerId) {
    return (
      <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
        <Button onClick={() => navigate(-1)} icon={<ArrowLeftOutlined />} style={{ marginBottom: 16 }}>
          Quay lại Danh sách
        </Button>
        <Alert
          message="Không tìm thấy nhà cung cấp hoặc lỗi tải dữ liệu"
          description={error || `Không tìm thấy nhà cung cấp với ID: ${providerId}. Vui lòng kiểm tra lại ID.`}
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <Button onClick={() => navigate(-1)} icon={<ArrowLeftOutlined />} style={{ marginBottom: 16 }}>
        Quay lại Danh sách
      </Button>
      <ProviderInfo provider={data.provider} />
      <DatasetsTable datasets={data.datasets} />
    </div>
  );
};

export default DataProviderDetail;