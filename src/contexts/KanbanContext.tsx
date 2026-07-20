import React, { useReducer } from "react";
import type { List } from "../types/types";

type KanbanAction = {
  type: "ADD_ITEM";
  payload: {
    listIndex: number;
    content: string;
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
