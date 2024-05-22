import { Link, Stack, router } from "expo-router";
import { useState } from "react";
import { Text } from "react-native"
import { Channel, ChannelList, MessageInput, MessageList } from "stream-chat-expo";
import {FontAwesome5} from "@expo/vector-icons";
import { useAuth } from "../../../providers/AuthProvider";
export default function MainTabScreen () {
    const {user} = useAuth();   
    return (
    <>
    <Stack.Screen 
    options={{
        headerRight: () => (
            <Link href="/(home)/users" asChild>
                <FontAwesome5 
                name="search" 
                size={22}
                color="gray" 
                style={{marginHorizontal: 15}}
                 />
            </Link>
        ),
     }} 
     />
    <ChannelList 
    filters={{members: {$in:[user.id]}}}
    onSelect={(channel) =>router.push(`/channel/${channel.cid}`)}/> 
    </>
)}