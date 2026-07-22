import { ChevronDown, ChevronUp, Trash } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { KanbanContext } from "../../../../contexts/KanbanContext";
import type { ListItem } from "../../../../types/types";
import styles from "./Items.module.css";

interface ItemsProps {
  boardIndex: number;
  itemIndex: number;
  item: ListItem;
}

export default function Items({ boardIndex, itemIndex, item }: ItemsProps) {
  const context = useContext(KanbanContext);

  if (!context) throw new Error("KanbanContext missing");

  const { kanbanDispatch } = context;

  const [content, setContent] = useState(item.content);
  const editTimeoutRef = useRef<number>(null);

  function debouceUpdateChange(value: string) {
    editTimeoutRef.current = setTimeout(() => {
      kanbanDispatch({
        type: "EDIT_ITEM",
        payload: {
          boardIndex: boardIndex,
          itemIndex: itemIndex,
          content: value,
        },
      });
    }, 500);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (editTimeoutRef.current) {
      clearTimeout(editTimeoutRef.current);
    }

    const value = e.target.value;
    setContent(value);

    debouceUpdateChange(value);
  }

  useEffect(() => {
    return () => {
      if (editTimeoutRef.current) {
        clearTimeout(editTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.item}>
      <input className="no_border_input" type="text" value={content} onChange={handleChange} />

      <div className={styles.actions}>
        <button className="square" aria-label="Delete item">
          <Trash />
        </button>
        <button className="square" aria-label="Move item up">
          <ChevronUp />
        </button>
        <button className="square" aria-label="Move item down">
          <ChevronDown />
        </button>
      </div>
    </div>
  );
}
