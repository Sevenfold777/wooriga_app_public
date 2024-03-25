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
import ScreenLayout, {
  ActivityIndicatorWrapper,
} from '../../components/ScreenLayout';
import * as MediaLibrary from 'expo-media-library';
import styled from 'styled-components/native';
import {Ionicons} from '@expo/vector-icons';
import Modal from 'react-native-modal';
import PhotoThemeRecommend from '../../components/PhotoThemeRecommed';
import photoStore from '../../stores/PhotoStore';
import Toast from '../../components/Toast';
import {ROUTE_NAME} from '../../Strings';
import {Colors} from '../../Config';
import {SignedInScreenProps} from '../../navigators/types';

export default function PhotoSelect({
  navigation,
  route: {params},
}: SignedInScreenProps<'PhotoSelect'>) {
  /** access to User's Photo Album */
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  //const [numPhotos, setNumPhotos] = useState(0);
  const [lastLoaded, setLastLoaded] = useState();
  const [chosenPhotos, setChosenPhotos] = useState([]);

  // column num & Window Frame
  const numCols = 3;
  const {width: pageWidth} = useWindowDimensions();
  const choosePhotos = asset => {
    if (chosenPhotos.includes(asset)) {
      const newChosenPhotos = chosenPhotos.filter(photo => photo !== asset);
      setChosenPhotos(newChosenPhotos);
    } else {
      if (chosenPhotos.length >= 10) {
        Toast({message: '최대 10개까지 선택할 수 있습니다.'});
      } else {
        const newChosenPhotos = [...chosenPhotos, asset];
        setChosenPhotos(newChosenPhotos);
      }
    }
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

  /** Flatlist: renderItem (Photo Assets) */
  const renderPhotos = ({item: photo}) => (
    <TouchableWithoutFeedback onPress={() => choosePhotos(photo)}>
      <Image
        source={{
          uri: photo.uri,
        }}
        style={{
          width: (pageWidth - 2) / numCols,
          height: (pageWidth - 2) / numCols,
          ...(chosenPhotos.includes(photo) && {
            borderColor: Colors.main,
            borderWidth: 4,
          }),
          margin: 0.5,
          backgroundColor: Colors.borderLight,
        }}
      />
    </TouchableWithoutFeedback>
  );

  const renderChosenThumbnails = ({item: photo}) => (
    <View style={{paddingVertical: 5}}>
      <Image
        source={{
          uri: photo.uri,
        }}
        style={{
          width: pageWidth / 6,
          height: pageWidth / 6,
          marginHorizontal: 5,
        }}
      />
      <TouchableWithoutFeedback onPress={() => choosePhotos(photo)}>
        <View
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            borderRadius: 10,
          }}>
          <Ionicons
            name="close"
            //name="close-circle"
            size={16}
            color={'white'}
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );

  /** set header right Button */
  const HeaderRight = () => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {chosenPhotos.length !== 0 && (
        <View style={{padding: 8}}>
          <Text
            style={{
              fontFamily: 'nanum-bold',
            }}>{`${chosenPhotos.length} / 10`}</Text>
        </View>
      )}
      <TouchableOpacity
        style={{
          backgroundColor: Colors.main,
          padding: 8,
          borderRadius: 5,
          marginLeft: 7,
          marginRight: 15,
          opacity: chosenPhotos.length === 0 ? 0.5 : 1,
        }}
        onPress={() => {
          if (chosenPhotos.length !== 0)
            navigation.navigate(ROUTE_NAME.PHOTO_UPLOAD, {
              chosenPhotos,
              isRecommend: params?.isRecommend,
            });
        }}
        //   disabled={uploadPhotos.isLoading || createPhoto.isLoading}
      >
        <Text style={{color: 'white', fontFamily: 'nanum-regular'}}>다음</Text>
      </TouchableOpacity>
    </View>
  );

  /** ComponentDidMount: Get Permission & Set HeaderRight */
  useEffect(() => {
    getPhotos();
  }, []);

  useEffect(() => {
    navigation.setOptions({headerRight: HeaderRight});
  }, [chosenPhotos]);

  useEffect(() => {
    const chosensSubscription = DeviceEventEmitter.addListener(
      'chosenModified',
      ({chosenList, theme, payload}) => {
        setChosenPhotos(chosenList);
      },
    );

    return () => chosensSubscription.remove();
  }, [chosenPhotos]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      photoStore.resetUploadPhoto();
    });

    return unsubscribe;
  }, []);

  /** state for banner */
  const [isRecommend, setRecommend] = useState(Boolean(params?.isRecommend));

  const memoized = useMemo(() => renderPhotos, [photos, chosenPhotos]);

  return (
    <ScreenLayout>
      {isRecommend && (
        <View style={{marginBottom: 10}}>
          <PhotoThemeRecommend
            isRecommend={isRecommend}
            setRecommend={setRecommend}
          />
        </View>
      )}

      <View>
        <FlatList
          renderItem={renderChosenThumbnails}
          data={chosenPhotos}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          bounces={false}
          style={{paddingBottom: 10}}
          contentContainerStyle={{paddingHorizontal: 10}}
        />
      </View>

      <View>
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
      </View>

      {isLoading && (
        <ActivityIndicatorWrapper>
          <ActivityIndicator />
        </ActivityIndicatorWrapper>
      )}
    </ScreenLayout>
  );
}
