import { t } from "@/i18n"; /** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      display: ['Poppins', 'sans-serif']
    },

    extend: {
      // Colors used in Project
      colors: {
        primary: t("tailwindconfig.05b6d3_2"),
        secondary: '#EF863E'
      },
      backgroundImage: {
        'login-bg-img': t("tailwindconfig.urlSrcAssetsImagesBgImageJpg_2"),
        'signup-bg-img': t("tailwindconfig.urlSrcAssetsImagesSignupBgImageJpg_2")
      }
    }
  },
  plugins: [
  require('tailwind-scrollbar')]

};