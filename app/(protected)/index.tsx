import { sessions } from "@/utils/sessions";
import { useRouter } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useState } from "react";
import { appwriteConfig, database, Session } from "@/utils/appwrite";
import { Query } from "react-native-appwrite";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/utils/colors";
import SignOutButton from "@/components/clerk/SignOutButton";

/* -------------------- Main Screen -------------------- */

export default function Index() {
  const router = useRouter();
  const { user } = useUser();
  const [sessionHistory, setSessionHistory] = useState<Session[]>([]);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    if (!user) return;

    try {
      const response = await database.listDocuments<Session>({
        databaseId: appwriteConfig.db,
        collectionId: appwriteConfig.tables.session,
        queries: [Query.equal("user_id", user.id)],
      });

      setSessionHistory(response.documents);
    } catch (e) {
      console.log("Fetch sessions error:", e);
    }
  };

  return (
    <ParallaxScrollView>
      
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
            <Image
              source={session.image}
              style={styles.sessionImage}
              contentFit="cover"
              transition={800}
            />

            <LinearGradient
              colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.7)"]}
              style={StyleSheet.absoluteFill}
            />

            <View style={styles.textContainer}>
              <Text style={styles.sessionTitle}>{session.title}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      
      <View style={styles.recentHeader}>
        <Text style={styles.sectionTitle}>Recent Sessions</Text>
        <Pressable onPress={fetchSessions}>
          <Ionicons
            name="refresh-circle-sharp"
            size={32}
            color={colors.primary}
          />
        </Pressable>
      </View>

     
      {sessionHistory.length > 0 ? (
        sessionHistory.map((session) => (
          <SessionCard key={session.$id} session={session} />
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No sessions found</Text>
        </View>
      )}

      {/* ---------- Account Section ---------- */}
<Text style={styles.sectionTitle}>Account</Text>

<View
  style={{
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    backgroundColor: "white",
    gap: 8,
    marginBottom: 100,
  }}
>
  {/* Profile image */}
  <Image
    source={{ uri: user?.imageUrl }}
    style={{
      width: 50,
      height: 50,
      borderRadius: 100,
    }}
  />

  {/* Name */}
  <Text style={{ fontSize: 20, fontWeight: "bold" }}>
    {user?.firstName} {user?.lastName}
  </Text>

  {/* Email */}
  <Text style={{ fontSize: 16 }}>
    {user?.emailAddresses[0]?.emailAddress}
  </Text>

  {/* Sign out */}
  <SignOutButton />
</View>


    </ParallaxScrollView>
  );
}



const SessionCard = ({ session }: { session: Session }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const randomEmoji = useMemo(() => {
    const emojis = ["🌿", "🌊", "🌤️", "🌙", "✨", "🍃", "🧘"];
    return emojis[Math.floor(Math.random() * emojis.length)];
  }, []);

  return (
    <View style={styles.sessionHistoryCard}>
      <Text style={{ fontSize: 24 }}>{randomEmoji}</Text>

      <Text style={styles.historyTitle}>
        {session.call_summary_title}
      </Text>

      {isExpanded ? (
        <>
          <Text style={styles.transcript}>{session.transcript}</Text>
          <Pressable onPress={() => setIsExpanded(false)}>
            <Text style={styles.readMore}>Read less</Text>
          </Pressable>
        </>
      ) : (
        <Pressable onPress={() => setIsExpanded(true)}>
          <Text style={styles.readMore}>Read more</Text>
        </Pressable>
      )}

      <Text style={styles.meta}>
        {session.call_duration_secs} seconds, {session.token} tokens
      </Text>

      <Text style={styles.meta}>
        {new Date(session.$createdAt).toLocaleDateString("en-US", {
          weekday: "long",
        })}
      </Text>
    </View>
  );
};

/* -------------------- Styles -------------------- */

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  scrollContainer: {
    paddingLeft: 16,
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
    textAlign: "center",
  },

  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 16,
  },

  sessionHistoryCard: {
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "white",
    gap: 8,
  },

  historyTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },

  transcript: {
    fontSize: 16,
  },

  readMore: {
    fontSize: 16,
    color: colors.primary,
  },

  meta: {
    fontSize: 14,
    opacity: 0.6,
  },

  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
  },

  emptyText: {
    fontSize: 16,
    opacity: 0.6,
  },
});
