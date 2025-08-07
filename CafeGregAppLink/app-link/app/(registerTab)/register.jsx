import { Ionicons } from '@expo/vector-icons';
import { useContext, useState } from "react";
import { ImageBackground, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, useWindowDimensions, View } from 'react-native';

import React, { useRef } from 'react';
import { Animated, Dimensions, TextInput } from 'react-native';
import { useEffect } from "react";
import FCInput from '../FuncComps/FCInput';
import { LinkAppContext } from '../LinkAppContext.jsx';
import { registerCustomer } from '../database.js';

export default function register() {
  const { width: widthScreen } = useWindowDimensions();
  const { linkApp, setLinkApp } = useContext(LinkAppContext)

  const [inputs, setInputs] = useState({})
  const [typeContact, setTypeContact] = useState(null)

  const msg = (text) => {
    ToastAndroid.show(text, ToastAndroid.SHORT);
  }


  const register = async () => {
    if (!typeContact) {
      alert('Please choose email or phone')
      return
    }


    if (!inputs.id || !inputs.name || !inputs.contact) {
      alert('Inputs is missing')
      return
    }
    console.log(typeContact);

    //check the id, contact with regex
    if (typeContact == 'phone' && !isValidPhone(inputs.contact)) {
      alert('The phone number is not correct')
      return
    }
    if (typeContact == 'email' && !isValidEmail(inputs.contact)) {
      alert('The email is not correct')
      return
    }
    if (!isValidId(inputs.id)) {
      alert('The id is not correct')
      return
    }
    if (inputs.name.length < 3) {
      alert(inputs.name + ' is too short for a name')
      return
    }


    const res = await registerCustomer(inputs, linkApp.tableId)
    if (res) {
      setInputs({name:'', id:''})
      setTypeContact('')
      msg('Registered successfully !')
    }
  }


  function isValidEmail(email) {
    const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  function isValidPhone(phone) {
    const phoneRegex = /^0\d{9}$/;
    return phoneRegex.test(phone);
  }

  function isValidId(id) {
    const idRegex = /^\d{8,9}$/;
    return idRegex.test(id);
  }
  return (
    <ImageBackground source={{
      uri: "https://i.ytimg.com/vi/DyJTVkRP1vY/maxresdefault.jpg"
    }}
      style={styles.backgroundImage}
      blurRadius={3}>

      <Text style={styles.title}>Register</Text>
      <FCInput
        title={'Name'} type={'text'}
        placeholder={'Your name'}
        value={inputs.name}
        setVariable={(input) => setInputs({ ...inputs, name: input })}></FCInput>
      <FCInput
        title={'Tehoudat zehout'} type={'numeric'}
        placeholder={'Your id'}
        value={inputs.id}
        setVariable={(input) => setInputs({ ...inputs, id: input })}></FCInput>
      <View style={styles.contactChoiceContainer}>
        <TouchableOpacity style={typeContact == 'phone' ? styles.selectionnedButtonContact : styles.buttonContact}
          onPress={() => { setTypeContact('phone'); setInputs({ ...inputs, contact: '' }) }}>
          <Text style={typeContact == 'phone' ? styles.selectionnedButtonTxtContact : styles.buttonTxtContact}>Phone</Text>
        </TouchableOpacity>
        <TouchableOpacity style={typeContact == 'email' ? styles.selectionnedButtonContact : styles.buttonContact}
          onPress={() => { setTypeContact('email'); setInputs({ ...inputs, contact: '' }) }}>
          <Text style={typeContact == 'email' ? styles.selectionnedButtonTxtContact : styles.buttonTxtContact}>Email</Text>
        </TouchableOpacity>
      </View>
      {typeContact ?
        <View>
          <FCInput
            value={inputs.contact}
            title={`Write your ${typeContact} :`} type={typeContact == 'phone' ? 'numeric' : 'text'}
            placeholder={`Your ${typeContact}`}
            setVariable={(input) => setInputs({ ...inputs, contact: input })}></FCInput>
        </View> :
        <Text style={{ margin: 'auto', color: 'white', fontSize: 30, fontWeight: 600 }}>Select Phone or Email</Text>}
      <TouchableOpacity onPress={register}
        style={{
          width: widthScreen * 0.8,
          padding: '20 40',
          backgroundColor: 'rgb(59, 146, 116)',
          borderRadius: 20,
          borderColor: 'rgb(0,0,0)',
          borderWidth: 2,
          margin: 'auto'
        }}>
        < Text style={{
          fontSize: 50,
          color: 'white',
          textAlign: 'center',
          fontWeight: 800
        }}>Register</Text>
      </TouchableOpacity >
    </ImageBackground >
  )
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: 40
  },
  title: {
    fontSize: 50,
    color: 'white',
    fontWeight: 700,
    paddingTop: 100
  },
  buttonContact: {
    backgroundColor: 'rgb(193, 186, 186)',
    flex: 1,
    padding: 10,
    borderRadius: 20
  },
  selectionnedButtonContact: {
    backgroundColor: 'rgb(76, 179, 146)',
    flex: 1,
    padding: 10,
    borderRadius: 20
  },
  buttonTxtContact: {
    color: 'rgb(252, 252, 252)',
    fontSize: 30,
    textAlign: 'center'
  },
  selectionnedButtonTxtContact: {
    color: 'rgb(0, 0, 0)',
    fontSize: 30,
    textAlign: 'center'
  },
  contactChoiceContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 30,
    paddingInline: 30
  }
});
