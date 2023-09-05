import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalDelete from "../../../../common/ModalDelete.tsx";
import http_common from "../../../../http_common.ts";
import { IProduct } from "../../../../entities/Product.ts";
import { APP_ENV } from "../../../../env";
import { IProductImage } from "../../../../entities/ProductImage.ts";

function ProductList() {
  const [products, setProducts] = useState<IProduct[]>([]);
  useEffect(() => {
    http_common.get("api/products").then((resp) => {
      setProducts(resp.data);
    });
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await http_common.delete(`api/products/${id}`).then(() => {
        http_common.get("api/products").then((resp) => {
          setProducts(resp.data);
        });
      });
    } catch (error) {
      console.error("Error deleting product:", error);
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
                Images
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((p: IProduct) => {
              return (
                <tr
                  key={p.id}
                  onClick={() => navigate(`edit/${p.id}`)}
                  className="cursor-pointer border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {p.id}
                  </th>
                  <td className="px-6 py-4">{p.name}</td>
                  <td className="px-6 py-4">{p.description}</td>
                  <td className="px-6 py-4">
                    {p.images.map((i: IProductImage) => {
                      return (
                        <img
                          key={i.id}
                          className="mb-1"
                          src={`${APP_ENV.BASE_URL}/uploading/300_${i.image}`}
                          alt=""
                        />
                      );
                    })}
                  </td>
                  <td
                    className="px-6 py-4"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <ModalDelete
                      id={p.id}
                      text={p.name}
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

export default ProductList;
