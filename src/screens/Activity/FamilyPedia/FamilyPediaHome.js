import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  DeviceEventEmitter,
  FlatList,
  useWindowDimensions,
} from "react-native";
import FastImage from "react-native-fast-image";
import styled from "styled-components/native";
import { findAllFamilyPediaApi } from "../../../api/FamilyPediaApi";
import ScreenLayout from "../../../components/ScreenLayout";
import { Colors } from "../../../Config";
import authStore from "../../../stores/AuthStore";
import familyStore from "../../../stores/FamilyStore";
import { ROUTE_NAME } from "../../../Strings";

const FamilyContainer = styled.View`
  padding: 0px 10px;
`;

const MemberContainer = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  padding: 0px 10px;
  border: 1px solid ${Colors.borderLight};
  border-radius: 5px;
  aspect-ratio: ${3 / 4};
  margin: 5px;
`;

const MemeberName = styled.Text`
  font-family: "nanum-bold";
  font-size: 16px;
  padding: 10px;
  background-color: ${Colors.sub};
  text-align: center;
`;

const MemberImageWrapper = styled.View`
  flex: 1;
`;

const MemberImage = styled.Image`
  flex: 1;
`;

export default function FamilyPediaHome({ navigation }) {
  const { width: pageWidth } = useWindowDimensions();
  const boxWidth = (pageWidth - 40) / 2;

  const [profilePhotos, setProfilePhotos] = useState([]);

  const me = {};
  me[authStore.userId] = authStore.userName;
  const family = { ...me, ...familyStore.members };

  const { data: pediaLists, isLoading } = useQuery(
    ["familyPediaLists"],
    findAllFamilyPediaApi,
    {
      onSuccess: (data) => {
        setProfilePhotos(
          data.data.map((pedia) => {
            return { id: pedia.id, url: pedia.profilePhoto };
          })
        );
      },
    }
  );

  const renderMembers = ({ item: pedia }) => {
    return (
      <MemberContainer
        onPress={() =>
          navigation.navigate(ROUTE_NAME.FAMILYPEDIA_MEMBER, {
            pediaId: pedia.id,
          })
        }
        style={{ width: boxWidth }}
      >
        <MemberImageWrapper>
          <FastImage
            source={{
              uri: profilePhotos.find((photo) => photo.id === pedia.id).url,
            }}
            resizeMode="contain"
            style={{ flex: 1, width: boxWidth - 2 }}
          />
        </MemberImageWrapper>
        <MemeberName style={{ width: boxWidth }}>
          {family[pedia.owner.id] || pedia.owner.userName}
        </MemeberName>
      </MemberContainer>
    );
  };

  useEffect(() => {
    const photoSubscription = DeviceEventEmitter.addListener(
      "PhotoEditted",
      ({ pediaId, newUrl }) => {
        setProfilePhotos(
          profilePhotos.map((photo) =>
            photo.id === pediaId ? { id: photo.id, url: newUrl } : photo
          )
        );
      }
    );

    return () => photoSubscription.remove();
  }, [profilePhotos]);

  if (isLoading || profilePhotos.length === 0) {
    return (
      <ScreenLayout>
        <ActivityIndicator />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <FamilyContainer>
        <FlatList
          data={pediaLists?.data}
          renderItem={renderMembers}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ minHeight: "100%" }}
        />
      </FamilyContainer>
    </ScreenLayout>
  );
}
