import { useContext } from "react";
import Header from "../../components/Header/Header";
import { KanbanContext } from "../../contexts/KanbanContext";

function HomePage() {
  const context = useContext(KanbanContext);

  if (!context) throw new Error("KanbanContext missing");

  const { kanbanState, kanbanDispatch } = context;

  console.log(kanbanState);
  console.log(kanbanDispatch);

  return (
    <>
      <Header />

      <h1>Home</h1>
    </>
  );
}

export default HomePage;
