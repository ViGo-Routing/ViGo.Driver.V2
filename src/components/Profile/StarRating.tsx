import { Box, HStack } from "native-base";
import { memo } from "react";
import { StarIcon } from "react-native-heroicons/solid";
import { StarIcon as StarOutlineIcon } from "react-native-heroicons/outline";

interface StarRatingProps {
  rate: number;
}

const StarRating = ({ rate }: StarRatingProps) => {
  let stars = [];
  for (let i = 0; i < 5; i++) {
    const starElement = (
      <Box key={`box-star-${i}`}>
        {i > rate - 1 ? (
          <StarOutlineIcon key={`star-${i}`} size={15} color="#FDCC0D" />
        ) : (
          <StarIcon key={`star-${i}`} size={15} color="#FDCC0D" />
        )}
      </Box>
    );
    stars.push(starElement);
  }

  return <HStack>{stars}</HStack>;
};

export default memo(StarRating);
