export type ListItem = {
  content: string;
};

export type List = {
  title: string;
  items: ListItem[];
  description?: string;
};

export type ItemSwapping = {
  boardIndex: number;
  itemIndex: number;
};
