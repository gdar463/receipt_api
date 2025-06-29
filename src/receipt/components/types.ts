export type ComponentType =
  | "country"
  | "scan"
  | "merchant"
  | "datetime"
  | "total";

export type ComponentDataType = {
  country: {
    code: string;
  };
  scan: {
    driveId: string;
    thumbnail?: string;
  };
  merchant: {
    name: string;
    vatNumber?: string;
    address: string;
    insidePlace?: string;
  };
  datetime: {
    date: Date;
  };
  total: {
    amount: number;
    currency: string;
  };
};

export type ReceiptComponent<T extends ComponentType = ComponentType> = {
  type: T;
  data: ComponentDataType[T];
};
