import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, TextInput } from 'react-native-paper';

interface Props {
  formData: any;
  handleChange: (key: string, value: string) => void;
}

export default function CustomDomainForm({ formData, handleChange }: Props) {
  return (
    <>
      <Text variant="titleMedium" style={styles.sectionTitle}>Custom Domain</Text>
      <TextInput label="Custom Domain (Web App)" value={formData.customDomain} onChangeText={(v) => handleChange('customDomain', v)} mode="outlined" placeholder="portal.yourdomain.com" autoCapitalize="none" autoCorrect={false} style={styles.input} left={<TextInput.Affix text="https://" />} />
      <Text variant="bodySmall" style={styles.helpText}>Point a CNAME record from your domain to portal.moovon.app</Text>
    </>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { marginTop: 16, marginBottom: 12, fontWeight: 'bold', color: '#333' },
  input: { marginBottom: 16 },
  helpText: { marginTop: -8, marginBottom: 24, color: '#777' },
});
