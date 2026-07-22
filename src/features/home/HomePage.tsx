import { useContext, useState } from "react";
import Header from "../../components/Header/Header";
import { KanbanContext } from "../../contexts/KanbanContext";
import styles from "./HomePage.module.css";
import AddBoard from "./partials/AddBoard/AddBoard";
import List from "./partials/List";

function HomePage() {
  const context = useContext(KanbanContext);

  if (!context) throw new Error("KanbanContext missing");

  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState<boolean>(false);

  const { kanbanState } = context;

  return (
    <>
      <Header />

      <div className={styles.boards}>
        {kanbanState.map((list, index) => (
          <List
            key={`board-${list.title}-${index}`}
            list={list}
            index={index}
            isDescriptionExpanded={isDescriptionExpanded}
            setIsDescriptionExpanded={setIsDescriptionExpanded}
          />
        ))}

        <AddBoard />
      </div>
    </>
  );
}

export default HomePage;
