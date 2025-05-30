const getImageUrl = (imageUrl: string) => {
  return process.env.NEXT_PUBLIC_FILE_URL + "/" + imageUrl;
};
const getProfileImage = (url: string | null) => {
  console.log("url=", url);
  if (!url) {
    return "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&auto=format&fit=crop&q=60";
  } else {
    if (url.includes("http")) {
      return url;
    } else {
      return getImageUrl(url);
    }
  }
};

export { getImageUrl, getProfileImage };
