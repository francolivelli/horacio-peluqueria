import React from "react";
import styles from "./Services.module.css";
import { BsScissors } from "react-icons/bs";
import ServiceCard from "@/app/commons/ServiceCard/ServiceCard";

const Services = () => {
  return (
    <div className="container">
      <h1 className="title">
        <BsScissors className="icon" />
        Servicios
      </h1>
      <div className={styles.list}>
        <ServiceCard />
      </div>
    </div>
  );
};

export default Services;
