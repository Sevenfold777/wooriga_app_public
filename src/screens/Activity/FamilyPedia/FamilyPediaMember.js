import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  DeviceEventEmitter,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { Image } from "react-native";
import styled from "styled-components/native";
import ScreenLayout from "../../../components/ScreenLayout";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createRowsApi,
  deleteRowsApi,
  editFamilyPediaApi,
  editRowsApi,
  findFamilyPediaApi,
} from "../../../api/FamilyPediaApi";
import { Controller, useForm } from "react-hook-form";
import { useHeaderHeight } from "@react-navigation/elements";
import FastImage from "react-native-fast-image";
import { Colors } from "../../../Config";
import { ROUTE_NAME } from "../../../Strings";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  margin: 0px 10px;

  border: 1px solid ${Colors.borderLight};
`;

const Header = styled.Text`
  font-family: "nanum-bold";
  font-size: 22px;
  padding: 5px 15px;
  margin: 0px 10px;
`;

const ImageContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;

  border-bottom-width: 1px;
  border-bottom-color: ${Colors.borderLight};
`;

const ProfileContainer = styled.View`
  min-height: 45px;
  flex-direction: row;
  border-bottom-width: 1px;
  border-bottom-color: ${Colors.borderLight};
`;

const ProfileTagContainer = styled.View`
  justify-content: center;
  align-items: center;
  width: 100px;
  background-color: ${Colors.main};
  padding: 2px 3px;
`;

const ProfileTag = styled.Text`
  text-align: center;
  font-family: "nanum-bold";
  padding: 0px 3px;
`;

const ProfileTagInput = styled.TextInput`
  text-align: center;
  font-family: "nanum-bold";
  width: 100%;
  padding: 0px 3px;
`;

const ProfilePayloadContainer = styled.View`
  justify-content: center;
  flex: 1;
  padding: 2px 15px;
`;

const ProfilePayload = styled.Text`
  font-family: "nanum-regular";
  padding: 0;
`;

const ProfileInput = styled.TextInput`
  font-family: "nanum-regular";
  padding: 0;
`;

const AddButton = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  background-color: ${Colors.main};
  padding: 10px;
  border-radius: 5px;
  margin: 10px;
`;

const AddButtonText = styled.Text`
  padding: 5px;
  font-family: "nanum-bold";
`;

const UploadingText = styled.Text`
  padding: 15px;
  font-family: "nanum-regular";
  text-align: center;
