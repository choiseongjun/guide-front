"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { HiOutlinePhoto, HiOutlineXMark, HiOutlineShare } from "react-icons/hi2";
import { getImageUrl } from "@/app/common/imgUtils";
import { useUser } from "@/hooks/useUser";
import instance from "@/app/api/axios";

interface PhotoTabProps {
  tripId: string;
  isCreator: boolean;
}

interface Photo {
  id: number;
  imageUrl: string;
  content: string;
  isPublic: boolean;
  allowSocialShare: boolean;
  user: {
    id: number;
    nickname: string;
    profileImageUrl: string | null;
  };
  createdAt: string;
}

interface UploadedPhoto {
  fileUrl: string;
  content: string;
  isPublic: boolean;
  allowSocialShare: boolean;
}

export default function PhotoTab({ tripId, isCreator }: PhotoTabProps) {
  const { user } = useUser();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [showPhotoUploadModal, setShowPhotoUploadModal] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [shareContent, setShareContent] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [allowSocialShare, setAllowSocialShare] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);

    for (const file of newFiles) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("pathType", "social-trip");

      try {
        const { data } = await instance.post("/api/v1/s3/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setUploadedPhotos((prev) => [
          ...prev,
          {
            fileUrl: data.fileUrl,
            content: "",
            isPublic: isPublic,
            allowSocialShare: allowSocialShare,
          },
        ]);
      } catch (error) {
        console.error("이미지 업로드 실패:", error);
      }
    }
  };

  const removePhoto = (index: number) => {
    setUploadedPhotos((prev) => {
      const newPhotos = [...prev];
      newPhotos.splice(index, 1);
      return newPhotos;
    });
  };

  const updatePhotoContent = (index: number, content: string) => {
    setUploadedPhotos((prev) => {
      const newPhotos = [...prev];
      newPhotos[index] = { ...newPhotos[index], content };
      return newPhotos;
    });
  };

  const updatePhotoSettings = (index: number, settings: Partial<UploadedPhoto>) => {
    setUploadedPhotos((prev) => {
      const newPhotos = [...prev];
      newPhotos[index] = { ...newPhotos[index], ...settings };
      return newPhotos;
    });
  };

  const handleSubmit = async () => {
    try {
      const { data } = await instance.post(`/api/v1/travels/${tripId}/photos`, {
        photos: uploadedPhotos.map((photo) => ({
          imageUrl: photo.fileUrl,
          content: photo.content,
          isPublic: photo.isPublic,
          allowSocialShare: photo.allowSocialShare,
        })),
      });

      if (data) {
        setShowPhotoUploadModal(false);
        setUploadedPhotos([]);
        // TODO: 사진 목록 새로고침
      }
    } catch (error) {
      console.error("사진 업로드 실패:", error);
      alert("사진 업로드에 실패했습니다.");
    }
  };

  const handleShareToSocial = async () => {
    if (!selectedPhoto) return;

    try {
      const { data } = await instance.post("/api/v1/social/posts", {
        content: shareContent || selectedPhoto.content || "여행 사진을 공유합니다!",
        imageUrls: [selectedPhoto.imageUrl],
        travelId: tripId,
      });

      if (data) {
        setShowShareModal(false);
        setSelectedPhoto(null);
        setShareContent("");
        alert("소셜에 공유되었습니다.");
      }
    } catch (error) {
      console.error("소셜 공유 실패:", error);
      alert("소셜 공유에 실패했습니다.");
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">여행 사진</h2>
        {user && (
          <button
            onClick={() => setShowPhotoUploadModal(true)}
            className="flex items-center gap-1 text-blue-500 hover:text-blue-600"
          >
            <HiOutlinePhoto className="w-5 h-5" />
            <span>사진 추가</span>
          </button>
        )}
      </div>

      {/* 사진 그리드 */}
      <div className="grid grid-cols-3 gap-2">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="relative aspect-square group cursor-pointer"
            onClick={() => {
              setSelectedPhoto(photo);
              setShareContent(photo.content);
              setShowShareModal(true);
            }}
          >
            <Image
              src={getImageUrl(photo.imageUrl)}
              alt="여행 사진"
              fill
              className="object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg flex items-center justify-center">
              <HiOutlineShare className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            {photo.content && (
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 text-white text-sm rounded-b-lg">
                {photo.content}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 사진 업로드 모달 */}
      {showPhotoUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">사진 추가</h3>
              <button
                onClick={() => {
                  setShowPhotoUploadModal(false);
                  setUploadedPhotos([]);
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <HiOutlineXMark className="w-5 h-5" />
              </button>
            </div>

            {/* 기본 설정 */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-3">기본 설정</h4>
              <div className="space-y-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className="ml-3 text-sm font-medium text-gray-900">공개</span>
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowSocialShare}
                    onChange={(e) => setAllowSocialShare(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className="ml-3 text-sm font-medium text-gray-900">소셜 공유 허용</span>
                </label>
              </div>
            </div>

            <div className="mb-4">
              <div className="grid grid-cols-3 gap-2">
                {uploadedPhotos.map((photo, index) => (
                  <div key={index} className="relative aspect-square group">
                    <img
                      src={getImageUrl(photo.fileUrl)}
                      alt={`Uploaded ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-1 right-1 p-1 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70"
                    >
                      <HiOutlineXMark className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {uploadedPhotos.length < 10 && (
                  <label
                    htmlFor="photo-upload"
                    className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-gray-400 transition-colors cursor-pointer"
                  >
                    <HiOutlinePhoto className="w-8 h-8 text-gray-400 mb-1" />
                    <span className="text-sm text-gray-500">사진 추가</span>
                    <input
                      id="photo-upload"
                      type="file"
                      onChange={handlePhotoUpload}
                      accept="image/*"
                      multiple
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* 사진별 설정 */}
            {uploadedPhotos.length > 0 && (
              <div className="mb-4 space-y-4">
                {uploadedPhotos.map((photo, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 relative">
                        <img
                          src={getImageUrl(photo.fileUrl)}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            사진 설명
                          </label>
                          <textarea
                            value={photo.content}
                            onChange={(e) => updatePhotoContent(index, e.target.value)}
                            placeholder="사진에 대한 설명을 입력하세요..."
                            className="w-full p-2 border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={photo.isPublic}
                              onChange={(e) => updatePhotoSettings(index, { isPublic: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            <span className="ml-3 text-sm font-medium text-gray-900">공개</span>
                          </label>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={photo.allowSocialShare}
                              onChange={(e) => updatePhotoSettings(index, { allowSocialShare: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            <span className="ml-3 text-sm font-medium text-gray-900">소셜 공유 허용</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowPhotoUploadModal(false);
                  setUploadedPhotos([]);
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                취소
              </button>
              <button
                onClick={handleSubmit}
                disabled={uploadedPhotos.length === 0}
                className={`px-4 py-2 rounded-lg ${
                  uploadedPhotos.length > 0
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                업로드
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 소셜 공유 모달 */}
      {showShareModal && selectedPhoto && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">소셜에 공유</h3>
              <button
                onClick={() => {
                  setShowShareModal(false);
                  setSelectedPhoto(null);
                  setShareContent("");
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <HiOutlineXMark className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-square mb-4">
              <Image
                src={getImageUrl(selectedPhoto.imageUrl)}
                alt="공유할 사진"
                fill
                className="object-cover rounded-lg"
              />
            </div>

            <div className="mb-4">
              <textarea
                value={shareContent}
                onChange={(e) => setShareContent(e.target.value)}
                placeholder="공유할 내용을 입력하세요..."
                className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowShareModal(false);
                  setSelectedPhoto(null);
                  setShareContent("");
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                취소
              </button>
              <button
                onClick={handleShareToSocial}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                공유하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 