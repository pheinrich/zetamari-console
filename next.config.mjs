/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASEPATH,
  redirects: async () => {
    return [{
    source: '/',
    destination: '/dashboards/crm',
    permanent: true
  },
  // Inbound Emails became Channels - keep old links and bookmarks working
  {
    source: '/inbound-emails/:path*',
    destination: '/channels/:path*',
    permanent: true
  }]}
}

export default nextConfig
