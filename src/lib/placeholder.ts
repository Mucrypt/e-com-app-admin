// Utility for generating placeholder images
export function generatePlaceholderImage(
  width: number = 400,
  height: number = 400,
  text: string = 'Image Placeholder',
  bgColor: string = '#007ACC',
  textColor: string = '#ffffff'
): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${bgColor}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16px" 
            fill="${textColor}" text-anchor="middle" dy=".3em">${text}</text>
    </svg>
  `
  
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

export function generateProductPlaceholder(fileName?: string): string {
  const text = fileName ? `Product: ${fileName}` : 'Product Image'
  return generatePlaceholderImage(400, 400, text, '#007ACC', '#ffffff')
}

export function generateAvatarPlaceholder(name?: string): string {
  const text = name ? name.substring(0, 2).toUpperCase() : 'U'
  return generatePlaceholderImage(150, 150, text, '#6B7280', '#ffffff')
}