import React, { useState } from "react";
import "./Form.css";
import Nav from "../Nav/Nav";
import Vendors from "../Vendors/Vendors";
import { IoMdCloudUpload } from "react-icons/io";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
const Form = () => {
  //loader  state
  const [loading, setIsloading] = useState(false);
  //form state
  const [form, setForm] = useState({
    Pname: "",
    vendor: "",
    availability: "",
    price: "",
    category: "",
    image: null,
  });
  //clearing form
  const formInitialState = {
    Pname: "",
    vendor: "",
    availability: "",
    price: "",
    category: "",
    image: null,
  };
  //form input function
  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setForm({ ...form, [name]: value });
  };
  //form submit function
  const handleFormSubmit = async (e) => {
    const formData = new FormData();
    formData.append("Pname", form.Pname);
    formData.append("price", form.price);
    formData.append("vendor", form.vendor);
    formData.append("availability", form.availability);
    formData.append("category", form.category);
    formData.append("image", form.image);
    e.preventDefault();

    try {
      setIsloading(true);
      const response = await axios.post(
        "https://msback.onrender.com/products",
        formData
      );
      if (response) {
        toast.success(response.data.msg);
        setForm(formInitialState);
      } else {
        toast.success(response.data.msg);
      }
      console.log(response);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsloading(false);
    }
  };
  // handle image upload function
  const handleImage = (e) => {
    const imageFile = e.target.files[0];
    setForm({ ...form, image: imageFile });
  };
  return (
    <>
      <Nav />
      <div className="body">
        {/* form body */}
        <div className="form">
          <div className="form-container shadow-sm rounded">
            {/* form name header */}
            <div
              style={{
                fontWeight: "bold",
                fontSize: "24.56px",
                color: "#787878",
                fontFamily: "sans-serif , Montserrat",
              }}
            >
              Create Product
            </div>

            {/* form body */}
            <form onSubmit={handleFormSubmit}>
              <div className="mt-4">
                <div>
                  <label htmlFor="" className="form-label">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="Pname"
                    onChange={handleInput}
                    placeholder="Product title*"
                    className="form-control"
                    value={form.Pname}
                  />
                </div>
                <div>
                  <label htmlFor="" className="form-label">
                    Product Price
                  </label>
                  <input
                    type="text"
                    name="price"
                    onChange={handleInput}
                    placeholder="Product Price*"
                    className="form-control"
                    value={form.price}
                  />
                </div>
                <div className="d-flex gap-5">
                  <div>
                    <label htmlFor="" className="form-label">
                      Product Category
                    </label>
                    <select
                      name="category"
                      onChange={handleInput}
                      className="form-select w-100"
                      id=""
                      value={form.category}
                    >
                      <option value="category">Category</option>
                      <option value="Drink">Drink</option>
                      <option value="Protein">Protein</option>
                      <option value="Carbohydrate">Carbohydrate</option>
                      <option value="junks">junk</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="" className="form-label">
                      Vendor
                    </label>
                    <select
                      name="vendor"
                      onChange={handleInput}
                      className="form-select w-100"
                      id=""
                      value={form.vendor}
                    >
                      <option value="">Store</option>
                      {Vendors.map((item) => {
                        return <option value={item.name}>{item.name}</option>;
                      })}
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="" className="form-label">
                    Availability
                  </label>
                  <select
                    name="availability"
                    onChange={handleInput}
                    className="form-select"
                    id=""
                    value={form.availability}
                  >
                    <option value="">Availability</option>
                    <option value="inStock">inStock</option>
                    <option value="outOfStock">outOfStock</option>
                  </select>
                  {/* image uploader */}
                  <div>
                    <label htmlFor="file-input" className="form-label">
                      Upload Image
                      <input
                        type="file"
                        id="file-input"
                        name="image"
                        onChange={handleImage}
                        hidden
                      />
                      {form.image ? (
                        <div className="image-uploader-div">
                          <img
                            width={50}
                            src={URL.createObjectURL(form.image)}
                          />
                        </div>
                      ) : (
                        <div className="image-uploader-div">
                          <div className="image">
                            <IoMdCloudUpload size={50} color="#787878" />
                          </div>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
                <button className="btn btn-primary mt-4">
                  {loading ? (
                    <div
                      className="spinner-border spinner-border-sm"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    <>Create</>
                  )}
                </button>
              </div>
            </form>
            {/* form body end */}
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};
export default Form;
