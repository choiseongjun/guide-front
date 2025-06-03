import { ReactNode } from 'react';

interface TravelImage {
  id: number;
  imageUrl: string;
  displayOrder: number;
  originalFileName: string;
  storedFileName: string;
  fileSize: number;
  isAdminApproved: boolean;
}

interface TravelUser {
  id: number;
  nickname: string;
  profileImageUrl: string | null;
}

interface TravelSchedule {
  id: number;
  dayNumber: number;
  title: string;
  description: string;
  time: string;
}

interface TravelTag {
  id: number;
  name: string;
}

interface RawTravel {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  address: string;
  minParticipants: number;
  maxParticipants: number;
  price: number;
  images: TravelImage[];
  likes: any[];
  participants: any[];
  user: TravelUser;
  highlight: string;
  description: string;
  detailAddress: string;
  latitude: number;
  longitude: number;
  currentParticipants: number | null;
  isPaid: boolean;
  discountRate: number;
  discountedPrice: number;
  providedItems: string;
  notProvidedItems: string;
  requiresApproval: boolean;
  minAge: number;
  maxAge: number;
  hasSchedule: boolean;
  productNumber: string;
  categoryId: number;
  schedules: TravelSchedule[];
  tags: TravelTag[];
  createdBy: string;
  updatedBy: string;
  liked: boolean;
  links: any[];
  reviews?: any[];
}

export interface ProcessedTravel {
  startTime?: string;
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  address: string;
  minParticipants: number;
  maxParticipants: number;
  price: number;
  originalPrice: number;
  discountPrice: number;
  image: string;
  duration: string;
  time: string;
  location: string;
  reviews: number;
  wishlist: number;
  facilities: string[];
  user: {
    id: number;
    nickname: string;
    profileImage: string;
  };
  highlight: string;
  description: string;
  detailAddress: string;
  latitude: number;
  longitude: number;
  currentParticipants: number | null;
  isPaid: boolean;
  discountRate: number;
  providedItems: string;
  notProvidedItems: string;
  requiresApproval: boolean;
  minAge: number;
  maxAge: number;
  hasSchedule: boolean;
  productNumber: string;
  categoryId: number;
  schedules: TravelSchedule[];
  tags: TravelTag[];
  createdBy: string;
  updatedBy: string;
  liked: boolean;
  links: any[];
  likes: any[];
  participants: {
    id: number;
    travelId: number;
    status: string;
    message: string;
    createdAt: string;
    updatedAt: string;
    user: {
      id: number;
      nickname: string;
      profileImageUrl: string | null;
    };
  }[];
}

export const processTravelData = (travel: RawTravel): ProcessedTravel => {
  return {
    ...travel,
    startTime: travel.schedules[0]?.time || "",
    image:
      travel.images.length > 0
        ? travel.images[0].imageUrl
        : "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&auto=format&fit=crop&q=60",
    price: travel.discountedPrice > 0 ? travel.discountedPrice : travel.price,
    originalPrice: travel.price,
    discountPrice: travel.discountedPrice,
    duration: `${Math.ceil(
      (new Date(travel.endDate).getTime() -
        new Date(travel.startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    )}일`,
    time: travel.schedules[0]?.time || "",
    location: travel.address.split(" ")[0],
    reviews: travel.reviews?.length || 0,
    wishlist: travel.likes?.length || 0,
    facilities: travel.providedItems.split(",").map((item) => item.trim()),
    user: {
      id: travel.user.id,
      nickname: travel.user.nickname,
      profileImage: travel.user.profileImageUrl || "",
    },
  };
};

export const processTravelList = (travels: RawTravel[]): ProcessedTravel[] => {
  return travels.map(processTravelData);
};
