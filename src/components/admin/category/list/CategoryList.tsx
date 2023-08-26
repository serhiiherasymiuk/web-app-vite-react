import { useEffect, useState } from "react";
import { ICategory } from "../../../../entities/Category.ts";
import "./CategoryList.scss";
import { useNavigate } from "react-router-dom";
import ModalDelete from "../../../../common/ModalDelete.tsx";
import http_common from "../../../../http_common.ts";

function CategoryList() {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    http_common.get("api/categories").then((resp) => {
      setCategories(resp.data);
    });
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await http_common.delete(`api/categories/${id}`).then(() => {
        http_common.get("api/categories").then((resp) => {
          setCategories(resp.data);
        });
      });
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="category-list">
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => navigate("create")}
      >
        Create
      </button>
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Description</th>
            <th scope="col">Image</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c: ICategory) => {
            return (
              <tr key={c.id} onClick={() => navigate(`edit/${c.id}`)}>
                <th scope="row">{c.id}</th>
                <td>{c.name}</td>
                <td>{c.description}</td>
                <td>
                  <img src={`http://localhost:8080/images/${c.image}`} alt="" />
                </td>
                <td
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <div className="buttons-container">
                    <ModalDelete
                      id={c.id}
                      text={c.name}
                      deleteFunc={handleDelete}
                    ></ModalDelete>
                  </div>
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
