import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Button, IconButton, SegmentedButtons, Switch, useTheme } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useCouponsStore, DiscountType } from '../../store/couponsStore';

export default function CouponEditScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const isEditing = !!id;
  const { coupons, createCoupon, updateCoupon, isLoading } = useCouponsStore();

  const [code, setCode] = useState('');
  const [type, setType] = useState<DiscountType>(DiscountType.PERCENTAGE);
  const [value, setValue] = useState('');
  const [minPurchaseAmount, setMinPurchaseAmount] = useState('0');
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [isActive, setIsActive] = useState(true);
  
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const existing = coupons.find(c => c.id === id);
      if (existing) {
        setCode(existing.code);
        setType(existing.type);
        setValue(existing.value.toString());
        setMinPurchaseAmount(existing.minPurchaseAmount.toString());
        setExpiryDate(existing.expiryDate ? new Date(existing.expiryDate) : null);
        setIsActive(existing.isActive);
      }
    }
  }, [id, coupons]);

  const handleSave = async () => {
    if (!code.trim() || !value.trim()) {
      return Alert.alert('Error', 'Please fill in all required fields');
    }

    const payload = {
      code,
      type,
      value: Number(value),
      minPurchaseAmount: Number(minPurchaseAmount),
      expiryDate: expiryDate ? expiryDate.toISOString() : undefined,
      isActive,
    };

    try {
      if (isEditing) {
        await updateCoupon(id as string, payload);
      } else {
        await createCoupon(payload);
      }
      router.back();
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || 'Failed to save coupon');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={() => router.back()} style={{ marginLeft: -8 }} />
        <Text variant="titleLarge" style={{ fontWeight: 'bold' }}>
          {isEditing ? 'Edit Coupon' : 'Create Coupon'}
        </Text>
      </View>

      <View style={styles.form}>
        <TextInput
          label="Coupon Code"
          value={code}
          onChangeText={t => setCode(t.toUpperCase().replace(/\s/g, ''))}
          mode="outlined"
          autoCapitalize="characters"
          style={styles.input}
        />

        <Text variant="titleMedium" style={styles.label}>Discount Type</Text>
        <SegmentedButtons
          value={type}
          onValueChange={v => setType(v as DiscountType)}
          buttons={[
            { value: DiscountType.PERCENTAGE, label: 'Percentage (%)' },
            { value: DiscountType.FIXED, label: 'Fixed Amount (Rs)' },
          ]}
          style={styles.input}
        />

        <TextInput
          label={type === DiscountType.PERCENTAGE ? 'Discount %' : 'Discount Amount (Rs)'}
          value={value}
          onChangeText={setValue}
          mode="outlined"
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          label="Minimum Purchase Amount (Optional)"
          value={minPurchaseAmount}
          onChangeText={setMinPurchaseAmount}
          mode="outlined"
          keyboardType="numeric"
          style={styles.input}
        />

        <View style={styles.dateRow}>
          <Text variant="bodyLarge">Expiry Date</Text>
          <Button mode="outlined" onPress={() => setShowDatePicker(true)}>
            {expiryDate ? expiryDate.toLocaleDateString() : 'No Expiry'}
          </Button>
        </View>

        {expiryDate && (
          <Button mode="text" onPress={() => setExpiryDate(null)} style={{ alignSelf: 'flex-end' }}>
            Clear Expiry Date
          </Button>
        )}

        {showDatePicker && (
          <DateTimePicker
            value={expiryDate || new Date()}
            mode="date"
            onChange={(e, d) => { setShowDatePicker(false); if(d) setExpiryDate(d); }}
            minimumDate={new Date()}
          />
        )}

        <View style={styles.switchRow}>
          <Text variant="bodyLarge">Active Status</Text>
          <Switch value={isActive} onValueChange={setIsActive} color="#0057e7" />
        </View>

        <Button 
          mode="contained" 
          onPress={handleSave} 
          loading={isLoading}
          style={styles.saveBtn}
          contentStyle={{ paddingVertical: 8 }}
        >
          Save Coupon
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  form: { padding: 16 },
  input: { marginBottom: 16 },
  label: { marginBottom: 8, color: '#333' },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
    marginVertical: 16,
  },
  saveBtn: {
    marginTop: 24,
    backgroundColor: '#0057e7',
    borderRadius: 8,
  }
});
