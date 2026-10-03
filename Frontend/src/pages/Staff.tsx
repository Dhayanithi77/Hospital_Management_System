import React, { useEffect, useState } from "react";

import {
  Users,
  UserPlus,
  MoreHorizontal,
  CheckCircle2,
  X,
  Trash2,
  Loader2,
} from "lucide-react";

import { motion } from "motion/react";


// ======================================================
// API URLS
// ======================================================

const STAFF_API = "http://localhost:8080/api/staff";
const DOCTORS_API = "http://localhost:8080/api/doctors";


// ======================================================
// TYPES
// ======================================================

type Doctor = {
  id: number;
  name: string;
  department?: string;
};

type StaffMember = {
  id: number;
  name: string;
  role: string;
  department: string;
  assignedTo?: number | null;
  tasks: string[];
};


// ======================================================
// COMPONENT
// ======================================================

export default function Staff() {

  // ====================================================
  // STAFF STATE
  // ====================================================

  const [staff, setStaff] = useState<StaffMember[]>([]);

  const [doctors, setDoctors] = useState<Doctor[]>([]);


  // ====================================================
  // LOADING STATES
  // ====================================================

  const [loadingStaff, setLoadingStaff] = useState(true);

  const [loadingDoctors, setLoadingDoctors] = useState(true);

  const [savingStaff, setSavingStaff] = useState(false);


  // ====================================================
  // ERROR
  // ====================================================

  const [error, setError] = useState("");


  // ====================================================
  // MODAL
  // ====================================================

  const [showModal, setShowModal] = useState(false);


  // ====================================================
  // FORM STATES
  // ====================================================

  const [name, setName] = useState("");

  const [role, setRole] = useState("");

  const [department, setDepartment] = useState("Cardiology");

  const [assignedDoctor, setAssignedDoctor] = useState("");

  const [tasks, setTasks] = useState("");


  // ====================================================
  // DEPARTMENTS
  // ====================================================

  const departments = [
    "Cardiology",
    "Neurology",
    "General",
  ];


  // ====================================================
  // LOAD STAFF FROM SPRING BOOT
  // ====================================================

  const loadStaff = async () => {

    try {

      setLoadingStaff(true);

      setError("");

      const response = await fetch(STAFF_API);

      if (!response.ok) {

        const message = await response.text();

        throw new Error(
          message || "Failed to load staff"
        );
      }

      const data = await response.json();

      setStaff(data);

    } catch (error) {

      console.error("Staff loading error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load staff"
      );

    } finally {

      setLoadingStaff(false);
    }
  };


  // ====================================================
  // LOAD DOCTORS FROM SPRING BOOT
  // ====================================================

  const loadDoctors = async () => {

    try {

      setLoadingDoctors(true);

      const response = await fetch(DOCTORS_API);

      if (!response.ok) {

        const message = await response.text();

        throw new Error(
          message || "Failed to load doctors"
        );
      }

      const data = await response.json();

      // Handles both:
      // [ doctor1, doctor2 ]
      //
      // and:
      // { doctors: [ doctor1, doctor2 ] }

      if (Array.isArray(data)) {

        setDoctors(data);

      } else if (Array.isArray(data.doctors)) {

        setDoctors(data.doctors);

      } else {

        setDoctors([]);
      }

    } catch (error) {

      console.error("Doctor loading error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load doctors"
      );

    } finally {

      setLoadingDoctors(false);
    }
  };


  // ====================================================
  // LOAD DATA WHEN PAGE OPENS
  // ====================================================

  useEffect(() => {

    loadStaff();

    loadDoctors();

  }, []);


  // ====================================================
  // OPEN ADD STAFF MODAL
  // ====================================================

  const openAddStaffModal = (
    selectedDepartment?: string
  ) => {

    setName("");

    setRole("");

    setDepartment(
      selectedDepartment || "Cardiology"
    );

    setAssignedDoctor("");

    setTasks("");

    setShowModal(true);
  };


  // ====================================================
  // CLOSE MODAL
  // ====================================================

  const closeModal = () => {

    if (savingStaff) {
      return;
    }

    setShowModal(false);
  };


  // ====================================================
  // ADD STAFF
  // ====================================================

  const handleAddStaff = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();


    // ----------------------------------------------
    // VALIDATION
    // ----------------------------------------------

    if (!name.trim()) {

      alert("Please enter staff name.");

      return;
    }


    if (!role.trim()) {

      alert("Please select staff role.");

      return;
    }


    if (!department) {

      alert("Please select department.");

      return;
    }


    // ----------------------------------------------
    // TASK ARRAY
    // ----------------------------------------------

    const taskList = tasks
      .split(",")
      .map((task) => task.trim())
      .filter((task) => task.length > 0);


    // ----------------------------------------------
    // REQUEST BODY
    // ----------------------------------------------

    const staffData = {

      name: name.trim(),

      role: role.trim(),

      department: department,

      assignedTo: assignedDoctor
        ? Number(assignedDoctor)
        : null,

      tasks: taskList,
    };


    try {

      setSavingStaff(true);

      // --------------------------------------------
      // POST TO SPRING BOOT
      // --------------------------------------------

      const response = await fetch(
        STAFF_API,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(staffData),
        }
      );


      // --------------------------------------------
      // ERROR
      // --------------------------------------------

      if (!response.ok) {

        const message = await response.text();

        throw new Error(
          message || "Failed to add staff"
        );
      }


      // --------------------------------------------
      // GET SAVED STAFF FROM BACKEND
      // --------------------------------------------

      const savedStaff =
        await response.json();


      // --------------------------------------------
      // ADD TO UI
      // --------------------------------------------

      setStaff((prev) => [
        ...prev,
        savedStaff,
      ]);


      // --------------------------------------------
      // CLOSE MODAL
      // --------------------------------------------

      setShowModal(false);


      // --------------------------------------------
      // CLEAR FORM
      // --------------------------------------------

      setName("");

      setRole("");

      setDepartment("Cardiology");

      setAssignedDoctor("");

      setTasks("");


      alert(
        "Staff member added successfully!"
      );

    } catch (error) {

      console.error(
        "Add staff error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to add staff"
      );

    } finally {

      setSavingStaff(false);
    }
  };


  // ====================================================
  // DELETE STAFF
  // ====================================================

  const handleDeleteStaff = async (
    id: number,
    staffName: string
  ) => {

    const confirmed = window.confirm(
      `Are you sure you want to delete ${staffName}?`
    );


    if (!confirmed) {
      return;
    }


    try {

      const response = await fetch(
        `${STAFF_API}/${id}`,
        {
          method: "DELETE",
        }
      );


      if (!response.ok) {

        const message = await response.text();

        throw new Error(
          message || "Failed to delete staff"
        );
      }


      // Remove from UI
      setStaff((prev) =>
        prev.filter(
          (member) => member.id !== id
        )
      );


      alert(
        "Staff member deleted successfully!"
      );

    } catch (error) {

      console.error(
        "Delete staff error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete staff"
      );
    }
  };


  // ====================================================
  // FIND DOCTOR
  // ====================================================

  const getDoctorName = (
    doctorId?: number | null
  ) => {

    if (!doctorId) {
      return null;
    }

    const doctor = doctors.find(
      (item) =>
        String(item.id) ===
        String(doctorId)
    );

    return doctor?.name || null;
  };


  // ====================================================
  // UI
  // ====================================================

  return (

    <div className="space-y-8 animate-in fade-in duration-500">


      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>

          <h1 className="text-3xl font-bold text-slate-900">
            Staff Coordination
          </h1>

          <p className="text-slate-500 mt-1">
            Assign nurses and support staff to departments and doctors.
          </p>

        </div>


        {/* ADD STAFF BUTTON */}

        <button
          onClick={() =>
            openAddStaffModal()
          }
          disabled={savingStaff}
          className="bg-primary text-secondary px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-primary/20 hover:scale-105 transition-transform flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >

          <UserPlus className="w-5 h-5" />

          Add Staff Member

        </button>

      </div>


      {/* ==================================================
          ERROR
      ================================================== */}

      {error && (

        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3">

          <p className="font-semibold">
            {error}
          </p>

          <button
            onClick={() => {
              loadStaff();
              loadDoctors();
            }}
            className="text-sm underline mt-1"
          >
            Try Again
          </button>

        </div>

      )}


      {/* ==================================================
          LOADING
      ================================================== */}

      {loadingStaff ? (

        <div className="bg-white rounded-2xl border border-slate-100 p-12 flex flex-col items-center justify-center">

          <Loader2 className="w-8 h-8 text-primary animate-spin" />

          <p className="text-slate-500 mt-3">
            Loading staff...
          </p>

        </div>

      ) : (

        /* ==================================================
           DEPARTMENT COLUMNS
        ================================================== */

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {departments.map(
            (dept, idx) => {

              const departmentStaff =
                staff.filter(
                  (member) =>
                    member.department === dept
                );


              return (

                <div
                  key={dept}
                  className="space-y-4"
                >


                  {/* ==========================================
                      DEPARTMENT HEADER
                  ========================================== */}

                  <div className="flex items-center justify-between px-2">

                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">

                      {dept}

                      <span className="bg-slate-100 text-slate-500 text-xs px-2 py-0.5 rounded-full">

                        {departmentStaff.length}

                      </span>

                    </h2>


                    <button className="text-slate-400 hover:text-slate-600">

                      <MoreHorizontal className="w-5 h-5" />

                    </button>

                  </div>


                  {/* ==========================================
                      STAFF CARDS
                  ========================================== */}

                  <div className="space-y-4">


                    {departmentStaff.map(
                      (member, i) => {

                        const doctorName =
                          getDoctorName(
                            member.assignedTo
                          );


                        return (

                          <motion.div

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
                                idx * 0.1 +
                                i * 0.1,
                            }}

                            key={member.id}

                            className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all"
                          >


                            {/* STAFF INFO */}

                            <div className="flex items-start justify-between mb-4">

                              <div className="flex items-center gap-3">

                                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">

                                  <Users className="w-6 h-6" />

                                </div>


                                <div>

                                  <h3 className="font-bold text-slate-900">

                                    {member.name}

                                  </h3>


                                  <p className="text-xs text-slate-500 font-medium">

                                    {member.role}

                                  </p>

                                </div>

                              </div>


                              {/* DELETE */}

                              <button
                                onClick={() =>
                                  handleDeleteStaff(
                                    member.id,
                                    member.name
                                  )
                                }
                                className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"
                                title="Delete staff"
                              >

                                <Trash2 className="w-4 h-4" />

                              </button>

                            </div>


                            {/* =================================
                                ASSIGNED DOCTOR
                            ================================= */}

                            {doctorName && (

                              <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 mb-4 flex items-center gap-2">

                                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">

                                  <CheckCircle2 className="w-3.5 h-3.5 text-secondary" />

                                </div>


                                <p className="text-xs font-semibold text-secondary">

                                  Assigned to{" "}

                                  {doctorName}

                                </p>

                              </div>

                            )}


                            {/* =================================
                                NO DOCTOR
                            ================================= */}

                            {!doctorName && (

                              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mb-4">

                                <p className="text-xs text-slate-400">

                                  No doctor assigned

                                </p>

                              </div>

                            )}


                            {/* =================================
                                TASKS
                            ================================= */}

                            <div className="space-y-2">

                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">

                                Current Tasks

                              </p>


                              <div className="flex flex-wrap gap-2">

                                {member.tasks &&
                                member.tasks.length > 0 ? (

                                  member.tasks.map(
                                    (task) => (

                                      <span

                                        key={task}

                                        className="bg-slate-50 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-lg border border-slate-100"
                                      >

                                        {task}

                                      </span>

                                    )
                                  )

                                ) : (

                                  <span className="text-xs text-slate-400">

                                    No tasks assigned

                                  </span>

                                )}

                              </div>

                            </div>


                            {/* =================================
                                STATUS
                            ================================= */}

                            <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">

                              <div className="flex items-center gap-1 text-emerald-600">

                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>

                                <span className="text-[10px] font-bold">

                                  Active

                                </span>

                              </div>


                              <button
                                onClick={() =>
                                  alert(
                                    `${member.name} is currently assigned to ${member.department}`
                                  )
                                }
                                className="text-[10px] font-bold text-primary hover:underline"
                              >

                                Reassign

                              </button>

                            </div>

                          </motion.div>

                        );

                      }
                    )}


                    {/* ========================================
                        ASSIGN NEW STAFF
                    ======================================== */}

                    <button

                      onClick={() =>
                        openAddStaffModal(
                          dept
                        )
                      }

                      className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all text-sm font-bold flex items-center justify-center gap-2"
                    >

                      <PlusIcon className="w-4 h-4" />

                      Assign New Staff

                    </button>

                  </div>

                </div>

              );

            }
          )}

        </div>

      )}


      {/* ==================================================
          ADD STAFF MODAL
      ================================================== */}

      {showModal && (

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

            className="bg-white w-full max-w-lg rounded-3xl shadow-2xl"
          >


            {/* =============================================
                MODAL HEADER
            ============================================= */}

            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">

              <div>

                <h2 className="text-xl font-bold text-slate-900">

                  Add Staff Member

                </h2>


                <p className="text-sm text-slate-500 mt-1">

                  Add a nurse or support staff member.

                </p>

              </div>


              <button

                onClick={closeModal}

                disabled={savingStaff}

                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center disabled:opacity-50"
              >

                <X className="w-5 h-5 text-slate-600" />

              </button>

            </div>


            {/* =============================================
                FORM
            ============================================= */}

            <form

              onSubmit={handleAddStaff}

              className="p-6 space-y-5"
            >


              {/* NAME */}

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">

                  Staff Name

                </label>


                <input

                  type="text"

                  value={name}

                  onChange={(e) =>
                    setName(e.target.value)
                  }

                  placeholder="Enter staff name"

                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />

              </div>


              {/* ROLE */}

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">

                  Role

                </label>


                <select

                  value={role}

                  onChange={(e) =>
                    setRole(e.target.value)
                  }

                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
                >

                  <option value="">

                    Select role

                  </option>

                  <option value="Senior Nurse">

                    Senior Nurse

                  </option>

                  <option value="Junior Nurse">

                    Junior Nurse

                  </option>

                  <option value="Staff Nurse">

                    Staff Nurse

                  </option>

                  <option value="Coordinator">

                    Coordinator

                  </option>

                  <option value="Receptionist">

                    Receptionist

                  </option>

                  <option value="Technician">

                    Technician

                  </option>

                  <option value="Support Staff">

                    Support Staff

                  </option>

                </select>

              </div>


              {/* DEPARTMENT */}

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">

                  Department

                </label>


                <select

                  value={department}

                  onChange={(e) =>
                    setDepartment(e.target.value)
                  }

                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
                >

                  {departments.map(
                    (dept) => (

                      <option
                        key={dept}
                        value={dept}
                      >

                        {dept}

                      </option>

                    )
                  )}

                </select>

              </div>


              {/* DOCTOR */}

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">

                  Assign to Doctor

                </label>


                <select

                  value={assignedDoctor}

                  onChange={(e) =>
                    setAssignedDoctor(
                      e.target.value
                    )
                  }

                  disabled={loadingDoctors}

                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-slate-50"
                >

                  <option value="">

                    {loadingDoctors
                      ? "Loading doctors..."
                      : "No Doctor"}

                  </option>


                  {doctors.map(
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
                  )}

                </select>

              </div>


              {/* TASKS */}

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">

                  Current Tasks

                </label>


                <input

                  type="text"

                  value={tasks}

                  onChange={(e) =>
                    setTasks(e.target.value)
                  }

                  placeholder="Patient monitoring, Vitals check"

                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />


                <p className="text-xs text-slate-400 mt-1">

                  Separate multiple tasks using commas.

                </p>

              </div>


              {/* ==========================================
                  BUTTONS
              ========================================== */}

              <div className="flex gap-3 pt-2">


                {/* CANCEL */}

                <button

                  type="button"

                  onClick={closeModal}

                  disabled={savingStaff}

                  className="flex-1 px-5 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 disabled:opacity-50"
                >

                  Cancel

                </button>


                {/* ADD */}

                <button

                  type="submit"

                  disabled={savingStaff}

                  className="flex-1 px-5 py-3 rounded-xl bg-primary text-secondary font-semibold hover:opacity-90 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >

                  {savingStaff ? (

                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />

                      Saving...

                    </>

                  ) : (

                    <>
                      <UserPlus className="w-4 h-4" />

                      Add Staff
                    </>

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
// PLUS ICON
// ======================================================

const PlusIcon = ({
  className,
}: {
  className?: string;
}) => (

  <svg

    className={className}

    fill="none"

    viewBox="0 0 24 24"

    stroke="currentColor"
  >

    <path

      strokeLinecap="round"

      strokeLinejoin="round"

      strokeWidth={2}

      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
    />

  </svg>
);