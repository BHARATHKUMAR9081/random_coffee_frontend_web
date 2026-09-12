import { Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { AdminProtectedRoute } from './components/admin/AdminProtectedRoute'
import { AdminShell } from './components/admin/AdminShell'
import { CallRoomPage } from './pages/CallRoomPage'
import { DashboardPage } from './pages/DashboardPage'
import { ConnectionsPage } from './pages/ConnectionsPage'
import { ChatPage } from './pages/ChatPage'
import { HelpPage } from './pages/HelpPage'
import { TicketThreadPage } from './pages/TicketThreadPage'
import { FindMatchPage } from './pages/FindMatchPage'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PostCallFeedbackPage } from './pages/PostCallFeedbackPage'
import { PricingPage } from './pages/PricingPage'
import { ProfilePage } from './pages/ProfilePage'
import { BusinessProfilePage } from './pages/BusinessProfilePage'
import { SettingsPage } from './pages/SettingsPage'
import { RegisterPage } from './pages/RegisterPage'
import { CommunityGuidelinesPage } from './pages/CommunityGuidelinesPage'
import { RefundPolicyPage } from './pages/RefundPolicyPage'
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage'
import { TermsOfServicePage } from './pages/TermsOfServicePage'
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage'
import { AdminUsersPage } from './pages/admin/AdminUsersPage'
import { AdminUserPage } from './pages/admin/AdminUserPage'
import { AdminTeamPage } from './pages/admin/AdminTeamPage'
import { AdminTicketsPage } from './pages/admin/AdminTicketsPage'
import { AdminReportsPage } from './pages/admin/AdminReportsPage'
import { AdminSessionsPage } from './pages/admin/AdminSessionsPage'
import { AdminAuditPage } from './pages/admin/AdminAuditPage'
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage'
import { AdminPlansPage } from './pages/admin/AdminPlansPage'
import { AdminUsagePage } from './pages/admin/AdminUsagePage'
import { AdminLoginPage } from './pages/admin/AdminLoginPage'
import { AdminTicketPage } from './pages/admin/AdminTicketPage'

function ShellRoutes() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/community-guidelines" element={<CommunityGuidelinesPage />} />
        <Route path="/refund-policy" element={<RefundPolicyPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/people/:accountId"
          element={
            <ProtectedRoute>
              <BusinessProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/connections"
          element={
            <ProtectedRoute>
              <ConnectionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/connections/:connectionId"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/match"
          element={
            <ProtectedRoute>
              <FindMatchPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/call"
          element={
            <ProtectedRoute>
              <CallRoomPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/call/feedback"
          element={
            <ProtectedRoute>
              <PostCallFeedbackPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/help"
          element={
            <ProtectedRoute>
              <HelpPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/help/:ticketId"
          element={
            <ProtectedRoute>
              <TicketThreadPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pricing"
          element={
            <ProtectedRoute>
              <PricingPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppShell>
  )
}

function AdminApp() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLoginPage />} />
      <Route
        element={
          <AdminProtectedRoute>
            <AdminShell />
          </AdminProtectedRoute>
        }
      >
        <Route index element={<AdminOverviewPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="users/:userId" element={<AdminUserPage />} />
        <Route path="team" element={<AdminTeamPage />} />
        <Route path="tickets" element={<AdminTicketsPage />} />
        <Route path="tickets/:ticketId" element={<AdminTicketPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
        <Route path="sessions" element={<AdminSessionsPage />} />
        <Route path="audit" element={<AdminAuditPage />} />
        <Route path="plans" element={<AdminPlansPage />} />
        <Route path="usage" element={<AdminUsagePage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminApp />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/*" element={<ShellRoutes />} />
    </Routes>
  )
}
