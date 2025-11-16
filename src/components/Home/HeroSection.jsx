import { Button } from 'antd';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="min-vh-100 d-flex align-items-center position-relative overflow-hidden" style={{ paddingTop: '80px' }}>
      <div className="container position-relative z-10">
        <div className="row align-items-center">
          <motion.div
            className="col-lg-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="display-4 fw-bold mb-4">
              Chợ Dữ liệu <span className="text-green">Xe Điện</span> Toàn cầu
            </h1>
            <p className="lead mb-4 text-muted">
              Kết nối nhà cung cấp dữ liệu EV với OEM, startup, nhà nghiên cứu. 
              Mua, bán, phân tích dữ liệu hành vi lái xe, pin, sạc, V2G.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <Button type="primary" size="large" className="btn-primary-custom" href="/providerList">
                Khám phá dữ liệu
              </Button>
              <Button size="large" type="default" href="/provider">
                Trở thành nhà cung cấp
              </Button>
            </div>
            <div className="mt-5 d-flex gap-5 text-muted">
              <div>
                <h3 className="mb-0 text-green fw-bold">500+</h3>
                <small>Bộ dữ liệu</small>
              </div>
              <div>
                <h3 className="mb-0 text-green fw-bold">120+</h3>
                <small>Nhà cung cấp</small>
              </div>
              <div>
                <h3 className="mb-0 text-green fw-bold">98%</h3>
                <small>Độ chính xác</small>
              </div>
            </div>
          </motion.div>
          <motion.div
            className="col-lg-6 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <img
              src="https://i.pinimg.com/1200x/0e/35/86/0e35861324e63ca344944c5e91c53268.jpg"
              alt="EV Data Dashboard"
              className="img-fluid rounded-4 shadow-lg"
              style={{ maxHeight: '500px', objectFit: 'cover' }}
            />
          </motion.div>
        </div>
      </div>

      {/* Background Wave */}
      <div
        className="position-absolute bottom-0 start-0 end-0"
        style={{
          height: '200px',
          background: 'linear-gradient(180deg, transparent, #f8f9fa)',
          clipPath: 'ellipse(100% 60% at 50% 100%)',
        }}
      />
    </section>
  );
}