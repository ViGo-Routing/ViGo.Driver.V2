import {
  useToast,
  Alert,
  VStack,
  HStack,
  Text,
  AlertDialog,
  Button,
  IconButton,
  CloseIcon,
  Box,
  Toast,
  Slide,
  Center,
} from "native-base";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import EventEmitter from "react-native/Libraries/vendor/emitter/EventEmitter";
import { eventNames } from "../../utils/alertUtils";
import { NativeEventEmitter, NativeModules } from "react-native";
import { ThemeComponentSizeType } from "native-base/lib/typescript/components/types";

interface ViGoAlertProps {
  title: ReactNode;
  description: ReactNode;
  status: "info" | (string & {}) | "error" | "success" | "warning";
  placement:
    | "bottom-right"
    | "bottom"
    | "top"
    | "top-right"
    | "top-left"
    | "bottom-left";
  isDialog: boolean;
  isSlide: boolean;
  duration: number;
  avoidKeyboard: boolean;
  primaryButtonText: string;
  displayCloseButton: boolean;
  size: ThemeComponentSizeType<"AlertDialog">;
  // isCancelDisplayed: boolean;
  // cancelButtonText: string;
  // onCancelPress: () => void;
  // isOkDisplayed: boolean;
  // okButtonText: string;
  onOkPress: () => void;
}

// const emitter = new EventEmitter();

