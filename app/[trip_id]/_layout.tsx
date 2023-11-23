import { LinearGradient } from "expo-linear-gradient";
import { Slot } from "expo-router";

const Layout = () => {
  return (
    <LinearGradient
      className="h-screen"
      colors={[
        "rgba(135,206,235,1.0)",
        "rgba(100,145,180,1.0)",
        //"rgba(50,70,255,1.0)",
      ]}
      start={{ x: 0.0, y: 0.0 }}
      end={{ x: 0.0, y: 1.0 }}
    >
      <Slot />
    </LinearGradient>
  );
};

export default Layout;
