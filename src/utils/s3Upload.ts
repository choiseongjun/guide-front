import axios from 'axios';

interface S3UploadOptions {
  maxSizeMB?: number;
  allowedTypes?: string[];
  pathType: string;
}

interface S3UploadResponse {
  fileUrl: string;
  success: boolean;
  error?: string;
}

/**
 * S3에 파일을 업로드하는 공통 함수
 * @param file 업로드할 파일
 * @param options 업로드 옵션
 * @returns Promise<S3UploadResponse>
 */
export const uploadToS3 = async (
  file: File,
  options: S3UploadOptions
): Promise<S3UploadResponse> => {
  try {
    // 파일 크기 체크 (기본값: 30MB)
    const maxSize = (options.maxSizeMB || 30) * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        fileUrl: '',
        success: false,
        error: `파일 크기는 ${options.maxSizeMB || 30}MB를 초과할 수 없습니다.`
      };
    }

    // 파일 타입 체크
    if (options.allowedTypes && !options.allowedTypes.some(type => file.type.startsWith(type))) {
      return {
        fileUrl: '',
        success: false,
        error: '허용되지 않는 파일 형식입니다.'
      };
    }

    // 파일 이름에서 확장자 추출
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    
    // 안전한 파일 이름 생성
    const safeFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${extension}`;
    
    // 새로운 File 객체 생성
    const safeFile = new File([file], safeFileName, { type: file.type });

    const formData = new FormData();
    formData.append('file', safeFile);
    formData.append('pathType', options.pathType);

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/s3/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return {
      fileUrl: response.data.fileUrl,
      success: true
    };
  } catch (error) {
    console.error('S3 업로드 실패:', error);
    return {
      fileUrl: '',
      success: false,
      error: '파일 업로드에 실패했습니다.'
    };
  }
};

/**
 * 여러 파일을 S3에 업로드하는 함수
 * @param files 업로드할 파일 배열
 * @param options 업로드 옵션
 * @returns Promise<S3UploadResponse[]>
 */
export const uploadMultipleToS3 = async (
  files: File[],
  options: S3UploadOptions
): Promise<S3UploadResponse[]> => {
  const uploadPromises = files.map(file => uploadToS3(file, options));
  return Promise.all(uploadPromises);
}; 