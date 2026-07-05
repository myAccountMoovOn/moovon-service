import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0057e7',
    background: '#f5f5f5',
    surface: '#ffffff',
    error: '#d62d20',
    onPrimary: '#ffffff',
    onSurface: '#333333',
    onBackground: '#333333',
    elevation: {
      ...DefaultTheme.colors.elevation,
      level1: '#ffffff',
      level2: '#ffffff',
      level3: '#ffffff',
      level4: '#ffffff',
      level5: '#ffffff',
    }
  },
};
