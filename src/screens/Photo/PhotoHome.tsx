import {useQuery} from '@tanstack/react-query';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';
import styled from 'styled-components/native';
import {findPhotosFamilyApi} from '../../api/PhotosApi';
import ScreenLayout, {
  ActivityIndicatorWrapper,
} from '../../components/common/ScreenLayout';
import mutationStore from '../../stores/MutationStore';
import familyStore from '../../stores/FamilyStore';
import FastImage from 'react-native-fast-image';
import authStore from '../../stores/AuthStore';
import PhotoThemeRecommend from '../../components/PhotoThemeRecommed';
import {NoContentText} from '../../components/NoContent';
import {Colors} from '../../Config';
import {MainTabScreenProps} from '../../navigators/types';

const Container = styled.View`
  flex: 1;
  width: 100%;
  padding: 0px 10px;
`;

const PhotoContainer = styled.View`
  justify-content: center;
  align-items: center;
  padding: 5px;
`;

const Bottom = styled.View`
  width: 100%;
  padding: 10px;
`;

const PhotoTheme = styled.Text`
  font-size: 15px;
  font-weight: 500;
  font-family: 'nanum-bold';
`;

const PhotoAuthor = styled.Text`
  padding: 3px 0px 5px 0px;
  font-family: 'nanum-regular';
  text-align: right;
`;

const PhotoFilesCnt = styled.View`
  padding: 5px 10px;
  position: absolute;
  top: 10px;
  right: 10px;
  border-radius: 5px;
  background-color: ${Colors.main};
  opacity: 0.8;
  justify-content: center;
  align-items: center;
`;

const CountText = styled.Text`
  font-size: 12px;
  font-family: 'nanum-bold';
  color: white;
`;

type PhotoType = {
  author: {
    id: number;
    userName: string;
  };
  familyId: number;
  files: [
    {
      id: number;
      width: number;
      height: number;
      url: string;
      createdAt: string;
      updatedAt: string;
    },
  ];
  filesCount: number;
  id: number;
  theme: string;
  payload: string;
};

export default function PhotoHome({
  navigation,
}: MainTabScreenProps<'PhotoHome'>) {
  // redering function for Flatlist
  const {width} = useWindowDimensions();
  const photoWidth = (width - 20) / 2;

  // for Comments pagination (lazy loading)
  const [queryEnable, setQueryEnable] = useState(true);
  const [prev, setPrev] = useState(0);
  const [photos, setPhotos] = useState<PhotoType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLast, setIsLast] = useState(false);

  const fetchMore = () => {
    setIsLoading(true);
    setQueryEnable(true);
  };

  const {refetch} = useQuery(
    ['FamilyPhotos', prev],
    () => findPhotosFamilyApi(prev),
    {
      onSuccess: ({data}: {data: PhotoType[]}) => {
        if (data.length === 0) {
          setIsLast(true);
        } else {
          setPrev(prev + 1);
          setPhotos([...photos, ...data]);
        }

        setQueryEnable(false);
        setIsLoading(false);
      },
      enabled: queryEnable,
    },
  );

  // console.log(photos.map((photo) => photo.filesCount));

  const renderPhotos = ({item: photo}: {item: PhotoType}) => (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.push('Photo', {
          photoId: photo.id,
        });
      }}>
      <PhotoContainer style={{width: photoWidth}}>
        <FastImage source={{uri: photo.files[0].url}} style={styles.photo} />

        <Bottom>
          <PhotoTheme numberOfLines={1}>{photo.theme}</PhotoTheme>
          <PhotoAuthor numberOfLines={1}>{`from. ${
            authStore.userId === photo.author.id
              ? authStore.userName
              : familyStore.members[photo.author.id] || photo.author.userName
          }`}</PhotoAuthor>
        </Bottom>
        {photo.filesCount > 1 && (
          <PhotoFilesCnt>
            <CountText>{`+${photo.filesCount}`}</CountText>
          </PhotoFilesCnt>
        )}
      </PhotoContainer>
    </TouchableWithoutFeedback>
  );

  /** refresh feed (flatlist) */
  const [isRefreshing, setRefreshing] = useState(false);

  const refresh = async () => {
    setRefreshing(true);

    setPhotos([]);
    setPrev(0);
    setQueryEnable(true);
    setIsLast(false);

    await refetch();

    setRefreshing(false);
  };

  /** refetch when navigated with mutation */
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      if (mutationStore.isMutated) {
        setRefreshing(true);

        setPhotos([]);
        setPrev(0);
        setQueryEnable(true);
        setIsLast(false);
        setIsLoading(true);

        await refetch();

        setRefreshing(false);

        mutationStore.setStatus(false);
      }
    });

    return unsubscribe;
  }, [navigation]);

  const [isRecommend, setRecommend] = useState(true);

  if (photos.length === 0 && !isLast) {
    return (
      <ScreenLayout>
        <ActivityIndicator />
      </ScreenLayout>
    );
  }

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
      {photos.length === 0 && isLast && (
        <ActivityIndicatorWrapper>
          <NoContentText>
            {
              '업로드한 사진이 없습니다\n사진을 공유하여 가족과의 추억을 나눠보세요'
            }
          </NoContentText>
        </ActivityIndicatorWrapper>
      )}

      <Container>
        <FlatList
          data={photos}
          renderItem={renderPhotos}
          numColumns={2}
          onRefresh={refresh}
          refreshing={isRefreshing}
          showsVerticalScrollIndicator={false}
          onEndReached={() => {
            if (!isLast && !isLoading) {
              fetchMore();
            }
          }}
          onEndReachedThreshold={0.01}
          scrollEnabled={!isLoading}
          contentContainerStyle={{minHeight: '100%'}}
        />
        {isLoading && (
          <ActivityIndicatorWrapper>
            <ActivityIndicator />
          </ActivityIndicatorWrapper>
        )}
      </Container>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  photo: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 10,
    borderColor: Colors.borderLight,
    borderWidth: 1,
  },
});
