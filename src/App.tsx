import { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import {
  Center,
  Loader,
  MantineProvider,
  Stack,
  Text,
  localStorageColorSchemeManager,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { theme } from "./theme/theme";
import { ScenarioProvider } from "./context/ScenarioContext";
import { UserProfileProvider } from "./context/UserProfileContext";
import { Layout } from "./components/Layout";

const colorSchemeManager = localStorageColorSchemeManager({
  key: "rvb-color-scheme",
});

const Landing = lazy(() =>
  import("./routes/Landing").then((module) => ({
    default: module.Landing,
  })),
);

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
const Profile = lazy(() =>
  import("./routes/Profile").then((module) => ({ default: module.Profile })),
);
const Settings = lazy(() =>
  import("./routes/Settings").then((module) => ({
    default: module.Settings,
  })),
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
    <MantineProvider
      theme={theme}
      colorSchemeManager={colorSchemeManager}
      defaultColorScheme="auto"
    >
      <Notifications position="top-center" />
      <UserProfileProvider>
        <ScenarioProvider>
          <Layout>
            <Suspense fallback={<RouteFallback />}>
              <div className="route-transition" key={location.pathname}>
                <Routes location={location}>
                  <Route path="/" element={<Landing />} />
                  <Route path="/dashboard" element={<Home />} />
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
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route
                    path="/about"
                    element={<Navigate to="/docs/overview" replace />}
                  />
                </Routes>
              </div>
            </Suspense>
          </Layout>
        </ScenarioProvider>
      </UserProfileProvider>
    </MantineProvider>
  );
}

export default App;
