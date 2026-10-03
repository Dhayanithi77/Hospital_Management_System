import React, { useEffect, useMemo, useState } from "react";

import {
  CreditCard,
  Download,
  Search,
  X,
  Loader2,
} from "lucide-react";

import { motion } from "motion/react";


const PAYROLL_API =
  "http://localhost:8080/api/payroll";


type PayrollRecord = {
  id: number;
  doctorId: number;
  doctorName: string;
  salaryMonth: string;
  salary: number;
  status: string;
  paymentDate: string;
};


type Doctor = {
  id: number;
  name: string;
};


export default function Payroll() {

  // ==================================================
  // DATA
  // ==================================================

  const [payroll, setPayroll] =
    useState<PayrollRecord[]>([]);

  const [doctors, setDoctors] =
    useState<Doctor[]>([]);


  // ==================================================
  // SEARCH
  // ==================================================

  const [searchTerm, setSearchTerm] =
    useState("");


  // ==================================================
  // LOADING
  // ==================================================

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);


  // ==================================================
  // MODAL
  // ==================================================

  const [showModal, setShowModal] =
    useState(false);


  // ==================================================
  // FORM
  // ==================================================

  const [doctorId, setDoctorId] =
    useState("");

  const [salaryMonth, setSalaryMonth] =
    useState("2026-09");

  const [salary, setSalary] =
    useState("");

  const [paymentDate, setPaymentDate] =
    useState("");


  // ==================================================
  // LOAD PAYROLL
  // ==================================================

  const loadPayroll = async () => {

    try {

      setLoading(true);

      const response =
        await fetch(PAYROLL_API);

      if (!response.ok) {

        const message =
          await response.text();

        throw new Error(
          message ||
          "Failed to load payroll"
        );
      }

      const data =
        await response.json();

      setPayroll(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(
        "Payroll loading error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to load payroll"
      );

    } finally {

      setLoading(false);
    }
  };


  // ==================================================
  // LOAD DOCTORS
  // ==================================================

  const loadDoctors = async () => {

    try {

      const response =
        await fetch(
          "http://localhost:8080/api/doctors"
        );

      if (!response.ok) {

        throw new Error(
          "Failed to load doctors"
        );
      }

      const data =
        await response.json();

      setDoctors(
        Array.isArray(data)
          ? data
          : data.doctors || []
      );

    } catch (error) {

      console.error(
        "Doctor loading error:",
        error
      );
    }
  };


  // ==================================================
  // INITIAL LOAD
  // ==================================================

  useEffect(() => {

    loadPayroll();

    loadDoctors();

  }, []);


  // ==================================================
  // SEARCH
  // ==================================================

  const filteredPayroll =
    useMemo(() => {

      return payroll.filter(
        (record) =>
          record.doctorName
            .toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            )
      );

    }, [
      payroll,
      searchTerm,
    ]);


  // ==================================================
  // TOTAL MONTHLY PAYOUT
  // ==================================================

  const totalMonthlyPayout =
    filteredPayroll.reduce(
      (total, record) =>
        total + Number(record.salary || 0),
      0
    );


  // ==================================================
  // PENDING APPROVALS
  // ==================================================

  const pendingApprovals =
    filteredPayroll.filter(
      (record) =>
        record.status ===
        "PENDING"
    ).length;


  // ==================================================
  // NEXT PAYMENT DATE
  // ==================================================

  const nextPayment =
    filteredPayroll
      .filter(
        (record) =>
          record.status !==
          "COMPLETED"
      )
      .sort(
        (a, b) =>
          new Date(a.paymentDate).getTime() -
          new Date(b.paymentDate).getTime()
      )[0];


  // ==================================================
  // PROCESS PAYROLL
  // ==================================================

  const handleProcessPayroll =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();


      if (!doctorId) {

        alert(
          "Please select a doctor"
        );

        return;
      }


      if (!salaryMonth) {

        alert(
          "Please select salary month"
        );

        return;
      }


      if (!salary || Number(salary) <= 0) {

        alert(
          "Please enter a valid salary"
        );

        return;
      }


      if (!paymentDate) {

        alert(
          "Please select payment date"
        );

        return;
      }


      const doctor =
        doctors.find(
          (item) =>
            String(item.id) ===
            String(doctorId)
        );


      if (!doctor) {

        alert(
          "Doctor not found"
        );

        return;
      }


      try {

        setSaving(true);


        const requestData = {

          doctorId:
            Number(doctorId),

          doctorName:
            doctor.name,

          salaryMonth,

          salary:
            Number(salary),

          status:
            "PENDING",

          paymentDate,

        };


        const response =
          await fetch(
            PAYROLL_API,
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


        if (!response.ok) {

          const message =
            await response.text();

          throw new Error(
            message ||
            "Failed to process payroll"
          );
        }


        const savedPayroll =
          await response.json();


        setPayroll(
          (previous) => [
            ...previous,
            savedPayroll,
          ]
        );


        setShowModal(false);

        setDoctorId("");

        setSalary("");

        setPaymentDate("");


        alert(
          "Payroll processed successfully!"
        );


      } catch (error) {

        console.error(
          "Payroll error:",
          error
        );

        alert(
          error instanceof Error
            ? error.message
            : "Failed to process payroll"
        );

      } finally {

        setSaving(false);
      }
    };


  // ==================================================
  // EXPORT CSV
  // ==================================================

  const exportCSV = () => {

    if (
      filteredPayroll.length === 0
    ) {

      alert(
        "No payroll records to export"
      );

      return;
    }


    const headers = [
      "Doctor Name",
      "Salary Month",
      "Salary",
      "Payment Date",
      "Status",
    ];


    const rows =
      filteredPayroll.map(
        (record) => [

          record.doctorName,

          record.salaryMonth,

          record.salary,

          record.paymentDate,

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
      "payroll.csv";


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };


  // ==================================================
  // FORMAT MONEY
  // ==================================================

  const formatMoney =
    (amount: number) => {

      return new Intl.NumberFormat(
        "en-US",
        {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
        }
      ).format(amount);
    };


  return (

    <div className="space-y-8 animate-in fade-in duration-500">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>

          <h1 className="text-3xl font-bold text-slate-900">

            Payroll Management

          </h1>

          <p className="text-slate-500 mt-1">

            Manage staff salaries, bonuses, and financial records.

          </p>

        </div>


        <button

          onClick={() =>
            setShowModal(true)
          }

          className="bg-primary text-secondary px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-primary/20 hover:scale-105 transition-transform flex items-center gap-2"
        >

          <CreditCard className="w-5 h-5" />

          Process Payroll

        </button>

      </div>


      {/* =================================================
          STATISTICS
      ================================================= */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">


        {/* TOTAL PAYOUT */}

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">

          <p className="text-slate-500 text-sm font-bold mb-1">

            Total Monthly Payout

          </p>


          <div className="flex items-center justify-between">

            <p className="text-2xl font-bold text-slate-900">

              {formatMoney(
                totalMonthlyPayout
              )}

            </p>


            <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-lg">

              Payroll

            </span>

          </div>

        </div>


        {/* PENDING */}

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">

          <p className="text-slate-500 text-sm font-bold mb-1">

            Pending Approvals

          </p>


          <p className="text-2xl font-bold text-slate-900">

            {pendingApprovals}

          </p>

        </div>


        {/* NEXT PAYMENT */}

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">

          <p className="text-slate-500 text-sm font-bold mb-1">

            Next Payment Date

          </p>


          <p className="text-2xl font-bold text-slate-900">

            {nextPayment
              ? formatDate(
                  nextPayment.paymentDate
                )
              : "No Pending Payment"}

          </p>

        </div>

      </div>


      {/* =================================================
          RECENT TRANSACTIONS
      ================================================= */}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">


        {/* HEADER */}

        <div className="p-6 border-b border-slate-100 flex items-center justify-between">

          <h2 className="text-lg font-bold text-slate-900">

            Recent Transactions

          </h2>


          <div className="flex items-center gap-3">


            {/* SEARCH */}

            <div className="relative">

              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />

              <input

                type="text"

                value={searchTerm}

                onChange={(e) =>
                  setSearchTerm(
                    e.target.value
                  )
                }

                placeholder="Search..."

                className="bg-slate-50 border-none rounded-xl py-2 pl-9 pr-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
              />

            </div>


            {/* EXPORT */}

            <button

              onClick={exportCSV}

              className="p-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
            >

              <Download className="w-5 h-5" />

            </button>

          </div>

        </div>


        {/* TRANSACTIONS */}

        <div className="p-6 space-y-4">


          {loading ? (

            <div className="py-12 flex justify-center">

              <Loader2 className="w-8 h-8 animate-spin text-primary" />

            </div>

          ) : filteredPayroll.length === 0 ? (

            <div className="py-12 text-center">

              <CreditCard className="w-10 h-10 text-slate-300 mx-auto" />

              <p className="text-slate-500 font-semibold mt-3">

                No payroll records found

              </p>

            </div>

          ) : (

            filteredPayroll.map(
              (record, i) => (

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
                      i * 0.05,
                  }}

                  key={record.id}

                  className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-primary/30 transition-all"
                >


                  {/* LEFT */}

                  <div className="flex items-center gap-4">

                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">

                      <CreditCard className="w-5 h-5" />

                    </div>


                    <div>

                      <p className="text-sm font-bold text-slate-900">

                        {record.doctorName}

                      </p>


                      <p className="text-xs text-slate-500">

                        Monthly Salary -{" "}

                        {formatMonth(
                          record.salaryMonth
                        )}

                      </p>

                    </div>

                  </div>


                  {/* RIGHT */}

                  <div className="text-right">

                    <p className="text-sm font-bold text-slate-900">

                      {formatMoney(
                        Number(
                          record.salary
                        )
                      )}

                    </p>


                    <p
                      className={
                        record.status ===
                        "COMPLETED"

                          ? "text-[10px] font-bold text-emerald-600 uppercase tracking-wider"

                          : "text-[10px] font-bold text-amber-600 uppercase tracking-wider"
                      }
                    >

                      {record.status}

                    </p>

                  </div>

                </motion.div>

              )
            )

          )}

        </div>

      </div>


      {/* =================================================
          PROCESS PAYROLL MODAL
      ================================================= */}

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">


          <motion.div

            initial={{
              opacity: 0,
              scale: 0.95,
            }}

            animate={{
              opacity: 1,
              scale: 1,
            }}

            className="bg-white w-full max-w-md rounded-3xl shadow-2xl"
          >


            {/* MODAL HEADER */}

            <div className="flex items-center justify-between p-6 border-b border-slate-100">

              <div>

                <h2 className="text-xl font-bold text-slate-900">

                  Process Payroll

                </h2>

                <p className="text-sm text-slate-500 mt-1">

                  Create a payroll record.

                </p>

              </div>


              <button

                onClick={() =>
                  setShowModal(false)
                }

                disabled={saving}

                className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center"
              >

                <X className="w-5 h-5" />

              </button>

            </div>


            {/* FORM */}

            <form

              onSubmit={
                handleProcessPayroll
              }

              className="p-6 space-y-5"
            >


              {/* DOCTOR */}

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">

                  Doctor

                </label>


                <select

                  value={doctorId}

                  onChange={(e) =>
                    setDoctorId(
                      e.target.value
                    )
                  }

                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none"
                >

                  <option value="">

                    Select Doctor

                  </option>


                  {doctors.map(
                    (doctor) => (

                      <option
                        key={doctor.id}
                        value={doctor.id}
                      >

                        {doctor.name}

                      </option>

                    )
                  )}

                </select>

              </div>


              {/* MONTH */}

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">

                  Salary Month

                </label>


                <input

                  type="month"

                  value={salaryMonth}

                  onChange={(e) =>
                    setSalaryMonth(
                      e.target.value
                    )
                  }

                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none"
                />

              </div>


              {/* SALARY */}

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">

                  Salary

                </label>


                <input

                  type="number"

                  min="0"

                  step="0.01"

                  value={salary}

                  onChange={(e) =>
                    setSalary(
                      e.target.value
                    )
                  }

                  placeholder="Enter salary"

                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none"
                />

              </div>


              {/* PAYMENT DATE */}

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">

                  Payment Date

                </label>


                <input

                  type="date"

                  value={paymentDate}

                  onChange={(e) =>
                    setPaymentDate(
                      e.target.value
                    )
                  }

                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none"
                />

              </div>


              {/* BUTTONS */}

              <div className="flex gap-3 pt-2">

                <button

                  type="button"

                  onClick={() =>
                    setShowModal(false)
                  }

                  disabled={saving}

                  className="flex-1 py-3 rounded-xl border border-slate-200 font-semibold text-slate-600"
                >

                  Cancel

                </button>


                <button

                  type="submit"

                  disabled={saving}

                  className="flex-1 py-3 rounded-xl bg-primary text-secondary font-semibold flex items-center justify-center gap-2"
                >

                  {saving ? (

                    <>

                      <Loader2 className="w-4 h-4 animate-spin" />

                      Saving...

                    </>

                  ) : (

                    "Process Payroll"

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
// FORMAT DATE
// ======================================================

function formatDate(
  date: string
) {

  if (!date) {
    return "-";
  }

  const value =
    new Date(
      `${date}T00:00:00`
    );

  return value.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
}


// ======================================================
// FORMAT MONTH
// ======================================================

function formatMonth(
  month: string
) {

  if (!month) {
    return "-";
  }

  const value =
    new Date(
      `${month}-01T00:00:00`
    );

  return value.toLocaleDateString(
    "en-US",
    {
      month: "short",
      year: "numeric",
    }
  );
}