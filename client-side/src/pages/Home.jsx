import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import CardContent from "../components/CardContent";

function Home() {
  return (
    <>
      <div className="w-screen h-full flex justify-between bg-slate-50">
        <div className="w-1/4">
          <Sidebar />
        </div>
        <div className="w-3/4 px-32">
          <CardContent />
        </div>
      </div>
    </>
  );
}

export default Home;
