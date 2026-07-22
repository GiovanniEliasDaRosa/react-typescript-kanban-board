import {
  Check,
  ChevronsDownUp,
  ChevronsUpDown,
  MoveLeft,
  MoveRight,
  Pen,
  Trash2,
} from "lucide-react";
import { useContext, useMemo, useState, type ChangeEvent } from "react";
import { KanbanContext } from "../../../contexts/KanbanContext";
import type { List } from "../../../types/types";
import AddItem from "./AddItem/AddItem";
import Items from "./Items/Items";
import styles from "./List.module.css";

interface ListProps {
  list: List;
  index: number;
  isDescriptionExpanded: boolean;
  setIsDescriptionExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  selectSwapDialogRef?: React.RefObject<HTMLDialogElement | null>;
}

const DESCRIPTION_PREVIEW_LENGTH = 255;

export default function List({
  list,
  index,
  isDescriptionExpanded,
  setIsDescriptionExpanded,
  selectSwapDialogRef,
}: ListProps) {
  const context = useContext(KanbanContext);

  if (!context) throw new Error("KanbanContext missing");

  const { kanbanState, kanbanDispatch } = context;

  const descriptionToShow = useMemo(() => {
    const description = list.description;
    if (!description) return null;

    if (isDescriptionExpanded) return description;

    return description.slice(0, DESCRIPTION_PREVIEW_LENGTH);
  }, [isDescriptionExpanded, list.description]);

  const quantityOfBoards = kanbanState.length - 1;
  const [isEditing, setIsEditing] = useState(false);
  const [fields, setFields] = useState({
    title: list.title,
    description: list.description ?? "",
  });

  const editOrSaveAriaLabel = isEditing ? "Save board edits" : "Edit board";

  function handleEditOrSaveEditButton() {
    const title = fields.title.trim();
    const description = fields.description.trim();

    if (title.trim() == "") {
      return;
    }

    if (isEditing) {
      kanbanDispatch({
        type: "EDIT_BOARD",
        payload: {
          index: index,
          title: title,
          description: description,
        },
      });

      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  }

  function handleDeleteButton() {
    const confirm = prompt("Do you really want to delete this card?\nType yes to confirm");

    if (confirm?.toLowerCase() == "yes") {
      kanbanDispatch({
        type: "DELETE_BOARD",
        payload: {
          index: index,
        },
      });
    }
  }

  function handleMoveButton(direction: string) {
    if (direction == "right") {
      kanbanDispatch({
        type: "MOVE_BOARD",
        payload: {
          index: index,
          direction: 1,
        },
      });
    } else {
      kanbanDispatch({
        type: "MOVE_BOARD",
        payload: {
          index: index,
          direction: -1,
        },
      });
    }
  }

  return (
    <div className={styles.board}>
      <div className={styles.board_info}>
        <div className={styles.board_info_top}>
          {isEditing ? (
            <>
              <input
                type="text"
                className={`no_border_input ${styles.board_info_title_input}`}
                value={fields.title}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setFields((prevFields) => {
                    return { ...prevFields, title: e.target.value };
                  });
                }}
              />

              <textarea
                className={`no_border_input ${styles.board_info_description_input}`}
                value={fields.description}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                  setFields((prevFields) => {
                    return { ...prevFields, description: e.target.value };
                  });
                }}
              ></textarea>
            </>
          ) : (
            <>
              <p className={styles.board_info_title}>{list.title}</p>

              {list.description ? (
                <>
                  <p>{descriptionToShow}</p>
                  {list.description.length > DESCRIPTION_PREVIEW_LENGTH ? (
                    <button
                      className="no_border_button icon_button"
                      onClick={() => setIsDescriptionExpanded((prevExpanded) => !prevExpanded)}
                    >
                      {isDescriptionExpanded ? (
                        <>
                          <ChevronsDownUp size={16} />
                          Show Less
                        </>
                      ) : (
                        <>
                          <ChevronsUpDown size={16} />
                          Show More
                        </>
                      )}
                    </button>
                  ) : null}
                </>
              ) : null}
            </>
          )}
        </div>

        <div className={styles.buttons_actions}>
          <div className={styles.buttons_actions_group}>
            <button
              className={`square`}
              onClick={handleDeleteButton}
              aria-label="Delete this board"
            >
              <Trash2 />
            </button>

            <button
              className={`square`}
              onClick={handleEditOrSaveEditButton}
              aria-label={editOrSaveAriaLabel}
            >
              {isEditing ? <Check /> : <Pen size={16} />}
            </button>
          </div>

          <div className={styles.buttons_actions_group}>
            <button
              className={`square`}
              onClick={() => {
                handleMoveButton("left");
              }}
              aria-label="Move board to left"
              disabled={index - 1 < 0}
            >
              <MoveLeft />
            </button>

            <button
              className={`square`}
              onClick={() => {
                handleMoveButton("right");
              }}
              aria-label="Move board to right"
              disabled={index + 1 > quantityOfBoards}
            >
              <MoveRight />
            </button>
          </div>
        </div>
      </div>

      <div className={styles.board_items}>
        {list.items.map((item, i) => (
          <Items
            key={`item-${index}-${item.content}-${i}`}
            item={item}
            boardIndex={index}
            itemIndex={i}
            selectSwapDialogRef={selectSwapDialogRef}
          />
        ))}

        <AddItem listIndex={index} />
      </div>
    </div>
  );
}
