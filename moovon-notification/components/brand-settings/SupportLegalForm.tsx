import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, TextInput } from 'react-native-paper';

interface Props {
  formData: any;
  handleChange: (key: string, value: string) => void;
}

export default function SupportLegalForm({ formData, handleChange }: Props) {
  return (
    <>
      <Text variant="titleMedium" style={styles.sectionTitle}>Support & Legal</Text>
      <TextInput label="Support Email" value={formData.supportEmail} onChangeText={(v) => handleChange('supportEmail', v)} mode="outlined" autoCapitalize="none" keyboardType="email-address" style={styles.input} />
      <TextInput label="Support Phone" value={formData.supportPhone} onChangeText={(v) => handleChange('supportPhone', v)} mode="outlined" keyboardType="phone-pad" style={styles.input} />
      <TextInput label="Privacy Policy URL" value={formData.privacyPolicyUrl} onChangeText={(v) => handleChange('privacyPolicyUrl', v)} mode="outlined" autoCapitalize="none" style={styles.input} />
      <TextInput label="Terms of Service URL" value={formData.termsUrl} onChangeText={(v) => handleChange('termsUrl', v)} mode="outlined" autoCapitalize="none" style={styles.input} />
      <TextInput label="Footer Text" value={formData.footerText} onChangeText={(v) => handleChange('footerText', v)} mode="outlined" style={styles.input} />
    </>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { marginTop: 16, marginBottom: 12, fontWeight: 'bold', color: '#333' },
  input: { marginBottom: 16 },
});
