import { ScrollView } from "native-base";
import { PropsWithChildren } from "react";
import { RefreshControl } from "react-native";

interface RefreshableScrollViewProps {
  refreshing: boolean;
  onRefresh: () => void;
}

const RefreshableScrollView = ({
  refreshing,
  onRefresh,
  children,
}: PropsWithChildren<RefreshableScrollViewProps>) => {
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <>{children}</>
    </ScrollView>
  );
};

export default RefreshableScrollView;
