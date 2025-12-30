import { Button, Group, Textarea } from "@mantine/core";
import type {
  ScenarioInputs,
  TimelinePoint,
  Metrics,
} from "../features/scenario/ScenarioInputs";

interface ExportButtonsProps {
  inputs: ScenarioInputs;
  timeline: TimelinePoint[];
  metrics: Metrics;
  notes?: string;
  onNotesChange?: (notes: string) => void;
}

export function ExportButtons({
  inputs,
  timeline,
  metrics,
  notes = "",
  onNotesChange,
}: ExportButtonsProps) {
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
      alert("No timeline data to export");
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
  };

  return (
    <Group>
      <Button onClick={exportScenarioJSON} variant="light">
        Export Scenario JSON
      </Button>
      <Button onClick={exportTimelineCSV} variant="light">
        Export Timeline CSV
      </Button>
      <Button onClick={exportAnalysisPacket} variant="light">
        Export Analysis Packet
      </Button>
      {onNotesChange && (
        <Textarea
          placeholder="Add notes for analysis packet..."
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          style={{ flex: 1, minWidth: 200 }}
          minRows={2}
        />
      )}
    </Group>
  );
}
