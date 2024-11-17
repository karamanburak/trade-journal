import { Formik, Field, Form, type FormikHelpers } from "formik"
import * as Yup from "yup"
import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdVisibility, MdVisibilityOff } from "react-icons/md"
import useAuthCall from "../../hooks/useAuthCall";
import type { RootState } from "../../app/store";
import { useSelector } from "react-redux";
import { ImSpinner9 } from "react-icons/im"


const validationSchema = Yup.object({
    email: Yup
        .string()
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
})

const LoginForm: React.FC = () => {
    const { login } = useAuthCall()
    const [showPassword, setShowPassword] = useState(false)
    const loading = useSelector((state: RootState) => state.auth.loading)
    const formValuesRef = useRef<IMyLoginFormValues | null>();

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleSubmit = (values: IMyLoginFormValues, { setSubmitting }: FormikHelpers<IMyLoginFormValues>) => {
        login(values)
        formValuesRef.current = values
        setSubmitting(false)
    }


    return (
        <>
            <Formik
                initialValues={{
                    email: "",
                    password: "",
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ errors, touched }) => (

                    <Form className="md:space-y-3">
                        <div>
                            <p className="text-[0.875rem] md:text-[1rem]">
                                Email
                            </p>
                            <Field
                                type="email"
                                name="email"
                                placeholder="Enter your email address"
                                className={`w-full border rounded-lg text-light-text text-[1rem] p-3 h-[42px] md:h-[48px] focus:outline-none 
                ${touched.email && errors.email ? "border-red" : "border-dark-border"}`}
                            />
                            <div className="h-[20px]">
                                {touched.email && errors.email && (
                                    <p className="text-dark-danger text-[0.875rem]">{errors.email}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <p className="text-[0.875rem] md:text-[1rem]">
                                Password
                            </p>
                            <div className="relative">
                                <Field
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Enter your password"
                                    className={`w-full border rounded-lg text-[1rem] text-light-text p-3 h-[42px] md:h-[48px] focus:outline-none ${touched.password && errors.password ? "border-red" : "border-dark-border"}`}
                                />
                                {errors.password && (
                                    <p className="text-dark-danger text-[0.875rem]">{errors.password}</p>
                                )}
                                <div className="absolute top-3 text-dark-primary right-3 pr-3 flex items-center text-2xl cursor-pointer">
                                    {showPassword ? (
                                        <MdVisibilityOff onClick={togglePasswordVisibility} />
                                    ) : (
                                        <MdVisibility onClick={togglePasswordVisibility} />
                                    )}
                                </div>
                            </div>

                        </div>

                        {/* Submit Button */}
                        <div className="flex flex-col items-center">
                            <button
                                type="submit"
                                className={`w-full bg-dark-primary text-dark-text text-[1rem] py-3 mt-3 rounded-lg focus:outline-none flex justify-center items-center hover:bg-light-button-hover ${loading ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <ImSpinner9 className="animate-spin mr-2" />
                                        Loading...
                                    </>
                                ) : (
                                    "Login"
                                )}
                            </button>

                            <div className="text-center mt-6">
                                <span className="text-gray-2">Do not have an account yet?</span>
                                <Link to="/register" className="ml-1 text-dark-primary font-semibold underline">
                                    Sign Up
                                </Link>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>

        </>
    )
}
export default LoginForm;
