import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import VisaDetail from './pages/VisaDetail';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import VisaManagement from './pages/admin/VisaManagement';
import Settings from './pages/admin/Settings';
import useScrollToTop from './hooks/useScrollToTop';

const ScrollToTop = () => {
  useScrollToTop();
  return null;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/visa-management" element={<VisaManagement />} />
        <Route path="/admin/settings" element={<Settings />} />

        <Route
          path="/*"
          element={
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/tentang" element={<About />} />
                <Route path="/kontak" element={<Contact />} />
                <Route path="/visa/:countryId" element={<VisaDetail />} />
              </Routes>
              <Footer />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
