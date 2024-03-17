import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from "react-native";
import styled from "styled-components/native";
import { findMyPhotosApi, findPhotosFamilyApi } from "../../api/PhotosApi";
import ScreenLayout, {
  ActivityIndicatorWrapper,
} from "../../components/ScreenLayout";
import mutationStore from "../../stores/MutationStore";
import familyStore from "../../stores/FamilyStore";
import FastImage from "react-native-fast-image";
import authStore from "../../stores/AuthStore";
import NoContent from "../../components/NoContent";
import { ROUTE_NAME } from "../../Strings";
import { Colors } from "../../Config";

const Container = styled.View`
  flex: 1;
  width: 100%;
  padding: 10px;
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
  font-family: "nanum-bold";
  //padding-bottom: 5px;
`;

const PhotoAuthor = styled.Text`
  padding: 3px 0px 5px 0px;
  font-family: "nanum-regular";
  text-align: right;
  /* padding: 5px 10px; */
`;

const PhotoPayload = styled.Text`
  padding: 5px 0px;
  font-family: "nanum-regular";
  font-size: 16px;
`;

const PhotoThumbnail = styled.Image`
  width: 100%;
  aspect-ratio: ${3 / 4};
  border-radius: 10px;
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
  font-family: "nanum-bold";
  color: white;
`;

export default function PhotosMy({ navigation, route: { params, name } }) {
  // for Comments pagination (lazy loading)
  const [queryEnable, setQueryEnable] = useState(true);
  const [prev, setPrev] = useState(0);
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLast, setIsLast] = useState(false);

  const fetchMore = () => {
    setIsLoading(true);
    setQueryEnable(true);
  };

  const {
    data,
    refetch,
    // isLoading,
  } = useQuery(["MyPhotos", prev], () => findMyPhotosApi(prev), {
    onSuccess: ({ data }) => {
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
  });

  // redering function for Flatlist
  const { width } = useWindowDimensions();
  const photoWidth = (width - 20) / 2;

  const renderPhotos = ({ item: photo }) => (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.navigate(ROUTE_NAME.PHOTO, {
          photoId: photo.id,
        });
      }}
    >
      <PhotoContainer style={{ width: photoWidth }}>
        <FastImage
          source={{ uri: photo.files[0].url }}
          style={{
            width: "100%",
            aspectRatio: 3 / 4,
            borderRadius: 10,
            borderColor: Colors.borderLight,
            borderWidth: 1,
          }}
        />

        <Bottom>
          <PhotoTheme>{photo.theme}</PhotoTheme>
          <PhotoAuthor>{`from. ${
            familyStore.members[photo?.author?.id] ||
            photo?.author?.userName ||
            authStore.userName
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
    const unsubscribe = navigation.addListener("focus", async () => {
      //console.log(mutationStore.isMutated);
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

  const memoized = useMemo(() => renderPhotos, [photos]);

  if (photos.length === 0) {
    if (isLast) {
      return (
        <ScreenLayout>
          <NoContent
            payload={
              "업로드한 사진이 없습니다.\n사진을 공유하여 가족과의 추억을 나눠보세요."
            }
          />
        </ScreenLayout>
      );
    } else {
      return (
        <ScreenLayout>
          <ActivityIndicator />
        </ScreenLayout>
      );
    }
  }

  return (
    <ScreenLayout>
      <Container>
        <FlatList
          data={photos}
          renderItem={memoized}
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
