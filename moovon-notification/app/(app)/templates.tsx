import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
import { Text, useTheme, Surface, IconButton, FAB, Chip, Divider, Menu } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { useTemplatesStore, TemplateItem } from '../../store/templatesStore';

export default function TemplatesScreen() {
  const theme = useTheme();
  const router = useRouter();
  const user = useAuthStore(s => s.user);
  
  const { templates, isLoading, fetchTemplates, deleteTemplate } = useTemplatesStore();
  const [menuVisible, setMenuVisible] = useState<string | null>(null);

  useEffect(() => {
    if (user) fetchTemplates();
  }, [user]);

  const handleDelete = (id: string) => {
    setMenuVisible(null);
    Alert.alert('Delete Template', 'Are you sure you want to delete this template? This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive',
        onPress: async () => {
          await deleteTemplate(id);
        }
      }
    ]);
  };

  const renderTemplate = ({ item }: { item: TemplateItem }) => {
    const isEmail = item.channel === 'email';
    
    return (
      <Surface style={styles.card} elevation={1}>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text variant="titleMedium" style={{ fontWeight: 'bold', color: theme.colors.primary }}>
              {item.name}
            </Text>
            <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
              <Chip compact textStyle={{ fontSize: 10 }}>{item.type.replace(/_/g, ' ')}</Chip>
              <Chip compact style={{ backgroundColor: isEmail ? '#e3f2fd' : '#f3e5f5' }} textStyle={{ color: isEmail ? '#1565c0' : '#7b1fa2', fontSize: 10 }}>
                {item.channel.toUpperCase()}
              </Chip>
              {!item.isActive && <Chip compact style={{ backgroundColor: '#ffebee' }} textStyle={{ color: '#c62828', fontSize: 10 }}>INACTIVE</Chip>}
            </View>
          </View>
          
          <Menu
            visible={menuVisible === item.id}
            onDismiss={() => setMenuVisible(null)}
            anchor={<IconButton icon="dots-vertical" onPress={() => setMenuVisible(item.id)} />}
          >
            <Menu.Item onPress={() => { setMenuVisible(null); router.push({ pathname: '/(app)/template-edit' as any, params: { id: item.id } }); }} title="Edit" leadingIcon="pencil" />
            <Divider />
            <Menu.Item onPress={() => handleDelete(item.id)} title="Delete" leadingIcon="delete" titleStyle={{ color: 'red' }} />
          </Menu>
        </View>

        <Divider style={{ marginVertical: 12 }} />
        
        {isEmail && item.subject && (
          <View style={{ marginBottom: 8 }}>
            <Text variant="bodySmall" style={{ color: '#666', fontWeight: 'bold' }}>Subject:</Text>
            <Text variant="bodyMedium">{item.subject}</Text>
          </View>
        )}
        
        <View>
          <Text variant="bodySmall" style={{ color: '#666', fontWeight: 'bold' }}>Body Preview:</Text>
          <Text variant="bodyMedium" numberOfLines={3} style={{ color: '#444', fontStyle: 'italic' }}>
            "{item.body}"
          </Text>
        </View>
      </Surface>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: '#f5f5f5' }]}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={() => router.back()} style={{ marginLeft: -8 }} />
        <View>
          <Text variant="headlineMedium" style={styles.headerText}>Templates</Text>
          <Text variant="bodySmall" style={{ color: '#666' }}>Manage your notification messages</Text>
        </View>
      </View>

      <FlatList
        data={templates}
        keyExtractor={i => i.id}
        renderItem={renderTemplate}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchTemplates} />}
        ListEmptyComponent={
          !isLoading ? (
            <Text style={{ textAlign: 'center', marginTop: 60, color: '#999' }}>
              No custom templates yet. Create one!
            </Text>
          ) : null
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/(app)/template-edit' as any)}
        color="#fff"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: { fontWeight: 'bold', color: '#1a1a1a' },
  listContent: { padding: 16, paddingBottom: 80 },
  card: { borderRadius: 12, backgroundColor: '#fff', marginBottom: 14, padding: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#0057e7',
    borderRadius: 28,
  },
});
