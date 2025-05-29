const getImageUrl = (imageUrl: string) => {
  return process.env.NEXT_PUBLIC_FILE_URL + "/" + imageUrl;
};

export { getImageUrl };
