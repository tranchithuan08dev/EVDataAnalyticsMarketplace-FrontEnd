import { useState } from 'react';
import { Card, Input, Select, Button, Pagination, Tag, Space } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Option } = Select;

// === COMPONENT CARD (NẰM TRONG CÙNG FILE) ===
const DatasetCard = ({ dataset }) => {
  return (
    <Card
      hoverable
      title={dataset.title}
      extra={<Link to={`/dataset/${dataset.id}`}>Xem</Link>}
      style={{ borderRadius: '12px', height: '100%' }}
      bodyStyle={{ padding: '1rem' }}
    >
      <Space direction="vertical" className="w-100">
        <Space>
          <Tag color="green">{dataset.region}</Tag>
          <Tag>{dataset.type}</Tag>
        </Space>
        <Space>
          <span><strong>Kích thước:</strong> {dataset.size}</span>
        </Space>
        <Space>
          <span><strong>Giá:</strong> {dataset.price}</span>
          <Tag color="blue">{dataset.format}</Tag>
        </Space>
      </Space>
    </Card>
  );
};

// === COMPONENT CHÍNH ===
export default function Explore() {
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 9;

  // Mock data
  const mockDatasets = Array(12).fill(null).map((_, i) => ({
    id: i + 1,
    title: `Bộ dữ liệu hành vi lái xe #${i + 1}`,
    region: ['Hà Nội', 'TP.HCM', 'Đà Nẵng'][i % 3],
    type: ['Hành vi', 'Pin', 'Sạc'][i % 3],
    size: `${(Math.random() * 50 + 10).toFixed(1)} GB`,
    price: i % 4 === 0 ? 'Miễn phí' : `${(Math.random() * 900 + 100).toFixed(0)}K ₫`,
    format: ['CSV', 'JSON', 'Parquet'][i % 3],
  }));

  const filtered = mockDatasets.filter(d =>
    d.title.toLowerCase().includes(search.toLowerCase()) &&
    (!region || d.region === region) &&
    (!type || d.type === type)
  );

  const currentData = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <section className="section-padding bg-light">
      <div className="container">
        <h1 className="display-5 fw-bold text-center mb-3">Khám phá dữ liệu</h1>
        <p className="text-center text-muted mb-5">
          Tìm kiếm hơn 500 bộ dữ liệu EV chất lượng cao
        </p>

        {/* Bộ lọc */}
        <Space className="w-100 mb-4" wrap>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Tìm kiếm dataset..."
            size="large"
            allowClear
            onChange={(e) => setSearch(e.target.value)}
            style={{ minWidth: 300 }}
          />
          <Select placeholder="Khu vực" size="large" allowClear onChange={setRegion} style={{ width: 180 }}>
            <Option value="Hà Nội">Hà Nội</Option>
            <Option value="TP.HCM">TP.HCM</Option>
            <Option value="Đà Nẵng">Đà Nẵng</Option>
          </Select>
          <Select placeholder="Loại dữ liệu" size="large" allowClear onChange={setType} style={{ width: 180 }}>
            <Option value="Hành vi">Hành vi</Option>
            <Option value="Pin">Pin</Option>
            <Option value="Sạc">Sạc</Option>
          </Select>
          <Button type="primary" size="large" icon={<FilterOutlined />}>
            Lọc
          </Button>
        </Space>

        {/* Danh sách dataset */}
        <div className="row g-4">
          {currentData.map((dataset) => (
            <div key={dataset.id} className="col-md-6 col-lg-4">
              <DatasetCard dataset={dataset} />
            </div>
          ))}
        </div>

        {/* Phân trang */}
        <div className="text-center mt-5">
          <Pagination
            current={page}
            total={filtered.length}
            pageSize={pageSize}
            onChange={setPage}
            showSizeChanger={false}
          />
        </div>
      </div>
    </section>
  );
}