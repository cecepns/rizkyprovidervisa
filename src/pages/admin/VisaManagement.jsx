import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { countriesAPI, visaTypesAPI, visaCategoriesAPI, visaDetailsAPI, authAPI } from '../../utils/api';

const VisaManagement = () => {
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [visaTypes, setVisaTypes] = useState([]);
  const [selectedVisaType, setSelectedVisaType] = useState('');
  const [visaCategories, setVisaCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [visaDetails, setVisaDetails] = useState([]);

  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [countryForm, setCountryForm] = useState({ name: '', code: '', flag: '', description: '', image: null });
  const [typeForm, setTypeForm] = useState({ name: '' });
  const [categoryForm, setCategoryForm] = useState({ name: '' });
  const [detailForm, setDetailForm] = useState({ process_type: '', processing_time: '', price: '', requirements: '' });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetchCountries();
  }, [navigate]);

  useEffect(() => {
    if (selectedCountry) {
      fetchVisaTypes();
    } else {
      setVisaTypes([]);
      setSelectedVisaType('');
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedVisaType) {
      fetchVisaCategories();
    } else {
      setVisaCategories([]);
      setSelectedCategory('');
    }
  }, [selectedVisaType]);

  useEffect(() => {
    if (selectedCategory) {
      fetchVisaDetails();
    } else {
      setVisaDetails([]);
    }
  }, [selectedCategory]);

  const fetchCountries = async () => {
    try {
      const response = await countriesAPI.getAll();
      setCountries(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchVisaTypes = async () => {
    try {
      const response = await visaTypesAPI.getAll(selectedCountry);
      setVisaTypes(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchVisaCategories = async () => {
    try {
      const response = await visaCategoriesAPI.getAll(selectedVisaType);
      setVisaCategories(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchVisaDetails = async () => {
    try {
      const response = await visaDetailsAPI.getAll(selectedCategory);
      setVisaDetails(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCountrySubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', countryForm.name);
      formData.append('code', countryForm.code);
      formData.append('flag', countryForm.flag);
      formData.append('description', countryForm.description);
      if (countryForm.image) {
        formData.append('image', countryForm.image);
      }

      if (editingId) {
        await countriesAPI.update(editingId, formData);
      } else {
        await countriesAPI.create(formData);
      }

      setShowCountryModal(false);
      setCountryForm({ name: '', code: '', flag: '', description: '', image: null });
      setEditingId(null);
      fetchCountries();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleTypeSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...typeForm, country_id: selectedCountry };

      if (editingId) {
        await visaTypesAPI.update(editingId, data);
      } else {
        await visaTypesAPI.create(data);
      }

      setShowTypeModal(false);
      setTypeForm({ name: '' });
      setEditingId(null);
      fetchVisaTypes();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...categoryForm, visa_type_id: selectedVisaType };

      if (editingId) {
        await visaCategoriesAPI.update(editingId, data);
      } else {
        await visaCategoriesAPI.create(data);
      }

      setShowCategoryModal(false);
      setCategoryForm({ name: '' });
      setEditingId(null);
      fetchVisaCategories();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDetailSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...detailForm, visa_category_id: selectedCategory };

      if (editingId) {
        await visaDetailsAPI.update(editingId, data);
      } else {
        await visaDetailsAPI.create(data);
      }

      setShowDetailModal(false);
      setDetailForm({ process_type: '', processing_time: '', price: '', requirements: '' });
      setEditingId(null);
      fetchVisaDetails();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteCountry = async (id) => {
    if (window.confirm('Yakin ingin menghapus negara ini?')) {
      try {
        await countriesAPI.delete(id);
        fetchCountries();
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleDeleteType = async (id) => {
    if (window.confirm('Yakin ingin menghapus tipe visa ini?')) {
      try {
        await visaTypesAPI.delete(id);
        fetchVisaTypes();
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Yakin ingin menghapus kategori ini?')) {
      try {
        await visaCategoriesAPI.delete(id);
        fetchVisaCategories();
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleDeleteDetail = async (id) => {
    if (window.confirm('Yakin ingin menghapus detail ini?')) {
      try {
        await visaDetailsAPI.delete(id);
        fetchVisaDetails();
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/admin/dashboard" className="text-2xl font-bold text-blue-600">
                Admin Dashboard
              </Link>
              <Link to="/admin/visa-management" className="text-gray-700 hover:text-blue-600">
                Manajemen Visa
              </Link>
              <Link to="/admin/settings" className="text-gray-700 hover:text-blue-600">
                Pengaturan
              </Link>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold mb-8">Manajemen Visa</h2>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Negara</h3>
              <button
                onClick={() => {
                  setShowCountryModal(true);
                  setEditingId(null);
                  setCountryForm({ name: '', code: '', flag: '', description: '', image: null });
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Tambah Negara
              </button>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {countries.map(country => (
                <div
                  key={country.id}
                  className={`flex justify-between items-center p-3 rounded border cursor-pointer ${
                    selectedCountry === country.id ? 'bg-blue-100 border-blue-600' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedCountry(country.id)}
                >
                  <span className="flex items-center space-x-2">
                    <span className="text-xl leading-none">{country.flag}</span>
                    <span>{country.name}</span>
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(country.id);
                        setCountryForm({
                          name: country.name,
                          code: country.code || '',
                          flag: country.flag || '',
                          description: country.description || '',
                          image: null
                        });
                        setShowCountryModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCountry(country.id);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Tipe Visa</h3>
              <button
                onClick={() => {
                  if (!selectedCountry) {
                    alert('Pilih negara terlebih dahulu');
                    return;
                  }
                  setShowTypeModal(true);
                  setEditingId(null);
                  setTypeForm({ name: '' });
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Tambah Tipe
              </button>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {visaTypes.map(type => (
                <div
                  key={type.id}
                  className={`flex justify-between items-center p-3 rounded border cursor-pointer ${
                    selectedVisaType === type.id ? 'bg-blue-100 border-blue-600' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedVisaType(type.id)}
                >
                  <span>{type.name}</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(type.id);
                        setTypeForm({ name: type.name });
                        setShowTypeModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteType(type.id);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
              {visaTypes.length === 0 && (
                <p className="text-gray-500 text-center py-4">Pilih negara untuk melihat tipe visa</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Jenis Visa</h3>
              <button
                onClick={() => {
                  if (!selectedVisaType) {
                    alert('Pilih tipe visa terlebih dahulu');
                    return;
                  }
                  setShowCategoryModal(true);
                  setEditingId(null);
                  setCategoryForm({ name: '' });
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Tambah Jenis
              </button>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {visaCategories.map(category => (
                <div
                  key={category.id}
                  className={`flex justify-between items-center p-3 rounded border cursor-pointer ${
                    selectedCategory === category.id ? 'bg-blue-100 border-blue-600' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <span>{category.name}</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(category.id);
                        setCategoryForm({ name: category.name });
                        setShowCategoryModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory(category.id);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
              {visaCategories.length === 0 && (
                <p className="text-gray-500 text-center py-4">Pilih tipe visa untuk melihat jenis</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Detail Visa</h3>
              <button
                onClick={() => {
                  if (!selectedCategory) {
                    alert('Pilih jenis visa terlebih dahulu');
                    return;
                  }
                  setShowDetailModal(true);
                  setEditingId(null);
                  setDetailForm({ process_type: '', processing_time: '', price: '', requirements: '' });
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Tambah Detail
              </button>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {visaDetails.map(detail => (
                <div key={detail.id} className="border border-gray-200 rounded p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold">{detail.process_type}</h4>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingId(detail.id);
                          setDetailForm({
                            process_type: detail.process_type,
                            processing_time: detail.processing_time,
                            price: detail.price,
                            requirements: detail.requirements
                          });
                          setShowDetailModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteDetail(detail.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Waktu: {detail.processing_time}</p>
                  <p className="text-sm text-gray-600">Biaya: Rp {Number(detail.price).toLocaleString('id-ID')}</p>
                </div>
              ))}
              {visaDetails.length === 0 && (
                <p className="text-gray-500 text-center py-4">Pilih jenis visa untuk melihat detail</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {showCountryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-2xl font-bold mb-4">{editingId ? 'Edit' : 'Tambah'} Negara</h3>
            <form onSubmit={handleCountrySubmit} className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Nama Negara</label>
                <input
                  type="text"
                  value={countryForm.name}
                  onChange={(e) => setCountryForm({ ...countryForm, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Kode</label>
                <input
                  type="text"
                  value={countryForm.code}
                  onChange={(e) => setCountryForm({ ...countryForm, code: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Flag (emoji/icon)</label>
                <input
                  type="text"
                  value={countryForm.flag}
                  onChange={(e) => setCountryForm({ ...countryForm, flag: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Contoh: 🇸🇦"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Deskripsi</label>
                <textarea
                  value={countryForm.description}
                  onChange={(e) => setCountryForm({ ...countryForm, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows="3"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Gambar</label>
                <input
                  type="file"
                  onChange={(e) => setCountryForm({ ...countryForm, image: e.target.files[0] })}
                  className="w-full px-4 py-2 border rounded-lg"
                  accept="image/*"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={() => setShowCountryModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showTypeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-2xl font-bold mb-4">{editingId ? 'Edit' : 'Tambah'} Tipe Visa</h3>
            <form onSubmit={handleTypeSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Nama Tipe Visa</label>
                <input
                  type="text"
                  value={typeForm.name}
                  onChange={(e) => setTypeForm({ ...typeForm, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={() => setShowTypeModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-2xl font-bold mb-4">{editingId ? 'Edit' : 'Tambah'} Jenis Visa</h3>
            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Nama Jenis Visa</label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">{editingId ? 'Edit' : 'Tambah'} Detail Visa</h3>
            <form onSubmit={handleDetailSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Tipe Proses</label>
                <input
                  type="text"
                  value={detailForm.process_type}
                  onChange={(e) => setDetailForm({ ...detailForm, process_type: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Contoh: Provider Resmi"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Waktu Proses</label>
                <input
                  type="text"
                  value={detailForm.processing_time}
                  onChange={(e) => setDetailForm({ ...detailForm, processing_time: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Contoh: 2-3 hari"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Biaya (Rp)</label>
                <input
                  type="number"
                  value={detailForm.price}
                  onChange={(e) => setDetailForm({ ...detailForm, price: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Contoh: 2350000"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Persyaratan Dokumen</label>
                <textarea
                  value={detailForm.requirements}
                  onChange={(e) => setDetailForm({ ...detailForm, requirements: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows="4"
                  placeholder="Contoh: Tiket pulang pergi&#10;Reservasi hotel&#10;Transportasi dari bandara"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={() => setShowDetailModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisaManagement;
