import Navbar from './Components/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Hero from './Components/Hero';
import Services from './Components/Services';
import About from './Components/About';
import WorkingSteps from './Components/WorkingSteps';
import Footer from './Components/Footer';
import Profile from './Components/Profile';
import AdminDashboard from './Components/Admin/AdminDashboard';
import ProtectedAdminRoute from './Components/Admin/ProtectedAdminRoute';
import { motion } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import { AuthProvider } from './context/AuthContext';


const App = () => {
  // Animation variants for "come up with scroll" effect
  const scrollVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <AuthProvider>
      <div className="font-Primary overflow-x-hidden">
        <Router>
          <Navbar />
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Hero />
                  
                  {/* Services component */}
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ amount: 0.3 }}
                    variants={scrollVariants}
                  >
                    <Services />
                  </motion.div>
                  
                  {/* About component */}
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ amount: 0.3 }}
                    variants={scrollVariants}
                  >
                    <About />
                  </motion.div>

                  {/* WorkingSteps component */}
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ amount: 0.3 }}
                    variants={scrollVariants}
                  >
                    <WorkingSteps />
                  </motion.div>
                  
                  <Footer />
                  <Analytics />
                </>
              }
            />
            <Route path="/profile" element={<Profile />} />
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              }
            />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
};

export default App;
