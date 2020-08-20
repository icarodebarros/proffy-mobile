import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator  } from '@react-navigation/stack';

import Landing from '../pages/Landing';
import GiveClasses from '../pages/GiveClasses';
import StudyTabs from './StudyTabs';

import { PAGES } from '../pages/pages';

const { Navigator, Screen } = createStackNavigator();

function AppStack(): JSX.Element {
    return (
        <NavigationContainer>
            <Navigator screenOptions={{ headerShown: false }}>
                <Screen name={PAGES.LANDING} component={Landing} />
                <Screen name={PAGES.GIVE_CLASSES} component={GiveClasses} />
                <Screen name={PAGES.STUDY} component={StudyTabs} />
            </Navigator>
        </NavigationContainer>
    );
}

export default AppStack;