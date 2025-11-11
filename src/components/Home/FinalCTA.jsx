import { Button } from 'antd';

export default function FinalCTA() {
  return (
    <section className="section-padding text-center" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9f7ef 100%)' }}>
      <div className="container">
        <h2 className="display-4 fw-bold mb-4">Sẵn sàng khám phá dữ liệu EV?</h2>
        <p className="lead text-muted mb-5">
          Đăng ký miễn phí – Truy cập ngay 3 bộ dữ liệu mẫu
        </p>
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <Button type="primary" size="large" className="btn-primary-custom px-5" href="/register">
            Bắt đầu miễn phí
          </Button>
          <Button size="large" type="default" href="/explore">
            Xem dữ liệu mẫu
          </Button>
        </div>
      </div>
    </section>
  );
}