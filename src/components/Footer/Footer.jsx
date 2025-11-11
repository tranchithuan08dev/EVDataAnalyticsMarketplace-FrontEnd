export default function Footer() {
  return (
    <footer className="bg-dark text-white py-5">
      <div className="container">
        <div className="row gy-4">
          {/* Cột 1: Logo + Mô tả */}
          <div className="col-lg-4">
            <h5 className="text-green fw-bold mb-3">EV DataHub</h5>
            <p className="small text-white opacity-75 mb-0">
              Chợ dữ liệu xe điện đầu tiên tại Việt Nam.<br />
              Kết nối OEM, startup, nhà nghiên cứu.
            </p>
          </div>

          {/* Cột 2: Sản phẩm */}
          <div className="col-lg-2 col-6">
            <h6 className="fw-bold text-white mb-3">Sản phẩm</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><a href="#" className="text-white text-decoration-none opacity-75 hover-opacity-100">Dữ liệu</a></li>
              <li className="mb-2"><a href="#" className="text-white text-decoration-none opacity-75 hover-opacity-100">API</a></li>
              <li className="mb-2"><a href="#" className="text-white text-decoration-none opacity-75 hover-opacity-100">Dashboard</a></li>
            </ul>
          </div>

          {/* Cột 3: Công ty */}
          <div className="col-lg-2 col-6">
            <h6 className="fw-bold text-white mb-3">Công ty</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><a href="#" className="text-white text-decoration-none opacity-75 hover-opacity-100">Về chúng tôi</a></li>
              <li className="mb-2"><a href="#" className="text-white text-decoration-none opacity-75 hover-opacity-100">Tuyển dụng</a></li>
              <li className="mb-2"><a href="#" className="text-white text-decoration-none opacity-75 hover-opacity-100">Liên hệ</a></li>
            </ul>
          </div>

          {/* Cột 4: Bản quyền + Chứng nhận */}
          <div className="col-lg-4 text-lg-end">
            <p className="small text-white opacity-75 mb-1">
              © 2025 EV DataHub. All rights reserved.
            </p>
            <p className="small text-white opacity-75 mb-0">
              GDPR • ISO 27001 • SSL 256-bit
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}