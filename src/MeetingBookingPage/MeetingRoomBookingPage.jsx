"use client"
import React, { useEffect, useMemo, useState } from "react";

const unavailableSlotsByDate = {
  "2023-08-11": ["10:00", "14:00"],
  "2023-08-12": ["09:30", "13:30","16:00"],
  "2023-08-13": ["10:30", "12:30", "13:00", "15:30"],
  // Add more entries as needed
};

// function generateSlots(openingTime, closingTime) {
//   const slots = [];
//   let currentTime = openingTime;
//   while (currentTime <= closingTime) {
//     const [hours, minutes] = currentTime.split(":");
//     const time = new Date();
//     time.setHours(Number(hours));
//     time.setMinutes(Number(minutes));
    
//     const hours12Format = time.getHours() > 12 ? time.getHours() - 12 : time.getHours();
//     const amPm = time.getHours() >= 12 ? "PM" : "AM";
//     const formattedHours = hours12Format < 10 ? `0${hours12Format}` : hours12Format;
//     const formattedTime = `${formattedHours}:${minutes} ${amPm}`;
    
//     slots.push(formattedTime);
    
//     time.setMinutes(time.getMinutes() + 30);
//     currentTime = time.toTimeString().substr(0, 5);
//   }
//   return slots;
// }



function generateSlots(openingTime, closingTime) {
  const slots = [];
  let currentTime = openingTime;
  while (currentTime <= closingTime) {
    
    slots.push(currentTime);
    const [hours, minutes] = currentTime.split(":");
    const time = new Date();
    time.setHours(Number(hours));
    time.setMinutes(Number(minutes));
    time.setMinutes(time.getMinutes() + 30);
    currentTime = time.toTimeString().substr(0, 5);
  }
  return slots;
}

