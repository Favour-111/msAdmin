import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./SingleOrder.css";
import { IoShareSocialOutline } from "react-icons/io5";

const SingleOrder = () => {
  const { id } = useParams();
  const [singleOrder, setsingleOrder] = useState({});
  const [loader, setLoader] = useState(false);
  const getSingleProduct = async () => {
    setLoader(true);
    try {
      const response = await axios.get(
        `https://msback.onrender.com/order/${id}`
      );
      console.log(response.data.response);
      setsingleOrder(response.data.response);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getSingleProduct();
  }, [id]);

  //sending whatAppMessages

  const phoneNumber = "+2348069989705"; // Replace with the actual number

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
    packPrice
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
  ADDRESS ${Address} 
  _______________________
  DATE: ${date}
  _______________________
  GENDER: ${gender} 
  _______________________
  *PACK:*
  SELECTED PACK: ${packPrice};
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

  return (
    <div>
      {loader ? (
        <div className="text-center mt-4">
          <div className="spinner-border spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="receipt-container-body">
          <div>
            <img src={singleOrder.image} className="Receipt" alt="name" />
          </div>
          <div className="Invoice-body shadow p-3">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <div style={{ fontWeight: "bold", fontSize: 20 }}>
                  Invoice : #{singleOrder.orderId}
                </div>
                <div>{singleOrder.Date}</div>
              </div>
              <button className="btn btn-primary">
                Total: {singleOrder.totalPrice}
              </button>
            </div>
            <div className="d-flex align-items-center justify-content-between mt-4">
              <div className="text-capitalize fw-bold">
                Name: {singleOrder.name}
                <br />
                Gender: {singleOrder.gender}
              </div>
              <div>{singleOrder.phoneNumber}</div>
            </div>
            <div className="mt-3">
              <p className="opacity-75 fw-bold">
                <span className="color-dark opacity-100 mx-2">Address:</span>
                {singleOrder.Address}
              </p>
            </div>
            <div>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Product Name</th>
                    <th scope="col">Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {singleOrder.cartItems && singleOrder.cartItems.length > 0 ? (
                    singleOrder.cartItems.map((item, index) => (
                      <tr key={index}>
                        <td>{item.productName}</td>
                        <td>{item.quantity}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2">No items in the cart</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <div className="fw-bold mx-3">Vendor: {singleOrder.Vendor}</div>
              <div className="fw-bold mx-3">Pack: {singleOrder.PackPrice}</div>
            </div>
            <div className="my-3 d-flex align-item-end justify-content-end">
              <div className="fw-bold fs-5">
                Total: {singleOrder.totalPrice}
              </div>
            </div>
            <div
              onClick={() =>
                shareBtn(
                  singleOrder.orderId,
                  singleOrder.name,
                  singleOrder.Vendor,
                  singleOrder.Date,
                  singleOrder.totalPrice,
                  singleOrder.gender,
                  singleOrder.phoneNumber,
                  singleOrder.Address,
                  singleOrder.cartItems,
                  singleOrder.PackPrice
                )
              }
              className="action-icon"
            >
              <IoShareSocialOutline size={20} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleOrder;
