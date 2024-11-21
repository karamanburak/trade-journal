import { Formik, Field, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useState } from "react";
import { useSelector } from "react-redux";
import { ImSpinner9 } from "react-icons/im";
import useAuthCall from "../../hooks/useAuthCall";
import { RootState } from "../../app/store";
import TermsModal from "./TermsModal";
import { Link } from "react-router-dom";

interface IMyRegisterFormValues {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    terms: boolean;
}

const RegisterForm = () => {
    const { register: registerUser } = useAuthCall();
    const { loading } = useSelector((state: RootState) => state.auth);
    const [showPassword, setShowPassword] = useState<"password" | "text">("password");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const validationSchema = Yup.object({
        username: Yup.string()
            .min(2, "Username must be at least 2 characters long")
            .max(15, "Username must be at most 15 characters long")
            .required("Username is required"),
        firstName: Yup.string()
            .min(2, "First name must be at least 2 characters long")
            .max(15, "First name must be at most 15 characters long")
            .required("First name is required"),
        lastName: Yup.string()
            .min(3, "Last name must be at least 3 characters long")
            .max(30, "Last name must be at most 30 characters long")
            .required("Last name is required"),
        email: Yup.string()
            .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address")
            .required("Email is required"),
        password: Yup.string()
            .min(8, "Password must be at least 8 characters long")
            .max(30, "Password must be at most 30 characters long")
            .matches(/\d+/, "Password must contain at least one number")
            .matches(/[a-z]/, "Password must contain at least one lowercase letter")
            .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
            .matches(/[@$?!%&*]+/, "Password must contain at least one special character (.@/)")
            .required("Password is required"),
        terms: Yup.boolean()
            .oneOf([true], "You must accept the terms and conditions")
            .required("You must accept the terms and conditions"),
    });

    const registerFormField = [
        { id: "username", name: "username", label: "Username *", placeholder: "Enter your username", type: "text" },
        { id: "firstName", name: "firstName", label: "First Name *", placeholder: "Enter your first name", type: "text" },
        { id: "lastName", name: "lastName", label: "Last Name *", placeholder: "Enter your last name", type: "text" },
        { id: "email", name: "email", label: "Email Address *", placeholder: "Enter your email address", type: "text" },
    ];

    const togglePasswordVisibility = () => {
        setShowPassword(prev => (prev === "password" ? "text" : "password"));
    };

    const handleSubmit = (values: IMyRegisterFormValues, { setSubmitting }: FormikHelpers<IMyRegisterFormValues>) => {
        registerUser(values)
        console.log(values);
        setSubmitting(false);
    };

    return (
        <>
            <Formik
                initialValues={{
                    username: "",
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: "",
                    terms: false,
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ errors, touched }) => (
                    <Form className="md:space-y-3 ">
                        {registerFormField.map((field) => (
                            <div key={field.id}>
                                <p className="text-[0.875rem] md:text-[1rem]">{field.label}</p>
                                <Field
                                    name={field.name}
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    className={`w-full border  rounded-lg text-[1rem] p-3 h-[42px] md:h-[48px] focus:outline-none dark:text-dark-secondary
                  ${touched[field.name as keyof IMyRegisterFormValues] && errors[field.name as keyof IMyRegisterFormValues] ? "border-red" : "border-gray-1"}`}
                                />
                                <div className="h-[20px]">
                                    {touched[field.name as keyof IMyRegisterFormValues] && errors[field.name as keyof IMyRegisterFormValues] && (
                                        <p className="text-dark-danger text-[0.875rem]">{errors[field.name as keyof IMyRegisterFormValues]}</p>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Password Field */}
                        <div className="relative">
                            <div className="flex items-center justify-between mb-2">
                                <label htmlFor="password" className=" text-[0.875rem] md:text-[1rem]">Password</label>
                                <div className="absolute inset-y-0 right-3 pr-3 pt-3 flex items-center text-2xl cursor-pointer text-dark-primary">
                                    {showPassword === "password" ? (
                                        <MdVisibilityOff onClick={togglePasswordVisibility} />
                                    ) : (
                                        <MdVisibility onClick={togglePasswordVisibility} />
                                    )}
                                </div>
                            </div>
                            <Field
                                type={showPassword === "password" ? "password" : "text"}
                                name="password"
                                placeholder="Enter your password"
                                className="w-full border dark:border-white rounded-lg text-[1rem] p-3 h-[42px] md:h-[48px] focus:outline-none dark:text-dark-secondary"
                            />
                            <div className="h-[20px]">
                                {touched.password && errors.password && (
                                    <p className="text-dark-danger text-[0.875rem]">{errors.password}</p>
                                )}
                            </div>
                        </div>


                        {/* Terms & Conditions */}
                        <div className="flex items-center">
                            <Field
                                type="checkbox"
                                name="terms"
                                id="terms"
                                className="mr-2"
                            />
                            <label htmlFor="terms" className="text-[0.875rem] md:text-[1rem]">
                                I agree to the{" "}
                                <span
                                    className="text-dark-primary cursor-pointer"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    Terms and Conditions
                                </span>
                            </label>
                        </div>
                        {touched.terms && errors.terms && (
                            <p className="text-dark-danger text-[0.875rem]">{errors.terms}</p>
                        )}

                        {/* Submit Button */}
                        <div className="flex flex-col items-center">
                            <button
                                type="submit"
                                className={`w-full text-white bg-dark-primary text-[1rem] py-3 mt-3 rounded-lg focus:outline-none flex items-center justify-center hover:bg-light-button-hover ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <ImSpinner9 className="animate-spin" />
                                        <span className="ml-2">Loading...</span>
                                    </>
                                ) : (
                                    "Create Account"
                                )}
                            </button>
                            <div className="text-center mt-4">
                                <span className="text-gray-2 dark:text-white">
                                    Already have an account?{" "}
                                </span>
                                <Link to="/login" className="ml-1 text-dark-primary font-semibold underline">
                                    Login
                                </Link>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>

            <TermsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <button onClick={() => setIsModalOpen(false)} className="mt-4 bg-danger rounded-md px-4 py-2 bg-dark-danger text-white">
                    Close
                </button>
            </TermsModal>
        </>
    );
};

export default RegisterForm;
