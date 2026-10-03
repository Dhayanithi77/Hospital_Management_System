import { useState, useEffect } from "react";
import { 
  Pill, 
  Utensils, 
  Ambulance, 
  Zap,
  TrendingUp,
  AlertCircle,
  Package,
  Droplets,
  Wind,
  Battery,
  Truck,
  ArrowRight,
  Wrench,
  Calendar,
  Droplet,
  Plus,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';


type DashboardType = 'pharmacy' | 'food-court' | 'vehicles' | 'essentials' | 'blood-bank';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<DashboardType>('pharmacy');

  const tabs = [
    { id: 'pharmacy', label: 'Pharmacy', icon: Pill, color: 'bg-blue-500' },
    { id: 'food-court', label: 'Food Court', icon: Utensils, color: 'bg-emerald-500' },
    { id: 'vehicles', label: 'Vehicles & Stretchers', icon: Ambulance, color: 'bg-amber-500' },
    { id: 'essentials', label: 'Essential Needs', icon: Zap, color: 'bg-rose-500' },
    { id: 'blood-bank', label: 'Blood Bank', icon: Droplet, color: 'bg-red-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Hospital Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage critical hospital resources and services.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as DashboardType)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all",
                  activeTab === tab.id 
                    ? `${tab.color} text-white shadow-lg` 
                    : "text-slate-500 hover:bg-slate-50"
                )}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

     <AnimatePresence mode="wait">
      <motion.div
       key={activeTab}
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       exit={{ opacity: 0, y: -20 }}
       transition={{ duration: 0.3 }}
       className="w-full max-w-full min-w-0 overflow-x-hidden"
       >
       {activeTab === 'pharmacy' && <PharmacyDashboard />}
       {activeTab === 'food-court' && <FoodCourtDashboard />}
       {activeTab === 'vehicles' && <VehicleDashboard />}
       {activeTab === 'essentials' && <EssentialsDashboard />}
       {activeTab === 'blood-bank' && <BloodBankDashboard />}
       </motion.div>
       </AnimatePresence>
    </div>
  );
}
function PharmacyDashboard() {

  const [medicines, setMedicines] = useState<any[]>([]);

  const [stats, setStats] = useState({
    totalStock: 0,
    lowStock: 0,
    expiringSoon: 0
  });

  // Fetch medicines for the table
  useEffect(() => {

    fetch("http://localhost:8080/api/medicines")
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to fetch medicines");
        }

        return response.json();
      })
      .then(data => {
        console.log("Medicines:", data);
        setMedicines(data);
      })
      .catch(error => {
        console.error("Error fetching medicines:", error);
      });

  }, []);


  // Fetch dashboard statistics
  useEffect(() => {

    fetch("http://localhost:8080/api/medicines/dashboard")
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard stats");
        }

        return response.json();
      })
      .then(data => {

        console.log("Dashboard Stats:", data);

        setStats({
          totalStock: data.totalStock,
          lowStock: data.lowStock,
          expiringSoon: data.expiringSoon
        });

      })
      .catch(error => {
        console.error("Error fetching dashboard stats:", error);
      });

  }, []);


  return (
    <div className="space-y-6">

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Total Medicines */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">

          <p className="text-slate-500 text-sm font-bold mb-1">
            Total Medicines
          </p>

          <p className="text-2xl font-bold text-slate-900">
            {stats.totalStock.toLocaleString()}
          </p>

        </div>


        {/* Low Stock Alerts */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">

          <p className="text-slate-500 text-sm font-bold mb-1">
            Low Stock Alerts
          </p>

          <p className="text-2xl font-bold text-rose-600">
            {stats.lowStock}
          </p>

        </div>


        {/* Expiring Soon */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">

          <p className="text-slate-500 text-sm font-bold mb-1">
            Expiring Soon
          </p>

          <p className="text-2xl font-bold text-amber-600">
            {String(stats.expiringSoon).padStart(2, "0")}
          </p>

        </div>

      </div>


      {/* Medicine Management */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

        <div className="p-6 border-b border-slate-100 flex items-center justify-between">

          <h2 className="text-xl font-bold text-slate-900">
            Medicine Management
          </h2>

          <button className="text-primary text-sm font-bold hover:underline">
            View All Inventory
          </button>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead>

              <tr className="bg-slate-50/50">

                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                  Medicine Name
                </th>

                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                  Stock Count
                </th>

                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                  Status
                </th>

                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                  Expiry
                </th>

              </tr>

            </thead>


            <tbody className="divide-y divide-slate-100">

              {medicines.map((med) => (

                <tr
                  key={med.id}
                  className="hover:bg-slate-50 transition-colors"
                >

                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                    {med.name}
                  </td>


                  <td className="px-6 py-4 text-sm text-slate-600">
                    {med.stockCount} units
                  </td>


                  <td className="px-6 py-4">

                    <span
                      className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase",

                        med.status === "In Stock"
                          ? "bg-emerald-100 text-emerald-700"

                          : med.status === "Low Stock"
                          ? "bg-amber-100 text-amber-700"

                          : "bg-rose-100 text-rose-700"
                      )}
                    >
                      {med.status}
                    </span>

                  </td>


                  <td className="px-6 py-4 text-sm text-slate-500">
                    {med.expiry}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

function FoodCourtDashboard() {
const [stocks, setStocks] = useState<any[]>([]);

const [foodStats, setFoodStats] = useState({
  mealsServed: 0,
  mealCapacity: 0,
  kitchenEfficiency: 0,
  aiSuggestion: ""
});

Then:

useEffect(() => {

  fetch("http://localhost:8080/api/foodcourt/dashboard")
    .then(response => {

      if (!response.ok) {
        throw new Error("Failed to fetch food court data");
      }

      return response.json();
    })
    .then(data => {

      console.log("Food Court Data:", data);

      setStocks(data.stocks);

      setFoodStats({
        mealsServed: data.mealsServed,
        mealCapacity: data.mealCapacity,
        kitchenEfficiency: data.kitchenEfficiency,
        aiSuggestion: data.aiSuggestion
      });

    })
    .catch(error => {
      console.error("Food Court API Error:", error);
    });

}, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-500" />
            Stock Count
          </h2>
          <div className="space-y-4">
            {stocks.map((s) => (
              <div key={s.item} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-bold text-slate-900">{s.item}</p>
                  <p className="text-xs text-slate-500">{s.stock} {s.unit} remaining</p>
                </div>
                {s.alert && (
                  <div className="flex items-center gap-1 text-rose-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase">Shortage</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Consumption Trends
          </h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
                <span>Daily Meals Served</span>
                <span>850 / 1000</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[85%]"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
                <span>Kitchen Efficiency</span>
                <span>92%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[92%]"></div>
              </div>
            </div>
          </div>
          <div className="mt-8 p-4 bg-amber-50 border border-amber-100 rounded-xl">
            <p className="text-xs text-amber-800 font-medium">
              AI Suggestion: Increase vegetable order by 20% for next week based on patient count trends.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function VehicleDashboard() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [maintenance, setMaintenance] = useState({
    overdueCount: 0,
    upcomingCount: 0
  });
  // Fetch vehicle dashboard data
  useEffect(() => {
    fetch("http://localhost:8080/api/vehicles/dashboard")
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to fetch vehicle dashboard");
        }
        return response.json();
      })
      .then(data => {
        console.log("Vehicle Dashboard:", data);
        setVehicles(data.vehicles || []);
        setMaintenance({
          overdueCount: data.overdueCount || 0,
          upcomingCount: data.upcomingCount || 0
        });
      })
      .catch(error => {
        console.error("Vehicle dashboard error:", error);
      });
  }, []);
  // -----------------------------------
  // Vehicle Availability Status
  // -----------------------------------
  const getVehicleStatus = (
    available: number,
    total: number
  ) => {
    if (total === 0) {
      return "Limited";
    }
    const percentage = (available / total) * 100;
    if (percentage >= 50) {
      return "Available";
    }
    if (percentage >= 30) {
      return "Busy";
    }
    return "Limited";
  };
  // -----------------------------------
  // Maintenance Status
  // -----------------------------------
  const getMaintenanceStatus = (
    nextServiceDue: string
  ) => {
    const today = new Date();
    const serviceDate = new Date(nextServiceDue);
    if (serviceDate < today) {
      return "Overdue";
    }
    const difference =
      serviceDate.getTime() - today.getTime();
    const days =
      difference / (1000 * 60 * 60 * 24);
    if (days <= 30) {
      return "Upcoming";
    }
    return "On Track";
  };
  // -----------------------------------
  // Maintenance Alerts
  // -----------------------------------
  const alerts = vehicles.filter(vehicle => {
    const status = getMaintenanceStatus(
      vehicle.nextServiceDue
    );
    return status === "Upcoming" || status === "Overdue";
  });
  return (
    <div className="space-y-8">
      {/* ================================= */}
      {/* MAINTENANCE ALERTS */}
      {/* ================================= */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          {alerts.map((alert) => {
            const status = getMaintenanceStatus(
              alert.nextServiceDue
            );
            return (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={alert.id}
                className={cn(
                  "p-4 rounded-2xl border flex items-center justify-between shadow-sm",
                  status === "Overdue"
                    ? "bg-rose-50 border-rose-100 text-rose-700"
                    : "bg-blue-50 border-blue-100 text-blue-700"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "p-2 rounded-xl",
                      status === "Overdue"
                        ? "bg-rose-100"
                        : "bg-blue-100"
                    )}
                  >
                    <AlertCircle className="w-5 h-5" />

                  </div>


                  <div>

                    <p className="text-sm font-bold">

                      {status === "Overdue"

                        ? "Critical Maintenance Overdue"

                        : "Upcoming Maintenance Alert"

                      }

                    </p>


                    <p className="text-xs opacity-80">

                      {alert.vehicleType} is{" "}

                      {status === "Overdue"
                        ? "past"
                        : "approaching"
                      }

                      {" "}its service date:

                      {" "}

                      <span className="font-bold">

                        {alert.nextServiceDue}

                      </span>

                    </p>

                  </div>

                </div>


                <button
                  className={cn(

                    "px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105",

                    status === "Overdue"

                      ? "bg-rose-600 text-white"

                      : "bg-blue-600 text-white"

                  )}
                >

                  Schedule Now

                </button>

              </motion.div>

            );

          })}

        </div>

      )}


      {/* ================================= */}
      {/* VEHICLE CARDS */}
      {/* ================================= */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {vehicles.map((v) => {

          const status = getVehicleStatus(
            v.availableCount,
            v.totalCount
          );

          const percentage =
            v.totalCount > 0
              ? Math.round(
                  (v.availableCount / v.totalCount) * 100
                )
              : 0;


          return (

            <div
              key={v.id}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
            >

              <div className="flex items-center justify-between mb-4">

                <div className="bg-amber-100 p-3 rounded-xl text-amber-600">

                  {v.vehicleType.includes("Ambulance")

                    ? <Ambulance className="w-6 h-6" />

                    : <Truck className="w-6 h-6" />

                  }

                </div>


                <span
                  className={cn(

                    "text-[10px] font-bold px-2 py-1 rounded-lg uppercase",

                    status === "Available"

                      ? "bg-emerald-100 text-emerald-700"

                      : status === "Busy"

                      ? "bg-rose-100 text-rose-700"

                      : "bg-amber-100 text-amber-700"

                  )}
                >

                  {status}

                </span>

              </div>


              <h3 className="text-slate-900 font-bold">

                {v.vehicleType}

              </h3>


              <div className="mt-4 flex items-end justify-between">

                <div>

                  <p className="text-2xl font-bold text-slate-900">

                    {v.availableCount}

                  </p>

                  <p className="text-xs text-slate-500">

                    Available of {v.totalCount}

                  </p>

                </div>


                {/* Percentage Circle */}

                <div className="h-12 w-12 rounded-full border-4 border-slate-100 flex items-center justify-center relative">

                  <svg className="w-full h-full -rotate-90">

                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="text-primary"
                      strokeDasharray={`${(percentage / 100) * 125.6} 125.6`}
                    />

                  </svg>


                  <span className="absolute text-[10px] font-bold">

                    {percentage}%

                  </span>

                </div>

              </div>

            </div>

          );

        })}

      </div>


      {/* ================================= */}
      {/* MAINTENANCE TRACKING */}
      {/* ================================= */}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

        <div className="p-6 border-b border-slate-100 flex items-center justify-between">

          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">

            <Wrench className="w-5 h-5 text-amber-500" />

            Maintenance Tracking

          </h2>


          <button className="text-primary text-sm font-bold hover:underline">

            Schedule Service

          </button>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead>

              <tr className="bg-slate-50/50">

                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                  Vehicle Type
                </th>

                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                  Last Service
                </th>

                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                  Next Service Due
                </th>

                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                  Status
                </th>

              </tr>

            </thead>


            <tbody className="divide-y divide-slate-100">

              {vehicles.map((v) => {

                const status = getMaintenanceStatus(
                  v.nextServiceDue
                );


                return (

                  <tr
                    key={v.id}
                    className="hover:bg-slate-50 transition-colors"
                  >

                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">

                      {v.vehicleType}

                    </td>


                    <td className="px-6 py-4 text-sm text-slate-600">

                      <div className="flex items-center gap-2">

                        <Calendar className="w-4 h-4 text-slate-400" />

                        {v.lastService}

                      </div>

                    </td>


                    <td className="px-6 py-4 text-sm text-slate-600">

                      <div className="flex items-center gap-2">

                        <Calendar className="w-4 h-4 text-slate-400" />

                        {v.nextServiceDue}

                      </div>

                    </td>


                    <td className="px-6 py-4">

                      <span
                        className={cn(

                          "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase",

                          status === "On Track"

                            ? "bg-emerald-100 text-emerald-700"

                            : status === "Upcoming"

                            ? "bg-blue-100 text-blue-700"

                            : status === "Overdue"

                            ? "bg-rose-100 text-rose-700"

                            : "bg-amber-100 text-amber-700"

                        )}
                      >

                        {status}

                      </span>

                    </td>

                  </tr>

                );

              })}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );
}


// Keep your existing cn import if you already have one
// Example:
// import { cn } from "@/lib/utils";
function BloodBankDashboard() {
  // =========================================================
  // STATE
  // =========================================================

  const [bloodStorage, setBloodStorage] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  const [selectedBloodType, setSelectedBloodType] =
    useState("O Positive");

  const [quantity, setQuantity] = useState("");

  const [action, setAction] = useState("Donation");

  const [loading, setLoading] = useState(false);

  // =========================================================
  // FIXED BLOOD GROUP ORDER
  // =========================================================

  const bloodTypes = [
    "O Positive",
    "O Negative",
    "A Positive",
    "A Negative",
    "B Positive",
    "B Negative",
    "AB Positive",
    "AB Negative",
  ];

  // =========================================================
  // LOAD DASHBOARD DATA
  // =========================================================

  const loadDashboard = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/blood-bank/dashboard"
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch blood bank data"
        );
      }

      const data = await response.json();

      console.log(
        "Blood Bank Dashboard:",
        data
      );

      setBloodStorage(
        data.inventory || []
      );

      setTransactions(
        data.recentTransactions || []
      );
    } catch (error) {
      console.error(
        "Blood Bank Error:",
        error
      );
    }
  };

  // =========================================================
  // LOAD DATA WHEN PAGE OPENS
  // =========================================================

  useEffect(() => {
    loadDashboard();
  }, []);

  // =========================================================
  // UPDATE INVENTORY
  // =========================================================

  const handleUpdateInventory = async () => {
    if (
      !quantity ||
      Number(quantity) <= 0
    ) {
      alert("Please enter a valid quantity");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/blood-bank/records",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            bloodType: selectedBloodType,
            quantity: Number(quantity),
            action: action,
          }),
        }
      );

      if (!response.ok) {
        const errorMessage =
          await response.text();

        throw new Error(
          errorMessage ||
            "Failed to update inventory"
        );
      }

      // Clear quantity
      setQuantity("");

      // Reload latest inventory and transactions
      await loadDashboard();

      alert(
        action === "Donation"
          ? "Blood added successfully!"
          : "Blood usage recorded successfully!"
      );
    } catch (error) {
      console.error(
        "Inventory update error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to update inventory"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // RETURN
  // =========================================================

  return (
    <div
      className="
        w-full
        max-w-full
        min-w-0
        overflow-x-hidden
        space-y-8
      "
    >

      {/* =====================================================
          BLOOD INVENTORY
          ONLY THIS SECTION CAN SCROLL HORIZONTALLY
          ===================================================== */}

      <section
        className="
          w-full
          max-w-full
          min-w-0
          overflow-hidden
        "
      >

        <div
          className="
            w-full
            max-w-full
            min-w-0
            overflow-x-auto
            overflow-y-hidden
            pb-4
          "
        >

          <div
            className="
              flex
              gap-5
              w-max
            "
          >

            {bloodTypes.map(
              (bloodType) => {

                // Find existing blood group
                const blood =
                  bloodStorage.find(
                    (item) =>
                      (item.type ||
                        item.bloodType) ===
                      bloodType
                  );

                // Current units
                const units =
                  blood?.units ?? 0;

                // Status
                const status =
                  units >= 20
                    ? "Optimal"
                    : units >= 10
                    ? "Stable"
                    : units > 0
                    ? "Low"
                    : "Critical";

                // Status badge
                const statusClass =
                  status === "Optimal"
                    ? "bg-emerald-100 text-emerald-700"
                    : status === "Stable"
                    ? "bg-blue-100 text-blue-700"
                    : status === "Low"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-rose-100 text-rose-700";

                // Progress bar
                const progressClass =
                  status === "Optimal"
                    ? "bg-emerald-500"
                    : status === "Stable"
                    ? "bg-blue-500"
                    : status === "Low"
                    ? "bg-amber-500"
                    : "bg-rose-500";

                return (
                  <div
                    key={bloodType}
                    className="
                      w-[250px]
                      min-w-[250px]
                      max-w-[250px]
                      flex-shrink-0
                      bg-white
                      p-6
                      rounded-2xl
                      shadow-sm
                      border
                      border-slate-100
                    "
                  >

                    {/* ICON + STATUS */}

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        mb-4
                      "
                    >

                      <div
                        className="
                          bg-rose-100
                          p-3
                          rounded-xl
                          text-rose-600
                        "
                      >
                        <Droplet
                          className="
                            w-6
                            h-6
                            fill-current
                          "
                        />
                      </div>

                      <span
                        className={`
                          text-[10px]
                          font-bold
                          px-2
                          py-1
                          rounded-lg
                          uppercase
                          ${statusClass}
                        `}
                      >
                        {status}
                      </span>

                    </div>

                    {/* BLOOD TYPE */}

                    <h3
                      className="
                        text-slate-900
                        font-bold
                      "
                    >
                      {bloodType}
                    </h3>

                    {/* UNITS */}

                    <div className="mt-4">

                      <p
                        className="
                          text-2xl
                          font-bold
                          text-slate-900
                        "
                      >
                        {units} Units
                      </p>

                      {/* PROGRESS BAR */}

                      <div
                        className="
                          mt-2
                          h-2
                          bg-slate-100
                          rounded-full
                          overflow-hidden
                        "
                      >

                        <div
                          className={`
                            h-full
                            transition-all
                            duration-500
                            ${progressClass}
                          `}
                          style={{
                            width: `${Math.min(
                              (units / 30) * 100,
                              100
                            )}%`,
                          }}
                        />

                      </div>

                    </div>

                  </div>
                );
              }
            )}

          </div>

        </div>

      </section>


      {/* =====================================================
          RECENT DONATIONS + ADD NEW RECORD
          
          IMPORTANT:
          This section itself DOES NOT scroll horizontally.
          ===================================================== */}

      <section
        className="
          w-full
          max-w-full
          min-w-0
          grid
          grid-cols-1
          lg:grid-cols-[minmax(0,1fr)_280px]
          gap-6
          items-start
          overflow-hidden
        "
      >

        {/* ===================================================
            RECENT DONATIONS & USAGE
            =================================================== */}

        <div
          className="
            w-full
            min-w-0
            max-w-full
            bg-white
            rounded-2xl
            shadow-sm
            border
            border-slate-100
            overflow-hidden
          "
        >

          {/* HEADER */}

          <div
            className="
              p-6
              border-b
              border-slate-100
              flex
              items-center
              justify-between
              gap-4
            "
          >

            <h2
              className="
                text-xl
                font-bold
                text-slate-900
                flex
                items-center
                gap-2
                min-w-0
              "
            >

              <History
                className="
                  w-5
                  h-5
                  text-rose-500
                  flex-shrink-0
                "
              />

              <span className="truncate">
                Recent Donations & Usage
              </span>

            </h2>

            <button
              type="button"
              className="
                text-primary
                text-sm
                font-bold
                hover:underline
                flex-shrink-0
              "
            >
              View Full Log
            </button>

          </div>


          {/* TABLE */}

          <div
            className="
              w-full
              min-w-0
              max-w-full
              overflow-hidden
            "
          >

            <table
              className="
                w-full
                max-w-full
                table-fixed
                text-left
              "
            >

              <thead>

                <tr
                  className="
                    bg-slate-50/50
                  "
                >

                  <th
                    className="
                      w-1/4
                      px-4
                      py-4
                      text-xs
                      font-bold
                      text-slate-500
                      uppercase
                    "
                  >
                    Type
                  </th>

                  <th
                    className="
                      w-1/4
                      px-4
                      py-4
                      text-xs
                      font-bold
                      text-slate-500
                      uppercase
                    "
                  >
                    Action
                  </th>

                  <th
                    className="
                      w-1/4
                      px-4
                      py-4
                      text-xs
                      font-bold
                      text-slate-500
                      uppercase
                    "
                  >
                    Quantity
                  </th>

                  <th
                    className="
                      w-1/4
                      px-4
                      py-4
                      text-xs
                      font-bold
                      text-slate-500
                      uppercase
                    "
                  >
                    Date
                  </th>

                </tr>

              </thead>


              <tbody
                className="
                  divide-y
                  divide-slate-100
                "
              >

                {transactions.length === 0 ? (

                  <tr>

                    <td
                      colSpan={4}
                      className="
                        px-4
                        py-8
                        text-center
                        text-sm
                        text-slate-500
                      "
                    >
                      No transactions found
                    </td>

                  </tr>

                ) : (

                  transactions.map(
                    (log, index) => {

                      const isDonation =
                        log.action ===
                        "Donation";

                      return (
                        <tr
                          key={index}
                          className="
                            hover:bg-slate-50
                            transition-colors
                          "
                        >

                          <td
                            className="
                              px-4
                              py-4
                              text-sm
                              font-bold
                              text-slate-900
                              truncate
                            "
                          >
                            {log.type ||
                              log.bloodType ||
                              "-"}
                          </td>

                          <td
                            className="
                              px-4
                              py-4
                              text-sm
                              text-slate-600
                              truncate
                            "
                          >
                            {log.action ||
                              "-"}
                          </td>

                          <td
                            className={`
                              px-4
                              py-4
                              text-sm
                              font-bold
                              truncate
                              ${
                                isDonation
                                  ? "text-emerald-600"
                                  : "text-rose-600"
                              }
                            `}
                          >
                            {isDonation
                              ? "+"
                              : "-"}
                            {log.quantity ??
                              log.qty ??
                              0}{" "}
                            Units
                          </td>

                          <td
                            className="
                              px-4
                              py-4
                              text-sm
                              text-slate-500
                              truncate
                            "
                          >
                            {log.date ||
                              log.createdAt ||
                              log.transactionDate ||
                              "-"}
                          </td>

                        </tr>
                      );
                    }
                  )

                )}

              </tbody>

            </table>

          </div>

        </div>


        {/* ===================================================
            ADD NEW RECORD
            =================================================== */}

        <div
          className="
            w-full
            min-w-0
            max-w-full
            bg-white
            p-5
            rounded-2xl
            shadow-sm
            border
            border-slate-100
            overflow-hidden
          "
        >

          {/* HEADER */}

          <div
            className="
              flex
              items-center
              gap-3
              mb-5
            "
          >

            <div
              className="
                w-10
                h-10
                flex
                items-center
                justify-center
                rounded-xl
                bg-rose-50
                text-rose-500
                flex-shrink-0
              "
            >
              <Plus className="w-5 h-5" />
            </div>

            <div
              className="
                min-w-0
              "
            >

              <h2
                className="
                  text-lg
                  font-bold
                  text-slate-900
                  truncate
                "
              >
                Add New Record
              </h2>

              <p
                className="
                  text-xs
                  text-slate-500
                  mt-1
                  truncate
                "
              >
                Update blood inventory
              </p>

            </div>

          </div>


          {/* FORM */}

          <div className="space-y-4">

            {/* BLOOD TYPE */}

            <div
              className="
                w-full
                min-w-0
              "
            >

              <label
                className="
                  block
                  text-xs
                  font-bold
                  text-slate-500
                  uppercase
                  mb-2
                "
              >
                Blood Type
              </label>

              <select
                value={selectedBloodType}
                onChange={(e) =>
                  setSelectedBloodType(
                    e.target.value
                  )
                }
                className="
                  block
                  w-full
                  min-w-0
                  max-w-full
                  h-11
                  bg-slate-50
                  border
                  border-slate-100
                  rounded-xl
                  px-3
                  text-sm
                  text-slate-700
                  outline-none
                  focus:border-rose-300
                  focus:ring-2
                  focus:ring-rose-100
                "
              >

                {bloodTypes.map(
                  (bloodType) => (
                    <option
                      key={bloodType}
                      value={bloodType}
                    >
                      {bloodType}
                    </option>
                  )
                )}

              </select>

            </div>


            {/* QUANTITY */}

            <div
              className="
                w-full
                min-w-0
              "
            >

              <label
                className="
                  block
                  text-xs
                  font-bold
                  text-slate-500
                  uppercase
                  mb-2
                "
              >
                Quantity (Units)
              </label>

              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) =>
                  setQuantity(
                    e.target.value
                  )
                }
                placeholder="Enter units..."
                className="
                  block
                  w-full
                  min-w-0
                  max-w-full
                  h-11
                  bg-slate-50
                  border
                  border-slate-100
                  rounded-xl
                  px-3
                  text-sm
                  text-slate-700
                  outline-none
                  focus:border-rose-300
                  focus:ring-2
                  focus:ring-rose-100
                "
              />

            </div>


            {/* ACTION TYPE */}

            <div
              className="
                w-full
                min-w-0
              "
            >

              <label
                className="
                  block
                  text-xs
                  font-bold
                  text-slate-500
                  uppercase
                  mb-2
                "
              >
                Action Type
              </label>

              <div
                className="
                  grid
                  grid-cols-2
                  gap-2
                  w-full
                  min-w-0
                "
              >

                {/* DONATION */}

                <button
                  type="button"
                  onClick={() =>
                    setAction(
                      "Donation"
                    )
                  }
                  className={`
                    min-w-0
                    h-10
                    rounded-xl
                    text-xs
                    font-bold
                    border
                    transition-all
                    ${
                      action ===
                      "Donation"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                        : "bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100"
                    }
                  `}
                >
                  Donation
                </button>


                {/* USAGE */}

                <button
                  type="button"
                  onClick={() =>
                    setAction("Usage")
                  }
                  className={`
                    min-w-0
                    h-10
                    rounded-xl
                    text-xs
                    font-bold
                    border
                    transition-all
                    ${
                      action === "Usage"
                        ? "bg-rose-50 text-rose-700 border-rose-300"
                        : "bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100"
                    }
                  `}
                >
                  Usage
                </button>

              </div>

            </div>


            {/* UPDATE BUTTON */}

            <button
              type="button"
              onClick={
                handleUpdateInventory
              }
              disabled={loading}
              className="
                block
                w-full
                min-w-0
                max-w-full
                h-11
                mt-2
                bg-slate-900
                text-white
                rounded-xl
                font-bold
                text-sm
                hover:bg-slate-800
                transition-all
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >

              {loading
                ? "Updating..."
                : "Update Inventory"}

            </button>

          </div>

        </div>

      </section>

    </div>
  );
}
function EssentialsDashboard() {

  const [essentialNeeds, setEssentialNeeds] = useState<any>(null);

  useEffect(() => {

    fetch("http://localhost:8080/api/essential-needs")
      .then(response => {

        if (!response.ok) {
          throw new Error("Failed to fetch essential needs");
        }

        return response.json();
      })
      .then(data => {

        console.log("Essential Needs Data:", data);

        setEssentialNeeds(data);

      })
      .catch(error => {

        console.error(
          "Essential Needs Error:",
          error
        );

      });

  }, []);


  // Loading state
  if (!essentialNeeds) {
    return (
      <div className="flex items-center justify-center p-10">
        <p className="text-slate-500">
          Loading essential needs...
        </p>
      </div>
    );
  }


  return (

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">


      {/* ================================= */}
      {/* WATER SUPPLY */}
      {/* ================================= */}

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">

        <div className="flex items-center gap-3 mb-6">

          <div className="bg-blue-100 p-3 rounded-xl text-blue-600">

            <Droplets className="w-6 h-6" />

          </div>

          <h2 className="text-xl font-bold text-slate-900">
            Water Supply
          </h2>

        </div>


        <div className="space-y-6">

          {/* Water Tank */}

          <div className="relative h-48 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">

            <div
              className="absolute bottom-0 left-0 w-full bg-blue-400/30 animate-pulse"
              style={{
                height: `${essentialNeeds.waterLevel}%`
              }}
            ></div>


            <div className="absolute inset-0 flex flex-col items-center justify-center">

              <p className="text-4xl font-bold text-slate-900">

                {essentialNeeds.waterLevel}%

              </p>

              <p className="text-xs font-bold text-slate-500 uppercase">

                Main Tank Level

              </p>

            </div>

          </div>


          {/* Daily Consumption */}

          <div className="flex justify-between text-sm">

            <span className="text-slate-500">
              Daily Consumption
            </span>

            <span className="font-bold text-slate-900">

              {essentialNeeds.dailyWaterConsumption.toLocaleString()} L

            </span>

          </div>

        </div>

      </div>



      {/* ================================= */}
      {/* OXYGEN LEVELS */}
      {/* ================================= */}

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">

        <div className="flex items-center gap-3 mb-6">

          <div className="bg-rose-100 p-3 rounded-xl text-rose-600">

            <Wind className="w-6 h-6" />

          </div>

          <h2 className="text-xl font-bold text-slate-900">
            Oxygen Levels
          </h2>

        </div>


        <div className="space-y-6">


          {/* Central Reservoir */}

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">

            <div className="flex justify-between items-center mb-4">

              <span className="text-sm font-bold text-slate-700">
                Central Reservoir
              </span>

              <span className="text-emerald-600 font-bold">
                Stable
              </span>

            </div>


            {/* Oxygen Progress */}

            <div className="h-4 bg-slate-200 rounded-full overflow-hidden">

              <div
                className="h-full bg-rose-500"
                style={{
                  width: `${essentialNeeds.oxygenLevel}%`
                }}
              ></div>

            </div>


            <p className="mt-2 text-right text-xs font-bold text-slate-500">

              {essentialNeeds.oxygenLevel}% Capacity

            </p>

          </div>


          {/* Cylinders */}

          <div className="grid grid-cols-2 gap-4">

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">

              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                Cylinders
              </p>

              <p className="text-lg font-bold text-slate-900">

                {essentialNeeds.oxygenCylinders}

              </p>

            </div>


            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">

              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                Backup
              </p>

              <p className="text-lg font-bold text-slate-900">

                {essentialNeeds.backupCylinders}

              </p>

            </div>

          </div>

        </div>

      </div>



      {/* ================================= */}
      {/* POWER MANAGEMENT */}
      {/* ================================= */}

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">

        <div className="flex items-center gap-3 mb-6">

          <div className="bg-amber-100 p-3 rounded-xl text-amber-600">

            <Battery className="w-6 h-6" />

          </div>

          <h2 className="text-xl font-bold text-slate-900">
            Power Management
          </h2>

        </div>


        <div className="space-y-6">


          {/* Main Grid */}

          <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded-xl">

            <div className="flex items-center gap-2">

              <Zap className="w-4 h-4 text-emerald-600" />

              <span className="text-sm font-bold text-emerald-700">

                Main Grid {essentialNeeds.mainGridStatus}

              </span>

            </div>


            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>

          </div>


          {/* Power Details */}

          <div className="space-y-4">


            {/* Generator */}

            <div className="flex justify-between items-center">

              <span className="text-sm text-slate-600">
                Generator 1 Status
              </span>

              <span className="text-xs font-bold text-slate-500 uppercase">

                {essentialNeeds.generatorStatus}

              </span>

            </div>


            {/* Fuel */}

            <div className="flex justify-between items-center">

              <span className="text-sm text-slate-600">
                Fuel Level
              </span>

              <span className="text-xs font-bold text-slate-900">

                {essentialNeeds.fuelLevel}%

              </span>

            </div>


            {/* UPS */}

            <div className="flex justify-between items-center">

              <span className="text-sm text-slate-600">
                UPS Battery
              </span>

              <span className="text-xs font-bold text-emerald-600">

                {essentialNeeds.upsBattery}%

              </span>

            </div>

          </div>


          {/* Diagnostics */}

          <button className="w-full mt-4 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">

            System Diagnostics

            <ArrowRight className="w-4 h-4" />

          </button>

        </div>

      </div>

    </div>

  );
}