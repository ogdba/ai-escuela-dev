export type { Lesson, ModuleLessons, LessonSection, LessonExercise, CodeExample } from "./types";

import { llmFundamentalsLessons } from "./01-llm-fundamentals";
import { promptEngineeringLessons } from "./02-prompt-engineering";
import { ragFundamentalsLessons } from "./03-rag-fundamentals";
import { promptopsGuardrailsLessons } from "./04-promptops-guardrails";
import { aiEvalsLessons } from "./05-ai-evals";
import { observabilityLessons } from "./06-observability";
import { ciCdAiLessons } from "./07-ci-cd-ai";
import { mcpIntegrationsLessons } from "./08-mcp-integrations";
import { agentArchitecturesLessons } from "./09-agent-architectures";
import { aiSecurityLessons } from "./10-ai-security";
import { localModelsLessons } from "./11-local-models";
import { deploymentLessons } from "./12-deployment";
import { finalProjectLessons } from "./13-final-project";
import type { Lesson } from "./types";

export const ALL_LESSONS: Record<string, Lesson[]> = {
  "llm-fundamentals": llmFundamentalsLessons,
  "prompt-engineering": promptEngineeringLessons,
  "rag-fundamentals": ragFundamentalsLessons,
  "promptops-guardrails": promptopsGuardrailsLessons,
  "ai-evals": aiEvalsLessons,
  "observability-cost-latency": observabilityLessons,
  "ci-cd-ai": ciCdAiLessons,
  "mcp-integrations": mcpIntegrationsLessons,
  "agent-architectures": agentArchitecturesLessons,
  "ai-security": aiSecurityLessons,
  "local-models": localModelsLessons,
  deployment: deploymentLessons,
  "final-project": finalProjectLessons,
};

export function getLessonsForModule(moduleId: string): Lesson[] {
  return ALL_LESSONS[moduleId] ?? [];
}

export function getLesson(moduleId: string, lessonId: string): Lesson | undefined {
  return getLessonsForModule(moduleId).find((l) => l.id === lessonId);
}

export function getTotalLessons(): number {
  return Object.values(ALL_LESSONS).reduce((sum, lessons) => sum + lessons.length, 0);
}

export {
  llmFundamentalsLessons,
  promptEngineeringLessons,
  ragFundamentalsLessons,
  promptopsGuardrailsLessons,
  aiEvalsLessons,
  observabilityLessons,
  ciCdAiLessons,
  mcpIntegrationsLessons,
  agentArchitecturesLessons,
  aiSecurityLessons,
  localModelsLessons,
  deploymentLessons,
  finalProjectLessons,
};
