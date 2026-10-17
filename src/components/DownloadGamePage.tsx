/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Download,
  Smartphone,
  Laptop,
  Gamepad2,
  HardDrive,
  CheckCircle2,
  Share2,
  Copy,
  ExternalLink,
  ShieldCheck,
  Zap,
  Play,
  ArrowLeft,
  Sliders,
  Sparkles,
  Info,
  Layers,
  Cpu,
  Monitor,
  Flame,
  Check,
  Terminal,
  Tv,
  Box,
} from 'lucide-react';
import { Official2026Logo } from './Official2026Ball.tsx';
import { usePWAInstall } from '../logic/usePWAInstall.ts';
import { soundFX } from '../game/soundFX.ts';
import { generatePSPSaveDataManifest, exportOptionFileJSON, ExportTeamData } from '../logic/patchExport.ts';
import {
  generateIOSWebConfig,
  generatePlayStationWEPESPackage,
  generateXboxNextGenPackage,
  generateXbox360Package,
  generateAndroidPackage,
} from '../logic/consolePackageExport.ts';

interface DownloadGamePageProps {
  onBackToHome: () => void;
  onLaunchInstantMatch: () => void;
  onOpenControls: () => void;
}

export type ConsolePlatformId =
  | 'ALL_PACKS'
  | 'ANDROID'
  | 'IOS'
  | 'PS4'
  | 'PS5'
  | 'XBOX_ONE'
  | 'XBOX_SERIES'
  | 'XBOX_360'
  | 'PSP_EMU'
  | 'OFFLINE_BUNDLE';

