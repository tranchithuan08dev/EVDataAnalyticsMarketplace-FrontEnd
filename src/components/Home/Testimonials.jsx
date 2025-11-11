import { Card, Avatar } from 'antd';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MessageOutlined } from '@ant-design/icons';

const testimonials = [
  {
    name: "Nguyễn Văn A",
    role: "CTO, VinFast",
    content: "Dữ liệu hành vi lái xe giúp chúng tôi tối ưu pin lên 18%.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    name: "Lê Thị B",
    role: "Data Scientist, FPT",
    content: "API ổn định, tài liệu rõ ràng, tích hợp chỉ trong 2 ngày.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    name: "Trần C",
    role: "CEO, EV Startup",
    content: "Đã mua 12 bộ dữ liệu sạc, giúp gọi vốn Series A thành công.",
    avatar: "https://randomuser.me/api/portraits/men/86.jpg"
  },
];

export default function Testimonials() {
  const [ref, inView] = useInView({ 
    triggerOnce: false, 
    threshold: 0.3,
    rootMargin: '0px 0px -100px 0px'
  });

  return (
    <section className="section-padding bg-white">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold">Khách hàng nói gì</h2>
          <p className="lead text-muted">Hàng trăm tổ chức tin dùng</p>
        </div>
        <div ref={ref} className="row g-4">
          {testimonials.map((t, i) => (
            <div key={i} className="col-lg-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.2 }}
              >
                <Card className="h-100 border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                  <MessageOutlined className="text-green" style={{ fontSize: '2rem', opacity: 0.3 }} />
                  <p className="mt-3 mb-4 text-muted" style={{ fontStyle: 'italic' }}>
                    "{t.content}"
                  </p>
                  <div className="d-flex align-items-center">
                    <Avatar src={t.avatar} size={50} />
                    <div className="ms-3">
                      <h6 className="mb-0 fw-bold">{t.name}</h6>
                      <small className="text-muted">{t.role}</small>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}