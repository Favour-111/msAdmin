import React, { useState } from "react";
import "./Sales.css";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import Nav from "../Nav/Nav";
import { TbClockCheck } from "react-icons/tb";
import axios from "axios";
import { useEffect } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaRegEye } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import { FaShare } from "react-icons/fa6";
import { IoShareSocialOutline } from "react-icons/io5";
import swal from "sweetalert";
const Sales = () => {
  const [order, setOrder] = useState([]);
  const [loader, SetLoader] = useState(false);
  const [deletingOrderId, setDeletingOrderId] = useState(null);
  //toggle order type
  const [status, setStatus] = useState("All");
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
  const pending_order = order.filter((item) => !item.orderStatus);
  const Approved_orders = order.filter((item) => item.orderStatus === true);

  //sending whatAppMessages

  const phoneNumber = "+2347013234960"; // Replace with the actual number

  const shareBtn = (
    id,
    name,
    vendor,
    date,
    totalPrice,
    gender,
    Number,
    Address,
    cartItems,
    WhatsApp
  ) => {
    let itemsMessage = cartItems
      .map((item, index) => `${item.productName} - Qty: ${item.quantity}`)
      .join("\n");
    let message = `
    *${vendor.toUpperCase()}* 
  _______________________
  NAME: ${name}
  _______________________
  NUMBER: ${Number} 
  _______________________
  WHATSAPP: ${WhatsApp} 
  _______________________
  ADDRESS ${Address} 
  _______________________
  DATE: ${date}
  _______________________
  GENDER: ${gender} 
  _______________________
  *ORDERS:*
   ${itemsMessage}
   _______________________
  *TOTAL: ${totalPrice}* 
 
    
    Thank you for choosing Mealsection!
    `;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const toggleSwal = () => {
    swal({
      title: "Are you sure you want to delete all orders?",
      text: "Once deleted, you will not be able to recover Orders history!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        SetLoader(true);
        try {
          const deleteOrder = await axios.delete(
            "https://msback.onrender.com/delete_all"
          );
          if (deleteOrder) {
            setOrder([]); // Clear the order list
            swal("Poof! All orders have been deleted!", {
              icon: "success",
            });
          }
        } catch (error) {
          swal("Failed to delete orders", {
            icon: "error",
          });
          console.error("Error deleting all orders:", error);
        } finally {
          SetLoader(false);
        }
      } else {
        swal("Order deletion canceled!");
      }
    });
  };

  return (
    <div>
      <Nav />
      {loader ? (
        <div className="d-flex justify-content-center mt-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <div
            style={{
              fontSize: 30,
              fontFamily: "Montserrat, sans-serif",
              padding: 10,
              fontWeight: "600",
            }}
          >
            Orders😍
          </div>
          <div className="d-md-flex d-sm-block p-3 gap-5 justify-content-center mt-3">
            <div className="NewOrder rounded">
              <div
                style={{
                  fontWeight: "bold",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                All Order
              </div>
              <div className="d-flex gap-3 align-items-center mt-3">
                <div className="NumberNew">{order.length}</div>
                <div>|</div>
                <div
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  Mealsection
                </div>
              </div>
            </div>
            <div className="PeningOrders">
              <div
                style={{
                  fontWeight: "bold",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                Pending Order
              </div>
              <div className="d-flex gap-3 align-items-center mt-3">
                <div className="NumberPending">{pending_order.length}</div>
                <div>|</div>
                <div
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  Mealsection
                </div>
              </div>
            </div>
            <div className="DeliveredOrder">
              <div
                style={{
                  fontWeight: "bold",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                Approved Orders
              </div>
              <div className="d-flex gap-3 align-items-center mt-3">
                <div className="NumberDeliverdOrder">
                  {Approved_orders.length}
                </div>
                <div>|</div>
                <div
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  Mealsection
                </div>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-danger ms-3"
            onClick={() => {
              window.location.reload();
            }}
          >
            Refresh Orders{" "}
            <div className="spinner-border spinner-border-sm" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </button>
          {/* note */}
          <p
            style={{
              padding: 20,
              fontWeight: "bold",
            }}
            className="text-danger"
          >
            Click the refresh orders button to see recent orders
          </p>
          <div className="category-container">
            <div
              className={
                status === "All"
                  ? "container-category-items-Active"
                  : "container-category-items"
              }
              onClick={() => {
                setStatus("All");
              }}
            >
              All
            </div>
            <div
              className={
                status === "Pending"
                  ? "container-category-items-Active"
                  : "container-category-items"
              }
              onClick={() => {
                setStatus("Pending");
              }}
            >
              Pending
            </div>
            <div
              className={
                status === "Delivered"
                  ? "container-category-items-Active"
                  : "container-category-items"
              }
              onClick={() => {
                setStatus("Delivered");
              }}
            >
              Delivered
            </div>
          </div>

          <div className="OrderBody-container p-4">
            <button className="btn btn-danger" onClick={toggleSwal}>
              Delete All orders
            </button>
            <p
              style={{
                paddingTop: 20,
                fontWeight: "bold",
              }}
              className="text-danger"
            >
              Click the Delete All orders button to delete all orders
            </p>
            <p className="fw-bold fs-3 ">{status} Orders</p>
            <table className="p-4">
              <tr>
                <th>Order Id</th>
                <th>Date</th>
                <th>Name</th>
                <th>Vendor</th>
                <th>OrderStatus</th>
                <th>Action</th>
              </tr>
              {order
                .slice()
                .reverse()
                .filter((item) => {
                  if (status === "All") {
                    return item;
                  } else if (status === "Pending") {
                    return !item.orderStatus;
                  } else if (status === "Delivered") {
                    return item.orderStatus;
                  }
                })
                .map((item) => {
                  return (
                    <tr className="bg-light" key={item._id}>
                      <td>#{item.orderId}</td>
                      <td>{item.Date}</td>
                      <td>{item.name}</td>
                      <td>{item.Vendor}</td>
                      <td>
                        {console.log(item.orderStatus)}
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
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        ) : (
                          <div
                            className="action-icon"
                            onClick={() => handleDelete(item._id)}
                          >
                            <RiDeleteBinLine size={20} color="red" />
                          </div>
                        )}
                        <Link to={`/order/${item._id}`} className="action-icon">
                          <FaRegEye size={20} color="blue" />
                        </Link>
                        <div
                          onClick={() =>
                            shareBtn(
                              item.orderId,
                              item.name,
                              item.Vendor,
                              item.Date,
                              item.totalPrice,
                              item.gender,
                              item.phoneNumber,
                              item.Address,
                              item.cartItems,
                              item.WhatsApp
                            )
                          }
                          className="action-icon"
                        >
                          <IoShareSocialOutline size={20} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </table>
          </div>
          <ToastContainer />
        </>
      )}
    </div>
  );
};

export default Sales;
