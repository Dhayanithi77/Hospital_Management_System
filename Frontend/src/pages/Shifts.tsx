import React, { useEffect, useState,} from "react";

import { Calendar, ChevronLeft, ChevronRight, Sparkles, AlertTriangle, Clock, User, Plus, X, Trash2,} from "lucide-react";
import { cn } from "../lib/utils";
import { motion } from "motion/react";
// ============================================================
// API
// ============================================================
const DOCTORS_API = "http://localhost:8080/api/doctors";

const SHIFTS_API = "http://localhost:8080/api/shifts";
// ============================================================
// TYPES
// ============================================================
type ShiftType = "Day" | "Night";
type Doctor = {
  id: number;
  name: string;
  email?: string;
  department?: string;
  status?: string;
  shift?: string;
  avatar?: string | null;
};
type Shift = {
  id: number;
  doctorId: number;
  doctorName: string;
  day: string;
  type: ShiftType;
  startTime: string;
  endTime: string;
};

// ============================================================
// DAYS
// ============================================================
const days = [ "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun",];
// ============================================================
// TIME OPTIONS
// ============================================================
const timeOptions = [ "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00", "00:00", "01:00", "02:00", "03:00", "04:00", "05:00",];
// ============================================================
// COMPONENT
// ============================================================
export default function Shifts() {
  // ==========================================================
  // BASIC STATE
  // ==========================================================
  const [view, setView] = useState<"weekly" | "monthly">( "weekly");
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [showShiftModal, setShowShiftModal] = useState(false);
  // ==========================================================
  // DOCTORS FROM BACKEND
  // ==========================================================
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const [loadingDoctors, setLoadingDoctors] = useState(false);
  // ==========================================================
  // SHIFTS FROM BACKEND
  // ==========================================================
  const [shifts, setShifts] = useState<Shift[]>([]);

  const [loadingShifts, setLoadingShifts] = useState(false);

  const [saving, setSaving] = useState(false);
  // ==========================================================
  // FORM STATE
  // ==========================================================
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDay, setSelectedDay] = useState("Mon");
  const [selectedShiftType, setSelectedShiftType] = useState<ShiftType>("Day");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("16:00");
  // ==========================================================
  // LOAD DOCTORS
  // ==========================================================
  const loadDoctors = async () => {
    try {
      setLoadingDoctors(true);
      const response = await fetch(DOCTORS_API);
      if (!response.ok) {
        const message = await response.text();
        throw new Error( message || "Failed to load doctors" );
      }
      const data = await response.json();
      console.log( "Doctors:", data);
      setDoctors(data);
    } catch (error) {
      console.error( "Doctor loading error:", error);
      alert( error instanceof Error ? error.message : "Failed to load doctors" );
    } finally {
      setLoadingDoctors(false);
    }
  };
  // ==========================================================
  // LOAD SHIFTS
  // ==========================================================
  const loadShifts = async () => {
    try {
      setLoadingShifts(true);
      const response = await fetch(SHIFTS_API);
      if (!response.ok) {
        const message = await response.text();
        throw new Error( message || "Failed to load shifts");
      }
      const data = await response.json();
      console.log( "Shifts:", data);
      setShifts(data);
    } catch (error) {
      console.error( "Shift loading error:", error);
      alert( error instanceof Error ? error.message : "Failed to load shifts");

    } finally {
      setLoadingShifts(false);
    }
  };
  // ==========================================================
  // LOAD DATA WHEN PAGE OPENS
  // ==========================================================

  useEffect(() => {

    loadDoctors();

    loadShifts();

  }, []);


  // ==========================================================
  // AI SUGGEST
  // ==========================================================

  const handleAISuggest = () => {

    setIsSuggesting(true);

    setTimeout(() => {

      setIsSuggesting(false);

      alert(
        "AI suggestion completed. Please review the schedule."
      );

    }, 1500);
  };


  // ==========================================================
  // OPEN ASSIGN SHIFT MODAL
  // ==========================================================

  const handleOpenShiftModal = () => {

    if (doctors.length === 0) {

      alert(
        "No doctors are available. Please add doctors first."
      );

      return;
    }


    setSelectedDoctor(
      String(doctors[0].id)
    );

    setSelectedDay("Mon");

    setSelectedShiftType("Day");

    setStartTime("08:00");

    setEndTime("16:00");

    setShowShiftModal(true);
  };


  // ==========================================================
  // CLOSE MODAL
  // ==========================================================

  const handleCloseShiftModal = () => {

    if (saving) {
      return;
    }

    setShowShiftModal(false);
  };


  // ==========================================================
  // ASSIGN SHIFT
  // ==========================================================

  const handleAssignShift = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();


    // --------------------------------------------------------
    // VALIDATE DOCTOR
    // --------------------------------------------------------

    if (!selectedDoctor) {

      alert(
        "Please select a doctor."
      );

      return;
    }


    // --------------------------------------------------------
    // VALIDATE DAY
    // --------------------------------------------------------

    if (!selectedDay) {

      alert(
        "Please select a day."
      );

      return;
    }


    // --------------------------------------------------------
    // VALIDATE TIME
    // --------------------------------------------------------

    // Only validate normal order for Day.
    // Night can be 20:00 -> 08:00.

    if (
      selectedShiftType === "Day" &&
      startTime >= endTime
    ) {

      alert(
        "For a Day shift, end time must be after start time."
      );

      return;
    }


    // --------------------------------------------------------
    // FIND DOCTOR
    // --------------------------------------------------------

    const doctor =
      doctors.find(
        (item) =>
          String(item.id) ===
          String(selectedDoctor)
      );


    if (!doctor) {

      alert(
        "Doctor not found."
      );

      return;
    }


    // --------------------------------------------------------
    // FRONTEND DUPLICATE CHECK
    // --------------------------------------------------------

    const alreadyAssigned =
      shifts.some(
        (shift) =>
          String(shift.doctorId) ===
            String(doctor.id) &&
          shift.day === selectedDay &&
          shift.type === selectedShiftType
      );


    if (alreadyAssigned) {

      alert(
        `${doctor.name} already has a ${selectedShiftType} shift on ${selectedDay}.`
      );

      return;
    }


    // --------------------------------------------------------
    // SEND TO SPRING BOOT
    // --------------------------------------------------------

    try {

      setSaving(true);

      const response =
        await fetch(
          SHIFTS_API,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              doctorId:
                Number(doctor.id),

              day:
                selectedDay,

              type:
                selectedShiftType,

              startTime:
                startTime,

              endTime:
                endTime,

            }),
          }
        );


      // ------------------------------------------------------
      // BACKEND ERROR
      // ------------------------------------------------------

      if (!response.ok) {

        const message =
          await response.text();

        throw new Error(
          message ||
            "Failed to assign shift"
        );
      }


      // ------------------------------------------------------
      // GET SAVED SHIFT
      // ------------------------------------------------------

      const savedShift =
        await response.json();

      console.log(
        "Shift saved:",
        savedShift
      );


      // ------------------------------------------------------
      // RELOAD SHIFTS FROM DATABASE
      // ------------------------------------------------------

      await loadShifts();


      // ------------------------------------------------------
      // CLOSE MODAL
      // ------------------------------------------------------

      setShowShiftModal(false);


      alert(
        `${doctor.name} assigned to ${selectedDay} ${selectedShiftType} shift.`
      );

    } catch (error) {

      console.error(
        "Assign shift error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to assign shift"
      );

    } finally {

      setSaving(false);
    }
  };


  // ==========================================================
  // DELETE SHIFT
  // ==========================================================

  const handleDeleteShift = async (
    shiftId: number
  ) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to remove this shift?"
      );


    if (!confirmed) {
      return;
    }


    try {

      const response =
        await fetch(
          `${SHIFTS_API}/${shiftId}`,
          {
            method: "DELETE",
          }
        );


      if (!response.ok) {

        const message =
          await response.text();

        throw new Error(
          message ||
            "Failed to delete shift"
        );
      }


      // Reload from backend

      await loadShifts();


      alert(
        "Shift deleted successfully."
      );

    } catch (error) {

      console.error(
        "Delete shift error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete shift"
      );
    }
  };


  // ==========================================================
  // GET SHIFTS FOR DAY
  // ==========================================================

  const getShiftsForDay = (
    day: string,
    type: ShiftType
  ) => {

    return shifts.filter(
      (shift) =>
        shift.day === day &&
        shift.type === type
    );
  };


  // ==========================================================
  // OPEN MODAL FOR SPECIFIC CELL
  // ==========================================================

  const openCellModal = (
    day: string,
    type: ShiftType
  ) => {

    if (doctors.length === 0) {

      alert(
        "Please add doctors first."
      );

      return;
    }


    setSelectedDay(day);

    setSelectedShiftType(type);


    if (type === "Day") {

      setStartTime("08:00");

      setEndTime("16:00");

    } else {

      setStartTime("20:00");

      setEndTime("08:00");
    }


    setSelectedDoctor(
      String(doctors[0].id)
    );


    setShowShiftModal(true);
  };


  // ==========================================================
  // UI
  // ==========================================================

  return (

    <div className="
      space-y-8
      animate-in
      fade-in
      duration-500
    ">


      {/* ====================================================
          HEADER
          ==================================================== */}

      <div className="
        flex
        flex-col
        sm:flex-row
        sm:items-center
        justify-between
        gap-4
      ">

        <div>

          <h1 className="
            text-3xl
            font-bold
            text-slate-900
          ">
            Shift Scheduling
          </h1>

          <p className="
            text-slate-500
            mt-1
          ">
            Plan and manage medical staff rotations.
          </p>

        </div>


        <div className="
          flex
          items-center
          gap-3
          flex-wrap
        ">


          {/* AI SUGGEST */}

          <button
            type="button"
            onClick={
              handleAISuggest
            }
            className="
              bg-secondary
              text-white
              px-6
              py-3
              rounded-2xl
              font-semibold
              shadow-lg
              hover:bg-slate-800
              transition-all
              flex
              items-center
              gap-2
            "
          >

            <Sparkles
              className={cn(
                "w-5 h-5 text-primary",
                isSuggesting &&
                  "animate-pulse"
              )}
            />

            {isSuggesting
              ? "Optimizing..."
              : "AI Suggest"}

          </button>


          {/* ASSIGN SHIFT */}

          <button
            type="button"
            onClick={
              handleOpenShiftModal
            }
            className="
              bg-primary
              text-secondary
              px-6
              py-3
              rounded-2xl
              font-semibold
              shadow-lg
              shadow-primary/20
              hover:scale-105
              transition-transform
              flex
              items-center
              gap-2
            "
          >

            <Plus className="w-5 h-5" />

            Assign Shift

          </button>

        </div>

      </div>


      {/* ====================================================
          INFO
          ==================================================== */}

      <div className="
        bg-rose-50
        border
        border-rose-100
        p-4
        rounded-2xl
        flex
        items-center
        gap-3
        text-rose-700
      ">

        <AlertTriangle
          className="
            w-5
            h-5
            flex-shrink-0
          "
        />

        <p className="
          text-sm
          font-medium
        ">
          Assign doctors to Day and Night shifts using the
          <strong> Assign Shift </strong>
          button.
        </p>

      </div>


      {/* ====================================================
          CALENDAR
          ==================================================== */}

      <div className="
        bg-white
        rounded-2xl
        shadow-sm
        border
        border-slate-100
        overflow-hidden
      ">


        {/* ==================================================
            CALENDAR HEADER
            ================================================== */}

        <div className="
          p-6
          border-b
          border-slate-100
          flex
          flex-col
          lg:flex-row
          lg:items-center
          justify-between
          gap-4
        ">

          <div className="
            flex
            items-center
            gap-4
            flex-wrap
          ">


            {/* WEEK / MONTH */}

            <div className="
              flex
              bg-slate-100
              p-1
              rounded-xl
            ">

              <button
                type="button"
                onClick={() =>
                  setView("weekly")
                }
                className={cn(
                  `
                    px-4
                    py-2
                    rounded-lg
                    text-sm
                    font-semibold
                  `,
                  view === "weekly"
                    ? `
                      bg-white
                      text-secondary
                      shadow-sm
                    `
                    : `
                      text-slate-500
                      hover:text-slate-700
                    `
                )}
              >
                Weekly
              </button>


              <button
                type="button"
                onClick={() =>
                  setView("monthly")
                }
                className={cn(
                  `
                    px-4
                    py-2
                    rounded-lg
                    text-sm
                    font-semibold
                  `,
                  view === "monthly"
                    ? `
                      bg-white
                      text-secondary
                      shadow-sm
                    `
                    : `
                      text-slate-500
                      hover:text-slate-700
                    `
                )}
              >
                Monthly
              </button>

            </div>


            {/* DATE */}

            <div className="
              flex
              items-center
              gap-2
            ">

              <button
                type="button"
                className="
                  p-2
                  hover:bg-slate-100
                  rounded-lg
                "
              >

                <ChevronLeft
                  className="
                    w-5
                    h-5
                    text-slate-600
                  "
                />

              </button>


              <span className="
                text-sm
                font-bold
                text-slate-900
              ">
                Oct 12 - Oct 18, 2023
              </span>


              <button
                type="button"
                className="
                  p-2
                  hover:bg-slate-100
                  rounded-lg
                "
              >

                <ChevronRight
                  className="
                    w-5
                    h-5
                    text-slate-600
                  "
                />

              </button>

            </div>

          </div>


          {/* TODAY */}

          <button
            type="button"
            className="
              flex
              items-center
              gap-2
              text-sm
              font-semibold
              text-slate-600
              hover:text-primary
            "
          >

            <Calendar className="w-5 h-5" />

            Today

          </button>

        </div>


        {/* ==================================================
            LOADING
            ================================================== */}

        {loadingShifts ? (

          <div className="
            py-16
            text-center
            text-slate-500
            text-sm
          ">

            Loading shift schedule...

          </div>

        ) : (

          /* ==================================================
             CALENDAR CONTENT
             ================================================== */

          <div className="
            overflow-x-auto
          ">

            <div className="
              min-w-[1000px]
            ">


              {/* =================================================
                  DAYS HEADER
                  ================================================= */}

              <div className="
                grid
                grid-cols-8
                border-b
                border-slate-100
              ">

                <div className="
                  p-4
                  bg-slate-50/50
                  font-bold
                  text-xs
                  text-slate-500
                ">
                  SHIFT
                </div>


                {days.map(
                  (day) => (

                    <div
                      key={day}
                      className="
                        p-4
                        text-center
                        font-bold
                        text-slate-500
                        text-xs
                        uppercase
                        tracking-wider
                        bg-slate-50/50
                        border-l
                        border-slate-100
                      "
                    >

                      {day}

                    </div>

                  )
                )}

              </div>


              {/* =================================================
                  DAY SHIFT
                  ================================================= */}

              <div className="
                grid
                grid-cols-8
                border-b
                border-slate-100
                min-h-[180px]
              ">


                {/* LABEL */}

                <div className="
                  p-4
                  bg-emerald-50
                  text-emerald-700
                  font-bold
                  text-sm
                  flex
                  flex-col
                  justify-center
                  items-center
                ">

                  <span>
                    DAY
                  </span>

                  <span className="
                    text-xs
                    font-medium
                    mt-1
                  ">
                    08:00 - 20:00
                  </span>

                </div>


                {/* EACH DAY */}

                {days.map(
                  (day) => {

                    const dayShifts =
                      getShiftsForDay(
                        day,
                        "Day"
                      );


                    return (

                      <div
                        key={day}
                        className="
                          p-2
                          border-l
                          border-slate-50
                          relative
                          bg-emerald-50/20
                          min-h-[180px]
                        "
                      >

                        <div className="
                          space-y-2
                        ">

                          {dayShifts.map(
                            (shift) => (

                              <motion.div
                                key={
                                  shift.id
                                }
                                initial={{
                                  opacity: 0,
                                  scale: 0.9,
                                }}
                                animate={{
                                  opacity: 1,
                                  scale: 1,
                                }}
                                className="
                                  bg-emerald-100
                                  border
                                  border-emerald-200
                                  p-3
                                  rounded-xl
                                  group
                                "
                              >

                                <div className="
                                  flex
                                  items-center
                                  justify-between
                                  gap-2
                                ">

                                  <div className="
                                    flex
                                    items-center
                                    gap-2
                                    min-w-0
                                  ">

                                    <div className="
                                      w-7
                                      h-7
                                      rounded-full
                                      bg-emerald-200
                                      flex
                                      items-center
                                      justify-center
                                      flex-shrink-0
                                    ">

                                      <User
                                        className="
                                          w-4
                                          h-4
                                          text-emerald-700
                                        "
                                      />

                                    </div>


                                    <span className="
                                      text-xs
                                      font-bold
                                      text-emerald-800
                                      truncate
                                    ">
                                      {
                                        shift.doctorName
                                      }
                                    </span>

                                  </div>


                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDeleteShift(
                                        shift.id
                                      )
                                    }
                                    className="
                                      opacity-0
                                      group-hover:opacity-100
                                      text-rose-500
                                      hover:bg-white
                                      p-1
                                      rounded
                                    "
                                  >

                                    <Trash2
                                      className="
                                        w-3.5
                                        h-3.5
                                      "
                                    />

                                  </button>

                                </div>


                                <div className="
                                  flex
                                  items-center
                                  gap-1
                                  text-[10px]
                                  text-emerald-700
                                  mt-2
                                ">

                                  <Clock
                                    className="
                                      w-3
                                      h-3
                                    "
                                  />

                                  {shift.startTime}

                                  {" - "}

                                  {shift.endTime}

                                </div>

                              </motion.div>

                            )
                          )}

                        </div>


                        {/* PLUS */}

                        <button
                          type="button"
                          onClick={() =>
                            openCellModal(
                              day,
                              "Day"
                            )
                          }
                          className="
                            absolute
                            bottom-2
                            right-2
                            p-1.5
                            rounded-lg
                            bg-white
                            border
                            border-emerald-200
                            text-emerald-600
                            hover:bg-emerald-50
                          "
                        >

                          <Plus
                            className="
                              w-4
                              h-4
                            "
                          />

                        </button>

                      </div>

                    );
                  }
                )}

              </div>


              {/* =================================================
                  NIGHT SHIFT
                  ================================================= */}

              <div className="
                grid
                grid-cols-8
                min-h-[180px]
              ">


                {/* LABEL */}

                <div className="
                  p-4
                  bg-indigo-50
                  text-indigo-700
                  font-bold
                  text-sm
                  flex
                  flex-col
                  justify-center
                  items-center
                ">

                  <span>
                    NIGHT
                  </span>

                  <span className="
                    text-xs
                    font-medium
                    mt-1
                  ">
                    20:00 - 08:00
                  </span>

                </div>


                {/* EACH DAY */}

                {days.map(
                  (day) => {

                    const nightShifts =
                      getShiftsForDay(
                        day,
                        "Night"
                      );


                    return (

                      <div
                        key={day}
                        className="
                          p-2
                          border-l
                          border-slate-50
                          relative
                          bg-indigo-50/20
                          min-h-[180px]
                        "
                      >

                        <div className="
                          space-y-2
                        ">

                          {nightShifts.map(
                            (shift) => (

                              <motion.div
                                key={
                                  shift.id
                                }
                                initial={{
                                  opacity: 0,
                                  scale: 0.9,
                                }}
                                animate={{
                                  opacity: 1,
                                  scale: 1,
                                }}
                                className="
                                  bg-indigo-100
                                  border
                                  border-indigo-200
                                  p-3
                                  rounded-xl
                                  group
                                "
                              >

                                <div className="
                                  flex
                                  items-center
                                  justify-between
                                  gap-2
                                ">

                                  <div className="
                                    flex
                                    items-center
                                    gap-2
                                    min-w-0
                                  ">

                                    <div className="
                                      w-7
                                      h-7
                                      rounded-full
                                      bg-indigo-200
                                      flex
                                      items-center
                                      justify-center
                                      flex-shrink-0
                                    ">

                                      <User
                                        className="
                                          w-4
                                          h-4
                                          text-indigo-700
                                        "
                                      />

                                    </div>


                                    <span className="
                                      text-xs
                                      font-bold
                                      text-indigo-800
                                      truncate
                                    ">
                                      {
                                        shift.doctorName
                                      }
                                    </span>

                                  </div>


                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDeleteShift(
                                        shift.id
                                      )
                                    }
                                    className="
                                      opacity-0
                                      group-hover:opacity-100
                                      text-rose-500
                                      hover:bg-white
                                      p-1
                                      rounded
                                    "
                                  >

                                    <Trash2
                                      className="
                                        w-3.5
                                        h-3.5
                                      "
                                    />

                                  </button>

                                </div>


                                <div className="
                                  flex
                                  items-center
                                  gap-1
                                  text-[10px]
                                  text-indigo-700
                                  mt-2
                                ">

                                  <Clock
                                    className="
                                      w-3
                                      h-3
                                    "
                                  />

                                  {shift.startTime}

                                  {" - "}

                                  {shift.endTime}

                                </div>

                              </motion.div>

                            )
                          )}

                        </div>


                        {/* PLUS */}

                        <button
                          type="button"
                          onClick={() =>
                            openCellModal(
                              day,
                              "Night"
                            )
                          }
                          className="
                            absolute
                            bottom-2
                            right-2
                            p-1.5
                            rounded-lg
                            bg-white
                            border
                            border-indigo-200
                            text-indigo-600
                            hover:bg-indigo-50
                          "
                        >

                          <Plus
                            className="
                              w-4
                              h-4
                            "
                          />

                        </button>

                      </div>

                    );
                  }
                )}

              </div>

            </div>

          </div>

        )}

      </div>


      {/* ====================================================
          ASSIGN SHIFT MODAL
          ==================================================== */}

      {showShiftModal && (

        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-slate-900/50
            p-4
          "
          onClick={
            handleCloseShiftModal
          }
        >

          <div
            className="
              w-full
              max-w-lg
              bg-white
              rounded-2xl
              shadow-2xl
              overflow-hidden
            "
            onClick={(e) =>
              e.stopPropagation()
            }
          >


            {/* MODAL HEADER */}

            <div className="
              p-6
              border-b
              border-slate-100
              flex
              items-center
              justify-between
            ">

              <div>

                <h2 className="
                  text-xl
                  font-bold
                  text-slate-900
                ">
                  Assign Shift
                </h2>

                <p className="
                  text-sm
                  text-slate-500
                  mt-1
                ">
                  Assign a doctor to a day or night shift.
                </p>

              </div>


              <button
                type="button"
                onClick={
                  handleCloseShiftModal
                }
                className="
                  p-2
                  rounded-xl
                  hover:bg-slate-100
                  text-slate-500
                "
              >

                <X
                  className="
                    w-5
                    h-5
                  "
                />

              </button>

            </div>


            {/* FORM */}

            <form
              onSubmit={
                handleAssignShift
              }
              className="
                p-6
                space-y-5
              "
            >


              {/* DOCTOR */}

              <div>

                <label className="
                  block
                  text-xs
                  font-bold
                  text-slate-500
                  uppercase
                  mb-2
                ">
                  Doctor
                </label>


                <select
                  value={
                    selectedDoctor
                  }
                  onChange={(e) =>
                    setSelectedDoctor(
                      e.target.value
                    )
                  }
                  disabled={
                    loadingDoctors ||
                    doctors.length === 0
                  }
                  className="
                    w-full
                    bg-slate-50
                    border
                    border-slate-100
                    rounded-xl
                    px-4
                    py-3
                    text-sm
                    outline-none
                  "
                >

                  {doctors.length === 0 ? (

                    <option>
                      No doctors available
                    </option>

                  ) : (

                    doctors.map(
                      (doctor) => (

                        <option
                          key={doctor.id}
                          value={String(
                            doctor.id
                          )}
                        >

                          {doctor.name}

                          {doctor.department
                            ? ` - ${doctor.department}`
                            : ""}

                        </option>

                      )
                    )

                  )}

                </select>

              </div>


              {/* DAY */}

              <div>

                <label className="
                  block
                  text-xs
                  font-bold
                  text-slate-500
                  uppercase
                  mb-2
                ">
                  Day
                </label>


                <select
                  value={
                    selectedDay
                  }
                  onChange={(e) =>
                    setSelectedDay(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    bg-slate-50
                    border
                    border-slate-100
                    rounded-xl
                    px-4
                    py-3
                    text-sm
                    outline-none
                  "
                >

                  {days.map(
                    (day) => (

                      <option
                        key={day}
                        value={day}
                      >
                        {day}
                      </option>

                    )
                  )}

                </select>

              </div>


              {/* DAY / NIGHT */}

              <div>

                <label className="
                  block
                  text-xs
                  font-bold
                  text-slate-500
                  uppercase
                  mb-2
                ">
                  Shift Type
                </label>


                <div className="
                  grid
                  grid-cols-2
                  gap-3
                ">


                  {/* DAY */}

                  <button
                    type="button"
                    onClick={() => {

                      setSelectedShiftType(
                        "Day"
                      );

                      setStartTime(
                        "08:00"
                      );

                      setEndTime(
                        "16:00"
                      );

                    }}
                    className={cn(
                      `
                        py-3
                        rounded-xl
                        font-semibold
                        text-sm
                        border
                      `,
                      selectedShiftType ===
                        "Day"
                        ? `
                          bg-emerald-100
                          text-emerald-700
                          border-emerald-300
                        `
                        : `
                          bg-slate-50
                          text-slate-500
                          border-slate-100
                        `
                    )}
                  >
                    ☀️ Day
                  </button>


                  {/* NIGHT */}

                  <button
                    type="button"
                    onClick={() => {

                      setSelectedShiftType(
                        "Night"
                      );

                      setStartTime(
                        "20:00"
                      );

                      setEndTime(
                        "08:00"
                      );

                    }}
                    className={cn(
                      `
                        py-3
                        rounded-xl
                        font-semibold
                        text-sm
                        border
                      `,
                      selectedShiftType ===
                        "Night"
                        ? `
                          bg-indigo-100
                          text-indigo-700
                          border-indigo-300
                        `
                        : `
                          bg-slate-50
                          text-slate-500
                          border-slate-100
                        `
                    )}
                  >
                    🌙 Night
                  </button>

                </div>

              </div>


              {/* TIME */}

              <div className="
                grid
                grid-cols-2
                gap-4
              ">


                {/* START */}

                <div>

                  <label className="
                    block
                    text-xs
                    font-bold
                    text-slate-500
                    uppercase
                    mb-2
                  ">
                    Start Time
                  </label>


                  <select
                    value={
                      startTime
                    }
                    onChange={(e) =>
                      setStartTime(
                        e.target.value
                      )
                    }
                    className="
                      w-full
                      bg-slate-50
                      border
                      border-slate-100
                      rounded-xl
                      px-4
                      py-3
                      text-sm
                      outline-none
                    "
                  >

                    {timeOptions.map(
                      (time) => (

                        <option
                          key={time}
                          value={time}
                        >
                          {time}
                        </option>

                      )
                    )}

                  </select>

                </div>


                {/* END */}

                <div>

                  <label className="
                    block
                    text-xs
                    font-bold
                    text-slate-500
                    uppercase
                    mb-2
                  ">
                    End Time
                  </label>


                  <select
                    value={
                      endTime
                    }
                    onChange={(e) =>
                      setEndTime(
                        e.target.value
                      )
                    }
                    className="
                      w-full
                      bg-slate-50
                      border
                      border-slate-100
                      rounded-xl
                      px-4
                      py-3
                      text-sm
                      outline-none
                    "
                  >

                    {timeOptions.map(
                      (time) => (

                        <option
                          key={time}
                          value={time}
                        >
                          {time}
                        </option>

                      )
                    )}

                  </select>

                </div>

              </div>


              {/* BUTTONS */}

              <div className="
                flex
                justify-end
                gap-3
                pt-2
              ">

                <button
                  type="button"
                  onClick={
                    handleCloseShiftModal
                  }
                  disabled={saving}
                  className="
                    px-5
                    py-3
                    rounded-xl
                    bg-slate-100
                    text-slate-600
                    font-semibold
                    text-sm
                    hover:bg-slate-200
                  "
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  disabled={
                    saving ||
                    doctors.length === 0
                  }
                  className="
                    px-5
                    py-3
                    rounded-xl
                    bg-primary
                    text-secondary
                    font-semibold
                    text-sm
                    hover:opacity-90
                    disabled:opacity-50
                    flex
                    items-center
                    gap-2
                  "
                >

                  <Plus
                    className="
                      w-4
                      h-4
                    "
                  />

                  {saving
                    ? "Saving..."
                    : "Assign Shift"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}