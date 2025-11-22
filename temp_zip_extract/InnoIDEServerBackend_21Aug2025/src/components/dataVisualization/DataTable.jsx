import React, { useEffect, useState } from "react";
import "./SensorTable.css";

import SensorTable from "./SensorTable";
import axios from "axios";
import { Heading, Center } from "@chakra-ui/react";
import { baseURL } from "../../utilities";

const data = [
  {
    productID: "67b2f025e4ce874e77a65458",
    deviceID: "52bdad6a-c241-4ef9-a292-5ecd47d66509",
    FlameSensor_flameIntensity: {
      type: "sensors",
      unit: "units",
      value: 948.3915245536696,
    },
    DHT11_temperature: {
      type: "sensors",
      unit: "°C",
      value: 30.27869676125956,
    },
    DHT11_humidity: {
      type: "sensors",
      unit: "%",
      value: 50.32744075605764,
    },
    "Toggle Switch": {
      type: "switch",
      state: "ON",
    },
  },
  {
    productID: "67b2f025e4ce874e77a65458",
    deviceID: "52bdad6a-c241-4ef9-a292-5ecd47d66509",
    FlameSensor_flameIntensity: {
      type: "sensors",
      unit: "units",
      value: 947.8396369002418,
    },
    DHT11_temperature: {
      type: "sensors",
      unit: "°C",
      value: 31.270719621493274,
    },
    DHT11_humidity: {
      type: "sensors",
      unit: "%",
      value: 49.48278437966394,
    },
    "Toggle Switch": {
      type: "switch",
      state: "ON",
    },
  },
];

export function groupByDeviceId(data) {
  if (!data) return;

  try {
    if (data.status === "error") {
      throw new Error(data.message);
    }

    console.log("data:", data);

    return data?.reduce((acc, item) => {
      if (!acc[item.deviceID]) {
        acc[item.deviceID] = [];
      }
      acc[item.deviceID].push(item);
      return acc;
    }, {});
  } catch (error) {
    if (window.confirm(`${error.message}\nClick OK to reload the page.`)) {
      window.location.reload(); // Reload the page on confirmation
    }
  }
}

const DataTable = ({ selectedProduct, selectedDevice, selectedName }) => {
  const [devicesData, setDevicesData] = useState([]);
  const [tableData, setTableData] = useState([]);

  // Update tableData whenever devicesData or selectedDevice changes
  useEffect(() => {
    if (!selectedDevice) return;

    const newData = groupByDeviceId(devicesData);
    setTableData(newData[selectedDevice] || []);
  }, [selectedDevice, devicesData]);

  useEffect(() => {
    if (!selectedProduct) return; // Ensure a product is selected

    const interval = 5000;
    const intervalId = setInterval(async () => {
      const payload = { productID: selectedProduct };

      try {
        await axios.post(`${baseURL}/generate_data`, payload);

        const response = await axios.post(
          `${baseURL}/get_data`,
          payload
        );

        console.log("Data fetched successfully:", response.data.data);

        // Set the fetched devices data
        setDevicesData(response.data.data);
      } catch (error) {
        console.log("Error generating data:", error.response);
        alert(error.response.data.message);
      }
    }, interval);

    return () => clearInterval(intervalId); // Clear interval on unmount
  }, [selectedProduct]);

  console.log("tableData", tableData);

  return (
    <div className="data-table-container">
      <Center>
        <Heading size="xl">{selectedName}</Heading>
      </Center>
      {console.log("device id", selectedDevice, tableData)}
      {tableData.length > 0 ? (
        <SensorTable
          data={tableData}
          deviceID={selectedDevice}
          productName="Fire Sensor"
        />
      ) : (
        <p>No data available for the selected device.</p>
      )}
    </div>
  );
};

export default DataTable;
