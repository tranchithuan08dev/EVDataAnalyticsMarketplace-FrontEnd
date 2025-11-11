import { Card } from 'antd';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRightOutlined } from '@ant-design/icons';

const steps = [
  { title: "Đăng ký", desc: "Tạo tài khoản miễn phí cho tổ chức" },
  { title: "Tìm kiếm", desc: "Lọc dữ liệu theo khu vực, loại xe, pin" },
  { title: "Mua / Thuê", desc: "Thanh toán an toàn, truy cập ngay" },
  { title: "Phân tích", desc: "Dùng dashboard AI hoặc API" },
];

export default function HowItWorks() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section id="how-it-works" className="section-padding bg-light">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold">Hoạt động trong 4 bước</h2>
          <p className="lead text-muted">Đơn giản, minh bạch, hiệu quả</p>
        </div>

        <div ref={ref} className="d-none d-lg-flex align-items-center justify-content-center gap-5">
          {steps.map((step, index) => (
            <div key={index} className="d-flex align-items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className="shrink-0"
                style={{ width: '240px' }}
              >
                <Card
                  hoverable
                  className="text-center shadow-sm border-0"
                  style={{
                    borderRadius: '18px',
                    padding: '2rem 1.5rem',
                    minHeight: '200px',
                  }}
                >
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle text-white mb-3"
                    style={{
                      width: '52px',
                      height: '52px',
                      backgroundColor: '#22c55e',
                      fontSize: '1.35rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {index + 1}
                  </div>
                  <h5 className="fw-bold mb-2">{step.title}</h5>
                  <p className="text-muted small mb-0" style={{ lineHeight: '1.5' }}>
                    {step.desc}
                  </p>
                </Card>
              </motion.div>

              {index < steps.length - 1 && (
                <div className="mx-4 text-green" style={{ fontSize: '2.2rem' }}>
                  <ArrowRightOutlined />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="d-lg-none">
          <div className="row g-3">
            {steps.map((step, index) => (
              <div key={index} className="col-12 col-md-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    hoverable
                    className="text-center shadow-sm border-0"
                    style={{
                      borderRadius: '16px',
                      padding: '1.5rem',
                      minHeight: '160px',
                    }}
                  >
                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded-circle text-white mb-3"
                      style={{
                        width: '44px',
                        height: '44px',
                        backgroundColor: '#22c55e',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                      }}
                    >
                      {index + 1}
                    </div>
                    <h5 className="fw-bold mb-2">{step.title}</h5>
                    <p className="text-muted small mb-0">{step.desc}</p>
                  </Card>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}