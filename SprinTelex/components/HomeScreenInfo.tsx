import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ExternalLink } from './ExternalLink';
import { MonoText } from './StyledText';
import { Text, View } from './Themed';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Colors from '@/constants/Colors';
import { ThreadContext } from '@/context/thread-context';
import ThreadsItem from '@/app/components/ThreadsItem';

const HomeScreenInfo = () => {
  const threads = React.useContext(ThreadContext);

    return (
    <View >
        {threads?.map((thread) => (
            <ThreadsItem key={thread.id} {...thread}/>
        ))}      
    </View>
  );
};

const styles = StyleSheet.create({
  
  
});

export default HomeScreenInfo;