"use client";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Quote = () => {
  const formik = useFormik({
    initialValues: {
      email: "",
      mobile: "",
      category: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      mobile: Yup.string()
        .matches(/^\d{10}$/, "Mobile number must be 10 digits")
        .required("Mobile number is required"),
      category: Yup.string().required("Please select a category"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }, event) => {
      setSubmitting(true);
      try {
        const response = await axios.post(
          "https://api.jainsonsindiaonline.com/api/quotes/add",
          values
        );
        if (response.status === 200) {
          toast.success("Request submitted successfully!", {
            position: "top-center",
            autoClose: 5000,
          });
          formik.resetForm();
        } else {
          toast.error("Error submitting request", {
            position: "top-center",
            autoClose: 5000,
          });
        }
      } catch (error) {
        toast.error("Failed to submit request. Please try again.", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 5000,
        });
      } finally {
        setSubmitting(false);
      }
      event.preventDefault();
    },
  });
  const [selectCategory, setSelectCategory] = useState('')
  const [categories, setCategories] = useState([]);
  const getAllCategory = async () => {
    try {
      const response = await axios.get(
        "https://api.jainsonsindiaonline.com/api/categories/showAll"
      );
      if (response.data) {
        setCategories(response.data?.data);
      } else {
      }
    } catch (error) {
      // setErrorMsg("Error logging in. Please check your credentials.");
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");

  const handleCategoryChange = (event) => {
    const selectedId = event.target.value;
    const selectedCategory = categories.find((cat) => cat._id === selectedId);
    setSelectedCategoryName(selectedCategory ? selectedCategory.name : "");
    formik.handleChange(event); // Keep Formik's behavior
  };
  return (
    <div className="container mx-auto py-16 px-4 md:px-8">
      <div className=" flex justify-center items-center bg-white">
        <div className="w-full mx-auto md:w-5/12  p-8 shadow-lg border rounded-lg">
          <h3 className="text-xl font-bold text-center mb-6 text-[#880909]">
            Tell us what you need, and we'll help you get quotes
          </h3>
          <form className="space-y-4" onSubmit={formik.handleSubmit}>
            <div className="flex flex-col items-start md:flex-row md:items-center w-full  md:gap-10">
              <label
                htmlFor="product"
                className="text-sm font-medium min-w-32 sm:flex-1 md:flex-initial"
              >
                I want quotes for
              </label>
              <select
                id="category"
                name="category"
                className="mt-2 border rounded-lg p-2 flex-1 w-full"
                onChange={handleCategoryChange}
                onBlur={formik.handleBlur}
                value={formik.values.category}
              >
                {categories?.map((data, index) => (
                  <option
                    key={index}
                    value={data?._id}>{data?.name}</option>
                ))}
              </select>
            </div>
            {formik.touched.category && formik.errors.category && (
              <div className="text-red-500 text-xs mt-1 text-right">
                {formik.errors.category}
              </div>
            )}
            {
              (selectedCategoryName === 'Other' || selectedCategoryName === 'other' || selectedCategoryName === 'Others') &&
              <div className="flex flex-col items-start md:flex-row md:items-center w-full  md:gap-10">
                <label
                  htmlFor="categoryName"
                  className="text-sm font-medium min-w-32 sm:flex-1 md:flex-initial"
                >
                  Category Name
                </label>
                <input
                  id="categoryName"
                  name="category"
                  type="text"
                  className="mt-2 border rounded-lg p-2 flex-1 w-full"
                  placeholder="Enter category name"
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    formik.setFieldValue("category", `Others - ${inputValue}`);
                  }}
                  onBlur={formik.handleBlur}
                />
              </div>
            }
            <div className="flex flex-col items-start md:flex-row md:items-center w-full  md:gap-10">
              <label
                htmlFor="phone"
                className="text-sm font-medium min-w-32 sm:flex-1 md:flex-initial"
              >
                Mobile Number
              </label>
              <input
                id="mobile"
                name="mobile"
                type="tel"
                className="mt-2 border rounded-lg p-2 flex-1 w-full"
                placeholder="Enter your mobile"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.mobile}
              />
            </div>
            {formik.touched.mobile && formik.errors.mobile && (
              <div className="text-red-500 text-xs mt-1 text-right">
                {formik.errors.mobile}
              </div>
            )}

            <div className="flex flex-col items-start md:flex-row md:items-center w-full  md:gap-10">
              <label
                htmlFor="email"
                className="text-sm font-medium min-w-32 sm:flex-1 md:flex-initial"
              >
                Email ID
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="mt-2 border rounded-lg p-2 flex-1 w-full"
                placeholder="Enter your mail id"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
            </div>
            <div className=" flex justify-center md:justify-end w-full">
              <button
                type="submit"
                className="bg-[#880909] text-white text-sm  md:text-lg  max-w-max px-3 py-1 md:px-6 md:py-3 rounded-[40px] hover:bg-red-700 transition-colors"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Quote;
