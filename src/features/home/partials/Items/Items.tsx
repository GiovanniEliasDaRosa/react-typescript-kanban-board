import { ChevronDown, ChevronUp, List, Trash } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { KanbanContext } from "../../../../contexts/KanbanContext";
import type { ListItem } from "../../../../types/types";
import styles from "./Items.module.css";

interface ItemsProps {
  boardIndex: number;
  itemIndex: number;
  item: ListItem;
  selectSwapDialogRef?: React.RefObject<HTMLDialogElement | null>;
}

export default function Items({ boardIndex, itemIndex, item, selectSwapDialogRef }: ItemsProps) {
  const context = useContext(KanbanContext);

  if (!context) throw new Error("KanbanContext missing");

  const { kanbanState, kanbanDispatch, setItemSwapping } = context;

  const [content, setContent] = useState(item.content);
  const editTimeoutRef = useRef<number>(null);

  const quantityOfItems = kanbanState[boardIndex].items.length - 1;

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

  function handleDelete() {
    kanbanDispatch({
      type: "DELETE_ITEM",
      payload: {
        boardIndex: boardIndex,
        itemIndex: itemIndex,
      },
    });
  }

  function handleMoveButton(direction: string) {
    if (direction == "up") {
      kanbanDispatch({
        type: "MOVE_ITEM",
        payload: {
          boardIndex: boardIndex,
          itemIndex: itemIndex,
          direction: -1,
        },
      });
    } else {
      kanbanDispatch({
        type: "MOVE_ITEM",
        payload: {
          boardIndex: boardIndex,
          itemIndex: itemIndex,
          direction: 1,
        },
      });
    }
  }

  function handleSwapButton() {
    if (selectSwapDialogRef == null || selectSwapDialogRef.current == null) return;

    setItemSwapping({
      boardIndex: boardIndex,
      itemIndex: itemIndex,
    });

    selectSwapDialogRef.current.showModal();
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
        <button className="square" aria-label="Delete item" onClick={handleDelete}>
          <Trash />
        </button>
        <button
          className="square"
          aria-label="Move item up"
          onClick={() => {
            handleMoveButton("up");
          }}
          disabled={itemIndex - 1 < 0}
        >
          <ChevronUp />
        </button>
        <button
          className="square"
          aria-label="Move item down"
          onClick={() => {
            handleMoveButton("down");
          }}
          disabled={itemIndex + 1 > quantityOfItems}
        >
          <ChevronDown />
        </button>
        <button className="square" aria-label="Swap item between boards" onClick={handleSwapButton}>
          <List />
        </button>
      </div>
    </div>
  );
}
