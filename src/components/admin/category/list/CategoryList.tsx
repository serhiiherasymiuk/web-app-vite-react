import { useEffect, useState } from "react";
import { ICategory } from "../../../../entities/Category.ts";
import { useNavigate } from "react-router-dom";
import ModalDelete from "../../../../common/ModalDelete.tsx";
import http_common from "../../../../http_common.ts";

function CategoryList() {
  const [categories, setCategories] = useState<ICategory[]>([]);
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
    <>
      <button
        onClick={() => navigate("create")}
        type="button"
        className="mb-6 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        Create
      </button>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                #
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Description
              </th>
              <th scope="col" className="px-6 py-3">
                Image
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c: ICategory) => {
              return (
                <tr
                  key={c.id}
                  onClick={() => navigate(`edit/${c.id}`)}
                  className="cursor-pointer border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {c.id}
                  </th>
                  <td className="px-6 py-4">{c.name}</td>
                  <td className="px-6 py-4">{c.description}</td>
                  <td className="px-6 py-4">
                    <img
                      src={`${http_common.getUri()}/uploading/300_${c.image}`}
                      alt=""
                    />
                  </td>
                  <td
                    className="px-6 py-4"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <ModalDelete
                      id={c.id}
                      text={c.name}
                      deleteFunc={handleDelete}
                    ></ModalDelete>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default CategoryList;
