import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Heading,
  Box,
  Image,
  Text,
} from "@chakra-ui/react";

export default function PNGImageModal({ isOpen, onClose, convertedImageUrl }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay bg="rgba(0, 0, 0, 0.8)" />
      <ModalContent bg="var(--background)" backdropFilter="blur(20px)">
        <ModalHeader borderBottom="1px solid" borderColor="var(--border-light)">
          <Heading
            size="lg"
            color="var(--text-primary)"
            fontWeight="300"
            letterSpacing="-0.01em"
          >
            PNG Preview
          </Heading>
          <Text
            fontSize="sm"
            color="var(--text-secondary)"
            fontWeight="300"
            mt={1}
          >
            Fullscreen view of your converted image
          </Text>
        </ModalHeader>

        <ModalCloseButton
          color="var(--text-secondary)"
          _hover={{ color: "var(--accent)" }}
        />

        <ModalBody pb={{ base: 4, md: 8 }} textAlign="center">
          <Box
            border="1px solid"
            borderColor="var(--border)"
            borderRadius="12px"
            p={{ base: 4, md: 6 }}
            bg="var(--surface)"
            boxShadow="0 4px 20px rgba(255, 20, 147, 0.08)"
            maxH={{ base: "70vh", md: "80vh" }}
            overflow="auto"
            css={{
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                background: "var(--border-light)",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "var(--accent)",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: "var(--accent-hover)",
              },
            }}
          >
            <Image
              src={convertedImageUrl}
              alt="Converted PNG - Fullscreen"
              maxW="100%"
              maxH="100%"
              borderRadius="8px"
              boxShadow="0 2px 12px rgba(0, 0, 0, 0.1)"
            />
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
