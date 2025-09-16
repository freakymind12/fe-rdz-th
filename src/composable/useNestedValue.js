// Helper untuk akses nested path seperti 'sensor.temp'
export const getNestedValue = (obj, path) => {
  if (!obj || !path) return undefined
  
  return path
    .split('.')
    .reduce((acc, part) => {
      if (acc && Object.prototype.hasOwnProperty.call(acc, part)) {
        return acc[part]
      }
      return undefined
    }, obj)
}