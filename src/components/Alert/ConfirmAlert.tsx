import { AlertDialog, Box, Button } from "native-base";
import { useRef, ReactNode } from "react";
import { themeColors } from "../../../assets/theme";

interface ConfirmAlertProps {
  title: ReactNode;
  description: ReactNode;
  // status: "info" | (string & {}) | "error" | "success" | "warning";
  // isDialog: boolean;
  // duration: number;
  // avoidKeyboard: boolean;
  // isCancelDisplayed: boolean;
  cancelButtonText: string;
  onCancelPress: () => void;
  // isOkDisplayed: boolean;
  okButtonText: string;
  onOkPress: () => void;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ConfirmAlert = ({
  title,
  description,
  isOpen,
  setIsOpen,
  cancelButtonText = "Hủy",
  onCancelPress = () => {},
  okButtonText = "Xác nhận",
  onOkPress = () => {},
}: ConfirmAlertProps) => {
  const cancelRef = useRef(null);

  return (
    <AlertDialog
      leastDestructiveRef={cancelRef}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <AlertDialog.Content>
        <AlertDialog.CloseButton />
        {title && <AlertDialog.Header>{title}</AlertDialog.Header>}
        <AlertDialog.Body>
          {description}
          <Box alignItems={"flex-end"} marginTop={2}>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={() => {
                  setIsOpen(false);

                  onCancelPress();
                }}
                ref={cancelRef}
              >
                {cancelButtonText}
              </Button>
              <Button
                backgroundColor={themeColors.primary}
                onPress={() => {
                  setIsOpen(false);

                  onOkPress();
                }}
              >
                {okButtonText}
              </Button>
            </Button.Group>
          </Box>
        </AlertDialog.Body>

        {/* <AlertDialog.Footer></AlertDialog.Footer> */}
      </AlertDialog.Content>
    </AlertDialog>
  );
};

export default ConfirmAlert;
