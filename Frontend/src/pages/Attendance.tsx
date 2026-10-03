import React, { useEffect, useMemo, useState } from "react";

import {
  Search,
  Filter,
  Download,
  AlertCircle,
  Clock,
  Calendar,
  CheckCircle2,
  X,
  Loader2,
} from "lucide-react";
import { cn } from "../lib/utils";
import { motion } from "motion/react";
// ======================================================
// API
// ======================================================
const ATTENDANCE_API ="http://localhost:8080/api/attendance";
const DOCTORS_API ="http://localhost:8080/api/doctors";
// ======================================================
// TYPES
// ======================================================
type Doctor = {
  id: number;
  name: string;
  department?: string;
};

type AttendanceRecord = {
  id: number;
  doctorId: number;
  doctorName: string;
  attendanceDate: string;
  loginTime: string;
  logoutTime: string;
  totalHours: number;
  overtime: number;
  status: string;
};


// ======================================================
// COMPONENT
// ======================================================

export default function Attendance() {

  // ====================================================
  // DATA
  // ====================================================

  const [attendance, setAttendance] =
    useState<AttendanceRecord[]>([]);

  const [doctors, setDoctors] =
    useState<Doctor[]>([]);


  // ====================================================
  // SEARCH
  // ====================================================

  const [searchTerm, setSearchTerm] =
    useState("");


  // ====================================================
  // STAFF FILTER
  // ====================================================

  const [selectedStaff, setSelectedStaff] =
    useState("All Staff");


  // ====================================================
  // DATE FILTER
  // ====================================================

  const [selectedDate, setSelectedDate] =
    useState("");


  // ====================================================
  // MODAL
  // ====================================================

  const [showAttendanceModal, setShowAttendanceModal] =
    useState(false);


  // ====================================================
  // FORM
  // ====================================================

  const [selectedDoctorId, setSelectedDoctorId] =
    useState("");

  const [attendanceDate, setAttendanceDate] =
    useState(
      new Date().toISOString().split("T")[0]
    );

  const [loginTime, setLoginTime] =
    useState("08:00");

  const [logoutTime, setLogoutTime] =
    useState("16:00");


  // ====================================================
  // LOADING
  // ====================================================

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);


  // ====================================================
  // LOAD ATTENDANCE
  // ====================================================

  const loadAttendance = async () => {

    try {

      setLoading(true);

      const response =
        await fetch(ATTENDANCE_API);

      if (!response.ok) {

        const message =
          await response.text();

        throw new Error(
          message ||
          "Failed to load attendance"
        );
      }

      const data =
        await response.json();

      setAttendance(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(
        "Attendance loading error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to load attendance"
      );

    } finally {

      setLoading(false);
    }
  };


  // ====================================================
  // LOAD DOCTORS
  // ====================================================

  const loadDoctors = async () => {

    try {

      const response =
        await fetch(DOCTORS_API);

      if (!response.ok) {

        const message =
          await response.text();

        throw new Error(
          message ||
          "Failed to load doctors"
        );
      }

      const data =
        await response.json();


      if (Array.isArray(data)) {

        setDoctors(data);

      } else if (
        Array.isArray(data.doctors)
      ) {

        setDoctors(data.doctors);

      } else {

        setDoctors([]);
      }

    } catch (error) {

      console.error(
        "Doctor loading error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to load doctors"
      );
    }
  };


  // ====================================================
  // INITIAL LOAD
  // ====================================================

  useEffect(() => {

    loadAttendance();

    loadDoctors();

  }, []);


  // ====================================================
  // FILTER ATTENDANCE
  // ====================================================

  const filteredAttendance =
    useMemo(() => {

      return attendance.filter(
        (record) => {

          // SEARCH
          const matchesSearch =
            record.doctorName
              .toLowerCase()
              .includes(
                searchTerm.toLowerCase()
              );


          // STAFF FILTER
          const matchesStaff =
            selectedStaff ===
              "All Staff" ||
            record.doctorName ===
              selectedStaff;


          // DATE FILTER
          const matchesDate =
            selectedDate === "" ||
            record.attendanceDate ===
              selectedDate;


          return (
            matchesSearch &&
            matchesStaff &&
            matchesDate
          );
        }
      );

    }, [
      attendance,
      searchTerm,
      selectedStaff,
      selectedDate,
    ]);


  // ====================================================
  // STATISTICS
  // ====================================================

  const averageHours =
    filteredAttendance.length > 0
      ? filteredAttendance.reduce(
          (total, record) =>
            total + Number(record.totalHours || 0),
          0
        ) / filteredAttendance.length
      : 0;


  const irregularCount =
    filteredAttendance.filter(
      (record) =>
        record.status === "IRREGULAR"
    ).length;


  const normalCount =
    filteredAttendance.filter(
      (record) =>
        record.status === "NORMAL"
    ).length;


  const onTimePercentage =
    filteredAttendance.length > 0
      ? Math.round(
          (normalCount /
            filteredAttendance.length) *
            100
        )
      : 0;


  // ====================================================
  // OPEN MARK ATTENDANCE
  // ====================================================

  const openAttendanceModal = () => {

    setSelectedDoctorId("");

    setAttendanceDate(
      new Date()
        .toISOString()
        .split("T")[0]
    );

    setLoginTime("08:00");

    setLogoutTime("16:00");

    setShowAttendanceModal(true);
  };


  // ====================================================
  // CLOSE MODAL
  // ====================================================

  const closeAttendanceModal = () => {

    if (saving) {
      return;
    }

    setShowAttendanceModal(false);
  };


  // ====================================================
  // MARK ATTENDANCE
  // ====================================================

  const handleMarkAttendance =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();


      // -----------------------------------------------
      // VALIDATION
      // -----------------------------------------------

      if (!selectedDoctorId) {

        alert(
          "Please select a doctor."
        );

        return;
      }


      if (!attendanceDate) {

        alert(
          "Please select attendance date."
        );

        return;
      }


      if (!loginTime) {

        alert(
          "Please enter login time."
        );

        return;
      }


      if (!logoutTime) {

        alert(
          "Please enter logout time."
        );

        return;
      }


      // -----------------------------------------------
      // FIND DOCTOR
      // -----------------------------------------------

      const doctor =
        doctors.find(
          (item) =>
            String(item.id) ===
            String(selectedDoctorId)
        );


      if (!doctor) {

        alert(
          "Doctor not found."
        );

        return;
      }


      try {

        setSaving(true);


        // ---------------------------------------------
        // POST DATA
        // ---------------------------------------------

        const requestData = {

          doctorId:
            Number(selectedDoctorId),

          doctorName:
            doctor.name,

          attendanceDate,

          loginTime,

          logoutTime,

        };


        console.log(
          "Sending attendance:",
          requestData
        );


        // ---------------------------------------------
        // SPRING BOOT
        // ---------------------------------------------

        const response =
          await fetch(
            ATTENDANCE_API,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify(
                  requestData
                ),
            }
          );


        // ---------------------------------------------
        // ERROR
        // ---------------------------------------------

        if (!response.ok) {

          const message =
            await response.text();

          throw new Error(
            message ||
            "Failed to save attendance"
          );
        }


        // ---------------------------------------------
        // SAVED RECORD
        // ---------------------------------------------

        const savedRecord =
          await response.json();


        // ---------------------------------------------
        // UPDATE UI
        // ---------------------------------------------

        setAttendance(
          (previous) => [
            ...previous,
            savedRecord,
          ]
        );


        // ---------------------------------------------
        // CLOSE MODAL
        // ---------------------------------------------

        setShowAttendanceModal(false);


        alert(
          "Attendance marked successfully!"
        );


      } catch (error) {

        console.error(
          "Mark attendance error:",
          error
        );

        alert(
          error instanceof Error
            ? error.message
            : "Failed to save attendance"
        );

      } finally {

        setSaving(false);
      }
    };


  // ====================================================
  // CLEAR FILTERS
  // ====================================================

  const clearFilters = () => {

    setSearchTerm("");

    setSelectedStaff(
      "All Staff"
    );

    setSelectedDate("");
  };


  // ====================================================
  // EXPORT CSV
  // ====================================================

  const exportCSV = () => {

    if (
      filteredAttendance.length === 0
    ) {

      alert(
        "No attendance records to export."
      );

      return;
    }


    const headers = [
      "Doctor Name",
      "Date",
      "Login Time",
      "Logout Time",
      "Total Hours",
      "Overtime",
      "Status",
    ];


    const rows =
      filteredAttendance.map(
        (record) => [

          record.doctorName,

          record.attendanceDate,

          formatTime(
            record.loginTime
          ),

          formatTime(
            record.logoutTime
          ),

          `${record.totalHours}h`,

          record.overtime > 0
            ? `+${record.overtime}h`
            : "-",

          record.status,

        ]
      );


    const csv = [

      headers,

      ...rows,

    ]
      .map(
        (row) =>
          row
            .map(
              (value) =>
                `"${String(value).replace(
                  /"/g,
                  '""'
                )}"`
            )
            .join(",")
      )
      .join("\n");


    const blob =
      new Blob(
        [csv],
        {
          type:
            "text/csv;charset=utf-8;",
        }
      );


    const url =
      URL.createObjectURL(blob);


    const link =
      document.createElement("a");


    link.href = url;

    link.download =
      `attendance-${new Date()
        .toISOString()
        .split("T")[0]}.csv`;


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);


    URL.revokeObjectURL(url);
  };


  // ====================================================
  // UI
  // ====================================================

  return (

    <div className="space-y-8 animate-in fade-in duration-500">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>

          <h1 className="text-3xl font-bold text-slate-900">

            Attendance Tracking

          </h1>

          <p className="text-slate-500 mt-1">

            Monitor daily check-ins, working hours, and overtime.

          </p>

        </div>


        <div className="flex items-center gap-3">


          {/* EXPORT CSV */}

          <button

            onClick={exportCSV}

            className="bg-white text-slate-700 border border-slate-200 px-6 py-3 rounded-2xl font-semibold hover:bg-slate-50 transition-all flex items-center gap-2"
          >

            <Download className="w-5 h-5" />

            Export CSV

          </button>


          {/* MARK ATTENDANCE */}

          <button

            onClick={
              openAttendanceModal
            }

            className="bg-primary text-secondary px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
          >

            Mark Attendance

          </button>

        </div>

      </div>


      {/* =================================================
          STATISTICS
      ================================================= */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">


        {/* ON TIME */}

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">

          <div className="flex items-center gap-3 mb-2">

            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">

              <CheckCircle2 className="w-6 h-6" />

            </div>

            <h3 className="text-slate-500 text-sm font-bold">

              On Time Today

            </h3>

          </div>


          <p className="text-2xl font-bold text-slate-900">

            {onTimePercentage}%

          </p>


          <p className="text-xs text-emerald-600 font-medium mt-1">

            Based on current records

          </p>

        </div>


        {/* AVERAGE HOURS */}

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">

          <div className="flex items-center gap-3 mb-2">

            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">

              <Clock className="w-6 h-6" />

            </div>

            <h3 className="text-slate-500 text-sm font-bold">

              Avg. Working Hours

            </h3>

          </div>


          <p className="text-2xl font-bold text-slate-900">

            {averageHours.toFixed(1)} hrs

          </p>


          <p className="text-xs text-slate-500 font-medium mt-1">

            Target: 8.0 hrs

          </p>

        </div>


        {/* IRREGULARITIES */}

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">

          <div className="flex items-center gap-3 mb-2">

            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">

              <AlertCircle className="w-6 h-6" />

            </div>

            <h3 className="text-slate-500 text-sm font-bold">

              Irregularities

            </h3>

          </div>


          <p className="text-2xl font-bold text-slate-900">

            {String(
              irregularCount
            ).padStart(2, "0")}

          </p>


          <p className="text-xs text-rose-600 font-medium mt-1">

            Requires review

          </p>

        </div>

      </div>


      {/* =================================================
          ATTENDANCE TABLE
      ================================================= */}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">


        {/* =================================================
            SEARCH / FILTER BAR
        ================================================= */}

        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">


          <div className="flex items-center gap-4 flex-wrap">


            {/* SEARCH STAFF */}

            <div className="relative">

              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />

              <input

                type="text"

                value={searchTerm}

                onChange={(e) =>
                  setSearchTerm(
                    e.target.value
                  )
                }

                placeholder="Search staff..."

                className="bg-slate-50 border-none rounded-xl py-2.5 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 outline-none text-sm min-w-[240px]"
              />

            </div>


            {/* DATE FILTER */}

            <div className="relative">

              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />

              <input

                type="date"

                value={selectedDate}

                onChange={(e) =>
                  setSelectedDate(
                    e.target.value
                  )
                }

                className="bg-slate-50 border-none rounded-xl py-2.5 pl-10 pr-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm"
              />

            </div>

          </div>


          <div className="flex items-center gap-3">


            {/* STAFF FILTER */}

            <div className="relative">

              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />

              <select

                value={selectedStaff}

                onChange={(e) =>
                  setSelectedStaff(
                    e.target.value
                  )
                }

                className="appearance-none pl-9 pr-8 py-2.5 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-100 transition-colors outline-none cursor-pointer"
              >

                <option value="All Staff">

                  All Staff

                </option>


                {doctors.map(
                  (doctor) => (

                    <option
                      key={doctor.id}
                      value={doctor.name}
                    >

                      {doctor.name}

                    </option>

                  )
                )}

              </select>

            </div>


            {/* CLEAR FILTER */}

            {(searchTerm ||
              selectedDate ||
              selectedStaff !==
                "All Staff") && (

              <button

                onClick={
                  clearFilters
                }

                className="text-sm font-semibold text-rose-500 hover:bg-rose-50 px-3 py-2 rounded-xl"
              >

                Clear

              </button>

            )}

          </div>

        </div>


        {/* =================================================
            TABLE
        ================================================= */}

        <div className="overflow-x-auto">

          {loading ? (

            <div className="py-16 flex flex-col items-center justify-center">

              <Loader2 className="w-8 h-8 text-primary animate-spin" />

              <p className="text-sm text-slate-400 mt-3">

                Loading attendance...

              </p>

            </div>

          ) : (

            <table className="w-full text-left border-collapse">

              <thead>

                <tr className="bg-slate-50/50">

                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">

                    Doctor Name

                  </th>

                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">

                    Login Time

                  </th>

                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">

                    Logout Time

                  </th>

                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">

                    Total Hours

                  </th>

                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">

                    Overtime

                  </th>

                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">

                    Status

                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-slate-100">


                {filteredAttendance.length ===
                0 ? (

                  <tr>

                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center"
                    >

                      <div className="flex flex-col items-center">

                        <Calendar className="w-10 h-10 text-slate-300" />

                        <p className="text-slate-500 font-semibold mt-3">

                          No attendance records found

                        </p>

                        <p className="text-sm text-slate-400 mt-1">

                          Try changing your search or filters.

                        </p>

                      </div>

                    </td>

                  </tr>

                ) : (

                  filteredAttendance.map(
                    (record, i) => (

                      <motion.tr

                        initial={{
                          opacity: 0,
                          y: 10,
                        }}

                        animate={{
                          opacity: 1,
                          y: 0,
                        }}

                        transition={{
                          delay:
                            i * 0.05,
                        }}

                        key={record.id}

                        className="hover:bg-slate-50/50 transition-colors"
                      >


                        {/* DOCTOR */}

                        <td className="px-6 py-4">

                          <div className="flex items-center gap-2">

                            <span className="text-sm font-bold text-slate-900">

                              {record.doctorName}

                            </span>


                            {record.status ===
                              "IRREGULAR" && (

                              <AlertCircle className="w-4 h-4 text-rose-500" />

                            )}

                          </div>

                        </td>


                        {/* LOGIN */}

                        <td className="px-6 py-4 text-sm text-slate-600">

                          {formatTime(
                            record.loginTime
                          )}

                        </td>


                        {/* LOGOUT */}

                        <td className="px-6 py-4 text-sm text-slate-600">

                          {formatTime(
                            record.logoutTime
                          )}

                        </td>


                        {/* TOTAL */}

                        <td className="px-6 py-4 text-sm font-semibold text-slate-900">

                          {record.totalHours}h

                        </td>


                        {/* OVERTIME */}

                        <td className="px-6 py-4">

                          <span
                            className={cn(
                              "text-sm font-bold",

                              record.overtime >
                                0
                                ? "text-emerald-600"
                                : "text-slate-400"
                            )}
                          >

                            {record.overtime >
                            0
                              ? `+${record.overtime}h`
                              : "-"}

                          </span>

                        </td>


                        {/* STATUS */}

                        <td className="px-6 py-4 text-right">

                          <span
                            className={cn(

                              "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",

                              record.status ===
                                "IRREGULAR"

                                ? "bg-rose-100 text-rose-700"

                                : "bg-emerald-100 text-emerald-700"

                            )}
                          >

                            {record.status ===
                              "IRREGULAR"
                              ? "Irregular"
                              : "Normal"}

                          </span>

                        </td>

                      </motion.tr>

                    )
                  )

                )}

              </tbody>

            </table>

          )}

        </div>

      </div>


      {/* =================================================
          MARK ATTENDANCE MODAL
      ================================================= */}

      {showAttendanceModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">


          <motion.div

            initial={{
              opacity: 0,
              scale: 0.95,
              y: 10,
            }}

            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}

            className="bg-white w-full max-w-md rounded-3xl shadow-2xl"
          >


            {/* MODAL HEADER */}

            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">

              <div>

                <h2 className="text-xl font-bold text-slate-900">

                  Mark Attendance

                </h2>

                <p className="text-sm text-slate-500 mt-1">

                  Save attendance to the database.

                </p>

              </div>


              <button

                onClick={
                  closeAttendanceModal
                }

                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
              >

                <X className="w-5 h-5 text-slate-600" />

              </button>

            </div>


            {/* FORM */}

            <form

              onSubmit={
                handleMarkAttendance
              }

              className="p-6 space-y-5"
            >


              {/* DOCTOR */}

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">

                  Doctor

                </label>


                <select

                  value={
                    selectedDoctorId
                  }

                  onChange={(e) =>
                    setSelectedDoctorId(
                      e.target.value
                    )
                  }

                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-primary/20"
                >

                  <option value="">

                    Select Doctor

                  </option>


                  {doctors.map(
                    (doctor) => (

                      <option
                        key={doctor.id}
                        value={
                          doctor.id
                        }
                      >

                        {doctor.name}

                        {doctor.department
                          ? ` - ${doctor.department}`
                          : ""}

                      </option>

                    )
                  )}

                </select>

              </div>


              {/* DATE */}

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">

                  Attendance Date

                </label>


                <input

                  type="date"

                  value={
                    attendanceDate
                  }

                  onChange={(e) =>
                    setAttendanceDate(
                      e.target.value
                    )
                  }

                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary/20"
                />

              </div>


              {/* LOGIN */}

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">

                  Login Time

                </label>


                <input

                  type="time"

                  value={loginTime}

                  onChange={(e) =>
                    setLoginTime(
                      e.target.value
                    )
                  }

                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary/20"
                />

              </div>


              {/* LOGOUT */}

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">

                  Logout Time

                </label>


                <input

                  type="time"

                  value={logoutTime}

                  onChange={(e) =>
                    setLogoutTime(
                      e.target.value
                    )
                  }

                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary/20"
                />

              </div>


              {/* BUTTONS */}

              <div className="flex gap-3 pt-2">


                <button

                  type="button"

                  onClick={
                    closeAttendanceModal
                  }

                  disabled={saving}

                  className="flex-1 px-5 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
                >

                  Cancel

                </button>


                <button

                  type="submit"

                  disabled={saving}

                  className="flex-1 px-5 py-3 rounded-xl bg-primary text-secondary font-semibold hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50"
                >

                  {saving ? (

                    <>

                      <Loader2 className="w-4 h-4 animate-spin" />

                      Saving...

                    </>

                  ) : (

                    "Save Attendance"

                  )}

                </button>

              </div>

            </form>

          </motion.div>

        </div>

      )}

    </div>
  );
}


// ======================================================
// FORMAT TIME
// ======================================================

function formatTime(
  time: string
) {

  if (!time) {
    return "-";
  }


  const parts =
    time.split(":");


  const hour =
    Number(parts[0]);


  const minute =
    parts[1];


  const suffix =
    hour >= 12
      ? "PM"
      : "AM";


  const displayHour =
    hour % 12 || 12;


  return `${String(displayHour).padStart(
    2,
    "0"
  )}:${minute} ${suffix}`;
}