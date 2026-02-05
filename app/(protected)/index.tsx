import { sessions } from "@/utils/sessions";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { appwriteConfig, database, Session } from "@/utils/appwrite";
import { Query } from "react-native-appwrite";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/utils/colors";

export default function Index() {
  const router = useRouter();
  const [sessionHistory, setSessionHistory] = useState<Session[]>([]);
  const {user} = useUser();

  useEffect(() => {
    fetchSessions();
  },[])

  const fetchSessions = async () => {
    if (!user) {
      alert ("no user found");
      return;

    }
    try { 

      const response = await database.listDocuments<Session>({
  databaseId: appwriteConfig.db,
  collectionId: appwriteConfig.tables.session,
  queries: [
    Query.equal("user_id", user.id),
  ],
});

      setSessionHistory(response.documents);
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <ParallaxScrollView>
      {/* Section title */}
      <Text style={styles.sectionTitle}>Explore Sessions</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {sessions.map((session) => (
          <Pressable
            key={session.id}
            style={styles.sessionCard}
            onPress={() =>
              router.push({
                pathname: "/session",
                params: { sessionId: session.id },
              })
            }
          >
            {/* Background image */}
            <Image
              source={session.image}
              style={styles.sessionImage}
              contentFit="cover"
              transition={800}
              placeholder={{
                blurhash: "LEHV6nWB2yk8pyo0adR*.7kCMdnj",
              }}
            />

            {/* Gradient overlay */}
            <LinearGradient
              colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.7)"]}
              style={StyleSheet.absoluteFill}
            />

            {/* Text overlay */}
            <View style={styles.textContainer}>
              <Text style={styles.sessionTitle}>{session.title}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
            <Text style={styles.sectionTitle}> Recent Session </Text>
            <Pressable onPress={fetchSessions}>
              <Ionicons
              name= "refresh-circle-sharp"
              size={32}
              color={colors.primary}
              />
            </Pressable>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  scrollContainer: {
    paddingLeft: 16,
    paddingRight: 8,
    gap: 16,
  },

  sessionCard: {
    width: 250,
    height: 140,
    borderRadius: 16,
    overflow: "hidden",
  },

  sessionImage: {
    width: "100%",
    height: "100%",
    overflow:"hidden",
  },

  textContainer: {
    position: "absolute",
    bottom: 12,
    left: 12,
    right: 12,
  },

  sessionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign :"center",
    
  },
});
