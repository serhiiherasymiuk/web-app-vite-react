import { useEffect, useState } from "react";
import axios from "axios";
import { ICategory } from "../../../entities/Category.ts";
import "./CategoryList.scss";

function CategoryList() {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:8080/categories").then((resp) => {
      setCategories(resp.data);
    });
  }, []);

  return (
    <div className="category-list">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Description</th>
            <th scope="col">Image</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c: ICategory) => {
            return (
              <tr key={c.id}>
                <th scope="row">{c.id}</th>
                <td>{c.name}</td>
                <td>{c.description}</td>
                <td>
                  <img src={c.image} alt="" />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default CategoryList;
