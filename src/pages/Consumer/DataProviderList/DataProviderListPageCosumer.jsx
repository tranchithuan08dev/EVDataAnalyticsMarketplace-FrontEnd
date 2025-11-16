// File: DataProviderListPage.jsx

import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { Table, Select, Input, Form, Button, Row, Col, Tag, Card, Spin, Alert } from 'antd';
import { SearchOutlined, FilterOutlined, ReloadOutlined, LoadingOutlined } from '@ant-design/icons';
// ⭐️ IMPORT THÊM useNavigate
import { useNavigate } from 'react-router-dom'; 

import './DataProviderListPage.css';

const { Option } = Select;
const { Search } = Input;

// URL API
const API_URL = 'http://localhost:8000/api/provider/DataProvider';

const DataProviderListPageCosumer = () => {
  const [form] = Form.useForm();
  // ⭐️ Khởi tạo navigate
  const navigate = useNavigate();

  const [rawData, setRawData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ⭐️ Xử lý click vào tên tổ chức (CHUYỂN HƯỚNG SANG TRANG CHI TIẾT)
  const handleViewDetail = (providerId) => {
    console.log("Providerid", providerId);
    
    // Chuyển hướng đến đường dẫn /provider/:providerId
    navigate(`/provider/comsumer/${providerId}`); 
  };

  // --- Logic fetch data, useMemo, handleFilter, handleReset (Giữ nguyên) ---
  
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
  
  // --- Định nghĩa Cột (Cập nhật render Tổ chức) ---

  const columns = [
    {
      title: 'Tổ chức',
      dataIndex: 'organizationName',
      key: 'organizationName',
      width: '20%',
      // ⭐️ CẬP NHẬT render để sử dụng handleViewDetail
      render: (text, record) => (
        <>
          <a
            style={{ color: '#046c4f', fontWeight: '700', cursor: 'pointer' }}
            onClick={() => handleViewDetail(record.providerId)} 
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

  // --- UI hiển thị Danh sách ---

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
        {/* Tiêu đề trang */}
        <h2 className="page-title">
          <SearchOutlined className="page-title-icon" />
          Tìm kiếm & Khám phá Nhà cung cấp Dữ liệu EV
        </h2>

        {/* Vùng Lọc và Tìm kiếm */}
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

        {/* Bảng Hiển thị Kết quả */}
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
          />
        </Card>
      </div>
    </div>
  );
};

export default DataProviderListPageCosumer;