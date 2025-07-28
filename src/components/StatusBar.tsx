import { SafeAreaView, StatusBar, View } from "react-native";

const MyStatusBar = ({backgroundColor, ...props}: any) => (
  <View style={{ backgroundColor }}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);

export default MyStatusBar;