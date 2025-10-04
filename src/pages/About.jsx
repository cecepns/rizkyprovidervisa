import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { settingsAPI } from '../utils/api';
import { Target, Zap, Lock } from 'lucide-react';

const About = () => {
  const [aboutUs, setAboutUs] = useState('');

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });

    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await settingsAPI.getAll();
      setAboutUs(response.data.about_us || '');
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  return (
    <div className="min-h-screen pt-16">
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center" data-aos="fade-up">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Tentang Kami</h1>
            <p className="text-xl">RizkyProviderVisa - Partner Terpercaya Perjalanan Anda</p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8" data-aos="fade-up">
            <h2 className="text-3xl font-bold mb-6 text-blue-600">Profil Perusahaan</h2>
            <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
              {aboutUs || 'RizkyProviderVisa adalah penyedia layanan pengurusan visa terpercaya untuk Umroh, Haji, Schengen, dan visa internasional lainnya. Kami berkomitmen memberikan pelayanan terbaik dengan proses yang cepat dan aman.'}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center" data-aos="fade-up" data-aos-delay="100">
              <div className="text-blue-600 mb-4 flex justify-center"><Target className="w-10 h-10" /></div>
              <h3 className="text-xl font-bold mb-3">Profesional</h3>
              <p className="text-gray-600">
                Tim berpengalaman dan terlatih dalam pengurusan visa
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center" data-aos="fade-up" data-aos-delay="200">
              <div className="text-blue-600 mb-4 flex justify-center"><Zap className="w-10 h-10" /></div>
              <h3 className="text-xl font-bold mb-3">Cepat</h3>
              <p className="text-gray-600">
                Proses pengurusan yang efisien dan tepat waktu
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center" data-aos="fade-up" data-aos-delay="300">
              <div className="text-blue-600 mb-4 flex justify-center"><Lock className="w-10 h-10" /></div>
              <h3 className="text-xl font-bold mb-3">Aman</h3>
              <p className="text-gray-600">
                Dokumen Anda dijamin keamanannya dengan sistem terpercaya
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12" data-aos="fade-up">
            Mengapa Memilih Kami?
          </h2>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6" data-aos="fade-up" data-aos-delay="100">
              <h3 className="text-xl font-bold mb-3 text-blue-600">Provider Resmi</h3>
              <p className="text-gray-700">
                Kami adalah provider resmi yang telah memiliki izin dan sertifikasi untuk menangani pengurusan visa.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6" data-aos="fade-up" data-aos-delay="200">
              <h3 className="text-xl font-bold mb-3 text-blue-600">Pengalaman Terpercaya</h3>
              <p className="text-gray-700">
                Dengan pengalaman bertahun-tahun, kami telah membantu ribuan klien dalam mengurus visa mereka.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6" data-aos="fade-up" data-aos-delay="300">
              <h3 className="text-xl font-bold mb-3 text-blue-600">Layanan Lengkap</h3>
              <p className="text-gray-700">
                Kami menyediakan berbagai pilihan layanan visa mulai dari Umroh, Haji, Schengen, hingga visa internasional.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6" data-aos="fade-up" data-aos-delay="400">
              <h3 className="text-xl font-bold mb-3 text-blue-600">Harga Kompetitif</h3>
              <p className="text-gray-700">
                Kami menawarkan harga yang kompetitif dengan kualitas layanan terbaik untuk kepuasan Anda.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
