import React from "react";
import Button from "./Button";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "primary" | "danger";
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  variant = "primary"
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200" role="dialog" aria-modal="true">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600 mb-6 text-sm leading-relaxed">{message}</p>
        
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={onCancel} className="w-auto px-4 py-2 text-sm">
            {cancelLabel}
          </Button>
          <Button variant={variant} onClick={onConfirm} className="w-auto px-4 py-2 text-sm">
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
