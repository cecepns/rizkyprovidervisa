import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { settingsAPI } from '../utils/api';

const Contact = () => {
  const [settings, setSettings] = useState({
    address: 'Tarim, Yaman',
    phone: '+62 831-1570-6849',
    email: 'info@rizkyprovidervisa.com',
    working_hours: 'Senin - Jumat: 08:00 - 17:00 WIB, Sabtu: 08:00 - 12:00 WIB',
    maps_embed: ''
  });

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
      setSettings(prevSettings => ({
        ...prevSettings,
        ...response.data
      }));
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  return (
    <div className="min-h-screen pt-16">
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center" data-aos="fade-up">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Hubungi Kami</h1>
            <p className="text-xl">Kami siap membantu Anda dengan layanan terbaik</p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div data-aos="fade-up">
              <h2 className="text-3xl font-bold mb-6">Informasi Kontak</h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-blue-600 text-white p-3 rounded-lg mr-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Alamat</h3>
                    <p className="text-gray-600">{settings.address}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-600 text-white p-3 rounded-lg mr-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Telepon</h3>
                    <p className="text-gray-600">{settings.phone}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-600 text-white p-3 rounded-lg mr-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Email</h3>
                    <p className="text-gray-600">{settings.email}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-600 text-white p-3 rounded-lg mr-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Jam Kerja</h3>
                    <p className="text-gray-600">{settings.working_hours}</p>
                  </div>
                </div>
              </div>
            </div>

            <div data-aos="fade-up" data-aos-delay="200">
              <h2 className="text-3xl font-bold mb-6">Kirim Pesan</h2>

              <form className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Nama Lengkap</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Masukkan email"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Nomor Telepon</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Masukkan nomor telepon"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Pesan</label>
                  <textarea
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Tulis pesan Anda"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Kirim Pesan
                </button>
              </form>
            </div>
          </div>

          {settings.maps_embed && (
            <div className="mt-12" data-aos="fade-up">
              <h2 className="text-3xl font-bold mb-6 text-center">Lokasi Kami</h2>
              <div
                className="w-full h-96 rounded-lg overflow-hidden shadow-lg"
                dangerouslySetInnerHTML={{ __html: settings.maps_embed }}
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Contact;
