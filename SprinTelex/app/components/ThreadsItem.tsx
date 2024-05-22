import * as  React from 'react'
import { Thread } from '../types/threads';
import { View , Text} from '@/components/Themed';
import { Ionicons, Feather, AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { timeAgo } from '../utils/time_ago';
import { useColorScheme, StyleSheet } from 'react-native';
import {Image} from 'expo-image';
import { InstagramSansLight, InstagramSansMedium, InstagramSansText } from '@/components/StyledText';

const blurhash =
'|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

 export default function ThreadsItem(thread:Thread):JSX.Element {
    return (
    <View style={styles.container}>
        <PostLeftSide {...thread} />
        <View style={{gap: 6, flexShrink:1}}>
        <PostHeading 
            name={thread.author.name} 
            username={thread.author.username}
            createdAt={thread.createdAt} 
            verified={thread.author.verified} 
        />
        <InstagramSansText style={{fontSize: 16}}>{thread.content}</InstagramSansText>
        {thread.image && 
        <Image
         source={{uri: thread.image}} 
         style={{minHeight: 300, width: '100%', borderRadius:10}}
         placeholder={blurhash}
         contentFit='cover'
         transition={200}
        />}
        <BottomIcons />
        <PostFooter replies={thread.repliesCount} likes={thread.likesCount} />
        </View>  
        </View>
    )}

    function PostLeftSide(thread: Thread) {
        const currentTheme = useColorScheme();
        const borderColor = currentTheme === 'light' ? '#00000020' : '#ffffff20';

        return (
            <View style={{ justifyContent: 'space-between'}}>
                <Image 
                source={thread.author.photo}
                style={styles.image}
                placeholder={blurhash}
                contentFit='cover'
                transition={200}
                />
                <View style={{
                    borderWidth: 1, 
                    alignSelf: 'center',
                     borderColor: borderColor,
                     flexGrow: 1

                }}
                />
                <View
                style={{
                    width: 20,
                    alignItems: 'center',
                    alignSelf: 'center',
                    gap: 3,
                }}
                >
                    {[2,3].map((index) => 
                    <Image
                    key={index}
                    source={thread.replies[index-1]?.author.photo}
                    style={{width: index * 9, height: index * 9, borderRadius: 15}}
                    placeholder={blurhash}
                    contentFit='cover'
                    transition={500}
                    />
                    )}

                </View>

            </View>
        )

    }

    function PostHeading({name, username, createdAt, verified}:{
        name: string;
        username: string;
        createdAt: string;
        verified: boolean;
    }) {
        return (
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexGrow: 1,
            }}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                    <View>
                        <InstagramSansMedium style={{fontWeight: '500', fontSize:16}}>{name}</InstagramSansMedium>
                        <InstagramSansText style={{color: "gray"}}>@{username}</InstagramSansText>
                    </View>
                    {verified && (
                        // <Ionicons name="checkmark-circle" size={16} color="green" />
                        <MaterialIcons name="verified" size={14} color={"#60a5fa"} />
                    )}
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                    <Text style={{color: 'gray'}}>{timeAgo(createdAt)} </Text>
                    <Feather name="more-horizontal" size={14} color="gray" />
                </View>

            </View>
        )
    }

    function PostFooter({replies, likes}:{ replies:number, likes:number}){
        return (
            <InstagramSansText style={{color: 'gray', gap: 10}}>
                {replies} {replies} * {likes} likes
            </InstagramSansText>
        );
    }

    function BottomIcons() {
        const iconSize = 23;
        const currentTheme = useColorScheme();
        const iconColor = currentTheme === 'dark' ? 'white' : 'black';
        return (
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                <FontAwesome name='heart' size={iconSize} color={iconColor} />
                <Ionicons name='chatbubble-outline' size={iconSize} color={iconColor} />
                <AntDesign name='retweet' size={iconSize} color={iconColor} />
                <Feather name='send' size={iconSize} color={iconColor} />
            </View>
        );

    }

    const styles = StyleSheet.create({
        container: {
          flexDirection: 'row',
          gap: 6,
          paddingBottom: 30
        },
      image: {
        width: 40,
        height: 40,
        borderRadius: 20,

      },
    });