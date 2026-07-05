import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, useTheme, IconButton, FAB, Divider, Portal, Modal, TextInput, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useCategoriesStore, Category } from '../../store/categoriesStore';

export default function CategoriesScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { categories, fetchCategories, createCategory, updateCategory, deleteCategory, isLoading } = useCategoriesStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingId(category.id);
      setName(category.name);
      setDescription(category.description || '');
    } else {
      setEditingId(null);
      setName('');
      setDescription('');
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!name.trim()) return Alert.alert('Error', 'Category name is required');
    try {
      if (editingId) {
        await updateCategory(editingId, { name, description });
      } else {
        await createCategory({ name, description });
      }
      setModalVisible(false);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to save category');
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this category?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteCategory(id);
          } catch (e) {
            Alert.alert('Error', 'Failed to delete category');
          }
        }
      }
    ]);
  };

  const renderItem = ({ item }: { item: Category }) => (
    <View style={styles.listItem}>
      <View style={{ flex: 1 }}>
        <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{item.name}</Text>
        <Text variant="bodyMedium" style={{ color: '#666', marginTop: 4 }}>{item.description || 'No description'}</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <IconButton icon="pencil" onPress={() => handleOpenModal(item)} />
        <IconButton icon="delete" iconColor="#d32f2f" onPress={() => handleDelete(item.id)} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={() => router.back()} style={{ marginLeft: -8 }} />
        <View>
          <Text variant="headlineMedium" style={styles.headerText}>Categories</Text>
          <Text variant="bodySmall" style={{ color: '#666' }}>Manage your service catalog</Text>
        </View>
      </View>

      <FlatList
        data={categories}
        keyExtractor={i => i.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        ItemSeparatorComponent={() => <Divider />}
        refreshing={isLoading}
        onRefresh={fetchCategories}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 40, color: '#999' }}>No categories found. Create one!</Text>}
      />

      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modal}>
          <Text variant="titleLarge" style={{ marginBottom: 16, fontWeight: 'bold' }}>
            {editingId ? 'Edit Category' : 'New Category'}
          </Text>
          
          <TextInput
            label="Category Name"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={{ marginBottom: 16 }}
          />
          
          <TextInput
            label="Description (Optional)"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={{ marginBottom: 24 }}
          />
          
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
            <Button onPress={() => setModalVisible(false)}>Cancel</Button>
            <Button mode="contained" onPress={handleSave} loading={isLoading}>Save</Button>
          </View>
        </Modal>
      </Portal>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => handleOpenModal()}
        color="#fff"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  headerText: { fontWeight: 'bold', color: '#1a1a1a' },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#0057e7',
  },
  modal: {
    backgroundColor: 'white',
    padding: 24,
    margin: 20,
    borderRadius: 16,
  }
});
