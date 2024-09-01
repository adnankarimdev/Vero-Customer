export type KeywordCounts = {
  [key: string]: number;
};

export type Block = {
  id: string;
  type: "text" | "bullet";
  content: string;
};
