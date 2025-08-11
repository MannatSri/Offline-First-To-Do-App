import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const TaskItem = ({ item, onToggle, onDelete, onEdit }) => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>{item.title}</Text>
        {item.description ? (
          <Text style={styles.desp}>{item.description}</Text>
        ) : null}
      </View>
      <View style={styles.actionContainer}>
        <TouchableOpacity
          onPress={() => onToggle(item.localId, !item.completed)}
          style={styles.actionBtn}
        >
          <Text style={styles.actionText}>
            {item.completed ? 'Undo' : 'Done'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => onEdit(item)}>
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => onDelete(item.localId)}
        >
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TaskItem;

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 8,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: '500',
    fontSize: 14,
  },
  desp: {
    color: '#666',
    fontSize: 12,
    fontWeight: '400',
  },
  actionContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  actionText: {
    fontSize: 14,
  },
  actionBtn: {
    borderWidth: 1,
    height: 24,
    paddingHorizontal: 4,
    justifyContent: 'center',
    borderRadius: 4,
  },
});
