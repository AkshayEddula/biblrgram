import { useClerk } from "@clerk/clerk-expo";
import { Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  const { signOut } = useClerk();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <View>
      <Text>Hello</Text>
      <TouchableOpacity onPress={handleSignOut} className="bg-red-400 p-2 py-4">
        <Text>SignOut</Text>
      </TouchableOpacity>
    </View>
  );
}
