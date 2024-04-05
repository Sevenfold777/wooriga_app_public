import React, {useState} from 'react';
import KakaoButton from '../../components/auth/socialLogin/KaKaoButton';
import NaverButton from '../../components/auth/socialLogin/NaverButton';
import AppleButton from '../../components/auth/socialLogin/AppleButton';
import {Platform, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import {Colors} from '../../Config';
import Clipboard from '@react-native-clipboard/clipboard';
import {useEffect} from 'react';
import {SignedOutScreenProps} from '../../navigators/types';
import ScreenLayout from '../../components/common/ScreenLayout';

const Container = styled.View`
  width: 100%;
  height: 90%;
  justify-content: center;
  align-items: center;
`;

const Logo = styled.Image`
  width: 100%;
  height: 130px;
`;

const SubText = styled.Text`
  font-family: 'nanum-regular';
  color: ${Colors.borderDark};
  padding: 10px;
  text-align: center;
`;

const ButtonContainer = styled.View`
  margin-top: 20px;
`;

const Footer = styled.View`
  margin: 10px 40px;
`;

const BottomTextContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const BottomText = styled.Text`
  font-family: 'nanum-regular';
  color: ${Colors.borderDark};
`;

export default function Login({
  navigation,
  route: {params},
}: SignedOutScreenProps<'SignIn'>) {
  const [joinToken, setJoinToken] = useState('');

  const getJoinToken = async () => {
    try {
      // 1. 앱 바로가기 (스토어 다운보다 우선순위 높음)
      if (params?.familyId) {
        setJoinToken(params?.familyId);
        return;
      }

      // 2. 스토어에서 다운
      const clipboard = JSON.parse(await Clipboard.getString());
      if (clipboard?.familyJoinToken) {
        setJoinToken(clipboard.familyJoinToken);
        Clipboard.setString('');
        return;
      }
    } catch (e) {}
  };

  useEffect(() => {
    getJoinToken();
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setJoinToken('');
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <ScreenLayout>
      <Container>
        <Logo
          resizeMode="contain"
          source={require('../../../assets/images/appicon.png')}
        />
        <SubText>간편 로그인을 통해 우리가를 시작해보세요</SubText>

        <ButtonContainer>
          <KakaoButton familyJoinToken={joinToken} />
          <NaverButton familyJoinToken={joinToken} />
          {Platform.OS === 'ios' && <AppleButton familyJoinToken={joinToken} />}

          <Footer>
            <BottomTextContainer>
              <BottomText allowFontScaling={false}>
                {'회원 가입 완료 시 우리가'}
              </BottomText>
              <TouchableOpacity
                onPress={() => navigation.navigate('TermsOfUse')}>
                <BottomText
                  allowFontScaling={false}
                  style={{color: '#0095f6', fontFamily: 'nanum-bold'}}>
                  {' 이용약관 '}
                </BottomText>
              </TouchableOpacity>
              <BottomText allowFontScaling={false}>및</BottomText>
              <TouchableOpacity
                onPress={() => navigation.navigate('OperationPolicy')}>
                <BottomText
                  allowFontScaling={false}
                  style={{color: '#0095f6', fontFamily: 'nanum-bold'}}>
                  {' 운영정책 '}
                </BottomText>
              </TouchableOpacity>
            </BottomTextContainer>
            <BottomTextContainer>
              <BottomText allowFontScaling={false}>
                {'에 동의하게 됩니다'}
              </BottomText>
            </BottomTextContainer>
          </Footer>
        </ButtonContainer>
      </Container>
    </ScreenLayout>
  );
}
