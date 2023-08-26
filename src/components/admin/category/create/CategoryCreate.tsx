import "./CategoryCreate.scss";
import { ICategory, ICategoryCreate } from "../../../../entities/Category.ts";
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import http_common from "../../../../http_common.ts";

function CategoryCreate() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    http_common.get("api/categories").then((resp) => {
      setCategories(resp.data);
    });
  }, []);

  const initialValues: ICategoryCreate = {
    name: "",
    description: "",
    image: null,
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
    image: Yup.mixed().required("Image is required"),
  });

  const navigate = useNavigate();

  const handleSubmit = async (values: ICategoryCreate) => {
    try {
      await categorySchema.validate(values);

      await http_common.post("api/categories", values, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("..");
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={categorySchema}
      >
        {({
          values,
          setTouched,
          validateForm,
          errors,
          touched,
          setFieldValue,
          handleBlur,
        }) => (
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
            <div className="image-list">
              {values.image ? (
                <div>
                  <i
                    onClick={() => {
                      setFieldValue("image", null).then(() => {
                        validateForm();
                      });
                    }}
                    className="bi bi-x-circle-fill"
                  ></i>
                  <img src={URL.createObjectURL(values.image)} alt="" />
                </div>
              ) : (
                <label
                  className={`custom-file-upload ${
                    errors.image && touched.image ? "is-image-invalid" : ""
                  }`}
                >
                  <input
                    multiple
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={(event) => {
                      const file =
                        event.currentTarget.files &&
                        event.currentTarget.files[0];
                      if (file) {
                        setFieldValue("image", file);
                      }
                      validateForm();
                      setTouched({
                        ...touched,
                        image: true,
                      });
                    }}
                  />
                  <i className="bi bi-plus"></i>
                  <i className="bi bi-exclamation-circle exc"></i>
                </label>
              )}
            </div>
            <button type="submit" className="btn btn-primary">
              Create
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default CategoryCreate;
