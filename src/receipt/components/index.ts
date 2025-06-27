import Elysia from "elysia";
import { countryRouter } from "./routes/country";
import { scanRouter } from "./routes/scan";
import { merchantRouter } from "./routes/merchant";
import { datetimeRouter } from "./routes/datetime";
import { totalRouter } from "./routes/total";
import { componentsHooks } from "./hooks";

export const componentsRouter = new Elysia({
  prefix: "/receipt/:id/component",
})
  .use(componentsHooks)
  .use(countryRouter)
  .use(scanRouter)
  .use(merchantRouter)
  .use(datetimeRouter)
  .use(totalRouter);
