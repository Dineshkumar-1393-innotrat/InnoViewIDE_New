import React, { useState, useEffect } from "react";
import "./SensorTable.css";

const SensorTable = ({ data, deviceID }) => {
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  // Extract all unique sensor keys (excluding device metadata)
  const sensorKeys =
    filteredData.length > 0
      ? Object.keys(filteredData[0]).filter(
          (key) => !["deviceID", "productID", "timestamp"].includes(key)
        )
      : [];

  return (
    <div className="sensor-table-container">
      <h5 className="device-header">{`DeviceID: ${deviceID}`}</h5>
      <div className="table-wrapper">
        <table className="sensor-table">
          <thead>
            <tr>
              {sensorKeys.map((sensorKey) => (
                <th key={sensorKey}>{sensorKey}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {sensorKeys.map((sensorKey, colIndex) => {
                  const sensorData = row[sensorKey];
                  let displayValue = "-";

                  console.log("sensor data:", sensorData);

                  if (typeof sensorData === "object" && sensorData !== null) {
                    if (sensorKey.toLowerCase() === "led") {
                      // If the component is an LED, use the state instead of value
                      displayValue = sensorData.state || "-";
                    } else if (
                      sensorData.type === "switch" ||
                      sensorData.type === "audio components"
                    ) {
                      displayValue =
                        sensorData.state || sensorData.status || "-";
                    } else if (
                      sensorData.x !== undefined &&
                      sensorData.y !== undefined &&
                      sensorData.z !== undefined
                    ) {
                      displayValue = `X: ${sensorData.x.toFixed(
                        2
                      )}, Y: ${sensorData.y.toFixed(
                        2
                      )}, Z: ${sensorData.z.toFixed(2)}`;
                    } else {
                      displayValue =
                        sensorData.value !== undefined
                          ? `${Number(sensorData.value).toFixed(2)} ${
                              sensorData.unit || "N/A"
                            }`
                          : "-";
                    }
                  } else {
                    displayValue = sensorData || "-";
                  }

                  return <td key={colIndex}>{displayValue}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SensorTable;
