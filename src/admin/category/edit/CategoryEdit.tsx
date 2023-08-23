import "./CategoryEdit.scss";
import { ICategory, ICategoryEdit } from "../../../entities/Category.ts";
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function CategoryCreate() {
  const [categories, setCategories] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    axios.get("http://localhost:8080/categories").then((resp) => {
      setCategories(resp.data);
    });
    axios.get(`http://localhost:8080/category/${id}`).then(async (resp) => {
      setInitialValues((prevValues) => ({
        ...prevValues,
        name: resp.data.name,
        description: resp.data.description,
        image: resp.data.image,
      }));
    });
  }, []);

  const [initialValues, setInitialValues] = useState<ICategoryEdit>({
    name: "",
    description: "",
    image: "",
  });

  const categorySchema = Yup.object().shape({
    name: Yup.string()
      .required("Name is required")
      .max(255, "Name must be smaller")
      .test("unique-category", "Category already exists", function (value) {
        if (!value) {
          return false;
        }
        const categoryExists = categories.some(
          (c: ICategory) =>
            c.name.toLowerCase() === value.toLowerCase() && c.id !== Number(id),
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

  const handleSubmit = async (values: ICategoryEdit) => {
    try {
      await categorySchema.validate(values);

      await axios.put(`http://localhost:8080/category/${id}`, values);

      navigate("../..");
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
        enableReinitialize={true}
      >
        {({ errors, touched, setFieldValue, handleBlur, values }) => (
          <Form className="category-edit-form">
            <i
              className="bi bi-arrow-left-circle-fill back-button"
              onClick={() => navigate("../..")}
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
                value={values.description}
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
              Save
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default CategoryCreate;
