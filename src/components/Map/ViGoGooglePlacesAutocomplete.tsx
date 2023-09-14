import { HStack } from "native-base";
import { ReactNode, memo, useRef } from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { googleMapsApi } from "../../utils/mapUtils";
import geolocation from "react-native-geolocation-service";

interface ViGoGooglePlacesAutocompleteProps {
  handlePlaceSelection: (details: any) => void;
  selectedPlace?: any;
  leftIcon?: ReactNode;
  isInScrollView?: boolean;
}

const ViGoGooglePlacesAutocomplete = ({
  handlePlaceSelection,
  selectedPlace,
  leftIcon = undefined,
  isInScrollView = false,
}: ViGoGooglePlacesAutocompleteProps) => {
  const placeInputRef = useRef(null as any);

  return (
    <HStack alignItems="center">
      {leftIcon && leftIcon}
      <GooglePlacesAutocomplete
        currentLocation={true}
        currentLocationLabel="Vị trí hiện tại"
        ref={placeInputRef}
        placeholder="Chọn địa điểm..."
        onPress={(data: any, details: any) => {
          handlePlaceSelection(details);
        }}
        insideScrollView={isInScrollView}
        fetchDetails={true}
        enablePoweredByContainer={false}
        query={{
          key: googleMapsApi,
          language: "vi",
        }}
        nearbyPlacesAPI="GooglePlacesSearch"
        debounce={400}
        minLength={2}
        // listViewDisplayed={true}
      />
    </HStack>
  );
};

export default memo(ViGoGooglePlacesAutocomplete);
