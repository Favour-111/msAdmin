import React, { useEffect, useRef } from "react";
import "./Edit.css";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import Nav from "../Nav/Nav";
import WebViewer from "@pdftron/webviewer";
const Edit = () => {
  const viewer = useRef(null);

  useEffect(() => {
    WebViewer(
      {
        path: "/webviewer/lib",
        licenseKey: "YOUR_LICENSE_KEY",
        initialDoc:
          "https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf",
      },
      viewer.current
    ).then((instance) => {
      const { documentViewer } = instance.Core;
      // you can now call WebViewer APIs here...
    });
  }, []);
  return (
    <div>
      <div>
        <Nav />
        <div className="banner">
          <div className="banner-container">
            <div className="headname">Admin</div>
            <div className="text-capitalize fw-bold">
              home <MdKeyboardDoubleArrowRight /> Edit
            </div>
          </div>
        </div>
        <div></div>
        <div
          className="webviewer"
          ref={viewer}
          style={{ height: "100vh" }}
        ></div>
      </div>
    </div>
  );
};

export default Edit;
