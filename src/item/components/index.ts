import { t } from "elysia";
import { ScanComponent } from "./scan";
import { CountryComponent } from "./country";

export const SingleComponent = t.Union([ScanComponent, CountryComponent]);
export type StaticSingleComponent = typeof SingleComponent.static;

export const Components = t.Array(SingleComponent);
export type StaticComponents = typeof Components.static;
