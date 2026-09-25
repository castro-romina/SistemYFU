import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="auth-shell flex flex-col items-center justify-center text-center px-4" style={{ minHeight: "100vh" }}>
      <h1 className="text-6xl font-bold text-purple-600 mb-2">404</h1>
      <p className="text-xl font-semibold text-gray-900 mb-2">Página no encontrada</p>
      <p className="text-sm text-[#4B4560] mb-6">
        La página que buscás no existe o fue movida.
      </p>
      <Link
        to="/"
        className="text-pink-500 font-bold hover:underline"
      >
        Volver al inicio
      </Link>
    </div>
  );
}