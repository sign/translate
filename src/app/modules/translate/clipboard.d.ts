interface ClipboardItem {
  readonly types: string[];
  getType: (type: string) => Promise<Blob>;
}

declare var ClipboardItem: {
  prototype: ClipboardItem;
  new(objects: Record<string, Blob>): ClipboardItem;
};

interface Clipboard {
  read?(): Promise<Array<ClipboardItem>>;

  write?(items: Array<ClipboardItem>): Promise<void>;
}
