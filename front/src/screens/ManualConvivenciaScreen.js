import React, { useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';
import * as Linking from 'expo-linking';
import { Asset } from 'expo-asset';
import * as Sharing from 'expo-sharing';

export default function ManualConvivenciaScreen({ navigation }) {
  const { colors, typography, st, fw, minTarget } = useAppTheme();

  const handleViewPdf = () => {
    if (Platform.OS === 'web') {
      Asset.loadAsync(require('../../assets/files/convivencia.pdf'))
        .then((asset) => window.open(asset[0].uri, '_blank'))
        .catch((e) => console.warn('Error abriendo PDF', e));
      return;
    }
    navigation.navigate('PdfViewer', {
      title: 'Manual de Convivencia',
      source: require('../../assets/files/convivencia.pdf'),
    });
  };

  const handleSharePdf = async () => {
    try {
      const asset = await Asset.loadAsync(require('../../assets/files/convivencia.pdf'));
      const uri = asset[0].localUri || asset[0].uri;
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Linking.openURL(uri);
      }
    } catch (e) {
      console.warn('Error compartiendo PDF', e);
    }
  };

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.mainGreen },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: 12,
      marginBottom: 8,
    },
    backButton: {
      padding: 5,
      minWidth: minTarget,
      minHeight: minTarget,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerCenter: { flex: 1, alignItems: 'center' },
    headerTitle: {
      color: '#FFF',
      fontSize: st(20),
      fontWeight: fw('800'),
    },
    headerSpacer: { width: 44 },
    body: {
      flex: 1,
      backgroundColor: colors.backgroundGreenWhite,
      borderTopLeftRadius: 35,
      borderTopRightRadius: 35,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    iconWrap: {
      width: 80,
      height: 80,
      backgroundColor: colors.mainGreen + '20',
      borderRadius: 40,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    title: {
      ...typography.title,
      fontSize: st(23),
      color: colors.lettersAndIcons,
      marginBottom: 10,
    },
    subtitle: {
      ...typography.paragraph,
      fontSize: st(14),
      color: colors.lettersAndIcons,
      opacity: 0.8,
      textAlign: 'center',
      marginBottom: 40,
    },
    button: {
      backgroundColor: colors.mainGreen,
      paddingHorizontal: 30,
      paddingVertical: 15,
      borderRadius: 30,
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: minTarget,
    },
    buttonText: {
      color: '#FFF',
      fontSize: st(16),
      fontWeight: fw('700'),
      marginLeft: 10,
    },
    secondaryButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 16,
      paddingVertical: 10,
      paddingHorizontal: 16,
      minHeight: minTarget,
    },
    secondaryButtonText: {
      color: colors.mainGreen,
      fontSize: st(14),
      fontWeight: fw('700'),
      marginLeft: 8,
    },
  }), [colors, typography, st, fw, minTarget]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Manual de Convivencia</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.body}>
        <View style={styles.iconWrap}>
          <Ionicons name="document-text" size={40} color={colors.mainGreen} />
        </View>
        <Text style={styles.title}>Normas del Conjunto</Text>
        <Text style={styles.subtitle}>
          Visualiza o descarga el archivo PDF con todas las normativas para la sana convivencia en el conjunto.
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleViewPdf}>
          <Ionicons name="eye-outline" size={24} color="#FFF" />
          <Text style={styles.buttonText}>Ver PDF</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={handleSharePdf}>
          <Ionicons name="download-outline" size={20} color={colors.mainGreen} />
          <Text style={styles.secondaryButtonText}>Descargar / Compartir</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
