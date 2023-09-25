import { useNavigate } from "react-router-dom";
import { IRegister } from "../../../entities/Auth.ts";
import * as Yup from "yup";
import http_common from "../../../http_common.ts";
import { Form, Formik } from "formik";
import InputGroup from "../../../common/InputGroup.tsx";

function RegisterPage() {
  const navigate = useNavigate();

  const initialValues: IRegister = {
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
  };

  const registerSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Invalid email"),
    phone: Yup.string().required("Phone number is required"),
    password: Yup.string().required("Password is required"),
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Second name is required"),
  });

  const handleSubmit = async (values: IRegister) => {
    try {
      console.log(values);
      await http_common.post("api/account/register", values);
      navigate("/");
    } catch (error) {
      console.error("Error register:", error);
    }
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={registerSchema}
      >
        {({ handleChange, errors, touched, handleBlur }) => (
          <Form>
            <i
              className="bi bi-arrow-left-circle-fill back-button"
              onClick={() => navigate("..")}
            ></i>
            <InputGroup
              label="Email"
              type="email"
              field="email"
              handleBlur={handleBlur}
              error={errors.email}
              touched={touched.email}
              handleChange={handleChange}
            ></InputGroup>
            <InputGroup
              label="Password"
              type="password"
              field="password"
              handleBlur={handleBlur}
              error={errors.password}
              touched={touched.password}
              handleChange={handleChange}
            ></InputGroup>
            <InputGroup
              label="FirstName"
              type="text"
              field="firstName"
              handleBlur={handleBlur}
              error={errors.firstName}
              touched={touched.firstName}
              handleChange={handleChange}
            ></InputGroup>
            <InputGroup
              label="LastName"
              type="text"
              field="lastName"
              handleBlur={handleBlur}
              error={errors.lastName}
              touched={touched.lastName}
              handleChange={handleChange}
            ></InputGroup>
            <InputGroup
              label="Phone"
              type="text"
              field="phone"
              handleBlur={handleBlur}
              error={errors.phone}
              touched={touched.phone}
              handleChange={handleChange}
            ></InputGroup>
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Register
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default RegisterPage;
