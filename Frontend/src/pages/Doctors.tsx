import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  MoreVertical,
  X,
} from "lucide-react";

import { cn } from "../lib/utils";
import { motion } from "motion/react";


// ============================================================
// API URL
// ============================================================

const API_URL =
  "http://localhost:8080/api/doctors";


// ============================================================
// DOCTOR TYPE
// ============================================================

type Doctor = {
  id: number;
  name: string;
  email: string;
  department: string;
  status: string;
  shift: string;
  avatar?: string | null;
};


// ============================================================
// FORM TYPE
// ============================================================

type DoctorForm = {
  name: string;
  email: string;
  department: string;
  status: string;
  shift: string;
};


// ============================================================
// COMPONENT
// ============================================================

export default function Doctors() {

  // ==========================================================
  // STATE
  // ==========================================================

  const [doctors, setDoctors] =
    useState<Doctor[]>([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [selectedDepartment, setSelectedDepartment] =
    useState("All Departments");

  const [showAddModal, setShowAddModal] =
    useState(false);

  const [editingDoctor, setEditingDoctor] =
    useState<Doctor | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);


  // ==========================================================
  // FORM
  // ==========================================================

  const [formData, setFormData] =
    useState<DoctorForm>({
      name: "",
      email: "",
      department: "Cardiology",
      status: "Available",
      shift: "Morning",
    });


  // ==========================================================
  // LOAD DOCTORS FROM SPRING BOOT
  // ==========================================================

  const loadDoctors = async () => {

    try {

      setLoading(true);

      const response = await fetch(
        API_URL
      );

      if (!response.ok) {

        throw new Error(
          "Failed to load doctors"
        );
      }

      const data =
        await response.json();

      console.log(
        "Doctors from backend:",
        data
      );

      setDoctors(data);

    } catch (error) {

      console.error(
        "Doctor loading error:",
        error
      );

      alert(
        "Failed to load doctors from Spring Boot."
      );

    } finally {

      setLoading(false);
    }
  };


  // ==========================================================
  // LOAD WHEN PAGE OPENS
  // ==========================================================

  useEffect(() => {

    loadDoctors();

  }, []);


  // ==========================================================
  // DEPARTMENT LIST
  // ==========================================================

  const departments = useMemo(() => {

    const uniqueDepartments =
      Array.from(
        new Set(
          doctors.map(
            (doctor) =>
              doctor.department
          )
        )
      ).sort();

    return [
      "All Departments",
      ...uniqueDepartments,
    ];

  }, [doctors]);


  // ==========================================================
  // SEARCH + FILTER
  // ==========================================================

  const filteredDoctors =
    useMemo(() => {

      return doctors.filter(
        (doctor) => {

          const search =
            searchTerm
              .toLowerCase()
              .trim();

          const matchesSearch =
            doctor.name
              .toLowerCase()
              .includes(search) ||

            doctor.email
              .toLowerCase()
              .includes(search) ||

            doctor.department
              .toLowerCase()
              .includes(search);


          const matchesDepartment =
            selectedDepartment ===
              "All Departments" ||
            doctor.department ===
              selectedDepartment;


          return (
            matchesSearch &&
            matchesDepartment
          );
        }
      );

    }, [
      doctors,
      searchTerm,
      selectedDepartment,
    ]);


  // ==========================================================
  // FORM CHANGE
  // ==========================================================

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {

    const {
      name,
      value,
    } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  // ==========================================================
  // OPEN ADD DOCTOR
  // ==========================================================

  const handleOpenAddDoctor = () => {

    setEditingDoctor(null);

    setFormData({
      name: "",
      email: "",
      department: "Cardiology",
      status: "Available",
      shift: "Morning",
    });

    setShowAddModal(true);
  };


  // ==========================================================
  // CLOSE MODAL
  // ==========================================================

  const handleCloseModal = () => {

    if (saving) {
      return;
    }

    setShowAddModal(false);

    setEditingDoctor(null);

    setFormData({
      name: "",
      email: "",
      department: "Cardiology",
      status: "Available",
      shift: "Morning",
    });
  };


  // ==========================================================
  // ADD DOCTOR
  // ==========================================================

  const addDoctor = async () => {

    try {

      setSaving(true);

      const response =
        await fetch(API_URL, {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            name:
              formData.name.trim(),

            email:
              formData.email.trim(),

            department:
              formData.department,

            status:
              formData.status,

            shift:
              formData.shift,

            avatar: null,
          }),
        });


      if (!response.ok) {

        const message =
          await response.text();

        throw new Error(
          message ||
            "Failed to add doctor"
        );
      }


      const newDoctor =
        await response.json();

      console.log(
        "Doctor added:",
        newDoctor
      );


      // Refresh from database
      await loadDoctors();


      handleCloseModal();


      alert(
        "Doctor added successfully!"
      );

    } catch (error) {

      console.error(
        "Add doctor error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to add doctor"
      );

    } finally {

      setSaving(false);
    }
  };


  // ==========================================================
  // UPDATE DOCTOR
  // ==========================================================

  const updateDoctor = async () => {

    if (!editingDoctor) {
      return;
    }


    try {

      setSaving(true);

      const response =
        await fetch(
          `${API_URL}/${editingDoctor.id}`,
          {

            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              name:
                formData.name.trim(),

              email:
                formData.email.trim(),

              department:
                formData.department,

              status:
                formData.status,

              shift:
                formData.shift,

              avatar:
                editingDoctor.avatar ||
                null,
            }),
          }
        );


      if (!response.ok) {

        const message =
          await response.text();

        throw new Error(
          message ||
            "Failed to update doctor"
        );
      }


      const updatedDoctor =
        await response.json();

      console.log(
        "Doctor updated:",
        updatedDoctor
      );


      // Refresh from database
      await loadDoctors();


      handleCloseModal();


      alert(
        "Doctor updated successfully!"
      );

    } catch (error) {

      console.error(
        "Update doctor error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to update doctor"
      );

    } finally {

      setSaving(false);
    }
  };


  // ==========================================================
  // SAVE DOCTOR
  // ==========================================================

  const handleSaveDoctor = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();


    // Validation

    if (
      !formData.name.trim()
    ) {

      alert(
        "Please enter doctor name."
      );

      return;
    }


    if (
      !formData.email.trim()
    ) {

      alert(
        "Please enter doctor email."
      );

      return;
    }


    if (editingDoctor) {

      await updateDoctor();

    } else {

      await addDoctor();
    }
  };


  // ==========================================================
  // EDIT DOCTOR
  // ==========================================================

  const handleEditDoctor = (
    doctor: Doctor
  ) => {

    setEditingDoctor(
      doctor
    );

    setFormData({

      name:
        doctor.name,

      email:
        doctor.email,

      department:
        doctor.department,

      status:
        doctor.status,

      shift:
        doctor.shift,
    });

    setShowAddModal(true);
  };


  // ==========================================================
  // DELETE DOCTOR
  // ==========================================================

  const handleDeleteDoctor =
    async (
      id: number
    ) => {

      const doctor =
        doctors.find(
          (item) =>
            item.id === id
        );


      if (!doctor) {
        return;
      }


      const confirmed =
        window.confirm(
          `Are you sure you want to delete ${doctor.name}?`
        );


      if (!confirmed) {
        return;
      }


      try {

        const response =
          await fetch(
            `${API_URL}/${id}`,
            {
              method: "DELETE",
            }
          );


        if (!response.ok) {

          const message =
            await response.text();

          throw new Error(
            message ||
              "Failed to delete doctor"
          );
        }


        console.log(
          "Doctor deleted:",
          id
        );


        // Refresh database data
        await loadDoctors();


        alert(
          "Doctor deleted successfully!"
        );

      } catch (error) {

        console.error(
          "Delete doctor error:",
          error
        );

        alert(
          error instanceof Error
            ? error.message
            : "Failed to delete doctor"
        );
      }
    };


  // ==========================================================
  // RESET FILTERS
  // ==========================================================

  const handleResetFilters =
    () => {

      setSearchTerm("");

      setSelectedDepartment(
        "All Departments"
      );
    };


  // ==========================================================
  // UI
  // ==========================================================

  return (

    <div className="space-y-8 animate-in fade-in duration-500">

      {/* ====================================================
          HEADER
          ==================================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>

          <h1 className="text-3xl font-bold text-slate-900">
            Doctor Management
          </h1>

          <p className="text-slate-500 mt-1">
            Manage hospital medical staff
            and their availability.
          </p>

        </div>


        {/* ADD DOCTOR */}

        <button
          type="button"
          onClick={
            handleOpenAddDoctor
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
            self-start
            sm:self-auto
          "
        >

          <Plus className="w-5 h-5" />

          Add New Doctor

        </button>

      </div>


      {/* ====================================================
          DOCTOR TABLE CARD
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
            SEARCH + FILTER BAR
            ================================================== */}

        <div className="
          p-6
          border-b
          border-slate-100
          flex
          flex-col
          md:flex-row
          md:items-center
          justify-between
          gap-4
        ">


          {/* SEARCH */}

          <div className="
            relative
            flex-1
            max-w-md
          ">

            <Search className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-slate-400
              w-5
              h-5
            " />

            <input
              type="text"
              placeholder="Search by name or department..."
              className="
                w-full
                bg-slate-50
                border-none
                rounded-xl
                py-2.5
                pl-12
                pr-4
                focus:ring-2
                focus:ring-primary/20
                outline-none
                text-sm
              "
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
            />

          </div>


          {/* FILTER */}

          <div className="
            flex
            items-center
            gap-3
            flex-wrap
          ">

            <button
              type="button"
              onClick={
                handleResetFilters
              }
              className="
                flex
                items-center
                gap-2
                px-4
                py-2.5
                bg-slate-50
                text-slate-600
                rounded-xl
                text-sm
                font-medium
                hover:bg-slate-100
                transition-colors
              "
            >

              <Filter className="w-4 h-4" />

              Reset Filter

            </button>


            {/* DEPARTMENT */}

            <select
              value={
                selectedDepartment
              }
              onChange={(e) =>
                setSelectedDepartment(
                  e.target.value
                )
              }
              className="
                bg-slate-50
                border-none
                rounded-xl
                px-4
                py-2.5
                text-sm
                font-medium
                outline-none
                focus:ring-2
                focus:ring-primary/20
              "
            >

              {departments.map(
                (department) => (

                  <option
                    key={department}
                    value={department}
                  >
                    {department}
                  </option>

                )
              )}

            </select>

          </div>

        </div>


        {/* ==================================================
            TABLE
            ================================================== */}

        <div className="overflow-x-auto">

          <table className="
            w-full
            text-left
            border-collapse
          ">

            <thead>

              <tr className="
                bg-slate-50/50
              ">

                <th className="
                  px-6
                  py-4
                  text-xs
                  font-bold
                  text-slate-500
                  uppercase
                  tracking-wider
                ">
                  Doctor
                </th>

                <th className="
                  px-6
                  py-4
                  text-xs
                  font-bold
                  text-slate-500
                  uppercase
                  tracking-wider
                ">
                  Department
                </th>

                <th className="
                  px-6
                  py-4
                  text-xs
                  font-bold
                  text-slate-500
                  uppercase
                  tracking-wider
                ">
                  Status
                </th>

                <th className="
                  px-6
                  py-4
                  text-xs
                  font-bold
                  text-slate-500
                  uppercase
                  tracking-wider
                ">
                  Shift
                </th>

                <th className="
                  px-6
                  py-4
                  text-xs
                  font-bold
                  text-slate-500
                  uppercase
                  tracking-wider
                  text-right
                ">
                  Actions
                </th>

              </tr>

            </thead>


            <tbody className="
              divide-y
              divide-slate-100
            ">

              {/* LOADING */}

              {loading ? (

                <tr>

                  <td
                    colSpan={5}
                    className="
                      px-6
                      py-12
                      text-center
                      text-sm
                      text-slate-500
                    "
                  >

                    Loading doctors...

                  </td>

                </tr>

              ) : filteredDoctors.length === 0 ? (

                /* NO RESULTS */

                <tr>

                  <td
                    colSpan={5}
                    className="
                      px-6
                      py-12
                      text-center
                      text-sm
                      text-slate-500
                    "
                  >

                    No doctors found.

                  </td>

                </tr>

              ) : (

                filteredDoctors.map(
                  (doc, i) => (

                    <motion.tr
                      initial={{
                        opacity: 0,
                        x: -10,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        delay:
                          i * 0.05,
                      }}
                      key={doc.id}
                      className="
                        hover:bg-slate-50/50
                        transition-colors
                        group
                      "
                    >

                      {/* DOCTOR */}

                      <td className="
                        px-6
                        py-4
                      ">

                        <div className="
                          flex
                          items-center
                          gap-3
                        ">

                          <div className="
                            w-10
                            h-10
                            rounded-full
                            bg-slate-100
                            overflow-hidden
                            border-2
                            border-white
                            shadow-sm
                            flex-shrink-0
                          ">

                            {doc.avatar ? (

                              <img
                                src={
                                  doc.avatar
                                }
                                alt={
                                  doc.name
                                }
                                className="
                                  w-full
                                  h-full
                                  object-cover
                                "
                                referrerPolicy="no-referrer"
                              />

                            ) : (

                              <div className="
                                w-full
                                h-full
                                flex
                                items-center
                                justify-center
                                bg-primary
                                text-secondary
                                font-bold
                              ">

                                {doc.name
                                  .charAt(0)
                                  .toUpperCase()}

                              </div>

                            )}

                          </div>


                          <div>

                            <p className="
                              text-sm
                              font-semibold
                              text-slate-900
                            ">
                              {doc.name}
                            </p>

                            <p className="
                              text-xs
                              text-slate-500
                            ">
                              {doc.email}
                            </p>

                          </div>

                        </div>

                      </td>


                      {/* DEPARTMENT */}

                      <td className="
                        px-6
                        py-4
                      ">

                        <span className="
                          text-sm
                          text-slate-600
                          font-medium
                        ">
                          {doc.department}
                        </span>

                      </td>


                      {/* STATUS */}

                      <td className="
                        px-6
                        py-4
                      ">

                        <span
                          className={cn(
                            `
                              inline-flex
                              items-center
                              px-2.5
                              py-1
                              rounded-full
                              text-xs
                              font-bold
                            `,
                            doc.status ===
                              "Available"
                              ? `
                                bg-emerald-100
                                text-emerald-700
                              `
                              : doc.status ===
                                "Busy"
                              ? `
                                bg-amber-100
                                text-amber-700
                              `
                              : `
                                bg-rose-100
                                text-rose-700
                              `
                          )}
                        >

                          <span
                            className={cn(
                              `
                                w-1.5
                                h-1.5
                                rounded-full
                                mr-1.5
                              `,
                              doc.status ===
                                "Available"
                                ? "bg-emerald-500"
                                : doc.status ===
                                  "Busy"
                                ? "bg-amber-500"
                                : "bg-rose-500"
                            )}
                          />

                          {doc.status}

                        </span>

                      </td>


                      {/* SHIFT */}

                      <td className="
                        px-6
                        py-4
                      ">

                        <span className="
                          text-sm
                          text-slate-600
                        ">
                          {doc.shift}
                        </span>

                      </td>


                      {/* ACTIONS */}

                      <td className="
                        px-6
                        py-4
                        text-right
                      ">

                        <div className="
                          flex
                          items-center
                          justify-end
                          gap-2
                          opacity-0
                          group-hover:opacity-100
                          transition-opacity
                        ">


                          {/* EDIT */}

                          <button
                            type="button"
                            onClick={() =>
                              handleEditDoctor(
                                doc
                              )
                            }
                            className="
                              p-2
                              text-slate-400
                              hover:text-primary
                              hover:bg-primary/10
                              rounded-lg
                              transition-all
                            "
                            title="Edit Doctor"
                          >

                            <Edit2 className="
                              w-4
                              h-4
                            " />

                          </button>


                          {/* DELETE */}

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteDoctor(
                                doc.id
                              )
                            }
                            className="
                              p-2
                              text-slate-400
                              hover:text-rose-500
                              hover:bg-rose-50
                              rounded-lg
                              transition-all
                            "
                            title="Delete Doctor"
                          >

                            <Trash2 className="
                              w-4
                              h-4
                            " />

                          </button>


                          {/* MORE */}

                          <button
                            type="button"
                            className="
                              p-2
                              text-slate-400
                              hover:text-slate-600
                              hover:bg-slate-100
                              rounded-lg
                              transition-all
                            "
                            title="More"
                          >

                            <MoreVertical className="
                              w-4
                              h-4
                            " />

                          </button>

                        </div>

                      </td>

                    </motion.tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* ====================================================
          ADD / EDIT DOCTOR MODAL
          ==================================================== */}

      {showAddModal && (

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
            handleCloseModal
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
              max-h-[90vh]
              overflow-y-auto
            "
            onClick={(e) =>
              e.stopPropagation()
            }
          >


            {/* MODAL HEADER */}

            <div className="
              flex
              items-center
              justify-between
              p-6
              border-b
              border-slate-100
            ">

              <div>

                <h2 className="
                  text-xl
                  font-bold
                  text-slate-900
                ">
                  {editingDoctor
                    ? "Edit Doctor"
                    : "Add New Doctor"}
                </h2>

                <p className="
                  text-sm
                  text-slate-500
                  mt-1
                ">
                  {editingDoctor
                    ? "Update doctor information"
                    : "Enter doctor information"}
                </p>

              </div>


              <button
                type="button"
                onClick={
                  handleCloseModal
                }
                className="
                  p-2
                  rounded-xl
                  hover:bg-slate-100
                  text-slate-500
                "
              >

                <X className="
                  w-5
                  h-5
                " />

              </button>

            </div>


            {/* FORM */}

            <form
              onSubmit={
                handleSaveDoctor
              }
              className="
                p-6
                space-y-5
              "
            >


              {/* NAME */}

              <div>

                <label className="
                  block
                  text-xs
                  font-bold
                  text-slate-500
                  uppercase
                  mb-2
                ">
                  Doctor Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={
                    formData.name
                  }
                  onChange={
                    handleFormChange
                  }
                  placeholder="Dr. John Smith"
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
                    focus:ring-2
                    focus:ring-primary/20
                  "
                />

              </div>


              {/* EMAIL */}

              <div>

                <label className="
                  block
                  text-xs
                  font-bold
                  text-slate-500
                  uppercase
                  mb-2
                ">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={
                    formData.email
                  }
                  onChange={
                    handleFormChange
                  }
                  placeholder="doctor@hospital.com"
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
                    focus:ring-2
                    focus:ring-primary/20
                  "
                />

              </div>


              {/* DEPARTMENT */}

              <div>

                <label className="
                  block
                  text-xs
                  font-bold
                  text-slate-500
                  uppercase
                  mb-2
                ">
                  Department
                </label>

                <select
                  name="department"
                  value={
                    formData.department
                  }
                  onChange={
                    handleFormChange
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

                  <option value="Cardiology">
                    Cardiology
                  </option>

                  <option value="Neurology">
                    Neurology
                  </option>

                  <option value="Pediatrics">
                    Pediatrics
                  </option>

                  <option value="Orthopedics">
                    Orthopedics
                  </option>

                  <option value="Emergency">
                    Emergency
                  </option>

                  <option value="General Medicine">
                    General Medicine
                  </option>

                  <option value="Dermatology">
                    Dermatology
                  </option>

                  <option value="Oncology">
                    Oncology
                  </option>

                </select>

              </div>


              {/* STATUS + SHIFT */}

              <div className="
                grid
                grid-cols-2
                gap-4
              ">


                {/* STATUS */}

                <div>

                  <label className="
                    block
                    text-xs
                    font-bold
                    text-slate-500
                    uppercase
                    mb-2
                  ">
                    Status
                  </label>

                  <select
                    name="status"
                    value={
                      formData.status
                    }
                    onChange={
                      handleFormChange
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

                    <option value="Available">
                      Available
                    </option>

                    <option value="Busy">
                      Busy
                    </option>

                    <option value="On Leave">
                      On Leave
                    </option>

                  </select>

                </div>


                {/* SHIFT */}

                <div>

                  <label className="
                    block
                    text-xs
                    font-bold
                    text-slate-500
                    uppercase
                    mb-2
                  ">
                    Shift
                  </label>

                  <select
                    name="shift"
                    value={
                      formData.shift
                    }
                    onChange={
                      handleFormChange
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

                    <option value="Morning">
                      Morning
                    </option>

                    <option value="Afternoon">
                      Afternoon
                    </option>

                    <option value="Night">
                      Night
                    </option>

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
                    handleCloseModal
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
                  disabled={saving}
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
                  "
                >

                  {saving
                    ? "Saving..."
                    : editingDoctor
                    ? "Update Doctor"
                    : "Add Doctor"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}