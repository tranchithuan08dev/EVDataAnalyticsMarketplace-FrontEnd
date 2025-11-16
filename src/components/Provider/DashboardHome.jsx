import { Card, Row, Col, Statistic, Table, Tag, Button } from 'antd';
import { DollarOutlined, DatabaseOutlined, DownloadOutlined, EyeOutlined } from '@ant-design/icons';


const recent = [
  { id: 1, title: "Hành vi lái xe Hà Nội #12", views: 245, downloads: 12, revenue: 850000 },
  { id: 2, title: "Pin hiệu suất VF8", views: 189, downloads: 8, revenue: 680000 },
];

const columns = [
  { title: 'Tên', dataIndex: 'title', key: 'title' },
  { title: 'Lượt xem', dataIndex: 'views', render: v => <><EyeOutlined /> {v}</> },
  { title: 'Tải', dataIndex: 'downloads', render: v => <><DownloadOutlined /> {v}</> },
  { title: 'Doanh thu', dataIndex: 'revenue', render: v => `${(v/1000).toFixed(0)}K ₫` },
  { title: '', render: () => <Tag color="green">Đã duyệt</Tag> },
];

export default function DashboardHome() {
  return (
    <>
      <h2 className="mb-4 fw-bold">Tổng quan</h2>
      <Row gutter={16} className="mb-5">
        <Col xs={12} md={6}><Card><Statistic title="Doanh thu" value={2840000} prefix={<DollarOutlined />} suffix="₫" valueStyle={{ color: '#22c55e' }} /></Card></Col>
        <Col xs={12} md={6}><Card><Statistic title="Dataset" value={24} prefix={<DatabaseOutlined />} /></Card></Col>
        <Col xs={12} md={6}><Card><Statistic title="Tải xuống" value={156} /></Card></Col>
        <Col xs={12} md={6}><Card><Statistic title="Số dư" value={1840000} suffix="₫" valueStyle={{ color: '#22c55e' }} /></Card></Col>
      </Row>
      <Card title="Gần đây" extra={<Button type="link">Xem tất cả</Button>}>
        <Table dataSource={recent} columns={columns} pagination={false} />
      </Card>
    </>
  );
}