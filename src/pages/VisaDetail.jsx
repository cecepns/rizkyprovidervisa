import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { countriesAPI, visaTypesAPI, visaCategoriesAPI, visaDetailsAPI } from '../utils/api';
import Select from 'react-select';

const VisaDetail = () => {
  const { countryId } = useParams();
  const [country, setCountry] = useState(null);
  const [visaTypes, setVisaTypes] = useState([]);
  const [selectedVisaType, setSelectedVisaType] = useState(null);
  const [visaCategories, setVisaCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [visaDetails, setVisaDetails] = useState([]);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });

    if (countryId) {
      fetchCountry();
      fetchVisaTypes();
    }
  }, [countryId]);

  const fetchCountry = async () => {
    try {
      const response = await countriesAPI.getById(countryId);
      setCountry(response.data);
    } catch (error) {
      console.error('Error fetching country:', error);
    }
  };

  const fetchVisaTypes = async () => {
    try {
      const response = await visaTypesAPI.getAll(countryId);
      setVisaTypes(response.data);
    } catch (error) {
      console.error('Error fetching visa types:', error);
    }
  };

  const handleVisaTypeSelect = async (visaType) => {
    setSelectedVisaType(visaType);
    setSelectedCategory(null);
    setShowDetails(false);

    try {
      const response = await visaCategoriesAPI.getAll(visaType.id);
      setVisaCategories(response.data);
    } catch (error) {
      console.error('Error fetching visa categories:', error);
    }
  };

  const handleCategorySelect = async (category) => {
    setSelectedCategory(category);
    setShowDetails(false);
  };

  const handleSearchInfo = async () => {
    if (!selectedCategory) return;

    try {
      const response = await visaDetailsAPI.getAll(selectedCategory.id);
      setVisaDetails(response.data);
      setShowDetails(true);
    } catch (error) {
      console.error('Error fetching visa details:', error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const visaTypeOptions = useMemo(() => (
    visaTypes.map((t) => ({ value: t.id, label: t.name, raw: t }))
  ), [visaTypes]);

  const visaCategoryOptions = useMemo(() => (
    visaCategories.map((c) => ({ value: c.id, label: c.name, raw: c }))
  ), [visaCategories]);

  return (
    <div className="min-h-screen pt-16">
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center" data-aos="fade-up">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {country ? `Visa ${country.name}` : 'Detail Visa'}
            </h1>
            <p className="text-xl">Informasi lengkap pengurusan visa</p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link to="/" className="text-blue-600 hover:underline flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Kembali ke Beranda
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6" data-aos="fade-up">
              <h2 className="text-2xl font-bold mb-4">1. Pilih Tipe Visa</h2>
              <Select
                options={visaTypeOptions}
                value={selectedVisaType ? { value: selectedVisaType.id, label: selectedVisaType.name } : null}
                onChange={(opt) => opt && handleVisaTypeSelect(visaTypes.find(t => t.id === opt.value))}
                placeholder="Pilih tipe visa..."
                classNamePrefix="rs"
              />
              {visaTypes.length === 0 && (
                <p className="text-gray-500 text-center py-4">Belum ada tipe visa tersedia</p>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6" data-aos="fade-up" data-aos-delay="100">
              <h2 className="text-2xl font-bold mb-4">2. Pilih Jenis Visa</h2>
              <Select
                options={visaCategoryOptions}
                value={selectedCategory ? { value: selectedCategory.id, label: selectedCategory.name } : null}
                onChange={(opt) => opt && handleCategorySelect(visaCategories.find(c => c.id === opt.value))}
                placeholder={selectedVisaType ? 'Pilih jenis visa...' : 'Pilih tipe visa dulu'}
                isDisabled={!selectedVisaType}
                classNamePrefix="rs"
              />
              {visaCategories.length === 0 && selectedVisaType && (
                <p className="text-gray-500 text-center py-4">Belum ada jenis visa tersedia</p>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6" data-aos="fade-up" data-aos-delay="200">
              <h2 className="text-2xl font-bold mb-4">3. Cari Info</h2>
              <button
                onClick={handleSearchInfo}
                disabled={!selectedCategory}
                className={`w-full px-6 py-3 rounded-lg font-semibold transition ${
                  selectedCategory
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Cari Info Visa
              </button>
            </div>
          </div>

          {showDetails && visaDetails.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold mb-6 text-blue-600">Detail Visa</h2>

              <div className="space-y-6">
                {visaDetails.map((detail) => (
                  <div key={detail.id} className="border-b pb-6 last:border-b-0">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">{detail.process_type}</h3>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-gray-600 font-semibold">Waktu Proses:</p>
                        <p className="text-lg">{detail.processing_time}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-semibold">Biaya:</p>
                        <p className="text-2xl font-bold text-blue-600">{formatPrice(detail.price)}</p>
                      </div>
                    </div>

                    {detail.requirements && (
                      <div>
                        <p className="text-gray-600 font-semibold mb-2">Persyaratan Dokumen:</p>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-700 whitespace-pre-line">{detail.requirements}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                <p className="text-gray-700 mb-4">
                  Untuk informasi lebih lanjut atau melakukan pemesanan, silakan hubungi kami:
                </p>
                <Link
                  to="/kontak"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Hubungi Kami
                </Link>
              </div>
            </div>
          )}

          {showDetails && visaDetails.length === 0 && (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center" data-aos="fade-up">
              <p className="text-gray-500 text-lg">Belum ada detail visa tersedia untuk kategori ini</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default VisaDetail;
