"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import {
  HiOutlineArrowLeft,
  HiOutlineCalendar,
  HiOutlineMapPin,
  HiOutlineUserGroup,
  HiOutlineCurrencyDollar,
  HiOutlineTag,
  HiOutlinePhoto,
  HiXMark,
  HiOutlineClock,
} from "react-icons/hi2";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Script from "next/script";
import instance from "@/app/api/axios";
import imageCompression from "browser-image-compression";
import { uploadToS3 } from "@/utils/s3Upload";
import { log } from "node:console";
import { getImageUrl } from "@/app/common/imgUtils";
import DaumPostcode from 'react-daum-postcode';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

// 여행 카테고리 데이터
const travelCategories = [
  {
    id: 1,
    title: "힐링 & 웰니스",
    description: "스트레스 해소와 휴식을 위한 여행",
  },
  {
    id: 2,
    title: "미식 & 음식 투어",
    description: "현지 맛집을 찾아 떠나는 미식 여행",
  },
  {
    id: 3,
    title: "사진 & 영상 투어",
    description: "아름다운 순간을 기록하는 여행",
  },
  {
    id: 4,
    title: "액티비티 & 모험",
    description: "다양한 활동을 즐기는 모험 여행",
  },
  {
    id: 5,
    title: "예술 & 문화",
    description: "현지 문화와 예술을 경험하는 여행",
  },
  {
    id: 6,
    title: "캠핑",
    description: "자연 속에서 즐기는 캠핑 여행",
  },
  {
    id: 7,
    title: "파티 & 페스티벌",
    description: "특별한 축제와 파티를 즐기는 여행",
  },
  {
    id: 8,
    title: "로맨틱 & 프라이빗",
    description: "특별한 순간을 위한 프라이빗 여행",
  },
];

interface CreateTripClientProps {
  mode?: "create" | "edit";
  initialData?: any;
}

