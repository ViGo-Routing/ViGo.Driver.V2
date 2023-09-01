import { TabView, SceneMap } from "react-native-tab-view";
import { UserContext } from "../../context/UserContext";
import { useContext, useState, useMemo, useEffect } from "react";
import OnGoingTab from "./components/OnGoingTab";
import CompletedTab from "./components/CompletedTab";
import CanceledTab from "./components/CanceledTab";
import { Dimensions, Animated } from "react-native";
import { Box, Pressable, Text, View } from "native-base";
import { themeColors, vigoStyles } from "../../../assets/theme";
import { SafeAreaView } from "react-native";
import Header from "../../components/Header/Header";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useNavigation } from "@react-navigation/native";

const Tab = createMaterialTopTabNavigator();

interface HistoryScreenProps {}

const FirstRoute = () => (
  <View style={{ flex: 1, backgroundColor: "#ff4081" }} />
);

const SecondRoute = () => (
  <View style={{ flex: 1, backgroundColor: "#673ab7" }} />
);

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
});

// const renderScene = SceneMap({
//   first: OnGoingTab,
//   second: CompletedTab,
//   third: CanceledTab,
// });

const initialLayout = {
  width: Dimensions.get("window").width,
};

const HistoryScreen = ({}: HistoryScreenProps) => {
  const { user } = useContext(UserContext);

  const [selectedIndex, setSelectedIndex] = useState(0);
  // const [routes] = useState([
  //   { key: "first", title: "Sắp tới" },
  //   { key: "second", title: "Đã hoàn thành" },
  //   { key: "third", title: "Đã bị hủy" },
  // ]);
  const [routes] = useState([
    { key: "first", title: "First" },
    { key: "second", title: "Second" },
  ]);

  // const secondRenderScene = ({ route }) => {
  //   if (route.key === "first" && selectedIndex == 0) {
  //     return <OnGoingTab />;
  //   } else if (route.key === "second" && selectedIndex == 1) {
  //     return <CompletedTab />;
  //   } else if (route.key === "third" && selectedIndex == 2) {
  //     return <CanceledTab />;
  //   }
  // };

  const renderTabBar = ({ state, descriptors, navigation, position }) => {
    // const inputRange = props.navigationState.routes.map((x: any, i: any) => i);
    return (
      <Box flexDirection="row">
        {state.routes.map((route: any, i: any) => {
          // const opacity = props.position.interpolate({
          //   inputRange,
          //   outputRange: inputRange.map((inputIndex: any) =>
          //     inputIndex === i ? 1 : 0.5
          //   ),
          // });

          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          // const color = index === i ?
          const borderColor =
            state.index === i ? themeColors.primary : "#e5e5e5";
          const textColor = state.index === i ? themeColors.primary : "black";
          const isBold = state.index === i;
          const isFocus = state.index === i;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocus && !event.defaultPrevented) {
              // The `merge: true` option makes sure that the params inside the tab screen are preserved
              navigation.navigate({ name: route.name, merge: true });
            }
          };

          return (
            <Box
              borderBottomWidth="3"
              borderColor={borderColor}
              flex={1}
              alignItems="center"
              p="2"
              key={label}
              // mx="2"
            >
              <Pressable onPress={onPress}>
                <Animated.Text>
                  <Text color={textColor} bold={isBold}>
                    {label}
                  </Text>
                </Animated.Text>
              </Pressable>
            </Box>
          );
        })}
      </Box>
    );
  };

  const navigation = useNavigation();

  useEffect(() => {
    console.log("Selected " + selectedIndex);
  }, [selectedIndex]);

  return (
    <SafeAreaView style={vigoStyles.container}>
      <Header title="Các chuyến đi của tôi" />
      <View style={vigoStyles.body}>
        {/* <TabView
          navigationState={{ selectedIndex, routes }}
          renderScene={secondRenderScene}
          renderTabBar={renderTabBar}
          onIndexChange={setSelectedIndex}
          initialLayout={initialLayout}
          lazy={true}
          // renderLazyPlaceholder={}
        /> */}
        {/* <TabView
          navigationState={{ selectedIndex, routes }}
          renderScene={renderScene}
          onIndexChange={setSelectedIndex}
          initialLayout={initialLayout}
        /> */}
        <Tab.Navigator
          tabBar={(props) => renderTabBar(props)}
          sceneContainerStyle={{ backgroundColor: "transparent" }}
          screenOptions={{
            lazy: true,
          }}
        >
          <Tab.Screen
            name="OnGoing"
            key={"OnGoing"}
            component={OnGoingTab}
            options={{ tabBarLabel: "Sắp tới" }}
          />
          <Tab.Screen
            name="Completed"
            key={"Completed"}
            component={CompletedTab}
            options={{ tabBarLabel: "Đã hoàn thành" }}
          />
          <Tab.Screen
            name="Canceled"
            key={"Canceled"}
            component={CanceledTab}
            options={{ tabBarLabel: "Đã hủy" }}
          />
        </Tab.Navigator>
      </View>
    </SafeAreaView>
  );
};

export default HistoryScreen;
