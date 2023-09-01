export const generateMapPoint = (station) => {
  return {
    geometry: {
      location: {
        lat: station.latitude,
        lng: station.longitude,
      },
    },
    name: station.name,
    formatted_address: station.address,
  };
};

export const googleMapsApi = "AIzaSyCIYCycKF24mQXN1pJYFfCO-6azSETj_Qc";
