// Export Bundler Utility for Native Mobile (iOS AUv3 / Android Oboe) & PWA Offline Studio
// Resonance Audio Labs - Cross-Platform Audio Bundle Compiler

export interface ProjectExportBundle {
  projectName: string;
  category: string;
  version: string;
  iosAUv3ManifestPlist: string;
  androidCapacitorConfig: string;
  pwaManifest: string;
  serviceWorkerScript: string;
  presetDatabaseJson: string;
}

export function generateProjectExportBundle(projectName: string, category: string): ProjectExportBundle {
  const safeName = projectName.replace(/[^a-zA-Z0-9]/g, '');
  const bundleId = `com.resonanceaudiolabs.${safeName.toLowerCase()}`;

  const iosAUv3ManifestPlist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleIdentifier</key>
    <string>${bundleId}.auv3</string>
    <key>CFBundleName</key>
    <string>${projectName}</string>
    <key>CFBundleVersion</key>
    <string>1.0.0</string>
    <key>NSExtension</key>
    <dict>
        <key>NSExtensionPointIdentifier</key>
        <string>com.apple.AudioUnit-UI</string>
        <key>NSExtensionAttributes</key>
        <dict>
            <key>AudioComponents</key>
            <array>
                <dict>
                    <key>manufacturer</key>
                    <string>RESO</string>
                    <key>type</key>
                    <string>aurx</string>
                    <key>subtype</key>
                    <string>blep</string>
                    <key>version</key>
                    <integer>65536</integer>
                    <key>name</key>
                    <string>Resonance Audio Labs: ${projectName}</string>
                    <key>description</key>
                    <string>Native AUv3 Low-Latency Synthesizer Plugin for Logic Pro iOS & GarageBand</string>
                </dict>
            </array>
        </dict>
    </dict>
</dict>
</plist>`;

  const androidCapacitorConfig = `{
  "appId": "${bundleId}",
  "appName": "${projectName}",
  "webDir": "dist",
  "bundledWebRuntime": false,
  "plugins": {
    "AudioEngine": {
      "driver": "oboe_low_latency",
      "sampleRate": 48000,
      "bufferSize": 128,
      "exclusiveMode": true
    }
  },
  "server": {
    "androidScheme": "https",
    "cleartext": true
  }
}`;

  const pwaManifest = `{
  "short_name": "${projectName.slice(0, 12)}",
  "name": "${projectName} - Resonance Audio Studio",
  "icons": [
    {
      "src": "pwa-192x192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "pwa-512x512.png",
      "type": "image/png",
      "sizes": "512x512",
      "purpose": "any maskable"
    }
  ],
  "start_url": "/",
  "background_color": "#020617",
  "theme_color": "#4f46e5",
  "display": "standalone",
  "orientation": "any"
}`;

  const serviceWorkerScript = `// Resonance Offline Audio Studio Service Worker v1.0
const CACHE_NAME = 'resonance-audio-offline-v1';
const AUDIO_ASSETS = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(AUDIO_ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});`;

  const presetDatabaseJson = JSON.stringify(
    {
      studio: 'Resonance Audio Labs',
      project: projectName,
      exportedAt: new Date().toISOString(),
      audioFormatsSupported: ['WAV', 'FLAC', 'WebAudio', 'AUv3', 'Oboe'],
      dspSettings: {
        antiAliasing: 'PolyBLEP 8x',
        sampleRate: 48000,
        fftSize: 2048,
        latencyMs: 1.4,
      },
    },
    null,
    2
  );

  return {
    projectName,
    category,
    version: '1.0.0',
    iosAUv3ManifestPlist,
    androidCapacitorConfig,
    pwaManifest,
    serviceWorkerScript,
    presetDatabaseJson,
  };
}

export function downloadBundleAsZip(bundle: ProjectExportBundle) {
  const jsonContent = JSON.stringify(bundle, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${bundle.projectName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-native-mobile-auv3-bundle.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
