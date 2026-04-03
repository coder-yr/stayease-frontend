/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import HotelListings from './pages/HotelListings';
import StudentHousing from './pages/StudentHousing';
import PropertyDetail from './pages/PropertyDetail';
import AIAssistant from './pages/AIAssistant';
import Checkout from './pages/Checkout';
import BookingSuccess from './pages/BookingSuccess';
import Journal from './pages/Journal';
import Dashboard from './pages/Dashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import NearbyServices from './pages/NearbyServices';
import Support from './pages/Support';
import Flights from './pages/Flights';
import FlightResults from './pages/FlightResults';
import FlightBooking from './pages/FlightBooking';
import Buses from './pages/Buses';
import BusBooking from './pages/BusBooking';
import Trains from './pages/Trains';
import TrainBooking from './pages/TrainBooking';
import NotFound from './pages/NotFound';
import { AnimatePresence, motion } from 'motion/react';
import MobileNav from './components/MobileNav';
import Login from './pages/Login';
import Signup from './pages/Signup';

/** Routes where Navbar/Footer/MobileNav are hidden (full-screen pages) */
const HIDDEN_SHELL_ROUTES = ['/ai', '/nearby', '/login', '/signup'];

const AnimatedRoutes = () => {
  const location = useLocation();
  const hideShell = HIDDEN_SHELL_ROUTES.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-[100dvh] relative overflow-x-hidden bg-brand-bg relative">
      {!hideShell && <Navbar />}
      {/* Bottom padding on mobile to clear the fixed MobileNav (64px ≈ pb-16) */}
      <main className={`flex-grow flex flex-col relative w-full ${!hideShell ? 'pb-16 md:pb-0' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, scale: 0.99, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.99, y: -10 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex-1 flex flex-col w-full origin-top"
          >
            <Routes location={location}>
              <Route path="/"                    element={<Home />} />
              <Route path="/search"              element={<SearchResults />} />
              <Route path="/hotels"              element={<HotelListings />} />
              <Route path="/pg"                  element={<StudentHousing />} />
              <Route path="/property/:id"        element={<PropertyDetail />} />
              <Route path="/ai"                  element={<AIAssistant />} />
              <Route path="/checkout/:id"        element={<Checkout />} />
              <Route path="/booking-success/:id" element={<BookingSuccess />} />
              <Route path="/journal"             element={<Journal />} />
              <Route path="/login"               element={<Login />} />
              <Route path="/signup"              element={<Signup />} />
              <Route path="/dashboard"           element={<Dashboard />} />
              <Route path="/owner/dashboard"     element={<OwnerDashboard />} />
              <Route path="/admin/dashboard"     element={<AdminDashboard />} />
              <Route path="/nearby"              element={<NearbyServices />} />
              <Route path="/flights"             element={<FlightResults />} />
              <Route path="/flights/search"      element={<Flights />} />
              <Route path="/flights/results"     element={<FlightResults />} />
              <Route path="/flights/booking"     element={<FlightBooking />} />
              <Route path="/buses"               element={<Buses />} />
              <Route path="/buses/book"          element={<BusBooking />} />
              <Route path="/trains"              element={<Trains />} />
              <Route path="/trains/book"         element={<TrainBooking />} />
              <Route path="/bus"                 element={<Navigate to="/buses" replace />} />
              <Route path="/bus/book"            element={<Navigate to="/buses/book" replace />} />
              <Route path="/train"               element={<Navigate to="/trains" replace />} />
              <Route path="/train/book"          element={<Navigate to="/trains/book" replace />} />
              <Route path="/support"             element={<Support />} />
              <Route path="/about"    element={<Navigate to="/support" replace />} />
              <Route path="/careers"  element={<Navigate to="/support" replace />} />
              <Route path="/contact"  element={<Navigate to="/support" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      {!hideShell && <Footer />}
      {!hideShell && <MobileNav />}
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}
