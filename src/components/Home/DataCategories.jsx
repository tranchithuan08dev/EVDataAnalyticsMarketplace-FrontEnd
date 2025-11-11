import { Card } from 'antd';
import { CarOutlined, ThunderboltOutlined, GlobalOutlined, DashboardOutlined } from '@ant-design/icons';

const categories = [
  { icon: <CarOutlined />, title: "Hành vi lái xe", color: "#10b981" },
  { icon: <ThunderboltOutlined />, title: "Hiệu suất pin", color: "#f59e0b" },
  { icon: <GlobalOutlined />, title: "Sử dụng trạm sạc", color: "#3b82f6" },
  { icon: <DashboardOutlined />, title: "Giao dịch V2G", color: "#8b5cf6" },
];

export default function DataCategories() {
  return (
    <section id="categories" className="section-padding">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold">Danh mục dữ liệu</h2>
          <p className="lead text-muted">Hàng trăm bộ dữ liệu được cập nhật hàng ngày</p>
        </div>
        <div className="row g-4">
          {categories.map((cat, idx) => (
            <div key={idx} className="col-md-3">
              <Card
                hoverable
                className="text-center h-100"
                style={{ borderRadius: '16px' }}
                onClick={() => window.location.href = `/search?category=${cat.title}`}
              >
                <div style={{ fontSize: '3rem', color: cat.color, marginBottom: '1rem' }}>
                  {cat.icon}
                </div>
                <h5 className="fw-bold">{cat.title}</h5>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}