import { Box, Container, Kbd } from "@chakra-ui/react";
import * as React from "react";
import { motion } from "framer-motion";

const PauseMenu = ({ onPause }: { onPause?: (paused: boolean) => void }) => {
  const [paused, setPaused] = React.useState(false);

  const onKeyDown = ({ code }: { code: string }) => {
    if (code == "KeyP") {
      setPaused((prev) => !prev);
      onPause?.(paused);
    }
  };

  React.useEffect(() => {
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <Container
      position="absolute"
      centerContent
      inset={0}
      background={paused ? "rgba(0,0,0,0.5)" : "transparent"}
    >
      {paused && (
        <Box style={{ margin: "auto 0", textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ ease: "easeOut", duration: 2, repeat: Infinity }}
          >
            PAUSE
          </motion.div>

          <span>
            Press <Kbd>P</Kbd> to continue
          </span>
        </Box>
      )}
    </Container>
  );
};

export default PauseMenu;
