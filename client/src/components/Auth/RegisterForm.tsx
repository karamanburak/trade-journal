import { Formik, Field, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useState } from "react";
import { useSelector } from "react-redux";
import { ImSpinner9 } from "react-icons/im";
import useAuthCall from "../../hooks/useAuthCall";
import { RootState } from "../../app/store";
import TermsModal from "./TermsModal";

interface IMyRegisterFormValues {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    terms: boolean;
}

const RegisterForm = () => {
    const { register: registerUser } = useAuthCall();
    const { loading } = useSelector((state: RootState) => state.auth);
    const [showPassword, setShowPassword] = useState<"password" | "text">("password");
    const [showConfirmPassword, setShowConfirmPassword] = useState<"password" | "text">("password"); // State for confirm password visibility
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
            .matches(/[@$?!%&*]+/, "Password must contain at least one special character")
            .required("Password is required"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], 'Please make sure your passwords match')
            .required("Confirm password is required!"),
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

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(prev => (prev === "password" ? "text" : "password"));
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
                    confirmPassword: "",
                    terms: false,
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ errors, touched }) => (
                    <Form className="md:space-y-3">
                        {registerFormField.map((field) => (
                            <div key={field.id}>
                                <p className="text-gray-2 text-[0.875rem] md:text-[1rem]">{field.label}</p>
                                <Field
                                    name={field.name}
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    className={`w-full border dark:border-white rounded-lg text-[1rem] placeholder-gray-2 dark:placeholder-white dark:bg-black dark:text-white p-3 h-[42px] md:h-[48px] focus:outline-none focus:border-primary-green 
                  ${touched[field.name as keyof IMyRegisterFormValues] && errors[field.name as keyof IMyRegisterFormValues] ? "border-red" : "border-gray-1"}`}
                                />
                                <div className="h-[20px]">
                                    {touched[field.name as keyof IMyRegisterFormValues] && errors[field.name as keyof IMyRegisterFormValues] && (
                                        <p className="text-red-500 text-[0.875rem]">{errors[field.name as keyof IMyRegisterFormValues]}</p>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Password Field */}
                        <div className="relative">
                            <div className="flex items-center justify-between mb-2">
                                <label htmlFor="password" className="text-gray-2 text-[0.875rem] md:text-[1rem]">Password</label>
                                <div className="absolute inset-y-0 text-primary-blue right-3 pr-3 pt-3 flex items-center text-2xl cursor-pointer">
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
                                className={`w-full border dark:border-white rounded-lg text-[1rem] placeholder-gray-2 dark:bg-black dark:text-white dark:placeholder-white p-3 h-[42px] md:h-[48px] focus:outline-none focus:border-primary-blue 
                ${touched.password && errors.password ? "border-red" : "border-gray-1"}`}
                            />
                            <div className="h-[20px]">
                                {touched.password && errors.password && (
                                    <p className="text-red-500 text-[0.875rem]">{errors.password}</p>
                                )}
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="relative">
                            <div className="flex items-center justify-between mb-2">
                                <label htmlFor="confirmPassword" className="text-gray-2 text-[0.875rem] md:text-[1rem]">Confirm Password</label>
                                <div className="absolute inset-y-0 text-primary-blue right-3 pr-3 flex items-center pt-3 text-2xl cursor-pointer">
                                    {showConfirmPassword === "password" ? (
                                        <MdVisibilityOff onClick={toggleConfirmPasswordVisibility} />
                                    ) : (
                                        <MdVisibility onClick={toggleConfirmPasswordVisibility} />
                                    )}
                                </div>
                            </div>
                            <Field
                                type={showConfirmPassword === "password" ? "password" : "text"}
                                name="confirmPassword"
                                placeholder="Confirm your password"
                                className={`w-full border dark:border-white rounded-lg text-[1rem] placeholder-gray-2 dark:bg-black dark:text-white dark:placeholder-white p-3 h-[42px] md:h-[48px] focus:outline-none focus:border-primary-blue 
                ${touched.confirmPassword && errors.confirmPassword ? "border-red" : "border-gray-1"}`}
                            />
                            <div className="h-[20px]">
                                {touched.confirmPassword && errors.confirmPassword && (
                                    <p className="text-red-500 text-[0.875rem]">{errors.confirmPassword}</p>
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
                            <label htmlFor="terms" className="text-gray-2 text-[0.875rem] md:text-[1rem]">
                                I agree to the{" "}
                                <span
                                    className="text-primary-blue cursor-pointer"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    Terms and Conditions
                                </span>
                            </label>
                        </div>
                        {touched.terms && errors.terms && (
                            <p className="text-red-500 text-[0.875rem]">{errors.terms}</p>
                        )}

                        {/* Submit Button */}
                        <div className="flex flex-col items-center">
                            <button
                                type="submit"
                                className={`w-full bg-primary-blue text-white text-[1rem] py-3 mt-3 rounded-lg focus:outline-none flex items-center justify-center ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
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
                        </div>
                    </Form>
                )}
            </Formik>

            <TermsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <button onClick={() => setIsModalOpen(false)} className="mt-4 bg-danger text-white rounded-md px-4 py-2">
                    Close
                </button>
            </TermsModal>
        </>
    );
};

export default RegisterForm;
