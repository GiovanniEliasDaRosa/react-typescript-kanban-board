import { Plus } from "lucide-react";
import { useContext, useRef, type SubmitEvent } from "react";
import { KanbanContext } from "../../../../contexts/KanbanContext";
import styles from "./AddItem.module.css";

interface AddBoardProps {
  listIndex: number;
}

export default function AddBoard({ listIndex }: AddBoardProps) {
  const context = useContext(KanbanContext);

  if (!context) throw new Error("KanbanContext missing");

  const { kanbanDispatch } = context;

  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (inputRef.current == null || inputRef.current.value.trim() == "") {
      return;
    }

    kanbanDispatch({
      type: "ADD_ITEM",
      payload: {
        listIndex: listIndex,
        content: inputRef.current.value,
      },
    });

    inputRef.current.value = "";
  }

  return (
    <form className={styles.add_form} onSubmit={handleSubmit}>
      <input type="text" name="content" ref={inputRef} />
      <button className="icon_button" type="submit">
        <Plus />
        Add
      </button>
    </form>
  );
}
