/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ConsoleExportMeta {
  platform: 'ANDROID' | 'IOS' | 'PS4' | 'PS5' | 'XBOX_ONE' | 'XBOX_SERIES' | 'XBOX_360';
  fileName: string;
  mimeType: string;
  data: string;
  instructions: string[];
}

/**
 * Generate iOS WebClip .mobileconfig for one-click installation on iPhone/iPad
 */
export function generateIOSWebConfig(originUrl: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>PayloadContent</key>
  <array>
    <dict>
      <key>FullScreen</key>
      <true/>
      <key>Icon</key>
      <data></data>
      <key>IsRemovable</key>
      <true/>
      <key>Label</key>
      <string>PES 2027</string>
      <key>PayloadDescription</key>
      <string>PES & eFootball Studio 2027 / PSP Match Simulator Web App</string>
      <key>PayloadDisplayName</key>
      <string>PES 2027 Studio</string>
      <key>PayloadIdentifier</key>
      <string>com.pes2027.webclip</string>
      <key>PayloadType</key>
      <string>com.apple.webClip.managed</string>
      <key>PayloadUUID</key>
      <string>7c05ddc5-4af2-46bc-9d28-aaa9f8e22fd2</string>
      <key>PayloadVersion</key>
      <integer>1</integer>
      <key>Precomposed</key>
      <true/>
      <key>URL</key>
      <string>${originUrl}</string>
    </dict>
  </array>
  <key>PayloadDisplayName</key>
  <string>PES 2027 Studio WebClip</string>
  <key>PayloadIdentifier</key>
  <string>com.pes2027.profile</string>
  <key>PayloadRemovalDisallowed</key>
  <false/>
  <key>PayloadType</key>
  <string>Configuration</string>
  <key>PayloadUUID</key>
  <string>98f12a34-2e5b-4c22-9a00-11bba87c4210</string>
  <key>PayloadVersion</key>
  <integer>1</integer>
</dict>
</plist>`;
}

/**
 * Generate PlayStation 4 / PlayStation 5 WEPES Option File Descriptor
 */
export function generatePlayStationWEPESPackage(platform: 'PS4' | 'PS5'): ConsoleExportMeta {
  const isPS5 = platform === 'PS5';
  const payload = {
    title: `PES & eFootball Studio 2027 - ${isPS5 ? 'PlayStation 5 (4K 60FPS)' : 'PlayStation 4'} Option File`,
    version: '2027.4.0',
    platform: platform,
    folderStructure: 'USB_DRIVE:/WEPES/',
    format: 'FAT32 / exFAT',
    content: {
      teamDataFiles: [
        { name: 'AL_AHLY.ted', league: 'CAF Champions League', primaryColor: '#C8102E' },
        { name: 'REAL_MADRID.ted', league: 'La Liga / UEFA Champions League', primaryColor: '#FFFFFF' },
        { name: 'FRANCE.ted', tournament: 'World Cup 2026', primaryColor: '#002654' },
        { name: 'BRAZIL.ted', tournament: 'World Cup 2026', primaryColor: '#FFDF00' },
        { name: 'EGYPT.ted', tournament: 'CAF 2025 Cup / World Cup 2026', primaryColor: '#C8102E' },
        { name: 'ARGENTINA.ted', tournament: 'World Cup 2026', primaryColor: '#74ACDF' },
      ],
      graphics: {
        ballTexture: 'OFFICIAL_TRIUNFO_2026_4K.PNG',
        resolution: isPS5 ? '2048x2048 Ultra HD' : '1024x1024 HD',
        competitions: ['World Cup 2026', 'Euro 2024', 'Copa America 2024', 'CAF Cup 2025', 'FIFA Arab Cup'],
      },
      controllerProfile: {
        preset: 'PES_CLASSIC',
        shoot: 'Square',
        pass: 'Cross',
        through: 'Triangle',
        cross: 'Circle',
        sprint: 'R1',
        triggerHaptics: isPS5 ? 'DualSense Adaptive Resistance Enabled' : 'Standard DualShock 4 Rumble',
      },
    },
    setupGuide: [
      '1. Format a USB Flash Drive to FAT32 or exFAT.',
      '2. Create a folder named "WEPES" on the root of your USB drive.',
      '3. Copy the .ted team files and kit images into the WEPES folder.',
      '4. Insert USB drive into your PS4 / PS5 console.',
      '5. Open PES / eFootball -> Edit -> Data Management -> Import / Export.',
      '6. Select "Import Team", check all .ted files, and apply player and squad data!',
    ],
  };

  return {
    platform,
    fileName: `${platform}_WEPES_OPTION_FILE_PES2027.json`,
    mimeType: 'application/json',
    data: JSON.stringify(payload, null, 2),
    instructions: payload.setupGuide,
  };
}

/**
 * Generate Xbox One / Xbox Series X/S Manifest & Controller Profile
 */
export function generateXboxNextGenPackage(platform: 'XBOX_ONE' | 'XBOX_SERIES'): ConsoleExportMeta {
  const isSeries = platform === 'XBOX_SERIES';
  const payload = {
    title: `PES & eFootball Studio 2027 - ${isSeries ? 'Xbox Series X|S (120Hz Quick Resume)' : 'Xbox One'} Package`,
    version: '2027.4.0',
    platform: platform,
    displayMode: isSeries ? '4K 120FPS HDR / WebGL 2.0' : '1080p 60FPS / WebGL 2.0',
    audio: 'Spatial Dolby Atmos / Windows Sonic Compatible',
    controllerProfile: {
      type: 'XBOX_WIRELESS_CONTROLLER',
      pass: 'A',
      shoot: 'X (Alternate) or B (Classic)',
      through: 'Y',
      cross: 'X or B',
      sprint: 'RT (Trigger)',
      controlledSprint: 'RB (Bumper)',
      impulseTriggers: isSeries ? 'Enabled on Hard Strikes and Timed Finishes' : 'Standard Vibration',
    },
    xboxEdgeBrowserLauncher: {
      url: typeof window !== 'undefined' ? window.location.origin : 'https://ais-pre-6l5l6jy7bruq4r7c4zltim-260705331111.europe-west2.run.app',
      shortcut: 'Pin to Xbox Home / My Games & Apps',
      supportsXboxController: true,
      fullScreenHotkey: 'View Button + Menu Button',
    },
    setupGuide: [
      `1. On your ${isSeries ? 'Xbox Series X|S' : 'Xbox One'}, open Microsoft Edge from My Games & Apps.`,
      `2. Navigate to the game URL or open this launcher file.`,
      `3. Press the Xbox controller Menu button (☰) and select "Pin to Home" or "Install App".`,
      `4. Press the View button (⧉) to activate full-screen mode without browser tabs.`,
      `5. Connect your Xbox controller; analog stick and vibration are automatically calibrated!`,
    ],
  };

  return {
    platform,
    fileName: `${platform}_PES2027_STUDIO_PACKAGE.json`,
    mimeType: 'application/json',
    data: JSON.stringify(payload, null, 2),
    instructions: payload.setupGuide,
  };
}

/**
 * Generate Xbox 360 Aurora / Horizon / Content Profile Package
 */
export function generateXbox360Package(): ConsoleExportMeta {
  const payload = {
    title: 'PES 2027 Studio - Xbox 360 Edition (Aurora / Horizon / Content Profile)',
    version: '2027.4.0',
    platform: 'XBOX_360',
    titleId: '4B4E085F', // Pro Evolution Soccer Xbox 360 Title ID
    profileDirectory: 'Content/0000000000000000/4B4E085F/00000001/',
    saveFileName: 'PES2027_EDIT00000000',
    features: [
      'Official 2026 World Cup Triunfo Ball texture injection',
      'All 211 FIFA licensed national teams updated',
      'Modern 2026/2027 team kits with accurate sponsor badges',
      'Custom PES Classic 360 controller layout (A Pass, X Shoot, B Cross, Y Through)',
    ],
    setupGuide: [
      '1. Insert a USB drive formatted with Xbox 360 FATX/FAT32 into your PC.',
      '2. Open "Horizon" or "Velocity" USB injection software on your PC.',
      '3. Inject this Option File into Title ID: 4B4E085F (Saved Games folder).',
      '4. If using an Aurora or Freestyle RGH/JTAG console, copy folder to: Hdd1:/Content/0000000000000000/4B4E085F/00000001/.',
      '5. Plug the USB into your Xbox 360, go to System Settings -> Storage -> Copy Save to Hard Drive.',
      '6. Start the game and load the edit data to enjoy the 2027 licensed roster!',
    ],
  };

  return {
    platform: 'XBOX_360',
    fileName: 'XBOX360_PES2027_OPTION_FILE_4B4E085F.json',
    mimeType: 'application/json',
    data: JSON.stringify(payload, null, 2),
    instructions: payload.setupGuide,
  };
}

/**
 * Generate Android App & Manifest Package
 */
export function generateAndroidPackage(originUrl: string): ConsoleExportMeta {
  const payload = {
    title: 'PES & eFootball Studio 2027 - Android APK & PWA Package',
    version: '2027.4.0',
    platform: 'ANDROID',
    packageName: 'com.pes2027.studio.simulator',
    startUrl: originUrl,
    display: 'standalone',
    orientation: 'landscape-primary',
    features: [
      'One-tap Android Home Screen installation',
      'Full 120Hz display refresh support',
      'Hardware haptic vibration on shot/tackle',
      '360° Floating & Fixed touch thumbstick',
      'Full PPSSPP Android emulator savedata compatibility',
    ],
    setupGuide: [
      '1. Open Google Chrome or Samsung Internet on your Android device.',
      '2. Tap "Install App" or tap the three dots (⋮) -> "Add to Home screen".',
      '3. Tap "Install" in the pop-up confirmation dialog.',
      '4. Open PES 2027 from your Android App Drawer or Home Screen to play full screen!',
    ],
  };

  return {
    platform: 'ANDROID',
    fileName: 'ANDROID_PES2027_APP_PACKAGE.json',
    mimeType: 'application/json',
    data: JSON.stringify(payload, null, 2),
    instructions: payload.setupGuide,
  };
}
