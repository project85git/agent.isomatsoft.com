import React, { useState } from "react";
import { Box, Button, Input, VStack, Text } from "@chakra-ui/react";

const ThemeManager = () => {
  const [theme, setTheme] = useState({
    buttonBg: "#3182ce",       // blue.500
    buttonText: "#ffffff",     // white
    background: "#f7fafc",     // gray.50
    textColor: "#2d3748",      // gray.800
  });

  const handleChange = (key, value) => {
    setTheme((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Box
      className="p-6 rounded-2xl shadow-xl"
      style={{ backgroundColor: theme.background, color: theme.textColor }}
    >
      <Text fontSize="2xl" mb={4} fontWeight="bold">
        Theme Manager
      </Text>

      <VStack align="start" spacing={4}>
        <Box>
          <Text mb={1}>Button Background</Text>
          <Input
            type="color"
            value={theme.buttonBg}
            onChange={(e) => handleChange("buttonBg", e.target.value)}
          />
        </Box>

        <Box>
          <Text mb={1}>Button Text</Text>
          <Input
            type="color"
            value={theme.buttonText}
            onChange={(e) => handleChange("buttonText", e.target.value)}
          />
        </Box>

        <Box>
          <Text mb={1}>Site Background</Text>
          <Input
            type="color"
            value={theme.background}
            onChange={(e) => handleChange("background", e.target.value)}
          />
        </Box>

        <Box>
          <Text mb={1}>Text Color</Text>
          <Input
            type="color"
            value={theme.textColor}
            onChange={(e) => handleChange("textColor", e.target.value)}
          />
        </Box>

        <Box mt={6}>
          <Text fontSize="lg" fontWeight="semibold" mb={2}>
            Live Preview
          </Text>
          <Button
            style={{
              backgroundColor: theme.buttonBg,
              color: theme.buttonText,
            }}
            className="rounded-xl px-6 py-2"
          >
            Themed Button
          </Button>
        </Box>
      </VStack>
    </Box>
  );
};

export default ThemeManager;
