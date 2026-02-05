import { sessions } from "@/utils/sessions";
import { Image } from "expo-image";
import { PropsWithChildren } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import Button from "./screens/Buttons";

const HEADER_HEIGHT = 400;

export default function ParallaxScrollView({
  children,
}: PropsWithChildren) {
  const todaySession =
    sessions[Math.floor(Math.random() * sessions.length)];

  // Shared scroll value
  const scrollY = useSharedValue(0);

  // Scroll handler
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Parallax animation
  const headerAnimatedStyle = useAnimatedStyle(() => {
    const translateY =
      scrollY.value <= 0
        ? interpolate(
            scrollY.value,
            [-HEADER_HEIGHT, 0],
            [-HEADER_HEIGHT / 2, 0],
            Extrapolation.CLAMP
          )
        : 0;

    const scale =
      scrollY.value <= 0
        ? interpolate(
            scrollY.value,
            [-HEADER_HEIGHT, 0],
            [2, 1],
            Extrapolation.CLAMP
          )
        : 1;

    return {
      transform: [{ translateY }, { scale }],
    };
  });

  return (
    <View style={styles.container}>
      
      <Animated.View style={[styles.headerImage, headerAnimatedStyle]}>
        <Image
          source={todaySession.image}
          contentFit="cover"
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>

      
      <View style={styles.headerOverlay}>
        <Text style={styles.headerSubtitle}>Featured Session</Text>
        <Text style={styles.headerTitle}>{todaySession.title}</Text>
        <Text style={styles.headerDescription}>
          {todaySession.description}
        </Text>
        <Button>Start Session</Button>
      </View>

      {/* 🔹 Scroll Content */}
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: HEADER_HEIGHT }}
      >
        {children}
      </Animated.ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: "black", // prevents white bleed
  },

  headerImage: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: HEADER_HEIGHT,
    overflow: "hidden",
  },

  headerOverlay: {
    position: "absolute",
    top: 0,
    height: HEADER_HEIGHT,
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 32,
    gap: 8,
    backgroundColor: "rgba(0,0,0,0.25)",
  },

  headerSubtitle: {
    fontSize: 16,
    color: "white",
    opacity: 0.6,
    fontWeight: "bold",
  },

  headerTitle: {
    fontSize: 42,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },

  headerDescription: {
    fontSize: 16,
    color: "white",
    opacity: 0.85,
    textAlign: "center",
    paddingHorizontal: 24,
  },
});
