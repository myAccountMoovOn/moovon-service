import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, TextInput } from 'react-native-paper';

interface Props {
  formData: any;
  handleChange: (key: string, value: string) => void;
}

export default function GeneralDetailsForm({ formData, handleChange }: Props) {
  return (
    <>
      <Text variant="titleMedium" style={styles.sectionTitle}>General Details</Text>
      <TextInput label="Company Name" value={formData.name} onChangeText={(v) => handleChange('name', v)} mode="outlined" style={styles.input} />
      <TextInput label="App Name" value={formData.appName} onChangeText={(v) => handleChange('appName', v)} mode="outlined" style={styles.input} />
      <TextInput label="Tagline" value={formData.tagline} onChangeText={(v) => handleChange('tagline', v)} mode="outlined" style={styles.input} />
    </>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { marginTop: 16, marginBottom: 12, fontWeight: 'bold', color: '#333' },
  input: { marginBottom: 16 },
});
