import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, TextInput } from 'react-native-paper';

interface Props {
  formData: any;
  handleChange: (key: string, value: string) => void;
}

export default function SmtpConfigForm({ formData, handleChange }: Props) {
  return (
    <>
      <Text variant="titleMedium" style={styles.sectionTitle}>Custom SMTP Configuration</Text>
      <TextInput label="SMTP Host" value={formData.smtpHost} onChangeText={(v) => handleChange('smtpHost', v)} mode="outlined" placeholder="smtp.gmail.com" autoCapitalize="none" style={styles.input} />
      <TextInput label="SMTP Port" value={formData.smtpPort?.toString()} onChangeText={(v) => handleChange('smtpPort', v)} mode="outlined" placeholder="587" keyboardType="numeric" style={styles.input} />
      <TextInput label="SMTP Username" value={formData.smtpUser} onChangeText={(v) => handleChange('smtpUser', v)} mode="outlined" autoCapitalize="none" style={styles.input} />
      <TextInput label="SMTP Password" value={formData.smtpPass} onChangeText={(v) => handleChange('smtpPass', v)} mode="outlined" secureTextEntry autoCapitalize="none" style={styles.input} />
      <TextInput label="From Name (Sender)" value={formData.smtpFromName} onChangeText={(v) => handleChange('smtpFromName', v)} mode="outlined" placeholder="Moovon Notifications" style={styles.input} />
      <TextInput label="From Email Address" value={formData.smtpFromEmail} onChangeText={(v) => handleChange('smtpFromEmail', v)} mode="outlined" placeholder="noreply@yourdomain.com" autoCapitalize="none" style={styles.input} />
      <TextInput label="Email Header Logo URL" value={formData.emailHeaderLogo} onChangeText={(v) => handleChange('emailHeaderLogo', v)} mode="outlined" placeholder="Leave blank to use primary logo" autoCapitalize="none" style={styles.input} />
    </>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { marginTop: 16, marginBottom: 12, fontWeight: 'bold', color: '#333' },
  input: { marginBottom: 16 },
});
