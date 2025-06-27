import type { ComponentType, ReceiptComponent } from "./types";

export function createComponentMap(
  components: ReceiptComponent[]
): Partial<{ [K in ComponentType]: ReceiptComponent<K> & { index: number } }> {
  return Object.fromEntries(
    components.map((c, i) => [c.type, { ...c, index: i }])
  );
}
