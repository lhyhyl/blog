import http from "@/config/request";

/** 获取所有的相册 */
export const getAllAlbum = (userId) => {
  return new Promise((resolve, reject) => {
    http.post("/api/photoAlbum/getAllAlbumList", {userId: userId}).then((res) => {
      resolve(res);
    });
  });
};

/** 获取相册内的图片 */
export const getAllPhotosByAlbumId = (id) => {
  return new Promise((resolve, reject) => {
    http.get(`/api/photo/getAllPhotosByAlbumId/${id}`, {}).then((res) => {
      resolve(res);
    });
  });
};
