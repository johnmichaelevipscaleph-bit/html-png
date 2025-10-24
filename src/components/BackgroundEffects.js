import { Box } from "@chakra-ui/react";

export default function BackgroundEffects() {
  return (
    <>
      {/* Subtle geometric grid pattern */}
      <Box
        position="absolute"
        inset={0}
        backgroundImage="linear-gradient(rgba(255, 20, 147, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 20, 147, 0.02) 1px, transparent 1px)"
        backgroundSize="40px 40px"
        opacity={0.5}
      />

      {/* Minimal accent dots */}
      <Box
        position="absolute"
        top="10%"
        right="15%"
        w="4px"
        h="4px"
        bg="var(--accent)"
        borderRadius="50%"
        opacity={0.3}
        animation="subtlePulse 4s ease-in-out infinite"
      />

      <Box
        position="absolute"
        bottom="20%"
        left="10%"
        w="6px"
        h="6px"
        bg="var(--accent)"
        borderRadius="50%"
        opacity={0.2}
        animation="subtlePulse 6s ease-in-out infinite reverse"
      />

      <Box
        position="absolute"
        top="60%"
        right="25%"
        w="3px"
        h="3px"
        bg="var(--accent)"
        borderRadius="50%"
        opacity={0.25}
        animation="subtlePulse 5s ease-in-out infinite"
      />

      {/* Clean geometric shapes */}
      <Box
        position="absolute"
        top="15%"
        left="5%"
        w="2px"
        h="60px"
        bg="linear-gradient(to bottom, transparent, var(--accent), transparent)"
        opacity={0.1}
        transform="rotate(45deg)"
      />

      <Box
        position="absolute"
        bottom="25%"
        right="8%"
        w="2px"
        h="40px"
        bg="linear-gradient(to bottom, transparent, var(--accent), transparent)"
        opacity={0.08}
        transform="rotate(-30deg)"
      />
    </>
  );
}
