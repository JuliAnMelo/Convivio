import React, { useContext, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';
import { useReceptionChat } from '../context/ReceptionChatContext';
import { usePqr } from '../context/PqrContext';
import { AuthContext } from '../context/AuthContext';

export default function CategoriesScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const { hasUnread, guardUnreadCount } = useReceptionChat();
  const { hasUnansweredTickets } = usePqr();
  const { colors, typography, st, fw, minTarget } = useAppTheme();
  const isGuard = user?.role === 'guarda';
  const hasConjunto = !!user?.conjuntoId;

  // Dismiss the categories sheet (slides down) before opening the chosen section
  const openSection = (screen, params) => {
    navigation.goBack();
    navigation.navigate(screen, params);
  };
  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.card },
    contentWrap: { 
      flex: 1, 
      padding: 20,
      paddingTop: 30,
    },
    title: { 
      ...typography.title, 
      color: colors.lettersAndIcons, 
      textAlign: 'center', 
      marginVertical: 20,
    },
    grid: { 
      flexDirection: 'row', 
      flexWrap: 'wrap', 
      justifyContent: 'flex-start',
      marginTop: 10,
      paddingHorizontal: 0,
    },
    catWrap: {
      width: '33.3%', 
      alignItems: 'center',
      marginBottom: 25,
    },
    catButton: { 
      width: 75, 
      height: 75, 
      borderRadius: 22, 
      alignItems: 'center', 
      justifyContent: 'center',
      marginBottom: 8,
    },
    catText: {
      ...typography.paragraph,
      fontWeight: fw('600'),
      fontSize: st(12),
      color: colors.lettersAndIcons,
      textAlign: 'center',
    },
    notifBadge: {
      position: 'absolute',
      top: 5,
      right: 5,
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: colors.errorRed,
      borderWidth: 2,
      borderColor: colors.card,
    },
    emptyWrap: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
      gap: 16,
    },
    emptyIconCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.lightGreen,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyTitle: {
      ...typography.subtitle,
      color: colors.lettersAndIcons,
      fontWeight: fw('700'),
      fontSize: st(16),
      textAlign: 'center',
    },
    emptySubtitle: {
      ...typography.paragraph,
      color: colors.lettersAndIcons,
      fontSize: st(13),
      textAlign: 'center',
      opacity: 0.65,
      lineHeight: 20,
    },
    joinBtn: {
      marginTop: 8,
      backgroundColor: colors.mainGreen,
      borderRadius: 22,
      paddingVertical: 12,
      paddingHorizontal: 28,
    },
    joinBtnText: {
      ...typography.subtitle,
      color: colors.darkmodeGreenBlack,
      fontWeight: fw('700'),
      fontSize: st(14),
    },
  }), [colors, typography, st, fw]);

  const CategoryButton = ({ title, onPress, svgSource, iconName, isActive, hasBadge }) => (
    <TouchableOpacity style={styles.catWrap} onPress={onPress}>
      <View
        style={[
          styles.catButton,
          { backgroundColor: isActive ? colors.oceanBlueButton : colors.lightBlueButton },
        ]}
      >
        {svgSource ? (
          <Image source={svgSource} style={{ width: 36, height: 36, tintColor: '#FFF' }} contentFit="contain" />
        ) : iconName ? (
          <Ionicons name={iconName} size={34} color="#FFF" />
        ) : null}
        {hasBadge && <View style={styles.notifBadge} />}
      </View>
      <Text style={styles.catText}>{title}</Text>
    </TouchableOpacity>
  );

  if (!hasConjunto) {
    return (
      <View style={styles.container}>
        <View style={styles.contentWrap}>
          <Text style={styles.title}>Categorías</Text>
          <View style={styles.emptyWrap}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="business-outline" size={38} color={colors.mainGreen} />
            </View>
            <Text style={styles.emptyTitle}>Únete a un conjunto</Text>
            <Text style={styles.emptySubtitle}>
              Necesitas pertenecer a un conjunto residencial para acceder a las categorías.
            </Text>
            <TouchableOpacity
              style={styles.joinBtn}
              onPress={() => {
                navigation.goBack();
                navigation.navigate('InAppConjuntoJoin', {
                  mode: 'homeJoin',
                  userData: { name: user?.name, email: user?.email, phone: user?.phone, dob: user?.dob, torre: user?.torre },
                  role: user?.role,
                });
              }}
            >
              <Text style={styles.joinBtnText}>Unirme ahora</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.contentWrap}>
        <Text style={styles.title}>Categorías</Text>

        <View style={styles.grid}>
          <CategoryButton
            title="Anuncios"
            isActive={true}
            svgSource={require('../../assets/vectors/anuncios1.svg')}
            onPress={() => openSection('Announcements')}
          />
          {!isGuard && (
            <CategoryButton
              title={"Áreas\nComunes"}
              isActive={false}
              svgSource={require('../../assets/vectors/reserva.svg')}
              onPress={() => openSection('Areas')}
            />
          )}
          <CategoryButton
            title={isGuard ? "Comunicación\nPropietarios" : "Recepción"}
            isActive={false}
            hasBadge={isGuard ? guardUnreadCount > 0 : hasUnread}
            svgSource={isGuard ? null : require('../../assets/vectors/recepcion.svg')}
            iconName={isGuard ? 'chatbubbles-outline' : null}
            onPress={() => openSection(isGuard ? 'GuardChatList' : 'Reception')}
          />
          <CategoryButton
            title={"PQRs\nAdministración"}
            isActive={false}
            hasBadge={hasUnansweredTickets()}
            svgSource={require('../../assets/vectors/Profile.svg')}
            onPress={() => openSection('PqrHome')}
          />
          <CategoryButton
            title={"Manual de\nConvivencia"}
            isActive={false}
            svgSource={require('../../assets/vectors/manual.svg')}
            onPress={() => openSection('ManualConvivencia')}
          />
        </View>
      </View>
    </View>
  );
}
