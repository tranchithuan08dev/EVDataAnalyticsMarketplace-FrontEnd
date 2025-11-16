import { Card, Row, Col, Statistic, Button, Form, Input } from 'antd';
import { DollarOutlined, WalletOutlined } from '@ant-design/icons';


export default function RevenuePage() {
  return (
    <>
      <h2 className="mb-4 fw-bold">Doanh thu & Rút tiền</h2>
      <Row gutter={16} className="mb-5">
        <Col span={8}><Card><Statistic title="Tổng thu" value={2840000} prefix={<DollarOutlined />} suffix="₫" /></Card></Col>
        <Col span={8}><Card><Statistic title="Đã rút" value={1000000} suffix="₫" /></Card></Col>
        <Col span={8}><Card><Statistic title="Khả dụng" value={1840000} suffix="₫" valueStyle={{ color: '#22c55e' }} /></Card></Col>
      </Row>

      <Card title="Yêu cầu rút tiền" style={{ maxWidth: 600 }}>
        <Form layout="vertical">
          <Form.Item label="Số tiền (VNĐ)">
            <Input placeholder="Nhập số tiền" suffix="₫" />
          </Form.Item>
          <Form.Item label="Tài khoản nhận">
            <Input placeholder="Số tài khoản ngân hàng" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" icon={<WalletOutlined />}>Gửi yêu cầu</Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}