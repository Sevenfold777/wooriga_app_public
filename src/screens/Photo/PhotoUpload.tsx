import React, {useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  BackHandler,
  DeviceEventEmitter,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';
import ScreenLayout, {
  ActivityIndicatorWrapper,
} from '../../components/ScreenLayout';
import styled from 'styled-components/native';
import {useMutation} from '@tanstack/react-query';
import {createPhotoApi} from '../../api/PhotosApi';
import {useHeaderHeight} from '@react-navigation/elements';
import {useForm} from 'react-hook-form';
import mutationStore from '../../stores/MutationStore';
import {Ionicons} from '@expo/vector-icons';
import PhotoThemeRecommend from '../../components/PhotoThemeRecommed';
import photoStore from '../../stores/PhotoStore';
import {ROUTE_NAME} from '../../Strings';
import {Colors} from '../../Config';
import {SignedInScreenProps} from '../../navigators/types';

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

const PhotoImage = styled.Image`
  justify-content: center;
  align-items: center;
  width: 100%;
  padding-top: 120%;
`;

const UploadingText = styled.Text`
  padding: 15px;
  font-family: 'nanum-regular';
  text-align: center;
  line-height: 20px;
`;

export default function PhotoUpload({
  navigation,
  route: {params},
}: SignedInScreenProps<'PhotoUpload'>) {
  /** react-query */
  // create Photo Api
  const createPhoto = useMutation(createPhotoApi, {
    onSuccess: () => {
      mutationStore.setStatus(true);
      navigation.navigate(ROUTE_NAME.PHOTO_HOME, {isMutated: true});
    },
  });

  // get chosen photos
  const [chosenPhotos, setChosenPhotos] = useState(params?.chosenPhotos);

  const choosePhotos = uri => {
    const chosenList = chosenPhotos.includes(uri)
      ? chosenPhotos.filter(photo => photo !== uri)
      : [...chosenPhotos, uri];

    const registers = getValues();

    DeviceEventEmitter.emit('chosenModified', {
      chosenList,
    });
    setChosenPhotos(chosenList);
  };

  // get page width
  const {width: pageWidth} = useWindowDimensions();

  // react-hook-form: input theme, payload
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: {dirtyFields},
  } = useForm({
    defaultValues: {theme: photoStore.theme, payload: photoStore.payload},
  });

  useEffect(() => {
    register('theme', {required: true});
    register('payload', {required: true});
  }, [register]);

  // handleSubmit
  const onValid = ({theme, payload}) => {
    navigation.setOptions({headerLeft: null, gestureEnabled: false});
    photoStore.resetUploadPhoto();

    createPhoto.mutate({theme, payload, files: chosenPhotos});
  };

  /** set header right Button */
  const HeaderRight = () => (
    <TouchableOpacity
      style={{
        backgroundColor: Colors.main,
        padding: 8,
        borderRadius: 5,
        marginLeft: 7,
        marginRight: 15,
        opacity:
          !watch('theme') || !watch('payload') || chosenPhotos.length === 0
            ? 0.5
            : 1,
      }}
      onPress={handleSubmit(onValid)}
      disabled={
        createPhoto.isLoading ||
        !watch('theme') ||
        !watch('payload') ||
        chosenPhotos.length === 0
      }>
      <Text style={{color: 'white', fontFamily: 'nanum-regular'}}>완료</Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    navigation.setOptions({headerRight: HeaderRight});
  }, [chosenPhotos, watch(['theme', 'payload'])]);

  /** Flatlist: renderItem (Photo Assets) */
  const renderPhotos = ({item: photo}) => {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          aspectRatio: 1,
          width: pageWidth - 50,
          marginVertical: 5,
          marginHorizontal: 10,
          padding: 5,
        }}>
        <Image
          source={{
            uri: photo.uri,
          }}
          style={{
            width: pageWidth - 60,
            height: '100%',
            borderRadius: 5,
          }}
        />
        <TouchableOpacity
          onPress={() => {
            choosePhotos(photo);
          }}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            borderRadius: 10,
          }}>
          <Ionicons name="close" size={16} color={'white'} />
        </TouchableOpacity>
      </View>
    );
  };

  const [isRecommend, setRecommend] = useState(params?.isRecommend);

  useEffect(() => {
    if (createPhoto.isLoading) {
      const backAction = () => {
        return true;
      };

      const backhandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      navigation.setOptions({headerRight: () => {}});

      return () => backhandler.remove();
    }
  }, [createPhoto.isLoading]);

  if (createPhoto.isLoading) {
    return (
      <ScreenLayout>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 80,
          }}>
          <ActivityIndicator
            style={{alignItems: 'center', justifyContent: 'center'}}
          />
          <UploadingText>
            {'우리 가족의 추억을 기록하고 있습니다\n잠시만 기다려주세요'}
          </UploadingText>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={useHeaderHeight()}
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
                  //onSubmitEditing={onSubmitEditing}
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
            contentContainerStyle={{paddingBottom: 0}}
            bounces={false}
            // pagingEnabled={true}
          />
        </InputContainer>
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
}
