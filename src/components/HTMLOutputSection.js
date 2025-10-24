import {
  Card,
  CardBody,
  CardHeader,
  Text,
  VStack,
  HStack,
  Box,
  Button,
  Image,
  Divider,
} from "@chakra-ui/react";

export default function HTMLOutputSection({
  previewRef,
  iframeRef,
  convertedImageUrl,
  onImageOpen,
}) {
  return (
    <Card
      flex="1"
      minH={{ base: "500px", md: "600px" }}
      maxH={{ base: "70vh", md: "none" }}
      bg="var(--surface)"
      border="1px solid"
      borderColor="var(--border)"
      borderRadius="12px"
      boxShadow="0 1px 3px rgba(0, 0, 0, 0.05)"
      _hover={{
        borderColor: "var(--accent)",
        boxShadow: "0 4px 12px rgba(255, 20, 147, 0.08)",
      }}
      transition="all 0.2s ease"
      maxW="100%"
      overflow="hidden"
      className="mobile-responsive output-section"
    >
      <CardHeader pb={4}>
        <Text
          fontSize="sm"
          color="var(--text-primary)"
          fontWeight="500"
          letterSpacing="0.01em"
          mb={2}
        >
          Output Preview
        </Text>
        <Divider borderColor="var(--border-light)" />
      </CardHeader>

      <CardBody
        overflow={{ base: "auto", md: "hidden" }}
        maxH={{ base: "calc(70vh - 80px)", md: "none" }}
        css={{
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "var(--border-light)",
            borderRadius: "3px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "var(--accent)",
            borderRadius: "3px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "var(--accent-hover)",
          },
        }}
      >
        <VStack spacing={8} align="stretch">
          {/* HTML Preview */}
          <Box>
            <HStack justify="space-between" mb={4}>
              <Text
                fontSize="sm"
                color="var(--text-secondary)"
                fontWeight="500"
                letterSpacing="0.01em"
              >
                Live Preview
              </Text>
            </HStack>

            <Box
              ref={previewRef}
              border="1px solid"
              borderColor="var(--border)"
              borderRadius="8px"
              bg="var(--background)"
              overflow="hidden"
              boxShadow="0 2px 8px rgba(0, 0, 0, 0.05)"
              width={{ base: "100%", md: "400px" }}
              height={{ base: "250px", md: "400px" }}
              margin="0 auto"
              position="relative"
              maxW="100%"
              className="preview-container"
            >
              <Box
                as="iframe"
                ref={iframeRef}
                width="1080px"
                height="1080px"
                border="none"
                transform="scale(0.37)"
                transformOrigin="top left"
                position="absolute"
                top="0"
                left="0"
                bg="white"
                style={{
                  minWidth: "1080px",
                  minHeight: "1080px",
                  maxWidth: "2048px",
                  maxHeight: "2048px",
                }}
              />
            </Box>
          </Box>

          <Divider borderColor="var(--border-light)" />

          {/* PNG Output */}
          <Box>
            <HStack justify="space-between" mb={4}>
              <Text
                fontSize="sm"
                color="var(--text-secondary)"
                fontWeight="500"
                letterSpacing="0.01em"
              >
                Generated Image
              </Text>

              {convertedImageUrl && (
                <Button
                  size="sm"
                  bg="transparent"
                  color="var(--accent)"
                  onClick={onImageOpen}
                  border="1px solid"
                  borderColor="var(--accent)"
                  borderRadius="6px"
                  fontSize="sm"
                  px={4}
                  _hover={{
                    bg: "var(--accent)",
                    color: "white",
                    transform: "translateY(-1px)",
                    boxShadow: "0 2px 8px rgba(255, 20, 147, 0.2)",
                  }}
                  transition="all 0.2s ease"
                >
                  Expand
                </Button>
              )}
            </HStack>

            {convertedImageUrl ? (
              <Box textAlign="center">
                <Box
                  border="1px solid"
                  borderColor="var(--border)"
                  borderRadius="8px"
                  bg="var(--background)"
                  boxShadow="0 2px 8px rgba(0, 0, 0, 0.05)"
                  overflow="hidden"
                  width={{ base: "100%", md: "400px" }}
                  height={{ base: "250px", md: "400px" }}
                  position="relative"
                  margin="0 auto"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  maxW="100%"
                  className="preview-container"
                >
                  <Image
                    src={convertedImageUrl}
                    alt="Generated PNG Image"
                    borderRadius="8px"
                    cursor="pointer"
                    onClick={onImageOpen}
                    _hover={{ opacity: 0.9 }}
                    transition="opacity 0.2s ease"
                    width="100%"
                    height="100%"
                    objectFit="contain"
                    className="preview-image"
                  />
                </Box>

                <Text
                  mt={4}
                  color="var(--success)"
                  fontSize="sm"
                  fontWeight="500"
                  letterSpacing="0.01em"
                >
                  ✓ Ready for download
                </Text>
              </Box>
            ) : (
              <Box
                border="1px dashed"
                borderColor="var(--border-light)"
                borderRadius="8px"
                p={{ base: 8, md: 20 }}
                textAlign="center"
                bg="var(--surface)"
                width={{ base: "100%", md: "400px" }}
                height={{ base: "250px", md: "400px" }}
                margin="0 auto"
                display="flex"
                alignItems="center"
                justifyContent="center"
                maxWidth="100%"
              >
                <Box>
                  <Text
                    color="var(--text-muted)"
                    fontSize="sm"
                    fontWeight="400"
                    letterSpacing="0.01em"
                  >
                    Awaiting conversion...
                  </Text>
                </Box>
              </Box>
            )}
          </Box>
        </VStack>
      </CardBody>
    </Card>
  );
}
