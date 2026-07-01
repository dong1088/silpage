import { useState, useCallback, useRef, useEffect } from "react";

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}

interface ConfirmState extends ConfirmOptions {
  isOpen: boolean;
  resolve: (value: boolean) => void;
}

export function useConfirm() {
  const [state, setState] = useState<ConfirmState | null>(null);
  const resolveRef = useRef<((value: boolean) => void) | null>(null);
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
      setState({ ...options, isOpen: true, resolve });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    resolveRef.current?.(true);
    setState(null);
  }, []);

  const handleCancel = useCallback(() => {
    resolveRef.current?.(false);
    setState(null);
  }, []);

  // 键盘支持：Enter 确认，Escape 取消（排除输入框内的按键）
  useEffect(() => {
    if (!state?.isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT";
      if (e.key === "Enter" && !isInput) {
        e.preventDefault();
        handleConfirm();
      } else if (e.key === "Escape") {
        e.preventDefault();
        handleCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    setTimeout(() => confirmBtnRef.current?.focus(), 50);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state?.isOpen, handleConfirm, handleCancel]);

  const ConfirmDialog = state?.isOpen ? (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9998]" onClick={handleCancel}>
      <div
        className="rounded-xl shadow-xl w-full max-w-sm mx-4 p-6"
        style={{ background: "var(--surface)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {state.title && (
          <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text)" }}>
            {state.title}
          </h3>
        )}
        <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
          {state.message}
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm rounded-lg border transition hover:opacity-80"
            style={{ borderColor: "var(--border)", color: "var(--text)" }}
          >
            {state.cancelText || "取消"}
          </button>
          <button
            ref={confirmBtnRef}
            onClick={handleConfirm}
            className="px-4 py-2 text-sm rounded-lg text-white transition hover:opacity-90"
            style={{ background: state.danger ? "#dc2626" : "var(--primary)" }}
          >
            {state.confirmText || "确定"}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return { confirm, ConfirmDialog };
}
