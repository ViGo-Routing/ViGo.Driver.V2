import { Alert, Center, Text, VStack } from "native-base";

interface InfoAlertProps {
  message: string;
}

const InfoAlert = ({ message }: InfoAlertProps) => {
  return (
    <Center>
      <Alert status="info" colorScheme="info">
        <VStack space={1} flexShrink={1} w="100%" alignItems="center">
          <Alert.Icon size="md" />
          <Text fontSize="md" fontWeight="medium" color="coolGray.800">
            {message}
          </Text>
        </VStack>
      </Alert>
    </Center>
  );
};

export default InfoAlert;
