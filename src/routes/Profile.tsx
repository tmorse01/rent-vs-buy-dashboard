import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Anchor,
  Avatar,
  Button,
  Container,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useUserProfile } from "../context/UserProfileContext";
import { listScenarios } from "../features/scenario/scenarioStorage";

function formatMemberSince(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function Profile() {
  const { displayName, setDisplayName, memberSince, initials } =
    useUserProfile();
  const [draftName, setDraftName] = useState(displayName);
  const savedScenarioCount = listScenarios().length;
  const hasUnsavedName = draftName.trim() !== displayName.trim();

  useEffect(() => {
    setDraftName(displayName);
  }, [displayName]);

  const handleSaveName = () => {
    setDisplayName(draftName.trim());
  };

  return (
    <Container size="md" py="lg">
      <Stack gap="lg">
        <Stack gap={4}>
          <Title order={1}>Profile</Title>
          <Text c="dimmed">
            Your local workspace identity — no account required.
          </Text>
        </Stack>

        <Divider />

        <Paper p="xl" withBorder radius="md">
          <Stack gap="lg">
            <Title order={2}>Identity</Title>
            <Group align="center" gap="md" wrap="nowrap">
              <Avatar size={72} radius="xl" color="blue" variant="filled">
                {initials}
              </Avatar>
              <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
                <TextInput
                  label="Display name"
                  placeholder="How should we greet you?"
                  value={draftName}
                  onChange={(event) => setDraftName(event.currentTarget.value)}
                  onBlur={() => {
                    if (hasUnsavedName) {
                      handleSaveName();
                    }
                  }}
                />
                <Text size="sm" c="dimmed">
                  Member since {formatMemberSince(memberSince)}
                </Text>
              </Stack>
            </Group>
            {hasUnsavedName && (
              <Group justify="flex-end">
                <Button size="sm" onClick={handleSaveName}>
                  Save name
                </Button>
              </Group>
            )}
          </Stack>
        </Paper>

        <Paper p="xl" withBorder radius="md">
          <Stack gap="md">
            <Title order={2}>Usage summary</Title>
            <Text>
              {savedScenarioCount === 0
                ? "You have not saved any scenarios yet."
                : `You have ${savedScenarioCount} saved scenario${savedScenarioCount === 1 ? "" : "s"}.`}
            </Text>
            {savedScenarioCount > 0 && (
              <Anchor component={Link} to="/scenarios" size="sm">
                View saved scenarios
              </Anchor>
            )}
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
