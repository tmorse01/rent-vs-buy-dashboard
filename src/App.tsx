import { Routes, Route } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { theme } from "./theme/theme";
import { ScenarioProvider } from "./context/ScenarioContext";
import { Layout } from "./components/Layout";
import { Home } from "./routes/Home";
import { Scenarios } from "./routes/Scenarios";
import { About } from "./routes/About";

function App() {
  return (
    <MantineProvider theme={theme}>
      <Notifications position="top-center" />
      <ScenarioProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/scenarios" element={<Scenarios />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Layout>
      </ScenarioProvider>
    </MantineProvider>
  );
}

export default App;
