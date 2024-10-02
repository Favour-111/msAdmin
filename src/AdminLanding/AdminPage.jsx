import React, { useEffect, useState } from "react";
import "./AdminPage.css";
import Nav from "../Nav/Nav";
import {
  MdOutlineCancel,
  MdOutlineKeyboardArrowRight,
  MdOutlineMonetizationOn,
} from "react-icons/md";
import { FaCheck, FaMoneyBill, FaRegHourglass } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { TbClockCheck } from "react-icons/tb";
import axios from "axios";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaRegEye } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";

const AdminPage = () => {
  // const [inp, setInp] = useState("");
  const [order, setOrder] = useState([]);
  const [loader, SetLoader] = useState(false);
  const [deletingOrderId, setDeletingOrderId] = useState(null);

  const getOrder = async () => {
    SetLoader(true);
    const response = await axios.get("https://msback.onrender.com/orders");
    setOrder(response.data.message);
    SetLoader(false);
  };

  useEffect(() => {
    getOrder();
    const socket = io("https://msback.onrender.com/");

    // Listen for real-time updates (product added or deleted)
    socket.on("OrderAdded", (newOrder) => {
      setOrder((prevOrders) => [...prevOrders, newOrder]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleDelete = async (id) => {
    setDeletingOrderId(id);
    SetLoader(true);
    try {
      const response = await axios.delete(
        `https://msback.onrender.com/order/${id}`
      );
      if (response) {
        toast.success("Order deleted successfully");
        setOrder(order.filter((item) => item._id !== id));
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      SetLoader(false);
      setDeletingOrderId(null);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    SetLoader(true);
    try {
      const response = await axios.put(
        `https://msback.onrender.com/order/${id}`,
        {
          orderStatus: !currentStatus,
        }
      );
      if (response) {
        toast.success("Order status updated");
        setOrder(
          order.map((item) =>
            item._id === id ? { ...item, orderStatus: !currentStatus } : item
          )
        );
      }
    } catch (error) {
      console.error(error.message);
      toast.error("Error updating order status");
    } finally {
      SetLoader(false);
    }
  };
  const SLicedOrder = order.slice().reverse().slice(0, 6);
  const PeningOrders = order.filter((item) => item.orderStatus === false);
  const Approved_orders = order.filter((item) => item.orderStatus === true);

  const Approved_Order_Price = Approved_orders.map((item) => {
    return item.totalPrice;
  });
  console.log(Approved_Order_Price);

  const total = Approved_Order_Price.reduce(
    (acc, item) => acc + Number(item),
    0
  );

  const formattedTotal = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(total);
  return (
    <>
      {/* navigation bar component */}
      <Nav />
      <div className="body">
        {/* bread crumbs */}
        <div className="shadow-sm p-4 d-flex align-items-center bg-light justify-content-between">
          {" "}
          <div
            style={{
              fontWeight: "lighter",
              fontSize: 30,
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            {/* Mealsection */}
          </div>
          <div
            style={{
              fontWeight: "bold",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            <span
              style={{
                color: "#1c1c1c80",
              }}
            >
              Home
            </span>
            <span>
              <MdOutlineKeyboardArrowRight size={25} />
            </span>
            <span className="ms-2">DashBoard</span>
          </div>
        </div>

        {/* about orders */}
        {loader ? (
          <div className="text-center mt-4">
            <div className="spinner-border spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="p-3 d-md-flex d-sm-block gap-5">
              <div className="w-md-25 rounded w-sm-100 bg-light p-4 d-flex gap-4">
                <div className="iconBodyBlue  pt-3 rounded-circle text-center">
                  <MdOutlineMonetizationOn size={40} className="text-primary" />
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: "bold",
                      fontFamily: "Montserrat, sans-serif",
                      fontSize: 25,
                    }}
                  >
                    {order.length}
                  </div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: "light",
                      fontFamily: "Montserrat, sans-serif",
                      textTransform: "capitalize",
                      color: "#787878",
                    }}
                  >
                    total orders
                  </div>
                </div>
              </div>
              <div className="w-md-25 rounded w-sm-100 bg-light  p-4 d-flex gap-4">
                <div className="iconBodyOrange pt-4 rounded-circle text-center">
                  <FaRegHourglass size={30} className="text-warning" />
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: "bold",
                      fontFamily: "Montserrat, sans-serif",
                      fontSize: 25,
                    }}
                  >
                    {PeningOrders.length}
                  </div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: "light",
                      fontFamily: "Montserrat, sans-serif",
                      textTransform: "capitalize",
                      color: "#787878",
                    }}
                  >
                    pending orders
                  </div>
                </div>
              </div>
              <div className="w-md-25 rounded w-sm-100 bg-light p-4 d-flex gap-4">
                <div className="iconBodygreen pt-4 rounded-circle text-center">
                  <FaCheck size={30} className="text-success" />
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: "bold",
                      fontFamily: "Montserrat, sans-serif",
                      fontSize: 25,
                    }}
                  >
                    {Approved_orders.length}
                  </div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: "light",
                      fontFamily: "Montserrat, sans-serif",
                      textTransform: "capitalize",
                      color: "#787878",
                    }}
                  >
                    approved orders
                  </div>
                </div>
              </div>
              <div className="w-md-25 rounded w-sm-100 bg-light p-4 d-flex gap-4">
                <div className="iconBodydanger pt-4 rounded-circle text-center">
                  <FaMoneyBill size={30} className="text-danger" />
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: "bold",
                      fontFamily: "Montserrat, sans-serif",
                      fontSize: 25,
                    }}
                  >
                    {formattedTotal}
                  </div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: "light",
                      fontFamily: "Montserrat, sans-serif",
                      textTransform: "capitalize",
                      color: "#787878",
                    }}
                  >
                    Total
                  </div>
                </div>
              </div>
            </div>

            {/* recent orders table*/}
            <div className="p-2">
              <div className="OrderBody-container p-4">
                <table className="p-4">
                  <tr>
                    <th>Order Id</th>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Vendor</th>
                    <th>OrderStatus</th>
                    <th>Action</th>
                  </tr>
                  {SLicedOrder.map((item) => {
                    return (
                      <tr className="bg-light" key={item._id}>
                        <td>#{item.orderId}</td>
                        <td>{item.Date}</td>
                        <td>{item.name}</td>
                        <td>{item.Vendor}</td>
                        <td>
                          {item.orderStatus ? (
                            <div
                              onClick={() =>
                                handleToggleStatus(item._id, item.orderStatus)
                              }
                              className="delivery-status"
                            >
                              <TbClockCheck
                                className="mb-1  mx-1"
                                size={20}
                                color="white"
                              />
                              Delivered
                            </div>
                          ) : (
                            <div
                              onClick={() =>
                                handleToggleStatus(item._id, item.orderStatus)
                              }
                              className="pending-button"
                            >
                              <TbClockCheck className="mb-1 mx-1" size={20} />
                              Pending
                            </div>
                          )}
                        </td>
                        <td className="d-flex gap-1">
                          {deletingOrderId === item._id ? (
                            <div className="spinner-border" role="status">
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </div>
                          ) : (
                            <div
                              className="action-icon"
                              onClick={() => handleDelete(item._id)}
                            >
                              <RiDeleteBinLine size={20} color="red" />
                            </div>
                          )}
                          <Link
                            to={`/order/${item._id}`}
                            className="action-icon"
                          >
                            <FaRegEye size={20} color="blue" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AdminPage;