const ViGoAlertProvider = (/*{
  title,
  description,
  status = "info",
  placement = "bottom",
  isDialog = false,
  duration = 5000,
  avoidKeyboard = true,
}: ViGoAlertProps*/) => {
  const [title, setTitle] = useState(null as ReactNode);
  const [description, setDescription] = useState(null as ReactNode);
  const [status, setStatus] = useState(
    "info" as "info" | (string & {}) | "error" | "success" | "warning"
  );
  const [placement, setPlacement] = useState(
    "bottom" as
      | "bottom-right"
      | "bottom"
      | "top"
      | "top-right"
      | "top-left"
      | "bottom-left"
  );
  const [isDialog, setIsDialog] = useState(false);
  const [duration, setDuration] = useState(5000);
  const [avoidKeyboard, setAvoidKeyboard] = useState(true);
  // const [isCancelDisplayed, setIsCancelDisplayed] = useState(true);
  // const [cancelButtonText, setCancelButtonText] = useState("Hủy");
  // const [onCancelPress, setOnCancelPress] = useState(function () {

  // });
  // const [isOkDisplayed, setIsOkDisplayed] = useState(true);
  // const [okButtonText, setOkButtonText] = useState("OK");
  // const [onOkPress, setOnOkPress] = useState(() => {});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSlideOpen, setIsSlideOpen] = useState(false);

  const [primaryButtonText, setPrimaryButtonText] = useState("Đã hiểu");
  const [displayCloseButton, setDisplayCloseButton] = useState(true);
  const [size, setSize] = useState(
    "md" as ThemeComponentSizeType<"AlertDialog">
  );

  // const defaultOkButtonPress = () => {setIsDialogOpen(false);};
  // const [okButtonPress, setOkButtonPress] = useState(defaultOkButtonPress);

  const cancelRef = useRef(null);
  // const okButtonRef = useRef(null);

  // const toast = useToast();

  let timeoutRef = null as any;

  const showToast = ({
    title,
    description,
    status = "info",
    placement = "bottom",
    isDialog = false,
    isSlide = false,
    duration = 5000,
    avoidKeyboard = true,
    primaryButtonText = "Đã hiểu",
    displayCloseButton = true,
    size = "md",
  }: // onOkPress = () => {},
  //   isCancelDisplayed = true,
  // cancelButtonText = "Hủy",
  // onCancelPress = () => {},
  // isOkDisplayed = true,
  // okButtonText = "OK",
  // onOkPress = () => {}
  ViGoAlertProps) => {
    // console.log("Event Invoked");
    if (!isDialog && !isSlide) {
      // Toast
      Toast.show({
        render: ({ id }) => {
          return (
            <Alert
              alignSelf={"center"}
              flexDirection={"row"}
              status={status}
              variant={"subtle"}
              id={`${id}`}
            >
              <VStack space={1} flexShrink={1}>
                <HStack
                  flexShrink={1}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  <HStack space={2} flexShrink={1} alignItems="center">
                    <Alert.Icon />
                    <Text
                      fontSize="md"
                      fontWeight="medium"
                      flexShrink={1}
                      color={"darkText"}
                    >
                      {title}
                    </Text>
                  </HStack>
                  {displayCloseButton && (
                    <IconButton
                      variant={"unstyled"}
                      icon={<CloseIcon size="3" />}
                      _icon={{ color: "darkText" }}
                      onPress={() => Toast.close(id)}
                    />
                  )}
                </HStack>
                {description && (
                  <Text px="6" color={"darkText"}>
                    {description}
                  </Text>
                )}
              </VStack>
            </Alert>
          );
        },
        placement: placement,
        duration: duration,
        avoidKeyboard: avoidKeyboard,
      });
      // toast.show({
      //   title: title,
      //   placement: "top-right",
      // });
    } else {
      setTitle(title);
      setDescription(description);
      setStatus(status);
      setPrimaryButtonText(primaryButtonText);
      setDisplayCloseButton(displayCloseButton);
      setSize(size);

      if (isDialog) {
        setIsDialogOpen(true);
      } else if (isSlide) {
        console.log("Slide open");
        setIsSlideOpen(true);

        timeoutRef = setTimeout(() => {
          setIsSlideOpen(false);
        }, duration);
      }
      // setPlacement(placement);
      // if (okButtonRef != null) {
      //   okButtonRef.current.setNativeProps({
      //     onPress: () => {
      //       setIsDialogOpen(false);
      //       onOkPress();
      //     },
      //   });
      // }
      // const okPress = () => {
      //   setIsDialogOpen(false);
      //   onOkPress();
      // };
      // setOkButtonPress(okPress);
    }
  };
  useEffect(() => {
    const eventEmitter = new NativeEventEmitter();

    let showToastListener = eventEmitter.addListener(
      eventNames.SHOW_TOAST,
      showToast
    );

    return () => {
      showToastListener.remove();
      if (timeoutRef) {
        clearTimeout(timeoutRef);
      }
    };
  }, []);

  return (
    <>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        size={size}
      >
        <AlertDialog.Content>
          {displayCloseButton && <AlertDialog.CloseButton />}
          {title && <AlertDialog.Header>{title}</AlertDialog.Header>}
          <AlertDialog.Body>
            {description}
            <Box alignItems={"flex-end"} marginTop={2}>
              <Button.Group space={2}>
                <Button
                  colorScheme={status}
                  onPress={() => {
                    setIsDialogOpen(false);
                    // onOkPress
                  }}
                  // ref={okButtonRef}
                >
                  {primaryButtonText}
                </Button>
              </Button.Group>
            </Box>
          </AlertDialog.Body>

          {/* <AlertDialog.Footer></AlertDialog.Footer> */}
        </AlertDialog.Content>
      </AlertDialog>
      <Center>
        <Slide in={isSlideOpen} placement={"top"}>
          <Alert
            alignSelf={"center"}
            flexDirection={"row"}
            status={status}
            variant={"subtle"}
            id={`slide-alert`}
          >
            <VStack space={1} flexShrink={1}>
              <HStack
                flexShrink={1}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <HStack space={2} flexShrink={1} alignItems="center">
                  <Alert.Icon />
                  <Text
                    fontSize="md"
                    fontWeight="medium"
                    flexShrink={1}
                    color={"darkText"}
                  >
                    {title}
                  </Text>
                </HStack>
                {/* {displayCloseButton && (
                    <IconButton
                      variant={"unstyled"}
                      icon={<CloseIcon size="3" />}
                      _icon={{ color: "darkText" }}
                      onPress={() => Toast.close(id)}
                    />
                  )} */}
              </HStack>
              {description && (
                <Text px="6" color={"darkText"}>
                  {description}
                </Text>
              )}
            </VStack>
          </Alert>
        </Slide>
      </Center>
    </>
  );
};

// export { ViGoAlertProps };
export default ViGoAlertProvider;
