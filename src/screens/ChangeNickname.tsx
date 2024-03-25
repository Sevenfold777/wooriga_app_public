import React, {useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {Text} from 'react-native';
import {TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import ScreenLayout from '../components/ScreenLayout';
import familyStore from '../stores/FamilyStore';
import mutationStore from '../stores/MutationStore';
import {Ionicons} from '@expo/vector-icons';
import {Colors} from '../Config';
import {SignedInScreenProps} from '../navigators/types';

const Container = styled.View`
  flex-direction: row;
  background-color: white;
  padding: 0px 10px;
`;

const InputContainer = styled.View`
  flex-direction: row;
  flex: 1;
  margin: 10px 5px;
  padding: 12px;
  border: 0.5px solid ${Colors.borderDark};
  height: 50px;
  border-radius: 25px;
`;

const Input = styled.TextInput`
  flex: 1;
  color: black;
  font-family: 'nanum-regular';
`;

const DeleteBtn = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  padding: 1px 3px;
`;

export default function ChangeNickname({
  navigation,
  route: {params},
}: SignedInScreenProps<'ChangeNickname'>) {
  const {register, handleSubmit, setValue, watch} = useForm({
    defaultValues: {nickname: params?.nickname},
  });

  // TextInput 제출
  const onValid = data => {
    const {nickname} = data;
    // console.log(nickname);
    familyStore.changeNickname({id: params?.id, newNickname: nickname});

    // go back screen
    mutationStore.setStatus(true);
    navigation.goBack();
  };

  /** set header right Button */
  const HeaderRight = () => (
    <TouchableOpacity
      style={{
        backgroundColor: Colors.main,
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginRight: 8,
      }}
      onPress={handleSubmit(onValid)}
      disabled={false}>
      <Text style={{color: 'white', fontFamily: 'nanum-regular'}}>완료</Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    navigation.setOptions({headerRight: HeaderRight});
  }, []);

  useEffect(() => {
    register('nickname', {required: true});
  }, [register]);

  return (
    <ScreenLayout>
      <Container>
        <InputContainer>
          <Input
            value={watch('nickname')}
            placeholder={params?.name}
            returnKeyType="done"
            autoCapitalize="none"
            onChangeText={text => setValue('nickname', text)}
            onSubmitEditing={handleSubmit(onValid)}
          />
          <DeleteBtn
            onPress={() => {
              setValue('nickname', '');
            }}>
            <Ionicons name="close" />
          </DeleteBtn>
        </InputContainer>
      </Container>
    </ScreenLayout>
  );
}
