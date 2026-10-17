import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  getDefaultConfig,
  getAlternateGamepadBindings,
  getPESClassicGamepadBindings,
  getButtonDisplayLabel,
  checkActionConflicts,
  GAMEPAD_BUTTONS,
} from './controllerSettings.ts';

describe('FC 27 Controller Configuration & Presets', () => {
  it('loads default Classic preset correctly', () => {
    const config = getDefaultConfig('CLASSIC', 'XBOX');
    assert.strictEqual(config.preset, 'CLASSIC');
    assert.strictEqual(config.device, 'XBOX');
    assert.strictEqual(config.gamepadBindings.SHORT_PASS, GAMEPAD_BUTTONS.A_CROSS);
    assert.strictEqual(config.gamepadBindings.SHOOT, GAMEPAD_BUTTONS.B_CIRCLE);
    assert.strictEqual(config.gamepadBindings.LOB_CROSS, GAMEPAD_BUTTONS.X_SQUARE);
    assert.strictEqual(config.gamepadBindings.THROUGH_BALL, GAMEPAD_BUTTONS.Y_TRIANGLE);
    assert.strictEqual(config.gamepadBindings.SPRINT, GAMEPAD_BUTTONS.RT_R2);
  });

  it('swaps Shoot and Lob Cross buttons in Alternate Preset', () => {
    const altBindings = getAlternateGamepadBindings();
    // In Alternate, Shoot is X (button 2) and Lob Cross is B (button 1)
    assert.strictEqual(altBindings.SHOOT, GAMEPAD_BUTTONS.X_SQUARE);
    assert.strictEqual(altBindings.LOB_CROSS, GAMEPAD_BUTTONS.B_CIRCLE);
    // Short Pass remains A (button 0)
    assert.strictEqual(altBindings.SHORT_PASS, GAMEPAD_BUTTONS.A_CROSS);
  });

  it('sets PES Classic preset correctly with Shoot on Square and Sprint on R1', () => {
    const pesBindings = getPESClassicGamepadBindings();
    assert.strictEqual(pesBindings.SHOOT, GAMEPAD_BUTTONS.X_SQUARE); // Square
    assert.strictEqual(pesBindings.LOB_CROSS, GAMEPAD_BUTTONS.B_CIRCLE); // Circle
    assert.strictEqual(pesBindings.SPRINT, GAMEPAD_BUTTONS.RB_R1); // R1
  });

  it('displays correct button labels for Xbox vs PlayStation', () => {
    const xboxPass = getButtonDisplayLabel(GAMEPAD_BUTTONS.A_CROSS, 'XBOX');
    assert.strictEqual(xboxPass.label, 'A Button');
    assert.strictEqual(xboxPass.symbol, 'A');

    const psPass = getButtonDisplayLabel(GAMEPAD_BUTTONS.A_CROSS, 'PLAYSTATION');
    assert.strictEqual(psPass.label, '✖ Cross');
    assert.strictEqual(psPass.symbol, '✖');

    const xboxShoot = getButtonDisplayLabel(GAMEPAD_BUTTONS.B_CIRCLE, 'XBOX');
    assert.strictEqual(xboxShoot.label, 'B Button');

    const psShoot = getButtonDisplayLabel(GAMEPAD_BUTTONS.B_CIRCLE, 'PLAYSTATION');
    assert.strictEqual(psShoot.label, '● Circle');
  });

  it('detects button conflicts when two actions share the same button', () => {
    const config = getDefaultConfig('CLASSIC', 'XBOX');
    // Deliberately set Shoot to same button as Short Pass
    config.gamepadBindings.SHOOT = GAMEPAD_BUTTONS.A_CROSS;
    const conflicts = checkActionConflicts(config, 'SHOOT', true);
    assert.ok(conflicts.includes('SHORT_PASS'));
  });

  it('initializes mobile touch config with correct defaults', () => {
    const config = getDefaultConfig('CLASSIC', 'MOBILE');
    assert.strictEqual(config.device, 'MOBILE');
    assert.ok(config.mobileTouchConfig);
    assert.strictEqual(config.mobileTouchConfig.style, 'EFOOTBALL_MOBILE');
    assert.strictEqual(config.mobileTouchConfig.stickType, 'fixed');
    assert.strictEqual(config.mobileTouchConfig.handLayout, 'right_handed');
    assert.strictEqual(config.mobileTouchConfig.buttonSize, 'standard');
    assert.strictEqual(config.mobileTouchConfig.hapticsEnabled, true);
    assert.strictEqual(config.mobileTouchConfig.gestureShortcuts, true);
  });

  it('formats display labels specifically for Mobile touch device', () => {
    const mobilePass = getButtonDisplayLabel(GAMEPAD_BUTTONS.A_CROSS, 'MOBILE');
    assert.strictEqual(mobilePass.label, '✕ Pass (Tap)');
    assert.strictEqual(mobilePass.symbol, '✕');

    const mobileShoot = getButtonDisplayLabel(GAMEPAD_BUTTONS.B_CIRCLE, 'MOBILE');
    assert.strictEqual(mobileShoot.label, '◯ Shoot / Cross');
  });
});