export const DownloadGamePage: React.FC<DownloadGamePageProps> = ({
  onBackToHome,
  onLaunchInstantMatch,
  onOpenControls,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<ConsolePlatformId>('ANDROID');
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const { isInstallable, isInstalled, install } = usePWAInstall();

  // Helper to trigger file download
  const triggerBlobDownload = (fileName: string, mimeType: string, content: string, successMsg: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    soundFX.playGoalScore();
    setDownloadSuccess(successMsg);
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  // 1. Android Package Download
  const handleDownloadAndroid = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://pes2027.studio';
    const pkg = generateAndroidPackage(origin);
    triggerBlobDownload(pkg.fileName, pkg.mimeType, pkg.data, 'Android Mobile & Tablet Package downloaded!');
  };

  // 2. iOS MobileConfig WebClip Download
  const handleDownloadIOS = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://pes2027.studio';
    const xml = generateIOSWebConfig(origin);
    triggerBlobDownload(
      'PES2027_Studio_iOS.mobileconfig',
      'application/x-apple-aspen-config;charset=utf-8',
      xml,
      'Apple iOS WebClip configuration profile downloaded!'
    );
  };

  // 3. PlayStation 4 WEPES Download
  const handleDownloadPS4 = () => {
    const pkg = generatePlayStationWEPESPackage('PS4');
    triggerBlobDownload(pkg.fileName, pkg.mimeType, pkg.data, 'PS4 WEPES Option File & Kit Package downloaded!');
  };

  // 4. PlayStation 5 4K WEPES Download
  const handleDownloadPS5 = () => {
    const pkg = generatePlayStationWEPESPackage('PS5');
    triggerBlobDownload(pkg.fileName, pkg.mimeType, pkg.data, 'PS5 4K 60FPS WEPES Option File Package downloaded!');
  };

  // 5. Xbox One Package Download
  const handleDownloadXboxOne = () => {
    const pkg = generateXboxNextGenPackage('XBOX_ONE');
    triggerBlobDownload(pkg.fileName, pkg.mimeType, pkg.data, 'Xbox One Option File & Launcher Package downloaded!');
  };

  // 6. Xbox Series X/S Package Download
  const handleDownloadXboxSeries = () => {
    const pkg = generateXboxNextGenPackage('XBOX_SERIES');
    triggerBlobDownload(pkg.fileName, pkg.mimeType, pkg.data, 'Xbox Series X|S 120Hz Ultra HD Package downloaded!');
  };

  // 7. Xbox 360 Aurora/Horizon Download
  const handleDownloadXbox360 = () => {
    const pkg = generateXbox360Package();
    triggerBlobDownload(pkg.fileName, pkg.mimeType, pkg.data, 'Xbox 360 Title ID 4B4E085F Aurora/Horizon Save downloaded!');
  };

  // Master All-in-One Console Package Download
  const handleDownloadAllConsolesMasterPack = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://pes2027.studio';
    const masterPack = {
      title: 'PES & eFootball Studio 2027 - Complete Multi-Console Master Pack',
      version: '2027.4.0',
      timestamp: new Date().toISOString(),
      officialBall: 'Official 2026 Triunfo Match Ball (دعنا نلعب كرة القدم)',
      platforms: {
        android: JSON.parse(generateAndroidPackage(origin).data),
        ios: { type: 'Apple MobileConfig WebClip', instructions: 'Install via Safari Profile Management' },
        ps4: JSON.parse(generatePlayStationWEPESPackage('PS4').data),
        ps5: JSON.parse(generatePlayStationWEPESPackage('PS5').data),
        xboxOne: JSON.parse(generateXboxNextGenPackage('XBOX_ONE').data),
        xboxSeriesXS: JSON.parse(generateXboxNextGenPackage('XBOX_SERIES').data),
        xbox360: JSON.parse(generateXbox360Package().data),
      },
      supportNote: 'Includes full 211 national teams, licensed 2026/2027 rosters, tactics, and 3D engine configs.',
    };

    triggerBlobDownload(
      'PES2027_ALL_CONSOLES_MASTER_PACKAGE.json',
      'application/json',
      JSON.stringify(masterPack, null, 2),
      'Complete All-in-One Multi-Console Master Pack downloaded!'
    );
  };

  // Standalone Single-File HTML Launcher Download
  const handleDownloadOfflineHTML = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://pes2027.studio';
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>PES & eFootball Studio 2027 - Portable Offline Launcher</title>
  <style>
    body { margin: 0; background: #030d22; color: #fff; font-family: system-ui, -apple-system, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; text-align: center; }
    .card { background: #061536; border: 2px solid #2563eb; border-radius: 24px; padding: 36px; max-width: 640px; box-shadow: 0 25px 50px rgba(0,0,0,0.8); }
    h1 { color: #38bdf8; margin: 12px 0 6px 0; font-size: 28px; text-transform: uppercase; }
    p { color: #93c5fd; font-size: 15px; line-height: 1.6; margin: 8px 0; }
    .badge { display: inline-block; background: #091b40; border: 1px solid #38bdf8; color: #38bdf8; padding: 4px 12px; border-radius: 9999px; font-family: monospace; font-size: 12px; margin-bottom: 12px; }
    .btn { display: inline-block; background: #2563eb; color: #fff; font-weight: bold; text-decoration: none; padding: 14px 28px; border-radius: 14px; margin-top: 20px; transition: 0.2s; font-size: 16px; box-shadow: 0 10px 25px rgba(37,99,235,0.5); }
    .btn:hover { background: #1d4ed8; transform: translateY(-2px); }
    .consoles { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin-top: 20px; font-size: 12px; color: #cbd5e1; }
    .consoles span { background: #0f275c; padding: 4px 10px; border-radius: 8px; border: 1px solid #1e40af; }
    .meta { font-family: monospace; font-size: 11px; color: #64748b; margin-top: 24px; }
  </style>
</head>
<body>
  <div class="card">
    <div style="font-size: 56px;">⚽</div>
    <div class="badge">OFFICIAL 2026 TRIUNFO EDITION</div>
    <h1>PES & eFootball Studio 2027</h1>
    <p>Portable Offline Game Launcher for All Platforms: Android, iOS, PS4, PS5, Xbox One, Xbox Series X|S, and Xbox 360.</p>
    <a href="${origin}" class="btn">Launch Game in Browser / Console</a>
    <div class="consoles">
      <span>Android</span><span>iOS</span><span>PS4</span><span>PS5</span><span>Xbox One</span><span>Xbox Series X|S</span><span>Xbox 360</span><span>PPSSPP</span>
    </div>
    <div class="meta">v2027.4.0 • 211 FIFA Licensed Nations • 60 FPS WebGL Engine</div>
  </div>
</body>
</html>`;

    triggerBlobDownload(
      'PES_2027_Studio_Portable_Launcher.html',
      'text/html;charset=utf-8',
      htmlContent,
      'Portable Offline HTML Launcher downloaded!'
    );
  };

  // PPSSPP Option File & Controls INI Download
  const handleDownloadPPSSPPSave = () => {
    const mockTeam: ExportTeamData = {
      id: 'TM_EGY_01',
      name: 'Egypt',
      shortName: 'EGY',
      country: 'Egypt',
      league: 'CAF African Nations',
      manager: 'Hossam Hassan',
      formation: '4-3-3',
      players: [
        { id: 'P_1', name: 'Mohamed Salah', position: 'RWF', overall: 89, kitNumber: 10, age: 34 },
        { id: 'P_2', name: 'Mostafa Mohamed', position: 'CF', overall: 81, kitNumber: 11, age: 28 },
      ],
      colors: { primary: '#E10600', secondary: '#FFFFFF' },
    };
    const manifest = generatePSPSaveDataManifest(mockTeam);
    const jsonStr = exportOptionFileJSON([mockTeam]);

    const bundle = {
      manifest,
      optionFile: JSON.parse(jsonStr),
      title: 'PPSSPP & Sony PSP Handheld SaveData (ULES-01598)',
      instructions: 'Extract into PSP/SAVEDATA/ULES01598_DATA/ on internal storage or Memory Stick.',
    };

    triggerBlobDownload(
      'PES2027_PSP_SAVEDATA_ULES01598.json',
      'application/json',
      JSON.stringify(bundle, null, 2),
      'PPSSPP Option File & SaveData downloaded!'
    );
  };

  // Handle URL copy for QR / Mobile sharing
  const handleCopyUrl = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.origin);
      setCopiedUrl(true);
      soundFX.playWhistle();
      setTimeout(() => setCopiedUrl(false), 2500);
    }
  };

  const platformsConfig = [
    {
      id: 'ANDROID' as const,
      label: 'Android',
      badge: 'Mobile & Tablet',
      icon: Smartphone,
      color: 'from-emerald-600 to-green-700',
      activeBorder: 'border-emerald-400',
      tag: 'APK & PWA',
    },
    {
      id: 'IOS' as const,
      label: 'Apple iOS',
      badge: 'iPhone & iPad',
      icon: Smartphone,
      color: 'from-slate-600 to-zinc-700',
      activeBorder: 'border-slate-300',
      tag: 'WebClip Profile',
    },
    {
      id: 'PS4' as const,
      label: 'PlayStation 4',
      badge: 'Sony PS4 Console',
      icon: Gamepad2,
      color: 'from-blue-700 to-indigo-900',
      activeBorder: 'border-blue-400',
      tag: 'WEPES USB .TED',
    },
    {
      id: 'PS5' as const,
      label: 'PlayStation 5',
      badge: 'Sony PS5 Next-Gen',
      icon: Gamepad2,
      color: 'from-cyan-600 to-blue-800',
      activeBorder: 'border-cyan-300',
      tag: '4K DualSense',
    },
    {
      id: 'XBOX_ONE' as const,
      label: 'Xbox One',
      badge: 'Microsoft Console',
      icon: Tv,
      color: 'from-green-600 to-emerald-800',
      activeBorder: 'border-green-400',
      tag: 'USB / Edge PWA',
    },
    {
      id: 'XBOX_SERIES' as const,
      label: 'Xbox Series X|S',
      badge: 'Next-Gen 120Hz',
      icon: Tv,
      color: 'from-emerald-500 to-teal-800',
      activeBorder: 'border-emerald-300',
      tag: '120FPS HDR',
    },
    {
      id: 'XBOX_360' as const,
      label: 'Xbox 360',
      badge: 'Classic 360 Console',
      icon: Box,
      color: 'from-lime-600 to-emerald-700',
      activeBorder: 'border-lime-400',
      tag: 'Aurora / Horizon',
    },
    {
      id: 'PSP_EMU' as const,
      label: 'PPSSPP & PSP',
      badge: 'Handheld Console',
      icon: Gamepad2,
      color: 'from-amber-600 to-orange-700',
      activeBorder: 'border-amber-400',
      tag: 'ULES-01598',
    },
    {
      id: 'OFFLINE_BUNDLE' as const,
      label: 'Offline PC / Mac',
      badge: 'Portable HTML5',
      icon: HardDrive,
      color: 'from-teal-600 to-cyan-800',
      activeBorder: 'border-teal-400',
      tag: 'Single-File',
    },
  ];

  return (
    <div className="w-full h-full bg-[#030d22] text-white flex flex-col justify-between p-4 sm:p-8 overflow-y-auto font-sans select-none bg-gradient-to-b from-[#061536] via-[#040f29] to-[#020713]">
      {/* Top Header Bar */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between pb-4 sm:pb-6 border-b border-blue-900/60 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#091b40] hover:bg-blue-900 border border-blue-700/80 text-white font-bold text-xs shadow cursor-pointer transition-all active:scale-95"
            title="Return to Main Mode Choose Hub"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Back to Hub</span>
          </button>
          <div className="flex items-center gap-2">
            <Official2026Logo ballSize={36} showSubtitles={false} />
            <div>
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-white uppercase drop-shadow flex items-center gap-1.5">
                <span>DOWNLOAD GAME TO PLAY</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono">
                  MULTI-PLATFORM
                </span>
              </h1>
              <p className="text-[11px] text-blue-200">
                Android • iOS • PS4 • PS5 • Xbox One • Xbox Series X|S • Xbox 360 • PPSSPP
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadAllConsolesMasterPack}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 border border-purple-400/60 text-white font-bold text-xs shadow cursor-pointer transition-all active:scale-95"
            title="Download Master All-in-One Console Archive"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ALL PACKS (.ZIP)</span>
          </button>

          <button
            onClick={onOpenControls}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#091b40] hover:bg-blue-900 border border-blue-700/80 text-white font-bold text-xs shadow cursor-pointer transition-all active:scale-95"
            title="Configure Xbox, PlayStation, Mobile Touch & Keyboard"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Controls</span> ⚙️
          </button>

          <button
            onClick={onLaunchInstantMatch}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs uppercase shadow cursor-pointer transition-all active:scale-95"
            title="Play Exhibition Match Now in Browser"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>PLAY NOW</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-7xl mx-auto my-6 flex-1 flex flex-col gap-6">
        {/* Success Alert Banner */}
        {downloadSuccess && (
          <div className="w-full px-4 py-3 rounded-2xl bg-emerald-950/90 border-2 border-emerald-500 flex items-center justify-between text-emerald-200 text-sm font-semibold shadow-xl animate-bounce">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{downloadSuccess}</span>
            </div>
            <button
              onClick={() => setDownloadSuccess(null)}
              className="text-xs text-emerald-400 hover:text-white font-mono cursor-pointer"
            >
              DISMISS
            </button>
          </div>
        )}

        {/* Hero Banner: Free & Open Multi-Console Architecture */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#0d2254] via-[#08183d] to-[#040f26] border-2 border-blue-600/80 p-6 sm:p-8 shadow-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/90 border border-blue-700 text-xs font-mono text-cyan-300 mb-3 shadow">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span>OFFICIAL 2026 TRIUNFO BALL • ALL CONSOLES &amp; MOBILE DEVICES SUPPORTED</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black uppercase text-white tracking-tight drop-shadow-md">
              DOWNLOAD &amp; PLAY ON YOUR PLATFORM
            </h2>
            <p className="text-sm text-blue-100 font-medium mt-2 leading-relaxed">
              Select your system below to get tailored installation packages, USB option files, controller
              mappings, and step-by-step guides for <strong>Android, iOS, PS4, PS5, Xbox One, Xbox Series X/S, and Xbox 360</strong>.
            </p>

            {/* Quick Badges Row */}
            <div className="flex flex-wrap items-center gap-2 mt-4 text-xs font-mono text-cyan-300">
              <span className="bg-[#091b40] px-2.5 py-1 rounded-lg border border-blue-800 text-emerald-300 font-bold">
                ✓ Android &amp; iOS Touch
              </span>
              <span className="bg-[#091b40] px-2.5 py-1 rounded-lg border border-blue-800 text-blue-300 font-bold">
                ✓ PS4 &amp; PS5 WEPES USB
              </span>
              <span className="bg-[#091b40] px-2.5 py-1 rounded-lg border border-blue-800 text-green-300 font-bold">
                ✓ Xbox One, Series X|S &amp; 360
              </span>
              <span className="bg-[#091b40] px-2.5 py-1 rounded-lg border border-blue-800 text-amber-300 font-bold">
                ✓ PPSSPP Handheld
              </span>
            </div>
          </div>

          <div className="relative z-10 flex flex-col items-center text-center shrink-0">
            <Official2026Logo ballSize={110} layout="vertical" />
            <button
              onClick={handleDownloadAllConsolesMasterPack}
              className="mt-3 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Master Pack</span>
            </button>
          </div>
        </div>

        {/* 9-Platform Selector Tabs Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2">
          {platformsConfig.map((p) => {
            const Icon = p.icon;
            const isSelected = selectedPlatform === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  soundFX.playKick(0.35);
                  setSelectedPlatform(p.id);
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? `bg-gradient-to-b ${p.color} border-2 ${p.activeBorder} text-white shadow-xl scale-102`
                    : 'bg-[#061536]/80 hover:bg-[#091b40] border-blue-900/60 text-slate-300 hover:text-white'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center mb-1.5">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="font-extrabold text-xs tracking-tight">{p.label}</div>
                <div className="text-[10px] font-mono opacity-80 mt-0.5">{p.tag}</div>
              </button>
            );
          })}
        </div>

        {/* =========================================================================
            PLATFORM CONTENT CARDS
        ========================================================================== */}

        {/* 1. ANDROID */}
        {selectedPlatform === 'ANDROID' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-3xl bg-[#061536]/90 border border-emerald-500/60 p-6 sm:p-8 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black uppercase text-white">Android Mobile &amp; Tablet Edition</h3>
                      <p className="text-xs text-emerald-300 font-mono">APK Web Installer • Fullscreen PWA • 120Hz</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 font-mono text-xs font-bold border border-emerald-800">
                    ANDROID 8.0+
                  </span>
                </div>

                <p className="text-sm text-blue-100 font-medium leading-relaxed">
                  Play with full mobile touchscreen controls: 360° virtual floating joystick, eFootball &amp; FC Mobile diamond action buttons,
                  vibration haptic feedback, and offline capabilities.
                </p>

                <div className="mt-5 space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                      1
                    </span>
                    <div>
                      <span className="font-bold text-white">Direct One-Tap PWA Install:</span> In Chrome or Samsung Internet, tap the <strong>Install on Android</strong> button below to place the app directly onto your home screen.
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                      2
                    </span>
                    <div>
                      <span className="font-bold text-white">PPSSPP Android Setup:</span> If you play via PPSSPP Android emulator, download our SaveData pack and copy to <code>/PSP/SAVEDATA/ULES01598_DATA/</code>.
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-blue-900/60 flex flex-wrap gap-3">
                {isInstallable ? (
                  <button
                    onClick={install}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-black text-xs uppercase shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>INSTALL APP TO ANDROID</span>
                  </button>
                ) : null}

                <button
                  onClick={handleDownloadAndroid}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#091b40] hover:bg-blue-900 border border-blue-700 text-white font-bold text-xs uppercase shadow flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>DOWNLOAD ANDROID PACKAGE</span>
                </button>
              </div>
            </div>

            {/* QR Card */}
            <div className="rounded-3xl bg-[#09183d]/90 border border-emerald-500/40 p-6 flex flex-col items-center justify-between text-center shadow-xl">
              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-800">
                  SCAN WITH ANDROID PHONE
                </span>
                <h4 className="text-lg font-black uppercase text-white mt-2">Instant Play on Phone</h4>
                <div className="my-4 p-3 rounded-2xl bg-white border-4 border-emerald-400 shadow-xl inline-block">
                  <div className="text-3xl">📱</div>
                  <div className="text-[10px] font-black text-slate-900 mt-1">PES 2027 ANDROID</div>
                </div>
                <p className="text-xs text-blue-200">Point your camera to play or copy the URL to share!</p>
              </div>

              <button
                onClick={handleCopyUrl}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all mt-4"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedUrl ? 'LINK COPIED!' : 'SHARE ANDROID LINK'}</span>
              </button>
            </div>
          </div>
        )}

        {/* 2. APPLE IOS */}
        {selectedPlatform === 'IOS' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-3xl bg-[#061536]/90 border border-slate-400/60 p-6 sm:p-8 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-500/20 border border-slate-400/40 flex items-center justify-center text-slate-200">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black uppercase text-white">Apple iOS (iPhone &amp; iPad)</h3>
                      <p className="text-xs text-slate-300 font-mono">Safari WebClip Profile • Fullscreen Retina</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-slate-900 text-slate-200 font-mono text-xs font-bold border border-slate-700">
                    iOS 14.0+
                  </span>
                </div>

                <p className="text-sm text-blue-100 font-medium leading-relaxed">
                  Experience true full-screen football on iPhone and iPad with zero Safari address bars, ProMotion 120Hz display responsiveness,
                  and official 2026 Triunfo app icon on your Home Screen.
                </p>

                <div className="mt-5 space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                    <span className="w-5 h-5 rounded-full bg-slate-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                      1
                    </span>
                    <div>
                      <span className="font-bold text-white">Safari Add to Home Screen:</span> In Safari, tap the <strong>Share</strong> button (<Share2 className="w-3 h-3 inline mx-0.5 text-cyan-400" />) then choose <strong>&quot;Add to Home Screen&quot;</strong>.
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                    <span className="w-5 h-5 rounded-full bg-slate-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                      2
                    </span>
                    <div>
                      <span className="font-bold text-white">WebClip .mobileconfig Profile:</span> Or download our certified <code>.mobileconfig</code> profile for one-click installation into Settings -&gt; Profile Downloaded.
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-blue-900/60 flex flex-wrap gap-3">
                <button
                  onClick={handleDownloadIOS}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-slate-700 to-zinc-700 hover:from-slate-600 hover:to-zinc-600 text-white font-black text-xs uppercase shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>DOWNLOAD IOS WEBCLIP (.MOBILECONFIG)</span>
                </button>

                <button
                  onClick={handleCopyUrl}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#091b40] hover:bg-blue-900 border border-blue-700 text-white font-bold text-xs uppercase shadow flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
                >
                  <Copy className="w-4 h-4 text-cyan-400" />
                  <span>{copiedUrl ? 'SAFARI URL COPIED!' : 'COPY URL FOR SAFARI'}</span>
                </button>
              </div>
            </div>

            {/* iOS Info card */}
            <div className="rounded-3xl bg-[#09183d]/90 border border-slate-700 p-6 flex flex-col justify-between shadow-xl">
              <div>
                <span className="px-3 py-1 rounded-full bg-slate-900 text-slate-300 font-mono text-[10px] font-bold border border-slate-700">
                  IOS BLUETOOTH GAMEPADS
                </span>
                <h4 className="text-lg font-black uppercase text-white mt-2">PS5 &amp; Xbox on iPhone</h4>
                <p className="text-xs text-blue-200 mt-2 leading-relaxed">
                  iOS fully supports Sony PS5 DualSense and Xbox Wireless Controllers via Bluetooth. Pair in iOS Settings -&gt; Bluetooth to play with console hardware controls!
                </p>
              </div>
              <button
                onClick={onOpenControls}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shadow flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all mt-4 border border-slate-600"
              >
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>CONFIGURE IOS GAMEPAD</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. PLAYSTATION 4 */}
        {selectedPlatform === 'PS4' && (
          <div className="rounded-3xl bg-[#061536]/90 border border-blue-500/80 p-6 sm:p-8 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-blue-900/60">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/50 flex items-center justify-center text-blue-300">
                    <Gamepad2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black uppercase text-white">PlayStation 4 Edition</h3>
                    <p className="text-xs text-blue-300 font-mono">WEPES USB Option File • .TED Squads • DualShock 4</p>
                  </div>
                </div>

                <button
                  onClick={handleDownloadPS4}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>DOWNLOAD PS4 WEPES PACKAGE (.JSON / .ZIP)</span>
                </button>
              </div>

              {/* Step by Step USB instructions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
                  <div className="text-cyan-400 font-mono text-xs font-bold mb-1">STEP 1: PREPARE USB</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Format USB drive to <strong>FAT32</strong>. Create a folder named exactly <code className="text-emerald-400 font-bold">WEPES</code> on the root of your USB flash drive.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
                  <div className="text-cyan-400 font-mono text-xs font-bold mb-1">STEP 2: EXTRACT .TED FILES</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Copy the downloaded team data (<code>AL_AHLY.ted</code>, <code>REAL_MADRID.ted</code>, etc.) and official 2026 kit PNGs into the <code>WEPES</code> folder.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
                  <div className="text-cyan-400 font-mono text-xs font-bold mb-1">STEP 3: IMPORT IN PS4</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Insert USB into PS4 -&gt; Go to <strong>Edit Menu</strong> -&gt; <strong>Data Management</strong> -&gt; <strong>Import Team</strong> -&gt; Check all teams and import!
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-blue-900/60 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Includes 211 Nations, 2026 Triunfo Ball Textures, and Classic PES PS4 Controls (Square Shoot, R1 Sprint).</span>
            </div>
          </div>
        )}

        {/* 4. PLAYSTATION 5 */}
        {selectedPlatform === 'PS5' && (
          <div className="rounded-3xl bg-[#061536]/90 border border-cyan-400/80 p-6 sm:p-8 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-blue-900/60">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300">
                    <Gamepad2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black uppercase text-white">PlayStation 5 Next-Gen Edition</h3>
                    <p className="text-xs text-cyan-300 font-mono">4K Ultra HD Kits • DualSense Haptic Feedback • 60/120 FPS</p>
                  </div>
                </div>

                <button
                  onClick={handleDownloadPS5}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>DOWNLOAD PS5 4K PACKAGE (.JSON / .ZIP)</span>
                </button>
              </div>

              {/* PS5 Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
                  <div className="text-cyan-300 font-mono text-xs font-bold mb-1">DUALSENSE TRIGGER FEEDBACK</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Custom haptic curve for HyperMotion Power Shots and heavy tackles with progressive trigger resistance.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
                  <div className="text-cyan-300 font-mono text-xs font-bold mb-1">4K ULTRA HD TEXTURES</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Official 2048x2048 Triunfo ball mapping, pitch grass shaders, and licensed 2026 World Cup national jerseys.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
                  <div className="text-cyan-300 font-mono text-xs font-bold mb-1">PS5 USB EXPORT / IMPORT</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Format USB to exFAT, place files in <code>/WEPES/</code> folder, and import via PS5 Data Management menu.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-blue-900/60 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Optimized for Sony PlayStation 5 console storage &amp; DualSense wireless controllers.</span>
            </div>
          </div>
        )}

        {/* 5. XBOX ONE */}
        {selectedPlatform === 'XBOX_ONE' && (
          <div className="rounded-3xl bg-[#061536]/90 border border-green-500/80 p-6 sm:p-8 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-blue-900/60">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-green-600/20 border border-green-500/50 flex items-center justify-center text-green-300">
                    <Tv className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black uppercase text-white">Xbox One Edition</h3>
                    <p className="text-xs text-green-300 font-mono">Microsoft Edge PWA • Xbox One Wireless Controller • 1080p 60FPS</p>
                  </div>
                </div>

                <button
                  onClick={handleDownloadXboxOne}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>DOWNLOAD XBOX ONE PACKAGE (.JSON)</span>
                </button>
              </div>

              {/* Xbox One Edge Guide */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
                  <div className="text-green-400 font-mono text-xs font-bold mb-1">STEP 1: LAUNCH MICROSOFT EDGE</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Open Microsoft Edge from <strong>My Games &amp; Apps</strong> on your Xbox One dashboard.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
                  <div className="text-green-400 font-mono text-xs font-bold mb-1">STEP 2: PIN TO XBOX HOME</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Navigate to this game page, press the Xbox controller <strong>Menu (☰)</strong> button, and select <strong>&quot;Pin to Home&quot;</strong>.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
                  <div className="text-green-400 font-mono text-xs font-bold mb-1">STEP 3: FULL SCREEN &amp; PLAY</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Press the <strong>View button (⧉)</strong> to toggle immersive full screen with native Xbox controller vibration!
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-blue-900/60 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Supports Xbox One, Xbox One S, and Xbox One X hardware with Xbox Wireless Controller.</span>
            </div>
          </div>
        )}

        {/* 6. XBOX SERIES X|S */}
        {selectedPlatform === 'XBOX_SERIES' && (
          <div className="rounded-3xl bg-[#061536]/90 border border-emerald-400/80 p-6 sm:p-8 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-blue-900/60">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300">
                    <Tv className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black uppercase text-white">Xbox Series X | Series S Edition</h3>
                    <p className="text-xs text-emerald-300 font-mono">120Hz Refresh • 4K HDR • Quick Resume • Impulse Triggers</p>
                  </div>
                </div>

                <button
                  onClick={handleDownloadXboxSeries}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>DOWNLOAD XBOX SERIES X|S PACKAGE (.JSON)</span>
                </button>
              </div>

              {/* Xbox Series X|S Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
                  <div className="text-emerald-300 font-mono text-xs font-bold mb-1">120HZ ULTRA HIGH FRAME RATE</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Unlocked 120Hz refresh rate on compatible HDMI 2.1 TVs for ultra-responsive dribbling and timed finishing.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
                  <div className="text-emerald-300 font-mono text-xs font-bold mb-1">IMPULSE TRIGGER VIBRATION</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Independent motor feedback on RT sprint and LT power shot charge for realistic boot-to-ball strike sensation.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
                  <div className="text-emerald-300 font-mono text-xs font-bold mb-1">XBOX EDGE QUICK RESUME</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Pin directly to Xbox Series dashboard to resume matches instantly where you left off.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-blue-900/60 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Optimized for Xbox Series X and Xbox Series S with spatial Windows Sonic sound.</span>
            </div>
          </div>
        )}

        {/* 7. XBOX 360 */}
        {selectedPlatform === 'XBOX_360' && (
          <div className="rounded-3xl bg-[#061536]/90 border border-lime-500/80 p-6 sm:p-8 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-blue-900/60">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-lime-500/20 border border-lime-400/50 flex items-center justify-center text-lime-300">
                    <Box className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black uppercase text-white">Xbox 360 Edition (Aurora &amp; Horizon)</h3>
                    <p className="text-xs text-lime-300 font-mono">Title ID: 4B4E085F • Content Profile • USB Injection</p>
                  </div>
                </div>

                <button
                  onClick={handleDownloadXbox360}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-lime-600 to-green-700 hover:from-lime-500 hover:to-green-600 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>DOWNLOAD XBOX 360 OPTION FILE (.JSON / HORIZON)</span>
                </button>
              </div>

              {/* Xbox 360 Setup Steps */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
                  <div className="text-lime-400 font-mono text-xs font-bold mb-1">HORIZON USB INJECTION</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Insert an Xbox 360 configured USB flash drive into your PC. Use <strong>Horizon</strong> or <strong>Velocity</strong> to inject the save file directly into Title ID <code>4B4E085F</code>.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
                  <div className="text-lime-400 font-mono text-xs font-bold mb-1">AURORA &amp; RGH/JTAG PATH</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    For Aurora or Freestyle Dash consoles, copy folder into:
                    <code className="block mt-1 p-1 bg-black/60 rounded text-[10px] text-lime-300 break-all">
                      Hdd1:/Content/0000000000000000/4B4E085F/00000001/
                    </code>
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
                  <div className="text-lime-400 font-mono text-xs font-bold mb-1">LOAD &amp; PLAY ON 360</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Boot PES on Xbox 360, load the edit data from System Storage, and play with classic 360 controller layout (A Pass, X Shoot, B Cross)!
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-blue-900/60 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Compatible with all Xbox 360 FAT, Slim, and E consoles, both retail and modified dashboards.</span>
            </div>
          </div>
        )}

        {/* 8. PPSSPP & SONY PSP */}
        {selectedPlatform === 'PSP_EMU' && (
          <div className="rounded-3xl bg-[#061536]/90 border border-amber-500/80 p-6 sm:p-8 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-blue-900/60">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300">
                    <Gamepad2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black uppercase text-white">PPSSPP &amp; Sony PSP Handheld Edition</h3>
                    <p className="text-xs text-amber-300 font-mono">ULES-01598 (PES 2027 Studio Triunfo) • SAVEDATA</p>
                  </div>
                </div>

                <button
                  onClick={handleDownloadPPSSPPSave}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>DOWNLOAD PPSSPP SAVEDATA (.JSON)</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
                  <div className="text-amber-300 font-mono text-xs font-bold mb-1">ALL PLATFORMS COMPATIBLE</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Works on PPSSPP for Android, Windows PC, macOS, Linux, iOS (App Store), Steam Deck, and original PSP hardware.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
                  <div className="text-amber-300 font-mono text-xs font-bold mb-1">SAVEDATA DIRECTORY</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Copy into <code>PSP/SAVEDATA/ULES01598_DATA/</code>.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
                  <div className="text-amber-300 font-mono text-xs font-bold mb-1">ROSTERS &amp; 2026 BALL</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Includes all 211 nations, licensed kit textures, and official 2026 Triunfo match ball.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-blue-900/60 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Authentic Sony PSP-1000/2000/3000/Go and PPSSPP handheld simulator.</span>
            </div>
          </div>
        )}

        {/* 9. OFFLINE SINGLE FILE HTML */}
        {selectedPlatform === 'OFFLINE_BUNDLE' && (
          <div className="rounded-3xl bg-[#061536]/90 border border-teal-500/80 p-6 sm:p-8 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-blue-900/60">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-teal-500/20 border border-teal-400/50 flex items-center justify-center text-teal-300">
                    <HardDrive className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black uppercase text-white">Portable Offline Single-File Launcher</h3>
                    <p className="text-xs text-teal-300 font-mono">Zero Installation • Double-Click &amp; Play • 100% Offline</p>
                  </div>
                </div>

                <button
                  onClick={handleDownloadOfflineHTML}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>DOWNLOAD PORTABLE LAUNCHER (.HTML)</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
                  <div className="text-teal-300 font-mono text-xs font-bold mb-1">PORTABLE USB PLAY</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Keep the single-file launcher on a USB flash drive and play on any laptop or school/work PC without admin rights.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
                  <div className="text-teal-300 font-mono text-xs font-bold mb-1">UNIVERSAL BROWSER COMPATIBILITY</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Runs on Chrome, Edge, Safari, Firefox, Opera, Brave, and Chromium on Windows, Mac, Linux, and Chromebook.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
                  <div className="text-teal-300 font-mono text-xs font-bold mb-1">OFFLINE PRECACHE</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    All graphics, sound FX audio synthesizers, rosters, and 3D match engine code run locally without internet access.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-blue-900/60 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Zero dependencies • Portable single HTML document.</span>
            </div>
          </div>
        )}

        {/* Global Multi-Platform Specifications Matrix */}
        <div className="rounded-3xl bg-slate-950/80 border border-slate-800 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                Multi-Platform Compatibility &amp; Controller Matrix
              </h4>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              All 7 Consoles &amp; OS Supported
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 text-center text-xs">
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="font-extrabold text-emerald-400">Android</div>
              <div className="text-[10px] text-slate-400 mt-1">Touch &amp; BT Gamepad</div>
              <div className="text-[9px] font-mono text-slate-500 mt-0.5">120Hz PWA</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="font-extrabold text-slate-300">Apple iOS</div>
              <div className="text-[10px] text-slate-400 mt-1">Touch &amp; MFi Gamepad</div>
              <div className="text-[9px] font-mono text-slate-500 mt-0.5">WebClip Profile</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="font-extrabold text-blue-400">PS4</div>
              <div className="text-[10px] text-slate-400 mt-1">DualShock 4</div>
              <div className="text-[9px] font-mono text-slate-500 mt-0.5">WEPES USB .TED</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="font-extrabold text-cyan-400">PS5</div>
              <div className="text-[10px] text-slate-400 mt-1">DualSense Haptics</div>
              <div className="text-[9px] font-mono text-slate-500 mt-0.5">4K 60/120 FPS</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="font-extrabold text-green-400">Xbox One</div>
              <div className="text-[10px] text-slate-400 mt-1">Xbox Wireless Pad</div>
              <div className="text-[9px] font-mono text-slate-500 mt-0.5">Edge PWA / USB</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="font-extrabold text-emerald-300">Xbox Series</div>
              <div className="text-[10px] text-slate-400 mt-1">Impulse Triggers</div>
              <div className="text-[9px] font-mono text-slate-500 mt-0.5">Quick Resume</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="font-extrabold text-lime-400">Xbox 360</div>
              <div className="text-[10px] text-slate-400 mt-1">Classic 360 Pad</div>
              <div className="text-[9px] font-mono text-slate-500 mt-0.5">ID: 4B4E085F</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation CTA */}
      <div className="w-full max-w-7xl mx-auto pt-4 border-t border-blue-900/60 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="text-xs text-blue-200 font-mono">
          <span>PES &amp; eFootball Studio 2027 • Official Triunfo Ball • دعنا نلعب كرة القدم</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBackToHome}
            className="px-4 py-2 rounded-xl bg-[#091b40] hover:bg-blue-900 text-white font-bold text-xs cursor-pointer border border-blue-800 transition-all"
          >
            Return to Mode Choose
          </button>
          <button
            onClick={onLaunchInstantMatch}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase shadow cursor-pointer transition-all active:scale-95 flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Play Match Simulator</span>
          </button>
        </div>
      </div>
    </div>
  );
};
