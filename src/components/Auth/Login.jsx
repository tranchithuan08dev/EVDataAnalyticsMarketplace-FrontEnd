import { useState } from 'react';
import { Form, Input, Button, Card, Space, Alert, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const { Title, Text } = Typography;

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://localhost:7297/api/Auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Email hoặc mật khẩu không đúng.');
      }

      const data = await response.json();

      // ===== LƯU TOKEN + ROLE =====
      if (data.token) {
        localStorage.setItem('authToken', data.token);

        if (data.role) {
          localStorage.setItem('userRole', data.role);
        }
      } else {
        throw new Error('Đăng nhập thành công nhưng không nhận được token.');
      }

      toast.success('Đăng nhập thành công! Đang chuyển hướng...');

      // ===== ĐIỀU HƯỚNG THEO ROLE (role = số) =====
      setTimeout(() => {
        const role =data.role
        if (role === 'admin') {
          navigate('/admin');
        } else if (role === 'provider') {
          navigate('/provider');
        } else if (role === 'consumer') {
          navigate('/providerList/comsumer');
        } else {
          navigate('/');
        }
      }, 1200);

    } catch (err) {
      console.error('Lỗi đăng nhập:', err);
      setError(err.message || 'Email hoặc mật khẩu không đúng');
      toast.error('Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <Card style={{ width: 420, borderRadius: '16px' }} className="shadow-lg">
        <div className="text-center mb-4">
          <Title level={2} className="text-success">Đăng nhập</Title>
          <Text type="secondary">Truy cập kho dữ liệu EV</Text>
        </div>

        {error && (
          <Alert message={error} type="error" showIcon className="mb-3" />
        )}

        <Form
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 6, message: 'Mật khẩu ít nhất 6 ký tự!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
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
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        <Space direction="vertical" className="w-100 text-center">
          <Text>
            Chưa có tài khoản? <Link to="/register" className="text-success">Đăng ký ngay</Link>
          </Text>
          <Link to="/forgot-password" className="text-muted small">
            Quên mật khẩu?
          </Link>
        </Space>
      </Card>
    </div>
  );
}
