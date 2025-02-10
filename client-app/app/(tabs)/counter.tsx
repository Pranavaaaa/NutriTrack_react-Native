import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../redux/store';
import { decrement, increment } from '../../redux/features/counter/counterSlice';

const Counter: React.FC = () => {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Counter</Text>
      <View style={styles.counterContainer}>
        <Button
          title="Increment"
          onPress={() => dispatch(increment())}
        />
        <Text style={styles.count}>{count}</Text>
        <Button
          title="Decrement"
          onPress={() => dispatch(decrement())}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  count: {
    fontSize: 32,
    fontWeight: 'bold',
    marginHorizontal: 16,
  },
});

export default Counter;