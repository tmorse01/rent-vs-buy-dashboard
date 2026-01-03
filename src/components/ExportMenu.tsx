import { Menu, Button, Modal, Textarea, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { Download, File, Table, Package, Share } from "tabler-icons-react";
import type {
  ScenarioInputs,
  TimelinePoint,
  Metrics,
} from "../features/scenario/ScenarioInputs";
import { useState } from "react";
import { generateShareUrl } from "../utils/shareScenario";

interface ExportMenuProps {
  inputs: ScenarioInputs;
  timeline: TimelinePoint[];
  metrics: Metrics;
}

export function ExportMenu({ inputs, timeline, metrics }: ExportMenuProps) {
  const [notesOpened, { open: openNotes, close: closeNotes }] =
    useDisclosure(false);
  const [notes, setNotes] = useState("");

  const exportScenarioJSON = () => {
    const dataStr = JSON.stringify(inputs, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `scenario-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportTimelineCSV = () => {
    if (timeline.length === 0) {
      notifications.show({
        title: "No data to export",
        message: "There is no timeline data available to export.",
        color: "orange",
      });
      return;
    }

    // Get all keys from the first timeline point
    const headers = Object.keys(timeline[0]);

    // Create CSV rows
    const csvRows = [
      headers.join(","), // Header row
      ...timeline.map((point) =>
        headers
          .map((header) => {
            const value = point[header as keyof TimelinePoint];
            const valueStr = String(value ?? "");
            // Escape commas and quotes in CSV
            if (valueStr.includes(",") || valueStr.includes('"')) {
              return `"${valueStr.replace(/"/g, '""')}"`;
            }
            return valueStr;
          })
          .join(",")
      ),
    ];

    const csvContent = csvRows.join("\n");
    const dataBlob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `timeline-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportAnalysisPacket = () => {
    // Get snapshots at 5/10/15 years
    const snapshots: Record<string, TimelinePoint | null> = {};
    const milestones = [5, 10, 15];

    for (const milestone of milestones) {
      const month = milestone * 12;
      if (month <= timeline.length) {
        snapshots[`year${milestone}`] = timeline[month - 1];
      } else {
        snapshots[`year${milestone}`] = null;
      }
    }

    const analysisPacket = {
      inputs,
      metrics,
      snapshots,
      notes: notes || "",
      exportedAt: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(analysisPacket, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `analysis-packet-${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();
    URL.revokeObjectURL(url);
    closeNotes();
  };

  const handleExportAnalysisPacket = () => {
    openNotes();
  };

  const handleConfirmExport = () => {
    exportAnalysisPacket();
  };

  const handleShare = async () => {
    try {
      const shareUrl = generateShareUrl(inputs);
      await navigator.clipboard.writeText(shareUrl);
      notifications.show({
        title: "Link copied!",
        message: "Share this link to let others view your scenario.",
        color: "blue",
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      const shareUrl = generateShareUrl(inputs);
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        notifications.show({
          title: "Link copied!",
          message: "Share this link to let others view your scenario.",
          color: "blue",
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        notifications.show({
          title: "Error",
          message: "Failed to copy link. Please copy it manually.",
          color: "red",
        });
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <>
      <Group gap="xs">
        <Button
          leftSection={<Share size={18} />}
          variant="light"
          size="sm"
          onClick={handleShare}
        >
          Share
        </Button>
        <Menu shadow="md" width={200} position="bottom-end">
          <Menu.Target>
            <Button
              leftSection={<Download size={18} />}
              variant="light"
              size="sm"
            >
              Export
            </Button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              leftSection={<File size={16} />}
              onClick={exportScenarioJSON}
            >
              Export Scenario JSON
            </Menu.Item>
            <Menu.Item
              leftSection={<Table size={16} />}
              onClick={exportTimelineCSV}
            >
              Export Timeline CSV
            </Menu.Item>
            <Menu.Item
              leftSection={<Package size={16} />}
              onClick={handleExportAnalysisPacket}
            >
              Export Analysis Packet
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>

      <Modal
        opened={notesOpened}
        onClose={closeNotes}
        title="Export Analysis Packet"
        centered
      >
        <Textarea
          placeholder="Add notes for analysis packet (optional)..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          minRows={4}
          mb="md"
        />
        <div
          style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}
        >
          <Button variant="subtle" onClick={closeNotes}>
            Cancel
          </Button>
          <Button onClick={handleConfirmExport}>Export</Button>
        </div>
      </Modal>
    </>
  );
}
