// app/admin/login/layout.js
export default function LoginLayout({ children }) {
  // This layout overrides the parent admin layout
  // It simply renders children without any sidebar or admin UI
  return children;
}