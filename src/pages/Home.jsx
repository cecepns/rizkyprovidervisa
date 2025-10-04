import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { countriesAPI } from "../utils/api";
import { Building2, Globe2, Plane, Sparkles } from "lucide-react";
import Select from "react-select";

const Home = () => {
  const [countries, setCountries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });

    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await countriesAPI.getAll();
      setCountries(response.data);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const countryOptions = countries.map(country => ({
    value: country.id,
    label: country.name,
    flag: country.flag
  }));

  const handleCountrySelect = (selectedOption) => {
    if (selectedOption) {
      navigate(`/visa/${selectedOption.value}`);
    }
  };

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800 text-white py-24 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            aria-hidden
          >
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-300 rounded-full blur-3xl" />
          </div>
          <div className="relative text-center" data-aos="fade-up">
            <div className="inline-flex items-center space-x-2 bg-white/10 rounded-full px-4 py-2 mb-4">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm">Layanan visa cepat & terpercaya</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Pengurusan Visa Umroh, Haji, Schengen & Internasional
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Proses cepat, aman, dan terpercaya untuk perjalanan Anda
            </p>
            <Link
              to="/kontak"
              className="inline-block bg-white text-blue-700 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition shadow-lg"
            >
              Hubungi Kami
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            data-aos="fade-up"
          >
            Layanan Kami
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div
              className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="text-blue-600 mb-4">
                <Building2 className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Visa Umroh & Haji</h3>
              <p className="text-gray-600 mb-4">
                Pengurusan visa untuk perjalanan ibadah Umroh dan Haji dengan
                proses yang mudah dan cepat.
              </p>
            </div>

            <div
              className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="text-blue-600 mb-4">
                <Globe2 className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Visa Schengen</h3>
              <p className="text-gray-600 mb-4">
                Visa untuk perjalanan ke negara-negara Eropa dengan proses yang
                profesional dan terpercaya.
              </p>
            </div>

            <div
              className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="text-blue-600 mb-4">
                <Plane className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Visa Internasional</h3>
              <p className="text-gray-600 mb-4">
                Pengurusan visa untuk berbagai negara tujuan di seluruh dunia
                sesuai kebutuhan Anda.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            data-aos="fade-up"
          >
            Pilih Negara Tujuan
          </h2>

          <div className="bg-white rounded-lg shadow-lg p-8" data-aos="fade-up">
            <div className="max-w-2xl mx-auto">
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                Pilih negara untuk melihat informasi visa:
              </label>
              <Select
                options={countryOptions}
                onChange={handleCountrySelect}
                placeholder="Pilih negara tujuan..."
                classNamePrefix="rs"
                formatOptionLabel={(option) => (
                  <div className="flex items-center gap-3">
                    {option.flag && (
                      <span className="text-xl">{option.flag}</span>
                    )}
                    <span>{option.label}</span>
                  </div>
                )}
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: '56px',
                    fontSize: '16px',
                    border: '2px solid #e5e7eb',
                    '&:hover': {
                      borderColor: '#3b82f6'
                    }
                  }),
                  option: (base, state) => ({
                    ...base,
                    padding: '12px 16px',
                    fontSize: '16px',
                    backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#dbeafe' : 'white',
                    color: state.isSelected ? 'white' : '#374151',
                    '&:hover': {
                      backgroundColor: state.isSelected ? '#3b82f6' : '#dbeafe'
                    }
                  })
                }}
              />
              
              {countries.length === 0 && (
                <p className="text-center text-gray-500 mt-4">
                  Belum ada data negara tersedia
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-blue-600 text-white">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          data-aos="fade-up"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Siap untuk Perjalanan Anda?
          </h2>
          <p className="text-xl mb-8">
            Hubungi kami sekarang untuk konsultasi gratis
          </p>
          <Link
            to="/kontak"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition"
          >
            Konsultasi Sekarang
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