const MeetingRoomBookingPage = () => {
  const [selectedDate, setSelectedDate] = useState("2023-08-11");
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [duration, setDuration] = useState({timeDuration:0.0,unit:"mins"});
  const [credits, setCredits] = useState(0);
  const creditRequiredPerMeetingSlot = 1;
  const openingTime = "09:00";
  const closingTime = "19:30";

  const handleSelectSlot = (slot) => {
    selectedSlots.sort();
    if (!unavailableSlots.includes(slot)) {
      const firstSelectedSlot = selectedSlots[0];
      const lastSelectedSlot = selectedSlots[selectedSlots.length-1];

      if (!selectedSlots.includes(slot)) {
       if (lastSelectedSlot && getPreviousSlot(lastSelectedSlot) === slot && !unavailableSlots.includes(getPreviousSlot(slot))) {
          console.log("second",slot)
          setSelectedSlots([...selectedSlots, slot]);
        } else if(firstSelectedSlot && getPreviousSlot(firstSelectedSlot)===slot && !unavailableSlots.includes(getNextSlot(slot))) {
          setSelectedSlots([...selectedSlots, slot]);
        } else if(firstSelectedSlot && getNextSlot(firstSelectedSlot)===slot && !unavailableSlots.includes(getNextSlot(slot))) {
          setSelectedSlots([...selectedSlots, slot]);
        } else if (lastSelectedSlot && getPreviousSlot(lastSelectedSlot) === slot) {
          console.log("first",slot)
          setSelectedSlots([...selectedSlots, slot]);
        } else if (lastSelectedSlot && getNextSlot(lastSelectedSlot) === slot) { //this condition and the first one is mandatory for selection
          console.log("first",slot)
          setSelectedSlots([...selectedSlots, slot]);
        } else {
          setSelectedSlots([slot]);
        }
      } else {
          isIndexFirstOrLast(slot) ? setSelectedSlots(selectedSlots.filter((s) => s !== slot)) : setSelectedSlots([]);
      }
    }
  };

  const updateTimeDuration = useMemo(() => {
    const selectedSlotArrayLength = selectedSlots.length;
    if(selectedSlotArrayLength===1){
      setDuration(prev=>{return {...prev, timeDuration:30,unit:"mins"}})
    }else if(selectedSlotArrayLength===2){
      setDuration(prev=>{return {...prev, timeDuration:(selectedSlotArrayLength*0.5).toFixed(1),unit:"hr"}})
    } else if(selectedSlotArrayLength>2){
      setDuration(prev=>{return {...prev, timeDuration:(selectedSlotArrayLength*0.5).toFixed(1),unit:"hrs"}})
    }else{
      setDuration(prev=>{return {...prev, timeDuration:0,unit:"mins"}})
    }
  },[selectedSlots.length]);

  const calculateCreditsRequired = useMemo(()=>{
    const totalCredits = creditRequiredPerMeetingSlot*selectedSlots.length;
    setCredits(totalCredits);
  },[selectedSlots.length])

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    setSelectedSlots([]); // Reset selected slots when changing date
  };

  const getNextSlot = (slot) => {
    const index = slots.indexOf(slot);
    return index !== -1 && index + 1 < slots.length ? slots[index + 1] : null; // returns next slot
  };

  const getPreviousSlot = (slot) => {
    const index = slots.indexOf(slot);
    return index !== -1 && index - 1 >= 0 ? slots[index - 1] : null;
  };

  const isIndexFirstOrLast = (slot) => {
    selectedSlots.sort();
    const index = selectedSlots.indexOf(slot);
    console.log(index)
    if(index===0 || index===selectedSlots.length-1) return true;
    return false;
  }

  function convertToAMPM(timeString="") {
    const [hours, minutes] = timeString.split(":");
    const parsedHours = parseInt(hours, 10);
    
    if (parsedHours >= 0 && parsedHours <= 11) {
      return `${parsedHours === 0 ? 12 : parsedHours}:${minutes} AM`;
    } else if (parsedHours >= 12 && parsedHours <= 23) {
      return `${parsedHours === 12 ? 12 : parsedHours - 12}:${minutes} PM`;
    } else {
      return "Invalid time format";
    }
  }

  const slots = generateSlots(openingTime, closingTime);
  const unavailableSlots = unavailableSlotsByDate[selectedDate] || [];

  return (
    <div className="min-h-screen flex justify-center bg-gray-100">
      <div className="max-w-md mx-auto bg-white border border-red-500  p-4">
        <h1 className="text-2xl font-semibold mb-4">Book Meeting Room Slots</h1>
        <div className="mb-2">
          <label htmlFor="selectedDate" className="block font-medium">
            Select Meeting Room:
          </label>
          <select
            className="w-full p-2 border rounded focus:ring-1 focus:ring-red-500 focus:outline-none"
          >
            <option value="">Test 1</option>
            <option value="">Test 2</option>
          </select>
        </div>
        <div className="mb-2">
          <label htmlFor="selectedDate" className="block font-medium">
            Select Date:
          </label>
          <input
            type="date"
            id="selectedDate"
            value={selectedDate}
            onChange={handleDateChange}
            className="w-full p-2 border rounded focus:ring-1 focus:ring-red-500 focus:outline-none"
          />
        </div>
        <div className="mt-8 text-center">
          <p className="">Slots available on : <span className="font-medium">{new Date(selectedDate).toDateString()}</span></p>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-2">
          {slots.map((slot) => (
            <button
              key={slot}
              onClick={() => handleSelectSlot(slot)}
              className={`col-span-1 px-3 py-1 text-sm rounded ${
                selectedSlots.includes(slot)
                  ? "bg-red-600 text-white cursor-pointer"
                  : unavailableSlots.includes(slot)
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "text-green-600 bg-white border border-green-700 hover:bg-green-600 hover:text-white hover:cursor-pointer"
              }`}
              disabled={unavailableSlots.includes(slot)}
            >
              {convertToAMPM(slot)}
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-4xl font-semibold mb-2">Duration</p>
          <p className="text-6xl font-bold text-red-500">{duration.timeDuration}<span className="text-2xl">{duration.unit}</span></p>
          <p className="text-lg font-bold text-gray-800 mt-8">Credits required: <span className="font-bold text-red-500">{credits}</span></p>
          <p className="text-lg font-bold text-gray-800 mt-2">Meeting starts at : <span className="font-bold text-red-500">{ selectedSlots.sort()[0] ? convertToAMPM(selectedSlots[0]):"NA"}</span></p>
        </div>

        {/* <div className="mt-4 text-center">
          <p className="text-4xl font-semibold mb-2">Duration</p>
          <p className="text-6xl font-bold text-red-500">{duration.timeDuration}<span className="text-2xl">{duration.unit}</span></p>
        </div>

        <div className="mt-4 text-center">
          <p className="text-lg font-bold text-gray-800 mb-2">Credits required: <span className="font-bold text-red-500">{credits}</span></p>
        </div> */}

          <div className="max-w-md mt-8 w-full flex flex-col items-center justify-center bg-white p-6 rounded-lg">
            <input type="text" placeholder="Meeting Title" className="border p-2 mb-2 w-full rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"/>
            <input placeholder="Meeting Description" className="border h-28 p-2 mb-2 w-full rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"/>           
            <button className="mt-8 mb-10 bg-red-600 text-white rounded-md px-4 py-2 hover:bg-red-600 focus:outline-none focus:ring-1 focus:ring-red-500">Book Now</button>
          </div>
        
      </div>
    </div>
  );
};

export default MeetingRoomBookingPage;


