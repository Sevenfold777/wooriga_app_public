import React, {useState} from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';
import styled from 'styled-components/native';
import ScreenLayout from '../../components/common/ScreenLayout';
import {BGColors, Colors, EMOTION_KOREAN} from '../../Config';
import {ROUTE_NAME} from '../../Strings';
import {useQuery} from '@tanstack/react-query';
import {findBannersBarApi} from '../../api/BannerApi';
import BannerBar from '../../components/BannerBar';
import assetStore from '../../stores/AssetStore';
import {
  EmotionImg,
  HeaderContainer,
  HeaderText,
  LetterContainer,
  LetterText,
} from '../../components/letter/Letter';
import {getLetterGuideApi} from '../../api/LetterApi';
import {MainTabScreenProps} from '../../navigators/types';

const MailBoxContainer = styled.View`
  justify-content: center;
  align-items: center;
  background-color: ${Colors.sub};
  padding: 10px 0px;
  margin: 10px 10px;

  border-radius: 10px;
`;

const MailBox = styled.TouchableOpacity`
  flex: 1;
  padding: 10px 0px;
  margin: 0px 7px;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background-color: ${Colors.sub};
`;

const MenuText = styled.Text`
  font-family: 'nanum-regular';
`;

export default function LetterHome({
  navigation,
}: MainTabScreenProps<'LetterHome'>) {
  const now = new Date().getTime();
  const {width: pageWidth} = useWindowDimensions();

  const [title, setTitle] = useState(
    `# ${new Date().toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })}`,
  );
  const [payload, setPayload] = useState('사랑하는 우리가족에게\n보내는 편지');
  const [emotion, setEmotion] = useState<keyof typeof EMOTION_KOREAN>('happy');

  /** react-query */
  const {data: bannersBar, isLoading: bannersBarLoading} = useQuery(
    ['BannersBar', ROUTE_NAME.LETTER_HOME],
    () => findBannersBarApi({screen: ROUTE_NAME.LETTER_HOME}),
  );

  const {isLoading: guideLoading} = useQuery(
    ['LetterHomeGuide'],
    getLetterGuideApi,
    {
      onSuccess: ({
        data,
      }: {
        data: {
          title: string;
          payload: string;
          emotion: keyof typeof EMOTION_KOREAN;
        };
      }) => {
        setTitle(data.title);
        setPayload(data.payload);
        setEmotion(data.emotion);
      },
    },
  );

  if (bannersBarLoading || guideLoading || !bannersBar) {
    return (
      <ScreenLayout>
        <ActivityIndicator />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <View>
        <BannerBar
          width={pageWidth}
          url={bannersBar.data[now % bannersBar.data.length].url}
          payloadType={
            bannersBar.data[now % bannersBar.data.length].payloadType
          }
          payloadPath={
            bannersBar.data[now % bannersBar.data.length].payloadPath
          }
          description={
            bannersBar.data[now % bannersBar.data.length].description
          }
        />

        <MailBoxContainer style={{backgroundColor: 'white'}}>
          <View style={styles.menuList}>
            <MailBox
              onPress={() =>
                navigation.push('LetterBoxNav', {screen: 'LetterBoxReceived'})
              }>
              <Image
                source={require('../../../assets/images/mailbox.png')}
                style={styles.letterBox}
                resizeMode="contain"
              />
              <MenuText allowFontScaling={false}>나의 편지함</MenuText>
            </MailBox>

            <MailBox
              onPress={() =>
                navigation.push('TimeCapsulesNav', {
                  screen: 'TimeCapsuleReceivd',
                })
              }>
              <Image
                source={require('../../../assets/images/timeCapsule.png')}
                style={styles.timeCapsuleBox}
                resizeMode="contain"
              />
              <MenuText allowFontScaling={false}>타임캡슐</MenuText>
            </MailBox>

            <MailBox onPress={() => navigation.push('LetterSend')}>
              <Image
                source={require('../../../assets/images/letterSend.png')}
                style={styles.letterSend}
                resizeMode="contain"
              />
              <MenuText allowFontScaling={false}>편지 보내기</MenuText>
            </MailBox>
          </View>
        </MailBoxContainer>
      </View>

      <TouchableWithoutFeedback onPress={() => navigation.push('LetterSend')}>
        <LetterContainer
          style={{
            backgroundColor: BGColors[emotion],
            flex: 1,
          }}>
          <HeaderContainer>
            <HeaderText allowFontScaling={false} style={{flex: 1}}>
              {title}
            </HeaderText>
          </HeaderContainer>
          <View style={styles.letterTextWrapper} />
          <LetterText allowFontScaling={false}>{payload}</LetterText>

          <EmotionImg
            source={{uri: assetStore.messageEmotions[emotion]}}
            resizeMode="contain"
          />
        </LetterContainer>
      </TouchableWithoutFeedback>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  menuList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  letterBox: {
    width: 30,
    height: 60,
  },
  timeCapsuleBox: {width: 40, height: 60},
  letterSend: {
    width: 35,
    height: 60,
  },
  letterTextWrapper: {
    borderBottomWidth: 0.5,
    borderColor: Colors.borderDark,
    width: '100%',
    height: 10,
    marginBottom: 10,
  },
});
