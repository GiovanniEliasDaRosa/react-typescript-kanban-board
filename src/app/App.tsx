import { RouterProvider } from "react-router-dom";
import { KanbanProvider } from "../contexts/KanbanContext";
import { router } from "./router";

function App() {
  return (
    <KanbanProvider>
      <RouterProvider router={router} />
    </KanbanProvider>
  );
}

export default App;
