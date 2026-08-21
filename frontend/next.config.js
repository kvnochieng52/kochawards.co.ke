/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // External stock photos
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'i.pravatar.cc' },

      // Local dev backend
      { protocol: 'http', hostname: 'localhost', port: '8000' },
      { protocol: 'http', hostname: '127.0.0.1', port: '8000' },

      // Production backend (Laravel /storage/*)
      { protocol: 'https', hostname: 'kochawards.co.ke' },
      { protocol: 'http',  hostname: 'kochawards.co.ke' },
      { protocol: 'https', hostname: 'www.kochawards.co.ke' },
      { protocol: 'http',  hostname: 'www.kochawards.co.ke' },
    ],
  },
};

module.exports = nextConfig;
