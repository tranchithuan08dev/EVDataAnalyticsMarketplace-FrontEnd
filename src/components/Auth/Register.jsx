import { useState } from 'react';
import { Form, Input, Button, Card, Space, Alert, Typography, Radio } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, TeamOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const { Title, Text } = Typography;

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userType, setUserType] = useState('individual'); // individual | organization
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    setError('');

    // Validate password
    if (values.password !== values.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      setLoading(false);
      return;
    }

    try {
      // TODO: Gọi API register
      // await fetch('/api/auth/register', { method: 'POST', body: JSON.stringify(values) });

      toast.success('Đăng ký thành công! Đang chuyển hướng...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError('Đăng ký thất bại. Vui lòng thử lại.');
      toast.error('Lỗi hệ thống');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <Card style={{ width: 480, borderRadius: '16px' }} className="shadow-lg">
        <div className="text-center mb-4">
          <Title level={2} className="text-success">Đăng ký tài khoản</Title>
          <Text type="secondary">Tham gia EV DataHub ngay hôm nay</Text>
        </div>

        {error && (
          <Alert message={error} type="error" showIcon className="mb-3" />
        )}

        <Form
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          {/* Loại tài khoản */}
          <Form.Item label="Bạn là?">
            <Radio.Group
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              buttonStyle="solid"
            >
              <Radio.Button value="individual">Cá nhân</Radio.Button>
              <Radio.Button value="organization">Tổ chức</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="fullName"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder={userType === 'organization' ? 'Tên tổ chức' : 'Họ và tên'}
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email công việc"
              size="large"
            />
          </Form.Item>

          {userType === 'organization' && (
            <Form.Item
              name="teamSize"
              rules={[{ required: true, message: 'Vui lòng chọn quy mô!' }]}
            >
              <Input
                prefix={<TeamOutlined />}
                placeholder="Số lượng thành viên (ví dụ: 10)"
                size="large"
              />
            </Form.Item>
          )}

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 8, message: 'Mật khẩu ít nhất 8 ký tự!' },
              { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: 'Mật khẩu cần chữ hoa, thường và số!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu (ít nhất 8 ký tự)"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Xác nhận mật khẩu"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              className="btn-success-custom"
            >
              Tạo tài khoản
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center">
          <Text>
            Đã có tài khoản? <Link to="/login" className="text-success">Đăng nhập</Link>
          </Text>
        </div>
      </Card>
    </div>
  );
}