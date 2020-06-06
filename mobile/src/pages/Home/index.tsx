import React, { useState, useEffect } from 'react';
import { Feather as Icon } from "@expo/vector-icons/";
import { RectButton } from "react-native-gesture-handler";
import SelectPicker from "react-native-picker-select";
import { StyleSheet, ImageBackground, Text, View, Image, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

interface IBGEUFResponse {
  nome: string;
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

interface ItemsPicker {
  label: string;
  value: string;
}

const Home = () => {
  const navigation = useNavigation();

  const [ufs, setUfs] = useState<ItemsPicker[]>([
    {
      label: "Selecione um estado",
      value: "",
    }
  ]);
  const [cities, setCities] = useState<ItemsPicker[]>([
    {
      label: "Selecione uma cidade",
      value: "",
    }
  ]);

  const [selectedUf, setSelectedUf] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    axios.get<IBGEUFResponse[]>("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
      .then(response => {
        const ufsSerializedToItemsPicker = response.data.map(uf => ({ value: uf.sigla, label: uf.nome }));
        setUfs([...ufsSerializedToItemsPicker]);
      })
  }, []);

  useEffect(() => {
    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then(response => {
        const citiesSerializedToItemsPicker = response.data.map(city => ({ label: city.nome, value: city.nome }));
        setCities([...citiesSerializedToItemsPicker]);
      })
  }, [selectedUf])

  function handleNavigateToPoints() {
    if (selectedUf && selectedCity) {
      navigation.navigate("Points", { uf: selectedUf, city: selectedCity });
    } else {
      Alert.alert("Oops!", "Precisamos que selecione um estado e uma cidade para continuar...");
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? 'padding' : undefined}>
      <ImageBackground
        style={styles.container}
        source={require('../../assets/home-background.png')}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require("../../assets/logo.png")} />
          <View>
            <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <SelectPicker
            useNativeAndroidPickerStyle={false}
            style={{
              ...pickerSelectStyles,
              iconContainer: {
                paddingTop: '90%',
                right: 5
              }
            }}
            placeholder={ufs[0]}
            Icon={() => (
              <View>
                <Icon name="chevron-down" size={16} />
              </View>
            )}
            onValueChange={value => setSelectedUf(value)}
            items={ufs}
          ></SelectPicker>
          <SelectPicker
            useNativeAndroidPickerStyle={false}
            style={{
              ...pickerSelectStyles,
              iconContainer: {
                paddingTop: '90%',
                right: 5
              }
            }}
            placeholder={cities[0]}
            Icon={() => (
              <View>
                <Icon name="chevron-down" size={16} />
              </View>
            )}
            onValueChange={value => setSelectedCity(value)}
            items={cities}
          ></SelectPicker>

          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="white" size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}>
              Entrar
            </Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  )
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: '#AAA',
    borderRadius: 8,
    color: '#888',
    marginBottom: 10
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: '#AAA',
    borderRadius: 8,
    color: '#888',
    marginBottom: 10
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  inputAndroid: {
    padding: 10,
    backgroundColor: '#CCC'
  },

  inputIOS: {},

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;