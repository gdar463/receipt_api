import { ComponentNotFoundError, PatchBodyInvalidError } from "@/item/errors";
import { type CompTypes, type StaticSingleComponent } from "..";
import { editName, type BodyName } from "./name";
import { editText } from "./text";
import { editScan } from "./scan";

const isBodyName = (body: any): body is BodyName => body.name != undefined;
function isComponent<T extends CompTypes>(
  body: any,
  type: T,
): body is Extract<StaticSingleComponent, { type: T }> {
  return body.type === type;
}

export async function edit(
  userId: string,
  receiptId: string,
  comp: CompTypes,
  body: StaticSingleComponent | BodyName,
) {
  switch (comp) {
    case "name":
      if (!isBodyName(body)) throw new PatchBodyInvalidError();
      return await editName(userId, receiptId, body);
    case "country":
      if (!isComponent(body, "country")) throw new PatchBodyInvalidError();
      return await editText(userId, receiptId, body.type, body);
    case "scan":
      if (!isComponent(body, "scan")) throw new PatchBodyInvalidError();
      return await editScan(userId, receiptId, body);
    default:
      throw new ComponentNotFoundError();
  }
}
