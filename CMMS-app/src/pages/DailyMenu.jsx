import React, { useState } from "react";
import { motion } from "framer-motion";
import NavBar from "../components/utils/NavBar";
import { Coffee, UtensilsCrossed, Soup, Moon } from "lucide-react";

export default function DailyMenu() {

  const navLinks = [
    { name: "Daily Menu", path: "/menu" },
    { name: "Extra Meals", path: "/page-2" },
    { name: "Leaves & Rebates", path: "/page-3" },
  ];

  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  const [selectedDay, setSelectedDay] = useState("Monday");

  const weeklyMenu = {
    Monday: [
      { title: "Breakfast", items: "Poha, Bread, Tea, Banana", icon: Coffee, color: "from-yellow-400 to-orange-400" },
      { title: "Lunch", items: "Rice, Dal, Paneer, Roti, Salad", icon: UtensilsCrossed, color: "from-blue-500 to-indigo-500" },
      { title: "Snacks", items: "Samosa, Tea", icon: Soup, color: "from-purple-500 to-fuchsia-500" },
      { title: "Dinner", items: "Roti, Sabji, Dal, Rice", icon: Moon, color: "from-emerald-500 to-teal-500" }
    ],
    Tuesday: [
      { title: "Breakfast", items: "Upma, Bread, Milk", icon: Coffee, color: "from-yellow-400 to-orange-400" },
      { title: "Lunch", items: "Rice, Rajma, Roti, Salad", icon: UtensilsCrossed, color: "from-blue-500 to-indigo-500" },
      { title: "Snacks", items: "Bread Pakora, Tea", icon: Soup, color: "from-purple-500 to-fuchsia-500" },
      { title: "Dinner", items: "Roti, Mix Veg, Dal, Rice", icon: Moon, color: "from-emerald-500 to-teal-500" }
    ],
    Wednesday: [
      { title: "Breakfast", items: "Aloo Paratha, Curd, Tea", icon: Coffee, color: "from-yellow-400 to-orange-400" },
      { title: "Lunch", items: "Rice, Chole, Roti, Salad", icon: UtensilsCrossed, color: "from-blue-500 to-indigo-500" },
      { title: "Snacks", items: "Maggi, Tea", icon: Soup, color: "from-purple-500 to-fuchsia-500" },
      { title: "Dinner", items: "Roti, Paneer Curry, Dal, Rice", icon: Moon, color: "from-emerald-500 to-teal-500" }
    ],
    Thursday: [
      { title: "Breakfast", items: "Idli, Sambhar, Tea", icon: Coffee, color: "from-yellow-400 to-orange-400" },
      { title: "Lunch", items: "Rice, Dal Fry, Roti, Salad", icon: UtensilsCrossed, color: "from-blue-500 to-indigo-500" },
      { title: "Snacks", items: "Biscuits, Tea", icon: Soup, color: "from-purple-500 to-fuchsia-500" },
      { title: "Dinner", items: "Roti, Aloo Gobhi, Dal, Rice", icon: Moon, color: "from-emerald-500 to-teal-500" }
    ],
    Friday: [
      { title: "Breakfast", items: "Sandwich, Milk, Tea", icon: Coffee, color: "from-yellow-400 to-orange-400" },
      { title: "Lunch", items: "Rice, Kadhi, Roti, Salad", icon: UtensilsCrossed, color: "from-blue-500 to-indigo-500" },
      { title: "Snacks", items: "Samosa, Tea", icon: Soup, color: "from-purple-500 to-fuchsia-500" },
      { title: "Dinner", items: "Roti, Dal Makhani, Rice", icon: Moon, color: "from-emerald-500 to-teal-500" }
    ],
    Saturday: [
      { title: "Breakfast", items: "Puri Sabji, Tea", icon: Coffee, color: "from-yellow-400 to-orange-400" },
      { title: "Lunch", items: "Rice, Chole, Roti", icon: UtensilsCrossed, color: "from-blue-500 to-indigo-500" },
      { title: "Snacks", items: "Bread Roll, Tea", icon: Soup, color: "from-purple-500 to-fuchsia-500" },
      { title: "Dinner", items: "Roti, Mix Veg, Dal, Rice", icon: Moon, color: "from-emerald-500 to-teal-500" }
    ],
    Sunday: [
      { title: "Breakfast", items: "Dosa, Sambhar, Tea", icon: Coffee, color: "from-yellow-400 to-orange-400" },
      { title: "Lunch", items: "Rice, Paneer, Roti, Salad", icon: UtensilsCrossed, color: "from-blue-500 to-indigo-500" },
      { title: "Snacks", items: "Cutlet, Tea", icon: Soup, color: "from-purple-500 to-fuchsia-500" },
      { title: "Dinner", items: "Roti, Dal, Rice, Sweet", icon: Moon, color: "from-emerald-500 to-teal-500" }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 relative overflow-hidden">

      <NavBar navLinks={navLinks} />

      {/* Background blobs */}
      <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-indigo-300/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-300/20 rounded-full blur-[100px] pointer-events-none" />

      <main className="flex-grow flex flex-col items-center px-4 py-12 relative z-10">

        <div className="max-w-[1000px] w-full space-y-10">

          {/* Title */}
          <motion.div
            initial={{ y:20, opacity:0 }}
            animate={{ y:0, opacity:1 }}
            transition={{ duration:0.6 }}
          >
            <h1 className="text-4xl font-bold text-center">
              Weekly Mess Menu
            </h1>
            <p className="text-center text-slate-500 mt-2">
              Select a day to view the meals served
            </p>
          </motion.div>

          {/* Day Tabs */}
          <div className="flex flex-wrap justify-center gap-3">

            {days.map((day)=>(
              <button
                key={day}
                onClick={()=>setSelectedDay(day)}
                className={`px-4 py-2 rounded-xl font-medium transition
                ${selectedDay===day
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-white text-slate-600 border hover:bg-indigo-50"}`}
              >
                {day}
              </button>
            ))}

          </div>

          {/* Menu Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {weeklyMenu[selectedDay].map((meal,index)=>{

              const Icon = meal.icon;

              return(

                <motion.div
                  key={index}
                  whileHover={{ y:-8, scale:1.02 }}
                  className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 border border-slate-100 shadow-lg hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 flex flex-col gap-4"
                >

                  <div className="flex items-center gap-4">

                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${meal.color}`}>
                      <Icon className="text-white w-6 h-6"/>
                    </div>

                    <h2 className="text-xl font-bold">
                      {meal.title}
                    </h2>

                  </div>

                  <p className="text-slate-600">
                    {meal.items}
                  </p>

                </motion.div>

              )

            })}

          </div>

        </div>

      </main>

    </div>
  );
}