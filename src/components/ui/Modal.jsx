import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-xl' }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-[var(--color-app-bg)]/80 backdrop-blur-md modal-transition-enter-active"
        onClick={onClose}
      />
      
      <div className={`relative bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-2xl ${maxWidth} w-full max-h-[85vh] flex flex-col modal-transition-enter-active`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--color-border-light)]">
          <h2 className="text-xl font-display tracking-tight font-bold text-[var(--color-text-primary)]">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-subtle)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="px-6 py-6 overflow-y-auto modal-scroll flex-1 relative">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};
