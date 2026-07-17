export type ListItem = {
  content: string;
};

export type List = {
  title: string;
  items: ListItem[];
  description?: string;
};
