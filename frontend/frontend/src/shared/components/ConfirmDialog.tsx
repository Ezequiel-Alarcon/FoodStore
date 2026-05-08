import { Modal } from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmDialog = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Eliminar",
  cancelText = "Cancelar"
}: ConfirmDialogProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title}>
      <div className="space-y-6 p-2">
        <p className="text-slate-600 text-base">{message}</p>
        
        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
          <button 
            onClick={onCancel}
            className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 font-medium rounded-md transition-colors"
          >
            {cancelText}
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 font-medium rounded-md transition-colors shadow-sm"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};
