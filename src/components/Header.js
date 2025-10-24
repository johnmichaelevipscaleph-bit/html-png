import { Box, Heading, Text, Divider } from "@chakra-ui/react";

export default function Header() {
  return (
    <Box textAlign="center" py={{ base: 6, md: 8 }}>
      <Heading
        size={{ base: "lg", md: "xl" }}
        fontWeight="700"
        mb={{ base: 2, md: 3 }}
        letterSpacing="-0.02em"
        className="clean-text"
        px={{ base: 4, md: 0 }}
        bgGradient="linear(to-r, #ff1493, #ff69b4, #ff1493)"
        bgClip="text"
        css={{
          animation: "shimmer 3s linear infinite",
          backgroundSize: "200% 100%",
        }}
      >
        HTML to PNG Converter
      </Heading>

      <Heading
        size={{ base: "sm", md: "md" }}
        fontWeight="600"
        mb={{ base: 3, md: 4 }}
        letterSpacing="0.1em"
        textTransform="uppercase"
        color="var(--accent)"
        px={{ base: 4, md: 0 }}
        css={{
          animation: "subtlePulse 3s ease-in-out infinite",
        }}
      >
        VIP - SCALE
      </Heading>

      <Divider
        borderColor="var(--border)"
        w="60px"
        mx="auto"
        mb={{ base: 4, md: 6 }}
        borderWidth="1px"
      />

      <Text
        fontSize={{ base: "sm", md: "md" }}
        color="var(--text-secondary)"
        fontWeight="300"
        letterSpacing="0.01em"
        maxW="600px"
        mx="auto"
        lineHeight="1.6"
        px={{ base: 4, md: 0 }}
      >
        Transform your HTML content into high-quality PNG images with precision
        and ease
      </Text>
    </Box>
  );
}
