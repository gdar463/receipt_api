import Elysia from "elysia";
import { countryRouter } from "./routes/country";
import { scanRouter } from "./routes/scan";
import { merchantRouter } from "./routes/merchant";
import { datetimeRouter } from "./routes/datetime";
import { totalRouter } from "./routes/total";

export const componentsRouter = new Elysia({
  prefix: "/item/:id/component",
})
  .use(countryRouter)
  .use(scanRouter)
  .use(merchantRouter)
  .use(datetimeRouter)
  .use(totalRouter);
