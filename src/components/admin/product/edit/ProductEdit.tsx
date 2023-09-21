import { ICategory } from "../../../../entities/Category.ts";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import http_common from "../../../../http_common.ts";
import { IProductEdit } from "../../../../entities/Product.ts";
import { IProductImage } from "../../../../entities/ProductImage.ts";
import InputGroup from "../../../../common/InputGroup.tsx";
import SelectGroup from "../../../../common/SelectGroup.tsx";
import ImageListGroup from "../../../../common/ImageListGroup.tsx";
import EditorTiny from "../../../../common/EditorTiny.tsx";

function ProductEdit() {
  const [categories, setCategories] = useState<ICategory[]>([]);

  const { id } = useParams();

  useEffect(() => {
    http_common
      .get("api/categories", {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      })
      .then((resp) => {
        setCategories(resp.data);
      });
    http_common
      .get(`api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      })
      .then((resp) => {
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
          Authorization: `Bearer ${localStorage.token}`,
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
            <InputGroup
              label="Name"
              type="text"
              field="name"
              handleBlur={handleBlur}
              error={errors.name}
              touched={touched.name}
              handleChange={handleChange}
              value={values.name}
            ></InputGroup>
            <EditorTiny
              value={values.description}
              label="Description"
              field="description"
              error={errors.description}
              touched={touched.description}
              onEditorChange={(text: string) => {
                setFieldValue("description", text);
              }}
            />
            <SelectGroup
              label="Category"
              field="categoryId"
              handleChange={handleChange}
              error={errors.categoryId}
              touched={touched.categoryId}
              handleBlur={handleBlur}
              options={categories}
              optionKey="id"
              optionLabel="name"
              initialCategoryId={initialValues.categoryId}
            ></SelectGroup>
            <ImageListGroup
              images={values.images}
              setFieldValue={setFieldValue}
              error={errors.images}
              touched={touched.images}
            ></ImageListGroup>
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
