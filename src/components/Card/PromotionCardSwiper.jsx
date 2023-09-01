import React from "react";
import { View, Dimensions, Text } from "react-native";
import Carousel from "react-native-snap-carousel";
import PromotionCard from "./PromotionCard";

const { width: screenWidth } = Dimensions.get("window");

const PromotionCardSwiper = ({ items }) => {
  const renderItem = ({ item }) => (
    <View style={{ paddingHorizontal: 10 }}>
      <PromotionCard
        imageSource={item.imageSource}
        title={item.title}
        description={item.description}
      />
    </View>
  );

  return (
    <Carousel
      data={items}
      renderItem={renderItem}
      sliderWidth={screenWidth}
      itemWidth={screenWidth - 1}
    />
  );
};

export default PromotionCardSwiper;
