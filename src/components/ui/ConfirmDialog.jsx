import { createPortal } from 'react-dom';
import { AlertTriangle, Info } from 'lucide-react';
import { Button } from './Button';

export const ConfirmDialog = ({ 
  isOpen, onClose, onConfirm, 
  title = 'Confirm', message = 'Are you sure?', 
  confirmText = 'Confirm', isDestructive = false, isLoading = false 
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#000000]/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-[#0a0a0a] border border-[#333333] rounded-2xl shadow-2xl max-w-sm w-full p-6 modal-transition-enter-active">
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border ${
            isDestructive ? 'bg-[#220000] border-[#550000] text-[#ff0000]' : 'bg-[#111111] border-[#333333] text-white'
          }`}>
            {isDestructive ? <AlertTriangle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-white tracking-tight">{title}</h3>
            <p className="mt-1.5 text-sm text-[#888888] leading-relaxed">{message}</p>
          </div>
        </div>
        <div className="mt-8 flex justify-end gap-3">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button 
            variant={isDestructive ? 'danger' : 'primary'} 
            size="sm"
            onClick={onConfirm} 
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};
