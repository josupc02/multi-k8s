import React, { useEffect, useState } from "react";

import axios from "axios";

const Fib = () => {
  const [index, setIndex] = useState("");
  const [values, setValues] = useState({});
  const [indexes, setIndexes] = useState([]);

  const fetchValues = async () => {
    const values = await axios.get("/api/values/current");
    console.log(values);
    setValues(values.data);
  };

  const fetchIndexes = async () => {
    const indexes = await axios.get("/api/values/all");
    console.log(indexes)
    setIndexes(indexes.data);
  };

  useEffect(() => {
    fetchValues();
    fetchIndexes();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    await axios.post("/api/values", {
      index: index,
    });
    setIndex("");
  };

  const renderSeenIndexes = () => {
    return indexes.map(({ number }) => number).join(",");
  };

  const renderValues = () => {
    const entries = [];
    console.log(values);
    for (let key in values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {values[key]}
        </div>
      );
    }
    return entries;
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <label> Enter your index: </label>
        <input value={index} onChange={(e) => setIndex(e.target.value)} />
        <button> Submit </button>
      </form>
      <h3> Indexes I have seen: </h3>
      {renderSeenIndexes()}
      <h3> Calculated values:</h3>
      {renderValues()}
    </div>
  );
};

export default Fib;
