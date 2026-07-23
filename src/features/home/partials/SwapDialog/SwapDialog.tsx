import { X } from "lucide-react";
import { useContext } from "react";
import { KanbanContext } from "../../../../contexts/KanbanContext";
import styles from "./SwapDialog.module.css";
interface SwapDialogProps {
  selectSwapDialogRef?: React.RefObject<HTMLDialogElement | null>;
}

export default function SwapDialog({ selectSwapDialogRef }: SwapDialogProps) {
  const context = useContext(KanbanContext);

  if (!context) throw new Error("KanbanContext missing");

  const { kanbanState, kanbanDispatch, itemSwapping } = context;

  const currentItemSwapping =
    itemSwapping == null
      ? ""
      : kanbanState[itemSwapping.boardIndex]?.items[itemSwapping.itemIndex]?.content;

  function closeDialog() {
    if (selectSwapDialogRef == null || selectSwapDialogRef.current == null) return;

    selectSwapDialogRef.current.close();
  }

  function handleSwapButton(toBoardIndex: number) {
    if (itemSwapping == null) return;

    kanbanDispatch({
      type: "SWAP_ITEM",
      payload: {
        fromBoardIndex: itemSwapping.boardIndex,
        toBoardIndex: toBoardIndex,
        fromItemIndex: itemSwapping.itemIndex,
      },
    });

    closeDialog();
  }

  return (
    <dialog ref={selectSwapDialogRef} className={styles.swap_dialog}>
      <div className={styles.swap_dialog_content}>
        <div className={styles.swap_dialog_content_header}>
          <p>
            Swap item{" "}
            <span className={styles.swap_dialog_content_header_item_name}>
              {currentItemSwapping}
            </span>{" "}
            with
          </p>

          <button className="square" onClick={closeDialog} aria-label="Close swap dialog">
            <X />
          </button>
        </div>

        <div className={styles.swap_dialog_options}>
          {kanbanState.map((list, index) => (
            <button
              key={`board-button-${list.title}-${index}`}
              onClick={() => {
                handleSwapButton(index);
              }}
            >
              {list.title}
            </button>
          ))}
        </div>
      </div>
    </dialog>
  );
}
