import React, { useState } from 'react';
import { View, ScrollView, Text, Picker } from 'react-native';
import { BorderlessButton, RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import RNDateTimePicker, { Event } from '@react-native-community/datetimepicker';

import ClassesService, { TeacherFilter } from '../../services/classes.service';

import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';

import styles from './styles';

function TeacherList(): JSX.Element {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);

    const [subject, setSubject] = useState('');
    const [week_day, setWeekDay] = useState('');
    const [time, setTime] = useState('');
    
    const [show, setShow] = useState(false);
    const [date, setDate] = useState(new Date());

    function onChangeTime(_event: Event, selectedDate?: Date) {
        const currentDate = selectedDate || date;
        setShow(false);

        setDate(currentDate);
        const strTime = currentDate.getHours() + ':' + ('0'+ currentDate.getMinutes()).slice(-2);
        console.log(strTime);
        setTime(strTime);
    }

    function openTimer() {
        setShow(true);
        setTimeout(() => setShow(false), 100); // Bugfix
    }

    function loadFavorites() {
        AsyncStorage.getItem('favorites')
            .then(response => {
                if (response) {
                    const favoritedTeachers = JSON.parse(response);
                    const favoritedTeachersIds = favoritedTeachers.map((teacher: Teacher) => teacher.id);
                    setFavorites(favoritedTeachersIds);
                }
            });
    }

    useFocusEffect(loadFavorites);

    function handleToggleFiltersVisible() {
        setIsFiltersVisible(!isFiltersVisible);
    }

    async function handleFiltersSubmit() {
        loadFavorites();

        const filter: TeacherFilter = {
            subject,
            week_day,
            time, 
        };
        
        const teachersFound = await ClassesService.searchTeachers(filter);
        
        setTeachers(teachersFound);
        setIsFiltersVisible(false);
    }

    return (
        <View style={styles.container}>
            <PageHeader
                title="Proffys disponíveis"
                headerRight={(
                    <BorderlessButton onPress={handleToggleFiltersVisible}>
                        <Feather name="filter" size={20} color="#FFF" />
                    </BorderlessButton>
                )}
            >
                { isFiltersVisible && (
                    <View style={styles.searchForm}>
                        <Text style={styles.label}>Matéria</Text>
                        <View style={styles.picker}>
                            <Picker
                                selectedValue={subject}
                                onValueChange={(value) => setSubject(value)}
                                mode="dropdown"
                            >
                                <Picker.Item value={null} label="Qual a matéria?" />
                                <Picker.Item value="Artes" label="Artes" />
                                <Picker.Item value="Biologia" label="Biologia" />
                                <Picker.Item value="Ciências" label="Ciências" />
                                <Picker.Item value="Educação Física" label="Educação Física" />
                                <Picker.Item value="Física" label="Física" />
                                <Picker.Item value="Geografia" label="Geografia" />
                                <Picker.Item value="História" label="História" />
                                <Picker.Item value="Matemática" label="Matemática" />
                                <Picker.Item value="Português" label="Português" />
                                <Picker.Item value="Química" label="Química" />
                            </Picker>
                        </View>

                        <View style={styles.inputGroup}>
                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>Dia da semana</Text>
                                <View style={styles.picker}>
                                    <Picker
                                        selectedValue={week_day}
                                        onValueChange={(value) => setWeekDay(value)}
                                        mode="dropdown"
                                    >
                                        <Picker.Item value={null} label="Qual o dia?" />
                                        <Picker.Item value="0" label="Domingo" />
                                        <Picker.Item value="1" label="Segunda" />
                                        <Picker.Item value="2" label="Terça" />
                                        <Picker.Item value="3" label="Quarta" />
                                        <Picker.Item value="4" label="Quinta" />
                                        <Picker.Item value="5" label="Sexta" />
                                        <Picker.Item value="6" label="Sábado" />
                                    </Picker>
                                </View>
                            </View>

                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>Horário</Text>
                                {show && (
                                    <RNDateTimePicker
                                        mode="time"
                                        display="clock"
                                        value={date}
                                        is24Hour={true}
                                        onChange={onChangeTime}
                                    />
                                )}
                                <RectButton onPress={() => openTimer()} style={styles.timeButton}>
                                    { time.length > 0 && <Text>{time}</Text>}
                                    <Feather name="clock" size={20} color="#000" />
                                </RectButton>
                            </View>
                        </View>
                        <RectButton onPress={handleFiltersSubmit} style={styles.submitButton}>
                            <Text style={styles.submitButtonText}>Filtrar</Text>
                        </RectButton>
                    </View>
                )}
            </PageHeader>

            <ScrollView
                style={styles.teacherList}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 16
                }}
            >
                {teachers.map((teacher: Teacher) => {
                    return (
                        <TeacherItem
                            key={teacher.id}
                            teacher={teacher}
                            favorited={favorites.includes(teacher.id)}
                        />
                    );
                })}                
            </ScrollView>
        </View>
    );
}

export default TeacherList;