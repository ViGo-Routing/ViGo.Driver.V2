import { Box, HStack, Text } from "native-base";
import { memo } from "react";
import {
  renderTransacionType,
  renderTransactionStatus,
  renderTransactionTypeOperator,
} from "../../utils/enumUtils/walletEnumUtils";
import { vndFormat } from "../../utils/numberUtils";

interface TransactionItemProps {
  transaction: any;
  renderType: "list" | "details" | "trip";
}

const TransactionItem = ({ transaction, renderType }: TransactionItemProps) => {
  const getTransactionColor = () => {
    if (renderTransactionTypeOperator(transaction.type) == "+") {
      return "green.600";
    }
    return "red.500";
  };

  return (
    <HStack>
      {renderType != "trip" && (
        <Box width={"10%"}>
          {renderTransactionStatus(transaction.status, "list")}
        </Box>
      )}
      <Box width={"60%"}>{renderTransacionType(transaction, renderType)}</Box>
      <Box width={"30%"} paddingLeft={5} alignItems="flex-end">
        <Text bold color={getTransactionColor()} style={{ fontSize: 16 }}>
          {`${renderTransactionTypeOperator(transaction.type)}${vndFormat(
            transaction.amount
          )}`}
        </Text>
      </Box>
    </HStack>
  );
};

export default memo(TransactionItem);
