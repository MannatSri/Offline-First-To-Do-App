import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  StyleSheet,
} from 'react-native';
import { useTasks } from './src/hooks/useTask';
import TaskItem from './src/components/TaskItem';

export default function App() {
  const { tasks, isSyncing, addTask, updateTask, deleteTask } = useTasks();
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const pending = useMemo(() => tasks.filter(t => !t.completed), [tasks]);
  const completed = useMemo(() => tasks.filter(t => t.completed), [tasks]);

  const openAdd = () => {
    setEditing(null);
    setTitle('');
    setDesc('');
    setModalVisible(true);
  };

  const onSave = async () => {
    if (editing) {
      await updateTask(editing.localId, { title, description: desc });
    } else {
      console.log(title, 'title', desc);
      await addTask(title, desc);
    }
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.todoText}>To-Do</Text>
          <View>
            {isSyncing ? <Text>Syncing...</Text> : <Text>All Synced</Text>}
          </View>
        </View>

        <TouchableOpacity onPress={openAdd} style={styles.addBtn}>
          <Text style={styles.addBtnText}>Add Task</Text>
        </TouchableOpacity>

        <Text style={styles.taskStatusText}>Pending</Text>
        <FlatList
          data={pending}
          renderItem={({ item }) => (
            <TaskItem
              item={item}
              onToggle={(id, next) => updateTask(id, { completed: next })}
              onDelete={deleteTask}
              onEdit={it => {
                setEditing(it);
                setTitle(it.title);
                setDesc(it.description || '');
                setModalVisible(true);
              }}
            />
          )}
          keyExtractor={t => t.localId}
        />

        <Text style={styles.taskStatusText}>Completed</Text>
        <FlatList
          data={completed}
          renderItem={({ item }) => (
            <TaskItem
              item={item}
              onToggle={(id, next) => updateTask(id, { completed: next })}
              onDelete={deleteTask}
              onEdit={it => {
                setEditing(it);
                setTitle(it.title);
                setDesc(it.description || '');
                setModalVisible(true);
              }}
            />
          )}
          keyExtractor={t => t.localId}
        />

        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalInnerContainer}>
              <View style={styles.modalView}>
                <TextInput
                  placeholder="Title"
                  value={title}
                  onChangeText={setTitle}
                  autoCorrect={false}
                  style={styles.textInput}
                />
                <TextInput
                  placeholder="Description"
                  value={desc}
                  autoCorrect={false}
                  onChangeText={setDesc}
                  style={styles.textInput}
                />
                <View style={styles.btnContainer}>
                  <TouchableOpacity onPress={onSave} style={styles.modalBtn}>
                    <Text style={styles.modalBtnText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={styles.modalBtn}
                  >
                    <Text style={styles.modalBtnText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  todoText: {
    fontSize: 22,
  },
  addBtn: {
    marginVertical: 12,
    borderWidth: 1,
    alignSelf: 'flex-start',
    padding: 4,
    borderRadius: 4,
  },
  addBtnText: {
    fontSize: 14,
  },
  taskStatusText: {
    marginTop: 8,
    fontWeight: '700',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalInnerContainer: {
    justifyContent: 'center',
    padding: 20,
    flex: 1,
  },
  modalView: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  textInput: {
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  btnContainer: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 8,
  },
  modalBtn: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 4,
  },
  modalBtnText: {
    fontSize: 14,
  },
});
