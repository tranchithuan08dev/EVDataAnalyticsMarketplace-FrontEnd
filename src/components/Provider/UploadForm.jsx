import { Form, Input, Button, Upload, Card, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

export default function UploadForm() {
  const onFinish = (values) => {
    message.success('Đăng tải thành công! Đang chờ duyệt...');
  };

  return (
     <>
      <h2 className="mb-4 fw-bold">Đăng tải Dataset</h2>
      <Card style={{ maxWidth: 800 }}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="title" label="Tên dataset" rules={[{ required: true }]}>
            <Input placeholder="VD: Hành vi lái xe Hà Nội Q3 2025" />
          </Form.Item>
          <Form.Item name="desc" label="Mô tả" rules={[{ required: true }]}>
            <Input.TextArea rows={4} placeholder="Chi tiết về dữ liệu..." />
          </Form.Item>
          <Form.Item name="file" label="File dữ liệu" rules={[{ required: true }]}>
            <Upload accept=".csv,.json,.parquet" beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Chọn file</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large">
              Đăng tải
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}