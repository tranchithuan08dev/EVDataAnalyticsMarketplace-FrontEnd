import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios'; 
import { Table, Select, Input, Form, Button, Row, Col, Tag, Card, Spin, Alert } from 'antd'; // ⭐️ Thêm Spin, Alert
import { SearchOutlined, FilterOutlined, ReloadOutlined, LoadingOutlined } from '@ant-design/icons';
import './DataProviderListPage.css'; 

const { Option } = Select;
const { Search } = Input;

// URL API
const API_URL = 'http://localhost:8000/api/provider/DataProvider';

const DataProviderListPage = () => {
  const [form] = Form.useForm();
  
  // State chứa dữ liệu gốc từ API
  const [rawData, setRawData] = useState([]);
  
  // State chứa dữ liệu đã lọc để hiển thị trên Table
  const [filteredData, setFilteredData] = useState([]);
  
  // State cho thanh tìm kiếm
  const [searchText, setSearchText] = useState('');
  
  // State cho trạng thái loading và lỗi
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ⭐️ useEffect để Fetch dữ liệu khi component được mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_URL);
        const apiList = Array.isArray(response.data) ? response.data : (response.data.items || []);

        // Map và lọc: dùng chỉ activeDatasets, loại bỏ provider không có active datasets
        const dataWithKeys = apiList
          .map(item => ({
            ...item,
            key: item.providerId,
            totalDatasets: Number(item.activeDatasets) || 0, // dùng activeDatasets
          }))
          .filter(p => p.totalDatasets > 0); // loại bỏ provider có 0 active datasets

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

  // Lấy các giá trị duy nhất cho các bộ lọc (chạy lại khi rawData thay đổi)
  const uniqueOrgTypes = useMemo(() => [...new Set(rawData.map(item => item.orgType).filter(Boolean))], [rawData]);
  const uniqueCountries = useMemo(() => [...new Set(rawData.map(item => item.country).filter(Boolean))], [rawData]);

  // Hàm xử lý việc lọc và tìm kiếm
  const handleFilter = (values = {}) => {
    let currentData = rawData || [];
    const { orgType, country, searchName } = values;

    // 1. Lọc theo orgType
    if (orgType && orgType.length > 0) {
      currentData = currentData.filter(item => orgType.includes(item.orgType));
    }

    // 2. Lọc theo country
    if (country && country.length > 0) {
      currentData = currentData.filter(item => country.includes(item.country));
    }

    // 3. Tìm kiếm theo tên/mô tả
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

  // Cập nhật tìm kiếm khi searchText thay đổi (ví dụ: khi gõ trong ô Search)
  useEffect(() => {
    // Lấy giá trị current của form (không rely vào validateFields) và gộp searchText
    const formValues = form.getFieldsValue();
    handleFilter({ ...formValues, searchName: searchText });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, rawData, loading]);

  // Xử lý Reset Form
  const handleReset = () => {
    form.resetFields();
    setSearchText('');
    setFilteredData(rawData); // Reset về dữ liệu gốc đã tải
  };

  // Định nghĩa các cột cho Table (giữ nguyên)
  const columns = [
    {
      title: 'Tổ chức',
      dataIndex: 'organizationName',
      key: 'organizationName',
      width: '20%',
      render: (text, record) => (
        <>
          <a style={{ color: '#046c4f', fontWeight: '700' }}>{text}</a>
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

  // ===================================================================
  // Phần UI
  // ===================================================================

  if (loading) {
    // Hiển thị loading khi đang tải dữ liệu
    const antIcon = <LoadingOutlined style={{ fontSize: 24, color: '#047857' }} spin />;
    return (
        <div className="data-provider-page loading-screen">
            <Spin indicator={antIcon} tip="Đang tải dữ liệu nhà cung cấp..." size="large" />
        </div>
    );
  }

  if (error) {
    // Hiển thị lỗi nếu không tải được dữ liệu
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
            // Sử dụng onValuesChange để tự động lọc khi Select thay đổi
            onValuesChange={(_, values) => handleFilter({ ...values, searchName: searchText })}
            layout="vertical"
            initialValues={{ orgType: [], country: [] }}
          >
            <Row gutter={24} align="bottom">
              
              {/* Thanh Tìm kiếm chung */}
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

              {/* Bộ lọc Loại Tổ chức */}
              <Col xs={24} sm={12} md={6} lg={4}>
                <Form.Item name="orgType" label="Loại Tổ chức">
                  <Select mode="multiple" placeholder="Chọn loại..." allowClear className="select-control">
                    {uniqueOrgTypes.map(type => (
                      <Option key={type} value={type}>{type}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              {/* Bộ lọc Quốc gia */}
              <Col xs={24} sm={12} md={6} lg={4}>
                <Form.Item name="country" label="Quốc gia">
                  <Select mode="multiple" placeholder="Chọn quốc gia..." allowClear className="select-control">
                    {uniqueCountries.map(country => (
                      <Option key={country} value={country}>{country}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              {/* Nút Reset */}
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

export default DataProviderListPage;