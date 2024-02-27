import React, { Fragment,useState } from "react";
import AdminNavigationBar from "./AdminNavigationBar";
function LabTestAdminstration({ setAuth }) {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false); 

  const handleEnterResult = () => {
    closeModal();
    console.log("Test conducted");
  }
  return (
    <Fragment>
      <AdminNavigationBar setAuth={setAuth} />
      <div className="row mt-5 container">
        <div className="col-md-12 mb-4 ">
          <div className="card dark:bg-slate-300">
            <div className="card-body">
              <h5 className="card-title">John Doe</h5>
              <p className="card-text">January 1, 2022</p>
              <button
                onClick={openModal}
                className="btn btn-success position-absolute top-3 end-3 mt-2 custom-btn"
              >
                Conduct Test
              </button>
            </div>
            {isOpen && (
              <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="absolute inset-0 bg-gray-500 bg-opacity-80 transition-opacity flex items-center justify-center">
                  <div
                    className="relative w-full  bg-white p-6 rounded-md"
                    style={{ width: "70%", height: "60%" }}
                  >
                    <button
                      onClick={closeModal}
                      className="btn btn-danger w-20"
                    >
                      x
                    </button>
                    <div className="col-md-12 mb-4 mt-4 ">
                      <div className="card dark:bg-slate-300">
                        <div className="card-body d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                            <h5 className="card-title mr-3">Creatinine</h5>
                          </div>
                          <div className="d-flex align-items-center">
                            <button
                              className="btn btn-success custom-btn"
                              onClick={handleEnterResult}
                            >
                              Enter Result
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default LabTestAdminstration;
