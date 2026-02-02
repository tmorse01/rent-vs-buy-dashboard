import { Routes, Route, Navigate } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { theme } from "./theme/theme";
import { ScenarioProvider } from "./context/ScenarioContext";
import { Layout } from "./components/Layout";
import { Home } from "./routes/Home";
import { Scenarios } from "./routes/Scenarios";
import { Docs } from "./routes/Docs";

function App() {
  return (
    <MantineProvider theme={theme}>
      <Notifications position="top-center" />
      <ScenarioProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/scenarios" element={<Scenarios />} />
            <Route path="/docs/:page" element={<Docs />} />
            <Route
              path="/docs"
              element={<Navigate to="/docs/overview" replace />}
            />
            <Route
              path="/about"
              element={<Navigate to="/docs/overview" replace />}
            />
          </Routes>
        </Layout>
      </ScenarioProvider>
    </MantineProvider>
  );
}

export default App;
