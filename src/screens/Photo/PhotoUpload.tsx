import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  BackHandler,
  DeviceEventEmitter,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';
import ScreenLayout from '../../components/common/ScreenLayout';
import styled from 'styled-components/native';
import {useMutation} from '@tanstack/react-query';
import {createPhotoApi} from '../../api/PhotosApi';
import {useHeaderHeight} from '@react-navigation/elements';
import {useForm} from 'react-hook-form';
import mutationStore from '../../stores/MutationStore';
import {Ionicons} from '@expo/vector-icons';
import PhotoThemeRecommend from '../../components/PhotoThemeRecommed';
import photoStore from '../../stores/PhotoStore';
import {Colors} from '../../Config';
import {SignedInScreenProps} from '../../navigators/types';
import {Asset} from 'expo-media-library';
import {ActivityIndicatorWrapper} from '../../components/common/Common';

const InputContainer = styled.View`
  background-color: white;
  padding: 10px 15px;
`;

const TitleText = styled.Text`
  font-size: 16px;
  padding: 0px 12px;
  margin-bottom: 5px;
  font-family: 'nanum-bold';
`;

const ThemeContainer = styled.View`
  margin-bottom: 30px;
`;

const ThemeInput = styled.TextInput`
  /* margin: 0px 5px; */
  height: 50px;
  border-radius: 25px;
  padding: 10px 15px;
  border: 0.5px solid ${Colors.borderDark};
  color: black;
  font-family: 'nanum-regular';
`;

const PayloadContainer = styled.View`
  margin-bottom: 30px;
`;

const PayloadInput = styled.TextInput`
  /* margin: 0px 5px; */
  height: 100px;
  padding: 12px;
  border-radius: 20px;
  border: 0.5px solid ${Colors.borderDark};
  color: black;
  font-family: 'nanum-regular';
`;

const UploadingText = styled.Text`
  padding: 15px;
  font-family: 'nanum-regular';
  text-align: center;
  line-height: 20px;
`;

const HeaderRightBtn = styled.TouchableOpacity`
  background-color: ${Colors.main};
  padding: 8px;
  border-radius: 5px;
  margin: 0px 15px 0px 7px;
  opacity: ${props => (props.disabled ? 0.5 : 1)};
`;

const ImageWrapper = styled.View<{width: number}>`
  width: ${props => props.width}px;
  justify-content: center;
  align-items: center;
  aspect-ratio: 1;
  margin: 5px 10px;
  padding: 5px;
`;

const Image = styled.Image`
  height: 100%;
  border-radius: 5px;
`;

const ImageDeleteBtn = styled.TouchableOpacity`
  position: absolute;
  top: 0px;
  right: 0px;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 10px;
`;

export default function PhotoUpload({
  navigation,
  route: {params},
}: SignedInScreenProps<'PhotoUpload'>) {
  const headerHeight = useHeaderHeight();

  /** react-query */
  // create Photo Api
  const createPhoto = useMutation(createPhotoApi, {
    onSuccess: () => {
      mutationStore.setStatus(true);
      navigation.navigate('MainTabNav', {
        screen: 'PhotoHome',
      });
    },
  });

  // get chosen photos
  const [chosenPhotos, setChosenPhotos] = useState(params?.chosenPhotos);

  const choosePhotos = (asset: Asset) => {
    const chosenList = chosenPhotos.includes(asset)
      ? chosenPhotos.filter(photo => photo !== asset)
      : [...chosenPhotos, asset];

    DeviceEventEmitter.emit('chosenModified', {
      chosenList,
    });
    setChosenPhotos(chosenList);
  };

  // get page width
  const {width: pageWidth} = useWindowDimensions();

  // react-hook-form: input theme, payload
  const {register, handleSubmit, watch, setValue} = useForm({
    defaultValues: {theme: photoStore.theme, payload: photoStore.payload},
  });

  useEffect(() => {
    register('theme', {required: true});
    register('payload', {required: true});
  }, [register]);

  // handleSubmit
  const onValid = ({theme, payload}: {theme: string; payload: string}) => {
    navigation.setOptions({headerLeft: () => null, gestureEnabled: false});
    photoStore.resetUploadPhoto();

    createPhoto.mutate({theme, payload, files: chosenPhotos});
  };

  /** set header right Button */
  // eslint-disable-next-line react/no-unstable-nested-components
  const HeaderRight = () => (
    <HeaderRightBtn
      onPress={handleSubmit(onValid)}
      disabled={
        createPhoto.isLoading ||
        !watch('theme') ||
        !watch('payload') ||
        chosenPhotos.length === 0
      }>
      <Text style={{color: 'white', fontFamily: 'nanum-regular'}}>완료</Text>
    </HeaderRightBtn>
  );

  useEffect(() => {
    navigation.setOptions({headerRight: HeaderRight});
  }, [chosenPhotos, watch(['theme', 'payload'])]);

  /** Flatlist: renderItem (Photo Assets) */
  const renderPhotos = ({item: photo}: {item: Asset}) => {
    return (
      <ImageWrapper width={pageWidth - 50}>
        <Image source={{uri: photo.uri}} width={pageWidth - 60} />
        <ImageDeleteBtn onPress={() => choosePhotos(photo)}>
          <Ionicons name="close" size={16} color={'white'} />
        </ImageDeleteBtn>
      </ImageWrapper>
    );
  };

  const [isRecommend, setRecommend] = useState(Boolean(params?.isRecommend));

  useEffect(() => {
    if (createPhoto.isLoading) {
      const backAction = () => {
        return true;
      };

      const backhandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      navigation.setOptions({headerRight: () => null});

      return () => backhandler.remove();
    }
  }, [createPhoto.isLoading]);

  if (createPhoto.isLoading) {
    return (
      <ScreenLayout>
        <ActivityIndicatorWrapper>
          <ActivityIndicator />
          <UploadingText>
            {'우리 가족의 추억을 기록하고 있습니다\n잠시만 기다려주세요'}
          </UploadingText>
        </ActivityIndicatorWrapper>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={headerHeight}
        style={{width: '100%'}}>
        {isRecommend && (
          <View style={{marginBottom: 10}}>
            <PhotoThemeRecommend
              isRecommend={isRecommend}
              setRecommend={setRecommend}
            />
          </View>
        )}

        <InputContainer>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View>
              <ThemeContainer>
                <TitleText>제목</TitleText>
                <ThemeInput
                  value={watch('theme')}
                  placeholder="주제를 입력해주세요"
                  autoCapitalize="none"
                  onChangeText={text => {
                    setValue('theme', text);
                    photoStore.setUploadPhotoTheme(text);
                  }}
                  maxLength={30}
                />
              </ThemeContainer>
              <PayloadContainer>
                <TitleText>내용</TitleText>
                <PayloadInput
                  value={watch('payload')}
                  placeholder="내용을 입력해주세요"
                  autoCapitalize="none"
                  onChangeText={text => {
                    setValue('payload', text);
                    photoStore.setUploadPhotoPayload(text);
                  }}
                  multiline={true}
                  textAlignVertical="top"
                  maxLength={300}
                />
              </PayloadContainer>

              <TitleText>선택한 사진</TitleText>
            </View>
          </TouchableWithoutFeedback>
          <FlatList
            renderItem={renderPhotos}
            data={chosenPhotos}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            bounces={false}
          />
        </InputContainer>
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
}
