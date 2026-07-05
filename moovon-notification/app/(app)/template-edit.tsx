import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, useTheme, TextInput, Button, IconButton, Switch, SegmentedButtons, Surface } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTemplatesStore } from '../../store/templatesStore';
import { NotificationChannel, NotificationTemplateType } from '../../store/templatesStore'; // need to map these or type string

export default function TemplateEditScreen() {
  const theme = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const templateId = params.id as string | undefined;

  const { templates, createTemplate, updateTemplate } = useTemplatesStore();
  const isEditing = !!templateId;

  const [name, setName] = useState('');
  const [type, setType] = useState('NEW_SUBSCRIPTION');
  const [channel, setChannel] = useState('email');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const t = templates.find(x => x.id === templateId);
      if (t) {
        setName(t.name);
        setType(t.type);
        setChannel(t.channel);
        setSubject(t.subject || '');
        setBody(t.body);
        setIsActive(t.isActive);
      }
    }
  }, [templateId, templates]);

  const handleSave = async () => {
    if (!name || !body) {
      Alert.alert('Error', 'Name and Body are required.');
      return;
    }
    
    setIsSaving(true);
    
    const payload = {
      name,
      type,
      channel,
      subject: channel === 'email' ? subject : undefined,
      body,
      isActive,
    };

    let success = false;
    if (isEditing) {
      success = await updateTemplate(templateId, payload);
    } else {
      success = await createTemplate(payload);
    }

    setIsSaving(false);
    if (success) {
      router.back();
    }
  };

  const variables = ['{{customer_name}}', '{{customer_email}}', '{{service_name}}', '{{amount}}', '{{start_date}}', '{{end_date}}', '{{payment_link}}'];

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={() => router.back()} style={{ marginLeft: -8 }} />
        <Text variant="headlineMedium" style={styles.headerText}>
          {isEditing ? 'Edit Template' : 'New Template'}
        </Text>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        
        <Surface style={styles.card} elevation={1}>
          <Text variant="titleMedium" style={{ marginBottom: 16, fontWeight: 'bold' }}>Template Details</Text>
          
          <TextInput
            label="Template Name *"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
            placeholder="e.g. My Welcome Email"
          />

          <Text variant="labelLarge" style={{ color: '#666', marginBottom: 8, marginTop: 8 }}>Channel</Text>
          <SegmentedButtons
            value={channel}
            onValueChange={setChannel}
            buttons={[
              { value: 'email', label: 'Email' },
              { value: 'sms', label: 'SMS' },
              { value: 'whatsapp', label: 'WhatsApp' },
            ]}
            style={{ marginBottom: 16 }}
          />

          <Text variant="labelLarge" style={{ color: '#666', marginBottom: 8 }}>Event Type</Text>
          <SegmentedButtons
            value={type}
            onValueChange={setType}
            buttons={[
              { value: 'NEW_SUBSCRIPTION', label: 'New Sub' },
              { value: 'PAYMENT_REMINDER', label: 'Reminder' },
              { value: 'PAYMENT_SUCCESS', label: 'Success' },
            ]}
            style={{ marginBottom: 16 }}
          />
        </Surface>

        <Surface style={styles.card} elevation={1}>
          <Text variant="titleMedium" style={{ marginBottom: 16, fontWeight: 'bold' }}>Content</Text>
          
          {channel === 'email' && (
            <TextInput
              label="Subject Line"
              value={subject}
              onChangeText={setSubject}
              mode="outlined"
              style={styles.input}
              placeholder="e.g. Welcome to {{service_name}}"
            />
          )}

          <TextInput
            label="Message Body *"
            value={body}
            onChangeText={setBody}
            mode="outlined"
            multiline
            numberOfLines={6}
            style={styles.input}
            placeholder={`Hi {{customer_name}},\n\nYour subscription to {{service_name}} is confirmed!`}
          />
          
          <View style={styles.variablesBox}>
            <Text variant="labelMedium" style={{ color: '#0057e7', fontWeight: 'bold', marginBottom: 6 }}>Available Variables:</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {variables.map(v => (
                <Text key={v} style={styles.variableBadge}>{v}</Text>
              ))}
            </View>
          </View>
        </Surface>

        <Surface style={[styles.card, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]} elevation={1}>
          <Text variant="titleMedium">Template is Active</Text>
          <Switch value={isActive} onValueChange={setIsActive} color={theme.colors.primary} />
        </Surface>

        <Button 
          mode="contained" 
          onPress={handleSave} 
          loading={isSaving}
          disabled={isSaving}
          style={styles.saveButton}
          contentStyle={{ height: 50 }}
        >
          {isEditing ? 'Save Changes' : 'Create Template'}
        </Button>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 10,
  },
  headerText: { fontWeight: 'bold', color: '#1a1a1a' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#fff'
  },
  variablesBox: {
    backgroundColor: 'rgba(0,87,231,0.05)',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,87,231,0.1)'
  },
  variableBadge: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    backgroundColor: '#fff',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    color: '#333',
    overflow: 'hidden'
  },
  saveButton: {
    marginTop: 8,
    borderRadius: 12,
  }
});
