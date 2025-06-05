import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

const SmartChat = () => {
  const botMessages = [
    "Wanderland'e hoş geldiniz! 🌟",
    "Burada size özel seyahat önerileri sunabilirim, en iyi rotaları planlayabilirim ve seyahat deneyiminizi kişiselleştirebilirim.",
    "Ayrıca yerel kültür hakkında bilgiler, restoranlar ve aktiviteler konusunda da yardımcı olabilirim.",
    "Sizinle yakında konuşmaya başlayacağım! Hazır olduğumda size bildirim göndereceğim. 💬"
  ]

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SmartTraveller</Text>
        <Text style={styles.headerSubtitle}>Akıllı Seyahat Asistanı Her Zaman Sizinle</Text>
      </View>
      
      <ScrollView style={styles.chatContainer} contentContainerStyle={styles.chatContent}>
        {botMessages.map((message, index) => (
          <View key={index} style={styles.messageContainer}>
            <View style={styles.botMessage}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>🤖</Text>
              </View>
              <View style={styles.messageBubble}>
                <Text style={styles.messageText}>{message}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
      
      <View style={styles.inputContainer}>
        <Text style={styles.comingSoonText}>Yakında aktif olacak...</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#0a7ea5',
    padding: 20,
    paddingTop: 70,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e0e7ff',
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  chatContent: {
    paddingVertical: 20,
  },
  messageContainer: {
    marginBottom: 16,
  },
  botMessage: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0a7ea5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
  },
  messageBubble: {
    backgroundColor: 'white',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 22,
  },
  inputContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    alignItems: 'center',
  },
  comingSoonText: {
    fontSize: 16,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
})

export default SmartChat;