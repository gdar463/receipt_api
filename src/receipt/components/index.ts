import Elysia from "elysia";

import { componentsHooks } from "./hooks";
import { countryRouter } from "./routes/country";
import { datetimeRouter } from "./routes/datetime";
import { merchantRouter } from "./routes/merchant";
import { scanRouter } from "./routes/scan";
import { totalRouter } from "./routes/total";

export const componentsRouter = new Elysia({
  prefix: "/:id/component",
})
  .use(componentsHooks)
  .use(countryRouter)
  .use(scanRouter)
  .use(merchantRouter)
  .use(datetimeRouter)
  .use(totalRouter);
