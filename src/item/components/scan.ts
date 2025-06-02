import { t } from "elysia";

export const ScanComponent = t.Object({
  type: t.Literal("scan"),
  data: t.Object({
    driveId: t.String(),
  }),
});

export type StaticScanComponent = typeof ScanComponent.static;
