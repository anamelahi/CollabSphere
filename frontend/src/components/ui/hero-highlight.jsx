"use client";
import { motion } from "framer-motion";
import "../../App.css"

export const HeroHighlight = () => {
  return (
    <div className=" hero flex items-end
 justify-center  text-white">
      {/* Main Text */}
      <h1 className="text-5xl font-bold text-center">
        Welcome to{" "}
        <motion.span
          initial={{ backgroundSize: "0% 100%" }}
          animate={{ backgroundSize: "100% 100%" }}
          transition={{ duration: 2, ease: "linear", delay: 0.5 }}
          style={{
            backgroundRepeat: "no-repeat",
            backgroundPosition: "left center",
            display: "inline",
          }}
          className="px-2 rounded-lg bg-gradient-to-r from-indigo-300 to-purple-300 dark:from-indigo-500 dark:to-purple-500"
        >
            <span className="text-white">
                CollabSphere
            </span>
        </motion.span>
      </h1>
    </div>
  );
};
