import { useContext, useState } from "react";
import Header from "../../components/Header/Header";
import { KanbanContext } from "../../contexts/KanbanContext";
import styles from "./HomePage.module.css";
import List from "./partials/List";

function HomePage() {
  const context = useContext(KanbanContext);

  if (!context) throw new Error("KanbanContext missing");

  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState<boolean>(false);

  const { kanbanState, kanbanDispatch } = context;

  return (
    <>
      <Header />

      <div className={styles.boards}>
        {kanbanState.map((list) => (
          <List
            list={list}
            isDescriptionExpanded={isDescriptionExpanded}
            setIsDescriptionExpanded={setIsDescriptionExpanded}
          />
        ))}
      </div>
    </>
  );
}

export default HomePage;
