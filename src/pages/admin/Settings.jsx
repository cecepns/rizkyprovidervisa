import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { settingsAPI, authAPI } from '../../utils/api';

const Settings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    address: '',
    phone: '',
    email: '',
    maps_embed: '',
    about_us: '',
    working_hours: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetchSettings();
  }, [navigate]);

  const fetchSettings = async () => {
    try {
      const response = await settingsAPI.getAll();
      setSettings(prevSettings => ({
        ...prevSettings,
        ...response.data
      }));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await settingsAPI.update(settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error:', error);
      alert('Gagal menyimpan pengaturan');
    } finally {
      setLoading(false);
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold mb-8">Pengaturan</h2>

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            Pengaturan berhasil disimpan!
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Alamat</label>
              <input
                type="text"
                name="address"
                value={settings.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Masukkan alamat"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Nomor Telepon</label>
              <input
                type="text"
                name="phone"
                value={settings.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Masukkan nomor telepon"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Masukkan email"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Jam Kerja</label>
              <input
                type="text"
                name="working_hours"
                value={settings.working_hours}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Contoh: Senin - Jumat: 08:00 - 17:00 WIB"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Embed Google Maps (HTML iframe)
              </label>
              <textarea
                name="maps_embed"
                value={settings.maps_embed}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                rows="4"
                placeholder='<iframe src="https://www.google.com/maps/embed?..." width="600" height="450"></iframe>'
              />
              <p className="text-sm text-gray-500 mt-1">
                Dapatkan kode embed dari Google Maps dan paste di sini
              </p>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Tentang Kami</label>
              <textarea
                name="about_us"
                value={settings.about_us}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                rows="6"
                placeholder="Tulis informasi tentang perusahaan"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
            >
              {loading ? 'Menyimpan...' : 'Simpan Pengaturan'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
