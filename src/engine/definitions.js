/**
 * Rule Definitions - Semantic and ARIA compliance rules
 */

import { ariaActionsRule } from './rules/aria-actions.js';
import { ariaStructureRule } from './rules/aria-structure.js';
import { headingHierarchyRule } from './rules/heading-hierarchy.js';
import { imageAltRule } from './rules/image-alt.js';
import { missingFormLabelsRule } from './rules/missing-form-labels.js';
import { missingKeyLandmarkRule } from './rules/missing-key-landmark.js';
import { missingRoleActionRule } from './rules/missing-role-action.js';
import { nativeLabelRule } from './rules/native-label.js';
import { ariaLandmarksRule } from './rules/aria-landmarks.js';

/**
 * Default set of rules for semantic HTML and ARIA analysis
 */
export const DEFAULT_RULES = [
  ariaLandmarksRule,
  missingFormLabelsRule,
  headingHierarchyRule,
  ariaActionsRule,
  ariaStructureRule,
  missingRoleActionRule,
  imageAltRule,
  nativeLabelRule,
  missingKeyLandmarkRule,
];

/**
 * Placeholder for custom rules users might define
 */
export const CUSTOM_RULES = [];
