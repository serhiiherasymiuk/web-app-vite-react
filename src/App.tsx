import "./App.scss";
import CategoryList from "./admin/category/list/CategoryList.tsx";
import { Route, Routes } from "react-router-dom";
import CategoryCreate from "./admin/category/create/CategoryCreate.tsx";

function App() {
  return (
    <Routes>
      <Route path="/category">
        <Route index element={<CategoryList />} />
        <Route path="create" element={<CategoryCreate />} />
      </Route>
    </Routes>
  );
}

export default App;
