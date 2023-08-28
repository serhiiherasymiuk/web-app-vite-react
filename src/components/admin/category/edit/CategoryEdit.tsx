import "./CategoryEdit.scss";
import { ICategory, ICategoryEdit } from "../../../../entities/Category.ts";
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import http_common from "../../../../http_common.ts";

function CategoryEdit() {
  const [categories, setCategories] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    http_common.get("api/categories").then((resp) => {
      setCategories(resp.data);
    });
    http_common.get(`api/categories/${id}`).then(async (resp) => {
      const response = await http_common.get(
        `/uploading/300_${resp.data.image}`,
        {
          responseType: "blob",
        },
      );
      const blob = response.data;

      setInitialValues((prevValues) => ({
        ...prevValues,
        name: resp.data.name,
        description: resp.data.description,
        image: new File([blob], resp.data.image),
      }));
    });
  }, []);

  const [initialValues, setInitialValues] = useState<ICategoryEdit>({
    name: "",
    description: "",
    image: null,
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
    image: Yup.mixed().required("Image is required"),
  });

  const navigate = useNavigate();

  const handleSubmit = async (values: ICategoryEdit) => {
    try {
      await categorySchema.validate(values);

      await http_common.put(`api/categories/${id}`, values, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("../..");
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={categorySchema}
        enableReinitialize={true}
      >
        {({
          values,
          validateForm,
          setTouched,
          errors,
          touched,
          setFieldValue,
          handleBlur,
        }) => (
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
            <div className="image-list">
              {values.image ? (
                <div>
                  <i
                    onClick={() => {
                      setFieldValue("image", null).then(() => {
                        validateForm();
                      });
                      setTouched({
                        ...touched,
                        image: true,
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
              Save
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default CategoryEdit;
