// src/lib/cloudinary.ts

const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
  process.env.CLOUDINARY_CLOUD_NAME
}/image/upload`
const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default'

export async function uploadImageToCloudinary(file: File): Promise<string> {
  const data = new FormData()
  data.append('file', file)
  data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
  const res = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: 'POST',
    body: data,
  })
  const json = await res.json()
  if (!json.secure_url) throw new Error('Image upload failed')
  return json.secure_url
}
