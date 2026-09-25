interface ModalProps {
  title: string;
  message: string;
  buttonText?: string;
  onClose: () => void;
}

export default function ModalAviso({ title, message, buttonText = "Got it", onClose }: ModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 text-center">
        <h2 className="font-bold text-lg mb-2 text-gray-900">{title}</h2>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <button
          onClick={onClose}
          style={{ backgroundColor: "#ec4899", color: "#ffffff" }}
          className="hover:bg-pink-600 font-semibold rounded-lg transition duration-200 py-3 px-8 w-full"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}