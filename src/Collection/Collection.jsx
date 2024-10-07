import React, { useEffect, useState } from "react";
import Nav from "../Nav/Nav";
import "./Collection.css";
import { IoIosArrowForward, IoIosTimer, IoMdHome } from "react-icons/io";
import { MdDateRange } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { FaEye, FaPlus } from "react-icons/fa";
import axios from "axios";
import { RiDeleteBack2Line } from "react-icons/ri";
import { FaTrash } from "react-icons/fa6";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
const Collection = () => {
  const navigate = useNavigate();
  //collection state
  const [collection, SetCollection] = useState([]);
  //loader State
  const [loading, SetLoader] = useState(false);
  //date state
  const [currentDate, setCurrentDate] = useState("");
  //time state
  const [currentTime, setCurrentTime] = useState("");
  //search state
  const [search, setSearch] = useState("");
  //date function
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setCurrentDate(formattedDate);
  }, []); // Empty dependency array ensures this runs only once on component mount
  //time function
  //function to fetch collection data
  const getALlProduct = async () => {
    try {
      SetLoader(true);
      const response = await axios.get(
        `https://msback.onrender.com/getalProducts`
      );
      console.log(response);
      if (response) {
        SetCollection(response.data.response);
        toast.success("data fetched successfully");
      } else {
        toast.error("issues fetching data");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      SetLoader(false);
    }
  };
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setCurrentTime(formattedTime);
    };

    // Update time every second
    const timer = setInterval(updateTime, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(timer);
  }, []);
  //useEffect funtion for fetching APi
  useEffect(() => {
    getALlProduct();
  }, []);
  //delete product function
  const handleDelete = async (id) => {
    SetLoader(true);
    try {
      const response = await axios.delete(
        `https://msback.onrender.com/delete/${id}`
      );
      if (response) {
        // Filter out the deleted item from the collection
        SetCollection((prevCollection) =>
          prevCollection.filter((item) => item._id !== id)
        );
        toast.success("Product deleted successfully");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      SetLoader(false);
    }
  };
  const toggleSwal = () => {
    swal({
      title: "Are you sure you want to delete all products?",
      text: "Once deleted, you will not be able to recover products!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        SetLoader(true);
        try {
          const deleteOrder = await axios.delete(
            "https://msback.onrender.com/products/delete"
          );
          if (deleteOrder) {
            SetCollection([]); // Clear the order list
            swal("Poof! All products have been deleted!", {
              icon: "success",
            });
          }
        } catch (error) {
          swal("Failed to delete products", {
            icon: "error",
          });
          console.error("Error deleting all products:", error);
        } finally {
          SetLoader(false);
        }
      } else {
        swal("products deletion canceled!");
      }
    });
  };
  return (
    <div>
      <Nav />
      {/* collection body */}
      <div className="body">
        {/* collection head */}
        <div className="collection-header ps-4 pt-3">
          <span>Collection</span>
          <span style={{ color: "#787878" }}>{collection.length}</span>
        </div>
        {/* bread crumbs */}
        <div
          style={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            marginTop: 20,
            paddingLeft: 20,
          }}
        >
          <IoMdHome color="#787878" />
          <div>
            <IoIosArrowForward />
          </div>
          <div
            style={{
              color: "#787878",
              fontWeight: "bold",
            }}
          >
            Admin
          </div>
          <div>
            <IoIosArrowForward />
          </div>
          <div
            style={{
              fontWeight: "bold",
            }}
          >
            Collection
          </div>
        </div>
        {/* bread crumb end */}
        {/* second bread crumb */}
        <div className="p-4 d-md-flex d-sm-block justify-content-between">
          <div className="d-md-flex d-sm-block  gap-3">
            <div className=" d-flex h-50 mt-2 gap-2">
              <div
                style={{
                  fontWeight: "bold",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                Show {""}{" "}
              </div>
              <div className="shadow-sm px-5 text-center bg-light rounded ">
                30
              </div>
            </div>
            <div className="shadow-sm  mt-2 h-50 bg-light rounded p-1">
              <MdDateRange className="mx-1" />
              {""}
              {""}
              {currentDate}
            </div>
            <div className="shadow-sm mt-2 h-50 bg-light rounded p-1">
              <IoIosTimer className="mx-1" />
              {""}
              {""}
              {currentTime}
            </div>
          </div>

          {/* search function */}
          <div className="d-flex gap-2 mt-3 ">
            <div className="search-container rounded bg-light shadow-sm p-2 w-100">
              <div className="search d-flex align-items-center">
                <FiSearch className="mx-2" />
                <input
                  type="text"
                  className="bg-light"
                  placeholder="Search product"
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <Link
              to="/product-form"
              className="btn btn-primary rounded-circle p-2 add"
            >
              <FaPlus size={30} color="white" />
            </Link>
          </div>
        </div>
        <div>
          <button className="m-3 btn btn-danger" onClick={toggleSwal}>
            Delete All
          </button>
        </div>
        {/* collectionBody */}
        {loading ? (
          <div className="d-flex justify-content-center mt-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="collection-body">
            {/* collection head */}
            <table>
              <tr>
                <th className="imageHead">image</th>
                <th>Product Name</th>
                <th>Vendor</th>
                <th>Price</th>
                <th>Availability</th>
                <th>Action</th>
              </tr>
              <hr />
              {collection
                .filter((item) => {
                  if (search === "") {
                    return item;
                  } else if (
                    item.Pname.toLowerCase().includes(
                      search.toLocaleLowerCase()
                    )
                  ) {
                    return item;
                  }
                })
                .map((item) => {
                  return (
                    <tr className="rounded bg-light  h-100">
                      <td className="imageView">
                        <img src={item.image} alt={item.name} height={50} />
                      </td>
                      <td>{item.Pname}</td>
                      <td>{item.vendor}</td>
                      <td>{item.price}</td>
                      <td>
                        <div
                          className={
                            item.availability === "inStock"
                              ? "Instock"
                              : "outOfStock"
                          }
                        >
                          {item.availability}
                        </div>
                      </td>
                      <td className="d-flex gap-2">
                        <div
                          style={{
                            cursor: "pointer",
                            backgroundColor: "#1c1c1c10",
                            height: 40,
                            width: 40,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 100,
                          }}
                          onClick={() => {
                            handleDelete(item._id);
                          }}
                        >
                          <FaTrash color="red" />
                        </div>
                        <div
                          onClick={() => navigate(`/formEdit/${item._id}`)}
                          // to={`/formEdit/${item._id}`}
                          style={{
                            cursor: "pointer",
                            backgroundColor: "#1c1c1c10",
                            height: 40,
                            width: 40,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 100,
                          }}
                        >
                          <Link>
                            <FaEye color="blue" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </table>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};
export default Collection;
