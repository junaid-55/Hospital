import React, { Fragment, useState } from "react";
import AdminNavigationBar from "./AdminNavigationBar";

function DrugAdminstration({ setAuth }) {
  const [isOpen, setIsOpen] = useState(false);
  const [counter, setCounter] = useState(0);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const decrementCounter = () => {
    if (counter > 0) {
      setCounter(counter - 1);
    }
  };

  const handleGive = () => {
    closeModal();
    console.log("Medicine given");
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
                Give Medicine
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
                            <h5 className="card-title mr-3">Ritalin</h5>
                            <p className="card-text mb-1 ml-32">1-0-1</p>
                          </div>
                          <div className="d-flex align-items-center">
                            <input
                              type="text"
                              value={counter}
                              readOnly
                              className="form-control mr-2 rounded"
                              style={{ width: "50px" }}
                            />
                            <button
                              onClick={decrementCounter}
                              className="btn btn-primary custom-btn mr-2"
                              style={{
                                width: "20%",
                                fontSize: "0.8rem",
                                padding: "0.5rem 0.5rem",
                              }}
                            >
                              -1
                            </button>
                            <button
                              onClick={() => setCounter(counter + 1)}
                              className="btn btn-primary custom-btn mr-2  w-2"
                              style={{
                                width: "20%",
                                fontSize: "0.8rem",
                                padding: "0.5rem 0.5rem",
                              }}
                            >
                              +1
                            </button>
                            <button className="btn btn-success custom-btn" onClick={handleGive}>
                              Give
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

export default DrugAdminstration;
