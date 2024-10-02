import React, { useEffect, useState } from "react";
import Nav from "../Nav/Nav";
import { FaEye, FaPlus } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Ensure toastify CSS is loaded

const Note = () => {
  const [form, setForm] = useState({
    note: "",
    status: false,
  });

  const [notes, setNotes] = useState([]); // state to fetch all notes
  const [loading, setLoading] = useState(false); // loading state for fetch/add/delete actions

  // Function for form input
  const handleInput = (e) => {
    const name = e.target.name;
    const value =
      e.target.name === "status"
        ? e.target.value === "Activate"
        : e.target.value;
    setForm({ ...form, [name]: value });
  };

  // Submit form to add note
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading true when starting submission
    try {
      const response = await axios.post(
        `https://msback.onrender.com/note/`,
        form
      );
      if (response) {
        toast.success("Note successfully added");
        fetchNotes(); // Fetch updated notes after adding a new one
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false); // Stop loading when the operation is done
    }
  };

  // Fetch notes from backend
  const fetchNotes = async () => {
    setLoading(true); // Start loading when fetching notes
    try {
      const response = await axios.get("https://msback.onrender.com/note");
      if (response) {
        toast.success("Notes fetched successfully");
        setNotes(response.data.data);
      }
    } catch (error) {
      toast.error("Error fetching notes");
    } finally {
      setLoading(false); // Stop loading after fetch is done
    }
  };

  // Fetch notes when component mounts
  useEffect(() => {
    fetchNotes();
  }, []);

  // Function to delete notes
  const handleDelete = async (id) => {
    setLoading(true); // Start loading when deleting note
    try {
      const del = await axios.delete(`https://msback.onrender.com/note/${id}`);
      if (del) {
        toast.success("Note deleted successfully");
        fetchNotes(); // Fetch updated notes after deletion
      }
    } catch (error) {
      toast.error("Error deleting note");
    } finally {
      setLoading(false); // Stop loading after deletion
    }
  };

  return (
    <div>
      <Nav />
      <div>
        <div
          style={{
            fontWeight: "bold",
            fontSize: 25,
            fontFamily: "Montserrat, sans-serif",
            padding: 10,
          }}
        >
          Special Notes
        </div>

        {/* Add Note Modal */}
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
                  Add Note
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div>
                    <label>Note</label>
                    <textarea
                      name="note"
                      onChange={handleInput}
                      placeholder="Input notes here..."
                      className="form-control"
                    ></textarea>
                  </div>

                  <div>
                    <label>Status</label>
                    <select
                      className="form-control"
                      onChange={handleInput}
                      name="status"
                    >
                      <option value="">Select</option>
                      <option value="Activate">Activate</option>
                      <option value="De-Activate">De-Activate</option>
                    </select>
                  </div>
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
                    {loading ? (
                      <span className="spinner-border spinner-border-sm"></span>
                    ) : (
                      "Add"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Add Note Button */}
        <button
          type="button"
          className="btn btn-primary ms-3"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          Add note <FaPlus />
        </button>

        {/* Loader for fetching and deleting */}
        {loading && (
          <div className="text-center my-4">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {/* Notes List */}
        <div className="p-3">
          {notes.map((item) => (
            <div key={item.id} className="bg-light mt-3 p-3 rounded">
              <div style={{ fontWeight: "bold" }}>{item.date}</div>
              <div className="mt-2">{item.note}</div>
              <div className="d-flex gap-3 align-items-center mt-3">
                <button
                  className={`btn ${
                    item.status ? "btn-success" : "btn-danger"
                  }`}
                >
                  {item.status ? "Activated" : "De-activated"}
                </button>
                <RiDeleteBin6Line
                  style={{ cursor: "pointer" }}
                  onClick={() => handleDelete(item._id)}
                  size={20}
                  color="red"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Note;
