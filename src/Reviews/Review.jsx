import React, { useEffect, useState } from "react";
import "./Review.css";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import Nav from "../Nav/Nav";
import { CiTrash } from "react-icons/ci";
import { FaEye, FaRegEye, FaUserCircle } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const Review = () => {
  //review state
  const [reviews, setReview] = useState([]);
  //loading state
  const [isLoading, setIsLoading] = useState(false);
  //review functionality
  const getReview = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("https://msback.onrender.com/allReivew");
      if (response) {
        toast.success("response was successfully fetched");
        setReview(response.data.message);
      } else {
        toast.error("Couldn't fetch");
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  //useEffect function
  useEffect(() => {
    getReview();
  }, []);

  //delete form function
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `https://msback.onrender.com/reviews/${id}`
      );
      if (response) {
        toast.success("Data deleted successfully");
        setReview(reviews.filter((review) => review._id !== id)); // Update state to remove deleted review
      } else {
        toast.error("Data cannot be deleted");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const handleToggleStatus = async (id, status) => {
    setIsLoading(true);
    try {
      const response = await axios.put(
        `https://msback.onrender.com/reviews/${id}`,
        {
          show: !status,
        }
      );
      if (response) {
        toast.success("status updated");
        setReview(
          reviews.map((item) =>
            item._id === id ? { ...item, show: !status } : item
          )
        );
      }
    } catch (error) {
      console.error(error.message);
      toast.error("Error updating  status");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      {/* nav import */}
      <Nav />
      {/* review body */}
      <div className="body">
        <div
          style={{
            fontWeight: "bold",
            fontSize: 25,
            fontFamily: "Montserrat, sans-serif",
            padding: 10,
          }}
        >
          Customer Review
        </div>
        {/* review contents */}
        {isLoading ? (
          <div className="d-flex justify-content-center mt-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="p-3">
            {reviews.map((item) => {
              return (
                <div className="bg-light mt-3 w-100 p-3">
                  <div className="d-flex align-items-center">
                    <FaUserCircle size={30} color="#787878" />
                    <div>
                      <div
                        style={{
                          fontWeight: "bold",
                          marginLeft: 10,
                        }}
                      >
                        {item.name}
                        <br />
                        {item.Email}
                      </div>
                      <div
                        style={{
                          color: "#787878",
                          fontFamily: "Montserrat, sans-serif",
                          marginLeft: 10,
                        }}
                      >
                        {item.Date}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    {item.Content}
                  </div>
                  {isLoading ? (
                    <div className="d-flex justify-content-center mt-5">
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="d-flex gap-3 align-items-center mt-3">
                      {item.show ? (
                        <button
                          onClick={() =>
                            handleToggleStatus(item._id, item.show)
                          }
                          className="btn btn-success"
                        >
                          Approved
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            handleToggleStatus(item._id, item.show);
                          }}
                          className="btn btn-danger"
                        >
                          DisApprove
                        </button>
                      )}
                      <RiDeleteBin6Line
                        onClick={() => {
                          handleDelete(item._id);
                        }}
                        size={20}
                        color="red"
                      />
                      <FaEye size={20} color="blue" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Review;
