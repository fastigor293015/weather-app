import Forecast from "./components/sections/Forecast";
import Sidebar from "./components/sections/Sidebar";
import TodayDetails from "./components/sections/TodayDetails";

function App() {
  return (
    <main className="main">
      <Sidebar />

      <div className="main__container">
        <div className="container">
          <Forecast />
          <TodayDetails />
        </div>
      </div>
    </main>
  );
}

export default App;
