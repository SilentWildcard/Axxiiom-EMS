import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.axiomems.app',
  appName: 'Axiom EMS',
  webDir: 'dist',
  server: {
    // Allow cleartext HTTP only in dev; production always uses HTTPS via the deployed backend
    androidScheme: 'https',
    allowNavigation: ['axiom-ems.onrender.com'],
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: true, // set false for release builds
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#050B14',
      showSpinner: false,
      androidSpinnerStyle: 'small',
      spinnerColor: '#38BDF8',
    },
    StatusBar: {
      style: 'Dark',
      backgroundColor: '#0B1528',
    },
  },
};

export default config;
