import "./App.scss";
import CategoryList from "./components/admin/category/list/CategoryList.tsx";
import { Route, Routes } from "react-router-dom";
import CategoryCreate from "./components/admin/category/create/CategoryCreate.tsx";
import DefaultLayout from "./components/containers/default/DefaultLayout.tsx";
import "flowbite";
import CategoryEdit from "./components/admin/category/edit/CategoryEdit.tsx";
import ProductList from "./components/admin/product/list/ProductList.tsx";
import ProductCreate from "./components/admin/product/create/ProductCreate.tsx";
import ProductEdit from "./components/admin/product/edit/ProductEdit.tsx";

function App() {
  return (
    <Routes>
      <Route path={"/"} element={<DefaultLayout />}>
        <Route path={"category"}>
          <Route index element={<CategoryList />} />
          <Route path={"create"} element={<CategoryCreate />} />
          <Route path={"edit/:id"} element={<CategoryEdit />} />
        </Route>
        <Route path={"product"}>
          <Route index element={<ProductList />} />
          <Route path={"create"} element={<ProductCreate />} />
          <Route path={"edit/:id"} element={<ProductEdit />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
