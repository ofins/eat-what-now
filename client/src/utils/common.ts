export const calculateDistance = (
  destLat: number,
  destLon: number,
  originLat: number,
  originLon: number
) => {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371; // Radius of the Earth in km
  const dLat = toRad(destLat - originLat);
  const dLon = toRad(destLon - originLon);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(originLat)) *
      Math.cos(toRad(destLat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};
