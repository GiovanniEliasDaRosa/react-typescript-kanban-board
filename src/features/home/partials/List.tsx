import { ChevronsDownUp, ChevronsUpDown } from "lucide-react";
import { useMemo } from "react";
import type { List } from "../../../types/types";
import Items from "./Items/Items";
import styles from "./List.module.css";

interface ListProps {
  list: List;
  isDescriptionExpanded: boolean;
  setIsDescriptionExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

const DESCRIPTION_PREVIEW_LENGTH = 255;

export default function List({ list, isDescriptionExpanded, setIsDescriptionExpanded }: ListProps) {
  const descriptionToShow = useMemo(() => {
    const description = list.description;
    if (!description) return null;

    if (isDescriptionExpanded) return description;

    return description.slice(0, DESCRIPTION_PREVIEW_LENGTH);
  }, [isDescriptionExpanded, list.description]);

  return (
    <div className={styles.board}>
      <div className={styles.board_info}>
        <h2>{list.title}</h2>

        {list.description ? (
          <>
            <p>
              {descriptionToShow}

              {list.description.length > DESCRIPTION_PREVIEW_LENGTH ? (
                <span>
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
                </span>
              ) : null}
            </p>
          </>
        ) : null}
      </div>

      <div className={styles.board_items}>
        {list.items.map((item, i) => (
          <Items key={i} item={item} />
        ))}

        <p>Add</p>
      </div>
    </div>
  );
}
