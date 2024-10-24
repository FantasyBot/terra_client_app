import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import axios from "axios";

type Item = {
  id: number;
  name: string;
  price: number;
};

function App() {
  const [data, setData] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/items`);
      console.log("data => ", response.data);
      setData(response.data);
    } catch (error) {
      console.log("Error while fetching data => ", error);
      setError(`Error fetching data: ${JSON.stringify(error)}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <div>
        <img src={reactLogo} className="logo react" alt="React logo" />
      </div>
      <h1>Vite + React App</h1>
      <h3>Items: </h3>
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            <strong>{item.name}</strong> - ${item.price.toFixed(2)}
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
