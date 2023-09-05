import { ICategory } from "../../../../entities/Category.ts";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import http_common from "../../../../http_common.ts";
import { IProductEdit } from "../../../../entities/Product.ts";
import { IProductImage } from "../../../../entities/ProductImage.ts";

function ProductEdit() {
  const [categories, setCategories] = useState<ICategory[]>([]);

  const { id } = useParams();

  useEffect(() => {
    http_common.get("api/categories").then((resp) => {
      setCategories(resp.data);
    });
    http_common.get(`api/products/${id}`).then((resp) => {
      const images = resp.data.images.map(
        (image: IProductImage) => `${image.image}`,
      );

      downloadAndConvertImages(images).then((files) => {
        setInitialValues((prevValues) => ({
          ...prevValues,
          name: resp.data.name,
          description: resp.data.description,
          categoryId: resp.data.categoryId,
          images: files,
        }));
      });
    });
  }, []);

  async function downloadAndConvertImages(images: string[]): Promise<File[]> {
    const files: File[] = [];

    for (const image of images) {
      const file = await downloadImage(image);
      files.push(file);
    }

    return files;
  }

  async function downloadImage(filename: string): Promise<File> {
    const response = await http_common.get(`/uploading/600_${filename}`, {
      responseType: "blob",
    });
    const blob = response.data;

    return new File([blob], filename);
  }

  const [initialValues, setInitialValues] = useState<IProductEdit>({
    name: "",
    description: "",
    categoryId: null,
    images: [],
  });

  const productSchema = Yup.object().shape({
    name: Yup.string()
      .required("Name is required")
      .max(255, "Name must be smaller"),
    description: Yup.string()
      .required("Description is required")
      .max(4000, "Description must be smaller"),
    categoryId: Yup.number()
      .required("Category is required")
      .test("category-required", "Category is required", function (value) {
        if (value === -1) return false;
        else return true;
      }),
    images: Yup.array()
      .required("At least one image is required")
      .min(1, "At least one image is required"),
  });

  const navigate = useNavigate();

  const handleSubmit = async (values: IProductEdit) => {
    try {
      await productSchema.validate(values);

      await http_common.put(`api/products/${id}`, values, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("..");
    } catch (error) {
      console.error("Error editing product:", error);
    }
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={productSchema}
        enableReinitialize={true}
      >
        {({
          values,
          setFieldValue,
          handleChange,
          errors,
          touched,
          handleBlur,
        }) => (
          <Form>
            <i
              className="bi bi-arrow-left-circle-fill back-button"
              onClick={() => navigate("..")}
            ></i>
            <div className="mb-6">
              <input
                onBlur={handleBlur}
                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                  errors.name && touched.name
                    ? "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-red-100 dark:border-red-400"
                    : ""
                }`}
                type="text"
                placeholder="Name"
                name="name"
                aria-label="Name"
                aria-describedby="basic-addon2"
                onChange={handleChange}
                value={values.name}
              />
              {errors.name && touched.name && (
                <div className="mt-2 text-sm text-red-600 dark:text-red-500">
                  {errors.name}
                </div>
              )}
            </div>
            <div className="mb-6">
              <textarea
                onBlur={handleBlur}
                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                  errors.description && touched.description
                    ? "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-red-100 dark:border-red-400"
                    : ""
                }`}
                placeholder="Description"
                name="description"
                aria-label="Description"
                aria-describedby="basic-addon2"
                onChange={handleChange}
                value={values.description}
              />
              {errors.description && touched.description && (
                <div className="mt-2 text-sm text-red-600 dark:text-red-500">
                  {errors.description}
                </div>
              )}
            </div>
            <div className="mb-6">
              <select
                onBlur={handleBlur}
                name="categoryId"
                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                  errors.categoryId && touched.categoryId
                    ? "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-red-100 dark:border-red-400"
                    : ""
                }`}
                onChange={(event) => {
                  setFieldValue("categoryId", event.currentTarget.value);
                }}
              >
                <option selected value={-1}>
                  Choose a category
                </option>
                {categories.map((c: ICategory) => {
                  return (
                    <option
                      selected={c.id === initialValues.categoryId}
                      key={c.id}
                      value={c.id}
                    >
                      {c.name}
                    </option>
                  );
                })}
              </select>
              {errors.categoryId && touched.categoryId && (
                <div className="mt-2 text-sm text-red-600 dark:text-red-500">
                  {errors.categoryId}
                </div>
              )}
            </div>
            <div className="grid grid-cols-3 justify-items-center">
              {values.images.map((f: File, id: number) => {
                return (
                  <div className="mb-6 h-80 w-80">
                    <i
                      onClick={() => {
                        const filteredImages = values.images.filter(
                          (image) => image !== f,
                        );
                        setFieldValue("images", filteredImages);
                      }}
                      className="absolute -mt-4 -ml-4 bi-x-circle text-2xl text-[30px] cursor-pointer text-red-600"
                    ></i>
                    <img
                      key={id}
                      src={URL.createObjectURL(f)}
                      className="object-cover h-80 w-80"
                    />
                  </div>
                );
              })}
            </div>
            <div className="mb-6 items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className={`flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 ${
                  errors.images && touched.images
                    ? "border-red-500 dark:border-red-400 bg-red-50"
                    : "dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                }`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    SVG, PNG, JPG
                  </p>
                </div>
              </label>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                name="image"
                accept="image/*"
                onChange={(event) => {
                  const file =
                    event.currentTarget.files && event.currentTarget.files[0];
                  if (file) {
                    setFieldValue("images", [...values.images, file]);
                  }
                }}
              />
              {errors.images && touched.images && (
                <div className="mt-2 text-sm text-red-600 dark:text-red-500">
                  {errors.images.toString()}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Save
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default ProductEdit;
