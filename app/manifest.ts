import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Mieszkanko',
    short_name: 'Mieszkanko',
    description: 'Aplikacja do rozliczeń domowych',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#f161ee',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}