"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { HiOutlineArrowRight } from "react-icons/hi2";

// 임시 테마 데이터
const themes = [
  {
    id: 1,
    title: "힐링 여행",
    description: "스트레스 해소와 휴식을 위한 여행",
    image: "https://picsum.photos/seed/healing/400/200",
    count: 24,
  },
  {
    id: 2,
    title: "맛집 투어",
    description: "현지 맛집을 찾아 떠나는 미식 여행",
    image: "https://picsum.photos/seed/food/400/200",
    count: 18,
  },
  {
    id: 3,
    title: "액티비티",
    description: "다양한 활동을 즐기는 모험 여행",
    image: "https://picsum.photos/seed/activity/400/200",
    count: 32,
  },
  {
    id: 4,
    title: "문화 체험",
    description: "현지 문화와 전통을 경험하는 여행",
    image: "https://picsum.photos/seed/culture/400/200",
    count: 15,
  },
  {
    id: 5,
    title: "쇼핑 투어",
    description: "특별한 쇼핑 경험을 위한 여행",
    image: "https://picsum.photos/seed/shopping/400/200",
    count: 21,
  },
];

export default function ThemeListPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">테마별 여행</h1>
        
        <div className="space-y-4">
          {themes.map(theme => (
            <div
              key={theme.id}
              onClick={() => router.push(`/theme/${theme.id}`)}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="relative h-40">
                <Image
                  src={theme.image}
                  alt={theme.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h2 className="text-xl font-bold mb-1">{theme.title}</h2>
                  <p className="text-sm text-gray-200">{theme.description}</p>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {theme.count}개의 여행
                </span>
                <HiOutlineArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 