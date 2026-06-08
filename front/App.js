import React, { useRef, useState, useContext, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, BackHandler, Alert, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './src/screens/HomeScreen';
import AdminHomeScreen from './src/screens/AdminHomeScreen';
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
import AnnouncementDetailScreen from './src/screens/AnnouncementDetailScreen';
import AnnouncementsScreen from './src/screens/AnnouncementsScreen';
import ReceptionScreen from './src/screens/ReceptionScreen';
import ReceptionChatScreen from './src/screens/ReceptionChatScreen';
import GuardReceptionScreen from './src/screens/GuardReceptionScreen';
import GuardChatListScreen from './src/screens/GuardChatListScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AccessibilityScreen from './src/screens/AccessibilityScreen';
import LaunchScreen from './src/screens/LaunchScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import RoleSelectionScreen from './src/screens/RoleSelectionScreen';
import ConjuntoSetupScreen from './src/screens/ConjuntoSetupScreen';
import ConjuntoJoinScreen from './src/screens/ConjuntoJoinScreen';
import PendingApprovalScreen from './src/screens/PendingApprovalScreen';
import AdminConjuntoPanel from './src/screens/AdminConjuntoPanel';
import AdminAreaManagementScreen from './src/screens/AdminAreaManagementScreen';
import AdminMembersScreen from './src/screens/AdminMembersScreen';
import AdminAnnouncementCreateScreen from './src/screens/AdminAnnouncementCreateScreen';
import AdminPqrScreen from './src/screens/AdminPqrScreen';
import ConjuntoInfoScreen from './src/screens/ConjuntoInfoScreen';
import ManualConvivenciaScreen from './src/screens/ManualConvivenciaScreen';
import PdfViewerScreen from './src/screens/PdfViewerScreen';
import { BookingProvider } from './src/context/BookingContext';
import { PqrProvider } from './src/context/PqrContext';
import { NotificationsProvider } from './src/context/NotificationsContext';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import { ReceptionChatProvider } from './src/context/ReceptionChatContext';
import { AccessibilityProvider, useAccessibility } from './src/context/AccessibilityContext';
import FloatingChatBubble from './src/components/FloatingChatBubble';
import { useAppTheme } from './src/theme';

const RootStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();

const TAB_ROUTES = ['Inicio', 'Perfil'];

function AppNavigator() {
  const navigationRef = useRef();
  const [currentRoute, setCurrentRoute] = useState('Inicio');
  const { user } = useContext(AuthContext);
  const { shouldAnimate } = useAccessibility();
  const { colors, minTarget } = useAppTheme();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const iconSize = Math.max(44, minTarget);

  const isAdmin = user?.role === 'administrador';

  useEffect(() => {
    const isVisible = TAB_ROUTES.includes(currentRoute);
    if (shouldAnimate) {
      Animated.timing(slideAnim, {
        toValue: isVisible ? 0 : 150,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      slideAnim.setValue(isVisible ? 0 : 150);
    }
  }, [currentRoute, shouldAnimate]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (navigationRef.current && !navigationRef.current.canGoBack()) {
        Alert.alert(
          'Salir de Convivio',
          '¿Estás seguro que deseas cerrar la aplicación?',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Salir', style: 'destructive', onPress: BackHandler.exitApp },
          ],
          { cancelable: true },
        );
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, []);

  if (!user) {
    return (
      <NavigationContainer>
        <AuthStack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
          <AuthStack.Screen name="Launch" component={LaunchScreen} />
          <AuthStack.Screen name="Login" component={LoginScreen} />
          <AuthStack.Screen name="Register" component={RegisterScreen} />
          <AuthStack.Screen name="RoleSelection" component={RoleSelectionScreen} />
          <AuthStack.Screen name="ConjuntoSetup" component={ConjuntoSetupScreen} />
          <AuthStack.Screen name="ConjuntoJoin" component={ConjuntoJoinScreen} />
          <AuthStack.Screen name="PendingApproval" component={PendingApprovalScreen} />
        </AuthStack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      onStateChange={() => {
        const routeName = navigationRef.current?.getCurrentRoute()?.name;
        if (routeName) setCurrentRoute(routeName);
      }}
    >
      <RootStack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        {/* Home: AdminHomeScreen for admins, HomeScreen for everyone else */}
        <RootStack.Screen
          name="Inicio"
          component={isAdmin ? AdminHomeScreen : HomeScreen}
          options={{ animation: 'slide_from_left' }}
        />
        <RootStack.Screen name="Perfil"   component={ProfileScreen}            options={{ animation: 'slide_from_right' }} />
        <RootStack.Screen name="Settings" component={SettingsScreen}           options={{ animation: 'slide_from_right' }} />
        <RootStack.Screen name="Accessibility" component={AccessibilityScreen} options={{ animation: 'slide_from_right' }} />
        <RootStack.Screen name="Categories" component={CategoriesScreen}
          options={{ presentation: 'formSheet', animation: 'slide_from_bottom', gestureEnabled: true, gestureDirection: 'vertical' }}
        />
        <RootStack.Screen name="Areas"            component={AreasScreen}            options={{ animation: 'slide_from_right' }} />
        <RootStack.Screen name="AreaDetail"       component={AreaDetailScreen}       options={{ animation: 'slide_from_right' }} />
        <RootStack.Screen name="AreaCalendar"     component={AreaCalendarScreen}     options={{ animation: 'slide_from_right' }} />
        <RootStack.Screen name="AreaForm"         component={AreaFormScreen}         options={{ animation: 'slide_from_right' }} />
        <RootStack.Screen name="PqrHome"          component={PqrHomeScreen}          options={{ animation: 'slide_from_right' }} />
        <RootStack.Screen name="PqrCreate"        component={PqrCreateScreen}        options={{ animation: 'slide_from_bottom' }} />
        <RootStack.Screen name="PqrDetail"        component={PqrDetailScreen}        options={{ animation: 'slide_from_right' }} />
        <RootStack.Screen name="Notifications"    component={NotificationsScreen}    options={{ animation: 'slide_from_right' }} />
        <RootStack.Screen name="Announcements"    component={AnnouncementsScreen}    options={{ animation: 'slide_from_right' }} />
        <RootStack.Screen name="AnnouncementDetail" component={AnnouncementDetailScreen} options={{ animation: 'slide_from_right' }} />
        <RootStack.Screen name="Reception"        component={ReceptionScreen}        options={{ animation: 'slide_from_right' }} />
        <RootStack.Screen name="ReceptionChat"     component={ReceptionChatScreen}    options={{ animation: 'slide_from_right' }} />
        <RootStack.Screen name="GuardReception"   component={GuardReceptionScreen}   options={{ animation: 'slide_from_right' }} />
        <RootStack.Screen name="GuardChatList"    component={GuardChatListScreen}    options={{ animation: 'slide_from_right' }} />
        <RootStack.Screen name="EditProfile"      component={EditProfileScreen}      options={{ animation: 'slide_from_right' }} />
        {/* Admin-only screens */}
        <RootStack.Screen name="AdminAreaManagement"     component={AdminAreaManagementScreen}    options={{ animation: 'slide_from_right' }} />
        <RootStack.Screen name="AdminConjuntoPanel"      component={AdminConjuntoPanel}           options={{ animation: 'slide_from_right' }} />
        <RootStack.Screen name="AdminMembers"            component={AdminMembersScreen}           options={{ animation: 'slide_from_right' }} />
        <RootStack.Screen name="AdminAnnouncementCreate" component={AdminAnnouncementCreateScreen} options={{ animation: 'slide_from_right' }} />
        <RootStack.Screen name="AdminPqr"                component={AdminPqrScreen}               options={{ animation: 'slide_from_right' }} />
        {/* In-app conjunto creation/join (admin already logged in) */}
        <RootStack.Screen name="InAppConjuntoSetup"      component={ConjuntoSetupScreen}          options={{ animation: 'slide_from_bottom' }} />
        <RootStack.Screen name="InAppConjuntoJoin"       component={ConjuntoJoinScreen}           options={{ animation: 'slide_from_right' }} />
        <RootStack.Screen name="InAppPendingApproval"    component={PendingApprovalScreen}        options={{ animation: 'slide_from_right' }} />
        {/* Shared screens */}
        <RootStack.Screen name="ConjuntoInfo"            component={ConjuntoInfoScreen}           options={{ animation: 'slide_from_right' }} />
        <RootStack.Screen name="ManualConvivencia"       component={ManualConvivenciaScreen}      options={{ animation: 'slide_from_right' }} />
        <RootStack.Screen name="PdfViewer"               component={PdfViewerScreen}              options={{ animation: 'slide_from_bottom' }} />
      </RootStack.Navigator>

      {!isAdmin && <FloatingChatBubble navigationRef={navigationRef} />}

      {/* Bottom tab bar — Inicio / Perfil (admins only see it on the conjuntos hub and profile) */}
      <Animated.View
        style={[
          styles.tabBar,
          { backgroundColor: colors.backgroundGreenWhite, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.iconContainer,
            { width: iconSize, height: iconSize },
            currentRoute === 'Inicio' && [styles.activeIconContainer, { backgroundColor: colors.mainGreen }],
          ]}
          onPress={() => navigationRef.current?.navigate('Inicio')}
          accessibilityRole="button"
          accessibilityLabel="Inicio"
          accessibilityState={{ selected: currentRoute === 'Inicio' }}
        >
          <Ionicons
            name={currentRoute === 'Inicio' ? 'home' : 'home-outline'}
            size={26}
            color={colors.darkmodeGreenBlack}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.iconContainer,
            { width: iconSize, height: iconSize },
            currentRoute === 'Perfil' && [styles.activeIconContainer, { backgroundColor: colors.mainGreen }],
          ]}
          onPress={() => navigationRef.current?.navigate('Perfil')}
          accessibilityRole="button"
          accessibilityLabel="Perfil"
          accessibilityState={{ selected: currentRoute === 'Perfil' }}
        >
          <Ionicons
            name={currentRoute === 'Perfil' ? 'person' : 'person-outline'}
            size={26}
            color={colors.darkmodeGreenBlack}
          />
        </TouchableOpacity>
      </Animated.View>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <View style={Platform.OS === 'web' ? styles.webAppContainer : styles.mobileAppContainer}>
      <AuthProvider>
        <AccessibilityProvider>
          <BookingProvider>
            <PqrProvider>
              <NotificationsProvider>
                <ReceptionChatProvider>
                  <AppNavigator />
                </ReceptionChatProvider>
              </NotificationsProvider>
            </PqrProvider>
          </BookingProvider>
        </AccessibilityProvider>
      </AuthProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  webAppContainer: {
    flex: 1,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    ...Platform.select({
      web: {
        boxShadow: '0px 0px 20px rgba(0,0,0,0.1)',
        height: '100vh',
      }
    })
  },
  mobileAppContainer: {
    flex: 1,
  },
  tabBar: {
    position: 'absolute',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    height: 60,
    width: '64%',
    alignSelf: 'center',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    alignItems: 'center',
    paddingBottom: 8,
  },
  iconContainer: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },
  activeIconContainer: {
  },
});
