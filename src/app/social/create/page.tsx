"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineArrowLeft, HiOutlinePhoto, HiOutlineXMark } from "react-icons/hi2";
import instance from "@/app/api/axios";

interface ImageFile {
  fileUrl?: string;
}

export default function CreateSocialPage() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("1");
  const [images, setImages] = useState<ImageFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    
    for (const file of newFiles) {
      // 이미지 미리보기 생성
      const preview = URL.createObjectURL(file);
      
      // FormData 생성 및 이미지 업로드
      const formData = new FormData();
      formData.append('file', file);
      formData.append('pathType', 'social');

      try {
        const uploadResponse = await instance.post('/api/v1/s3/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('uploadResponse==',uploadResponse)
        // 업로드된 이미지 URL을 받아서 상태 업데이트
        setImages(prev => [...prev, {
          fileUrl: uploadResponse.data.fileUrl
        }]);
      } catch (error) {
        console.error('이미지 업로드 실패:', error);
        URL.revokeObjectURL(preview);
      }
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = [...prev];
      if (newImages[index].fileUrl) {
        URL.revokeObjectURL(newImages[index].fileUrl!);
      }
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // 이미지 URL이 있는 경우에만 포함
      const requestData: any = {
        content,
        category
      };

      // 이미지 URL이 있는 경우에만 추가
      const imageUrls = images.map(image => image.fileUrl).filter(url => url);
      if (imageUrls.length > 0) {
        requestData.imageUrls = imageUrls;
      }

      console.log("imageUrls===",imageUrls)
      // 소셜 생성
      const response = await instance.post('/api/social/posts', requestData);

      if (response.status === 200) {
        router.push('/social');
      }
    } catch (error) {
      console.error('소셜 생성 실패:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <HiOutlineArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold ml-4">소셜 작성</h1>
            <button
              onClick={handleSubmit}
              className="ml-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              등록
            </button>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 영역 */}
      <main className="max-w-md mx-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 이미지 업로드 */}
          <div>
            <div className="grid grid-cols-3 gap-2">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={image.fileUrl}
                    alt={`Uploaded ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 p-1 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70"
                  >
                    <HiOutlineXMark className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <label
                  htmlFor="file-upload"
                  className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-gray-400 transition-colors cursor-pointer"
                >
                  <HiOutlinePhoto className="w-8 h-8 text-gray-400 mb-1" />
                  <span className="text-sm text-gray-500">이미지 추가</span>
                  <input
                    id="file-upload"
                    type="file"
                    onChange={handleImageUpload}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* 카테고리 선택 */}
          <div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1">맛집</option>
              <option value="2">카페</option>
              <option value="3">관광</option>
              <option value="4">쇼핑</option>
              <option value="5">기타</option>
            </select>
          </div>

          {/* 내용 입력 */}
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요..."
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </form>
      </main>
    </div>
  );
}
