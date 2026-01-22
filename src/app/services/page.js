import ServiceCard from '@/components/ServiceCard';

const services = [
  { title: 'Web Development', desc: '...' },
];

export default function Services() {
  return (
    <div className="container mx-auto px-6 py-24">
      <h1 className="text-4xl font-bold text-center mb-12">Layanan Kami</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((service, i) => (
          <ServiceCard key={i} {...service} />
        ))}
      </div>
    </div>
  );
}