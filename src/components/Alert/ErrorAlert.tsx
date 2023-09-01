import { useNavigation } from "@react-navigation/native";
import { Alert, Box, Button, Center, Text, VStack } from "native-base";
import { PropsWithChildren } from "react";
import { HomeIcon } from "react-native-heroicons/outline";

interface ErrorAlertProps {
  isError: boolean;
  errorMessage: string;
}

const ErrorAlert = ({
  isError,
  errorMessage,
  children,
}: PropsWithChildren<ErrorAlertProps>) => {
  const navigation = useNavigation();

  return (
    <>
      {isError && (
        <Box marginTop="2" px="3">
          <Center marginBottom={"2"}>
            {/* <Text>Hồ sơ của bạn đã được gửi đến ViGo!</Text> */}
            <Alert status="error" colorScheme={"error"}>
              <VStack space={1} flexShrink={1} w="100%" alignItems="center">
                <Alert.Icon size="md" />
                <Text
                  fontSize="md"
                  fontWeight="medium"
                  _dark={{
                    color: "coolGray.800",
                  }}
                >
                  Không thể truy vấn thông tin
                </Text>

                <Box
                  _text={{
                    textAlign: "center",
                  }}
                  _dark={{
                    _text: {
                      color: "coolGray.600",
                    },
                  }}
                >
                  <Text>{errorMessage}</Text>
                </Box>
                <Button
                  marginTop="2"
                  size="md"
                  variant="subtle"
                  colorScheme="error"
                  onPress={() => navigation.navigate("Home")}
                  leftIcon={<HomeIcon size={24} color={"#801E1E"} />}
                >
                  Quay về trang chủ
                </Button>
              </VStack>
            </Alert>
          </Center>
        </Box>
      )}
      {!isError && <>{children}</>}
    </>
  );
};

export default ErrorAlert;
