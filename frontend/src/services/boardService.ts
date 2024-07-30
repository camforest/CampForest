import axios from 'axios';
import axiosInstance from './authService';

// const API_URL = 'http://192.168.100.203:8080';
const API_URL = 'http://192.168.100.167:8080';

export const boardWrite = async (userId: number, title: string, content: string, category: string, boardOpen: boolean, images: string[]) => {
  const formData = new FormData();
  const value = {
    userId: userId,
    title: title,
    content: content,
    category: category,
    boardOpen: boardOpen
  }
  const blob = new Blob([JSON.stringify(value)], {type: "application/json"})
  formData.append('boardRequestDto', blob);

  if (images.length > 0) {
    images.forEach((base64String, index) => {
      const binaryString = window.atob(base64String.split(',')[1]);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);

      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const imageBlob = new Blob([bytes], { type: "image/png" })
      formData.append(`files`, imageBlob, `${userId}_image_${index}.png`);
    });
  }
  
  try {
    console.log('write', axiosInstance.defaults.headers['Authorization'] );
    const response = await axiosInstance.post(`/board`, formData, {
      headers: {
        'Content-Type': `multipart/form-data`,
      },
    });
    console.log(response);
    console.log('Board Write successful');
  } catch (error) {
    console.error('Board Write failed:', error);
    throw error;
  }
}

export const boardList = (page: number, size: number) => {
  const params = { page: page, size: size };
  
  const response = axios.get(`${API_URL}/board`, {params});
  return response;
}

export const filteredBoardList = (category: string, page: number, size: number) => {
  const params = { category: category, page: page, size: size };
  
  const response = axios.get(`${API_URL}/board/category`, {params});
  return response;
}

export const boardDetail = (boardId: number) => {
  const params = { boardId: boardId };

  const response = axios.get(`${API_URL}/board/detail`, {params});
  return response;
}

// export const boardUpdate = (boardId: number) => {
//   const params = { boardId: boardId };

//   const response = axios.delete(`${API_URL}/board`, {params});
//   return response;
// }

export const boardDelete = (boardId: number) => {
  const params = { boardId: boardId };

  const response = axios.delete(`${API_URL}/board`, {params});
  return response;
}

export const boardLike = (boardId: number, userId: number) => {
  const response = axios.post(`${API_URL}/board/like?boardId=${boardId}&userId=${userId}`);
  console.log(response);
}

export const boardDislike = (boardId: number, userId: number) => {
  const response = axios.delete(`${API_URL}/board/like?boardId=${boardId}&userId=${userId}`);
  console.log(response);
}