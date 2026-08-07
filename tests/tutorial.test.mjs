import test from "node:test";
import assert from "node:assert/strict";
import {
  getTutorialCompletionVersion,
  getTutorialCopy,
  getTutorialStorageKey,
  tutorialFaqs,
  TUTORIAL_VERSION,
} from "../lib/tutorial.ts";

const REQUIRED_STEPS = [
  "welcome",
  "home",
  "add",
  "history",
  "insights",
  "pro",
  "settings",
  "ready",
];

test("English and Spanish tutorials cover the same complete workflow", () => {
  const englishSteps = getTutorialCopy("en").steps.map((step) => step.id);
  const spanishSteps = getTutorialCopy("es").steps.map((step) => step.id);

  assert.deepEqual(englishSteps, REQUIRED_STEPS);
  assert.deepEqual(spanishSteps, REQUIRED_STEPS);
});

test("every tutorial step has useful bilingual content", () => {
  for (const language of ["en", "es"]) {
    for (const step of getTutorialCopy(language).steps) {
      assert.ok(step.title.length > 10);
      assert.ok(step.description.length > 30);
      assert.equal(step.bullets.length, 3);
    }

    assert.ok(tutorialFaqs[language].length >= 5);
  }
});

test("tutorial completion versions tolerate metadata and storage values", () => {
  assert.equal(getTutorialCompletionVersion(TUTORIAL_VERSION), 1);
  assert.equal(getTutorialCompletionVersion("1"), 1);
  assert.equal(getTutorialCompletionVersion(undefined), 0);
  assert.equal(getTutorialCompletionVersion("invalid"), 0);
  assert.equal(getTutorialStorageKey("user-123"), "wiwi:tutorial:user-123");
});
