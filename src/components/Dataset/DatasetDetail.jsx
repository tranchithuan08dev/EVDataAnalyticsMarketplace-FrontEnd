import React, { useState } from 'react';
import { useParams, Link, } from 'react-router-dom';
import { Card, Button, Tag, Space, Divider, Alert, Table, Typography, Radio } from 'antd';
import { ArrowLeftOutlined, DownloadOutlined, ShoppingCartOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

// === MOCK DATA ===
const mockDataset = {
  id: 1,
  title: "Bộ dữ liệu hành vi lái xe #1",
  description: "Thu thập từ 500 xe điện tại Hà Nội trong 6 tháng. Bao gồm tốc độ, gia tốc, phanh, thời gian sạc, vị trí GPS, nhiệt độ pin.",
  region: "Hà Nội",
  type: "Hành vi lái xe",
  size: "28.4 GB",
  format: "CSV, JSON",
  priceBuy: "850.000 ₫",      // Giá mua
  priceRent: "250.000 ₫",     // Giá thuê
  samples: 500,
  duration: "6 tháng",
  updated: "2025-10-28",
  columns: [
    { title: 'Trường', dataIndex: 'field', key: 'field' },
    { title: 'Mô tả', dataIndex: 'desc', key: 'desc' },
    { title: 'Đơn vị', dataIndex: 'unit', key: 'unit' },
  ],
  data: [
    { key: 1, field: 'timestamp', desc: 'Thời gian ghi nhận', unit: 'ISO 8601' },
    { key: 2, field: 'speed', desc: 'Tốc độ tức thời', unit: 'km/h' },
    { key: 3, field: 'acceleration', desc: 'Gia tốc', unit: 'm/s²' },
    { key: 4, field: 'battery_soc', desc: 'Mức pin', unit: '%' },
    { key: 5, field: 'gps_lat', desc: 'Vĩ độ', unit: 'độ' },
    { key: 6, field: 'gps_lng', desc: 'Kinh độ', unit: 'độ' },
  ],
};

// === COMPONENT CARD MẪU ===
const SamplePreview = () => (
  <Card title="Xem trước 5 dòng dữ liệu" style={{ borderRadius: '12px' }} className="shadow-sm">
    <div className="table-responsive">
      <table className="table table-sm table-bordered">
        <thead className="table-light">
          <tr>
            <th>timestamp</th>
            <th>speed</th>
            <th>battery_soc</th>
            <th>gps_lat</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>2025-04-01T08:00:00Z</td><td>45.2</td><td>78%</td><td>21.0285</td></tr>
          <tr><td>2025-04-01T08:00:05Z</td><td>46.1</td><td>77.9%</td><td>21.0286</td></tr>
          <tr><td>2025-04-01T08:00:10Z</td><td>44.8</td><td>77.8%</td><td>21.0287</td></tr>
          <tr><td>2025-04-01T08:00:15Z</td><td>43.5</td><td>77.7%</td><td>21.0288</td></tr>
          <tr><td>2025-04-01T08:00:20Z</td><td>42.9</td><td>77.6%</td><td>21.0289</td></tr>
        </tbody>
      </table>
    </div>
  </Card>
);

// === COMPONENT CHÍNH ===
export default function DatasetDetail() {
  const { id } = useParams();
  const [purchaseType, setPurchaseType] = useState('buy'); // 'buy' hoặc 'rent'
  const dataset = mockDataset;

  const currentPrice = purchaseType === 'buy' ? dataset.priceBuy : dataset.priceRent;
  const currentLabel = purchaseType === 'buy' ? 'Mua ngay' : 'Thuê 30 ngày';

  return (
    <section className="section-padding bg-light">
      <div className="container">
        <Link to="/explore" className="text-decoration-none mb-4 d-inline-block">
          <ArrowLeftOutlined /> Quay lại danh sách
        </Link>

        <div className="row g-5">
          <div className="col-lg-8">
            <Card style={{ borderRadius: '16px' }} className="shadow-sm">
              <Title level={2}>{dataset.title}</Title>

              <Space className="mb-3">
                <Tag color="green">{dataset.region}</Tag>
                <Tag color="blue">{dataset.type}</Tag>
              </Space>

              <Paragraph className="text-muted">
                {dataset.description}
              </Paragraph>

              <Divider />

              <div className="row text-center text-md-start">
                <div className="col-6 col-md-3 mb-3">
                  <Text strong>Kích thước</Text><br />
                  <Text type="secondary">{dataset.size}</Text>
                </div>
                <div className="col-6 col-md-3 mb-3">
                  <Text strong>Định dạng</Text><br />
                  <Text type="secondary">{dataset.format}</Text>
                </div>
                <div className="col-6 col-md-3 mb-3">
                  <Text strong>Mẫu xe</Text><br />
                  <Text type="secondary">{dataset.samples} xe</Text>
                </div>
                <div className="col-6 col-md-3 mb-3">
                  <Text strong>Thời gian</Text><br />
                  <Text type="secondary">{dataset.duration}</Text>
                </div>
              </div>

              <Divider />

              <Title level={4}>Cấu trúc dữ liệu</Title>
              <Table
                dataSource={dataset.data}
                columns={dataset.columns}
                pagination={false}
                size="small"
                className="mb-4"
              />

              <SamplePreview />
            </Card>
          </div>

          <div className="col-lg-4">
            <Card
              style={{ borderRadius: '16px', position: 'sticky', top: '100px' }}
              className="shadow-sm"
            >
              <div className="text-center">
                <Title level={3} className="text-success">{currentPrice}</Title>
                <Text type="secondary" className="d-block mb-3">
                  Cập nhật: {dataset.updated}
                </Text>
              </div>

              {/* Lựa chọn Mua/Thuê */}
              <Radio.Group
                onChange={(e) => setPurchaseType(e.target.value)}
                value={purchaseType}
                className="mb-4"
              >
                <Space direction="vertical" className="w-100">
                  <Radio value="buy">
                    <Text strong>Mua vĩnh viễn</Text>
                    <br />
                    <Text type="secondary" className="small">{dataset.priceBuy} - Quyền sử dụng không giới hạn</Text>
                  </Radio>
                  <Radio value="rent">
                    <Text strong>Thuê 30 ngày</Text>
                    <br />
                    <Text type="secondary" className="small">{dataset.priceRent} - Truy cập tạm thời</Text>
                  </Radio>
                </Space>
              </Radio.Group>

              <Space direction="vertical" className="w-100" size="middle">
                <Button
                  type="primary"
                  size="large"
                  block
                  icon={<ShoppingCartOutlined />}
                  className="btn-success-custom"
                >
                  {currentLabel}
                </Button>

                <Button
                  size="large"
                  block
                  icon={<DownloadOutlined />}
                  href="/sample.csv"
                  download
                >
                  Tải mẫu miễn phí
                </Button>
              </Space>

              <Divider />

              <Alert
                message="Đảm bảo chất lượng"
                description="Dữ liệu được kiểm duyệt bởi chuyên gia EV. Hoàn tiền 100% nếu không hài lòng."
                type="success"
                showIcon
                className="mt-3"
              />
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}