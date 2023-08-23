import "./CategoryCreate.scss";
import { ICategory, ICategoryCreate } from "../../../entities/Category.ts";
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function CategoryCreate() {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:8080/categories").then((resp) => {
      setCategories(resp.data);
    });
  }, []);

  const initialValues: ICategoryCreate = {
    name: "",
    description: "",
    image: "",
  };

  const categorySchema = Yup.object().shape({
    name: Yup.string()
      .required("Name is required")
      .max(255, "Name must be smaller")
      .test("unique-category", "Category already exists", function (value) {
        if (!value) {
          return false;
        }
        const categoryExists = categories.some(
          (c: ICategory) => c.name.toLowerCase() === value.toLowerCase(),
        );
        return !categoryExists;
      }),
    description: Yup.string()
      .required("Description is required")
      .max(4000, "Description must be smaller"),
    categoryId: Yup.number(),
    image: Yup.string().url("Url is incorrect").required("Image is required"),
  });

  const navigate = useNavigate();

  const handleSubmit = async (values: ICategoryCreate) => {
    try {
      console.log(values);

      await categorySchema.validate(values);

      await axios.post("http://localhost:8080/category", values);

      navigate("..");
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  return (
    <div className="category-create">
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={categorySchema}
      >
        {({ errors, touched, setFieldValue, handleBlur }) => (
          <Form className="category-create-form">
            <i
              className="bi bi-arrow-left-circle-fill back-button"
              onClick={() => navigate("..")}
            ></i>
            <div className="form-floating">
              <Field
                type="text"
                className={`form-control ${
                  errors.name && touched.name ? "is-invalid" : ""
                }`}
                placeholder="Name"
                name="name"
                aria-label="Name"
                aria-describedby="basic-addon2"
              />
              <label htmlFor="floatingTextarea2">Name</label>
              <ErrorMessage
                name="name"
                component="div"
                className="invalid-feedback"
              />
            </div>
            <div className="form-floating">
              <textarea
                onBlur={handleBlur}
                className={`form-control ${
                  errors.description && touched.description ? "is-invalid" : ""
                }`}
                placeholder="Description"
                name="description"
                aria-label="Description"
                aria-describedby="basic-addon2"
                onChange={(event) => {
                  setFieldValue("description", event.currentTarget.value);
                }}
              />
              <label>Description</label>
              <ErrorMessage
                name="description"
                component="div"
                className="invalid-feedback"
              />
            </div>
            <div className="form-floating">
              <Field
                type="text"
                className={`form-control ${
                  errors.image && touched.image ? "is-invalid" : ""
                }`}
                placeholder="Image"
                name="image"
                aria-label="Image"
                aria-describedby="basic-addon2"
              />
              <label htmlFor="floatingTextarea2">Image</label>
              <ErrorMessage
                name="image"
                component="div"
                className="invalid-feedback"
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Create
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default CategoryCreate;
