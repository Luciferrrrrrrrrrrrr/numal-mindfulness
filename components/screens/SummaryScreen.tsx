import { ScrollView, Text, View } from "react-native";
import { Gradient } from "../gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ConversationResponse } from "@/utils/types";
import { StyleSheet } from "react-native";
import Button from "./Buttons";
import { appwriteConfig, database } from "@/utils/appwrite";
import { ID } from "react-native-appwrite";
import { useUser } from "@clerk/clerk-expo";

export default function SummaryScreen() {
    const {conversationId} = useLocalSearchParams();
    const [conversation, setConversation] = useState<ConversationResponse>();
    const router = useRouter();
    const {user} =useUser();
    const [isSaving, setIsSaving] = useState(false);



    useEffect(()=> {
        getSummary();
    },[])

    async function getSummary(){
        const response = await fetch (
            `${process.env.ELEVENLABS_BASE_URL}/api/conversations?conversationId=${conversationId}`,
        );
        const data : {conversation: ConversationResponse} =
         await response.json();
        setConversation(data.conversation);


    }

    async function saveAndContinue() {

        try {
            setIsSaving(true);
            await database.createDocument(appwriteConfig.db,
                appwriteConfig.tables.session,
                ID.unique(),
                {

                user_id: user?.id,
                status: conversation?.status,
                conv_id: conversationId,
                tokens: Number(conversation?.metadata?.cost ),
                call_duration_secs: Number(
                conversation?.metadata?.call_duration_secs 
            ),
                transcript: conversation?.transcript.map((t) => t.message).join("\n"),
            call_summary_title: conversation?.analysis?.call_summary_title ?? "Session Summary",
                    
                }
            );
            router.dismissAll();
        } catch(e) {
            console.log(e)
        } finally {
            setIsSaving(false)
        }
    }
    

    return (
        <>
            <Gradient position = "bottom" isSpeaking={false}/>
        <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle ={{paddingHorizontal: 16, }}
        >

        {conversation?.status !== 'done' && (
            <View style= {{gap: 16, paddingBottom: 16}}>
                <Text style={styles.title}> We are processing your cal ...</Text>
                <Text style={styles.subtitle}> This may take a few minutes. </Text>
                <Text style={styles.subtitle}> Current Status: {conversation?.status} </Text>
            
            <Button onPress={getSummary}>Refresh</Button>
            </View>
        )}
        {conversation?.status=== 'done' && (
            <View style ={{gap: 16, paddingBottom: 16}}>
             <Text style={styles.caption}>{conversationId}</Text>   
             <Text style ={styles.title}>
                {conversation?.analysis?.call_summary_title}
             </Text>
             <Text style={styles.subtitle}>
                {conversation?.analysis?.transcript_summary.trim()}
             </Text>
             <Text style= {styles.title}>Status</Text>
             <Text style ={styles.subtitle}>
                {conversation?.metadata?.call_duration_secs} seconds
             </Text>
             <Text style = {styles.subtitle}>
                {conversation?.metadata?.cost} tokens
             </Text>
             <Text style ={styles.subtitle}>
                {new Date(
                    conversation?.metadata?.start_time_unix_secs! * 1000
                ).toLocaleString()}
             </Text>
             <Text style={styles.title}>Transcript</Text>
             <Text style={styles.subtitle}>
                {conversation?.transcript.map((t)=> t.message).join("\n")}
             </Text>



            </View>
        )}
        <View style = {{alignItems: "center"}} >
            <Button onPress={saveAndContinue} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save and Continue"}
        </Button>
        </View>
        </ScrollView>
        
        </>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: "bold",
    },
    subtitle: {
        fontSize: 16,
    },
    caption:{
        fontSize:12,
        color:"gray",
    },

});