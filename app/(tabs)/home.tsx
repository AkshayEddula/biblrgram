import { Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  return (
    <View>
      <Text>Hello</Text>
      <TouchableOpacity onPress={() => {}} className="bg-red-400 p-2 py-4">
        <Text>SignOut</Text>
      </TouchableOpacity>
    </View>
  );
}
