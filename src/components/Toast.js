import { Alert, Platform, ToastAndroid } from "react-native";
import PropTypes from "prop-types";

export default function Toast({ message }) {
  if (Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert(message, undefined, [{ text: "확인" }]);
  }
}

Toast.propTypes = {
  message: PropTypes.string.isRequired,
};
