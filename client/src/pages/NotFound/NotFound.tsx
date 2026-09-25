import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="auth-shell flex flex-col items-center justify-center text-center px-4" style={{ minHeight: "100vh" }}>
      <h1 className="text-6xl font-bold text-purple-600 mb-2">404</h1>
      <p className="text-xl font-semibold text-gray-900 mb-2">Page not found</p>
      <p className="text-sm text-[#4B4560] mb-6">
        The page you're looking for doesn't exist or was moved.
      </p>
      <button
        onClick={() => navigate(-1)}
        className="text-pink-500 font-bold hover:underline"
      >
        Go back
      </button>
    </div>
  );
}