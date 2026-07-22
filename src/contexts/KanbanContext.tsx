import React, { useReducer } from "react";
import type { List } from "../types/types";

type KanbanAction =
  | {
      type: "ADD_BOARD";
      payload: {
        title: string;
        description?: string;
      };
    }
  | {
      type: "EDIT_BOARD";
      payload: {
        index: number;
        title: string;
        description?: string;
      };
    }
  | {
      type: "DELETE_BOARD";
      payload: {
        index: number;
      };
    }
  | {
      type: "MOVE_BOARD";
      payload: {
        index: number;
        direction: number;
      };
    }
  | {
      type: "ADD_ITEM";
      payload: {
        listIndex: number;
        content: string;
      };
    }
  | {
      type: "EDIT_ITEM";
      payload: {
        boardIndex: number;
        itemIndex: number;
        content: string;
      };
    }
  | {
      type: "DELETE_ITEM";
      payload: {
        boardIndex: number;
        itemIndex: number;
      };
    };

type KanbanContextValue = {
  kanbanState: List[];
  kanbanDispatch: React.Dispatch<KanbanAction>;
};

export const DEFAULT_KANBAN_STATE: List[] = [
  {
    title: "To Do",
    items: [],
  },
  {
    title: "In progress",
    items: [],
  },
  {
    title: "Done",
    items: [],
  },
];

const KanbanContext = React.createContext<KanbanContextValue | undefined>(undefined);

interface KanbanProviderProps {
  children: React.ReactNode;
}

function KanbanProvider({ children }: KanbanProviderProps) {
  function initialKanbanState(): List[] {
    const saved: string | null = localStorage.getItem("boards");

    if (saved == null) return DEFAULT_KANBAN_STATE;

    try {
      const boards = JSON.parse(saved);
      console.log(boards);
      return boards;
    } catch (e) {
      throw new Error("An error occured while trying to load boards");
    }
  }

  function save(updated: List[]) {
    localStorage.setItem("boards", JSON.stringify(updated));
  }

  function kanbanReducer(state: List[], action: KanbanAction): List[] {
    console.log("kanbanReducer");
    console.log(state, action);

    // MARK: BOARDS
    if (action.type == "ADD_BOARD") {
      const { title, description } = action.payload;

      const newList: List = {
        title: title,
        ...(description ? { description: description } : {}),
        items: [],
      };

      const updated = [...state, newList];
      save(updated);
      return updated;
    } else if (action.type == "EDIT_BOARD") {
      const { index, title, description } = action.payload;

      const updated = state.map((list, i) => {
        if (i !== index) return list;

        return {
          ...list,
          title: title,
          description: description,
        };
      });

      save(updated);
      return updated;
    } else if (action.type == "DELETE_BOARD") {
      const { index } = action.payload;

      const updated = state.filter((_, i) => i !== index);

      save(updated);
      return updated;
    } else if (action.type == "MOVE_BOARD") {
      const { index, direction } = action.payload;

      const toPosition = index + direction;

      if (toPosition < 0 || toPosition >= state.length) {
        return state;
      }

      const updated = [...state];

      const temp = updated[toPosition];
      updated[toPosition] = updated[index];
      updated[index] = temp;

      save(updated);
      return updated;
    }

    // MARK: ITEMS
    if (action.type == "ADD_ITEM") {
      const { listIndex, content } = action.payload;

      const updated = state.map((list, i) => {
        if (i !== listIndex) return list;

        return {
          ...list,
          items: [...list.items, { content }],
        };
      });

      save(updated);
      return updated;
    } else if (action.type == "EDIT_ITEM") {
      const { boardIndex, itemIndex, content } = action.payload;

      const updated = state.map((list, i) => {
        if (i !== boardIndex) return list;

        return {
          ...list,
          items: list.items.map((item, j) => {
            if (j !== itemIndex) return item;

            return {
              ...item,
              content: content,
            };
          }),
        };
      });
      save(updated);
      return updated;
    } else if (action.type == "DELETE_ITEM") {
      const { boardIndex, itemIndex } = action.payload;

      const updated = state.map((list, i) => {
        if (i !== boardIndex) return list;

        return {
          ...list,
          items: list.items.filter((_, j) => j !== itemIndex),
        };
      });

      save(updated);
      return updated;
    }

    return state;
  }

  const [kanbanState, kanbanDispatch] = useReducer(
    kanbanReducer,
    DEFAULT_KANBAN_STATE,
    initialKanbanState,
  );

  return (
    <KanbanContext.Provider value={{ kanbanState, kanbanDispatch }}>
      {children}
    </KanbanContext.Provider>
  );
}

export { KanbanContext, KanbanProvider };
