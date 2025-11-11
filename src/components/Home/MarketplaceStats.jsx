import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

export default function MarketplaceStats() {
  const [ref, inView] = useInView({ triggerOnce: true });

  const stats = [
    { end: 520, suffix: "+", label: "Bộ dữ liệu" },
    { end: 98, suffix: "%", label: "Dữ liệu ẩn danh" },
    { end: 2.4, suffix: "M", label: "Điểm sạc theo dõi" },
    { end: 45, suffix: "+", label: "Quốc gia" },
  ];

  return (
    <section id="stats" className="section-padding bg-green text-white">
      <div className="container" ref={ref}>
        <div className="row text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="col-6 col-md-3 mb-4 mb-md-0">
              <motion.h3
                className="display-4 fw-bold mb-0"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: idx * 0.2 }}
              >
                {inView && <CountUp end={stat.end} duration={2.5} suffix={stat.suffix} />}
              </motion.h3>
              <p className="mb-0 opacity-75">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}