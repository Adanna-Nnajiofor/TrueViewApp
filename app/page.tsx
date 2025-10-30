import About from "@/components/About";
import Contact from "@/components/Contact";
import HomePage from "@/components/Home";
import ListingsPage from "@/components/Listings";
import PortfolioPage from "@/components/Portfolio";
import ServicesPage from "@/components/Services";
import React from "react";

const page = () => {
  return (
    <div>
      <div>
        <HomePage />
      </div>
      <div>
        <About />
      </div>
      <div>
        <ServicesPage />
      </div>
      <div>
        <ListingsPage />
      </div>
      <div>
        <PortfolioPage />
      </div>
      <div>
        <Contact />
      </div>
    </div>
  );
};

export default page;
