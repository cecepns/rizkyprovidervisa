const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">RizkyProviderVisa</h3>
            <p className="text-gray-300">
              Penyedia layanan pengurusan visa terpercaya untuk Umroh, Haji, Schengen, dan visa internasional.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Kontak</h3>
            <div className="space-y-2 text-gray-300">
              <p>Tarim, Yaman</p>
              <p>+62 831-1570-6849</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Jam Kerja</h3>
            <div className="space-y-2 text-gray-300">
              <p>Senin - Jumat: 08:00 - 17:00 WIB</p>
              <p>Sabtu: 08:00 - 12:00 WIB</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 RizkyProviderVisa. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
