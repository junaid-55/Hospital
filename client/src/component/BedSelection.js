import React, { Fragment, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
function BedSelection() {
  const [isOpen, setIsOpen] = useState(false);
  const [acType, setAcType] = useState("AC");
  const [roomType, setRoomType] = useState("WARD");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const handleSearchClick = () => {
    // const { acType, roomType, minPrice, maxPrice, selectedDate } = this.state;
    const body = { acType, roomType, minPrice, maxPrice, selectedDate };
    console.log(body);

  }

  return (
    <Fragment>
      <button onClick={openModal} className="btn btn-primary">
        Choose Bed
      </button>
      {isOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="absolute inset-0 bg-gray-500 bg-opacity-200 transition-opacity flex items-center justify-center">
            <div className="relative w-full  bg-white p-6 rounded-md" style={{ width: '70%', height: '60%' }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div className="flex justify-between w-full">
                <select
                    name="ac_type"
                    value={acType}
                    onChange={(e) => setAcType(e.target.value)}
                    className="border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                  >
                    <option>AC</option>
                    <option>Non Ac</option>
                  </select>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                  >
                    <option>WARD</option>
                    <option>ICU</option>
                    <option>SINGLE CABIN</option>
                    <option>DOUBLE CABIN</option>
                  </select>
                  <input
                    type="text"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-1/5 rounded"
                    placeholder="min price"
                  />
                  <input
                    type="text"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-1/5 rounded"
                    placeholder="max price"
                  />
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    className="rounded"
                  />
                  <button className="px-4 text-white bg-gray-600 border-l rounded" onClick={handleSearchClick}>
                    Search
                  </button>
                </div>
              </div>
              <table className="table-auto w-full mt-4">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Room No</th>
                    <th className="px-4 py-2">Type</th>
                    <th className="px-4 py-2">AC/Non AC</th>
                    <th className="px-4 py-2">Price</th>
                    <th className="px-4 py-2">Book</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-4 py-2">201A</td>
                    <td className="border px-4 py-2">SINGLE CABIN</td>
                    <td className="border px-4 py-2">AC</td>
                    <td className="border px-4 py-2">858</td>
                    <td className="border">
                      <button className="btn btn-success w-full h-full" onClick={closeModal}>Select...</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default BedSelection;
