import { postForm } from './http'

export interface UploadedImage {
  imageUrl: string
  imagePath: string
}

export async function uploadSupportImage(file: File, folder: 'tickets' | 'reports'): Promise<UploadedImage> {
  const body = new FormData()
  body.append('image', file)
  body.append('folder', folder)
  return postForm<UploadedImage>('/support/screenshots/', body)
}
