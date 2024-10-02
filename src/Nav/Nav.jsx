import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaDiceFour, FaWpforms } from "react-icons/fa";
import { RiMenu2Line } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import Avatar from "react-avatar";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import "./Nav.css";
import { io } from "socket.io-client";
import { FiAlignCenter } from "react-icons/fi";
import {
  MdNoteAdd,
  MdOutlineAttachMoney,
  MdOutlineCollectionsBookmark,
  MdOutlineStoreMallDirectory,
  MdRateReview,
} from "react-icons/md";
import axios from "axios";
const Nav = () => {
  const Toggle = useRef();
  const [open, setOpen] = useState(false);
  const [order, setResponse] = useState([]);
  const getOrder = async (e) => {
    try {
      const response = await axios.get("https://msback.onrender.com/orders");
      setResponse(response.data.message);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getOrder();
    const socket = io("https://msback.onrender.com/");

    // Listen for real-time updates (product added or deleted)
    socket.on("OrderAdded", (newOrder) => {
      setResponse((prevOrders) => [...prevOrders, newOrder]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (Toggle.current && !Toggle.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div className="nav shadow-sm">
        <div className="w-100">
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            className={open ? "Nav-togglein" : "Nav-toggle"}
            onClick={() => {
              setOpen(true);
            }}
          >
            <RiMenu2Line className="fs-4 m-3" />
            <div>
              <Avatar
                name="Meal Section"
                size="150"
                className="me-3"
                round={true}
                size={40}
              />
            </div>
          </div>
        </div>

        <div
          className={open ? "nav-body" : "nav-body-inactive"}
          ref={Toggle}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {/* navbar closing icon */}
          <div
            className="close"
            onClick={() => {
              setOpen(false);
            }}
          >
            <IoMdClose />
          </div>
          {/* nav body */}
          <div className="mt-4 d-flex align-items-center justify-content-between p-3 ">
            <p
              style={{
                fontWeight: "900",
                color: "white",
                fontSize: "24px",
                fontFamily: "Montserrat , sans-serif",
              }}
            >
              Admin.
            </p>
            <FiAlignCenter className="me-3 mb-3" />
          </div>
          {/* nav content */}
          <div>
            <ul>
              <Link to="/" className="Link">
                <li>
                  <FaDiceFour className="mb-1 me-3" />
                  DashBoard
                </li>
              </Link>
              <Link className="Link" to="/price">
                <li>
                  <MdOutlineStoreMallDirectory className="mb-1 me-3 fw-bold" />
                  Delivery Price
                </li>
              </Link>

              <Link className="Link" to="/product-form">
                <li>
                  <FaWpforms className="mb-1 me-3 fw-bold" />
                  Product Form
                </li>
              </Link>
              <Link className="Link" to="/collection">
                <li>
                  <MdOutlineCollectionsBookmark className="mb-1 me-3 fw-bold" />
                  Collection
                </li>
              </Link>

              <Link className="Link" to="/sales">
                <li className="d-flex align-items-center justify-content-between">
                  <div>
                    <FaMoneyBillTrendUp className="mb-1 me-3" />
                    Orders
                  </div>
                  <div className="OrderLength">{order.length}</div>
                </li>
              </Link>
              <Link className="Link" to="/review">
                <li>
                  <MdRateReview className="mb-1 me-3" />
                  CustomerReview
                </li>
              </Link>
              <Link className="Link" to="/note">
                <li>
                  <MdNoteAdd className="mb-1 me-3" />
                  Note
                </li>
              </Link>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nav;
