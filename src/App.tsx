import { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Center, Loader, MantineProvider, Stack, Text } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { theme } from "./theme/theme";
import { ScenarioProvider } from "./context/ScenarioContext";
import { Layout } from "./components/Layout";

const Home = lazy(() =>
  import("./routes/Home").then((module) => ({ default: module.Home })),
);
const Scenarios = lazy(() =>
  import("./routes/ScenarioCompare").then((module) => ({
    default: module.ScenarioCompare,
  })),
);
const Docs = lazy(() =>
  import("./routes/Docs").then((module) => ({ default: module.Docs })),
);

function RouteFallback() {
  return (
    <Center py="xl" style={{ minHeight: "calc(100vh - 56px)", width: "100%" }}>
      <Stack align="center" gap="xs">
        <Loader size="sm" />
        <Text size="sm" c="dimmed">
          Loading dashboard...
        </Text>
      </Stack>
    </Center>
  );
}

function App() {
  const location = useLocation();

  return (
    <MantineProvider theme={theme}>
      <Notifications position="top-center" />
      <ScenarioProvider>
        <Layout>
          <Suspense fallback={<RouteFallback />}>
            <div className="route-transition" key={location.pathname}>
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/scenarios" element={<Scenarios />} />
                <Route
                  path="/scenarios/compare"
                  element={<Navigate to="/scenarios" replace />}
                />
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
            </div>
          </Suspense>
        </Layout>
      </ScenarioProvider>
    </MantineProvider>
  );
}

export default App;
