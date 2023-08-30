import "./App.scss";
import CategoryList from "./components/admin/category/list/CategoryList.tsx";
import { Route, Routes } from "react-router-dom";
import CategoryCreate from "./components/admin/category/create/CategoryCreate.tsx";
import DefaultLayout from "./components/containers/default/DefaultLayout.tsx";
import "flowbite";
import CategoryEdit from "./components/admin/category/edit/CategoryEdit.tsx";

function App() {
  return (
    <Routes>
      <Route path={"/"} element={<DefaultLayout />}>
        <Route index element={<CategoryList />} />
        <Route path={"create"} element={<CategoryCreate />} />
        <Route path={"edit/:id"} element={<CategoryEdit />} />
      </Route>
    </Routes>
  );
}

export default App;
