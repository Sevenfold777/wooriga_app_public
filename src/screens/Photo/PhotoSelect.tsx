import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  DeviceEventEmitter,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';
import ScreenLayout, {
  ActivityIndicatorWrapper,
} from '../../components/common/ScreenLayout';
import * as MediaLibrary from 'expo-media-library';
import {Ionicons} from '@expo/vector-icons';
import PhotoThemeRecommend from '../../components/PhotoThemeRecommed';
import photoStore from '../../stores/PhotoStore';
import Toast from '../../components/Toast';
import {Colors} from '../../Config';
import {SignedInScreenProps} from '../../navigators/types';
import {RowContainer} from '../../components/common/Common';

export default function PhotoSelect({
  navigation,
  route: {params},
}: SignedInScreenProps<'PhotoSelect'>) {
  /** access to User's Photo Album */
  const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [lastLoaded, setLastLoaded] = useState<MediaLibrary.AssetRef>();
  const [chosenPhotos, setChosenPhotos] = useState<MediaLibrary.Asset[]>([]);

  // column num & Window Frame
  const numCols = 3;
  const {width: pageWidth} = useWindowDimensions();
  const choosePhotos = (asset: MediaLibrary.Asset) => {
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
  const renderPhotos = ({item: photo}: {item: MediaLibrary.Asset}) => (
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

  const renderChosenThumbnails = ({
    item: photo,
  }: {
    item: MediaLibrary.Asset;
  }) => (
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
        <View style={styles.chosenDelete}>
          <Ionicons name="close" size={16} color={'white'} />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );

  /** set header right Button */
  // eslint-disable-next-line react/no-unstable-nested-components
  const HeaderRight = () => (
    <RowContainer style={{justifyContent: 'center'}}>
      {chosenPhotos.length !== 0 && (
        <View style={{padding: 8}}>
          <Text
            style={[
              styles.chosenCount,
              {opacity: chosenPhotos.length === 0 ? 0.5 : 1},
            ]}>
            {`${chosenPhotos.length} / 10`}
          </Text>
        </View>
      )}
      <TouchableOpacity
        style={styles.headerRight}
        onPress={() => {
          if (chosenPhotos.length !== 0) {
            navigation.navigate('PhotoUpload', {
              chosenPhotos,
              isRecommend: params?.isRecommend,
            });
          }
        }}>
        <Text style={styles.headerRightText}>다음</Text>
      </TouchableOpacity>
    </RowContainer>
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
      ({chosenList}) => {
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
          data={chosenPhotos}
          renderItem={renderChosenThumbnails}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          bounces={false}
          style={{paddingBottom: 10}}
          contentContainerStyle={{paddingHorizontal: 10}}
        />
      </View>

      <View>
        <FlatList
          renderItem={renderPhotos}
          data={photos}
          numColumns={numCols}
          showsVerticalScrollIndicator={false}
          refreshing={isLoading}
          onEndReached={() => getPhotos()}
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

const styles = StyleSheet.create({
  chosenCount: {fontFamily: 'nanum-bold'},
  headerRightText: {color: 'white', fontFamily: 'nanum-regular'},
  headerRight: {
    backgroundColor: Colors.main,
    padding: 8,
    borderRadius: 5,
    marginLeft: 7,
    marginRight: 15,
  },
  chosenDelete: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 10,
  },
});
