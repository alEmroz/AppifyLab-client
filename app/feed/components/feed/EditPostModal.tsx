"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { updatePost } from "../../api";

interface EditPostModalProps {
  open: boolean;
  postId: string;
  initialText: string;
  initialVisibility: "public" | "private";
  initialImage?: string;
  onClose: () => void;
  onSaved: (updatedPost: any) => void;
}

export default function EditPostModal({
  open,
  postId,
  initialText,
  initialVisibility,
  initialImage,
  onClose,
  onSaved,
}: EditPostModalProps) {
  const [text, setText] = useState(initialText);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<"public" | "private">(initialVisibility);
  const [saving, setSaving] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setText(initialText);
    setVisibility(initialVisibility);
    setImage(null);
    setPreview(null);
  }, [initialText, initialVisibility, open]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose]);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!text.trim()) return;
    setSaving(true);
    try {
      const updated = await updatePost(postId, text, visibility, image || undefined);
      onSaved(updated);
      onClose();
    } catch (err) {
      toast.error("Couldn't update your post. Please try again.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div ref={ref} className="bg-white rounded-lg shadow-xl w-[480px] max-w-[90vw] p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-[#212121]">Edit Post</h3>
          <button onClick={onClose} className="text-[#666666] hover:text-[#212121]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full bg-[#F0F2F5] border border-[#E8E8E8] rounded-md p-3 text-sm text-[#212121] placeholder:text-[#666666] resize-none focus:border-[#1890FF] focus:ring-0 min-h-[100px]"
          rows={4}
        />

        {(preview || initialImage) && !preview && (
          <div className="relative mt-3 rounded-md overflow-hidden max-h-[300px]">
            <img src={initialImage} alt="" className="w-full object-cover" />
          </div>
        )}

        {preview && (
          <div className="relative mt-3 rounded-md overflow-hidden max-h-[300px]">
            <img src={preview} alt="Preview" className="w-full object-cover" />
            <button
              onClick={() => { setImage(null); setPreview(null); }}
              className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
            >
              &times;
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1.5 text-sm text-[#666666] cursor-pointer hover:text-[#1890FF]">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path fill="currentColor" d="M13.916 0c3.109 0 5.18 2.429 5.18 5.914v8.17c0 3.486-2.072 5.916-5.18 5.916H5.999C2.89 20 .827 17.572.827 14.085v-8.17C.827 2.43 2.897 0 6 0h7.916zm0 1.504H5.999c-2.321 0-3.799 1.735-3.799 4.41v8.17c0 2.68 1.472 4.412 3.799 4.412h7.917c2.328 0 3.807-1.734 3.807-4.411v-8.17c0-2.678-1.478-4.411-3.807-4.411zm.65 8.68l.12.125 1.9 2.147a.803.803 0 01-.016 1.063.642.642 0 01-.894.058l-.076-.074-1.9-2.148a.806.806 0 00-1.205-.028l-.074.087-2.04 2.717c-.722.963-2.02 1.066-2.86.26l-.111-.116-.814-.91a.562.562 0 00-.793-.07l-.075.073-1.4 1.617a.645.645 0 01-.97.029.805.805 0 01-.09-.977l.064-.086 1.4-1.617c.736-.852 1.95-.897 2.734-.137l.114.12.81.905a.587.587 0 00.861.033l.07-.078 2.04-2.718c.81-1.08 2.27-1.19 3.205-.275zM6.831 4.64c1.265 0 2.292 1.125 2.292 2.51 0 1.386-1.027 2.511-2.292 2.511S4.54 8.537 4.54 7.152c0-1.386 1.026-2.51 2.291-2.51zm0 1.504c-.507 0-.918.451-.918 1.007 0 .555.411 1.006.918 1.006.507 0 .919-.451.919-1.006 0-.556-.412-1.007-.919-1.007z" />
              </svg>
              Photo
              <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
            </label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as "public" | "private")}
              className="text-xs border border-gray-200 rounded px-2 py-1 text-[#666666] bg-white"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-[#666666] hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!text.trim() || saving}
              className="px-4 py-2 text-sm text-white bg-[#1890FF] hover:bg-blue-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}