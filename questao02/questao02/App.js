import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const MEDIA_APROVACAO = 7.0;

function formatar(numero) {
  return numero.toFixed(1).replace('.', ',');
}

export default function App() {
  const [nome, setNome] = useState('');
  const [nota1, setNota1] = useState('');
  const [nota2, setNota2] = useState('');
  const [nota3, setNota3] = useState('');
  const [erro, setErro] = useState('');
  const [resultado, setResultado] = useState(null);

  function converter(texto) {
    const limpo = texto.trim().replace(',', '.');
    if (limpo === '') return NaN;
    return Number(limpo);
  }

  function calcularMedia() {
    if (nome.trim() === '') {
      setResultado(null);
      setErro('Informe o nome do estudante.');
      return;
    }

    const notas = [nota1, nota2, nota3].map(converter);

    for (let i = 0; i < notas.length; i++) {
      if (Number.isNaN(notas[i])) {
        setResultado(null);
        setErro(`Informe um número válido na nota ${i + 1}.`);
        return;
      }
      if (notas[i] < 0 || notas[i] > 10) {
        setResultado(null);
        setErro(`A nota ${i + 1} deve estar entre 0 e 10.`);
        return;
      }
    }

    const media = (notas[0] + notas[1] + notas[2]) / 3;
    const aprovado = media >= MEDIA_APROVACAO;

    setErro('');
    setResultado({ nome: nome.trim(), media, aprovado });
  }

  function limpar() {
    setNome('');
    setNota1('');
    setNota2('');
    setNota3('');
    setErro('');
    setResultado(null);
  }

  const campoNota = (rotulo, valor, setValor) => (
    <View style={styles.campoNota}>
      <Text style={styles.label}>{rotulo}</Text>
      <TextInput
        style={styles.input}
        placeholder="0 a 10"
        placeholderTextColor="#9a9a9a"
        keyboardType="decimal-pad"
        value={valor}
        onChangeText={setValor}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.titulo}>Média do estudante</Text>
        <Text style={styles.subtitulo}>
          Aprovado com média igual ou maior que 7,0.
        </Text>

        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex.: Maria Silva"
          placeholderTextColor="#9a9a9a"
          value={nome}
          onChangeText={setNome}
        />

        <View style={styles.linhaNotas}>
          {campoNota('Nota 1', nota1, setNota1)}
          {campoNota('Nota 2', nota2, setNota2)}
          {campoNota('Nota 3', nota3, setNota3)}
        </View>

        {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

        <View style={styles.botoes}>
          <Pressable
            style={({ pressed }) => [styles.botao, pressed && styles.pressionado]}
            onPress={calcularMedia}
          >
            <Text style={styles.botaoTexto}>Calcular média</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.botao,
              styles.botaoSecundario,
              pressed && styles.pressionado,
            ]}
            onPress={limpar}
          >
            <Text style={[styles.botaoTexto, styles.botaoSecundarioTexto]}>Limpar</Text>
          </Pressable>
        </View>

        {resultado && (
          <View
            style={[
              styles.cartao,
              resultado.aprovado ? styles.cartaoAprovado : styles.cartaoReprovado,
            ]}
          >
            <Text style={styles.cartaoNome}>{resultado.nome}</Text>
            <Text style={styles.cartaoLabel}>Média</Text>
            <Text style={styles.cartaoMedia}>{formatar(resultado.media)}</Text>
            <Text
              style={[
                styles.situacao,
                resultado.aprovado ? styles.textoAprovado : styles.textoReprovado,
              ]}
            >
              {resultado.aprovado ? 'Aprovado' : 'Reprovado'}
            </Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#f6f4ee' },
  container: { padding: 24, paddingTop: 56 },
  titulo: { fontSize: 28, fontWeight: '700', color: '#23342b' },
  subtitulo: { fontSize: 15, color: '#5b6b62', marginTop: 4, marginBottom: 24 },
  label: { fontSize: 15, fontWeight: '600', color: '#23342b', marginBottom: 6 },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#cfd8d2',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 17,
    color: '#23342b',
  },
  linhaNotas: { flexDirection: 'row', gap: 10, marginTop: 16 },
  campoNota: { flex: 1 },
  erro: { color: '#b3261e', marginTop: 12, fontSize: 14 },
  botoes: { flexDirection: 'row', gap: 12, marginTop: 20 },
  botao: {
    flex: 1,
    backgroundColor: '#2f6f4f',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  pressionado: { opacity: 0.8 },
  botaoTexto: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  botaoSecundario: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#2f6f4f',
  },
  botaoSecundarioTexto: { color: '#2f6f4f' },
  cartao: {
    marginTop: 28,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 22,
    alignItems: 'center',
    borderWidth: 2,
  },
  cartaoAprovado: { borderColor: '#2f6f4f' },
  cartaoReprovado: { borderColor: '#b3261e' },
  cartaoNome: { fontSize: 18, fontWeight: '600', color: '#23342b' },
  cartaoLabel: { fontSize: 14, color: '#5b6b62', marginTop: 10 },
  cartaoMedia: { fontSize: 46, fontWeight: '700', color: '#23342b' },
  situacao: { fontSize: 20, fontWeight: '700', marginTop: 4 },
  textoAprovado: { color: '#2f6f4f' },
  textoReprovado: { color: '#b3261e' },
});