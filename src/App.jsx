import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Form from "./ProductForm/Form";
import Collection from "./Collection/Collection";
import Review from "./Reviews/Review";
import Edit from "./Edit/Edit";
import Sales from "./Sales/Sales";
import EditForm from "./EditForm/EditForm";
import AdminPage from "./AdminLanding/AdminPage";
import Note from "./Note/Note";
import Delivery from "./Delivery/Delivery";
import SingleOrder from "./SingleOrder/SingleOrder";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<AdminPage />} path="/" />
          <Route element={<Form />} path="/product-form" />
          <Route element={<Collection />} path="/collection" />
          <Route element={<Review />} path="/review" />
          <Route element={<Edit />} path="/Edit" />
          <Route element={<Sales />} path="/sales" />
          <Route element={<Note />} path="/note" />
          <Route element={<Delivery />} path="/price" />
          <Route element={<SingleOrder />} path="/order/:id" />
          <Route element={<EditForm />} path="/formEdit/:id" />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
