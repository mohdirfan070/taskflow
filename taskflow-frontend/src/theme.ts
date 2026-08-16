import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  fonts: {
    heading: `'Space Grotesk', sans-serif`,
    body: `'Inter', sans-serif`,
  },
  colors: {
    brand: {
      50: '#EFFCFA',
      100: '#CFF7F1',
      200: '#9FE9DC',
      300: '#5FC9BE',
      400: '#2FA69B',
      500: '#0F766E',
      600: '#0C5F58',
      700: '#0A4B45',
      800: '#083A36',
      900: '#062A27',
    },
    paper: {
      50: '#FBFBFA',
      100: '#F5F6F5',
      200: '#E7E9E8',
    },
    priorityHigh: '#C4523A',
    priorityMedium: '#C08A34',
    priorityLow: '#3F8562',
  },
  styles: {
    global: {
      'html, body': {
        backgroundColor: 'paper.100',
        color: '#1F2430',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: '600',
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'lg',
        },
      },
    },
  },
});

export default theme;
