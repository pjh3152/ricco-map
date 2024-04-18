// 사용자의 현재위치 리턴
const getCurLocation = () => {
  return new Promise((resolve, reject) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    } else {
      reject({
        latitude: 0,
        longitude: 0,
      });
    }
  });
};

export { getCurLocation };
