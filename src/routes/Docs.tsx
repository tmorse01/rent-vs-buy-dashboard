import { useParams, Link } from "react-router-dom";
import {
  Container,
  Title,
  Text,
  Paper,
  Stack,
  Group,
  Divider,
  Anchor,
  Badge,
  TypographyStylesProvider,
} from "@mantine/core";
import { DOC_PAGES } from "../data/docsPages";

export function Docs() {
  const { page } = useParams();

  const currentPage =
    page == null ? DOC_PAGES[0] : DOC_PAGES.find((doc) => doc.slug === page);

  return (
    <Container size="xl" py="lg">
      <Stack gap="lg">
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Stack gap={4}>
            <Title order={1}>Documentation</Title>
            <Text c="dimmed">
              Short, practical explanations of what the calculator compares and
              how to read results.
            </Text>
          </Stack>
          <Badge color="blue" variant="light" size="lg">
            Finance-neutral guidance
          </Badge>
        </Group>

        <Divider />

        {currentPage ? (
          <Paper p="xl" withBorder radius="md">
            <Stack gap="md">
              <Title order={2}>{currentPage.title}</Title>
              <Text c="dimmed">{currentPage.summary}</Text>
              <TypographyStylesProvider>
                {currentPage.content}
              </TypographyStylesProvider>
            </Stack>
          </Paper>
        ) : (
          <Paper p="xl" withBorder radius="md">
            <Stack gap="sm">
              <Title order={2}>Page not found</Title>
              <Text>
                Pick a topic from the list above, or return to the TL;DR
                overview.
              </Text>
              <Anchor component={Link} to="/docs/overview">
                Go to TL;DR overview
              </Anchor>
            </Stack>
          </Paper>
        )}
      </Stack>
    </Container>
  );
}
