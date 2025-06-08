export const categoryName = (categoryId: number) => {
    switch(categoryId) {
        case 1:
            return "힐링 & 웰니스";
        case 2:
            return "미식 & 음식 투어";
        case 3:
            return "사진 & 영상 투어";
        case 4:
            return "액티비티 & 모험";
        case 5:
            return "예술 & 문화";
        case 6:
            return "캠핑";
        case 7:
            return "파티 & 페스티벌";
        case 8:
            return "펫여행";
        default:
            return "기타";
    }
};

export const themes = [
    {
      id: 1,
      title: "힐링 & 웰니스",
      image:
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&auto=format&fit=crop&q=60",
    },
    {
      id: 2,
      title: "미식 & 음식 투어",
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&auto=format&fit=crop&q=60",
    },
    {
      id: 3,
      title: "사진 & 영상 투어",
      image:
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&auto=format&fit=crop&q=60",
    },
    {
      id: 4,
      title: "액티비티 & 모험",
      image:
        "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&auto=format&fit=crop&q=60",
    },
    {
      id: 5,
      title: "예술 & 문화",
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&auto=format&fit=crop&q=60",
    },
    {
      id: 6,
      title: "캠핑",
      image:
        "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&auto=format&fit=crop&q=60",
    },
    {
      id: 7,
      title: "파티 & 페스티벌",
      image:
        "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&auto=format&fit=crop&q=60",
    },
    {
      id: 8,
      title: "펫여행",
      image:
        "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&auto=format&fit=crop&q=60",
    },
];