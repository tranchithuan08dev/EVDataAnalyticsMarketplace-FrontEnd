import { Card } from 'antd';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  CarOutlined,
  ThunderboltOutlined,
  PoweroffOutlined,     // Thay cho ChargingPileOutlined
  SwapOutlined,
  EnvironmentOutlined,
  HeatMapOutlined,
} from '@ant-design/icons';

const categories = [
  { icon: CarOutlined, title: "Hành vi lái xe", count: "120 bộ" },
  { icon: ThunderboltOutlined, title: "Hiệu suất pin", count: "95 bộ" },
  { icon: PoweroffOutlined, title: "Dữ liệu sạc", count: "80 bộ" },     // Dùng PoweroffOutlined
  { icon: SwapOutlined, title: "V2G & Grid", count: "60 bộ" },
  { icon: EnvironmentOutlined, title: "Tuyến đường", count: "75 bộ" },
  { icon: HeatMapOutlined, title: "Nhiệt độ & môi trường", count: "50 bộ" },
];

export default function DataCategories() {
  const [ref, inView] = useInView({ 
    triggerOnce: false, 
    threshold: 0.3,
    rootMargin: '0px 0px -100px 0px'
  });

  return (
    <section className="section-padding bg-white">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold">Danh mục dữ liệu</h2>
          <p className="lead text-muted">Hàng trăm bộ dữ liệu chất lượng cao</p>
        </div>

        <div ref={ref} className="row g-4 justify-content-center">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <div key={i} className="col-6 col-md-4 col-lg-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="h-100"
                >
                  <Card
                    hoverable
                    className="h-100 text-center border-0 shadow-sm d-flex flex-column justify-content-center align-items-center"
                    style={{
                      borderRadius: '16px',
                      padding: '1.5rem 1rem',
                      minHeight: '140px',
                    }}
                  >
                    <Icon className="text-green" style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }} />
                    <h6 className="fw-bold mb-1" style={{ fontSize: '0.9rem' }}>
                      {cat.title}
                    </h6>
                    <small className="text-muted">{cat.count}</small>
                  </Card>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}