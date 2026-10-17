import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  generateIOSWebConfig,
  generatePlayStationWEPESPackage,
  generateXboxNextGenPackage,
  generateXbox360Package,
  generateAndroidPackage,
} from './consolePackageExport.ts';

describe('Multi-Console Package Exporter (Android, iOS, PS4, PS5, Xbox One, Xbox Series, Xbox 360)', () => {
  it('generates valid iOS WebClip .mobileconfig with plist structure', () => {
    const config = generateIOSWebConfig('https://pes2027.studio');
    assert.ok(config.includes('<!DOCTYPE plist'));
    assert.ok(config.includes('com.apple.webClip.managed'));
    assert.ok(config.includes('https://pes2027.studio'));
    assert.ok(config.includes('PES 2027 Studio'));
  });

  it('generates PS4 WEPES package with .ted files and USB directory', () => {
    const ps4 = generatePlayStationWEPESPackage('PS4');
    assert.strictEqual(ps4.platform, 'PS4');
    assert.strictEqual(ps4.fileName, 'PS4_WEPES_OPTION_FILE_PES2027.json');
    const parsed = JSON.parse(ps4.data);
    assert.strictEqual(parsed.folderStructure, 'USB_DRIVE:/WEPES/');
    assert.ok(parsed.content.teamDataFiles.length >= 4);
    assert.strictEqual(parsed.content.controllerProfile.shoot, 'Square');
  });

  it('generates PS5 Next-Gen package with 4K resolution and DualSense profile', () => {
    const ps5 = generatePlayStationWEPESPackage('PS5');
    assert.strictEqual(ps5.platform, 'PS5');
    assert.strictEqual(ps5.fileName, 'PS5_WEPES_OPTION_FILE_PES2027.json');
    const parsed = JSON.parse(ps5.data);
    assert.ok(parsed.content.graphics.resolution.includes('2048x2048'));
    assert.ok(parsed.content.controllerProfile.triggerHaptics.includes('DualSense'));
  });

  it('generates Xbox One package with Edge launcher and wireless controller profile', () => {
    const xbOne = generateXboxNextGenPackage('XBOX_ONE');
    assert.strictEqual(xbOne.platform, 'XBOX_ONE');
    const parsed = JSON.parse(xbOne.data);
    assert.strictEqual(parsed.controllerProfile.type, 'XBOX_WIRELESS_CONTROLLER');
    assert.strictEqual(parsed.controllerProfile.pass, 'A');
    assert.strictEqual(parsed.displayMode, '1080p 60FPS / WebGL 2.0');
  });

  it('generates Xbox Series X|S package with 120Hz mode and impulse triggers', () => {
    const xbSeries = generateXboxNextGenPackage('XBOX_SERIES');
    assert.strictEqual(xbSeries.platform, 'XBOX_SERIES');
    const parsed = JSON.parse(xbSeries.data);
    assert.ok(parsed.displayMode.includes('120FPS'));
    assert.ok(parsed.controllerProfile.impulseTriggers.includes('Enabled'));
  });

  it('generates Xbox 360 package with Title ID 4B4E085F and Aurora/Horizon path', () => {
    const xb360 = generateXbox360Package();
    assert.strictEqual(xb360.platform, 'XBOX_360');
    assert.strictEqual(xb360.fileName, 'XBOX360_PES2027_OPTION_FILE_4B4E085F.json');
    const parsed = JSON.parse(xb360.data);
    assert.strictEqual(parsed.titleId, '4B4E085F');
    assert.ok(parsed.profileDirectory.includes('4B4E085F'));
    assert.ok(parsed.setupGuide.some((step: string) => step.includes('Horizon')));
  });

  it('generates Android package with 120Hz display and touch thumbstick specs', () => {
    const android = generateAndroidPackage('https://pes2027.studio');
    assert.strictEqual(android.platform, 'ANDROID');
    const parsed = JSON.parse(android.data);
    assert.strictEqual(parsed.packageName, 'com.pes2027.studio.simulator');
    assert.strictEqual(parsed.display, 'standalone');
    assert.ok(parsed.features.length >= 4);
  });
});
