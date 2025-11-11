export default function Footer() {
  return (
    <footer className="bg-dark text-white py-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4">
            <h5 className="text-green fw-bold">EV DataHub</h5>
            <p className="small text-muted">Chợ dữ liệu xe điện toàn cầu đầu tiên tại Việt Nam và khu vực.</p>
          </div>
          <div className="col-md-2 mb-4">
            <h6 className="fw-bold">Sản phẩm</h6>
            <ul className="list-unstyled small text-muted">
              <li><a href="#" className="text-muted text-decoration-none">Dữ liệu</a></li>
              <li><a href="#" className="text-muted text-decoration-none">API</a></li>
              <li><a href="#" className="text-muted text-decoration-none">Dashboard</a></li>
            </ul>
          </div>
          <div className="col-md-2 mb-4">
            <h6 className="fw-bold">Công ty</h6>
            <ul className="list-unstyled small text-muted">
              <li><a href="#" className="text-muted text-decoration-none">Giới thiệu</a></li>
              <li><a href="#" className="text-muted text-decoration-none">Bảo mật</a></li>
              <li><a href="#" className="text-muted text-decoration-none">Liên hệ</a></li>
            </ul>
          </div>
          <div className="col-md-4 text-md-end">
            <p className="small text-muted">© 2025 EV DataHub. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}