export default function CreateTripClient({ mode = "create", initialData }: CreateTripClientProps) {
  const router = useRouter();
  const calendarRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [highlight, setHighlight] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [maxParticipants, setMaxParticipants] = useState(2);
  const [minParticipants, setMinParticipants] = useState(2);
  const [price, setPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [discountRate, setDiscountRate] = useState<number>(0);
  const [isFree, setIsFree] = useState(false);
  const [isDiscounted, setIsDiscounted] = useState(false);
  const [providedItems, setProvidedItems] = useState<string[]>([]);
  const [notProvidedItems, setNotProvidedItems] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [date, setDate] = useState<Value>([null, null]);
  const [images, setImages] = useState<string[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [addressResults, setAddressResults] = useState<any[]>([]);
  const [showAddressResults, setShowAddressResults] = useState(false);
  const [approvalType, setApprovalType] = useState<"auto" | "manual">("auto");
  const [minAge, setMinAge] = useState<number>(0);
  const [maxAge, setMaxAge] = useState<number>(100);
  const [providedInput, setProvidedInput] = useState("");
  const [notProvidedInput, setNotProvidedInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [schedules, setSchedules] = useState<
    {
      day: number;
      title: string;
      items: { time: string; content: string }[];
    }[]
  >([]);
  const [newScheduleItems, setNewScheduleItems] = useState<{
    [key: number]: { time: string; content: string };
  }>({});
  const [isScheduleEnabled, setIsScheduleEnabled] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    detailAddress: "",
    latitude: 0,
    longitude: 0,
    startDate: "",
    endDate: "",
    minParticipants: 2,
    maxParticipants: 10,
    isPaid: false,
    price: 0,
    discountRate: 0,
    discountedPrice: 0,
    providedItems: "",
    notProvidedItems: "",
    requiresApproval: false,
    minAge: 0,
    maxAge: 100,
    hasSchedule: false,
    schedules: [],
    tags: [],
    images: [],
    startTime: "",
  });
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showPostcode, setShowPostcode] = useState(false);
  const [buildingCode, setBuildingCode] = useState("");
  const [startTime, setStartTime] = useState("09:00");

  // 시간 옵션 생성 (30분 간격)
  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? "00" : "30";
    return `${hour.toString().padStart(2, "0")}:${minute}`;
  });

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
    content: "",
    onCreate: ({ editor }) => {
      editor.commands.setContent(
        "서울의 아름다운 풍경을 둘러보는 3박 4일 여행입니다.디테일내용입니다."
      );
    },
    onUpdate: ({ editor }) => {
      setDescription(editor.getHTML());
    },
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        showCalendar &&
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendar]);

  // 카카오맵 초기화
  useEffect(() => {
    const checkKakaoMapLoaded = () => {
      if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
        console.log("Kakao Maps API and services are loaded");
        setIsMapLoaded(true);
        return true;
      }
      return false;
    };

    // 초기 체크
    if (checkKakaoMapLoaded()) {
      initializeMap();
    } else {
      // 100ms 간격으로 체크
      const interval = setInterval(() => {
        if (checkKakaoMapLoaded()) {
          clearInterval(interval);
          initializeMap();
        }
      }, 100);

      // 10초 후에도 로드되지 않으면 인터벌 중지
      setTimeout(() => {
        clearInterval(interval);
      }, 10000);
    }

    function initializeMap() {
      if (mapRef.current) {
        console.log("Initializing map...");
        try {
          const options = {
            center: new window.kakao.maps.LatLng(37.5665, 126.978),
            level: 3,
          };
          const newMap = new window.kakao.maps.Map(mapRef.current, options);
          setMap(newMap);
          console.log("Map initialized successfully");
        } catch (error) {
          console.error("Error initializing map:", error);
        }
      }
    }

    return () => {
      // cleanup
    };
  }, []);

  // 주소 검색
  const searchAddress = () => {
    console.log("Searching address...", {
      searchKeyword,
      isMapLoaded,
      kakaoExists: !!window.kakao,
      servicesExists: !!window.kakao?.maps?.services,
    });

    if (!searchKeyword) {
      console.log("No search keyword provided");
      return;
    }

    if (!window.kakao?.maps?.services) {
      console.log("Kakao Maps services not loaded");
      return;
    }

    try {
      const geocoder = new window.kakao.maps.services.Geocoder();
      console.log("Geocoder created");

      geocoder.addressSearch(searchKeyword, (results: any, status: any) => {
        console.log("Search results:", { results, status });
        if (status === window.kakao.maps.services.Status.OK) {
          setAddressResults(results);
          setShowAddressResults(true);
        } else {
          console.log("Search failed:", status);
          setAddressResults([]);
          setShowAddressResults(false);
        }
      });
    } catch (error) {
      console.error("Error during address search:", error);
    }
  };

  // 주소 선택
  const selectAddress = (result: any) => {
    const coords = new window.kakao.maps.LatLng(result.y, result.x);

    // 마커 생성
    if (marker) {
      marker.setMap(null);
    }
    const newMarker = new window.kakao.maps.Marker({
      map: map,
      position: coords,
    });
    setMarker(newMarker);

    // 지도 이동
    map.setCenter(coords);

    // 주소 설정
    const region1Depth = result.address_name.split(" ")[0]; // 시/도
    const region2Depth = result.address_name.split(" ")[1]; // 구/군
    const region3Depth = result.address_name.split(" ")[2] || ""; // 동/읍/면

    setAddress(result.address_name);
    setLocation(
      `${region1Depth} ${region2Depth} ${region3Depth} (${result.y}, ${result.x})`
    );
    setShowAddressResults(false);
    setSearchKeyword("");
  };

  // 주소 검색 결과 외부 클릭 시 결과 숨기기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".address-search-container")) {
        setShowAddressResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 일정 추가
  const handleAddDay = () => {
    const newDay = schedules.length + 1;
    setSchedules([...schedules, { day: newDay, title: "", items: [] }]);
    setNewScheduleItems({
      ...newScheduleItems,
      [newDay]: { time: "", content: "" },
    });
  };

  // 일정 삭제
  const handleRemoveDay = (dayIndex: number) => {
    const newSchedules = schedules.filter((_, index) => index !== dayIndex);
    setSchedules(newSchedules);

    // 삭제된 일차 이후의 일차 번호 재조정
    const updatedSchedules = newSchedules.map((schedule, index) => ({
      ...schedule,
      day: index + 1,
    }));
    setSchedules(updatedSchedules);

    // 입력 필드 상태 업데이트
    const newInputs = { ...newScheduleItems };
    delete newInputs[dayIndex + 1];
    setNewScheduleItems(newInputs);
  };

  // 일차 제목 수정
  const handleUpdateDayTitle = (dayIndex: number, title: string) => {
    const newSchedules = [...schedules];
    newSchedules[dayIndex].title = title;
    setSchedules(newSchedules);
  };

  // 일정 항목 추가
  const handleAddScheduleItem = (dayIndex: number) => {
    const day = dayIndex + 1;
    const currentInput = newScheduleItems[day];

    if (currentInput?.time && currentInput?.content) {
      const newSchedules = [...schedules];
      newSchedules[dayIndex].items.push({
        time: currentInput.time,
        content: currentInput.content,
      });
      setSchedules(newSchedules);
      // 입력 필드는 초기화하지 않고 유지
    }
  };

  // 일정 항목 삭제
  const handleRemoveScheduleItem = (dayIndex: number, itemIndex: number) => {
    const newSchedules = [...schedules];
    newSchedules[dayIndex].items = newSchedules[dayIndex].items.filter(
      (_, index) => index !== itemIndex
    );
    setSchedules(newSchedules);
  };

  // 입력 필드 값 변경
  const handleScheduleInputChange = (
    day: number,
    field: "time" | "content",
    value: string
  ) => {
    setNewScheduleItems({
      ...newScheduleItems,
      [day]: {
        ...newScheduleItems[day],
        [field]: value,
      },
    });
  };

  // 입력 필드 초기화
  const handleClearInput = (day: number) => {
    setNewScheduleItems({
      ...newScheduleItems,
      [day]: { time: "", content: "" },
    });
  };

  // 초기값 설정
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setTitle(initialData.title || "");
      setHighlight(initialData.highlight || "");
      setDescription(initialData.description || "");
      setAddress(initialData.address || "");
      setDetailAddress(initialData.detailAddress || "");
      setBuildingCode(initialData.buildingCode || "");
      setLatitude(initialData.latitude || 0);
      setLongitude(initialData.longitude || 0);
      setDate([
        initialData.startDate ? new Date(initialData.startDate) : null,
        initialData.endDate ? new Date(initialData.endDate) : null,
      ]);
      setMinParticipants(initialData.minParticipants || 2);
      setMaxParticipants(initialData.maxParticipants || 10);
      setIsFree(!initialData.isPaid);
      setPrice(initialData.price?.toString() || "");
      setDiscountedPrice(initialData.discountedPrice?.toString() || "");
      setDiscountRate(initialData.discountRate || 0);
      setIsDiscounted(initialData.discountRate > 0);
      setProvidedItems(initialData.providedItems?.split(",") || []);
      setNotProvidedItems(initialData.notProvidedItems?.split(",") || []);
      setApprovalType(initialData.requiresApproval ? "manual" : "auto");
      setMinAge(initialData.minAge || 0);
      setMaxAge(initialData.maxAge || 100);
      setIsScheduleEnabled(initialData.hasSchedule);
      setTags(initialData.tags?.map((tag: any) => tag.name) || []);
      setImages(initialData.images?.map((img: any) => img.imageUrl) || []);
      setSelectedCategory(initialData.categoryId);
      setStartTime(initialData.startTime || "09:00");

      // 일정 설정
      if (initialData.schedules) {
        const scheduleMap = new Map();
        initialData.schedules.forEach((schedule: any) => {
          if (!scheduleMap.has(schedule.dayNumber)) {
            scheduleMap.set(schedule.dayNumber, {
              day: schedule.dayNumber,
              title: schedule.title,
              items: [],
            });
          }
          scheduleMap.get(schedule.dayNumber).items.push({
            time: schedule.time,
            content: schedule.description,
          });
        });
        setSchedules(Array.from(scheduleMap.values()));
      }

      // 에디터 내용 설정
      if (editor) {
        editor.commands.setContent(initialData.description || "");
      }
    } else {
      // 기존의 초기값 설정 코드
      setTitle("서울 3박 4일 여행");
      setHighlight("아름다운 서울의 풍경을 만끽하세요");
      setDescription(
        "서울의 아름다운 풍경을 둘러보는 3박 4일 여행입니다.디테일내용입니다."
      );
      setAddress("서울특별시 동작시");
      setDetailAddress("애월읍");
      setLatitude(33.450701);
      setLongitude(126.570667);
      setDate([new Date("2024-03-01"), new Date("2024-03-04")]);
      setMinParticipants(2);
      setMaxParticipants(10);
      setIsFree(false);
      setPrice("500000");
      setProvidedItems(["숙박", "식사", "교통"]);
      setNotProvidedItems(["항공권", "개인경비"]);
      setApprovalType("manual");
      setMinAge(20);
      setMaxAge(60);
      setIsScheduleEnabled(true);
      setTags(["제주도", "3박4일", "일출", "시티투어"]);
      setDiscountRate(0);
      setStartTime("09:00");

      // 일정 초기값 설정
      setSchedules([
        {
          day: 1,
          title: "제주도 도착 및 시티투어",
          items: [
            { time: "14:00", content: "제주도 도착 후 시티투어를 진행합니다." },
          ],
        },
        {
          day: 2,
          title: "성산일출봉 관광",
          items: [
            {
              time: "09:00",
              content: "성산일출봉에서 아름다운 일출을 감상합니다.",
            },
          ],
        },
      ]);
    }
  }, [mode, initialData, editor]);

  // 할인율 계산 함수
  const calculateDiscountRate = (
    originalPrice: number,
    discountedPrice: number
  ) => {
    if (originalPrice <= 0 || discountedPrice <= 0) return 0;
    const rate = ((originalPrice - discountedPrice) / originalPrice) * 100;
    return Math.round(rate); // 소수점 반올림
  };

  // 가격 변경 핸들러
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = e.target.value;
    setPrice(newPrice);
    if (discountedPrice) {
      const rate = calculateDiscountRate(
        Number(newPrice),
        Number(discountedPrice)
      );
      setDiscountRate(rate);
    }
  };

  // 할인가 변경 핸들러
  const handleDiscountedPriceChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newDiscountedPrice = e.target.value;
    setDiscountedPrice(newDiscountedPrice);
    if (price) {
      const rate = calculateDiscountRate(
        Number(price),
        Number(newDiscountedPrice)
      );
      setDiscountRate(rate);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      title,
      highlight,
      description,
      address,
      detailAddress,
      buildingCode,
      latitude,
      longitude,
      startDate:
        Array.isArray(date) && date[0]
          ? date[0].toISOString().split("T")[0]
          : "",
      endDate:
        Array.isArray(date) && date[1]
          ? date[1].toISOString().split("T")[0]
          : "",
      startTime,
      minParticipants,
      maxParticipants,
      isPaid: !isFree,
      price: isFree ? 0 : Number(price),
      discountRate: isFree ? 0 : discountRate,
      discountedPrice: isFree ? 0 : isDiscounted ? Number(discountedPrice) : 0,
      providedItems: providedItems.join(","),
      notProvidedItems: notProvidedItems.join(","),
      requiresApproval: approvalType === "manual",
      minAge,
      maxAge,
      hasSchedule: isScheduleEnabled,
      schedules: schedules.flatMap((schedule) =>
        schedule.items.map((item) => ({
          dayNumber: schedule.day,
          title: schedule.title,
          time: item.time,
          description: item.content,
        }))
      ),
      tags: tags.map((tag) => ({
        name: tag,
      })),
      images: images.map((url, index) => ({
        imageUrl: url,
        displayOrder: index,
      })),
      categoryId: selectedCategory,
    };

    try {
      const url = mode === "edit" 
        ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/travels/${initialData.id}`
        : `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/travels`;
      
      const method = mode === "edit" ? "put" : "post";
      
      const response = await instance[method](url, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.status === 200) {
        alert(mode === "edit" ? "여행이 성공적으로 수정되었습니다." : "여행이 성공적으로 생성되었습니다.");
        router.push(mode === "edit" ? `/trip/${initialData.id}` : "/");
      }
    } catch (error: any) {
      console.error(mode === "edit" ? "여행 수정 실패:" : "여행 생성 실패:", error);
      if (error.response) {
        alert(error.response.data.message || (mode === "edit" ? "여행 수정에 실패했습니다." : "여행 생성에 실패했습니다."));
      } else if (error.request) {
        alert("서버와 통신할 수 없습니다.");
      } else {
        alert(mode === "edit" ? "여행 수정 중 오류가 발생했습니다." : "여행 생성 중 오류가 발생했습니다.");
      }
    }
  };

  const compressImage = async (file: File) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error("이미지 압축 실패:", error);
      return file;
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('pathType', 'trip');

      console.log('Uploading file:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });

      try {
        const uploadResponse = await instance.post('/api/v1/s3/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('Upload response:', uploadResponse);

        if (uploadResponse.status === 200) {
          console.log('Upload successful, fileUrl:', uploadResponse.data.fileUrl);
          setImages((prev) => [...prev, uploadResponse.data.fileUrl]);
        } else {
          console.error('Upload failed with status:', uploadResponse.status);
          alert('이미지 업로드에 실패했습니다.');
        }
      } catch (error: any) {
        console.error('Upload error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        alert(error.response?.data?.message || '이미지 업로드에 실패했습니다.');
      }
    }

    // input 초기화
    if (e.target) {
      e.target.value = "";
    }
  };

  const handleEditorImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files || !e.target.files.length || !editor) return;

    const files = Array.from(e.target.files);

    for (const file of files) {
      const result = await uploadToS3(file, {
        pathType: "trip",
        maxSizeMB: 30,
        allowedTypes: ["image/"],
      });

      if (result.success) {
        // 이미지 삽입
        editor
          .chain()
          .focus()
          .setImage({
            src: getImageUrl(result.fileUrl),
            alt: "Uploaded image",
            title: "Uploaded image",
          })
          .run();

        // 이미지 삽입 후 약간의 지연을 두고 커서 이동
        setTimeout(() => {
          editor.commands.blur();
          editor.commands.setTextSelection(
            editor.state.selection.$anchor.pos + 1
          );
          editor.commands.insertContent("\n\n\n");
        }, 100);
      } else {
        alert(result.error || "이미지 업로드에 실패했습니다.");
      }
    }

    // input 초기화
    if (e.target) {
      e.target.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // 제공 항목 추가
  const handleAddProvidedItem = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (e.currentTarget.value) {
        const item = e.currentTarget.value.trim();
        if (!providedItems.includes(item)) {
          setProvidedItems([...providedItems, item]);
        }
        setProvidedInput("");
      }
    }
  };

  // 미제공 항목 추가
  const handleAddNotProvidedItem = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (e.currentTarget.value) {
        const item = e.currentTarget.value.trim();
        if (!notProvidedItems.includes(item)) {
          setNotProvidedItems([...notProvidedItems, item]);
        }
        setNotProvidedInput("");
      }
    }
  };

  // 태그 추가
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (e.currentTarget.value) {
        const tag = e.currentTarget.value.trim();
        if (!tags.includes(tag)) {
          setTags([...tags, tag]);
        }
        setTagInput("");
      }
    }
  };

  // 제공 항목 삭제
  const handleRemoveProvidedItem = (index: number) => {
    setProvidedItems(providedItems.filter((_, i) => i !== index));
  };

  // 미제공 항목 삭제
  const handleRemoveNotProvidedItem = (index: number) => {
    setNotProvidedItems(notProvidedItems.filter((_, i) => i !== index));
  };

  // 태그 삭제
  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // 다음 우편번호 서비스 콜백
  const handlePostcodeComplete = (data: any) => {
    console.log("Postcode data:", data);
    
    // 주소 설정
    setAddress(data.address);
    setDetailAddress(data.buildingName || "");
    setBuildingCode(data.buildingCode || "");
    
    // 카카오맵 API 로드 체크
    if (!window.kakao?.maps?.services) {
      console.log("Waiting for Kakao Maps services to load...");
      const checkServices = setInterval(() => {
        if (window.kakao?.maps?.services) {
          clearInterval(checkServices);
          console.log("Kakao Maps services loaded, proceeding with geocoding...");
          updateMapWithAddress(data.address);
        }
      }, 100);

      // 5초 후에도 로드되지 않으면 인터벌 중지
      setTimeout(() => {
        clearInterval(checkServices);
        console.error("Failed to load Kakao Maps services");
      }, 5000);
    } else {
      updateMapWithAddress(data.address);
    }
    
    // 모달 닫기
    setShowPostcode(false);
  };

  // 지도 업데이트 함수
  const updateMapWithAddress = (address: string) => {
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(address, (results: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const result = results[0];
        const coords = new window.kakao.maps.LatLng(result.y, result.x);

        // 마커 생성
        if (marker) {
          marker.setMap(null);
        }
        const newMarker = new window.kakao.maps.Marker({
          map: map,
          position: coords,
        });
        setMarker(newMarker);

        // 지도 이동
        map.setCenter(coords);
        map.setLevel(3);

        // 위도/경도 설정
        setLatitude(Number(result.y));
        setLongitude(Number(result.x));
      }
    });
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&libraries=services`}
        strategy="beforeInteractive"
        onLoad={() => {
          console.log("Kakao Maps script loaded");
          // API 로드 완료 확인을 위한 대기
          const checkInterval = setInterval(() => {
            if (window.kakao?.maps?.services) {
              console.log("Kakao Maps services confirmed loaded");
              clearInterval(checkInterval);
              setIsMapLoaded(true);
            }
          }, 100);

          // 5초 후에도 로드되지 않으면 인터벌 중지
          setTimeout(() => {
            clearInterval(checkInterval);
          }, 5000);
        }}
      />

      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-blue-500 transition-colors"
            >
              <HiXMark className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold">
              {mode === "edit" ? "여행 수정하기" : "여행 만들기"}
            </h1>
            <div className="w-6" />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto  space-y-6">
        {/* 이미지 업로드 섹션 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            여행 이미지
          </label>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <Image
                  src={getImageUrl(image)}
                  alt={`여행 이미지 ${index + 1}`}
                  width={100}
                  height={100}
                  className="rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <HiXMark className="w-4 h-4" />
                </button>
              </div>
            ))}
            {images.length < 3 && (
              <label className="w-[100px] h-[100px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <HiOutlinePhoto className="w-8 h-8 text-gray-400" />
              </label>
            )}
          </div>
        </div>

        {/* 제목 입력 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            여행 제목
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="여행 제목을 입력하세요"
            required
          />
        </div>

        {/* 여행 카테고리 선택 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            여행 카테고리
          </label>
          <select
            value={selectedCategory || ""}
            onChange={(e) => setSelectedCategory(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">카테고리를 선택하세요</option>
            {travelCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
          </select>
        </div>

        {/* 하이라이트 입력 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            여행 하이라이트
          </label>
          <div className="space-y-2">
            <textarea
              value={highlight}
              onChange={(e) => setHighlight(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="여행의 하이라이트를 입력하세요 (예: 제주도 3박 4일 힐링 여행)"
              rows={3}
              required
            />
            <p className="text-xs text-gray-500">
              여행의 주요 특징이나 매력을 간단히 설명해주세요.
            </p>
          </div>
        </div>

        {/* 설명 입력 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            여행 설명
          </label>
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

        {/* 위치 입력 */}
        <div className="mb-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            여행 위치
          </label>
          <div className="space-y-4 address-search-container">
            <div className="flex gap-2">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="주소를 검색하세요"
                readOnly
              />
              <button
                type="button"
                onClick={() => setShowPostcode(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                주소 검색
              </button>
            </div>
            <input
              type="text"
              value={detailAddress}
              onChange={(e) => setDetailAddress(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="상세주소를 입력하세요"
            />
            {/* <div ref={mapRef} className="w-full h-64 rounded-lg" /> */}
          </div>
        </div>

        {/* 다음 우편번호 서비스 모달 */}
        {showPostcode && (
          <div className="fixed inset-0 z-50">
            <div 
              className="absolute inset-0 bg-gray-30"
              onClick={() => setShowPostcode(false)}
            />
            <div className="relative h-full flex items-center justify-center p-4">
              <div className="bg-white rounded-lg w-full max-w-lg shadow-xl">
                <div className="flex justify-between items-center p-4 border-b">
                  <h3 className="text-lg font-medium">주소 검색</h3>
                  <button
                    onClick={() => setShowPostcode(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <HiXMark className="w-6 h-6" />
                  </button>
                </div>
                <div className="p-4">
                  <DaumPostcode
                    onComplete={handlePostcodeComplete}
                    style={{ width: '100%', height: '400px' }}
                    autoClose={false}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 날짜 선택 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            여행 기간
          </label>
          <div className="relative">
            <button
              ref={buttonRef}
              type="button"
              onClick={() => setShowCalendar(!showCalendar)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-left focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {Array.isArray(date) && date[0] && date[1]
                ? `${formatDate(date[0])} - ${formatDate(date[1])}`
                : "여행 기간을 선택하세요"}
            </button>
            <HiOutlineCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          {showCalendar && (
            <div
              ref={calendarRef}
              className="absolute z-50 mt-2 bg-white p-4 rounded-lg shadow-lg border border-gray-200"
            >
              <style jsx global>{`
                .react-calendar {
                  width: 100%;
                  border: none;
                  font-family: inherit;
                }
                .react-calendar__navigation {
                  margin-bottom: 1rem;
                }
                .react-calendar__navigation button {
                  min-width: 44px;
                  background: none;
                  font-size: 1rem;
                  font-weight: 500;
                  color: #374151;
                }
                .react-calendar__navigation button:enabled:hover,
                .react-calendar__navigation button:enabled:focus {
                  background-color: #f3f4f6;
                  border-radius: 0.5rem;
                }
                .react-calendar__month-view__weekdays {
                  text-align: center;
                  text-transform: uppercase;
                  font-weight: 500;
                  font-size: 0.75rem;
                  color: #6b7280;
                }
                .react-calendar__month-view__weekdays__weekday {
                  padding: 0.5rem;
                }
                .react-calendar__month-view__weekdays__weekday abbr {
                  text-decoration: none;
                }
                .react-calendar__tile {
                  padding: 0.75rem 0.5rem;
                  background: none;
                  text-align: center;
                  font-size: 0.875rem;
                  color: #374151;
                  border-radius: 0.5rem;
                }
                .react-calendar__tile:enabled:hover,
                .react-calendar__tile:enabled:focus {
                  background-color: #f3f4f6;
                }
                .react-calendar__tile--now {
                  background-color: #e5e7eb;
                  color: #374151;
                }
                .react-calendar__tile--now:enabled:hover,
                .react-calendar__tile--now:enabled:focus {
                  background-color: #d1d5db;
                }
                .react-calendar__tile--hasActive {
                  background-color: #3b82f6;
                  color: white;
                }
                .react-calendar__tile--hasActive:enabled:hover,
                .react-calendar__tile--hasActive:enabled:focus {
                  background-color: #2563eb;
                }
                .react-calendar__tile--active {
                  background-color: #3b82f6;
                  color: white;
                }
                .react-calendar__tile--active:enabled:hover,
                .react-calendar__tile--active:enabled:focus {
                  background-color: #2563eb;
                }
                .react-calendar__tile--range {
                  background-color: #93c5fd;
                  color: white;
                }
                .react-calendar__tile--rangeStart,
                .react-calendar__tile--rangeEnd {
                  background-color: #3b82f6;
                  color: white;
                }
                .react-calendar__tile--rangeStart:enabled:hover,
                .react-calendar__tile--rangeStart:enabled:focus,
                .react-calendar__tile--rangeEnd:enabled:hover,
                .react-calendar__tile--rangeEnd:enabled:focus {
                  background-color: #2563eb;
                }
              `}</style>
              <Calendar
                onChange={setDate}
                value={date}
                selectRange={true}
                minDate={new Date()}
                className="border-0"
                formatDay={(locale, date) =>
                  date.toLocaleString("en", { day: "numeric" })
                }
              />
            </div>
          )}
        </div>

        {/* 시작 시간 선택 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            시작 시간
          </label>
          <div className="relative">
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
              required
              onClick={(e) => e.currentTarget.showPicker()}
            />
            <HiOutlineClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>
        </div>

        {/* 참가자 수 선택 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            참가자 수
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                최소 인원
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={minParticipants}
                  onChange={(e) => setMinParticipants(Number(e.target.value))}
                  min={2}
                  max={maxParticipants}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <HiOutlineUserGroup className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                최대 인원
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={maxParticipants}
                  onChange={(e) => setMaxParticipants(Number(e.target.value))}
                  min={minParticipants}
                  max={20}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <HiOutlineUserGroup className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* 가격 입력 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            가격 설정
          </label>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="priceType"
                  checked={isFree}
                  onChange={() => setIsFree(true)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-600">무료 여행</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="priceType"
                  checked={!isFree}
                  onChange={() => setIsFree(false)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-600">유료 여행</span>
              </label>
            </div>
            {!isFree && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    id="isDiscounted"
                    checked={isDiscounted}
                    onChange={(e) => {
                      setIsDiscounted(e.target.checked);
                      if (!e.target.checked) {
                        setDiscountedPrice("");
                        setDiscountRate(0);
                      }
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="isDiscounted"
                    className="text-sm text-gray-600"
                  >
                    할인 적용
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={price}
                    onChange={handlePriceChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="정상가를 입력하세요"
                    required
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    ₩
                  </span>
                </div>
                {isDiscounted && (
                  <>
                    <div className="relative">
                      <input
                        type="number"
                        value={discountedPrice}
                        onChange={handleDiscountedPriceChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="할인가를 입력하세요"
                        required
                      />
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        ₩
                      </span>
                    </div>
                    {discountRate > 0 && (
                      <div className="text-sm text-red-500">
                        {discountRate}% 할인
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 제공/미제공 항목 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            제공/미제공 항목
          </label>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                제공 항목
              </h3>
              <div className="flex flex-wrap gap-2 mb-2">
                {providedItems.map((item, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => handleRemoveProvidedItem(index)}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      <HiXMark className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={providedInput}
                onChange={(e) => setProvidedInput(e.target.value)}
                onKeyDown={handleAddProvidedItem}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="제공 항목을 입력하고 Enter를 누르세요"
              />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                미제공 항목
              </h3>
              <div className="flex flex-wrap gap-2 mb-2">
                {notProvidedItems.map((item, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => handleRemoveNotProvidedItem(index)}
                      className="ml-2 text-red-600 hover:text-red-800"
                    >
                      <HiXMark className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={notProvidedInput}
                onChange={(e) => setNotProvidedInput(e.target.value)}
                onKeyDown={handleAddNotProvidedItem}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="미제공 항목을 입력하고 Enter를 누르세요"
              />
            </div>
          </div>
        </div>

        {/* 태그 입력 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            태그
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                {tag}
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
            placeholder="태그를 입력하고 Enter를 누르세요"
          />
        </div>

        {/* 승인 방식 선택 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            승인 방식
          </label>
          <div className="flex gap-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="approvalType"
                value="auto"
                checked={approvalType === "auto"}
                onChange={(e) =>
                  setApprovalType(e.target.value as "auto" | "manual")
                }
              />
              <span className="ml-2">자동 승인</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="approvalType"
                value="manual"
                checked={approvalType === "manual"}
                onChange={(e) =>
                  setApprovalType(e.target.value as "auto" | "manual")
                }
              />
              <span className="ml-2">수동 승인</span>
            </label>
          </div>
        </div>

        {/* 나이 제한 입력 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            나이 제한
          </label>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="number"
                min="0"
                max="100"
                value={minAge}
                onChange={(e) => setMinAge(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="최소 나이"
              />
            </div>
            <span>~</span>
            <div className="flex-1">
              <input
                type="number"
                min="0"
                max="100"
                value={maxAge}
                onChange={(e) => setMaxAge(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="최대 나이"
              />
            </div>
          </div>
        </div>

        {/* 일정 관리 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">
              일정 관리
            </label>
            <div className="flex items-center gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="scheduleType"
                  checked={!isScheduleEnabled}
                  onChange={() => setIsScheduleEnabled(false)}
                />
                <span className="ml-2">미등록</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="scheduleType"
                  checked={isScheduleEnabled}
                  onChange={() => setIsScheduleEnabled(true)}
                />
                <span className="ml-2">등록</span>
              </label>
            </div>
          </div>
          {isScheduleEnabled && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAddDay}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  일차 추가
                </button>
              </div>
              {schedules.map((schedule, dayIndex) => (
                <div
                  key={dayIndex}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Day {schedule.day}
                      </h3>
                      <input
                        type="text"
                        value={schedule.title}
                        onChange={(e) =>
                          handleUpdateDayTitle(dayIndex, e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="일차 제목을 입력하세요 (예: 제주도 도착 & 시티투어)"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDay(dayIndex)}
                      className="ml-4 text-red-500 hover:text-red-700"
                    >
                      <HiXMark className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {schedule.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="flex items-center justify-between bg-gray-50 p-2 rounded"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-blue-600 font-medium min-w-[60px]">
                            {item.time}
                          </span>
                          <span className="text-gray-700">{item.content}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveScheduleItem(dayIndex, itemIndex)
                          }
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <HiXMark className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <div className="flex gap-2 items-center">
                      <select
                        value={newScheduleItems[schedule.day]?.time || ""}
                        onChange={(e) =>
                          handleScheduleInputChange(
                            schedule.day,
                            "time",
                            e.target.value
                          )
                        }
                        className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">시간 선택</option>
                        {timeOptions.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={newScheduleItems[schedule.day]?.content || ""}
                        onChange={(e) =>
                          handleScheduleInputChange(
                            schedule.day,
                            "content",
                            e.target.value
                          )
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="일정을 입력하세요"
                      />
                      <button
                        type="button"
                        onClick={() => handleClearInput(schedule.day)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                      >
                        초기화
                      </button>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleAddScheduleItem(dayIndex)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        disabled={
                          !newScheduleItems[schedule.day]?.time ||
                          !newScheduleItems[schedule.day]?.content
                        }
                      >
                        일정 추가
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          {mode === "edit" ? "여행 수정하기" : "여행 만들기"}
        </button>
      </form>
    </div>
  );
}
