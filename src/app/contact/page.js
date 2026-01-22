import ContactForm from '@/components/ContactForm';

export default function Contact() {
  return (
    <div className="container mx-auto px-6 py-24">
      <h1 className="text-4xl font-bold text-center mb-12">Hubungi Kami</h1>
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <p>Email: hello@namaperusahaan.com</p>
          <p>WA: +62 812-3456-7890</p>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}