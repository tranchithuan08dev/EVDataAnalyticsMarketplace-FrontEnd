import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios'; 
import { Table, Select, Input, Form, Button, Row, Col, Tag, Card, Spin, Alert, Modal, Descriptions, List, Drawer, Divider, Space, Badge } from 'antd';
import { SearchOutlined, FilterOutlined, ReloadOutlined, LoadingOutlined, DownloadOutlined, FileOutlined, ClockCircleOutlined, DatabaseOutlined } from '@ant-design/icons';
import './DataProviderListPage.css'; 

const { Option } = Select;
const { Search } = Input;

// URL API
const API_URL = 'http://localhost:8000/api/provider/DataProvider';
const DETAIL_BASE = 'http://localhost:8000/api/provider/Datasets/provider';
const DATASET_DETAIL_BASE = 'http://localhost:8000/api/provider/Datasets';
const SUBSCRIBE_API = 'http://localhost:8000/api/consumer/EVDatasets/subscribe'; // API Đăng ký thuê bao

const DataProviderListPage = () => {
  const [form] = Form.useForm();
  
  const [rawData, setRawData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Provider detail modal state
  const [detailLoading, setDetailLoading] = useState(false);
  const [providerDetail, setProviderDetail] = useState(null);
  const [detailError, setDetailError] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);

  // Dataset detail drawer state
  const [datasetDetailLoading, setDatasetDetailLoading] = useState(false);
  const [datasetDetail, setDatasetDetail] = useState(null);
  const [datasetDetailError, setDatasetDetailError] = useState(null);
  const [datasetDetailVisible, setDatasetDetailVisible] = useState(false);

  // === NEW STATES FOR SUBSCRIPTION ===
  const [rentModalVisible, setRentModalVisible] = useState(false);
  const [apiKeyModalVisible, setApiKeyModalVisible] = useState(false);
  const [rentLoading, setRentLoading] = useState(false);
  const [rentDatasetId, setRentDatasetId] = useState(null);
  const [rentDatasetTitle, setRentDatasetTitle] = useState('');
  const [newApiKey, setNewApiKey] = useState(null);
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  // ===================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_URL);
        const apiList = Array.isArray(response.data) ? response.data : (response.data.items || []);

        const dataWithKeys = apiList
          .map(item => ({
            ...item,
            key: item.providerId,
            totalDatasets: Number(item.activeDatasets) || 0,
          }))
          .filter(p => p.totalDatasets > 0);

        setRawData(dataWithKeys);
        setFilteredData(dataWithKeys);
        setError(null);
      } catch (err) {
        console.error("Lỗi khi fetch dữ liệu:", err);
        setError("Không thể tải dữ liệu từ API. Vui lòng kiểm tra server.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); 

  const uniqueOrgTypes = useMemo(() => [...new Set(rawData.map(item => item.orgType).filter(Boolean))], [rawData]);
  const uniqueCountries = useMemo(() => [...new Set(rawData.map(item => item.country).filter(Boolean))], [rawData]);

  const handleFilter = (values = {}) => {
    let currentData = rawData || [];
    const { orgType, country, searchName } = values;

    if (orgType && orgType.length > 0) {
      currentData = currentData.filter(item => orgType.includes(item.orgType));
    }

    if (country && country.length > 0) {
      currentData = currentData.filter(item => country.includes(item.country));
    }

    const searchLower = (searchName || searchText || '').toLowerCase().trim(); 
    if (searchLower) {
      currentData = currentData.filter(item => {
        const name = (item.organizationName || '').toLowerCase();
        const desc = (item.organizationDescription || '').toLowerCase();
        return name.includes(searchLower) || desc.includes(searchLower);
      });
    }
    
    setFilteredData(currentData);
  };

  useEffect(() => {
    const formValues = form.getFieldsValue();
    handleFilter({ ...formValues, searchName: searchText });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, rawData, loading]);

  const handleReset = () => {
    form.resetFields();
    setSearchText('');
    setFilteredData(rawData);
  };

  // Get provider details
  const openProviderDetails = async (providerId) => {
    if (!providerId) return;
    setProviderDetail(null);
    setDetailError(null);
    setDetailLoading(true);
    setDetailVisible(true);

    try {
      const res = await axios.get(`${DETAIL_BASE}/${providerId}/details`);
      setProviderDetail(res.data);
    } catch (err) {
      console.error('Lỗi khi lấy chi tiết provider:', err);
      setDetailError('Không thể tải chi tiết nhà cung cấp. Vui lòng thử lại.');
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetail = () => {
    setDetailVisible(false);
    setProviderDetail(null);
    setDetailError(null);
  };

  // Get dataset details
  const openDatasetDetails = async (datasetId) => {
    if (!datasetId) return;
    setDatasetDetail(null);
    setDatasetDetailError(null);
    setDatasetDetailLoading(true);
    setDatasetDetailVisible(true);

    try {
      const res = await axios.get(`${DATASET_DETAIL_BASE}/${datasetId}`);
      setDatasetDetail(res.data);
    } catch (err) {
      console.error('Lỗi khi lấy chi tiết dataset:', err);
      setDatasetDetailError('Không thể tải chi tiết tập dữ liệu. Vui lòng thử lại.');
    } finally {
      setDatasetDetailLoading(false);
    }
  };

  const closeDatasetDetail = () => {
    setDatasetDetailVisible(false);
    setDatasetDetail(null);
    setDatasetDetailError(null);
  };

  // Download handler
  const handleDownloadDataset = (fileUri, fileName) => {
    if (!fileUri) return;
    // Assuming fileUri is a valid download link
    const link = document.createElement('a');
    link.href = fileUri;
    link.download = fileName || 'dataset-file';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // === NEW RENTAL LOGIC ===

  // 1. Open the rent duration selection modal
  const openRentModal = (datasetId, datasetTitle) => {
    setRentDatasetId(datasetId);
    setRentDatasetTitle(datasetTitle);
    setRentModalVisible(true);
  };

  // 2. Handle the subscription POST request
  const handleSubscribe = async (values) => {
    const { durationDays } = values;
    const datasetId = rentDatasetId; 
    
    if (!datasetId) {
      alert("Lỗi: Không tìm thấy ID tập dữ liệu.");
      return;
    }

    // Giá thuê: Số ngày * 5000 (theo yêu cầu)
    const priceUnit = 5000; 
    const recurringPrice = durationDays * priceUnit;

    // Lấy consumerOrgId: Sử dụng giá trị placeholder theo yêu cầu vì không có sẵn trong ngữ cảnh hiện tại.
    // Trong môi trường thực, giá trị này sẽ được lấy từ bối cảnh người dùng đang đăng nhập.
    const consumerOrgId = providerDetail?.provider?.organizationId || providerDetail?.provider?.providerId || "mock-consumer-org-id-fallback";
    const payload = {
      consumerOrgId: consumerOrgId,
      datasetId: datasetId,
      recurringPrice: recurringPrice,
      durationDays: durationDays,
    };
    console.log("payload",);
    
    setRentLoading(true);
    try {
      const res = await axios.post(SUBSCRIBE_API, payload);

      setSubscriptionDetails(res.data);
      setNewApiKey(res.data.newApiKey);

      setRentModalVisible(false); // Đóng modal chọn ngày
      setApiKeyModalVisible(true); // Mở modal hiển thị API key

    } catch (err) {
      console.error('Lỗi khi đăng ký thuê bao:', err);
      // Giả định cấu trúc lỗi trả về từ API
      alert(`Đăng ký thuê bao thất bại: ${err.response?.data?.message || err.message}. Vui lòng thử lại.`);
    } finally {
      setRentLoading(false);
    }
  };

  // =========================

  const columns = [
    {
      title: 'Tổ chức',
      dataIndex: 'organizationName',
      key: 'organizationName',
      width: '20%',
      render: (text, record) => (
        <>
          <a
            style={{ color: '#046c4f', fontWeight: '700', cursor: 'pointer' }}
            onClick={(e) => { e.preventDefault(); openProviderDetails(record.providerId); }}
          >
            {text}
          </a>
          <div style={{ fontSize: '13px', color: '#6b7280' }}>{record.organizationDescription}</div>
        </>
      ),
    },
    {
      title: 'Loại',
      dataIndex: 'orgType',
      key: 'orgType',
      width: '10%',
      render: (type) => <Tag color="success">{type}</Tag>,
    },
    {
      title: 'Quốc gia',
      dataIndex: 'country',
      key: 'country',
      width: '10%',
    },
    {
      title: 'Các loại dữ liệu',
      dataIndex: 'availableDataTypes',
      key: 'availableDataTypes',
      render: (tags) => (
        <>
          {Array.isArray(tags) ? tags.map(tag => (
            <Tag color="green" key={tag} style={{ marginBottom: '4px' }}>
              {String(tag).toUpperCase().replace('_', ' ')}
            </Tag>
          )) : null}
        </>
      ),
    },
    {
      title: 'Tập dữ liệu',
      dataIndex: 'totalDatasets',
      key: 'totalDatasets',
      width: '10%',
      align: 'center',
    },
    {
      title: 'Giá (Min)',
      dataIndex: ['pricingSummary', 'minPricePerDownload'],
      key: 'minPricePerDownload',
      width: '10%',
      align: 'right',
      render: (price) => (price !== undefined && price !== null) ? `$${price.toFixed(2)}` : 'N/A',
    },
  ];

  if (loading) {
    const antIcon = <LoadingOutlined style={{ fontSize: 24, color: '#047857' }} spin />;
    return (
        <div className="data-provider-page loading-screen">
            <Spin indicator={antIcon} tip="Đang tải dữ liệu nhà cung cấp..." size="large" />
        </div>
    );
  }

  if (error) {
    return (
      <div className="data-provider-page">
        <div className="content-wrap">
          <Alert
            message="Lỗi Tải Dữ liệu"
            description={error}
            type="error"
            showIcon
          />
        </div>
      </div>
    );
  }

  return (
    <div className="data-provider-page">
      
      <div className="content-wrap">
        <h2 className="page-title">
          <SearchOutlined className="page-title-icon" />
          Tìm kiếm & Khám phá Nhà cung cấp Dữ liệu EV
        </h2>

        <Card 
          className="filter-card"
          title={<span className="card-title"><FilterOutlined /> Bộ lọc Dữ liệu</span>} 
          bordered={false}
        >
          <Form
            form={form}
            onValuesChange={(_, values) => handleFilter({ ...values, searchName: searchText })}
            layout="vertical"
            initialValues={{ orgType: [], country: [] }}
          >
            <Row gutter={24} align="bottom">
              
              <Col xs={24} sm={24} md={10} lg={12}>
                <Form.Item label="Tìm kiếm theo Tên/Mô tả" name="searchName">
                  <Search
                    placeholder="Nhập tên tổ chức hoặc mô tả..."
                    enterButton={<SearchOutlined />}
                    size="large"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onSearch={(value) => setSearchText(value)}
                    className="search-input"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={6} lg={4}>
                <Form.Item name="orgType" label="Loại Tổ chức">
                  <Select mode="multiple" placeholder="Chọn loại..." allowClear className="select-control">
                    {uniqueOrgTypes.map(type => (
                      <Option key={type} value={type}>{type}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={6} lg={4}>
                <Form.Item name="country" label="Quốc gia">
                  <Select mode="multiple" placeholder="Chọn quốc gia..." allowClear className="select-control">
                    {uniqueCountries.map(country => (
                      <Option key={country} value={country}>{country}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={2} lg={4}>
                <Form.Item>
                  <Button 
                    onClick={handleReset} 
                    icon={<ReloadOutlined />} 
                    className="btn-reset"
                  >
                    Đặt lại
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>

        <Card 
          className="list-card"
          title={<span className="card-title">Danh sách Nhà cung cấp Dữ liệu <span className="count">({filteredData.length})</span></span>}
          bordered={false}
          bodyStyle={{ padding: 0 }}
        >
          <Table
            className="providers-table"
            columns={columns}
            dataSource={filteredData} 
            pagination={{ pageSize: 10 }}
            scroll={{ x: 'max-content' }}
            rowKey="providerId"
            size="middle"
            locale={{ emptyText: 'Không tìm thấy nhà cung cấp nào phù hợp.' }}
            onRow={(record) => ({
              onClick: () => openProviderDetails(record.providerId),
              style: { cursor: 'pointer' }
            })}
          />
        </Card>
      </div>

      {/* Provider Detail Modal */}
      <Modal
        title={providerDetail?.provider?.organizationName || 'Chi tiết Nhà cung cấp'}
        visible={detailVisible}
        onCancel={closeDetail}
        footer={null}
        width={1000}
        className="provider-detail-modal"
        centered={true}
        style={{ top: 0 }}
        bodyStyle={{ maxHeight: 'calc(100vh - 120px)', overflowY: 'auto', padding: '24px' }}
      >
        {detailLoading && (
          <div style={{ textAlign: 'center', padding: 24 }}>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 24, color: '#047857' }} spin />} />
          </div>
        )}

        {detailError && <Alert type="error" message="Lỗi" description={detailError} />}

        {!detailLoading && providerDetail && (
          <>
            <Card className="provider-info-card" bordered={false}>
              <Descriptions bordered column={2} size="small">
                <Descriptions.Item label={<strong>Tên tổ chức</strong>} span={2}>
                  <span style={{ color: '#047857', fontWeight: '700' }}>{providerDetail.provider.organizationName}</span>
                </Descriptions.Item>
                <Descriptions.Item label={<strong>Loại</strong>}>{providerDetail.provider.orgType}</Descriptions.Item>
                <Descriptions.Item label={<strong>Quốc gia</strong>}>{providerDetail.provider.country}</Descriptions.Item>
                <Descriptions.Item label={<strong>Email liên hệ</strong>} span={2}>{providerDetail.provider.contactEmail}</Descriptions.Item>
                <Descriptions.Item label={<strong>Đã xác thực</strong>}>
                  <Badge status={providerDetail.provider.isVerified ? "success" : "default"} text={providerDetail.provider.isVerified ? 'Có' : 'Không'} />
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Divider />

            <div>
              <h3 style={{ color: '#047857', marginBottom: 16, fontSize: 16, fontWeight: '700' }}>
                <DatabaseOutlined /> Tập dữ liệu ({(providerDetail.datasets || []).length})
              </h3>
              <List
                dataSource={providerDetail.datasets || []}
                grid={{ gutter: 16, column: 1 }}
                renderItem={item => (
                  <List.Item>
                    <Card 
                      className="dataset-item-card"
                      hoverable
                      onClick={() => openDatasetDetails(item.datasetId)}
                    >
                      <Row gutter={16} align="middle">
                        <Col span={18}>
                          <h4 style={{ color: '#046c4f', marginBottom: 8, cursor: 'pointer' }}>
                            <FileOutlined /> {item.title}
                          </h4>
                          <p style={{ color: '#6b7280', marginBottom: 12, fontSize: 13 }}>{item.shortDescription}</p>
                        </Col>
                        <Col span={6} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
                          {/* Nút Thuê đã được chuyển vào đây, gọi openRentModal */}
                          <Button 
                            type="primary" 
                            size="large"
                            icon={<DownloadOutlined />}
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              openRentModal(item.datasetId, item.title); 
                            }}
                            style={{ background: '#047857', borderColor: '#047857' }}
                          >
                            Thuê
                          </Button>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col xs={24} sm={12}>
                          <div className="dataset-info-item">
                            <span className="label">Loại dữ liệu:</span>
                            <span className="value">{item.dataTypes}</span>
                          </div>
                        </Col>
                        <Col xs={24} sm={12}>
                          <div className="dataset-info-item">
                            <span className="label">Khu vực:</span>
                            <span className="value">{item.region}</span>
                          </div>
                        </Col>
                        <Col xs={24} sm={12}>
                          <div className="dataset-info-item">
                            <span className="label">Loại pin:</span>
                            <span className="value">{item.batteryTypes || 'N/A'}</span>
                          </div>
                        </Col>
                        <Col xs={24} sm={12}>
                          <div className="dataset-info-item">
                            <span className="label">Ngày tạo:</span>
                            <span className="value"><ClockCircleOutlined /> {new Date(item.createdAt).toLocaleDateString('vi-VN')}</span>
                          </div>
                        </Col>
                      </Row>
                      <div style={{ marginTop: 12, textAlign: 'right' }}>
                        <Button type="link" onClick={(e) => { e.stopPropagation(); openDatasetDetails(item.datasetId); }} style={{ color: '#047857' }}>
                          Xem chi tiết →
                        </Button>
                      </div>
                    </Card>
                  </List.Item>
                )}
              />
            </div>
          </>
        )}
      </Modal>

      {/* Dataset Detail Drawer (Không thay đổi) */}
      <Drawer
        title={datasetDetail?.title || 'Chi tiết Tập dữ liệu'}
        placement="right"
        width={550}
        onClose={closeDatasetDetail}
        open={datasetDetailVisible}
        className="dataset-detail-drawer"
        bodyStyle={{ padding: '20px', overflowY: 'auto', maxHeight: '100vh' }}
      >
        {datasetDetailLoading && (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 24, color: '#047857' }} spin />} />
          </div>
        )}

        {datasetDetailError && <Alert type="error" message="Lỗi" description={datasetDetailError} style={{ marginBottom: 16 }} />}

        {!datasetDetailLoading && datasetDetail && (
          <>
            <div className="dataset-detail-content">
              {/* Thông tin cơ bản */}
              <div className="detail-section">
                <h4 style={{ color: '#047857', marginBottom: 12, fontWeight: '700' }}>Thông tin cơ bản</h4>
                <div className="descriptions-custom">
                  <div className="desc-row">
                    <div className="desc-label">Tiêu đề:</div>
                    <div className="desc-content"><strong>{datasetDetail.title}</strong></div>
                  </div>
                  <div className="desc-row">
                    <div className="desc-label">Mô tả:</div>
                    <div className="desc-content">{datasetDetail.longDescription}</div>
                  </div>
                  <div className="desc-row">
                    <div className="desc-label">Loại dữ liệu:</div>
                    <div className="desc-content"><Tag color="green">{datasetDetail.dataTypes}</Tag></div>
                  </div>
                  <div className="desc-row">
                    <div className="desc-label">Khu vực:</div>
                    <div className="desc-content">{datasetDetail.region}</div>
                  </div>
                  <div className="desc-row">
                    <div className="desc-label">Loại pin:</div>
                    <div className="desc-content">{datasetDetail.batteryTypes}</div>
                  </div>
                  <div className="desc-row">
                    <div className="desc-label">Loại giấy phép:</div>
                    <div className="desc-content"><Tag>{datasetDetail.licenseType}</Tag></div>
                  </div>
                  <div className="desc-row">
                    <div className="desc-label">Trạng thái:</div>
                    <div className="desc-content">
                      <Badge 
                        status={datasetDetail.status === 'approved' ? 'success' : 'processing'} 
                        text={datasetDetail.status === 'approved' ? 'Đã phê duyệt' : 'Chờ phê duyệt'} 
                        style={{ color: datasetDetail.status === 'approved' ? '#047857' : '#666' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Divider />

              {/* Thông tin nhà cung cấp */}
              <div className="detail-section">
                <h4 style={{ color: '#047857', marginBottom: 12, fontWeight: '700' }}>Nhà cung cấp</h4>
                <div className="descriptions-custom">
                  <div className="desc-row">
                    <div className="desc-label">Tên:</div>
                    <div className="desc-content"><strong>{datasetDetail.organizationName}</strong></div>
                  </div>
                  <div className="desc-row">
                    <div className="desc-label">Quốc gia:</div>
                    <div className="desc-content">{datasetDetail.organizationCountry}</div>
                  </div>
                  <div className="desc-row">
                    <div className="desc-label">Xác thực:</div>
                    <div className="desc-content">
                      <Badge 
                        status={datasetDetail.isProviderVerified ? 'success' : 'default'} 
                        text={datasetDetail.isProviderVerified ? 'Đã xác thực' : 'Chưa xác thực'} 
                        style={{ color: datasetDetail.isProviderVerified ? '#047857' : '#666' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Divider />

              {/* Phiên bản dữ liệu */}
              <div className="detail-section">
                <h4 style={{ color: '#047857', marginBottom: 12, fontWeight: '700' }}>Các phiên bản</h4>
                <List
                  dataSource={datasetDetail.versions || []}
                  renderItem={(version, idx) => (
                    <List.Item key={idx} style={{ paddingLeft: 0, paddingRight: 0, marginBottom: 16 }}>
                      <Card style={{ width: '100%', borderRadius: 10 }} bordered={false} className="version-card">
                        <Row gutter={12} style={{ marginBottom: 8 }}>
                          <Col span={12}>
                            <div className="version-info-item">
                              <span className="label">Phiên bản:</span>
                              <span className="value"><strong>{version.versionLabel}</strong></span>
                            </div>
                          </Col>
                          <Col span={12}>
                            <div className="version-info-item">
                              <span className="label">Định dạng:</span>
                              <span className="value">{version.fileFormat}</span>
                            </div>
                          </Col>
                          <Col span={12}>
                            <div className="version-info-item">
                              <span className="label">Kích thước:</span>
                              <span className="value">{(version.filesizeBytes / (1024 * 1024)).toFixed(2)} MB</span>
                            </div>
                          </Col>
                          <Col span={12}>
                            <div className="version-info-item">
                              <span className="label">Giá (lần tải):</span>
                              <span className="value" style={{ color: '#047857', fontWeight: '700' }}>${version.pricePerDownload}</span>
                            </div>
                          </Col>
                          <Col span={12}>
                            <div className="version-info-item">
                              <span className="label">Giá (GB):</span>
                              <span className="value" style={{ color: '#047857', fontWeight: '700' }}>${version.pricePerGB}/GB</span>
                            </div>
                          </Col>
                          <Col span={12}>
                            <div className="version-info-item">
                              <span className="label">Ngày tạo:</span>
                              <span className="value">{new Date(version.createdAt).toLocaleDateString('vi-VN')}</span>
                            </div>
                          </Col>
                        </Row>

                        {/* Download buttons */}
                        <Space style={{ width: '100%', marginTop: 12 }}>
                          {version.sampleUri && (
                            <Button 
                              type="dashed" 
                              size="small"
                              icon={<DownloadOutlined />}
                              onClick={() => handleDownloadDataset(version.sampleUri, `${datasetDetail.title}-${version.versionLabel}-sample`)}
                            >
                              Mẫu
                            </Button>
                          )}
                          {version.analysisReportUri && (
                            <Button 
                              type="dashed" 
                              size="small"
                              onClick={() => handleDownloadDataset(version.analysisReportUri, `${datasetDetail.title}-${version.versionLabel}-report`)}
                            >
                              Báo cáo
                            </Button>
                          )}
                        </Space>
                      </Card>
                    </List.Item>
                  )}
                />
              </div>
            </div>
          </>
        )}
      </Drawer>

      {/* === MODAL CHỌN SỐ NGÀY THUÊ === */}
      <Modal
        title={`Thuê Tập dữ liệu: ${rentDatasetTitle}`}
        visible={rentModalVisible}
        onCancel={() => setRentModalVisible(false)}
        footer={null}
        centered
      >
        <Form
          name="rent_duration"
          onFinish={handleSubscribe}
          initialValues={{ durationDays: 365 }}
          layout="vertical"
        >
          <Alert
            message="Lưu ý về Chi phí"
            description="Giá thuê được tính theo công thức: Số ngày thuê * 5000."
            type="info"
            showIcon
            style={{ marginBottom: 20 }}
          />
          <Form.Item
            label="Số ngày thuê (DurationDays)"
            name="durationDays"
           
          >
            <Input
              type="number"
              
              placeholder="Ví dụ: 365"
              size="large"
            />
          </Form.Item>
          <div style={{ textAlign: 'right' }}>
            <Button 
              type="default" 
              onClick={() => setRentModalVisible(false)} 
              style={{ marginRight: 8 }}
            >
              Hủy
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={rentLoading}
              style={{ background: '#047857', borderColor: '#047857' }}
            >
              {rentLoading ? 'Đang đăng ký...' : 'Xác nhận Thuê'}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* === MODAL HIỂN THỊ API KEY CHỈ MỘT LẦN === */}
      <Modal
        title="🎉 Đăng ký Thuê bao Thành công!"
        visible={apiKeyModalVisible}
        onCancel={() => setApiKeyModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setApiKeyModalVisible(false)}>
            Đóng
          </Button>
        ]}
        centered
        width={600}
      >
        {newApiKey && subscriptionDetails ? (
          <>
            <Alert
              message="CẢNH BÁO QUAN TRỌNG: API KEY CHỈ HIỂN THỊ MỘT LẦN!"
              description="Vui lòng sao chép và lưu trữ khóa API này ở nơi an toàn. Khóa này sẽ không được hiển thị lại vì lý do bảo mật."
              type="warning"
              showIcon
              style={{ marginBottom: 20 }}
            />
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="API Key Mới">
                <Input.Password
                  value={newApiKey}
                  readOnly
                  // Giả lập Input.Password luôn hiển thị key ban đầu nhưng có thể ẩn nếu người dùng click (tính năng mặc định của antd)
                  visibilityToggle={{ visible: true }}
                  style={{ fontWeight: 'bold', letterSpacing: '2px' }}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Mã Thuê bao">{subscriptionDetails.subscriptionId}</Descriptions.Item>
              <Descriptions.Item label="Hết hạn">{new Date(subscriptionDetails.expiresAt).toLocaleDateString('vi-VN')}</Descriptions.Item>
              <Descriptions.Item label="Thông báo">{subscriptionDetails.message}</Descriptions.Item>
            </Descriptions>
            <div style={{ marginTop: 15, textAlign: 'right' }}>
              <Button
                onClick={() => navigator.clipboard.writeText(newApiKey)}
                icon={<FileOutlined />}
              >
                Sao chép API Key
              </Button>
            </div>
          </>
        ) : (
          <Alert type="error" message="Không thể hiển thị khóa API." />
        )}
      </Modal>
    </div>
  );
};

export default DataProviderListPage;