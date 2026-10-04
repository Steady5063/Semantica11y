/** Shared defaults for newly created analyzers and rule engines. */
const DEFAULT_CONFIG = {
  severities: ['error', 'warning', 'suggestion'],
  enabledRules: null,
  experimental: false,
  includeWarnings: true,
};
let globalConfig = { ...DEFAULT_CONFIG };

function copyConfig(config) {
  return {
    ...config,
    severities: [...config.severities],
    enabledRules: config.enabledRules === null ? null : [...config.enabledRules],
  };
}

export function resolveConfig(options = {}) {
  const config = { ...globalConfig, ...options };
  if (!Array.isArray(config.severities) ||
      config.severities.some((value) => !DEFAULT_CONFIG.severities.includes(value))) {
    throw new TypeError('severities must be an array of error, warning, or suggestion');
  }
  if (config.enabledRules !== null &&
      (!Array.isArray(config.enabledRules) ||
       config.enabledRules.some((id) => typeof id !== 'string' || !id))) {
    throw new TypeError('enabledRules must be null or an array of rule IDs');
  }
  for (const key of ['experimental', 'includeWarnings']) {
    if (typeof config[key] !== 'boolean') {
      throw new TypeError(`${key} must be a boolean`);
    }
  }
  return copyConfig(config);
}

/** Update shared defaults. Instance options take precedence. */
export function configure(options = {}) {
  const config = resolveConfig(options);
  globalConfig = Object.fromEntries(
    Object.keys(DEFAULT_CONFIG).map((key) => [key, config[key]])
  );
  return copyConfig(globalConfig);
}

/** Restore the built-in defaults for future instances. */
export function resetConfig() {
  globalConfig = copyConfig(DEFAULT_CONFIG);
}
