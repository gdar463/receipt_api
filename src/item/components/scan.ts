import { t } from "elysia";

export const ScanComponent = t.Object({
  type: t.Literal("scan"),
  data: t.Nullable(
    t.Object({
      driveId: t.String(),
    }),
  ),
});
