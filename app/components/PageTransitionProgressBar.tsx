import { useNavigation } from "react-router-dom";

export default function PageTransitionProgressBar() {
  const navigation = useNavigation();
  const isTransitioning = navigation.state !== "idle";

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "3px",
        backgroundColor: "#0066cc",
        opacity: isTransitioning ? 1 : 0,
        transition: "opacity 0.3s ease-out",
        zIndex: 9999
      }}
    />
  );
}
