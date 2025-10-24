import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Heading,
  Box,
} from "@chakra-ui/react";

export default function HTMLPreviewModal({ isOpen, onClose, htmlContent }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay bg="rgba(0, 0, 0, 0.9)" />
      <ModalContent bg="rgba(0, 0, 0, 0.95)" backdropFilter="blur(20px)">
        <ModalHeader>
          <Heading
            size="lg"
            bg="linear-gradient(45deg, #ff006e, #8338ec)"
            bgClip="text"
            textShadow="0 0 20px rgba(255, 0, 110, 0.5)"
          >
            🔍 Fullscreen HTML Preview
          </Heading>
        </ModalHeader>

        <ModalCloseButton color="white" />

        <ModalBody pb={6}>
          <Box
            border="2px solid"
            borderColor="rgba(255, 0, 110, 0.5)"
            borderRadius="15px"
            p={8}
            bg="rgba(255, 255, 255, 0.95)"
            minH="70vh"
            overflow="visible"
            backdropFilter="blur(10px)"
            boxShadow="inset 0 0 20px rgba(255, 0, 110, 0.1)"
            css={{
              // Create a fixed-size preview window
              overflow: "hidden",
              width: "400px",
              height: "400px",
              border: "2px solid #333",
              borderRadius: "8px",
              position: "relative",
              margin: "0 auto",
              // Scale down the content to fit in the preview window
              "& .html-preview-content": {
                transform: "scale(0.37)", // Scale down from 1080px to ~400px
                transformOrigin: "top left",
                width: "1080px",
                height: "1080px",
                position: "absolute",
                top: 0,
                left: 0,
              },
            }}
            dangerouslySetInnerHTML={{
              __html: `<div class="html-preview-content">${htmlContent}</div>`,
            }}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
