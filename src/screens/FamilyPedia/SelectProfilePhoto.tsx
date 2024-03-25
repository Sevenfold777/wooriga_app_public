import React, {useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  DeviceEventEmitter,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import styled from 'styled-components/native';
import ScreenLayout, {
  ActivityIndicatorWrapper,
} from '../../components/ScreenLayout';
import {Colors} from '../../Config';
import {SignedInScreenProps} from '../../navigators/types';

const ChosenContainer = styled.View``;
const UploadingText = styled.Text`
  padding: 15px;
  font-family: 'nanum-regular';
  text-align: center;
`;

export default function SelectProfilePhoto({
  navigation,
  route: {params},
}: SignedInScreenProps<'FamilyPediaSelectPhoto'>) {
  /** access to User's Photo Album */
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  //const [numPhotos, setNumPhotos] = useState(0);
  const [lastLoaded, setLastLoaded] = useState();
  const [chosenPhoto, setChosenPhoto] = useState();
  const [permsission, setPermission] = useState(false);

  // handleSubmit
  const onValid = () => {
    DeviceEventEmitter.emit('PhotoSelected', {newPhoto: chosenPhoto});
    navigation.goBack();
  };

  // column num & Window Frame
  const numCols = 3;
  const {width: pageWidth} = useWindowDimensions();
  const choosePhoto = asset => {
    asset === chosenPhoto ? setChosenPhoto('') : setChosenPhoto(asset);
  };

  // get actual photos
  const getPhotos = async () => {
    setIsLoading(true);
    const {assets, endCursor} = await MediaLibrary.getAssetsAsync({
      mediaType: 'photo',
      sortBy: ['modificationTime', 'creationTime'],
      first: 330,
      ...(lastLoaded && {after: lastLoaded}),
    });

    // set endcursor
    setLastLoaded(endCursor);

    // set retrieved photos
    setPhotos([...photos, ...assets]);
    setIsLoading(false);
  };

  // get permission
  const getPermissions = async () => {
    const {status, canAskAgain, accessPrivileges} =
      await MediaLibrary.getPermissionsAsync();

    if (status !== 'granted' && canAskAgain) {
      // 권한 다시 요청
      const {status} = await MediaLibrary.requestPermissionsAsync();

      // 권한 획득: 사진 불러오기
      if (status === 'granted' && accessPrivileges === 'all') {
        setPermission(true);
        getPhotos();
      }
    } else if (
      status === 'granted' &&
      accessPrivileges === 'limited' &&
      canAskAgain
    ) {
      const {status: newStatus, accessPrivileges: newAccessPrivilieges} =
        await MediaLibrary.requestPermissionsAsync();
      // 권한 획득: 사진 불러오기
      if (newStatus === 'granted' && newAccessPrivilieges === 'all') {
        setPermission(true);
        getPhotos();
      }
    } else {
      setPermission(true);
      getPhotos();
    }
  };

  /** Flatlist: renderItem (Photo Assets) */
  const renderPhotos = ({item: photo}) => (
    <TouchableWithoutFeedback onPress={() => choosePhoto(photo)}>
      <Image
        source={{
          uri: photo.uri,
        }}
        style={{
          width: (pageWidth - 2) / numCols,
          height: (pageWidth - 2) / numCols,
          ...(chosenPhoto === photo && {
            borderColor: Colors.main,
            borderWidth: 4,
          }),
          margin: 0.5,
          backgroundColor: Colors.borderLight,
        }}
      />
    </TouchableWithoutFeedback>
  );

  /** set header right Button */
  const HeaderRight = () => (
    <TouchableOpacity
      style={{
        backgroundColor: Colors.main,
        padding: 8,
        borderRadius: 5,
        marginRight: 15,
      }}
      onPress={() => {
        onValid();
      }}
      disabled={!chosenPhoto}>
      <Text style={{color: 'white', fontFamily: 'nanum-regular'}}>완료</Text>
    </TouchableOpacity>
  );

  /** ComponentDidMount: Get Permission & Set HeaderRight */
  useEffect(() => {
    getPermissions();
  }, [permsission]);

  useEffect(() => {
    navigation.setOptions({headerRight: HeaderRight});
    console.log(chosenPhoto);
  }, [chosenPhoto]);

  /** state for banner */
  const memoized = useMemo(() => renderPhotos, [photos, chosenPhoto]);

  return (
    <ScreenLayout>
      <ChosenContainer>
        {chosenPhoto ? (
          <Image
            source={{uri: chosenPhoto.uri}}
            style={{width: pageWidth, aspectRatio: 4 / 3}}
            resizeMode="contain"
          />
        ) : (
          <View
            style={{
              width: pageWidth,
              aspectRatio: 4 / 3,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{fontFamily: 'nanum-regular', fontSize: 16}}>
              선택된 사진이 없습니다
            </Text>
          </View>
        )}
      </ChosenContainer>

      <FlatList
        renderItem={memoized}
        data={photos}
        numColumns={numCols}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onEndReached={() => {
          // console.log(new Date());
          getPhotos();
          // console.log(new Date());
        }}
        onEndReachedThreshold={2}
        scrollEnabled={!isLoading}
      />

      {isLoading && (
        <ActivityIndicatorWrapper>
          <ActivityIndicator />
        </ActivityIndicatorWrapper>
      )}
    </ScreenLayout>
  );
}
