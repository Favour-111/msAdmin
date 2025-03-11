import React, { useEffect, useState } from "react";
import "./Delivery.css";
import Nav from "../Nav/Nav";
import { PiStorefrontBold } from "react-icons/pi";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiDeleteBin6Line } from "react-icons/ri";
import Vendors from "../Vendors/Vendors";

const Delivery = () => {
  // Form state
  const [form, setForm] = useState({
    vendor: "",
    DeliveryFee: "",
    ServiceFee: "",
  });

  // Initial form state
  const initialFormState = {
    vendor: "",
    DeliveryFee: "",
    ServiceFee: "",
  };

  // State to retrieve all delivery fees
  const [deliveryFee, setDeliveryFee] = useState([]);

  // Loader state
  const [loader, setLoader] = useState(false);

  // Function to fetch all fees
  const getAllFee = async () => {
    try {
      setLoader(true);
      const response = await axios.get("https://msback.onrender.com/AllPrice");
      if (response) {
        setDeliveryFee(response.data.message);
      } else {
        toast.error("Error fetching fees, check network");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoader(false);
    }
  };
  console.log(deliveryFee);

  // useEffect hook to fetch data once component mounts
  useEffect(() => {
    getAllFee();
  }, []);

  // Handling form input change
  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Form submit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoader(true);
      // Axios request to add new fee
      const response = await axios.post(
        "https://msback.onrender.com/price",
        form
      );
      if (response) {
        // Immediately update the state with the new fee
        setDeliveryFee((prevFees) => [...prevFees, response.data.message]);
        toast.success(deliveryFee.message);
        setForm(initialFormState); // Reset form
      } else {
        toast.error(deliveryFee.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    } finally {
      setLoader(false);
    }
  };

  // Delete fee function
  const handleDelete = async (id) => {
    try {
      setLoader(true);
      const response = await axios.delete(
        `https://msback.onrender.com/deleteFee/${id}`
      );
      if (response) {
        toast.success("Successfully deleted");
        // Remove the deleted fee from state
        setDeliveryFee((prevFees) => prevFees.filter((fee) => fee._id !== id));
      } else {
        toast.error("Error deleting, check network");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div>
      <Nav />

      <div className="">
        <div
          style={{
            fontWeight: "bold",
            fontSize: 25,
            fontFamily: "Montserrat, sans-serif",
            padding: 10,
          }}
        >
          Delivery Price
        </div>

        <div>
          {/* Button trigger modal */}

          <button
            type="button"
            className="btn btn-primary ms-3"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            Add
          </button>
          {/* reload button  */}
          <button
            type="button"
            className="btn btn-danger ms-3"
            onClick={() => {
              window.location.reload();
            }}
          >
            Reload Page{" "}
            <div className="spinner-border spinner-border-sm" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </button>
        </div>
        {/* note */}
        <p
          style={{
            padding: 10,
            fontWeight: "bold",
          }}
          className="text-danger"
        >
          Ones you are done with the page ensure to reload it using the reload
          button to clear cache
        </p>
        {/* Modal */}
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Delivery Fee & Service Fee
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="vendor">Vendor</label>
                    <select
                      name="vendor"
                      value={form.vendor}
                      onChange={handleInput}
                      className="form-select"
                    >
                      <option value="">Select Vendor</option>
                      {Vendors.map((item) => (
                        <option key={item.name} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="DeliveryFee">Delivery Fee</label>
                    <input
                      className="form-control"
                      type="text"
                      name="DeliveryFee"
                      value={form.DeliveryFee}
                      onChange={handleInput}
                      placeholder="Input fee"
                    />
                  </div>
                  <div>
                    <label htmlFor="ServiceFee">Service Fee</label>
                    <input
                      type="text"
                      name="ServiceFee"
                      className="form-control"
                      value={form.ServiceFee}
                      onChange={handleInput}
                      placeholder="Input service fee"
                    />
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Add
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Displaying all delivery fees */}
        {loader ? (
          <div className="d-flex align-items-center justify-content-center mt-4">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="p-3">
            {deliveryFee.map((item) => (
              <div
                key={item._id}
                className="bg-light shadow-sm rounded mt-2 p-3"
              >
                <PiStorefrontBold size={40} />
                <div
                  style={{
                    fontWeight: "bold",
                    fontFamily: "Montserrat, sans-serif",
                    color: "#787878",
                    marginTop: 10,
                  }}
                >
                  {item.vendor}
                </div>
                <div
                  style={{
                    marginTop: 10,
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  Delivery Price:{" "}
                  <span
                    style={{
                      fontWeight: "bold",
                      fontSize: 20,
                    }}
                  >
                    {item.DeliveryFee}
                  </span>
                  <br />
                  Service Fee:{" "}
                  <span
                    style={{
                      fontWeight: "bold",
                      fontSize: 20,
                    }}
                  >
                    {item.ServiceFee}
                  </span>
                  <div>
                    <RiDeleteBin6Line
                      color="red"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleDelete(item._id)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default Delivery;
