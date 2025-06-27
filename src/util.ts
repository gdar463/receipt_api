import type { LifeCycleStore } from "elysia";
import { promoteEvent } from "elysia/utils";

export function promoteHooks(event: Partial<LifeCycleStore>) {
  promoteEvent(event.error, "scoped");
  promoteEvent(event.transform, "scoped");
  promoteEvent(event.afterResponse, "scoped");
}

export function now() {
  return new Date();
}
