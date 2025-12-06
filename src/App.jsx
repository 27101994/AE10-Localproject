import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';

// Layouts
import GuestLayout from '@layouts/GuestLayout';
import AppLayout from '@layouts/AppLayout';

// Pages
import SplashScreen from '@pages/SplashScreen';
import Login from '@pages/Login';
import Dashboard from '@pages/Dashboard';
import StartEvent from '@pages/StartEvent';
import Live from '@pages/Live';
import EventsHistory from '@pages/EventsHistory';
import TrainBuddy from '@pages/TrainBuddy';
import Performance from '@pages/Performance';
import VelocityMeter from '@pages/VelocityMeter';
import PelletTester from '@pages/PelletTester';
import TargetSetup from '@pages/TargetSetup';
import Competition from '@pages/Competition';
import Profile from '@pages/Profile';

// Protected route wrapper
function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuthStore();
    return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Public route wrapper (redirect to dashboard if already logged in)
function PublicRoute({ children }) {
    const { isAuthenticated } = useAuthStore();
    return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Splash Screen */}
                <Route path="/splash" element={<SplashScreen />} />

                {/* Public routes */}
                <Route element={<GuestLayout />}>
                    <Route
                        path="/login"
                        element={
                            <PublicRoute>
                                <Login />
                            </PublicRoute>
                        }
                    />
                </Route>

                {/* Protected routes */}
                <Route
                    element={
                        <ProtectedRoute>
                            <AppLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/start-event" element={<StartEvent />} />
                    <Route path="/live" element={<Live />} />
                    <Route path="/events-history" element={<EventsHistory />} />
                    <Route path="/train-buddy" element={<TrainBuddy />} />
                    <Route path="/performance" element={<Performance />} />
                    <Route path="/velocity-meter" element={<VelocityMeter />} />
                    <Route path="/pellet-tester" element={<PelletTester />} />
                    <Route path="/target-setup" element={<TargetSetup />} />
                    <Route path="/competition" element={<Competition />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>

                {/* Default redirect to splash screen */}
                <Route path="/" element={<Navigate to="/splash" replace />} />
                <Route path="*" element={<Navigate to="/splash" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
