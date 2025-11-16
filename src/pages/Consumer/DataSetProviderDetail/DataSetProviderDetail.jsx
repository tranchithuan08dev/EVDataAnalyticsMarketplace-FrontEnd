// File: DataProviderDetail.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card, Descriptions, Table, Tag, Typography, Space, Spin, Alert,
  Button, Modal, List
} from 'antd';
import {
  ArrowLeftOutlined, LoadingOutlined, GlobalOutlined,
  MailOutlined, ShoppingCartOutlined, SafetyOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

// API URLs
const DETAIL_PROVIDER_API_BASE_URL = 'http://localhost:8000/api/provider/Datasets/provider/';
const DETAIL_DATASET_API_BASE_URL = 'http://localhost:8000/api/provider/Datasets';
const PURCHASE_API_URL = 'http://localhost:8000/api/consumer/EVDatasets/purchase';

// ======================================================
// HÀM TIỆN ÍCH
// ======================================================

const formatDate = (dateString) => {
  return dateString ? new Date(dateString).toLocaleDateString('vi-VN') : 'N/A';
};

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// ======================================================
// 1. Provider Info
// ======================================================
const ProviderInfo = ({ provider }) => (
  <Card
    title={
      <Space>
        <Title level={4} style={{ margin: 0 }}>
          <span style={{ color: '#047857' }}>⭐</span> {provider.organizationName || 'Chi Tiết Nhà Cung Cấp'}
        </Title>
        <Tag color={provider.isVerified ? "success" : "default"}>
          {provider.isVerified ? "ĐÃ XÁC MINH" : "CHƯA XÁC MINH"}
        </Tag>
      </Space>
    }
    style={{ marginBottom: 24 }}
  >
    <p style={{ marginBottom: 16, color: '#4b5563', fontSize: '15px' }}>
      {provider.organizationDescription}
    </p>

    <Descriptions column={{ xs: 1, sm: 2, lg: 3 }} bordered size="small">
      <Descriptions.Item label="ID">{provider.providerId}</Descriptions.Item>
      <Descriptions.Item label="Loại Tổ Chức">{provider.orgType}</Descriptions.Item>
      <Descriptions.Item label="Quốc Gia">{provider.country}</Descriptions.Item>
      <Descriptions.Item label="Email Liên Hệ">
        <MailOutlined style={{ marginRight: 8 }} />
        <a href={`mailto:${provider.contactEmail}`}>{provider.contactEmail}</a>
      </Descriptions.Item>
      <Descriptions.Item label="Website">
        <GlobalOutlined style={{ marginRight: 8 }} />
        <a href={provider.website} target="_blank" rel="noopener noreferrer">Xem Website</a>
      </Descriptions.Item>
      <Descriptions.Item label="Ngày Tham Gia">{formatDate(provider.joinedAt)}</Descriptions.Item>
    </Descriptions>
  </Card>
);

// ======================================================
// 2. Dataset Detail Modal (với chức năng MUA)
// ======================================================
const DatasetDetailModal = ({ datasetId, isModalVisible, handleCancel, buyerOrgId }) => {
  const [datasetDetail, setDatasetDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [purchaseLoading, setPurchaseLoading] = useState({});
  console.log("daaa", buyerOrgId);
  
  // Cố định buyerUserId
  const BUYER_USER_ID = 'B5838779-5BA8-40E0-809E-0B47978C2674';

  useEffect(() => {
    if (!isModalVisible || !datasetId) return;

    const fetchDatasetDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${DETAIL_DATASET_API_BASE_URL}/${datasetId}`);
        setDatasetDetail(response.data);
      } catch (err) {
        console.error("Lỗi khi tải chi tiết Dataset:", err);
        setError("Không thể tải chi tiết Dataset. Vui lòng kiểm tra kết nối API.");
      } finally {
        setLoading(false);
      }
    };

    fetchDatasetDetail();
  }, [datasetId, isModalVisible]);

  const handleBuyClick = async (version) => {
    const versionId = version.datasetVersionId || version.id;
    if (!versionId) {
      Modal.error({ title: 'Lỗi', content: 'Không tìm thấy ID phiên bản dữ liệu.' });
      return;
    }

    setPurchaseLoading(prev => ({ ...prev, [versionId]: true }));

    try {
      const payload = {
        buyerUserId: BUYER_USER_ID,
        buyerOrgId: buyerOrgId,
        datasetVersionId: versionId,
        price: parseFloat(version.pricePerDownload),
        currency: "USD",
        accessDays: 30
      };
       console.log("Payload", payload);
       
      const response = await axios.post(PURCHASE_API_URL, payload);

      Modal.success({
        title: 'Mua thành công!',
        content: (
          <div>
            <p><strong>{datasetDetail.title}</strong></p>
            <p>Phiên bản: <strong>{version.versionLabel}</strong></p>
            <p>Giá: <strong>${version.pricePerDownload.toFixed(2)}</strong></p>
            <p>Truy cập trong <strong>30 ngày</strong></p>
            {response.data.transactionId && (
              <p style={{ marginTop: 12, fontSize: 12, color: '#888' }}>
                Mã giao dịch: <code>{response.data.transactionId}</code>
              </p>
            )}
          </div>
        ),
        okText: 'Đóng',
      });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Không xác định';
      Modal.error({
        title: 'Mua thất bại',
        content: `Lỗi: ${msg}`,
      });
    } finally {
      setPurchaseLoading(prev => ({ ...prev, [versionId]: false }));
    }
  };

  const modalTitle = datasetDetail ? datasetDetail.title : "Chi Tiết Bộ Dữ Liệu";

  return (
    <Modal
      title={<Title level={4} style={{ margin: 0 }}>{modalTitle}</Title>}
      open={isModalVisible}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>Đóng</Button>,
      ]}
      width={800}
    >
      {loading && (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} tip="Đang tải chi tiết..." />
        </div>
      )}

      {error && <Alert message="Lỗi" description={error} type="error" showIcon style={{ marginBottom: 16 }} />}

      {datasetDetail && !loading && (
        <>
          <Descriptions bordered column={1} size="small" style={{ marginBottom: 20 }}>
            <Descriptions.Item label="Mô Tả">{datasetDetail.longDescription || 'Không có mô tả chi tiết.'}</Descriptions.Item>
            <Descriptions.Item label="Loại Dữ Liệu">
              <Space wrap>
                {datasetDetail.dataTypes && datasetDetail.dataTypes.split(',').map(type => (
                  <Tag color="green" key={type.trim()}>{type.trim().toUpperCase()}</Tag>
                ))}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Phạm Vi">{datasetDetail.region}</Descriptions.Item>
            <Descriptions.Item label="Giấy Phép">{datasetDetail.licenseType}</Descriptions.Item>
            <Descriptions.Item label="Tình Trạng">
              <Tag color={datasetDetail.status === 'public' ? 'success' : 'warning'}>
                {datasetDetail.status.toUpperCase()}
              </Tag>
            </Descriptions.Item>
          </Descriptions>

          <Title level={5} style={{ marginTop: 20 }}>Các Phiên Bản Dữ Liệu ({datasetDetail.versions.length})</Title>
          <List
            itemLayout="horizontal"
            dataSource={datasetDetail.versions}
            renderItem={version => {
              const versionId = version.datasetVersionId || version.id;
              const isFree = version.pricePerDownload === 0;
              return (
                <List.Item
                  key={versionId}
                  actions={[
                    <Button
                      type="primary"
                      icon={<ShoppingCartOutlined />}
                      loading={purchaseLoading[versionId]}
                      onClick={() => handleBuyClick(version)}
                      style={isFree ? { backgroundColor: '#52c41a', borderColor: '#52c41a' } : {}}
                    >
                      {isFree ? 'Tải miễn phí' : `Mua ($${version.pricePerDownload.toFixed(2)})`}
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    title={<Text strong>{version.versionLabel} - {version.fileFormat.toUpperCase()}</Text>}
                    description={
                      <Space direction="vertical" size={4}>
                        <Text type="secondary">Kích thước: <strong>{formatBytes(version.filesizeBytes)}</strong></Text>
                        <Text type="secondary">Ngày phát hành: {formatDate(version.createdAt)}</Text>
                        {version.isAnalyzed && <Tag icon={<SafetyOutlined />} color="processing">Đã Phân Tích</Tag>}
                      </Space>
                    }
                  />
                </List.Item>
              );
            }}
          />
        </>
      )}
    </Modal>
  );
};

// ======================================================
// 3. Datasets Table
// ======================================================
const DatasetsTable = ({ datasets, onDatasetClick }) => {
  const columns = [
    {
      title: 'Tiêu Đề',
      dataIndex: 'title',
      key: 'title',
      width: 150,
      render: (text, record) => (
        <>
          <a
            onClick={() => onDatasetClick(record.datasetId)}
            style={{ color: '#046c4f', fontWeight: '700', cursor: 'pointer' }}
          >
            {text}
          </a>
          <p style={{ margin: 0, fontSize: 12, color: '#888' }}>ID: {record.datasetId}</p>
        </>
      ),
    },
    { title: 'Mô Tả Ngắn', dataIndex: 'shortDescription', key: 'shortDescription' },
    { title: 'Phạm Vi', dataIndex: 'region', key: 'region', width: 100 },
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
    <Card title={<Title level={4} style={{ margin: 0 }}>Danh Sách Bộ Dữ Liệu ({datasets.length})</Title>}>
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
// 4. Main Component
// ======================================================
const DataProviderDetail = () => {
  const { providerId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDatasetId, setSelectedDatasetId] = useState(null);

  const handleDatasetClick = (datasetId) => {
    setSelectedDatasetId(datasetId);
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedDatasetId(null);
  };

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
        const response = await axios.get(`${DETAIL_PROVIDER_API_BASE_URL}${providerId}/details`);

        const detailData = {
          provider: response.data.provider || {},
          datasets: Array.isArray(response.data.datasets) ? response.data.datasets : []
        };

        setData(detailData);
      } catch (err) {
        console.error(`Lỗi khi tải chi tiết nhà cung cấp ${providerId}:`, err.message);
        setError(`Không thể tải chi tiết nhà cung cấp (ID: ${providerId}). Lỗi: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [providerId]);

  // Loading
  if (loading) {
    const antIcon = <LoadingOutlined style={{ fontSize: 32, color: '#047857' }} spin />;
    return (
      <div style={{ minHeight: '500px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '50px' }}>
        <Spin indicator={antIcon} tip={`Đang tải chi tiết cho Provider ID: ${providerId}...`} size="large" />
      </div>
    );
  }

  // Error
  if (error || !data || !data.provider.providerId) {
    return (
      <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
        <Button onClick={() => navigate(-1)} icon={<ArrowLeftOutlined />} style={{ marginBottom: 16 }}>
          Quay lại Danh sách
        </Button>
        <Alert
          message="Không tìm thấy nhà cung cấp hoặc lỗi tải dữ liệu"
          description={error || `Không tìm thấy nhà cung cấp với ID: ${providerId}.`}
          type="error"
          showIcon
        />
      </div>
    );
  }

  // Main UI
  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <Button onClick={() => navigate(-1)} icon={<ArrowLeftOutlined />} style={{ marginBottom: 16 }}>
        Quay lại Danh sách
      </Button>

      <ProviderInfo provider={data.provider} />

      <DatasetsTable datasets={data.datasets} onDatasetClick={handleDatasetClick} />

      <DatasetDetailModal
        datasetId={selectedDatasetId}
        isModalVisible={isModalVisible}
        handleCancel={handleModalCancel}
        buyerOrgId={data.provider.organizationId} 
      />
    </div>
  );
};

export default DataProviderDetail;