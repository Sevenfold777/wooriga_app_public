import {useHeaderHeight} from '@react-navigation/elements';
import React from 'react';
import {KeyboardAvoidingView, Platform, View} from 'react-native';
import styled from 'styled-components/native';
import ScreenLayout from './ScreenLayout';
import {Ionicons} from '@expo/vector-icons';
import PropTypes from 'prop-types';
import {Colors} from '../../Config';

export const CommentInputContainer = styled.View`
  flex-direction: row;
  background-color: white;
  padding: 0px 10px;
`;

const CommentInputWrapper = styled.View`
  flex: 1;
  margin: 10px 5px;
  border: 0.5px solid #aeaeae;
  min-height: 50px;
  max-height: 150px;
  border-radius: 25px;
  justify-content: center;
  padding: 10px 5px;
`;

const CommentInput = styled.TextInput`
  margin-left: 10px;
  color: black;
  /* font-family: 'nanum-regular'; */
  /* line-height: 18px; */
`;

export const SendBtn = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  background-color: ${Colors.main};
  margin: 10px 0px;
  padding: 0px 12px;
  border-radius: 10px;
  opacity: ${props => (props.disabled ? '0.5' : '1')};
`;

export const SendText = styled.Text`
  /* font-family: 'nanum-bold'; */
`;

export default function InputLayout({
  register,
  children,
  value,
  placeholder = '댓글을 입력하세요',
  onChangeText,
  onSubmitEditing,
  disabled,
}) {
  return (
    <ScreenLayout>
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.white,
          alignItems: 'center',
          //paddingHorizontal: 10, // padding 없으면 인스타 느낌
        }}>
        <View style={{flex: 1, width: '100%'}}>{children}</View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={useHeaderHeight()}
          style={{width: '100%'}}>
          <CommentInputContainer>
            <CommentInputWrapper>
              <CommentInput
                {...register}
                value={value}
                placeholder={placeholder}
                autoCapitalize="none"
                onChangeText={onChangeText}
                multiline={true}
                maxLength={100}
                // onContentSizeChange={({
                //   nativeEvent: {
                //     contentSize: { width, height },
                //   },
                // }) => {
                //   console.log(width, height);
                // }}
              />
            </CommentInputWrapper>
            <SendBtn onPress={onSubmitEditing} disabled={disabled}>
              <Ionicons name="send" size={20} />
              {/* <SendText>보내기</SendText> */}
            </SendBtn>
          </CommentInputContainer>
        </KeyboardAvoidingView>
      </View>
    </ScreenLayout>
  );
}

InputLayout.propTypes = {
  // register: PropTypes.string.isRequired,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChangeText: PropTypes.func,
  onSubmitEditing: PropTypes.func,
  disabled: PropTypes.bool,
};
