import { Card } from 'antd';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { DatabaseOutlined, SearchOutlined, ApiOutlined, DollarCircleOutlined, LockOutlined, BarChartOutlined } from '@ant-design/icons';

const features = [
  { icon: <SearchOutlined />, title: "Tìm kiếm thông minh", desc: "Lọc theo khu vực, loại xe, pin, thời gian, định dạng" },
  { icon: <DatabaseOutlined />, title: "Dữ liệu đa dạng", desc: "Raw data, dashboard, báo cáo AI, API realtime" },
  { icon: <DollarCircleOutlined />, title: "Mô hình linh hoạt", desc: "Mua lượt, thuê bao, API, chia sẻ doanh thu" },
  { icon: <ApiOutlined />, title: "API mạnh mẽ", desc: "Tích hợp dễ dàng với fleet, bảo hiểm, smart city" },
  { icon: <LockOutlined />, title: "Bảo mật & GDPR", desc: "Ẩn danh hóa, mã hóa, kiểm toán truy cập" },
  { icon: <BarChartOutlined />, title: "Phân tích AI", desc: "Dự báo nhu cầu sạc, xu hướng pin, CO₂ tiết kiệm" },
];

export default function FeaturesSection() {
  const [ref, inView] = useInView({ 
    triggerOnce: false, 
    threshold: 0.3,
    rootMargin: '0px 0px -100px 0px'
  });

  return (
    <section id="features" className="section-padding bg-light">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold">Tính năng nổi bật</h2>
          <p className="lead text-muted">Được thiết kế cho cả nhà cung cấp và người dùng dữ liệu</p>
        </div>
        <div ref={ref} className="row g-4">
          {features.map((feat, idx) => (
            <motion.div
              key={idx}
              className="col-md-4"
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <Card hoverable className="h-100 text-center border-0 shadow-sm">
                <div className="text-green mb-3" style={{ fontSize: '2.5rem' }}>
                  {feat.icon}
                </div>
                <h5 className="fw-bold">{feat.title}</h5>
                <p className="text-muted small">{feat.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}