import React, { useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './src/screens/HomeScreen';
import CategoriesScreen from './src/screens/CategoriesScreen';
import AreasScreen from './src/screens/AreasScreen';
import AreaDetailScreen from './src/screens/AreaDetailScreen';
import AreaCalendarScreen from './src/screens/AreaCalendarScreen';
import AreaFormScreen from './src/screens/AreaFormScreen';
import PqrHomeScreen from './src/screens/PqrHomeScreen';
import PqrCreateScreen from './src/screens/PqrCreateScreen';
import PqrDetailScreen from './src/screens/PqrDetailScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import { BookingProvider } from './src/context/BookingContext';
import { PqrProvider } from './src/context/PqrContext';
import { NotificationsProvider } from './src/context/NotificationsContext';
import { COLORS } from './src/theme';

const RootStack = createNativeStackNavigator();

export default function App() {
  const navigationRef = useRef();
  const [currentRoute, setCurrentRoute] = useState('Inicio');

  return (
    <BookingProvider>
      <PqrProvider>
        <NotificationsProvider>
        <NavigationContainer
          ref={navigationRef}
          onStateChange={() => {
            const routeName = navigationRef.current?.getCurrentRoute()?.name;
            if (routeName) setCurrentRoute(routeName);
          }}
        >
          <RootStack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
            <RootStack.Screen
              name="Inicio"
              component={HomeScreen}
              options={{ animation: 'slide_from_left' }}
            />
            <RootStack.Screen
              name="Perfil"
              component={ProfileScreen}
              options={{ animation: 'slide_from_right' }}
            />
            <RootStack.Screen
              name="Categories"
              component={CategoriesScreen}
              options={{
                presentation: 'formSheet',
                animation: 'slide_from_bottom',
                gestureEnabled: true,
                gestureDirection: 'vertical',
              }}
            />
            <RootStack.Screen name="Areas" component={AreasScreen} options={{ animation: 'slide_from_right' }} />
            <RootStack.Screen name="AreaDetail" component={AreaDetailScreen} options={{ animation: 'slide_from_right' }} />
            <RootStack.Screen name="AreaCalendar" component={AreaCalendarScreen} options={{ animation: 'slide_from_right' }} />
            <RootStack.Screen name="AreaForm" component={AreaFormScreen} options={{ animation: 'slide_from_right' }} />
            <RootStack.Screen name="PqrHome" component={PqrHomeScreen} options={{ animation: 'slide_from_right' }} />
            <RootStack.Screen name="PqrCreate" component={PqrCreateScreen} options={{ animation: 'slide_from_bottom' }} />
            <RootStack.Screen name="PqrDetail" component={PqrDetailScreen} options={{ animation: 'slide_from_right' }} />
            <RootStack.Screen name="Notifications" component={NotificationsScreen} options={{ animation: 'slide_from_right' }} />
            <RootStack.Screen name="EditProfile" component={EditProfileScreen} options={{ animation: 'slide_from_right' }} />
          </RootStack.Navigator>

          {(currentRoute === 'Inicio' || currentRoute === 'Perfil') && (
            <View style={styles.tabBar}>
              <TouchableOpacity
                style={[styles.iconContainer, currentRoute === 'Inicio' && styles.activeIconContainer]}
                onPress={() => navigationRef.current?.navigate('Inicio')}
              >
                <Ionicons
                  name={currentRoute === 'Inicio' ? 'home' : 'home-outline'}
                  size={28}
                  color={COLORS.darkmodeGreenBlack}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.iconContainer, currentRoute === 'Perfil' && styles.activeIconContainer]}
                onPress={() => navigationRef.current?.navigate('Perfil')}
              >
                <Ionicons
                  name={currentRoute === 'Perfil' ? 'person' : 'person-outline'}
                  size={28}
                  color={COLORS.darkmodeGreenBlack}
                />
              </TouchableOpacity>
            </View>
          )}
        </NavigationContainer>
        </NotificationsProvider>
      </PqrProvider>
    </BookingProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.backgroundGreenWhite,
    position: 'absolute',
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    height: 80,
    width: '65%',
    alignSelf: 'center',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingBottom: 15,
  },
  iconContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
  },
  activeIconContainer: {
    backgroundColor: COLORS.mainGreen,
  },
});
