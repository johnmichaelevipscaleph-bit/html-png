/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  // Externalize only Puppeteer packages; bundle @sparticuz/chromium so its files are included in the function
  serverExternalPackages: [
    'puppeteer',
    'puppeteer-core',
  ],
};

export default nextConfig;
