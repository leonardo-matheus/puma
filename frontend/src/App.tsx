import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthContext, useAuthProvider } from '@/hooks/useAuth'

// Layouts
import { MainLayout } from '@/layouts/MainLayout'
import { AdminLayout } from '@/layouts/AdminLayout'

// Public Pages
import { Home } from '@/pages/Home'
import { Vehicles } from '@/pages/Vehicles'
import { VehicleDetail } from '@/pages/VehicleDetail'
import { Favorites } from '@/pages/Favorites'
import { About } from '@/pages/About'
import { Contact } from '@/pages/Contact'
import { Evaluation } from '@/pages/Evaluation'
import { Location } from '@/pages/Location'

// Admin Pages
import { AdminLogin } from '@/pages/admin/Login'
import { AdminDashboard } from '@/pages/admin/Dashboard'
import { AdminVehicles } from '@/pages/admin/Vehicles'
import { AdminVehicleForm } from '@/pages/admin/VehicleForm'
import { AdminContacts } from '@/pages/admin/Contacts'
import { AdminEvaluations } from '@/pages/admin/Evaluations'
import { AdminBanners } from '@/pages/admin/Banners'
import { AdminSettings } from '@/pages/admin/Settings'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const auth = useAuthProvider()

  if (auth.isLoading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

function App() {
  const auth = useAuthProvider()

  return (
    <AuthContext.Provider value={auth}>
      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/carros" element={<Vehicles />} />
          <Route path="/carros/:id" element={<VehicleDetail />} />
          <Route path="/favoritos" element={<Favorites />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/contato" element={<Contact />} />
          <Route path="/avaliacao" element={<Evaluation />} />
          <Route path="/localizacao" element={<Location />} />
        </Route>

        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="veiculos" element={<AdminVehicles />} />
          <Route path="veiculos/novo" element={<AdminVehicleForm />} />
          <Route path="veiculos/:id" element={<AdminVehicleForm />} />
          <Route path="contatos" element={<AdminContacts />} />
          <Route path="avaliacoes" element={<AdminEvaluations />} />
          <Route path="banners" element={<AdminBanners />} />
          <Route path="configuracoes" element={<AdminSettings />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthContext.Provider>
  )
}

export default App
