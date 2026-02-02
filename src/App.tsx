import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Center, Loader, MantineProvider, Stack, Text } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { theme } from "./theme/theme";
import { ScenarioProvider } from "./context/ScenarioContext";
import { Layout } from "./components/Layout";

const Home = lazy(() =>
  import("./routes/Home").then((module) => ({ default: module.Home })),
);
const Scenarios = lazy(() =>
  import("./routes/Scenarios").then((module) => ({
    default: module.Scenarios,
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
  return (
    <MantineProvider theme={theme}>
      <Notifications position="top-center" />
      <ScenarioProvider>
        <Layout>
          <Suspense fallback={<RouteFallback />}>
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
          </Suspense>
        </Layout>
      </ScenarioProvider>
    </MantineProvider>
  );
}

export default App;
