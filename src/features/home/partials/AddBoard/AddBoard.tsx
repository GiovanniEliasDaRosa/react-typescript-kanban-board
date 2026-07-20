import { Plus } from "lucide-react";
import { useContext, useRef, type SubmitEvent } from "react";
import { KanbanContext } from "../../../../contexts/KanbanContext";
import styles from "./AddBoard.module.css";

export default function AddBoard() {
  const context = useContext(KanbanContext);

  if (!context) throw new Error("KanbanContext missing");

  const { kanbanDispatch } = context;

  const titleRef = useRef<HTMLInputElement | null>(null);
  const bodyRef = useRef<HTMLTextAreaElement | null>(null);

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (titleRef.current == null || bodyRef.current == null) {
      return;
    }

    const title = titleRef.current.value;
    const body = bodyRef.current.value;

    if (title.trim() == "") {
      return;
    }

    kanbanDispatch({
      type: "ADD_BOARD",
      payload: {
        title: title,
        description: body,
      },
    });

    titleRef.current.value = "";
    bodyRef.current.value = "";
  }

  return (
    <form className={styles.add} onSubmit={handleSubmit}>
      <input type="text" placeholder="Title" ref={titleRef} />
      <textarea
        name="description"
        id="description"
        placeholder="Description"
        ref={bodyRef}
      ></textarea>

      <button className="icon_button" type="submit">
        <Plus />
        Create
      </button>
    </form>
  );
}
