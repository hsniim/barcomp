'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Translations
  const t = {
    id: {
      formTitle: 'Kirim Pesan',
      formDescription: 'Isi formulir di bawah ini dan kami akan menghubungi Anda sesegera mungkin.',
      name: 'Nama',
      email: 'Email',
      phone: 'Telepon',
      subject: 'Subjek',
      message: 'Pesan',
      namePlaceholder: 'Nama Anda',
      emailPlaceholder: 'email.anda@example.com',
      phonePlaceholder: '+62 xxx xxxx xxxx',
      subjectPlaceholder: 'Tentang apa ini?',
      messagePlaceholder: 'Ceritakan lebih lanjut tentang proyek Anda...',
      send: 'Kirim Pesan',
      sending: 'Mengirim...',
      contactInfo: 'Informasi Kontak',
      contactDesc: 'Hubungi kami melalui salah satu saluran berikut',
      emailLabel: 'Email',
      phoneLabel: 'Telepon',
      office: 'Kantor',
      businessHours: 'Jam Operasional',
      monday: 'Senin - Jumat:',
      saturday: 'Sabtu:',
      sunday: 'Minggu:',
      mondayHours: '09:00 - 18:00',
      saturdayHours: '10:00 - 14:00',
      sundayHours: 'Tutup',
      successMsg: 'Pesan berhasil dikirim! Kami akan segera menghubungi Anda.',
      errorMsg: 'Gagal mengirim pesan. Silakan coba lagi.',
      required: '*'
    }
  };

  const content = t.id;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here you would normally send data to your API
      console.log('Form submitted:', formData);
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Contact Form */}
      <Card className="border-gray-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {content.formTitle}
          </CardTitle>
          <CardDescription className="text-base text-gray-600">
            {content.formDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-gray-900">
                {content.name} <span className="text-red-500">{content.required}</span>
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder={content.namePlaceholder}
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border-gray-300 focus:border-[#0066FF] focus:ring-[#0066FF] text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-900">
                {content.email} <span className="text-red-500">{content.required}</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={content.emailPlaceholder}
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border-gray-300 focus:border-[#0066FF] focus:ring-[#0066FF] text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-semibold text-gray-900">
                {content.phone}
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder={content.phonePlaceholder}
                value={formData.phone}
                onChange={handleChange}
                className="w-full border-gray-300 focus:border-[#0066FF] focus:ring-[#0066FF] text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-sm font-semibold text-gray-900">
                {content.subject} <span className="text-red-500">{content.required}</span>
              </Label>
              <Input
                id="subject"
                name="subject"
                type="text"
                placeholder={content.subjectPlaceholder}
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full border-gray-300 focus:border-[#0066FF] focus:ring-[#0066FF] text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message" className="text-sm font-semibold text-gray-900">
                {content.message} <span className="text-red-500">{content.required}</span>
              </Label>
              <Textarea
                id="message"
                name="message"
                placeholder={content.messagePlaceholder}
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full resize-none border-gray-300 focus:border-[#0066FF] focus:ring-[#0066FF] text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold py-6 text-base shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  {content.sending}
                </>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  {content.send}
                </>
              )}
            </Button>

            {/* Status Messages */}
            {submitStatus === 'success' && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm font-medium">
                ✅ {content.successMsg}
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm font-medium">
                ❌ {content.errorMsg}
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <div className="space-y-6">
        <Card className="border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {content.contactInfo}
            </CardTitle>
            <CardDescription className="text-base text-gray-600">
              {content.contactDesc}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-[#0066FF]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-base">
                  {content.emailLabel}
                </h3>
                <a 
                  href="mailto:info@barcomp.com" 
                  className="text-gray-700 hover:text-[#0066FF] transition-colors block mb-1"
                >
                  info@barcomp.com
                </a>
                <a 
                  href="mailto:support@barcomp.com" 
                  className="text-gray-700 hover:text-[#0066FF] transition-colors block"
                >
                  support@barcomp.com
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-[#0066FF]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-base">
                  {content.phoneLabel}
                </h3>
                <a 
                  href="tel:+6221xxxxxxxx" 
                  className="text-gray-700 hover:text-[#0066FF] transition-colors block mb-1"
                >
                  +62 21 xxxx xxxx
                </a>
                <a 
                  href="tel:+628xxxxxxxxxx" 
                  className="text-gray-700 hover:text-[#0066FF] transition-colors block"
                >
                  +62 8xx xxxx xxxx
                </a>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-[#0066FF]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-base">
                  {content.office}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Jl. Example Street No. 123<br />
                  Jakarta Selatan, DKI Jakarta<br />
                  Indonesia 12345
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Hours */}
        <Card className="border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#0066FF]" />
              {content.businessHours}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">{content.monday}</span>
                <span className="font-semibold text-gray-900">{content.mondayHours}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">{content.saturday}</span>
                <span className="font-semibold text-gray-900">{content.saturdayHours}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">{content.sunday}</span>
                <span className="font-semibold text-gray-900">{content.sundayHours}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}