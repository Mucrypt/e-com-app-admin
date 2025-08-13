import { toast } from 'react-hot-toast'

export function showAuthToast(type: 'success' | 'error', message: string) {
  const baseStyle = {
    fontWeight: '600',
    fontSize: '0.95rem',
    borderRadius: '0.5rem',
    padding: '0.75rem 1.25rem',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  }

  if (type === 'success') {
    toast.success(message, {
      style: {
        ...baseStyle,
        background: '#10b981',
        color: '#fff',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#10b981',
      },
      duration: 4000,
    })
  } else {
    toast.error(message, {
      style: {
        ...baseStyle,
        background: '#ef4444',
        color: '#fff',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#ef4444',
      },
      duration: 5000,
    })
  }
}
