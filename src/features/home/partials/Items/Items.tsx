import type { ListItem } from "../../../../types/types";

interface ItemsProps {
  item: ListItem;
}

export default function Items({ item }: ItemsProps) {
  return (
    <div>
      <p>{item.content}</p>
    </div>
  );
}
