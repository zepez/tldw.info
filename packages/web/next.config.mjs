import { withPlausibleProxy } from "next-plausible";

/** @type {import('next').NextConfig} */
const nextConfig = {};

const withPlausible = withPlausibleProxy();

export default withPlausible(nextConfig);
