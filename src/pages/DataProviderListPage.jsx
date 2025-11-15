import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios'; // ⭐️ Import axios
import { Table, Select, Input, Form, Button, Row, Col, Tag, Card, Spin, Alert } from 'antd'; // ⭐️ Thêm Spin, Alert
import { SearchOutlined, FilterOutlined, ReloadOutlined, LoadingOutlined } from '@ant-design/icons';

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
        
        // Gán key cho mỗi item để Ant Design Table hoạt động (nếu API không có)
        const dataWithKeys = response.data.map(item => ({ 
            ...item, 
            key: item.providerId 
        }));
        
        setRawData(dataWithKeys);
        setFilteredData(dataWithKeys); // Khởi tạo dữ liệu lọc ban đầu
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
  const uniqueOrgTypes = useMemo(() => [...new Set(rawData.map(item => item.orgType))], [rawData]);
  const uniqueCountries = useMemo(() => [...new Set(rawData.map(item => item.country))], [rawData]);

  // Hàm xử lý việc lọc và tìm kiếm
  const handleFilter = (values) => {
    let currentData = rawData;
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
    // Sử dụng searchText từ state thay vì searchName từ form (dùng cho thanh Search)
    const searchLower = (searchName || searchText).toLowerCase().trim(); 
    if (searchLower) {
      currentData = currentData.filter(item =>
        item.organizationName.toLowerCase().includes(searchLower) ||
        item.organizationDescription.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredData(currentData);
  };

  // Cập nhật tìm kiếm khi searchText thay đổi (ví dụ: khi gõ trong ô Search)
  useEffect(() => {
    // Chỉ chạy khi rawData đã tải xong
    if (rawData.length > 0 || !loading) {
      form.validateFields()
          .then(values => {
              // Gộp giá trị form và searchText để lọc lại
              handleFilter({ ...values, searchName: searchText }); 
          })
          .catch(() => {
              // Bỏ qua lỗi validation
          });
    }
  }, [searchText, rawData, loading]); // eslint-disable-line react-hooks/exhaustive-deps

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
          <a style={{ color: '#1890ff', fontWeight: 'bold' }}>{text}</a>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{record.organizationDescription}</div>
        </>
      ),
    },
    {
      title: 'Loại',
      dataIndex: 'orgType',
      key: 'orgType',
      width: '10%',
      render: (type) => <Tag color="#1890ff">{type}</Tag>,
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
          {tags.map(tag => (
            <Tag color="green" key={tag} style={{ marginBottom: '4px' }}>
              {tag.toUpperCase().replace('_', ' ')}
            </Tag>
          ))}
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
      render: (price) => price ? `$${price.toFixed(2)}` : 'N/A',
    },
  ];

  // ===================================================================
  // Phần UI
  // ===================================================================

  if (loading) {
    // Hiển thị loading khi đang tải dữ liệu
    const antIcon = <LoadingOutlined style={{ fontSize: 24, color: '#005c99' }} spin />;
    return (
        <div style={{ 
            padding: '24px', 
            backgroundColor: '#f0f2f5', 
            minHeight: '100vh', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center' 
        }}>
            <Spin indicator={antIcon} tip="Đang tải dữ liệu nhà cung cấp..." size="large" />
        </div>
    );
  }

  if (error) {
    // Hiển thị lỗi nếu không tải được dữ liệu
    return (
      <div style={{ padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
        <Alert
          message="Lỗi Tải Dữ liệu"
          description={error}
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      
      {/* Tiêu đề trang */}
      <h2 style={{ color: '#005c99', marginBottom: '24px' }}>
        <SearchOutlined style={{ marginRight: '8px' }} />
        Tìm kiếm & Khám phá Nhà cung cấp Dữ liệu EV
      </h2>

      {/* Vùng Lọc và Tìm kiếm */}
      <Card 
        title={<span style={{ color: '#005c99' }}><FilterOutlined /> Bộ lọc Dữ liệu</span>} 
        bordered={false}
        style={{ marginBottom: '24px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
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
              <Form.Item label="Tìm kiếm theo Tên/Mô tả">
                <Search
                  placeholder="Nhập tên tổ chức hoặc mô tả..."
                  enterButton={<SearchOutlined />}
                  size="large"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onSearch={(value) => setSearchText(value)}
                />
              </Form.Item>
            </Col>

            {/* Bộ lọc Loại Tổ chức */}
            <Col xs={24} sm={12} md={6} lg={4}>
              <Form.Item name="orgType" label="Loại Tổ chức">
                <Select mode="multiple" placeholder="Chọn loại..." allowClear style={{ width: '100%' }}>
                  {uniqueOrgTypes.map(type => (
                    <Option key={type} value={type}>{type}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {/* Bộ lọc Quốc gia */}
            <Col xs={24} sm={12} md={6} lg={4}>
              <Form.Item name="country" label="Quốc gia">
                <Select mode="multiple" placeholder="Chọn quốc gia..." allowClear style={{ width: '100%' }}>
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
                  style={{ width: '100%', marginTop: '32px' }}
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
        title={<span style={{ color: '#005c99' }}>Danh sách Nhà cung cấp Dữ liệu ({filteredData.length} kết quả)</span>}
        bordered={false}
        style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
        bodyStyle={{ padding: 0 }}
      >
        <Table
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
  );
};

export default DataProviderListPage;