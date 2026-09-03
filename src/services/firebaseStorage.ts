import { initializeApp, getApps } from 'firebase/app'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'

const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

export interface UploadedImage {
  imageUrl: string
  imagePath: string
}

export function isFirebaseConfigured(): boolean {
  return Boolean(
    import.meta.env.VITE_FIREBASE_API_KEY &&
      import.meta.env.VITE_FIREBASE_PROJECT_ID &&
      import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  )
}

function firebaseApp() {
  if (!isFirebaseConfigured()) {
    throw new Error('Screenshot upload is not configured yet.')
  }
  const existing = getApps()[0]
  if (existing) return existing
  return initializeApp({
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  })
}

export async function uploadSupportImage(
  file: File,
  folder: 'tickets' | 'reports',
  accountId: string,
): Promise<UploadedImage> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error('Use a JPEG, PNG, or WebP image.')
  }
  if (file.size > MAX_BYTES) {
    throw new Error('Image must be 5MB or smaller.')
  }
  const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
  const imagePath = `${folder}/${accountId}/${crypto.randomUUID()}.${ext}`
  const storageRef = ref(getStorage(firebaseApp()), imagePath)
  await uploadBytes(storageRef, file, { contentType: file.type })
  const imageUrl = await getDownloadURL(storageRef)
  return { imageUrl, imagePath }
}
