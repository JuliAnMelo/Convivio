import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { COLORS, TYPOGRAPHY } from '../theme';

const CategoryButton = ({ title, onPress, svgSource, isActive }) => (
  <TouchableOpacity style={styles.catWrap} onPress={onPress}>
    <View style={[styles.catButton, { backgroundColor: isActive ? '#0054F9' : '#77B5FE' }]}>
      {svgSource ? (
        <Image source={svgSource} style={{ width: 36, height: 36, tintColor: '#FFF' }} contentFit="contain" />
      ) : null}
    </View>
    <Text style={styles.catText}>{title}</Text>
  </TouchableOpacity>
);

export default function CategoriesScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.contentWrap}>
        <Text style={styles.title}>Categorías</Text>

        <View style={styles.grid}>
          <CategoryButton 
            title="Anuncios" 
            isActive={true}
            svgSource={require('../../assets/vectors/anuncios1.svg')} 
            onPress={() => {}} 
          />
          <CategoryButton 
            title={"Áreas\nComunes"} 
            isActive={false}
            svgSource={require('../../assets/vectors/teddybear.svg')} 
            onPress={() => navigation.replace('Areas')} 
          />
          <CategoryButton 
            title="Recepción" 
            isActive={false}
            svgSource={require('../../assets/vectors/recepcion.svg')} 
            onPress={() => {}} 
          />
          <CategoryButton 
            title={"PQRs\nAdministración"}
            isActive={false}
            svgSource={require('../../assets/vectors/Profile.svg')} 
            onPress={() => navigation.navigate('PqrHome')} 
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  contentWrap: { 
    flex: 1, 
    padding: 20,
    paddingTop: 30
  },
  title: { 
    ...TYPOGRAPHY.title, 
    color: COLORS.lettersAndIcons, 
    textAlign: 'center', 
    marginVertical: 20 
  },
  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'flex-start',
    marginTop: 10,
    paddingHorizontal: 0
  },
  catWrap: {
    width: '33.3%', 
    alignItems: 'center',
    marginBottom: 25
  },
  catButton: { 
    width: 75, 
    height: 75, 
    borderRadius: 22, 
    alignItems: 'center', 
    justifyContent: 'center',
    marginBottom: 8
  },
  catText: { 
    ...TYPOGRAPHY.paragraph, 
    fontWeight: '600', 
    fontSize: 12,
    color: COLORS.lettersAndIcons, 
    textAlign: 'center' 
  }
});
