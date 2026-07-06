import { useState, useRef, useEffect } from "react";
import { useToast } from "../../../shared/components/Toast";

interface ImageUploaderProps {
  onUpload: (imageUrl: string) => void;
  currentImage?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export function ImageUploader({ onUpload, currentImage }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleFile = (file: File) => {
    // 格式校验
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast("仅支持 JPG、PNG、GIF、WebP 格式", "error");
      return;
    }

    // 大小校验
    if (file.size > MAX_FILE_SIZE) {
      toast("文件大小不能超过 5MB", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (!mountedRef.current) return;
      const url = e.target?.result as string;
      setPreview(url);
      onUpload(url);
    };
    reader.onerror = () => {
      if (!mountedRef.current) return;
      toast("图片读取失败，请重试", "error");
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onUpload("");
  };

  return (
    <div>
      {preview ? (
        <div className="relative group">
          <img
            src={preview}
            alt="预览"
            className="w-full h-48 object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 rounded-lg">
            <button
              onClick={handleClick}
              className="px-3 py-2 bg-white text-gray-800 rounded text-sm hover:bg-gray-100"
            >
              更换
            </button>
            <button
              onClick={handleRemove}
              className="px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600"
            >
              删除
            </button>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
            isDragging
              ? "border-indigo-500 bg-indigo-50"
              : "border-gray-300 hover:border-indigo-400"
          }`}
        >
          <div className="text-4xl mb-2">📷</div>
          <p className="text-sm text-gray-600">
            拖拽图片到此处，或点击上传
          </p>
          <p className="text-xs text-gray-400 mt-1">支持 JPG、PNG、GIF</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
