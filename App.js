// App.js
import React, { useState } from 'react';
import { SafeAreaView, TextInput, Button, Text, View, StyleSheet, ScrollView } from 'react-native';

export default function App() {
  const [situation, setSituation] = useState('');
  const [country, setCountry] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheckLegality = async () => {
    setLoading(true);
    setResponse('');
    try {
      const prompt = `You are a legal expert AI. Evaluate the legality of this situation in ${country}: "${situation}". Provide a short response referencing the country's constitution or legal framework.`;

      const result = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_OPENAI_API_KEY',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: 'You are a legal expert AI.' },
            { role: 'user', content: prompt },
          ],
        })
      });

      const data = await result.json();
      setResponse(data.choices?.[0]?.message?.content || 'No response received.');
    } catch (error) {
      setResponse('Error checking legality.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Legal Assist App</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your country (e.g., USA, India)"
          value={country}
          onChangeText={setCountry}
        />
        <TextInput
          style={styles.input}
          placeholder="Describe your situation"
          value={situation}
          onChangeText={setSituation}
          multiline
        />
        <Button title={loading ? 'Checking...' : 'Check Legality'} onPress={handleCheckLegality} disabled={loading} />
        {response ? <View style={styles.responseBox}><Text style={styles.response}>{response}</Text></View> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
  },
  responseBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
  },
  response: {
    fontSize: 16,
  },
});
