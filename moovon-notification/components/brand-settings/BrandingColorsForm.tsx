import React from 'react';
import { View, StyleSheet, Image, Alert } from 'react-native';
import { Text, TextInput } from 'react-native-paper';

interface Props {
  formData: any;
  handleChange: (key: string, value: string) => void;
}

export default function BrandingColorsForm({ formData, handleChange }: Props) {
  return (
    <>
      <Text variant="titleMedium" style={styles.sectionTitle}>Branding & Colors</Text>
      <TextInput label="Primary Color (Hex)" value={formData.primaryColor} onChangeText={(v) => handleChange('primaryColor', v)} mode="outlined" style={styles.input} placeholder="#0057e7" autoCapitalize="none" />
      <TextInput label="Accent Color (Hex)" value={formData.accentColor} onChangeText={(v) => handleChange('accentColor', v)} mode="outlined" style={styles.input} placeholder="#ff0000" autoCapitalize="none" />
      <TextInput label="Primary Logo URL" value={formData.logo} onChangeText={(v) => handleChange('logo', v)} mode="outlined" placeholder="https://example.com/logo.png" autoCapitalize="none" style={styles.input} />
      <TextInput label="Favicon URL" value={formData.favicon} onChangeText={(v) => handleChange('favicon', v)} mode="outlined" placeholder="https://example.com/favicon.ico" autoCapitalize="none" style={styles.input} />
      <TextInput label="Mobile App Icon URL" value={formData.appIconUrl} onChangeText={(v) => handleChange('appIconUrl', v)} mode="outlined" placeholder="https://example.com/icon.png" autoCapitalize="none" style={styles.input} />

      {formData.logo ? (
        <View style={styles.previewContainer}>
          <Text variant="bodySmall" style={{ marginBottom: 8, color: '#666' }}>Primary Logo Preview:</Text>
          <Image source={{ uri: formData.logo }} style={{ width: 100, height: 100, resizeMode: 'contain', borderRadius: 8, backgroundColor: '#f9f9f9' }} onError={() => Alert.alert('Error', 'Failed to load logo from URL')} />
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { marginTop: 16, marginBottom: 12, fontWeight: 'bold', color: '#333' },
  input: { marginBottom: 16 },
  previewContainer: {
    marginBottom: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    alignItems: 'center',
  },
});
