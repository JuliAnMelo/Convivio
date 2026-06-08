import React, { useEffect, useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { Asset } from 'expo-asset';
import { useAppTheme } from '../theme';

export default function PdfViewerScreen({ navigation, route }) {
  const { title = 'Documento', source } = route.params || {};
  const { colors, st, fw, minTarget } = useAppTheme();
  const [uri, setUri] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        let resolvedUri = source;
        if (typeof source !== 'string') {
          const [asset] = await Asset.loadAsync(source);
          resolvedUri = asset.localUri || asset.uri;
        }
        if (!cancelled) setUri(resolvedUri);
      } catch (e) {
        if (!cancelled) setError(true);
      }
    })();
    return () => { cancelled = true; };
  }, [source]);

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.mainGreen },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 8,
    },
    backButton: {
      padding: 5,
      minWidth: minTarget,
      minHeight: minTarget,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerCenter: { flex: 1, paddingHorizontal: 4 },
    headerTitle: {
      color: '#FFF',
      fontSize: st(20),
      fontWeight: fw('800'),
    },
    headerSpacer: { width: 44 },
    body: {
      flex: 1,
      backgroundColor: '#525659',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      overflow: 'hidden',
    },
    webview: { flex: 1, backgroundColor: '#525659' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
    errorTitle: {
      color: '#FFF',
      fontSize: st(15),
      fontWeight: fw('700'),
      marginTop: 12,
      textAlign: 'center',
    },
    errorSub: {
      color: 'rgba(255,255,255,0.7)',
      fontSize: st(12),
      marginTop: 6,
      textAlign: 'center',
    },
  }), [colors, st, fw, minTarget]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.body}>
        {error ? (
          <View style={styles.centered}>
            <Ionicons name="alert-circle-outline" size={44} color="#FFF" />
            <Text style={styles.errorTitle}>No se pudo abrir el documento</Text>
            <Text style={styles.errorSub}>Inténtalo de nuevo más tarde.</Text>
          </View>
        ) : !uri ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#FFF" />
          </View>
        ) : (
          <WebView
            source={{ uri }}
            style={styles.webview}
            originWhitelist={['*']}
            allowFileAccess
            allowUniversalAccessFromFileURLs
            androidLayerType={Platform.OS === 'android' ? 'hardware' : undefined}
            onError={() => setError(true)}
            startInLoadingState
            renderLoading={() => (
              <View style={[StyleSheet.absoluteFill, styles.centered]}>
                <ActivityIndicator size="large" color="#FFF" />
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