`;

export default function FamilyPediaMember({ navigation, route: { params } }) {
  const { width: pageWidth } = useWindowDimensions();

  const [rows, setRows] = useState([]);
  const [newRows, addNewRow] = useState([]);
  const [isModify, setModify] = useState(false);
  const [rowsToDelete, setRowsToDelete] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState(); // (uri)
  const [isPhotoModified, setPhotoModified] = useState(false);
  const [photoToUpload, setPhotoToUpload] = useState(); // photo to upload (asset)

  const headerHeight = useHeaderHeight();

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    reset,
    watch,
    formState: { dirtyFields, isDirty },
  } = useForm();

  // handling state for delete rows
  useEffect(() => {
    rows.forEach((row) => setValue(`o_${row.id}`, row.payload));
  }, [rows]);

  // handling state for delete NEW rows
  useEffect(() => {
    newRows.forEach((row, index) => {
      setValue(`ntag_${index}`, row.tag);
      setValue(`npayload_${index}`, row.payload);
    });
  }, [newRows]);

  const {
    data: pedia,
    isLoading,
    refetch,
  } = useQuery(
    ["pedia", params.pediaId],
    () => findFamilyPediaApi(params.pediaId),
    {
      onSuccess: ({ data }) => {
        setRows(data.rows);
        setProfilePhoto(data.profilePhoto);
      },
    }
  );

  const createRows = useMutation(createRowsApi, {
    onSuccess: async () => {
      // await refetch();
      // clear
      reset();
      addNewRow([]);
    },
  });

  const editRows = useMutation(editRowsApi, {
    onSuccess: () => {
      reset();
    },
  });

  const deleteRows = useMutation(deleteRowsApi);

  // edit profile Photo
  const editFamilyPedia = useMutation(editFamilyPediaApi, {
    onSuccess: (data) => {
      const newPhoto = data?.data.profilePhoto;

      DeviceEventEmitter.emit("PhotoEditted", {
        pediaId: params?.pediaId,
        newUrl: newPhoto,
      });

      setProfilePhoto(newPhoto);
    },
  });

  const onValid = (data) => {
    if (isModify) {
      const rawInputs = data;
      const modifiedKeys = Object.keys(dirtyFields);

      const newRows = [];
      const modifiedRows = [];

      let newRowsCnt = 0;

      // console.log(rawInputs);
      // 1. old rows to edit
      for (let i = 0; i < modifiedKeys.length; i++) {
        if (modifiedKeys[i].slice(0, 2) === "o_") {
          modifiedRows.push({
            id: parseInt(modifiedKeys[i].slice(2)),
            payload: data[modifiedKeys[i]],
          });
        } else {
          newRowsCnt++;
        }
      }

      newRowsCnt /= 2;

      // 2. for new rows (POST)
      for (let i = 0; i < newRowsCnt; i++) {
        if (!rawInputs[`ntag_${i}`]) continue;

        newRows.push({
          tag: rawInputs[`ntag_${i}`],
          payload: rawInputs[`npayload_${i}`],
        });
      }

      // console.log(newRows, modifiedRows);

      if (newRows.length !== 0) {
        createRows.mutate({ id: params.pediaId, rows: newRows });
        setRows([...rows, ...newRows]);
      }

      if (modifiedRows.length !== 0) {
        editRows.mutate({ id: params.pediaId, rows: modifiedRows });
      }

      // 3. Delete Rows
      if (rowsToDelete.length !== 0) {
        deleteRows.mutate({ id: params.pediaId, rows: rowsToDelete });
      }

      // 4. photo seleceted
      if (isPhotoModified) {
        editFamilyPedia.mutate({
          id: params.pediaId,
          profilePhoto: [photoToUpload],
        });
      }
    }

    setModify(!isModify);
  };

  const HeaderRight = () => (
    <TouchableOpacity
      style={{
        backgroundColor: Colors.main,
        padding: 8,
        borderRadius: 5,
        marginRight: 15,
      }}
      onPress={handleSubmit(onValid)}
    >
      <Text style={{ color: "white", fontFamily: "nanum-regular" }}>
        {isModify ? "완료" : "편집"}
      </Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    navigation.setOptions({ headerRight: HeaderRight });
  }, [isModify, dirtyFields, rowsToDelete, profilePhoto, photoToUpload]);

  /** Profile List component */
  const ProfileList = ({ tag, payload }) => {
    return (
      <ProfileContainer>
        <ProfileTagContainer>
          <ProfileTag>{tag}</ProfileTag>
        </ProfileTagContainer>
        <ProfilePayloadContainer>
          <ProfilePayload>{payload}</ProfilePayload>
        </ProfilePayloadContainer>
      </ProfileContainer>
    );
  };

  useEffect(() => {
    const photoSubscription = DeviceEventEmitter.addListener(
      "PhotoSelected",

      ({ newPhoto }) => {
        setPhotoToUpload(newPhoto);
        setProfilePhoto(newPhoto.uri);
        setPhotoModified(true);
      }
    );

    return () => photoSubscription.remove();
  }, []);

  if (isLoading) {
    return (
      <ScreenLayout>
        <ActivityIndicator />
      </ScreenLayout>
    );
  }

  if (editFamilyPedia.isLoading) {
    return (
      <ScreenLayout>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 80,
          }}
        >
          <ActivityIndicator
            style={{ alignItems: "center", justifyContent: "center" }}
          />
          <UploadingText>
            {"인물사전을 업데이트 중입니다\n잠시만 기다려주세요"}
          </UploadingText>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={headerHeight}
        style={{
          flex: 1,
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <Header>{pedia?.data.owner.userName}</Header>
          <Container>
            {/** image */}
            <ImageContainer
              style={{
                width: pageWidth - 20,
                height:
                  ((pageWidth - 20) * pedia.data.profileHeight) /
                  pedia.data.profileWidth,
              }}
            >
              <Image
                source={{ uri: profilePhoto }}
                style={{ flex: 1, width: pageWidth - 20 }}
                resizeMode="contain"
              />
              {isModify && (
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    top: 5,
                    right: 5,
                    padding: 10,
                    backgroundColor: Colors.main,
                    borderRadius: 30,
                  }}
                  onPress={() =>
                    navigation.navigate(ROUTE_NAME.FAMILYPEDIA_SELECTPHOTO, {
                      id: params.pediaId,
                    })
                  }
                >
                  <Ionicons name="add" size={22} color="white" />
                </TouchableOpacity>
              )}
            </ImageContainer>
            {/** list of profile elements */}
            <ProfileList tag={"이름"} payload={pedia.data.owner.userName} />
            {isModify
              ? rows.map((row, index) => (
                  <ProfileContainer key={index}>
                    <ProfileTagContainer>
                      <ProfileTag>{row.tag}</ProfileTag>
                    </ProfileTagContainer>
                    <ProfilePayloadContainer>
                      <Controller
                        control={control}
                        name={`o_${row.id}`}
                        render={({ field: { onChange, value } }) => (
                          <ProfileInput
                            onChangeText={(e) => {
                              onChange(e);
                              let changedRow = row;
                              changedRow.payload = e;

                              setRows([
                                ...rows.slice(0, index),
                                changedRow,
                                ...rows.slice(index + 1),
                              ]);
                            }}
                            value={value}
                            multiline={true}
                          />
                        )}
                        defaultValue={row.payload}
                      />
                    </ProfilePayloadContainer>
                    <TouchableOpacity
                      style={{
                        position: "absolute",
                        right: 5,
                        top: 10,
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        borderRadius: 10,
                      }}
                      onPress={() => {
                        setRows([
                          ...rows.slice(0, index),
                          ...rows.slice(index + 1),
                        ]);

                        setRowsToDelete([...rowsToDelete, { id: row.id }]);
                      }}
                    >
                      <Ionicons name="close" color="white" />
                    </TouchableOpacity>
                  </ProfileContainer>
                ))
              : rows.map((row, index) => (
                  <ProfileList
                    key={index}
                    tag={row.tag}
                    payload={row.payload}
                  />
                ))}

            {isModify &&
              newRows.map((row, index) => (
                <ProfileContainer key={index}>
                  <ProfileTagContainer>
                    <Controller
                      control={control}
                      name={`ntag_${index}`}
                      render={({ field: { onChange, value } }) => (
                        <ProfileTagInput
                          multiline={true}
                          onChangeText={(e) => {
                            onChange(e);
                            let changedRow = row;
                            changedRow.tag = e;

                            addNewRow([
                              ...newRows.slice(0, index),
                              changedRow,
                              ...newRows.slice(index + 1),
                            ]);
                          }}
                          value={value}
                          textAlignVertical="top"
                        />
                      )}
                    />
                  </ProfileTagContainer>
                  <ProfilePayloadContainer key={index}>
                    {/* {payloads?.map((payload, index) => ( */}
                    <Controller
                      control={control}
                      name={`npayload_${index}`}
                      render={({ field: { onChange, value } }) => (
                        <ProfileInput
                          onChangeText={(e) => {
                            onChange(e);
                            let changedRow = row;
                            changedRow.payload = e;

                            addNewRow([
                              ...newRows.slice(0, index),
                              changedRow,
                              ...newRows.slice(index + 1),
                            ]);
                          }}
                          value={value}
                          placeholder="내용을 입력하세요"
                          multiline={true}
                        />
                      )}
                    />
                  </ProfilePayloadContainer>

                  <TouchableOpacity
                    style={{
                      position: "absolute",
                      right: 5,
                      top: 10,
                      backgroundColor: "rgba(0, 0, 0, 0.6)",
                      borderRadius: 10,
                    }}
                    onPress={() => {
                      addNewRow([
                        ...newRows.slice(0, index),
                        ...newRows.slice(index + 1),
                      ]);
                    }}
                  >
                    <Ionicons name="close" color="white" />
                  </TouchableOpacity>
                </ProfileContainer>
              ))}
          </Container>

          {isModify && (
            <AddButton
              onPress={() => {
                addNewRow([...newRows, { tag: "", payloads: "" }]); // react hook form과 연계해야...
              }}
            >
              <AddButtonText>태그 추가</AddButtonText>
            </AddButton>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
      {/* </KeyboardAvoidingView> */}
    </ScreenLayout>
  );
}
