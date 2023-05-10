import React from 'react'
import styles from "./ServiceCard.module.css"

function ServiceCard({ name, duration, price }) {
    return (
      <div>
        <h2>Corte de caballero</h2>
        <p>Duration: {duration}</p>
        <p>Price: {price}</p>
      </div>
    );
  }

export default ServiceCard