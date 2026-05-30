/**
 * Unit tests for RuleEngine class
 */

import test from 'node:test';
import assert from 'node:assert';
import { RuleEngine } from '../src/engine/index.js';

test('RuleEngine - Initialization', () => {
  const engine = new RuleEngine();
  assert.ok(engine.rules.length > 0, 'Should have default rules');
});

test('RuleEngine - Get active rules', () => {
  const engine = new RuleEngine();
  const activeRules = engine.getActiveRules();
  assert.ok(activeRules.length > 0, 'Should have active rules');
});

test('RuleEngine - Get rule by ID', () => {
  const engine = new RuleEngine();
  const rule = engine.getRule('missing-key-landmark');
  assert.ok(rule, 'Should find rule by ID');
  assert.equal(rule.id, 'missing-key-landmark');
});

test('RuleEngine - Add custom rule', () => {
  const engine = new RuleEngine();
  const initialCount = engine.rules.length;

  const customRule = {
    id: 'custom-rule',
    name: 'Custom Rule',
    enabled: true,
    check: () => [],
  };

  engine.addRule(customRule);
  assert.equal(
    engine.rules.length,
    initialCount + 1,
    'Should add custom rule'
  );
});
