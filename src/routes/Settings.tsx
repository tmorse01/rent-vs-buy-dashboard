import { useRef, useState } from "react";
import {
  Button,
  Container,
  Divider,
  Group,
  Modal,
  Paper,
  SegmentedControl,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  clearAllScenarios,
  exportAllScenarios,
  importScenarios,
} from "../features/scenario/scenarioStorage";

const COLOR_SCHEME_OPTIONS = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
  { label: "Auto", value: "auto" },
];

export function Settings() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [clearModalOpen, setClearModalOpen] = useState(false);

  const handleExport = () => {
    const payload = exportAllScenarios();
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "rent-vs-buy-scenarios.json";
    link.click();
    URL.revokeObjectURL(url);

    notifications.show({
      title: "Scenarios exported",
      message: `${payload.scenarios.length} scenario${payload.scenarios.length === 1 ? "" : "s"} downloaded.`,
      color: "green",
    });
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const json: unknown = JSON.parse(text);
      const result = importScenarios(json, { merge: true });

      notifications.show({
        title: "Scenarios imported",
        message: `${result.imported} imported${result.skipped > 0 ? `, ${result.skipped} skipped` : ""}.`,
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Import failed",
        message:
          error instanceof Error
            ? error.message
            : "Could not read the selected file.",
        color: "red",
      });
    }
  };

  const handleClearAll = () => {
    clearAllScenarios();
    setClearModalOpen(false);
    notifications.show({
      title: "Data cleared",
      message: "All saved scenarios have been removed from this browser.",
      color: "green",
    });
  };

  return (
    <Container size="md" py="lg">
      <Stack gap="lg">
        <Stack gap={4}>
          <Title order={1}>Settings</Title>
          <Text c="dimmed">
            Customize appearance and manage data stored in this browser.
          </Text>
        </Stack>

        <Divider />

        <Paper p="xl" withBorder radius="md">
          <Stack gap="md">
            <Title order={2}>Appearance</Title>
            <Text size="sm" c="dimmed">
              Auto follows your operating system light or dark preference.
            </Text>
            <SegmentedControl
              value={colorScheme}
              onChange={(value) =>
                setColorScheme(value as "light" | "dark" | "auto")
              }
              data={COLOR_SCHEME_OPTIONS}
            />
          </Stack>
        </Paper>

        <Paper p="xl" withBorder radius="md">
          <Stack gap="md">
            <Title order={2}>Data</Title>
            <Text size="sm" c="dimmed">
              Export, import, or remove saved scenarios from local storage.
            </Text>
            <Group gap="sm">
              <Button variant="light" onClick={handleExport}>
                Export scenarios
              </Button>
              <Button variant="light" onClick={handleImportClick}>
                Import scenarios
              </Button>
              <Button
                variant="light"
                color="red"
                onClick={() => setClearModalOpen(true)}
              >
                Clear all data
              </Button>
            </Group>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              hidden
              onChange={handleImportFile}
            />
          </Stack>
        </Paper>

        <Paper p="xl" withBorder radius="md">
          <Stack gap="xs">
            <Title order={2}>About this workspace</Title>
            <Text size="sm" c="dimmed">
              HomeEdge rent vs. buy dashboard — version 0.0.0
            </Text>
          </Stack>
        </Paper>
      </Stack>

      <Modal
        opened={clearModalOpen}
        onClose={() => setClearModalOpen(false)}
        title="Clear all saved scenarios?"
        centered
      >
        <Stack gap="md">
          <Text size="sm">
            This removes every saved scenario from this browser. Your current
            dashboard inputs are not affected.
          </Text>
          <Group justify="flex-end" gap="sm">
            <Button variant="default" onClick={() => setClearModalOpen(false)}>
              Cancel
            </Button>
            <Button color="red" onClick={handleClearAll}>
              Clear all
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}
