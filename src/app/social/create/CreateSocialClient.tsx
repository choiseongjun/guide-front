"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import { HiXMark, HiOutlinePhoto } from "react-icons/hi2";
import { motion } from "framer-motion";

interface CreateSocialClientProps {
  params: {
    id: string;
  };
}

const categories = [
  { id: "review", name: "여행 후기" },
  { id: "food", name: "맛집 추천" },
  { id: "accommodation", name: "숙소 추천" },
  { id: "tips", name: "여행 팁" },
  { id: "companion", name: "동행 구함" },
  { id: "question", name: "여행 질문" },
];

export default function CreateSocialClient({
  params,
}: CreateSocialClientProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [tagInput, setTagInput] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension,
      Link.configure({
        openOnClick: false,
      }),
      Color,
      TextStyle,
      Highlight,
    ],
    content: description,
    onUpdate: ({ editor }) => {
      setDescription(editor.getHTML());
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          newImages.push(e.target.result as string);
          if (newImages.length === files.length) {
            setImages((prev) => [...prev, ...newImages]);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditorImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        // 현재 스크롤 위치 저장
        const scrollPosition = window.scrollY;

        editor
          ?.chain()
          .focus()
          .setImage({ src: imageUrl })
          .insertContent("\n")
          .run();

        // 스크롤 위치 복원
        window.scrollTo(0, scrollPosition);

        // input 초기화
        e.target.value = "";
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      const newTag = tagInput.trim();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }
    if (!selectedCategory) {
      alert("카테고리를 선택해주세요.");
      return;
    }

    // TODO: API 연동
    console.log({
      title,
      description,
      images,
      tags,
      location,
      category: selectedCategory,
    });

    router.push("/social");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.main
        className="max-w-md mx-auto bg-white min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900"
            >
              취소
            </button>
            <h1 className="text-lg font-semibold">새 게시글</h1>
            <button
              onClick={handleSubmit}
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              게시
            </button>
          </div>
        </div>

        {/* 카테고리 선택 */}
        <div className="px-4 py-3 border-b border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            카테고리
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">카테고리 선택</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* 이미지 업로드 */}
        <div className="px-4 py-3 border-b border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            이미지
          </label>
          <div className="flex flex-wrap gap-2">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Uploaded ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-2 -right-2 bg-gray-800 bg-opacity-50 text-white rounded-full p-1"
                >
                  <HiXMark className="w-4 h-4" />
                </button>
              </div>
            ))}
            {images.length < 10 && (
              <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <HiOutlinePhoto className="w-6 h-6 text-gray-400" />
              </label>
            )}
          </div>
        </div>

        {/* 에디터 */}
        <div className="p-4 border-b border-gray-200">
          <div className="prose max-w-none">
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div className="border-b border-gray-300 bg-gray-50 px-1 py-1 flex flex-wrap gap-1">
                <button
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  className={`p-1.5 rounded hover:bg-white transition-colors ${
                    editor?.isActive("bold")
                      ? "bg-white text-blue-600"
                      : "text-gray-600"
                  }`}
                  title="굵게"
                >
                  <span className="font-bold">B</span>
                </button>
                <button
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  className={`p-1.5 rounded hover:bg-white transition-colors ${
                    editor?.isActive("italic")
                      ? "bg-white text-blue-600"
                      : "text-gray-600"
                  }`}
                  title="기울임"
                >
                  <span className="italic">I</span>
                </button>
                <button
                  onClick={() => editor?.chain().focus().toggleStrike().run()}
                  className={`p-1.5 rounded hover:bg-white transition-colors ${
                    editor?.isActive("strike")
                      ? "bg-white text-blue-600"
                      : "text-gray-600"
                  }`}
                  title="취소선"
                >
                  <span className="line-through">S</span>
                </button>
                <button
                  onClick={() =>
                    editor?.chain().focus().toggleHighlight().run()
                  }
                  className={`p-1.5 rounded hover:bg-white transition-colors ${
                    editor?.isActive("highlight")
                      ? "bg-white text-blue-600"
                      : "text-gray-600"
                  }`}
                  title="하이라이트"
                >
                  <span className="bg-yellow-200 px-1">H</span>
                </button>
                <div className="w-px h-6 bg-gray-300 mx-0.5" />
                <button
                  onClick={() =>
                    editor?.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                  className={`p-1.5 rounded hover:bg-white transition-colors ${
                    editor?.isActive("heading", { level: 2 })
                      ? "bg-white text-blue-600"
                      : "text-gray-600"
                  }`}
                  title="제목"
                >
                  <span className="font-bold text-lg">H2</span>
                </button>
                <button
                  onClick={() =>
                    editor?.chain().focus().toggleBulletList().run()
                  }
                  className={`p-1.5 rounded hover:bg-white transition-colors ${
                    editor?.isActive("bulletList")
                      ? "bg-white text-blue-600"
                      : "text-gray-600"
                  }`}
                  title="목록"
                >
                  <span className="text-lg">•</span>
                </button>
                <div className="w-px h-6 bg-gray-300 mx-0.5" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "image/*";
                    input.style.display = "none";
                    document.body.appendChild(input);

                    // 현재 스크롤 위치 저장
                    const scrollPosition = window.scrollY;

                    input.onchange = (e) => {
                      handleEditorImageUpload(e as any);
                      input.remove();
                      // 스크롤 위치 복원
                      window.scrollTo(0, scrollPosition);
                    };
                    input.click();
                  }}
                  className="p-1.5 rounded hover:bg-white transition-colors text-gray-600"
                  title="이미지 삽입"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <EditorContent
                editor={editor}
                className="px-2 py-3 min-h-[300px] prose max-w-none focus:outline-none [&_.ProseMirror]:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 해시태그 */}
        <div className="px-4 py-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            해시태그
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(index)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <HiXMark className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="해시태그를 입력하고 Enter를 누르세요"
          />
        </div>
      </motion.main>
    </div>
  );
}
