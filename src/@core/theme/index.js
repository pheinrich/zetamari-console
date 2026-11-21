// Next Imports
import localFont from 'next/font/local'

// Theme Options Imports
import overrides from './overrides'
import colorSchemes from './colorSchemes'
import spacing from './spacing'
import shadows from './shadows'
import customShadows from './customShadows'
import typography from './typography'

// Inter's variable font (latin subset), self-hosted rather than loaded
// with next/font/google: that fetches Google's stylesheet at build time,
// and Google sometimes answers with fonts.gstatic.com/l/font?kit=... URLs
// that Turbopack can't resolve, failing the Vercel build. Same file
// Google serves for weights 300-900; SIL Open Font License.
const inter = localFont({
  src: '../../assets/fonts/inter-latin-variable.woff2',
  weight: '300 900',
  style: 'normal',
  display: 'swap',
  fallback: ['system-ui', 'arial'],
})

const theme = (settings, mode, direction) => {
  return {
    direction,
    components: overrides(settings.skin),
    colorSchemes: colorSchemes(settings.skin),
    ...spacing,
    shape: {
      borderRadius: 6,
      customBorderRadius: {
        xs: 2,
        sm: 4,
        md: 6,
        lg: 8,
        xl: 10
      }
    },
    shadows: shadows(mode),
    typography: typography(inter.style.fontFamily),
    customShadows: customShadows(mode),
    mainColorChannels: {
      light: '46 38 61',
      dark: '231 227 252',
      lightShadow: '46 38 61',
      darkShadow: '19 17 32'
    }
  }
}

export default theme
