export function getProperty(data, propertyName) {
  return data.find(item => item.code === propertyName)?.value;
}
// Linear interpolation function
export function lerp(start, end, t) {
  return start * (1 - t) + end * t;
}
