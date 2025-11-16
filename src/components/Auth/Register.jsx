import { useState } from 'react';
import { Form, Input, Button, Card, Space, Alert, Typography, Radio } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, TeamOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const { Title, Text } = Typography;

// GUID mẫu cho mục đích demo khi đăng ký Tổ chức.
// Tổ chức: KHÔNG được null. Cá nhân: được null.
const DEFAULT_ORGANIZATION_ID = "22222222-2222-2222-2222-222222222222"; 

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userType, setUserType] = useState('individual'); // individual | organization
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    setError('');

    // 1. Kiểm tra mật khẩu xác nhận
    if (values.password !== values.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      setLoading(false);
      return;
    }

    // 2. Chuẩn bị dữ liệu gửi lên API
    const payload = {
      email: values.email,
      password: values.password,
      // 'displayName' tương ứng với 'fullName' (Họ và tên / Tên tổ chức)
      displayName: values.fullName, 
    };

    // 🎯 LOGIC XỬ LÝ organizationId theo loại người dùng
    if (userType === 'organization') {
        // Tổ chức: Phải có GUID
        payload.organizationId = DEFAULT_ORGANIZATION_ID; 
    } else {
        // Cá nhân: organizationId = null
        payload.organizationId = null; 
    }

    // Gỡ bỏ trường confirmPassword và teamSize (không cần gửi lên API register)
    // teamSize chỉ là trường phụ trên UI cho Tổ chức
    // console.log("Payload gửi đi:", payload); // Bạn có thể mở dòng này để kiểm tra dữ liệu trước khi gửi

    try {
      // 🚀 Gọi API register
      const response = await fetch('https://localhost:7297/api/Auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // Đọc thông báo lỗi chi tiết từ API nếu có
        const errorData = await response.json(); 
        // Lỗi 400 hoặc lỗi 500, cố gắng lấy thông báo từ server
        throw new Error(errorData.message || 'Lỗi server khi đăng ký người dùng. Email có thể đã được sử dụng.');
      }

      // Xử lý phản hồi thành công
      toast.success('Đăng ký thành công! Đang chuyển hướng...');
      setTimeout(() => navigate('/login'), 1500);

    } catch (err) {
      console.error('Lỗi đăng ký:', err);
      // Hiển thị lỗi cụ thể
      setError(err.message || 'Đăng ký thất bại. Vui lòng thử lại.');
      toast.error('Đăng ký thất bại');
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